"use client";

import React from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";

interface WorkflowPipelineSectionProps {
  onOpenQuoteModal?: (service: string) => void;
}

export default function WorkflowPipelineSection({
  onOpenQuoteModal,
}: WorkflowPipelineSectionProps) {
  return (
    <section
      id="workflow-pipeline"
      className="relative z-10 bg-transparent py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-neutral-900 dark:text-neutral-100 transition-colors duration-300"
    >
      {/* Editorial Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-sky-500/5 via-violet-500/5 to-emerald-500/5 blur-[120px] rounded-full dark:from-sky-500/10 dark:via-violet-500/10 dark:to-emerald-500/10" />
      </div>

      {/* 1. Section Header & Hierarchy */}
      <div className="max-w-3xl mb-12 sm:mb-16 relative z-10">
        <div className="text-[10px] font-mono tracking-widest uppercase text-sky-400 border border-sky-500/20 bg-sky-500/10 rounded-full px-3 py-1 inline-flex items-center gap-2 mb-4 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>LIVE WORKFLOW DEMONSTRATION</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-tight">
          The call ends. The automation doesn&apos;t.
        </h2>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 mt-2 font-medium">
          Voice → WhatsApp → Google Calendar. One seamless workflow.
        </p>
      </div>

      {/* 2. Three-Step Kinetic Pipeline (Desktop 3-Column / Mobile Stack) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* CARD 01: THE CALL */}
        <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between shadow-xl shadow-black/5 dark:shadow-black/25 hover:border-sky-500/30 dark:hover:border-sky-500/30 transition-all duration-300 group">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 font-semibold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                STEP 01 · VOICE
              </span>
              <span className="hidden md:flex items-center text-neutral-400 dark:text-neutral-600 group-hover:text-sky-400 transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono">
              01 — THE CALL
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
              Your AI receptionist handles the conversation.
            </p>
          </div>

          {/* Visual Container */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 dark:bg-neutral-950/80 p-5 backdrop-blur-md shadow-inner space-y-4">
            {/* Mini incoming call pill with active audio pulse */}
            <div className="flex items-center justify-between">
              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-xs rounded-full inline-flex items-center gap-2 font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>Live Intake · 00:24</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                Connected
              </span>
            </div>

            {/* Caller intake summary */}
            <div className="pt-3 border-t border-neutral-800/80 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-neutral-500">Caller:</span>
                <span className="text-neutral-200 font-medium">Sarah M.</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-neutral-500">Inquiry:</span>
                <span className="text-neutral-200">Invisalign Consultation</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-neutral-500">Slot Request:</span>
                <span className="text-neutral-200">Thu, Nov 12 @ 11:30 AM</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 pt-1.5 text-[11px] font-semibold border-t border-neutral-800/50">
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                <span>Requirement Qualified · Triggering Pipeline</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 02: THE MESSAGE */}
        <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between shadow-xl shadow-black/5 dark:shadow-black/25 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 group">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                STEP 02 · WHATSAPP
              </span>
              <span className="hidden md:flex items-center text-neutral-400 dark:text-neutral-600 group-hover:text-emerald-400 transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono">
              02 — THE MESSAGE
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
              Booking confirmation sent instantly on WhatsApp.
            </p>
          </div>

          {/* Visual Container: Same glassmorphism box */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 dark:bg-neutral-950/80 p-5 backdrop-blur-md shadow-inner space-y-3">
            {/* WhatsApp Top Bar with Green accent dot + timestamp */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>WhatsApp Business</span>
              </div>
              <span className="text-neutral-400 text-[10px]">Just now</span>
            </div>

            {/* WhatsApp-style incoming bubble */}
            <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-200 text-xs p-3.5 rounded-2xl rounded-tl-sm relative shadow-sm">
              <p className="leading-relaxed">
                &ldquo;Hi Sarah, your consultation at Apex Clinic is confirmed for Thursday, Nov 12 at 11:30 AM. Tap below if you need to reschedule.&rdquo;
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-emerald-400/80 font-mono">
                <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                  Reschedule / Modify
                </span>
                <div className="flex items-center gap-1 text-emerald-400">
                  <span>11:30 AM</span>
                  <span className="font-bold">✓✓</span>
                </div>
              </div>
            </div>

            {/* Outcome status */}
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span className="text-neutral-500">Dispatch Latency:</span>
              <span className="text-emerald-400 font-semibold">&lt; 1.5s post-call</span>
            </div>
          </div>
        </div>

        {/* CARD 03: THE CALENDAR */}
        <div className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between shadow-xl shadow-black/5 dark:shadow-black/25 hover:border-sky-500/30 dark:hover:border-sky-500/30 transition-all duration-300 group">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-sky-600 dark:text-sky-400 font-semibold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                STEP 03 · CALENDAR
              </span>
              <span className="hidden md:flex items-center text-neutral-400 dark:text-neutral-600 group-hover:text-sky-400 transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono">
              03 — THE CALENDAR
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
              Appointment added to Google Calendar.
            </p>
          </div>

          {/* Visual Container: Same glassmorphism box */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 dark:bg-neutral-950/80 p-5 backdrop-blur-md shadow-inner space-y-3">
            {/* Sleek 2-row calendar event preview */}
            <div className="border-l-4 border-sky-400 bg-neutral-900/90 p-3 rounded-r-xl border-y border-r border-neutral-800 shadow-sm">
              {/* Row 1 */}
              <div className="text-xs font-semibold text-white flex items-center gap-1.5 font-mono">
                <span>📅</span>
                <span>Thu, Nov 12 · 11:30 AM - 12:15 PM</span>
              </div>
              {/* Row 2 */}
              <div className="text-xs text-neutral-300 mt-1 font-medium">
                Invisalign Intake Consultation (Sarah M.)
              </div>
            </div>

            {/* Status tag */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-[10px] font-mono text-sky-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span>Google Calendar Sync Verified</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                Auto-Synced
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
