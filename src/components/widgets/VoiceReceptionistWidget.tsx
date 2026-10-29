"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, PhoneOff, Volume2, VolumeX, X } from "lucide-react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";

interface VoiceReceptionistWidgetProps {
  content?: any;
}

const VoiceReceptionistInner: React.FC = () => {
  const [isRinging, setIsRinging] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSimulatedConnected, setIsSimulatedConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setErrorMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setErrorMessage(null);
    }, 4500);
  };

  const conversation = useConversation({
    onConnect: () => {
      stopRingingSound();
      setIsRinging(false);
      setCallDuration(0);
    },
    onDisconnect: () => {
      stopRingingSound();
      setIsRinging(false);
      setIsSimulatedConnected(false);
      setCallDuration(0);
    },
    onError: (err) => {
      console.error("Zara voice engine error:", err);
      stopRingingSound();
      setIsRinging(false);
      const str = typeof err === "string" ? err : err?.message || "";
      if (
        str.toLowerCase().includes("permission") ||
        str.toLowerCase().includes("notallowed") ||
        str.toLowerCase().includes("microphone")
      ) {
        showToast("Please allow microphone access to talk to Zara");
      }
    },
  });

  const isConnected = conversation.status === "connected" || isSimulatedConnected;

  // Synthesize realistic telephone ring tone using Web Audio API (Zero external MP3 dependencies)
  const playRingCadence = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const runTone = () => {
        if (!ctx || ctx.state === "closed") return;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Standard UK/International PBX ring tones (400Hz + 450Hz)
        osc1.frequency.value = 400;
        osc2.frequency.value = 450;
        osc1.type = "sine";
        osc2.type = "sine";

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        // Ring pulse 1
        gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        // Ring pulse 2
        gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.7);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 1.25);
        osc2.stop(ctx.currentTime + 1.25);
      };

      runTone();
      ringIntervalRef.current = setInterval(runTone, 3000);
    } catch (e) {
      console.warn("AudioContext tone blocked or unavailable:", e);
    }
  };

  const stopRingingSound = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  // Active call duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConnected) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isConnected]);

  // Cleanup audio context and timers on unmount
  useEffect(() => {
    return () => {
      stopRingingSound();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Handle Starting and Ending the Call
  const handleStartCall = async () => {
    try {
      // 1. Explicitly request microphone access first
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } else {
        showToast("Please allow microphone access to talk to Zara");
        return;
      }

      setIsRinging(true);
      playRingCadence();

      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

      if (agentId && agentId !== "your_agent_id_here") {
        await conversation.startSession({
          agentId,
        });
      } else {
        // Realistic simulated cadence for demonstration if agentId placeholder is present
        setTimeout(() => {
          stopRingingSound();
          setIsRinging(false);
          setIsSimulatedConnected(true);
        }, 2200);
      }
    } catch (error: any) {
      console.error("Failed to connect to Zara:", error);
      stopRingingSound();
      setIsRinging(false);
      showToast("Please allow microphone access to talk to Zara");
    }
  };

  const handleEndCall = async () => {
    stopRingingSound();
    setIsRinging(false);
    setIsSimulatedConnected(false);
    setCallDuration(0);
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

      {/* 1. CONNECTED STATE */}
      {isConnected && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#12151E]/95 border border-[#8B5CF6]/40 shadow-[0_0_25px_rgba(139,92,246,0.3)] backdrop-blur-xl transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white tracking-wide">Zara</span>
            <span className="text-xs font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {formatTimer(callDuration)}
            </span>
          </div>

          {/* Sound Wave Animation */}
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
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Hang Up Button */}
          <button
            type="button"
            onClick={handleEndCall}
            className="p-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. RINGING STATE */}
      {isRinging && !isConnected && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#12151E]/95 border border-[#FF6B00]/40 shadow-[0_0_25px_rgba(255,107,0,0.3)] backdrop-blur-xl transition-all">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B00]" />
            </span>
            <span className="text-xs font-mono font-medium text-slate-200 tracking-wide">
              Connecting to Zara...
            </span>
          </div>

          <button
            type="button"
            onClick={handleEndCall}
            className="p-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
            title="Cancel Call"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. IDLE LAUNCHER (Standard State) */}
      {!isConnected && !isRinging && (
        <button
          type="button"
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
