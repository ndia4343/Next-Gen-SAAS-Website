import { WebsiteContent } from "@/lib/types";

export const initialContent: WebsiteContent = {
  themeBranding: {
    activeThemeId: "crimson-cyber",
    defaultMode: "light",
    logoMode: "image",
    logoImageUrl: "/images/zavian-cube-mark.png",
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
    tagline: "AI VOICE RECEPTIONIST FOR CLINICS",
    ctaText: "Book a free audit",
    ctaActionId: "discovery-call",
    navItems: [
      { id: "nav-1", label: "Demo", href: "#voice-simulation", target: "_self", active: true },
      { id: "nav-2", label: "How it works", href: "#how-it-works", target: "_self", active: true },
      { id: "nav-3", label: "Dashboard", href: "#command-center", target: "_self", active: true },
      { id: "nav-4", label: "FAQ", href: "#faq", target: "_self", active: true },
    ],
  },
  hero: {
    badgeText: "● AI VOICE RECEPTIONIST FOR CLINICS",
    badgeDotColor: "#FF6B00",
    badgeVisible: true,
    titleLine1: "Never miss another",
    titleHighlight: "patient call.",
    titleLine2: "",
    description:
      "An AI receptionist that answers every call, books into your calendar and confirms with the patient, day or night. Built for clinics and aesthetics practices.",
    primaryCtaText: "Hear it answer a call",
    primaryCtaLink: "#voice-simulation",
    secondaryCtaText: "Book a free missed-call audit",
    floatingStats: [
      { label: "Pickup", value: "< 1 sec", subtext: "Answers fast" },
      { label: "Availability", value: "24/7", subtext: "After-hours ready" },
      { label: "Calendar Sync", value: "Live", subtext: "Google & Cal.com" },
      { label: "Team Handoff", value: "1-Click", subtext: "WhatsApp & Email" },
    ],
  },
  coreExpertise: {
    eyebrow: "● CORE CAPABILITIES · BUILT FOR CLINICS",
    mainTitleWhite: "Built to ",
    mainTitleCrimson: "Answer, Book, and Confirm.",
    subtitle:
      "Three practical automation workflows tailored for clinic reception, WhatsApp follow-up, and custom practice dashboards.",
    cards: [
      {
        id: "voice",
        columnKey: "voice",
        eyebrowIcon: "★",
        badgeTag: "RECEPTION · VOICE",
        title: "AI Voice Receptionists",
        description:
          "AI voice receptionists that answer incoming patient calls in under a second, handle routine questions, and book directly onto your calendar.",
        isFeatured: false,
        starColor: "#DC2626",
        ctaText: "Book a free audit",
        ctaActionId: "quote-voice-receptionist",
        checklist: [
          { id: "v-1", text: "Answers in under a second", highlighted: false },
          { id: "v-2", text: "Natural conversation around treatments & hours", highlighted: false },
          { id: "v-3", text: "Direct calendar booking (Google Calendar & Cal.com)", highlighted: false },
          { id: "v-4", text: "Syncs with your booking calendar", highlighted: false },
          { id: "v-5", text: "Call transcript & front-desk summary log", highlighted: false },
          { id: "v-6", text: "Hands urgent calls to your team when needed", highlighted: false },
        ],
      },
      {
        id: "whatsapp",
        columnKey: "whatsapp",
        eyebrowIcon: "★",
        badgeTag: "CONFIRMATIONS · CHAT",
        title: "WhatsApp Appointment Follow-Up",
        description:
          "Follows up missed calls and booked inquiries in WhatsApp with confirmation buttons, parking instructions, and reschedule options.",
        isFeatured: false,
        starColor: "#DC2626",
        ctaText: "Book a free audit",
        ctaActionId: "quote-whatsapp-workflows",
        checklist: [
          { id: "w-1", text: "Automated confirmation right after the call", highlighted: false },
          { id: "w-2", text: "Collects patient notes and preferences cleanly", highlighted: false },
          { id: "w-3", text: "Sends calendar invites & clinic directions", highlighted: false },
          { id: "w-4", text: "Easy one-tap confirm or reschedule replies", highlighted: false },
          { id: "w-5", text: "Appointment reminders to reduce no-shows", highlighted: false },
          { id: "w-6", text: "Front desk can step into any thread anytime", highlighted: false },
        ],
      },
      {
        id: "software",
        columnKey: "software",
        eyebrowIcon: "★",
        badgeTag: "REPORTING · CUSTOM",
        title: "Custom Software & Dashboards",
        description:
          "Practical practice dashboards, call logs, and custom booking workflows built around how your clinic operates.",
        isFeatured: false,
        starColor: "#DC2626",
        ctaText: "Book a free audit",
        ctaActionId: "quote-custom-software",
        checklist: [
          { id: "s-1", text: "Every call and booking logged clearly", highlighted: false },
          { id: "s-2", text: "Visibility across daytime and after-hours calls", highlighted: false },
          { id: "s-3", text: "Compatibility check during discovery", highlighted: false },
          { id: "s-4", text: "Encrypted audio & chat transcripts", highlighted: false },
          { id: "s-5", text: "Role-based access for reception staff", highlighted: false },
          { id: "s-6", text: "Tailored to your treatment catalog", highlighted: false },
        ],
      },
    ],
  },
  useCases: {
    eyebrow: "ILLUSTRATIVE WORKFLOW DEMOS",
    headline: "Built for Clinics, Adapted Across Sectors",
    subheadline:
      "Illustrative example workflows showing how calls, WhatsApp confirmations, and calendars stay in sync.",
    verticals: [
      {
        id: "vertical-dental",
        title: "Dental & Aesthetics",
        accentColor: "#DC2626",
        speedBadge: "PRIMARY FOCUS",
        clientConfidentialName: "Illustrative Sample · Dental Clinic",
        bottleneckDescription:
          "Missed evening or busy-hour calls mean patients call the next clinic on Google instead of waiting for callbacks.",
        capabilities: [
          "Evening and weekend consultation booking",
          "Treatment FAQ handling from your approved script",
          "Syncs with your booking calendar",
          "WhatsApp confirmation & clinic directions",
        ],
        simulatorScript: "Clinic receptionist booking aligner consult + WhatsApp confirmation",
      },
      {
        id: "vertical-roofing",
        title: "Solar Pipeline",
        accentColor: "#FF6B00",
        speedBadge: "ALSO AVAILABLE",
        clientConfidentialName: "Illustrative Sample · Solar Installer",
        bottleneckDescription:
          "Installers miss evening inquiries when site teams are busy on roofs.",
        capabilities: [
          "Monthly utility bill inquiry intake",
          "Initial kW system sizing questions",
          "Site survey calendar scheduling",
          "WhatsApp estimate summary follow-up",
        ],
        simulatorScript: "Voice intake triggering survey booking and WhatsApp PDF summary",
      },
      {
        id: "vertical-hr",
        title: "HR & Recruitment",
        accentColor: "#818CF8",
        speedBadge: "ALSO AVAILABLE",
        clientConfidentialName: "Illustrative Sample · Recruitment Team",
        bottleneckDescription:
          "Recruiters spend hours playing phone tag to check notice periods and basic role fit.",
        capabilities: [
          "Automated initial screening questions",
          "Notice period and location verification",
          "Recruiter interview calendar booking",
          "WhatsApp CV upload follow-up",
        ],
        simulatorScript: "Candidate screening call booking recruiter interview + CV collection",
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
    tagline: "AI VOICE RECEPTIONIST FOR CLINICS",
    description:
      "AI voice receptionists, WhatsApp appointment confirmations, and practical clinic dashboards built around your schedule.",
    ctaText: "Book a free audit",
    copyright: "© 2026 ZAVIAN LABS. ALL RIGHTS RESERVED.",
    statusLabel: "CLINIC AUTOMATION STUDIO",
    latencyLabel: "ANSWERS IN UNDER A SECOND",
    regionLabel: "UAE & GLOBAL",
    links: [
      { id: "foot-1", label: "Demo", href: "#voice-simulation" },
      { id: "foot-2", label: "How it works", href: "#how-it-works" },
      { id: "foot-3", label: "Dashboard", href: "#command-center" },
      { id: "foot-4", label: "Pricing", href: "#pricing" },
      { id: "foot-5", label: "FAQ", href: "#faq" },
    ],
  },
  freyaVoiceAgent: {
    agentName: "AI Receptionist",
    systemPrompt:
      "You are the intelligent voice receptionist and client intake specialist for Zavian Labs—a boutique AI automation and software engineering studio. You speak with natural executive warmth, crisp clarity, and subtle British/Global English cadence.",
    welcomeMessage:
      "Hey! Welcome to Zavian Labs. I handle our front desk so no one gets left on hold. Are you looking to automate your phone calls, set up WhatsApp booking funnels, or build custom software?",
    isLiveIndicator: true,
  },
};
