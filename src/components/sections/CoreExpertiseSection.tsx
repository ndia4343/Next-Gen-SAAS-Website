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
  Calendar,
  Volume2,
  Terminal,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
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
    <section id="core-expertise" className="relative py-28 px-4 sm:px-6 lg:px-12 z-10">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center mb-16 sm:mb-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400 mb-4 backdrop-blur-md">
            ● CORE ARCHITECTURES · ZERO BOTTLENECK
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white text-center">
            Engineered to <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 bg-clip-text text-transparent">Capture, Book, and Scale.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-center font-normal leading-relaxed">
            Three production-grade automation systems designed to eliminate lead drop-off, qualify inbound intent, and streamline operations 24/7.
          </p>
        </div>

        {/* 3 EQUAL SERVICE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {services.map((card) => (
            <div
              key={card.id}
              className="glass-panel rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-all duration-300 shadow-xl shadow-black/5 dark:shadow-black/20 hover:shadow-2xl"
            >
              <div>
                {/* Card Header Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#FF6B00] font-semibold px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20">
                    {card.badgeTag}
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-white/5 text-zinc-400">
                    {card.demoType === 'voice' && <Phone className="w-4 h-4 text-[#FF6B00]" />}
                    {card.demoType === 'whatsapp' && <MessageSquare className="w-4 h-4 text-emerald-500" />}
                    {card.demoType === 'software' && <Code2 className="w-4 h-4 text-purple-400" />}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 font-normal">
                  {card.description}
                </p>

                {/* Checklist */}
                <div className="space-y-3 mb-8">
                  {card.checklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-left">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center bg-[#818CF8]/15 text-[#818CF8] shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm font-normal text-zinc-700 dark:text-zinc-300 leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Demo Action Button (Flush at bottom) */}
              <div className="mt-auto pt-4 border-t border-zinc-200/60 dark:border-white/5 w-full">
                {card.demoType === 'voice' && (
                  <button
                    type="button"
                    onClick={() => setActiveDemo('voice')}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-medium tracking-wide border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Listen to Voice Demo →
                  </button>
                )}

                {card.demoType === 'whatsapp' && (
                  <button
                    type="button"
                    onClick={() => setActiveDemo('whatsapp')}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-medium tracking-wide border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    View WhatsApp Flow →
                  </button>
                )}

                {card.demoType === 'software' && (
                  <button
                    type="button"
                    onClick={() => setActiveDemo('software')}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-medium tracking-wide border border-zinc-300 dark:border-white/15 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Explore Custom Systems →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* EXECUTIVE BOTTOM CONVERSION DOCK */}
        <div className="mt-14 max-w-2xl mx-auto px-4">
          <div className="relative group rounded-full p-[1px] bg-gradient-to-r from-purple-500/20 via-white/10 to-purple-500/20 hover:from-purple-500/40 hover:via-white/20 hover:to-purple-500/40 transition-all duration-500 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 rounded-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/60 dark:border-white/5">
              
              {/* Left indicator & text */}
              <div className="flex items-center gap-3 text-left">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]" />
                </span>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium">
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
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold tracking-wide transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm shadow-purple-500/30 whitespace-nowrap cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-zinc-900 border border-white/15 p-6 sm:p-8 shadow-2xl text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-[#FF6B00] flex items-center justify-center">
                  {activeDemo === 'voice' && <Phone className="w-4 h-4" />}
                  {activeDemo === 'whatsapp' && <MessageSquare className="w-4 h-4 text-emerald-400" />}
                  {activeDemo === 'software' && <Code2 className="w-4 h-4 text-purple-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-base text-zinc-100">
                    {activeDemo === 'voice' && 'Live AI Voice Receptionist Demo'}
                    {activeDemo === 'whatsapp' && 'Instant WhatsApp Booking Flow Demo'}
                    {activeDemo === 'software' && 'Custom High-Compute Systems Demo'}
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400">
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
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* DEMO 1: VOICE */}
            {activeDemo === 'voice' && (
              <div className="space-y-5">
                {/* Audio Waveform Player Simulation */}
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
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
                      className="w-12 h-12 rounded-full bg-[#FF6B00] hover:bg-[#e05e00] flex items-center justify-center text-white transition-all hover:scale-105 cursor-pointer shadow-lg shadow-orange-500/30"
                    >
                      {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <div className="flex-1 flex items-center gap-1 h-8">
                      {[30, 60, 45, 80, 95, 70, 40, 65, 85, 100, 75, 50, 85, 60, 40, 70, 90, 80, 50, 35, 60, 85, 70, 45, 65, 90, 75, 40].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-white/20 rounded-full transition-all duration-150"
                          style={{
                            height: isPlayingAudio ? `${Math.max(15, (h * Math.sin((i + Date.now() / 200))))}%` : `${h * 0.4}%`,
                            backgroundColor: isPlayingAudio ? '#FF6B00' : 'rgba(255,255,255,0.2)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Call Transcript Preview */}
                <div className="p-4 rounded-2xl bg-zinc-950/50 border border-white/5 space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-zinc-500 shrink-0 font-bold">CALLER:</span>
                    <span className="text-zinc-300">"Hey, we're doing about $400k/mo and losing leads because nobody picks up after 6 PM."</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-[#FF6B00] shrink-0 font-bold">AI AGENT:</span>
                    <span className="text-zinc-100">"Understood. Our voice architecture guarantees under 5-second pickup 24/7. Would tomorrow at 11:30 AM EST work to configure your test line?"</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-emerald-400 font-mono">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>Meeting Confirmed: Calendar Invite Sent & Logged to CRM</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDemo(null);
                    onOpenQuoteModal?.('AI Voice Receptionists');
                  }}
                  className="w-full py-3 rounded-xl bg-[var(--theme-primary,#dc2626)] hover:brightness-110 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Deploy Voice Agent For Your Team</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* DEMO 2: WHATSAPP */}
            {activeDemo === 'whatsapp' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-[#0b141a] border border-white/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-zinc-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Zavian WhatsApp Concierge (Verified)
                    </span>
                    <span>Response: 12 seconds</span>
                  </div>

                  {/* Message 1 */}
                  <div className="bg-[#1f2c34] p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-zinc-200">
                    Hi! Welcome to Zavian Labs. 👋 I can help you lock in qualified leads 24/7. What industry is your business in?
                    <div className="text-[10px] text-zinc-400 text-right mt-1 font-mono">10:02 AM · Sent</div>
                  </div>

                  {/* Message 2 */}
                  <div className="bg-[#005c4b] p-3 rounded-2xl rounded-tr-sm max-w-[85%] ml-auto text-white">
                    Private Wealth Management. We have high-ticket investors inquiring nightly.
                    <div className="text-[10px] text-emerald-200 text-right mt-1 font-mono">10:02 AM · Read</div>
                  </div>

                  {/* Message 3 */}
                  <div className="bg-[#1f2c34] p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-zinc-200">
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
                <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-white/10">
                    <span className="text-purple-400 flex items-center gap-1.5 font-bold">
                      <Terminal className="w-3.5 h-3.5" />
                      ZAVIAN ENGINE // CORE CLUSTER
                    </span>
                    <span className="text-emerald-400">STATUS: HEALTHY</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-zinc-500">API LATENCY</div>
                      <div className="text-base font-bold text-zinc-100">18.4ms</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-zinc-500">THROUGHPUT</div>
                      <div className="text-base font-bold text-zinc-100">4.8M ops/s</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[10px] text-zinc-500">LEAD CONV.</div>
                      <div className="text-base font-bold text-emerald-400">+41.2%</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-400 space-y-1 pt-2">
                    <div className="text-zinc-500">[15:10:02] Webhook received: inbound lead (GHL CRM)</div>
                    <div className="text-zinc-400">[15:10:03] Multi-agent parsing: intent score = 0.94 (Qualified)</div>
                    <div className="text-emerald-400">[15:10:04] Calendar invite dispatched & logged to Stripe</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDemo(null);
                    onOpenQuoteModal?.('Custom Software & Dashboards');
                  }}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30"
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
