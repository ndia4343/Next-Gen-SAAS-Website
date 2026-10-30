"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, PhoneCall, Calendar, Sparkles, Volume2, ShieldCheck } from "lucide-react";

interface AIReceptionistShowcaseProps {
  onOpenVoiceModal?: () => void;
  onBookCall?: () => void;
  audioSrc?: string; // Optional URL to a real audio file
}

export default function AIReceptionistShowcase({
  onOpenVoiceModal,
  onBookCall,
  audioSrc,
}: AIReceptionistShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(74); // 01:14 fallback duration
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize audio element state if an audio source is provided
  useEffect(() => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTime(Math.floor(audio.currentTime));
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioSrc]);

  // Simulate progress when playing without audioSrc
  useEffect(() => {
    if (audioSrc || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, duration, audioSrc]);

  const togglePlayback = () => {
    if (audioSrc && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${remainingSecs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOpenVoice = () => {
    if (onOpenVoiceModal) {
      onOpenVoiceModal();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open_voice_widget"));
    }
  };

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Editorial Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-500/10 via-purple-400/5 to-cyan-500/10 blur-[120px] rounded-full dark:from-violet-600/15 dark:via-purple-500/10 dark:to-cyan-400/10" />
      </div>

      {/* Header Section */}
      <div className="max-w-3xl mb-14 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/5 dark:bg-violet-500/10 backdrop-blur-md mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-violet-700 dark:text-violet-300 uppercase">
            Meet Your AI Receptionist
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.15]">
          Meet Your Always-On Receptionist.
        </h2>

        <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
          Every caller gets an answer. Every opportunity gets attention.
        </p>
      </div>

      {/* Asymmetrical 60/40 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        
        {/* LEFT COLUMN (60% Desktop) — From Ring to Revenue */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              From Ring to Revenue
            </span>
          </div>

          <div className="relative pl-8 sm:pl-10 space-y-10 sm:space-y-12">
            {/* Elegant Vertical Connecting Line */}
            <div className="absolute left-[13px] sm:left-[17px] top-4 bottom-4 w-px bg-gradient-to-b from-violet-500/40 via-purple-400/25 to-cyan-500/40 dark:from-violet-400/30 dark:via-purple-400/15 dark:to-cyan-400/30" />

            {/* Stage 01 */}
            <div className="relative group">
              <div className="absolute -left-[32px] sm:-left-[40px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-neutral-900 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-300 shadow-sm transition-transform duration-300 group-hover:scale-110">
                01
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-baseline gap-2">
                  ANSWER
                  <span className="text-sm font-normal text-neutral-400 dark:text-neutral-500">
                    —
                  </span>
                  <span className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-200">
                    Never leave callers waiting.
                  </span>
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
                  Answers incoming calls with a natural, conversational voice. Greets callers in real-time, eliminating busy tones, hold loops, and voicemails.
                </p>
              </div>
            </div>

            {/* Stage 02 */}
            <div className="relative group">
              <div className="absolute -left-[32px] sm:-left-[40px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-neutral-900 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-300 shadow-sm transition-transform duration-300 group-hover:scale-110">
                02
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-baseline gap-2">
                  UNDERSTAND
                  <span className="text-sm font-normal text-neutral-400 dark:text-neutral-500">
                    —
                  </span>
                  <span className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-200">
                    Know what they need.
                  </span>
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
                  Understands enquiries, appointment requests, and caller needs. Interprets patient or client context clearly without robotic menus.
                </p>
              </div>
            </div>

            {/* Stage 03 */}
            <div className="relative group">
              <div className="absolute -left-[32px] sm:-left-[40px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-neutral-900 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-300 shadow-sm transition-transform duration-300 group-hover:scale-110">
                03
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-baseline gap-2">
                  QUALIFY & SCHEDULE
                  <span className="text-sm font-normal text-neutral-400 dark:text-neutral-500">
                    —
                  </span>
                  <span className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-200">
                    Lock in appointments on the spot.
                  </span>
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
                  Checks your real-time availability, captures caller requirements, and schedules directly onto your calendar—saving hours of manual back-and-forth.
                </p>
              </div>
            </div>

            {/* Stage 04 */}
            <div className="relative group">
              <div className="absolute -left-[32px] sm:-left-[40px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-neutral-900 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-300 shadow-sm transition-transform duration-300 group-hover:scale-110">
                04
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-baseline gap-2">
                  SYNC & NOTIFY
                  <span className="text-sm font-normal text-neutral-400 dark:text-neutral-500">
                    —
                  </span>
                  <span className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-200">
                    Seamless CRM telemetry.
                  </span>
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
                  Transcribes call notes, routes urgent escalations via SMS/WhatsApp, and syncs full conversation records straight to your CRM and team dashboard.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN (40% Desktop) — Interactive Audio Player & Showcase Card */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl p-6 sm:p-8 bg-zinc-900/80 dark:bg-zinc-900/90 border border-violet-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-violet-600/15 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FF6B00]/10 blur-3xl pointer-events-none rounded-full" />

            {/* Card Header: Zara Avatar & Live Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
                    Z
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-base">Zara</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      AI RECEPTIONIST
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">Zavian Labs Inbound Engine</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>ONLINE 24/7</span>
              </div>
            </div>

            {/* Audio Sample Player Block */}
            <div className="py-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-violet-400" />
                  Sample Inbound Interaction
                </span>
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>

              {/* Dynamic Soundwave Scrubber */}
              <div className="flex items-center justify-between gap-1 h-12 px-3 rounded-2xl bg-zinc-950/70 border border-zinc-800">
                {[40, 65, 80, 50, 95, 70, 85, 45, 60, 90, 75, 40, 85, 95, 60, 50, 70, 80, 45, 65, 85, 75, 55, 90, 60, 40, 70, 85].map((height, i) => {
                  const progressPct = (currentTime / duration) * 100;
                  const barPct = (i / 28) * 100;
                  const isPassed = barPct <= progressPct;

                  return (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isPassed
                          ? "bg-gradient-to-t from-violet-500 to-[#FF6B00]"
                          : "bg-zinc-700/60"
                      } ${isPlaying ? "animate-pulse" : ""}`}
                      style={{
                        height: isPlaying ? `${Math.max(20, Math.sin(i + currentTime) * 35 + 50)}%` : `${height}%`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Play / Pause Toggle Button */}
              <div className="flex items-center justify-center pt-2">
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="group relative flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-[#7C3AED] hover:from-violet-500 hover:to-[#8B5CF6] text-white font-medium text-xs tracking-wide shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </span>
                  <span>{isPlaying ? "Pause Call Sample" : "Listen to Sample Call"}</span>
                </button>
              </div>
            </div>

            {/* Feature Highlights Pills */}
            <div className="grid grid-cols-2 gap-2.5 pt-4 pb-6 border-t border-zinc-800/80 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-300">
                <span className="text-violet-400 font-bold">⚡</span>
                <span>Sub-2s Pickup</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Live Google Cal Sync</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero Robotic Menus</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Multi-Accent Clarity</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleOpenVoice}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-violet-600" />
                <span>Talk to Zara Live</span>
              </button>

              <button
                type="button"
                onClick={() => onBookCall && onBookCall()}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs tracking-wide flex items-center justify-center gap-2 border border-zinc-700/60 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Book Architecture Strategy Call</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
