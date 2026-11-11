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

type HubNodeId = 'core' | 'voice' | 'wa' | 'cal' | 'crm' | 'dash' | 'api';

interface HubNode {
  id: HubNodeId;
  label: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  x: number; // within 640x420 viewBox
  y: number;
  summary: string;
  specs: { label: string; value: string }[];
}

const HUB_NODES: Record<HubNodeId, HubNode> = {
  core: {
    id: 'core',
    label: 'ZAVIAN CORE',
    tag: 'ORCHESTRATION ENGINE',
    icon: Cpu,
    x: 320,
    y: 210,
    summary:
      'Your central ruleset linking phone calls, WhatsApp threads, calendars, and reporting—so every customer gets handled the same reliable way.',
    specs: [
      { label: 'Routing Logic', value: 'Sub-100ms Event Dispatch' },
      { label: 'Reliability', value: 'Automatic Retry + Audit Log' },
      { label: 'Control', value: 'Human Handoff Rules Included' },
    ],
  },
  voice: {
    id: 'voice',
    label: 'Voice Agent',
    tag: 'INBOUND VOICE',
    icon: PhoneCall,
    x: 102,
    y: 88,
    summary:
      'Answers every incoming call in your tone, qualifies the caller in natural conversation, and triggers the next step right away.',
    specs: [
      { label: 'Pickup Speed', value: '< 400ms Voice Handshake' },
      { label: 'Telephony', value: 'Local UAE / Global SIP Trunks' },
      { label: 'Handoff', value: 'Transfers Urgent Calls Live' },
    ],
  },
  wa: {
    id: 'wa',
    label: 'WhatsApp',
    tag: 'MESSAGING & DOCS',
    icon: MessageSquare,
    x: 102,
    y: 332,
    summary:
      'Continues the conversation in WhatsApp with PDF proposals, booking confirmations, location pins, or document collection.',
    specs: [
      { label: 'Transport', value: 'Official Meta Cloud API' },
      { label: 'Media Support', value: 'PDFs, Bills, CVs & Location Pins' },
      { label: 'Follow-Up', value: 'Automated Confirm & Reschedule' },
    ],
  },
  cal: {
    id: 'cal',
    label: 'Calendar / PMS',
    tag: 'LIVE SCHEDULING',
    icon: Calendar,
    x: 320,
    y: 48,
    summary:
      'Checks open chairs, rooms, or site engineer windows in real time and locks bookings without double-ups.',
    specs: [
      { label: 'Compatible', value: 'Google Calendar, Cliniko, Dentally' },
      { label: 'Protection', value: 'Zero-Collision Buffer Checks' },
      { label: 'Latency', value: '0.4s Two-Way Diary Sync' },
    ],
  },
  crm: {
    id: 'crm',
    label: 'CRM & Records',
    tag: 'CLIENT MEMORY',
    icon: Database,
    x: 538,
    y: 88,
    summary:
      'Saves every caller contact, transcript note, and booking status cleanly so your sales or front-desk team never re-types data.',
    specs: [
      { label: 'Compatible', value: 'HubSpot, Salesforce, Zoho, Airtable' },
      { label: 'Records', value: 'Call Summary + Audio + Status' },
      { label: 'Deduplication', value: 'Matches Returning Callers' },
    ],
  },
  dash: {
    id: 'dash',
    label: 'Live Dashboard',
    tag: 'OWNER VISIBILITY',
    icon: BarChart3,
    x: 538,
    y: 332,
    summary:
      'Shows calls answered, quotes sent, chair occupancy, and net margin on one screen built specifically around your numbers.',
    specs: [
      { label: 'Refresh', value: 'Real-Time Stream Updates' },
      { label: 'Tracking', value: 'Voice vs. WhatsApp Attribution' },
      { label: 'Export', value: 'Daily Team Summaries & CSV' },
    ],
  },
  api: {
    id: 'api',
    label: 'Your Software / API',
    tag: 'BESPOKE SOFTWARE',
    icon: Code2,
    x: 320,
    y: 372,
    summary:
      'Connects cleanly to custom ERPs, billing calculators, clinic portals, or internal tools built specifically for how you operate.',
    specs: [
      { label: 'Interface', value: 'REST Webhooks & Secure APIs' },
      { label: 'Custom Builds', value: 'Client Portals & Quote Calculators' },
      { label: 'Security', value: 'Role-Based Access & Audit Trail' },
    ],
  },
};

