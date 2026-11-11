'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Check,
  CheckCheck,
  FileText,
  MapPin,
  Smile,
  Sun,
  Briefcase,
  Workflow,
  CalendarCheck,
  PhoneCall,
} from 'lucide-react';

type IndustryKey = 'dental' | 'solar' | 'hr' | 'custom';

interface TranscriptTurn {
  at: number;
  who: string;
  ai: boolean;
  text: string;
}

interface WhatsAppScenario {
  contactName: string;
  subtitle: string;
  outgoingMsg: string;
  clientReply: string;
  followupMsg: string;
  attachment?: { name: string; meta: string };
  locationTag?: string;
}

interface IndustryConfig {
  id: IndustryKey;
  label: string;
  shortRole: string;
  icon: React.ComponentType<{ className?: string }>;
  agentName: string;
  agentTitle: string;
  channelNote: string;
  hasRealAudio: boolean;
  slotSummary: string;
  slotSub: string;
  milestoneBookLabel: string;
  script: TranscriptTurn[];
  whatsapp: WhatsAppScenario;
  outcomes: [string, string, string];
}

const INDUSTRIES: Record<IndustryKey, IndustryConfig> = {
  dental: {
    id: 'dental',
    label: 'Dental & Aesthetics',
    shortRole: 'Dubai DIFC Reception',
    icon: Smile,
    agentName: 'Sarah',
    agentTitle: 'Dubai DIFC Clinical Receptionist',
    channelNote: 'Voice Recording + PMS Booking',
    hasRealAudio: true,
    slotSummary: 'Thursday · 6:00 PM · Aligner Assessment + 3D Scan',
    slotSub: 'Locked in PMS · Operatory Chair 2 (Dr. Thorne)',
    milestoneBookLabel: '0:19 · Slot Match',
    script: [
      {
        at: 0,
        who: 'Patient (Farah)',
        ai: false,
        text: "Hi, I work in DIFC and usually finish late. Do you have an assessment slot for clear aligners after 5:30 PM this week?",
      },
      {
        at: 5,
        who: 'Sarah · Reception Desk',
        ai: true,
        text: 'Yes, we stay open late on weekdays for DIFC patients. Dr. Thorne has Thursday at 6:00 PM or Saturday morning at 10:30 AM. Both include a 3D iTero scan.',
      },
      {
        at: 11,
        who: 'Patient (Farah)',
        ai: false,
        text: 'Thursday at 6:00 PM works best for my commute.',
      },
      {
        at: 15,
        who: 'Sarah · Reception Desk',
        ai: true,
        text: "Reserved in Chair 2 for Thursday at 6:00 PM. I'm sending your valet access and WhatsApp confirmation now.",
      },
    ],
    whatsapp: {
      contactName: 'Sarah • Clinic Desk',
      subtitle: 'Verified Practice (DHA)',
      outgoingMsg:
        'Hi Farah — your aligner assessment & 3D scan with Dr. Thorne is booked for Thursday at 6:00 PM (Chair 2, complimentary tower valet). Reply 1 to confirm or 2 to reschedule.',
      clientReply: '1 — Confirm',
      followupMsg: 'Confirmed. Your digital clinic pass and calendar invite are ready below.',
      attachment: {
        name: 'PMS_Chair2_Pass.ics',
        meta: 'Operatory 2 • Sheikh Zayed Rd Valet',
      },
    },
    outcomes: [
      'Picks up after-hours & busy-hour clinic calls immediately',
      'Checks real doctor availability and locks PMS chair slots',
      'Sends patient pass & valet instructions via WhatsApp',
    ],
  },

  solar: {
    id: 'solar',
    label: 'Solar EPC & Installers',
    shortRole: 'Roof kW & Net-Metering',
    icon: Sun,
    agentName: 'Hassan',
    agentTitle: 'SolarPro Sizing & Survey Coordinator',
    channelNote: 'Automated Qualification Flow',
    hasRealAudio: false,
    slotSummary: 'Wednesday · 10:00 AM · 12 kW Hybrid Site Survey',
    slotSub: 'LESCO Net-Metering Estimate + Roof Engineer Assigned',
    milestoneBookLabel: '0:19 · Quote Ready',
    script: [
      {
        at: 0,
        who: 'Homeowner (Tariq)',
        ai: false,
        text: 'My summer electricity bill hit Rs 98,000 last month. Can your team quote a 10 or 12 kW net-metering system and visit this week?',
      },
      {
        at: 5,
        who: 'Hassan · SolarPro Desk',
        ai: true,
        text: 'Based on 1,450 monthly units on LESCO, a 12 kW hybrid system covers roughly 88% of your bill with a 2.8-year payback. Would Wednesday at 10:00 AM work for a roof survey?',
      },
      {
        at: 11,
        who: 'Homeowner (Tariq)',
        ai: false,
        text: 'Yes, Wednesday at 10 works. Can you send the kW cost breakdown first?',
      },
      {
        at: 15,
        who: 'Hassan · SolarPro Desk',
        ai: true,
        text: "Done — I've locked Wednesday 10:00 AM with our survey engineer and sent your custom 12 kW PDF proposal to WhatsApp.",
      },
    ],
    whatsapp: {
      contactName: 'Hassan • SolarPro EPC',
      subtitle: 'Net-Metering & Quotes',
      outgoingMsg:
        'SolarPro Estimate: Recommended 12 kW Tier-1 Hybrid array for your LESCO tariff (~Rs 74,000/mo savings). Survey confirmed Wednesday 10:00 AM.',
      clientReply: 'Got the PDF, looks clear. See the engineer Wednesday.',
      followupMsg: 'Great — share your gate pin anytime and our engineer will call 15 mins prior.',
      attachment: {
        name: 'SolarPro_12kW_Proposal.pdf',
        meta: '12 kW Sizing • ROI & Net-Metering Spec',
      },
    },
    outcomes: [
      'Sizes solar kW capacity from utility units in seconds',
      'Dispatches branded PDF proposals directly to WhatsApp',
      'Books site engineers without losing warm leads overnight',
    ],
  },

  hr: {
    id: 'hr',
    label: 'HR & Recruitment',
    shortRole: 'Screening & CV Intake',
    icon: Briefcase,
    agentName: 'Maya',
    agentTitle: 'Talent Screening Coordinator',
    channelNote: 'Automated Candidate Flow',
    hasRealAudio: false,
    slotSummary: 'Tomorrow · 11:00 AM · Recruiter Screening Confirmed',
    slotSub: 'Senior Accountant Role • CV & 30-Day Notice Captured',
    milestoneBookLabel: '0:19 · Screen Lock',
    script: [
      {
        at: 0,
        who: 'Candidate (Bilal)',
        ai: false,
        text: "I'm calling about the Senior Accountant opening. Are you still shortlisting candidates this week?",
      },
      {
        at: 5,
        who: 'Maya · Talent Desk',
        ai: true,
        text: 'Yes, the role is open. To save time before our recruiter call, what is your current notice period and are you comfortable working on-site in Dubai?',
      },
      {
        at: 11,
        who: 'Candidate (Bilal)',
        ai: false,
        text: "30 days notice, and I'm already based in Business Bay so on-site is easy.",
      },
      {
        at: 15,
        who: 'Maya · Talent Desk',
        ai: true,
        text: "Perfect — I've booked your 15-minute recruiter screen for tomorrow at 11:00 AM and texted you a WhatsApp link to drop your CV.",
      },
    ],
    whatsapp: {
      contactName: 'Maya • Talent Desk',
      subtitle: 'Candidate Coordination',
      outgoingMsg:
        'Hi Bilal — your screening call for Senior Accountant is booked for tomorrow at 11:00 AM. Please reply with your updated CV PDF and confirm your 30-day notice period.',
      clientReply: 'Uploaded my CV below — 30 days notice confirmed.',
      followupMsg: 'Received and attached to your recruiter scorecard. Speak tomorrow at 11:00 AM.',
      attachment: {
        name: 'Bilal_Ahmed_Senior_Accountant_CV.pdf',
        meta: '30 Days Notice • Business Bay',
      },
    },
    outcomes: [
      'Pre-qualifies location, salary expectations & notice period automatically',
      'Books qualified candidates directly onto recruiter calendars',
      'Collects CVs & documents in WhatsApp before the interview',
    ],
  },

  custom: {
    id: 'custom',
    label: 'Custom Workflows',
    shortRole: 'Booking & Dispatch',
    icon: Workflow,
    agentName: 'Zed',
    agentTitle: 'Multi-Turn Operations Coordinator',
    channelNote: 'Custom API & Dispatch Flow',
    hasRealAudio: false,
    slotSummary: 'Tuesday · 2:00 PM · Inspection Dispatch #ZL-408',
    slotSub: 'Written to ERP + Field Crew Notified via WhatsApp',
    milestoneBookLabel: '0:19 · Slot Match',
    script: [
      {
        at: 0,
        who: 'Client (Nadia)',
        ai: false,
        text: 'We have three commercial HVAC units tripping in Al Quoz Warehouse 4. Can someone inspect before Thursday?',
      },
      {
        at: 5,
        who: 'Zed · Dispatch Desk',
        ai: true,
        text: 'I see an open crew slot tomorrow (Tuesday) at 2:00 PM or Wednesday at 9:30 AM. Do both fit your warehouse access hours?',
      },
      {
        at: 11,
        who: 'Client (Nadia)',
        ai: false,
        text: 'Tuesday 2:00 PM is ideal. Do you need a gate pass ahead of time?',
      },
      {
        at: 15,
        who: 'Zed · Dispatch Desk',
        ai: true,
        text: "Yes please — I've locked Tuesday 2:00 PM under ticket #ZL-408 and sent a WhatsApp thread where you can drop the pin and gate pass.",
      },
    ],
    whatsapp: {
      contactName: 'Zed • Dispatch Desk',
      subtitle: 'Live Service Operations',
      outgoingMsg:
        'Ticket #ZL-408 is locked for Tuesday 2:00 PM (Al Quoz Warehouse 4). Reply with your WhatsApp location pin and security gate pass so Crew B checks straight in.',
      clientReply: 'Location pin & gate pass attached.',
      followupMsg: 'Logged into dispatch. Crew ETA updates will stream here 20 mins before arrival.',
      locationTag: 'Pinned: Al Quoz Industrial 4 • Gate B',
    },
    outcomes: [
      'Tailored strictly around how your business takes jobs and quotes',
      'Collects location pins, photos, or approvals inside WhatsApp',
      'Syncs cleanly into your internal portals, CRM, or ERP via API',
    ],
  },
};

