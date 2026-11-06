"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PhoneCall, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCheck, 
  Check, 
  Clock, 
  Calendar, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
} from "lucide-react";

const BOOKING_URL = "https://calendar.app.google/u5vL88X41qmGBCky5";

interface HowItWorksSectionProps {
  onOpenQuoteModal?: (service: string) => void;
}

// ---------------------------------------------------------------------------
// STAGE 01 DATA: Audio Scrub Markers & Synchronized Transcripts
// ---------------------------------------------------------------------------
const VOICE_SCRUB_POINTS = [
  {
    id: 1,
    timeLabel: "0:05",
    timeSec: 5,
    tag: "Intent Stated",
    speaker: "Marcus Vance",
    text: "Hey, hope you're having a good week! Trying to see if we can grab a table for 4 tomorrow night around 8:30 or 9 PM?",
    intentBadge: "High Intent (VIP)",
    accent: "text-sky-400 border-sky-400/30 bg-sky-400/10",
  },
  {
    id: 2,
    timeLabel: "0:18",
    timeSec: 18,
    tag: "Preference Qualified",
    speaker: "Sarah • AI Clinical Receptionist",
    text: "Good afternoon Marcus! Tomorrow is packed with DIFC Art Night, but we have our prime skyline terrace open at 8:45 PM. Shall I reserve that?",
    intentBadge: "Floor Plan Evaluated",
    accent: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  },
  {
    id: 3,
    timeLabel: "0:32",
    timeSec: 32,
    tag: "WhatsApp Handoff",
    speaker: "System Dispatched",
    text: "Terrace 8:45 is held for 10 minutes. I've dispatched an instant WhatsApp link to your number to lock your deposit and valet pass.",
    intentBadge: "Omnichannel Forward",
    accent: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  },
];

// ---------------------------------------------------------------------------
// STAGE 02 DATA: WhatsApp Pipeline Conversation (Clinical Dental Intake)
// ---------------------------------------------------------------------------
interface Message {
  sender: "client" | "reception";
  text: string;
  time: string;
}

const WHATSAPP_CONVERSATION: Message[] = [
  {
    sender: "client",
    text: "Hi there! Looking to book an assessment for clear aligners or edge bonding. I work over in DIFC so my weekdays are pretty chaotic—do you do late slots after 5:30 PM, or is Saturday morning better?",
    time: "4:12 PM",
  },
  {
    sender: "reception",
    text: "Hi Farah! 👋 We completely understand the DIFC rush. We keep our clinic open until 7:30 PM on Wednesdays specifically for after-work consults. Dr. Thorne has a dedicated 45-minute window this Wednesday at 5:45 PM, or if you prefer a relaxed weekend visit, we have Saturday morning at 10:30 AM. Both slots include a 3D digital iTero scan so you can preview your smile simulation on screen. Would the Wednesday 5:45 PM work with your evening commute?",
    time: "4:12 PM",
  },
  {
    sender: "client",
    text: "Wednesday at 5:45 PM sounds ideal. Do you have valet downstairs or should I just grab a Careem? Also, can we discuss pricing during that same consult?",
    time: "4:13 PM",
  },
  {
    sender: "reception",
    text: "Yes! We have complimentary valet at the main lobby entrance—just let the attendant know you're visiting the clinic on Level 18. And yes, the doctor will walk you through the exact 3D plan and transparent package pricing right there. I'm holding Wednesday at 5:45 PM for you now. Just to make sure we set up your clinical chart correctly, have you had braces or aligners previously?",
    time: "4:14 PM",
  },
  {
    sender: "client",
    text: "Yes, had traditional train-tracks as a teenager, but stopped wearing the retainers so the bottom teeth have started crowding again.",
    time: "4:14 PM",
  },
  {
    sender: "reception",
    text: "Got it! That’s super common—we treat orthodontic relapse all the time. I've noted that on your intake file for Dr. Thorne. You are all locked into our clinic system! 🗓\n• Date & Time: Wednesday at 5:45 PM\n• Clinician: Dr. Thorne (Comprehensive Aesthetic Consult + 3D Scan)\n• Location: Level 18, Commercial Tower, Sheikh Zayed Road (Valet at Tower Lobby)\nDigital entry pass is generated below. See you Wednesday, Farah! ✨",
    time: "4:15 PM",
  },
];

