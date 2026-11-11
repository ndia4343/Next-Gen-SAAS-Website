'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smile,
  Sun,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Play,
  Pause,
  Clock,
  FileText,
  Zap,
  ShieldCheck,
  PhoneCall,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';
import { useSiteConfig } from '@/context/SiteConfigContext';

function getSectorIcon(id: string): React.ComponentType<{ className?: string }> {
  switch (id) {
    case 'dental':
      return Smile;
    case 'solar':
      return Sun;
    case 'hr':
      return Briefcase;
    default:
      return TrendingUp;
  }
}

interface NichePalette {
  primary: string;
  secondary: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  glow: string;
  dotBg: string;
}

function getNichePalette(id: string): NichePalette {
  if (id === 'solar') {
    return {
      primary: '#F59E0B',
      secondary: '#FF5722',
      badgeBg: 'rgba(245, 158, 11, 0.10)',
      badgeBorder: 'rgba(245, 158, 11, 0.35)',
      badgeText: '#B45309',
      glow: 'rgba(245, 158, 11, 0.25)',
      dotBg: '#F59E0B',
    };
  }
  if (id === 'hr') {
    return {
      primary: '#8B5CF6',
      secondary: '#C084FC',
      badgeBg: 'rgba(139, 92, 246, 0.10)',
      badgeBorder: 'rgba(139, 92, 246, 0.35)',
      badgeText: '#6D28D9',
      glow: 'rgba(139, 92, 246, 0.25)',
      dotBg: '#8B5CF6',
    };
  }
  return {
    primary: '#10B981',
    secondary: '#00E5FF',
    badgeBg: 'rgba(16, 185, 129, 0.10)',
    badgeBorder: 'rgba(16, 185, 129, 0.32)',
    badgeText: '#047857',
    glow: 'rgba(16, 185, 129, 0.25)',
    dotBg: '#10B981',
  };
}

// Builds smooth cubic Bezier path through points
function buildSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX.toFixed(1)} ${p0.y.toFixed(1)}, ${midX.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}

// ==========================================
// 1. DENTAL OPERATORY + CONVERSION WAVE
// ==========================================
const DENTAL_CHAIRS = [
  {
    chair: 'Chair 01',
    patient: 'Farah Al-Hashimi',
    procedure: 'Aligners',
    status: 'LOCKED',
    tone: 'mint' as const,
    time: 'Thu 6:00 PM',
  },
  {
    chair: 'Chair 02',
    patient: 'Marcus Vance',
    procedure: 'DIFC',
    status: 'SYNCED',
    tone: 'cyan' as const,
    time: 'Fri 4:30 PM',
  },
  {
    chair: 'Chair 03',
    patient: 'David Wright',
    procedure: 'Consultation',
    status: 'CONFIRMED',
    tone: 'mint' as const,
    time: 'Sat 10:30 AM',
  },
  {
    chair: 'Chair 04',
    patient: 'Available',
    procedure: 'Standby Intake',
    status: 'STANDBY',
    tone: 'standby' as const,
    time: 'Open Slot',
  },
];

const DENTAL_WAVE_POINTS = [
  { hour: '14:00', inbound: 32, booked: 'AED 4,200', afterHours: false },
  { hour: '16:00', inbound: 44, booked: 'AED 6,800', afterHours: false },
  { hour: '18:00', inbound: 72, booked: 'AED 14,500', afterHours: true },
  { hour: '20:00', inbound: 88, booked: 'AED 24,200', afterHours: true },
  { hour: '22:00', inbound: 96, booked: 'AED 31,400', afterHours: true },
  { hour: '00:00', inbound: 89, booked: 'AED 26,900', afterHours: true },
  { hour: '02:00', inbound: 78, booked: 'AED 18,400', afterHours: true },
  { hour: '04:00', inbound: 42, booked: 'AED 7,100', afterHours: false },
  { hour: '06:00', inbound: 36, booked: 'AED 5,600', afterHours: false },
];

