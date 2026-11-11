'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Palette,
  Type,
  Activity,
  PhoneCall,
  Network,
  BarChart3,
  Save,
  RotateCcw,
  ExternalLink,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { defaultConfig } from '@/lib/default-config';
import {
  SiteConfig,
  HeadlineFontWeight,
  HeadlineFontFamily,
  VoiceScriptTurn,
} from '@/types/site-config';

type CmsTabId =
  | 'branding'
  | 'hero'
  | 'marquee'
  | 'voiceTheatre'
  | 'constellation'
  | 'telemetry';

const TABS: {
  id: CmsTabId;
  label: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'branding', label: 'Branding', shortDesc: 'Logo size, wordmark, links', icon: Palette },
  { id: 'hero', label: 'Hero & Typography', shortDesc: 'Headline scale, weight & CTAs', icon: Type },
  { id: 'marquee', label: 'Marquee Ticker', shortDesc: 'Items & stream velocity', icon: Activity },
  { id: 'voiceTheatre', label: 'Voice Simulation', shortDesc: 'Audio, scripts & WhatsApp', icon: PhoneCall },
  { id: 'constellation', label: 'Systems Constellation', shortDesc: 'Core hub & system nodes', icon: Network },
  { id: 'telemetry', label: 'Telemetry Engine', shortDesc: 'KPIs & 12-bar charts', icon: BarChart3 },
];

const FONT_WEIGHTS: { value: HeadlineFontWeight; label: string }[] = [
  { value: 'font-normal', label: 'Normal (400)' },
  { value: 'font-medium', label: 'Medium (500)' },
  { value: 'font-semibold', label: 'Semibold (600)' },
  { value: 'font-bold', label: 'Bold (700)' },
];

function cloneConfig(cfg: SiteConfig): SiteConfig {
  return JSON.parse(JSON.stringify(cfg)) as SiteConfig;
}

