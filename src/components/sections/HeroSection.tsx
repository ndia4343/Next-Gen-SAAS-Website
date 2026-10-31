'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HeroSectionData } from '@/lib/types';

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
    const rawTarget = content?.primaryCtaLink || '#core-expertise';
    if (rawTarget.startsWith('#')) {
      const el = document.getElementById(rawTarget.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (onOpenQuoteModal) onOpenQuoteModal('Discovery Call');
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

        {/* EYEBROW */}
        {content?.badgeVisible !== false && (
          <div className="hero-badge inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-6 backdrop-blur-md">
            {content?.badgeText || '● SPEED-TO-LEAD AUTOMATION · 24/7 INBOUND AGENTS'}
          </div>
        )}

        {/* H1 HEADLINE */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-5xl mx-auto leading-[1.1] text-center">
          {content?.titleLine1 || 'Every Missed Call Is a'}{' '}
          <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 bg-clip-text text-transparent pb-1 inline-block">
            {content?.titleHighlight || "Competitor's Opportunity."}
          </span>
          {content?.titleLine2 ? (
            <>
              {' '}
              <br className="hidden sm:inline" />
              {content.titleLine2}
            </>
          ) : null}
        </h1>

        {/* SUB-HEADLINE */}
        <p className="hero-desc text-neutral-600 dark:text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto text-center mt-6 mb-10 leading-relaxed">
          Custom AI voice receptionists, WhatsApp booking systems, and automated workflows that turn inbound callers into paid clients 24/7.
        </p>

        {/* Dual CTAs */}
        <div className="hero-cta-group flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handlePrimaryClick}
            className="px-8 py-4 rounded-full glass-panel hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 text-zinc-900 dark:text-zinc-100 font-semibold text-sm tracking-wide transition-all duration-300 border border-neutral-300 dark:border-white/15 hover:border-violet-500/50 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            {content?.primaryCtaText || 'Explore Capabilities'}
            <ArrowRight className="w-4 h-4 text-violet-400" />
          </button>

          <button
            onClick={() => {
              if (onOpenQuoteModal) onOpenQuoteModal('Discovery Call');
            }}
            className="px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.65)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-violet-200" />
            {content?.secondaryCtaText || 'Book Discovery Call'}
          </button>
        </div>
      </div>
    </section>
  );
}
