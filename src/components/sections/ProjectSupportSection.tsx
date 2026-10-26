"use client";

import React from "react";
import TiltCard from "../ui/TiltCard";
import {
  Code2,
  BarChart3,
  Bot,
  Video,
  ArrowUpRight,
  Terminal,
  TrendingUp,
  Workflow,
  Film,
} from "lucide-react";
import { useModal, ServiceTier } from "../providers/ModalProvider";
import { ProjectSupportSectionData } from "@/lib/types";

interface ProjectSupportSectionProps {
  data?: ProjectSupportSectionData;
}

const mapToServiceTier = (numberTag: string, title: string): ServiceTier => {
  const normalized = (numberTag + " " + title).toLowerCase();
  if (normalized.includes("software") || normalized.includes("01")) return "01 / Software";
  if (normalized.includes("data") || normalized.includes("02")) return "02 / Data";
  if (normalized.includes("ai") || normalized.includes("03")) return "03 / AI";
  if (normalized.includes("media") || normalized.includes("video") || normalized.includes("04")) return "04 / Media";
  return "General Discovery";
};

const getCardIcon = (index: number, numberTag: string) => {
  const tag = numberTag.toLowerCase();
  if (tag.includes("software") || index === 0) return Code2;
  if (tag.includes("data") || index === 1) return BarChart3;
  if (tag.includes("ai") || index === 2) return Bot;
  if (tag.includes("media") || tag.includes("video") || index === 3) return Video;
  return Code2;
};

const getCardTags = (numberTag: string, index: number) => {
  const tag = numberTag.toLowerCase();
  if (tag.includes("software") || index === 0) return ["Next.js", "Full-Stack", "Custom APIs", "Enterprise CMS"];
  if (tag.includes("data") || index === 1) return ["Power BI", "Real-Time ETL", "BigQuery", "Predictive Analytics"];
  if (tag.includes("ai") || index === 2) return ["LLM Agents", "RAG Pipelines", "Voice Systems", "Process Automation"];
  if (tag.includes("media") || tag.includes("video") || index === 3) return ["High-Impact Edits", "Motion Graphics", "3D Motion", "Channel Retention"];
  return ["Custom Deliverables", "Architecture", "Consulting", "Production Ready"];
};

