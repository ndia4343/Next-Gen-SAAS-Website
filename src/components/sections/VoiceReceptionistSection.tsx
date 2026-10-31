'use client';

import { useState, useRef, useEffect } from 'react';

interface Scenario {
  id: string;
  tag: string;
  callerName: string;
  callerText: string;
  agentReply: string;
  outcome: string;
  audioSrc: string;
  duration: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'dental',
    tag: 'Dental Clinic Intake',
    callerName: 'Sarah M.',
    callerText: 'Hi, I need to schedule a consultation for Invisalign this Thursday.',
    agentReply: 'I can help with that. Dr. Vance has an opening at 11:30 AM this Thursday. Shall I lock that in?',
    outcome: 'Slot Reserved: Thu 11:30 AM',
    audioSrc: '/audio/dental-demo.mp3',
    duration: 22,
  },
  {
    id: 'solar',
    tag: 'Solar & Roofing Inbound',
    callerName: 'David K.',
    callerText: 'Hello, looking for an estimate on a 10kW residential net-metering system.',
    agentReply: 'Great. Let me pull up your area tariffs. Can you confirm your current monthly bill bracket?',
    outcome: 'Lead Qualified & Dispatched',
    audioSrc: '/audio/solar-demo.mp3',
    duration: 26,
  },
  {
    id: 'emergency',
    tag: 'Emergency Plumbing Dispatch',
    callerName: 'Michael R.',
    callerText: 'I have a burst pipe in my basement flooding the floor right now.',
    agentReply: 'Understood. Shut off your main water valve immediately. Dispatching our on-call tech to your address now.',
    outcome: 'Emergency Ticket Dispatched',
    audioSrc: '/audio/emergency-demo.mp3',
    duration: 18,
  },
];

interface VoiceReceptionistSectionProps {
  onBookCall?: () => void;
}

export function VoiceReceptionistSection({ onBookCall }: VoiceReceptionistSectionProps = {}) {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [isCalling, setIsCalling] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Call timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isCalling) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const toggleCall = () => {
    if (!audioRef.current) return;

    if (isCalling) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsCalling(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsCalling(true);
    }
  };

  const handleScenarioChange = (s: Scenario) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsCalling(false);
    setActiveScenario(s);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <section id="voice-demo" className="relative z-10 py-24 bg-transparent text-neutral-900 dark:text-white scroll-mt-28">
      <audio
        ref={audioRef}
        src={activeScenario.audioSrc}
        onEnded={() => setIsCalling(false)}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-cyan-400 text-xs font-mono mb-4">
            ● LIVE INTERACTIVE PROOF
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Your front desk,{' '}
            <span className="bg-gradient-to-r from-violet-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
              running 24/7.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Test the live agent below. Switch industries to hear how it greets callers, handles objections, and schedules appointments in real-time.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Outcome Pillars */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/40 backdrop-blur-sm shadow-sm">
              <h3 className="font-semibold text-neutral-950 dark:text-neutral-100 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                Zero Phone Menus
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Callers speak naturally in complete sentences. They can interrupt anytime without confusing the agent.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/40 backdrop-blur-sm shadow-sm">
              <h3 className="font-semibold text-neutral-950 dark:text-neutral-100 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                Business Playbook Accuracy
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Trained on your real pricing tables, services, and operational hours. Never invents facts.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/40 backdrop-blur-sm shadow-sm">
              <h3 className="font-semibold text-neutral-950 dark:text-neutral-100 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Direct Calendar Booking
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Checks live availability and locks appointments straight into Google Calendar or your CRM.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/40 backdrop-blur-sm shadow-sm">
              <h3 className="font-semibold text-neutral-950 dark:text-neutral-100 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                Instant WhatsApp & Email Summary
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Sends an audio recording + transcript brief to your team and a booking confirmation to the caller.
              </p>
            </div>
          </div>

          {/* Right Column: Devmate-Style Calling Handset Mockup */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md rounded-[2.5rem] p-4 bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-300 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950 shadow-2xl border border-white/60 dark:border-neutral-700/50">
              
              {/* Screen Glass */}
              <div className="rounded-[2rem] bg-white dark:bg-[#0c0d14] p-6 border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col justify-between min-h-[540px] shadow-inner transition-colors">
                
                {/* Industry Tabs */}
                <div className="flex gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  {SCENARIOS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleScenarioChange(s)}
                      className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                        activeScenario.id === s.id
                          ? 'bg-white dark:bg-neutral-800 text-violet-700 dark:text-cyan-400 shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                      }`}
                    >
                      {s.tag.split(' ')[0]}
                    </button>
                  ))}
                </div>

                {/* Call Header / Status */}
                <div className="text-center mt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-cyan-300 text-xs font-mono font-medium">
                    <span className={`w-2 h-2 rounded-full ${isCalling ? 'bg-emerald-500 animate-ping' : 'bg-neutral-400'}`} />
                    {isCalling ? `LIVE CALL IN PROGRESS · ${formatTime(seconds)}` : 'READY TO TEST'}
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-neutral-900 dark:text-white">
                    Zara — AI Receptionist
                  </h4>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">{activeScenario.tag}</p>
                </div>

                {/* Central Glowing AI Orb & Audio Pulse */}
                <div className="flex flex-col items-center justify-center my-6">
                  <div className={`relative flex items-center justify-center w-28 h-28 rounded-full transition-all duration-700 ${
                    isCalling 
                      ? 'scale-110 shadow-[0_0_50px_rgba(139,92,246,0.35)]' 
                      : 'scale-100 opacity-80'
                  }`}>
                    {/* Orb Gradient */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600 via-sky-400 to-cyan-300 animate-spin-slow opacity-80 blur-[2px]" />
                    <div className="absolute inset-1 rounded-full bg-white dark:bg-neutral-950 flex items-center justify-center">
                      {/* Pulse Bars inside Orb */}
                      <div className="flex items-center gap-1">
                        {[40, 75, 50, 90, 60].map((h, idx) => (
                          <span
                            key={idx}
                            className={`w-1 rounded-full transition-all duration-200 ${
                              isCalling ? 'bg-cyan-400 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-700'
                            }`}
                            style={{ height: isCalling ? `${h * 0.4}px` : '10px' }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Conversation Transcript Bubbles */}
                <div className="space-y-3 mb-6 font-sans">
                  {/* Caller Bubble */}
                  <div className="p-3 rounded-2xl rounded-tl-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
                    <strong className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                      {activeScenario.callerName} (Caller)
                    </strong>
                    "{activeScenario.callerText}"
                  </div>

                  {/* AI Agent Bubble */}
                  <div className="p-3 rounded-2xl rounded-tr-sm bg-violet-50/80 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-900/50 text-xs text-violet-950 dark:text-cyan-200">
                    <strong className="block text-[10px] text-violet-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                      Zara (AI Agent)
                    </strong>
                    "{activeScenario.agentReply}"
                  </div>
                </div>

                {/* Handset Controls Tray */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {activeScenario.outcome}
                  </div>

                  {/* Call / End Button */}
                  <button
                    onClick={toggleCall}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-lg active:scale-95 cursor-pointer ${
                      isCalling
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30'
                    }`}
                  >
                    <span>{isCalling ? 'End Demo Call' : '▶ Simulate Call'}</span>
                  </button>
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