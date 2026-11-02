"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Smile, 
  UtensilsCrossed, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers
} from "lucide-react";
import { ProjectSupportSectionData } from "@/lib/types";

interface IndustryFeature {
  tag: string;
  title: string;
  desc: string;
}

interface IndustrySolution {
  id: string;
  tabLabel: string;
  badge: string;
  icon: React.ElementType;
  headline: string;
  subheadline: string;
  telemetry: {
    statusLabel: string;
    chartTitle: string;
    chartType: "solar" | "clinic" | "restaurant";
    kpis: { label: string; value: string; delta: string }[];
    pipeline: { label: string; val: string }[];
  };
  features: IndustryFeature[];
}

const INDUSTRIES: IndustrySolution[] = [
  // 1. Solar EPC
  {
    id: "solar",
    tabLabel: "Solar EPC",
    badge: "SolarPro Telemetry",
    icon: Sun,
    headline: "Turn Power Bills into Signed Solar Contracts",
    subheadline: "Calculates panel sizing, net-metering ROI, and profit margins automatically the second a customer texts.",
    telemetry: {
      statusLabel: "Pakistan Net-Metering Engine • LESCO / K-Electric",
      chartTitle: "Quotes Sent vs. Signed Solar Projects",
      chartType: "solar",
      kpis: [
        { label: "Pipeline Value", value: "Rs 48.5M", delta: "+28%" },
        { label: "Net Profit / kW", value: "18.5%", delta: "+2.1%" },
        { label: "Quote Speed", value: "2.1 min", delta: "-85%" },
        { label: "Deals Won", value: "31.4%", delta: "+6.2%" },
      ],
      pipeline: [
        { label: "Inquiries", val: "142" },
        { label: "Quotes Sent", val: "89" },
        { label: "Signed Deals", val: "41" },
      ],
    },
    features: [
      {
        tag: "01 // TARIFF & ROOF SIZING",
        title: "Automated Tariff & Roof Sizing",
        desc: "Estimates kW capacity from LESCO/K-Electric bills.",
      },
      {
        tag: "02 // INSTANT PROPOSAL",
        title: "Sub-60s Branded PDF Proposal",
        desc: "Delivers WhatsApp quotation proposals instantly.",
      },
      {
        tag: "03 // CONTRACTOR MARGINS",
        title: "Contractor Profit Margins",
        desc: "Monitors gross margin per installed kilowatt and hardware costs in real time.",
      },
    ],
  },

  // 2. Dental & Aesthetics
  {
    id: "clinic",
    tabLabel: "Dental & Aesthetics",
    badge: "CareOps Practice Manager",
    icon: Smile,
    headline: "Keep Treatment Chairs Full All Week",
    subheadline: "Answers patient inquiries 24/7, triages cosmetic photos, and secures treatment deposits across Dubai clinics without front-desk delays.",
    telemetry: {
      statusLabel: "Dubai Health Authority Compliant • DHA / MOH",
      chartTitle: "Chair Occupancy & Treatment Value Yield",
      chartType: "clinic",
      kpis: [
        { label: "Case Acceptance", value: "68%", delta: "+14.2%" },
        { label: "Avg Treatment Value", value: "AED 8,400", delta: "+22%" },
        { label: "No-Show Rate", value: "2.1%", delta: "-74%" },
        { label: "Doctor Occupancy", value: "91%", delta: "+16%" },
      ],
      pipeline: [
        { label: "Screened Inquiries", val: "310" },
        { label: "High-Ticket Cases", val: "186" },
        { label: "Treatments Locked", val: "112" },
      ],
    },
    features: [
      {
        tag: "01 // TREATMENT SCREENING",
        title: "High-Ticket Treatment Screening",
        desc: "Filters cosmetic veneers/implants by budget.",
      },
      {
        tag: "02 // DOCTOR SCHEDULING",
        title: "Zero-Collision Doctor Scheduling",
        desc: "Locks patient consults into clinic calendars.",
      },
      {
        tag: "03 // MARGIN TRACKING",
        title: "Procedure Margin Tracking",
        desc: "Monitors chair utilization and treatment profitability.",
      },
    ],
  },

  // 3. Restaurant Group
  {
    id: "restaurant",
    tabLabel: "Restaurant Group",
    badge: "Table Yield & Cover Host",
    icon: UtensilsCrossed,
    headline: "Fill More Tables. Never Miss a Group Booking.",
    subheadline: "Handles weekend party reservations, dietary requests, and confirms dining deposits automatically.",
    telemetry: {
      statusLabel: "Floor Plan Synchronization • Table 12 Locked",
      chartTitle: "Daily Table Turnover & Dining Yield",
      chartType: "restaurant",
      kpis: [
        { label: "Table 12 Status", value: "Locked", delta: "VIP Confirmed" },
        { label: "Average Spend / Cover", value: "AED 480", delta: "+18%" },
        { label: "Weekend RevPASH", value: "+24%", delta: "Optimized" },
        { label: "Floor Turnover", value: "2.8x", delta: "+0.6x" },
      ],
      pipeline: [
        { label: "Table Requests", val: "1,420" },
        { label: "Prime Tables Filled", val: "880" },
        { label: "VIP Guests Served", val: "3,120" },
      ],
    },
    features: [
      {
        tag: "01 // TABLE ALLOCATION",
        title: "VIP Table & Terrace Allocation",
        desc: "Coordinates party sizes and floor preference via chat.",
      },
      {
        tag: "02 // VALET & DEPOSIT",
        title: "Instant Valet & Deposit Handoff",
        desc: "Dispatches Gate Village parking pass & confirmation.",
      },
      {
        tag: "03 // TABLE OCCUPANCY",
        title: "Live Table Occupancy",
        desc: "Tracks live table turnover, seat yields, and peak dining spend.",
      },
    ],
  },
];

