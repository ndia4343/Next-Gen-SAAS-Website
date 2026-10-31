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
      <div className="flex items-center justify-center mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100/90 dark:bg-neutral-900/80 border border-neutral-300/80 dark:border-neutral-800 backdrop-blur-md shadow-sm">
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-neutral-950 dark:text-neutral-300">
            We build
          </span>
          <span className="text-xs sm:text-sm font-bold tracking-tight text-sky-600 dark:text-cyan-400 min-h-[1.25rem] flex items-center">
            Autonomous Systems & AI Infrastructure
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center mt-6" aria-live="off">
      {/* Screen reader static label to prevent character-by-character announcements */}
      <span className="sr-only">We build: {capabilities[index]}</span>

      <div 
        aria-hidden="true"
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100/90 dark:bg-neutral-900/80 border border-neutral-300/80 dark:border-neutral-800 backdrop-blur-md shadow-sm"
      >
        {/* Static Prefix: Solid Black in Light Mode, Silver-White in Dark Mode */}
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-neutral-950 dark:text-neutral-300 select-none">
          We build
        </span>

        {/* Dynamic Animation: Deep Electric Blue in Light Mode, Vibrant Cyan in Dark Mode */}
        <span className="text-xs sm:text-sm font-bold tracking-tight text-sky-600 dark:text-cyan-400 min-h-[1.25rem] flex items-center">
          {capabilities[index].slice(0, subIndex)}
          <span className="inline-block w-1.5 h-3.5 ml-1 bg-sky-600 dark:bg-cyan-400 animate-pulse" />
        </span>
      </div>
    </div>
  );
}
