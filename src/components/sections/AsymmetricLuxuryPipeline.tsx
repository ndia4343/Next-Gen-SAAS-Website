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
  ArrowRight,
  Globe,
  Zap,
  UtensilsCrossed
} from "lucide-react";

interface Message {
  sender: "client" | "reception";
  text: string;
  time: string;
}

// EXACT CONVERSATION PRESERVED
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

interface AsymmetricLuxuryPipelineProps {
  onOpenQuoteModal?: (service: string) => void;
}

export function AsymmetricLuxuryPipeline({ onOpenQuoteModal }: AsymmetricLuxuryPipelineProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
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

  // Apple Glass Audio Chime
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
    } catch (e) {
      console.warn("Audio blocked", e);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleCount, isTyping]);

  // Main automated timeline
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

          if (step >= CONVERSATION.length) {
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
      id="workflow"
      className="relative w-full scroll-mt-24 pt-28 pb-28 px-4 md:px-8 bg-[#F8F9FA] dark:bg-[#08090D] text-zinc-900 dark:text-white transition-colors duration-300 overflow-hidden"
    >
      {/* Dynamic Ambient Background Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold tracking-wide text-zinc-800 dark:text-zinc-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AUTONOMOUS BOOKING PIPELINE
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.12]">
            Every inquiry negotiated. <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Every booking confirmed.
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Inbound WhatsApp messages qualify customer intent, verify real-time calendar availability, and lock confirmed appointments without human delay.
          </p>

          {/* Audio & Replay Controls */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
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
              className="p-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white shadow-xs transition-colors"
              title="Restart sequence"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Minimalist Timeline */}
          <div className="pt-2 max-w-xs mx-auto">
            <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                key={loopKey}
                className="h-full bg-emerald-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 25, ease: "linear" }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5 font-mono">
              <span>01 Inbound Lead</span>
              <span>02 Autonomous Chat</span>
              <span>03 Calendar Lock</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ASYMMETRICAL PIPELINE: SATELLITES (SIDE) + HERO (CENTER)  */}
        {/* ========================================================= */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          {/* VISIBLE 3D GLOWING PIPELINE CONNECTORS (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[23%] right-[23%] -translate-y-1/2 h-[2px] z-0 pointer-events-none">
            {/* Left Beam Track (Node 1 -> Center) */}
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

            {/* Right Beam Track (Center -> Node 3) */}
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

          {/* ======================================================= */}
          {/* NODE 01: COMPACT INBOUND LEAD TRIGGER (Col Span: 3)    */}
          {/* ======================================================= */}
          <div className={`relative z-10 lg:col-span-3 flex flex-col rounded-2xl p-5 bg-white dark:bg-zinc-900/90 border transition-all duration-300 shadow-md backdrop-blur-md ${
            pipelinePhase === 1 
              ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg" 
              : "border-zinc-200 dark:border-zinc-800"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                01 &bull; Inbound
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

          {/* ======================================================= */}
          {/* NODE 02: HERO CENTERPIECE (Col Span: 6)                 */}
          {/* Tall, Rich WhatsApp Mobile Chassis                      */}
          {/* ======================================================= */}
          <div className={`relative z-10 lg:col-span-6 flex flex-col rounded-3xl p-5 md:p-6 bg-white dark:bg-zinc-900 border transition-all duration-300 shadow-xl backdrop-blur-md ${
            pipelinePhase === 2 
              ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-2xl" 
              : "border-zinc-200 dark:border-zinc-800"
          }`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                02 &bull; WhatsApp Concierge
              </span>
              <span className={`text-[11px] font-semibold ${
                pipelinePhase === 2 ? "text-emerald-600 dark:text-emerald-400" : pipelinePhase === 3 ? "text-zinc-400" : "text-zinc-400"
              }`}>
                {pipelinePhase === 2 ? "Live Negotiation" : pipelinePhase === 3 ? "Completed" : "Standby"}
              </span>
            </div>

            <div className="py-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Sarah AI Hostess</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Automated floor availability check & preference matching.</p>
            </div>

            {/* Chat Screen Chassis */}
            <div className="flex-1 rounded-2xl bg-[#F8FAFC] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col h-[420px] overflow-hidden">
              
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

              {/* Message Feed (Auto-scrolling with Apple tones) */}
              <div 
                ref={chatScrollRef}
                className="flex-1 p-3.5 overflow-y-auto space-y-2.5 scroll-smooth"
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

          {/* ======================================================= */}
          {/* NODE 03: COMPACT HOST STAND LEDGER (Col Span: 3)        */}
          {/* ======================================================= */}
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

            {/* Dynamic Event Status Card */}
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

        {/* Integration Ticker: Framed Top & Bottom + High-Contrast Bold Text */}
        <div className="w-full mt-16 border-y border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 py-4 overflow-hidden">
          <div className="flex items-center justify-center flex-wrap gap-x-8 gap-y-3 px-4 text-xs font-bold tracking-wider uppercase text-neutral-800 dark:text-neutral-200">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              Stripe Concierge Invoicing
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              Twilio High-Throughput SMS
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              Google Calendar API
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              Meta Cloud WhatsApp Business
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              HubSpot CRM Sync
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              Retell AI Voice Core
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

export const WhatsAppPipelineSection = AsymmetricLuxuryPipeline;
export const WorkflowPipelineSection = AsymmetricLuxuryPipeline;
export default AsymmetricLuxuryPipeline;
