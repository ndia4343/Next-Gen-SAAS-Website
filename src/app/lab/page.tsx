'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  PhoneCall, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  CheckCheck, 
  CalendarCheck,
  ArrowRight
} from 'lucide-react';

export default function LabHeroPage() {
  const [pulseTick, setPulseTick] = useState(0);

  // Autonomous continuous waveform animation (no manual play buttons)
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 180);
    return () => clearInterval(timer);
  }, []);

  // Spatial mouse tracking
  const deckRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 220 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-250, 250], [8, -8]);
  const rotateY = useTransform(smoothX, [-350, 350], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!deckRef.current) return;
    const rect = deckRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#07070A] text-slate-900 dark:text-white flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 lg:py-0 overflow-hidden">
      
      {/* Background Radiance */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-purple-500/10 via-sky-400/10 to-transparent rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: HERO TEXT & CTA */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-xs font-mono font-medium text-slate-800 dark:text-zinc-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AUTONOMOUS INTAKE INFRASTRUCTURE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.12]">
            Zero Missed Calls.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-purple-500 to-[#38BDF8] dark:from-purple-400 dark:via-purple-300 dark:to-cyan-400">
              Zero Human Hold.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-xl">
            Deploy real-time AI receptionists that handle after-hours inquiries, qualify customer intent, and lock confirmed calendar bookings into your CRM instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <a
              href="https://calendar.app.google/u5vL88X41qmGBCky5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              <span>Book 15-Min System Audit</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/5 text-xs font-mono text-slate-600 dark:text-zinc-400">
              <span className="text-emerald-500 font-bold">&lt; 400ms</span>
              <span>Pickup Handshake</span>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs font-mono text-slate-500 dark:text-zinc-500">
            <span>✓ VAPI / RETELL AI CORE</span>
            <span>✓ WHATSAPP AUTOMATION</span>
            <span>✓ ZERO MISSED REVENUE</span>
          </div>
        </div>

        {/* RIGHT COLUMN: COMPACT 3D SPATIAL DECK (FITS HERO SECTION) */}
        <div className="lg:col-span-6 w-full flex items-center justify-center">
          
          <div 
            ref={deckRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1200 }}
            className="relative w-full max-w-[500px] h-[460px] sm:h-[480px] flex items-center justify-center"
          >
            {/* Desktop 3D Floating Isometric Canvas / Flat on Mobile */}
            <motion.div
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative w-full h-full flex items-center justify-center"
            >
              
              {/* GROUND GLASS BACKDROP */}
              <div 
                style={{ transform: 'translateZ(0px)' }}
                className="absolute inset-0 rounded-[30px] bg-white/70 dark:bg-[#0B0F19]/80 backdrop-blur-[16px] border border-slate-200/80 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
              >
                <div className="p-4 px-6 border-b border-slate-200/60 dark:border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE RUNTIME TELEMETRY
                  </span>
                  <span>DUAL-NODE SYNC</span>
                </div>
              </div>

              {/* CARD 1: Voice Intake Slab (Top Left Offset) */}
              <motion.div
                style={{ 
                  transform: 'translateZ(45px) translateX(-45px) translateY(-85px)',
                  transformStyle: 'preserve-3d'
                }}
                className="absolute w-[290px] sm:w-[320px] p-4 rounded-2xl bg-white/90 dark:bg-[#111625]/95 backdrop-blur-[14px] border border-white/80 dark:border-white/15 shadow-[0_15px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-slate-400">INBOUND LINE</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Zara AI Receptionist</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                    &lt; 400ms
                  </span>
                </div>

                {/* Auto Continuous Audio Waveform (No manual play buttons) */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900 text-white border border-slate-800">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1.5">
                    <span>CALL INTAKE: ACTIVE</span>
                    <span className="text-emerald-400 font-bold">98% INTENT</span>
                  </div>

                  <div className="flex items-center gap-1 h-6">
                    {[35, 60, 25, 80, 95, 45, 65, 90, 30, 75, 85, 45, 70, 35, 90, 60, 100, 25, 50, 80, 35].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-purple-500 to-sky-400 rounded-full transition-all duration-300"
                        style={{
                          height: `${Math.max(25, ((h + pulseTick * 4) % 100))}%`,
                          opacity: 0.85,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* CARD 2: WhatsApp Dispatch Slab (Middle Right Offset) */}
              <motion.div
                style={{ 
                  transform: 'translateZ(75px) translateX(65px) translateY(-10px)',
                  transformStyle: 'preserve-3d'
                }}
                className="absolute w-[270px] sm:w-[290px] p-3.5 rounded-2xl bg-white/95 dark:bg-[#111625]/95 backdrop-blur-[14px] border border-white/80 dark:border-white/15 shadow-[0_20px_35px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_35px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">WhatsApp Dispatch</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-sky-600 dark:text-sky-400">0.08s</span>
                </div>

                <div className="mt-2.5 space-y-1.5 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-800 dark:text-zinc-200">
                    Slot held: Tomorrow 3:30 PM. Confirm invite?
                  </div>
                  <div className="p-1.5 px-2.5 rounded-xl bg-purple-600 text-white ml-auto max-w-[80%] flex items-center justify-between">
                    <span>Confirmed.</span>
                    <CheckCheck className="w-3 h-3 text-cyan-300 ml-1" />
                  </div>
                </div>
              </motion.div>

              {/* CARD 3: Revenue & Calendar Synced Slab (Bottom Forefront) */}
              <motion.div
                style={{ 
                  transform: 'translateZ(105px) translateX(-15px) translateY(115px)',
                  transformStyle: 'preserve-3d'
                }}
                className="absolute w-[310px] sm:w-[340px] p-4 rounded-2xl bg-white dark:bg-[#0E131F] backdrop-blur-[20px] border border-white dark:border-white/20 shadow-[0_25px_45px_rgba(0,0,0,0.14)] dark:shadow-[0_25px_45px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Margin Recaptured</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-500 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    100% AUDIT
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2.5">
                  <div>
                    <div className="text-[9px] font-mono text-slate-400">Recaptured Volume</div>
                    <div className="text-base font-black font-mono text-slate-900 dark:text-white">AED 142,850</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-mono text-slate-400">Show-Up Rate</div>
                    <div className="text-base font-black font-mono text-purple-600 dark:text-purple-400">41.8%</div>
                  </div>
                </div>

                <div className="mt-2.5 p-1.5 px-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono flex items-center gap-1.5">
                  <CalendarCheck className="w-3 h-3" />
                  <span>Google Calendar Slot Confirmed</span>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>

      </div>
    </main>
  );
}
