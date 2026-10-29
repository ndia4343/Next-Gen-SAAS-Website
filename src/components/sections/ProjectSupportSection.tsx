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
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Lock
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
    chartType: "solar" | "clinic" | "restaurant" | "saas" | "logistics";
    kpis: { label: string; value: string; delta: string }[];
    pipeline: { label: string; val: string }[];
  };
}

const INDUSTRIES: IndustryLoop[] = [
  {
    id: "solar",
    tabLabel: "Solar EPC",
    badge: "SolarPro Proposal Engine",
    icon: Sun,
    headline: "Turn Power Bills into Signed Solar Contracts",
    subheadline: "Calculates panel sizing, net-metering ROI, and profit margins automatically the second a customer texts.",
    chat: {
      sender: "Tariq Mahmood (Factory Owner)",
      incoming: "Salam! We need a 30kW solar quote for our factory in Karachi. Last month's bill was Rs 210,000.",
      time: "10:14 AM",
      aiReply: "Walaikum Assalam Tariq! Based on your Commercial A-2 bill, a 30kW system saves ~Rs 165,000/mo with a 3.2-year payback. Here is your preliminary design & proposal: solarpro.pk/q/9821",
      aiAction: "Commercial Tariff Identified • Custom Proposal Drafted"
    },
    stage2: {
      badge: "STEP 02 // ROOFTOP AUDIT",
      title: "Automatic Satellite Roof Scan",
      detail: "Scanned roof layout and fitted 550W Tier-1 solar panels for maximum sunshine capture.",
      metric: "Expected Power: 4,100 kWh/mo • Electricity Bill Cut by 81%"
    },
    stage3: {
      title: "Site Survey & Proposal Scheduled",
      destination: "Sales Pipeline → Field Engineering Route",
      status: "On-Site Engineer Visit: Tomorrow 11:30 AM"
    },
    dashboard: {
      chartTitle: "Solar System Size vs. Monthly Power Saved",
      chartType: "solar",
      kpis: [
        { label: "Pipeline Revenue", value: "Rs 48.5M", delta: "+28%" },
        { label: "Deals Won", value: "31.4%", delta: "+6.2%" },
        { label: "Profit per kW", value: "18.5%", delta: "+2.1%" },
        { label: "Time to Quote", value: "2.1 min", delta: "-85%" }
      ],
      pipeline: [
        { label: "Customer Inquiries", val: "142" },
        { label: "Proposals Sent", val: "89" },
        { label: "Signed Contracts", val: "41" }
      ]
    }
  },
  {
    id: "clinic",
    tabLabel: "Aesthetic & Dental",
    badge: "CareOps Practice Manager",
    icon: Smile,
    headline: "Fill High-Value Dental & Cosmetic Chairs",
    subheadline: "Answers patient questions 24/7, reviews smile photos, and secures consultation deposits without front desk delays.",
    chat: {
      sender: "Ayesha Malik",
      incoming: "Hi! Do you have any slots open with Dr. Sarah for a veneer consultation this Saturday afternoon?",
      time: "08:42 PM",
      aiReply: "Hi Ayesha! Dr. Sarah has a 4:15 PM slot available this Saturday. I have held the chair for you—tap here to confirm your visit: clinic.care/book/88",
      aiAction: "High-Ticket Intent Detected • Appointment Held"
    },
    stage2: {
      badge: "STEP 02 // PATIENT TRIAGE",
      title: "Treatment Screening & Smile Assessment",
      detail: "Sent quick intake form; patient uploaded front smile photos for doctor review.",
      metric: "Screening Result: Aesthetic Ceramic Veneers (4-6 Units)"
    },
    stage3: {
      title: "Chair & Deposit Confirmed",
      destination: "Practice Management Calendar + WhatsApp Reminder",
      status: "Operatory Chair 02 Confirmed (Saturday 4:15 PM)"
    },
    dashboard: {
      chartTitle: "Chair Busy Hours vs. Total Weekly Appointments",
      chartType: "clinic",
      kpis: [
        { label: "Hourly Chair Revenue", value: "Rs 8,500/hr", delta: "+19%" },
        { label: "Doctor Busy Rate", value: "88%", delta: "+14%" },
        { label: "Treatment Close Rate", value: "44.2%", delta: "+8.4%" },
        { label: "No-Shows Avoided", value: "2.8%", delta: "-65%" }
      ],
      pipeline: [
        { label: "Patient Inquiries", val: "310" },
        { label: "Cases Qualified", val: "186" },
        { label: "Treatments Started", val: "112" }
      ]
    }
  },
  {
    id: "restaurant",
    tabLabel: "Restaurant Group",
    badge: "Table & Reservation Host",
    icon: UtensilsCrossed,
    headline: "More Table Turns. Zero Missed Reservations.",
    subheadline: "Handles weekend party bookings, confirms dietary needs, and protects high-demand tables with minimum spends.",
    chat: {
      sender: "Hamza Sheikh",
      incoming: "Hey! Can I book a table for 8 people tomorrow at 8:30 PM for a birthday dinner? Can we see the set menu?",
      time: "03:15 PM",
      aiReply: "Hey Hamza! We’d love to host your birthday dinner. Table 12 is available for 8 guests tomorrow at 8:30 PM. I’ve attached our banquet menu—tap below to lock it in!",
      aiAction: "Large Birthday Party • Table Combination Held"
    },
    stage2: {
      badge: "STEP 02 // SEATING OPTIMIZATION",
      title: "Smart Floor & Seating Match",
      detail: "Floor system combined tables 12 & 13 for optimal turnaround without crowding.",
      metric: "Seating: Private Corner Booth • Dining Slot: 2 Hours"
    },
    stage3: {
      title: "Table Locked in Host POS",
      destination: "Floor Management Screen & Kitchen Host",
      status: "Guaranteed Hold Confirmed (Tomorrow 8:30 PM)"
    },
    dashboard: {
      chartTitle: "Table Occupancy vs. Food & Labor Costs",
      chartType: "restaurant",
      kpis: [
        { label: "Food & Labor Cost", value: "54.8%", delta: "-4.2%" },
        { label: "Avg Table Turn Time", value: "41 min", delta: "-12m" },
        { label: "Avg Dine-In Spend", value: "Rs 3,450", delta: "+18%" },
        { label: "Direct Bookings", value: "72%", delta: "+15%" }
      ],
      pipeline: [
        { label: "Booking Requests", val: "1,420" },
        { label: "Tables Reserved", val: "880" },
        { label: "Guests Welcomed", val: "3,120" }
      ]
    }
  },
  {
    id: "saas",
    tabLabel: "B2B SaaS",
    badge: "RevOps Conversion Engine",
    icon: Layers,
    headline: "Speed-to-Lead for Enterprise Inbounds",
    subheadline: "Enriches company size, confirms budget suitability, and routes enterprise accounts straight to senior sales reps.",
    chat: {
      sender: "David Chen (VP Engineering)",
      incoming: "We're an 80-person dev team looking to connect your automated pipeline into our CRM. What does enterprise pricing look like?",
      time: "11:20 AM",
      aiReply: "Hi David! With 80 engineers, you qualify for our Enterprise tier. I have scheduled a 20-min architecture walkthrough with our Lead Solutions Architect for Thursday at 2:00 PM. Calendar invite sent!",
      aiAction: "Enterprise Lead Qualified • Specialist Calendar Dispatched"
    },
    stage2: {
      badge: "STEP 02 // ACCOUNT LOOKUP",
      title: "Instant Company Background Check",
      detail: "Looked up company profile: 85 engineers, Series A funding, high daily data volume.",
      metric: "Customer Fit Score: Tier-1 Enterprise (High Value)"
    },
    stage3: {
      title: "Deal Created & Meeting Booked",
      destination: "Salesforce CRM + Slack Leadership Channel",
      status: "Architecture Demo Booked (Thursday 2:00 PM)"
    },
    dashboard: {
      chartTitle: "Weekly Lead-to-Sale Conversion Funnel",
      chartType: "saas",
      kpis: [
        { label: "New Sales / Week", value: "$24.5k/wk", delta: "+32%" },
        { label: "Demo Booking Rate", value: "52.4%", delta: "+11%" },
        { label: "Average Deal Size", value: "$36,000", delta: "+18%" },
        { label: "Time to Profit", value: "6.8 Mo", delta: "-2.4m" }
      ],
      pipeline: [
        { label: "Leads Ingested", val: "840" },
        { label: "Live Demos Booked", val: "410" },
        { label: "Deals Closed", val: "84" }
      ]
    }
  },
  {
    id: "logistics",
    tabLabel: "Logistics Fleet",
    badge: "Freight Dispatch Router",
    icon: Truck,
    headline: "Instant Spot Rates & Zero Empty Miles",
    subheadline: "Quotes cargo loads based on live fuel prices, assigns trucks, and verifies return cargo automatically.",
    chat: {
      sender: "Bilal Logistics Ops",
      incoming: "Salam! Need freight rates for 2x 40ft flatbed trucks from Karachi Port to Sundar Industrial Estate Lahore next Tuesday. Cargo is packed and ready.",
      time: "02:40 PM",
      aiReply: "Walaikum Assalam Bilal! Quoted Rs 335,000 per flatbed based on today's diesel index. Both trucks are reserved and ready. View manifest: fleet.pk/m/41",
      aiAction: "Lane Matched • Spot Diesel Index Calculated"
    },
    stage2: {
      badge: "STEP 02 // RETURN TRIP PLANNING",
      title: "Route Margin & Fuel Indexing",
      detail: "Calculated route margin and matched return load from Lahore industrial hub to avoid empty driving.",
      metric: "Return Cargo Match: 91% • Trip Profit Margin: 22%"
    },
    stage3: {
      title: "Digital Waybill Dispatched",
      destination: "Fleet Dispatch Board + Driver WhatsApp Route",
      status: "Truck Manifest Confirmed (Tue 6:00 AM Departure)"
    },
    dashboard: {
      chartTitle: "Trucks on Route vs. On-Time Deliveries",
      chartType: "logistics",
      kpis: [
        { label: "Fleet in Motion", value: "98.4%", delta: "+4.1%" },
        { label: "Loading Dock Wait", value: "34 min", delta: "-48%" },
        { label: "Empty Return Miles", value: "6.2%", delta: "-14%" },
        { label: "Fuel Expenses Saved", value: "15.8%", delta: "+3.2%" }
      ],
      pipeline: [
        { label: "Cargo Inquiries", val: "540" },
        { label: "Trucks Assigned", val: "518" },
        { label: "Trips Completed", val: "498" }
      ]
    }
  }
];

