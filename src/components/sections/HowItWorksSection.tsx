"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValueEvent 
} from "framer-motion";
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
// STAGE 03 DATA: Funnel Telemetry & Real-Time Clinic Chair Ledger
// ---------------------------------------------------------------------------
const FUNNEL_STEPS = [
  { label: "Inbound Call / WhatsApp Trigger", count: "468 Leads", rate: "100%", width: "100%" },
  { label: "Autonomous AI Qualification", count: "402 Qualified", rate: "85.8%", width: "86%" },
  { label: "Operatory Slot Matching", count: "246 Slotted", rate: "52.5%", width: "53%" },
  { label: "Confirmed PMS Booking & Intake", count: "198 Confirmed", rate: "42.3%", width: "42%" },
];

const RECENT_TRANSACTIONS = [
  {
    id: "tx-1",
    name: "James Miller",
    venue: "Operatory 2",
    time: "3m ago",
    deposit: "AED 1,250",
    status: "SYNCED",
    tag: "Hygiene & Veneer Review",
  },
  {
    id: "tx-2",
    name: "Farah Al-Hashimi",
    venue: "Consultation Suite",
    time: "14m ago",
    deposit: "AED 3,800",
    status: "CONFIRMED",
    tag: "Aesthetic Consult + 3D Scan",
  },
  {
    id: "tx-3",
    name: "David Wright",
    venue: "Operatory 1",
    time: "28m ago",
    deposit: "AED 1,850",
    status: "LOCKED",
    tag: "Emergency Margin Polish",
  },
];

