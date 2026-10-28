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
    eyebrow: "OUR CORE EXPERTISE",
    mainTitleWhite: "Build & ",
    mainTitleCrimson: "Grow",
    subtitle:
      "High-performance architectures crafted for ambitious leaders, founders, and enterprises.",
    cards: [
      {
        id: "exp-ecommerce",
        columnKey: "ecommerce",
        eyebrowIcon: "★",
        badgeTag: "ENGINEERING TIER",
        title: "Headless Ecommerce",
        description:
          "Shopify backend, Next.js frontend — built for speed, scale, and total customization. No templates, no limits.",
        isFeatured: false,
        starColor: "#DC2626",
        ctaText: "🚀 Get Started",
        ctaActionId: "quote-headless-ecommerce",
        checklist: [
          { id: "ec-1", text: "Shopify Backend", highlighted: false },
          { id: "ec-2", text: "Next.js Storefronts", highlighted: false },
          { id: "ec-3", text: "Custom Checkout Flows", highlighted: false },
          { id: "ec-4", text: "Lightning-Fast Load Speeds", highlighted: false },
          { id: "ec-5", text: "Fully Scalable Architecture", highlighted: false },
          { id: "ec-6", text: "SEO Optimised", highlighted: false },
        ],
      },
      {
        id: "exp-agentic-ai",
        columnKey: "ai",
        eyebrowIcon: "★",
        badgeTag: "ENGINEERING TIER",
        title: "Agentic AI",
        description:
          "Autonomous AI agents that don't just respond — they think, decide, and act on your business's behalf, 24/7.",
        isFeatured: true,
        starColor: "#DC2626",
        ctaText: "🚀 Get Started",
        ctaActionId: "quote-agentic-ai",
        checklist: [
          { id: "ai-1", text: "Autonomous Task Execution", highlighted: true },
          { id: "ai-2", text: "Multi-Step Decision Making", highlighted: true },
          { id: "ai-3", text: "Voice & Chat Agents", highlighted: true },
          { id: "ai-4", text: "CRM & Workflow Integration", highlighted: true },
          { id: "ai-5", text: "Self-Learning Systems", highlighted: true },
          { id: "ai-6", text: "Human-Level Reasoning", highlighted: true },
        ],
      },
      {
        id: "exp-idea-to-launch",
        columnKey: "mvp",
        eyebrowIcon: "★",
        badgeTag: "ENGINEERING TIER",
        title: "Idea to Launch",
        description:
          "From concept to live product — we build, test, and ship your startup MVP fast, so you can start validating with real users.",
        isFeatured: false,
        starColor: "#DC2626",
        ctaText: "🚀 Get Started",
        ctaActionId: "quote-idea-to-launch",
        checklist: [
          { id: "mvp-1", text: "MVP in Weeks, Not Months", highlighted: false },
          { id: "mvp-2", text: "Full-Stack Development", highlighted: false },
          { id: "mvp-3", text: "Investor-Ready Product", highlighted: false },
          { id: "mvp-4", text: "Vibe-Coded & Production-Ready", highlighted: false },
          { id: "mvp-5", text: "Scalable From Day One", highlighted: false },
          { id: "mvp-6", text: "Launch & Iterate Support", highlighted: false },
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
    eyebrow: "SOFTWARE · DATA · AI · MEDIA",
    headlineWhite: "Choose the right ",
    headlineOrange: "project support ",
    headlineCyan: "for your goals.",
    subtitle:
      "Every engagement starts with a focused conversation and a quote based on your requirements, deliverables and timeline.",
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
    agentName: "Freya",
    systemPrompt:
      "You are Freya, a world-class AI Solutions Architect and Creative Technologist at ZAVIAN LABS. You provide expert guidance on Next.js 15, Three.js WebGL architectures, Headless Shopify integrations, and autonomous multi-agent engineering workflows.",
    welcomeMessage:
      "Hello! I'm Freya from ZAVIAN LABS. How can I help clarify your project scope today?",
    isLiveIndicator: true,
  },
};
