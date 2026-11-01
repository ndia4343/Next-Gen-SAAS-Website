"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PhoneCall, 
  Calendar, 
  CheckCheck, 
  Clock, 
  MapPin, 
  Check, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles,
  Users
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

interface RestaurantBookingPipelineProps {
  onOpenQuoteModal?: (service: string) => void;
}

export default function RestaurantBookingPipeline({ onOpenQuoteModal }: RestaurantBookingPipelineProps = {}) {
  const [pipelinePhase, setPipelinePhase] = useState<1 | 2 | 3>(1);
  const [visibleCount, setVisibleCount] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [loopKey, setLoopKey] = useState<number>(0);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API for message pops (A5 Crisp Upper Overtone & Smooth Glass Tail)
  const playPopTone = (baseFreq = 880, duration = 0.22) => {
    if (!soundEnabled) return;
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
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime); // Base note (880Hz A5)
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, ctx.currentTime + 0.05); // Crisp upper overtone (1760Hz)

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration); // Smooth glass tail

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context not supported or blocked", e);
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleCount, isTyping]);

  // Main automated looping sequence
  useEffect(() => {
    setPipelinePhase(1);
    setVisibleCount(1);
    setIsTyping(false);

    // Timeline Sequence
    // T = 2.6s: Start Step 2 (WhatsApp)
    const tStartChat = setTimeout(() => {
      setPipelinePhase(2);

      let step = 1;
      const interval = setInterval(() => {
        setIsTyping(true);

        const typeDelay = setTimeout(() => {
          setIsTyping(false);
          step += 1;
          setVisibleCount(step);
          playPopTone(step % 2 === 0 ? 520 : 680, 0.07);

          if (step >= CONVERSATION.length) {
            clearInterval(interval);
            // T + 1.2s: Complete Step 3 (Calendar Drop)
            setTimeout(() => {
              setPipelinePhase(3);
              playPopTone(880, 0.12);
            }, 1200);
          }
        }, 900);

        return () => clearTimeout(typeDelay);
      }, 2300);

      return () => clearInterval(interval);
    }, 2600);

    // Loop duration: ~24s per complete cycle
    const loopTimer = setTimeout(() => {
      setLoopKey((k) => k + 1);
    }, 24500);

    return () => {
      clearTimeout(tStartChat);
      clearTimeout(loopTimer);
    };
  }, [loopKey, soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    if (!soundEnabled) {
      playPopTone(750, 0.1);
    }
  };

  const handleManualReset = () => {
    setLoopKey((k) => k + 1);
  };

  return (
    <section 
      id="workflow-pipeline" 
      className="relative w-full py-20 px-4 md:px-8 bg-[#FAFAFA] dark:bg-[#07070a] text-[#09090b] dark:text-white overflow-hidden transition-colors scroll-mt-28"
    >
      {/* Background Architectural Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:22px_22px] opacity-75 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold tracking-wide text-slate-800 dark:text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE AUTOMATION WORKFLOW
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#09090b] dark:text-white">
            The call ends. The automation doesn&apos;t.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-normal">
            Voice &rarr; WhatsApp &rarr; Google Calendar. Natural conversations that book revenue 24/7.
          </p>

          {/* Sound & Replay Controls */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={toggleSound}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                soundEnabled 
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 shadow-xs" 
                  : "bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{soundEnabled ? "Message Tones: ON" : "Enable Message Tones"}</span>
            </button>

            <button
              onClick={handleManualReset}
              className="p-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white hover:border-slate-300 shadow-xs transition-colors"
              title="Restart Demonstration"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline Bar */}
          <div className="pt-2 max-w-xs mx-auto">
            <div className="h-1.5 w-full bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                key={loopKey}
                className="h-full bg-[#18181b] dark:bg-violet-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 24.5, ease: "linear" }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
              <span>01 Voice</span>
              <span>02 WhatsApp</span>
              <span>03 Calendar Sync</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3-COLUMN HIGH-CONVERSION PIPELINE                         */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">

          {/* STEP 01: THE CALL */}
          <div className={`flex flex-col rounded-3xl p-6 bg-white dark:bg-neutral-900/80 border transition-all duration-300 shadow-sm ${
            pipelinePhase === 1 
              ? "border-[#18181b] dark:border-slate-600 ring-2 ring-slate-900/5 dark:ring-slate-100/5 shadow-md" 
              : "border-slate-200 dark:border-neutral-800"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Step 01 &bull; Voice Intake
              </span>
              <span className={`text-xs font-bold ${pipelinePhase === 1 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                {pipelinePhase === 1 ? "In Progress" : "Completed"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-lg font-black text-[#09090b] dark:text-white">01 &mdash; THE CALL</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hostess Sarah qualifies the booking on the phone.</p>
            </div>

            <div className="flex-1 rounded-2xl bg-[#F8FAFC] dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 p-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    pipelinePhase === 1 ? "bg-emerald-500 animate-ping" : "bg-slate-400"
                  }`} />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {pipelinePhase === 1 ? "Call Connected &bull; 00:41" : "Call Disconnected"}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-slate-300">
                  Sarah AI Voice
                </span>
              </div>

              {/* Sound Spectrum */}
              <div className="flex items-center justify-center gap-1.5 h-12 py-1">
                {[35, 75, 40, 95, 60, 100, 50, 85, 30, 90, 65, 40].map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 bg-[#18181b] dark:bg-violet-400 rounded-full"
                    animate={
                      pipelinePhase === 1
                        ? { height: [`${h * 0.25}%`, `${h}%`, `${h * 0.25}%`] }
                        : { height: "12%" }
                    }
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.04,
                    }}
                  />
                ))}
              </div>

              {/* Caller Dossier */}
              <div className="rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-3 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Guest:</span>
                  <span className="font-bold text-[#09090b] dark:text-white">Marcus Vance</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Party Size:</span>
                  <span className="font-bold text-[#09090b] dark:text-white">4 Guests (Anniversary)</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Venue:</span>
                  <div className="flex items-center gap-1 font-medium">
                    <span className="filter blur-[3.5px] select-none text-slate-700 dark:text-slate-300">L&apos;Atelier Noir</span>
                    <span className="text-slate-400">(Gate Village 4, DIFC)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-lg px-2.5 py-1.5">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Shift to WhatsApp Channel
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">0.2s</span>
              </div>
            </div>
          </div>

          {/* STEP 02: THE MESSAGE (Natural, Scrolling, Audible) */}
          <div className={`flex flex-col rounded-3xl p-6 bg-white dark:bg-neutral-900/80 border transition-all duration-300 shadow-sm ${
            pipelinePhase === 2 
              ? "border-[#18181b] dark:border-slate-600 ring-2 ring-slate-900/5 dark:ring-slate-100/5 shadow-md" 
              : "border-slate-200 dark:border-neutral-800"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Step 02 &bull; WhatsApp
              </span>
              <span className={`text-xs font-bold ${
                pipelinePhase === 2 ? "text-emerald-600 dark:text-emerald-400" : pipelinePhase === 3 ? "text-slate-400" : "text-slate-300 dark:text-slate-600"
              }`}>
                {pipelinePhase === 2 ? "Chatting Live" : pipelinePhase === 3 ? "Delivered" : "Standby"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-lg font-black text-[#09090b] dark:text-white">02 &mdash; THE MESSAGE</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Realistic conversational table reservation.</p>
            </div>

            {/* Chat Container with Smooth Auto-Scroll */}
            <div className="flex-1 rounded-2xl bg-[#F8FAFC] dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 flex flex-col h-[420px] overflow-hidden">
              
              {/* WhatsApp Header */}
              <div className="px-3.5 py-2.5 bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#18181b] dark:bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#09090b] dark:text-white">Sarah</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 font-medium">
                        Hostess
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="filter blur-[3px] select-none text-slate-500 dark:text-slate-400">L&apos;Atelier Noir</span>
                      <span>&bull; DIFC Dubai</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Online
                </span>
              </div>

              {/* Scrollable Message Box */}
              <div 
                ref={chatScrollRef}
                className="flex-1 p-3 overflow-y-auto space-y-2.5 scroll-smooth"
              >
                {CONVERSATION.slice(0, visibleCount).map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-[12px] leading-relaxed shadow-xs ${
                        msg.sender === "client"
                          ? "bg-[#18181b] dark:bg-violet-600 text-white rounded-br-xs"
                          : "bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-[#09090b] dark:text-neutral-100 rounded-bl-xs"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        msg.sender === "client" ? "text-slate-300" : "text-slate-400 dark:text-slate-400"
                      }`}>
                        <span>{msg.time}</span>
                        {msg.sender === "client" && <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Dots */}
                {isTyping && (
                  <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>

              {/* Input Footer */}
              <div className="p-2.5 bg-white dark:bg-neutral-900 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400">
                <span>Direct VIP guest line</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Meta Business API</span>
              </div>
            </div>
          </div>

          {/* STEP 03: THE CALENDAR */}
          <div className={`flex flex-col rounded-3xl p-6 bg-white dark:bg-neutral-900/80 border transition-all duration-300 shadow-sm ${
            pipelinePhase === 3 
              ? "border-[#18181b] dark:border-slate-600 ring-2 ring-slate-900/5 dark:ring-slate-100/5 shadow-md" 
              : "border-slate-200 dark:border-neutral-800"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Step 03 &bull; Calendar
              </span>
              <span className={`text-xs font-bold ${pipelinePhase === 3 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                {pipelinePhase === 3 ? "Locked & Synced" : "Pending Agreement"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-lg font-black text-[#09090b] dark:text-white">03 &mdash; THE CALENDAR</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Direct slot insertion into Google Calendar.</p>
            </div>

            <div className="flex-1 rounded-2xl bg-[#F8FAFC] dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 p-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#09090b] dark:text-white">Google Calendar API</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  pipelinePhase === 3
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                    : "bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-slate-400"
                }`}>
                  {pipelinePhase === 3 ? <Check className="w-3 h-3" /> : null}
                  {pipelinePhase === 3 ? "Table Confirmed" : "Negotiating Slot..."}
                </span>
              </div>

              {/* The Calendar Event Card */}
              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {pipelinePhase === 3 ? (
                    <motion.div
                      key="restaurant-card"
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="w-full rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[13px] font-black text-[#09090b] dark:text-white">
                            VIP Terrace Table (4 Guests)
                          </div>
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Thu, Nov 13 &bull; 8:45 PM &ndash; 11:00 PM
                          </div>
                        </div>
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          Anniversary
                        </span>
                      </div>

                      <div className="border-t border-slate-100 dark:border-neutral-800 pt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">Primary Guest:</span>
                          <span className="font-semibold text-[#09090b] dark:text-white">Marcus Vance (4 Pax)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">Assigned Area:</span>
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
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 dark:border-neutral-700 mx-auto animate-spin" />
                      <p className="text-xs font-medium">Listening to WhatsApp agreement...</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-neutral-800">
                <span>Table Reserved via Calendar API</span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Latency: 0.9s</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
