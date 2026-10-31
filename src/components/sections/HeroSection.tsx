'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { HeroSectionData } from '@/lib/types';
import { HeroTypewriter } from './HeroTypewriter';
import GyroscopeCanvas from '@/components/canvas/BackgroundOrbit';

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

  const handlePrimaryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onOpenQuoteModal) {
      e.preventDefault();
      onOpenQuoteModal('Live Demo');
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between items-center pt-20 sm:pt-24 pb-4 sm:pb-6 overflow-hidden scroll-mt-28"
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <GyroscopeCanvas />
      </div>

      {/* Top / Main Hero Stack */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4 my-auto">
        {/* Subtle backdrop glow/mask to guarantee text legibility over glowing 3D rings */}
        <div className="absolute -inset-10 -z-10 bg-radial from-white/90 via-white/55 to-transparent dark:from-black/85 dark:via-black/55 dark:to-transparent blur-3xl pointer-events-none" />

        {/* Eyebrow Badge */}
        {content?.badgeVisible !== false && (
          <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-violet-400 text-xs font-mono mb-4">
            ● AI VOICE & BUSINESS AUTOMATION
          </div>
        )}

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
          Never Miss Another{' '}
          <span className="bg-gradient-to-r from-violet-700 via-sky-600 to-cyan-600 dark:from-violet-400 dark:via-sky-300 dark:to-cyan-300 bg-clip-text text-transparent">
            Opportunity.
          </span>
        </h1>

        {/* Supporting Line */}
        <p className="hero-desc mt-4 text-base sm:text-lg font-medium text-neutral-900 dark:text-neutral-200 max-w-2xl leading-relaxed">
          AI receptionists and intelligent automations that capture leads, handle conversations, and book appointments — around the clock.
        </p>

        {/* CTA Group */}
        <div className="hero-cta-group flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <a
            href="#book"
            onClick={handlePrimaryClick}
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
      </div>

      {/* Bottom Docked Typewriter Pill */}
      <HeroTypewriter />
    </section>
  );
}
