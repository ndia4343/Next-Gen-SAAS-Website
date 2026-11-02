'use client';

import { useState, useEffect } from 'react';

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Instant Inbound Connection',
    desc: 'Answers within two rings with natural conversational pacing. No IVR menus, no robotic delays.',
    event: 'Inbound Call Connected (Sub-400ms Handshake)',
    status: 'ACTIVE',
  },
  {
    step: '02',
    title: 'Contextual Qualification',
    desc: 'Understands intent, checks service requirements, and quotes exact business terms without hallucinating.',
    event: 'Intent Identified: Consultation Intake',
    status: 'PARSED',
  },
  {
    step: '03',
    title: 'Real-Time Calendar Lock',
    desc: 'Validates live availability and writes the appointment directly into Google Calendar or your CRM.',
    event: 'Google Calendar API: Slot Reserved (Thu 11:30 AM)',
    status: 'SYNCED',
  },
  {
    step: '04',
    title: 'Autonomous Dispatch',
    desc: 'Sends instant WhatsApp confirmation to the caller and delivers full call audio + transcript to your team.',
    event: 'WhatsApp Webhook Dispatched: Confirmation Delivered',
    status: 'COMPLETED',
  },
];

interface VoicePipelineSectionProps {
  onBookCall?: () => void;
}

export function VoicePipelineSection({ onBookCall }: VoicePipelineSectionProps = {}) {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycling animation simulating real pipeline execution
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="voice-demo"
      className="relative z-10 py-24 bg-[#f8f9fb] dark:bg-[#07070a] text-neutral-900 dark:text-white transition-colors scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-cyan-400 text-xs font-mono mb-4">
            ● EVENT ORCHESTRATION PIPELINE
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            How inquiries turn into bookings —{' '}
            <span className="bg-gradient-to-r from-violet-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
              automatically.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
            Every call flows through a synchronized pipeline that qualifies prospects, checks your schedule, and triggers instant client updates.
          </p>
        </div>

        {/* 2-Column Layout: Connected Timeline + Live Event Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Connected Vertical Pipeline (No Cheap Box Borders) */}
          <div className="lg:col-span-6 relative pl-6 space-y-8">
            {/* Continuous Vertical Trace Line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-neutral-200 dark:bg-neutral-800" />

            {PIPELINE_STEPS.map((item, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(idx)}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    isActive ? 'opacity-100 translate-x-1' : 'opacity-50 hover:opacity-75'
                  }`}
                >
                  {/* Timeline Glowing Node */}
                  <div
                    className={`absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'border-violet-600 dark:border-cyan-400 bg-white dark:bg-neutral-950 ring-4 ring-violet-500/20 dark:ring-cyan-400/20'
                        : 'border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900'
                    }`}
                  />

                  {/* Step Text (Clean, Borderless Typography) */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-violet-600 dark:text-cyan-400">
                        {item.step}
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Event Orchestration Terminal */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-white dark:bg-[#0c0d14] border border-neutral-200/80 dark:border-neutral-800/80 p-6 sm:p-8 shadow-xl dark:shadow-2xl font-mono text-xs">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80 dark:border-neutral-800/80 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-neutral-500 dark:text-neutral-400 font-semibold text-[11px]">
                    pipeline-monitor.telemetry
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  LIVE STREAM
                </span>
              </div>

              {/* Event Logs Stream */}
              <div className="space-y-4">
                {PIPELINE_STEPS.map((item, idx) => {
                  const isCurrent = activeStep === idx;
                  const isPast = activeStep > idx;

                  return (
                    <div
                      key={item.step}
                      className={`p-3.5 rounded-xl border transition-all duration-300 ${
                        isCurrent
                          ? 'border-violet-500/40 bg-violet-50/50 dark:bg-violet-950/20 text-neutral-900 dark:text-white'
                          : isPast
                          ? 'border-neutral-200 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-900/20 text-neutral-600 dark:text-neutral-400'
                          : 'border-transparent opacity-40 text-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-neutral-500">
                          STAGE_{item.step}
                        </span>
                        <span
                          className={`font-bold ${
                            isCurrent
                              ? 'text-violet-600 dark:text-cyan-400 animate-pulse'
                              : isPast
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-neutral-400'
                          }`}
                        >
                          {isPast ? 'COMPLETED' : isCurrent ? 'EXECUTING...' : 'PENDING'}
                        </span>
                      </div>
                      <div className="text-neutral-800 dark:text-neutral-200 font-sans text-xs">
                        {item.event}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Execution Summary Footer */}
              <div className="mt-6 pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Latency: ~340ms</span>
                <span>Payload: 100% Synced</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default VoicePipelineSection;