// Thumbnail Preview Graphic for Awwwards-Caliber Bento Cards
function ThumbnailPreview({ numberTag, index }: { numberTag: string; index: number }) {
  const tag = numberTag.toLowerCase();

  if (tag.includes("software") || index === 0) {
    return (
      <div className="w-full h-28 rounded-2xl bg-[#08080c] border border-white/5 p-3 flex flex-col justify-between font-mono text-[11px] text-zinc-400 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-2 text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/70" />
            <span className="w-2 h-2 rounded-full bg-amber-500/70" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-[10px] text-zinc-600">app/api/pipeline.ts</span>
        </div>
        <div className="space-y-1 text-zinc-400">
          <p className="text-zinc-500">{"// Distributed Edge Runtime"}</p>
          <p>
            <span className="text-[#FF6B00]">export const</span> runtime ={" "}
            <span className="text-[#00B4D8]">&apos;edge&apos;</span>;
          </p>
          <p className="text-zinc-300">
            <span className="text-purple-400">await</span> cluster.orchestrate();
          </p>
        </div>
      </div>
    );
  }

  if (tag.includes("data") || index === 1) {
    return (
      <div className="w-full h-28 rounded-2xl bg-[#08080c] border border-white/5 p-3 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5 text-[#00B4D8]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Real-Time Stream</span>
          </div>
          <span className="text-emerald-400 font-bold">+28.4%</span>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-12 pt-2">
          {[35, 60, 45, 80, 65, 95, 75, 100, 85, 90].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-[#00B4D8]/30 to-[#00B4D8] rounded-t-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (tag.includes("ai") || index === 2) {
    return (
      <div className="w-full h-28 rounded-2xl bg-[#08080c] border border-white/5 p-3 flex items-center justify-around overflow-hidden relative">
        <div className="flex items-center gap-3 w-full justify-around">
          <div className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-[11px] font-mono text-red-400 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" />
            <span>Agent [Alpha]</span>
          </div>
          <div className="h-0.5 w-8 bg-gradient-to-r from-red-500/50 to-orange-500/50" />
          <div className="px-3 py-1.5 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[11px] font-mono text-[#FF6B00] flex items-center gap-1.5">
            <Workflow className="w-3.5 h-3.5" />
            <span>Task Queue</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-28 rounded-2xl bg-[#08080c] border border-white/5 p-3 flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
        <div className="flex items-center gap-1.5 text-[#FF6B00]">
          <Film className="w-3.5 h-3.5" />
          <span>Timeline Scrubber</span>
        </div>
        <span className="text-zinc-500">60 FPS 4K HDR</span>
      </div>
      <div className="flex items-center gap-1 h-10">
        {[20, 60, 40, 90, 70, 40, 80, 100, 75, 45, 90, 65, 30, 85].map((v, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-[#FF6B00]/40 to-[#FF6B00] rounded-sm"
            style={{ height: `${v}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectSupportSection({ data }: ProjectSupportSectionProps) {
  const { openQuoteModal } = useModal();

  const eyebrow = data?.eyebrow || "SOFTWARE · DATA · AI · MEDIA";
  const headlineWhite = data?.headlineWhite || data?.titlePart1 || "Choose the right ";
  const headlineOrange = data?.headlineOrange || data?.titleHighlightOrange || "project support ";
  const headlineCyan = data?.headlineCyan || data?.titleHighlightCyan || "for your goals.";
  const subtitle =
    data?.subtitle ||
    "Every engagement starts with a focused conversation and a quote based on your requirements, deliverables and timeline.";
  const cards = data?.cards || [
    {
      id: "bento-software",
      numberTag: "01 / SOFTWARE",
      title: "Software Projects",
      description:
        "Reliable websites, CMS platforms and custom applications built around your workflow.",
      ctaText: "Contact for a Quote ↗",
      accentColor: "orange" as const,
    },
    {
      id: "bento-data",
      numberTag: "02 / DATA",
      title: "Data Projects",
      description:
        "Power BI dashboards, reporting and analytics that turn data into clearer decisions.",
      ctaText: "Contact for a Quote ↗",
      accentColor: "orange" as const,
    },
    {
      id: "bento-ai",
      numberTag: "03 / AI",
      title: "AI Solution Driven Projects",
      description:
        "Practical AI tools, integrations and automation that help teams reduce repetitive work.",
      ctaText: "Contact for a Quote ↗",
      accentColor: "orange" as const,
    },
    {
      id: "bento-media",
      numberTag: "04 / MEDIA",
      title: "Video Editing Services",
      description:
        "Story-led videos, social edits and channel support designed to connect with your audience.",
      ctaText: "Contact for a Quote ↗",
      accentColor: "orange" as const,
    },
  ];

  return (
    <section
      id="project-tiers"
      className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <span id="project-support" className="sr-only" />

      {/* Header with Exact Color Spans */}
      <div className="text-left max-w-3xl mb-16 sm:mb-20">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-red-400 font-semibold mb-4">
          {eyebrow}
        </p>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-6">
          <span className="text-[#FFFFFF]">{headlineWhite}</span>
          <span className="text-[#FF6B00]">{headlineOrange}</span>
          <span className="text-[#00B4D8]">{headlineCyan}</span>
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* 2x2 Bento Grid: Dynamic Frosted Glass Cards with 3D Tilt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => {
          const Icon = getCardIcon(idx, card.numberTag);
          const tags = getCardTags(card.numberTag, idx);
          const serviceTier = mapToServiceTier(card.numberTag, card.title);

          return (
            <TiltCard
              key={card.id || idx}
              maxTilt={8}
              className="p-8 lg:p-10 flex flex-col justify-between"
            >
              {/* Dynamic ambient accent glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#FF6B00]/10 via-[#00B4D8]/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500 -z-10" />

              <div>
                {/* Header row: Eyebrow + Micro Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                    {card.numberTag}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-[#FF6B00]/40 group-hover:bg-[#FF6B00]/10 transition-all duration-300 shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4 group-hover:text-zinc-100 transition-colors">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* Thumbnail Preview */}
                <div className="mb-6">
                  {card.thumbnailUrl ? (
                    <div className="w-full h-28 rounded-2xl overflow-hidden border border-white/10">
                      <img
                        src={card.thumbnailUrl}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <ThumbnailPreview numberTag={card.numberTag} index={idx} />
                  )}
                </div>

                {/* Capability Badges */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.04] border border-white/10 text-zinc-300 group-hover:border-white/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Vibrant Orange CTA Pill Button */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => openQuoteModal(serviceTier)}
                  className="bg-[#FF6B00] hover:bg-[#ff7b1a] text-black font-semibold rounded-full px-6 py-3 flex items-center gap-2 active:scale-95 transition-all duration-200 shadow-lg shadow-[#FF6B00]/25 group/btn"
                >
                  <span>{card.ctaText || "Contact for a Quote"}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
                  Direct Architect Sync
                </span>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}
