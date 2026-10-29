'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  Check,
  PhoneCall,
  MessageSquare,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { ProjectSupportSectionData } from '@/lib/types';

interface Props {
  onOpenQuoteModal?: (serviceName: string) => void;
  content?: ProjectSupportSectionData;
}

const STAGES = [
  {
    id: 'stage-lead-capture',
    kicker: 'LEAD CAPTURE',
    title: 'Instant After-Hours Lead Capture',
    description:
      'Engage 100% of missed calls, ad submissions, and web visitors instantly with automated AI receptionists.',
    signal: 'LEAD_DETECTED · INSTANT_DISPATCH',
  },
  {
    id: 'stage-qualification',
    kicker: 'QUALIFICATION & BOOKING',
    title: 'Conversational Scheduling',
    description:
      'Multi-turn conversational dialogue qualifies prospect budget and intent, then provides live calendar slots.',
    signal: 'INTENT_QUALIFIED · SLOTS_OFFERED',
  },
  {
    id: 'stage-sync',
    kicker: 'AUTOMATED SYNC',
    title: 'Calendar & CRM Confirmation',
    description:
      'Instantly locks calendar slots and synchronizes contact details across HubSpot, GoHighLevel, and Slack with zero manual work.',
    signal: 'SLOT_LOCKED · CRM_SYNCHRONIZED',
  },
  {
    id: 'stage-telemetry',
    kicker: 'MEASURABLE RESULTS',
    title: 'Pipeline Telemetry & Analytics',
    description:
      'Live operational telemetry tracking speed-to-lead latency, after-hours retention, and pipeline margins in real time.',
    signal: 'TELEMETRY_NOMINAL · 99.98% UPTIME',
  },
];

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
            setActiveStage((curr) => (curr + 1) % STAGES.length);
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

  const handleStageSelect = (idx: number) => {
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

  const togglePause = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    setIsPaused(!isPaused);
  };

  const currentStage = STAGES[activeStage] || STAGES[0];

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
        <div className="max-w-6xl mx-auto mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT CANVAS (60%): LIVE SIMULATION ENGINE */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#0c0c12] border border-zinc-200/90 dark:border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-zinc-200/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] min-h-[560px] transition-colors">
            
            {/* Console Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400 font-semibold">
                    Live System Simulation
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                    · STAGE 0{activeStage + 1} / 04
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePause}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>RESUME</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-2.5 h-2.5 fill-current" />
                        <span>PAUSE</span>
                      </>
                    )}
                  </button>

                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/5">
                    {isPaused ? 'PAUSED' : 'AUTOPLAY'}
                  </span>
                </div>
              </div>

              {/* Autoplay Progress Line */}
              <div className="w-full h-1 bg-zinc-100 dark:bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B00] to-purple-500 transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* VISIBLE SVG PIPELINE (Step Indicator) */}
              <div className="py-4 px-2 border-b border-zinc-200/80 dark:border-white/10">
                <div className="relative flex items-center justify-between">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-zinc-200 dark:bg-white/10 -z-0" />
                  <div
                    className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#FF6B00] to-purple-500 transition-all duration-300 -z-0"
                    style={{ width: `${(activeStage / 3) * 92}%` }}
                  />

                  {STAGES.map((stg, i) => {
                    const isCurrent = activeStage === i;
                    const isPassed = activeStage > i;

                    return (
                      <button
                        key={stg.id}
                        type="button"
                        onClick={() => handleStageSelect(i)}
                        className="relative z-10 flex flex-col items-center group cursor-pointer"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                            isCurrent
                              ? 'bg-[#FF6B00] text-black shadow-lg shadow-orange-500/30 scale-110 ring-4 ring-orange-500/20'
                              : isPassed
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/10 group-hover:border-zinc-300'
                          }`}
                        >
                          {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `0${i + 1}`}
                        </div>
                        <span
                          className={`text-[9px] font-mono uppercase tracking-wider mt-1.5 transition-colors hidden sm:block ${
                            isCurrent
                              ? 'text-[#FF6B00] font-bold'
                              : 'text-zinc-400 dark:text-zinc-500'
                          }`}
                        >
                          {stg.kicker.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STAGE VISUAL DISPLAY (FULL SCALE) */}
            <div className="my-auto py-6 w-full flex items-center justify-center">
              
              {/* STAGE 01: LEAD CAPTURE */}
              {activeStage === 0 && (
                <div className="w-full max-w-lg space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 p-5 sm:p-6 shadow-sm dark:shadow-2xl">
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
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                          Prospect: Direct caller inquiring about commercial property automation
                        </p>
                        <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mt-2">
                          Origin: +1 (415) 890-XXXX · San Francisco, CA
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-zinc-200/80 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>AI Trigger: Instant Sub-5s Call Pickup</span>
                      </div>
                      <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">Zero Staff Delay</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 text-center">
                      <span className="text-zinc-400 block text-[10px]">RESPONSE LATENCY</span>
                      <span className="text-zinc-900 dark:text-white font-bold text-sm">1.8 Seconds</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 text-center">
                      <span className="text-zinc-400 block text-[10px]">DROP-OFF PREVENTION</span>
                      <span className="text-emerald-500 font-bold text-sm">100% Engaged</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 02: CONVERSATIONAL QUALIFICATION */}
              {activeStage === 1 && (
                <div className="w-full max-w-lg space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 p-5 shadow-sm dark:shadow-2xl space-y-3 text-left">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-zinc-200/80 dark:border-white/5">
                      <span>MULTI-TURN CONVERSATION</span>
                      <span className="text-[#8B5CF6]">LATENCY: 420MS</span>
                    </div>

                    {/* AI Prompt */}
                    <div className="bg-white dark:bg-zinc-800/80 rounded-2xl rounded-tl-sm p-3.5 text-xs text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-white/5 leading-relaxed shadow-sm">
                      "Hi Sarah! Thanks for reaching out to Apex. I see you're interested in our custom automated booking pipeline. We have calendar openings tomorrow at 10:00 AM or 2:30 PM. Which works best for you?"
                    </div>

                    {/* User Reply */}
                    <div className="bg-[#8B5CF6]/15 dark:bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 rounded-2xl rounded-tr-sm p-3.5 text-xs text-purple-900 dark:text-purple-200 ml-auto max-w-[85%] text-right font-medium">
                      "Tomorrow at 10:00 AM works perfectly for our team!"
                    </div>

                    {/* Live Slot Selection Chips */}
                    <div className="pt-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                        Detected Slot Selection
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Tomorrow · 10:00 AM EST (Confirmed)</span>
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-400 font-mono text-xs line-through">
                          Tomorrow · 2:30 PM EST
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 03: AUTOMATED SYNC & CALENDAR LOCK */}
              {activeStage === 2 && (
                <div className="w-full max-w-lg space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 p-5 sm:p-6 shadow-sm dark:shadow-2xl text-left">
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center font-bold text-xl shrink-0">
                        <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-zinc-900 dark:text-white">
                          Appointment Confirmed &amp; Dispatched
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Tomorrow · 10:00 AM EST (Google Calendar &amp; Cal.com)
                        </p>
                      </div>
                    </div>

                    {/* 4 Multi-Channel Sync Checks */}
                    <div className="space-y-2.5 pt-3 border-t border-zinc-200/80 dark:border-white/5 text-xs font-mono">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/5">
                        <span className="text-zinc-700 dark:text-zinc-300">✓ Calendar Invite Sent (Cal.com / Google)</span>
                        <span className="text-emerald-500 font-bold">LOCKED</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/5">
                        <span className="text-zinc-700 dark:text-zinc-300">✓ HubSpot CRM Deal Stage: "Discovery Booked"</span>
                        <span className="text-purple-400 font-bold">SYNCED</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/5">
                        <span className="text-zinc-700 dark:text-zinc-300">✓ Slack Notification Dispatched to #deal-desk</span>
                        <span className="text-emerald-500 font-bold">NOTIFIED</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-white/5 flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                      <span>Sync Latency: 210ms</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Zero Staff Effort
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 04: FULL TELEMETRY & ANALYTICS DASHBOARD */}
              {activeStage === 3 && (
                <div className="w-full max-w-lg space-y-4 animate-in fade-in zoom-in-95 duration-200 text-left">
                  
                  {/* Dashboard Header with Illustrative Demo Data Tag */}
                  <div className="flex items-center justify-between text-xs font-mono pb-1">
                    <span className="text-zinc-600 dark:text-zinc-300 font-semibold">
                      PIPELINE CONVERSION TELEMETRY
                    </span>
                    <span className="text-[10px] font-mono text-[#FF6B00] bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                      Illustrative Demo Data
                    </span>
                  </div>

                  {/* 3 KPI Metric Tiles */}
                  <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                    <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10">
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">
                        Response Speed
                      </p>
                      <p className="text-base sm:text-lg font-bold text-emerald-500 mt-0.5">
                        &lt; 45s
                      </p>
                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500">
                        vs 4.2h manual
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10">
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">
                        Lead Retention
                      </p>
                      <p className="text-base sm:text-lg font-bold text-[#FF6B00] mt-0.5">
                        +38.4%
                      </p>
                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500">
                        after-hours capture
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10">
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">
                        Lead-to-Call
                      </p>
                      <p className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                        64.2%
                      </p>
                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500">
                        calendar lock
                      </p>
                    </div>
                  </div>

                  {/* SVG Revenue / Lead Trend Line Chart */}
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10">
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Monthly Pipeline Volume Trend
                      </span>
                      <span className="text-emerald-500 font-semibold text-[11px]">
                        ▲ +$34,200 Pipeline
                      </span>
                    </div>

                    <div className="relative h-24 w-full">
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 300 80"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Background Grid Lines */}
                        <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />

                        {/* Area Fill */}
                        <path
                          d="M 0 65 Q 60 55, 100 45 T 200 30 T 300 12 L 300 80 L 0 80 Z"
                          fill="url(#trendGradient)"
                        />

                        {/* Trend Curve */}
                        <path
                          d="M 0 65 Q 60 55, 100 45 T 200 30 T 300 12"
                          fill="none"
                          stroke="#FF6B00"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Key Data Points */}
                        <circle cx="100" cy="45" r="3.5" fill="#FF6B00" />
                        <circle cx="200" cy="30" r="3.5" fill="#8B5CF6" />
                        <circle cx="300" cy="12" r="4.5" fill="#10B981" />
                      </svg>
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-2 pt-1 border-t border-zinc-200/80 dark:border-white/5">
                      <span>Week 01</span>
                      <span>Week 02</span>
                      <span>Week 03</span>
                      <span className="text-zinc-700 dark:text-zinc-200 font-bold">Week 04 (Current)</span>
                    </div>
                  </div>

                  {/* Conversion Comparison Bars */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 space-y-2">
                    <div className="flex justify-between text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                      <span>Traditional Manual Intake</span>
                      <span className="text-zinc-500 font-semibold">18% conversion</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-zinc-400 dark:bg-zinc-600 w-[18%]" />
                    </div>

                    <div className="flex justify-between text-[11px] font-mono text-zinc-900 dark:text-zinc-200 pt-1">
                      <span className="text-[#FF6B00] font-semibold">ZAVIAN Autonomous Pipeline</span>
                      <span className="text-emerald-500 font-bold">68% conversion</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#FF6B00] to-purple-500 w-[68%]" />
                    </div>
                  </div>

                  <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 text-center">
                    * Figures shown are Illustrative Demo Data based on typical production pipeline benchmarks.
                  </p>
                </div>
              )}
            </div>

            {/* Console Footer Status */}
            <div className="pt-4 border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span>SIGNAL:</span>
                <span className="text-[#FF6B00] font-semibold">{currentStage.signal}</span>
              </span>
              <span>DISPATCH: <span className="text-zinc-800 dark:text-zinc-300 font-medium">AUTOMATED</span></span>
            </div>
          </div>

          {/* RIGHT EDITORIAL TRACK (40%): CLICKABLE STAGES */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            {STAGES.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleStageSelect(idx)}
                  className={`w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    isActive
                      ? 'bg-zinc-50 dark:bg-[#12121c] border-purple-500/60 shadow-lg shadow-purple-500/10 dark:shadow-[0_0_25px_rgba(139,92,246,0.18)] scale-[1.01]'
                      : 'bg-white dark:bg-[#0c0c12]/60 border-zinc-200/90 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15 hover:bg-zinc-50 dark:hover:bg-[#101018]'
                  }`}
                >
                  {/* Subtle active border indicator */}
                  {isActive && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#FF6B00] to-[#8B5CF6]" />
                  )}

                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 dark:text-zinc-400 font-semibold">
                      0{idx + 1} · {stage.kicker}
                    </span>
                    {isActive && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]" />
                      </span>
                    )}
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-2 tracking-tight">
                    {stage.title}
                  </h4>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed font-normal">
                    {stage.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CALL TO ACTION DOCK */}
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
      </div>
    </section>
  );
}
