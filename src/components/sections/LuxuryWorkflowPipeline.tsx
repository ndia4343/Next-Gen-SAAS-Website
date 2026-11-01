"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  CheckCheck, 
  Clock, 
  MapPin, 
  Check, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface Message {
  sender: "client" | "reception";
  text: string;
  time: string;
}

const CONVERSATION: Message[] = [
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

interface LuxuryWorkflowPipelineProps {
  onOpenQuoteModal?: (service: string) => void;
}

export function LuxuryWorkflowPipeline({ onOpenQuoteModal }: LuxuryWorkflowPipelineProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [pipelinePhase, setPipelinePhase] = useState<1 | 2 | 3>(1);
  const [visibleCount, setVisibleCount] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(true);
  const [loopKey, setLoopKey] = useState<number>(0);

  // 1. Intersection Observer: Mute audio if user scrolls away
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (!entry.isIntersecting && audioContextRef.current) {
          if (audioContextRef.current.state === "running") {
            audioContextRef.current.suspend();
          }
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 2. Synthesized Pop Tone
  const playPopTone = (freq = 580, duration = 0.08) => {
    if (!soundEnabled || !isInView) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context blocked", e);
    }
  };

  // 3. Auto-scroll chat smoothly
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleCount, isTyping]);

  // 4. Automated Sequence Loop
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
          playPopTone(step % 2 === 0 ? 500 : 640, 0.06);

          if (step >= CONVERSATION.length) {
            clearInterval(interval);
            setTimeout(() => {
              setPipelinePhase(3);
              playPopTone(820, 0.1);
            }, 1100);
          }
        }, 900);

        return () => clearTimeout(typeDelay);
      }, 2400);

      return () => clearInterval(interval);
    }, 2800);

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
      id="workflow"
      className="relative w-full scroll-mt-28 pt-24 pb-28 px-4 md:px-8 bg-[#F8F9FA] dark:bg-[#07070a] text-[#09090b] dark:text-white overflow-hidden transition-colors"
    >
      {/* Subtle Warm Backdrop Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-slate-200/40 dark:from-violet-900/10 via-purple-100/10 dark:via-purple-900/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-neutral-800 text-[11px] font-semibold tracking-wide text-slate-800 dark:text-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AUTONOMOUS CONCIERGE PIPELINE
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#09090b] dark:text-white">
            The call ends. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#09090b] via-slate-700 to-[#18181b] dark:from-white dark:via-slate-200 dark:to-neutral-400">
              The reservation completes itself.
            </span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-normal leading-relaxed">
            From phone intake to WhatsApp negotiation and Google Calendar synchronization—executed in real time without human staff.
          </p>

          {/* Sound & Manual Replay Controls */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                soundEnabled 
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 shadow-xs" 
                  : "bg-white dark:bg-neutral-900 border-black/[0.08] dark:border-neutral-800 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white shadow-xs"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>{soundEnabled ? "Audio Active (Auto-pauses on scroll)" : "Enable Sound Effects"}</span>
            </button>

            <button
              onClick={() => setLoopKey((k) => k + 1)}
              className="p-1.5 rounded-full bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-neutral-800 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white shadow-xs transition-colors"
              title="Replay sequence"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Minimalist Linear Progress */}
          <div className="pt-2 max-w-xs mx-auto">
            <div className="h-1 w-full bg-slate-200/80 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                key={loopKey}
                className="h-full bg-[#18181b] dark:bg-violet-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 25, ease: "linear" }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-mono">
              <span>01 Intake</span>
              <span>02 WhatsApp</span>
              <span>03 Calendar Sync</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3-COLUMN LUXURY GLASS PIPELINE                            */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">

          {/* STEP 01: VOICE INTAKE */}
          <div className={`flex flex-col rounded-3xl p-6 bg-white dark:bg-neutral-900/80 border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${
            pipelinePhase === 1 
              ? "border-black dark:border-slate-500 ring-1 ring-black/5 dark:ring-white/10" 
              : "border-black/[0.06] dark:border-neutral-800"
          }`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-neutral-800">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 tracking-wider uppercase">
                Step 01 &bull; Voice
              </span>
              <span className={`text-[11px] font-semibold ${pipelinePhase === 1 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                {pipelinePhase === 1 ? "Live Call" : "Resolved"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-base font-bold text-[#09090b] dark:text-white">01 &mdash; Voice Intake</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sarah fields inbound inquiries and gathers details.</p>
            </div>

            <div className="flex-1 rounded-2xl bg-[#F9FAFB] dark:bg-neutral-950/60 border border-black/[0.05] dark:border-neutral-800 p-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    pipelinePhase === 1 ? "bg-emerald-500 animate-ping" : "bg-slate-400"
                  }`} />
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {pipelinePhase === 1 ? "Connected &bull; 00:41" : "Handed off to Chat"}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-neutral-850 border border-black/[0.06] dark:border-neutral-700 text-slate-600 dark:text-slate-300 shadow-xs">
                  Sarah AI Voice
                </span>
              </div>

              {/* Dynamic Soundwave Spectrum */}
              <div className="flex items-center justify-center gap-1.5 h-12 py-1">
                {[30, 70, 40, 95, 60, 100, 50, 85, 30, 90, 65, 35].map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 bg-[#18181b] dark:bg-violet-400 rounded-full"
                    animate={
                      pipelinePhase === 1
                        ? { height: [`${h * 0.2}%`, `${h}%`, `${h * 0.2}%`] }
                        : { height: "10%" }
                    }
                    transition={{
                      duration: 0.75,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.04,
                    }}
                  />
                ))}
              </div>

              {/* Verified Intake Details */}
              <div className="rounded-xl bg-white dark:bg-neutral-900 border border-black/[0.05] dark:border-neutral-800 p-3 text-xs space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Guest:</span>
                  <span className="font-semibold text-[#09090b] dark:text-white">Marcus Vance</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Party:</span>
                  <span className="font-semibold text-[#09090b] dark:text-white">4 Guests (Anniversary)</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Venue:</span>
                  <div className="flex items-center gap-1 font-medium">
                    <span className="filter blur-[3.5px] select-none text-slate-700 dark:text-slate-300">L&apos;Atelier Noir</span>
                    <span className="text-slate-400">(Gate Village 4, DIFC)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-400 font-medium bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/60 rounded-xl px-3 py-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> WhatsApp Handshake Dispatched
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">0.2s</span>
              </div>
            </div>
          </div>

          {/* STEP 02: THE MESSAGE */}
          <div className={`flex flex-col rounded-3xl p-6 bg-white dark:bg-neutral-900/80 border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${
            pipelinePhase === 2 
              ? "border-black dark:border-slate-500 ring-1 ring-black/5 dark:ring-white/10" 
              : "border-black/[0.06] dark:border-neutral-800"
          }`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-neutral-800">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 tracking-wider uppercase">
                Step 02 &bull; WhatsApp
              </span>
              <span className={`text-[11px] font-semibold ${
                pipelinePhase === 2 ? "text-emerald-600 dark:text-emerald-400" : pipelinePhase === 3 ? "text-slate-400" : "text-slate-300 dark:text-slate-600"
              }`}>
                {pipelinePhase === 2 ? "Active Chat" : pipelinePhase === 3 ? "Finalized" : "Standby"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-base font-bold text-[#09090b] dark:text-white">02 &mdash; WhatsApp Negotiation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Seating selection and VIP preferences confirmed.</p>
            </div>

            {/* Chat Frame */}
            <div className="flex-1 rounded-2xl bg-[#F9FAFB] dark:bg-neutral-950/60 border border-black/[0.06] dark:border-neutral-800 flex flex-col h-[420px] overflow-hidden">
              
              {/* WhatsApp Header */}
              <div className="px-4 py-2.5 bg-white dark:bg-neutral-900 border-b border-black/[0.05] dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#18181b] dark:bg-violet-600 text-white flex items-center justify-center font-bold text-[11px]">
                    S
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#09090b] dark:text-white">Sarah</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-300 font-medium">
                        Hostess
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="filter blur-[3px] select-none text-slate-600 dark:text-slate-400">L&apos;Atelier Noir</span>
                      <span>&bull; DIFC Dubai</span>
                    </div>
                  </div>
                </div>
                <span className="text-[9.5px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  Online
                </span>
              </div>

              {/* Message Feed */}
              <div 
                ref={chatScrollRef}
                className="flex-1 p-3 overflow-y-auto space-y-2.5 scroll-smooth"
              >
                {CONVERSATION.slice(0, visibleCount).map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-[12px] leading-relaxed ${
                        msg.sender === "client"
                          ? "bg-[#18181b] dark:bg-violet-600 text-white rounded-br-xs shadow-xs"
                          : "bg-white dark:bg-neutral-800 border border-black/[0.06] dark:border-neutral-700 text-[#09090b] dark:text-neutral-100 rounded-bl-xs shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        msg.sender === "client" ? "text-slate-400" : "text-slate-400"
                      }`}>
                        <span>{msg.time}</span>
                        {msg.sender === "client" && <CheckCheck className="w-3 h-3 text-cyan-300" />}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-black/[0.06] dark:border-neutral-700 w-fit shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-white dark:bg-neutral-900 border-t border-black/[0.05] dark:border-neutral-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>VIP Reservation Line</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">Meta Verified API</span>
              </div>
            </div>
          </div>

          {/* STEP 03: THE CALENDAR */}
          <div className={`flex flex-col rounded-3xl p-6 bg-white dark:bg-neutral-900/80 border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${
            pipelinePhase === 3 
              ? "border-black dark:border-slate-500 ring-1 ring-black/5 dark:ring-white/10" 
              : "border-black/[0.06] dark:border-neutral-800"
          }`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-neutral-800">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 tracking-wider uppercase">
                Step 03 &bull; Calendar
              </span>
              <span className={`text-[11px] font-semibold ${pipelinePhase === 3 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                {pipelinePhase === 3 ? "Confirmed" : "Awaiting Client"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-base font-bold text-[#09090b] dark:text-white">03 &mdash; Real-Time Sync</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Direct calendar locking & staff notification.</p>
            </div>

            <div className="flex-1 rounded-2xl bg-[#F9FAFB] dark:bg-neutral-950/60 border border-black/[0.05] dark:border-neutral-800 p-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shadow-xs">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#09090b] dark:text-white">Google Calendar</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  pipelinePhase === 3
                    ? "bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                    : "bg-slate-200/70 dark:bg-neutral-800 text-slate-600 dark:text-slate-400"
                }`}>
                  {pipelinePhase === 3 ? <Check className="w-3 h-3" /> : null}
                  {pipelinePhase === 3 ? "Table Confirmed" : "Negotiating Slot..."}
                </span>
              </div>

              {/* Event Card */}
              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {pipelinePhase === 3 ? (
                    <motion.div
                      key="restaurant-card"
                      initial={{ opacity: 0, scale: 0.95, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-full rounded-2xl bg-white dark:bg-neutral-900 border border-black/[0.06] dark:border-neutral-800 p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[13px] font-bold text-[#09090b] dark:text-white">
                            VIP Terrace Table (4 Guests)
                          </div>
                          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Thu, Nov 13 &bull; 8:45 PM &ndash; 11:00 PM
                          </div>
                        </div>
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                          Anniversary
                        </span>
                      </div>

                      <div className="border-t border-slate-100 dark:border-neutral-800 pt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">Primary Guest:</span>
                          <span className="font-semibold text-[#09090b] dark:text-white">Marcus Vance (4 Pax)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">Area:</span>
                          <span className="font-semibold text-[#09090b] dark:text-white">Skyline Terrace &bull; Table 12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">VIP Notes:</span>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Complimentary Dessert Sparkler</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">Valet:</span>
                          <span className="text-[#09090b] dark:text-white font-medium">Gate Village 4 (Pass Synced)</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 space-y-2">
                      <div className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 dark:border-neutral-700 mx-auto animate-spin" />
                      <p className="text-xs font-medium">Listening to WhatsApp agreement...</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/70 dark:border-neutral-800">
                <span>Webhook Direct Insert</span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Latency: 0.9s</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export const WorkflowPipelineSection = LuxuryWorkflowPipeline;
export default LuxuryWorkflowPipeline;
