'use client';

import React from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import ZavianLogo from '@/components/ui/ZavianLogo';

interface FooterProps {
  onOpenQuoteModal?: (service: string) => void;
}

export default function Footer({ onOpenQuoteModal }: FooterProps) {
  const { lenis } = useSmoothScroll();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenQuote = (service: string = 'Discovery Call') => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal(service);
    }
  };

  return (
    <footer className="relative z-20 border-t border-white/10 bg-[#060609]/80 backdrop-blur-2xl py-16 px-6 lg:px-12 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        <div>
          <div className="mb-4">
            <ZavianLogo showTagline={true} />
          </div>
          <p className="text-sm text-zinc-400 max-w-md leading-relaxed font-normal">
            Architecting next-generation autonomous AI systems, GPU-accelerated 3D WebGL interfaces, and production-grade software ecosystems. Zero templates. Pure engineering.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => handleOpenQuote('Discovery Call')}
            className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium transition-all shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start a Project</span>
          </button>
          <a
            href="#hero"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Overview
          </a>
          <a
            href="#core-expertise"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            01 / Core Expertise
          </a>
          <a
            href="#project-support"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            02 / Project Support
          </a>
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 text-xs font-mono cursor-pointer"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
            <span>TOP</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-4">
        <div>
          © 2026 ZAVIAN LABS. ALL RIGHTS RESERVED.
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEMS OPERATIONAL
          </span>
          <span>LATENCY: 24MS</span>
          <span>US-EAST / CLOUDFLARE EDGE</span>
        </div>
      </div>
    </footer>
  );
}
