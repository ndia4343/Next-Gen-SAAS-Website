import { z } from "zod";

// ==========================================
// 1. Audit Log, Visitor Telemetry & Leads
// ==========================================
export interface AdminAuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  loginAt: string;
  loginFormatted: string;
  ipAddress: string;
  city: string;
  region: string;
  country: string;
  status: 'SUCCESS' | 'FAILED_ATTEMPT';
  userAgent?: string;
}

export interface VisitorTelemetry {
  visitorId: string;
  ipAddress: string;
  city: string;
  region: string;
  country: string;
  visitCount: number;
  firstSeenAt: string;
  lastVisitedAt: string;
  currentPage: string;
  referrer: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
}

export interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  selectedService: string;
  projectScope: string;
  timeline: string;
  timestamp: string;
  visitorId?: string;
  visitCountAtSubmission: number;
  ipAddress?: string;
  city?: string;
  region?: string;
  country?: string;
}

// ==========================================
// 2. Quote Submission Schema
// ==========================================
export const QuoteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid corporate email required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  selectedService: z.string().min(1, "Service selection is required"),
  projectScope: z.string().min(5, "Scope must contain at least 5 characters"),
  timeline: z.string().default("Immediate"),
  visitorId: z.string().optional(),
});

export type QuoteInput = z.infer<typeof QuoteSchema>;

// ==========================================
// 3. Header & Navigation Schema
// ==========================================
export const HeaderNavItemSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link href is required"),
  target: z.enum(["_self", "_blank"]).default("_self"),
  active: z.boolean().default(true),
});
export type HeaderNavItem = z.infer<typeof HeaderNavItemSchema>;

export const HeaderDataSchema = z.object({
  brandWordmark1: z.string().default("ZAVIAN"),
  brandWordmark2: z.string().default("LABS"),
  tagline: z.string().default("AI AUTOMATION & SOFTWARE STUDIO"),
  ctaText: z.string().default("Book Discovery Call"),
  ctaActionId: z.string().default("discovery-call"),
  navItems: z.array(HeaderNavItemSchema),
});
export type HeaderData = z.infer<typeof HeaderDataSchema>;

// ==========================================
// 4. Hero Section Data Schema
// ==========================================
export const FloatingStatSchema = z.object({
  label: z.string(),
  value: z.string(),
  subtext: z.string().optional(),
});
export type FloatingStat = z.infer<typeof FloatingStatSchema>;

export const HeroSectionDataSchema = z.object({
  badgeText: z.string().default("NEXT-GEN SAAS · AGENTIC AI · DATA ENGINEERING"),
  badgeDotColor: z.string().default("#DC2626"),
  badgeVisible: z.boolean().default(true),
  titleLine1: z.string().default("Architecting the Future of"),
  titleHighlight: z.string().default("Autonomous AI"),
  titleLine2: z.string().default("& High-Compute WebGL."),
  description: z.string().default(
    "ZAVIAN LABS engineers production-grade AI agent clusters, headless commerce architectures, and GPU-accelerated 3D WebGL interfaces. Built for scale. Zero templates."
  ),
  primaryCtaText: z.string().default("Explore Capabilities"),
  primaryCtaLink: z.string().default("#core-expertise"),
  secondaryCtaText: z.string().default("Start a Project"),
  floatingStats: z.array(FloatingStatSchema),
});
export type HeroSectionData = z.infer<typeof HeroSectionDataSchema>;

// ==========================================
// 5. Core Expertise ("Build & Grow") Schema
// ==========================================
export const FeatureItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Text is required"),
  highlighted: z.boolean().default(false),
});
export type FeatureItem = z.infer<typeof FeatureItemSchema>;

export const ExpertiseCardSchema = z.object({
  id: z.string(),
  columnKey: z.string().default("ecommerce"),
  eyebrowIcon: z.string().default("★"),
  badgeTag: z.string().default("ENGINEERING TIER"),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  isFeatured: z.boolean().default(false),
  starColor: z.string().default("#DC2626"),
  ctaText: z.string().min(1, "CTA Text is required"),
  ctaActionId: z.string().default("quote"),
  checklist: z.array(FeatureItemSchema),
});
export type ExpertiseCard = z.infer<typeof ExpertiseCardSchema>;

export const CoreExpertiseSectionDataSchema = z.object({
  eyebrow: z.string().default("OUR CORE EXPERTISE"),
  mainTitleWhite: z.string().default("Build & "),
  mainTitleCrimson: z.string().default("Grow"),
  subtitle: z.string().default(
    "High-performance architectures crafted for ambitious leaders, founders, and enterprises."
  ),
  cards: z.array(ExpertiseCardSchema),
});
export type CoreExpertiseSectionData = z.infer<typeof CoreExpertiseSectionDataSchema>;

// ==========================================
// 6. 60-Second Lead Engine & Use Cases Schema
// ==========================================
export const UseCaseVerticalSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  accentColor: z.string().default("#DC2626"),
  speedBadge: z.string().default("< 60 SECONDS"),
  clientConfidentialName: z.string().default("Client Case Study"),
  bottleneckDescription: z.string(),
  capabilities: z.array(z.string()),
  simulatorScript: z.string().optional(),
});
export type UseCaseVertical = z.infer<typeof UseCaseVerticalSchema>;

export const UseCasesSectionDataSchema = z.object({
  eyebrow: z.string().default("REAL-TIME CONVERSION BLUEPRINTS"),
  headline: z.string().default("Autonomous 60-Second Lead Engines"),
  subheadline: z.string().default(
    "Multi-channel voice, chat, and CRM agents qualifying incoming opportunities in real-time."
  ),
  verticals: z.array(UseCaseVerticalSchema),
});
export type UseCasesSectionData = z.infer<typeof UseCasesSectionDataSchema>;

