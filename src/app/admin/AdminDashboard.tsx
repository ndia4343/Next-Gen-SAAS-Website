"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  WebsiteContent,
  ExpertiseCard,
  BentoCard,
  FloatingStat,
} from "@/lib/types";
import { updateEntireContentAction } from "@/actions/content-actions";
import ZavianLogo from "@/components/ui/ZavianLogo";
import {
  Sparkles,
  Cpu,
  LayoutGrid,
  Mic,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Volume2,
  Loader2,
  Radio,
  Sliders,
  Star,
} from "lucide-react";

interface AdminDashboardProps {
  initialContent: WebsiteContent;
}

type TabKey = "hero" | "expertise" | "bento" | "freya";

export default function AdminDashboard({ initialContent }: AdminDashboardProps) {
  const [content, setContent] = useState<WebsiteContent>(initialContent);
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [isPending, startTransition] = useTransition();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: "success" | "error" | "info";
    message: string;
    timestamp?: string;
  } | null>(null);

  // Helper for status banner
  const showStatus = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    const time = new Date().toLocaleTimeString();
    setStatusBanner({ type, message, timestamp: time });
    if (type !== "info") {
      setTimeout(() => setStatusBanner(null), 8000);
    }
  };

  // Generic content state updater
  const updateContent = (updater: (prev: WebsiteContent) => WebsiteContent) => {
    setContent((prev) => {
      const next = updater(prev);
      setHasUnsavedChanges(true);
      return next;
    });
  };

  // =========================================================================
  // 1. Publish to Live Site (Server Action)
  // =========================================================================
  const handlePublish = () => {
    showStatus("info", "Publishing updates to production storage & invalidating cache...");
    startTransition(async () => {
      const result = await updateEntireContentAction(content);
      if (result.success) {
        setHasUnsavedChanges(false);
        showStatus(
          "success",
          "Published to Live Site! Public pages cache invalidated via revalidatePath."
        );
      } else {
        showStatus("error", result.error || "Failed to publish content.");
      }
    });
  };

  // =========================================================================
  // 2. Hero CRUD Handlers
  // =========================================================================
  const handleAddStat = () => {
    updateContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        floatingStats: [
          ...prev.hero.floatingStats,
          { label: "New Metric", value: "99.9%" },
        ],
      },
    }));
  };

  const handleDeleteStat = (index: number) => {
    updateContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        floatingStats: prev.hero.floatingStats.filter((_, i) => i !== index),
      },
    }));
  };

  const handleUpdateStat = (
    index: number,
    field: keyof FloatingStat,
    val: string
  ) => {
    updateContent((prev) => {
      const nextStats = [...prev.hero.floatingStats];
      nextStats[index] = { ...nextStats[index], [field]: val };
      return {
        ...prev,
        hero: {
          ...prev.hero,
          floatingStats: nextStats,
        },
      };
    });
  };

  // =========================================================================
  // 3. Core Expertise CRUD Handlers
  // =========================================================================
  const handleAddExpertiseCard = () => {
    const newId = `exp-${Date.now().toString(36)}`;
    const newCard: ExpertiseCard = {
      id: newId,
      columnKey: "ecommerce",
      eyebrowIcon: "★",
      title: "New Solution Tier",
      description: "Custom architecture engineered for extreme performance and scale.",
      isFeatured: false,
      ctaText: "🚀 Get Started",
      ctaActionId: `quote-${newId}`,
      checklist: [
        { id: `${newId}-1`, text: "Production-Ready Architecture", highlighted: false },
        { id: `${newId}-2`, text: "Zero-Latency Edge Deployment", highlighted: false },
        { id: `${newId}-3`, text: "Autonomous Diagnostics & Scale", highlighted: true },
      ],
    };

    updateContent((prev) => ({
      ...prev,
      coreExpertise: {
        ...prev.coreExpertise,
        cards: [...prev.coreExpertise.cards, newCard],
      },
    }));
  };

  const handleDeleteExpertiseCard = (cardId: string) => {
    if (!confirm("Are you sure you want to delete this expertise card?")) return;
    updateContent((prev) => ({
      ...prev,
      coreExpertise: {
        ...prev.coreExpertise,
        cards: prev.coreExpertise.cards.filter((c) => c.id !== cardId),
      },
    }));
  };

  const handleToggleFeatured = (cardIdx: number) => {
    updateContent((prev) => {
      const nextCards = [...prev.coreExpertise.cards];
      nextCards[cardIdx] = {
        ...nextCards[cardIdx],
        isFeatured: !nextCards[cardIdx].isFeatured,
      };
      return {
        ...prev,
        coreExpertise: { ...prev.coreExpertise, cards: nextCards },
      };
    });
  };

  const handleAddChecklistItem = (cardIdx: number) => {
    const newItemId = `chk-${Date.now().toString(36)}`;
    updateContent((prev) => {
      const nextCards = [...prev.coreExpertise.cards];
      nextCards[cardIdx] = {
        ...nextCards[cardIdx],
        checklist: [
          ...nextCards[cardIdx].checklist,
          { id: newItemId, text: "New Capability Feature", highlighted: false },
        ],
      };
      return {
        ...prev,
        coreExpertise: { ...prev.coreExpertise, cards: nextCards },
      };
    });
  };

  const handleDeleteChecklistItem = (cardIdx: number, itemIdx: number) => {
    updateContent((prev) => {
      const nextCards = [...prev.coreExpertise.cards];
      nextCards[cardIdx] = {
        ...nextCards[cardIdx],
        checklist: nextCards[cardIdx].checklist.filter((_, i) => i !== itemIdx),
      };
      return {
        ...prev,
        coreExpertise: { ...prev.coreExpertise, cards: nextCards },
      };
    });
  };

  const handleUpdateChecklistItem = (
    cardIdx: number,
    itemIdx: number,
    text: string,
    highlighted?: boolean
  ) => {
    updateContent((prev) => {
      const nextCards = [...prev.coreExpertise.cards];
      const item = nextCards[cardIdx].checklist[itemIdx];
      nextCards[cardIdx].checklist[itemIdx] = {
        ...item,
        text,
        highlighted: highlighted !== undefined ? highlighted : item.highlighted,
      };
      return {
        ...prev,
        coreExpertise: { ...prev.coreExpertise, cards: nextCards },
      };
    });
  };

  // =========================================================================
  // 4. Project Support Bento CRUD & Re-order Handlers
  // =========================================================================
  const handleAddBentoCard = () => {
    const newId = `bento-${Date.now().toString(36)}`;
    const nextNum = (content.projectSupport.cards.length + 1)
      .toString()
      .padStart(2, "0");
    const newCard: BentoCard = {
      id: newId,
      numberTag: `${nextNum} / CAPABILITY`,
      title: "New Project Support Tier",
      description: "Engineered solutions tailored to your technical requirements.",
      ctaText: "Contact for a Quote ↗",
      accentColor: "orange",
    };

    updateContent((prev) => ({
      ...prev,
      projectSupport: {
        ...prev.projectSupport,
        cards: [...prev.projectSupport.cards, newCard],
      },
    }));
  };

  const handleDeleteBentoCard = (cardId: string) => {
    if (!confirm("Are you sure you want to delete this Bento card?")) return;
    updateContent((prev) => ({
      ...prev,
      projectSupport: {
        ...prev.projectSupport,
        cards: prev.projectSupport.cards.filter((c) => c.id !== cardId),
      },
    }));
  };

  const handleMoveBentoCard = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= content.projectSupport.cards.length) return;

    updateContent((prev) => {
      const nextCards = [...prev.projectSupport.cards];
      const temp = nextCards[index];
      nextCards[index] = nextCards[targetIndex];
      nextCards[targetIndex] = temp;
      return {
        ...prev,
        projectSupport: { ...prev.projectSupport, cards: nextCards },
      };
    });
  };

  // =========================================================================
  // 5. Freya Audio Tester
  // =========================================================================
  const handleTestFreyaSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("SpeechSynthesis API not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      content.freyaVoiceAgent.welcomeMessage
    );
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#060609] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* =========================================================================
          Top Header Bar
      ========================================================================== */}
      <header className="sticky top-0 z-40 bg-[#0d0d14]/90 border-b border-white/10 backdrop-blur-xl px-6 py-4 flex items-center justify-between gap-4">
        {/* Title + Pulse Beacon */}
        <div className="flex items-center gap-3">
          <ZavianLogo size="sm" />
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hasUnsavedChanges
                  ? "bg-amber-400 animate-ping"
                  : isPending
                  ? "bg-red-500 animate-pulse"
                  : "bg-emerald-500"
              }`}
            />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
              ZAVIAN LABS <span className="text-[#DC2626]">//</span> LIVE CONTENT CONTROL
            </span>
          </div>

          {hasUnsavedChanges && (
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Unsaved Changes
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <span>Live Preview</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>

          <button
            onClick={handlePublish}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs transition-all shadow-lg shadow-red-700/30 active:scale-95 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish to Live Site</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Save Status Banner */}
      {statusBanner && (
        <div
          className={`px-6 py-3 border-b text-xs flex items-center justify-between transition-all ${
            statusBanner.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-300"
              : statusBanner.type === "error"
              ? "bg-red-950/60 border-red-500/30 text-red-300"
              : "bg-blue-950/60 border-blue-500/30 text-blue-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusBanner.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : statusBanner.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
            )}
            <span className="font-medium">{statusBanner.message}</span>
            {statusBanner.timestamp && (
              <span className="text-[10px] font-mono text-zinc-400 opacity-80">
                · {statusBanner.timestamp}
              </span>
            )}
          </div>
          <button
            onClick={() => setStatusBanner(null)}
            className="text-zinc-400 hover:text-white text-xs px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          Main Body: Sidebar + Dynamic Workspace
      ========================================================================== */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-72 shrink-0 bg-[#0d0d14]/80 border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 flex flex-row md:flex-col justify-between gap-2 overflow-x-auto md:overflow-visible backdrop-blur-xl">
          <div className="flex flex-row md:flex-col gap-2 w-full">
            <button
              onClick={() => setActiveTab("hero")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all w-full text-left ${
                activeTab === "hero"
                  ? "bg-red-600/15 border border-red-500/40 text-white shadow-lg shadow-red-950/50"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <Sparkles className="w-4 h-4 text-red-500" />
              <span>Hero Section</span>
            </button>

            <button
              onClick={() => setActiveTab("expertise")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all w-full text-left ${
                activeTab === "expertise"
                  ? "bg-red-600/15 border border-red-500/40 text-white shadow-lg shadow-red-950/50"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <Cpu className="w-4 h-4 text-red-500" />
              <span>Core Expertise (3D)</span>
            </button>

            <button
              onClick={() => setActiveTab("bento")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all w-full text-left ${
                activeTab === "bento"
                  ? "bg-red-600/15 border border-red-500/40 text-white shadow-lg shadow-red-950/50"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-[#FF6B00]" />
              <span>Project Support Bento</span>
            </button>

            <button
              onClick={() => setActiveTab("freya")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all w-full text-left ${
                activeTab === "freya"
                  ? "bg-red-600/15 border border-red-500/40 text-white shadow-lg shadow-red-950/50"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <Mic className="w-4 h-4 text-[#00B4D8]" />
              <span>Freya Voice Agent</span>
            </button>
          </div>

          {/* Quick Info Badge in Sidebar Footer */}
          <div className="hidden md:block p-4 rounded-2xl bg-white/[0.02] border border-white/5 font-mono text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Next.js 15 SSR</span>
              <span className="text-emerald-400">ONLINE</span>
            </div>
            <div>Storage: src/data/content.json</div>
            <div>Revalidation: ISR 60s</div>
          </div>
        </aside>

        {/* Dynamic Workspace Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl">
          {/* ===================================================================
              TAB 1: HERO SECTION
          =================================================================== */}
          {activeTab === "hero" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Hero Kinetic Section
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Configure headline typography, badges, and floating terminal HUD metrics.
                  </p>
                </div>
              </div>

              {/* Headline & Copy Card */}
              <div className="bg-[#0d0d14]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Eyebrow Badge Text
                    </label>
                    <input
                      type="text"
                      value={content.hero.badgeText}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, badgeText: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Title Line 1
                    </label>
                    <input
                      type="text"
                      value={content.hero.titleLine1}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, titleLine1: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Title Highlight (Red-to-Orange Gradient)
                    </label>
                    <input
                      type="text"
                      value={content.hero.titleHighlight}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, titleHighlight: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Title Line 2
                    </label>
                    <input
                      type="text"
                      value={content.hero.titleLine2}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, titleLine2: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Description Subtitle
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.description}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, description: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Primary CTA Button
                    </label>
                    <input
                      type="text"
                      value={content.hero.primaryCtaText}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, primaryCtaText: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Secondary CTA Button (Quote Trigger)
                    </label>
                    <input
                      type="text"
                      value={content.hero.secondaryCtaText}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, secondaryCtaText: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Metric HUD Items */}
              <div className="bg-[#0d0d14]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-bold text-white">HUD Metric Cards</h3>
                    <p className="text-xs text-zinc-400">
                      Live metrics displayed on the kinetic terminal cards
                    </p>
                  </div>
                  <button
                    onClick={handleAddStat}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/10 text-xs font-mono text-zinc-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.hero.floatingStats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#16161f] border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 block mb-1">
                            VALUE
                          </label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) =>
                              handleUpdateStat(idx, "value", e.target.value)
                            }
                            className="w-full bg-[#0d0d14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 block mb-1">
                            LABEL
                          </label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) =>
                              handleUpdateStat(idx, "label", e.target.value)
                            }
                            className="w-full bg-[#0d0d14] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteStat(idx)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete Metric"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 2: CORE EXPERTISE (3D)
          =================================================================== */}
          {activeTab === "expertise" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Core Expertise (3D Tilt Grid)
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage offerings, featured state, and 6-bullet capability checklists.
                  </p>
                </div>
                <button
                  onClick={handleAddExpertiseCard}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 text-xs font-semibold transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Card</span>
                </button>
              </div>

              {/* Section Header Controls */}
              <div className="bg-[#0d0d14]/90 border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                      Section Eyebrow
                    </label>
                    <input
                      type="text"
                      value={content.coreExpertise.eyebrow}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          coreExpertise: {
                            ...prev.coreExpertise,
                            eyebrow: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                      Main Title (White Part)
                    </label>
                    <input
                      type="text"
                      value={
                        content.coreExpertise.mainTitleWhite ||
                        content.coreExpertise.titlePart1 ||
                        ""
                      }
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          coreExpertise: {
                            ...prev.coreExpertise,
                            mainTitleWhite: e.target.value,
                            titlePart1: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                      Main Title (Crimson Part)
                    </label>
                    <input
                      type="text"
                      value={
                        content.coreExpertise.mainTitleCrimson ||
                        content.coreExpertise.titlePart2 ||
                        ""
                      }
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          coreExpertise: {
                            ...prev.coreExpertise,
                            mainTitleCrimson: e.target.value,
                            titlePart2: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-6">
                {content.coreExpertise.cards.map((card, cardIdx) => (
                  <div
                    key={card.id}
                    className={`bg-[#0d0d14]/90 border rounded-3xl p-6 sm:p-8 space-y-6 transition-all ${
                      card.isFeatured
                        ? "border-red-500/50 shadow-2xl shadow-red-950/30"
                        : "border-white/10"
                    }`}
                  >
                    {/* Card Top Row with Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-zinc-400">
                          {card.columnKey}
                        </span>
                        <h3 className="text-xl font-bold text-white">{card.title}</h3>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Featured Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(cardIdx)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                            card.isFeatured
                              ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-600/40"
                              : "bg-white/[0.03] text-zinc-400 border-white/10 hover:text-white"
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>
                            {card.isFeatured ? "Elevated (translateZ 20px)" : "Standard Card"}
                          </span>
                        </button>

                        <button
                          onClick={() => handleDeleteExpertiseCard(card.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete Card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Card Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                          Card Title
                        </label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) =>
                            updateContent((prev) => {
                              const nextCards = [...prev.coreExpertise.cards];
                              nextCards[cardIdx] = {
                                ...nextCards[cardIdx],
                                title: e.target.value,
                              };
                              return {
                                ...prev,
                                coreExpertise: { ...prev.coreExpertise, cards: nextCards },
                              };
                            })
                          }
                          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={card.ctaText}
                          onChange={(e) =>
                            updateContent((prev) => {
                              const nextCards = [...prev.coreExpertise.cards];
                              nextCards[cardIdx] = {
                                ...nextCards[cardIdx],
                                ctaText: e.target.value,
                              };
                              return {
                                ...prev,
                                coreExpertise: { ...prev.coreExpertise, cards: nextCards },
                              };
                            })
                          }
                          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={card.description}
                          onChange={(e) =>
                            updateContent((prev) => {
                              const nextCards = [...prev.coreExpertise.cards];
                              nextCards[cardIdx] = {
                                ...nextCards[cardIdx],
                                description: e.target.value,
                              };
                              return {
                                ...prev,
                                coreExpertise: { ...prev.coreExpertise, cards: nextCards },
                              };
                            })
                          }
                          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Feature Checklist Editor */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-wider text-[#818CF8]">
                          Checklist Items ({card.checklist.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddChecklistItem(cardIdx)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Item</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {card.checklist.map((item, itemIdx) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 p-2 rounded-xl bg-[#16161f] border border-white/5"
                          >
                            <span className="text-[#818CF8] font-bold text-xs pl-1">
                              ✓
                            </span>
                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) =>
                                handleUpdateChecklistItem(
                                  cardIdx,
                                  itemIdx,
                                  e.target.value
                                )
                              }
                              className="flex-1 bg-transparent border-none text-xs text-zinc-200 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateChecklistItem(
                                  cardIdx,
                                  itemIdx,
                                  item.text,
                                  !item.highlighted
                                )
                              }
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                                item.highlighted
                                  ? "bg-red-500/20 border-red-500 text-red-400"
                                  : "bg-white/5 border-white/10 text-zinc-500"
                              }`}
                            >
                              {item.highlighted ? "Glow ON" : "Glow OFF"}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteChecklistItem(cardIdx, itemIdx)
                              }
                              className="p-1 text-zinc-500 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 3: PROJECT SUPPORT BENTO
          =================================================================== */}
          {activeTab === "bento" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Project Support Bento Grid
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage 2x2 capability modules, color accents, and reorder grid positions.
                  </p>
                </div>
                <button
                  onClick={handleAddBentoCard}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B00]/20 border border-[#FF6B00]/40 text-[#FF6B00] hover:bg-[#FF6B00]/30 text-xs font-semibold transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Bento Card</span>
                </button>
              </div>

              {/* Section Header Controls */}
              <div className="bg-[#0d0d14]/90 border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                      Headline (White)
                    </label>
                    <input
                      type="text"
                      value={
                        content.projectSupport.headlineWhite ||
                        content.projectSupport.titlePart1 ||
                        ""
                      }
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          projectSupport: {
                            ...prev.projectSupport,
                            headlineWhite: e.target.value,
                            titlePart1: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                      Headline (Orange #FF6B00)
                    </label>
                    <input
                      type="text"
                      value={
                        content.projectSupport.headlineOrange ||
                        content.projectSupport.titleHighlightOrange ||
                        ""
                      }
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          projectSupport: {
                            ...prev.projectSupport,
                            headlineOrange: e.target.value,
                            titleHighlightOrange: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                      Headline (Cyan #00B4D8)
                    </label>
                    <input
                      type="text"
                      value={
                        content.projectSupport.headlineCyan ||
                        content.projectSupport.titleHighlightCyan ||
                        ""
                      }
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          projectSupport: {
                            ...prev.projectSupport,
                            headlineCyan: e.target.value,
                            titleHighlightCyan: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bento Cards List */}
              <div className="space-y-6">
                {content.projectSupport.cards.map((card, idx) => (
                  <div
                    key={card.id}
                    className="bg-[#0d0d14]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6"
                  >
                    {/* Top Row with Re-order and Delete */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#FF6B00]">
                          {card.numberTag}
                        </span>
                        <h3 className="text-xl font-bold text-white">{card.title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Reorder Buttons */}
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveBentoCard(idx, "up")}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === content.projectSupport.cards.length - 1}
                          onClick={() => handleMoveBentoCard(idx, "down")}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteBentoCard(card.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 transition-colors ml-2"
                          title="Delete Card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                          Category Tag (e.g. 01 / SOFTWARE)
                        </label>
                        <input
                          type="text"
                          value={card.numberTag}
                          onChange={(e) =>
                            updateContent((prev) => {
                              const nextCards = [...prev.projectSupport.cards];
                              nextCards[idx] = {
                                ...nextCards[idx],
                                numberTag: e.target.value,
                              };
                              return {
                                ...prev,
                                projectSupport: {
                                  ...prev.projectSupport,
                                  cards: nextCards,
                                },
                              };
                            })
                          }
                          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                          Title
                        </label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) =>
                            updateContent((prev) => {
                              const nextCards = [...prev.projectSupport.cards];
                              nextCards[idx] = {
                                ...nextCards[idx],
                                title: e.target.value,
                              };
                              return {
                                ...prev,
                                projectSupport: {
                                  ...prev.projectSupport,
                                  cards: nextCards,
                                },
                              };
                            })
                          }
                          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                          Accent Color
                        </label>
                        <select
                          value={card.accentColor}
                          onChange={(e) =>
                            updateContent((prev) => {
                              const nextCards = [...prev.projectSupport.cards];
                              nextCards[idx] = {
                                ...nextCards[idx],
                                accentColor: e.target.value as any,
                              };
                              return {
                                ...prev,
                                projectSupport: {
                                  ...prev.projectSupport,
                                  cards: nextCards,
                                },
                              };
                            })
                          }
                          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                        >
                          <option value="orange">Vibrant Orange (#FF6B00)</option>
                          <option value="cyan">Electric Cyan (#00B4D8)</option>
                          <option value="crimson">Crimson Red (#DC2626)</option>
                          <option value="purple">Lavender Accent (#818CF8)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={card.description}
                          onChange={(e) =>
                            updateContent((prev) => {
                              const nextCards = [...prev.projectSupport.cards];
                              nextCards[idx] = {
                                ...nextCards[idx],
                                description: e.target.value,
                              };
                              return {
                                ...prev,
                                projectSupport: {
                                  ...prev.projectSupport,
                                  cards: nextCards,
                                },
                              };
                            })
                          }
                          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={card.ctaText}
                          onChange={(e) =>
                            updateContent((prev) => {
                              const nextCards = [...prev.projectSupport.cards];
                              nextCards[idx] = {
                                ...nextCards[idx],
                                ctaText: e.target.value,
                              };
                              return {
                                ...prev,
                                projectSupport: {
                                  ...prev.projectSupport,
                                  cards: nextCards,
                                },
                              };
                            })
                          }
                          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                          Thumbnail Asset URL (Optional)
                        </label>
                        <input
                          type="text"
                          value={card.thumbnailUrl || ""}
                          placeholder="https://images.unsplash.com/... or /assets/bento-preview.png"
                          onChange={(e) =>
                            updateContent((prev) => {
                              const nextCards = [...prev.projectSupport.cards];
                              nextCards[idx] = {
                                ...nextCards[idx],
                                thumbnailUrl: e.target.value || undefined,
                              };
                              return {
                                ...prev,
                                projectSupport: {
                                  ...prev.projectSupport,
                                  cards: nextCards,
                                },
                              };
                            })
                          }
                          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 4: FREYA VOICE AGENT
          =================================================================== */}
          {activeTab === "freya" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Freya Voice Agent Configuration
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Fine-tune AI persona parameters, welcome greetings, and architectural guidelines.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTestFreyaSpeech}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/30 text-xs font-semibold transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Test Voice Greeting</span>
                </button>
              </div>

              <div className="bg-[#0d0d14]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Agent Persona Name
                    </label>
                    <input
                      type="text"
                      value={content.freyaVoiceAgent.agentName}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          freyaVoiceAgent: {
                            ...prev.freyaVoiceAgent,
                            agentName: e.target.value,
                          },
                        }))
                      }
                      className="app-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Live Beacon State
                    </label>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((prev) => ({
                            ...prev,
                            freyaVoiceAgent: {
                              ...prev.freyaVoiceAgent,
                              isLiveIndicator: !prev.freyaVoiceAgent.isLiveIndicator,
                            },
                          }))
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono border transition-all ${
                          content.freyaVoiceAgent.isLiveIndicator
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                            : "bg-white/5 border-white/10 text-zinc-400"
                        }`}
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>
                          {content.freyaVoiceAgent.isLiveIndicator
                            ? "LIVE Beacon Enabled"
                            : "Beacon Disabled"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      Opening Greeting Message
                    </label>
                    <textarea
                      rows={3}
                      value={content.freyaVoiceAgent.welcomeMessage}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          freyaVoiceAgent: {
                            ...prev.freyaVoiceAgent,
                            welcomeMessage: e.target.value,
                          },
                        }))
                      }
                      className="app-input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      System Prompt & Architectural Guidelines
                    </label>
                    <textarea
                      rows={5}
                      value={content.freyaVoiceAgent.systemPrompt}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          freyaVoiceAgent: {
                            ...prev.freyaVoiceAgent,
                            systemPrompt: e.target.value,
                          },
                        }))
                      }
                      className="app-input font-mono text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
