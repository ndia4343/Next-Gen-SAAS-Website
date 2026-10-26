"use client";

import React from "react";
import { ArrowUp, Terminal } from "lucide-react";
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
    <footer className="relative z-10 border-t border-white/10 bg-[#060609]/90 backdrop-blur-xl py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              NEUROFLUX<span className="text-red-500">.AI</span>
            </span>
          </div>
          <p className="text-sm text-zinc-400 max-w-sm">
            High-performance 3D SaaS architectures, autonomous agent swarms, and
            enterprise intelligence engineering.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <button
            onClick={() => openQuoteModal("General Discovery")}
            className="text-sm text-zinc-300 hover:text-white transition-colors"
          >
            Start a Project
          </button>
          <a
            href="#core-expertise"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#project-support"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Project Tiers
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
          © {new Date().getFullYear()} NEUROFLUX SYSTEMS INC. ALL RIGHTS RESERVED.
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
