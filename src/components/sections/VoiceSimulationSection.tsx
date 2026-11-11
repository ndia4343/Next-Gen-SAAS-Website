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

export default function VoiceSimulationSection() {
  const { config } = useSiteConfig();
  const vt = config.voiceTheatre;
  const industries = vt.industries;

  const [activeId, setActiveId] = useState<string>(industries[0]?.id || 'dental');
  const [playing, setPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [audioDuration, setAudioDuration] = useState(28);
  const [audioAvailable, setAudioAvailable] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current: VoiceIndustryConfig =
    industries.find((ind) => ind.id === activeId) || industries[0];
  const isDentalRealAudio = current.id === 'dental';
  const durationSec = isDentalRealAudio && audioAvailable ? audioDuration : 28;

  // Listen to global Hero events ("Hear a sample call" & "WhatsApp" tag)
  useEffect(() => {
    const onPlayClinic = () => {
      const firstDental = industries.find((i) => i.id === 'dental') || industries[0];
      if (firstDental) setActiveId(firstDental.id);
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
      setCurrentSec(23.5);
      setPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };

    window.addEventListener('zavian:play-clinic-demo', onPlayClinic);
    window.addEventListener('zavian:focus-whatsapp', onFocusWhatsapp);
    return () => {
      window.removeEventListener('zavian:play-clinic-demo', onPlayClinic);
      window.removeEventListener('zavian:focus-whatsapp', onFocusWhatsapp);
    };
  }, [industries]);

  // Playback loop: real <audio> sync for Dental when available, visual progress timer otherwise
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

    const step = isDentalRealAudio ? 0.12 : 0.32;
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

  const handleSelectIndustry = (id: string) => {
    setActiveId(id);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (id === 'dental') {
      setCurrentSec(0);
      setPlaying(false);
    } else {
      // Immediately start transcript & WhatsApp simulation without synthetic TTS
      setCurrentSec(0.5);
      setPlaying(true);
    }
  };

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      audioRef.current?.pause();
    } else {
      const startFrom = currentSec >= durationSec - 0.3 ? 0 : currentSec;
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

  const seekTo = (sec: number) => {
    const clamped = Math.min(Math.max(sec, 0), durationSec);
    setCurrentSec(clamped);
    setPlaying(true);
    if (isDentalRealAudio && audioRef.current) {
      audioRef.current.currentTime = clamped;
      audioRef.current.play().catch(() => {
        setAudioAvailable(false);
      });
    }
  };

  const handleScrubBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    seekTo(ratio * durationSec);
  };

  const timeScale = durationSec > 0 ? durationSec / 28 : 1;
  const started = currentSec > 0 || playing;

  const visibleTurns = started
    ? current.script.filter((turn) => turn.at * timeScale <= currentSec)
    : [];

  let activeSpeaker: 0 | 1 | 2 = 0;
  for (let i = 0; i < current.script.length; i++) {
    if (current.script[i].at * timeScale <= currentSec) {
      activeSpeaker = current.script[i].isAi ? 2 : 1;
    }
  }
  if (currentSec >= 19 * timeScale) activeSpeaker = 0;

  const showBooking = currentSec >= 19 * timeScale;
  const showWa = currentSec >= 23 * timeScale;
  const showReply = currentSec >= 26.5 * timeScale;

  const formatClock = (s: number) => {
    const mm = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${mm}:${ss < 10 ? '0' : ''}${ss}`;
  };

  const progressPct = Math.min((currentSec / durationSec) * 100, 100);

  return (
    <section
      id="voice-simulation"
      className="relative w-full bg-[#F8F9FA] text-[#090A0D] py-20 sm:py-28 px-5 sm:px-8 scroll-mt-20 overflow-hidden"
    >
      {/* Compatibility anchors */}
      <div id="how-it-works" className="scroll-mt-20 pointer-events-none" />
      <div id="voice" className="scroll-mt-20 pointer-events-none" />
      <div id="voice-demo" className="scroll-mt-20 pointer-events-none" />
      <div id="industries" className="scroll-mt-20 pointer-events-none" />

      {/* Subtle architectural cobalt/indigo glow */}
      <div
        className="pointer-events-none absolute -top-32 right-0 w-[560px] h-[560px] rounded-full blur-3xl opacity-45"
        style={{
          background:
            'radial-gradient(circle, rgba(10,132,255,0.09) 0%, rgba(99,102,241,0.06) 48%, transparent 72%)',
        }}
      />

      {/* Hidden native audio element connected cleanly to Dental tab */}
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
          setCurrentSec(durationSec);
        }}
        onError={() => {
          setAudioAvailable(false);
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-[660px]">
            <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase text-[#0A84FF] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0A84FF]" />
              <span>{vt.sectionEyebrow}</span>
            </div>

            <h2
              className="mt-4 font-serif-instrument font-normal text-[#090A0D] tracking-[-0.02em] leading-[1.02]"
              style={{ fontSize: 'clamp(38px, 5vw, 72px)' }}
            >
              {vt.sectionTitle}{' '}
              <span className="italic text-[#6366F1]">{vt.sectionTitleAccent}</span>
            </h2>
          </div>

          <p className="max-w-[400px] text-[15.5px] sm:text-base leading-[1.6] text-[#525866]">
            {vt.sectionDescription}
          </p>
        </div>

        {/* Consolidated 4-Industry Tab Strip */}
        <div
          role="tablist"
          aria-label="Choose your industry"
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          {industries.map((ind) => {
            const Icon = getIndustryIcon(ind.id);
            const active = current.id === ind.id;

            return (
              <button
                key={ind.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => handleSelectIndustry(ind.id)}
                style={
                  active
                    ? { boxShadow: '0 0 22px rgba(10, 132, 255, 0.22)' }
                    : undefined
                }
                className={`zl-btn inline-flex items-center gap-2.5 min-h-[46px] px-5 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-white border-[#0A84FF] text-[#0A84FF]'
                    : 'bg-white/80 border-[rgba(15,23,42,0.10)] text-[#525866] hover:bg-white hover:text-[#090A0D] hover:border-[rgba(15,23,42,0.22)]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#0A84FF]' : 'text-[#525866]'}`} />
                <span>{ind.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Theatre: Anchored Dark Voice Console + Angled 3D WhatsApp Device */}
        <div className="mt-9 grid grid-cols-1 lg:grid-cols-12 items-start gap-8 lg:gap-0">
          
          {/* LEFT: Anchored Obsidian Voice Console (8 cols) */}
          <div className="lg:col-span-8 relative z-10 rounded-[28px] border border-[rgba(15,23,42,0.12)] bg-[#0d1016] text-[#eceef2] shadow-[0_36px_90px_rgba(15,23,42,0.18)] overflow-hidden">
            
            {/* Console Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-7 py-5 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-serif-instrument text-2xl text-[#07080b] shrink-0 shadow-[0_0_20px_rgba(94,227,255,0.25)]"
                  style={{
                    background:
                      'linear-gradient(135deg, #f2f4f8 0%, #a1a9b8 50%, #e6eaf2 100%)',
                  }}
                >
                  {current.agentName.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[15px] sm:text-base font-semibold text-[#eceef2]">
                    <span>{current.agentRole}</span>
                    {playing && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 font-mono text-[10px] text-emerald-300 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Live
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#9aa1ad] mt-0.5">
                    {current.label} &bull; {current.channelNote}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <span className="font-mono text-xs sm:text-[13px] text-[#c9ced8] tabular-nums">
                  {formatClock(currentSec)} / {formatClock(durationSec)}
                </span>

                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? 'Pause sample' : 'Play sample'}
                  className="zl-btn w-12 h-12 rounded-full bg-[#eceef2] hover:bg-white text-[#07080b] flex items-center justify-center shadow-[0_4px_18px_rgba(236,238,242,0.25)] cursor-pointer"
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
            <div className="px-6 sm:px-7 pt-6 pb-3">
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
                  onClick={() => seekTo(0.1)}
                  className={`zl-btn min-h-[38px] px-3.5 rounded-xl border font-mono text-[11px] tracking-[0.06em] uppercase transition-all cursor-pointer ${
                    started && currentSec < 19 * timeScale
                      ? 'border-[#5ee3ff]/60 bg-[#5ee3ff]/12 text-[#9fe9ff]'
                      : 'border-white/15 bg-white/[0.04] text-[#c9ced8] hover:border-white/30'
                  }`}
                >
                  0:00 &middot; Call ({current.callerName})
                </button>

                <button
                  type="button"
                  onClick={() => seekTo(19 * timeScale)}
                  className={`zl-btn min-h-[38px] px-3.5 rounded-xl border font-mono text-[11px] tracking-[0.06em] uppercase transition-all cursor-pointer ${
                    showBooking && !showWa
                      ? 'border-[#5ee3ff]/60 bg-[#5ee3ff]/12 text-[#9fe9ff]'
                      : 'border-white/15 bg-white/[0.04] text-[#c9ced8] hover:border-white/30'
                  }`}
                >
                  0:19 &middot; Slot Match
                </button>

                <button
                  type="button"
                  onClick={() => seekTo(23 * timeScale)}
                  className={`zl-btn min-h-[38px] px-3.5 rounded-xl border font-mono text-[11px] tracking-[0.06em] uppercase transition-all cursor-pointer ${
                    showWa
                      ? 'border-[#25D366]/60 bg-[#25D366]/12 text-emerald-300'
                      : 'border-white/15 bg-white/[0.04] text-[#c9ced8] hover:border-white/30'
                  }`}
                >
                  0:23 &middot; WhatsApp
                </button>
              </div>
            </div>

            {/* Live Transcript Feed & Booking Lock */}
            <div className="px-6 sm:px-7 pt-3 pb-7 min-h-[325px] flex flex-col justify-start gap-3">
              {!started ? (
                <div className="my-auto p-6 rounded-2xl border border-dashed border-white/20 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/15 mx-auto flex items-center justify-center text-[#5ee3ff]">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <p className="text-sm sm:text-[15px] text-[#c9ced8] max-w-md mx-auto leading-relaxed">
                    Press <strong className="text-white">Play</strong> above to hear how{' '}
                    {current.agentName} handles {current.callerName}&apos;s call, checks live availability, and triggers the WhatsApp confirmation.
                  </p>
                </div>
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {visibleTurns.map((turn, idx) => (
                      <motion.div
                        key={`${current.id}-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className={`flex ${turn.isAi ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-3 text-[13.5px] sm:text-[14.5px] leading-[1.5] border ${
                            turn.isAi
                              ? 'rounded-[18px_18px_4px_18px] bg-gradient-to-br from-[#5ee3ff]/20 to-[#a78bfa]/18 border-[#5ee3ff]/35 text-[#eceef2]'
                              : 'rounded-[18px_18px_18px_4px] bg-white/[0.06] border-white/12 text-[#e4e7ee]'
                          }`}
                        >
                          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#a0a7b3] mb-1">
                            {turn.who}
                          </div>
                          <div>{turn.text}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {showBooking && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 p-4 rounded-2xl border border-[#5ee3ff]/45 flex items-center gap-3.5"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(94,227,255,0.16), rgba(167,139,250,0.15))',
                      }}
                    >
                      <span className="w-8 h-8 rounded-full bg-[#5ee3ff] text-[#06222b] flex items-center justify-center shrink-0">
                        <CalendarCheck className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#9fe9ff]">
                          Confirmed in Calendar / PMS
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
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Angled 3D Metallic Phone Mockup */}
          <div className="lg:col-span-4 relative z-20 flex justify-center lg:justify-start lg:-ml-12 lg:mt-10">
            <motion.div
              key={current.id}
              initial={{ opacity: 0.7, y: 12, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              whileHover={{ rotate: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[335px] rounded-[42px] p-3 transition-shadow"
              style={{
                background: 'linear-gradient(145deg, #d7dce5 0%, #868f9f 52%, #4a5260 100%)',
                boxShadow:
                  '0 40px 85px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.14)',
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
                        Verified Business Account
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full shrink-0">
                    Active
                  </span>
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
                        <CheckCheck className="w-4 h-4" />
                      </div>
                      <p className="text-[#8696a0] text-[13px] leading-relaxed">
                        The WhatsApp confirmation &amp; files arrive here right after the slot locks, or press{' '}
                        <button
                          type="button"
                          onClick={() => seekTo(23 * timeScale)}
                          className="text-[#5ee3ff] underline underline-offset-2 cursor-pointer"
                        >
                          0:23 · WhatsApp
                        </button>{' '}
                        to preview.
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
                          <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                        </div>
                      </motion.div>

                      {/* Client Reply & Confirmation */}
                      {showReply && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="self-end max-w-[82%] px-3 py-2 rounded-[14px_14px_4px_14px] bg-[#005c4b] text-[#e9edef] text-[13px]"
                          >
                            {current.whatsAppReply}
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="self-start max-w-[88%] p-3 rounded-[14px_14px_14px_4px] bg-[#202c33] text-[#e9edef] text-[13px] leading-[1.45]"
                          >
                            {current.whatsAppFollowup}
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
              className="zl-card flex items-start gap-3 px-5 py-4 rounded-2xl bg-white border border-[rgba(15,23,42,0.08)] shadow-[0_6px_20px_rgba(0,0,0,0.03)]"
            >
              <span className="mt-0.5 w-6 h-6 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-medium text-[#090A0D] leading-snug">
                {outcome}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
