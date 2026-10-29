"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sun, 
  Smile, 
  UtensilsCrossed, 
  Layers, 
  Truck, 
  ArrowRight, 
  CheckCheck, 
  Sparkles, 
  Info,
  Calendar,
  Database,
  TrendingUp
} from "lucide-react";
import { ProjectSupportSectionData } from "@/lib/types";

interface IndustryLoop {
  id: string;
  tabLabel: string;
  badge: string;
  icon: React.ElementType;
  headline: string;
  subheadline: string;
  // Stage 01: Chat
  chat: {
    sender: string;
    incoming: string;
    time: string;
    aiReply: string;
    aiAction: string;
  };
  // Stage 02: Triage
  stage2: {
    title: string;
    step: string;
    output: string;
  };
  // Stage 03: CRM/Sync
  stage3: {
    action: string;
    target: string;
    status: string;
  };
  // Stage 04: CEO Dashboard
  dashboard: {
    kpis: { label: string; value: string; delta: string }[];
    chartTitle: string;
    chartType: "solar" | "clinic" | "restaurant" | "saas" | "logistics";
    pipeline: { label: string; val: string }[];
  };
}

const INDUSTRIES: IndustryLoop[] = [
  {
    id: "solar",
    tabLabel: "Solar EPC",
    badge: "SolarPro Proposal Engine",
    icon: Sun,
    headline: "Instant PV Quotes to Pipeline Margins",
    subheadline: "Turns raw power bills into bankable solar designs, site visits, and gross margin tracking in seconds.",
    chat: {
      sender: "Tariq Mahmood (Textile Mills)",
      incoming: "Need a 25kW hybrid quote for our SITE warehouse. Current bill is around Rs 185k/mo.",
      time: "10:14 AM",
      aiReply: "Analyzed your Commercial A-2 tariff. Estimated payback: 3.4 years. Sent preliminary proposal link to your email.",
      aiAction: "Commercial Tariff Identified • Proposal Drafted"
    },
    stage2: {
      title: "Parametric PV Sizing",
      step: "Satellite roof geometry matched with 550W Tier-1 panels.",
      output: "Est. Generation: 3,450 kWh/mo • Offset: 78%"
    },
    stage3: {
      action: "Site Survey & Proposal Locked",
      target: "CRM Pipeline • SolarPro Dispatch",
      status: "Survey Booked (Tomorrow 11:30 AM)"
    },
    dashboard: {
      chartTitle: "Quoted vs. Closed Commercial Capacity (kW)",
      chartType: "solar",
      kpis: [
        { label: "Pipeline Value", value: "Rs 48.5M", delta: "+28%" },
        { label: "Close Rate", value: "31.4%", delta: "+6.2%" },
        { label: "Gross Margin", value: "18.5%", delta: "+2.1%" },
        { label: "Proposal Time", value: "2.1 min", delta: "-85%" }
      ],
      pipeline: [
        { label: "Inbound Leads", val: "142" },
        { label: "Proposals Sent", val: "89" },
        { label: "Deals Closed", val: "41" }
      ]
    }
  },
  {
    id: "clinic",
    tabLabel: "Aesthetic & Dental",
    badge: "CareOps Chair Manager",
    icon: Smile,
    headline: "Fill High-Value Clinical Chairs Fast",
    subheadline: "Capture elective inquiries, triage case photos, and secure treatment deposits 24/7 without desk staff.",
    chat: {
      sender: "Ayesha Malik",
      incoming: "Hi! Any open slot with Dr. Sarah for composite veneers consultation this Friday evening?",
      time: "08:42 PM",
      aiReply: "Dr. Sarah has 5:30 PM open this Friday. I've reserved it and sent the consultation intake link.",
      aiAction: "High-Ticket Intent Detected • Slot Reserved"
    },
    stage2: {
      title: "Patient Triage & Screening",
      step: "Smile photos requested & pre-consult questionnaire sent.",
      output: "Assessment: Class I Aesthetic Veneers (4-6 Units)"
    },
    stage3: {
      action: "Appointment & Deposit Confirmed",
      target: "Cliniko Calendar & WhatsApp Notifier",
      status: "Chair 02 Confirmed (Fri 5:30 PM)"
    },
    dashboard: {
      chartTitle: "Doctor Utilization & Chair Revenue (RevPASH)",
      chartType: "clinic",
      kpis: [
        { label: "RevPASH", value: "Rs 8,500/hr", delta: "+19%" },
        { label: "Doctor Utilization", value: "88%", delta: "+14%" },
        { label: "High-Ticket Close", value: "44.2%", delta: "+8.4%" },
        { label: "No-Show Rate", value: "2.8%", delta: "-65%" }
      ],
      pipeline: [
        { label: "Consult Requests", val: "310" },
        { label: "Qualified Cases", val: "186" },
        { label: "Treatment Accepted", val: "112" }
      ]
    }
  },
  {
    id: "restaurant",
    tabLabel: "Restaurant Group",
    badge: "Table & Prime Cost Router",
    icon: UtensilsCrossed,
    headline: "Maximum Seat Turns, Zero Booking Drop-Off",
    subheadline: "Handle large group bookings, private dining minimum spends, and POS seating allocations instantly.",
    chat: {
      sender: "Hamza Sheikh",
      incoming: "Table for 10 this Saturday at 8:30 PM for a birthday dinner? Can we see the set menu?",
      time: "03:15 PM",
      aiReply: "Table 14 is open! I've attached our 8-course banquet menu. Tap below to confirm reservation.",
      aiAction: "Large Group Flagged • Minimum Spend Applied"
    },
    stage2: {
      title: "Floor Table Allocation",
      step: "POS floor map checked for turnover velocity.",
      output: "Matched Table 14+15 combination (2h dining slot)"
    },
    stage3: {
      action: "Reservation Locked in POS",
      target: "Kitchen & Host Display Engine",
      status: "Guaranteed Hold (Sat 8:30 PM)"
    },
    dashboard: {
      chartTitle: "Daily Seat Turns vs. Prime Cost %",
      chartType: "restaurant",
      kpis: [
        { label: "Prime Cost", value: "54.8%", delta: "-4.2%" },
        { label: "Table Turn Time", value: "41 min", delta: "-12m" },
        { label: "Avg Dine-in Spend", value: "Rs 3,450", delta: "+18%" },
        { label: "Direct Direct %", value: "72%", delta: "+15%" }
      ],
      pipeline: [
        { label: "Inquiries", val: "1,420" },
        { label: "Tables Reserved", val: "880" },
        { label: "Guests Served", val: "3,120" }
      ]
    }
  },
  {
    id: "saas",
    tabLabel: "B2B SaaS",
    badge: "RevOps Conversion Engine",
    icon: Layers,
    headline: "Speed-to-Lead Pipeline Velocity",
    subheadline: "Qualify inbound enterprise prospects, enrich headcount data, and route demos directly to Account Executives.",
    chat: {
      sender: "David Chen (VP Eng)",
      incoming: "We're 80 seats on Datadog looking to integrate your automated API pipeline. Pricing?",
      time: "11:20 AM",
      aiReply: "You qualify for our Enterprise tier. I have scheduled an executive architecture walkthrough with our lead AE.",
      aiAction: "ARR > $50k Qualified • Calendar Dispatched"
    },
    stage2: {
      title: "Domain Enrichment",
      step: "Clearbit API ping: 85 employees • Series A funding.",
      output: "Ideal Customer Profile: Tier-1 Enterprise"
    },
    stage3: {
      action: "CRM Deal Staged & Synced",
      target: "Salesforce / Slack Account Exec Channel",
      status: "Demo Booked (Thursday 2:00 PM)"
    },
    dashboard: {
      chartTitle: "Sales Velocity vs. Deal Conversion Funnel",
      chartType: "saas",
      kpis: [
        { label: "Pipeline Velocity", value: "$24.5k/wk", delta: "+32%" },
        { label: "Lead-to-Demo", value: "52.4%", delta: "+11%" },
        { label: "Average ACV", value: "$36,000", delta: "+18%" },
        { label: "CAC Payback", value: "6.8 Mo", delta: "-2.4m" }
      ],
      pipeline: [
        { label: "Inbound MQL", val: "840" },
        { label: "Qualified SQL", val: "410" },
        { label: "Contracts Closed", val: "84" }
      ]
    }
  },
  {
    id: "logistics",
    tabLabel: "Logistics Fleet",
    badge: "Freight Dispatch Router",
    icon: Truck,
    headline: "Automated Rate Spotting & Fleet Turnaround",
    subheadline: "Generate instant lane pricing, confirm driver manifests, and eliminate deadhead miles on auto-pilot.",
    chat: {
      sender: "Bilal Logistics Ops",
      incoming: "Rate for 2x 40ft flatbeds from Karachi Port to Sundar Estate Lahore next Tuesday?",
      time: "02:40 PM",
      aiReply: "Quoted Rs 340,000 per flatbed based on current diesel index. Drivers pre-allocated.",
      aiAction: "Lane Matched • Spot Margin Calculated"
    },
    stage2: {
      title: "Route & Backhaul Calculation",
      step: "Diesel matrix indexed + return load probability checked.",
      output: "Backhaul Probability: 91% • Est. Margin: 22%"
    },
    stage3: {
      action: "Digital Waybill Pre-Staged",
      target: "Fleet TMS & Driver WhatsApp Dispatch",
      status: "Manifest Dispatched (Tue 6:00 AM)"
    },
    dashboard: {
      chartTitle: "Fulfillment Velocity vs. Fleet Uptime",
      chartType: "logistics",
      kpis: [
        { label: "Fleet Uptime", value: "98.4%", delta: "+4.1%" },
        { label: "Dock Dwell Time", value: "34 min", delta: "-48%" },
        { label: "Empty Miles", value: "6.2%", delta: "-14%" },
        { label: "Fuel Savings", value: "15.8%", delta: "+3.2%" }
      ],
      pipeline: [
        { label: "Loads Ingested", val: "540" },
        { label: "Dispatched", val: "518" },
        { label: "Reconciled", val: "498" }
      ]
    }
  }
];