// -------------------------------------------------------------------
// Domain Authentic Clean Visualizations for Stage 04
// -------------------------------------------------------------------

const SolarChart = () => (
  <svg viewBox="0 0 400 120" className="w-full h-full">
    <path d="M 20,95 Q 100,85 180,30 T 380,20" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
    <path d="M 20,80 Q 100,75 180,60 T 380,55" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="280" cy="22" r="3.5" fill="#FF6B00" />
    <text x="245" y="15" fill="#FF6B00" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Power Saved: +38%</text>
  </svg>
);

const ClinicBarChart = () => (
  <div className="w-full h-full flex flex-col justify-end">
    <div className="flex items-end justify-around px-4 h-24">
      {[
        { cap: 70, book: 62, day: "Mon" },
        { cap: 85, book: 80, day: "Tue" },
        { cap: 90, book: 88, day: "Wed" },
        { cap: 95, book: 92, day: "Thu" },
        { cap: 100, book: 98, day: "Fri" },
      ].map((b, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
          <div className="flex gap-1 items-end h-20">
            <div className="w-3 bg-slate-300 dark:bg-slate-700 rounded-t-sm" style={{ height: `${b.cap}%` }} title="Available Chair Hours" />
            <div className={`w-3 rounded-t-sm ${i === 4 ? "bg-[#FF6B00]" : "bg-[#8B5CF6]"}`} style={{ height: `${b.book}%` }} title="Booked Patients" />
          </div>
          <span className="text-[9px] text-slate-500 font-mono">{b.day}</span>
        </div>
      ))}
    </div>
  </div>
);