const INDUSTRY_ORDER: IndustryKey[] = ['dental', 'solar', 'hr', 'custom'];

export default function VoiceSimulationSection() {
  const [activeKey, setActiveKey] = useState<IndustryKey>('dental');
  const [playing, setPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [audioDuration, setAudioDuration] = useState(28);
  const [audioAvailable, setAudioAvailable] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const current = INDUSTRIES[activeKey];
  const durationSec = current.hasRealAudio && audioAvailable ? audioDuration : 28;

  // Listen to global Hero events ("Hear a sample call" & "WhatsApp" tag)
  useEffect(() => {
    const onPlayClinic = () => {
      setActiveKey('dental');
      setCurrentSec(0.1);
      setPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {
            // Audio missing or blocked -> visual timeline continues smoothly
            setAudioAvailable(false);
          });
        }
      }, 60);
    };

    const onFocusWhatsapp = () => {
      setActiveKey('dental');
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
  }, []);

  // Playback loop: real <audio> sync for Dental when available, visual progress timer otherwise
  useEffect(() => {
    if (!playing) return;

    const useNativeAudio = current.hasRealAudio && audioAvailable && audioRef.current && !audioRef.current.error;
    if (useNativeAudio) {
      // Wait for timeupdate & fallback tick safety check if audio file hasn't started advancing
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

    // For Solar, HR, Custom (and fallback if /audio/clinic-demo.mp3 is not present yet)
    // Smooth snappy cadence without synthetic audio
    const step = current.hasRealAudio ? 0.12 : 0.32;
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
  }, [playing, current.hasRealAudio, audioAvailable, durationSec]);

  const handleSelectIndustry = (key: IndustryKey) => {
    setActiveKey(key);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (key === 'dental') {
      // Dental waits cleanly or starts on user click / Hero CTA
      setCurrentSec(0);
      setPlaying(false);
    } else {
      // Solar, HR, Custom immediately trigger smooth interactive chat & WhatsApp progression without synthetic audio
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
      if (current.hasRealAudio && audioRef.current) {
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
    if (current.hasRealAudio && audioRef.current) {
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

  // Scale script thresholds cleanly if Dental mp3 has custom duration
  const timeScale = durationSec > 0 ? durationSec / 28 : 1;
  const started = currentSec > 0 || playing;

  const visibleTurns = started
    ? current.script.filter((turn) => turn.at * timeScale <= currentSec)
    : [];

  let activeSpeaker: 0 | 1 | 2 = 0;
  for (let i = 0; i < current.script.length; i++) {
    if (current.script[i].at * timeScale <= currentSec) {
      activeSpeaker = current.script[i].ai ? 2 : 1;
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
      className="relative w-full bg-[#eceff3] text-[#0b0d12] py-20 sm:py-28 px-5 sm:px-8 scroll-mt-20 overflow-hidden"
    >
      {/* Compatibility anchors */}
      <div id="how-it-works" className="scroll-mt-20 pointer-events-none" />
      <div id="voice" className="scroll-mt-20 pointer-events-none" />
      <div id="voice-demo" className="scroll-mt-20 pointer-events-none" />
      <div id="industries" className="scroll-mt-20 pointer-events-none" />

      {/* Subtle architectural ambient glow on #eceff3 canvas */}
      <div
        className="pointer-events-none absolute -top-32 right-0 w-[560px] h-[560px] rounded-full blur-3xl opacity-60"
        style={{
          background:
            'radial-gradient(circle, rgba(6,120,143,0.10) 0%, rgba(90,63,209,0.07) 48%, transparent 72%)',
        }}
      />

      {/* Hidden native audio element connected cleanly to Dental tab */}
      <audio
        ref={audioRef}
        src="/audio/clinic-demo.mp3"
        preload="metadata"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (d && !Number.isNaN(d) && Number.isFinite(d)) {
            setAudioDuration(d);
            setAudioAvailable(true);
          }
        }}
        onTimeUpdate={(e) => {
          if (current.hasRealAudio && playing) {
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
            <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase text-[#06788f] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#06788f]" />
              <span>01 — Voice &amp; WhatsApp Simulation</span>
            </div>

            <h2
              className="mt-4 font-serif-instrument font-normal text-[#0b0d12] tracking-[-0.02em] leading-[1.02]"
              style={{ fontSize: 'clamp(38px, 5vw, 72px)' }}
            >
              From the first ring to a{' '}
              <span className="italic text-[#5a3fd1]">confirmed booking.</span>
            </h2>
          </div>

          <p className="max-w-[400px] text-[15.5px] sm:text-base leading-[1.6] text-[#475060]">
            Choose your industry below. Watch how inbound calls, WhatsApp messages, and live calendar bookings finish without adding front-desk staff.
          </p>
        </div>

        {/* Consolidated 4-Industry Tab Strip */}
        <div
          role="tablist"
          aria-label="Choose your industry"
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          {INDUSTRY_ORDER.map((key) => {
            const ind = INDUSTRIES[key];
            const Icon = ind.icon;
            const active = activeKey === key;

            return (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => handleSelectIndustry(key)}
                style={
                  active
                    ? { boxShadow: '0 0 24px rgba(6, 120, 143, 0.35)' }
                    : undefined
                }
                className={`zl-btn inline-flex items-center gap-2.5 min-h-[46px] px-5 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-white border-[#06788f] text-[#06788f]'
                    : 'bg-white/65 border-[#0b0d12]/15 text-[#475060] hover:bg-white hover:text-[#0b0d12] hover:border-[#0b0d12]/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#06788f]' : 'text-[#475060]'}`} />
                <span>{ind.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Theatre: Anchored Dark Voice Console + Angled 3D WhatsApp Device */}
        <div className="mt-9 grid grid-cols-1 lg:grid-cols-12 items-start gap-8 lg:gap-0">
          
          {/* LEFT: Anchored Obsidian Voice Console (8 cols) */}
          <div className="lg:col-span-8 relative z-10 rounded-[28px] border border-[#0b0d12]/15 bg-[#0d1016] text-[#eceef2] shadow-[0_36px_90px_rgba(15,23,42,0.22)] overflow-hidden">
            
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
                    <span>{current.agentTitle}</span>
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
                  0:00 &middot; Call
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
                  {current.milestoneBookLabel}
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
                    {current.agentName} picks up the call, checks your calendar, and triggers the WhatsApp confirmation.
                  </p>
                </div>
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {visibleTurns.map((turn, idx) => (
                      <motion.div
                        key={`${activeKey}-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className={`flex ${turn.ai ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-3 text-[13.5px] sm:text-[14.5px] leading-[1.5] border ${
                            turn.ai
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
                          {current.slotSummary}
                        </div>
                        <div className="text-xs text-[#c9ced8] mt-0.5">
                          {current.slotSub}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Angled 3D Metallic Phone Mockup (4 cols overlapping smoothly on desktop) */}
          <div className="lg:col-span-4 relative z-20 flex justify-center lg:justify-start lg:-ml-12 lg:mt-10">
            <motion.div
              key={activeKey}
              initial={{ opacity: 0.7, y: 12, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              whileHover={{ rotate: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[335px] rounded-[42px] p-3 transition-shadow"
              style={{
                background: 'linear-gradient(145deg, #d7dce5 0%, #868f9f 52%, #4a5260 100%)',
                boxShadow:
                  '0 40px 85px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(10, 14, 22, 0.16)',
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
                        {current.whatsapp.contactName}
                      </div>
                      <div className="text-[#8696a0] text-[11px] truncate">
                        {current.whatsapp.subtitle}
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
                        <p>{current.whatsapp.outgoingMsg}</p>

                        {/* Optional Attachment Chip */}
                        {current.whatsapp.attachment && (
                          <div className="mt-2.5 p-2 rounded-xl bg-black/25 border border-white/10 flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#5ee3ff]/15 text-[#5ee3ff] flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11.5px] font-medium text-white truncate">
                                {current.whatsapp.attachment.name}
                              </div>
                              <div className="text-[10px] text-[#8696a0] truncate">
                                {current.whatsapp.attachment.meta}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Optional Location Pin */}
                        {current.whatsapp.locationTag && (
                          <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-[11px] text-emerald-300">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{current.whatsapp.locationTag}</span>
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
                            {current.whatsapp.clientReply}
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="self-start max-w-[88%] p-3 rounded-[14px_14px_14px_4px] bg-[#202c33] text-[#e9edef] text-[13px] leading-[1.45]"
                          >
                            {current.whatsapp.followupMsg}
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

        {/* Concise 3-Outcome Business Value Strip (Zero Repetition) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {current.outcomes.map((outcome, idx) => (
            <div
              key={`${activeKey}-out-${idx}`}
              className="zl-card flex items-start gap-3 px-5 py-4 rounded-2xl bg-white/80 border border-[#0b0d12]/10 shadow-xs"
            >
              <span className="mt-0.5 w-6 h-6 rounded-full bg-[#06788f]/12 text-[#06788f] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-medium text-[#0b0d12] leading-snug">
                {outcome}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