function DentalTelemetryWidget() {
  const [hoverIdx, setHoverIdx] = useState<number>(4); // Peak at 22:00 after-hours

  const width = 800;
  const height = 220;
  const padL = 36;
  const padR = 28;
  const padT = 40;
  const padB = 34;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const coords = DENTAL_WAVE_POINTS.map((pt, i) => ({
    x: padL + (i / (DENTAL_WAVE_POINTS.length - 1)) * chartW,
    y: padT + chartH - (pt.inbound / 100) * chartH,
    ...pt,
  }));

  const linePath = buildSmoothPath(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padT + chartH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padT + chartH).toFixed(1)} Z`;

  // After-hours spike band (18:00 = idx 2 through 02:00 = idx 6)
  const bandX1 = coords[2].x;
  const bandX2 = coords[6].x;
  const activePt = coords[hoverIdx] || coords[4];

  return (
    <div className="space-y-5">
      {/* Top Grid: 4 Operatory Chair Live Status Cards */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#585A66] font-semibold">
            Live Operatory Chair Telemetry
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#047857] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            4 Chairs Connected · Real-Time PMS Write
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {DENTAL_CHAIRS.map((c) => {
            const isStandby = c.tone === 'standby';
            const isCyan = c.tone === 'cyan';
            return (
              <div
                key={c.chair}
                className={`p-4 rounded-2xl transition-all duration-200 ${
                  isStandby
                    ? 'bg-[#FAFAFA] border border-dashed border-[rgba(0,0,0,0.16)]'
                    : 'bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#585A66]">
                    {c.chair}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold tracking-wider uppercase border ${
                      isStandby
                        ? 'bg-black/[0.04] text-[#585A66] border-[rgba(0,0,0,0.10)]'
                        : isCyan
                        ? 'bg-[#00E5FF]/12 text-[#0E7490] border-[#00E5FF]/40'
                        : 'bg-[#10B981]/12 text-[#047857] border-[#10B981]/35'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isStandby
                          ? 'bg-[#585A66]'
                          : isCyan
                          ? 'bg-[#00E5FF]'
                          : 'bg-[#10B981] animate-pulse'
                      }`}
                    />
                    {c.status}
                  </span>
                </div>

                <div className="mt-2.5 text-sm font-bold text-[#0A0A0A] truncate">
                  {c.patient} &middot; {c.procedure}
                </div>
                <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-[#585A66]">
                  <span>{c.time}</span>
                  {!isStandby && (
                    <span className="text-[#10B981] font-semibold">2-Way Sync</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Chart: SVG Patient Inbound & Conversion Wave */}
      <div className="rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.07)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-sm font-bold text-[#0A0A0A]">
              Patient Inbound &amp; After-Hours Conversion Wave
            </div>
            <div className="text-xs text-[#585A66] mt-0.5">
              Captures after-hours voice spikes (18:00 &ndash; 02:00) when front desk closes
            </div>
          </div>

          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(0,0,0,0.08)] shadow-xs font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="font-bold text-[#0A0A0A]">{activePt.hour}</span>
            <span className="text-[#585A66]">&bull;</span>
            <span className="font-bold text-[#047857]">{activePt.inbound}% Capture</span>
            <span className="text-[#585A66]">&bull;</span>
            <span className="text-[#0A0A0A]">{activePt.booked}</span>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto block select-none"
            role="img"
            aria-label="Patient inbound and after-hours conversion wave between 18:00 and 02:00"
          >
            <defs>
              <linearGradient id="dentalWaveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="55%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="dentalWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
                <stop offset="55%" stopColor="#00E5FF" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="afterHoursBand" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Highlighted After-Hours Spike Window (18:00 to 02:00) */}
            <rect
              x={bandX1}
              y={10}
              width={bandX2 - bandX1}
              height={chartH + 30}
              rx={10}
              fill="url(#afterHoursBand)"
              stroke="rgba(16,185,129,0.22)"
              strokeDasharray="4 4"
            />
            <text
              x={(bandX1 + bandX2) / 2}
              y={25}
              textAnchor="middle"
              fill="#047857"
              fontSize="10"
              fontWeight="700"
              fontFamily="JetBrains Mono, monospace"
            >
              AFTER-HOURS SPIKE WINDOW (18:00 &ndash; 02:00)
            </text>

            {/* Horizontal subtle reference lines */}
            {[25, 50, 75, 100].map((pct) => {
              const y = padT + chartH - (pct / 100) * chartH;
              return (
                <line
                  key={pct}
                  x1={padL}
                  x2={width - padR}
                  y1={y}
                  y2={y}
                  stroke="rgba(0,0,0,0.06)"
                  strokeDasharray="3 4"
                />
              );
            })}

            {/* Area & Smooth Curve */}
            <path d={areaPath} fill="url(#dentalWaveFill)" />
            <path
              d={linePath}
              fill="none"
              stroke="url(#dentalWaveStroke)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Interactive Nodes & Time Axis Labels */}
            {coords.map((pt, i) => {
              const selected = hoverIdx === i;
              return (
                <g
                  key={pt.hour}
                  onMouseEnter={() => setHoverIdx(i)}
                  onClick={() => setHoverIdx(i)}
                  className="cursor-pointer"
                >
                  <rect
                    x={pt.x - 24}
                    y={padT}
                    width={48}
                    height={chartH + 26}
                    fill="transparent"
                  />
                  {selected && (
                    <line
                      x1={pt.x}
                      x2={pt.x}
                      y1={padT}
                      y2={padT + chartH}
                      stroke="rgba(16,185,129,0.4)"
                      strokeDasharray="3 3"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={selected ? 7 : pt.afterHours ? 5 : 4}
                    fill={pt.afterHours ? '#00E5FF' : '#10B981'}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={height - 10}
                    textAnchor="middle"
                    fill={selected || pt.afterHours ? '#0A0A0A' : '#585A66'}
                    fontSize="11"
                    fontWeight={selected || pt.afterHours ? '700' : '500'}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {pt.hour}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. SOLAR EPC YIELD S-CURVE & MARGIN STRIP
// ==========================================
const SOLAR_SCURVE_DATA = [
  { label: 'W1', quotes: 24, signed: 12, yieldPct: '50.0%', kw: '110 kW' },
  { label: 'W2', quotes: 34, signed: 19, yieldPct: '55.8%', kw: '185 kW' },
  { label: 'W3', quotes: 46, signed: 30, yieldPct: '65.2%', kw: '290 kW' },
  { label: 'W4', quotes: 58, signed: 44, yieldPct: '75.8%', kw: '410 kW' },
  { label: 'W5', quotes: 69, signed: 58, yieldPct: '84.0%', kw: '560 kW' },
  { label: 'W6', quotes: 78, signed: 71, yieldPct: '91.0%', kw: '710 kW' },
  { label: 'W7', quotes: 85, signed: 81, yieldPct: '95.2%', kw: '845 kW' },
  { label: 'W8', quotes: 91, signed: 89, yieldPct: '97.8%', kw: '960 kW' },
  { label: 'W9', quotes: 95, signed: 93, yieldPct: '97.9%', kw: '1,090 kW' },
  { label: 'W10', quotes: 99, signed: 98.2, yieldPct: '98.2%', kw: '1,240 kW' },
];

const SOLAR_MARGIN_CARDS = [
  {
    num: '01',
    title: 'Automated Tariff & Roof Sizing',
    detail: 'LESCO/K-Electric Bill OCR',
    metric: '2.1 min avg',
    icon: Zap,
  },
  {
    num: '02',
    title: 'Sub-60s Branded PDF Proposal',
    detail: 'WhatsApp Payload',
    metric: '< 48s sent',
    icon: FileText,
  },
  {
    num: '03',
    title: 'Hardware Gross Margin per installed kW',
    detail: 'Net Contractor Margin / kW',
    metric: '18.5% locked',
    icon: ShieldCheck,
  },
];

function SolarTelemetryWidget() {
  const [activeNode, setActiveNode] = useState<number>(SOLAR_SCURVE_DATA.length - 1);

  const width = 800;
  const height = 225;
  const padL = 42;
  const padR = 52;
  const padT = 32;
  const padB = 34;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const quotePts = SOLAR_SCURVE_DATA.map((d, i) => ({
    x: padL + (i / (SOLAR_SCURVE_DATA.length - 1)) * chartW,
    y: padT + chartH - (d.quotes / 100) * chartH,
  }));

  const signedPts = SOLAR_SCURVE_DATA.map((d, i) => ({
    x: padL + (i / (SOLAR_SCURVE_DATA.length - 1)) * chartW,
    y: padT + chartH - (d.signed / 100) * chartH,
  }));

  const quotePath = buildSmoothPath(quotePts);
  const signedPath = buildSmoothPath(signedPts);
  const signedArea = `${signedPath} L ${signedPts[signedPts.length - 1].x.toFixed(1)} ${(padT + chartH).toFixed(1)} L ${signedPts[0].x.toFixed(1)} ${(padT + chartH).toFixed(1)} Z`;

  const peakPt = signedPts[signedPts.length - 1];
  const currentData = SOLAR_SCURVE_DATA[activeNode] || SOLAR_SCURVE_DATA[SOLAR_SCURVE_DATA.length - 1];

  return (
    <div className="space-y-5">
      {/* Top Interactive S-Curve Area Graph */}
      <div className="rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.07)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-sm font-bold text-[#0A0A0A]">
              Yield S-Curve: Quotes Dispatched vs. Signed Solar Projects
            </div>
            <div className="text-xs text-[#585A66] mt-0.5">
              Hover any week to inspect dispatched quotes against signed kW conversion lock
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
            <span className="inline-flex items-center gap-2 text-[#B45309] font-semibold">
              <span className="w-5 border-t-2 border-dashed border-[#F59E0B]" />
              Quotes Dispatched
            </span>
            <span className="inline-flex items-center gap-2 text-[#C2410C] font-semibold">
              <span className="w-5 h-[2.5px] rounded-full bg-[#FF5722]" />
              Signed Solar Projects
            </span>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto block select-none"
            role="img"
            aria-label="Solar EPC Yield S-Curve showing Quotes Dispatched vs Signed Solar Projects with 98.2% Yield Lock"
          >
            <defs>
              <linearGradient id="solarAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF5722" stopOpacity="0.28" />
                <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="solarSplineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FF5722" />
              </linearGradient>
            </defs>

            {/* Reference horizontal lines */}
            {[25, 50, 75, 100].map((pct) => {
              const y = padT + chartH - (pct / 100) * chartH;
              return (
                <g key={pct}>
                  <line
                    x1={padL}
                    x2={width - padR}
                    y1={y}
                    y2={y}
                    stroke="rgba(0,0,0,0.06)"
                    strokeDasharray="3 4"
                  />
                  <text
                    x={padL - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="#585A66"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {pct}%
                  </text>
                </g>
              );
            })}

            {/* Dashed Amber Quotes Dispatched Line */}
            <path
              d={quotePath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />

            {/* Signed Projects Area + Neon Orange Spline */}
            <path d={signedArea} fill="url(#solarAreaGrad)" />
            <path
              d={signedPath}
              fill="none"
              stroke="url(#solarSplineStroke)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Glowing Peak Dot at 98.2% Yield Lock */}
            <circle cx={peakPt.x} cy={peakPt.y} r="13" fill="rgba(255,87,34,0.18)" />
            <circle cx={peakPt.x} cy={peakPt.y} r="7" fill="#FF5722" stroke="#FFFFFF" strokeWidth="2.5" />
            <rect
              x={peakPt.x - 134}
              y={peakPt.y - 26}
              width="122"
              height="22"
              rx="11"
              fill="#0A0A0A"
            />
            <text
              x={peakPt.x - 73}
              y={peakPt.y - 11.5}
              textAnchor="middle"
              fill="#F59E0B"
              fontSize="10.5"
              fontWeight="700"
              fontFamily="JetBrains Mono, monospace"
            >
              98.2% Yield Lock
            </text>

            {/* Interactive checkpoints */}
            {SOLAR_SCURVE_DATA.map((d, i) => {
              const sPt = signedPts[i];
              const qPt = quotePts[i];
              const isSelected = activeNode === i;
              return (
                <g
                  key={d.label}
                  onMouseEnter={() => setActiveNode(i)}
                  onClick={() => setActiveNode(i)}
                  className="cursor-pointer"
                >
                  <rect
                    x={sPt.x - 20}
                    y={padT}
                    width={40}
                    height={chartH + 26}
                    fill="transparent"
                  />
                  {isSelected && (
                    <line
                      x1={sPt.x}
                      x2={sPt.x}
                      y1={padT}
                      y2={padT + chartH}
                      stroke="rgba(255,87,34,0.35)"
                      strokeDasharray="3 3"
                    />
                  )}
                  <circle
                    cx={qPt.x}
                    cy={qPt.y}
                    r={isSelected ? 4.5 : 3}
                    fill="#F59E0B"
                  />
                  <circle
                    cx={sPt.x}
                    cy={sPt.y}
                    r={isSelected ? 6 : 3.5}
                    fill="#FF5722"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                  />
                  <text
                    x={sPt.x}
                    y={height - 10}
                    textAnchor="middle"
                    fill={isSelected ? '#0A0A0A' : '#585A66'}
                    fontSize="11"
                    fontWeight={isSelected ? '700' : '500'}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Week Summary Strip */}
        <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.06)] flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <span className="text-[#585A66]">
            Checkpoint <strong className="text-[#0A0A0A]">{currentData.label}</strong> &middot;{' '}
            {currentData.kw} Pipeline
          </span>
          <span className="font-bold text-[#C2410C]">
            Quotes: {currentData.quotes} &rarr; Signed Yield: {currentData.yieldPct}
          </span>
        </div>
      </div>

      {/* Bottom Margin Strip: 3 Micro-Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {SOLAR_MARGIN_CARDS.map((card) => {
          const CardIcon = card.icon;
          return (
            <div
              key={card.num}
              className="p-4 rounded-2xl bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_6px_20px_rgba(0,0,0,0.03)] flex items-start gap-3.5 hover:-translate-y-0.5 transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/12 border border-[#F59E0B]/30 text-[#B45309] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                {card.num}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-bold text-[#0A0A0A] leading-snug">
                    {card.title}
                  </span>
                  <CardIcon className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 font-mono text-[11px]">
                  <span className="text-[#585A66] truncate">{card.detail}</span>
                  <span className="font-bold text-[#C2410C] shrink-0">{card.metric}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 3. HR STEPPED FUNNEL & LATENCY WATERFALL
// ==========================================
const HR_FUNNEL_STAGES = [
  {
    stage: 'Stage 1',
    title: 'Inbound Lead Intake',
    metricText: '1,240 applicants · 100%',
    pct: 100,
    latency: '0.3s SIP Trigger',
    note: 'Voice & WhatsApp inbound threads captured across job portals',
  },
  {
    stage: 'Stage 2',
    title: 'Autonomous Voice Phone Screen',
    metricText: '1,080 qualified · 87.1%',
    pct: 87.1,
    latency: '14.2s Screen Sync',
    note: 'Bilingual AI screens notice period, location & salary floor',
  },
  {
    stage: 'Stage 3',
    title: 'WhatsApp CV & Notice Period Parsed',
    metricText: '640 slotted · 51.6%',
    pct: 51.6,
    latency: '28.5s OCR Parse',
    note: 'Resume PDF extracted, scored & attached to candidate profile',
  },
  {
    stage: 'Stage 4',
    title: 'Recruiter Calendar Direct Lock',
    metricText: '480 confirmed · 38.7%',
    pct: 38.7,
    latency: '41.0s ATS Push',
    note: 'Locked directly onto recruiter calendar via ATS webhook',
  },
];

function HrTelemetryWidget() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* Left 8 cols: 4-Stage Candidate Progression Funnel */}
      <div className="lg:col-span-8 rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.07)] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[rgba(0,0,0,0.07)]">
          <div>
            <div className="text-sm font-bold text-[#0A0A0A]">
              4-Stage Candidate Progression Funnel
            </div>
            <div className="text-xs text-[#585A66] mt-0.5">
              End-to-end automated screening without manual phone tag
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 font-mono text-[11px] font-bold text-[#6D28D9]">
            <Sparkles className="w-3 h-3" />
            94.2% Role Match
          </span>
        </div>

        <div className="space-y-3.5">
          {HR_FUNNEL_STAGES.map((item, idx) => (
            <div
              key={item.stage}
              className="p-3.5 rounded-xl bg-white border border-[rgba(0,0,0,0.07)] space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#8B5CF6]/12 border border-[#8B5CF6]/25 font-mono text-[10px] font-bold uppercase text-[#6D28D9]">
                    {item.stage}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#0A0A0A]">
                    {item.title}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[#6D28D9]">
                  {item.metricText}
                </span>
              </div>

              {/* Glowing Horizontal Progress Bar */}
              <div className="h-3 w-full rounded-full bg-[#F6F7F9] overflow-hidden border border-[rgba(0,0,0,0.05)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 0.65, delay: idx * 0.08, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #8B5CF6 0%, #C084FC 100%)',
                    boxShadow: '0 0 14px rgba(139, 92, 246, 0.35)',
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#585A66]">
                <span>{item.note}</span>
                <span className="font-mono font-semibold text-[#0A0A0A]">
                  {item.latency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right 4 cols: ATS Webhook Sync Latency Waterfall */}
      <div className="lg:col-span-4 rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.07)] p-5 flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(0,0,0,0.07)]">
          <span className="text-sm font-bold text-[#0A0A0A]">Latency Waterfall</span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#6D28D9]">
            <Clock className="w-3.5 h-3.5" /> &lt; 45s Total
          </span>
        </div>

        <div className="space-y-3 flex-1">
          {[
            { icon: PhoneCall, step: 'SIP Voice Capture', offsetPct: 0, widthPct: 18, time: '0.3s' },
            { icon: Sparkles, step: 'AI Role Scoring', offsetPct: 14, widthPct: 32, time: '14.2s' },
            { icon: FileText, step: 'WhatsApp CV Parse', offsetPct: 38, widthPct: 36, time: '28.5s' },
            { icon: CalendarCheck, step: 'ATS + Calendar Lock', offsetPct: 68, widthPct: 32, time: '41.0s' },
          ].map((wf) => {
            const StepIcon = wf.icon;
            return (
              <div
                key={wf.step}
                className="p-3 rounded-xl bg-white border border-[rgba(0,0,0,0.07)] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#0A0A0A]">
                    <StepIcon className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    {wf.step}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#6D28D9]">{wf.time}</span>
                </div>
                <div className="relative h-2 rounded-full bg-[#F6F7F9] overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full"
                    style={{
                      left: `${wf.offsetPct}%`,
                      width: `${wf.widthPct}%`,
                      background: 'linear-gradient(90deg, #8B5CF6, #C084FC)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 rounded-xl bg-[#0A0A0A] text-white text-xs flex items-center justify-between">
          <span className="text-zinc-300">Greenhouse / Bullhorn</span>
          <span className="font-mono font-bold text-[#C084FC] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC]" /> Webhook Verified
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN EXPORT: COMMAND CENTER SECTION
// ==========================================
export default function CommandCenterSection() {
  const { config } = useSiteConfig();
  const telemetry = config.telemetry;
  const sectors = telemetry.sectors;

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progressPct, setProgressPct] = useState(0);

  const safeIdx = activeIdx % Math.max(1, sectors.length);
  const activeSector = sectors[safeIdx] || sectors[0];
  const palette = getNichePalette(activeSector.id);

  const cycleMs = Math.max(2000, (telemetry.autoCycleSeconds || 4) * 1000);
  const isPaused = isPausedByUser || isHovered || sectors.length <= 1;

  // Smooth 4-second auto-rotation loop with countdown progress indicator
  useEffect(() => {
    if (isPaused) return;

    const tickMs = 50;
    const increment = (tickMs / cycleMs) * 100;

    const intervalId = setInterval(() => {
      setProgressPct((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          setActiveIdx((cur) => (cur + 1) % sectors.length);
          return 0;
        }
        return next;
      });
    }, tickMs);

    return () => clearInterval(intervalId);
  }, [isPaused, cycleMs, sectors.length]);

  const handleTabClick = useCallback((idx: number) => {
    setActiveIdx(idx);
    setProgressPct(0);
    setIsPausedByUser(true);
  }, []);

  const togglePlayPause = () => {
    setIsPausedByUser((prev) => !prev);
  };

  const bookingUrl =
    config.branding.calendarBookingUrl || 'https://calendar.app.google/u5vL88X41qmGBCky5';
  const contactEmail = config.branding.contactEmail || 'contact@zavianlabs.com';

  return (
    <section
      id="command-center"
      className="relative w-full bg-[#FFFFFF] text-[#0A0A0A] pt-20 pb-24 sm:pt-28 sm:pb-28 px-5 sm:px-8 border-t border-[rgba(0,0,0,0.07)] scroll-mt-20 overflow-hidden"
    >
      {/* Compatibility anchor */}
      <div id="dashboards" className="scroll-mt-20 pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto space-y-10">
        
        {/* Header & Sector Tabs with Countdown Progress Indicator */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-[660px]">
            <h2
              className="font-serif-instrument font-normal text-[#0A0A0A] tracking-[-0.02em] leading-[1.02]"
              style={{ fontSize: 'clamp(38px, 4.8vw, 68px)' }}
            >
              {telemetry.sectionTitle}{' '}
              <span className="italic" style={{ color: palette.primary }}>
                {telemetry.sectionTitleAccent}
              </span>
            </h2>
            <p className="mt-4 max-w-[580px] text-[15.5px] sm:text-base leading-[1.6] text-[#585A66]">
              {telemetry.sectionDescription}
            </p>
          </div>

          {/* 3-Sector Selector Strip with Embedded Countdown Progress Bar */}
          <div
            role="tablist"
            aria-label="Command Center Sector Metrics"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="inline-flex flex-wrap items-center gap-2 self-start lg:self-auto p-1.5 rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.08)] shadow-[0_6px_20px_rgba(0,0,0,0.03)]"
          >
            {sectors.map((sec, idx) => {
              const Icon = getSectorIcon(sec.id);
              const isSelected = safeIdx === idx;
              const tabPalette = getNichePalette(sec.id);

              return (
                <button
                  key={sec.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleTabClick(idx)}
                  onMouseEnter={() => setIsHovered(true)}
                  className={`relative overflow-hidden inline-flex flex-col items-start px-4 sm:px-5 pt-2.5 pb-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A0A0A] text-white shadow-md'
                      : 'text-[#585A66] hover:text-[#0A0A0A] hover:bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon
                      className="w-4 h-4 shrink-0"
                    />
                    <span>{sec.label}</span>
                  </span>

                  {/* Progress Indicator Bar Under Active Sector Tab */}
                  <span className="absolute left-0 right-0 bottom-0 h-[3px] bg-black/10 overflow-hidden">
                    {isSelected && (
                      <span
                        className="block h-full transition-[width] duration-75 ease-linear"
                        style={{
                          width: `${isPaused ? Math.max(progressPct, 12) : progressPct}%`,
                          background: `linear-gradient(90deg, ${tabPalette.primary}, ${tabPalette.secondary})`,
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Command Center Surface (Pauses cleanly on hover for inspection) */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="rounded-[28px] border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 sm:p-8 space-y-7"
        >
          
          {/* Top Status Row + Auto-Rotation Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[rgba(0,0,0,0.07)]">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider border"
              style={{
                backgroundColor: palette.badgeBg,
                borderColor: palette.badgeBorder,
                color: palette.badgeText,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: palette.dotBg }}
              />
              <span>{activeSector.badgeLabel}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlayPause}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAFAFA] border border-[rgba(0,0,0,0.08)] font-mono text-[11px] text-[#585A66] hover:text-[#0A0A0A] transition-colors cursor-pointer"
              >
                {isPausedByUser ? (
                  <>
                    <Play className="w-3 h-3" style={{ color: palette.primary }} />
                    <span>Paused &bull; Resume Auto-Loop</span>
                  </>
                ) : isHovered ? (
                  <>
                    <Pause className="w-3 h-3" style={{ color: palette.primary }} />
                    <span>Hover Inspecting (Paused)</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3" style={{ color: palette.primary }} />
                    <span>Auto-Looping Every {telemetry.autoCycleSeconds || 4}s</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSector.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24 }}
              className="space-y-7"
            >
              {/* 4 Niche KPI Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeSector.kpis.map((kpi, idx) => (
                  <div
                    key={`${activeSector.id}-kpi-${idx}`}
                    className="p-5 rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.07)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#585A66]">
                      {kpi.label}
                    </div>
                    <div
                      className="mt-2 font-serif-instrument text-4xl sm:text-[42px] leading-none"
                      style={{
                        color:
                          idx === 1
                            ? palette.primary
                            : idx === 2
                            ? palette.badgeText
                            : '#0A0A0A',
                      }}
                    >
                      {kpi.value}
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#585A66]">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color: palette.primary }} />
                      <span>{kpi.delta}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Distinct Niche Visual Graph Engine */}
              {activeSector.id === 'solar' ? (
                <SolarTelemetryWidget />
              ) : activeSector.id === 'hr' ? (
                <HrTelemetryWidget />
              ) : (
                <DentalTelemetryWidget />
              )}
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Executive Closing CTA Card on Pure White #FFFFFF */}
        <div className="relative overflow-hidden rounded-[32px] border border-[rgba(0,0,0,0.07)] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] px-6 sm:px-12 py-12 sm:py-16 text-center">
          <div
            className="pointer-events-none absolute left-1/2 -top-1/2 -translate-x-1/2 w-[620px] h-[620px] rounded-full blur-3xl opacity-35"
            style={{
              background:
                'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(16,185,129,0.08) 45%, transparent 70%)',
            }}
          />

          <h2
            className="relative font-serif-instrument font-normal text-[#0A0A0A] max-w-[780px] mx-auto tracking-[-0.02em] leading-[1.02]"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}
          >
            Let&apos;s build the system your business{' '}
            <span className="italic chrome-text-light-bg">actually needs.</span>
          </h2>

          <p className="relative mt-4 max-w-[540px] mx-auto text-[15.5px] sm:text-base text-[#585A66] leading-relaxed">
            Tell us how leads reach your team today. We&apos;ll show you a practical plan for voice, WhatsApp, and live dashboards.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="zl-btn inline-flex items-center gap-2 min-h-[52px] px-8 rounded-full bg-[#0A0A0A] hover:bg-[#1F2024] text-white font-semibold text-[15px] shadow-[0_12px_30px_rgba(0,0,0,0.16)] cursor-pointer"
            >
              <span>Book Discovery Call</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={`mailto:${contactEmail}`}
              className="zl-btn inline-flex items-center min-h-[52px] px-8 rounded-full border border-[rgba(0,0,0,0.14)] bg-white hover:border-[#0A0A0A] text-[#0A0A0A] font-semibold text-[15px] cursor-pointer"
            >
              {contactEmail}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export const TelemetrySection = CommandCenterSection;
