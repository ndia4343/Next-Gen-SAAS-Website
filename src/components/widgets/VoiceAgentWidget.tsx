'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Volume2, Radio } from 'lucide-react';
import { FreyaConfig } from '@/lib/types';

type AgentState = 'idle' | 'connecting' | 'listening' | 'speaking';

interface VoiceAgentWidgetProps {
  content?: FreyaConfig;
}

export default function VoiceAgentWidget({ content }: VoiceAgentWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [transcript, setTranscript] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const agentName = content?.agentName || 'Freya';
  const welcomeMsg =
    content?.welcomeMessage ||
    `Hello! I am ${agentName}. Which software or AI architecture are you looking to engineer today?`;
  const isLive = content?.isLiveIndicator !== false;

  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2.5;

      const isVoiceActive = agentState === 'listening' || agentState === 'speaking';
      const amplitude = isVoiceActive ? 22 : 6;
      ctx.strokeStyle = agentState === 'speaking' ? '#FF6B00' : '#DC2626';

      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y =
          canvas.height / 2 +
          Math.sin(x * 0.05 + phase) * amplitude * Math.sin((x / canvas.width) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.08;
      animId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, agentState]);

  const toggleConnection = () => {
    if (agentState === 'idle') {
      setAgentState('connecting');
      setTimeout(() => {
        setAgentState('listening');
        setTranscript([
          `[${agentName} Engine]: Connected to ZAVIAN LABS WebRTC Voice cluster.`,
          `[${agentName}]: "${welcomeMsg}"`,
        ]);
      }, 1200);
    } else {
      setAgentState('idle');
      setTranscript([]);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <div
          onClick={() => setIsOpen(true)}
          className="glass-panel-elevated px-4 py-2 rounded-full cursor-pointer hover:border-red-500/40 transition-all flex items-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95"
        >
          {isLive && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
            </span>
          )}
          <span className="text-xs font-mono font-bold tracking-wider text-zinc-100">
            Talk to {agentName}
          </span>
          {isLive && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/40">
              LIVE
            </span>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-700 to-red-500 text-white flex items-center justify-center shadow-lg shadow-red-700/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          aria-label={`Toggle ${agentName} Voice Assistant`}
        >
          <Mic className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] glass-panel-elevated rounded-3xl p-6 z-50 border border-white/15 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <h4 className="font-bold text-white text-sm">{agentName} Neural Voice</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-black/50 rounded-2xl p-4 flex flex-col items-center justify-center mb-4 border border-white/5">
            <canvas ref={canvasRef} width={280} height={70} className="w-full" />
            <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mt-2">
              Status: <span className="text-red-400 font-bold uppercase">{agentState}</span>
            </div>
          </div>

          <div className="h-28 overflow-y-auto space-y-2 mb-4 text-xs font-mono text-zinc-300 pr-1">
            {transcript.length === 0 ? (
              <p className="text-zinc-500 italic">Click below to start live voice session...</p>
            ) : (
              transcript.map((line, i) => <p key={i}>{line}</p>)
            )}
          </div>

          <button
            onClick={toggleConnection}
            className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              agentState === 'idle'
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            {agentState === 'idle' ? `Connect ${agentName} Audio` : 'Disconnect Audio'}
          </button>
        </div>
      )}
    </>
  );
}