const RestaurantChart = () => (
  <svg viewBox="0 0 400 120" className="w-full h-full">
    <path d="M 20,30 L 100,45 L 180,35 L 260,25 L 380,15" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
    <path d="M 20,90 L 100,75 L 180,65 L 260,55 L 380,50" fill="none" stroke="#FF6B00" strokeWidth="2" strokeDasharray="4 4" />
    <text x="240" y="70" fill="#FF6B00" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Food & Labor: 54.8%</text>
  </svg>
);

const SaasFunnelChart = () => (
  <div className="w-full h-full flex flex-col justify-around px-4 py-1">
    {[
      { w: "92%", label: "Website Inquiries", color: "bg-slate-400 dark:bg-slate-300" },
      { w: "65%", label: "Qualified Leads", color: "bg-[#8B5CF6]" },
      { w: "38%", label: "Live Demos", color: "bg-[#8B5CF6]" },
      { w: "18%", label: "Contracts Signed", color: "bg-[#FF6B00]" },
    ].map((f, i) => (
      <div key={i} className="flex items-center gap-2.5">
        <span className="w-28 text-[10px] text-slate-600 dark:text-slate-400 font-sans font-medium text-right shrink-0">{f.label}</span>
        <div className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full ${f.color} rounded-full`} style={{ width: f.w }} />
        </div>
        <span className="text-[10px] text-slate-500 font-mono w-8">{f.w}</span>
      </div>
    ))}
  </div>
);

const LogisticsChart = () => (
  <svg viewBox="0 0 400 120" className="w-full h-full">
    <path d="M 20,80 L 110,70 L 200,40 L 290,30 L 380,20" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
    <path d="M 20,100 L 110,85 L 200,60 L 290,45 L 380,35" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="290" cy="30" r="3.5" fill="#FF6B00" />
    <text x="235" y="20" fill="#FF6B00" fontSize="10" fontFamily="sans-serif" fontWeight="bold">98.4% On-Time Deliveries</text>
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

  // Controlled stage rotation: 1 -> 2 -> 3 -> 4 -> 1 (advances industry on 4 -> 1)
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

  const handleStageClick = (stageNum: number) => {
    setCurrentStage(stageNum);
    setIsInteracting(true);

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setIsInteracting(false), 14000);
  };

  const item = INDUSTRIES[activeIdx];

  return (
    <section id="project-support" className="relative w-full bg-slate-50 text-slate-900 dark:bg-[#090A0F] dark:text-slate-100 py-24 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-16 -right-20 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-mono tracking-wider uppercase text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
            Turnkey Operations
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            One engine. <span className="text-[#FF6B00]">Five built-in industries.</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            {content?.subtitle || "From the first customer WhatsApp text to automated calendar booking and live owner profit dashboards—tailored specifically to how your business operates."}
          </p>
        </div>

        {/* Horizontally Scrollable Industry Selectors */}
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
            
            {/* Top Bar with Clear Demo Badge */}
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

            {/* Dynamic Stage Canvas with Fixed Proportions */}
            <div className="p-6 flex-1 flex flex-col justify-center overflow-hidden">
              
              {/* STAGE 01: AUTHENTIC WHATSAPP CHAT WITH DIRECTIONAL TAILS */}
              {currentStage === 1 && (
                <div className="space-y-3.5 max-w-md mx-auto w-full animate-in fade-in duration-200">
                  
                  {/* Subtle WhatsApp-style Chat Canvas */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-md bg-[#ECE5DD] dark:bg-[#0B141A]">
                    
                    {/* Top WhatsApp Status Bar */}
                    <div className="px-4 py-2.5 bg-[#075E54] dark:bg-[#1F2C34] text-white flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs uppercase text-emerald-100">
                            {item.tabLabel.slice(0, 2)}
                          </div>
                          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#075E54] dark:border-[#1F2C34]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 leading-none">
                            <span className="font-semibold text-xs tracking-tight">{item.badge}</span>
                            <span className="text-[10px] text-emerald-300">✓</span>
                          </div>
                          <span className="text-[9px] text-emerald-100/80 dark:text-slate-400 mt-0.5 block">
                            Direct WhatsApp Inbound • Automated
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-200/90 bg-black/20 px-2 py-0.5 rounded">
                        Verified Business
                      </span>
                    </div>

                    {/* Chat Bubble Thread */}
                    <div className="p-4 space-y-3.5 bg-[#EFEAE2] dark:bg-[#0B141A]">
                      
                      {/* Security Notice */}
                      <div className="text-center my-0.5">
                        <span className="px-2.5 py-1 rounded-md bg-white/80 dark:bg-[#182229]/80 text-[10px] text-slate-600 dark:text-slate-400 shadow-xs inline-flex items-center gap-1 border border-black/5 dark:border-white/5 font-sans">
                          <Lock className="w-2.5 h-2.5 text-amber-500" />
                          <span>End-to-end encrypted • Instant AI Response</span>
                        </span>
                      </div>

                      {/* 1. Customer Inbound Bubble with Left Tail */}
                      <div className="flex flex-col items-start space-y-1">
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium ml-2">{item.chat.sender}</span>
                        <div className="relative bg-white dark:bg-[#202C33] text-slate-800 dark:text-slate-100 text-xs sm:text-[13px] p-3 rounded-2xl rounded-tl-none shadow-sm border border-black/5 dark:border-white/5 max-w-[88%] leading-relaxed">
                          {/* Left Directional Tail */}
                          <svg
                            className="absolute -left-2 top-0 text-white dark:text-[#202C33] fill-current"
                            width="8"
                            height="13"
                            viewBox="0 0 8 13"
                          >
                            <path d="M1.533 3.568 8 12.193V0H2.812C1.042 0 .474 2.156 1.533 3.568z" />
                          </svg>
                          <p>{item.chat.incoming}</p>
                          <div className="text-[9px] text-slate-400 dark:text-slate-500 text-right mt-1 font-mono">
                            {item.chat.time}
                          </div>
                        </div>
                      </div>

                      {/* 2. Outgoing AI Response with Right Tail */}
                      <div className="flex flex-col items-end space-y-1 pt-1">
                        <span className="text-[10px] text-[#8B5CF6] dark:text-purple-300 font-medium mr-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#FF6B00]" /> Zavian Auto-Assistant
                        </span>
                        <div className="relative bg-[#D9FDD3] dark:bg-[#005C4B] text-slate-900 dark:text-white text-xs sm:text-[13px] p-3 rounded-2xl rounded-tr-none shadow-sm border border-emerald-300/40 dark:border-white/5 max-w-[88%] leading-relaxed">
                          {/* Right Directional Tail */}
                          <svg
                            className="absolute -right-2 top-0 text-[#D9FDD3] dark:text-[#005C4B] fill-current"
                            width="8"
                            height="13"
                            viewBox="0 0 8 13"
                          >
                            <path d="M6.467 3.568 0 12.193V0h5.188c1.77 0 2.338 2.156 1.279 3.568z" />
                          </svg>
                          <p>{item.chat.aiReply}</p>
                          <div className="text-[9px] text-emerald-800 dark:text-emerald-200 flex items-center justify-end gap-1 mt-1 font-mono">
                            <span>Just now</span>
                            <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                          </div>
                        </div>
                      </div>

                      {/* Action Pill */}
                      <div className="bg-white/80 dark:bg-[#182229]/90 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 flex items-center justify-between text-xs shadow-xs">
                        <span className="text-[#FF6B00] flex items-center gap-1.5 font-medium text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
                          {item.chat.aiAction}
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">⚡ Sub-3s Response</span>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* STAGE 02: AUTO-QUALIFY & SIZING */}
              {currentStage === 2 && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="text-[#8B5CF6] font-bold tracking-wider">{item.stage2.badge}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Auto-Verified
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{item.stage2.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.stage2.detail}</p>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-mono text-[#FF6B00] font-semibold">
                    {item.stage2.metric}
                  </div>
                </div>
              )}

              {/* STAGE 03: INSTANT CALENDAR & CRM LOCK */}
              {currentStage === 3 && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-4 max-w-md mx-auto w-full animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>LOCKED WITH ZERO STAFF DELAY</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{item.stage3.title}</h4>
                  <div className="text-sm font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-2">
                    <div className="text-slate-400 text-xs">Destination Pipeline:</div>
                    <div className="text-slate-900 dark:text-white font-semibold">{item.stage3.destination}</div>
                    <div className="text-xs text-[#FF6B00] pt-1 border-t border-slate-100 dark:border-white/5 font-semibold">{item.stage3.status}</div>
                  </div>
                </div>
              )}

              {/* STAGE 04: REAL-TIME OWNER DASHBOARD (EVERYDAY LABELS) */}
              {currentStage === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
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
                      {item.dashboard.chartType === "saas" && <SaasFunnelChart />}
                      {item.dashboard.chartType === "logistics" && <LogisticsChart />}
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
            <div className="px-5 py-3 bg-slate-100/80 dark:bg-black/50 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 shrink-0">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                STAGE 0{currentStage} ACTIVE
              </span>
              <span className="text-[#FF6B00] font-semibold">AUTONOMOUS PIPELINE</span>
            </div>
          </div>

          {/* Right: The 4 Chronological Workflow Cards (5 Columns) */}
          <div className="lg:col-span-5 space-y-3">
            {[
              {
                num: "01",
                tag: "INSTANT CHAT",
                title: "24/7 WhatsApp Response",
                desc: "Answers every WhatsApp text and website inquiry in under 3 seconds with natural, friendly conversation."
              },
              {
                num: "02",
                tag: "SMART FILTER",
                title: "Automatic Needs Sizing",
                desc: "Checks project details, applies your pricing rules, and finds the exact right service without manual back-and-forth."
              },
              {
                num: "03",
                tag: "CALENDAR LOCK",
                title: "Zero-Delay Direct Booking",
                desc: "Locks the appointment right into your calendar or team software, sends reminders, and collects booking deposits."
              },
              {
                num: "04",
                tag: "LIVE RESULTS",
                title: "Real-Time Owner Telemetry",
                desc: "See your daily profit margins, booked capacity, and active customer pipelines update live as deals close."
              }
            ].map((step, sIdx) => {
              const active = currentStage === sIdx + 1;
              return (
                <div
                  key={sIdx}
                  onClick={() => handleStageClick(sIdx + 1)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
                    active
                      ? "bg-purple-50/50 dark:bg-[#12151E] border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      : "bg-white/60 dark:bg-[#12151E]/60 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={active ? "text-[#FF6B00] font-semibold" : "text-slate-500"}>
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

        {/* Bottom Call to Action Strip */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#12151E] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
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
