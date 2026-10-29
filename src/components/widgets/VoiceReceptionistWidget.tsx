"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";

interface VoiceReceptionistWidgetProps {
  content?: any;
}

const FIRST_GREETING_MESSAGE =
  "Hello! I'm Zara from Zavian Labs. I'd love to know who I'm speaking with today?";

const VoiceReceptionistInner: React.FC = () => {
  const [callState, setCallState] = useState<"idle" | "ringing" | "connected">("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const ringAudioRef = useRef<AudioContext | null>(null);
  const ringTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const connectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const conversation = useConversation({
    onError: (err) => {
      console.error("Zara voice error:", err);
      handleEndCall();
    },
  });

  // Ensure any remote audio track from ElevenLabs / WebRTC plays cleanly through speakers
  useEffect(() => {
    if (typeof document === "undefined") return;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLAudioElement) {
            node.autoplay = true;
            node.playsInline = true;
            node.play().catch(() => {});
          }
        });
      });
    });
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, []);

  // Pre-load speech voices for instant fallback playback
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const onVoices = () => window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = onVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  // Synthesize realistic PBX ringing
  const startRingingSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      ringAudioRef.current = ctx;

      const playRingBurst = (delay: number) => {
        const timeoutId = setTimeout(() => {
          if (!ctx || ctx.state === "closed") return;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.frequency.value = 400;
          osc2.frequency.value = 450;
          osc1.type = "sine";
          osc2.type = "sine";

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.4);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.45);

          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.6);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.0);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.05);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(ctx.currentTime);
          osc2.start(ctx.currentTime);
          osc1.stop(ctx.currentTime + 1.1);
          osc2.stop(ctx.currentTime + 1.1);
        }, delay);

        ringTimeoutsRef.current.push(timeoutId);
      };

      // 3 distinct rings: at 0s, 1.5s, and 3.0s
      playRingBurst(0);
      playRingBurst(1500);
      playRingBurst(3000);
    } catch (e) {
      console.warn("AudioContext tone blocked:", e);
    }
  };

  const stopRingingSound = () => {
    ringTimeoutsRef.current.forEach(clearTimeout);
    ringTimeoutsRef.current = [];
    if (ringAudioRef.current) {
      try {
        ringAudioRef.current.close().catch(() => {});
      } catch {}
      ringAudioRef.current = null;
    }
  };

  // Timer: Runs ONLY when connected
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopRingingSound();
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
    };
  }, []);

  const playGreetingAudio = () => {
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    if (conversation.status === "connected") {
      try {
        conversation.setVolume({ volume: 1 });
      } catch {}
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(FIRST_GREETING_MESSAGE);
        const voices = window.speechSynthesis.getVoices();
        const preferred =
          voices.find(
            (v) =>
              v.lang === "en-GB" ||
              v.name.includes("UK") ||
              v.name.includes("British") ||
              v.name.includes("English United Kingdom")
          ) || voices.find((v) => v.lang.startsWith("en"));
        if (preferred) utterance.voice = preferred;
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  };

  const handleStartCall = async () => {
    setCallState("ringing");
    setCallDuration(0);

    // Pre-unlock audio element within user gesture
    if (remoteAudioRef.current) {
      remoteAudioRef.current.play().catch(() => {});
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      const prime = new SpeechSynthesisUtterance("");
      prime.volume = 0;
      window.speechSynthesis.speak(prime);
    }

    startRingingSound();

    try {
      // Connect in background if valid ElevenLabs agent ID is configured
      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
      if (agentId && agentId !== "your_agent_id_here") {
        conversation
          .startSession({
            agentId,
            volume: 0,
            overrides: {
              agent: {
                firstMessage: FIRST_GREETING_MESSAGE,
              },
            },
          })
          .catch((err) => {
            console.warn("ElevenLabs session error:", err);
          });
      }

      // Force 3 full rings (4.2 seconds) before flipping UI to connected
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = setTimeout(() => {
        stopRingingSound();
        setCallState("connected");
        setCallDuration(1);
        playGreetingAudio();
      }, 4200);
    } catch (err) {
      console.error("Connection failed:", err);
      handleEndCall();
    }
  };

  const handleEndCall = async () => {
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
    stopRingingSound();
    setCallState("idle");
    setCallDuration(0);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch {}
    }

    try {
      await conversation.endSession();
    } catch (e) {}
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Explicit Audio Element to guarantee speaker playback */}
      <audio
        ref={remoteAudioRef}
        autoPlay
        playsInline
        aria-hidden="true"
        className="hidden"
      />

      {/* 1. CONNECTED STATE */}
      {callState === "connected" && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#12151E]/95 border border-[#8B5CF6]/50 shadow-[0_0_25px_rgba(139,92,246,0.35)] backdrop-blur-xl transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-wide">Zara</span>
            <span className="text-xs font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {formatTimer(callDuration)}
            </span>
          </div>

          <div className="flex items-center gap-0.5 px-1.5 h-4">
            <span className="w-0.5 h-3 bg-[#FF6B00] animate-pulse rounded-full" />
            <span className="w-0.5 h-4 bg-[#FF6B00] animate-bounce rounded-full" />
            <span className="w-0.5 h-2 bg-[#FF6B00] animate-pulse rounded-full" />
          </div>

          <button
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              try {
                conversation.setVolume({ volume: nextMuted ? 0 : 1 });
              } catch {}
              if (typeof window !== "undefined" && "speechSynthesis" in window) {
                if (nextMuted) window.speechSynthesis.pause();
                else window.speechSynthesis.resume();
              }
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleEndCall}
            className="p-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] cursor-pointer"
            title="End Call"
            aria-label="Hang up call"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. RINGING STATE (Devmate style: Exactly 3 rings) */}
      {callState === "ringing" && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#12151E]/95 border border-[#FF6B00]/50 shadow-[0_0_25px_rgba(255,107,0,0.35)] backdrop-blur-xl transition-all">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B00]" />
            </span>
            <span className="text-xs font-mono font-medium text-slate-200">
              Ringing...
            </span>
          </div>

          <button
            onClick={handleEndCall}
            className="p-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
            title="Cancel Call"
            aria-label="Cancel call"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. IDLE STATE */}
      {callState === "idle" && (
        <button
          onClick={handleStartCall}
          className="group flex items-center gap-3.5 pl-4 pr-2.5 py-2.5 rounded-full bg-[#12151E]/90 hover:bg-[#12151E] border border-white/10 hover:border-[#8B5CF6]/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] backdrop-blur-xl transition-all duration-300 cursor-pointer"
        >
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-tight">Talk to Zara</span>
              <span className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FF6B00]/20 border border-[#FF6B00]/40 text-[#FF6B00]">
                LIVE
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-tight">
              AI Voice Receptionist
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#8B5CF6] group-hover:bg-[#7C3AED] flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-transform duration-200 group-hover:scale-105">
            <Mic className="w-4 h-4" />
          </div>
        </button>
      )}
    </div>
  );
};

export const VoiceReceptionistWidget: React.FC<VoiceReceptionistWidgetProps> = () => {
  return (
    <ConversationProvider>
      <VoiceReceptionistInner />
    </ConversationProvider>
  );
};

export default VoiceReceptionistWidget;