export function HowItWorksSection({ onOpenQuoteModal }: HowItWorksSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);

  // TELEMETRY SPINE & VIBRATING DATA ORB SCROLL TRACKING
  const { scrollYProgress } = useScroll({
    target: pipelineRef,
    offset: ["start 70%", "end 60%"],
  });

  const clampedProgress = useTransform(scrollYProgress, (v) => Math.min(Math.max(v, 0), 1));
  const smoothProgress = useSpring(clampedProgress, {
    stiffness: 260,
    damping: 28,
    restDelta: 0.001,
  });

  const orbTop = useTransform(smoothProgress, [0, 1], ["14px", "calc(100% - 14px)"]);

  const [activeMilestone, setActiveMilestone] = useState<'stage1' | 'connector1' | 'stage2' | 'connector2' | 'stage3'>('stage1');

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (latest < 0.20) {
      setActiveMilestone('stage1');
    } else if (latest >= 0.20 && latest < 0.38) {
      setActiveMilestone('connector1');
    } else if (latest >= 0.38 && latest < 0.68) {
      setActiveMilestone('stage2');
    } else if (latest >= 0.68 && latest < 0.85) {
      setActiveMilestone('connector2');
    } else {
      setActiveMilestone('stage3');
    }
  });

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

        {/* Jitter Micro-Vibration Keyframes for Humming Telemetry Signal */}
        <style>{`
          @keyframes jitter {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-1.5px, 1px); }
            75% { transform: translate(1.5px, -1px); }
          }
          .telemetry-vibe {
            animation: jitter 0.08s infinite linear;
          }
        `}</style>

        {/* ========================================================= */}
        {/* SCROLL-REACTIVE VERTICAL TELEMETRY PIPELINE SPINE        */}
        {/* ========================================================= */}
        <div ref={pipelineRef} className="relative">
          
          {/* Continuous Left Telemetry Guide Rail & Vibrating Data Orb (Visible on White / Light Mode) */}
          <div className="absolute left-0 sm:left-1 md:left-2 lg:left-3 top-6 bottom-6 w-8 flex flex-col items-center pointer-events-none z-20">
            {/* Inner groove: Light background glow giving physical depth on pure white surfaces */}
            <div className="absolute top-0 bottom-0 w-3 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/40 shadow-inner" />
            
            {/* Outer track: Solid 2px line in Deep Slate/Indigo (#312E81) */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-[#312E81] dark:bg-indigo-400/80 shadow-[0_0_6px_rgba(49,46,129,0.3)]" />

            {/* Active Data Packet Stream Fill Line */}
            <motion.div 
              style={{ scaleY: smoothProgress }}
              className="absolute top-0 w-[2px] h-full bg-gradient-to-b from-[#2563EB] via-[#06B6D4] to-[#10B981] origin-top shadow-[0_0_12px_rgba(6,182,212,0.9)]"
            />

            {/* Stage Milestone Anchor Nodes along the Rail */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-[#312E81]/40 dark:border-indigo-600 bg-white dark:bg-zinc-900 flex items-center justify-center shadow-xs">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeMilestone === 'stage1' ? 'bg-cyan-500 shadow-[0_0_8px_#06B6D4]' : 'bg-[#312E81] dark:bg-indigo-400'}`} />
            </div>

            <div className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-[#312E81]/40 dark:border-indigo-600 bg-white dark:bg-zinc-900 flex items-center justify-center shadow-xs">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeMilestone === 'connector1' ? 'bg-cyan-500 shadow-[0_0_8px_#06B6D4]' : 'bg-[#312E81] dark:bg-indigo-400'}`} />
            </div>

            <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-[#312E81]/40 dark:border-indigo-600 bg-white dark:bg-zinc-900 flex items-center justify-center shadow-xs">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeMilestone === 'stage2' ? 'bg-cyan-500 shadow-[0_0_8px_#06B6D4]' : 'bg-[#312E81] dark:bg-indigo-400'}`} />
            </div>

            <div className="absolute top-[72%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-[#312E81]/40 dark:border-indigo-600 bg-white dark:bg-zinc-900 flex items-center justify-center shadow-xs">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeMilestone === 'connector2' ? 'bg-teal-500 shadow-[0_0_8px_#14B8A6]' : 'bg-[#312E81] dark:bg-indigo-400'}`} />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 rounded-full border border-[#312E81]/40 dark:border-indigo-600 bg-white dark:bg-zinc-900 flex items-center justify-center shadow-xs">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${activeMilestone === 'stage3' ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-[#312E81] dark:bg-indigo-400'}`} />
            </div>

            {/* The Vibrating Data Orb (Traveling Packet) */}
            <motion.div
              style={{ top: orbTop }}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
              <div className="relative flex items-center justify-center">
                
                {/* Concentric Aura 1: Outer Pulse Ring */}
                <div className={`absolute rounded-full transition-all duration-300 ${
                  activeMilestone === 'stage3'
                    ? "w-10 h-10 bg-emerald-400/25 border border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.9)] animate-pulse"
                    : activeMilestone === 'stage2'
                    ? "w-14 h-14 bg-cyan-400/25 border border-cyan-400/60 shadow-[0_0_28px_rgba(6,182,212,0.95)] animate-ping"
                    : "w-9 h-9 bg-cyan-400/20 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-pulse"
                }`} />

                {/* Concentric Aura 2: Mid Concentric Halo */}
                <div className={`absolute rounded-full transition-all duration-300 ${
                  activeMilestone === 'stage3'
                    ? "w-7 h-7 bg-emerald-500/35 border border-emerald-400/60"
                    : activeMilestone === 'stage2'
                    ? "w-9 h-9 bg-cyan-500/35 border border-cyan-400/70"
                    : "w-6 h-6 bg-cyan-500/25 border border-cyan-400/50"
                }`} />

                {/* The 18px x 18px Core Vibrating Orb (High Contrast on White) */}
                <div className={`w-[18px] h-[18px] rounded-full telemetry-vibe flex items-center justify-center transition-all duration-300 ${
                  activeMilestone === 'stage3'
                    ? "bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-[0_0_22px_#10B981]"
                    : "bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                }`}>
                  {/* Center White Hot Packet Core */}
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#fff]" />
                </div>

                {/* Live Floating Telemetry Beacon Tag (Desktop) */}
                <div className={`hidden lg:flex absolute left-8 items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold tracking-wider uppercase whitespace-nowrap shadow-lg backdrop-blur-md transition-all duration-300 border ${
                  activeMilestone === 'stage3'
                    ? "bg-slate-950/90 text-emerald-300 border-emerald-500/50 shadow-[0_0_14px_rgba(16,185,129,0.4)]"
                    : activeMilestone === 'stage2'
                    ? "bg-slate-950/90 text-cyan-300 border-cyan-500/50 shadow-[0_0_14px_rgba(6,182,212,0.4)]"
                    : activeMilestone === 'connector1' || activeMilestone === 'connector2'
                    ? "bg-slate-950/90 text-indigo-300 border-indigo-500/50"
                    : "bg-slate-950/90 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    activeMilestone === 'stage3' ? "bg-emerald-400 animate-ping" : "bg-cyan-400 animate-ping"
                  }`} />
                  <span>
                    {activeMilestone === 'stage1' && "VOICE INTAKE // ACTIVE"}
                    {activeMilestone === 'connector1' && "PAYLOAD DISPATCH // 0.08s"}
                    {activeMilestone === 'stage2' && "WHATSAPP NEGOTIATION // SYNC"}
                    {activeMilestone === 'connector2' && "PMS SYNC // 0.4s"}
                    {activeMilestone === 'stage3' && "PMS CONFIRMED // LIVE"}
                  </span>
                </div>

              </div>
            </motion.div>
          </div>

          {/* Main Pipeline Content Container with Left Gutter for Guide Rail */}
          <div className="space-y-12 pl-7 sm:pl-10 md:pl-14 lg:pl-16">

            {/* ========================================================= */}
            {/* STAGE 01: AI VOICE RECEPTIONIST (Audio Waveform Player)   */}
            {/* ========================================================= */}
            <div className="relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0B0F19] border border-slate-200/80 dark:border-white/10 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-md">
              {/* Stage Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10 gap-3">
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

                <div className={`inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1 rounded-full border font-mono text-[11px] transition-all duration-300 ${
                  activeMilestone === 'stage1'
                    ? "bg-cyan-500/15 border-cyan-400 text-cyan-800 dark:text-cyan-200 ring-4 ring-cyan-400/25 shadow-[0_0_18px_rgba(6,182,212,0.4)]"
                    : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${activeMilestone === 'stage1' ? "bg-cyan-400 animate-ping" : "bg-emerald-500 animate-pulse"}`} />
                  Sub-400ms Handshake &bull; Zero Ring Drop
                </div>
              </div>

          {/* Interactive Player Grid (Desktop 7-5 split) */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left 7-Cols: Audio Player & Waveform Visualizer */}
            <div className="lg:col-span-7 rounded-2xl bg-[#080B11] border border-slate-800 p-5 space-y-4 text-white shadow-inner">
              
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

            </div>

            {/* Right 5-Cols: Live Synchronized Transcript Panel */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 p-5 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/10 text-xs">
                  <span className="font-mono text-slate-500 dark:text-slate-400">REAL-TIME TRANSCRIPTION</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {VOICE_SCRUB_POINTS[selectedScrubIdx].intentBadge}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-white dark:bg-[#0B0F19] border border-slate-200/70 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-slate-200">
                  <span className="text-purple-600 dark:text-purple-400 font-bold block mb-1">
                    {VOICE_SCRUB_POINTS[selectedScrubIdx].speaker}:
                  </span>
                  &ldquo;{VOICE_SCRUB_POINTS[selectedScrubIdx].text}&rdquo;
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Check className="w-4 h-4" /> Caller Intent Classified: 98%
                </span>
                <span>Latency: 340ms</span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* VERTICAL VISUAL CONNECTOR (STAGE 01 -> STAGE 02)          */}
        {/* ========================================================= */}
        <div className="relative flex flex-col items-center justify-center my-6">
          <div className="w-[2px] h-14 bg-gradient-to-b from-purple-500 via-sky-400 to-emerald-500" />
          <div className={`my-1 px-3.5 py-1.5 rounded-full border text-[10px] font-mono shadow-sm flex items-center gap-1.5 transition-all duration-300 ${
            activeMilestone === 'connector1'
              ? "bg-cyan-500/15 border-cyan-400 text-cyan-800 dark:text-cyan-200 ring-4 ring-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105"
              : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
          }`}>
            <Zap className={`w-3.5 h-3.5 transition-colors ${activeMilestone === 'connector1' ? "text-cyan-400 animate-bounce" : "text-emerald-500"}`} />
            <span className={activeMilestone === 'connector1' ? "font-bold text-cyan-900 dark:text-cyan-100" : ""}>
              0.08s LATENCY // PAYLOAD DISPATCHED TO WHATSAPP
            </span>
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
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
              WhatsApp Concierge &amp; Instant Slot Locking
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Sarah &bull; Clinical Coordinator qualifies patient intake, holds operatory chair, and locks Practice Management System (PMS) appointments.
            </p>

            {/* Audio Controls */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                  soundEnabled 
                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-400 shadow-xs" 
                    : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{soundEnabled ? "Apple Chimes: ON" : "Enable Sound Effects"}</span>
              </button>

              <button
                onClick={() => setLoopKey((k) => k + 1)}
                className="p-1 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white shadow-xs transition-colors cursor-pointer"
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
              <div className="absolute left-0 w-[44%] h-full bg-slate-200 dark:bg-zinc-800">
                {pipelinePhase >= 1 && (
                  <motion.div 
                    className="h-full bg-gradient-to-r from-transparent via-emerald-400 to-emerald-500 shadow-[0_0_14px_#10b981]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>
              <div className="absolute right-0 w-[44%] h-full bg-slate-200 dark:bg-zinc-800">
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
                : "border-slate-200 dark:border-zinc-800"
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                  01 &bull; Inbound Lead
                </span>
                <span className={`text-[10.5px] font-semibold ${pipelinePhase === 1 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-zinc-400"}`}>
                  {pipelinePhase === 1 ? "Dispatched" : "Standby"}
                </span>
              </div>

              <div className="py-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Omnichannel Patient Intake</h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Patient taps WhatsApp intake link.</p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 p-3 text-[11px] space-y-2">
                <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                  <span>Patient:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Farah Al-Hashimi</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                  <span>Channel:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">wa.me / Direct</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                  <span>Clinic:</span>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="filter blur-[2px] select-none text-slate-700 dark:text-zinc-300">[Private Dental Practice &bull; Sheikh Zayed Rd]</span>
                    <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-mono font-bold shrink-0">🔒 NDA Protected</span>
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

            {/* NODE 02: HERO CENTERPIECE (Col 6 - LOCKED 465PX HEIGHT) */}
            <div className={`relative z-10 lg:col-span-6 flex flex-col rounded-3xl p-5 md:p-6 bg-white dark:bg-zinc-900 border transition-all duration-300 shadow-xl backdrop-blur-md ${
              pipelinePhase === 2 
                ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-2xl" 
                : "border-slate-200 dark:border-zinc-800"
            }`}>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                  02 &bull; Autonomous Chat
                </span>
                <span className={`text-[11px] font-semibold ${
                  pipelinePhase === 2 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-zinc-400"
                }`}>
                  {pipelinePhase === 2 ? "Live Negotiation" : pipelinePhase === 3 ? "Completed" : "Standby"}
                </span>
              </div>

              <div className="py-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Sarah &bull; Clinical Coordinator</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Automated assessment qualification &amp; chair slot matching.</p>
              </div>

              {/* Chat Screen Chassis */}
              <div className="flex-1 rounded-2xl bg-[#F8FAFC] dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex flex-col h-[465px] overflow-hidden">
                
                {/* WhatsApp Top Bar */}
                <div className="px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-zinc-800 text-white flex items-center justify-center font-bold text-[11px]">
                      S
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Sarah &bull; Clinical Coordinator</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 font-bold border border-emerald-300/40">
                          DHA Licensed
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                        <span>Verified Practice (DHA Licensed)</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9.5px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    Online
                  </span>
                </div>

                {/* Message Feed */}
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
                        className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-[12px] leading-relaxed shadow-xs whitespace-pre-line ${
                          msg.sender === "client"
                            ? "bg-slate-900 dark:bg-zinc-800 text-white rounded-br-xs"
                            : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-200 rounded-bl-xs"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                          msg.sender === "client" ? "text-slate-400" : "text-slate-400 dark:text-zinc-500"
                        }`}>
                          <span>{msg.time}</span>
                          {msg.sender === "client" && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                  <span>DHA Licensed Practice Intake</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">Meta Verified</span>
                </div>
              </div>
            </div>

            {/* NODE 03: CONFIRMED CLINIC DIARY LOCK (Col 3) */}
            <div className={`relative z-10 lg:col-span-3 flex flex-col rounded-2xl p-5 bg-white dark:bg-zinc-900/90 border transition-all duration-300 shadow-md backdrop-blur-md ${
              pipelinePhase === 3 
                ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg" 
                : "border-slate-200 dark:border-zinc-800"
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                  03 &bull; Practice System Lock
                </span>
                <span className={`text-[10.5px] font-semibold ${pipelinePhase === 3 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-zinc-400"}`}>
                  {pipelinePhase === 3 ? "Locked" : "Awaiting Turn"}
                </span>
              </div>

              <div className="py-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Direct Clinic Diary Lock</h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Real-time two-way PMS sync.</p>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {pipelinePhase === 3 ? (
                    <motion.div
                      key="clinic-card"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full rounded-xl bg-slate-50 dark:bg-zinc-950/90 border border-slate-200/90 dark:border-zinc-800 p-3 space-y-2.5 text-[11px]"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70 dark:border-zinc-800">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Dr. Thorne &bull; Operatory 02</div>
                          <div className="text-[10px] text-slate-500">Wed, Nov 12 &bull; 5:45 PM</div>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20">
                          Aesthetic Consult
                        </span>
                      </div>

                      <div className="space-y-1 text-slate-600 dark:text-zinc-300 text-[10.5px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Patient:</span>
                          <span className="font-medium text-slate-900 dark:text-white">Farah Al-Hashimi</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Treatment:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Clear Aligners + 3D Scan</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Valet Access:</span>
                          <span className="font-medium">Sheikh Zayed Rd Valet</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 dark:text-zinc-500 space-y-2">
                      <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 dark:border-zinc-700 mx-auto animate-spin" />
                      <p className="text-[10px] font-medium">Negotiating slot with Sarah...</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-zinc-400 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Operatory Chair Confirmed // 0.4s PMS Write
                </span>
                <span className="font-mono text-[9.5px]">0.4s</span>
              </div>
            </div>

          </div>

          {/* INFINITE HORIZONTAL TICKER */}
          <div className="w-full mt-6 border-y border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.02] py-4 overflow-hidden relative rounded-2xl">
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

        </div>

        {/* ========================================================= */}
        {/* VERTICAL VISUAL CONNECTOR (STAGE 02 -> STAGE 03)          */}
        {/* ========================================================= */}
        <div className="relative flex flex-col items-center justify-center my-6">
          <div className="w-[2px] h-14 bg-gradient-to-b from-emerald-500 via-teal-400 to-cyan-500" />
          <div className={`my-1 px-3.5 py-1.5 rounded-full border text-[10px] font-mono shadow-sm flex items-center gap-1.5 transition-all duration-300 ${
            activeMilestone === 'connector2'
              ? "bg-teal-500/15 border-teal-400 text-teal-800 dark:text-teal-200 ring-4 ring-teal-400/30 shadow-[0_0_20px_rgba(20,184,166,0.6)] scale-105"
              : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
          }`}>
            <Sparkles className={`w-3.5 h-3.5 transition-colors ${activeMilestone === 'connector2' ? "text-teal-400 animate-spin" : "text-cyan-500"}`} />
            <span className={activeMilestone === 'connector2' ? "font-bold text-teal-900 dark:text-teal-100" : ""}>
              DIRECT SYNC // REVENUE WRITTEN TO DASHBOARD
            </span>
          </div>
          <div className="w-[2px] h-14 bg-gradient-to-b from-cyan-500 via-sky-400 to-transparent" />
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
                  STAGE 03
                </span>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                  Live Practice Telemetry &amp; Chair Utilization
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                End-to-end patient attribution from inbound voice ring to confirmed operatory booking.
              </p>
            </div>

            <div className={`inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1 rounded-full border font-mono text-[11px] transition-all duration-300 ${
              activeMilestone === 'stage3'
                ? "bg-emerald-500/15 border-emerald-400 text-emerald-800 dark:text-emerald-200 ring-4 ring-emerald-400/25 shadow-[0_0_18px_rgba(16,185,129,0.5)]"
                : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${activeMilestone === 'stage3' ? "bg-emerald-400 animate-ping" : "bg-emerald-500 animate-pulse"}`} />
              Clinical PMS Live Sync
            </div>
          </div>

          {/* 4 KPI METRICS BAR */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Recovered Production (30D)
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight font-mono">
                AED 218,400
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                <TrendingUp className="w-3 h-3" /> +31.4% vs unreturned calls
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Speed to Intake
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight font-mono">
                &lt; 2.4s
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                <Zap className="w-3 h-3" /> 100% zero-ring drop rate
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Chair Conversion
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight font-mono">
                42.6%
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3" /> +16.2% vs industry benchmark
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Front Desk Time Saved
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-[#38BDF8] tracking-tight font-mono">
                118 Hrs/Mo
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" /> AED 18,500 monthly overhead saved
              </div>
            </div>

          </div>

          {/* 2-COLUMN VIEW: CONVERSION FUNNEL + SETTLEMENT STREAM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left 6-Cols: Visual Conversion Funnel */}
            <div className="lg:col-span-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10 text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Conversion Telemetry Funnel</span>
                <span className="font-mono text-slate-500">Live 30D Clinic Cohort</span>
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
                <span>Zero drop-off from after-hours missed calls</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">99.8% System Uptime</span>
              </div>
            </div>

            {/* Right 6-Cols: Real-Time Event Ledger */}
            <div className="lg:col-span-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">Recent Confirmed Chairs</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Two-Way PMS Sync Active
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
        </div>

      </div>
    </section>
  );
}

export default HowItWorksSection;