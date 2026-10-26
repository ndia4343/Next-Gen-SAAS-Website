'use client';

import React from 'react';
import { Check, Star, Rocket } from 'lucide-react';

interface Props {
  onOpenQuoteModal?: (serviceName: string) => void;
}

export default function CoreExpertiseSection({ onOpenQuoteModal }: Props) {
  const cards = [
    {
      id: 'ecommerce',
      eyebrowIcon: '★',
      title: 'Headless Ecommerce',
      description: 'Shopify backend, Next.js frontend — built for speed, scale, and total customization. No templates, no limits.',
      isFeatured: false,
      ctaText: '🚀 Get Started',
      checklist: [
        'Shopify Backend',
        'Next.js Storefronts',
        'Custom Checkout Flows',
        'Lightning-Fast Load Speeds',
        'Fully Scalable Architecture',
        'SEO Optimised',
      ],
    },
    {
      id: 'ai',
      eyebrowIcon: '★',
      title: 'Agentic AI',
      description: "Autonomous AI agents that don't just respond — they think, decide, and act on your business's behalf, 24/7.",
      isFeatured: true,
      ctaText: '🚀 Get Started',
      checklist: [
        'Autonomous Task Execution',
        'Multi-Step Decision Making',
        'Voice & Chat Agents',
        'CRM & Workflow Integration',
        'Self-Learning Systems',
        'Human-Level Reasoning',
      ],
    },
    {
      id: 'mvp',
      eyebrowIcon: '★',
      title: 'Idea to Launch',
      description: 'From concept to live product — we build, test, and ship your startup MVP fast, so you can start validating with real users.',
      isFeatured: false,
      ctaText: '🚀 Get Started',
      checklist: [
        'MVP in Weeks, Not Months',
        'Full-Stack Development',
        'Investor-Ready Product',
        'Vibe-Coded & Production-Ready',
        'Scalable From Day One',
        'Launch & Iterate Support',
      ],
    },
  ];

  return (
    <section id="core-expertise" className="relative py-28 px-6 lg:px-12 z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#DC2626] mb-3">
            OUR CORE EXPERTISE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            <span>Build &amp; </span>
            <span className="text-[#DC2626]">Grow</span>
          </h2>
        </div>

        {/* 3-Column Interactive 3D Tilt Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch perspective-container">
          {cards.map((card) => {
            const isFeatured = card.isFeatured;
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
                    ? 'glass-panel-crimson border-red-500/50 shadow-2xl shadow-red-900/30'
                    : 'glass-panel hover:border-white/20'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-red-600/20 blur-3xl rounded-full pointer-events-none" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                      ENGINEERING TIER
                    </span>
                    <Star
                      className={`w-5 h-5 ${
                        isFeatured
                          ? 'text-[#DC2626] fill-[#DC2626]'
                          : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                  <p className="text-base font-normal leading-relaxed text-zinc-400 mb-8">
                    {card.description}
                  </p>

                  <div className="space-y-3.5 mb-10">
                    {card.checklist.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#818CF8]/10 text-[#818CF8] shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-sm font-normal text-zinc-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onOpenQuoteModal) onOpenQuoteModal(card.title);
                  }}
                  className={`w-full py-4 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isFeatured
                      ? 'bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-700/30 hover:scale-[1.02]'
                      : 'border border-red-600 text-white hover:bg-red-600/10 hover:border-red-500'
                  }`}
                >
                  <Rocket className="w-4 h-4" />
                  {card.ctaText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