// -------------------------------------------------------------------
// Domain Authentic SVG Visualizations for Stage 04
// -------------------------------------------------------------------

const SolarChart = () => (
  <svg viewBox="0 0 400 120" className="w-full h-full">
    <path d="M 20,95 Q 100,85 180,30 T 380,20" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
    <path d="M 20,80 Q 100,75 180,60 T 380,55" fill="none" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="280" cy="22" r="3.5" fill="#FF6B00" />
    <text x="250" y="15" fill="#FF6B00" fontSize="9" fontFamily="monospace">Quoted MW: +38%</text>
  </svg>
);

const ClinicBarChart = () => (
  <div className="w-full h-full flex items-end justify-around px-4">
    {[
      { cap: 70, book: 62 },
      { cap: 85, book: 80 },
      { cap: 90, book: 88 },
      { cap: 95, book: 92 },
      { cap: 100, book: 98 },
    ].map((b, i) => (
      <div key={i} className="flex gap-1 items-end h-24">
        <div className="w-3 bg-slate-700 rounded-t-sm" style={{ height: `${b.cap}%` }} />
        <div className={`w-3 rounded-t-sm ${i === 4 ? "bg-[#FF6B00]" : "bg-[#8B5CF6]"}`} style={{ height: `${b.book}%` }} />
      </div>
    ))}
  </div>
);

const RestaurantChart = () => (
  <svg viewBox="0 0 400 120" className="w-full h-full">
    <path d="M 20,30 L 100,45 L 180,35 L 260,25 L 380,15" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
    <path d="M 20,90 L 100,75 L 180,65 L 260,55 L 380,50" fill="none" stroke="#FF6B00" strokeWidth="2" strokeDasharray="4 4" />
    <text x="260" y="70" fill="#FF6B00" fontSize="9" fontFamily="monospace">Prime Cost: 54.8%</text>
  </svg>
);

const SaasFunnelChart = () => (
  <div className="w-full h-full flex flex-col justify-around px-4">
    {[
      { w: "92%", label: "Inbound MQL", color: "bg-slate-300" },
      { w: "65%", label: "Qualified SQL", color: "bg-[#8B5CF6]" },
      { w: "38%", label: "Demo Completed", color: "bg-[#8B5CF6]" },
      { w: "18%", label: "Closed Won", color: "bg-[#FF6B00]" },
    ].map((f, i) => (
      <div key={i} className="flex items-center gap-2">
        <span className="w-24 text-[10px] text-slate-400 font-mono text-right">{f.label}</span>
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full ${f.color} rounded-full`} style={{ width: f.w }} />
        </div>
      </div>
    ))}
  </div>
);

const LogisticsChart = () => (
  <svg viewBox="0 0 400 120" className="w-full h-full">
    <path d="M 20,80 L 110,70 L 200,40 L 290,30 L 380,20" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
    <path d="M 20,100 L 110,85 L 200,60 L 290,45 L 380,35" fill="none" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="290" cy="30" r="3.5" fill="#FF6B00" />
    <text x="240" y="20" fill="#FF6B00" fontSize="9" fontFamily="monospace">98.4% On-Time</text>
  </svg>
);

interface SolutionsShowcaseProps {
  onOpenQuoteModal?: (serviceName: string) => void;
  content?: ProjectSupportSectionData;
}

export const SolutionsShowcase: React.FC<SolutionsShowcaseProps> = ({ onOpenQuoteModal, content }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [isInteracting, setIsInteracting] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycle stages: 1 -> 2 -> 3 -> 4 -> 1 (with industry change on 4->1)
  useEffect(() => {
    if (isInteracting) return;

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev === 4) {
          setActiveIdx((curr) => (curr + 1) % INDUSTRIES.length);
          return 1;
        }
        return prev + 1;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [isInteracting]);

  const handleTabClick = (idx: number) => {
    setActiveIdx(idx);
    setCurrentStage(1);
    setIsInteracting(true);

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setIsInteracting(false), 12000);
  };

  const handleStageClick = (stageNum: number) => {
    setCurrentStage(stageNum);
    setIsInteracting(true);

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setIsInteracting(false), 12000);
  };

  const item = INDUSTRIES[activeIdx];

  return (
    <section id="project-support" className="relative w-full bg-[#090A0F] text-slate-100 py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Editorial Top Headline */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider uppercase text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
            Turnkey Operations
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            One engine. Five built-in industries.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {content?.subtitle || "From first WhatsApp inquiry to automated CRM lock-in and CEO-level margins."}
          </p>
        </div>

        {/* Scrollable Industry Selectors */}
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {INDUSTRIES.map((ind, idx) => {
              const Icon = ind.icon;
              const active = idx === activeIdx;
              return (
                <button
                  key={ind.id}
                  onClick={() => handleTabClick(idx)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 snap-start border cursor-pointer ${
                    active
                      ? "bg-[#8B5CF6]/15 border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                      : "bg-[#12151E] border-white/5 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-[#8B5CF6]" : "text-slate-500"}`} />
                  <span>{ind.tabLabel}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Preview Screen */}
          <div className="lg:col-span-7 rounded-2xl bg-[#12151E] border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between min-h-[460px]">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-black/40 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]/70" />
                <span className="text-xs font-mono text-slate-400">
                  zavian://{item.id}.workflow
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/30 px-2.5 py-0.5 rounded font-semibold">
                Illustrative Demo Data
              </span>
            </div>

            {/* Dynamic Stage Canvas */}
            <div className="p-6 flex-1 flex flex-col justify-center">
              
              {/* STAGE 01: WHATSAPP CHAT BUBBLES */}
              {currentStage === 1 && (
                <div className="space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
                  <div className="text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    WhatsApp Inbound • Verified Channel
                  </div>

                  {/* Customer Message Bubble */}
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-[10px] text-slate-400 ml-1">{item.chat.sender}</span>
                    <div className="bg-[#1F2433] text-slate-200 text-sm p-3.5 rounded-2xl rounded-tl-sm border border-white/5 shadow-md max-w-[88%] leading-relaxed">
                      {item.chat.incoming}
                      <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">{item.chat.time}</div>
                    </div>
                  </div>

                  {/* AI Auto-Response Bubble */}
                  <div className="flex flex-col items-end space-y-1 pt-1">
                    <span className="text-[10px] text-[#8B5CF6] mr-1 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3" /> Zavian AI Engine
                    </span>
                    <div className="bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-white text-sm p-3.5 rounded-2xl rounded-tr-sm shadow-md max-w-[88%] leading-relaxed">
                      {item.chat.aiReply}
                      <div className="text-[9px] text-purple-300 flex items-center justify-end gap-1 mt-1 font-mono">
                        Just now <CheckCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
                      </div>
                    </div>
                  </div>

                  {/* Action Micro-Card */}
                  <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="text-[#FF6B00] flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
                      {item.chat.aiAction}
                    </span>
                    <span className="text-emerald-400 font-medium">Sub-3s Response</span>
                  </div>
                </div>
              )}

              {/* STAGE 02: TRIAGE STEP */}
              {currentStage === 2 && (
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="uppercase text-[#8B5CF6] font-bold">Stage 02 • Auto-Triage</span>
                    <span>Confidence: 99.4%</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">{item.stage2.title}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.stage2.step}</p>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs font-mono text-[#FF6B00] font-medium">
                    {item.stage2.output}
                  </div>
                </div>
              )}

              {/* STAGE 03: CRM & CALENDAR LOCK */}
              {currentStage === 3 && (
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>SYNCHRONIZED WITH ZERO DELAY</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">{item.stage3.action}</h4>
                  <div className="text-sm font-mono text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <div className="text-slate-400 text-xs">Route Destination:</div>
                    <div className="text-white font-semibold">{item.stage3.target}</div>
                    <div className="text-xs text-[#FF6B00] pt-1 font-medium">{item.stage3.status}</div>
                  </div>
                </div>
              )}

              {/* STAGE 04: AUTHENTIC CEO DASHBOARD */}
              {currentStage === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {item.dashboard.kpis.map((k, kidx) => (
                      <div key={kidx} className="p-3 rounded-xl bg-black/30 border border-white/5">
                        <div className="text-xs text-slate-400 leading-none">{k.label}</div>
                        <div className="text-lg sm:text-xl font-bold text-white mt-1.5">{k.value}</div>
                        <div className="text-[10px] font-mono text-emerald-400 mt-0.5">{k.delta}</div>
                      </div>
                    ))}
                  </div>

                  {/* SVG Chart */}
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                    <div className="text-xs font-semibold text-slate-300">{item.dashboard.chartTitle}</div>
                    <div className="h-32 flex items-center justify-center">
                      {item.dashboard.chartType === "solar" && <SolarChart />}
                      {item.dashboard.chartType === "clinic" && <ClinicBarChart />}
                      {item.dashboard.chartType === "restaurant" && <RestaurantChart />}
                      {item.dashboard.chartType === "saas" && <SaasFunnelChart />}
                      {item.dashboard.chartType === "logistics" && <LogisticsChart />}
                    </div>
                  </div>

                  {/* Pipeline Stage Pills */}
                  <div className="grid grid-cols-3 gap-2">
                    {item.dashboard.pipeline.map((p, pidx) => (
                      <div key={pidx} className="p-2.5 rounded-lg bg-white/5 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-mono">{p.label}</div>
                        <div className="text-sm font-bold text-white mt-0.5">{p.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Status Ticker */}
            <div className="px-5 py-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                STAGE 0{currentStage} ACTIVE
              </span>
              <span className="text-[#FF6B00] font-semibold">AUTONOMOUS PIPELINE</span>
            </div>
          </div>

          {/* Right: The 4 Chronological Workflow Cards */}
          <div className="lg:col-span-5 space-y-3">
            {[
              {
                num: "01",
                tag: "OMNICHANNEL INGESTION",
                title: "Instant Inbound Qualification",
                desc: "Captures 100% of WhatsApp inquiries and web leads with contextual natural-language AI response in under 5 seconds."
              },
              {
                num: "02",
                tag: "PARAMETRIC TRIAGE",
                title: "Automated Logic & Sizing",
                desc: "Validates technical constraints, applies commercial pricing rules, and enriches records without manual data entry."
              },
              {
                num: "03",
                tag: "AUTOMATED SYNC",
                title: "Calendar, POS & CRM Lock",
                desc: "Instantly stakes the appointment, dispatches pre-consult material, and generates booking deposit links."
              },
              {
                num: "04",
                tag: "MEASURABLE RESULTS",
                title: "Executive Revenue Telemetry",
                desc: "Real-time visibility into chair occupancy, solar margins, table turns, and deal conversion rates."
              }
            ].map((step, sIdx) => {
              const active = currentStage === sIdx + 1;
              return (
                <div
                  key={sIdx}
                  onClick={() => handleStageClick(sIdx + 1)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
                    active
                      ? "bg-[#12151E] border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      : "bg-[#12151E]/60 border-white/5 hover:border-white/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={active ? "text-[#FF6B00] font-semibold" : "text-slate-500"}>
                      {step.num} • {step.tag}
                    </span>
                    {active && <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{step.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Call to Action Strip */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#12151E] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
            <p className="text-sm text-slate-300 font-medium">
              Ready to deploy these customized architectures into your business?
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onOpenQuoteModal) {
                onOpenQuoteModal(item.tabLabel);
              } else {
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.35)] shrink-0 cursor-pointer"
          >
            <span>Request Custom Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

export { SolutionsShowcase as ProjectSupportSection };
export default SolutionsShowcase;
