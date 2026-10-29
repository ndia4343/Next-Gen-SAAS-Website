'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Check,
  Phone,
  Video,
  MoreVertical,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { ProjectSupportSectionData } from '@/lib/types';

interface Props {
  onOpenQuoteModal?: (serviceName: string) => void;
  content?: ProjectSupportSectionData;
}

interface IndustryData {
  id: string;
  tabLabel: string;
  icon: string;
  tagline: string;
  badge: string;
  whatsapp: {
    contactName: string;
    avatarLetter: string;
    avatarBg: string;
    customerInquiry: string;
    inquiryTime: string;
    aiQualification: string;
    qualificationTime: string;
    customerReply: string;
    replyTime: string;
    aiConfirmation: string;
    confirmationTime: string;
    actionChipText: string;
  };
  triage: {
    kicker: string;
    title: string;
    intentScore: string;
    priorityLabel: string;
    qualificationChecklist: string[];
    routingTarget: string;
    decisionLogic: string;
  };
  handshake: {
    meetingTitle: string;
    scheduledTime: string;
    leadName: string;
    assignedRep: string;
    platform: string;
    syncChecklist: string[];
  };
  telemetry: {
    sampleVolume: string;
    sampleSubtitle: string;
    speedMetric: string;
    speedSubtitle: string;
    yieldMetric: string;
    yieldSubtitle: string;
    sparklineValues: number[];
    pipelineGenerated: string;
    traditionalRate: number;
    zavianRate: number;
  };
}

