'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  PhoneCall, 
  MessageSquare, 
  TrendingUp, 
  CalendarCheck, 
  ShieldCheck, 
  CheckCheck, 
  ArrowRight,
  Wifi,
  Battery,
  Sparkles,
  Clock,
  Activity,
  Flame,
  Zap,
  Radio
} from 'lucide-react';

export default function LabHeroPage() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'calls' | 'dashboard'>('bookings');
  const [pulseTick, setPulseTick] = useState(0);

  // Autonomous animation cycle for waveform and pop indicators
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 160);
    return () => clearInterval(timer);
  }, []);

  // 3D Gyro Device Tilt on Mouse Move
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 220 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-250, 250], [10, -10]);
  const rotateY = useTransform(smoothX, [-250, 250], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <main className="min-h-screen bg-[#05050A] text-white flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 lg:py-0 overflow-hidden relative">
      
      {/* Background High-Energy Colored Light Radiance */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#FF007A]/20 via-[#7928CA]/25 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[500px] bg-gradient-to-br from-[#00F2FE]/20 via-[#10E773]/20 to-transparent rounded-full blur-[150px] pointer-events-none" />

      {/* Cyber Subtle Hex Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #00F2FE 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: HIGH-ENERGY HERO COPY */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF007A]/15 via-[#7928CA]/20 to-[#00F2FE]/15 border border-[#FF007A]/30 text-xs font-mono font-bold tracking-wider text-[#FF6B97] shadow-[0_0_20px_rgba(255,0,122,0.25)]">
            <Zap className="w-3.5 h-3.5 text-[#10E773] fill-[#10E773] animate-pulse" />
            <span className="text-white">LIVE REVENUE OS // ALL-IN-ONE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Turn Missed Calls Into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10E773] via-[#00F2FE] to-[#FF6B00]">
              Instant Cash.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
            Control voice intake, instant WhatsApp qualification, and live conversion telemetry directly from one autonomous mobile cockpit.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <a
              href="https://calendar.app.google/u5vL88X41qmGBCky5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#10E773] via-[#00F2FE] to-[#00C2FF] hover:opacity-95 text-slate-950 font-black text-sm transition-all shadow-[0_0_30px_rgba(16,231,115,0.4)] active:scale-95"
            >
              <span>Deploy Autonomous Line</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </a>

            <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#10E773] animate-ping" />
              <span className="text-[#10E773] font-bold">&lt; 382ms</span>
              <span>Sub-Second Response</span>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-3 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5"><span className="text-[#00F2FE]">✦</span> RETELL / VAPI CORE</span>
            <span className="flex items-center gap-1.5"><span className="text-[#10E773]">✦</span> ZERO MISSED LEADS</span>
            <span className="flex items-center gap-1.5"><span className="text-[#FF6B00]">✦</span> 100% RECOVERED</span>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D CYBER SMARTPHONE WITH POPPING SPATIAL CAPSULES */}
        <div className="lg:col-span-6 w-full flex items-center justify-center">
          
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1500 }}
            className="relative flex items-center justify-center py-6"
          >
            {/* SPATIAL POP-OUT NOTIFICATION BADGE (Breaks out of the phone to the left) */}
            <motion.div
              style={{
                transform: 'translateZ(65px) translateX(-140px) translateY(-140px)',
                transformStyle: 'preserve-3d'
              }}
              className="absolute z-40 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-purple-950/90 to-slate-900/95 border border-[#A855F7]/40 shadow-[0_15px_35px_rgba(168,85,247,0.35)] backdrop-blur-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#10E773] to-[#00F2FE] flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Radio className="w-5 h-5 text-slate-950 animate-pulse" />
              </div>
              <div className="text-left font-mono pr-2">
                <div className="text-[10px] text-[#00F2FE] font-bold">AUTONOMOUS CALL CAPTURED</div>
                <div className="text-xs text-white font-extrabold">+AED 4,200 Locked In</div>
              </div>
            </motion.div>

            {/* 3D Tilted Device Chassis */}
            <motion.div
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative w-[320px] sm:w-[355px] h-[680px] rounded-[52px] p-3.5 bg-gradient-to-b from-[#1C2033] via-[#0B0D17] to-[#030408] shadow-[0_30px_90px_rgba(0,242,254,0.15),0_20px_50px_rgba(0,0,0,0.8)] border-[3px] border-[#00F2FE]/30 select-none"
            >
              {/* Outer Neon Edge Light Glow */}
              <div className="absolute -inset-[1px] rounded-[54px] bg-gradient-to-b from-[#00F2FE]/40 via-transparent to-[#FF007A]/40 pointer-events-none blur-xs" />

              {/* GLASS SCREEN BEZEL */}
              <div className="relative w-full h-full rounded-[44px] bg-[#070913] text-white overflow-hidden flex flex-col border border-white/10">
                
                {/* Dynamic Screen Glare */}
                <div className="absolute -top-24 -right-24 w-56 h-56 bg-gradient-to-br from-[#00F2FE]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

                {/* STATUS BAR & DYNAMIC ISLAND */}
                <div className="pt-3 px-6 pb-2 flex items-center justify-between z-20 text-[11px] font-mono text-zinc-400">
                  <span className="font-bold text-white">9:41</span>
                  
                  {/* Dynamic Island Capsule */}
                  <div className="w-24 h-5 rounded-full bg-black border border-white/20 flex items-center justify-center gap-1.5 px-2 shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10E773] animate-pulse" />
                    <span className="text-[9px] font-mono text-[#10E773] font-black tracking-tight">AI ONLINE</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Wifi className="w-3 h-3 text-[#00F2FE]" />
                    <Battery className="w-3.5 h-3.5 text-[#10E773]" />
                  </div>
                </div>

                {/* MOBILE APP HEADER */}
                <div className="px-5 pt-2 pb-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                  <div>
                    <div className="text-[9px] font-mono text-[#00F2FE] uppercase tracking-widest font-bold">CLIENT CONTROL HUB</div>
                    <div className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                      <span>Zavian OS Mobile</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10E773]" />
                    </div>
                  </div>

                  <div className="px-2.5 py-0.5 rounded-full bg-[#10E773]/15 border border-[#10E773]/30 text-[#10E773] text-[9px] font-mono font-bold">
                    ACTIVE
                  </div>
                </div>

                {/* INTERACTIVE MOBILE APP VIEWPORT */}
                <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3.5 relative z-10 scrollbar-none">
                  
                  <AnimatePresence mode="wait">
                    
                    {/* TAB 1: LIVE BOOKINGS */}
                    {activeTab === 'bookings' && (
                      <motion.div
                        key="bookings"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-zinc-400">INCOMING PIPELINE</span>
                          <span className="text-[#10E773] font-bold">2 CONFIRMED</span>
                        </div>

                        {/* Booking Card 1 - Dental */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-[#00F2FE]/30 backdrop-blur-md space-y-2 shadow-[0_4px_20px_rgba(0,242,254,0.08)]">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-white">Dr. Aris Dental Clinic</span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#10E773]/20 text-[#10E773] border border-[#10E773]/30 font-bold">
                              LOCKED
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300">Patient: Marcus Vance (Emergency Root Canal)</div>
                          
                          <div className="p-2 rounded-xl bg-purple-950/40 border border-[#A855F7]/30 text-[10px] font-mono text-[#D8B4FE] flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-[#00F2FE]" />
                              Tomorrow • 3:30 PM
                            </span>
                            <span className="text-[#10E773] font-bold">Synced ✓</span>
                          </div>
                        </div>

                        {/* Booking Card 2 - Roofing Contractor */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-[#FF6B00]/30 backdrop-blur-md space-y-2 shadow-[0_4px_20px_rgba(255,107,0,0.08)]">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-white">Grace Roofing Services</span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#FF6B00]/20 text-[#FF8533] border border-[#FF6B00]/40 font-bold">
                              ESTIMATE
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300">Client: Guinevere Gorman (Storm Inspection)</div>
                          
                          <div className="p-2 rounded-xl bg-slate-900 border border-white/10 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                            <span>WhatsApp Packet Sent</span>
                            <span className="text-[#00F2FE] font-bold">0.08s</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 2: LIVE CALL AUDIO & WHATSAPP */}
                    {activeTab === 'calls' && (
                      <motion.div
                        key="calls"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-zinc-400">ACTIVE VOICE STREAM</span>
                          <span className="text-[#00F2FE] font-bold">&lt; 382ms JITTER</span>
                        </div>

                        {/* Looping Frequency Waveform with Neon Colors */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-[#A855F7]/30 backdrop-blur-md space-y-2.5 shadow-[0_4px_20px_rgba(168,85,247,0.1)]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                              <PhoneCall className="w-3.5 h-3.5 text-[#10E773] animate-bounce" />
                              <span>Zara AI // Active Call</span>
                            </div>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-[#10E773]/20 text-[#10E773] font-bold">LIVE</span>
                          </div>

                          <div className="flex items-center gap-1 h-7 px-1 bg-black/60 rounded-xl border border-white/5">
                            {[30, 75, 45, 95, 100, 60, 85, 90, 40, 80, 95, 50, 85, 40, 100, 70, 95, 35].map((h, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-[#FF007A] via-[#A855F7] to-[#00F2FE] rounded-full transition-all duration-200"
                                style={{
                                  height: `${Math.max(25, ((h + pulseTick * 6) % 100))}%`,
                                }}
                              />
                            ))}
                          </div>

                          <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
                            <span className="text-[#10E773] font-bold">Intent: 98% (High Urgency)</span>
                            <span className="text-white">00:34</span>
                          </div>
                        </div>

                        {/* WhatsApp Message Handshake */}
                        <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1.5 text-xs">
                          <div className="text-[10px] font-mono text-[#00F2FE] flex items-center justify-between font-bold">
                            <span>WHATSAPP DISPATCH</span>
                            <CheckCheck className="w-3.5 h-3.5 text-[#10E773]" />
                          </div>
                          <div className="text-[11px] text-slate-300">
                            &quot;Marcus, priority slot provisionally held for tomorrow 3:30 PM. Tap to confirm calendar invite.&quot;
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 3: DASHBOARD REVENUE TELEMETRY */}
                    {activeTab === 'dashboard' && (
                      <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-zinc-400">FINANCIAL AUDIT</span>
                          <span className="text-[#10E773] font-bold">+18.4% RECOVERED</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#10E773]/10 to-transparent border border-[#10E773]/30">
                            <div className="text-[9px] font-mono text-zinc-400">RECAPTURED REVENUE</div>
                            <div className="text-base font-black font-mono text-white mt-1">AED 142,850</div>
                            <div className="text-[8px] text-[#10E773] font-mono font-bold mt-0.5">100% after-hours</div>
                          </div>

                          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#FF007A]/10 to-transparent border border-[#FF007A]/30">
                            <div className="text-[9px] font-mono text-zinc-400">SHOW-UP RATE</div>
                            <div className="text-base font-black font-mono text-[#FF6B97] mt-1">41.8%</div>
                            <div className="text-[8px] text-zinc-400 font-mono mt-0.5">Zero dropped calls</div>
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-xs font-mono text-[#00F2FE] flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold">
                            <Flame className="w-3.5 h-3.5 text-[#FF6B00]" />
                            Front Desk Savings
                          </span>
                          <span className="font-extrabold text-white">$3,200/mo</span>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>

                </div>

                {/* MOBILE DOCK TAB NAVIGATION */}
                <div className="p-2 border-t border-white/10 bg-black/80 backdrop-blur-xl grid grid-cols-3 gap-1 z-20">
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className={`py-2 flex flex-col items-center gap-1 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'bookings'
                        ? 'bg-gradient-to-r from-[#10E773]/20 to-[#00F2FE]/20 text-[#10E773] font-bold border border-[#10E773]/40'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span className="text-[9px] font-mono">Bookings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('calls')}
                    className={`py-2 flex flex-col items-center gap-1 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'calls'
                        ? 'bg-gradient-to-r from-[#FF007A]/20 to-[#A855F7]/20 text-[#FF6B97] font-bold border border-[#FF007A]/40'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span className="text-[9px] font-mono">Live Calls</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className={`py-2 flex flex-col items-center gap-1 rounded-xl transition-all cursor-pointer ${
                      activeTab === 'dashboard'
                        ? 'bg-gradient-to-r from-[#FF6B00]/20 to-[#FFAA00]/20 text-[#FFAA00] font-bold border border-[#FF6B00]/40'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[9px] font-mono">Telemetry</span>
                  </button>
                </div>

                {/* iOS Bottom Gesture Bar */}
                <div className="pb-2 pt-1 flex justify-center bg-black">
                  <div className="w-28 h-1 rounded-full bg-white/40" />
                </div>

              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </main>
  );
}
