'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smile,
  Sun,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  FileText,
  Calculator,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

const BOOKING_URL = 'https://calendar.app.google/u5vL88X41qmGBCky5';

type DashboardSector = 'dental' | 'solar';

interface DentalDayBar {
  day: string;
  voice: number;
  wa: number;
  occupancy: number;
  revenue: string;
  isPeak?: boolean;
}

const DENTAL_WEEKLY: DentalDayBar[] = [
  { day: 'Mon', voice: 11, wa: 14, occupancy: 74, revenue: 'AED 28,400' },
  { day: 'Tue', voice: 14, wa: 18, occupancy: 82, revenue: 'AED 34,200' },
  { day: 'Wed', voice: 16, wa: 21, occupancy: 88, revenue: 'AED 39,600' },
  { day: 'Thu', voice: 17, wa: 22, occupancy: 91, revenue: 'AED 41,800' },
  { day: 'Fri', voice: 12, wa: 16, occupancy: 79, revenue: 'AED 27,600' },
  { day: 'Sat', voice: 19, wa: 24, occupancy: 98, revenue: 'AED 46,800', isPeak: true },
];

const CONFIRMED_CHAIRS = [
  { name: 'Farah Al-Hashimi', room: 'Operatory 2 • Aligner Scan', value: 'AED 3,800', time: '14m ago' },
  { name: 'James Miller', room: 'Operatory 1 • Veneer Review', value: 'AED 1,250', time: '31m ago' },
  { name: 'David Wright', room: 'Suite 3 • Emergency Polish', value: 'AED 1,850', time: '52m ago' },
];

interface SolarPeriodBar {
  period: string;
  inquiries: number;
  quotes: number;
  won: number;
  kwSigned: string;
  pipelineVal: string;
}

const SOLAR_PIPELINE: SolarPeriodBar[] = [
  { period: 'Wk 1', inquiries: 18, quotes: 12, won: 5, kwSigned: '62 kW', pipelineVal: 'Rs 6.4M' },
  { period: 'Wk 2', inquiries: 22, quotes: 14, won: 6, kwSigned: '78 kW', pipelineVal: 'Rs 7.9M' },
  { period: 'Wk 3', inquiries: 25, quotes: 16, won: 8, kwSigned: '104 kW', pipelineVal: 'Rs 10.2M' },
  { period: 'Wk 4', inquiries: 24, quotes: 15, won: 7, kwSigned: '88 kW', pipelineVal: 'Rs 8.8M' },
  { period: 'Wk 5', inquiries: 26, quotes: 17, won: 8, kwSigned: '112 kW', pipelineVal: 'Rs 9.4M' },
  { period: 'Wk 6', inquiries: 27, quotes: 19, won: 9, kwSigned: '124 kW', pipelineVal: 'Rs 11.8M' },
];

