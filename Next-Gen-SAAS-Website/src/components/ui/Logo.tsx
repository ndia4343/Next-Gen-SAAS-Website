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
  iconPosition = "left",
  useFuturisticGlyphs = false,
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
    <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105 group-hover:rotate-[-2deg]">
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
        <img
          src="/images/zavian-cube-mark.png"
          alt="Brand Logo"
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );

  // 2. Typography Wordmark
  const BrandText = (
    <div className="flex flex-col text-left justify-center leading-none">
      <div className="flex items-center gap-2 flex-row flex-nowrap">
        <span
          className="font-black text-base tracking-wider text-zinc-100 transition-colors"
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
          className="font-light text-base tracking-widest text-[#A855F7] transition-colors"
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
        <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-400 mt-1 select-none font-medium transition-colors truncate">
          {tagline || "AI Automation & Software Studio"}
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
