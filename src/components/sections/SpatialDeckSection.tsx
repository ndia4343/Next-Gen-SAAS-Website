'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  PhoneCall, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  CalendarCheck, 
  Play, 
  Pause, 
  RotateCcw,
  Volume2, 
  VolumeX,
  ShieldCheck,
  CheckCheck,
  Layers,
  ArrowRight,
  User,
  Clock,
  Activity,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

// Stages defined for the interactive demo
type StageId = 'voice' | 'whatsapp' | 'revenue';

interface StageMeta {
  id: StageId;
  stepNumber: string;
  tabLabel: string;
  badge: string;
  title: string;
  description: string;
  tagColor: string;
}

const STAGES: StageMeta[] = [
  {
    id: 'voice',
    stepNumber: '01',
    tabLabel: 'Voice Receptionist',
    badge: 'STAGE 01 // NEURAL INTAKE',
    title: 'Instant Voice Intake. Zero Human Hold Time.',
    description: 'Zara answers priority inquiries within 400ms. She listens with human cadence, qualifies intent, and negotiates available appointments in real time.',
    tagColor: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'whatsapp',
    stepNumber: '02',
    tabLabel: 'WhatsApp Concierge',
    badge: 'STAGE 02 // INSTANT DISPATCH',
    title: 'Conversational Slot Lock & Verified Calendar Sync.',
    description: 'Dispatches booking packets and location directions via verified WhatsApp within 0.08 seconds of call termination with two-way confirmation.',
    tagColor: 'from-[#00E599] to-[#06B6D4]',
  },
  {
    id: 'revenue',
    stepNumber: '03',
    tabLabel: 'Revenue Telemetry',
    badge: 'STAGE 03 // FINANCIAL LEDGER',
    title: 'Real-Time Yield Telemetry & Recovery Attribution.',
    description: 'Tracks every captured dollar against front-desk capacity. Real-time multi-currency attribution gives stakeholders continuous visibility into margin gains.',
    tagColor: 'from-cyan-400 to-emerald-400',
  },
];