const INDUSTRIES: IndustryData[] = [
  {
    id: 'solar',
    tabLabel: 'Solar & Roofing',
    icon: '☀️',
    tagline: 'Home Services & High-Ticket Contracting',
    badge: 'SATELLITE ROOF ESTIMATES · HIGH-TICKET DISPATCH',
    whatsapp: {
      contactName: 'Apex Solar · Instant FastLead AI',
      avatarLetter: '☀️',
      avatarBg: 'bg-amber-500/20 text-amber-500',
      customerInquiry: 'Hey! Need an estimate on a 2,800 sq ft roof replacement & 12kW solar panel install.',
      inquiryTime: '8:42 PM',
      aiQualification: 'Hello Mike! I’ve initiated our satellite roof scanner. Is your average monthly electric bill over $250?',
      qualificationTime: '8:42 PM',
      customerReply: 'Yes, around $340/mo. Asphalt shingle roof, two-story home in Dallas.',
      replyTime: '8:43 PM',
      aiConfirmation: 'Calculated. You qualify for $0 down. Locking your on-site engineering survey for tomorrow:',
      confirmationTime: '8:43 PM',
      actionChipText: 'Tomorrow 10:00 AM · Survey Locked ✓',
    },
    triage: {
      kicker: 'HIGH-TICKET DISPATCH ENGINE',
      title: 'Satellite Estimation & Financing Qualification',
      intentScore: '99.1% High Priority',
      priorityLabel: 'Tier-1 Contractor Lead',
      qualificationChecklist: [
        'Roof area > 2,500 sq ft (Verified via Satellite GIS)',
        'Monthly energy bill > $250 ($340/mo confirmed)',
        'Homeowner status & credit tier pre-qualified',
      ],
      routingTarget: 'Senior Field Estimator Calendar',
      decisionLogic: 'Automated bypass of Tier-1 phone rep; direct dispatch to field crew.',
    },
    handshake: {
      meetingTitle: 'On-Site Roof Inspection & Solar Production Survey',
      scheduledTime: 'Tomorrow, 10:00 AM – 10:45 AM EST',
      leadName: 'Mike Callahan (Homeowner)',
      assignedRep: 'Dave Henderson (Senior Solar Estimator)',
      platform: 'On-Site Dispatch (Google Calendar & Cal.com)',
      syncChecklist: [
        'Calendar slot locked on estimator mobile dispatch route',
        'HubSpot Deal created: $38,500 Residential Solar Project',
        'Slack alert fired to #sales-dispatch with satellite imagery link',
        'SMS & WhatsApp confirmation sent with arrival window',
      ],
    },
    telemetry: {
      sampleVolume: '320 Leads',
      sampleSubtitle: 'Simulated Monthly Cohort',
      speedMetric: '< 35s',
      speedSubtitle: 'Avg Response Latency',
      yieldMetric: '72.4%',
      yieldSubtitle: 'Site Survey Lock Rate',
      sparklineValues: [32, 48, 52, 70, 65, 88, 96],
      pipelineGenerated: '+$48,500 Monthly Pipeline',
      traditionalRate: 18,
      zavianRate: 72,
    },
  },
  {
    id: 'realestate',
    tabLabel: 'Luxury Real Estate',
    icon: '🏢',
    tagline: 'High-Net-Worth Brokerages & Developers',
    badge: 'PROOF OF FUNDS VERIFICATION · BROKER VIP TOURS',
    whatsapp: {
      contactName: 'Vanguard Estates · Private Concierge',
      avatarLetter: '🏢',
      avatarBg: 'bg-sky-500/20 text-sky-400',
      customerInquiry: 'Interested in private viewing for the Brickell penthouse ($4.2M).',
      inquiryTime: '9:15 PM',
      aiQualification: 'Welcome Robert. That penthouse has private elevator access. Are you purchasing all-cash or seeking jumbo financing?',
      qualificationTime: '9:15 PM',
      customerReply: 'All-cash purchase. Proof of funds letter ready from JPMorgan.',
      replyTime: '9:16 PM',
      aiConfirmation: 'Verified. Attaching digital NDA and reserving your broker VIP tour for tomorrow:',
      confirmationTime: '9:16 PM',
      actionChipText: 'Private Tour: Tomorrow 2:30 PM ✓',
    },
    triage: {
      kicker: 'VIP LIQUIDITY SCREENING',
      title: 'Proof-of-Funds Parsing & Buyer Criteria Fit',
      intentScore: '98.7% Ultra-HNW',
      priorityLabel: 'Prime Acquisition Intent',
      qualificationChecklist: [
        'Target property: $4.2M Penthouse (Brickell Ave)',
        'Liquidity verified: All-cash transaction capability',
        'Automated NDA delivery & digital acknowledgement',
      ],
      routingTarget: 'Managing Broker Direct Line',
      decisionLogic: 'Immediate route to principal broker; skip general agency pool.',
    },
    handshake: {
      meetingTitle: 'Private Broker Walkthrough · Penthouse 48B',
      scheduledTime: 'Tomorrow, 2:30 PM – 3:30 PM EST',
      leadName: 'Robert Sterling (Principal Buyer)',
      assignedRep: 'Elena Rostova (Managing Broker)',
      platform: 'On-Property VIP Access (Cal.com Confirmed)',
      syncChecklist: [
        'Private tour booked on broker calendar with gate security code',
        'FollowUpBoss CRM contact created with VIP Lead tag',
        'Slack alert broadcast to #luxury-closings with PDF portfolio',
        'WhatsApp itinerary and concierge directions dispatched',
      ],
    },
    telemetry: {
      sampleVolume: '145 HNW Leads',
      sampleSubtitle: 'Simulated Luxury Inquiries',
      speedMetric: '< 20s',
      speedSubtitle: 'Instant HNW Response',
      yieldMetric: '78.5%',
      yieldSubtitle: 'Tour Conversion Yield',
      sparklineValues: [24, 40, 58, 62, 75, 84, 94],
      pipelineGenerated: '+$185,000 Brokerage Pipeline',
      traditionalRate: 22,
      zavianRate: 78,
    },
  },
  {
    id: 'dental',
    tabLabel: 'Dental & Aesthetics',
    icon: '🩺',
    tagline: 'Private Clinics & Medical Spas',
    badge: 'AFTER-HOURS PATIENT INTAKE · CHAIR-TIME OPTIMIZATION',
    whatsapp: {
      contactName: 'Lumière Dental · Smile AI Concierge',
      avatarLetter: '🩺',
      avatarBg: 'bg-emerald-500/20 text-emerald-400',
      customerInquiry: 'Hi! Looking to book consultation for full ceramic veneers and Invisalign.',
      inquiryTime: '7:08 PM',
      aiQualification: 'Hello Sophia! Dr. Vance has 2 private cosmetic consultation slots available this week. Have you had dental X-rays in the last 6 months?',
      qualificationTime: '7:08 PM',
      customerReply: 'Yes, last month during my routine cleaning.',
      replyTime: '7:09 PM',
      aiConfirmation: 'Wonderful! Reserving your 45-min 3D digital smile design consultation:',
      confirmationTime: '7:09 PM',
      actionChipText: 'Thursday 11:00 AM · Smile Consult ✓',
    },
    triage: {
      kicker: 'CLINICAL TRIAGE ENGINE',
      title: 'Treatment Fit & High-Value Procedure Matching',
      intentScore: '96.5% High Value',
      priorityLabel: 'Cosmetic Veneers ($18k+)',
      qualificationChecklist: [
        'High-value treatment focus (Veneers + Invisalign)',
        'Recent dental diagnostics confirmed available',
        'Deposit pre-authorization & medical history intake prepared',
      ],
      routingTarget: 'Operatory Suite 01 / Dr. Vance',
      decisionLogic: 'Direct operatory calendar block with zero receptionist overhead.',
    },
    handshake: {
      meetingTitle: '3D Cosmetic Smile Design & Diagnostic Scan',
      scheduledTime: 'Thursday, 11:00 AM – 11:45 AM EST',
      leadName: 'Sophia Martinez (Patient)',
      assignedRep: 'Dr. Julian Vance (Cosmetic Director)',
      platform: 'In-Clinic Operatory (Practice EHR Sync)',
      syncChecklist: [
        'Appointment synced directly to Dentrix / Curve Dental EHR',
        'Patient intake health form sent via SMS with digital signature',
        'Treatment coordinator alerted in clinical Slack channel',
        'WhatsApp appointment reminder with calendar pass armed',
      ],
    },
    telemetry: {
      sampleVolume: '420 Patients',
      sampleSubtitle: 'Simulated Monthly Inflow',
      speedMetric: '< 40s',
      speedSubtitle: 'Evening Response Time',
      yieldMetric: '84.2%',
      yieldSubtitle: 'Chair Fill Efficiency',
      sparklineValues: [35, 52, 60, 78, 80, 89, 98],
      pipelineGenerated: '+$62,000 Treatment Value',
      traditionalRate: 26,
      zavianRate: 84,
    },
  },
  {
    id: 'ecommerce',
    tabLabel: 'E-Commerce & Retail',
    icon: '🛍️',
    tagline: 'DTC Brands & High-AOV Retailers',
    badge: 'VIP CART RESCUE · AUTONOMOUS DISCOUNTS',
    whatsapp: {
      contactName: 'Nordic Luxe · VIP Order Assistant',
      avatarLetter: '🛍️',
      avatarBg: 'bg-purple-500/20 text-purple-400',
      customerInquiry: 'My checkout code VIP20 isn’t applying to the titanium chronograph ($1,850).',
      inquiryTime: '11:24 PM',
      aiQualification: 'Checking stock now Liam... Authorized! I’ve locked in the $370 private VIP deduction and complimentary express courier dispatch.',
      qualificationTime: '11:24 PM',
      customerReply: 'Awesome! Can you send the direct checkout link?',
      replyTime: '11:25 PM',
      aiConfirmation: 'Secured link generated. Your reserved cart expires in 15 minutes:',
      confirmationTime: '11:25 PM',
      actionChipText: 'Complete VIP Order ($1,480) ➔',
    },
    triage: {
      kicker: 'DYNAMIC MARGIN OPTIMIZER',
      title: 'Abandoned Cart Value & Margin Floor Engine',
      intentScore: '99.4% Ready to Buy',
      priorityLabel: 'High AOV ($1,850 Cart)',
      qualificationChecklist: [
        'Cart value > $1,500 threshold with high margin headroom',
        'Real-time inventory reserve locked in Shopify Plus',
        'Automated single-use checkout token generated',
      ],
      routingTarget: 'Shopify Plus / Stripe Checkout Direct',
      decisionLogic: 'Algorithmic promo authorization within strict gross margin constraints.',
    },
    handshake: {
      meetingTitle: 'Order Verified & Express Courier Dispatched',
      scheduledTime: 'Immediate Dispatch (Shopify Plus Token)',
      leadName: 'Liam Chen (VIP Customer)',
      assignedRep: 'Autonomous VIP Desk',
      platform: 'Shopify Plus & Stripe Direct Link',
      syncChecklist: [
        'Checkout token synced with Shopify Plus backend',
        'Stripe payment intent pre-authorized with fraud check',
        'Klaviyo VIP customer segment tagged: Platinum Tier',
        'WhatsApp automated tracking updates enabled',
      ],
    },
    telemetry: {
      sampleVolume: '1,280 Carts',
      sampleSubtitle: 'Simulated Checkout Sessions',
      speedMetric: '< 8s',
      speedSubtitle: 'Cart Rescue Latency',
      yieldMetric: '46.8%',
      yieldSubtitle: 'High-AOV Rescue Rate',
      sparklineValues: [42, 58, 64, 82, 79, 91, 99],
      pipelineGenerated: '+$114,000 Recovered GMV',
      traditionalRate: 12,
      zavianRate: 47,
    },
  },
  {
    id: 'legal',
    tabLabel: 'Legal & Professional',
    icon: '⚖️',
    tagline: 'Corporate Law & Advisory Firms',
    badge: 'M&A INTAKE · CONFLICT CHECK SCREENING',
    whatsapp: {
      contactName: 'Vanguard Legal · Corporate Practice Desk',
      avatarLetter: '⚖️',
      avatarBg: 'bg-rose-500/20 text-rose-400',
      customerInquiry: 'We need retained counsel for an M&A transaction ($8.5M asset purchase agreement).',
      inquiryTime: '6:30 PM',
      aiQualification: 'Understood. Our corporate M&A practice lead evaluates cross-border agreements. What is your target close date?',
      qualificationTime: '6:30 PM',
      customerReply: 'Targeting Q4 close. Both buyer and seller have signed the preliminary term sheet.',
      replyTime: '6:31 PM',
      aiConfirmation: 'High priority. Conflict-check clearance initiated. Connecting directly with managing partner:',
      confirmationTime: '6:31 PM',
      actionChipText: 'Partner Strategy Intake: Tomorrow 9:00 AM ✓',
    },
    triage: {
      kicker: 'CONFLICT & RETAINER QUALIFIER',
      title: 'Transaction Scale & Practice Group Routing',
      intentScore: '97.8% High Value',
      priorityLabel: 'M&A Retainer Opportunity',
      qualificationChecklist: [
        'Transaction size > $5M ($8.5M asset deal confirmed)',
        'Term sheet executed; active closing window',
        'Automated preliminary party conflict check triggered',
      ],
      routingTarget: 'Senior M&A Partner Desk',
      decisionLogic: 'High-value corporate lead routed directly to practice group leader.',
    },
    handshake: {
      meetingTitle: 'Partner Strategy Consultation · $8.5M Asset Purchase',
      scheduledTime: 'Tomorrow, 9:00 AM – 9:45 AM EST',
      leadName: 'Marcus Sterling (CEO / Acquirer)',
      assignedRep: 'Alexander Wright (Managing Partner, M&A)',
      platform: 'Secure Video Conference (Google Meet / Cal.com)',
      syncChecklist: [
        'Partner calendar locked with encrypted meeting link',
        'Clio / Salesforce Legal CRM matter file opened',
        'Automated NDA & engagement letter template queued',
        'Secure WhatsApp confirmation with partner bio dispatched',
      ],
    },
    telemetry: {
      sampleVolume: '84 Retainers',
      sampleSubtitle: 'Simulated M&A Inquiries',
      speedMetric: '< 30s',
      speedSubtitle: 'Executive Lead Intake',
      yieldMetric: '68.0%',
      yieldSubtitle: 'Retainer Conversion',
      sparklineValues: [28, 44, 50, 68, 72, 85, 95],
      pipelineGenerated: '+$240,000 Retainers',
      traditionalRate: 15,
      zavianRate: 68,
    },
  },
];

