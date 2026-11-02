"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { 
  CheckCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Send, 
  ArrowUpRight
} from "lucide-react";

interface Message {
  id: number;
  sender: "client" | "reception";
  text: string;
  time: string;
  zDepth: number; // Displaces bubble along Z-axis in zero-gravity
}

const MESSAGES_DATA: Message[] = [
  {
    id: 1,
    sender: "client",
    text: "Hi Sarah! Need to book a cosmetic consultation & polish at the Downtown clinic for this Friday afternoon if possible.",
    time: "2:14 PM",
    zDepth: 25,
  },
  {
    id: 2,
    sender: "reception",
    text: "Hello! Welcome back to Al [••••••] Dental Clinic, Downtown Dubai. Let me pull up Dr. Tariq's schedule for Friday.",
    time: "2:14 PM",
    zDepth: 40,
  },
  {
    id: 3,
    sender: "reception",
    text: "We have an opening at 5:15 PM with complimentary valet at Boulevard Point. Does that time suit you?",
    time: "2:15 PM",
    zDepth: 55,
  },
  {
    id: 4,
    sender: "client",
    text: "5:15 PM on Friday works perfectly. Please lock that in.",
    time: "2:16 PM",
    zDepth: 45,
  },
  {
    id: 5,
    sender: "reception",
    text: "Booked! Your appointment is synchronized with our calendar. Confirmation slip is generated below.",
    time: "2:16 PM",
    zDepth: 60,
  },
];

export function AntiGravityBookingShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // -------------------------------------------------------------
  // Zero-Gravity Mouse Physics (Smooth Parallax Tilt)
  // -------------------------------------------------------------
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Damped spring physics for weightless, fluid rotation
  const springConfig = { damping: 25, stiffness: 120, mass: 0.8 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig);
  const cardTranslateZ = useSpring(isHovered ? 40 : 10, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // -------------------------------------------------------------
  // Automatic Message Flow Loop
  // -------------------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < MESSAGES_DATA.length ? prev + 1 : 1));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="relative min-h-[820px] w-full flex items-center justify-center p-4 overflow-hidden bg-[#070B1E]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1400 }}
    >
      {/* Ambient Zero-G Backdrop Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Anti-Gravity Space Dust Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/30"
            style={{
              width: (i % 3) + 2 + "px",
              height: (i % 3) + 2 + "px",
              top: `${(i * 7.5) % 95}%`,
              left: `${(i * 8.3) % 92}%`,
            }}
            animate={{
              y: [-15, -90, -15],
              x: [(i % 2 === 0 ? 8 : -8), (i % 2 === 0 ? -12 : 12), (i % 2 === 0 ? 8 : -8)],
              opacity: [0.15, 0.75, 0.15],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              duration: 5 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Dynamic Ground Shadow (Breathes inversely to floating height) */}
      <motion.div
        className="absolute bottom-12 w-[340px] md:w-[460px] h-12 bg-black/60 rounded-[100%] blur-2xl pointer-events-none"
        animate={{
          scale: [0.85, 1.05, 0.85],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ========================================================= */}
      {/* MAIN ANTI-GRAVITY FLOATING STAGE */}
      {/* ========================================================= */}
      <motion.div
        ref={containerRef}
        className="relative z-10 w-full max-w-[420px]"
        style={{
          rotateX,
          rotateY,
          z: cardTranslateZ,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [-12, 14, -12],
          rotateZ: [-0.8, 0.8, -0.8],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Physical Phone Chassis */}
        <div 
          className="relative rounded-[44px] p-[2px] bg-gradient-to-b from-white/20 via-cyan-500/20 to-purple-500/30 shadow-[0_30px_90px_rgba(0,0,0,0.8),0_0_50px_rgba(56,189,248,0.12)] backdrop-blur-xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="relative rounded-[42px] bg-[#0c102b]/90 border border-white/10 overflow-hidden flex flex-col h-[670px] shadow-inner">
            
            {/* Top Speaker / Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-black/70 rounded-full z-30 flex items-center justify-center">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header: Dubai Clinic Reception */}
            <div className="pt-9 pb-3.5 px-4 bg-[#111738]/80 border-b border-white/5 backdrop-blur-md flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    S
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#111738] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-sm font-semibold tracking-wide">Sarah</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Reception
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="filter blur-[3.5px] select-none text-slate-300">Al Manara Luxury</span>
                    <span>• Downtown Dubai</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-medium text-emerald-400">Online</span>
              </div>
            </div>

            {/* Conversation Feed */}
            <div 
              className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-none relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Date Badge */}
              <div className="flex justify-center my-1">
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5">
                  Today • Dubai (GST)
                </span>
              </div>

              {/* Animated Message Stack with Z-Depth Detachment */}
              {MESSAGES_DATA.slice(0, activeStep).map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 18, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `translateZ(${msg.zDepth}px)`,
                  }}
                  className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[12.5px] leading-relaxed shadow-lg ${
                      msg.sender === "client"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs shadow-emerald-950/30"
                        : "bg-[#182046]/90 border border-white/10 text-slate-200 rounded-bl-xs shadow-black/40 backdrop-blur-md"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[9.5px] ${
                        msg.sender === "client" ? "text-emerald-200" : "text-slate-400"
                      }`}
                    >
                      <span>{msg.time}</span>
                      {msg.sender === "client" && <CheckCheck className="w-3.5 h-3.5 text-cyan-200" />}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing State Indicator */}
              {activeStep > 0 && activeStep < MESSAGES_DATA.length && activeStep % 2 === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#182046]/80 border border-white/5 w-fit"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "180ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "360ms" }} />
                </motion.div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#111738]/90 border-t border-white/5 flex items-center gap-2">
              <div className="flex-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] text-slate-400">
                Message...
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-md">
                <Send className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================= */}
        {/* DETACHED ZERO-GRAVITY GOOGLE CALENDAR CARD              */}
        {/* Levitates far ahead in 3D space (translateZ: 95px)      */}
        {/* ======================================================= */}
        <AnimatePresence>
          {activeStep >= 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30, z: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [-6, 6, -6],
                z: 95,
              }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.4 },
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
              className="absolute -bottom-8 -right-4 md:-right-10 w-[290px] rounded-2xl p-[1px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl z-40"
            >
              <div className="p-4 rounded-2xl bg-[#090d24]/95 border border-white/10 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-white">Google Calendar</div>
                      <div className="text-[10px] text-emerald-400 font-medium">Synced Instantly</div>
                    </div>
                  </div>
                  <span className="p-1 rounded-md bg-white/5 text-slate-400">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="space-y-1.5 border-t border-white/5 pt-2 text-[11px]">
                  <div className="font-medium text-slate-200">
                    Cosmetic Consultation & Polish
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Friday • 5:15 PM – 6:00 PM (GST)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <MapPin className="w-3 h-3 text-purple-400" />
                    <span className="filter blur-[3px]">Al Manara</span>
                    <span>Downtown, Dubai</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9.5px]">
                  <span className="text-slate-400">Reminder set (1 hr prior)</span>
                  <span className="text-cyan-400 font-medium">Dr. Tariq M.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secondary Levitating Orbit Badge */}
        <motion.div
          animate={{
            y: [8, -8, 8],
            rotate: [0, 4, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
          style={{ transform: "translateZ(75px)" }}
          className="absolute -top-5 -left-6 px-3.5 py-1.5 rounded-xl bg-[#090d24]/90 border border-cyan-500/30 text-white text-[10.5px] font-medium flex items-center gap-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Real-time Calendar Webhook</span>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default AntiGravityBookingShowcase;