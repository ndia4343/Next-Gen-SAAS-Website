"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";

interface AIReceptionistShowcaseProps {
  onBookCall?: () => void;
  audioSrc?: string; // Optional URL to a real audio file
}

export default function AIReceptionistShowcase({
  onBookCall,
  audioSrc,
}: AIReceptionistShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(24); // 00:24 fallback duration
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

        {/* RIGHT COLUMN (40% Desktop) — Live Simulation */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-violet-500/20 bg-neutral-900/90 p-5 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Live Simulation</span>
              </div>
              <span className="text-xs font-mono text-violet-400">Step 02 / 04</span>
            </div>

            {/* Dynamic Typing Feed (The 'Train' Output) */}
            <div className="my-4 space-y-2.5 font-mono text-xs">
              <div className="text-neutral-500">[14:02:01] Inbound call received (0 missed calls)</div>
              <div className="text-violet-300">
                <span className="font-bold text-white">Attune:</span> "Thanks for calling Apex Dental! Looking for a checkup or a cosmetic consultation?"
              </div>
              <div className="text-neutral-300 pl-2 border-l border-neutral-700">
                <span className="text-neutral-500">Caller:</span> "Cosmetic consultation for Invisalign."
              </div>
              <div className="text-emerald-400 flex items-center gap-1.5 pt-1">
                <span>✓</span> Slot Reserved: Thursday 11:30 AM
              </div>
            </div>

            {/* Compact Action Bar */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={togglePlayback}
                className="flex items-center gap-2 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 px-3.5 py-2 rounded-lg transition-all cursor-pointer"
              >
                <span>{isPlaying ? "❚❚ Pause Sample" : "▶ Play Audio Sample"}</span>
              </button>
              <span className="text-[11px] text-neutral-500">Demo length: 00:24</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => onBookCall && onBookCall()}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-violet-600" />
              <span>Book Strategy Call</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
