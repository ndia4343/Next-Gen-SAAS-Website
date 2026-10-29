"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";

interface VoiceReceptionistWidgetProps {
  content?: any;
}

const VoiceReceptionistInner: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSimulatedCalling, setIsSimulatedCalling] = useState(false);

  const showToast = (msg: string) => {
    setErrorMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setErrorMessage(null);
    }, 4500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const conversation = useConversation({
    onError: (err) => {
      console.warn("ElevenLabs conversation error:", err);
      const errStr = typeof err === "string" ? err : err?.message || JSON.stringify(err);
      if (
        errStr.toLowerCase().includes("permission") ||
        errStr.toLowerCase().includes("notallowed") ||
        errStr.toLowerCase().includes("microphone") ||
        errStr.toLowerCase().includes("device")
      ) {
        showToast("Please allow microphone access to talk to Zara");
      }
    },
    onModeChange: (modeObj) => {
      // Confirms ElevenLabs VAD detected user speech vs. agent speech
      console.log("[ElevenLabs VAD Mode Change]:", modeObj.mode);
    },
  });

  const isConnected = conversation.status === "connected";
  const isCalling = isConnected || isSimulatedCalling;

  const handleToggleCall = async () => {
    if (isConnected) {
      await conversation.endSession();
      setIsSimulatedCalling(false);
      return;
    }

    if (isSimulatedCalling) {
      setIsSimulatedCalling(false);
      return;
    }

    // 1. Explicitly request microphone audio permissions first
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release immediate test tracks so ElevenLabs audio worklet takes over cleanly
        stream.getTracks().forEach((track) => track.stop());
      } else {
        showToast("Please allow microphone access to talk to Zara");
        return;
      }
    } catch (permErr: any) {
      console.warn("Microphone access denied:", permErr);
      showToast("Please allow microphone access to talk to Zara");
      return;
    }

    // 2. Start session with ElevenLabs Conversational AI
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

    if (agentId && agentId !== "your_agent_id_here") {
      try {
        await conversation.startSession({
          agentId,
        });
      } catch (err: any) {
        console.warn("ElevenLabs session error:", err);
        const errMsg = err?.message || "";
        if (
          errMsg.toLowerCase().includes("permission") ||
          errMsg.toLowerCase().includes("notallowed") ||
          errMsg.toLowerCase().includes("microphone")
        ) {
          showToast("Please allow microphone access to talk to Zara");
          return;
        }
        setIsSimulatedCalling(true);
      }
    } else {
      // Fallback demo mode when agent ID placeholder is used
      setIsSimulatedCalling(true);
    }
  };

  return (
    <aside 
      aria-label="Voice Receptionist"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 select-none"
    >
      {/* Explicit Permission Denied / Error Toast */}
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

      {/* Unified Floating Pill */}
      <div 
        className={`flex items-center gap-3 px-3.5 py-2 rounded-full border transition-all duration-300 shadow-2xl backdrop-blur-xl ${
          isCalling
            ? "bg-[#12151E]/95 border-[#FF6B00]/60 shadow-[0_0_25px_rgba(255,107,0,0.3)]"
            : "bg-[#12151E]/90 dark:bg-[#12151E]/90 bg-white/90 border-slate-200 dark:border-white/10 hover:border-[#8B5CF6]/50 shadow-[0_0_20px_rgba(0,0,0,0.25)]"
        }`}
      >
        {/* Status Dot / Live Wave */}
        <div className="flex items-center gap-2 pl-1">
          {isCalling ? (
            <div className="flex items-center gap-0.5 h-3.5">
              <span className="w-0.5 h-3 bg-[#FF6B00] animate-pulse rounded-full" />
              <span className="w-0.5 h-4 bg-[#FF6B00] animate-bounce rounded-full" />
              <span className="w-0.5 h-2 bg-[#FF6B00] animate-pulse rounded-full" />
            </div>
          ) : (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF6B00]" />
            </span>
          )}

          <div className="flex flex-col pr-1">
            <span className="text-xs font-semibold text-slate-800 dark:text-white leading-tight flex items-center gap-1.5">
              Talk to Zara
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FF6B00]/15 text-[#FF6B00] font-bold uppercase tracking-wider">
                {isCalling ? "CONNECTED" : "LIVE"}
              </span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {isCalling ? "Listening to your audio..." : "AI Voice Receptionist"}
            </span>
          </div>
        </div>

        {/* Integrated Mic Action Button */}
        <button
          onClick={handleToggleCall}
          type="button"
          aria-label={isCalling ? "End Call" : "Speak to Zara"}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            isCalling
              ? "bg-[#FF6B00] text-white hover:bg-[#e05e00] shadow-[0_0_15px_rgba(255,107,0,0.5)] scale-105 cursor-pointer"
              : "bg-[#8B5CF6] text-white hover:bg-[#7C3AED] hover:scale-105 shadow-[0_0_15px_rgba(139,92,246,0.4)] cursor-pointer"
          }`}
        >
          {isCalling ? (
            <MicOff className="w-4 h-4 animate-pulse" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>
      </div>
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
