'use client';

import React from 'react';

interface ZavianLogoProps {
  showTagline?: boolean;
  withTagline?: boolean;
  showWordmark?: boolean;
  withWordmark?: boolean;
  wordmarkWhite?: string;
  wordmarkCrimson?: string;
  wordmark1Color?: string;
  wordmark2Color?: string;
  tagline?: string;
  logoMode?: 'default' | 'image' | 'svg';
  logoImageUrl?: string;
  logoSvgContent?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ZavianLogo({
  showTagline = true,
  withTagline,
  showWordmark = true,
  withWordmark,
  wordmarkWhite,
  wordmarkCrimson,
  wordmark1Color,
  wordmark2Color,
  tagline,
  logoMode = 'default',
  logoImageUrl,
  logoSvgContent,
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
      {/* Precision Geometric / Image / SVG Badge */}
      <div
        style={{
          width: size === 'lg' ? 56 : size === 'sm' ? 36 : 44,
          height: size === 'lg' ? 56 : size === 'sm' ? 36 : 44,
        }}
        className={`relative flex items-center justify-center ${sizeClasses[size]} bg-gradient-to-br from-[var(--theme-primary,#dc2626)] via-[#801010] to-[#200406] border border-[var(--theme-primary,#dc2626)]/40 shadow-[0_0_22px_var(--theme-glow,rgba(220,38,38,0.35))] shrink-0 group overflow-hidden`}
      >
        {logoMode === 'image' && logoImageUrl ? (
          <img
            src={logoImageUrl}
            alt="Brand Logo"
            className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
          />
        ) : logoMode === 'svg' && logoSvgContent ? (
          <div
            className={`${svgSizes[size]} text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 [&>svg]:w-full [&>svg]:h-full`}
            dangerouslySetInnerHTML={{ __html: logoSvgContent }}
          />
        ) : (
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={size === 'lg' ? 28 : size === 'sm' ? 20 : 24}
            height={size === 'lg' ? 28 : size === 'sm' ? 20 : 24}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            className={`${svgSizes[size]} text-white transition-transform duration-300 group-hover:scale-110`}
          >
            {/* Architectural Cut Geometric 'Z' with Central Cyber Notch */}
            <path
              d="M6 7.5H25.5L13.5 19.5H26V24.5H6.5L18.5 12.5H6V7.5Z"
              fill="currentColor"
            />
            {/* Optical Pulse Dot */}
            <circle cx="24" cy="9.5" r="1.75" fill="var(--theme-title-accent, #EF4444)" />
          </svg>
        )}
        <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity blur-sm pointer-events-none" />
      </div>

      {/* Brand Identity Wordmark */}
      {effectiveShowWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className="text-lg sm:text-xl font-extrabold tracking-tight font-display text-zinc-100 dark:text-zinc-100 light:text-zinc-950"
              style={wordmark1Color ? { color: wordmark1Color } : undefined}
            >
              {wordmarkWhite || 'ZAVIAN'}
            </span>
            <span
              className="text-lg sm:text-xl font-extrabold tracking-tight font-display"
              style={{ color: wordmark2Color || 'var(--theme-primary, #dc2626)' }}
            >
              {wordmarkCrimson || 'LABS'}
            </span>
          </div>
          {effectiveShowTagline && (
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-400 mt-1 font-semibold">
              {tagline || 'AI AUTOMATION & SOFTWARE STUDIO'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
