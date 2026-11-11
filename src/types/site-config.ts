import { z } from 'zod';

export type HeadlineFontWeight = 'font-normal' | 'font-medium' | 'font-semibold' | 'font-bold';
export type HeadlineFontFamily = 'serif' | 'sans';

export interface BrandingConfig {
  companyName: string;
  tagline: string;
  logoTextPrimary: string;
  logoTextSecondary: string;
  logoIconSize: number; // in px (24 - 64)
  logoImageUrl: string;
  contactEmail: string;
  calendarBookingUrl: string;
  enableLightMode: boolean;
}

export interface HeroConfig {
  eyebrowBadge: string;
  headlinePrefix: string;
  headlineAccent: string; // Chrome italic phrase e.g. "picks up"
  headlineSuffix: string;
  headlineFontSize: number; // in px (36 - 110)
  headlineFontWeight: HeadlineFontWeight;
  headlineFontFamily: HeadlineFontFamily;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export interface MarqueeConfig {
  items: string[];
  speedSeconds: number;
}

export interface VoiceScriptTurn {
  at: number;
  who: string;
  isAi: boolean;
  text: string;
}

export interface VoiceIndustryConfig {
  id: string;
  label: string;
  channelNote: string;
  agentName: string;
  agentRole: string;
  callerName: string;
  script: VoiceScriptTurn[];
  lockedSlotMessage: string;
  lockedSlotSub: string;
  whatsAppContactName: string;
  whatsAppNotice: string;
  whatsAppReply: string;
  whatsAppFollowup: string;
  whatsAppAttachmentName?: string;
  whatsAppAttachmentMeta?: string;
  outcomes: [string, string, string];
}

export interface VoiceTheatreConfig {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionTitleAccent: string;
  sectionDescription: string;
  demoAudioUrl: string;
  industries: VoiceIndustryConfig[];
}

export interface ConstellationNodeSpec {
  label: string;
  value: string;
}

export interface ConstellationNodeConfig {
  id: string;
  label: string;
  x: number;
  y: number;
  title: string;
  description: string;
  status: string;
  specs: ConstellationNodeSpec[];
}

export interface ConstellationConfig {
  sectionTitle: string;
  sectionTitleAccent: string;
  sectionDescription: string;
  coreNodeTitle: string;
  coreNodeDescription: string;
  coreNodeStatus: string;
  coreNodeSpecs: ConstellationNodeSpec[];
  nodes: ConstellationNodeConfig[];
}

export interface TelemetryKpi {
  label: string;
  value: string;
  delta: string;
}

export interface TelemetryFeedItem {
  title: string;
  subtitle: string;
  metric: string;
  time: string;
}

export interface TelemetrySectorConfig {
  id: 'dental' | 'solar' | 'hr' | string;
  label: string;
  badgeLabel: string;
  chartTitle: string;
  chartSubtitle: string;
  kpis: TelemetryKpi[];
  weeklyChartBars: number[]; // 12 bar values (0 - 100)
  barLabels: string[];
  subCardTitle: string;
  subCardStatus: string;
  subCardItems: TelemetryFeedItem[];
  highlightLabel: string;
  highlightValue: string;
}

export interface TelemetryConfig {
  sectionTitle: string;
  sectionTitleAccent: string;
  sectionDescription: string;
  autoCycleSeconds: number;
  sectors: TelemetrySectorConfig[];
}

export interface SiteConfig {
  branding: BrandingConfig;
  hero: HeroConfig;
  marquee: MarqueeConfig;
  voiceTheatre: VoiceTheatreConfig;
  constellation: ConstellationConfig;
  telemetry: TelemetryConfig;
}

// ==========================================
// Zod Validation Schema for API Persistence
// ==========================================
export const SiteConfigSchema = z.object({
  branding: z.object({
    companyName: z.string().min(1),
    tagline: z.string(),
    logoTextPrimary: z.string().min(1),
    logoTextSecondary: z.string(),
    logoIconSize: z.number().min(20).max(96),
    logoImageUrl: z.string().default('/images/zavian-cube-mark.png'),
    contactEmail: z.string().min(1),
    calendarBookingUrl: z.string().min(1),
    enableLightMode: z.boolean(),
  }),
  hero: z.object({
    eyebrowBadge: z.string(),
    headlinePrefix: z.string(),
    headlineAccent: z.string(),
    headlineSuffix: z.string(),
    headlineFontSize: z.number().min(28).max(140),
    headlineFontWeight: z.enum(['font-normal', 'font-medium', 'font-semibold', 'font-bold']),
    headlineFontFamily: z.enum(['serif', 'sans']),
    subheadline: z.string(),
    primaryCtaText: z.string(),
    primaryCtaLink: z.string(),
    secondaryCtaText: z.string(),
    secondaryCtaLink: z.string(),
  }),
  marquee: z.object({
    items: z.array(z.string()).min(1),
    speedSeconds: z.number().min(6).max(120),
  }),
  voiceTheatre: z.object({
    sectionEyebrow: z.string(),
    sectionTitle: z.string(),
    sectionTitleAccent: z.string(),
    sectionDescription: z.string(),
    demoAudioUrl: z.string(),
    industries: z.array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        channelNote: z.string(),
        agentName: z.string(),
        agentRole: z.string(),
        callerName: z.string(),
        script: z.array(
          z.object({
            at: z.number(),
            who: z.string(),
            isAi: z.boolean(),
            text: z.string(),
          })
        ),
        lockedSlotMessage: z.string(),
        lockedSlotSub: z.string(),
        whatsAppContactName: z.string(),
        whatsAppNotice: z.string(),
        whatsAppReply: z.string(),
        whatsAppFollowup: z.string(),
        whatsAppAttachmentName: z.string().optional(),
        whatsAppAttachmentMeta: z.string().optional(),
        outcomes: z.tuple([z.string(), z.string(), z.string()]),
      })
    ).min(1),
  }),
  constellation: z.object({
    sectionTitle: z.string(),
    sectionTitleAccent: z.string(),
    sectionDescription: z.string(),
    coreNodeTitle: z.string(),
    coreNodeDescription: z.string(),
    coreNodeStatus: z.string(),
    coreNodeSpecs: z.array(z.object({ label: z.string(), value: z.string() })),
    nodes: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        x: z.number(),
        y: z.number(),
        title: z.string(),
        description: z.string(),
        status: z.string(),
        specs: z.array(z.object({ label: z.string(), value: z.string() })),
      })
    ),
  }),
  telemetry: z.object({
    sectionTitle: z.string(),
    sectionTitleAccent: z.string(),
    sectionDescription: z.string(),
    autoCycleSeconds: z.number().min(2).max(30),
    sectors: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        badgeLabel: z.string(),
        chartTitle: z.string(),
        chartSubtitle: z.string(),
        kpis: z.array(
          z.object({
            label: z.string(),
            value: z.string(),
            delta: z.string(),
          })
        ),
        weeklyChartBars: z.array(z.number().min(0).max(100)),
        barLabels: z.array(z.string()),
        subCardTitle: z.string(),
        subCardStatus: z.string(),
        subCardItems: z.array(
          z.object({
            title: z.string(),
            subtitle: z.string(),
            metric: z.string(),
            time: z.string(),
          })
        ),
        highlightLabel: z.string(),
        highlightValue: z.string(),
      })
    ).min(1),
  }),
});
