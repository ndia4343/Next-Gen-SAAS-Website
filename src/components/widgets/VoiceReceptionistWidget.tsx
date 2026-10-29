"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, PhoneOff, Volume2, VolumeX, X } from "lucide-react";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ringAudioRef = useRef<AudioContext | null>(null);
  const ringTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const cadenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Synchronization flags for Devmate-style 3-ring pickup
  const isSessionActiveRef = useRef<boolean>(false);
  const minCadenceCompleteRef = useRef<boolean>(false);

  const showToast = (msg: string) => {
    setErrorMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const conversation = useConversation({
    onConnect: () => {
      isSessionActiveRef.current = true;
      // Transition to connected ONLY if the 3-ring cadence has completed
      if (minCadenceCompleteRef.current) {
        transitionToConnected();
      }
    },
    onError: (err) => {
      console.error("[Voice Widget] Zara voice error:", err);
      handleEndCall();
      const str = typeof err === "string" ? err : err?.message || "";
      if (
        str.toLowerCase().includes("permission") ||
        str.toLowerCase().includes("notallowed") ||
        str.toLowerCase().includes("microphone")
      ) {
        showToast("Please allow microphone access to talk to Zara");
      } else {
        showToast("Voice connection interrupted. Please try again.");
      }
    },
    onDisconnect: () => {
      handleEndCall();
    },
  });

  // Ensure remote audio element dynamically attached by LiveKit/WebRTC plays through speakers
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

  // Synthesize realistic PBX telephone cadence: exactly 3 ring cycles (~4.2s total)
  // Ring 1: 0.0s – 1.0s
  // Ring 2: 1.5s – 2.5s
  // Ring 3: 3.0s – 4.0s
  const startRingingSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      ringAudioRef.current = ctx;

      const scheduleRingCycle = (delayMs: number) => {
        const timeoutId = setTimeout(() => {
          if (!ctx || ctx.state === "closed") return;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          // Standard PBX dual frequencies (400Hz + 450Hz)
          osc1.frequency.value = 400;
          osc2.frequency.value = 450;
          osc1.type = "sine";
          osc2.type = "sine";

          const t = ctx.currentTime;
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.09, t + 0.05);
          gain.gain.setValueAtTime(0.09, t + 0.95);
          gain.gain.linearRampToValueAtTime(0, t + 1.0);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(t);
          osc2.start(t);
          osc1.stop(t + 1.05);
          osc2.stop(t + 1.05);
        }, delayMs);

        ringTimeoutsRef.current.push(timeoutId);
      };

      // 3 distinct ring cycles
      scheduleRingCycle(0);
      scheduleRingCycle(1500);
      scheduleRingCycle(3000);
    } catch (e) {
      console.warn("[Voice Widget] AudioContext tone synthesis blocked:", e);
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

  const transitionToConnected = () => {
    stopRingingSound();
    setCallState("connected");
    setCallDuration(1); // Counter starts strictly at 00:01 post-pickup
    try {
      conversation.setMuted(false);
      conversation.setVolume({ volume: 1 });
    } catch {}
  };

  // Timer: Runs ONLY when connected
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopRingingSound();
      if (cadenceTimeoutRef.current) clearTimeout(cadenceTimeoutRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  const startVoiceCall = async () => {
    // 1. Environment Variable & Guardrails
    const agentId =
      process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ||
      process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

    if (!agentId || agentId === "your_agent_id_here" || agentId.trim() === "") {
      console.error("[Voice Widget] Missing Agent ID in environment variables");
      showToast("Voice assistant offline: Missing Agent ID in environment variables");
      setCallState("idle");
      return;
    }

    // 2. Audio Context & Microphone Permission Protocol
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        if (audioCtx.state === "suspended") {
          await audioCtx.resume();
        }
      }

      if (remoteAudioRef.current) {
        remoteAudioRef.current.play().catch(() => {});
      }
    } catch (permErr) {
      console.error("[Voice Widget] Microphone access denied or WebRTC failed:", permErr);
      showToast("Please allow microphone access to talk to Zara");
      handleEndCall();
      return;
    }

    // 3. Initiate 3-Ring Telephone Cadence & Background WebRTC Connection
    setCallState("ringing");
    setCallDuration(0);
    isSessionActiveRef.current = false;
    minCadenceCompleteRef.current = false;

    startRingingSound();

    try {
      // Connect WebRTC session in background
      conversation
        .startSession({
          agentId,
          volume: 0, // Zeroed during ringing so voice doesn't bleed into ring cadence
          overrides: {
            agent: {
              firstMessage: FIRST_GREETING_MESSAGE,
            },
          },
        })
        .catch((err) => {
          console.error("[Voice Widget] WebRTC session initiation failed:", err);
          handleEndCall();
          showToast("Failed to connect to voice assistant. Please try again.");
        });

      // Enforce exactly 3 ring cycles (~4.2 seconds total) before answering
      if (cadenceTimeoutRef.current) clearTimeout(cadenceTimeoutRef.current);
      cadenceTimeoutRef.current = setTimeout(() => {
        minCadenceCompleteRef.current = true;
        // Transition to connected ONLY if the session is confirmed active
        if (isSessionActiveRef.current) {
          transitionToConnected();
        }
      }, 4200);
    } catch (err) {
      console.error("[Voice Widget] Connection initialization error:", err);
      handleEndCall();
    }
  };

  // 5. Clean Teardown / Disconnect Protocol
  const handleEndCall = async () => {
    isSessionActiveRef.current = false;
    minCadenceCompleteRef.current = false;

    if (cadenceTimeoutRef.current) {
      clearTimeout(cadenceTimeoutRef.current);
      cadenceTimeoutRef.current = null;
    }

    stopRingingSound();
    setCallState("idle");
    setCallDuration(0);

    // Release microphone media tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
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

      {/* Permission / Configuration Error Toast */}
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

      {/* 4. LIVE CONNECTED STATE */}
      {callState === "connected" && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#12151E]/95 border border-[#8B5CF6]/50 shadow-[0_0_25px_rgba(139,92,246,0.35)] backdrop-blur-xl transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-wide">Zara</span>
            <span className="text-xs font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {formatTimer(callDuration)}
            </span>
          </div>

          {/* Animated 4-bar soundwave in Electric Orange (#FF6B00) */}
          <div className="flex items-center gap-0.5 px-1.5 h-4">
            <span className="w-0.5 h-3 bg-[#FF6B00] animate-pulse rounded-full" />
            <span className="w-0.5 h-4 bg-[#FF6B00] animate-bounce rounded-full" />
            <span className="w-0.5 h-2.5 bg-[#FF6B00] animate-pulse rounded-full" />
            <span className="w-0.5 h-3.5 bg-[#FF6B00] animate-bounce rounded-full" />
          </div>

          <button
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              try {
                conversation.setVolume({ volume: nextMuted ? 0 : 1 });
              } catch {}
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

      {/* 3. RINGING STATE (Devmate style: Exactly 3 rings, • Ringing...) */}
      {callState === "ringing" && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#12151E]/95 border border-[#FF6B00]/50 shadow-[0_0_25px_rgba(255,107,0,0.35)] backdrop-blur-xl transition-all">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B00]" />
            </span>
            <span className="text-xs font-mono font-medium text-slate-200">
              • Ringing...
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

      {/* IDLE STATE (Minimal single-line with Devmate ambient ripples) */}
      {callState === "idle" && (
        <div
          onClick={startVoiceCall}
          className="group flex items-center gap-3 pl-4 pr-2.5 py-2 rounded-full bg-[#12151E]/95 hover:bg-[#12151E] border border-white/10 hover:border-[#8B5CF6]/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] backdrop-blur-xl transition-all duration-300 cursor-pointer"
        >
          {/* Clean minimal text without subtitle */}
          <div className="flex items-center gap-2 pr-1">
            <span className="text-xs font-semibold text-white tracking-wide">
              Talk to Zara
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          </div>

          {/* Concentric Ambient Ripples (Devmate Style) */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-10 h-10 rounded-full bg-[#8B5CF6]/30 animate-ping opacity-75 pointer-events-none" />
            <span className="absolute w-12 h-12 rounded-full bg-[#8B5CF6]/15 animate-pulse pointer-events-none" />

            {/* Core Mic Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startVoiceCall();
              }}
              className="relative z-10 w-9 h-9 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center shadow-lg shadow-purple-500/30 transition-transform active:scale-95 cursor-pointer"
              aria-label="Talk to Zara"
            >
              {/* Microphone Icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m14 0a7 7 0 01-14 0m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z" />
              </svg>
            </button>
          </div>
        </div>
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
