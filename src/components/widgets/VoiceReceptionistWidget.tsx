"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, PhoneOff, Volume2, VolumeX, X } from "lucide-react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { soundFX } from "@/lib/audio";

interface VoiceReceptionistWidgetProps {
  content?: any;
}

const FIRST_GREETING_MESSAGE = 
  "Hello! I'm Zara from Zavian Labs. I'd love to know who I'm speaking with today?";

const VoiceReceptionistInner: React.FC = () => {
  // Call States:
  // isRinging = true strictly during the 4.5s (3-ring) connecting phase
  // isCallActive = true strictly after pickup, when call is connected
  const [isRinging, setIsRinging] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const pickupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  const showToast = (msg: string) => {
    setErrorMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setErrorMessage(null);
    }, 4500);
  };

  const stopRingingSound = () => {
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch {}
      audioContextRef.current = null;
    }
  };

  // Pre-load voices for SpeechSynthesis on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = onVoicesChanged;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  // Ensure any remote audio element attached to DOM by WebRTC/LiveKit is unlocked and unmuted
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

    return () => {
      observer.disconnect();
    };
  }, []);

  // Synthesize exact 3-ring telephone cadence (3 bursts: 0.0s, 1.5s, 3.0s over 4.5s)
  const play3RingBursts = (ctx: AudioContext) => {
    try {
      const bursts = [0, 1.5, 3.0];
      bursts.forEach((startTime) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Standard PBX dual tones (400Hz + 450Hz)
        osc1.frequency.value = 400;
        osc2.frequency.value = 450;
        osc1.type = "sine";
        osc2.type = "sine";

        const t = ctx.currentTime + startTime;
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(0.12, t + 0.05);
        gainNode.gain.setValueAtTime(0.12, t + 0.85);
        gainNode.gain.linearRampToValueAtTime(0, t + 0.9);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.95);
        osc2.stop(t + 0.95);
      });
    } catch (e) {
      console.warn("AudioContext tone blocked or unavailable:", e);
    }
  };

  // Play Zara's greeting out loud through device speakers
  const playZaraGreetingSpeech = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            v.lang === "en-GB" ||
            v.name.includes("UK") ||
            v.name.includes("British") ||
            v.name.includes("English United Kingdom")
        ) || voices.find((v) => v.lang.startsWith("en"));
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      }, 60);
    } catch (e) {
      console.warn("Speech synthesis playback error:", e);
    }
  };

  const conversation = useConversation({
    onConnect: () => {
      // Live WebRTC connected silently in background.
      // We do NOT change UI yet; the 4.5-second 3-ring timeout governs the pickup transition.
      console.log("ElevenLabs WebRTC connected in background");
    },
    onDisconnect: () => {
      handleEndCall();
    },
    onError: (err) => {
      console.error("Zara voice engine error:", err);
      const str = typeof err === "string" ? err : err?.message || "";
      if (
        str.toLowerCase().includes("permission") ||
        str.toLowerCase().includes("notallowed") ||
        str.toLowerCase().includes("microphone")
      ) {
        showToast("Please allow microphone access to talk to Zara");
        handleEndCall();
      }
    },
  });

  // Active call duration timer (starts strictly at 00:01 post-pickup)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCallActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRingingSound();
      if (pickupTimeoutRef.current) clearTimeout(pickupTimeoutRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
    };
  }, []);

  const handleStartCall = async () => {
    isCancelledRef.current = false;

    // 1. Explicitly request microphone access first
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        showToast("Please allow microphone access to talk to Zara");
        return;
      }
    } else {
      showToast("Please allow microphone access to talk to Zara");
      return;
    }

    // 2. Unlock HTMLAudioElement and Web Audio / Speech engines within user click gesture
    if (remoteAudioRef.current) {
      remoteAudioRef.current.play().catch(() => {});
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      const dummyUtterance = new SpeechSynthesisUtterance("");
      dummyUtterance.volume = 0;
      window.speechSynthesis.speak(dummyUtterance);
    }

    // 3. Initialize AudioContext and trigger exact 3-ring bursts
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      if (ctx.state === "suspended") {
        await ctx.resume().catch(() => {});
      }
      play3RingBursts(ctx);
    }

    // 4. Enter Ringing Phase (do NOT show connected or start timer yet)
    setIsRinging(true);
    setIsCallActive(false);
    setCallDuration(0);

    // 5. Connect ElevenLabs WebRTC session silently in background during ringing
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    if (agentId && agentId !== "your_agent_id_here") {
      try {
        // Start session with muted volume so agent speech doesn't overlap the 3 rings
        await conversation.startSession({
          agentId,
          volume: 0,
          overrides: {
            agent: {
              firstMessage: FIRST_GREETING_MESSAGE,
            },
          },
        });
      } catch (err) {
        console.warn("ElevenLabs session error during background connect:", err);
      }
    }

    // 6. Enforce exact 4.5-second sequence before pickup (3 full rings complete)
    if (pickupTimeoutRef.current) clearTimeout(pickupTimeoutRef.current);
    pickupTimeoutRef.current = setTimeout(() => {
      if (isCancelledRef.current) return;

      // Ringing completes: fade out ring sound
      stopRingingSound();
      setIsRinging(false);
      setIsCallActive(true);

      // Start live call timer strictly at 00:01
      setCallDuration(1);

      // Play audio pickup chime
      soundFX.playActivate();

      // Trigger Zara's greeting out of device speakers
      if (conversation.status === "connected") {
        // Unmute ElevenLabs audio stream for speaker playback
        conversation.setVolume({ volume: 1 });
      } else {
        // Fallback demo speech synthesis
        playZaraGreetingSpeech(FIRST_GREETING_MESSAGE);
      }
    }, 4500);
  };

  const handleEndCall = async () => {
    isCancelledRef.current = true;
    if (pickupTimeoutRef.current) {
      clearTimeout(pickupTimeoutRef.current);
      pickupTimeoutRef.current = null;
    }
    stopRingingSound();
    setIsRinging(false);
    setIsCallActive(false);
    setCallDuration(0);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch {}
    }

    try {
      await conversation.endSession();
    } catch {}
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <aside aria-label="Voice Receptionist" className="fixed bottom-6 right-6 z-50 select-none">
      {/* Explicit Audio Element to guarantee speaker playback */}
      <audio
        ref={remoteAudioRef}
        autoPlay
        playsInline
        aria-hidden="true"
        className="hidden"
      />

      {/* Permission / Error Toast */}
      {errorMessage && (
        <div
          role="alert"
          className="absolute bottom-16 right-0 mb-1 w-72 px-3.5 py-2.5 rounded-2xl bg-[#12151E] border border-red-500/50 text-red-300 text-xs font-medium shadow-[0_0_25px_rgba(239,68,68,0.35)] flex items-center justify-between gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-ping" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-slate-400 hover:text-white shrink-0 p-0.5 cursor-pointer"
            aria-label="Dismiss error"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. CONNECTED STATE (Active strictly post-pickup, timer starts at 00:01) */}
      {isCallActive && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#12151E]/95 border border-white/10 shadow-[0_0_25px_rgba(139,92,246,0.3)] backdrop-blur-xl transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-wide">Zara</span>
            <span className="text-xs font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {formatTimer(callDuration)}
            </span>
          </div>

          {/* Animated 4-bar sound wave in Electric Orange (#FF6B00) */}
          <div className="flex items-center gap-0.5 px-1.5 h-4">
            <span className="w-0.5 h-3 bg-[#FF6B00] animate-pulse rounded-full" />
            <span className="w-0.5 h-4 bg-[#FF6B00] animate-bounce rounded-full" />
            <span className="w-0.5 h-2 bg-[#FF6B00] animate-pulse rounded-full" />
            <span className="w-0.5 h-3.5 bg-[#FF6B00] animate-bounce rounded-full" />
          </div>

          {/* Mute Audio Output Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              try {
                conversation.setVolume({ volume: nextMuted ? 0 : 1 });
              } catch {}
              if (typeof window !== "undefined" && "speechSynthesis" in window) {
                if (nextMuted) {
                  window.speechSynthesis.pause();
                } else {
                  window.speechSynthesis.resume();
                }
              }
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Red Hangup Button */}
          <button
            type="button"
            onClick={handleEndCall}
            className="p-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] cursor-pointer"
            title="End Call"
            aria-label="Hang up call"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. RINGING STATE (Active strictly during the 4.5s 3-ring sequence) */}
      {isRinging && !isCallActive && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#12151E]/95 border border-white/10 shadow-[0_0_25px_rgba(255,107,0,0.3)] backdrop-blur-xl transition-all">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B00]" />
            </span>
            <span className="text-xs font-mono font-medium text-slate-200 tracking-wide">
              • Connecting to Zara...
            </span>
          </div>

          <button
            type="button"
            onClick={handleEndCall}
            className="p-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
            title="Cancel Call"
            aria-label="Cancel connecting call"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. IDLE LAUNCHER (Standard State) */}
      {!isCallActive && !isRinging && (
        <button
          type="button"
          onClick={handleStartCall}
          className="group flex items-center gap-3.5 pl-4 pr-2.5 py-2.5 rounded-full bg-[#12151E]/95 hover:bg-[#12151E] border border-white/10 hover:border-[#8B5CF6]/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] backdrop-blur-xl transition-all duration-300 cursor-pointer"
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
    </aside>
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
