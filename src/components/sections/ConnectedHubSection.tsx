'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneCall,
  MessageSquare,
  Calendar,
  Database,
  BarChart3,
  Code2,
  Cpu,
} from 'lucide-react';
import { useSiteConfig } from '@/context/SiteConfigContext';

function getNodeIcon(id: string): React.ComponentType<{ className?: string }> {
  switch (id) {
    case 'voice':
      return PhoneCall;
    case 'wa':
      return MessageSquare;
    case 'cal':
      return Calendar;
    case 'crm':
      return Database;
    case 'dash':
      return BarChart3;
    case 'api':
      return Code2;
    default:
      return Cpu;
  }
}

export default function ConnectedHubSection() {
  const { config } = useSiteConfig();
  const constellation = config.constellation;
  const nodes = constellation.nodes;

  const [selectedId, setSelectedId] = useState<string>('core');

  const selectedPeripheral = nodes.find((n) => n.id === selectedId);
  const activeTitle = selectedPeripheral ? selectedPeripheral.title : constellation.coreNodeTitle;
  const activeDescription = selectedPeripheral
    ? selectedPeripheral.description
    : constellation.coreNodeDescription;
  const activeStatus = selectedPeripheral
    ? selectedPeripheral.status
    : constellation.coreNodeStatus;
  const activeSpecs = selectedPeripheral
    ? selectedPeripheral.specs
    : constellation.coreNodeSpecs;

  return (
    <section
      id="connected-hub"
      className="relative w-full bg-[#FAFAFA] text-[#0A0A0A] py-20 sm:py-28 px-5 sm:px-8 border-t border-[rgba(0,0,0,0.07)] scroll-mt-20 overflow-hidden"
    >
      {/* Compatibility anchor */}
      <div id="systems" className="scroll-mt-20 pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: Headline & Interactive Side Inspector Card */}
        <div className="lg:col-span-5 space-y-6">
          <h2
            className="font-serif-instrument font-normal text-[#0A0A0A] tracking-[-0.02em] leading-[1.02]"
            style={{ fontSize: 'clamp(40px, 4.8vw, 68px)' }}
          >
            {constellation.sectionTitle}{' '}
            <span className="italic text-[#8B5CF6]">{constellation.sectionTitleAccent}</span>
          </h2>

          <p className="text-[16px] sm:text-[17px] leading-[1.6] text-[#585A66] max-w-[460px]">
            {constellation.sectionDescription}
          </p>

          {/* Side Technical Spec Inspector Card */}
          <motion.div
            key={selectedId}
            initial={{ opacity: 0.75, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="zl-card rounded-[24px] border border-[rgba(0,0,0,0.07)] bg-white p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 font-mono text-[10.5px] tracking-[0.1em] uppercase font-semibold text-[#8B5CF6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                {activeStatus}
              </span>
              <span className="font-mono text-[11px] text-[#585A66]">
                Active Node
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#0A0A0A] tracking-tight">
                {activeTitle}
              </h3>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-[#585A66]">
                {activeDescription}
              </p>
            </div>

            {activeSpecs && activeSpecs.length > 0 && (
              <div className="pt-3 border-t border-[rgba(0,0,0,0.07)] space-y-2.5">
                {activeSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 text-xs sm:text-[13px]"
                  >
                    <span className="font-mono text-[#585A66] uppercase tracking-wider text-[10.5px]">
                      {spec.label}
                    </span>
                    <span className="font-semibold text-[#0A0A0A] text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Interactive SVG Constellation Diagram */}
        <div className="lg:col-span-7">
          <div
            className="relative rounded-[28px] border border-[rgba(0,0,0,0.07)] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-4 sm:p-6 overflow-hidden"
            style={{
              backgroundImage:
                'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* Desktop / Tablet Interactive Constellation Stage */}
            <div className="relative w-full aspect-[640/420] min-h-[300px] sm:min-h-[410px]">
              
              {/* SVG Data Rays Layer */}
              <svg
                viewBox="0 0 640 420"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="hubRayActive" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <filter id="hubRayGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {nodes.map((n) => {
                  const isActiveRay = selectedId === n.id || selectedId === 'core';
                  const isFocused = selectedId === n.id;

                  return (
                    <g key={n.id}>
                      <line
                        x1="320"
                        y1="210"
                        x2={n.x}
                        y2={n.y}
                        stroke={
                          isFocused
                            ? 'url(#hubRayActive)'
                            : isActiveRay
                            ? 'rgba(139, 92, 246, 0.30)'
                            : 'rgba(0, 0, 0, 0.10)'
                        }
                        strokeWidth={isFocused ? 2.5 : 1.5}
                        strokeDasharray="6 6"
                        className={isActiveRay ? 'anim-svg-dash' : undefined}
                        filter={isFocused ? 'url(#hubRayGlow)' : undefined}
                      />

                      {isFocused && (
                        <circle r="4.5" fill="#8B5CF6">
                          <animateMotion
                            dur="1.4s"
                            repeatCount="indefinite"
                            path={`M 320 210 L ${n.x} ${n.y}`}
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Central Obsidian 3D Metallic Node */}
              <button
                type="button"
                onClick={() => setSelectedId('core')}
                aria-label={`${constellation.coreNodeTitle} central hub`}
                style={{
                  left: '50%',
                  top: '50%',
                  background:
                    'radial-gradient(circle at 32% 26%, #3f3f46 0%, #1f2024 42%, #0A0A0A 100%)',
                  boxShadow:
                    selectedId === 'core'
                      ? '0 24px 55px rgba(0,0,0,0.32), 0 0 28px rgba(139,92,246,0.32), inset 0 1px 1px rgba(255,255,255,0.28)'
                      : '0 20px 45px rgba(0,0,0,0.24), inset 0 1px 1px rgba(255,255,255,0.2)',
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 sm:w-[116px] sm:h-[116px] rounded-full flex flex-col items-center justify-center text-center text-white border transition-all duration-300 cursor-pointer ${
                  selectedId === 'core'
                    ? 'scale-105 border-[#C084FC]/75'
                    : 'border-white/25 hover:scale-105'
                }`}
              >
                <span className="font-mono text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.12em] uppercase leading-tight px-2">
                  {constellation.coreNodeTitle}
                </span>
                <span className="mt-1 w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]" />
              </button>

              {/* Peripheral Interactive System Nodes */}
              {nodes.map((n) => {
                const Icon = getNodeIcon(n.id);
                const on = selectedId === n.id;

                const leftPct = `${(n.x / 640) * 100}%`;
                const topPct = `${(n.y / 420) * 100}%`;

                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setSelectedId(n.id)}
                    style={{
                      left: leftPct,
                      top: topPct,
                      boxShadow: on
                        ? '0 0 24px rgba(139, 92, 246, 0.22), 0 10px 24px rgba(0, 0, 0, 0.08)'
                        : '0 8px 22px rgba(0, 0, 0, 0.05)',
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 inline-flex items-center gap-2 min-h-[40px] sm:min-h-[44px] px-3 sm:px-4 rounded-2xl border font-mono text-[10px] sm:text-[11.5px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap transition-all duration-300 cursor-pointer ${
                      on
                        ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white scale-105'
                        : 'bg-white border-[rgba(0,0,0,0.09)] text-[#0A0A0A] hover:border-[#8B5CF6]/60 hover:text-[#8B5CF6] hover:scale-[1.03]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${on ? 'text-[#C084FC]' : 'text-[#585A66]'}`} />
                    <span className="hidden xs:inline sm:inline">{n.label}</span>
                  </button>
                );
              })}

            </div>

            {/* Quick Accessible Node Pills */}
            <div className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.07)] flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedId('core')}
                className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider border transition-colors cursor-pointer ${
                  selectedId === 'core'
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-[#F6F7F9] text-[#585A66] border-[rgba(0,0,0,0.08)] hover:text-[#0A0A0A]'
                }`}
              >
                {constellation.coreNodeTitle}
              </button>
              {nodes.map((n) => {
                const active = selectedId === n.id;
                return (
                  <button
                    key={`pill-${n.id}`}
                    type="button"
                    onClick={() => setSelectedId(n.id)}
                    className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                        : 'bg-[#F6F7F9] text-[#585A66] border-[rgba(0,0,0,0.08)] hover:text-[#0A0A0A]'
                    }`}
                  >
                    {n.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
