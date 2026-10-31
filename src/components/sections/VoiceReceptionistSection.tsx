'use client';

import { useState, useRef } from 'react';

interface Scenario {
  id: string;
  label: string;
  caller: string;
  intent: string;
  durationLabel: string;
  slot: string;
  audioSrc: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'dental',
    label: 'Dental Intake',
    caller: 'Sarah M.',
    intent: 'Invisalign Consultation',
    durationLabel: '00:24',
    slot: 'Thu, Nov 12 @ 11:30 AM',
    audioSrc: '/audio/dental-demo.mp3',
  },
  {
    id: 'solar',
    label: 'Solar Survey',
    caller: 'David K.',
    intent: '10kW Net Metering Inquiry',
    durationLabel: '00:28',
    slot: 'Fri, Nov 13 @ 2:00 PM',
    audioSrc: '/audio/solar-demo.mp3',
  },
  {
    id: 'emergency',
    label: 'Emergency Dispatch',
    caller: 'Michael R.',
    intent: 'Burst Pipe Urgent Service',
    durationLabel: '00:19',
    slot: 'Dispatched to On-Call Tech',
    audioSrc: '/audio/emergency-demo.mp3',
  },
];

interface VoiceReceptionistSectionProps {
  onBookCall?: () => void;
}

export function VoiceReceptionistSection({ onBookCall }: VoiceReceptionistSectionProps = {}) {
  const [activeTab, setActiveTab] = useState<Scenario>(SCENARIOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Switch tabs cleanly: pause previous track, reset timeline, load new audio
  const handleTabChange = (scenario: Scenario) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioError(false);
    setActiveTab(scenario);
  };

  // Play/Pause toggle with native Audio API sync
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setAudioError(false);
      audioRef.current.play().catch(() => {
        setAudioError(true);
        setIsPlaying(false);
      });
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section
      id="voice-demo"
      className="relative z-10 py-24 bg-white dark:bg-[#07070a] text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-900 scroll-mt-28"
    >
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={activeTab.audioSrc}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setAudioError(true);
          setIsPlaying(false);
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-cyan-400 text-xs font-mono mb-4">
            ● LIVE VOICE INFRASTRUCTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Your front desk,{' '}
            <span className="bg-gradient-to-r from-violet-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
              running 24/7.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
            Answers around the clock, handles customer enquiries naturally, and
            books appointments directly into your calendar.
          </p>
        </div>

        {/* 2-Column Split: Business Outcomes + Interactive Player */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: 4 Business Outcome Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40">
              <h3 className="font-semibold text-neutral-950 dark:text-neutral-100 text-sm">
                Natural Conversations
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                No robotic phone menus. Callers speak naturally, ask questions,
                and interrupt just like a normal conversation.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40">
              <h3 className="font-semibold text-neutral-950 dark:text-neutral-100 text-sm">
                Your Business Knowledge
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Configured around your services, pricing, policies, and
                frequently asked questions.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40">
              <h3 className="font-semibold text-neutral-950 dark:text-neutral-100 text-sm">
                Live Calendar Booking
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Checks availability and books appointments directly into your
                connected calendar.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40">
              <h3 className="font-semibold text-neutral-950 dark:text-neutral-100 text-sm">
                Instant Team Updates
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Call summaries, recordings, and customer confirmations delivered
                automatically.
              </p>
            </div>
          </div>

          {/* Right: Functional Audio Demo Sandbox */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl p-6 sm:p-8 bg-neutral-950 border border-neutral-800 shadow-2xl text-white">
              {/* Scenario Tabs */}
              <div className="flex flex-wrap gap-2 pb-6 border-b border-neutral-800">
                {SCENARIOS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab.id === tab.id
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Call Telemetry */}
              <div className="py-6 space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span>
                    CALLER:{' '}
                    <strong className="text-neutral-200">
                      {activeTab.caller}
                    </strong>
                  </span>
                  <span>
                    {currentTime > 0
                      ? `${Math.floor(currentTime)}s / ${activeTab.durationLabel}`
                      : `LENGTH: ${activeTab.durationLabel}`}
                  </span>
                </div>
                <div className="text-sm font-medium text-cyan-400 font-mono">
                  INTENT: {activeTab.intent}
                </div>
              </div>

              {/* Functional Waveform & Controls */}
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause sample' : 'Play sample'}
                  className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 shadow-lg shadow-violet-600/20"
                >
                  {isPlaying ? (
                    <span className="text-sm font-mono">❚❚</span>
                  ) : (
                    <span className="text-sm font-mono pl-0.5">▶</span>
                  )}
                </button>

                {/* Scannable Audio Progress Bar */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-1 h-7">
                    {[40, 70, 30, 85, 55, 90, 45, 60, 100, 75, 40, 60, 80, 50, 30, 90, 65, 45, 80, 55].map((h, i) => {
                      const barThreshold = (i / 20) * 100;
                      const isPast = progressPercent >= barThreshold;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-150 ${
                            isPlaying && isPast
                              ? 'bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                              : isPlaying
                              ? 'bg-neutral-600 animate-pulse'
                              : isPast
                              ? 'bg-violet-400'
                              : 'bg-neutral-800'
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      );
                    })}
                  </div>

                  {audioError && (
                    <p className="text-[11px] text-amber-400 font-mono">
                      Demo audio asset pending upload ({activeTab.audioSrc}).
                    </p>
                  )}
                </div>
              </div>

              {/* Honest Outcome Ledger */}
              <div className="mt-6 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                    Simulated Output:
                  </span>
                  <span className="text-emerald-400">
                    ● Calendar Slot: {activeTab.slot}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <span className="text-cyan-400">✓</span> WhatsApp Client
                  Confirmation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VoiceReceptionistSection;
