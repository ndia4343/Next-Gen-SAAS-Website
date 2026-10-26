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
        .from('.hero-headline-span', { y: 55, opacity: 0, duration: 0.95, stagger: 0.14 }, '-=0.4')
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
      className="relative min-h-screen flex flex-col justify-center items-center px-6 lg:px-12 pt-36 pb-20 z-10"
    >
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Eyebrow Badge */}
        {content?.badgeVisible !== false && (
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-white/10 text-xs font-mono tracking-[0.25em] text-zinc-400 uppercase mb-8">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: content?.badgeDotColor || 'var(--theme-primary, #DC2626)' }}
            />
            {content?.badgeText || 'NEXT-GEN SAAS · AGENTIC AI · DATA ENGINEERING'}
          </div>
        )}

        {/* Display Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white max-w-4xl mb-6 overflow-hidden">
          <span className="hero-headline-span block">
            {content?.titleLine1 || 'Architecting the Future of'}
          </span>
          <span className="hero-headline-span block text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary,#dc2626)] via-[var(--theme-title-accent,#ef4444)] to-[var(--theme-secondary,#ff6b00)]">
            {content?.titleHighlight || 'Autonomous AI'}
          </span>
          <span className="hero-headline-span block text-zinc-300">
            {content?.titleLine2 || '& High-Compute WebGL.'}
          </span>
        </h1>

        {/* Subtitle Body */}
        <p
          className="hero-desc text-base font-normal leading-relaxed max-w-2xl mb-10"
          style={{ color: 'var(--theme-desc, #d4d4d8)' }}
        >
          {content?.description ||
            'ZAVIAN LABS engineers production-grade AI agent clusters, headless commerce architectures, and GPU-accelerated 3D WebGL interfaces. Built for scale. Zero templates.'}
        </p>

        {/* Dual CTAs */}
        <div className="hero-cta-group flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={handlePrimaryClick}
            className="px-8 py-4 rounded-full bg-[var(--theme-primary,#dc2626)] hover:brightness-110 text-white font-medium text-sm tracking-wide transition-all shadow-lg shadow-[var(--theme-glow,rgba(220,38,38,0.3))] hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            {content?.primaryCtaText || 'Explore Capabilities'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (onOpenQuoteModal) onOpenQuoteModal('Discovery Call');
            }}
            className="px-8 py-4 rounded-full glass-panel hover:bg-white/10 text-white font-medium text-sm tracking-wide transition-all border border-white/15 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[var(--theme-primary,#dc2626)]" />
            {content?.secondaryCtaText || 'Book Discovery Call'}
          </button>
        </div>

        {/* HUD Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {stats.slice(0, 3).map((stat, idx) => (
            <div key={idx} className="hero-stat-card glass-panel rounded-2xl p-4 border border-white/5 text-left">
              <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs mb-1">
                <Terminal className="w-3.5 h-3.5 text-[var(--theme-primary,#dc2626)]" />
                {stat.label}
              </div>
              <div className="text-xl font-bold font-mono text-zinc-100">{stat.value}</div>
              {stat.subtext && (
                <div className="text-[11px] font-mono text-zinc-500 mt-0.5">{stat.subtext}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
