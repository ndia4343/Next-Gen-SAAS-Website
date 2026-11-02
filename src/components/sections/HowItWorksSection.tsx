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
  MapPin, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";

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
    accent: "text-sky-500 border-sky-500/30 bg-sky-500/10",
  },
  {
    id: 2,
    timeLabel: "0:18",
    timeSec: 18,
    tag: "Preference Qualified",
    speaker: "Freya AI Receptionist",
    text: "Good afternoon Marcus! Tomorrow is packed with DIFC Art Night, but we have our prime skyline terrace open at 8:45 PM. Shall I reserve that?",
    intentBadge: "Floor Plan Evaluated",
    accent: "text-violet-500 border-violet-500/30 bg-violet-500/10",
  },
  {
    id: 3,
    timeLabel: "0:32",
    timeSec: 32,
    tag: "WhatsApp Handoff",
    speaker: "System Dispatched",
    text: "Terrace 8:45 is held for 10 minutes. I've dispatched an instant WhatsApp link to your number to lock your deposit and valet pass.",
    intentBadge: "Omnichannel Forward",
    accent: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
  },
];

// ---------------------------------------------------------------------------
// STAGE 02 DATA: WhatsApp Pipeline Conversation
// ---------------------------------------------------------------------------
interface Message {
  sender: "client" | "reception";
  text: string;
  time: string;
}

const WHATSAPP_CONVERSATION: Message[] = [
  {
    sender: "client",
    text: "Hey Sarah, hope you're having a good week! Trying to see if we can grab a table for 4 tomorrow night (Thursday) around 8:30 or 9 PM?",
    time: "4:12 PM",
  },
  {
    sender: "reception",
    text: "Hey Marcus! Good to hear from you. Let me pull up our floor chart for tomorrow real quick.",
    time: "4:12 PM",
  },
  {
    sender: "reception",
    text: "Tomorrow is pretty packed with DIFC Art Night, but I have a high-top table indoors at 8:30, or our prime skyline terrace table at 8:45 PM. Which one do you prefer?",
    time: "4:13 PM",
  },
  {
    sender: "client",
    text: "Terrace 8:45 for sure. Celebrating my partner's birthday so terrace view would be amazing 🙌",
    time: "4:13 PM",
  },
  {
    sender: "reception",
    text: "Say no more! I'll put a VIP note for our floor manager and pastry team for a complimentary birthday dessert sparkler at the end.",
    time: "4:14 PM",
  },
  {
    sender: "client",
    text: "Legend, thank you Sarah! Do we still have valet parking at Gate Village 4?",
    time: "4:14 PM",
  },
  {
    sender: "reception",
    text: "Yes, complimentary valet right at Gate Village 4—just show your booking confirmation. Locking you in right now: Marcus Vance, 4 guests, Thursday Nov 13 @ 8:45 PM. Synced to our Google Calendar!",
    time: "4:15 PM",
  },
  {
    sender: "client",
    text: "Perfect, see you guys tomorrow night!",
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
    name: "Marcus Vance (4 Pax)",
    venue: "Skyline Terrace • Table 12",
    time: "Just now",
    deposit: "$250.00",
    status: "SYNCED",
    tag: "VIP Birthday",
  },
  {
    id: "tx-2",
    name: "Dr. Aris Thorne (2 Pax)",
    venue: "Executive Suite • High Table",
    time: "4m ago",
    deposit: "$450.00",
    status: "CONFIRMED",
    tag: "Corporate",
  },
  {
    id: "tx-3",
    name: "Sophia Lin (6 Pax)",
    venue: "Dining Salon • Table 4",
    time: "12m ago",
    deposit: "$300.00",
    status: "LOCKED",
    tag: "Private Dining",
  },
];