const STAGE_CONFIG = [
  {
    id: 'stage-whatsapp',
    kicker: 'INBOUND CAPTURE',
    title: 'Authentic WhatsApp Lead Funnel',
    description: 'Instant sub-60s multi-turn conversational intake capturing prospect intent and initial qualification.',
  },
  {
    id: 'stage-triage',
    kicker: 'AUTONOMOUS TRIAGE',
    title: 'AI Intent & Scoring Matrix',
    description: 'Algorithmic criteria qualification evaluates budget, scope, and urgency without human intervention.',
  },
  {
    id: 'stage-handshake',
    kicker: 'PROTOCOL HANDSHAKE',
    title: 'Two-Way Calendar & CRM Sync',
    description: 'Direct calendar locking onto specialist schedules with automated CRM deal and pipeline updates.',
  },
  {
    id: 'stage-telemetry',
    kicker: 'REVENUE TELEMETRY',
    title: 'Executive Analytics Dashboard',
    description: 'Real-time pipeline monitoring tracking velocity, lead retention, and autonomous conversion margins.',
  },
];

export default function ProjectSupportSection({ onOpenQuoteModal, content }: Props) {
  const [activeIndustryIdx, setActiveIndustryIdx] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100%

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Controlled Stage Cycling:
  // - 3.5s per stage
  // - Transitioning from Stage 04 back to 01 increments to the next industry exactly once
  // - Manual clicks pause auto-rotation for 12 seconds
  useEffect(() => {
    const STAGE_DURATION_MS = 3500;
    const TICK_MS = 50;
    const increment = (TICK_MS / STAGE_DURATION_MS) * 100;

    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        setProgress((prev) => {
          if (prev + increment >= 100) {
            setActiveStage((currentStage) => {
              if (currentStage === 3) {
                // Transitioning from Stage 04 back to 01 increments to the next industry exactly once
                setActiveIndustryIdx((currentInd) => (currentInd + 1) % INDUSTRIES.length);
                return 0;
              }
              return currentStage + 1;
            });
            return 0;
          }
          return prev + increment;
        });
      }
    }, TICK_MS);

    return () => {
      clearInterval(interval);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  const handleManualIndustrySelect = (indIdx: number) => {
    setActiveIndustryIdx(indIdx);
    setActiveStage(0); // Manual tab clicks reset to Stage 01
    setProgress(0);
    setIsPaused(true);

    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 12000); // pause auto-rotation for 12 seconds
  };

  const handleManualStageSelect = (stageIdx: number) => {
    setActiveStage(stageIdx);
    setProgress(0);
    setIsPaused(true);

    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 12000); // pause auto-rotation for 12 seconds
  };

  const currentIndustry = INDUSTRIES[activeIndustryIdx] || INDUSTRIES[0];

  return (
    <section id="project-support" className="py-24 px-4 max-w-7xl mx-auto z-10 relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400 mb-4 backdrop-blur-md">
          ● ARCHITECTURAL BLUEPRINT · SYSTEM TELEMETRY
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Deployable Systems <span className="text-[#FF6B00]">Engineered for Scale.</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
          {content?.subtitle ||
            'From instant lead capture to live profit dashboards, deploy automated systems built to scale your revenue without adding headcount.'}
        </p>
      </div>

      {/* 5-INDUSTRY SYNCED TABS SELECTOR */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {INDUSTRIES.map((ind, idx) => {
            const isSelected = activeIndustryIdx === idx;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => handleManualIndustrySelect(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#FF6B00] border-[#FF6B00] text-black font-semibold shadow-lg shadow-orange-500/25 scale-[1.03]'
                    : 'bg-white dark:bg-[#12151E] border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span>{ind.icon}</span>
                <span>{ind.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Industry Active Tagline / Sub-badge */}
        <div className="text-center mt-3 flex items-center justify-center gap-2 text-xs font-mono">
          <span className="text-[#FF6B00] font-bold">●</span>
          <span className="text-zinc-500 dark:text-zinc-400 tracking-wider uppercase text-[11px]">
            {currentIndustry.tagline} — <span className="text-zinc-800 dark:text-zinc-200">{currentIndustry.badge}</span>
          </span>
        </div>
      </div>

      {/* 60/40 Asymmetrical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT CONSOLE (60%): Interactive Engine Canvas */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#090A0F] border border-zinc-200 dark:border-white/10 p-5 sm:p-7 flex flex-col justify-between shadow-xl shadow-zinc-200/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-colors min-h-[560px]">
          
          {/* Console Topbar */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-semibold">
                {currentIndustry.tabLabel} Engine
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 uppercase text-[10px] text-[#FF6B00] font-semibold">
                ILLUSTRATIVE DEMO DATA
              </span>
            </div>
          </div>

          {/* MAIN SIMULATION VIEWPORT (Fills available space) */}
          <div className="py-6 min-h-[380px] flex items-center justify-center w-full">
            
            {/* STAGE 01: AUTHENTIC WHATSAPP BUBBLE UI */}
            {activeStage === 0 && (
              <div className="w-full max-w-md rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 shadow-2xl bg-[#EFEAE2] dark:bg-[#0B141A] text-left animate-in fade-in zoom-in-95 duration-200">
                {/* WhatsApp Chat Top Header */}
                <div className="px-4 py-3 bg-[#005C4B] dark:bg-[#1F2C34] text-white flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                        {currentIndustry.whatsapp.avatarLetter}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#005C4B] dark:border-[#1F2C34]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 leading-none">
                        <span className="font-semibold text-xs tracking-tight text-white">
                          {currentIndustry.whatsapp.contactName}
                        </span>
                        <span className="text-emerald-300 text-[10px]">✓</span>
                      </div>
                      <span className="text-[10px] text-emerald-100 dark:text-zinc-400 font-normal mt-0.5 block">
                        online · verified AI bot
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-white/80">
                    <Video className="w-4 h-4 cursor-pointer hover:text-white" />
                    <Phone className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
                    <MoreVertical className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
                  </div>
                </div>

                {/* WhatsApp Message Body */}
                <div className="p-4 space-y-3 font-sans text-xs">
                  {/* Security / Encryption Pill */}
                  <div className="text-center my-1">
                    <span className="px-3 py-1 rounded-lg bg-black/10 dark:bg-black/30 text-[10px] text-zinc-600 dark:text-zinc-400 font-mono inline-flex items-center gap-1">
                      <span>🔒</span> End-to-end encrypted · Automated by Zavian Labs
                    </span>
                  </div>

                  {/* 1. Incoming Customer Message */}
                  <div className="flex justify-start">
                    <div className="relative max-w-[85%] rounded-2xl rounded-tl-sm px-3.5 py-2.5 bg-white dark:bg-[#202C33] text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/50 dark:border-white/5">
                      <p className="leading-relaxed">
                        {currentIndustry.whatsapp.customerInquiry}
                      </p>
                      <span className="text-[9px] text-zinc-400 block text-right mt-1 font-mono">
                        {currentIndustry.whatsapp.inquiryTime}
                      </span>
                    </div>
                  </div>

                  {/* 2. Outgoing AI Qualification Message */}
                  <div className="flex justify-end">
                    <div className="relative max-w-[85%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 bg-[#DCF8C6] dark:bg-[#005C4B] text-zinc-900 dark:text-white shadow-sm border border-emerald-300/40 dark:border-white/5">
                      <p className="leading-relaxed">
                        {currentIndustry.whatsapp.aiQualification}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-emerald-800 dark:text-emerald-200 font-mono">
                        <span>{currentIndustry.whatsapp.qualificationTime}</span>
                        <span className="text-sky-500 dark:text-sky-300 font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Incoming Customer Reply */}
                  <div className="flex justify-start">
                    <div className="relative max-w-[85%] rounded-2xl rounded-tl-sm px-3.5 py-2.5 bg-white dark:bg-[#202C33] text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200/50 dark:border-white/5">
                      <p className="leading-relaxed">
                        {currentIndustry.whatsapp.customerReply}
                      </p>
                      <span className="text-[9px] text-zinc-400 block text-right mt-1 font-mono">
                        {currentIndustry.whatsapp.replyTime}
                      </span>
                    </div>
                  </div>

                  {/* 4. Outgoing AI Confirmation + Action Link */}
                  <div className="flex justify-end">
                    <div className="relative max-w-[88%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 bg-[#DCF8C6] dark:bg-[#005C4B] text-zinc-900 dark:text-white shadow-sm border border-emerald-300/40 dark:border-white/5">
                      <p className="leading-relaxed">
                        {currentIndustry.whatsapp.aiConfirmation}
                      </p>
                      
                      {/* Action Chip Button */}
                      <div className="mt-2.5 pt-2 border-t border-emerald-600/30 dark:border-white/10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#12151E] text-emerald-800 dark:text-emerald-300 font-semibold text-[11px] shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{currentIndustry.whatsapp.actionChipText}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-emerald-800 dark:text-emerald-200 font-mono">
                        <span>{currentIndustry.whatsapp.confirmationTime}</span>
                        <span className="text-sky-500 dark:text-sky-300 font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 02: AUTONOMOUS TRIAGE ENGINE */}
            {activeStage === 1 && (
              <div className="w-full max-w-md space-y-3.5 text-left animate-in fade-in zoom-in-95 duration-200">
                <div className="rounded-2xl bg-zinc-50 dark:bg-[#12151E] border border-zinc-200 dark:border-white/10 p-5 sm:p-6 shadow-sm dark:shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/10 text-xs font-mono">
                    <span className="text-zinc-500 dark:text-zinc-400 uppercase font-semibold">
                      {currentIndustry.triage.kicker}
                    </span>
                    <span className="text-[#FF6B00] font-bold px-2 py-0.5 rounded bg-orange-500/10">
                      {currentIndustry.triage.intentScore}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                      {currentIndustry.triage.title}
                    </h4>
                    <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-medium block mt-1">
                      Target Route: {currentIndustry.triage.routingTarget}
                    </span>
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                      Automated Verification Criteria:
                    </div>
                    {currentIndustry.triage.qualificationChecklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5"
                      >
                        <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                          ✓
                        </span>
                        <span className="text-zinc-700 dark:text-zinc-300 text-[11px] font-mono leading-tight">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-zinc-200/80 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400 text-[11px]">DECISION LOGIC</span>
                    <span className="text-emerald-500 font-bold text-[11px]">
                      HUMAN AGENT BYPASSED
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 03: PROTOCOL HANDSHAKE (CALENDAR & CRM) */}
            {activeStage === 2 && (
              <div className="w-full max-w-md space-y-3.5 text-left animate-in fade-in zoom-in-95 duration-200">
                <div className="rounded-2xl bg-zinc-50 dark:bg-[#12151E] border border-zinc-200 dark:border-white/10 p-5 sm:p-6 shadow-sm dark:shadow-2xl">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center font-bold text-xl shrink-0">
                      <Calendar className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
                        {currentIndustry.handshake.meetingTitle}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                        {currentIndustry.handshake.scheduledTime}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-zinc-200/80 dark:border-white/5 text-xs font-mono">
                    {currentIndustry.handshake.syncChecklist.map((checkText, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/5 text-[11px]"
                      >
                        <span className="text-zinc-700 dark:text-zinc-300">✓ {checkText}</span>
                        <span className="text-emerald-500 font-bold text-[10px]">SYNCED</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-white/5 flex justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    <span>Protocol: Two-Way Lock</span>
                    <span className="text-[#8B5CF6] font-semibold">Zero Staff Overhead</span>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 04: EXECUTIVE CEO TELEMETRY DASHBOARD */}
            {activeStage === 3 && (
              <div className="w-full max-w-md space-y-3.5 text-left animate-in fade-in zoom-in-95 duration-200">
                {/* Header & Notice */}
                <div className="flex items-center justify-between text-[11px] font-mono pb-1">
                  <span className="text-zinc-600 dark:text-zinc-400 font-semibold uppercase">
                    {currentIndustry.tabLabel} · Executive Telemetry
                  </span>
                  <span className="text-[#FF6B00] bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                    ILLUSTRATIVE DEMO DATA
                  </span>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#12151E] border border-zinc-200 dark:border-white/10">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase block">Sample Volume</span>
                    <span className="text-base font-bold text-zinc-900 dark:text-white mt-0.5 block">
                      {currentIndustry.telemetry.sampleVolume}
                    </span>
                    <span className="text-[9px] text-zinc-400 block">{currentIndustry.telemetry.sampleSubtitle}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#12151E] border border-zinc-200 dark:border-white/10">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase block">Triage Speed</span>
                    <span className="text-base font-bold text-emerald-500 mt-0.5 block">
                      {currentIndustry.telemetry.speedMetric}
                    </span>
                    <span className="text-[9px] text-zinc-400 block">{currentIndustry.telemetry.speedSubtitle}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#12151E] border border-zinc-200 dark:border-white/10">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase block">Calendar Yield</span>
                    <span className="text-base font-bold text-[#8B5CF6] mt-0.5 block">
                      {currentIndustry.telemetry.yieldMetric}
                    </span>
                    <span className="text-[9px] text-zinc-400 block">{currentIndustry.telemetry.yieldSubtitle}</span>
                  </div>
                </div>

                {/* Inbound Velocity Sparkline Graph */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-[#12151E] border border-zinc-200 dark:border-white/10">
                  <div className="flex justify-between items-center mb-2.5 text-xs font-mono">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      Lead Velocity vs. Direct Bookings
                    </span>
                    <span className="text-emerald-500 font-bold text-[11px]">
                      ▲ {currentIndustry.telemetry.pipelineGenerated}
                    </span>
                  </div>

                  <div className="h-16 w-full flex items-end gap-2 pt-1">
                    {currentIndustry.telemetry.sparklineValues.map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className="w-full bg-gradient-to-t from-purple-500/20 via-purple-500/40 to-[#8B5CF6] rounded-t transition-all duration-500"
                          style={{ height: `${val}%` }}
                        />
                        <span className="text-[9px] font-mono text-zinc-400">D0{i + 1}</span>
                      </div>
                    ))}
                  </div>

                  {/* Conversion Progress Bar */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-white/10 space-y-1.5">
                    <div className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                      <span>Traditional Intake</span>
                      <span className="text-zinc-500 font-semibold">{currentIndustry.telemetry.traditionalRate}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-zinc-400 dark:bg-zinc-600 rounded-full"
                        style={{ width: `${currentIndustry.telemetry.traditionalRate}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-zinc-900 dark:text-zinc-200 font-mono pt-1">
                      <span className="text-[#FF6B00] font-semibold">ZAVIAN Autonomous Pipeline</span>
                      <span className="text-emerald-500 font-bold">{currentIndustry.telemetry.zavianRate}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF6B00] to-[#8B5CF6] rounded-full"
                        style={{ width: `${currentIndustry.telemetry.zavianRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 text-center">
                  * ILLUSTRATIVE DEMO DATA — Simulated pipeline performance for {currentIndustry.tabLabel}.
                </p>
              </div>
            )}
          </div>

          {/* Console Status Footer */}
          <div className="pt-4 border-t border-zinc-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span>ACTIVE SIGNAL:</span>
              <span className="text-[#FF6B00] font-semibold">
                {activeStage === 0 && 'WHATSAPP_LEAD_DISPATCHED'}
                {activeStage === 1 && 'CRITERIA_TRIAGE_QUALIFIED'}
                {activeStage === 2 && 'CALENDAR_PROTOCOL_COMMITTED'}
                {activeStage === 3 && 'TELEMETRY_PIPELINE_SYNCHRONIZED'}
              </span>
            </div>
            <span>MODE: <span className="text-zinc-800 dark:text-zinc-200 font-medium">AUTONOMOUS</span></span>
          </div>
        </div>

        {/* RIGHT TRACK (40%): Editorial Stage Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
          {STAGE_CONFIG.map((stg, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stg.id}
                type="button"
                onClick={() => handleManualStageSelect(idx)}
                className={`relative overflow-hidden w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-zinc-50 dark:bg-[#12151E] border-[#8B5CF6]/60 shadow-md dark:shadow-purple-500/10 scale-[1.01]'
                    : 'bg-white dark:bg-[#090A0F]/60 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/15'
                }`}
              >
                {/* Smooth purple progress indicator (3.5s cycle) */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 h-[2px] bg-[#8B5CF6] transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                )}

                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-500 font-semibold">
                    0{idx + 1} · {stg.kicker}
                  </span>
                  {isActive && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]" />
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                  {stg.title}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {stg.description}
                </p>
              </button>
            );
          })}
        </div>

      </div>

      {/* BOTTOM CONVERSION DOCK */}
      <div className="mt-14 max-w-2xl mx-auto px-4">
        <div className="relative group rounded-full p-[1px] bg-gradient-to-r from-purple-500/20 via-white/10 to-purple-500/20 hover:from-purple-500/40 hover:via-white/20 hover:to-purple-500/40 transition-all duration-500 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 rounded-full bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/80 dark:border-white/5">
            <div className="flex items-center gap-3 text-left">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]" />
              </span>
              <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-300 font-medium">
                Need an industry-customized pipeline setup?
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onOpenQuoteModal) {
                  onOpenQuoteModal(currentIndustry.tabLabel);
                } else {
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold tracking-wide transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm shadow-purple-500/30 whitespace-nowrap cursor-pointer"
            >
              <span>Book Discovery Call</span>
              <span className="text-white/80">↗</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
