'use client';

import React, { useState } from 'react';
import {
  Activity,
  Check,
  Calendar,
  Zap,
  Radio,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Cpu,
  Layers,
  Clock,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { ProjectSupportSectionData } from '@/lib/types';

interface Props {
  onOpenQuoteModal?: (serviceName: string) => void;
  content?: ProjectSupportSectionData;
}

const stages = [
  {
    id: 'stage-ingestion',
    kicker: 'INGESTION LAYER',
    title: 'Ad Webhooks & Multi-Channel Inbound',
    description:
      'High-throughput packet ingestion capturing ad clicks, form webhooks, and direct SIP calls into unified event queues.',
    signal: '200 OK · PACKET_CAPTURED',
  },
  {
    id: 'stage-triaging',
    kicker: 'AUTONOMOUS TRIAGE',
    title: 'Voice & WhatsApp Intent Qualification',
    description:
      'Multi-turn conversational triage filters low-intent queries, evaluates budget/urgency criteria, and scores prospects.',
    signal: '420MS · INTENT_CLASSIFIED',
  },
  {
    id: 'stage-handshake',
    kicker: 'PROTOCOL HANDSHAKE',
    title: 'Two-Way Calendar Lock & CRM Sync',
    description:
      'Direct calendar booking onto rep schedules with bi-directional webhook dispatch into HubSpot, GoHighLevel, and Slack.',
    signal: '200 OK · SLOT_CONFIRMED',
  },
  {
    id: 'stage-telemetry',
    kicker: 'SYSTEM TELEMETRY',
    title: 'Live Margin & Speed-to-Lead Telemetry',
    description:
      'Real-time metrics tracking latency, conversion velocity, CAC compression, and autonomous pipeline throughput.',
    signal: 'TELEMETRY_NOMINAL · 99.98%',
  },
];

export default function ProjectSupportSection({ onOpenQuoteModal, content }: Props) {
  const [activeStage, setActiveStage] = useState(0);

  const getStageSignal = (stageIndex: number) => {
    return stages[stageIndex]?.signal || '200 OK · NOMINAL';
  };

  const renderStageVisual = (stageIndex: number) => {
    switch (stageIndex) {
      case 0:
        // Stage 0: Ingestion Simulation (Ad webhook / Inbound call arrival packet)
        return (
          <div className="w-full max-w-md space-y-4 font-mono text-left">
            <div className="rounded-xl bg-zinc-900/90 dark:bg-zinc-900 border border-zinc-200/60 dark:border-white/10 p-4 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-400 font-semibold">POST /v1/events/inbound</span>
                </div>
                <span className="text-[10px] text-zinc-400">LATENCY: 18ms</span>
              </div>
              <div className="pt-3 space-y-1.5 text-xs">
                <p className="text-zinc-400">
                  <span className="text-purple-400">"channel"</span>: <span className="text-amber-300">"Meta Ads + Google Inbound"</span>,
                </p>
                <p className="text-zinc-400">
                  <span className="text-purple-400">"event"</span>: <span className="text-emerald-300">"lead_form_submitted"</span>,
                </p>
                <p className="text-zinc-400">
                  <span className="text-purple-400">"routing_target"</span>: <span className="text-[#FF6B00]">"Autonomous Queue 01"</span>,
                </p>
                <p className="text-zinc-400">
                  <span className="text-purple-400">"enrichment"</span>: <span className="text-sky-300">"Clearbit Verified (ARR: $2M+)"</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-[11px]">
              <span className="text-zinc-500 dark:text-zinc-400">Buffer Throughput: 1,420 pkts/s</span>
              <span className="text-emerald-500 font-semibold">● Zero Drop-off Rate</span>
            </div>
          </div>
        );

      case 1:
        // Stage 1: Triaging Simulation (Voice / WhatsApp prompt response flow)
        return (
          <div className="w-full max-w-md space-y-3 text-left">
            {/* Caller / User Chat Bubble */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-mono text-zinc-600 dark:text-zinc-300 shrink-0 mt-0.5">
                IN
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-white/5 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
                "We need an AI voice receptionist to capture after-hours calls and route qualified bookings."
              </div>
            </div>

            {/* AI Agent Analysis & Response */}
            <div className="flex items-start gap-2.5 flex-row-reverse">
              <div className="w-6 h-6 rounded-full bg-orange-500/20 text-[#FF6B00] flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                AI
              </div>
              <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/30 text-xs text-zinc-900 dark:text-white leading-relaxed">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-[#FF6B00] uppercase font-bold tracking-wider">
                    Tier-1 Match · Score 98%
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">380ms response</span>
                </div>
                "Perfect! We can deploy our low-latency receptionist pipeline with your Google Calendar today."
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
              <div className="p-2 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-center">
                <span className="text-zinc-400 block">INTENT CONFIDENCE</span>
                <span className="text-emerald-500 font-bold text-xs">98.4% HIGH</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-center">
                <span className="text-zinc-400 block">HUMAN OVERRIDE</span>
                <span className="text-[#FF6B00] font-bold text-xs">BYPASSED</span>
              </div>
            </div>
          </div>
        );

      case 2:
        // Stage 2: Handshake Simulation (Calendar slot lock & CRM webhook fire)
        return (
          <div className="w-full max-w-md space-y-3 font-mono text-left">
            <div className="rounded-xl p-4 bg-zinc-900 border border-purple-500/30 shadow-lg text-white">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-bold text-zinc-200">SLOT_LOCKED: Tomorrow @ 2:30 PM EST</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10">
                  CONFIRMED
                </span>
              </div>

              <div className="pt-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Calendar Invite Sent (Google / Cal.com)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>HubSpot Deal Created in "Qualified Pipeline"</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Slack Alert Dispatched to #deal-desk</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-[11px]">
              <span className="text-zinc-500 dark:text-zinc-400">Sync Velocity: 210ms</span>
              <span className="text-purple-400 font-semibold">● 100% Protocol Compliance</span>
            </div>
          </div>
        );

      case 3:
        // Stage 3: Telemetry Simulation (Illustrative margin telemetry comparison graph)
        return (
          <div className="w-full max-w-md space-y-3 text-left">
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block uppercase">Speed-to-Lead</span>
                <span className="text-base font-extrabold text-[#FF6B00]">3.2s</span>
                <span className="text-[9px] text-emerald-500 block">vs 4.2h Legacy</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block uppercase">Lead Capture</span>
                <span className="text-base font-extrabold text-emerald-500">+48%</span>
                <span className="text-[9px] text-zinc-400 block">24/7 Zero Miss</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block uppercase">OpEx Margin</span>
                <span className="text-base font-extrabold text-purple-400">+73%</span>
                <span className="text-[9px] text-purple-400/80 block">Zero Headcount</span>
              </div>
            </div>

            {/* Telemetry Visual Graph Simulation */}
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-[11px] space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-[10px] pb-1 border-b border-white/5">
                <span>CONVERSION THROUGHPUT</span>
                <span className="text-emerald-400">99.98% OPERATIONAL</span>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1 text-zinc-400">
                  <span>Traditional Sales Intake</span>
                  <span>18% capture</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-zinc-500 w-[18%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1 text-zinc-200">
                  <span className="text-[#FF6B00] font-semibold">ZAVIAN Deployable Architecture</span>
                  <span className="text-[#FF6B00] font-bold">86% capture</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF6B00] to-purple-500 w-[86%]" />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="project-support" className="relative py-28 px-4 sm:px-6 lg:px-12 z-10">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center mb-16 sm:mb-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400 mb-4 backdrop-blur-md">
            ● ARCHITECTURAL BLUEPRINT · SYSTEM TELEMETRY
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white text-center">
            Deployable Systems <span className="text-[#FF6B00]">Engineered for Scale.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-center font-normal leading-relaxed">
            {content?.subtitle ||
              'From instant lead capture to live profit dashboards, deploy automated systems built to scale your revenue without adding headcount.'}
          </p>
        </div>

        {/* ASYMMETRICAL 60/40 ARCHITECTURAL SIMULATION */}
        <div className="max-w-6xl mx-auto mt-14 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT CANVAS (60%): LIVE SIMULATION ENGINE */}
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-6 flex flex-col justify-between shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            {/* Console Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Illustrative Live Simulation
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase">
                STAGE 0{activeStage + 1} / 04
              </span>
            </div>

            {/* Stage Visual Display */}
            <div className="py-8 min-h-[300px] flex items-center justify-center">
              {renderStageVisual(activeStage)}
            </div>

            {/* Console Footer Status */}
            <div className="pt-4 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              <span>
                SIGNAL: <span className="text-[#FF6B00] font-semibold">{getStageSignal(activeStage)}</span>
              </span>
              <span>
                DISPATCH: <span className="text-zinc-700 dark:text-zinc-300">AUTOMATED</span>
              </span>
            </div>
          </div>

          {/* RIGHT EDITORIAL TRACK (40%): CLICKABLE STAGES */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-900/80 border-purple-500/40 shadow-sm dark:shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                      : 'bg-white/50 dark:bg-zinc-950/40 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
                      0{idx + 1} · {stage.kicker}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />}
                  </div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">{stage.title}</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">{stage.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CALL TO ACTION / MODAL TRIGGER */}
        <div className="mt-14 max-w-2xl mx-auto px-4">
          <div className="relative group rounded-full p-[1px] bg-gradient-to-r from-orange-500/20 via-white/10 to-orange-500/20 hover:from-orange-500/40 hover:via-white/20 hover:to-orange-500/40 transition-all duration-500 shadow-[0_0_30px_rgba(255,107,0,0.1)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 rounded-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/60 dark:border-white/5">
              <div className="flex items-center gap-3 text-left">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]" />
                </span>
                <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                  Ready to deploy these architectures into your operations?
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenQuoteModal) {
                    onOpenQuoteModal('Architectural Deployment');
                  } else {
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6B00] hover:bg-[#ff7b1a] text-black text-xs font-semibold tracking-wide transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm shadow-orange-500/30 whitespace-nowrap cursor-pointer"
              >
                <span>Request Custom Quote</span>
                <span className="text-black/80">↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