// ==========================================
// 7. Project Support (Bento Grid) Schema
// ==========================================
export const BentoCardSchema = z.object({
  id: z.string(),
  numberTag: z.string(), // e.g. "01 / SOFTWARE"
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  accentColor: z.enum(["orange", "cyan", "crimson", "purple"]).default("orange"),
  ctaText: z.string().default("Contact for a Quote ↗"),
});
export type BentoCard = z.infer<typeof BentoCardSchema>;

export const ProjectSupportSectionDataSchema = z.object({
  eyebrow: z.string().default("SOFTWARE · DATA · AI · MEDIA"),
  headlineWhite: z.string().default("Choose the right "),
  headlineOrange: z.string().default("project support "),
  headlineCyan: z.string().default("for your goals."),
  subtitle: z.string().default(
    "Every engagement starts with a focused conversation and a quote based on your requirements, deliverables and timeline."
  ),
  cards: z.array(BentoCardSchema),
});
export type ProjectSupportSectionData = z.infer<typeof ProjectSupportSectionDataSchema>;

// ==========================================
// 8. Footer & Legal Schema
// ==========================================
export const FooterLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});
export type FooterLink = z.infer<typeof FooterLinkSchema>;

export const FooterDataSchema = z.object({
  brandWordmark1: z.string().default("ZAVIAN"),
  brandWordmark2: z.string().default("LABS"),
  tagline: z.string().default("AI AUTOMATION & SOFTWARE STUDIO"),
  description: z.string().default(
    "Architecting next-generation autonomous AI systems, GPU-accelerated 3D WebGL interfaces, and production-grade software ecosystems. Zero templates. Pure engineering."
  ),
  ctaText: z.string().default("Start a Project"),
  copyright: z.string().default("© 2026 ZAVIAN LABS. ALL RIGHTS RESERVED."),
  statusLabel: z.string().default("SYSTEMS OPERATIONAL"),
  latencyLabel: z.string().default("LATENCY: 24MS"),
  regionLabel: z.string().default("US-EAST / CLOUDFLARE EDGE"),
  links: z.array(FooterLinkSchema),
});
export type FooterData = z.infer<typeof FooterDataSchema>;

// ==========================================
// 9. Freya Voice Agent Config Schema
// ==========================================
export const FreyaConfigSchema = z.object({
  agentName: z.string().default("Freya"),
  systemPrompt: z.string().default(
    "You are Freya, a world-class AI Solutions Architect and Creative Technologist at ZAVIAN LABS. You provide expert guidance on Next.js 15, Three.js WebGL architectures, Headless Shopify integrations, and autonomous multi-agent engineering workflows."
  ),
  welcomeMessage: z.string().default(
    "Hello! I'm Freya from ZAVIAN LABS. How can I help clarify your project scope today?"
  ),
  isLiveIndicator: z.boolean().default(true),
});
export type FreyaConfig = z.infer<typeof FreyaConfigSchema>;

// ==========================================
// 10. Theme & Branding Schema
// ==========================================
export const ThemeIdSchema = z.enum([
  'crimson-cyber',
  'obsidian-flame',
  'electric-cyan',
  'neon-violet',
  'emerald-matrix',
]);
export type ThemeId = z.infer<typeof ThemeIdSchema>;

export const LogoModeSchema = z.enum(['default', 'image', 'svg']);
export type LogoMode = z.infer<typeof LogoModeSchema>;

export const ThemeBrandingSchema = z.object({
  activeThemeId: ThemeIdSchema.default('crimson-cyber'),
  defaultMode: z.enum(['dark', 'light']).default('dark'),
  logoMode: LogoModeSchema.default('default'),
  logoImageUrl: z.string().default(''),
  logoSvgContent: z.string().default(''),
  wordmark1: z.string().default('ZAVIAN'),
  wordmark1Color: z.string().default(''),
  wordmark2: z.string().default('LABS'),
  wordmark2Color: z.string().default(''),
  tagline: z.string().default('AI AUTOMATION & SOFTWARE STUDIO'),
});
export type ThemeBrandingConfig = z.infer<typeof ThemeBrandingSchema>;

// ==========================================
// 11. Complete Aggregate Website Content Schema
// ==========================================
export const WebsiteContentSchema = z.object({
  themeBranding: ThemeBrandingSchema.default({
    activeThemeId: 'crimson-cyber',
    defaultMode: 'dark',
    logoMode: 'default',
    logoImageUrl: '',
    logoSvgContent: '',
    wordmark1: 'ZAVIAN',
    wordmark1Color: '',
    wordmark2: 'LABS',
    wordmark2Color: '',
    tagline: 'AI AUTOMATION & SOFTWARE STUDIO',
  }),
  header: HeaderDataSchema,
  hero: HeroSectionDataSchema,
  coreExpertise: CoreExpertiseSectionDataSchema,
  useCases: UseCasesSectionDataSchema,
  projectSupport: ProjectSupportSectionDataSchema,
  footer: FooterDataSchema,
  freyaVoiceAgent: FreyaConfigSchema,
});
export type WebsiteContent = z.infer<typeof WebsiteContentSchema>;

// ==========================================
// 12. Database Container Schema
// ==========================================
export interface AppDatabase {
  siteContent: WebsiteContent;
  adminAuditLogs: AdminAuditLog[];
  visitorTelemetry: VisitorTelemetry[];
  leadSubmissions: LeadSubmission[];
}
