'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import SpatialDeckSection from '@/components/sections/SpatialDeckSection';

export default function LabPage() {
  return (
    <main className="min-h-screen bg-[#02140f] text-white selection:bg-[#00E599]/30">
      {/* Test Studio Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#021f18]/90 backdrop-blur-xl border-b border-emerald-500/20 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Live Site</span>
          </Link>
          <div className="h-4 w-[1px] bg-emerald-500/30 hidden sm:block" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#00E599] hidden sm:inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Video Sync Lab</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-emerald-200/70 hidden md:inline">Synced with Zavian Services</span>
          <a
            href="https://youtube.com/shorts/kaGP7tuTmeE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#00E599] hover:underline"
          >
            <span>Original Short Reference</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* The 3D Spatial Deck Experience */}
      <SpatialDeckSection />
    </main>
  );
}
