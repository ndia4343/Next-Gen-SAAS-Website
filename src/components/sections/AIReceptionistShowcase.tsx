"use client";

import React, { useState, useRef, useEffect } from "react";
import { Pause, Check } from "lucide-react";

const WAVEFORM_BARS = [
  24, 38, 55, 72, 45, 60, 85, 96, 70, 50, 82, 100, 88, 64, 78, 92, 74, 52, 85, 95, 68, 48, 62, 80, 58, 42, 30, 22
];

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

      {/* Section Header */}
      <div className="max-w-3xl mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-[10px] font-semibold tracking-widest uppercase text-sky-400 mb-4 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>MEET YOUR AI RECEPTIONIST</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-tight lowercase">
          meet your{" "}
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            always-on receptionist.
          </span>
        </h2>

        <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
          Every missed call is a patient booking with your competitor. We answer enquiries, qualify patient needs, and book appointments directly into Google Calendar.
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
              <div className="absolute -left-[32px] sm:-left-[40px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-neutral-900 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-600 dark:text-sky-300 shadow-sm transition-transform duration-300 group-hover:scale-110">
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
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
                  Answers incoming calls with a natural, conversational voice. Greets callers in real-time, eliminating busy tones, hold loops, and voicemails.
                </p>
              </div>
            </div>

            {/* Stage 02 */}
            <div className="relative group">
              <div className="absolute -left-[32px] sm:-left-[40px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-neutral-900 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-600 dark:text-sky-300 shadow-sm transition-transform duration-300 group-hover:scale-110">
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
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
                  Understands enquiries, appointment requests, and caller needs. Interprets patient or client context clearly without robotic menus.
                </p>
              </div>
            </div>

            {/* Stage 03 */}
            <div className="relative group">
              <div className="absolute -left-[32px] sm:-left-[40px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-neutral-900 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-600 dark:text-sky-300 shadow-sm transition-transform duration-300 group-hover:scale-110">
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
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
                  Checks your real-time availability, captures caller requirements, and schedules directly onto your calendar—saving hours of manual back-and-forth.
                </p>
              </div>
            </div>

            {/* Step 04 */}
            <div className="relative group">
              <div className="absolute -left-[32px] sm:-left-[40px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-neutral-900 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-600 dark:text-sky-300 shadow-sm transition-transform duration-300 group-hover:scale-110">
                04
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-white flex items-baseline gap-2">
                  NOTIFY & DISPATCH
                  <span className="text-neutral-500 font-normal">—</span>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    Instant team updates.
                  </span>
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
                  Automatically sends appointment details and a concise caller summary to your team.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN (40% Desktop) — Sleek Audio Preview Card */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="rounded-3xl border border-neutral-800/80 bg-neutral-900/60 dark:bg-neutral-950/70 backdrop-blur-xl p-6 shadow-2xl shadow-black/40 transition-all">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-neutral-300 uppercase font-mono">
                  SAMPLE INBOUND CALL
                </span>
              </div>
              <span className="text-xs font-mono font-medium text-cyan-300/80">
                00:24
              </span>
            </div>

            {/* Heading & Subtext */}
            <div className="mt-5 mb-6">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Attune™ Voice Preview
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-400 font-medium">
                Dental &amp; Aesthetics Intake Consultation
              </p>
            </div>

            {/* Centered Elegant Horizontal Waveform with Cyan Accents */}
            <div className="my-6 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/60 shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-2 px-1">
                <span className="text-cyan-400 font-medium">{formatTime(currentTime)}</span>
                <span>00:24</span>
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-14 sm:h-16 px-1">
                {WAVEFORM_BARS.map((heightPercent, idx) => {
                  const progressPercent = (currentTime / duration) * 100;
                  const barPercent = (idx / WAVEFORM_BARS.length) * 100;
                  const isPassed = barPercent <= progressPercent;

                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-full transition-all duration-200 ${
                        isPassed || isPlaying
                          ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                          : "bg-neutral-700"
                      }`}
                      style={{
                        height: isPlaying
                          ? `${Math.max(18, Math.min(100, heightPercent * (0.6 + 0.4 * Math.sin(idx * 0.7 + currentTime * 3))))}%`
                          : `${heightPercent}%`,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* CTA Button (Keep Purple) */}
            <button
              type="button"
              onClick={togglePlayback}
              className="w-full py-3.5 px-5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Voice Sample</span>
                </>
              ) : (
                <span>▶ Listen to Voice Sample</span>
              )}
            </button>

            {/* Two Clean Green Checkmark Bullet Points */}
            <div className="mt-6 pt-5 border-t border-neutral-800/80 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-300">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>Appointment reserved in real-time</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-300">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>Lead brief sent to team dashboard</span>
              </div>
            </div>

            {/* Proof Badge */}
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-col items-center gap-2">
              <div className="text-[10px] font-mono tracking-wider text-neutral-500 dark:text-neutral-400 uppercase bg-neutral-900/40 border border-neutral-800 rounded px-2.5 py-1 text-center inline-block">
                DEMO WORKFLOW · GOOGLE CALENDAR BOOKING TESTED
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
                Live integration configured directly with your clinic's booking schedule during setup.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
