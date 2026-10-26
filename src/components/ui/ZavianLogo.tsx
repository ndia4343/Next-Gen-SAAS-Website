'use client';

import React from 'react';

interface ZavianLogoProps {
  showTagline?: boolean;
  withTagline?: boolean;
  showWordmark?: boolean;
  withWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ZavianLogo({
  showTagline = true,
  withTagline,
  showWordmark = true,
  withWordmark,
  size = 'md',
  className = '',
}: ZavianLogoProps) {
  const effectiveShowTagline = withTagline !== undefined ? withTagline : showTagline;
  const effectiveShowWordmark = withWordmark !== undefined ? withWordmark : showWordmark;

  const sizeClasses = {
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  const svgSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Precision Geometric SVG Badge */}
      <div
        className={`relative flex items-center justify-center ${sizeClasses[size]} bg-gradient-to-br from-red-600 via-red-700 to-red-950 border border-red-500/40 shadow-[0_0_22px_rgba(220,38,38,0.35)] shrink-0 group`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${svgSizes[size]} text-white transition-transform duration-300 group-hover:scale-110`}
        >
          {/* Architectural Cut Geometric 'Z' with Central Cyber Notch */}
          <path
            d="M6 7.5H25.5L13.5 19.5H26V24.5H6.5L18.5 12.5H6V7.5Z"
            fill="currentColor"
          />
          {/* Optical Pulse Dot */}
          <circle cx="24" cy="9.5" r="1.75" fill="#EF4444" />
        </svg>
        <div className="absolute inset-0 rounded-xl bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-sm pointer-events-none" />
      </div>

      {/* Brand Identity Wordmark */}
      {effectiveShowWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-display">
              ZAVIAN
            </span>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-red-600 font-display">
              LABS
            </span>
          </div>
          {effectiveShowTagline && (
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-400 mt-1 font-semibold">
              AI Automation &amp; Software Studio
            </span>
          )}
        </div>
      )}
    </div>
  );
}
