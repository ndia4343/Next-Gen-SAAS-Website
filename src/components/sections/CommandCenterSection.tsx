'use client';

import React, { useState, useEffect } from 'react';
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

export default function CommandCenterSection() {
  const { config } = useSiteConfig();
  const telemetry = config.telemetry;
  const sectors = telemetry.sectors;

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [selectedBarIdx, setSelectedBarIdx] = useState<number>(11);

  const safeIdx = activeIdx % Math.max(1, sectors.length);
  const activeSector = sectors[safeIdx] || sectors[0];
  const intervalMs = Math.max(2000, (telemetry.autoCycleSeconds || 4) * 1000);

  useEffect(() => {
    if (isPausedByUser || sectors.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % sectors.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPausedByUser, sectors.length, intervalMs]);

  const handleTabClick = (idx: number) => {
    setActiveIdx(idx);
    setIsPausedByUser(true);
    setSelectedBarIdx((sectors[idx]?.weeklyChartBars.length || 12) - 1);
  };

  const bars = activeSector.weeklyChartBars.length > 0
    ? activeSector.weeklyChartBars
    : [60, 68, 72, 78, 82, 85, 80, 88, 91, 87, 94, 98];

  const labels =
    activeSector.barLabels && activeSector.barLabels.length >= bars.length
      ? activeSector.barLabels
      : bars.map((_, i) => `W${i + 1}`);

  const clampedBarIdx = Math.min(selectedBarIdx, bars.length - 1);
  const selectedBarValue = bars[clampedBarIdx] ?? 0;

  const bookingUrl = config.branding.calendarBookingUrl || 'https://calendar.app.google/u5vL88X41qmGBCky5';
  const contactEmail = config.branding.contactEmail || 'contact@zavianlabs.com';

  return (
    <section
      id="command-center"
      className="relative w-full bg-[#F8F9FA] text-[#090A0D] pt-20 pb-24 sm:pt-28 sm:pb-28 px-5 sm:px-8 border-t border-[rgba(15,23,42,0.08)] scroll-mt-20 overflow-hidden"
    >
      {/* Compatibility anchor */}
      <div id="dashboards" className="scroll-mt-20 pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto space-y-10">
        
        {/* Header & Sector Selector */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-[660px]">
            <h2
              className="font-serif-instrument font-normal text-[#090A0D] tracking-[-0.02em] leading-[1.02]"
              style={{ fontSize: 'clamp(38px, 4.8vw, 68px)' }}
            >
              {telemetry.sectionTitle}{' '}
              <span className="italic text-[#6366F1]">{telemetry.sectionTitleAccent}</span>
            </h2>
            <p className="mt-4 max-w-[580px] text-[15.5px] sm:text-base leading-[1.6] text-[#525866]">
              {telemetry.sectionDescription}
            </p>
          </div>

          {/* 3-Sector Selector Strip */}
          <div
            role="tablist"
            aria-label="Command Center Sector Metrics"
            className="inline-flex flex-wrap items-center gap-2 self-start lg:self-auto p-1.5 rounded-full bg-white border border-[rgba(15,23,42,0.08)] shadow-[0_6px_20px_rgba(0,0,0,0.03)]"
          >
            {sectors.map((sec, idx) => {
              const Icon = getSectorIcon(sec.id);
              const isSelected = safeIdx === idx;
              return (
                <button
                  key={sec.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleTabClick(idx)}
                  style={
                    isSelected
                      ? { boxShadow: '0 0 20px rgba(10, 132, 255, 0.25)' }
                      : undefined
                  }
                  className={`zl-btn inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#090A0D] text-white'
                      : 'text-[#525866] hover:text-[#090A0D]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected
                        ? sec.id === 'solar'
                          ? 'text-amber-400'
                          : sec.id === 'hr'
                          ? 'text-indigo-300'
                          : 'text-[#5ee3ff]'
                        : 'text-[#525866]'
                    }`}
                  />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Command Center Surface */}
        <div className="rounded-[28px] border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.06)] p-6 sm:p-8 space-y-7">
          
          {/* Top Status Row + Auto-Loop Control */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[rgba(15,23,42,0.08)]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/25 font-mono text-[11px] font-semibold text-[#0A84FF] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeSector.badgeLabel}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPausedByUser((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F9FA] border border-[rgba(15,23,42,0.08)] font-mono text-[11px] text-[#525866] hover:text-[#090A0D] transition-colors cursor-pointer"
              >
                {isPausedByUser ? (
                  <>
                    <Play className="w-3 h-3 text-[#0A84FF]" />
                    <span>Paused &bull; Resume Auto-Loop</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-emerald-600" />
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
              transition={{ duration: 0.25 }}
              className="space-y-7"
            >
              {/* 4 KPI Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeSector.kpis.map((kpi, idx) => (
                  <div
                    key={`${activeSector.id}-kpi-${idx}`}
                    className="zl-card p-5 rounded-2xl bg-[#F8F9FA] border border-[rgba(15,23,42,0.08)]"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#525866]">
                      {kpi.label}
                    </div>
                    <div
                      className={`mt-2 font-serif-instrument text-4xl sm:text-[42px] leading-none ${
                        idx === 1
                          ? 'text-[#6366F1]'
                          : idx === 2
                          ? 'text-[#0A84FF]'
                          : 'text-[#090A0D]'
                      }`}
                    >
                      {kpi.value}
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                      <span>{kpi.delta}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 12-Bar Telemetry Chart + Right Live Feed Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left: 12-Bar Chart */}
                <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#F8F9FA] border border-[rgba(15,23,42,0.08)] flex flex-col justify-between">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[rgba(15,23,42,0.08)]">
                    <div>
                      <div className="text-sm font-bold text-[#090A0D]">
                        {activeSector.chartTitle}
                      </div>
                      <div className="text-xs text-[#525866] mt-0.5">
                        {activeSector.chartSubtitle} &middot;{' '}
                        <strong className="text-[#090A0D]">
                          {labels[clampedBarIdx]} ({selectedBarValue}%)
                        </strong>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090A0D] text-white font-mono text-[10.5px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Target Benchmark: 85%
                    </div>
                  </div>

                  {/* 12-Column Bar Stage */}
                  <div className="relative h-56 mt-6 flex items-end gap-2 sm:gap-3 px-1 pb-2 border-b border-[rgba(15,23,42,0.12)]">
                    {/* Dotted 85% Benchmark Line */}
                    <div
                      className="pointer-events-none absolute left-0 right-0 flex items-center z-10"
                      style={{ bottom: '85%' }}
                    >
                      <div className="w-full border-t-2 border-dashed border-emerald-500/75" />
                    </div>

                    {bars.map((val, bIdx) => {
                      const clamped = Math.max(8, Math.min(100, val));
                      const isSelected = clampedBarIdx === bIdx;
                      const isPeak = clamped >= 90;
                      const barHeightPx = Math.round((clamped / 100) * 185);

                      return (
                        <button
                          key={`${activeSector.id}-bar-${bIdx}`}
                          type="button"
                          onClick={() => {
                            setSelectedBarIdx(bIdx);
                            setIsPausedByUser(true);
                          }}
                          aria-label={`${labels[bIdx]}: ${clamped}%`}
                          className="flex-1 h-full flex flex-col justify-end items-center gap-1.5 group cursor-pointer"
                        >
                          <span
                            className={`font-mono text-[9.5px] font-bold transition-colors ${
                              isSelected ? 'text-[#0A84FF]' : 'text-[#525866]'
                            }`}
                          >
                            {clamped}
                          </span>

                          <div
                            className={`w-full max-w-[34px] h-[190px] rounded-t-lg bg-slate-200/70 flex items-end p-[2px] transition-all ${
                              isSelected ? 'ring-2 ring-[#0A84FF]/60' : ''
                            }`}
                          >
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${barHeightPx}px` }}
                              transition={{ duration: 0.45, delay: bIdx * 0.025, ease: 'easeOut' }}
                              className={`w-full rounded-t-md ${
                                isPeak
                                  ? 'bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-400 shadow-[0_0_16px_rgba(245,158,11,0.35)]'
                                  : 'bg-gradient-to-t from-[#0A84FF] via-[#6366F1] to-indigo-400'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* X Axis Labels */}
                  <div className="mt-3 flex items-center gap-2 sm:gap-3 px-1">
                    {labels.slice(0, bars.length).map((lbl, idx) => (
                      <button
                        key={`${activeSector.id}-lbl-${idx}`}
                        type="button"
                        onClick={() => {
                          setSelectedBarIdx(idx);
                          setIsPausedByUser(true);
                        }}
                        className={`flex-1 text-center font-mono text-[10px] cursor-pointer ${
                          clampedBarIdx === idx
                            ? 'font-bold text-[#0A84FF]'
                            : 'text-[#525866]'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Real-Time Operational Sync Feed */}
                <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-[#F8F9FA] border border-[rgba(15,23,42,0.08)] flex flex-col justify-between gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[rgba(15,23,42,0.08)]">
                    <span className="text-sm font-bold text-[#090A0D]">
                      {activeSector.subCardTitle}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {activeSector.subCardStatus}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {activeSector.subCardItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white border border-[rgba(15,23,42,0.08)] flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-xs sm:text-[13px] font-bold text-[#090A0D] truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#525866] truncate mt-0.5">
                            {item.subtitle}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-mono text-xs font-bold text-[#090A0D]">
                            {item.metric}
                          </div>
                          <div className="font-mono text-[10px] text-[#0A84FF]">
                            {item.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#090A0D] text-white text-xs flex items-center justify-between">
                    <span className="text-[#c9ced8]">{activeSector.highlightLabel}</span>
                    <span className="font-mono font-bold text-[#5ee3ff]">
                      {activeSector.highlightValue}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Executive Closing CTA Card on #F8F9FA */}
        <div className="relative overflow-hidden rounded-[32px] border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_28px_75px_rgba(15,23,42,0.06)] px-6 sm:px-12 py-12 sm:py-16 text-center">
          <div
            className="pointer-events-none absolute left-1/2 -top-1/2 -translate-x-1/2 w-[620px] h-[620px] rounded-full blur-3xl opacity-45"
            style={{
              background:
                'radial-gradient(circle, rgba(10,132,255,0.14) 0%, rgba(99,102,241,0.10) 45%, transparent 70%)',
            }}
          />

          <h2
            className="relative font-serif-instrument font-normal text-[#090A0D] max-w-[780px] mx-auto tracking-[-0.02em] leading-[1.02]"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}
          >
            Let&apos;s build the system your business{' '}
            <span className="italic chrome-text-light-bg">actually needs.</span>
          </h2>

          <p className="relative mt-4 max-w-[540px] mx-auto text-[15.5px] sm:text-base text-[#525866] leading-relaxed">
            Tell us how leads reach your team today. We&apos;ll show you a practical plan for voice, WhatsApp, and live dashboards.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="zl-btn inline-flex items-center gap-2 min-h-[52px] px-8 rounded-full bg-[#090A0D] hover:bg-[#191d26] text-white font-semibold text-[15px] shadow-[0_12px_30px_rgba(9,10,13,0.18)] cursor-pointer"
            >
              <span>Book Discovery Call</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={`mailto:${contactEmail}`}
              className="zl-btn inline-flex items-center min-h-[52px] px-8 rounded-full border border-[rgba(15,23,42,0.16)] bg-white hover:border-[#0A84FF] hover:text-[#0A84FF] text-[#090A0D] font-semibold text-[15px] cursor-pointer"
            >
              {contactEmail}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