export default function SuperAdminCmsPage() {
  const { config, isLoading, isSaving, saveConfig, refreshConfig } = useSiteConfig();

  const [draft, setDraft] = useState<SiteConfig>(() => cloneConfig(config));
  const [activeTab, setActiveTab] = useState<CmsTabId>('branding');
  const [selectedIndustryIdx, setSelectedIndustryIdx] = useState<number>(0);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number>(-1); // -1 = ZAVIAN CORE
  const [selectedSectorIdx, setSelectedSectorIdx] = useState<number>(0);

  const [statusNotice, setStatusNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [uploadingField, setUploadingField] = useState<'logo' | 'audio' | null>(null);

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(config),
    [draft, config]
  );

  // Sync draft when server config loads initially and user hasn't made local edits
  const hasSyncedInitial = useRef(false);
  useEffect(() => {
    if (!isLoading && !hasSyncedInitial.current) {
      setDraft(cloneConfig(config));
      hasSyncedInitial.current = true;
    }
  }, [config, isLoading]);

  const showNotice = (type: 'success' | 'error', text: string) => {
    setStatusNotice({ type, text });
    if (type === 'success') {
      setTimeout(() => {
        setStatusNotice((prev) => (prev?.text === text ? null : prev));
      }, 4500);
    }
  };

  const handleSaveAndPublish = async () => {
    setStatusNotice(null);
    const cleaned = cloneConfig(draft);
    const nonEmptyMarquee = cleaned.marquee.items
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    cleaned.marquee.items =
      nonEmptyMarquee.length > 0 ? nonEmptyMarquee : ['AI VOICE RECEPTIONISTS'];

    const res = await saveConfig(cleaned);
    if (res.success) {
      setDraft(cloneConfig(cleaned));
      showNotice('success', 'Published! Public storefront reflects your changes immediately.');
    } else {
      showNotice('error', res.error || 'Failed to publish configuration.');
    }
  };

  const handleDiscard = () => {
    setDraft(cloneConfig(config));
    showNotice('success', 'Draft reverted to currently published configuration.');
  };

  const handleResetDefaults = () => {
    setDraft(cloneConfig(defaultConfig));
    showNotice('success', 'Default template loaded into draft. Click Save & Publish to apply live.');
  };

  const handleFileUpload = async (
    file: File,
    target: 'logo' | 'audio'
  ) => {
    setUploadingField(target);
    setStatusNotice(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Upload failed');
      }

      const uploadedUrl = (data.url || data.dataUrl) as string;
      if (target === 'logo') {
        setDraft((prev) => ({
          ...prev,
          branding: { ...prev.branding, logoImageUrl: uploadedUrl },
        }));
        showNotice('success', `Uploaded logo image (${file.name}). Save & Publish to go live.`);
      } else {
        setDraft((prev) => ({
          ...prev,
          voiceTheatre: { ...prev.voiceTheatre, demoAudioUrl: uploadedUrl },
        }));
        showNotice('success', `Uploaded demo audio (${file.name}). Save & Publish to go live.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Asset upload error';
      showNotice('error', msg);
    } finally {
      setUploadingField(null);
    }
  };

  const activeIndustry =
    draft.voiceTheatre.industries[selectedIndustryIdx] ||
    draft.voiceTheatre.industries[0];
  const activeSector =
    draft.telemetry.sectors[selectedSectorIdx] ||
    draft.telemetry.sectors[0];
  const activeNode =
    selectedNodeIdx >= 0 ? draft.constellation.nodes[selectedNodeIdx] : null;

  return (
    <div className="min-h-screen bg-[#040406] text-zinc-100 pb-20">
      {/* Sticky Super Admin Command Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07080c]/90 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-[11px] font-mono font-bold tracking-widest uppercase text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              SUPER ADMIN CMS
            </div>

            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-[11px] font-mono text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Unsaved Draft Changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[11px] font-mono text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Synced with Live Storefront
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={refreshConfig}
              title="Reload from server"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Defaults</span>
            </button>

            <button
              type="button"
              disabled={!isDirty || isSaving}
              onClick={handleDiscard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.09] disabled:opacity-40 text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveAndPublish}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#0A84FF] to-[#6366F1] hover:opacity-95 disabled:opacity-50 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_24px_rgba(10,132,255,0.35)] transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save &amp; Publish</span>
                </>
              )}
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-mono font-semibold text-emerald-300 transition-colors cursor-pointer"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-6">
        {/* Status Banner */}
        {statusNotice && (
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 text-sm ${
              statusNotice.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-red-500/10 border-red-500/35 text-red-200'
            }`}
          >
            {statusNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusNotice.text}</span>
          </div>
        )}

        {/* Section Tabs Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-br from-[#0A84FF]/20 to-[#6366F1]/15 border-[#0A84FF]/60 shadow-[0_0_24px_rgba(10,132,255,0.18)]'
                    : 'bg-[#0b0d13] border-white/10 hover:border-white/25 hover:bg-[#10131c]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#5ee3ff]' : 'text-zinc-400'}`} />
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5ee3ff]" />
                  )}
                </div>
                <div className={`text-xs font-bold ${active ? 'text-white' : 'text-zinc-200'}`}>
                  {tab.label}
                </div>
                <div className="text-[10.5px] text-zinc-400 mt-0.5 truncate">
                  {tab.shortDesc}
                </div>
              </button>
            );
          })}
        </div>

        {/* ============================== */}
        {/* TAB 1: BRANDING                */}
        {/* ============================== */}
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#0b0d13] p-6 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white">Brand Identity &amp; Global Links</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Controls Navbar, Footer cube scale, uppercase lockup, and CTA destinations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Primary Wordmark
                  </label>
                  <input
                    type="text"
                    value={draft.branding.logoTextPrimary}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, logoTextPrimary: e.target.value },
                      }))
                    }
                    className="app-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Secondary Wordmark
                  </label>
                  <input
                    type="text"
                    value={draft.branding.logoTextSecondary}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, logoTextSecondary: e.target.value },
                      }))
                    }
                    className="app-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Legal / Company Name
                  </label>
                  <input
                    type="text"
                    value={draft.branding.companyName}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, companyName: e.target.value },
                      }))
                    }
                    className="app-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={draft.branding.contactEmail}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, contactEmail: e.target.value },
                      }))
                    }
                    className="app-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Studio Tagline
                </label>
                <input
                  type="text"
                  value={draft.branding.tagline}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      branding: { ...prev.branding, tagline: e.target.value },
                    }))
                  }
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Calendar Booking URL
                </label>
                <input
                  type="url"
                  value={draft.branding.calendarBookingUrl}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      branding: { ...prev.branding, calendarBookingUrl: e.target.value },
                    }))
                  }
                  className="app-input"
                />
              </div>

              {/* Logo Icon Size Slider */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    Logo Cube Icon Size
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0A84FF]/20 border border-[#0A84FF]/40 font-mono text-xs text-[#5ee3ff]">
                    {draft.branding.logoIconSize}px &times; {draft.branding.logoIconSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min={24}
                  max={64}
                  step={1}
                  value={draft.branding.logoIconSize}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      branding: {
                        ...prev.branding,
                        logoIconSize: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-[#0A84FF]"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>24px (Compact)</span>
                  <span>36px (Editorial Standard)</span>
                  <span>64px (Oversized)</span>
                </div>
              </div>

              {/* Logo Image Asset URL & Upload */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Logo Mark Asset Path / Upload
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={draft.branding.logoImageUrl}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, logoImageUrl: e.target.value },
                      }))
                    }
                    className="app-input flex-1 min-w-[200px]"
                  />
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f, 'logo');
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploadingField === 'logo'}
                    onClick={() => logoFileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-white cursor-pointer"
                  >
                    {uploadingField === 'logo' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>

              {/* Enable Light Canvas Toggle */}
              <label className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-white">Architectural Light Body Canvas</div>
                  <div className="text-xs text-zinc-400">
                    Keeps Hero &amp; Ticker permanently obsidian (#07080b) while rendering body sections in pure architectural white (#FFFFFF).
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.branding.enableLightMode}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      branding: { ...prev.branding, enableLightMode: e.target.checked },
                    }))
                  }
                  className="w-5 h-5 accent-[#0A84FF]"
                />
              </label>
            </div>

            {/* Live Navbar Lockup Preview Card */}
            <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#0b0d13] p-6 space-y-5">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#5ee3ff]">
                  Live Header Lockup Preview
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Mirrors exact dimensions rendered in Navbar &amp; Footer.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#07080b] border border-white/10 flex items-center justify-center">
                <div className="w-full rounded-full px-5 py-2.5 flex items-center justify-between bg-[#0c0e13]/90 border border-white/15 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-xl p-[1.5px] shrink-0"
                      style={{
                        width: `${draft.branding.logoIconSize}px`,
                        height: `${draft.branding.logoIconSize}px`,
                        background:
                          'linear-gradient(135deg, rgba(242,244,248,0.75) 0%, rgba(138,146,162,0.45) 45%, rgba(94,227,255,0.55) 100%)',
                      }}
                    >
                      <div className="w-full h-full rounded-[10px] bg-[#07080b] p-1 flex items-center justify-center overflow-hidden">
                        <img
                          src={draft.branding.logoImageUrl || '/images/zavian-cube-mark.png'}
                          alt={draft.branding.companyName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex items-center text-sm tracking-widest uppercase">
                      <span className="font-bold text-white">{draft.branding.logoTextPrimary}</span>
                      <span className="font-normal text-[#b4a0ff] ml-1.5">
                        {draft.branding.logoTextSecondary}
                      </span>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#eceef2] text-[#07080b] text-[11px] font-semibold">
                    Book Call ↗
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Company</span>
                  <span className="font-semibold text-white">{draft.branding.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Email</span>
                  <span className="font-mono text-[#5ee3ff]">{draft.branding.contactEmail}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500 shrink-0">Booking URL</span>
                  <span className="font-mono text-zinc-400 truncate">
                    {draft.branding.calendarBookingUrl}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* TAB 2: HERO & TYPOGRAPHY       */}
        {/* ============================== */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            {/* Live Obsidian Hero Headline Preview */}
            <div className="rounded-3xl border border-white/10 bg-[#07080b] p-8 sm:p-10 relative overflow-hidden">
              <div
                className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-70"
                style={{
                  background:
                    'radial-gradient(circle, rgba(94,227,255,0.20), rgba(167,139,250,0.12), transparent 70%)',
                }}
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] font-mono text-[11px] uppercase tracking-widest text-[#a0a7b3] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5ee3ff]" />
                <span>{draft.hero.eyebrowBadge}</span>
              </div>

              <div
                className={`${
                  draft.hero.headlineFontFamily === 'sans' ? 'font-sans' : 'font-serif-instrument'
                } ${draft.hero.headlineFontWeight} text-[#eceef2] leading-[0.96] tracking-[-0.02em]`}
                style={{
                  fontSize: `${Math.min(88, Math.max(28, Math.round(draft.hero.headlineFontSize * 0.72)))}px`,
                }}
              >
                {draft.hero.headlinePrefix}{' '}
                <span className="italic chrome-text-dark-bg inline-block pr-2">
                  {draft.hero.headlineAccent}
                </span>{' '}
                {draft.hero.headlineSuffix}
              </div>

              <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#a0a7b3]">
                {draft.hero.subheadline}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-white/10 bg-[#0b0d13] p-6 space-y-4">
                <h2 className="text-base font-bold text-white">Headline Copy &amp; Subheadline</h2>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={draft.hero.eyebrowBadge}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, eyebrowBadge: e.target.value },
                      }))
                    }
                    className="app-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Prefix Text
                    </label>
                    <input
                      type="text"
                      value={draft.hero.headlinePrefix}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, headlinePrefix: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5ee3ff] mb-1.5">
                      Chrome Italic Accent
                    </label>
                    <input
                      type="text"
                      value={draft.hero.headlineAccent}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, headlineAccent: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Suffix Text
                    </label>
                    <input
                      type="text"
                      value={draft.hero.headlineSuffix}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, headlineSuffix: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Subheadline Description
                  </label>
                  <textarea
                    rows={3}
                    value={draft.hero.subheadline}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subheadline: e.target.value },
                      }))
                    }
                    className="app-input"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b0d13] p-6 space-y-5">
                <h2 className="text-base font-bold text-white">Typography Controls &amp; CTAs</h2>

                {/* Font Size Slider */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Desktop Headline Scale
                    </label>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0A84FF]/20 border border-[#0A84FF]/40 font-mono text-xs text-[#5ee3ff]">
                      {draft.hero.headlineFontSize}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={36}
                    max={110}
                    step={2}
                    value={draft.hero.headlineFontSize}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, headlineFontSize: Number(e.target.value) },
                      }))
                    }
                    className="w-full accent-[#0A84FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Font Family
                    </label>
                    <select
                      value={draft.hero.headlineFontFamily}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            headlineFontFamily: e.target.value as HeadlineFontFamily,
                          },
                        }))
                      }
                      className="app-input"
                    >
                      <option value="serif">Instrument Serif (Editorial)</option>
                      <option value="sans">Inter Tight (Geometric Sans)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Font Weight
                    </label>
                    <select
                      value={draft.hero.headlineFontWeight}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            headlineFontWeight: e.target.value as HeadlineFontWeight,
                          },
                        }))
                      }
                      className="app-input"
                    >
                      {FONT_WEIGHTS.map((fw) => (
                        <option key={fw.value} value={fw.value}>
                          {fw.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Primary CTA Label
                    </label>
                    <input
                      type="text"
                      value={draft.hero.primaryCtaText}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, primaryCtaText: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Primary CTA Target
                    </label>
                    <input
                      type="text"
                      value={draft.hero.primaryCtaLink}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, primaryCtaLink: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Secondary CTA Label
                    </label>
                    <input
                      type="text"
                      value={draft.hero.secondaryCtaText}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, secondaryCtaText: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Secondary CTA Target
                    </label>
                    <input
                      type="text"
                      value={draft.hero.secondaryCtaLink}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, secondaryCtaLink: e.target.value },
                        }))
                      }
                      className="app-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* TAB 3: MARQUEE TICKER          */}
        {/* ============================== */}
        {activeTab === 'marquee' && (
          <div className="rounded-3xl border border-white/10 bg-[#0b0d13] p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Permanent Obsidian Ticker Strip</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Runs continuously without pausing on hover. Edit items and stream speed below.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    marquee: {
                      ...prev.marquee,
                      items: [...prev.marquee.items, 'NEW CAPABILITY STREAM'],
                    },
                  }))
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A84FF]/15 border border-[#0A84FF]/40 text-xs font-mono font-semibold text-[#5ee3ff] hover:bg-[#0A84FF]/25 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ticker Item</span>
              </button>
            </div>

            {/* Live Scrolling Ticker Preview */}
            <div className="relative z-20 w-full overflow-hidden py-4 border-t border-b border-white/10 bg-[#07080b] rounded-2xl">
              <div
                className="marquee-track flex items-center whitespace-nowrap"
                style={{ animationDuration: `${draft.marquee.speedSeconds}s` }}
              >
                {[0, 1].map((dup) => (
                  <div
                    key={dup}
                    className="flex items-center gap-10 pr-10 py-1.5 font-mono text-xs tracking-[0.14em] uppercase text-[#b8bfcc] shrink-0"
                  >
                    {draft.marquee.items.map((item, idx) => (
                      <span
                        key={`${dup}-${idx}`}
                        className="flex items-center gap-3 leading-none py-1"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 flex items-center leading-none ${
                            idx % 2 === 0
                              ? 'bg-[#5ee3ff] shadow-[0_0_10px_rgba(94,227,255,0.75)]'
                              : 'bg-[#a78bfa] shadow-[0_0_10px_rgba(167,139,250,0.75)]'
                          }`}
                        />
                        <span className="leading-none flex items-center">
                          {item || 'UNTITLED'}
                        </span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Speed Slider */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 max-w-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Loop Duration (Lower = Faster)
                </label>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0A84FF]/20 border border-[#0A84FF]/40 font-mono text-xs text-[#5ee3ff]">
                  {draft.marquee.speedSeconds}s / cycle
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={60}
                step={1}
                value={draft.marquee.speedSeconds}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    marquee: { ...prev.marquee, speedSeconds: Number(e.target.value) },
                  }))
                }
                className="w-full accent-[#0A84FF]"
              />
            </div>

            {/* Ticker Item Rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {draft.marquee.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10"
                >
                  <span className="w-7 text-center font-mono text-xs text-zinc-500">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const nextItems = [...draft.marquee.items];
                      nextItems[idx] = e.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        marquee: { ...prev.marquee, items: nextItems },
                      }));
                    }}
                    className="app-input flex-1"
                  />
                  <button
                    type="button"
                    disabled={draft.marquee.items.length <= 1}
                    onClick={() => {
                      if (draft.marquee.items.length <= 1) return;
                      setDraft((prev) => ({
                        ...prev,
                        marquee: {
                          ...prev.marquee,
                          items: prev.marquee.items.filter((_, i) => i !== idx),
                        },
                      }));
                    }}
                    title="Remove item"
                    className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* TAB 4: VOICE SIMULATION        */}
        {/* ============================== */}
        {activeTab === 'voiceTheatre' && (
          <div className="space-y-6">
            {/* Section Copy + Audio Sample */}
            <div className="rounded-3xl border border-white/10 bg-[#0b0d13] p-6 space-y-5">
              <h2 className="text-lg font-bold text-white">Voice Theatre Header &amp; Audio Track</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Eyebrow Label
                  </label>
                  <input
                    type="text"
                    value={draft.voiceTheatre.sectionEyebrow}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        voiceTheatre: { ...prev.voiceTheatre, sectionEyebrow: e.target.value },
                      }))
                    }
                    className="app-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Title Prefix
                  </label>
                  <input
                    type="text"
                    value={draft.voiceTheatre.sectionTitle}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        voiceTheatre: { ...prev.voiceTheatre, sectionTitle: e.target.value },
                      }))
                    }
                    className="app-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5ee3ff] mb-1.5">
                    Title Accent
                  </label>
                  <input
                    type="text"
                    value={draft.voiceTheatre.sectionTitleAccent}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        voiceTheatre: {
                          ...prev.voiceTheatre,
                          sectionTitleAccent: e.target.value,
                        },
                      }))
                    }
                    className="app-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Section Description
                </label>
                <textarea
                  rows={2}
                  value={draft.voiceTheatre.sectionDescription}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      voiceTheatre: {
                        ...prev.voiceTheatre,
                        sectionDescription: e.target.value,
                      },
                    }))
                  }
                  className="app-input"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-300">
                    <Volume2 className="w-4 h-4 text-[#5ee3ff]" />
                    <span>Primary Clinic Demo Audio URL (.mp3)</span>
                  </div>
                  <div>
                    <input
                      ref={audioFileInputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f, 'audio');
                        e.target.value = '';
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploadingField === 'audio'}
                      onClick={() => audioFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-white cursor-pointer"
                    >
                      {uploadingField === 'audio' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Upload Audio</span>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={draft.voiceTheatre.demoAudioUrl}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      voiceTheatre: { ...prev.voiceTheatre, demoAudioUrl: e.target.value },
                    }))
                  }
                  className="app-input"
                />
              </div>
            </div>

            {/* Industry Script & WhatsApp Editor */}
            {activeIndustry && (
              <div className="rounded-3xl border border-white/10 bg-[#0b0d13] p-6 space-y-6">
                <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
                  {draft.voiceTheatre.industries.map((ind, idx) => (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setSelectedIndustryIdx(idx)}
                      className={`px-4 py-2 rounded-full text-xs font-mono font-semibold border transition-all cursor-pointer ${
                        idx === selectedIndustryIdx
                          ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                          : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {ind.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Industry Tab Label
                    </label>
                    <input
                      type="text"
                      value={activeIndustry.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].label = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Channel Subtitle
                    </label>
                    <input
                      type="text"
                      value={activeIndustry.channelNote}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].channelNote = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Caller Name
                    </label>
                    <input
                      type="text"
                      value={activeIndustry.callerName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].callerName = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      AI Agent Name
                    </label>
                    <input
                      type="text"
                      value={activeIndustry.agentName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].agentName = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Agent Role Title
                    </label>
                    <input
                      type="text"
                      value={activeIndustry.agentRole}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].agentRole = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5ee3ff] mb-1">
                      Global Region Attribution Badge
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DIFC Dubai (DHA Licensed) · AED"
                      value={activeIndustry.regionBadge || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].regionBadge = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                  </div>
                </div>

                {/* Call Transcript Turns */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Interactive Dialogue Script</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newTurn: VoiceScriptTurn = {
                          at: 18,
                          who: `${activeIndustry.agentName} · Desk`,
                          isAi: true,
                          text: 'New automated response turn.',
                        };
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].script.push(newTurn);
                          return next;
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#0A84FF]/40 bg-[#0A84FF]/15 text-xs font-mono text-[#5ee3ff] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Script Turn</span>
                    </button>
                  </div>

                  {activeIndustry.script.map((turn, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="w-24">
                          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                            At (sec)
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={60}
                            step={0.5}
                            value={turn.at}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setDraft((prev) => {
                                const next = cloneConfig(prev);
                                next.voiceTheatre.industries[selectedIndustryIdx].script[tIdx].at =
                                  val;
                                return next;
                              });
                            }}
                            className="app-input"
                          />
                        </div>
                        <div className="flex-1 min-w-[160px]">
                          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                            Speaker Label
                          </label>
                          <input
                            type="text"
                            value={turn.who}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDraft((prev) => {
                                const next = cloneConfig(prev);
                                next.voiceTheatre.industries[selectedIndustryIdx].script[tIdx].who =
                                  val;
                                return next;
                              });
                            }}
                            className="app-input"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                            Voice Side
                          </label>
                          <select
                            value={turn.isAi ? 'ai' : 'caller'}
                            onChange={(e) => {
                              const isAi = e.target.value === 'ai';
                              setDraft((prev) => {
                                const next = cloneConfig(prev);
                                next.voiceTheatre.industries[selectedIndustryIdx].script[tIdx].isAi =
                                  isAi;
                                return next;
                              });
                            }}
                            className="app-input"
                          >
                            <option value="caller">Caller (Left)</option>
                            <option value="ai">AI Agent (Right)</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          disabled={activeIndustry.script.length <= 1}
                          onClick={() => {
                            if (activeIndustry.script.length <= 1) return;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.voiceTheatre.industries[selectedIndustryIdx].script =
                                next.voiceTheatre.industries[selectedIndustryIdx].script.filter(
                                  (_, i) => i !== tIdx
                                );
                              return next;
                            });
                          }}
                          className="mt-4 p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={turn.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev) => {
                            const next = cloneConfig(prev);
                            next.voiceTheatre.industries[selectedIndustryIdx].script[tIdx].text = val;
                            return next;
                          });
                        }}
                        className="app-input"
                      />
                    </div>
                  ))}
                </div>

                {/* Slot Confirmation + WhatsApp Phone Thread */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#5ee3ff]">
                      Calendar Lock Banner
                    </h4>
                    <input
                      type="text"
                      placeholder="Slot Message"
                      value={activeIndustry.lockedSlotMessage}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].lockedSlotMessage = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                    <input
                      type="text"
                      placeholder="Slot Subtext"
                      value={activeIndustry.lockedSlotSub}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].lockedSlotSub = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                    <input
                      type="text"
                      placeholder="End-of-Call Completion Banner Copy"
                      value={activeIndustry.completionSummary || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].completionSummary = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />

                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 pt-2">
                      3 Business Value Outcomes
                    </h4>
                    {[0, 1, 2].map((oIdx) => (
                      <input
                        key={oIdx}
                        type="text"
                        value={activeIndustry.outcomes[oIdx]}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev) => {
                            const next = cloneConfig(prev);
                            next.voiceTheatre.industries[selectedIndustryIdx].outcomes[oIdx] = val;
                            return next;
                          });
                        }}
                        className="app-input"
                      />
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                      WhatsApp Phone Simulation
                    </h4>
                    <input
                      type="text"
                      placeholder="WhatsApp Contact Header"
                      value={activeIndustry.whatsAppContactName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].whatsAppContactName = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                    <textarea
                      rows={2}
                      placeholder="Primary WhatsApp Notice"
                      value={activeIndustry.whatsAppNotice}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].whatsAppNotice = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                    <input
                      type="text"
                      placeholder="Client Reply Bubble"
                      value={activeIndustry.whatsAppReply}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].whatsAppReply = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                    <input
                      type="text"
                      placeholder="Automated Follow-up Message"
                      value={activeIndustry.whatsAppFollowup}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.voiceTheatre.industries[selectedIndustryIdx].whatsAppFollowup = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Attachment Name (e.g. Spec.pdf)"
                        value={activeIndustry.whatsAppAttachmentName || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev) => {
                            const next = cloneConfig(prev);
                            next.voiceTheatre.industries[selectedIndustryIdx].whatsAppAttachmentName =
                              val;
                            return next;
                          });
                        }}
                        className="app-input"
                      />
                      <input
                        type="text"
                        placeholder="Attachment Meta"
                        value={activeIndustry.whatsAppAttachmentMeta || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev) => {
                            const next = cloneConfig(prev);
                            next.voiceTheatre.industries[selectedIndustryIdx].whatsAppAttachmentMeta =
                              val;
                            return next;
                          });
                        }}
                        className="app-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================== */}
        {/* TAB 5: SYSTEMS CONSTELLATION   */}
        {/* ============================== */}
        {activeTab === 'constellation' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#0b0d13] p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Connected Hub Header Copy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Section Title Prefix
                  </label>
                  <input
                    type="text"
                    value={draft.constellation.sectionTitle}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        constellation: { ...prev.constellation, sectionTitle: e.target.value },
                      }))
                    }
                    className="app-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5ee3ff] mb-1">
                    Section Title Accent
                  </label>
                  <input
                    type="text"
                    value={draft.constellation.sectionTitleAccent}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        constellation: {
                          ...prev.constellation,
                          sectionTitleAccent: e.target.value,
                        },
                      }))
                    }
                    className="app-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={draft.constellation.sectionDescription}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      constellation: {
                        ...prev.constellation,
                        sectionDescription: e.target.value,
                      },
                    }))
                  }
                  className="app-input"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b0d13] p-6 space-y-5">
              <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
                <button
                  type="button"
                  onClick={() => setSelectedNodeIdx(-1)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer ${
                    selectedNodeIdx === -1
                      ? 'bg-gradient-to-r from-[#0A84FF] to-[#6366F1] border-transparent text-white'
                      : 'bg-white/[0.04] border-white/10 text-zinc-300'
                  }`}
                >
                  ★ Center Hub ({draft.constellation.coreNodeTitle})
                </button>
                {draft.constellation.nodes.map((n, idx) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setSelectedNodeIdx(idx)}
                    className={`px-3.5 py-2 rounded-full text-xs font-mono border transition-all cursor-pointer ${
                      selectedNodeIdx === idx
                        ? 'bg-[#0A84FF] border-[#0A84FF] text-white font-semibold'
                        : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>

              {selectedNodeIdx === -1 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        Core Title
                      </label>
                      <input
                        type="text"
                        value={draft.constellation.coreNodeTitle}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            constellation: {
                              ...prev.constellation,
                              coreNodeTitle: e.target.value,
                            },
                          }))
                        }
                        className="app-input"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        Status Pill
                      </label>
                      <input
                        type="text"
                        value={draft.constellation.coreNodeStatus}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            constellation: {
                              ...prev.constellation,
                              coreNodeStatus: e.target.value,
                            },
                          }))
                        }
                        className="app-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Core Description
                    </label>
                    <textarea
                      rows={2}
                      value={draft.constellation.coreNodeDescription}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          constellation: {
                            ...prev.constellation,
                            coreNodeDescription: e.target.value,
                          },
                        }))
                      }
                      className="app-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Core Technical Specs
                    </div>
                    {draft.constellation.coreNodeSpecs.map((spec, sIdx) => (
                      <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.constellation.coreNodeSpecs[sIdx].label = val;
                              return next;
                            });
                          }}
                          className="app-input"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.constellation.coreNodeSpecs[sIdx].value = val;
                              return next;
                            });
                          }}
                          className="app-input"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeNode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        Chip Label
                      </label>
                      <input
                        type="text"
                        value={activeNode.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev) => {
                            const next = cloneConfig(prev);
                            next.constellation.nodes[selectedNodeIdx].label = val;
                            return next;
                          });
                        }}
                        className="app-input"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        Inspector Title
                      </label>
                      <input
                        type="text"
                        value={activeNode.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev) => {
                            const next = cloneConfig(prev);
                            next.constellation.nodes[selectedNodeIdx].title = val;
                            return next;
                          });
                        }}
                        className="app-input"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                        Status Badge
                      </label>
                      <input
                        type="text"
                        value={activeNode.status}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev) => {
                            const next = cloneConfig(prev);
                            next.constellation.nodes[selectedNodeIdx].status = val;
                            return next;
                          });
                        }}
                        className="app-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Node Description
                    </label>
                    <textarea
                      rows={2}
                      value={activeNode.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.constellation.nodes[selectedNodeIdx].description = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                  </div>

                  {/* Coordinate Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-zinc-400">SVG X Coordinate</span>
                        <span className="text-[#5ee3ff]">{activeNode.x}</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={590}
                        value={activeNode.x}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setDraft((prev) => {
                            const next = cloneConfig(prev);
                            next.constellation.nodes[selectedNodeIdx].x = val;
                            return next;
                          });
                        }}
                        className="w-full accent-[#0A84FF]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-zinc-400">SVG Y Coordinate</span>
                        <span className="text-[#5ee3ff]">{activeNode.y}</span>
                      </div>
                      <input
                        type="range"
                        min={36}
                        max={384}
                        value={activeNode.y}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setDraft((prev) => {
                            const next = cloneConfig(prev);
                            next.constellation.nodes[selectedNodeIdx].y = val;
                            return next;
                          });
                        }}
                        className="w-full accent-[#0A84FF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Node Technical Specs
                    </div>
                    {activeNode.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.constellation.nodes[selectedNodeIdx].specs[sIdx].label = val;
                              return next;
                            });
                          }}
                          className="app-input"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.constellation.nodes[selectedNodeIdx].specs[sIdx].value = val;
                              return next;
                            });
                          }}
                          className="app-input"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* TAB 6: TELEMETRY ENGINE        */}
        {/* ============================== */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6">
            {/* Global Telemetry Header + Auto-Loop Cadence */}
            <div className="rounded-3xl border border-white/10 bg-[#0b0d13] p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Section Title Prefix
                  </label>
                  <input
                    type="text"
                    value={draft.telemetry.sectionTitle}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        telemetry: { ...prev.telemetry, sectionTitle: e.target.value },
                      }))
                    }
                    className="app-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5ee3ff] mb-1">
                    Section Title Accent
                  </label>
                  <input
                    type="text"
                    value={draft.telemetry.sectionTitleAccent}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        telemetry: { ...prev.telemetry, sectionTitleAccent: e.target.value },
                      }))
                    }
                    className="app-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={draft.telemetry.sectionDescription}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      telemetry: { ...prev.telemetry, sectionDescription: e.target.value },
                    }))
                  }
                  className="app-input"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    Auto-Loop Interval
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 font-mono text-xs text-emerald-300">
                    Every {draft.telemetry.autoCycleSeconds}s
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={15}
                  step={1}
                  value={draft.telemetry.autoCycleSeconds}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      telemetry: {
                        ...prev.telemetry,
                        autoCycleSeconds: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-[#0A84FF]"
                />
              </div>
            </div>

            {/* Sector Editor */}
            {activeSector && (
              <div className="rounded-3xl border border-white/10 bg-[#0b0d13] p-6 space-y-6">
                <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
                  {draft.telemetry.sectors.map((sec, idx) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setSelectedSectorIdx(idx)}
                      className={`px-4 py-2 rounded-full text-xs font-mono font-semibold border transition-all cursor-pointer ${
                        idx === selectedSectorIdx
                          ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                          : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Sector Tab Label
                    </label>
                    <input
                      type="text"
                      value={activeSector.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.telemetry.sectors[selectedSectorIdx].label = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Live Telemetry Badge
                    </label>
                    <input
                      type="text"
                      value={activeSector.badgeLabel}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.telemetry.sectors[selectedSectorIdx].badgeLabel = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Chart Title
                    </label>
                    <input
                      type="text"
                      value={activeSector.chartTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.telemetry.sectors[selectedSectorIdx].chartTitle = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Chart Subtitle
                    </label>
                    <input
                      type="text"
                      value={activeSector.chartSubtitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.telemetry.sectors[selectedSectorIdx].chartSubtitle = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                  </div>
                </div>

                {/* 4 KPI Cards */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">4 Executive KPI Tiles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {activeSector.kpis.map((kpi, kIdx) => (
                      <div
                        key={kIdx}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2"
                      >
                        <div className="text-[10px] font-mono uppercase text-zinc-500">
                          KPI #{kIdx + 1}
                        </div>
                        <input
                          type="text"
                          placeholder="Label"
                          value={kpi.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.telemetry.sectors[selectedSectorIdx].kpis[kIdx].label = val;
                              return next;
                            });
                          }}
                          className="app-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={kpi.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.telemetry.sectors[selectedSectorIdx].kpis[kIdx].value = val;
                              return next;
                            });
                          }}
                          className="app-input font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Delta note"
                          value={kpi.delta}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.telemetry.sectors[selectedSectorIdx].kpis[kIdx].delta = val;
                              return next;
                            });
                          }}
                          className="app-input text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 12-Bar Chart Height Sliders + Live Preview */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white">
                      12-Bar Weekly Chart Heights (0% – 100%)
                    </h3>
                    <span className="font-mono text-[11px] text-zinc-400">
                      Bars &ge; 90% render in amber peak highlight
                    </span>
                  </div>

                  {/* Live Miniature Bar Chart Preview */}
                  <div className="h-28 flex items-end gap-2 px-3 py-2 rounded-xl bg-[#07080b] border border-white/10">
                    {activeSector.weeklyChartBars.map((val, bIdx) => (
                      <div key={bIdx} className="flex-1 h-full flex flex-col justify-end items-center gap-1">
                        <div
                          className={`w-full rounded-t-md transition-all ${
                            val >= 90
                              ? 'bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-400'
                              : 'bg-gradient-to-t from-[#0A84FF] to-[#6366F1]'
                          }`}
                          style={{ height: `${Math.max(8, val)}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {activeSector.weeklyChartBars.map((val, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-2.5 rounded-xl bg-[#07080b] border border-white/10 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <input
                            type="text"
                            value={activeSector.barLabels[bIdx] || `W${bIdx + 1}`}
                            onChange={(e) => {
                              const lbl = e.target.value;
                              setDraft((prev) => {
                                const next = cloneConfig(prev);
                                next.telemetry.sectors[selectedSectorIdx].barLabels[bIdx] = lbl;
                                return next;
                              });
                            }}
                            className="w-12 bg-transparent border-b border-white/15 font-mono text-[11px] text-zinc-200 focus:outline-none focus:border-[#0A84FF]"
                          />
                          <span className="font-mono text-xs font-bold text-[#5ee3ff]">{val}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={val}
                          onChange={(e) => {
                            const num = Number(e.target.value);
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.telemetry.sectors[selectedSectorIdx].weeklyChartBars[bIdx] = num;
                              return next;
                            });
                          }}
                          className="w-full accent-[#0A84FF]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Operational Sync Feed & Highlight */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-8 p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Feed Header Title"
                        value={activeSector.subCardTitle}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev) => {
                            const next = cloneConfig(prev);
                            next.telemetry.sectors[selectedSectorIdx].subCardTitle = val;
                            return next;
                          });
                        }}
                        className="app-input"
                      />
                      <input
                        type="text"
                        placeholder="Feed Status Badge"
                        value={activeSector.subCardStatus}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraft((prev) => {
                            const next = cloneConfig(prev);
                            next.telemetry.sectors[selectedSectorIdx].subCardStatus = val;
                            return next;
                          });
                        }}
                        className="app-input"
                      />
                    </div>

                    {activeSector.subCardItems.map((item, fIdx) => (
                      <div
                        key={fIdx}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-[#07080b] border border-white/10"
                      >
                        <input
                          type="text"
                          placeholder="Name / Account"
                          value={item.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.telemetry.sectors[selectedSectorIdx].subCardItems[fIdx].title =
                                val;
                              return next;
                            });
                          }}
                          className="app-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Subtitle"
                          value={item.subtitle}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.telemetry.sectors[selectedSectorIdx].subCardItems[fIdx].subtitle =
                                val;
                              return next;
                            });
                          }}
                          className="app-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Metric"
                          value={item.metric}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.telemetry.sectors[selectedSectorIdx].subCardItems[fIdx].metric =
                                val;
                              return next;
                            });
                          }}
                          className="app-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Time"
                          value={item.time}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraft((prev) => {
                              const next = cloneConfig(prev);
                              next.telemetry.sectors[selectedSectorIdx].subCardItems[fIdx].time = val;
                              return next;
                            });
                          }}
                          className="app-input text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="lg:col-span-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#5ee3ff]">
                      Bottom Highlight Callout
                    </h4>
                    <input
                      type="text"
                      placeholder="Highlight Label"
                      value={activeSector.highlightLabel}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.telemetry.sectors[selectedSectorIdx].highlightLabel = val;
                          return next;
                        });
                      }}
                      className="app-input"
                    />
                    <input
                      type="text"
                      placeholder="Highlight Value"
                      value={activeSector.highlightValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => {
                          const next = cloneConfig(prev);
                          next.telemetry.sectors[selectedSectorIdx].highlightValue = val;
                          return next;
                        });
                      }}
                      className="app-input font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
