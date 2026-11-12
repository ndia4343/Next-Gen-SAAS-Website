'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Check,
  CheckCheck,
  FileText,
  Smile,
  Sun,
  Briefcase,
  Workflow,
  CalendarCheck,
  PhoneCall,
  Globe,
  Cpu,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { VoiceIndustryConfig } from '@/types/site-config';

function getIndustryIcon(id: string): React.ComponentType<{ className?: string }> {
  switch (id) {
    case 'dental':
      return Smile;
    case 'solar':
      return Sun;
    case 'hr':
      return Briefcase;
    default:
      return Workflow;
  }
}

function getRegionBadge(ind: VoiceIndustryConfig): string {
  if (ind.regionBadge && ind.regionBadge.trim().length > 0) {
    return ind.regionBadge;
  }
  switch (ind.id) {
    case 'dental':
      return 'UAE Clinics · AED';
    case 'solar':
      return 'Regional Solar · Custom Quotes';
    case 'hr':
      return 'Hiring & Staffing · Multi-Timezone';
    default:
      return 'Custom Schedules · Any Timezone';
  }
}

function getCompletionSummary(ind: VoiceIndustryConfig): string {
  if (ind.completionSummary && ind.completionSummary.trim().length > 0) {
    return ind.completionSummary;
  }
  switch (ind.id) {
    case 'dental':
      return 'Sarah just qualified the caller and booked Treatment Room 2 in under 28 seconds.';
    case 'solar':
      return 'Hassan just sized the 12 kW request, booked the site survey, and sent the WhatsApp estimate.';
    case 'hr':
      return 'Maya just screened the candidate, noted notice period, and booked the recruiter call.';
    default:
      return 'Zed just logged the job ticket, booked the inspection slot, and sent WhatsApp follow-up instructions.';
  }
}

const ORDERED_SECTOR_PRIORITY: Record<string, number> = {
  dental: 0,
  solar: 1,
  hr: 2,
  custom: 3,
};

