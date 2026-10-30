'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';
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
        .from('.hero-cta-group', { scale: 0.96, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.hero-stat-card', { y: 35, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.3');
    },
    { scope: containerRef }
  );

  const stats =
    content?.floatingStats && content.floatingStats.length > 0
      ? content.floatingStats
      : [
          { label: 'WebGL Frame Budget', value: '16.6ms / 60fps' },
          { label: 'Autonomous Agent Uptime', value: '99.98%' },
          { label: 'Pipeline Throughput', value: '4.8M ops/sec' },
        ];

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
      className="relative z-10 bg-transparent min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-28 sm:pt-36 pb-16 text-center flex flex-col items-center">
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
        <div className="hero-cta-group flex flex-wrap items-center justify-center gap-4 mb-16">
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

        {/* HUD Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {stats.slice(0, 3).map((stat, idx) => (
            <div key={idx} className="hero-stat-card glass-panel rounded-2xl p-4 border border-white/5 dark:border-white/5 light:border-black/10 text-left shadow-sm">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500 light:text-zinc-600 font-mono text-xs mb-1">
                <Terminal className="w-3.5 h-3.5 text-violet-400" />
                {stat.label}
              </div>
              <div className="text-xl font-bold font-mono text-zinc-100 dark:text-zinc-100 light:text-zinc-900">{stat.value}</div>
              {stat.subtext && (
                <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-500 light:text-zinc-600 mt-0.5">{stat.subtext}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
