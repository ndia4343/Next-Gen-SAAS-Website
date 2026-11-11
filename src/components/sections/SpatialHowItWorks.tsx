'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  PhoneCall, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Pause, 
  CheckCheck,
  Calendar,
  Volume2
} from 'lucide-react';

// --- Card 3D Spatial Tilt Container ---
function SpatialGlassCard({
  children,
  className = '',
  spotlightColor = 'rgba(168, 85, 247, 0.15)',
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set((x / rect.width) - 0.5);
    mouseY.set((y / rect.height) - 0.5);
    setMousePos({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setMousePos((prev) => ({ ...prev, active: false }));
  };

  return (
    <div style={{ perspective: 1200 }} className="relative group">
      {/* 3D Physical Depth Slab (Slight dark offset backing) */}
      <div className="absolute inset-0 translate-y-3 translate-x-1 rounded-[26px] bg-slate-950/20 dark:bg-black/60 blur-md pointer-events-none transition-transform duration-300 group-hover:translate-y-4" />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative rounded-[22px] backdrop-blur-[14px] bg-white/75 dark:bg-[#0B0F19]/80 border border-slate-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden transition-colors duration-300 ${className}`}
      >
        {/* Dynamic Edge-Light Ignited on Mouse Hover */}
        {mousePos.active && (
          <div
            className="pointer-events-none absolute -inset-px rounded-[22px] transition-opacity duration-300 opacity-100 z-10"
            style={{
              background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 70%)`,
            }}
          />
        )}

        {/* Ambient Orbiting Edge-Light Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-sky-500/10 dark:bg-sky-400/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-700" />

        <div className="relative z-20" style={{ transform: 'translateZ(20px)' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// --- Main Spatial How-It-Works Component ---
export default function SpatialHowItWorks() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(38);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  return (
    <section className="relative w-full py-24 bg-[#F8FAFC] dark:bg-[#07070A] transition-colors duration-500 overflow-hidden">
      
      {/* Background Subtle Tech Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 text-xs font-mono font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Tri-Node Pipeline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            How Inquiries Turn Into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-purple-500 to-[#38BDF8] dark:from-purple-400 dark:via-purple-300 dark:to-cyan-400">
              Locked Settlements.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            Every inbound call, WhatsApp dispatch, and confirmed slot is autonomously captured, verified, and settled with zero human latency.
          </p>
        </div>

        {/* 3D Bento Grid Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* NODE 01: Voice Receptionist (7 Cols) */}
          <div className="lg:col-span-7">
            <SpatialGlassCard spotlightColor="rgba(147, 51, 234, 0.25)" className="p-7">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/10 dark:bg-purple-400/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-zinc-500 block">
                      NODE 01 // AUDIO TELEMETRY
                    </span>
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                      Autonomous Voice Receptionist
                    </h3>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  &lt; 400ms Handshake
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Answers incoming high-intent phone lines instantly. Zara understands complex caller requirements, qualifies urgency, and extracts slot preferences in real time.
              </p>

              {/* Interactive Audio Waveform Terminal */}
              <div className="mt-5 p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white transition-transform active:scale-95 cursor-pointer shadow-md"
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                    <div>
                      <div className="text-xs font-medium text-slate-200">Sample Call: Emergency Intake</div>
                      <div className="text-[10px] font-mono text-slate-400">Caller: Marcus Vance (+971 50 ••• ••••)</div>
                    </div>
                  </div>
                  <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                </div>

                {/* Animated Waveform Bars */}
                <div className="flex items-center gap-1 h-8 px-1">
                  {[40, 65, 30, 80, 95, 45, 60, 85, 35, 70, 90, 50, 75, 40, 85, 60, 95, 30, 55, 75, 40, 65, 80, 50].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
                      style={{
                        height: isPlayingAudio ? `${Math.max(15, (h * ((i % 3) + 1)) % 100)}%` : `${h * 0.4}%`,
                        opacity: i / 24 <= audioProgress / 100 ? 1 : 0.35,
                      }}
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-slate-400">
                  <span>00:{audioProgress < 10 ? `0${Math.floor(audioProgress / 10)}` : Math.floor(audioProgress / 3)}</span>
                  <span className="text-emerald-400">INTENT: 98% (High Value)</span>
                  <span>00:34</span>
                </div>
              </div>
            </SpatialGlassCard>
          </div>

          {/* NODE 02: WhatsApp Concierge (5 Cols) */}
          <div className="lg:col-span-5">
            <SpatialGlassCard spotlightColor="rgba(56, 189, 248, 0.25)" className="p-7">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-zinc-500 block">
                      NODE 02 // MESSAGING
                    </span>
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                      WhatsApp Concierge
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                  0.08s DISPATCH
                </span>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Dispatches confirmation packets over verified WhatsApp. Negotiates reschedule requests and locks times directly into Google Calendar.
              </p>

              {/* Chat Simulation Bubble */}
              <div className="mt-5 space-y-2.5 font-sans">
                <div className="p-3 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-white/[0.05] border border-slate-200/70 dark:border-white/10 max-w-[85%] text-xs text-slate-800 dark:text-zinc-200">
                  <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold mb-0.5">Sarah AI Concierge</div>
                  Good afternoon Marcus, your priority slot is provisionally locked for tomorrow at 3:30 PM. Would you like calendar invite confirmation?
                </div>

                <div className="p-3 rounded-2xl rounded-tr-sm bg-purple-600 text-white max-w-[80%] ml-auto text-xs shadow-sm">
                  Yes, confirm 3:30 PM please.
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-purple-200">
                    <span>14:02</span>
                    <CheckCheck className="w-3 h-3 text-cyan-300" />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Google Cal Synced • Table 12 Confirmed</span>
                </div>
              </div>
            </SpatialGlassCard>
          </div>

          {/* NODE 03: Live Revenue & Settlement Ledger (Full 12 Cols) */}
          <div className="lg:col-span-12">
            <SpatialGlassCard spotlightColor="rgba(16, 185, 129, 0.2)" className="p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/10 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-zinc-500 block">
                      NODE 03 // FINANCIAL TELEMETRY
                    </span>
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                      Live Settlement &amp; Margin Ledger
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-slate-500 dark:text-zinc-400">STATUS:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    100% REVENUE RECOVERY
                  </span>
                </div>
              </div>

              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">Captured Revenue (30D)</div>
                  <div className="text-2xl font-black font-mono text-slate-950 dark:text-white mt-1">AED 142,850</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 font-semibold">+18.4% vs human front desk</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">Conversion Rate</div>
                  <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1">41.8%</div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono mt-1">From first call to show-up</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">Average Call Response</div>
                  <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1">&lt; 0.4s</div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono mt-1">Zero dropped after-hours leads</div>
                </div>
              </div>
            </SpatialGlassCard>
          </div>

        </div>

      </div>
    </section>
  );
}