export default function VoiceSimulationSection() {
  const { config } = useSiteConfig();
  const vt = config.voiceTheatre;

  // Enforce clinic-first tab order: Dental & Aesthetics first, Solar / HR / Custom secondary
  const industries = [...vt.industries].sort(
    (a, b) => (ORDERED_SECTOR_PRIORITY[a.id] ?? 99) - (ORDERED_SECTOR_PRIORITY[b.id] ?? 99)
  );

  const [activeId, setActiveId] = useState<string>(
    industries.find((ind) => ind.id === 'dental')?.id || industries[0]?.id || 'dental'
  );
  const [playing, setPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [audioDuration, setAudioDuration] = useState(28);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [waConfirmed, setWaConfirmed] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current: VoiceIndustryConfig =
    industries.find((ind) => ind.id === activeId) || industries[0];
  const isDentalRealAudio = current.id === 'dental';
  const durationSec = isDentalRealAudio && audioAvailable ? audioDuration : 28;
  const timeScale = durationSec > 0 ? durationSec / 28 : 1;

  const WA_ARRIVAL_SEC = 22 * timeScale;
  const BOOKING_SEC = 19 * timeScale;
  const AUTO_COMPLETE_SEC = 26.8 * timeScale;

  // Listen to global Hero events ("Hear it answer a call", "WhatsApp" pill, and Sub-Hero secondary links)
  useEffect(() => {
    const onPlayClinic = () => {
      const firstDental = industries.find((i) => i.id === 'dental') || industries[0];
      if (firstDental) setActiveId(firstDental.id);
      setWaConfirmed(false);
      setCurrentSec(0.1);
      setPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {
            setAudioAvailable(false);
          });
        }
      }, 60);
    };

    const onFocusWhatsapp = () => {
      const firstDental = industries.find((i) => i.id === 'dental') || industries[0];
      if (firstDental) setActiveId(firstDental.id);
      setWaConfirmed(false);
      setCurrentSec(22.2);
      setPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };

    const onSelectIndustry = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const targetId = customEvent.detail;
      const found = industries.find((i) => i.id === targetId);
      if (!found) return;
      setActiveId(found.id);
      setWaConfirmed(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setCurrentSec(0.5);
      setPlaying(true);
    };

    window.addEventListener('zavian:play-clinic-demo', onPlayClinic);
    window.addEventListener('zavian:focus-whatsapp', onFocusWhatsapp);
    window.addEventListener('zavian:select-industry', onSelectIndustry);
    return () => {
      window.removeEventListener('zavian:play-clinic-demo', onPlayClinic);
      window.removeEventListener('zavian:focus-whatsapp', onFocusWhatsapp);
      window.removeEventListener('zavian:select-industry', onSelectIndustry);
    };
  }, [industries]);

  // Playback loop: real <audio> sync for Dental when available, smooth simulation clock otherwise
  useEffect(() => {
    if (!playing) return;

    const useNativeAudio =
      isDentalRealAudio && audioAvailable && audioRef.current && !audioRef.current.error;
    if (useNativeAudio) {
      const safetyIv = setInterval(() => {
        const el = audioRef.current;
        if (!el || el.paused || el.readyState < 2) {
          setCurrentSec((prev) => {
            const next = Math.min(prev + 0.12, durationSec);
            if (next >= durationSec) setPlaying(false);
            return next;
          });
        }
      }, 120);
      return () => clearInterval(safetyIv);
    }

    const step = isDentalRealAudio ? 0.14 : 0.28;
    const iv = setInterval(() => {
      setCurrentSec((prev) => {
        const next = Math.min(prev + step, 28);
        if (next >= 28) {
          setPlaying(false);
        }
        return next;
      });
    }, 120);

    return () => clearInterval(iv);
  }, [playing, isDentalRealAudio, audioAvailable, durationSec]);

  const started = currentSec > 0 || playing;
  const showBooking = currentSec >= BOOKING_SEC;
  const showWa = currentSec >= WA_ARRIVAL_SEC;
  const showCompletion = currentSec >= AUTO_COMPLETE_SEC;

  useEffect(() => {
    if (currentSec < WA_ARRIVAL_SEC) {
      setWaConfirmed(false);
    } else if (currentSec >= AUTO_COMPLETE_SEC) {
      setWaConfirmed(true);
    }
  }, [currentSec, WA_ARRIVAL_SEC, AUTO_COMPLETE_SEC]);

  // 4-second fallback auto-advance if visitor does not click the interactive "1 — Confirm" pill
  useEffect(() => {
    if (!showWa || waConfirmed) return;
    const fallbackTimer = setTimeout(() => {
      setWaConfirmed(true);
    }, 4000);
    return () => clearTimeout(fallbackTimer);
  }, [showWa, waConfirmed, current.id]);

  const handleSelectIndustry = (id: string) => {
    setActiveId(id);
    setWaConfirmed(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (id === 'dental') {
      setCurrentSec(0);
      setPlaying(false);
    } else {
      setCurrentSec(0.5);
      setPlaying(true);
    }
  };

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      audioRef.current?.pause();
    } else {
      const restarting = currentSec >= durationSec - 0.3;
      const startFrom = restarting ? 0 : currentSec;
      if (restarting) setWaConfirmed(false);
      setCurrentSec(startFrom || 0.1);
      setPlaying(true);
      if (isDentalRealAudio && audioRef.current) {
        audioRef.current.currentTime = startFrom;
        audioRef.current.play().catch(() => {
          setAudioAvailable(false);
        });
      }
    }
  };

  const scrubTo = (scriptSec: number, autoPlay = true) => {
    const rawTarget = scriptSec === 0 ? 0.1 : scriptSec * timeScale;
    const clamped = Math.min(Math.max(rawTarget, 0.1), durationSec);
    if (clamped < WA_ARRIVAL_SEC) {
      setWaConfirmed(false);
    } else if (clamped >= AUTO_COMPLETE_SEC) {
      setWaConfirmed(true);
    }
    setCurrentSec(clamped);
    if (autoPlay) {
      setPlaying(true);
    }
    if (isDentalRealAudio && audioRef.current) {
      audioRef.current.currentTime = clamped;
      if (autoPlay) {
        audioRef.current.play().catch(() => {
          setAudioAvailable(false);
        });
      }
    }
  };

  const handleScrubBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const targetSec = ratio * durationSec;
    if (targetSec < WA_ARRIVAL_SEC) setWaConfirmed(false);
    setCurrentSec(targetSec);
    setPlaying(true);
    if (isDentalRealAudio && audioRef.current) {
      audioRef.current.currentTime = targetSec;
      audioRef.current.play().catch(() => {
        setAudioAvailable(false);
      });
    }
  };

  const handleQuickReplyConfirm = () => {
    setWaConfirmed(true);
    if (!playing && currentSec < AUTO_COMPLETE_SEC) {
      setTimeout(() => {
        setCurrentSec((prev) => Math.max(prev, Math.min(27.3 * timeScale, durationSec)));
      }, 450);
    }
  };

  let activeTurnIdx = -1;
  if (started) {
    for (let i = 0; i < current.script.length; i++) {
      if (current.script[i].at * timeScale <= currentSec) {
        activeTurnIdx = i;
      }
    }
  }

  let activeSpeaker: 0 | 1 | 2 = 0;
  if (activeTurnIdx >= 0 && currentSec < BOOKING_SEC) {
    activeSpeaker = current.script[activeTurnIdx].isAi ? 2 : 1;
  }

  const formatClock = (s: number) => {
    const mm = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${mm}:${ss < 10 ? '0' : ''}${ss}`;
  };

  const progressPct = Math.min((currentSec / durationSec) * 100, 100);
  const bookingUrl =
    config.branding.calendarBookingUrl || 'https://calendar.app.google/u5vL88X41qmGBCky5';
  const regionBadge = getRegionBadge(current);
  const completionSummary = getCompletionSummary(current);

  return (
    <section
      id="voice-simulation"
      className="relative w-full bg-[#FFFFFF] text-[#0A0A0A] py-20 sm:py-28 px-5 sm:px-8 scroll-mt-20 overflow-hidden"
    >
      {/* Compatibility anchors */}
      <div id="voice" className="scroll-mt-20 pointer-events-none" />
      <div id="voice-demo" className="scroll-mt-20 pointer-events-none" />
      <div id="industries" className="scroll-mt-20 pointer-events-none" />

      {/* Subtle Warm / Neutral Studio Architectural Light */}
      <div
        className="pointer-events-none absolute -top-32 right-0 w-[560px] h-[560px] rounded-full blur-3xl opacity-35"
        style={{
          background:
            'radial-gradient(circle, rgba(139,92,246,0.07) 0%, rgba(16,185,129,0.04) 48%, transparent 72%)',
        }}
      />

      {/* Working audio sample element */}
      <audio
        ref={audioRef}
        src={vt.demoAudioUrl || '/audio/clinic-demo.mp3'}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (d && !Number.isNaN(d) && Number.isFinite(d)) {
            setAudioDuration(d);
            setAudioAvailable(true);
          }
        }}
        onTimeUpdate={(e) => {
          if (isDentalRealAudio && playing) {
            setCurrentSec(e.currentTarget.currentTime);
          }
        }}
        onEnded={() => {
          setPlaying(false);
          setWaConfirmed(true);
          setCurrentSec(durationSec);
        }}
        onError={() => {
          setAudioAvailable(false);
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto">
        
        {/* Clinic-First Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-[660px]">
            <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase text-[#10B981] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>{vt.sectionEyebrow}</span>
            </div>

            <h2
              className="mt-4 font-serif-instrument font-normal text-[#0A0A0A] tracking-[-0.02em] leading-[1.02]"
              style={{ fontSize: 'clamp(38px, 5vw, 72px)' }}
            >
              {vt.sectionTitle}{' '}
              <span className="italic text-[#8B5CF6]">{vt.sectionTitleAccent}</span>
            </h2>
          </div>

          <p className="max-w-[440px] text-[15.5px] sm:text-base leading-[1.6] text-[#585A66]">
            {vt.sectionDescription}
          </p>
        </div>

        {/* Clinic-First Tab Strip (Dental Primary, Solar & HR with "Also available" badge) */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Choose industry workflow"
            className="flex flex-wrap items-center gap-2.5"
          >
            {industries.map((ind) => {
              const Icon = getIndustryIcon(ind.id);
              const active = current.id === ind.id;
              const isPrimaryClinic = ind.id === 'dental';
              const showSecondaryBadge = ind.id === 'solar' || ind.id === 'hr';

              return (
                <button
                  key={ind.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => handleSelectIndustry(ind.id)}
                  style={
                    active
                      ? { boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)' }
                      : undefined
                  }
                  className={`zl-btn inline-flex items-center gap-2 rounded-full border transition-all duration-200 cursor-pointer ${
                    isPrimaryClinic
                      ? active
                        ? 'min-h-[48px] px-5 bg-[#0A0A0A] border-[#0A0A0A] text-white text-sm font-semibold'
                        : 'min-h-[48px] px-5 bg-white border-[#10B981]/50 text-[#0A0A0A] hover:bg-[#FAFAFA] text-sm font-semibold'
                      : active
                      ? 'min-h-[42px] px-4 bg-[#0A0A0A] border-[#0A0A0A] text-white text-xs sm:text-sm font-medium'
                      : 'min-h-[42px] px-4 bg-[#FAFAFA] border-[rgba(0,0,0,0.07)] text-[#585A66] hover:bg-white hover:text-[#0A0A0A] text-xs sm:text-sm font-medium'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active
                        ? 'text-[#10B981]'
                        : isPrimaryClinic
                        ? 'text-[#10B981]'
                        : 'text-[#585A66]'
                    }`}
                  />
                  <span>{ind.label}</span>
                  {showSecondaryBadge && (
                    <span
                      className={`text-[9.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        active
                          ? 'bg-white/15 text-zinc-200'
                          : 'bg-black/[0.05] text-[#585A66]'
                      }`}
                    >
                      Also available
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explicit Demo Honesty Caption */}
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#585A66] shrink-0">
            <Info className="w-3.5 h-3.5 text-[#585A66] shrink-0" />
            <span>Illustrative demo &middot; sample data, not client results</span>
          </div>
        </div>

        {/* Interactive Sandbox Theatre: Responsive flex-col lg:flex-row */}
        <div className="mt-7 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-0">
          
          {/* LEFT: Anchored Obsidian Voice Console */}
          <div className="w-full lg:w-[66%] xl:w-[68%] relative z-10 rounded-[28px] border border-[rgba(0,0,0,0.12)] bg-[#0A0B0F] text-[#eceef2] shadow-[0_32px_80px_rgba(0,0,0,0.16)] overflow-hidden">
            
            {/* Console Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-7 py-5 border-b border-white/10">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-serif-instrument text-2xl text-[#07080b] shrink-0 shadow-[0_0_20px_rgba(94,227,255,0.25)]"
                  style={{
                    background:
                      'linear-gradient(135deg, #f2f4f8 0%, #a1a9b8 50%, #e6eaf2 100%)',
                  }}
                >
                  {current.agentName.charAt(0)}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[15px] sm:text-base font-semibold text-[#eceef2]">
                    <span className="truncate">{current.agentRole}</span>
                    {playing && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 font-mono text-[10px] text-emerald-300 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Live Demo
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#9aa1ad] mt-0.5 truncate">
                    {current.label} &bull; {current.channelNote}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 ml-auto">
                {/* Honest Regional Attribution Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/15 font-mono text-[10.5px] tracking-[0.04em] text-[#d5dbe6]">
                  <Globe className="w-3.5 h-3.5 text-[#5ee3ff] shrink-0" />
                  <span>{regionBadge}</span>
                </div>

                <span className="font-mono text-xs sm:text-[13px] text-[#c9ced8] tabular-nums">
                  {formatClock(currentSec)} / {formatClock(durationSec)}
                </span>

                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? 'Pause sample' : 'Play sample'}
                  className="zl-btn w-12 h-12 rounded-full bg-[#eceef2] hover:bg-white text-[#07080b] flex items-center justify-center shadow-[0_4px_18px_rgba(236,238,242,0.25)] cursor-pointer shrink-0"
                >
                  {playing ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current translate-x-[1px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Waveform & Timeline Scrubbing */}
            <div className="px-5 sm:px-7 pt-6 pb-3">
              {/* 42 Animated Audio Wave Bars */}
              <div className="h-14 flex items-center gap-[3px] sm:gap-1">
                {Array.from({ length: 42 }).map((_, i) => {
                  const baseH = 7 + 8 * Math.abs(Math.sin(i * 0.68));
                  const liveH =
                    playing && activeSpeaker > 0
                      ? 8 +
                        (activeSpeaker === 2 ? 44 : 32) *
                          Math.abs(Math.sin(currentSec * 6.5 + i * 0.85)) *
                          (0.5 + 0.5 * Math.abs(Math.sin(i * 0.33)))
                      : baseH;

                  const passed = (i / 42) * 100 <= progressPct;
                  const barColor =
                    playing && activeSpeaker === 2
                      ? '#5ee3ff'
                      : playing && activeSpeaker === 1
                      ? '#b4a0ff'
                      : passed
                      ? '#5ee3ff'
                      : 'rgba(255,255,255,0.22)';

                  return (
                    <div
                      key={i}
                      style={{
                        height: `${Math.round(liveH)}px`,
                        backgroundColor: barColor,
                      }}
                      className="flex-1 rounded-full transition-[height,background-color] duration-100"
                    />
                  );
                })}
              </div>

              {/* Clickable Progress Bar */}
              <div
                onClick={handleScrubBarClick}
                role="slider"
                aria-label="Simulation timeline scrubber"
                aria-valuemin={0}
                aria-valuemax={Math.round(durationSec)}
                aria-valuenow={Math.round(currentSec)}
                tabIndex={0}
                className="mt-4 h-1.5 rounded-full bg-white/12 relative cursor-pointer group"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 rounded-full transition-[width] duration-150"
                  style={{
                    width: `${progressPct}%`,
                    background: 'linear-gradient(90deg, #5ee3ff, #a78bfa)',
                  }}
                />
              </div>

              {/* Scrubber Milestones */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => scrubTo(0)}
                  className={`zl-btn min-h-[36px] px-3.5 rounded-xl border font-mono text-[11px] tracking-[0.06em] uppercase transition-all cursor-pointer ${
                    started && currentSec < BOOKING_SEC
                      ? 'border-[#5ee3ff]/60 bg-[#5ee3ff]/12 text-[#9fe9ff]'
                      : 'border-white/15 bg-white/[0.04] text-[#c9ced8] hover:border-white/30'
                  }`}
                >
                  0:00 &middot; Call ({current.callerName})
                </button>

                <button
                  type="button"
                  onClick={() => scrubTo(19)}
                  className={`zl-btn min-h-[36px] px-3.5 rounded-xl border font-mono text-[11px] tracking-[0.06em] uppercase transition-all cursor-pointer ${
                    showBooking && !showWa
                      ? 'border-[#5ee3ff]/60 bg-[#5ee3ff]/12 text-[#9fe9ff]'
                      : 'border-white/15 bg-white/[0.04] text-[#c9ced8] hover:border-white/30'
                  }`}
                >
                  0:19 &middot; Slot Match
                </button>

                <button
                  type="button"
                  onClick={() => scrubTo(22.2)}
                  className={`zl-btn min-h-[36px] px-3.5 rounded-xl border font-mono text-[11px] tracking-[0.06em] uppercase transition-all cursor-pointer ${
                    showWa
                      ? 'border-[#25D366]/60 bg-[#25D366]/12 text-emerald-300'
                      : 'border-white/15 bg-white/[0.04] text-[#c9ced8] hover:border-white/30'
                  }`}
                >
                  0:22 &middot; WhatsApp
                </button>
              </div>

              {/* PLAIN-LANGUAGE OPERATIONAL STATUS STRIP */}
              <div
                className={`mt-4 p-2.5 sm:px-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-2.5 transition-all duration-300 ${
                  playing
                    ? 'border-[#5ee3ff]/40 bg-[#5ee3ff]/[0.07] shadow-[0_0_24px_rgba(94,227,255,0.12)]'
                    : 'border-white/10 bg-white/[0.025]'
                }`}
              >
                <div
                  className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.03em] transition-colors ${
                    playing ? 'text-[#9fe9ff] font-semibold' : 'text-[#9aa1ad]'
                  }`}
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full bg-[#5ee3ff] opacity-75 ${
                        playing ? 'animate-ping' : 'animate-pulse'
                      }`}
                    />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5ee3ff] shadow-[0_0_8px_#5ee3ff]" />
                  </span>
                  <span>Answers in under a second</span>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.03em] transition-colors ${
                    playing || showBooking ? 'text-emerald-300 font-semibold' : 'text-[#9aa1ad]'
                  }`}
                >
                  <Cpu
                    className={`w-3.5 h-3.5 shrink-0 ${
                      playing || showBooking ? 'text-emerald-400' : 'text-[#7f8796]'
                    }`}
                  />
                  <span>Syncs with your booking calendar</span>
                </div>
              </div>
            </div>

            {/* CLICK-TO-SCRUB "KARAOKE" TRANSCRIPT FEED & BOOKING LOCK */}
            <div className="px-5 sm:px-7 pt-3 pb-7 min-h-[340px] flex flex-col justify-start gap-3">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.08em] text-[#8d95a3]">
                <span>Click any line to jump &amp; preview confirmation</span>
                <span className="text-[#9aa1ad]">Sample conversation script</span>
              </div>

              <div className="space-y-3">
                {current.script.map((turn, idx) => {
                  const isReached = started && turn.at * timeScale <= currentSec;
                  const isActiveLine = started && idx === activeTurnIdx;

                  return (
                    <motion.div
                      key={`${current.id}-turn-${idx}`}
                      layout
                      role="button"
                      tabIndex={0}
                      onClick={() => scrubTo(turn.at)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          scrubTo(turn.at);
                        }
                      }}
                      className={`flex ${turn.isAi ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[88%] px-4 py-3 text-[13.5px] sm:text-[14.5px] leading-[1.5] border cursor-pointer hover:border-cyan-400/60 transition-colors duration-200 ${
                          turn.isAi
                            ? 'rounded-[18px_18px_4px_18px]'
                            : 'rounded-[18px_18px_18px_4px]'
                        } ${
                          isActiveLine
                            ? turn.isAi
                              ? 'bg-gradient-to-br from-[#5ee3ff]/24 to-[#a78bfa]/22 border-[#5ee3ff]/75 text-white shadow-[0_0_24px_rgba(94,227,255,0.16)] opacity-100'
                              : 'bg-white/[0.11] border-[#5ee3ff]/70 text-white shadow-[0_0_20px_rgba(94,227,255,0.12)] opacity-100'
                            : isReached
                            ? turn.isAi
                              ? 'bg-gradient-to-br from-[#5ee3ff]/16 to-[#a78bfa]/14 border-[#5ee3ff]/30 text-[#eceef2] opacity-95'
                              : 'bg-white/[0.06] border-white/12 text-[#e4e7ee] opacity-95'
                            : 'bg-white/[0.03] border-white/10 text-[#9aa1ad] opacity-65 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.1em] uppercase mb-1">
                          <span className={isActiveLine ? 'text-[#5ee3ff] font-semibold' : 'text-[#a0a7b3]'}>
                            {turn.who}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[9.5px] text-[#9aa1ad] tabular-nums">
                            {isActiveLine && (
                              <span className="inline-flex items-center gap-1 text-[#5ee3ff] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5ee3ff] animate-pulse" />
                                Active
                              </span>
                            )}
                            <span>{formatClock(turn.at * timeScale)}</span>
                          </span>
                        </div>
                        <div>{turn.text}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <AnimatePresence>
                {showBooking && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="mt-1 p-4 rounded-2xl border border-[#5ee3ff]/45 flex items-center gap-3.5"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(94,227,255,0.16), rgba(167,139,250,0.15))',
                    }}
                  >
                    <span className="w-8 h-8 rounded-full bg-[#5ee3ff] text-[#06222b] flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#9fe9ff]">
                        Confirmed on Clinic Calendar
                      </div>
                      <div className="text-sm sm:text-[15px] font-semibold text-white">
                        {current.lockedSlotMessage}
                      </div>
                      <div className="text-xs text-[#c9ced8] mt-0.5">
                        {current.lockedSlotSub}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* END-OF-CALL CONVERSION CTA BRIDGE */}
              <AnimatePresence>
                {showCompletion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-2 p-4 sm:p-5 rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-emerald-500/15 via-[#5ee3ff]/10 to-[#8B5CF6]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_12px_36px_rgba(16,185,129,0.12)]"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-emerald-400 text-[#052e16] flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-300 font-bold">
                          Sample Call Complete
                        </div>
                        <p className="text-sm font-medium text-white leading-snug mt-0.5">
                          {completionSummary}
                        </p>
                      </div>
                    </div>

                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="zl-btn inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#eceef2] hover:bg-white text-[#07080b] font-semibold text-xs sm:text-sm whitespace-nowrap shadow-[0_6px_22px_rgba(236,238,242,0.22)] cursor-pointer shrink-0"
                    >
                      <span>Book a free missed-call audit</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Responsive 3D Metallic Phone Mockup */}
          <div className="w-full lg:w-[34%] xl:w-[32%] relative z-20 flex justify-center lg:justify-start ml-0 lg:-ml-12 mt-0 lg:mt-10 max-lg:!ml-0">
            <motion.div
              key={current.id}
              initial={{ opacity: 0.75, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[335px] rounded-[42px] p-3 rotate-0 lg:rotate-3 lg:hover:rotate-1 transition-transform duration-300 max-lg:[transform:none!important]"
              style={{
                background: 'linear-gradient(145deg, #e4e4e7 0%, #9ca3af 52%, #52525b 100%)',
                boxShadow:
                  '0 36px 80px rgba(0, 0, 0, 0.20), 0 0 0 1px rgba(0, 0, 0, 0.10)',
              }}
            >
              {/* OLED Screen */}
              <div className="rounded-[32px] bg-[#0b141a] overflow-hidden min-h-[485px] flex flex-col">
                
                {/* WhatsApp Top Bar */}
                <div className="px-4 py-3.5 bg-[#1f2c34] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center font-serif-instrument text-lg text-[#07080b] shrink-0"
                      style={{
                        background:
                          'linear-gradient(135deg, #f2f4f8 0%, #9fa7b8 100%)',
                      }}
                    >
                      {current.agentName.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[#e9edef] font-semibold text-sm truncate">
                        {current.whatsAppContactName}
                      </div>
                      <div className="text-[#8696a0] text-[11px] truncate">
                        Sample Booking Thread
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Thread Area */}
                <div
                  className="flex-1 px-3.5 py-4 flex flex-col gap-2.5"
                  style={{
                    background: 'linear-gradient(180deg, #0b141a 0%, #0e1d25 100%)',
                  }}
                >
                  {!showWa ? (
                    <div className="my-auto text-center px-4 space-y-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-[#5ee3ff]">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <p className="text-[#8696a0] text-[13px] leading-relaxed">
                        The WhatsApp confirmation appears right after the booking locks, or click{' '}
                        <button
                          type="button"
                          onClick={() => scrubTo(22.2, false)}
                          className="inline-flex items-center justify-center px-2.5 py-0.5 mx-1 rounded-full bg-[#005c4b] hover:bg-[#047857] text-white font-semibold text-[11.5px] leading-tight border border-emerald-400/60 shadow-[0_2px_10px_rgba(16,185,129,0.24)] transition-colors cursor-pointer align-middle whitespace-nowrap"
                        >
                          1 — Confirm
                        </button>{' '}
                        to test confirming.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Primary Message Bubble */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="self-start max-w-[90%] p-3 rounded-[14px_14px_14px_4px] bg-[#202c33] text-[#e9edef] text-[13px] leading-[1.45] shadow-xs"
                      >
                        <p>{current.whatsAppNotice}</p>

                        {/* Optional Attachment Chip */}
                        {current.whatsAppAttachmentName && (
                          <div className="mt-2.5 p-2 rounded-xl bg-black/25 border border-white/10 flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#5ee3ff]/15 text-[#5ee3ff] flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11.5px] font-medium text-white truncate">
                                {current.whatsAppAttachmentName}
                              </div>
                              {current.whatsAppAttachmentMeta && (
                                <div className="text-[10px] text-[#8696a0] truncate">
                                  {current.whatsAppAttachmentMeta}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="mt-1.5 text-right text-[10px] text-[#8696a0] flex items-center justify-end gap-1">
                          <span>now</span>
                          <CheckCheck
                            className={`w-3.5 h-3.5 transition-colors duration-300 ${
                              waConfirmed ? 'text-[#53bdeb]' : 'text-[#8696a0]'
                            }`}
                          />
                        </div>
                      </motion.div>

                      {/* Tactile Interactive Quick-Reply Pill vs Confirmed Thread */}
                      {!waConfirmed ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="self-end flex flex-col items-end gap-1.5 mt-1"
                        >
                          <button
                            type="button"
                            onClick={handleQuickReplyConfirm}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005c4b] hover:bg-[#047857] text-white font-semibold text-[13px] border border-emerald-400/50 shadow-[0_6px_20px_rgba(16,185,129,0.28)] active:scale-95 transition-all duration-150 cursor-pointer"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                            <span>{current.whatsAppReply || '1 — Confirm'}</span>
                          </button>
                          <span className="font-mono text-[9.5px] text-[#8696a0] pr-1">
                            Tap quick-reply &middot; auto-sends in 4s
                          </span>
                        </motion.div>
                      ) : (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="self-end max-w-[82%] px-3 py-2 rounded-[14px_14px_4px_14px] bg-[#005c4b] text-[#e9edef] text-[13px] flex items-end gap-2"
                          >
                            <span>{current.whatsAppReply || '1 — Confirm'}</span>
                            <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] shrink-0" />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12 }}
                            className="self-start max-w-[90%] p-3 rounded-[14px_14px_14px_4px] bg-[#202c33] text-[#e9edef] text-[13px] leading-[1.45]"
                          >
                            <p>{current.whatsAppFollowup}</p>
                            <div className="mt-1 text-right text-[10px] text-[#8696a0] flex items-center justify-end gap-1">
                              <span>just now</span>
                              <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                            </div>
                          </motion.div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Concise 3-Outcome Business Value Strip */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {current.outcomes.map((outcome, idx) => (
            <div
              key={`${current.id}-out-${idx}`}
              className="zl-card flex items-start gap-3 px-5 py-4 rounded-2xl bg-white border border-[rgba(0,0,0,0.07)] shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
            >
              <span className="mt-0.5 w-6 h-6 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-medium text-[#0A0A0A] leading-snug">
                {outcome}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