export default function SpatialDeckSection() {
  const [activeStage, setActiveStage] = useState<StageId>('voice');
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [expandedMode, setExpandedMode] = useState(false);
  const [audioWaveProgress, setAudioWaveProgress] = useState(35);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play video simulation loop (cycles through stages: 0-33% Voice, 34-66% WhatsApp, 67-100% Revenue)
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlayingVideo) {
        setProgress((prev) => {
          const next = prev + (delta / 12) * 100; // 12-second full video cycle
          if (next >= 100) return 0;
          return next;
        });
      }

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlayingVideo]);

  // Sync active stage with auto-play timeline progress
  useEffect(() => {
    if (!isPlayingVideo) return;
    if (progress < 33.3) {
      setActiveStage('voice');
    } else if (progress < 66.6) {
      setActiveStage('whatsapp');
    } else {
      setActiveStage('revenue');
    }
  }, [progress, isPlayingVideo]);

  // Audio wave oscillating animation
  useEffect(() => {
    const waveTimer = setInterval(() => {
      setAudioWaveProgress((p) => (p >= 100 ? 0 : p + 4));
    }, 180);
    return () => clearInterval(waveTimer);
  }, []);

  // 3D Mouse Parallax Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Card stack 3D tilts
  const rotateX = useTransform(smoothY, [-400, 400], [7, -7]);
  const rotateY = useTransform(smoothX, [-600, 600], [-8, 8]);
  const shineX = useTransform(smoothX, [-600, 600], ['20%', '80%']);
  const shineY = useTransform(smoothY, [-400, 400], ['20%', '80%']);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const currentStageMeta = STAGES.find((s) => s.id === activeStage) || STAGES[0];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#021f18] via-[#043328] to-[#01140f] text-white selection:bg-[#00E599]/30 font-sans"
    >
      {/* Background Spatial Atmosphere (Emerald / Cyan / Mint Glow) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top luminous radial ambient */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#00E599]/20 via-[#06B6D4]/15 to-transparent rounded-full blur-[140px]" />
        
        {/* Soft bottom side accents */}
        <div className="absolute bottom-10 -left-40 w-[600px] h-[600px] bg-[#10B981]/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[#06B6D4]/15 rounded-full blur-[150px]" />

        {/* Spatial Grid Lines (Subtle Perspective Grid) */}
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: English, Executive-Grade */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#00E599]/30 text-xs font-mono tracking-wider uppercase text-[#00E599] shadow-[0_0_15px_rgba(0,229,153,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
            <span>Interactive 3D Video Experience</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            One Engine.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00E599] via-[#2DD4BF] to-[#38BDF8]">
              Pure Spatial Symphony.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/70 leading-relaxed max-w-2xl mx-auto">
            Experience our 3-stage autonomous pipeline live. Watch the video synchronization loop or take interactive control of the 3D spatial stack below.
          </p>
        </div>

        {/* Video Scrubber & Playback Sync Dock */}
        <div className="max-w-4xl mx-auto mb-10 p-3 sm:p-4 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Play/Pause & Reset Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setIsPlayingVideo(!isPlayingVideo)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E599] hover:bg-[#00c985] text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,153,0.35)] active:scale-95 cursor-pointer"
            >
              {isPlayingVideo ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingVideo ? 'Pause Video' : 'Play Video'}</span>
            </button>

            <button
              onClick={() => {
                setProgress(0);
                setActiveStage('voice');
              }}
              title="Reset Video Loop"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setExpandedMode(!expandedMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer ${
                expandedMode 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                  : 'bg-white/5 text-emerald-200/80 border-white/10 hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{expandedMode ? 'Deck: Fanned Out' : 'Deck: Cascaded'}</span>
            </button>
          </div>

          {/* Timeline Scrubber */}
          <div className="flex-1 w-full max-w-md flex items-center gap-3">
            <span className="text-[11px] font-mono text-emerald-200/60 w-10 text-right">
              {Math.floor((progress / 100) * 12)}s
            </span>

            <div 
              className="relative flex-1 h-2 rounded-full bg-black/40 overflow-hidden cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProgress = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                setProgress(newProgress);
              }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#00E599] via-[#2DD4BF] to-[#06B6D4] relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
              </motion.div>
            </div>

            <span className="text-[11px] font-mono text-emerald-200/60 w-10">
              12s
            </span>
          </div>

          {/* Audio Mute / Sound Beacon */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-200/80 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#00E599]" />}
              <span className="font-mono text-[10px] hidden sm:inline">{isAudioMuted ? 'Muted' : 'Audio Synced'}</span>
            </button>
          </div>

        </div>

        {/* Stage Selector Pills (English, Synchronized) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 gap-1.5">
            {STAGES.map((stg) => {
              const active = activeStage === stg.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => {
                    setActiveStage(stg.id);
                    setIsPlayingVideo(false);
                    if (stg.id === 'voice') setProgress(15);
                    if (stg.id === 'whatsapp') setProgress(50);
                    if (stg.id === 'revenue') setProgress(85);
                  }}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#00E599] to-[#06B6D4] text-slate-950 font-bold shadow-[0_0_20px_rgba(0,229,153,0.35)] scale-[1.02]'
                      : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="opacity-60">{stg.stepNumber}.</span>
                  <span>{stg.tabLabel}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN 3D SPATIAL PRESENTATION STAGE */}
        <div style={{ perspective: 1800 }} className="relative w-full max-w-6xl mx-auto py-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Context, Features, & Telemetry Badge */}
            <div className="lg:col-span-5 space-y-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStageMeta.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#00E599]/10 border border-[#00E599]/25 text-xs font-mono font-bold text-[#00E599]">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{currentStageMeta.badge}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    {currentStageMeta.title}
                  </h3>

                  <p className="text-sm sm:text-base text-emerald-100/75 leading-relaxed font-normal">
                    {currentStageMeta.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Dynamic Feature Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                  <div className="text-[10px] font-mono uppercase text-emerald-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00E599]" />
                    <span>Deployment Speed</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white mt-1 font-mono">
                    Sub-24 Hours
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                  <div className="text-[10px] font-mono uppercase text-cyan-300 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Accuracy & Guardrails</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white mt-1 font-mono">
                    99.8% Deterministic
                  </div>
                </div>
              </div>

              {/* Call-to-Action Pill */}
              <div className="pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#00E599] via-[#2DD4BF] to-[#06B6D4] hover:opacity-95 text-slate-950 font-bold text-xs sm:text-sm tracking-wide uppercase shadow-[0_0_25px_rgba(0,229,153,0.35)] transition-all active:scale-95 cursor-pointer"
                >
                  <span>Deploy This Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>

            {/* Right Column: THE 3D SPATIAL CARD DECK (Video Clone in English) */}
            <div className="lg:col-span-7 flex items-center justify-center relative min-h-[520px] sm:min-h-[580px]">
              
              {/* Floating Background Parallax Card (Blurred Depth of Field, exactly like Video) */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  y: [0, -12, 0],
                  rotateZ: [-14, -12, -14],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: 'easeInOut',
                }}
                className="absolute -left-10 sm:-left-16 top-12 w-64 sm:w-72 h-80 rounded-[32px] bg-gradient-to-br from-[#064e3b]/80 via-[#047857]/60 to-[#022c22]/90 border border-white/15 backdrop-blur-[10px] p-5 shadow-2xl opacity-40 pointer-events-none -z-10"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 mb-4" />
                <div className="h-4 w-3/4 bg-white/20 rounded-md mb-2" />
                <div className="h-3 w-1/2 bg-white/10 rounded-md" />
                <div className="mt-12 space-y-2">
                  <div className="h-8 w-full bg-white/10 rounded-lg" />
                  <div className="h-8 w-full bg-white/10 rounded-lg" />
                </div>
              </motion.div>

              {/* Right Floating Parallax Card (Deep Depth) */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  y: [0, 14, 0],
                  rotateZ: [16, 18, 16],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 7,
                  ease: 'easeInOut',
                }}
                className="absolute -right-8 sm:-right-12 bottom-12 w-60 sm:w-68 h-72 rounded-[32px] bg-gradient-to-br from-[#022c22]/90 via-[#065f46]/60 to-[#0f766e]/70 border border-white/15 backdrop-blur-[12px] p-5 shadow-2xl opacity-35 pointer-events-none -z-10"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 mb-3" />
                <div className="h-3 w-2/3 bg-white/20 rounded-md mb-2" />
                <div className="h-2 w-1/3 bg-white/10 rounded-md" />
              </motion.div>

              {/* Floating 3D Refractive Glass Sphere (As seen in the Video) */}
              <motion.div
                animate={{
                  y: [-8, 8, -8],
                  x: [4, -4, 4],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: 'easeInOut',
                }}
                className="absolute top-2 right-12 sm:right-24 w-14 h-14 rounded-full z-30 pointer-events-none shadow-[0_15px_35px_rgba(0,229,153,0.4)]"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95), rgba(0,229,153,0.4) 40%, rgba(6,182,212,0.6) 80%, rgba(2,44,34,0.9))',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                }}
              >
                {/* Specular Highlight Gloss */}
                <div className="absolute top-2 left-2.5 w-4 h-2 rounded-full bg-white/80 blur-[0.5px] rotate-[-30deg]" />
              </motion.div>

              {/* CORE 3D INTERACTIVE TILT DECK */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-full max-w-md sm:max-w-lg z-20"
              >

                {/* CARD LAYER 1 (BACK CARD): Systems Header & Profile */}
                <motion.div
                  style={{
                    transform: expandedMode
                      ? 'translateZ(0px) translateY(-50px) rotate(-4deg)'
                      : activeStage === 'voice'
                      ? 'translateZ(50px) translateY(-20px)'
                      : 'translateZ(10px) translateY(-10px)',
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="rounded-3xl p-5 bg-white/95 text-slate-900 border border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-[#00E599] flex items-center justify-center text-white shadow-sm font-bold text-xs">
                        Z
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">ZARA // VOICE CONCIERGE</div>
                        <div className="text-[10px] font-mono text-emerald-600 font-semibold">Active Line • Sub-400ms</div>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                      LIVE INTAKE
                    </div>
                  </div>

                  {/* Audio Waveform Scrub Bar */}
                  <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <button
                        onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                        className="w-8 h-8 rounded-full bg-[#00E599] hover:bg-[#00c985] text-slate-950 flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition-transform active:scale-95"
                      >
                        {isPlayingVideo ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">Marcus Vance (4 Pax)</div>
                        <div className="text-[10px] font-mono text-slate-500">VIP Terrace Consultation</div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-600">00:34</span>
                    </div>

                    {/* Fanned Waveform Bars */}
                    <div className="flex items-center gap-1 h-7 mt-2.5 px-1">
                      {[30, 65, 40, 85, 100, 50, 70, 90, 45, 80, 95, 60, 40, 75, 90, 35, 60, 85, 100, 45, 70, 90].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-emerald-600 to-[#00E599] rounded-full transition-all duration-200"
                          style={{
                            height: isPlayingVideo ? `${Math.max(25, (h * ((i % 3) + 1.2)) % 100)}%` : `${h * 0.4}%`,
                            opacity: (i / 22) * 100 <= audioWaveProgress ? 1 : 0.35,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* CARD LAYER 2 (MID ACCENT NEON CARD): The Signature Vivid Green/Cyan Card */}
                <motion.div
                  style={{
                    transform: expandedMode
                      ? 'translateZ(40px) translateY(10px) rotate(-1deg)'
                      : activeStage === 'whatsapp'
                      ? 'translateZ(80px) translateY(-5px) scale(1.02)'
                      : 'translateZ(30px) translateY(12px)',
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="mt-3 rounded-3xl p-5 bg-gradient-to-tr from-[#00E599] via-[#00D26A] to-[#06B6D4] text-slate-950 border border-white/40 shadow-[0_20px_45px_rgba(0,229,153,0.35)] relative overflow-hidden"
                >
                  {/* Glossy Diagonal Light Sweep */}
                  <div className="absolute -top-12 -left-12 w-44 h-44 bg-white/30 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between pb-3 border-b border-black/10 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                      <span className="text-xs font-mono font-black uppercase tracking-wider">
                        STAGE 02 // WHATSAPP SLOT LOCK
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-black/15 px-2 py-0.5 rounded-full">
                      SPEED: 0.08S
                    </span>
                  </div>

                  {/* WhatsApp Conversation Micro-Card */}
                  <div className="mt-3 space-y-2 relative z-10">
                    <div className="p-2.5 rounded-xl bg-white/90 text-slate-900 text-xs shadow-xs font-medium max-w-[88%]">
                      <div className="text-[9px] font-mono font-bold text-emerald-700">Sarah AI Assistant</div>
                      Marcus, your table request is ready. Tomorrow 8:00 PM Terrace?
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 text-white text-xs shadow-md font-medium max-w-[85%] ml-auto flex items-center justify-between gap-2">
                      <span>Confirmed. Lock Table 12.</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#00E599] shrink-0" />
                    </div>

                    <div className="p-2 rounded-lg bg-black/10 text-slate-950 text-[11px] font-mono font-bold flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-slate-950" />
                      <span>Host Stand Synchronized • AED 950 Min Spend</span>
                    </div>
                  </div>
                </motion.div>

                {/* CARD LAYER 3 (FRONT CARD): Live Financial & Multi-Currency Telemetry */}
                <motion.div
                  style={{
                    transform: expandedMode
                      ? 'translateZ(90px) translateY(80px) rotate(2deg)'
                      : activeStage === 'revenue'
                      ? 'translateZ(110px) translateY(20px) scale(1.03)'
                      : 'translateZ(60px) translateY(28px)',
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="mt-3 rounded-3xl p-5 bg-white text-slate-900 border border-slate-200/80 shadow-[0_25px_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-900">
                        STAGE 03 // CONVERSION LEDGER
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      +34.2% YIELD
                    </span>
                  </div>

                  {/* Big Number KPI */}
                  <div className="mt-3 grid grid-cols-2 gap-3 items-center">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">30D Captured Net</div>
                      <div className="text-lg sm:text-xl font-black font-mono text-slate-950 mt-0.5">
                        AED 142,850
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold font-mono mt-0.5">
                        Zero Missed Calls
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Show-Up Conversion</div>
                      <div className="text-lg sm:text-xl font-black font-mono text-emerald-600 mt-0.5">
                        68.4%
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        WhatsApp 2-Way Lock
                      </div>
                    </div>
                  </div>

                  {/* Multi-Currency Mini Rates Table (Exact Video Homage) */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold mb-1.5 flex justify-between">
                      <span>Multi-Currency Telemetry</span>
                      <span>Real-Time Index</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                      <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/50">
                        <div className="text-[9px] text-slate-400">AED</div>
                        <div className="text-[11px] font-bold text-slate-900">142.8k</div>
                        <div className="text-[9px] text-emerald-600 font-bold">▲ +14%</div>
                      </div>

                      <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/50">
                        <div className="text-[9px] text-slate-400">USD</div>
                        <div className="text-[11px] font-bold text-slate-900">$38.9k</div>
                        <div className="text-[9px] text-emerald-600 font-bold">▲ +22%</div>
                      </div>

                      <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/50">
                        <div className="text-[9px] text-slate-400">EUR</div>
                        <div className="text-[11px] font-bold text-slate-900">€35.4k</div>
                        <div className="text-[9px] text-emerald-600 font-bold">▲ +18%</div>
                      </div>

                      <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/50">
                        <div className="text-[9px] text-slate-400">GBP</div>
                        <div className="text-[11px] font-bold text-slate-900">£30.2k</div>
                        <div className="text-[9px] text-emerald-600 font-bold">▲ +12%</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

              </motion.div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
