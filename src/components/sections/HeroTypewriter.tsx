'use client';

import { useState, useEffect } from 'react';

const capabilities = [
  'Business Intelligence Dashboards',
  'AI Voice Agents',
  'WhatsApp Automation',
  'Custom Software Solutions'
];

export function HeroTypewriter() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Technical fix: Stop exactly at string length (no extra blank index)
    if (subIndex === capabilities[index].length && !isDeleting) {
      const holdTimeout = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(holdTimeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % capabilities.length);
      return;
    }

    const typingSpeed = isDeleting ? 35 : 75;
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, prefersReducedMotion]);

  // Reduced motion fallback: Clean static display
  if (prefersReducedMotion) {
    return (
      <div className="flex items-center justify-center gap-2 font-mono text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-6 tracking-wide">
        <span className="text-neutral-400 dark:text-neutral-500">We build</span>
        <span className="text-violet-700 dark:text-cyan-400 font-medium">
          Autonomous Systems & AI Infrastructure
        </span>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center justify-center gap-2 font-mono text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-6 tracking-wide"
      aria-live="off"
    >
      {/* Screen reader static label to prevent character-by-character announcements */}
      <span className="sr-only">
        We build: {capabilities[index]}
      </span>

      <span className="text-neutral-400 dark:text-neutral-500 select-none">We build</span>

      {/* Reserved height and inline container prevents layout shifts and awkward mobile wrapping */}
      <span 
        aria-hidden="true"
        className="inline-flex items-center text-violet-700 dark:text-cyan-400 font-medium min-h-[1.5rem] tracking-tight sm:tracking-normal"
      >
        <span>{capabilities[index].substring(0, subIndex)}</span>
        <span className="inline-block w-1.5 h-3.5 sm:h-4 ml-1 bg-violet-600 dark:bg-cyan-400 animate-pulse" />
      </span>
    </div>
  );
}
