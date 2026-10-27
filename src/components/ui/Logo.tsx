"use client";

import React from "react";
import Link from "next/link";

export interface LogoProps {
  className?: string;
  showTagline?: boolean;
  withTagline?: boolean;
  iconPosition?: "left" | "right";
  useFuturisticGlyphs?: boolean;
  href?: string;
  wordmarkWhite?: string;
  wordmarkCrimson?: string;
  wordmark1Color?: string;
  wordmark2Color?: string;
  tagline?: string;
  logoMode?: "default" | "image" | "svg";
  logoImageUrl?: string;
  logoSvgContent?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({
  className = "",
  showTagline = true,
  withTagline,
  iconPosition = "right",
  useFuturisticGlyphs = true,
  href = "/",
  wordmarkWhite,
  wordmarkCrimson,
  wordmark1Color,
  wordmark2Color,
  tagline,
  logoMode = "default",
  logoImageUrl,
  logoSvgContent,
}: LogoProps) {
  const effectiveShowTagline = withTagline !== undefined ? withTagline : showTagline;

  const rawWordmark1 = wordmarkWhite || "ZAVIAN";
  const displayWordmark1 = useFuturisticGlyphs
    ? rawWordmark1.replace(/A/g, "Λ")
    : rawWordmark1;
  const displayWordmark2 = wordmarkCrimson || "LABS";

  // 1. 3D Isometric Interlocking Cube Icon
  const CubeIcon = (
    <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105 group-hover:rotate-2">
      {(logoMode === "image" || (logoMode !== "svg" && logoImageUrl)) && logoImageUrl ? (
        <img
          src={logoImageUrl}
          alt="Brand Logo"
          className="w-full h-full object-contain p-0.5"
        />
      ) : logoMode === "svg" && logoSvgContent ? (
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
            <linearGradient id="cubeGradientDark" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="cubeGradientLight" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="facetHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Isometric Dual Cube Facets with Thicker 5px Stroke */}
          <g
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-[url(#cubeGradientLight)] dark:stroke-[url(#cubeGradientDark)] drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
          >
            <path d="M50 8 L86 29 L86 71 L50 92 L14 71 L14 29 Z" />
            <path d="M50 8 L50 50 L86 71" />
            <path d="M14 29 L50 50 L14 71" />
            <path d="M50 50 L86 29" />
            <path d="M32 39.5 L68 60.5" strokeWidth="3.5" strokeDasharray="2 3" opacity="0.45" />
          </g>

          <polygon
            points="50,8 86,29 50,50 14,29"
            fill="url(#facetHighlight)"
            className="text-zinc-900 dark:text-white"
          />
        </svg>
      )}
    </div>
  );

  // 2. Typography Wordmark
  const BrandText = (
    <div className="flex flex-col text-left justify-center leading-none">
      <div className="flex items-center gap-1.5 flex-row flex-nowrap">
        <span
          className="font-bold text-base sm:text-lg md:text-xl tracking-[0.16em] text-zinc-950 dark:text-white transition-colors font-sans"
          style={
            wordmark1Color &&
            wordmark1Color.toLowerCase() !== "#ffffff" &&
            wordmark1Color.toLowerCase() !== "#fff"
              ? { color: wordmark1Color }
              : undefined
          }
        >
          {displayWordmark1}
        </span>
        <span
          className="font-bold text-base sm:text-lg md:text-xl tracking-[0.16em] text-red-600 dark:text-red-500 transition-colors font-sans"
          style={
            wordmark2Color &&
            wordmark2Color.toLowerCase() !== "#dc2626"
              ? { color: wordmark2Color }
              : undefined
          }
        >
          {displayWordmark2}
        </span>
      </div>
      {effectiveShowTagline && (
        <span className="text-[8.5px] sm:text-[9.5px] font-mono tracking-[0.22em] uppercase text-zinc-500 dark:text-zinc-400 mt-1 font-medium transition-colors truncate">
          {tagline || "AI AUTOMATION & SOFTWARE STUDIO"}
        </span>
      )}
    </div>
  );

  const innerContent = (
    <div
      aria-label="ZAVIAN LABS Home"
      className={`group flex flex-row flex-nowrap items-center gap-2.5 sm:gap-3.5 pointer-events-auto select-none ${className}`}
    >
      {iconPosition === "left" && CubeIcon}
      {BrandText}
      {iconPosition === "right" && CubeIcon}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none">
        {innerContent}
      </Link>
    );
  }

  return innerContent;
}

export default Logo;
