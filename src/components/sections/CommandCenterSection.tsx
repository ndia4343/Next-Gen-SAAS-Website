'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smile,
  Sun,
  Briefcase,
  TrendingUp,
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
  Info,
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
// 1. CLINIC TREATMENT ROOMS + INQUIRY WAVE (ILLUSTRATIVE DEMO)
// ==========================================
const TREATMENT_ROOMS = [
  {
    room: 'Treatment Room 01',
    patient: 'Farah Al-Hashimi',
    procedure: 'Aligners Consult',
    status: 'BOOKED',
    tone: 'mint' as const,
    time: 'Thu 6:00 PM',
  },
  {
    room: 'Treatment Room 02',
    patient: 'Marcus Vance',
    procedure: '3D Scan + Review',
    status: 'SYNCED',
    tone: 'cyan' as const,
    time: 'Fri 4:30 PM',
  },
  {
    room: 'Treatment Room 03',
    patient: 'David Wright',
    procedure: 'Consultation',
    status: 'CONFIRMED',
    tone: 'mint' as const,
    time: 'Sat 10:30 AM',
  },
  {
    room: 'Appointment Slot 04',
    patient: 'Open Slot',
    procedure: 'Ready for booking',
    status: 'OPEN',
    tone: 'standby' as const,
    time: 'Available',
  },
];

const CLINIC_WAVE_POINTS = [
  { hour: '14:00', inbound: 32, booked: 'AED 4,200 (sample)', afterHours: false },
  { hour: '16:00', inbound: 44, booked: 'AED 6,800 (sample)', afterHours: false },
  { hour: '18:00', inbound: 72, booked: 'AED 14,500 (sample)', afterHours: true },
  { hour: '20:00', inbound: 88, booked: 'AED 24,200 (sample)', afterHours: true },
  { hour: '22:00', inbound: 96, booked: 'AED 31,400 (sample)', afterHours: true },
  { hour: '00:00', inbound: 89, booked: 'AED 26,900 (sample)', afterHours: true },
  { hour: '02:00', inbound: 78, booked: 'AED 18,400 (sample)', afterHours: true },
  { hour: '04:00', inbound: 42, booked: 'AED 7,100 (sample)', afterHours: false },
  { hour: '06:00', inbound: 36, booked: 'AED 5,600 (sample)', afterHours: false },
];

