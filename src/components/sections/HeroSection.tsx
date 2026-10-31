'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { HeroSectionData } from '@/lib/types';
import { HeroTypewriter } from './HeroTypewriter';

interface HeroProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: HeroSectionData;
}

export default function HeroSection({ onOpenQuoteModal, content }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', { y: -25, opacity: 0, duration: 0.8, delay: 0.15 })
        .from('h1', { y: 40, opacity: 0, duration: 0.95 }, '-=0.4')
        .from('.hero-desc', { y: 25, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-cta-group', { scale: 0.96, opacity: 0, duration: 0.6 }, '-=0.4');
    },
    { scope: containerRef }
  );

  const handlePrimaryClick = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal('Live Demo');
    } else {
      const el = document.getElementById('book') || document.getElementById('custom-quote');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative z-10 bg-transparent min-h-[calc(100vh-4rem)] flex flex-col justify-start sm:justify-center items-center px-4 sm:px-6 lg:px-12 pt-36 sm:pt-40 lg:pt-44 pb-16 scroll-mt-28"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
        {/* Subtle backdrop glow/mask to prevent 3D wireframe text collisions */}
        <div className="absolute inset-0 -z-10 bg-radial from-white/80 via-white/40 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent blur-2xl pointer-events-none" />

        {/* 1. EYEBROW BADGE */}
        {content?.badgeVisible !== false && (
          <div className="hero-badge inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-violet-400 mb-6 backdrop-blur-md">
            <span>● AI VOICE & BUSINESS AUTOMATION</span>
          </div>
        )}

        {/* 2. HEADLINE */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-5xl mx-auto leading-[1.1] text-center">
          Never Miss Another{' '}
          <span className="bg-gradient-to-r from-violet-700 via-sky-600 to-cyan-600 dark:from-violet-400 dark:via-sky-300 dark:to-cyan-300 bg-clip-text text-transparent pb-1 inline-block">
            Opportunity.
          </span>
        </h1>

        {/* 3. SUPPORTING LINE */}
        <p className="hero-desc text-neutral-600 dark:text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto text-center mt-6 mb-10 leading-relaxed">
          AI receptionists and intelligent automations that capture leads, handle conversations, and book appointments — around the clock.
        </p>

        {/* 4. ACTION BUTTONS & ANCHORS */}
        <div className="hero-cta-group flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <a
            href="#book"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all shadow-lg shadow-violet-500/20 text-center"
          >
            Book a Live Demo →
          </a>
          <a
            href="#voice-demo"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-200 font-medium text-sm transition-all text-center"
          >
            Hear It in Action →
          </a>
        </div>

        {/* 5. ACCESSIBLE SHIFT-FREE TYPEWRITER */}
        <HeroTypewriter />
      </div>
    </section>
  );
}
