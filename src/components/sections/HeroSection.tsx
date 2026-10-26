"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowDown,
  PhoneCall,
  Terminal,
  Cpu,
  Zap,
  Activity,
} from "lucide-react";
import { useModal } from "../providers/ModalProvider";
import { useSmoothScroll } from "../providers/SmoothScrollProvider";
import MagneticButton from "../ui/MagneticButton";
import { HeroSectionData } from "@/lib/types";

interface HeroSectionProps {
  data?: HeroSectionData;
}

const defaultStatsIcons = [Terminal, Zap, Activity, Cpu];

export default function HeroSection({ data }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { openQuoteModal } = useModal();
  const { lenis } = useSmoothScroll();

  const badgeText = data?.badgeText || "NEXT-GEN SAAS · AGENTIC AI · DATA ENGINEERING";
  const titleLine1 = data?.titleLine1 || "Architecting the Future of";
  const titleHighlight = data?.titleHighlight || "Autonomous AI";
  const titleLine2 = data?.titleLine2 || "& High-Compute WebGL.";
  const description =
    data?.description ||
    "We architect custom headless commerce platforms, autonomous AI agent workflows, and enterprise data intelligence systems designed for extreme scale and speed.";
  const primaryCta = data?.primaryCtaText || "Explore Capabilities";
  const secondaryCta = data?.secondaryCtaText || "Book Discovery Call";
  const stats = data?.floatingStats || [
    { label: "API Latency", value: "< 35ms" },
    { label: "Agent Uptime", value: "99.99%" },
    { label: "Speed to Market", value: "4.2x" },
    { label: "Template Limits", value: "Zero" },
  ];

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
      )
        .fromTo(
          headlineRef.current?.querySelectorAll(".word-reveal") || [],
          { opacity: 0, y: 40, rotateX: -25 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.08,
          },
          "-=0.4"
        )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          ctaRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
          "-=0.4"
        )
        .fromTo(
          statsRef.current?.children || [],
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  const scrollToCapabilities = () => {
    const target = document.getElementById("core-expertise");
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -40, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center select-none bg-transparent"
    >
      {/* Eyebrow Badge with glowing crimson dot */}
      <div
        ref={eyebrowRef}
        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-8 shadow-inner shadow-white/5"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]" />
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-300">
          {badgeText}
        </span>
      </div>

      {/* Dynamic Headline Reveal with Staggered GSAP Timeline */}
      <h1
        ref={headlineRef}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl text-white leading-[1.08] mb-6 perspective-normal"
      >
        <span className="inline-block word-reveal mr-3">{titleLine1}</span>
        <span className="inline-block word-reveal mr-3 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
          {titleHighlight}
        </span>
        <br className="hidden sm:inline" />
        <span className="inline-block word-reveal bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
          {titleLine2}
        </span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtextRef}
        className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
      >
        {description}
      </p>

      {/* CTA Buttons: Primary smooth-scrolls, Secondary triggers quote modal */}
      <div
        ref={ctaRef}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto mb-16"
      >
        <MagneticButton
          onClick={scrollToCapabilities}
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold text-sm sm:text-base hover:bg-zinc-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group shadow-xl shadow-white/10"
        >
          <span>{primaryCta}</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </MagneticButton>

        <MagneticButton
          onClick={() => openQuoteModal("General Discovery")}
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm sm:text-base active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-red-700/30 border border-red-500/30"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{secondaryCta}</span>
        </MagneticButton>
      </div>

      {/* HUD Metric Cards with Terminal Icons */}
      <div
        ref={statsRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full mx-auto"
      >
        {stats.map((stat, idx) => {
          const Icon = defaultStatsIcons[idx % defaultStatsIcons.length];
          const colors = [
            "text-red-500",
            "text-orange-500",
            "text-cyan-400",
            "text-indigo-400",
          ];
          const colorClass = colors[idx % colors.length];

          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#0c0c12]/80 border border-white/5 backdrop-blur-md hover:border-white/15 transition-all duration-200 group shadow-lg shadow-black/40"
            >
              <div className={`flex items-center gap-2 ${colorClass} mb-1.5`}>
                <Icon className="w-4 h-4" />
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {stat.value}
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider text-center">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
