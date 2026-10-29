import React, { useState, useEffect } from "react";
import { Mic, MicOff, Sparkles, X, Volume2 } from "lucide-react";
import { ZARA_WELCOME_MESSAGE } from "@/lib/zaraVoicePrompt";

interface VoiceReceptionistWidgetProps {
  content?: any;
}

export const VoiceReceptionistWidget: React.FC<VoiceReceptionistWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
    };
  }, []);

  const toggleCall = () => {
    setIsCalling((prev) => {
      const next = !prev;
      if (next) {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(ZARA_WELCOME_MESSAGE);
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
            window.speechSynthesis.speak(utterance);
          } catch {}
        }
      } else {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
          } catch {}
        }
      }
      return next;
    });
  };

  return (
    <aside 
      aria-label="Voice Receptionist"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 select-none"
    >
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
          onClick={toggleCall}
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

export default VoiceReceptionistWidget;
