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
      <div className="relative z-10 mt-7 sm:mt-8 flex justify-center w-full px-4" aria-live="off">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-neutral-100/95 dark:bg-neutral-900/90 border border-neutral-300 dark:border-neutral-800 shadow-md backdrop-blur-md">
          <span className="text-sm sm:text-base font-bold tracking-wide text-neutral-950 dark:text-neutral-200 select-none">
            We build
          </span>
          <span className="text-sm sm:text-base font-bold tracking-tight text-blue-600 dark:text-cyan-400 min-h-[1.5rem] flex items-center whitespace-nowrap">
            Autonomous Systems & AI Infrastructure
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 mt-7 sm:mt-8 flex justify-center w-full px-4" aria-live="off">
      <span className="sr-only">We build {capabilities[index]}</span>

      <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-neutral-100/95 dark:bg-neutral-900/90 border border-neutral-300 dark:border-neutral-800 shadow-md backdrop-blur-md">
        <span className="text-sm sm:text-base font-bold tracking-wide text-neutral-950 dark:text-neutral-200 select-none">
          We build
        </span>
        <span 
          aria-hidden="true" 
          className="text-sm sm:text-base font-bold tracking-tight text-blue-600 dark:text-cyan-400 min-h-[1.5rem] flex items-center whitespace-nowrap"
        >
          <span>{capabilities[index].substring(0, subIndex)}</span>
          <span className="inline-block w-2 h-4 ml-1 bg-blue-600 dark:bg-cyan-400 animate-pulse flex-shrink-0" />
        </span>
      </div>
    </div>
  );
}
