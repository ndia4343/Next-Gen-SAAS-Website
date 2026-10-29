import { WebsiteContent } from "@/lib/types";

export const initialContent: WebsiteContent = {
  themeBranding: {
    activeThemeId: "crimson-cyber",
    logoMode: "default",
    logoImageUrl: "",
    logoSvgContent: "",
    wordmark1: "ZAVIAN",
    wordmark1Color: "#ffffff",
    wordmark2: "LABS",
    wordmark2Color: "#DC2626",
    tagline: "AI AUTOMATION & SOFTWARE STUDIO",
  },
  header: {
    brandWordmark1: "ZAVIAN",
    brandWordmark2: "LABS",
    tagline: "AI AUTOMATION & SOFTWARE STUDIO",
    ctaText: "Book Discovery Call",
    ctaActionId: "discovery-call",
    navItems: [
      { id: "nav-1", label: "Overview", href: "#hero", target: "_self", active: true },
      { id: "nav-2", label: "Services", href: "#core-expertise", target: "_self", active: true },
      { id: "nav-3", label: "Solutions", href: "#project-support", target: "_self", active: true },
    ],
  },
  hero: {
    badgeText: "● SPEED-TO-LEAD AUTOMATION · 24/7 INBOUND AGENTS",
    badgeDotColor: "#FF6B00",
    badgeVisible: true,
    titleLine1: "Your Next High-Ticket Client",
    titleHighlight: "Won't Wait 2 Hours for a Reply.",
    titleLine2: "",
    description:
      "We build AI voice agents, WhatsApp booking workflows, and custom software that turn incoming leads into booked appointments—24/7.",
    primaryCtaText: "Explore Capabilities",
    primaryCtaLink: "#core-expertise",
    secondaryCtaText: "Start a Project",
    floatingStats: [
      { label: "API Latency", value: "< 35ms", subtext: "Global Edge" },
      { label: "Agent Uptime", value: "99.99%", subtext: "High Availability" },
      { label: "Speed to Market", value: "4.2x", subtext: "Rapid Prototyping" },
      { label: "Template Limits", value: "Zero", subtext: "Custom Engineered" },
    ],
  },
  coreExpertise: {
    eyebrow: "● CORE ARCHITECTURES · ZERO BOTTLENECK",
    mainTitleWhite: "Engineered to ",
    mainTitleCrimson: "Capture, Book, and Scale.",
    subtitle:
      "Three production-grade automation systems designed to eliminate lead drop-off, qualify inbound intent, and streamline operations 24/7.",
    cards: [
      {
        id: "voice",
        columnKey: "voice",
        eyebrowIcon: "★",
        badgeTag: "SPEED-TO-LEAD · VOICE",
        title: "AI Voice Receptionists",
        description:
          "24/7 human-sounding AI receptionists that answer inbound calls in under 5 seconds, qualify prospects, and book directly onto your calendar.",
        isFeatured: false,
        starColor: "#DC2626",
        ctaText: "🚀 Get Started",
        ctaActionId: "quote-voice-receptionist",
        checklist: [
          { id: "v-1", text: "Under 5s pickup & response latency", highlighted: false },
          { id: "v-2", text: "Multi-turn natural human conversation", highlighted: false },
          { id: "v-3", text: "Direct calendar booking (Cal & Calendly)", highlighted: false },
          { id: "v-4", text: "Native CRM sync (GoHighLevel & HubSpot)", highlighted: false },
          { id: "v-5", text: "Call recording & intent transcription", highlighted: false },
          { id: "v-6", text: "Zero missed inbound calls 24/7/365", highlighted: false },
        ],
      },
      {
        id: "whatsapp",
        columnKey: "whatsapp",
        eyebrowIcon: "★",
        badgeTag: "SPEED-TO-LEAD · CHAT",
        title: "WhatsApp Inbound Workflows",
        description:
          "Convert ad traffic and web leads via high-speed automated WhatsApp funnels that qualify criteria and secure appointments in under 60 seconds.",
        isFeatured: false,
        starColor: "#DC2626",
        ctaText: "🚀 Get Started",
        ctaActionId: "quote-whatsapp-workflows",
        checklist: [
          { id: "w-1", text: "Sub-60s automated inbound engagement", highlighted: false },
          { id: "w-2", text: "Algorithmic lead qualification criteria", highlighted: false },
          { id: "w-3", text: "In-chat dynamic calendar scheduling", highlighted: false },
          { id: "w-4", text: "Proof-of-funds document parsing", highlighted: false },
          { id: "w-5", text: "Multi-touch SMS & WhatsApp re-engagement", highlighted: false },
          { id: "w-6", text: "Real-time webhook and pipeline integrations", highlighted: false },
        ],
      },
      {
        id: "software",
        columnKey: "software",
        eyebrowIcon: "★",
        badgeTag: "HIGH COMPUTE · CUSTOM",
        title: "Custom Software & Dashboards",
        description:
          "Tailored client portals, real-time revenue dashboards, and custom backend systems built for your exact operational workflows.",
        isFeatured: false,
        starColor: "#DC2626",
        ctaText: "🚀 Get Started",
        ctaActionId: "quote-custom-software",
        checklist: [
          { id: "s-1", text: "Next.js, Node.js & high-throughput APIs", highlighted: false },
          { id: "s-2", text: "Real-time revenue & conversion tracking", highlighted: false },
          { id: "s-3", text: "Multi-agent orchestration pipelines", highlighted: false },
          { id: "s-4", text: "Custom database architecture & schema", highlighted: false },
          { id: "s-5", text: "Zero rigid templates, 100% custom code", highlighted: false },
          { id: "s-6", text: "Production deployment on edge infrastructure", highlighted: false },
        ],
      },
    ],
  },
  useCases: {
    eyebrow: "REAL-TIME CONVERSION BLUEPRINTS",
    headline: "Autonomous 60-Second Lead Engines",
    subheadline:
      "Multi-channel voice, chat, and CRM agents qualifying incoming opportunities in real-time.",
    verticals: [
      {
        id: "vertical-dental",
        title: "Dental & Aesthetics",
        accentColor: "#DC2626",
        speedBadge: "< 45 SECONDS",
        clientConfidentialName: "Lumière A██████ · Dubai",
        bottleneckDescription:
          "High patient inquiry drop-off during after-hours consultations and delayed treatment scheduling.",
        capabilities: [
          "Automated VIP consultation bookings",
          "Multilingual conversational AI intake",
          "EHR & Calendar bidirectional sync",
          "Insurance verification pre-screening",
        ],
        simulatorScript: "WhatsApp booking agent with automated deposit collection",
      },
      {
        id: "vertical-roofing",
        title: "Roofing & Solar",
        accentColor: "#FF6B00",
        speedBadge: "< 60 SECONDS",
        clientConfidentialName: "Apex S████ · Texas",
        bottleneckDescription:
          "Slow lead dispatch resulting in lost bids to competing contractors within 10-minute window.",
        capabilities: [
          "Instant satellite roof measurement intake",
          "Automated emergency estimate routing",
          "SMS automated outreach to on-field crews",
          "Financing pre-qualification workflow",
        ],
        simulatorScript: "Voice agent triggering automated CRM dispatch",
      },
      {
        id: "vertical-realestate",
        title: "Real Estate & Brokerage",
        accentColor: "#00B4D8",
        speedBadge: "< 30 SECONDS",
        clientConfidentialName: "Vanguard P██████ · Miami",
        bottleneckDescription:
          "Unqualified buyer leads consuming agent time without verified proof of funds or criteria match.",
        capabilities: [
          "Interactive property tour scheduling",
          "Proof-of-funds document parsing",
          "Buyer preference algorithmic matching",
          "WhatsApp dynamic brochure delivery",
        ],
        simulatorScript: "Instant private listing concierge with filter prompts",
      },
      {
        id: "vertical-ecommerce",
        title: "High-Volume E-Commerce",
        accentColor: "#818CF8",
        speedBadge: "< 15 SECONDS",
        clientConfidentialName: "Nordic D█████ · London",
        bottleneckDescription:
          "Abandoned carts and complex order tracking inquiries overwhelming Tier 1 customer support.",
        capabilities: [
          "Automated custom discount negotiations",
          "Carrier real-time tracking lookup",
          "Returns & exchange portal bot",
          "Post-purchase upsell recommendations",
        ],
        simulatorScript: "Autonomous cart rescue with time-sensitive promo codes",
      },
      {
        id: "vertical-hospitality",
        title: "Boutique Hospitality",
        accentColor: "#10B981",
        speedBadge: "< 40 SECONDS",
        clientConfidentialName: "Château M██████ · Provence",
        bottleneckDescription:
          "Missed reservation requests from international time zones across direct web channels.",
        capabilities: [
          "Multi-lingual suite concierge",
          "Dining & experience curated itineraries",
          "Stripe instant reservation deposits",
          "Direct booking incentive management",
        ],
        simulatorScript: "24/7 booking assistant with dining add-ons",
      },
      {
        id: "vertical-enterprise",
        title: "Enterprise Data & Fintech",
        accentColor: "#F59E0B",
        speedBadge: "< 50 SECONDS",
        clientConfidentialName: "Quantix S██████ · New York",
        bottleneckDescription:
          "Complex RFP requests and API integration queries requiring deep technical qualification.",
        capabilities: [
          "Security whitepaper automated gating",
          "Technical architecture fit screening",
          "Executive NDA workflow automation",
          "Sales engineer calendar scheduling",
        ],
        simulatorScript: "Technical sales qualification assistant with PDF delivery",
      },
    ],
  },
  projectSupport: {
    eyebrow: "● ARCHITECTURAL BLUEPRINT · SYSTEM TELEMETRY",
    headlineWhite: "Deployable Systems ",
    headlineOrange: "Engineered for Scale.",
    headlineCyan: "",
    subtitle:
      "From instant lead capture to live profit dashboards, deploy automated systems built to scale your revenue without adding headcount.",
    cards: [
      {
        id: "bento-software",
        numberTag: "01 / SOFTWARE",
        title: "Software Projects",
        description:
          "Reliable websites, CMS platforms and custom applications built around your workflow.",
        ctaText: "Contact for a Quote ↗",
        accentColor: "orange",
      },
      {
        id: "bento-data",
        numberTag: "02 / DATA",
        title: "Data Projects",
        description:
          "Power BI dashboards, reporting and analytics that turn data into clearer decisions.",
        ctaText: "Contact for a Quote ↗",
        accentColor: "orange",
      },
      {
        id: "bento-ai",
        numberTag: "03 / AI",
        title: "AI Solution Driven Projects",
        description:
          "Practical AI tools, integrations and automation that help teams reduce repetitive work.",
        ctaText: "Contact for a Quote ↗",
        accentColor: "orange",
      },
      {
        id: "bento-media",
        numberTag: "04 / MEDIA",
        title: "Video Editing Services",
        description:
          "Story-led videos, social edits and channel support designed to connect with your audience.",
        ctaText: "Contact for a Quote ↗",
        accentColor: "orange",
      },
    ],
  },
  footer: {
    brandWordmark1: "ZAVIAN",
    brandWordmark2: "LABS",
    tagline: "AI AUTOMATION & SOFTWARE STUDIO",
    description:
      "Architecting next-generation autonomous AI systems, GPU-accelerated 3D WebGL interfaces, and production-grade software ecosystems. Zero templates. Pure engineering.",
    ctaText: "Start a Project",
    copyright: "© 2026 ZAVIAN LABS. ALL RIGHTS RESERVED.",
    statusLabel: "SYSTEMS OPERATIONAL",
    latencyLabel: "LATENCY: 24MS",
    regionLabel: "US-EAST / CLOUDFLARE EDGE",
    links: [
      { id: "foot-1", label: "Overview", href: "#hero" },
      { id: "foot-2", label: "01 / Core Expertise", href: "#core-expertise" },
      { id: "foot-3", label: "02 / Project Support", href: "#project-support" },
      { id: "foot-4", label: "Privacy Policy", href: "#" },
      { id: "foot-5", label: "Terms of Service", href: "#" },
    ],
  },
  freyaVoiceAgent: {
    agentName: "Zara",
    systemPrompt:
      "You are Zara, the intelligent voice receptionist and client intake specialist for Zavian Labs—a boutique AI automation and software engineering studio. You speak with natural executive warmth, crisp clarity, and subtle British/Global English cadence.",
    welcomeMessage:
      "Hey! Welcome to Zavian Labs. I’m Zara—I handle our front desk so no one gets left on hold. Are you looking to automate your phone calls, set up WhatsApp booking funnels, or build custom software?",
    isLiveIndicator: true,
  },
};