const OUTER_NODE_IDS: HubNodeId[] = ['voice', 'cal', 'crm', 'dash', 'api', 'wa'];

export default function ConnectedHubSection() {
  const [selectedId, setSelectedId] = useState<HubNodeId>('core');
  const activeNode = HUB_NODES[selectedId];

  return (
    <section
      id="connected-hub"
      className="relative w-full bg-[#eceff3] text-[#0b0d12] py-20 sm:py-28 px-5 sm:px-8 border-t border-[#0b0d12]/8 scroll-mt-20 overflow-hidden"
    >
      {/* Compatibility anchor */}
      <div id="systems" className="scroll-mt-20 pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: Headline & Interactive Side Inspector Card */}
        <div className="lg:col-span-5 space-y-6">
          <h2
            className="font-serif-instrument font-normal text-[#0b0d12] tracking-[-0.02em] leading-[1.02]"
            style={{ fontSize: 'clamp(40px, 4.8vw, 68px)' }}
          >
            One studio.{' '}
            <span className="italic text-[#5a3fd1]">Every system connected.</span>
          </h2>

          <p className="text-[16px] sm:text-[17px] leading-[1.6] text-[#475060] max-w-[460px]">
            Most teams lose leads between separate phone lines, WhatsApp chats, calendars, and spreadsheets. Click any node to see how your daily tools wire together.
          </p>

          {/* Side Technical Spec Inspector Card */}
          <motion.div
            key={selectedId}
            initial={{ opacity: 0.75, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="zl-card rounded-[24px] border border-[#0b0d12]/12 bg-white/95 p-6 sm:p-7 shadow-[0_24px_60px_rgba(20,30,60,0.08)] space-y-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06788f]/10 border border-[#06788f]/25 font-mono text-[10.5px] tracking-[0.1em] uppercase font-semibold text-[#06788f]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06788f]" />
                {activeNode.tag}
              </span>
              <span className="font-mono text-[11px] text-[#475060]">
                Active Node
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#0b0d12] tracking-tight">
                {activeNode.label}
              </h3>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-[#475060]">
                {activeNode.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#0b0d12]/10 space-y-2.5">
              {activeNode.specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 text-xs sm:text-[13px]"
                >
                  <span className="font-mono text-[#475060] uppercase tracking-wider text-[10.5px]">
                    {spec.label}
                  </span>
                  <span className="font-semibold text-[#0b0d12] text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Interactive SVG Constellation Diagram */}
        <div className="lg:col-span-7">
          <div
            className="relative rounded-[28px] border border-[#0b0d12]/12 bg-white/75 backdrop-blur-md shadow-[0_30px_80px_rgba(20,30,60,0.08)] p-4 sm:p-6 overflow-hidden"
            style={{
              backgroundImage:
                'radial-gradient(rgba(11,13,18,0.07) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* Desktop / Tablet Interactive Constellation Stage */}
            <div className="relative w-full aspect-[640/420] min-h-[300px] sm:min-h-[410px]">
              
              {/* SVG Data Rays Layer (Matching exact percentage coordinates of nodes) */}
              <svg
                viewBox="0 0 640 420"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="hubRayActive" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06788f" />
                    <stop offset="100%" stopColor="#5a3fd1" />
                  </linearGradient>
                  <filter id="hubRayGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {OUTER_NODE_IDS.map((id) => {
                  const n = HUB_NODES[id];
                  const isActiveRay = selectedId === id || selectedId === 'core';
                  const isFocused = selectedId === id;

                  return (
                    <g key={id}>
                      {/* Subtle Base Dashed Track */}
                      <line
                        x1="320"
                        y1="210"
                        x2={n.x}
                        y2={n.y}
                        stroke={
                          isFocused
                            ? 'url(#hubRayActive)'
                            : isActiveRay
                            ? 'rgba(6, 120, 143, 0.35)'
                            : 'rgba(11, 13, 18, 0.16)'
                        }
                        strokeWidth={isFocused ? 2.5 : 1.5}
                        strokeDasharray="6 6"
                        className={isActiveRay ? 'anim-svg-dash' : undefined}
                        filter={isFocused ? 'url(#hubRayGlow)' : undefined}
                      />

                      {/* Animated Energy Packet traveling along the active connection */}
                      {isFocused && (
                        <circle r="4.5" fill="#06788f">
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

              {/* Central Obsidian 3D Metallic Node: ZAVIAN CORE */}
              <button
                type="button"
                onClick={() => setSelectedId('core')}
                aria-label="ZAVIAN CORE central hub"
                style={{
                  left: '50%',
                  top: '50%',
                  background:
                    'radial-gradient(circle at 32% 26%, #525d73 0%, #242b38 38%, #07080c 100%)',
                  boxShadow:
                    selectedId === 'core'
                      ? '0 24px 55px rgba(7,8,11,0.42), 0 0 32px rgba(6,120,143,0.45), inset 0 1px 1px rgba(255,255,255,0.28)'
                      : '0 20px 45px rgba(7,8,11,0.34), inset 0 1px 1px rgba(255,255,255,0.2)',
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 sm:w-[116px] sm:h-[116px] rounded-full flex flex-col items-center justify-center text-center text-white border transition-all duration-300 cursor-pointer ${
                  selectedId === 'core'
                    ? 'scale-105 border-[#5ee3ff]/75'
                    : 'border-white/25 hover:scale-105'
                }`}
              >
                <span className="font-mono text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.12em] uppercase leading-tight px-2">
                  ZAVIAN CORE
                </span>
                <span className="mt-1 w-2 h-2 rounded-full bg-[#5ee3ff] shadow-[0_0_10px_#5ee3ff]" />
              </button>

              {/* 6 Peripheral Interactive System Nodes */}
              {OUTER_NODE_IDS.map((id) => {
                const n = HUB_NODES[id];
                const Icon = n.icon;
                const on = selectedId === id;

                const leftPct = `${(n.x / 640) * 100}%`;
                const topPct = `${(n.y / 420) * 100}%`;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedId(id)}
                    style={{
                      left: leftPct,
                      top: topPct,
                      boxShadow: on
                        ? '0 0 26px rgba(6, 120, 143, 0.30), 0 10px 24px rgba(15, 23, 42, 0.08)'
                        : '0 8px 22px rgba(15, 23, 42, 0.07)',
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 inline-flex items-center gap-2 min-h-[40px] sm:min-h-[44px] px-3 sm:px-4 rounded-2xl border font-mono text-[10px] sm:text-[11.5px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap transition-all duration-300 cursor-pointer ${
                      on
                        ? 'bg-white border-[#06788f] text-[#06788f] scale-105'
                        : 'bg-white/95 border-[#0b0d12]/16 text-[#0b0d12] hover:border-[#06788f]/60 hover:text-[#06788f] hover:scale-[1.03]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${on ? 'text-[#06788f]' : 'text-[#475060]'}`} />
                    <span className="hidden xs:inline sm:inline">{n.label}</span>
                  </button>
                );
              })}

            </div>

            {/* Quick Accessible Node Pills (also ensures ultra-easy tapping on tiny phones) */}
            <div className="mt-4 pt-4 border-t border-[#0b0d12]/10 flex flex-wrap items-center justify-center gap-2">
              {(['core', ...OUTER_NODE_IDS] as HubNodeId[]).map((id) => {
                const n = HUB_NODES[id];
                const active = selectedId === id;
                return (
                  <button
                    key={`pill-${id}`}
                    type="button"
                    onClick={() => setSelectedId(id)}
                    className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0b0d12] text-white border-[#0b0d12]'
                        : 'bg-white/80 text-[#475060] border-[#0b0d12]/12 hover:text-[#0b0d12]'
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
