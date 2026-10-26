"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Volume2, VolumeX, X, Sparkles, PhoneOff, Power } from "lucide-react";
import { cn } from "@/lib/utils";
import { soundFX } from "@/lib/audio";
import { FreyaConfig } from "@/lib/types";

type VoiceState = "idle" | "connecting" | "listening" | "speaking";

interface VoiceAgentWidgetProps {
  config?: FreyaConfig;
}

export default function VoiceAgentWidget({ config }: VoiceAgentWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [isMuted, setIsMuted] = useState(false);

  const defaultWelcome =
    config?.welcomeMessage ||
    "Hello! I'm Freya, your autonomous solutions architect. How can I help clarify your project scope today?";

  const [transcript, setTranscript] = useState<
    Array<{ sender: "freya" | "user"; text: string; timestamp: string }>
  >([
    {
      sender: "freya",
      text: defaultWelcome,
      timestamp: "Just now",
    },
  ]);
  const [simulatedInput, setSimulatedInput] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Web Speech API Voice Synthesis
  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) =>
          (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha")) &&
          v.lang.startsWith("en")
      );
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onstart = () => setVoiceState("speaking");
      utterance.onend = () => setVoiceState("listening");
      utterance.onerror = () => setVoiceState("listening");

      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback gracefully
    }
  };

  // Connection Controls
  const handleConnect = () => {
    soundFX.playActivate();
    setVoiceState("connecting");
    setTimeout(() => {
      setVoiceState("listening");
      if (!isMuted) {
        speakText(
          config?.welcomeMessage ||
            "Hi there! I'm Freya. Ask me anything about our software or AI architecture."
        );
      }
    }, 1200);
  };

  const handleDisconnect = () => {
    soundFX.playClick();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState("idle");
  };

  // Toggle widget drawer open/close
  const toggleDrawer = () => {
    soundFX.playActivate();
    if (!isOpen) {
      setIsOpen(true);
      if (voiceState === "idle") {
        handleConnect();
      }
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsOpen(false);
    }
  };

  // Real-time Canvas Waveform Visualizer running on requestAnimationFrame
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Amplitude and color driven by connection state machine
      let amplitude = 4;
      let strokeColor = "rgba(113, 113, 122, 0.4)"; // Idle grey

      if (voiceState === "speaking") {
        amplitude = 24 + Math.sin(phase * 4) * 12;
        strokeColor = "rgba(239, 68, 68, 0.9)"; // Red speaking
      } else if (voiceState === "listening") {
        amplitude = 14 + Math.cos(phase * 2) * 6;
        strokeColor = "rgba(0, 180, 216, 0.85)"; // Cyan listening
      } else if (voiceState === "connecting") {
        amplitude = 8;
        strokeColor = "rgba(255, 107, 0, 0.85)"; // Orange connecting
      }

      // Draw primary dynamic sine wave
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = strokeColor;

      for (let x = 0; x < width; x++) {
        const y =
          centerY +
          Math.sin(x * 0.04 + phase) *
            Math.sin(x * 0.01 + phase * 0.5) *
            amplitude *
            Math.sin((x / width) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw secondary harmonic wave
      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle =
        voiceState === "speaking"
          ? "rgba(255, 255, 255, 0.4)"
          : "rgba(129, 140, 248, 0.4)";

      for (let x = 0; x < width; x++) {
        const y =
          centerY +
          Math.cos(x * 0.06 - phase * 1.2) *
            (amplitude * 0.5) *
            Math.sin((x / width) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.05;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, voiceState]);

  // Handle simulated user message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedInput.trim()) return;

    soundFX.playClick();
    const userText = simulatedInput.trim();
    setSimulatedInput("");
    setTranscript((prev) => [
      ...prev,
      { sender: "user", text: userText, timestamp: "Just now" },
    ]);

    setVoiceState("speaking");

    // Simulate Freya AI Response
    setTimeout(() => {
      let reply =
        "Our engineering team specializes in that exact specification. I recommend booking an architecture discovery call so we can model the latency and cost footprint.";
      const lower = userText.toLowerCase();
      if (lower.includes("price") || lower.includes("cost") || lower.includes("quote")) {
        reply =
          "Our custom projects start with a transparent scoped quote. You can open our Quote Modal above or let me pre-fill your preferred service tier!";
      } else if (lower.includes("ai") || lower.includes("agent")) {
        reply =
          "For Agentic AI, we build multi-agent workflows with human-in-the-loop controls, self-correcting prompt trees, and sub-100ms response cycles.";
      } else if (lower.includes("ecommerce") || lower.includes("shopify")) {
        reply =
          "For Headless Ecommerce, we pair Shopify Plus APIs with Next.js edge caching to achieve 98+ Google Lighthouse scores and instant transitions.";
      }

      setTranscript((prev) => [
        ...prev,
        { sender: "freya", text: reply, timestamp: "Just now" },
      ]);

      speakText(reply);
      setVoiceState("listening");
    }, 1200);
  };

  const endSession = () => {
    handleDisconnect();
    setIsOpen(false);
  };

  return (
    <>
      {/* =========================================================================
          Fixed Floating Button: bottom-6 right-6 z-50
      ========================================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Dark pill badge with pulsing red beacon */}
        <div
          onClick={toggleDrawer}
          className="cursor-pointer hidden sm:flex items-center gap-2.5 bg-zinc-900/95 border border-white/10 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-xl hover:border-white/20 transition-all active:scale-95 group"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-xs font-bold text-red-500 tracking-wider">
              LIVE
            </span>
          </div>
          <span className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">
            Talk to Freya
          </span>
        </div>

        {/* Circular glowing microphone button (w-14 h-14 bg-gradient-to-tr from-red-700 to-red-500) */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-14 h-14 rounded-full border border-red-500/40 animate-pulse-ring-1 pointer-events-none" />
          <div className="absolute w-14 h-14 rounded-full border border-red-600/30 animate-pulse-ring-2 pointer-events-none" />
          <div className="absolute w-14 h-14 rounded-full border border-red-700/20 animate-pulse-ring-3 pointer-events-none" />

          <button
            onClick={toggleDrawer}
            className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-red-500 hover:from-red-600 hover:to-red-400 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 active:scale-90 transition-all duration-300 border border-white/20"
            aria-label="Toggle Live Voice AI"
          >
            <Mic className="w-6 h-6 animate-pulse" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          Glassmorphic Popover Drawer
      ========================================================================== */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] rounded-3xl bg-[#0c0c12]/95 border border-white/15 shadow-2xl shadow-black/90 backdrop-blur-2xl p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Drawer Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  {config?.agentName || "Freya"} Voice Agent
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    LIVE AI
                  </span>
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      voiceState === "listening"
                        ? "bg-cyan-400 animate-pulse"
                        : voiceState === "speaking"
                        ? "bg-red-500 animate-ping"
                        : voiceState === "connecting"
                        ? "bg-orange-400 animate-spin"
                        : "bg-zinc-500"
                    )}
                  />
                  <span className="text-zinc-400 uppercase tracking-wider">
                    {voiceState}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Connect / Disconnect Toggle Button */}
              {voiceState === "idle" ? (
                <button
                  onClick={handleConnect}
                  className="p-2 rounded-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                  title="Connect Voice"
                >
                  <Power className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleDisconnect}
                  className="p-2 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Disconnect Voice"
                >
                  <Power className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  soundFX.playClick();
                  setIsMuted(!isMuted);
                  if (!isMuted && typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={toggleDrawer}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Voice Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-Time Canvas Waveform Visualizer */}
          <div className="relative w-full h-24 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden mb-4">
            <canvas
              ref={canvasRef}
              width={370}
              height={96}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest pointer-events-none">
              Audio Waveform · 48kHz
            </div>
          </div>

          {/* Simulated Conversation Transcript */}
          <div className="h-44 overflow-y-auto space-y-3 pr-2 mb-4 text-xs font-sans">
            {transcript.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-2xl max-w-[88%]",
                  msg.sender === "freya"
                    ? "bg-white/[0.05] border border-white/10 text-zinc-200 self-start"
                    : "bg-red-600/20 border border-red-500/30 text-white ml-auto"
                )}
              >
                <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 mb-1">
                  {msg.sender === "freya" ? `${config?.agentName || "Freya"} AI` : "You"} · {msg.timestamp}
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Text/Speech Input Bar */}
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <input
              type="text"
              value={simulatedInput}
              onChange={(e) => setSimulatedInput(e.target.value)}
              placeholder="Ask Freya about architecture, pricing..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 transition-colors"
            />
            <button
              type="submit"
              className="px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold active:scale-95 transition-all shadow-md shadow-red-600/30"
            >
              Send
            </button>
          </form>

          {/* Footer Controls with Connect/Disconnect */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-zinc-400">
            {voiceState === "idle" ? (
              <button
                onClick={handleConnect}
                className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Connect Voice</span>
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            )}

            <button
              onClick={endSession}
              className="text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <PhoneOff className="w-3 h-3" />
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
