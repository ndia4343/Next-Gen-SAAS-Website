import { z } from "zod";

// ==========================================
// 1. Feature Item Schema (Checklist)
// ==========================================
export const FeatureItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Text is required"),
  highlighted: z.boolean().default(false),
});
export type FeatureItem = z.infer<typeof FeatureItemSchema>;

// ==========================================
// 2. Expertise Card Schema ("Build & Grow")
// ==========================================
export const ExpertiseCardSchema = z.object({
  id: z.string(),
  columnKey: z.string().default("ecommerce"),
  eyebrowIcon: z.string().default("★"),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  isFeatured: z.boolean().default(false),
  ctaText: z.string().min(1, "CTA Text is required"),
  ctaActionId: z.string(),
  checklist: z.array(FeatureItemSchema),
});
export type ExpertiseCard = z.infer<typeof ExpertiseCardSchema>;

// ==========================================
// 3. Bento Card Schema ("Project Support")
// ==========================================
export const BentoCardSchema = z.object({
  id: z.string(),
  numberTag: z.string(), // e.g. "01 / SOFTWARE"
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  thumbnailUrl: z.string().optional(),
  ctaText: z.string().min(1, "CTA Text is required"),
  accentColor: z.enum(["orange", "cyan", "crimson", "purple"]).default("orange"),
});
export type BentoCard = z.infer<typeof BentoCardSchema>;

// ==========================================
// 4. Hero Section Data Schema
// ==========================================
export const FloatingStatSchema = z.object({
  label: z.string(),
  value: z.string(),
});
export type FloatingStat = z.infer<typeof FloatingStatSchema>;

export const HeroSectionDataSchema = z.object({
  badgeText: z.string(),
  titleLine1: z.string(),
  titleHighlight: z.string(),
  titleLine2: z.string(),
  description: z.string(),
  primaryCtaText: z.string(),
  secondaryCtaText: z.string(),
  floatingStats: z.array(FloatingStatSchema),
});
export type HeroSectionData = z.infer<typeof HeroSectionDataSchema>;

// ==========================================
// 5. Freya Voice Agent Config Schema
// ==========================================
export const FreyaConfigSchema = z.object({
  agentName: z.string().default("Freya"),
  systemPrompt: z.string(),
  welcomeMessage: z.string(),
  isLiveIndicator: z.boolean().default(true),
});
export type FreyaConfig = z.infer<typeof FreyaConfigSchema>;

// ==========================================
// 6. Section Aggregation Schemas
// ==========================================
export const SiteMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  companyName: z.string(),
  contactEmail: z.string().email().optional(),
});
export type SiteMeta = z.infer<typeof SiteMetaSchema>;

export const CoreExpertiseSectionDataSchema = z.object({
  eyebrow: z.string(),
  titlePart1: z.string().optional(),
  titlePart2: z.string().optional(),
  mainTitleWhite: z.string().optional(),
  mainTitleCrimson: z.string().optional(),
  subtitle: z.string(),
  cards: z.array(ExpertiseCardSchema),
});
export type CoreExpertiseSectionData = z.infer<typeof CoreExpertiseSectionDataSchema>;

export const ProjectSupportSectionDataSchema = z.object({
  eyebrow: z.string(),
  titlePart1: z.string().optional(),
  titleHighlightOrange: z.string().optional(),
  titleHighlightCyan: z.string().optional(),
  headlineWhite: z.string().optional(),
  headlineOrange: z.string().optional(),
  headlineCyan: z.string().optional(),
  subtitle: z.string(),
  cards: z.array(BentoCardSchema),
});
export type ProjectSupportSectionData = z.infer<typeof ProjectSupportSectionDataSchema>;

// ==========================================
// 7. Complete Aggregate Website Content Schema
// ==========================================
export const WebsiteContentSchema = z.object({
  siteMeta: SiteMetaSchema,
  hero: HeroSectionDataSchema,
  coreExpertise: CoreExpertiseSectionDataSchema,
  projectSupport: ProjectSupportSectionDataSchema,
  freyaVoiceAgent: FreyaConfigSchema,
});
export type WebsiteContent = z.infer<typeof WebsiteContentSchema>;
