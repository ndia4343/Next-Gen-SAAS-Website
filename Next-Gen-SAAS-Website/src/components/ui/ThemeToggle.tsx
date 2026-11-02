'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { mode, toggleMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? mode === 'dark' : true;

  return (
    <button
      onClick={toggleMode}
      type="button"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary,#dc2626)]/40 ${
        isDark
          ? 'bg-white/10 hover:bg-white/15 border border-white/15 text-amber-300 shadow-lg shadow-black/20 hover:scale-105 active:scale-95'
          : 'bg-black/5 hover:bg-black/10 border border-black/10 text-zinc-800 shadow-md shadow-zinc-300/40 hover:scale-105 active:scale-95'
      } ${className}`}
    >
      {/* Sun Icon (Rotates and scales smoothly into view in Light Mode) */}
      <svg
        className={`w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark
            ? 'rotate-90 scale-0 opacity-0 absolute pointer-events-none'
            : 'rotate-0 scale-100 opacity-100 text-amber-500'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.25" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>

      {/* Moon Icon (Rotates and scales smoothly into view in Dark Mode) */}
      <svg
        className={`w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          !isDark
            ? '-rotate-90 scale-0 opacity-0 absolute pointer-events-none'
            : 'rotate-0 scale-100 opacity-100 text-amber-300'
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          fill="currentColor"
          fillOpacity="0.25"
        />
        {/* Subtle celestial sparkle accent */}
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" className="animate-pulse" />
      </svg>
    </button>
  );
}
