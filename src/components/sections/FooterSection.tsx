"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "../providers/SmoothScrollProvider";
import { useModal } from "../providers/ModalProvider";

export default function FooterSection() {
  const { lenis } = useSmoothScroll();
  const { openQuoteModal } = useModal();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer id="architecture" className="relative z-10 border-t border-white/10 bg-[#060609]/60 backdrop-blur-xl py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-600/30 border border-red-500/30">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              >
                <path d="M4 4h16L7 20h13" />
                <path d="M9 12h6" strokeOpacity="0.6" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                ZAVIAN <span className="text-red-500">LABS</span>
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase mt-0.5">
                AI SYSTEMS &amp; ENGINEERING
              </span>
            </div>
          </div>
          <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
            High-performance 3D architectures, autonomous AI voice &amp; WhatsApp systems, and
            enterprise intelligence engineering.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => openQuoteModal("General Discovery")}
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Start a Project
          </button>
          <a
            href="#core-expertise"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            01 / Core Expertise
          </a>
          <a
            href="#project-tiers"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            02 / Project Tiers
          </a>
          <a
            href="#architecture"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            03 / Architecture
          </a>
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-mono"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
            <span>TOP</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-400 gap-4">
        <div>
          © 2026 ZAVIAN LABS. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-6">
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEMS OPERATIONAL
          </span>
          <span>LATENCY: 28MS</span>
          <span>US-EAST / CLOUDFLARE EDGE</span>
        </div>
      </div>
    </footer>
  );
}