interface SolutionsShowcaseProps {
  onOpenQuoteModal?: (serviceName: string) => void;
  content?: ProjectSupportSectionData;
}

export const SolutionsShowcase: React.FC<SolutionsShowcaseProps> = ({ onOpenQuoteModal, content }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycle through industries unless interacting
  useEffect(() => {
    if (isInteracting) return;

    const interval = setInterval(() => {
      setActiveIdx((curr) => (curr + 1) % INDUSTRIES.length);
    }, 7500);

    return () => clearInterval(interval);
  }, [isInteracting]);

  const handleTabClick = (idx: number) => {
    setActiveIdx(idx);
    setIsInteracting(true);

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setIsInteracting(false), 14000);
  };

  const item = INDUSTRIES[activeIdx];

  return (
    <section 
      id="industries" 
      className="scroll-mt-36 pt-16 pb-24 px-4 md:px-8 bg-[#F8F9FB] dark:bg-[#08090D] transition-colors relative z-20 w-full text-slate-900 dark:text-slate-100 font-sans overflow-hidden"
    >
      {/* Compatibility anchors for legacy internal links */}
      <div id="solutions" className="scroll-mt-36 pointer-events-none" />
      <div id="project-support" className="scroll-mt-36 pointer-events-none" />
      <div id="services" className="scroll-mt-36 pointer-events-none" />

      {/* Background glow accents (Emerald / Cyan theme) */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-16 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-xs font-mono tracking-wider uppercase text-emerald-700 dark:text-emerald-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            TURNKEY ARCHITECTURES
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
            One engine.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
              Built for your industry.
            </span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            {content?.subtitle || "From instant lead capture to live profit tracking, deploy purpose-built automation designed for your exact operations."}
          </p>
        </div>

        {/* 3 Industry Tabs */}
        <div className="border-b border-slate-200 dark:border-white/10 pb-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {INDUSTRIES.map((ind, idx) => {
              const Icon = ind.icon;
              const active = idx === activeIdx;
              return (
                <button
                  key={ind.id}
                  onClick={() => handleTabClick(idx)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 snap-start border cursor-pointer ${
                    active
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                      : "bg-white dark:bg-[#12151E] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`} />
                  <span>{ind.tabLabel}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Operational Deliverables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-0 mb-0">
          
          {/* Left: Visual Telemetry Card (7 Columns) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="rounded-2xl bg-white dark:bg-[#12151E] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden flex flex-col justify-between h-full min-h-[500px]"
              >
                {/* Top Header Bar */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100/80 dark:bg-black/50 border-b border-slate-200 dark:border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                      zavian://{item.id}.telemetry
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded font-semibold">
                    {item.badge}
                  </span>
                </div>

                {/* Main Visual Telemetry Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5 overflow-hidden">
                  
                  {/* Status Banner */}
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/5 pb-2">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.telemetry.statusLabel}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Live Sync
                    </span>
                  </div>

                  {/* 4 Metric KPI Tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {item.telemetry.kpis.map((k, kidx) => (
                      <div key={kidx} className="p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 min-w-0">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-none truncate">{k.label}</div>
                        <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1.5 truncate">{k.value}</div>
                        <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">{k.delta}</div>
                      </div>
                    ))}
                  </div>

                  {/* SVG Chart Visualization */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>{item.telemetry.chartTitle}</span>
                      <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-semibold">
                        30-DAY PERFORMANCE TREND
                      </span>
                    </div>
                    <div className="h-28 sm:h-36 flex items-center justify-center">
                      {item.telemetry.chartType === "solar" && <SolarChart />}
                      {item.telemetry.chartType === "clinic" && <ClinicBarChart />}
                      {item.telemetry.chartType === "restaurant" && <RestaurantChart />}
                    </div>
                  </div>

                  {/* Pipeline Breakdown Counters */}
                  <div className="grid grid-cols-3 gap-2">
                    {item.telemetry.pipeline.map((p, pidx) => (
                      <div key={pidx} className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-white/5 text-center border border-slate-200/60 dark:border-transparent">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider">{p.label}</div>
                        <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">{p.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Ticker */}
                <div className="px-5 py-3 bg-slate-100/80 dark:bg-black/50 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    OPERATIONAL ARCHITECTURE
                  </span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> 100% VERIFIED
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: 3 Industry-Specific Operational Deliverables (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-4 h-full flex flex-col justify-between"
              >
                {item.features.map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#12151E] border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] transition-all duration-300 flex-1 flex flex-col justify-center"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                        {feat.tag}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-3">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* High-Converting "Other Industries" Executive Callout Card */}
        <div id="book" className="scroll-mt-36" />
        <div id="custom-quote" className="mt-12 relative bg-transparent overflow-hidden rounded-2xl">
          <div className="bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm backdrop-blur-md">
            {/* Left Content */}
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                CUSTOM WORKFLOWS
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Don&apos;t see your sector? Run a different business?
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Imagine opening your phone every morning to see every lead qualified, appointments locked on your calendar, and your net revenue streaming live. We build custom pipelines for any booking or quote-driven business.
              </p>
            </div>

            {/* Right Action Button */}
            <button
              type="button"
              onClick={() => {
                if (onOpenQuoteModal) {
                  onOpenQuoteModal('');
                } else {
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold px-6 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
            >
              <span>Request Custom Architecture</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

// -------------------------------------------------------------
// Industry Predictive Visualizations (Emerald / Cyan Theme)
// -------------------------------------------------------------

// 1. Solar EPC: AI Net-Metering & Generation Forecast with Confidence Corridor
const SolarChart = () => (
  <svg viewBox="0 0 400 130" className="w-full h-full overflow-visible">
    <defs>
      <linearGradient id="aiCorridorEmerald" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.02" />
      </linearGradient>
      <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* AI Confidence Corridor */}
    <polygon
      points="20,90 100,75 190,25 280,18 380,12 380,45 280,40 190,55 100,85 20,105"
      fill="url(#aiCorridorEmerald)"
    />

    {/* Historical Actual Yield Curve */}
    <path
      d="M 20,95 Q 105,78 190,38"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      className="dark:stroke-slate-600"
    />

    {/* AI Projected Neural Vector (Glowing Cyan) */}
    <path
      d="M 190,38 Q 280,18 380,15"
      fill="none"
      stroke="#06B6D4"
      strokeWidth="2.5"
      strokeDasharray="4 3"
      filter="url(#glowCyan)"
    />

    {/* AI Prediction Inflection Node */}
    <circle cx="190" cy="38" r="4" fill="#10B981" />
    <circle cx="190" cy="38" r="8" fill="#10B981" opacity="0.4" className="animate-ping" />
    <text x="145" y="24" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="bold">
      AI Yield Lock: 99.1%
    </text>

    {/* Forward Projection Target */}
    <circle cx="380" cy="15" r="3.5" fill="#06B6D4" />
    <text x="290" y="32" fill="#06B6D4" fontSize="8" fontFamily="monospace" fontWeight="bold">
      +28% Projected kW
    </text>
  </svg>
);

// 2. Dental & Aesthetics: Clinic Capacity & Treatment Acceptance Pillars
const ClinicBarChart = () => (
  <div className="w-full h-full relative flex items-end justify-between px-4 pb-2">
    {/* Floating Neural Overlay Curve */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
      <path
        d="M 25,65 Q 100,50 180,35 T 375,18"
        fill="none"
        stroke="#06B6D4"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
      <circle cx="280" cy="22" r="3.5" fill="#10B981" />
      <text x="200" y="14" fill="#10B981" fontSize="8" fontFamily="monospace" fontWeight="bold">
        AI Optimal Fill: 92%
      </text>
    </svg>

    {/* Holographic Capacity Columns */}
    {[
      { cap: 65, pred: 60, label: "Mon" },
      { cap: 80, pred: 76, label: "Tue" },
      { cap: 88, pred: 85, label: "Wed" },
      { cap: 94, pred: 90, label: "Thu" },
      { cap: 100, pred: 98, label: "Sat", active: true },
    ].map((col, idx) => (
      <div key={idx} className="flex flex-col items-center gap-1.5 z-10">
        <div className="w-6 sm:w-8 h-20 bg-slate-200/80 dark:bg-slate-800/40 rounded-lg p-0.5 flex flex-col justify-end border border-slate-300/50 dark:border-white/5">
          <div
            className={`w-full rounded-md transition-all duration-500 ${
              col.active
                ? "bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                : "bg-gradient-to-t from-slate-400 to-teal-600/60 dark:from-slate-700 dark:to-teal-500/50"
            }`}
            style={{ height: `${col.cap}%` }}
          />
        </div>
        <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">{col.label}</span>
      </div>
    ))}
  </div>
);

// 3. Restaurant: Real-Time Dynamic Pricing & Dining Yield Curve
const RestaurantChart = () => (
  <svg viewBox="0 0 400 130" className="w-full h-full overflow-visible">
    <defs>
      <linearGradient id="restGlowEmerald" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Area fill for peak turnover volume */}
    <path
      d="M 20,40 Q 110,15 200,45 T 380,20 L 380,110 L 20,110 Z"
      fill="url(#restGlowEmerald)"
    />

    {/* Seat Turnover Volume Line */}
    <path
      d="M 20,40 Q 110,15 200,45 T 380,20"
      fill="none"
      stroke="#10B981"
      strokeWidth="2.5"
    />

    {/* RevPASH Dynamic Threshold Target Line */}
    <line x1="20" y1="75" x2="380" y2="75" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="4 4" />
    
    {/* Real-time Dynamic Node */}
    <circle cx="280" cy="32" r="3.5" fill="#06B6D4" />
    <circle cx="280" cy="32" r="7" fill="#06B6D4" opacity="0.4" className="animate-ping" />
    <text x="180" y="68" fill="#06B6D4" fontSize="9" fontFamily="monospace" fontWeight="bold">
      Weekend RevPASH Target: +24%
    </text>
  </svg>
);

export { SolutionsShowcase as ProjectSupportSection };
export default SolutionsShowcase;
