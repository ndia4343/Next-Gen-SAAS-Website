"use client";

import React from "react";
import TiltCard from "../ui/TiltCard";
import { useModal, ServiceTier } from "../providers/ModalProvider";
import { CoreExpertiseSectionData } from "@/lib/types";

interface CoreExpertiseSectionProps {
  data?: CoreExpertiseSectionData;
}

export default function CoreExpertiseSection({ data }: CoreExpertiseSectionProps) {
  const { openQuoteModal } = useModal();

  const eyebrow = data?.eyebrow || "OUR CORE EXPERTISE";
  const mainTitleWhite = data?.mainTitleWhite || data?.titlePart1 || "Build & ";
  const mainTitleCrimson = data?.mainTitleCrimson || data?.titlePart2 || "Grow";
  const subtitle =
    data?.subtitle ||
    "High-performance architectures crafted for ambitious leaders, founders, and enterprises.";
  const cards = data?.cards || [];

  const mapActionToServiceTier = (actionId: string, title: string): ServiceTier => {
    const combined = (title + " " + actionId).toLowerCase();
    if (combined.includes("ecommerce")) {
      return "Headless Ecommerce";
    }
    if (combined.includes("ai")) {
      return "Agentic AI";
    }
    if (combined.includes("launch") || combined.includes("mvp")) {
      return "Idea to Launch";
    }
    return "General Discovery";
  };

  return (
    <section
      id="core-expertise"
      className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Centered Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#DC2626] font-semibold mb-3">
          {eyebrow}
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
          <span className="text-[#FFFFFF]">{mainTitleWhite}</span>
          <span className="text-[#DC2626]">{mainTitleCrimson}</span>
        </h2>
        <p className="mt-4 text-zinc-400 text-base sm:text-lg">{subtitle}</p>
      </div>

      {/* 3-Column 3D Tilt Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 perspective-distant items-stretch">
        {cards.map((card) => {
          const isFeatured = card.isFeatured || card.columnKey === "ai";
          const serviceTier = mapActionToServiceTier(card.ctaActionId, card.title);

          return (
            <TiltCard
              key={card.id}
              featured={isFeatured}
              maxTilt={isFeatured ? 14 : 10}
              className={
                isFeatured
                  ? "glass-panel-crimson border-red-500/50 p-8 sm:p-10 flex flex-col justify-between relative transform-3d shadow-2xl shadow-red-950/40"
                  : "glass-panel p-8 sm:p-10 flex flex-col justify-between group transition-all duration-300 hover:border-white/20 transform-3d"
              }
              style={{
                transform: isFeatured ? "translateZ(20px)" : undefined,
              }}
            >
              {/* Glowing backlight for featured card */}
              {isFeatured && (
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-red-600/25 via-transparent to-red-600/15 -z-10 pointer-events-none blur-2xl" />
              )}

              <div>
                {/* Top Row: Title + Star */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {isFeatured && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/30 mb-2">
                        ★ Featured AI Swarm
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {card.title}
                    </h3>
                  </div>
                  <span
                    className={
                      isFeatured
                        ? "text-[#DC2626] text-2xl drop-shadow-[0_0_10px_rgba(220,38,38,0.7)] select-none"
                        : "text-zinc-600 text-2xl select-none"
                    }
                    aria-hidden="true"
                  >
                    {card.eyebrowIcon || "★"}
                  </span>
                </div>

                {/* Description */}
                <p
                  className={
                    isFeatured
                      ? "text-zinc-300 text-sm leading-relaxed mb-8"
                      : "text-zinc-400 text-sm leading-relaxed mb-8"
                  }
                >
                  {card.description}
                </p>

                {/* Dynamic CTA Button wired to open quote modal pre-populated with service name */}
                <button
                  onClick={() => openQuoteModal(serviceTier)}
                  className={
                    isFeatured
                      ? "w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm shadow-lg shadow-red-700/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mb-10 border border-red-500/40"
                      : "w-full py-3.5 px-6 rounded-xl border border-red-600 text-white font-medium text-sm hover:bg-red-600/10 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mb-10 group/btn"
                  }
                >
                  <span>{card.ctaText}</span>
                </button>

                {/* Feature Checklist with #818CF8 checkmarks */}
                <div
                  className={
                    isFeatured
                      ? "space-y-3.5 border-t border-white/10 pt-6"
                      : "space-y-3.5 border-t border-white/5 pt-6"
                  }
                >
                  {card.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span
                        className="flex-shrink-0 text-[#818CF8] font-bold text-base"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      <span
                        className={
                          isFeatured
                            ? "text-white text-sm font-medium"
                            : "text-zinc-300 text-sm font-medium"
                        }
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}