// ---------------------------------------------------------------------------
// STAGE 03 DATA: Funnel Telemetry & Real-Time Settlement Ledger
// ---------------------------------------------------------------------------
const FUNNEL_STEPS = [
  { label: "Inbound Call / WhatsApp Trigger", count: "1,842 Leads", rate: "100%", width: "100%" },
  { label: "Autonomous AI Qualification", count: "1,528 Qualified", rate: "82.9%", width: "83%" },
  { label: "Real-Time Slot Negotiation", count: "984 Slotted", rate: "53.4%", width: "54%" },
  { label: "Confirmed Calendar Lock & Deposit", count: "770 Confirmed", rate: "41.8%", width: "42%" },
];

const RECENT_TRANSACTIONS = [
  {
    id: "tx-1",
    name: "Farah Al-Hashimi",
    venue: "Operatory Chair 02 • Level 18",
    time: "Just now",
    deposit: "AED 950",
    status: "SYNCED",
    tag: "Aesthetic Consult",
  },
  {
    id: "tx-2",
    name: "Dr. Aris Thorne (2 Pax)",
    venue: "Executive Suite • High Table",
    time: "4m ago",
    deposit: "AED 1,650",
    status: "CONFIRMED",
    tag: "Corporate",
  },
  {
    id: "tx-3",
    name: "Sophia Lin (6 Pax)",
    venue: "Dining Salon • Table 4",
    time: "12m ago",
    deposit: "AED 1,200",
    status: "LOCKED",
    tag: "Private Dining",
  },
];