function ClinicTelemetryWidget() {
  const [hoverIdx, setHoverIdx] = useState<number>(4);

  const width = 800;
  const height = 220;
  const padL = 36;
  const padR = 28;
  const padT = 40;
  const padB = 34;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const coords = CLINIC_WAVE_POINTS.map((pt, i) => ({
    x: padL + (i / (CLINIC_WAVE_POINTS.length - 1)) * chartW,
    y: padT + chartH - (pt.inbound / 100) * chartH,
    ...pt,
  }));

  const linePath = buildSmoothPath(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padT + chartH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padT + chartH).toFixed(1)} Z`;

  const bandX1 = coords[2].x;
  const bandX2 = coords[6].x;
  const activePt = coords[hoverIdx] || coords[4];

  return (
    <div className="space-y-5">
      {/* Top Grid: 4 Sample Treatment Room Cards */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#585A66] font-semibold">
            Sample Treatment Room Schedule
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#047857] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Sample Calendar View · Syncs with Google Calendar &amp; Cal.com
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {TREATMENT_ROOMS.map((c) => {
            const isStandby = c.tone === 'standby';
            const isCyan = c.tone === 'cyan';
            return (
              <div
                key={c.room}
                className={`p-4 rounded-2xl transition-all duration-200 ${
                  isStandby
                    ? 'bg-[#FAFAFA] border border-dashed border-[rgba(0,0,0,0.16)]'
                    : 'bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#585A66]">
                    {c.room}
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
                          : 'bg-[#10B981]'
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
                    <span className="text-[#10B981] font-semibold">Calendar Synced</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Chart: Sample Patient Inquiry & After-Hours Wave */}
      <div className="rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.07)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-sm font-bold text-[#0A0A0A]">
              Sample Inquiry &amp; After-Hours Call Curve
            </div>
            <div className="text-xs text-[#585A66] mt-0.5">
              Illustrative demo showing how evening and weekend calls (18:00 &ndash; 02:00) are answered and tracked
            </div>
          </div>

          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(0,0,0,0.08)] shadow-xs font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="font-bold text-[#0A0A0A]">{activePt.hour}</span>
            <span className="text-[#585A66]">&bull;</span>
            <span className="font-bold text-[#047857]">{activePt.inbound}% Sample Activity</span>
            <span className="text-[#585A66]">&bull;</span>
            <span className="text-[#0A0A0A]">{activePt.booked}</span>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto block select-none"
            role="img"
            aria-label="Illustrative after-hours clinic inquiry and booking sample curve"
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
              EVENING &amp; AFTER-HOURS WINDOW (18:00 &ndash; 02:00)
            </text>

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

            <path d={areaPath} fill="url(#dentalWaveFill)" />
            <path
              d={linePath}
              fill="none"
              stroke="url(#dentalWaveStroke)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

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
// 2. SOLAR PIPELINE SAMPLE CURVE (SECONDARY)
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
    title: 'Utility Bill & System Sizing',
    detail: 'Sample tariff review',
    metric: '2.1 min avg',
    icon: Zap,
  },
  {
    num: '02',
    title: 'Branded PDF Quote Follow-Up',
    detail: 'Sent in WhatsApp',
    metric: 'Instant send',
    icon: FileText,
  },
  {
    num: '03',
    title: 'Example Gross Margin Preview',
    detail: 'Estimated hardware margin / kW',
    metric: '18.5% sample',
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
      <div className="rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.07)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-sm font-bold text-[#0A0A0A]">
              Sample Solar Pipeline: Quotes Sent vs. Site Surveys Booked
            </div>
            <div className="text-xs text-[#585A66] mt-0.5">
              Illustrative demo · hover any week to preview sample pipeline tracking
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
            <span className="inline-flex items-center gap-2 text-[#B45309] font-semibold">
              <span className="w-5 border-t-2 border-dashed border-[#F59E0B]" />
              Sample Quotes Sent
            </span>
            <span className="inline-flex items-center gap-2 text-[#C2410C] font-semibold">
              <span className="w-5 h-[2.5px] rounded-full bg-[#FF5722]" />
              Sample Bookings
            </span>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto block select-none"
            role="img"
            aria-label="Illustrative Solar Pipeline sample curve"
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

            <path
              d={quotePath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />

            <path d={signedArea} fill="url(#solarAreaGrad)" />
            <path
              d={signedPath}
              fill="none"
              stroke="url(#solarSplineStroke)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

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
              Sample Peak: 98%
            </text>

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
                  <circle cx={qPt.x} cy={qPt.y} r={isSelected ? 4.5 : 3} fill="#F59E0B" />
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

        <div className="mt-3 pt-3 border-t border-[rgba(0,0,0,0.06)] flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <span className="text-[#585A66]">
            Sample Week <strong className="text-[#0A0A0A]">{currentData.label}</strong> &middot;{' '}
            {currentData.kw} Sample Volume
          </span>
          <span className="font-bold text-[#C2410C]">
            Sample Quotes: {currentData.quotes} &rarr; Example Share: {currentData.yieldPct}
          </span>
        </div>
      </div>

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
// 3. HR & RECRUITMENT SAMPLE FUNNEL (SECONDARY)
// ==========================================
const HR_FUNNEL_STAGES = [
  {
    stage: 'Step 1',
    title: 'Inbound Candidate Inquiry',
    metricText: '1,240 sample applicants',
    pct: 100,
    timing: 'Phone & WhatsApp',
    note: 'Answers candidate calls and job questions around the clock',
  },
  {
    stage: 'Step 2',
    title: 'Initial Phone Screen',
    metricText: '1,080 pre-screened (87%)',
    pct: 87.1,
    timing: 'Notice & Salary Check',
    note: 'Confirms availability, notice period, and location fit',
  },
  {
    stage: 'Step 3',
    title: 'WhatsApp CV Collection',
    metricText: '640 CVs collected (52%)',
    pct: 51.6,
    timing: 'CV Attached',
    note: 'Collects candidate CV and notes before the interview',
  },
  {
    stage: 'Step 4',
    title: 'Recruiter Calendar Booking',
    metricText: '480 booked calls (39%)',
    pct: 38.7,
    timing: 'Calendar Synced',
    note: 'Books suitable applicants onto your recruiter calendar',
  },
];

function HrTelemetryWidget() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      <div className="lg:col-span-8 rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.07)] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[rgba(0,0,0,0.07)]">
          <div>
            <div className="text-sm font-bold text-[#0A0A0A]">
              Sample Candidate Screening Flow
            </div>
            <div className="text-xs text-[#585A66] mt-0.5">
              Illustrative demo · screens applicants and books recruiter interviews without phone tag
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 font-mono text-[11px] font-bold text-[#6D28D9]">
            <Sparkles className="w-3 h-3" />
            Sample Screening View
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
                  {item.timing}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.07)] p-5 flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(0,0,0,0.07)]">
          <span className="text-sm font-bold text-[#0A0A0A]">Handover Timeline</span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#6D28D9]">
            <Clock className="w-3.5 h-3.5" /> Under 1 min
          </span>
        </div>

        <div className="space-y-3 flex-1">
          {[
            { icon: PhoneCall, step: 'Call Picked Up', offsetPct: 0, widthPct: 18, time: 'Instant' },
            { icon: Sparkles, step: 'Questions Asked', offsetPct: 14, widthPct: 32, time: 'Notice & Pay' },
            { icon: FileText, step: 'CV Collected in Chat', offsetPct: 38, widthPct: 36, time: 'WhatsApp' },
            { icon: CalendarCheck, step: 'Recruiter Booked', offsetPct: 68, widthPct: 32, time: 'Calendar Sync' },
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
          <span className="text-zinc-300">Recruiter Calendar</span>
          <span className="font-mono font-bold text-[#C084FC] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC]" /> Two-Way Sync
          </span>
        </div>
      </div>
    </div>
  );
}

const SECTOR_PRIORITY: Record<string, number> = {
  dental: 0,
  solar: 1,
  hr: 2,
};

const DEFAULT_DASHBOARD_DESCRIPTION =
  'A clear view of after-hours call volume, booked treatment rooms, and front-desk time saved—syncing directly with your Google Calendar or scheduling software.';

// ==========================================
// MAIN EXPORT: COMMAND CENTER SECTION
// ==========================================
export default function CommandCenterSection() {
  const { config } = useSiteConfig();
  const telemetry = config.telemetry;
  const dashboardDescription =
    !telemetry.sectionDescription ||
    telemetry.sectionDescription.startsWith('Every missed call')
      ? DEFAULT_DASHBOARD_DESCRIPTION
      : telemetry.sectionDescription;

  // Enforce clinic-first sector ordering: Dental & Aesthetics first (default index 0)
  const sectors = [...telemetry.sectors].sort(
    (a, b) => (SECTOR_PRIORITY[a.id] ?? 99) - (SECTOR_PRIORITY[b.id] ?? 99)
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [progressPct, setProgressPct] = useState(0);

  // Respect user's prefers-reduced-motion setting
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Sync sector if user clicks a secondary anchor from the Hero or Demo section
  useEffect(() => {
    const onSelectIndustry = (e: Event) => {
      const targetId = (e as CustomEvent<string>).detail;
      const foundIdx = sectors.findIndex((s) => s.id === targetId);
      if (foundIdx >= 0) {
        setActiveIdx(foundIdx);
        setProgressPct(0);
        setIsPausedByUser(true);
      }
    };
    window.addEventListener('zavian:select-industry', onSelectIndustry);
    return () => window.removeEventListener('zavian:select-industry', onSelectIndustry);
  }, [sectors]);

  const safeIdx = activeIdx % Math.max(1, sectors.length);
  const activeSector = sectors[safeIdx] || sectors[0];
  const palette = getNichePalette(activeSector.id);

  const cycleMs = Math.max(2000, (telemetry.autoCycleSeconds || 4) * 1000);
  const loopHalted = isPausedByUser || isPaused || prefersReducedMotion || sectors.length <= 1;

  useEffect(() => {
    if (loopHalted) return;

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
  }, [loopHalted, cycleMs, sectors.length]);

  const handleTabClick = useCallback((idx: number) => {
    setActiveIdx(idx);
    setProgressPct(0);
    setIsPausedByUser(true);
  }, []);

  const togglePlayPause = () => {
    setIsPausedByUser((prev) => !prev);
  };

  // Simplify to 3 clear sample metrics per sector
  const displayKpis = (activeSector.kpis || []).slice(0, 3);

  return (
    <section
      id="command-center"
      className="relative w-full bg-[#FFFFFF] text-[#0A0A0A] pt-20 pb-20 sm:pt-28 sm:pb-24 px-5 sm:px-8 border-t border-[rgba(0,0,0,0.07)] scroll-mt-20 overflow-hidden"
    >
      {/* Compatibility anchor */}
      <div id="dashboards" className="scroll-mt-20 pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto space-y-10">
        
        {/* Clinic-First Header & Sector Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-[660px]">
            <h2
              className="font-serif-instrument font-normal text-[#0A0A0A] tracking-[-0.02em] leading-[1.02]"
              style={{ fontSize: 'clamp(36px, 4.8vw, 68px)' }}
            >
              {telemetry.sectionTitle}{' '}
              <span className="italic" style={{ color: palette.primary }}>
                {telemetry.sectionTitleAccent}
              </span>
            </h2>
            <p className="mt-4 max-w-[580px] text-[15.5px] sm:text-base leading-[1.6] text-[#585A66]">
              {dashboardDescription}
            </p>
          </div>

          {/* Clinic-First Tabs (Dental Primary, Solar & HR Secondary with "Also available") */}
          <div
            role="tablist"
            aria-label="Preview sample dashboard by sector"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="inline-flex flex-wrap items-center gap-2 self-start lg:self-auto p-1.5 rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.08)] shadow-[0_6px_20px_rgba(0,0,0,0.03)]"
          >
            {sectors.map((sec, idx) => {
              const Icon = getSectorIcon(sec.id);
              const isSelected = safeIdx === idx;
              const tabPalette = getNichePalette(sec.id);
              const isPrimaryClinic = sec.id === 'dental';
              const showSecondaryPill = sec.id === 'solar' || sec.id === 'hr';

              return (
                <button
                  key={sec.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleTabClick(idx)}
                  onMouseEnter={() => setIsPaused(true)}
                  className={`relative overflow-hidden inline-flex flex-col items-start rounded-xl transition-all cursor-pointer ${
                    isPrimaryClinic
                      ? isSelected
                        ? 'px-4 sm:px-5 pt-2.5 pb-3 bg-[#0A0A0A] text-white text-xs sm:text-sm font-semibold shadow-md'
                        : 'px-4 sm:px-5 pt-2.5 pb-3 bg-white border border-[#10B981]/35 text-[#0A0A0A] text-xs sm:text-sm font-semibold hover:bg-[#FAFAFA]'
                      : isSelected
                      ? 'px-3.5 sm:px-4 pt-2 pb-2.5 bg-[#0A0A0A] text-white text-xs sm:text-sm font-medium shadow-md'
                      : 'px-3.5 sm:px-4 pt-2 pb-2.5 text-[#585A66] hover:text-[#0A0A0A] hover:bg-white text-xs sm:text-sm font-medium'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{sec.label}</span>
                    {showSecondaryPill && (
                      <span
                        className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-white/15 text-zinc-200'
                            : 'bg-black/[0.05] text-[#585A66]'
                        }`}
                      >
                        Also available
                      </span>
                    )}
                  </span>

                  <span className="absolute left-0 right-0 bottom-0 h-[3px] bg-black/10 overflow-hidden">
                    {isSelected && (
                      <span
                        className="block h-full transition-[width] duration-75 ease-linear"
                        style={{
                          width: `${loopHalted ? Math.max(progressPct, 14) : progressPct}%`,
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
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="rounded-[28px] border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 sm:p-8 space-y-7"
        >
          
          {/* Top Status Row + Explicit Demo Honesty Caption + Auto-Loop Control */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[rgba(0,0,0,0.07)]">
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: palette.badgeBg,
                  borderColor: palette.badgeBorder,
                  color: palette.badgeText,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: palette.dotBg }}
                />
                <span>{activeSector.badgeLabel}</span>
              </div>

              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#585A66]">
                <Info className="w-3.5 h-3.5 text-[#585A66] shrink-0" />
                <span>Illustrative demo &middot; sample data, not client results</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlayPause}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAFAFA] border border-[rgba(0,0,0,0.08)] font-mono text-[11px] text-[#585A66] hover:text-[#0A0A0A] transition-colors cursor-pointer"
              >
                {prefersReducedMotion ? (
                  <>
                    <Pause className="w-3 h-3" style={{ color: palette.primary }} />
                    <span>Static View (Reduced Motion)</span>
                  </>
                ) : isPausedByUser ? (
                  <>
                    <Play className="w-3 h-3" style={{ color: palette.primary }} />
                    <span>Paused &bull; Resume Preview</span>
                  </>
                ) : isPaused ? (
                  <>
                    <Pause className="w-3 h-3" style={{ color: palette.primary }} />
                    <span>Paused While Inspecting</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3" style={{ color: palette.primary }} />
                    <span>Preview Switching Every {telemetry.autoCycleSeconds || 4}s</span>
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
              transition={{ duration: prefersReducedMotion ? 0 : 0.24 }}
              className="space-y-7"
            >
              {/* 3 Clear Sample Metric Cards with Honest Disclaimers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayKpis.map((kpi, idx) => (
                  <div
                    key={`${activeSector.id}-kpi-${idx}`}
                    title="Example numbers to show what your dashboard will track."
                    className="p-5 rounded-2xl bg-[#FAFAFA] border border-[rgba(0,0,0,0.07)] transition-transform duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#585A66]">
                        {kpi.label}
                      </div>
                      <div
                        className="mt-2 font-serif-instrument text-4xl sm:text-[44px] leading-none"
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
                    </div>
                    <p className="mt-3 text-[11.5px] leading-snug text-[#585A66]">
                      Example numbers to show what your dashboard will track.
                    </p>
                  </div>
                ))}
              </div>

              {/* Sector Sample Panel */}
              {activeSector.id === 'solar' ? (
                <SolarTelemetryWidget />
              ) : activeSector.id === 'hr' ? (
                <HrTelemetryWidget />
              ) : (
                <ClinicTelemetryWidget />
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}

export const TelemetrySection = CommandCenterSection;
