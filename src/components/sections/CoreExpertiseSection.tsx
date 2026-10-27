'use client';

import React from 'react';
import { Check, Star, Rocket } from 'lucide-react';
import { CoreExpertiseSectionData } from '@/lib/types';

interface Props {
  onOpenQuoteModal?: (serviceName: string) => void;
  content?: CoreExpertiseSectionData;
}

const defaultCards = [
  {
    id: 'ecommerce',
    eyebrowIcon: '★',
    badgeTag: 'ENGINEERING TIER',
    title: 'Headless Ecommerce',
    description: 'Shopify backend, Next.js frontend — built for speed, scale, and total customization. No templates, no limits.',
    isFeatured: false,
    ctaText: '🚀 Get Started',
    checklist: [
      { id: '1', text: 'Shopify Backend', highlighted: false },
      { id: '2', text: 'Next.js Storefronts', highlighted: false },
      { id: '3', text: 'Custom Checkout Flows', highlighted: false },
      { id: '4', text: 'Lightning-Fast Load Speeds', highlighted: false },
      { id: '5', text: 'Fully Scalable Architecture', highlighted: false },
      { id: '6', text: 'SEO Optimised', highlighted: false },
    ],
  },
  {
    id: 'ai',
    eyebrowIcon: '★',
    badgeTag: 'ENGINEERING TIER',
    title: 'Agentic AI',
    description: "Autonomous AI agents that don't just respond — they think, decide, and act on your business's behalf, 24/7.",
    isFeatured: true,
    ctaText: '🚀 Get Started',
    checklist: [
      { id: '1', text: 'Autonomous Task Execution', highlighted: false },
      { id: '2', text: 'Multi-Step Decision Making', highlighted: false },
      { id: '3', text: 'Voice & Chat Agents', highlighted: false },
      { id: '4', text: 'CRM & Workflow Integration', highlighted: false },
      { id: '5', text: 'Self-Learning Systems', highlighted: false },
      { id: '6', text: 'Human-Level Reasoning', highlighted: false },
    ],
  },
  {
    id: 'mvp',
    eyebrowIcon: '★',
    badgeTag: 'ENGINEERING TIER',
    title: 'Idea to Launch',
    description: 'From concept to live product — we build, test, and ship your startup MVP fast, so you can start validating with real users.',
    isFeatured: false,
    ctaText: '🚀 Get Started',
    checklist: [
      { id: '1', text: 'MVP in Weeks, Not Months', highlighted: false },
      { id: '2', text: 'Full-Stack Development', highlighted: false },
      { id: '3', text: 'Investor-Ready Product', highlighted: false },
      { id: '4', text: 'Vibe-Coded & Production-Ready', highlighted: false },
      { id: '5', text: 'Scalable From Day One', highlighted: false },
      { id: '6', text: 'Launch & Iterate Support', highlighted: false },
    ],
  },
];

export default function CoreExpertiseSection({ onOpenQuoteModal, content }: Props) {
  const cards = content?.cards && content.cards.length > 0 ? content.cards : defaultCards;

  return (
    <section id="core-expertise" className="relative py-28 px-6 lg:px-12 z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div
            className="text-xs font-mono font-bold uppercase tracking-[0.25em] mb-3"
            style={{ color: 'var(--theme-primary, #DC2626)' }}
          >
            {content?.eyebrow || 'OUR CORE EXPERTISE'}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-950 leading-[1.15]">
            <span>{content?.mainTitleWhite || 'Build & '}</span>
            <span style={{ color: 'var(--theme-primary, #DC2626)' }}>
              {content?.mainTitleCrimson || 'Grow'}
            </span>
          </h2>
          {content?.subtitle && (
            <p
              className="text-sm font-normal mt-4 max-w-xl mx-auto"
              style={{ color: 'var(--theme-desc, #d4d4d8)' }}
            >
              {content.subtitle}
            </p>
          )}
        </div>

        {/* 3-Column Interactive 3D Tilt Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch perspective-container">
          {cards.map((card) => {
            const isFeatured = !!card.isFeatured;
            return (
              <div
                key={card.id}
                onMouseMove={(e) => {
                  const el = e.currentTarget;
                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  el.style.transform = `rotateY(${x * 0.04}deg) rotateX(${-y * 0.04}deg) ${
                    isFeatured ? 'translateZ(20px)' : 'translateZ(0px)'
                  }`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = isFeatured
                    ? 'rotateY(0deg) rotateX(0deg) translateZ(20px)'
                    : 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
                }}
                style={{
                  transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
                  transform: isFeatured ? 'translateZ(20px)' : 'translateZ(0px)',
                }}
                className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transform-3d transition-all ${
                  isFeatured
                    ? 'glass-panel-crimson shadow-2xl'
                    : 'glass-panel hover:border-white/20'
                }`}
              >
                {isFeatured && (
                  <div
                    className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 blur-3xl rounded-full pointer-events-none opacity-30"
                    style={{ backgroundColor: 'var(--theme-primary, #DC2626)' }}
                  />
                )}

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                      {card.badgeTag || 'ENGINEERING TIER'}
                    </span>
                    <Star
                      className="w-5 h-5"
                      style={
                        isFeatured
                          ? { color: 'var(--theme-primary, #DC2626)', fill: 'var(--theme-primary, #DC2626)' }
                          : { color: '#52525b' }
                      }
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-100 dark:text-zinc-100 light:text-zinc-950 mb-4">{card.title}</h3>
                  <p
                    className="text-base font-normal leading-relaxed mb-8"
                    style={{ color: 'var(--theme-desc, #d4d4d8)' }}
                  >
                    {card.description}
                  </p>

                  <div className="space-y-3.5 mb-10">
                    {card.checklist.map((item, i) => {
                      const text = typeof item === 'string' ? item : item.text;
                      return (
                        <div key={typeof item === 'string' ? i : item.id || i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#818CF8]/10 text-[#818CF8] shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className="text-sm font-normal text-zinc-300 dark:text-zinc-300 light:text-zinc-700">{text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onOpenQuoteModal) onOpenQuoteModal(card.title);
                  }}
                  className={`w-full py-4 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isFeatured
                      ? 'bg-[var(--theme-primary,#dc2626)] hover:brightness-110 text-white shadow-lg shadow-[var(--theme-glow,rgba(220,38,38,0.3))] hover:scale-[1.02]'
                      : 'border border-[var(--theme-primary,#dc2626)] text-zinc-100 dark:text-zinc-100 light:text-zinc-900 hover:bg-[var(--theme-primary,#dc2626)]/10'
                  }`}
                >
                  <Rocket className="w-4 h-4" />
                  {card.ctaText || 'Get Started'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
