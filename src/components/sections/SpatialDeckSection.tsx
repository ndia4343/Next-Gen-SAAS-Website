'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCheck, 
  CalendarCheck, 
  TrendingUp, 
  Sparkles,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Wifi,
  BatteryCharging,
  ArrowRight
} from 'lucide-react';

export default function SpatialDeckSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 12 seconds
  const [isMuted, setIsMuted] = useState(true);
  const totalDuration = 12; // 12s video loop

  const containerRef = useRef<HTMLDivElement>(null);

  // 12-second continuous animation loop
  useEffect(() => {
    let animFrame: number;
    let lastStamp = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastStamp) / 1000;
      lastStamp = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= totalDuration) return 0;
          return next;
        });
      }

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying]);

  // Derived animation phase:
  // Phase 1 (0s - 3.2s): App Launch & Pulsing 3D Icon
  // Phase 2 (3.2s - 7.8s): 3D Cards Cascade & Explosion Out of Screen
  // Phase 3 (7.8s - 11.2s): WhatsApp Slot Lock & Rate Inspection
  // Phase 4 (11.2s - 12.0s): Smooth Fold Back
  const phase = currentTime < 3.2 ? 1 : currentTime < 7.8 ? 2 : currentTime < 11.2 ? 3 : 4;

  // 3D Mouse / Touch Tilt Physics for the Mobile Device
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springSettings = { damping: 25, stiffness: 180 };
  const smoothX = useSpring(mouseX, springSettings);
  const smoothY = useSpring(mouseY, springSettings);

  const phoneRotateX = useTransform(smoothY, [-300, 300], [10, -10]);
  const phoneRotateY = useTransform(smoothX, [-400, 400], [-12, 12]);
  const glareX = useTransform(smoothX, [-400, 400], ['15%', '85%']);
  const glareY = useTransform(smoothY, [-300, 300], ['15%', '85%']);

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

  // Waveform animated frequency bars
  const [waveSeed, setWaveSeed] = useState(0);
  useEffect(() => {
    const waveTimer = setInterval(() => {
      setWaveSeed((s) => (s + 1) % 100);
    }, 150);
    return () => clearInterval(waveTimer);
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen py-16 lg:py-24 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#01221b] via-[#033b2e] to-[#01140f] text-white selection:bg-[#00E599]/30"
    >
      {/* Background Mint / Emerald Glowing Atmospheric Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Giant soft central aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[700px] sm:h-[950px] bg-gradient-to-tr from-[#00E599]/18 via-[#06B6D4]/12 to-transparent rounded-full blur-[140px]" />
        
        {/* Soft corner ambient gradients */}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-[#10B981]/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-[#06B6D4]/15 rounded-full blur-[150px]" />
      </div>

      {/* Floating Blurred Parallax Cards in Background (Direct Homage to Video Background) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Left giant tilted background card */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotateZ: [-18, -16, -18],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute -left-20 sm:left-4 lg:left-24 top-1/4 w-72 sm:w-80 h-96 rounded-[36px] bg-gradient-to-br from-[#065f46]/85 via-[#047857]/60 to-[#022c22]/90 border border-white/10 p-6 shadow-2xl opacity-40 blur-[5px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/20 mb-4" />
          <div className="h-4 w-3/4 bg-white/20 rounded-md mb-2" />
          <div className="h-3 w-1/2 bg-white/10 rounded-md" />
          <div className="mt-16 space-y-3">
            <div className="h-10 w-full bg-white/10 rounded-xl" />
            <div className="h-10 w-full bg-white/10 rounded-xl" />
          </div>
        </motion.div>

        {/* Right giant tilted background card */}
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotateZ: [20, 22, 20],
          }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
          className="absolute -right-20 sm:right-4 lg:right-24 bottom-1/4 w-72 sm:w-80 h-96 rounded-[36px] bg-gradient-to-br from-[#022c22]/90 via-[#064e3b]/60 to-[#0f766e]/70 border border-white/10 p-6 shadow-2xl opacity-35 blur-[7px]"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/20 mb-4" />
          <div className="h-4 w-2/3 bg-white/20 rounded-md mb-2" />
          <div className="h-3 w-1/3 bg-white/10 rounded-md" />
        </motion.div>
      </div>

      {/* Floating 3D Refractive Glass Sphere / Bubble (From Video) */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          x: [6, -6, 6],
          rotate: [0, 180, 360],
        }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
        className="absolute top-16 sm:top-20 z-40 w-16 h-16 sm:w-20 sm:h-20 rounded-full pointer-events-none shadow-[0_20px_50px_rgba(0,229,153,0.45)]"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95), rgba(0,229,153,0.5) 45%, rgba(6,182,212,0.65) 75%, rgba(2,44,34,0.95))',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(255,255,255,0.7)',
        }}
      >
        {/* Specular Glare */}
        <div className="absolute top-2.5 left-3 w-5 h-2.5 rounded-full bg-white/90 blur-[0.6px] rotate-[-30deg]" />
      </motion.div>

      {/* MAIN VIEWPORT: THE 3D SMARTPHONE */}
      <div 
        style={{ perspective: 1400 }}
        className="relative z-30 flex items-center justify-center w-full max-w-sm sm:max-w-md my-auto px-4"
      >
        <motion.div
          style={{
            rotateX: phoneRotateX,
            rotateY: phoneRotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-[320px] sm:w-[360px] h-[640px] sm:h-[680px] rounded-[52px] bg-slate-950 p-3 sm:p-3.5 shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_60px_rgba(0,229,153,0.3)] border-[9px] sm:border-[10px] border-slate-900/95 ring-1 ring-white/20 select-none"
        >
          {/* Phone Glare Reflection Overlay */}
          <motion.div
            className="absolute inset-0 rounded-[44px] pointer-events-none z-50 opacity-20"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.8), transparent 70%)`,
            }}
          />

          {/* Phone Screen Container */}
          <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-gradient-to-b from-[#023326] via-[#034d3a] to-[#012219] flex flex-col justify-between p-4 sm:p-5">
            
            {/* 1. Phone Top Status Bar */}
            <div className="relative z-40 flex items-center justify-between text-[11px] font-mono font-bold text-white/90 px-2 pt-1">
              <span>9:41</span>
              {/* Dynamic Island Pill */}
              <div className="w-20 h-4 rounded-full bg-black/90 border border-white/10 flex items-center justify-center gap-1.5 px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8.5px] font-mono text-[#00E599] font-bold">ZAVIAN 5G</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/90">
                <Wifi className="w-3 h-3" />
                <BatteryCharging className="w-3.5 h-3.5 text-[#00E599]" />
              </div>
            </div>

            {/* 2. Top Brand Header inside Phone (Like "СБЕР" in video, but Zavian Labs in English) */}
            <div className="relative z-40 flex items-center justify-between pt-3 pb-2 px-1 border-b border-white/10">
              <div className="flex items-center gap-2">
                {/* Brand Cube Logo */}
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#00E599] to-[#06B6D4] flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
                </div>
                <div className="flex items-center tracking-wider text-xs">
                  <span className="font-extrabold text-white">ZAVIAN</span>
                  <span className="font-bold text-[#00E599] ml-1">LABS</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
                <span>3-NODE ENGINE</span>
              </div>
            </div>

            {/* 3. DYNAMIC ANIMATION SCENE (Exact Choreography from Video) */}
            <div className="relative flex-1 flex items-center justify-center my-auto overflow-visible" style={{ perspective: 1000 }}>
              
              {/* SCENE 01 (0s - 3.2s): Glossy 3D App Icon Launch (Exact Match to thumb_1.jpg) */}
              <AnimatePresence>
                {phase === 1 && (
                  <motion.div
                    key="app-icon"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [0.85, 1.05, 1], opacity: 1 }}
                    exit={{ scale: 1.4, opacity: 0, filter: 'blur(8px)' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex flex-col items-center justify-center text-center space-y-4"
                  >
                    {/* Glowing Aura Ring */}
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#00E599]/40 via-[#06B6D4]/30 to-transparent blur-xl"
                      />

                      {/* The 3D Frosted App Squircle Icon */}
                      <div className="relative w-28 h-28 rounded-[28px] bg-gradient-to-b from-white/95 to-slate-100 p-1 shadow-[0_20px_45px_rgba(0,0,0,0.35),0_0_30px_rgba(0,229,153,0.4)] border border-white flex items-center justify-center">
                        {/* Inner Gradient Circle Ring (Just like in the video) */}
                        <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#00E599] via-[#06B6D4] to-[#10B981] flex items-center justify-center shadow-inner">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-md">
                            <Sparkles className="w-9 h-9 text-emerald-600 fill-emerald-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white tracking-wide">
                        Autonomous Ecosystem
                      </div>
                      <div className="text-[10px] font-mono text-[#00E599] tracking-wider uppercase">
                        Launching Spatial Pipeline...
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SCENE 02 & 03 (3.2s - 12s): The 3D Cascading Stack Erupts (Exact Match to thumb_2.jpg & thumb_3.jpg) */}
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative w-full flex flex-col items-center justify-center py-2"
                >

                  {/* 1. TOP CARD (Back Layer): Stage 01 - Voice Receptionist ("Кошелёк / Саша") */}
                  <motion.div
                    animate={{
                      y: phase === 2 ? -28 : -40,
                      z: phase === 2 ? 10 : 25,
                      rotateX: phase === 2 ? 6 : 8,
                      rotateZ: phase === 2 ? -4 : -5,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-[92%] rounded-2xl p-3.5 bg-white/95 text-slate-900 border border-white shadow-xl backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#00E599] text-slate-950 font-bold text-[10px] flex items-center justify-center">
                          Z
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-slate-900 leading-tight">ZARA // VOICE INTAKE</div>
                          <div className="text-[8.5px] font-mono text-emerald-600 font-semibold">Line Connected • &lt;400ms</div>
                        </div>
                      </div>
                      <span className="text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        CALL 01
                      </span>
                    </div>

                    {/* Audio Waveform */}
                    <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#00E599] text-slate-950 flex items-center justify-center shrink-0">
                        <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                      </div>
                      <div className="flex-1 flex items-center gap-0.5 h-4">
                        {[40, 70, 30, 90, 100, 50, 80, 60, 95, 40, 75, 100, 55, 85, 30].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-emerald-600 to-[#00E599] rounded-full transition-all duration-150"
                            style={{
                              height: `${Math.max(25, (h * ((i % 3) + 1.2) + waveSeed * 2) % 100)}%`,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 font-bold">00:34</span>
                    </div>
                  </motion.div>

                  {/* 2. MID CARD (The Signature Neon Mint/Lime Gradient Card from Video) */}
                  <motion.div
                    animate={{
                      y: phase === 2 ? -8 : -14,
                      z: phase === 2 ? 35 : 55,
                      rotateX: phase === 2 ? 4 : 5,
                      rotateZ: phase === 2 ? 2 : 1,
                      scale: phase === 3 ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-[96%] mt-[-10px] rounded-2xl p-3.5 bg-gradient-to-tr from-[#00E599] via-[#00D26A] to-[#06B6D4] text-slate-950 border border-white/50 shadow-[0_15px_35px_rgba(0,229,153,0.4)] relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-black/10">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-950" />
                        <span className="text-[10px] font-mono font-black tracking-wider uppercase">
                          STAGE 02 // WHATSAPP LOCK
                        </span>
                      </div>
                      <span className="text-[8.5px] font-mono font-bold bg-black/15 px-1.5 py-0.2 rounded-full">
                        0.08S DISPATCH
                      </span>
                    </div>

                    <div className="mt-2 space-y-1.5">
                      <div className="p-2 rounded-xl bg-white/95 text-slate-900 text-[10px] font-medium shadow-xs">
                        Marcus, your reservation is ready. Confirm Table 12 Terrace?
                      </div>
                      <div className="p-1.5 rounded-lg bg-black/15 text-slate-950 text-[9.5px] font-mono font-bold flex items-center justify-between">
                        <span>Calendar Synced • AED 950 Deposit</span>
                        <CheckCheck className="w-3.5 h-3.5 text-slate-950" />
                      </div>
                    </div>
                  </motion.div>

                  {/* 3. FRONT CARD (Frosted Glass Currency Rates / Telemetry Card from Video) */}
                  <motion.div
                    animate={{
                      y: phase === 2 ? 14 : 10,
                      z: phase === 2 ? 65 : 85,
                      rotateX: phase === 2 ? 2 : 2,
                      rotateZ: phase === 2 ? -1 : 0,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-[100%] mt-[-8px] rounded-2xl p-3.5 bg-white text-slate-900 border border-slate-200 shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-900">
                          STAGE 03 // YIELD TELEMETRY
                        </span>
                      </div>
                      <span className="text-[8.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        +34.2% NET
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <div className="text-[8.5px] font-mono text-slate-400 uppercase">Captured Revenue</div>
                        <div className="text-base font-black font-mono text-slate-950">AED 142,850</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[8.5px] font-mono text-slate-400 uppercase">Case Acceptance</div>
                        <div className="text-base font-black font-mono text-emerald-600">68.4%</div>
                      </div>
                    </div>

                    {/* Rates Multi-Currency Grid (Exact Replica of "Курсы валют" in Video) */}
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <div className="grid grid-cols-4 gap-1 text-center font-mono">
                        <div className="p-1 rounded-md bg-slate-50 border border-slate-100">
                          <div className="text-[8px] text-slate-400">AED</div>
                          <div className="text-[9.5px] font-bold text-slate-900">142k</div>
                          <div className="text-[7.5px] text-emerald-600 font-bold">▲ +14%</div>
                        </div>
                        <div className="p-1 rounded-md bg-slate-50 border border-slate-100">
                          <div className="text-[8px] text-slate-400">USD</div>
                          <div className="text-[9.5px] font-bold text-slate-900">$38k</div>
                          <div className="text-[7.5px] text-emerald-600 font-bold">▲ +22%</div>
                        </div>
                        <div className="p-1 rounded-md bg-slate-50 border border-slate-100">
                          <div className="text-[8px] text-slate-400">EUR</div>
                          <div className="text-[9.5px] font-bold text-slate-900">€35k</div>
                          <div className="text-[7.5px] text-emerald-600 font-bold">▲ +18%</div>
                        </div>
                        <div className="p-1 rounded-md bg-slate-50 border border-slate-100">
                          <div className="text-[8px] text-slate-400">GBP</div>
                          <div className="text-[9.5px] font-bold text-slate-900">£30k</div>
                          <div className="text-[7.5px] text-emerald-600 font-bold">▲ +12%</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                </motion.div>
              )}

            </div>

            {/* 4. Phone Bottom Home Indicator */}
            <div className="relative z-40 flex flex-col items-center pt-2">
              <div className="w-32 h-1 bg-white/40 rounded-full" />
            </div>

          </div>
        </motion.div>
      </div>

      {/* MINIMAL SLEEK VIDEO CONTROLLER DOCK (Below Phone) */}
      <div className="relative z-40 max-w-sm w-full mx-auto mt-8 px-4">
        <div className="p-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between gap-3">
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-xl bg-[#00E599] hover:bg-[#00c985] text-slate-950 flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-all active:scale-95"
            title={isPlaying ? "Pause Animation" : "Play Animation"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => setCurrentTime(0)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Replay Video"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Scrubber Bar */}
          <div className="flex-1 flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-200/70 w-7 text-right">
              {Math.floor(currentTime)}s
            </span>
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                setCurrentTime(ratio * totalDuration);
              }}
              className="relative flex-1 h-2 rounded-full bg-black/60 overflow-hidden cursor-pointer"
            >
              <div
                className="h-full bg-gradient-to-r from-[#00E599] to-[#06B6D4]"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-emerald-200/70 w-7">
              12s
            </span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 transition-colors cursor-pointer"
            title="Audio Sync"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#00E599]" />}
          </button>

        </div>

        {/* Phase Pill Indicator below Player */}
        <div className="text-center mt-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-emerald-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
            {phase === 1 && "SCENE 01: SQUIRCLE APP LAUNCH"}
            {phase === 2 && "SCENE 02: 3D SPATIAL CARD CASCADE"}
            {phase === 3 && "SCENE 03: MULTI-CURRENCY & WHATSAPP SYNC"}
            {phase === 4 && "SCENE 04: SEAMLESS LOOP RESET"}
          </span>
        </div>
      </div>

    </section>
  );
}
