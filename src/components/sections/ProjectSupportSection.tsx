'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  PhoneCall,
  Check,
} from 'lucide-react';
import { ProjectSupportSectionData } from '@/lib/types';

interface Props {
  onOpenQuoteModal?: (serviceName: string) => void;
  content?: ProjectSupportSectionData;
}

const stages = [
  {
    id: 'stage-lead-capture',
    kicker: 'LEAD CAPTURE',
    title: 'Instant After-Hours Lead Capture',
    description:
      'Capture 100% of missed calls, after-hours web inquiries, and ad form fills with instant automated engagement.',
  },
  {
    id: 'stage-qualification',
    kicker: 'QUALIFICATION & BOOKING',
    title: 'Conversational Scheduling',
    description:
      'Natural two-way dialogue engages prospects immediately, answers questions, and offers available meeting slots.',
  },
  {
    id: 'stage-sync',
    kicker: 'AUTOMATED SYNC',
    title: 'Calendar & CRM Confirmation',
    description:
      'Instantly locks appointments directly onto your Google or Outlook Calendar and updates your CRM with zero staff effort.',
  },
  {
    id: 'stage-telemetry',
    kicker: 'MEASURABLE RESULTS',
    title: 'Pipeline Telemetry & Analytics',
    description:
      'Live operational telemetry tracking speed-to-lead latency, after-hours retention, and pipeline margins in real time.',
  },
];

function StageOneCaptureView() {
  return (
    <div className="w-full max-w-md space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 p-5 sm:p-6 shadow-sm dark:shadow-2xl text-left">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-4 pb-3 border-b border-zinc-200/80 dark:border-white/5 font-mono">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
            <span className="text-[#FF6B00] font-semibold">● INCOMING INQUIRY</span>
          </span>
          <span>8:42 PM · After Hours</span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] font-bold text-xl shrink-0">
            <PhoneCall className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-zinc-900 dark:text-white">
                Missed Inbound Call
              </p>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                VOICE QUEUE
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Prospect: Inquiring about automation pipeline deployment
            </p>
            <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mt-2">
              Origin: +1 (415) 890-XXXX · Direct SIP
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-200/80 dark:border-white/5 flex items-center justify-between text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            AI Trigger: Instant Sub-5s Call Pickup
          </span>
          <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">Status: Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 text-center">
          <span className="text-zinc-400 block text-[10px]">RESPONSE TIME</span>
          <span className="text-emerald-500 font-bold text-sm">Under 60s</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 text-center">
          <span className="text-zinc-400 block text-[10px]">DROP-OFF PREVENTION</span>
          <span className="text-zinc-900 dark:text-white font-bold text-sm">Zero Delay</span>
        </div>
      </div>
    </div>
  );
}