export default function CommandCenterSection() {
  const [sector, setSector] = useState<DashboardSector>('dental');
  const [selectedDentalDay, setSelectedDentalDay] = useState<number>(5); // Default peak Saturday
  const [selectedSolarIdx, setSelectedSolarIdx] = useState<number>(5);
  const [activeBillUnits, setActiveBillUnits] = useState<1000 | 1450 | 2200>(1450);

  const activeDayData = DENTAL_WEEKLY[selectedDentalDay];
  const activeSolarData = SOLAR_PIPELINE[selectedSolarIdx];

  const dentalMaxTotal = Math.max(...DENTAL_WEEKLY.map((d) => d.voice + d.wa));
  const solarMaxInquiries = Math.max(...SOLAR_PIPELINE.map((s) => s.inquiries));

  // Quick interactive roof kW calculation for LESCO/K-Electric sizing preview
  const recommendedKw = activeBillUnits === 1000 ? '10 kW' : activeBillUnits === 1450 ? '12 kW' : '20 kW';
  const monthlySave = activeBillUnits === 1000 ? 'Rs 54,000' : activeBillUnits === 1450 ? 'Rs 74,000' : 'Rs 118,000';

  return (
    <section
      id="command-center"
      className="relative w-full bg-[#eceff3] text-[#0b0d12] pt-20 pb-24 sm:pt-28 sm:pb-28 px-5 sm:px-8 border-t border-[#0b0d12]/8 scroll-mt-20 overflow-hidden"
    >
      {/* Compatibility anchor */}
      <div id="dashboards" className="scroll-mt-20 pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto space-y-10">
        
        {/* Header & Sector Selector */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-[660px]">
            <h2
              className="font-serif-instrument font-normal text-[#0b0d12] tracking-[-0.02em] leading-[1.02]"
              style={{ fontSize: 'clamp(38px, 4.8vw, 68px)' }}
            >
              See every conversation become{' '}
              <span className="italic text-[#5a3fd1]">confirmed revenue.</span>
            </h2>
            <p className="mt-4 max-w-[580px] text-[15.5px] sm:text-base leading-[1.6] text-[#475060]">
              A unified check-and-balance panel built around your specific business metrics—whether chair utilization for clinics or kilowatt pipeline for solar EPCs.
            </p>
          </div>

          {/* Clean Sector Selector */}
          <div
            role="tablist"
            aria-label="Command Center Sector Metrics"
            className="inline-flex flex-wrap items-center gap-2.5 self-start lg:self-auto p-1.5 rounded-full bg-white/80 border border-[#0b0d12]/12 shadow-xs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={sector === 'dental'}
              onClick={() => setSector('dental')}
              style={
                sector === 'dental'
                  ? { boxShadow: '0 0 22px rgba(6, 120, 143, 0.28)' }
                  : undefined
              }
              className={`zl-btn inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                sector === 'dental'
                  ? 'bg-[#0b0d12] text-white'
                  : 'text-[#475060] hover:text-[#0b0d12]'
              }`}
            >
              <Smile className="w-4 h-4 text-[#5ee3ff]" />
              <span>Dental &amp; Clinic Metrics</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={sector === 'solar'}
              onClick={() => setSector('solar')}
              style={
                sector === 'solar'
                  ? { boxShadow: '0 0 22px rgba(6, 120, 143, 0.28)' }
                  : undefined
              }
              className={`zl-btn inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                sector === 'solar'
                  ? 'bg-[#0b0d12] text-white'
                  : 'text-[#475060] hover:text-[#0b0d12]'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Solar EPC Telemetry (SolarPro)</span>
            </button>
          </div>
        </div>

        {/* Unified Command Center Surface */}
        <div className="rounded-[28px] border border-[#0b0d12]/12 bg-white/92 shadow-[0_30px_80px_rgba(20,30,60,0.09)] p-6 sm:p-8 space-y-7">
          
          {/* Top Status Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#0b0d12]/10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06788f]/10 border border-[#06788f]/25 font-mono text-[11px] font-semibold text-[#06788f] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {sector === 'dental'
                ? 'Clinical PMS Live Sync'
                : 'SolarPro EPC Live Telemetry'}
            </div>

            <div className="font-mono text-xs text-[#475060]">
              Click any bar below to inspect daily figures
            </div>
          </div>

          <AnimatePresence mode="wait">
            {sector === 'dental' ? (
              <motion.div
                key="dental-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="space-y-7"
              >
                {/* 4 KPI Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="zl-card p-5 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10">
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#475060]">
                      Recovered Production (30D)
                    </div>
                    <div className="mt-2 font-serif-instrument text-4xl sm:text-[42px] leading-none text-[#0b0d12]">
                      AED 218,400
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+31.4% vs unreturned calls</span>
                    </div>
                  </div>

                  <div className="zl-card p-5 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10">
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#475060]">
                      Chair Conversion
                    </div>
                    <div className="mt-2 font-serif-instrument text-4xl sm:text-[42px] leading-none text-[#5a3fd1]">
                      42.6%
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>+16.2% benchmark lift</span>
                    </div>
                  </div>

                  <div className="zl-card p-5 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10">
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#475060]">
                      Intake Speed
                    </div>
                    <div className="mt-2 font-serif-instrument text-4xl sm:text-[42px] leading-none text-[#06788f]">
                      &lt; 2.4s
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Zero-ring drop rate</span>
                    </div>
                  </div>

                  <div className="zl-card p-5 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10">
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#475060]">
                      Front Desk Saved
                    </div>
                    <div className="mt-2 font-serif-instrument text-4xl sm:text-[42px] leading-none text-[#0b0d12]">
                      118 Hrs
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#06788f]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>AED 18,500 monthly savings</span>
                    </div>
                  </div>
                </div>

                {/* Weekly Conversion Bar Graph + Confirmed Chairs Strip */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Interactive Weekly Chart */}
                  <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10 flex flex-col justify-between">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#0b0d12]/8">
                      <div>
                        <div className="text-sm font-bold text-[#0b0d12]">
                          Weekly Conversion &amp; Chair Occupancy
                        </div>
                        <div className="text-xs text-[#475060] mt-0.5">
                          Selected: <strong className="text-[#0b0d12]">{activeDayData.day}</strong> &middot;{' '}
                          <span className="text-[#06788f] font-semibold">{activeDayData.occupancy}% occupancy</span> &middot;{' '}
                          {activeDayData.revenue} recovered
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b0d12] text-white font-mono text-[10.5px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Target Chair Utilization: 85%
                      </div>
                    </div>

                    {/* Bars Stage */}
                    <div className="relative h-56 mt-6 flex items-end gap-3 sm:gap-5 px-2 pb-2 border-b border-[#0b0d12]/15">
                      {/* Dotted Target Benchmark at 85% height */}
                      <div
                        className="pointer-events-none absolute left-0 right-0 flex items-center"
                        style={{ bottom: '85%' }}
                      >
                        <div className="w-full border-t-2 border-dashed border-emerald-500/75" />
                      </div>

                      {DENTAL_WEEKLY.map((d, idx) => {
                        const selected = selectedDentalDay === idx;
                        const total = d.voice + d.wa;
                        const voiceH = Math.round((d.voice / dentalMaxTotal) * 165);
                        const waH = Math.round((d.wa / dentalMaxTotal) * 165);

                        return (
                          <button
                            key={d.day}
                            type="button"
                            onClick={() => setSelectedDentalDay(idx)}
                            aria-label={`${d.day}: ${d.voice} voice, ${d.wa} WhatsApp`}
                            className={`flex-1 h-full flex flex-col justify-end items-center gap-1.5 group cursor-pointer transition-opacity ${
                              selected ? 'opacity-100' : 'opacity-65 hover:opacity-95'
                            }`}
                          >
                            <span className="font-mono text-[10px] font-bold text-[#0b0d12]">
                              {total}
                            </span>

                            <div
                              className={`w-full max-w-[44px] flex flex-col gap-[2px] p-1 rounded-t-xl transition-all ${
                                selected
                                  ? 'bg-[#06788f]/12 ring-2 ring-[#06788f]/45'
                                  : 'bg-transparent'
                              }`}
                            >
                              <div
                                style={{ height: `${waH}px` }}
                                className={`w-full rounded-t-md transition-all duration-300 ${
                                  d.isPeak
                                    ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                                    : 'bg-gradient-to-t from-[#5a3fd1] to-[#818cf8]'
                                }`}
                              />
                              <div
                                style={{ height: `${voiceH}px` }}
                                className="w-full rounded-b-md bg-gradient-to-t from-[#06788f] to-[#22d3ee] transition-all duration-300"
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* X Axis + Legend */}
                    <div className="mt-3 flex items-center justify-between gap-2 px-2">
                      <div className="flex-1 flex items-center gap-3 sm:gap-5">
                        {DENTAL_WEEKLY.map((d, idx) => (
                          <button
                            key={`lbl-${d.day}`}
                            type="button"
                            onClick={() => setSelectedDentalDay(idx)}
                            className={`flex-1 text-center font-mono text-[11px] cursor-pointer ${
                              selectedDentalDay === idx
                                ? 'font-bold text-[#06788f]'
                                : 'text-[#475060]'
                            }`}
                          >
                            {d.day}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#0b0d12]/8 flex flex-wrap items-center gap-5 text-xs text-[#475060]">
                      <span className="inline-flex items-center gap-2">
                        <i className="w-2.5 h-2.5 rounded-xs bg-[#06788f] block" />
                        Voice Bookings ({activeDayData.voice})
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <i className="w-2.5 h-2.5 rounded-xs bg-[#5a3fd1] block" />
                        WhatsApp Conversions ({activeDayData.wa})
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <i className="w-2.5 h-2.5 rounded-xs bg-amber-500 block" />
                        Peak Clinic Saturday
                      </span>
                    </div>
                  </div>

                  {/* Recent PMS Synced Chairs */}
                  <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#0b0d12]/8">
                      <span className="text-sm font-bold text-[#0b0d12]">
                        Confirmed Operatory Sync
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 0.4s PMS
                      </span>
                    </div>

                    <div className="space-y-3 flex-1">
                      {CONFIRMED_CHAIRS.map((c, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-white border border-[#0b0d12]/10 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="text-xs sm:text-[13px] font-bold text-[#0b0d12] truncate">
                              {c.name}
                            </div>
                            <div className="text-[11px] text-[#475060] truncate mt-0.5">
                              {c.room}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-mono text-xs font-bold text-[#0b0d12]">
                              {c.value}
                            </div>
                            <div className="font-mono text-[10px] text-[#06788f]">
                              {c.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0b0d12] text-white text-xs flex items-center justify-between">
                      <span className="text-[#c9ced8]">After-Hours Capture Rate</span>
                      <span className="font-mono font-bold text-[#5ee3ff]">100% Answered</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              <motion.div
                key="solar-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="space-y-7"
              >
                {/* 4 SolarPro KPI Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="zl-card p-5 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10">
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#475060]">
                      Active Solar Pipeline
                    </div>
                    <div className="mt-2 font-serif-instrument text-4xl sm:text-[42px] leading-none text-[#0b0d12]">
                      Rs 48.5M
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>142 qualified roofs</span>
                    </div>
                  </div>

                  <div className="zl-card p-5 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10">
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#475060]">
                      Net Profit / kW
                    </div>
                    <div className="mt-2 font-serif-instrument text-4xl sm:text-[42px] leading-none text-[#06788f]">
                      18.5%
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Hardware + EPC margin protected</span>
                    </div>
                  </div>

                  <div className="zl-card p-5 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10">
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#475060]">
                      Quote Speed
                    </div>
                    <div className="mt-2 font-serif-instrument text-4xl sm:text-[42px] leading-none text-[#5a3fd1]">
                      2.1 min
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700">
                      <Zap className="w-3.5 h-3.5" />
                      <span>85% faster than manual quoting</span>
                    </div>
                  </div>

                  <div className="zl-card p-5 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10">
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#475060]">
                      Deals Won
                    </div>
                    <div className="mt-2 font-serif-instrument text-4xl sm:text-[42px] leading-none text-[#0b0d12]">
                      31.4%
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#06788f]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>41 signed contracts (30D)</span>
                    </div>
                  </div>
                </div>

                {/* Solar Interactive Bar Graph + 2 Required Operational Quick Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Solar Weekly Pipeline Graph */}
                  <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10 flex flex-col justify-between">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#0b0d12]/8">
                      <div>
                        <div className="text-sm font-bold text-[#0b0d12]">
                          Solar Quotes Sent vs. Signed Contracts
                        </div>
                        <div className="text-xs text-[#475060] mt-0.5">
                          Selected: <strong className="text-[#0b0d12]">{activeSolarData.period}</strong> &middot;{' '}
                          <span className="text-[#06788f] font-semibold">{activeSolarData.kwSigned} signed</span> ({activeSolarData.pipelineVal})
                        </div>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-[#06788f]">
                        Net-Metering Cohort
                      </span>
                    </div>

                    <div className="h-52 mt-6 flex items-end gap-3 sm:gap-4 px-2 pb-2 border-b border-[#0b0d12]/15">
                      {SOLAR_PIPELINE.map((item, idx) => {
                        const on = selectedSolarIdx === idx;
                        const totalH = Math.round((item.inquiries / solarMaxInquiries) * 165);
                        const quotesH = Math.round((item.quotes / solarMaxInquiries) * 165);
                        const wonH = Math.round((item.won / solarMaxInquiries) * 165);

                        return (
                          <button
                            key={item.period}
                            type="button"
                            onClick={() => setSelectedSolarIdx(idx)}
                            className={`flex-1 h-full flex flex-col justify-end items-center gap-1.5 cursor-pointer transition-opacity ${
                              on ? 'opacity-100' : 'opacity-65 hover:opacity-95'
                            }`}
                          >
                            <span className="font-mono text-[10px] font-bold text-[#0b0d12]">
                              {item.kwSigned}
                            </span>

                            <div
                              className={`w-full flex items-end justify-center gap-1 p-1.5 rounded-t-xl ${
                                on ? 'bg-[#06788f]/12 ring-2 ring-[#06788f]/45' : ''
                              }`}
                            >
                              <div
                                style={{ height: `${totalH}px` }}
                                className="w-2.5 sm:w-3 rounded-t-sm bg-slate-300"
                                title={`Inquiries: ${item.inquiries}`}
                              />
                              <div
                                style={{ height: `${quotesH}px` }}
                                className="w-2.5 sm:w-3 rounded-t-sm bg-[#5a3fd1]"
                                title={`Quotes: ${item.quotes}`}
                              />
                              <div
                                style={{ height: `${wonH}px` }}
                                className="w-2.5 sm:w-3 rounded-t-sm bg-gradient-to-t from-[#06788f] to-emerald-500"
                                title={`Signed: ${item.won}`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex items-center gap-3 sm:gap-4 px-2">
                      {SOLAR_PIPELINE.map((item, idx) => (
                        <button
                          key={`slbl-${item.period}`}
                          type="button"
                          onClick={() => setSelectedSolarIdx(idx)}
                          className={`flex-1 text-center font-mono text-[11px] cursor-pointer ${
                            selectedSolarIdx === idx
                              ? 'font-bold text-[#06788f]'
                              : 'text-[#475060]'
                          }`}
                        >
                          {item.period}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#0b0d12]/8 flex flex-wrap gap-5 text-xs text-[#475060]">
                      <span className="inline-flex items-center gap-2">
                        <i className="w-2.5 h-2.5 rounded-xs bg-slate-300 block" /> Inquiries ({activeSolarData.inquiries})
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <i className="w-2.5 h-2.5 rounded-xs bg-[#5a3fd1] block" /> Quotes ({activeSolarData.quotes})
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <i className="w-2.5 h-2.5 rounded-xs bg-emerald-500 block" /> Won ({activeSolarData.won})
                      </span>
                    </div>
                  </div>

                  {/* Quick Cards for LESCO/K-Electric Roof Sizing & Sub-60s PDF Proposals */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                    
                    {/* Card 1: Interactive LESCO / K-Electric Roof Sizing */}
                    <div className="zl-card flex-1 p-5 sm:p-6 rounded-2xl bg-[#f7f9fb] border border-[#0b0d12]/10 flex flex-col justify-between gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#06788f]/10 text-[#06788f]">
                          <Calculator className="w-3.5 h-3.5" /> LESCO / K-Electric Roof Sizing
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#0b0d12]">
                          {recommendedKw} Match
                        </span>
                      </div>

                      <p className="text-xs sm:text-[13.5px] text-[#475060] leading-relaxed">
                        Reads monthly bill units sent over WhatsApp and recommends optimal array sizing &amp; inverter specs automatically.
                      </p>

                      {/* Mini Interactive Unit Toggle */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="inline-flex items-center gap-1.5">
                          {([1000, 1450, 2200] as const).map((u) => (
                            <button
                              key={u}
                              type="button"
                              onClick={() => setActiveBillUnits(u)}
                              className={`px-2.5 py-1 rounded-lg font-mono text-[10.5px] border transition-colors cursor-pointer ${
                                activeBillUnits === u
                                  ? 'bg-[#0b0d12] text-white border-[#0b0d12]'
                                  : 'bg-white text-[#475060] border-[#0b0d12]/15 hover:border-[#0b0d12]/35'
                              }`}
                            >
                              {u} Units
                            </button>
                          ))}
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-emerald-700">
                          Save ~{monthlySave}/mo
                        </span>
                      </div>
                    </div>

                    {/* Card 2: Sub-60s Branded PDF Proposals */}
                    <div className="zl-card flex-1 p-5 sm:p-6 rounded-2xl bg-[#0d1016] text-white border border-white/15 flex flex-col justify-between gap-3 shadow-lg">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#5ee3ff]/15 text-[#5ee3ff]">
                          <FileText className="w-3.5 h-3.5" /> Sub-60s Branded PDF Proposals
                        </span>
                        <span className="font-mono text-[10.5px] text-emerald-400">
                          Margin Locked
                        </span>
                      </div>

                      <p className="text-xs sm:text-[13.5px] text-[#c9ced8] leading-relaxed">
                        Delivers custom-branded WhatsApp quotation PDFs with payback period, panel count, and locked EPC contractor margins—before competitors call back.
                      </p>

                      <div className="flex items-center justify-between pt-1 font-mono text-[11px] text-[#9aa1ad] border-t border-white/10">
                        <span>SolarPro_Custom_Proposal.pdf</span>
                        <span className="text-[#5ee3ff]">&lt; 48s Delivery</span>
                      </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Executive Closing CTA Card on #eceff3 */}
        <div className="relative overflow-hidden rounded-[32px] border border-[#0b0d12]/12 bg-white/90 shadow-[0_28px_75px_rgba(20,30,60,0.08)] px-6 sm:px-12 py-12 sm:py-16 text-center">
          <div
            className="pointer-events-none absolute left-1/2 -top-1/2 -translate-x-1/2 w-[620px] h-[620px] rounded-full blur-3xl opacity-55"
            style={{
              background:
                'radial-gradient(circle, rgba(6,120,143,0.16) 0%, rgba(90,63,209,0.10) 45%, transparent 70%)',
            }}
          />

          <h2
            className="relative font-serif-instrument font-normal text-[#0b0d12] max-w-[780px] mx-auto tracking-[-0.02em] leading-[1.02]"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}
          >
            Let&apos;s build the system your business{' '}
            <span className="italic chrome-text-light-bg">actually needs.</span>
          </h2>

          <p className="relative mt-4 max-w-[540px] mx-auto text-[15.5px] sm:text-base text-[#475060] leading-relaxed">
            Tell us how leads reach your team today. We&apos;ll show you a practical plan for voice, WhatsApp, and live dashboards.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="zl-btn inline-flex items-center gap-2 min-h-[52px] px-8 rounded-full bg-[#0b0d12] hover:bg-[#191d26] text-white font-semibold text-[15px] shadow-[0_12px_30px_rgba(11,13,18,0.2)] cursor-pointer"
            >
              <span>Book Discovery Call</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href="mailto:contact@zavianlabs.com"
              className="zl-btn inline-flex items-center min-h-[52px] px-8 rounded-full border border-[#0b0d12]/20 bg-white hover:border-[#06788f] hover:text-[#06788f] text-[#0b0d12] font-semibold text-[15px] cursor-pointer"
            >
              contact@zavianlabs.com
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
