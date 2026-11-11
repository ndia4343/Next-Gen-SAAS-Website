'use client';

import React, { useState } from 'react';
import {
  Check,
  X,
  Phone,
  MessageSquare,
  Code2,
  Play,
  Pause,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { CoreExpertiseSectionData } from '@/lib/types';

interface Props {
  onOpenQuoteModal?: (serviceName: string) => void;
  content?: CoreExpertiseSectionData;
}

const defaultServices = [
  {
    id: 'voice',
    demoType: 'voice' as const,
    badgeTag: 'SPEED-TO-LEAD · VOICE',
    title: 'AI Voice Receptionists',
    description:
      '24/7 human-sounding AI receptionists that answer inbound calls in under 5 seconds, qualify prospects, and book directly onto your calendar.',
    demoBtnText: 'Listen to Voice Demo →',
    checklist: [
      'Under 5s pickup & response latency',
      'Multi-turn natural human conversation',
      'Direct calendar booking (Cal & Calendly)',
      'Native CRM sync (GoHighLevel & HubSpot)',
      'Call recording & intent transcription',
      'Zero missed inbound calls 24/7/365',
    ],
  },
  {
    id: 'whatsapp',
    demoType: 'whatsapp' as const,
    badgeTag: 'SPEED-TO-LEAD · CHAT',
    title: 'WhatsApp Inbound Workflows',
    description:
      'Convert ad traffic and web leads via high-speed automated WhatsApp funnels that qualify criteria and secure appointments in under 60 seconds.',
    demoBtnText: 'View WhatsApp Flow →',
    checklist: [
      'Sub-60s automated inbound engagement',
      'Algorithmic lead qualification criteria',
      'In-chat dynamic calendar scheduling',
      'Proof-of-funds document parsing',
      'Multi-touch SMS & WhatsApp re-engagement',
      'Real-time webhook and pipeline integrations',
    ],
  },
  {
    id: 'software',
    demoType: 'software' as const,
    badgeTag: 'HIGH COMPUTE · CUSTOM',
    title: 'Custom Software & Dashboards',
    description:
      'Tailored client portals, real-time revenue dashboards, and custom backend systems built for your exact operational workflows.',
    demoBtnText: 'Explore Custom Systems →',
    checklist: [
      'Next.js, Node.js & high-throughput APIs',
      'Real-time revenue & conversion tracking',
      'Multi-agent orchestration pipelines',
      'Custom database architecture & schema',
      'Zero rigid templates, 100% custom code',
      'Production deployment on edge infrastructure',
    ],
  },
];

export default function CoreExpertiseSection({ onOpenQuoteModal, content }: Props) {
  const [activeDemo, setActiveDemo] = useState<'voice' | 'whatsapp' | 'software' | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const openBookingModal = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal('Custom Setup / Pipeline');
    } else {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = defaultServices;

  return (
    <section id="core-expertise" className="relative z-10 bg-[#F8FAFC] dark:bg-[#07070A] py-28 px-4 sm:px-6 lg:px-12 scroll-mt-28 transition-colors duration-300">
      <div id="services" className="absolute top-0 left-0 scroll-mt-28 pointer-events-none" />
      <div id="industries" className="absolute top-0 left-0 scroll-mt-28 pointer-events-none" />

      {/* Subtle Precision Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center mb-16 sm:mb-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-4 py-1.5 rounded-full border border-purple-200/80 dark:border-purple-800/40 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-[#38BDF8] animate-pulse" />
            CORE ARCHITECTURES · ZERO BOTTLENECK
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white text-center leading-tight">
            Engineered to{' '}
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-[#38BDF8] bg-clip-text text-transparent">
              Capture, Book, and Scale.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-center font-normal leading-relaxed">
            Three production-grade automation systems designed to eliminate lead drop-off, qualify inbound intent, and streamline operations 24/7.
          </p>
        </div>

        {/* 3 BRIGHTHUB BENTO CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {services.map((card) => {
            const isLimeHighlight = card.id === 'whatsapp';

            return (
              <div
                key={card.id}
                className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-xl ${
                  isLimeHighlight
                    ? 'bg-[#E9F871] text-slate-950 border border-black/10'
                    : 'bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <div>
                  {/* Card Header Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] font-bold px-2.5 py-1 rounded-md ${
                        isLimeHighlight
                          ? 'bg-black/10 text-slate-950'
                          : card.id === 'voice'
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/40'
                          : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/40'
                      }`}
                    >
                      {card.badgeTag}
                    </span>

                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isLimeHighlight
                          ? 'bg-black/10 text-slate-950'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {card.demoType === 'voice' && <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                      {card.demoType === 'whatsapp' && <MessageSquare className="w-4 h-4 text-slate-950" />}
                      {card.demoType === 'software' && <Code2 className="w-4 h-4 text-[#38BDF8]" />}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`text-2xl font-bold mb-3 tracking-tight ${
                      isLimeHighlight ? 'text-slate-950' : 'text-slate-950 dark:text-white'
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed mb-6 font-normal ${
                      isLimeHighlight ? 'text-slate-800 font-medium' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {card.description}
                  </p>

                  {/* Checklist */}
                  <div className="space-y-3 mb-8">
                    {card.checklist.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-left">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isLimeHighlight
                              ? 'bg-black text-[#E9F871]'
                              : 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span
                          className={`text-xs sm:text-sm leading-snug ${
                            isLimeHighlight
                              ? 'text-slate-900 font-medium'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Demo Action Button (Flush at bottom) */}
                <div
                  className={`mt-auto pt-4 border-t w-full ${
                    isLimeHighlight ? 'border-black/10' : 'border-slate-100 dark:border-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveDemo(card.demoType)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isLimeHighlight
                        ? 'bg-slate-950 text-white hover:bg-slate-800 shadow-sm'
                        : 'border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{card.demoBtnText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CONVERSION DOCK (BrightHub Pill Bar) */}
        <div className="mt-14 max-w-2xl mx-auto px-4">
          <div className="rounded-full p-[1px] bg-gradient-to-r from-purple-500/20 via-slate-200 dark:via-white/10 to-[#38BDF8]/20 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 rounded-full bg-white dark:bg-[#0B0F19] backdrop-blur-xl border border-slate-200/80 dark:border-white/10">
              {/* Left indicator & text */}
              <div className="flex items-center gap-3 text-left">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
                </span>
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  Need a custom setup or full-stack pipeline?
                </span>
              </div>

              {/* Right Action Button */}
              <button
                type="button"
                onClick={() => {
                  if (typeof openBookingModal === 'function') {
                    openBookingModal();
                  } else {
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs tracking-wide transition-all shadow-[0_2px_12px_rgba(147,51,234,0.25)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer"
              >
                <span>Book Discovery Call</span>
                <span className="text-white/80">↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DEMO MODAL OVERLAY */}
      {activeDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0B0F19] border border-white/15 p-6 sm:p-8 shadow-2xl text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  {activeDemo === 'voice' && <Phone className="w-4 h-4 text-purple-400" />}
                  {activeDemo === 'whatsapp' && <MessageSquare className="w-4 h-4 text-[#E9F871]" />}
                  {activeDemo === 'software' && <Code2 className="w-4 h-4 text-[#38BDF8]" />}
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">
                    {activeDemo === 'voice' && 'Live AI Voice Receptionist Demo'}
                    {activeDemo === 'whatsapp' && 'Instant WhatsApp Booking Flow Demo'}
                    {activeDemo === 'software' && 'Custom High-Compute Systems Demo'}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    {activeDemo === 'voice' && 'LATENCY: 420MS · NATURAL DIALOGUE · CALENDAR SYNC'}
                    {activeDemo === 'whatsapp' && 'RESPONSE: < 60S · QUALIFICATION FUNNEL · AUTO-CONFIRM'}
                    {activeDemo === 'software' && 'EDGE DEPLOYMENT · ZERO TEMPLATES · REVENUE METRICS'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveDemo(null);
                  setIsPlayingAudio(false);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* DEMO 1: VOICE */}
            {activeDemo === 'voice' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-[#080B11] border border-white/10 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-2 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Inbound Call · 00:42
                    </span>
                    <span>Sample: Inbound High-Ticket Qualification</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-all hover:scale-105 cursor-pointer shadow-lg shadow-purple-600/30"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <div className="flex-1 flex items-center gap-1 h-8">
                      {[30, 60, 45, 80, 95, 70, 40, 65, 85, 100, 75, 50, 85, 60, 40, 70, 90, 80, 50, 35, 60, 85, 70, 45, 65, 90, 75, 40].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full transition-all duration-150"
                          style={{
                            height: isPlayingAudio ? `${Math.max(15, h * Math.sin(i + Date.now() / 200))}%` : `${h * 0.4}%`,
                            backgroundColor: isPlayingAudio ? (i % 3 === 0 ? '#38BDF8' : '#9333EA') : 'rgba(255,255,255,0.2)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 text-xs font-mono">
                  <div className="flex items-start gap-2.5">
                    <span className="text-slate-500 shrink-0 font-bold">CALLER:</span>
                    <span className="text-slate-300">&ldquo;Hey, we&apos;re doing about $400k/mo and losing leads because nobody picks up after 6 PM.&rdquo;</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-purple-400 shrink-0 font-bold">AI AGENT:</span>
                    <span className="text-slate-100">&ldquo;Understood. Our voice architecture guarantees under 5-second pickup 24/7. Would tomorrow at 11:30 AM EST work to configure your test line?&rdquo;</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>Meeting Confirmed: Calendar Invite Sent &amp; Logged to CRM</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDemo(null);
                    onOpenQuoteModal?.('AI Voice Receptionists');
                  }}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  <span>Deploy Voice Agent For Your Team</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* DEMO 2: WHATSAPP */}
            {activeDemo === 'whatsapp' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-[#080B11] border border-white/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Zavian WhatsApp Concierge (Verified)
                    </span>
                    <span>Response: 12 seconds</span>
                  </div>

                  <div className="bg-[#1f2c34] p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-slate-200">
                    Hi! Welcome to Zavian Labs. 👋 I can help you lock in qualified leads 24/7. What industry is your business in?
                    <div className="text-[10px] text-slate-400 text-right mt-1 font-mono">10:02 AM · Sent</div>
                  </div>

                  <div className="bg-[#005c4b] p-3 rounded-2xl rounded-tr-sm max-w-[85%] ml-auto text-white">
                    Private Wealth Management. We have high-ticket investors inquiring nightly.
                    <div className="text-[10px] text-emerald-200 text-right mt-1 font-mono">10:02 AM · Read</div>
                  </div>

                  <div className="bg-[#1f2c34] p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-slate-200">
                    Got it. We can auto-verify criteria and deliver private investment briefs via WhatsApp in under 45 seconds. Would you like a live walkthrough with our Lead Architect?
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                        ✓ Slot Reserved: Tomorrow 2:00 PM
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDemo(null);
                    onOpenQuoteModal?.('WhatsApp Inbound Workflows');
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  <span>Build Your WhatsApp Speed-to-Lead Funnel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* DEMO 3: SOFTWARE */}
            {activeDemo === 'software' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-[#080B11] border border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-white/10">
                    <span className="text-[#38BDF8] flex items-center gap-1.5 font-bold">
                      <Terminal className="w-3.5 h-3.5" />
                      ZAVIAN ENGINE // CORE CLUSTER
                    </span>
                    <span className="text-emerald-400">STATUS: HEALTHY</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-slate-400">API LATENCY</div>
                      <div className="text-base font-bold text-white">18.4ms</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-slate-400">THROUGHPUT</div>
                      <div className="text-base font-bold text-white">4.8M ops/s</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-slate-400">LEAD CONV.</div>
                      <div className="text-base font-bold text-emerald-400">+41.2%</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1 pt-2">
                    <div className="text-slate-500">[15:10:02] Webhook received: inbound lead (GHL CRM)</div>
                    <div className="text-slate-400">[15:10:03] Multi-agent parsing: intent score = 0.94 (Qualified)</div>
                    <div className="text-emerald-400">[15:10:04] Calendar invite dispatched &amp; logged to Stripe</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDemo(null);
                    onOpenQuoteModal?.('Custom Software & Dashboards');
                  }}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  <span>Request Custom Systems Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}