function StageTwoTriageView() {
  return (
    <div className="w-full max-w-md space-y-3.5 animate-in fade-in zoom-in-95 duration-200 text-left">
      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 p-5 sm:p-6 shadow-sm dark:shadow-2xl space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-zinc-200/80 dark:border-white/5">
          <span>NATURAL LANGUAGE TRIAGE</span>
          <span className="text-[#8B5CF6]">LATENCY: 420MS</span>
        </div>

        <div className="bg-white dark:bg-zinc-800/80 rounded-2xl rounded-tl-sm p-3.5 text-xs text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-white/5 leading-relaxed shadow-sm">
          "Hi Sarah! Thanks for reaching out. We have an opening tomorrow at 10:00 AM or 2:30 PM. Which works best for you?"
        </div>

        <div className="bg-[#8B5CF6]/15 dark:bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 rounded-2xl rounded-tr-sm p-3.5 text-xs text-purple-900 dark:text-purple-200 ml-auto max-w-[85%] text-right font-medium">
          "Tomorrow at 10:00 AM works perfectly!"
        </div>

        <div className="pt-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
            Detected Slot Selection
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Tomorrow · 10:00 AM EST (Committed)</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-400 font-mono text-xs line-through">
              Tomorrow · 2:30 PM EST
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageThreeBookingView() {
  return (
    <div className="w-full max-w-md space-y-3.5 animate-in fade-in zoom-in-95 duration-200 text-left">
      <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 p-5 sm:p-6 shadow-sm dark:shadow-2xl">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center font-bold text-xl shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-base font-bold text-zinc-900 dark:text-white">
              Appointment Confirmed
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Tomorrow · 10:00 AM (Google Calendar)
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-zinc-200/80 dark:border-white/5 text-xs font-mono">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/5">
            <span className="text-zinc-700 dark:text-zinc-300">✓ Calendar Invite Dispatched (Google Calendar)</span>
            <span className="text-emerald-500 font-bold">LOCKED</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/5">
            <span className="text-zinc-700 dark:text-zinc-300">✓ CRM Deal Created in Qualified Pipeline</span>
            <span className="text-purple-400 font-bold">SYNCED</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-white/5 flex justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
          <span>Synced to CRM</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Zero Staff Effort</span>
        </div>
      </div>
    </div>
  );
}

function StageFourTelemetryDashboard() {
  return (
    <div className="w-full max-w-md space-y-3.5 animate-in fade-in zoom-in-95 duration-200 text-left">
      {/* 3 KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center font-mono">
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Response Time</p>
          <p className="text-base sm:text-lg font-bold text-emerald-500 mt-0.5">Under 60s</p>
          <p className="text-[9px] text-zinc-400 dark:text-zinc-500">24/7 autonomous</p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Lead Retention</p>
          <p className="text-base sm:text-lg font-bold text-[#FF6B00] mt-0.5">+38.4%</p>
          <p className="text-[9px] text-zinc-400 dark:text-zinc-500">after-hours saved</p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 col-span-2 sm:col-span-1">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Lead-to-Call</p>
          <p className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">64.2%</p>
          <p className="text-[9px] text-zinc-400 dark:text-zinc-500">direct booking</p>
        </div>
      </div>

      {/* Trend Line Chart */}
      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-zinc-600 dark:text-zinc-400">Monthly Lead Trend</span>
          <span className="text-emerald-500 font-semibold text-[11px]">▲ +$34,200 Pipeline</span>
        </div>

        <div className="relative h-20 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 70" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="18" x2="300" y2="18" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
            <line x1="0" y1="45" x2="300" y2="45" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
            <path d="M 0 58 Q 60 50, 100 40 T 200 25 T 300 10 L 300 70 L 0 70 Z" fill="url(#trendGradient)" />
            <path d="M 0 58 Q 60 50, 100 40 T 200 25 T 300 10" fill="none" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="100" cy="40" r="3.5" fill="#FF6B00" />
            <circle cx="200" cy="25" r="3.5" fill="#8B5CF6" />
            <circle cx="300" cy="10" r="4.5" fill="#10B981" />
          </svg>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-2 pt-1 border-t border-zinc-200/80 dark:border-white/5">
          <span>Week 01</span>
          <span>Week 02</span>
          <span>Week 03</span>
          <span className="text-zinc-700 dark:text-zinc-200 font-bold">Week 04 (Current)</span>
        </div>
      </div>

      {/* Conversion Bars */}
      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
          <span>Traditional Intake</span>
          <span className="text-zinc-500 font-semibold">18% conversion</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
          <div className="h-full bg-zinc-400 dark:bg-zinc-600 w-[18%]" />
        </div>

        <div className="flex justify-between text-[11px] font-mono text-zinc-900 dark:text-zinc-200 pt-1">
          <span className="text-[#FF6B00] font-semibold">ZAVIAN Autonomous Pipeline</span>
          <span className="text-emerald-500 font-bold">68% conversion</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FF6B00] to-purple-500 w-[68%]" />
        </div>
      </div>

      <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 text-center">
        * Figures shown are Illustrative Demo Data based on typical production pipeline benchmarks.
      </p>
    </div>
  );
}

export default function ProjectSupportSection({ onOpenQuoteModal, content }: Props) {
  const [activeStage, setActiveStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100%

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reliable Autoplay Animation Loop with proper cleanup
  useEffect(() => {
    const STAGE_DURATION_MS = 6500;
    const TICK_MS = 50;
    const increment = (TICK_MS / STAGE_DURATION_MS) * 100;

    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        setProgress((prev) => {
          if (prev + increment >= 100) {
            setActiveStage((curr) => (curr + 1) % stages.length);
            return 0;
          }
          return prev + increment;
        });
      }
    }, TICK_MS);

    return () => {
      clearInterval(interval);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  const handleManualSelect = (idx: number) => {
    setActiveStage(idx);
    setProgress(0);
    setIsPaused(true);

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    // Resume autoplay after 8 seconds of inactivity
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  };

  return (
    <section id="project-support" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400 mb-4 backdrop-blur-md">
          ● ARCHITECTURAL BLUEPRINT · SYSTEM TELEMETRY
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Deployable Systems <span className="text-[#FF6B00]">Engineered for Scale.</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
          {content?.subtitle ||
            'From instant lead capture to live profit dashboards, deploy automated systems built to scale your revenue without adding headcount.'}
        </p>
      </div>

      {/* 60/40 Asymmetrical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT CONSOLE (60%): Interactive Engine Canvas */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-sm dark:shadow-2xl transition-colors">
          
          {/* Console Topbar */}
          <div className="flex items-center justify-between pb-5 border-b border-zinc-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                System Workflow Engine
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ILLUSTRATIVE DEMO</span>
            </div>
          </div>

          {/* Main Simulation Viewport (Fills available space) */}
          <div className="py-8 min-h-[360px] flex items-center justify-center">
            {activeStage === 0 && <StageOneCaptureView />}
            {activeStage === 1 && <StageTwoTriageView />}
            {activeStage === 2 && <StageThreeBookingView />}
            {activeStage === 3 && <StageFourTelemetryDashboard />}
          </div>

          {/* Console Status Footer */}
          <div className="pt-5 border-t border-zinc-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span>ACTIVE SIGNAL:</span>
              <span className="text-[#FF6B00] font-semibold">
                {activeStage === 0 && 'INBOUND_EVENT_DETECTED'}
                {activeStage === 1 && 'NATURAL_LANGUAGE_TRIAGE'}
                {activeStage === 2 && 'CALENDAR_SLOT_COMMITTED'}
                {activeStage === 3 && 'TELEMETRY_STREAM_UPDATED'}
              </span>
            </div>
            <span>MODE: <span className="text-zinc-800 dark:text-zinc-200 font-medium">AUTONOMOUS</span></span>
          </div>
        </div>

        {/* RIGHT TRACK (40%): Editorial Stage Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => handleManualSelect(idx)}
                className={`relative overflow-hidden w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-zinc-50 dark:bg-zinc-900 border-[#8B5CF6]/50 shadow-md dark:shadow-purple-500/10'
                    : 'bg-white dark:bg-zinc-950/40 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15'
                }`}
              >
                {/* Smooth purple progress indicator */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 h-[2px] bg-[#8B5CF6] transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                )}

                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
                    0{idx + 1} · {stage.kicker}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                  )}
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                  {stage.title}
                </h3>
                
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {stage.description}
                </p>
              </button>
            );
          })}
        </div>

      </div>

      {/* BOTTOM CONVERSION DOCK */}
      <div className="mt-14 max-w-2xl mx-auto px-4">
        <div className="relative group rounded-full p-[1px] bg-gradient-to-r from-orange-500/20 via-white/10 to-orange-500/20 hover:from-orange-500/40 hover:via-white/20 hover:to-orange-500/40 transition-all duration-500 shadow-[0_0_30px_rgba(255,107,0,0.1)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 rounded-full bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/80 dark:border-white/5">
            <div className="flex items-center gap-3 text-left">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]" />
              </span>
              <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-300 font-medium">
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FF6B00] hover:bg-[#ff7b1a] text-black text-xs font-semibold tracking-wide transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm shadow-orange-500/30 whitespace-nowrap cursor-pointer"
            >
              <span>Request Custom Quote</span>
              <span className="text-black/80">↗</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
