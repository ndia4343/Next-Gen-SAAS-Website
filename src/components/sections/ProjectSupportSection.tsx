'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ProjectSupportSectionData } from '@/lib/types';

interface Props {
  onOpenQuoteModal?: (serviceName: string) => void;
  content?: ProjectSupportSectionData;
}

const defaultBentoCards = [
  {
    id: 'software',
    numberTag: '01 / SOFTWARE',
    title: 'Software Projects',
    description: 'Reliable websites, CMS platforms and custom applications built around your workflow.',
    accentColor: 'orange' as const,
    ctaText: 'Contact for a Quote ↗',
  },
  {
    id: 'data',
    numberTag: '02 / DATA',
    title: 'Data Projects',
    description: 'Power BI dashboards, reporting and analytics that turn data into clearer decisions.',
    accentColor: 'cyan' as const,
    ctaText: 'Contact for a Quote ↗',
  },
  {
    id: 'ai',
    numberTag: '03 / AI',
    title: 'AI Solution Driven Projects',
    description: 'Practical AI tools, integrations and automation that help teams reduce repetitive work.',
    accentColor: 'crimson' as const,
    ctaText: 'Contact for a Quote ↗',
  },
  {
    id: 'media',
    numberTag: '04 / MEDIA',
    title: 'Video Editing Services',
    description: 'Story-led videos, social edits and channel support designed to connect with your audience.',
    accentColor: 'purple' as const,
    ctaText: 'Contact for a Quote ↗',
  },
];

const colorMap = {
  orange: {
    tagText: 'text-[#FF6B00]',
    buttonBg: 'bg-[#FF6B00] hover:bg-[#ff7b1a] text-black shadow-[#FF6B00]/20',
    borderGradient: 'from-transparent via-[#FF6B00]/40 to-transparent',
  },
  cyan: {
    tagText: 'text-[#00B4D8]',
    buttonBg: 'bg-[#00B4D8] hover:bg-[#33c3e0] text-black shadow-[#00B4D8]/20',
    borderGradient: 'from-transparent via-[#00B4D8]/40 to-transparent',
  },
  crimson: {
    tagText: 'text-[#DC2626]',
    buttonBg: 'bg-[#DC2626] hover:bg-[#ef4444] text-white shadow-[#DC2626]/20',
    borderGradient: 'from-transparent via-[#DC2626]/40 to-transparent',
  },
  purple: {
    tagText: 'text-[#818CF8]',
    buttonBg: 'bg-[#818CF8] hover:bg-[#9fa8f8] text-black shadow-[#818CF8]/20',
    borderGradient: 'from-transparent via-[#818CF8]/40 to-transparent',
  },
};

export default function ProjectSupportSection({ onOpenQuoteModal, content }: Props) {
  const cards = content?.cards && content.cards.length > 0 ? content.cards : defaultBentoCards;

  return (
    <section id="project-support" className="relative py-28 px-6 lg:px-12 z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
            {content?.eyebrow || 'SOFTWARE · DATA · AI · MEDIA'}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 max-w-4xl leading-[1.15]">
            <span className="text-white">{content?.headlineWhite || 'Choose the right '}</span>
            <span className="text-[#FF6B00]">{content?.headlineOrange || 'project support '}</span>
            <span className="text-[#00B4D8]">{content?.headlineCyan || 'for your goals.'}</span>
          </h2>
          <p className="text-base font-normal leading-relaxed text-zinc-400 max-w-2xl">
            {content?.subtitle ||
              'Every engagement starts with a focused conversation and a quote based on your requirements, deliverables and timeline.'}
          </p>
        </div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((bento) => {
            const colors = colorMap[bento.accentColor as keyof typeof colorMap] || colorMap.orange;
            const ctaClean = (bento.ctaText || 'Contact for a Quote').replace('↗', '').trim();

            return (
              <div
                key={bento.id}
                className="group relative bg-[#0f0f14]/90 hover:bg-[#14141c]/95 border border-white/10 hover:border-white/20 rounded-3xl p-8 lg:p-10 transition-all duration-300 flex flex-col justify-between"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                />

                <div>
                  <div className={`text-xs font-mono font-bold tracking-[0.2em] uppercase ${colors.tagText} mb-4`}>
                    {bento.numberTag}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-zinc-100 transition-colors">
                    {bento.title}
                  </h3>
                  <p className="text-base font-normal leading-relaxed text-zinc-400 mb-8 max-w-lg">
                    {bento.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <button
                    onClick={() => {
                      if (onOpenQuoteModal) onOpenQuoteModal(bento.title);
                    }}
                    className={`inline-flex items-center gap-2 ${colors.buttonBg} font-semibold text-sm rounded-full px-6 py-3 transition-transform group-hover:scale-105 active:scale-95 cursor-pointer shadow-lg`}
                  >
                    {ctaClean}
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                    Ready to deploy
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
