import React from "react";
import { cn } from "@/lib/utils";

interface ZavianLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withWordmark?: boolean;
  withTagline?: boolean;
}

export default function ZavianLogo({
  className,
  size = "md",
  withWordmark = false,
  withTagline = false,
}: ZavianLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl sm:rounded-2xl",
    lg: "w-12 h-12 rounded-2xl",
  };

  const svgSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("inline-flex items-center gap-3 group select-none", className)}>
      {/* High-Resolution Geometric Squircle Icon Badge */}
      <div
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br from-red-600 via-red-800 to-red-950/80 border border-red-500/40 shadow-[0_0_20px_rgba(220,38,38,0.35)] transition-transform duration-300 group-hover:scale-105 shrink-0",
          sizeClasses[size]
        )}
      >
        {/* Ambient Inner Glow Layer */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-t from-transparent via-white/10 to-white/20 pointer-events-none" />

        {/* Geometric "Z" Precision Cyber Glyph */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] relative z-10",
            svgSizes[size]
          )}
        >
          {/* Main Architectural Z Path with 45-degree cyber slash */}
          <path d="M4 4h16L7 20h13" />
          {/* Inset Optical Pulse Notch & Center Cyber Slash */}
          <path d="M9 12h6" strokeOpacity="0.6" strokeWidth="2" />
        </svg>
      </div>

      {/* Optional Attached Wordmark & Sub-Tagline */}
      {withWordmark && (
        <div className="flex flex-col text-left">
          <span className="text-lg sm:text-xl font-black tracking-tight text-white leading-none">
            ZAVIAN <span className="text-red-500">LABS</span>
          </span>
          {withTagline && (
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 mt-1">
              AI AUTOMATION &amp; SOFTWARE STUDIO
            </span>
          )}
        </div>
      )}
    </div>
  );
}
