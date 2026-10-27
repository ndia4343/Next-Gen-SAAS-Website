'use client';

import React from 'react';
import Link from 'next/link';

export interface LogoProps {
  className?: string;
  showTagline?: boolean;
  withTagline?: boolean;
  href?: string;
  wordmarkWhite?: string;
  wordmarkCrimson?: string;
  wordmark1Color?: string;
  wordmark2Color?: string;
  tagline?: string;
  logoMode?: 'default' | 'image' | 'svg';
  logoImageUrl?: string;
  logoSvgContent?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({
  className = '',
  showTagline = true,
  withTagline,
  href = '/',
  wordmarkWhite,
  wordmarkCrimson,
  wordmark1Color,
  wordmark2Color,
  tagline,
  logoMode = 'default',
  logoImageUrl,
  logoSvgContent,
}: LogoProps) {
  const effectiveShowTagline = withTagline !== undefined ? withTagline : showTagline;

  const content = (
    <div
      aria-label="ZAVIAN LABS Home"
      className={`group flex flex-row flex-nowrap items-center justify-start gap-2 sm:gap-3 md:gap-3.5 pointer-events-auto select-none w-auto overflow-hidden ${className}`}
    >
      {/* 1. Brand Wordmark & Tagline (Left Side) */}
      <div className="flex flex-col text-left justify-center leading-none">
        <div className="flex items-center gap-1 sm:gap-1.5 flex-row flex-nowrap">
          <span
            className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight md:tracking-tighter text-zinc-950 dark:text-white transition-colors font-sans"
            style={
              wordmark1Color &&
              wordmark1Color.toLowerCase() !== '#ffffff' &&
              wordmark1Color.toLowerCase() !== '#fff'
                ? { color: wordmark1Color }
                : undefined
            }
          >
            {wordmarkWhite || 'ZAVIAN'}
          </span>
          <span
            className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight md:tracking-tighter text-red-600 dark:text-red-500 transition-colors font-sans"
            style={
              wordmark2Color &&
              wordmark2Color.toLowerCase() !== '#dc2626'
                ? { color: wordmark2Color }
                : undefined
            }
          >
            {wordmarkCrimson || 'LABS'}
          </span>
        </div>
        {effectiveShowTagline && (
          <span className="text-[7.5px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.15em] sm:tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400 mt-1 sm:mt-1.5 font-medium transition-colors max-w-[130px] sm:max-w-none truncate leading-[1.2]">
            {tagline || 'AI AUTOMATION & SOFTWARE STUDIO'}
          </span>
        )}
      </div>

      {/* 2. 3D Isometric Interlocking Cube Icon (Right Side) */}
      <div className="relative w-7 h-7 sm:w-8.5 sm:h-8.5 md:w-10 md:h-10 lg:w-11 lg:h-11 shrink-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-[1.04] group-hover:rotate-[2deg]">
        {(logoMode === 'image' || (logoMode !== 'svg' && logoImageUrl)) && logoImageUrl ? (
          <img
            src={logoImageUrl}
            alt="Brand Logo"
            className="w-full h-full object-contain p-0.5"
          />
        ) : logoMode === 'svg' && logoSvgContent ? (
          <div
            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: logoSvgContent }}
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              {/* Dark Mode Platinum Chrome Gradient */}
              <linearGradient id="cubeGradientDarkRight" x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>

              {/* Light Mode Gunmetal Titanium Gradient */}
              <linearGradient id="cubeGradientLightRight" x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              {/* Ambient Shadow Depth overlay */}
              <linearGradient id="facetShadeRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Isometric Cube Structure */}
            <g
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-[url(#cubeGradientLightRight)] dark:stroke-[url(#cubeGradientDarkRight)] drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
            >
              {/* Outer Hexagonal Silhouette */}
              <path d="M50 8 L86 29 L86 71 L50 92 L14 71 L14 29 Z" />

              {/* Internal Isometric Facet Lines */}
              <path d="M50 8 L50 50 L86 71" />
              <path d="M14 29 L50 50 L14 71" />
              <path d="M50 50 L86 29" />
              <path d="M32 39.5 L68 60.5" strokeWidth="4" strokeDasharray="2 3" opacity="0.4" />
            </g>

            {/* Top Facet Reflective Light Fill */}
            <polygon
              points="50,8 86,29 50,50 14,29"
              fill="url(#facetShadeRight)"
              className="text-zinc-900 dark:text-white"
            />
          </svg>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