export function HowItWorksSection({ onOpenQuoteModal }: HowItWorksSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);

  // STAGE 01 STATE
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);
  const [selectedScrubIdx, setSelectedScrubIdx] = useState<number>(0);
  const [audioPlaybackSec, setAudioPlaybackSec] = useState<number>(5);

  useEffect(() => {
    if (!isPlayingAudio) return;
    const interval = setInterval(() => {
      setAudioPlaybackSec((prev) => {
        const next = prev >= 42 ? 0 : prev + 1;
        if (next >= 32) setSelectedScrubIdx(2);
        else if (next >= 18) setSelectedScrubIdx(1);
        else setSelectedScrubIdx(0);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const handleSelectScrub = (idx: number) => {
    setSelectedScrubIdx(idx);
    setAudioPlaybackSec(VOICE_SCRUB_POINTS[idx].timeSec);
  };

  // STAGE 02 STATE
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [pipelinePhase, setPipelinePhase] = useState<1 | 2 | 3>(1);
  const [visibleCount, setVisibleCount] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(true);
  const [loopKey, setLoopKey] = useState<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (!entry.isIntersecting && audioContextRef.current?.state === "running") {
          audioContextRef.current.suspend();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const playAppleChime = (isClient = false) => {
    if (!soundEnabled || !isInView) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const baseFreq = isClient ? 784 : 880;

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {}
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleCount, isTyping]);

  useEffect(() => {
    setPipelinePhase(1);
    setVisibleCount(1);
    setIsTyping(false);

    const tStartChat = setTimeout(() => {
      setPipelinePhase(2);

      let step = 1;
      const interval = setInterval(() => {
        setIsTyping(true);

        const typeDelay = setTimeout(() => {
          setIsTyping(false);
          step += 1;
          setVisibleCount(step);
          playAppleChime(step % 2 !== 0);

          if (step >= WHATSAPP_CONVERSATION.length) {
            clearInterval(interval);
            setTimeout(() => {
              setPipelinePhase(3);
              playAppleChime(false);
            }, 1200);
          }
        }, 850);

        return () => clearTimeout(typeDelay);
      }, 2300);

      return () => clearInterval(interval);
    }, 2400);

    const loopTimer = setTimeout(() => {
      setLoopKey((k) => k + 1);
    }, 25000);

    return () => {
      clearTimeout(tStartChat);
      clearTimeout(loopTimer);
    };
  }, [loopKey, soundEnabled, isInView]);

  return (
    <section 
      ref={sectionRef}
      id="how-it-works"
      className="relative w-full scroll-mt-24 pt-28 pb-24 px-4 sm:px-6 md:px-8 bg-[#F8FAFC] dark:bg-[#07070A] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden"
    >
      {/* Internal Anchor Targets */}
      <div id="overview" className="scroll-mt-24" />
      <div id="workflow" className="scroll-mt-24" />
      <div id="voice-demo" className="scroll-mt-24" />

      {/* Subtle Precision Background Grid & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto space-y-12">

        {/* SECTION HEADER (BrightHub Center Headline Style) */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs font-mono uppercase tracking-widest text-slate-800 dark:text-slate-200 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-[#38BDF8] animate-pulse" />
            END-TO-END AUTONOMOUS ARCHITECTURE
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.12]">
            From the first ring to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-[#38BDF8] bg-clip-text text-transparent">
              confirmed revenue.
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            A complete autonomous loop: Voice intake picks up instantly, WhatsApp qualifies preferences, and live telemetry tracks every conversion.
          </p>
        </div>

        {/* ========================================================= */}
        {/* BRIGHTHUB BENTO GRID: STAGE 01 & STAGE 02                 */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* STAGE 01: Instant Voice Receptionist (Span 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0B0F19] rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] dark:shadow-none flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-white/10 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                      Stage 01
                    </span>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                      Instant Voice Receptionist
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Picks up in under 400ms, understands caller context, and dispatches real-time booking payloads.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  &lt; 400ms Intake Handshake
                </div>
              </div>

              {/* Obsidian Dark Hardware Terminal */}
              <div className="mt-6 rounded-2xl bg-[#080B11] border border-slate-800 p-5 space-y-4 text-white shadow-inner">
                
                {/* Caller & Agent State */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
                      <PhoneCall className="w-4 h-4 animate-bounce" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Sarah • AI Clinical Receptionist</span>
                        <span className="text-[10px] text-emerald-400 font-normal">Active Call</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Caller: Marcus Vance (+971 50 ••• ••••)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="p-2 rounded-full bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-md cursor-pointer"
                      title={isPlayingAudio ? "Pause demo" : "Play demo"}
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                    <span className="font-mono text-xs font-semibold text-slate-300">
                      0:{audioPlaybackSec < 10 ? `0${audioPlaybackSec}` : audioPlaybackSec} / 0:42
                    </span>
                  </div>
                </div>

                {/* Pulsing Audio Waveform Visualizer */}
                <div className="h-14 flex items-center justify-between gap-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  {Array.from({ length: 34 }).map((_, i) => {
                    const isActive = (i / 34) * 42 <= audioPlaybackSec;
                    const barHeight = isPlayingAudio 
                      ? Math.sin((i + audioPlaybackSec) * 0.6) * 16 + 22
                      : (i % 4 === 0 ? 28 : i % 3 === 0 ? 16 : 10);

                    return (
                      <motion.div
                        key={i}
                        animate={{ height: `${Math.max(6, barHeight)}px` }}
                        transition={{ duration: 0.15 }}
                        className={`w-1 rounded-full transition-colors ${
                          isActive
                            ? i % 3 === 0 ? "bg-[#38BDF8]" : "bg-purple-500"
                            : "bg-slate-800"
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Quick Scrub Markers */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Quick Scrub Milestones:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {VOICE_SCRUB_POINTS.map((pt, idx) => (
                      <button
                        key={pt.id}
                        onClick={() => handleSelectScrub(idx)}
                        className={`px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                          selectedScrubIdx === idx
                            ? "border-purple-500 ring-2 ring-purple-500/20 bg-purple-950/40 shadow-sm"
                            : "border-slate-800 bg-white/[0.02] hover:bg-white/[0.05] text-slate-400"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                          <span>{pt.timeLabel}</span>
                          <span className={`text-[9px] px-1 py-0.5 rounded ${pt.accent}`}>
                            {pt.tag}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-Time Synchronized Transcript Bar */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                    <span className="text-slate-400">REAL-TIME TRANSCRIPTION</span>
                    <span className="text-emerald-400 font-semibold">
                      {VOICE_SCRUB_POINTS[selectedScrubIdx].intentBadge}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-slate-200">
                    <span className="text-purple-400 font-bold block mb-1">
                      {VOICE_SCRUB_POINTS[selectedScrubIdx].speaker}:
                    </span>
                    &ldquo;{VOICE_SCRUB_POINTS[selectedScrubIdx].text}&rdquo;
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-4 h-4" /> Caller Intent Classified: 98%
              </span>
              <span>Latency: 340ms</span>
            </div>
          </div>

          {/* STAGE 02: BrightHub Signature Pastel Lime-Yellow Card (Span 5 - WhatsApp Concierge) */}
          <div className="lg:col-span-5 bg-[#E9F871] text-slate-950 rounded-3xl p-7 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-black/10 text-slate-900 uppercase tracking-wider">
                    Stage 02
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-slate-950 mt-1">
                    WhatsApp Concierge &amp; Slot Locking
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 uppercase">
                  0.08s DISPATCH
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                Sarah &bull; Clinical Coordinator qualifies patient intake, holds operatory chair, and locks Practice Management System (PMS) appointments.
              </p>

              {/* Card 01: Omnichannel Patient Intake Banner */}
              <div className="mt-4 p-3 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-950 text-[11px]">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/10 font-bold">01</span>
                    <span>Omnichannel Patient Intake</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10.5px] text-slate-700">
                    <span>Patient: <strong className="text-slate-950">Farah Al-Hashimi</strong></span>
                    <span>&bull;</span>
                    <span className="font-mono text-emerald-800 font-semibold">wa.me / Direct</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                    <span className="filter blur-[2px] select-none text-slate-800 font-medium">[Private Dental Practice &bull; Sheikh Zayed Rd]</span>
                    <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-black/10 text-slate-900 font-mono font-bold shrink-0">🔒 NDA Protected</span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-emerald-600/15 border border-emerald-700/20 text-emerald-950 font-mono text-[9.5px] font-bold shrink-0">
                  0.08s Pipeline Forwarded
                </span>
              </div>

              {/* Sound Controls */}
              <div className="pt-3.5 flex items-center justify-between">
                <button
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    soundEnabled 
                      ? "bg-slate-950 text-white border-slate-950 shadow-sm" 
                      : "bg-white/80 border-black/15 text-slate-800 hover:bg-white"
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#E9F871]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{soundEnabled ? "Apple Chimes: ON" : "Enable Sound Effects"}</span>
                </button>

                <button
                  onClick={() => setLoopKey((k) => k + 1)}
                  className="p-1.5 rounded-full bg-white/80 border border-black/15 text-slate-800 hover:bg-white transition-colors cursor-pointer"
                  title="Restart sequence"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 02: WhatsApp Simulated Feed Chassis */}
              <div className="mt-4 rounded-2xl bg-white border border-black/10 flex flex-col h-[340px] overflow-hidden shadow-sm">
                
                {/* Chat Header */}
                <div className="px-3.5 py-2.5 bg-slate-50 border-b border-black/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">
                      S
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Sarah &bull; Clinical Coordinator</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300/40">
                          DHA Licensed
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 flex items-center gap-1">
                        <span>Verified Practice (DHA Licensed)</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9.5px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Online
                  </span>
                </div>

                {/* Message Scroll Area */}
                <div 
                  ref={chatScrollRef}
                  className="flex-1 flex flex-col justify-end gap-2.5 p-3.5 overflow-y-auto overflow-x-hidden scroll-smooth [&::-webkit-scrollbar]:hidden"
                >
                  {WHATSAPP_CONVERSATION.slice(0, visibleCount).map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[88%] px-3 py-1.5 rounded-2xl text-[11.5px] leading-relaxed shadow-xs whitespace-pre-line ${
                          msg.sender === "client"
                            ? "bg-slate-900 text-white rounded-br-xs"
                            : "bg-[#F8FAFC] border border-slate-200 text-slate-900 rounded-bl-xs"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-0.5 text-[8.5px] ${
                          msg.sender === "client" ? "text-slate-300" : "text-slate-500"
                        }`}>
                          <span>{msg.time}</span>
                          {msg.sender === "client" && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Card 03: Practice System Lock */}
            <div className="mt-4 pt-3.5 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-950 text-[11px]">
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/10 font-bold">03 &bull; Practice System Lock</span>
                  <span>Direct Clinic Diary Lock</span>
                </div>
                <p className="text-[10px] text-slate-800 font-sans font-medium leading-tight">
                  Real-time two-way sync to the clinic Practice Management System (PMS). Operatory chair reserved, medical file opened, zero human receptionist delay.
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-emerald-950 font-bold text-[10.5px] shrink-0 self-start sm:self-auto bg-black/5 px-2.5 py-1 rounded-full border border-black/10">
                <Check className="w-3.5 h-3.5 text-emerald-700" /> Operatory Chair Confirmed // 0.4s PMS Write
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* INFINITE HORIZONTAL TICKER                                */}
        {/* ========================================================= */}
        <div className="w-full border-y border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.02] py-4 overflow-hidden relative rounded-2xl">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F8FAFC] dark:from-[#07070A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F8FAFC] dark:from-[#07070A] to-transparent z-10 pointer-events-none" />

          <div className="flex w-max animate-marquee space-x-10">
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} className="flex items-center space-x-10 text-xs font-bold tracking-wider uppercase text-slate-800 dark:text-slate-200 shrink-0 font-mono">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  Stripe Concierge Invoicing
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  Twilio High-Throughput SMS
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
                  Practice Management System (PMS)
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  Meta Cloud WhatsApp Business
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  HubSpot CRM Sync
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
                  Neural Voice Engine
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* STAGE 03: LIVE REVENUE & MARGIN DASHBOARD (Full Width)    */}
        {/* ========================================================= */}
        <div className="bg-white dark:bg-[#0B0F19] rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] dark:shadow-none space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                  Stage 03
                </span>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                  Live Revenue &amp; Margin Dashboard
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                End-to-end conversion attribution from inbound voice ring to confirmed booking.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-Time Conversion Ledger
            </div>
          </div>

          {/* 4 KPI METRICS BAR */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Captured Revenue (30D)
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight font-mono">
                AED 142,850
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                <TrendingUp className="w-3 h-3" /> +34.2% vs human front desk
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Speed to Lead
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight font-mono">
                &lt; 2.4s
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                <Zap className="w-3 h-3" /> 100% instant response rate
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Booking Conversion
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight font-mono">
                41.8%
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3" /> +18.4% industry benchmark
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Labor Hours Saved
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-[#38BDF8] tracking-tight font-mono">
                124 Hrs/Mo
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" /> $8,400 monthly overhead saved
              </div>
            </div>

          </div>

          {/* 2-COLUMN VIEW: CONVERSION FUNNEL + SETTLEMENT STREAM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left 6-Cols: Visual Conversion Funnel */}
            <div className="lg:col-span-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10 text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Conversion Telemetry Funnel</span>
                <span className="font-mono text-slate-500">Live 30D Cohort</span>
              </div>

              <div className="space-y-3 pt-1">
                {FUNNEL_STEPS.map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {step.label}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {step.count} <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">({step.rate})</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-[#38BDF8] rounded-full" 
                        style={{ width: step.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Zero drop-off from unreturned missed calls</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">99.8% System Uptime</span>
              </div>
            </div>

            {/* Right 6-Cols: Real-Time Event Ledger */}
            <div className="lg:col-span-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">Recent Locked Settlements</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Practice Management System (PMS) Active
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {RECENT_TRANSACTIONS.map((tx) => (
                    <div 
                      key={tx.id}
                      className="p-3 rounded-xl bg-white dark:bg-[#0B0F19] border border-slate-200/70 dark:border-white/10 flex items-center justify-between text-xs shadow-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{tx.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-mono">
                            {tx.tag}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {tx.venue} &bull; <span className="text-slate-400">{tx.time}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                          {tx.deposit}
                        </div>
                        <span className="text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action CTA */}
              <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Ready to deploy this autonomous pipeline in your business?
                </span>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs tracking-wide uppercase transition-all shadow-[0_2px_12px_rgba(147,51,234,0.25)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Book Discovery Call</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorksSection;