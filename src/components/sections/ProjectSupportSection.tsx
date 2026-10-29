"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sun, 
  Smile, 
  UtensilsCrossed, 
  Building2, 
  ArrowRight, 
  CheckCheck, 
  Sparkles, 
  Calendar,
  CheckCircle2
} from "lucide-react";
import { ProjectSupportSectionData } from "@/lib/types";

interface IndustryLoop {
  id: string;
  tabLabel: string;
  badge: string;
  icon: React.ElementType;
  headline: string;
  subheadline: string;
  chat: {
    sender: string;
    incoming: string;
    time: string;
    aiReply: string;
    aiAction: string;
  };
  stage2: {
    badge: string;
    title: string;
    detail: string;
    metric: string;
  };
  stage3: {
    title: string;
    destination: string;
    status: string;
  };
  dashboard: {
    chartTitle: string;
    chartType: "solar" | "clinic" | "restaurant" | "realestate";
    kpis: { label: string; value: string; delta: string }[];
    pipeline: { label: string; val: string }[];
  };
}

const INDUSTRIES: IndustryLoop[] = [
  {
    id: "solar",
    tabLabel: "Solar EPC",
    badge: "SolarPro Engine",
    icon: Sun,
    headline: "Turn Electric Bills into Signed Solar Contracts",
    subheadline: "Calculates panel sizes, monthly bill savings, and project profit the second a customer texts.",
    chat: {
      sender: "Tariq Mahmood (Factory Owner)",
      incoming: "Salam! Can I get a quote for a 30kW solar setup for our warehouse? Current bill is around Rs 210,000/mo.",
      time: "10:14 AM",
      aiReply: "Walaikum Assalam Tariq! A 30kW system will wipe out ~80% of your bill and pays for itself in ~3.2 years. Here is your initial quote: solarpro.pk/q/9821",
      aiAction: "Commercial Tariff Identified • Proposal Drafted"
    },
    stage2: {
      badge: "STEP 02 // SATELLITE ROOF CHECK",
      title: "Panel Sizing & Roof Fit",
      detail: "Mapped roof space using satellite view for 550W Tier-1 panels.",
      metric: "Est. Solar Output: 4,100 kWh/mo • Saves ~81% on Bill"
    },
    stage3: {
      title: "Site Visit Confirmed",
      destination: "Sales Pipeline → Technician Dispatch",
      status: "Survey Scheduled (Tomorrow 11:30 AM)"
    },
    dashboard: {
      chartTitle: "Quotes Sent vs. Signed Solar Projects",
      chartType: "solar",
      kpis: [
        { label: "Pipeline Value", value: "Rs 48.5M", delta: "+28%" },
        { label: "Deals Won", value: "31.4%", delta: "+6.2%" },
        { label: "Net Profit / kW", value: "18.5%", delta: "+2.1%" },
        { label: "Quote Speed", value: "2.1 min", delta: "-85%" }
      ],
      pipeline: [
        { label: "New Inquiries", val: "142" },
        { label: "Quotes Sent", val: "89" },
        { label: "Signed Deals", val: "41" }
      ]
    }
  },
  {
    id: "clinic",
    tabLabel: "Dental & Aesthetics",
    badge: "CareOps Practice Manager",
    icon: Smile,
    headline: "Keep Treatment Chairs Full All Week",
    subheadline: "Answers patient questions 24/7, screens treatment photos, and books consultations without front desk delay.",
    chat: {
      sender: "Ayesha Malik",
      incoming: "Hi! Do you have any open slots with Dr. Sarah for an Invisalign or clear aligner check this Saturday?",
      time: "08:42 PM",
      aiReply: "Hi Ayesha! Dr. Sarah has 4:15 PM open this Saturday. I have reserved the chair for you—tap here to confirm: clinic.care/book/88",
      aiAction: "High-Value Treatment • Chair Reserved"
    },
    stage2: {
      badge: "STEP 02 // PATIENT INTAKE",
      title: "Case Review & Smile Photos",
      detail: "Intake form received; smile photos filed for doctor review before visit.",
      metric: "Case Type: Clear Aligners (Mild Crowding)"
    },
    stage3: {
      title: "Appointment Locked In",
      destination: "Doctor Calendar + WhatsApp Reminder Bot",
      status: "Chair 02 Confirmed (Sat 4:15 PM)"
    },
    dashboard: {
      chartTitle: "Available Chair Hours vs. Filled Appointments",
      chartType: "clinic",
      kpis: [
        { label: "Hourly Chair Revenue", value: "Rs 8,500", delta: "+19%" },
        { label: "Doctor Occupancy", value: "88%", delta: "+14%" },
        { label: "Treatment Accepted", value: "44.2%", delta: "+8.4%" },
        { label: "No-Show Rate", value: "2.8%", delta: "-65%" }
      ],
      pipeline: [
        { label: "Inquiries", val: "310" },
        { label: "Screened Leads", val: "186" },
        { label: "Treatments Booked", val: "112" }
      ]
    }
  },
  {
    id: "restaurant",
    tabLabel: "Restaurant Group",
    badge: "Table Reservation Host",
    icon: UtensilsCrossed,
    headline: "Fill More Tables. Never Miss a Group Booking.",
    subheadline: "Handles weekend party reservations, dietary requests, and confirms dining deposits automatically.",
    chat: {
      sender: "Hamza Sheikh",
      incoming: "Hey! Can I book a table for 8 this Saturday at 8:30 PM for a birthday dinner? Can we see the set menu?",
      time: "03:15 PM",
      aiReply: "Hey Hamza! Table 14 is open for 8 guests this Saturday at 8:30 PM. I've sent the banquet menu—tap below to lock in your table!",
      aiAction: "Large Group Flagged • Minimum Spend Applied"
    },
    stage2: {
      badge: "STEP 02 // SEATING CHECK",
      title: "Floor Map & Table Match",
      detail: "Combined Tables 14 & 15 on POS floor layout for 2-hour dining slot.",
      metric: "Table Match: Private Corner Booth • 8 Seats"
    },
    stage3: {
      title: "Table Confirmed in POS",
      destination: "Floor Host Screen + Kitchen Prep Display",
      status: "Table Guaranteed (Saturday 8:30 PM)"
    },
    dashboard: {
      chartTitle: "Daily Table Turnover vs. Food Cost %",
      chartType: "restaurant",
      kpis: [
        { label: "Food & Staff Cost", value: "54.8%", delta: "-4.2%" },
        { label: "Avg Dining Time", value: "41 min", delta: "-12m" },
        { label: "Avg Spend / Table", value: "Rs 3,450", delta: "+18%" },
        { label: "Direct Bookings", value: "72%", delta: "+15%" }
      ],
      pipeline: [
        { label: "Table Requests", val: "1,420" },
        { label: "Tables Filled", val: "880" },
        { label: "Guests Served", val: "3,120" }
      ]
    }
  },
  {
    id: "realestate",
    tabLabel: "Real Estate",
    badge: "US Brokerage Lead Router",
    icon: Building2,
    headline: "Turn Online Inquiries into Private Property Showings",
    subheadline: "Verifies buyer pre-approvals, books in-person property tours, and tracks commission deals 24/7.",
    chat: {
      sender: "Marcus Vance (Pre-Approved Buyer)",
      incoming: "Hi! Is the 3-bed condo on Brickell Ave (Miami) still available? Can we tour it this Saturday afternoon?",
      time: "01:25 PM",
      aiReply: "Hi Marcus! Yes, Unit 14B is open. We have private showings this Saturday at 2:00 PM. I've sent the floor plan and held your viewing pass: estate.us/tour/14b",
      aiAction: "Verified Buyer ($1.2M Pre-Approved) • Tour Held"
    },
    stage2: {
      badge: "STEP 02 // BUYER SCREENING",
      title: "Pre-Approval & Timeline Verification",
      detail: "Verified mortgage pre-approval letter and confirmed 30-day buying timeline.",
      metric: "Financing: Approved Conventional • Budget: $1.2M–$1.5M"
    },
    stage3: {
      title: "Private Tour Confirmed",
      destination: "Agent Calendar + Lockbox Showing App",
      status: "Showing Locked (Saturday 2:00 PM)"
    },
    dashboard: {
      chartTitle: "Weekly Home Showings vs. Written Offers",
      chartType: "realestate",
      kpis: [
        { label: "Pipeline Value", value: "$42.5M", delta: "+18%" },
        { label: "Tour-to-Offer Rate", value: "34.2%", delta: "+6.8%" },
        { label: "Avg Commission", value: "$28,500", delta: "+12%" },
        { label: "Speed to Tour", value: "3.5 min", delta: "-80%" }
      ],
      pipeline: [
        { label: "Buyer Leads", val: "420" },
        { label: "Tours Hosted", val: "164" },
        { label: "Offers Written", val: "56" }
      ]
    }
  }
];

interface SolutionsShowcaseProps {
  onOpenQuoteModal?: (serviceName: string) => void;
  content?: ProjectSupportSectionData;
}

export const SolutionsShowcase: React.FC<SolutionsShowcaseProps> = ({ onOpenQuoteModal, content }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [isInteracting, setIsInteracting] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycle through stages 1 to 4 and transition cleanly across all 4 industries
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
    }, 4200);

    return () => clearInterval(interval);
  }, [isInteracting]);

  const handleTabClick = (idx: number) => {
    setActiveIdx(idx);
    setCurrentStage(1);
    setIsInteracting(true);

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setIsInteracting(false), 14000);
  };

  const handleStageClick = (sIdx: number) => {
    setCurrentStage(sIdx + 1);
    setIsInteracting(true);

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setIsInteracting(false), 14000);
  };

  const item = INDUSTRIES[activeIdx];

  return (
    <section id="project-support" className="relative w-full bg-slate-50 text-slate-900 dark:bg-[#090A0F] dark:text-slate-100 py-24 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden transition-colors duration-300">
      {/* Background glow accents */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-16 -right-20 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-mono tracking-wider uppercase text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
            Turnkey Operations
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            One engine. <span className="text-[#FF6B00]">Four built-in industries.</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            {content?.subtitle || "From the first customer WhatsApp text to automated calendar booking and live owner profit dashboards—built around how your business really works."}
          </p>
        </div>

        {/* 4 Industry Tabs */}
        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
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
                      ? "bg-[#8B5CF6]/15 border-[#8B5CF6] text-purple-700 dark:text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                      : "bg-white dark:bg-[#12151E] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-[#8B5CF6]" : "text-slate-400 dark:text-slate-500"}`} />
                  <span>{ind.tabLabel}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Preview Screen (7 Columns) */}
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#12151E] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden flex flex-col justify-between h-[510px]">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100/80 dark:bg-black/50 border-b border-slate-200 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  zavian://{item.id}.workflow
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/30 px-2.5 py-0.5 rounded font-semibold">
                Illustrative Demo Data
              </span>
            </div>

            {/* Dynamic Stage Canvas (Top-aligned to eliminate chat bubble cutoff) */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-start pt-4 overflow-hidden">
              
              {/* STAGE 01: REALISTIC WHATSAPP CHAT BUBBLES */}
              {currentStage === 1 && (
                <div className="space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
                  <div className="text-center text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Direct WhatsApp Inbound • Verified Contact
                  </div>

                  {/* Customer Bubble with Tail */}
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium ml-2">
                      {item.chat.sender}
                    </span>
                    <div className="relative bg-slate-100 dark:bg-[#1C2230] text-slate-800 dark:text-slate-100 text-xs sm:text-sm p-4 rounded-3xl rounded-tl-sm border border-slate-200 dark:border-white/5 shadow-sm max-w-[88%] leading-relaxed">
                      {/* Left Directional Tail */}
                      <svg
                        className="absolute -left-2 top-0 text-slate-100 dark:text-[#1C2230] fill-current"
                        width="8"
                        height="13"
                        viewBox="0 0 8 13"
                      >
                        <path d="M1.533 3.568 8 12.193V0H2.812C1.042 0 .474 2.156 1.533 3.568z" />
                      </svg>
                      <p>{item.chat.incoming}</p>
                      <div className="text-[9px] text-slate-400 text-right mt-1.5 font-mono">{item.chat.time}</div>
                    </div>
                  </div>

                  {/* AI Bubble with Tail */}
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-[11px] text-[#8B5CF6] font-medium mr-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Zavian AI Engine
                    </span>
                    <div className="relative bg-purple-50 dark:bg-[#8B5CF6]/20 border border-purple-200 dark:border-[#8B5CF6]/40 text-purple-950 dark:text-white text-xs sm:text-sm p-4 rounded-3xl rounded-tr-sm shadow-sm max-w-[88%] leading-relaxed">
                      {/* Right Directional Tail */}
                      <svg
                        className="absolute -right-2 top-0 text-purple-50 dark:text-[#8B5CF6]/20 fill-current"
                        width="8"
                        height="13"
                        viewBox="0 0 8 13"
                      >
                        <path d="M6.467 3.568 0 12.193V0h5.188c1.77 0 2.338 2.156 1.279 3.568z" />
                      </svg>
                      <p>{item.chat.aiReply}</p>
                      <div className="text-[9px] text-purple-600 dark:text-purple-300 flex items-center justify-end gap-1 mt-1.5 font-mono">
                        Just now <CheckCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
                      </div>
                    </div>
                  </div>

                  {/* Action Pill */}
                  <div className="bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#FF6B00] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
                      {item.chat.aiAction}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Sub-3s Response</span>
                  </div>
                </div>
              )}

              {/* STAGE 02: AUTO-QUALIFY STEP */}
              {currentStage === 2 && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-4 max-w-md mx-auto w-full my-auto animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="text-[#8B5CF6] font-bold tracking-wider">{item.stage2.badge}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Checked
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{item.stage2.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.stage2.detail}</p>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-mono text-[#FF6B00] font-semibold">
                    {item.stage2.metric}
                  </div>
                </div>
              )}

              {/* STAGE 03: CALENDAR LOCK */}
              {currentStage === 3 && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-4 max-w-md mx-auto w-full my-auto animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    <Calendar className="w-4 h-4" />
                    <span>LOCKED IN CALENDAR</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{item.stage3.title}</h4>
                  <div className="text-sm font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-2">
                    <div className="text-slate-400 text-xs">Route Destination:</div>
                    <div className="text-slate-900 dark:text-white font-semibold">{item.stage3.destination}</div>
                    <div className="text-xs text-[#FF6B00] pt-1 border-t border-slate-100 dark:border-white/5 font-semibold">{item.stage3.status}</div>
                  </div>
                </div>
              )}

              {/* STAGE 04: CEO RADAR DASHBOARD */}
              {currentStage === 4 && (
                <div className="space-y-4 my-auto animate-in fade-in duration-200">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {item.dashboard.kpis.map((k, kidx) => (
                      <div key={kidx} className="p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 min-w-0">
                        <div className="text-xs text-slate-500 dark:text-slate-400 leading-none truncate">{k.label}</div>
                        <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1.5">{k.value}</div>
                        <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{k.delta}</div>
                      </div>
                    ))}
                  </div>

                  {/* SVG Chart */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.dashboard.chartTitle}</div>
                    <div className="h-28 flex items-center justify-center">
                      {item.dashboard.chartType === "solar" && <SolarChart />}
                      {item.dashboard.chartType === "clinic" && <ClinicBarChart />}
                      {item.dashboard.chartType === "restaurant" && <RestaurantChart />}
                      {item.dashboard.chartType === "realestate" && <RealEstateChart />}
                    </div>
                  </div>

                  {/* Pipeline Counters */}
                  <div className="grid grid-cols-3 gap-2">
                    {item.dashboard.pipeline.map((p, pidx) => (
                      <div key={pidx} className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-center">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">{p.label}</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{p.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Status Ticker */}
            <div className="px-5 py-3 bg-slate-100/80 dark:bg-black/50 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                STAGE 0{currentStage} ACTIVE
              </span>
              <span className="text-[#FF6B00] font-semibold">AUTONOMOUS SYSTEM</span>
            </div>
          </div>

          {/* Right: Asymmetrical Step Stack (5 Columns) */}
          <div className="lg:col-span-5 space-y-3.5">
            {[
              {
                num: "01",
                tag: "INSTANT INBOUND",
                title: "Instant WhatsApp Reply",
                desc: "Answers every customer inquiry within 3 seconds with exact pricing and answers, even late at night."
              },
              {
                num: "02",
                tag: "SMART FILTER",
                title: "Auto-Qualify & Screening",
                desc: "Checks project budget, service requirements, and customer fit before passing anything to your team."
              },
              {
                num: "03",
                tag: "ZERO DELAY",
                title: "Direct Calendar Booking",
                desc: "Locks site visits, dental chairs, restaurant tables, or property tours straight into your calendar."
              },
              {
                num: "04",
                tag: "OWNER RADAR",
                title: "Live Profit & Margin Dashboard",
                desc: "See weekly closed revenue, open proposal values, and staff efficiency without opening a spreadsheet."
              }
            ].map((step, sIdx) => {
              const active = currentStage === sIdx + 1;
              return (
                <div
                  key={sIdx}
                  onClick={() => handleStageClick(sIdx)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
                    active
                      ? "bg-white dark:bg-[#12151E] border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.18)] translate-x-1"
                      : "bg-white/60 dark:bg-[#12151E]/60 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={active ? "text-[#FF6B00] font-bold" : "text-slate-400 dark:text-slate-500"}>
                      {step.num} • {step.tag}
                    </span>
                    {active && <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{step.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom CTA Bar */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#12151E] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Ready to deploy these automated systems into your business?
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.35)] shrink-0 cursor-pointer"
          >
            <span>Request Custom Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

// -------------------------------------------------------------
// Human-Friendly Charts for Stage 04
// -------------------------------------------------------------

const SolarChart = () => (
  <svg viewBox="0 0 400 120" className="w-full h-full">
    <path d="M 20,95 Q 110,80 190,30 T 380,18" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
    <path d="M 20,80 Q 110,75 190,55 T 380,50" fill="none" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="280" cy="22" r="3.5" fill="#FF6B00" />
    <text x="235" y="15" fill="#FF6B00" fontSize="10" fontFamily="monospace">Signed: +28%</text>
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
      <div key={i} className="flex gap-1.5 items-end h-20">
        <div className="w-3.5 bg-slate-300 dark:bg-slate-700/80 rounded-t-sm" style={{ height: `${b.cap}%` }} />
        <div className={`w-3.5 rounded-t-sm ${i === 4 ? "bg-[#FF6B00]" : "bg-[#8B5CF6]"}`} style={{ height: `${b.book}%` }} />
      </div>
    ))}
  </div>
);

const RestaurantChart = () => (
  <svg viewBox="0 0 400 120" className="w-full h-full">
    <path d="M 20,25 L 100,40 L 180,30 L 260,20 L 380,12" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
    <path d="M 20,90 L 100,75 L 180,65 L 260,55 L 380,48" fill="none" stroke="#FF6B00" strokeWidth="2" strokeDasharray="4 4" />
    <text x="240" y="70" fill="#FF6B00" fontSize="10" fontFamily="monospace">Cost: 54.8%</text>
  </svg>
);

const RealEstateChart = () => (
  <svg viewBox="0 0 400 120" className="w-full h-full">
    <path d="M 20,85 Q 110,75 200,35 T 380,20" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
    <path d="M 20,100 Q 110,85 200,55 T 380,45" fill="none" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="280" cy="22" r="3.5" fill="#FF6B00" />
    <text x="235" y="15" fill="#FF6B00" fontSize="10" fontFamily="monospace">Offers: +34%</text>
  </svg>
);

export { SolutionsShowcase as ProjectSupportSection };
export default SolutionsShowcase;