export function HowItWorksSection({ onOpenQuoteModal }: HowItWorksSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);

  // -------------------------------------------------------------------------
  // STAGE 01 STATE (Audio Waveform & Scrubbing)
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // STAGE 02 STATE (WhatsApp Pipeline)
  // -------------------------------------------------------------------------
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [pipelinePhase, setPipelinePhase] = useState<1 | 2 | 3>(1);
  const [visibleCount, setVisibleCount] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(true);
  const [loopKey, setLoopKey] = useState<number>(0);

  // Mute audio when user scrolls out of viewport
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
      className="relative w-full scroll-mt-32 pt-24 pb-20 px-4 md:px-8 bg-[#F8F9FA] dark:bg-[#08090D] text-zinc-900 dark:text-white transition-colors duration-300 overflow-hidden"
    >
      {/* Compatibility Anchors for Legacy Internal Links */}
      <div id="workflow" className="scroll-mt-32" />
      <div id="voice-demo" className="scroll-mt-32" />

      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-16">

        {/* ========================================================= */}
        {/* UNIFIED MASTER SECTION HEADER                             */}
        {/* ========================================================= */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono uppercase tracking-wider text-zinc-800 dark:text-zinc-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            END-TO-END AUTONOMOUS ARCHITECTURE
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.12]">
            From the first ring to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
              confirmed revenue.
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
            A complete autonomous loop: Voice intake picks up instantly, WhatsApp negotiates the slot, and live telemetry tracks every conversion.
          </p>
        </div>

        {/* ========================================================= */}
        {/* STAGE 01: AI VOICE RECEPTIONIST (Audio Waveform Player)   */}
        {/* ========================================================= */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-white/90 dark:bg-zinc-900/90 border border-neutral-200/90 dark:border-neutral-800 shadow-xl backdrop-blur-md">
          {/* Stage Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200/70 dark:border-neutral-800/80 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 uppercase tracking-wider">
                  Stage 01
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Instant Voice Receptionist
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Picks up in under 400ms, understands deep caller context, and dispatches real-time booking payloads.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono text-[10.5px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sub-400ms Handshake &bull; Zero Ring Drop
            </div>
          </div>

          {/* Interactive Player Grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left 7-Cols: Audio Player & Waveform Visualizer */}
            <div className="lg:col-span-7 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/80 dark:border-neutral-800 p-5 space-y-4">
              
              {/* Caller & Agent Avatar Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-sky-500 flex items-center justify-center text-white shadow-md">
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>Freya AI Voice Agent</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">Active Call</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Caller: Marcus Vance (+971 50 &bull;&bull;&bull; &bull;&bull;&bull;&bull;)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="p-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-105 transition-all shadow-md cursor-pointer"
                    title={isPlayingAudio ? "Pause demo" : "Play demo"}
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </button>
                  <span className="font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    0:{audioPlaybackSec < 10 ? `0${audioPlaybackSec}` : audioPlaybackSec} / 0:42
                  </span>
                </div>
              </div>

              {/* Dynamic Waveform Bars */}
              <div className="h-16 flex items-center justify-between gap-1 px-2 py-2 rounded-xl bg-white dark:bg-zinc-900/80 border border-neutral-200/60 dark:border-neutral-800/80">
                {Array.from({ length: 36 }).map((_, i) => {
                  const isActive = (i / 36) * 42 <= audioPlaybackSec;
                  const barHeight = isPlayingAudio 
                    ? Math.sin((i + audioPlaybackSec) * 0.6) * 18 + 24
                    : (i % 4 === 0 ? 30 : i % 3 === 0 ? 18 : 12);

                  return (
                    <motion.div
                      key={i}
                      animate={{ height: `${Math.max(6, barHeight)}px` }}
                      transition={{ duration: 0.15 }}
                      className={`w-1 rounded-full transition-colors ${
                        isActive
                          ? "bg-gradient-to-t from-violet-600 to-sky-400"
                          : "bg-neutral-200 dark:bg-neutral-800"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Quick Scrub Markers */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Quick Scrub Milestones:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {VOICE_SCRUB_POINTS.map((pt, idx) => (
                    <button
                      key={pt.id}
                      onClick={() => handleSelectScrub(idx)}
                      className={`px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                        selectedScrubIdx === idx
                          ? "border-violet-500 ring-2 ring-violet-500/20 bg-white dark:bg-zinc-900 shadow-sm"
                          : "border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                        <span>{pt.timeLabel}</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded ${pt.accent}`}>
                          {pt.tag}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 5-Cols: Live Synchronized Transcript Pill */}
            <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-zinc-950 border border-neutral-200/80 dark:border-neutral-800 p-5 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800 text-[11px]">
                  <span className="font-mono text-neutral-500">REAL-TIME TRANSCRIPTION</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {VOICE_SCRUB_POINTS[selectedScrubIdx].intentBadge}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-neutral-50 dark:bg-zinc-900/60 border border-neutral-200/70 dark:border-neutral-800/70">
                  <div className="text-[11px] font-bold text-violet-600 dark:text-sky-400">
                    {VOICE_SCRUB_POINTS[selectedScrubIdx].speaker}:
                  </div>
                  <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans italic">
                    &ldquo;{VOICE_SCRUB_POINTS[selectedScrubIdx].text}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10.5px] text-neutral-500">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" /> Sentiment: High Intent (98%)
                </span>
                <span className="font-mono">Latency: 340ms</span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* VERTICAL VISUAL CONNECTOR (STAGE 01 -> STAGE 02)          */}
        {/* ========================================================= */}
        <div className="relative flex flex-col items-center justify-center my-6">
          <div className="w-[2px] h-14 bg-gradient-to-b from-violet-500 via-sky-400 to-emerald-500" />
          <div className="my-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-600 dark:text-neutral-400 shadow-sm flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-emerald-500" />
            <span>0.08s LATENCY // PAYLOAD DISPATCHED TO WHATSAPP</span>
          </div>
          <div className="w-[2px] h-14 bg-gradient-to-b from-emerald-500 via-emerald-400 to-transparent" />
        </div>

        {/* ========================================================= */}
        {/* STAGE 02: WHATSAPP BOOKING CONCIERGE (3-Node Showcase)    */}
        {/* ========================================================= */}
        <div className="space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10.5px] font-mono">
              STAGE 02 &bull; AUTONOMOUS CHAT NEGOTIATION
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              WhatsApp Concierge & Instant Slot Locking
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
              Sarah AI Hostess qualifies guest preferences, holds the prime slot, and issues Google Calendar & valet passes.
            </p>

            {/* Audio Controls */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                  soundEnabled 
                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-400 shadow-xs" 
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{soundEnabled ? "Apple Chimes: ON" : "Enable Sound Effects"}</span>
              </button>

              <button
                onClick={() => setLoopKey((k) => k + 1)}
                className="p-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white shadow-xs transition-colors cursor-pointer"
                title="Restart sequence"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3-NODE ASYMMETRIC GRID (Desktop 3-6-3) */}
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Desktop Connectors */}
            <div className="hidden lg:block absolute top-1/2 left-[23%] right-[23%] -translate-y-1/2 h-[2px] z-0 pointer-events-none">
              <div className="absolute left-0 w-[44%] h-full bg-zinc-200 dark:bg-zinc-800">
                {pipelinePhase >= 1 && (
                  <motion.div 
                    className="h-full bg-gradient-to-r from-transparent via-emerald-400 to-emerald-500 shadow-[0_0_14px_#10b981]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>
              <div className="absolute right-0 w-[44%] h-full bg-zinc-200 dark:bg-zinc-800">
                {pipelinePhase >= 2 && (
                  <motion.div 
                    className="h-full bg-gradient-to-r from-transparent via-emerald-400 to-emerald-500 shadow-[0_0_14px_#10b981]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: 0.7 }}
                  />
                )}
              </div>
            </div>

            {/* NODE 01: OMNICHANNEL INBOUND (Col 3) */}
            <div className={`relative z-10 lg:col-span-3 flex flex-col rounded-2xl p-5 bg-white dark:bg-zinc-900/90 border transition-all duration-300 shadow-md backdrop-blur-md ${
              pipelinePhase === 1 
                ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg" 
                : "border-zinc-200 dark:border-zinc-800"
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  01 &bull; Inbound Lead
                </span>
                <span className={`text-[10.5px] font-semibold ${pipelinePhase === 1 ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
                  {pipelinePhase === 1 ? "Dispatched" : "Standby"}
                </span>
              </div>

              <div className="py-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Omnichannel Inbound</h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Guest taps WhatsApp reservation link.</p>
              </div>

              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800/80 p-3 text-[11px] space-y-2">
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Guest:</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">Marcus Vance</span>
                </div>
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Channel:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">wa.me / Direct</span>
                </div>
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Venue:</span>
                  <div className="flex items-center gap-1 font-medium">
                    <span className="filter blur-[3.5px] select-none text-zinc-700 dark:text-zinc-300">L&apos;Atelier Noir</span>
                    <span className="text-zinc-400">(DIFC)</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10.5px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg px-2.5 py-1.5">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-emerald-500" /> Pipeline Forwarded
                </span>
                <span className="font-mono text-[9.5px]">0.08s</span>
              </div>
            </div>

            {/* NODE 02: HERO CENTERPIECE (Col 6 - LOCKED 380PX HEIGHT) */}
            <div className={`relative z-10 lg:col-span-6 flex flex-col rounded-3xl p-5 md:p-6 bg-white dark:bg-zinc-900 border transition-all duration-300 shadow-xl backdrop-blur-md ${
              pipelinePhase === 2 
                ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-2xl" 
                : "border-zinc-200 dark:border-zinc-800"
            }`}>
              <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  02 &bull; Autonomous Chat
                </span>
                <span className={`text-[11px] font-semibold ${
                  pipelinePhase === 2 ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"
                }`}>
                  {pipelinePhase === 2 ? "Live Negotiation" : pipelinePhase === 3 ? "Completed" : "Standby"}
                </span>
              </div>

              <div className="py-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Sarah AI Hostess</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Automated floor availability check & preference matching.</p>
              </div>

              {/* Chat Screen Chassis (Locked at 465px) */}
              <div className="flex-1 rounded-2xl bg-[#F8FAFC] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col h-[465px] overflow-hidden">
                
                {/* WhatsApp Top Bar */}
                <div className="px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center font-bold text-[11px]">
                      S
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">Sarah</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                          Hostess
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <span className="filter blur-[3px] select-none text-zinc-600 dark:text-zinc-400">L&apos;Atelier Noir</span>
                        <span>&bull; DIFC Dubai</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9.5px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    Online
                  </span>
                </div>

                {/* Message Feed (Strictly Locked Height 380px to eliminate CLS) */}
                <div 
                  ref={chatScrollRef}
                  className="min-h-[380px] max-h-[380px] flex flex-col justify-end gap-3 p-4 overflow-y-auto overflow-x-hidden scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {WHATSAPP_CONVERSATION.slice(0, visibleCount).map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-[12px] leading-relaxed shadow-xs ${
                          msg.sender === "client"
                            ? "bg-zinc-900 dark:bg-zinc-800 text-white rounded-br-xs"
                            : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 rounded-bl-xs"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                          msg.sender === "client" ? "text-zinc-400" : "text-zinc-400 dark:text-zinc-500"
                        }`}>
                          <span>{msg.time}</span>
                          {msg.sender === "client" && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>VIP Reservation Channel</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">Meta Verified</span>
                </div>
              </div>
            </div>

            {/* NODE 03: CONFIRMED CALENDAR LOCK (Col 3) */}
            <div className={`relative z-10 lg:col-span-3 flex flex-col rounded-2xl p-5 bg-white dark:bg-zinc-900/90 border transition-all duration-300 shadow-md backdrop-blur-md ${
              pipelinePhase === 3 
                ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg" 
                : "border-zinc-200 dark:border-zinc-800"
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  03 &bull; Calendar Lock
                </span>
                <span className={`text-[10.5px] font-semibold ${pipelinePhase === 3 ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
                  {pipelinePhase === 3 ? "Locked" : "Awaiting Turn"}
                </span>
              </div>

              <div className="py-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Confirmed Calendar Lock</h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Direct calendar lock via Google Calendar API.</p>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {pipelinePhase === 3 ? (
                    <motion.div
                      key="host-card"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-950/90 border border-zinc-200/90 dark:border-zinc-800 p-3 space-y-2.5 text-[11px]"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200/70 dark:border-zinc-800">
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white">Table 12 &bull; Skyline Terrace</div>
                          <div className="text-[10px] text-zinc-500">Thu, Nov 13 &bull; 8:45 PM</div>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20">
                          Anniversary
                        </span>
                      </div>

                      <div className="space-y-1 text-zinc-600 dark:text-zinc-300 text-[10.5px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Party:</span>
                          <span className="font-medium text-zinc-900 dark:text-white">Marcus Vance (4 Pax)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">VIP Sparkler:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Pastry Confirmed</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Valet Pass:</span>
                          <span className="font-medium">Gate Village 4</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-6 text-zinc-400 dark:text-zinc-500 space-y-2">
                      <div className="w-6 h-6 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 mx-auto animate-spin" />
                      <p className="text-[10px] font-medium">Negotiating slot with Sarah...</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10.5px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" /> Synced to Host Ledger
                </span>
                <span className="font-mono text-[9.5px]">0.9s</span>
              </div>
            </div>

          </div>

          {/* INFINITE HORIZONTAL TICKER */}
          <div className="w-full mt-10 border-y border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 py-3.5 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f8f9fb] dark:from-[#08090D] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f8f9fb] dark:from-[#08090D] to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-marquee space-x-10">
              {[0, 1].map((copyIndex) => (
                <div key={copyIndex} className="flex items-center space-x-10 text-xs font-bold tracking-wider uppercase text-neutral-800 dark:text-neutral-200 shrink-0">
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Stripe Concierge Invoicing
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Twilio High-Throughput SMS
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Google Calendar API
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Meta Cloud WhatsApp Business
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    HubSpot CRM Sync
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Retell AI Voice Core
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* VERTICAL VISUAL CONNECTOR (STAGE 02 -> STAGE 03)          */}
        {/* ========================================================= */}
        <div className="relative flex flex-col items-center justify-center my-6">
          <div className="w-[2px] h-14 bg-gradient-to-b from-emerald-500 via-teal-400 to-cyan-500" />
          <div className="my-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-600 dark:text-neutral-400 shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-500" />
            <span>REAL-TIME WEBHOOK // REVENUE EVENT WRITTEN TO TELEMETRY</span>
          </div>
          <div className="w-[2px] h-14 bg-gradient-to-b from-cyan-500 via-sky-400 to-transparent" />
        </div>

        {/* ========================================================= */}
        {/* STAGE 03: LIVE REVENUE & MARGIN DASHBOARD                 */}
        {/* ========================================================= */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/90 dark:bg-zinc-900/90 border border-neutral-200/90 dark:border-neutral-800 shadow-xl backdrop-blur-md space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200/70 dark:border-neutral-800/80 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
                  Stage 03
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Live Revenue & Margin Dashboard
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                End-to-end conversion attribution from inbound voice ring to locked settlement.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 font-mono text-[10.5px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              Real-Time Conversion Ledger
            </div>
          </div>

          {/* 4 KPI METRICS BAR */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/80 dark:border-neutral-800">
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Captured Revenue (30D)
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                $142,850
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +34.2% vs human front desk
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/80 dark:border-neutral-800">
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Speed to Lead
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                &lt; 2.4s
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" /> 100% instant response rate
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/80 dark:border-neutral-800">
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Booking Conversion
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                41.8%
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> +18.4% industry benchmark
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/80 dark:border-neutral-800">
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Labor Hours Saved
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                124 Hrs/Mo
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> $8,400 monthly overhead saved
              </div>
            </div>

          </div>

          {/* 2-COLUMN VIEW: CONVERSION FUNNEL + SETTLEMENT STREAM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left 6-Cols: Visual Conversion Funnel */}
            <div className="lg:col-span-6 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/80 dark:border-neutral-800 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-neutral-800/80 text-xs">
                <span className="font-bold text-neutral-900 dark:text-white">Conversion Telemetry Funnel</span>
                <span className="font-mono text-neutral-500">Live 30D Cohort</span>
              </div>

              <div className="space-y-3 pt-1">
                {FUNNEL_STEPS.map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {step.label}
                      </span>
                      <span className="font-mono font-bold text-neutral-900 dark:text-white">
                        {step.count} <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">({step.rate})</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 rounded-full" 
                        style={{ width: step.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 text-[11px] text-neutral-500 flex items-center justify-between">
                <span>Zero drop-off from unreturned missed calls</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">99.8% System Uptime</span>
              </div>
            </div>

            {/* Right 6-Cols: Real-Time Event Ledger */}
            <div className="lg:col-span-6 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/80 dark:border-neutral-800 p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-neutral-800/80 text-xs">
                  <span className="font-bold text-neutral-900 dark:text-white">Recent Locked Settlements</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Google Calendar API Active
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {RECENT_TRANSACTIONS.map((tx) => (
                    <div 
                      key={tx.id}
                      className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-between text-xs shadow-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                          <span>{tx.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                            {tx.tag}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {tx.venue} &bull; <span className="text-neutral-400">{tx.time}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-neutral-900 dark:text-white">
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

              {/* Bottom Action CTA inside Stage 03 */}
              <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  Ready to deploy this autonomous pipeline in your business?
                </span>
                <button
                  onClick={() => onOpenQuoteModal && onOpenQuoteModal("Discovery Call")}
                  className="px-5 py-2.5 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Book Discovery Call</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorksSection;
