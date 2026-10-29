'use client';

import React, { useState } from 'react';
import { ProjectSupportSectionData } from '@/lib/types';

interface Props {
  onOpenQuoteModal?: (serviceName: string) => void;
  content?: ProjectSupportSectionData;
}

const stages = [
  {
    id: 'stage-ingestion',
    kicker: 'LEAD CAPTURE',
    title: 'Instant After-Hours Lead Capture',
    description:
      'Capture 100% of missed calls, after-hours web inquiries, and ad form fills with instant automated engagement.',
    signal: 'ACTIVE · INSTANT FOLLOW-UP',
  },
  {
    id: 'stage-triaging',
    kicker: 'QUALIFICATION & BOOKING',
    title: 'Conversational Scheduling',
    description:
      'Natural two-way dialogue engages prospects immediately, answers questions, and offers available meeting slots.',
    signal: 'ACTIVE · APPOINTMENT SELECTED',
  },
  {
    id: 'stage-handshake',
    kicker: 'AUTOMATED SYNC',
    title: 'Calendar & CRM Confirmation',
    description:
      'Instantly locks appointments directly onto your Google or Outlook Calendar and updates your CRM with zero staff effort.',
    signal: 'ACTIVE · ZERO STAFF EFFORT',
  },
  {
    id: 'stage-telemetry',
    kicker: 'MEASURABLE RESULTS',
    title: '24/7 Response & Revenue Impact',
    description:
      'Eliminate lead drop-off completely with sub-60 second follow-up times and continuous 24/7 coverage.',
    signal: 'NOMINAL · 100% COVERAGE',
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
        // Stage 0: Lead Capture Simulation (Clean client-friendly incoming inquiry card)
        return (
          <div className="w-full max-w-sm rounded-xl bg-zinc-900 border border-white/10 p-5 shadow-2xl text-left">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
                <span>INCOMING INQUIRY</span>
              </span>
              <span>8:42 PM (After Hours)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] font-bold text-lg">
                📞
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Missed Inbound Call</p>
                <p className="text-xs text-zinc-400">Prospect: Inquiring about services</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span>AI Trigger: Instant Follow-up</span>
              <span>Status: Active</span>
            </div>
          </div>
        );

      case 1:
        // Stage 1: Conversational Follow-up / Appointment Selection Flow
        return (
          <div className="w-full max-w-sm space-y-3 text-left">
            <div className="bg-zinc-800/80 rounded-2xl rounded-tl-sm p-3.5 text-xs text-zinc-200 border border-white/5">
              "Hi Sarah! Thanks for reaching out. We have an opening tomorrow at 10:00 AM or 2:30 PM. Which works best for you?"
            </div>
            <div className="bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 rounded-2xl rounded-tr-sm p-3.5 text-xs text-purple-200 ml-auto max-w-[80%] text-right">
              "Tomorrow at 10:00 AM works perfectly!"
            </div>
          </div>
        );

      case 2:
        // Stage 2: Handshake / Appointment Confirmed
        return (
          <div className="w-full max-w-sm rounded-xl bg-zinc-900 border border-white/10 p-5 shadow-2xl text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <p className="text-sm font-bold text-white">Appointment Confirmed</p>
                <p className="text-xs text-zinc-400">Tomorrow · 10:00 AM (Google Calendar)</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-[11px] text-zinc-400">
              <span>Synced to CRM</span>
              <span className="text-emerald-400">Zero Staff Effort</span>
            </div>
          </div>
        );

      case 3:
        // Stage 3: Telemetry / Live Impact Metrics
        return (
          <div className="w-full max-w-sm rounded-xl bg-zinc-900 border border-white/10 p-5 grid grid-cols-2 gap-4 text-left">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-[10px] text-zinc-400 uppercase">Response Time</p>
              <p className="text-lg font-bold text-emerald-400">Under 60s</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-[10px] text-zinc-400 uppercase">Leads Saved</p>
              <p className="text-lg font-bold text-white">100% 24/7</p>
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
