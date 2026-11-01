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
  Send,
  MessageSquare,
  Globe,
  Zap
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

const INTEGRATIONS = [
  "Meta WhatsApp Cloud API",
  "Google Calendar API",
  "Zero-Cost Cloud Architecture",
  "Instant 24/7 Auto-Sync",
  "Direct Host Stand Booking",
  "Encrypted Client Webhooks",
  "n8n & Make Orchestration"
];

interface LuxuryPipelineShowcaseProps {
  onOpenQuoteModal?: (service: string) => void;
}

export function LuxuryPipelineShowcase({ onOpenQuoteModal }: LuxuryPipelineShowcaseProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [pipelinePhase, setPipelinePhase] = useState<1 | 2 | 3>(1);
  const [visibleCount, setVisibleCount] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(true);
  const [loopKey, setLoopKey] = useState<number>(0);

  // 1. Intersection Observer: Stop audio instantly if user scrolls away
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

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Apple iOS Style Crisp Glass Chime
  const playAppleChime = (isClient = false) => {
    if (!soundEnabled || !isInView) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const baseFreq = isClient ? 784 : 880; // A5 note

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      console.warn("Audio Context blocked", e);
    }
  };

  // 3. Auto-scroll chat feed
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleCount, isTyping]);

  // 4. Automated Cycle
  useEffect(() => {
    setPipelinePhase(1);
    setVisibleCount(1);
    setIsTyping(false);

    // T = 2.4s: Pipe pulse reaches Card 2, start WhatsApp chat
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
            // T + 1.2s: Pipe pulse reaches Card 3, calendar locks
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

    // Loop duration: ~24s
    const loopTimer = setTimeout(() => {
      setLoopKey((k) => k + 1);
    }, 24500);

    return () => {
      clearTimeout(tStartChat);
      clearTimeout(loopTimer);
    };
  }, [loopKey, soundEnabled, isInView]);

  return (
    <section 
      ref={sectionRef}
      id="workflow"
      className="relative w-full scroll-mt-28 pt-36 pb-24 px-4 md:px-8 bg-[#09090b] text-white overflow-hidden"
    >
      {/* Background Architectural Mesh & Dimmed Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-semibold tracking-wide text-zinc-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            DIRECT WHATSAPP CONCIERGE PIPELINE
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            <span>The text arrives.</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
              The reservation confirms itself.
            </span>
          </h2>
          
          <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed">
            From initial guest message to live WhatsApp negotiation and Google Calendar lock-in. Powered by Meta Business API.
          </p>

          {/* Sound & Controls */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) setTimeout(() => playAppleChime(false), 50);
              }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                soundEnabled 
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-xs" 
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
              <span>{soundEnabled ? "Apple Chimes: ON" : "Enable Message Chimes"}</span>
            </button>

            <button
              onClick={() => setLoopKey((k) => k + 1)}
              className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white shadow-xs transition-colors"
              title="Restart sequence"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Minimal Timeline */}
          <div className="pt-2 max-w-xs mx-auto">
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                key={loopKey}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 24.5, ease: "linear" }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1.5 font-mono">
              <span>01 Inbound</span>
              <span>02 WhatsApp</span>
              <span>03 Calendar</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3-CARD STAGE WITH 3D GLOWING PIPELINE CONNECTORS          */}
        {/* ========================================================= */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* DESKTOP 3D PIPELINE TRACKS (Between Card 1 -> 2 and 2 -> 3) */}
          <div className="hidden lg:block absolute top-[48%] left-[30%] right-[30%] h-0.5 z-0 pointer-events-none">
            {/* Pipeline 1 -> 2 */}
            <div className="absolute left-0 w-[42%] h-full bg-zinc-800">
              {pipelinePhase >= 1 && (
                <motion.div 
                  className="h-full bg-gradient-to-r from-transparent via-emerald-400 to-emerald-500 shadow-[0_0_12px_#10b981]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>

            {/* Pipeline 2 -> 3 */}
            <div className="absolute right-0 w-[42%] h-full bg-zinc-800">
              {pipelinePhase >= 2 && (
                <motion.div 
                  className="h-full bg-gradient-to-r from-transparent via-emerald-400 to-emerald-500 shadow-[0_0_12px_#10b981]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: 0.8 }}
                />
              )}
            </div>
          </div>

          {/* STEP 01: INBOUND LEAD TRIGGER */}
          <div className={`relative z-10 flex flex-col rounded-3xl p-6 bg-zinc-900/90 border transition-all duration-300 shadow-xl backdrop-blur-md ${
            pipelinePhase === 1 
              ? "border-emerald-500/60 ring-1 ring-emerald-500/20" 
              : "border-zinc-800"
          }`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 tracking-wider uppercase">
                Step 01 &bull; Inbound
              </span>
              <span className={`text-[11px] font-semibold ${pipelinePhase === 1 ? "text-emerald-400" : "text-zinc-500"}`}>
                {pipelinePhase === 1 ? "Signal Dispatched" : "Standby"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-base font-bold text-white">01 &mdash; Inbound Channel</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Guest initiates inquiry via website or WhatsApp.</p>
            </div>

            <div className="flex-1 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    pipelinePhase === 1 ? "bg-emerald-400 animate-ping" : "bg-zinc-600"
                  }`} />
                  <span className="text-[11px] font-medium text-zinc-300">
                    {pipelinePhase === 1 ? "Lead Handshake Active" : "Triggered & Forwarded"}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  wa.me link
                </span>
              </div>

              {/* Inbound Trigger Mock Card */}
              <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-3.5 text-xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800/80">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white">VIP Dining Widget</div>
                    <div className="text-[10px] text-zinc-400">Gate Village 4, DIFC</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-zinc-400">
                    <span>Source:</span>
                    <span className="text-zinc-200 font-medium">Direct WhatsApp CTA</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Sender:</span>
                    <span className="text-white font-medium">Marcus Vance</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Target Venue:</span>
                    <div className="flex items-center gap-1 font-medium">
                      <span className="filter blur-[3.5px] select-none text-zinc-300">L&apos;Atelier Noir</span>
                      <span className="text-zinc-500">(DIFC)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> Pipeline Forwarded
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">0.08s</span>
              </div>
            </div>
          </div>

          {/* STEP 02: THE MESSAGE (EXACT CHAT PRESERVED) */}
          <div className={`relative z-10 flex flex-col rounded-3xl p-6 bg-zinc-900/90 border transition-all duration-300 shadow-xl backdrop-blur-md ${
            pipelinePhase === 2 
              ? "border-emerald-500/60 ring-1 ring-emerald-500/20" 
              : "border-zinc-800"
          }`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 tracking-wider uppercase">
                Step 02 &bull; WhatsApp
              </span>
              <span className={`text-[11px] font-semibold ${
                pipelinePhase === 2 ? "text-emerald-400" : pipelinePhase === 3 ? "text-zinc-500" : "text-zinc-600"
              }`}>
                {pipelinePhase === 2 ? "Active Chat" : pipelinePhase === 3 ? "Finalized" : "Queued"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-base font-bold text-white">02 &mdash; WhatsApp Negotiation</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Seating selection and VIP preferences confirmed.</p>
            </div>

            {/* Chat Frame */}
            <div className="flex-1 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col h-[420px] overflow-hidden">
              
              {/* WhatsApp Header */}
              <div className="px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center font-bold text-[11px]">
                    S
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Sarah</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 font-medium">
                        Hostess
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <span className="filter blur-[3px] select-none text-zinc-400">L&apos;Atelier Noir</span>
                      <span>&bull; DIFC Dubai</span>
                    </div>
                  </div>
                </div>
                <span className="text-[9.5px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Online
                </span>
              </div>

              {/* Message Feed (Auto-scrolling with Apple tones) */}
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
                          ? "bg-zinc-800 border border-zinc-700 text-white rounded-br-xs shadow-sm"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-xs"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        msg.sender === "client" ? "text-zinc-400" : "text-zinc-500"
                      }`}>
                        <span>{msg.time}</span>
                        {msg.sender === "client" && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
                <span>VIP Direct Guest Channel</span>
                <span className="text-[10px] font-mono text-emerald-400 font-medium">Meta Verified API</span>
              </div>
            </div>
          </div>

          {/* STEP 03: RESERVATION CALENDAR */}
          <div className={`relative z-10 flex flex-col rounded-3xl p-6 bg-zinc-900/90 border transition-all duration-300 shadow-xl backdrop-blur-md ${
            pipelinePhase === 3 
              ? "border-emerald-500/60 ring-1 ring-emerald-500/20" 
              : "border-zinc-800"
          }`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 tracking-wider uppercase">
                Step 03 &bull; Calendar
              </span>
              <span className={`text-[11px] font-semibold ${pipelinePhase === 3 ? "text-emerald-400" : "text-zinc-500"}`}>
                {pipelinePhase === 3 ? "Locked & Synced" : "Pending"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-base font-bold text-white">03 &mdash; Reservation Calendar</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Instant table slot insertion into Google Calendar.</p>
            </div>

            <div className="flex-1 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">Google Calendar</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  pipelinePhase === 3
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-zinc-800 text-zinc-500"
                }`}>
                  {pipelinePhase === 3 ? <Check className="w-3 h-3" /> : null}
                  {pipelinePhase === 3 ? "Table Confirmed" : "Negotiating..."}
                </span>
              </div>

              {/* Confirmed Slot Event Card */}
              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {pipelinePhase === 3 ? (
                    <motion.div
                      key="restaurant-card"
                      initial={{ opacity: 0, scale: 0.95, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-md space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[13px] font-bold text-white">
                            VIP Terrace Table (4 Guests)
                          </div>
                          <div className="text-[11px] font-medium text-zinc-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            Thu, Nov 13 &bull; 8:45 PM &ndash; 11:00 PM
                          </div>
                        </div>
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          Anniversary
                        </span>
                      </div>

                      <div className="border-t border-zinc-800/80 pt-2.5 space-y-1.5 text-xs text-zinc-300">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Primary Guest:</span>
                          <span className="font-semibold text-white">Marcus Vance (4 Pax)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Area:</span>
                          <span className="font-semibold text-white">Skyline Terrace &bull; Table 12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">VIP Notes:</span>
                          <span className="font-semibold text-emerald-400">Complimentary Dessert Sparkler</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Valet:</span>
                          <span className="text-zinc-300 font-medium">Gate Village 4 (Pass Synced)</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-8 text-zinc-500 space-y-2">
                      <div className="w-7 h-7 rounded-full border-2 border-dashed border-zinc-700 mx-auto animate-spin" />
                      <p className="text-xs font-medium">Awaiting final WhatsApp agreement...</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                <span>Webhook Direct Insert</span>
                <span className="font-mono text-[10px] text-emerald-400 font-semibold">Latency: 0.9s</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* SLOW-SCROLLING INTEGRATIONS TICKER                        */}
        {/* ========================================================= */}
        <div className="pt-8 border-t border-zinc-800/80 overflow-hidden relative">
          <div className="flex items-center gap-10 whitespace-nowrap animate-marquee">
            {[...INTEGRATIONS, ...INTEGRATIONS].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-medium text-zinc-400 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export const WorkflowPipelineSection = LuxuryPipelineShowcase;
export default LuxuryPipelineShowcase;
