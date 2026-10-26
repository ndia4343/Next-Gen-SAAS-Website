'use client';

import React, { useState, useEffect } from 'react';
import { PREDEFINED_THEMES, PredefinedThemeId } from '@/lib/theme';
import { ThemeBrandingConfig } from '@/lib/types';
import ZavianLogo from '@/components/ui/ZavianLogo';
import { Palette, CheckCircle2, Save, Image, Code, Sparkles, RefreshCw } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function ThemeBrandingPage() {
  const { setThemeId } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [branding, setBranding] = useState<ThemeBrandingConfig>({
    activeThemeId: 'crimson-cyber',
    logoMode: 'default',
    logoImageUrl: '',
    logoSvgContent: '',
    wordmark1: 'ZAVIAN',
    wordmark1Color: '#ffffff',
    wordmark2: 'LABS',
    wordmark2Color: '#DC2626',
    tagline: 'AI AUTOMATION & SOFTWARE STUDIO',
  });

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.content && data.content.themeBranding) {
          setBranding(data.content.themeBranding);
          setThemeId(data.content.themeBranding.activeThemeId);
        }
      })
      .catch((err) => console.error('Failed to load branding:', err))
      .finally(() => setLoading(false));
  }, [setThemeId]);

  const handleSelectTheme = (themeId: PredefinedThemeId) => {
    const updated = { ...branding, activeThemeId: themeId };
    setBranding(updated);
    setThemeId(themeId); // Instantly preview on UI & 3D canvas!
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'themeBranding',
          data: branding,
        }),
      });

      if (!res.ok) throw new Error('Save failed');

      setSuccessMsg('Theme & Branding configuration saved! Live storefront updated instantly.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Error saving branding');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-xs font-mono text-zinc-500">
        Loading Theme &amp; Branding configuration...
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-mono mb-2 uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            IDENTITY &amp; THEME ENGINE
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Theme &amp; Branding</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure the 5 predefined color themes, SVG/image logo, custom wordmark, and sub-tagline.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Predefined Color Theme Selector */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span>5 Predefined Color Themes</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Select one of the 5 engineered color themes. Changes apply instantly to titles, highlights, buttons, and background 3D canvas lighting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(PREDEFINED_THEMES) as PredefinedThemeId[]).map((key) => {
            const t = PREDEFINED_THEMES[key];
            const isSelected = branding.activeThemeId === key;

            return (
              <div
                key={key}
                onClick={() => handleSelectTheme(key)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/10 border-white/40 shadow-xl ring-2 ring-red-500/50'
                    : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: t.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: t.secondary }}
                    />
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{t.name}</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{t.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>Primary: {t.primary}</span>
                  <span>3D Tint: {t.lightTint3D}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Logo Icon Customization */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Image className="w-4 h-4 text-red-500" />
            <span>Logo Icon Configuration</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Choose between the default signature geometric node, an image URL (PNG/SVG/WebP), or raw SVG code.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'default', label: 'Preset Geometric "Z"', desc: 'Cyber notch vector badge' },
            { id: 'image', label: 'Custom Image URL', desc: 'Direct link to external logo asset' },
            { id: 'svg', label: 'Custom Inline SVG', desc: 'Raw XML/SVG vector path code' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setBranding({ ...branding, logoMode: mode.id as any })}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                branding.logoMode === mode.id
                  ? 'bg-red-600/15 border-red-500 text-white font-semibold'
                  : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-mono font-bold uppercase">{mode.label}</div>
              <div className="text-[11px] text-zinc-500 mt-1">{mode.desc}</div>
            </button>
          ))}
        </div>

        {/* Image Mode Inputs */}
        {branding.logoMode === 'image' && (
          <div className="space-y-2">
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Logo Image URL (PNG, SVG, WebP)
            </label>
            <input
              type="url"
              value={branding.logoImageUrl || ''}
              onChange={(e) => setBranding({ ...branding, logoImageUrl: e.target.value })}
              placeholder="https://example.com/assets/logo.png"
              className="app-input"
            />
          </div>
        )}

        {/* SVG Mode Inputs */}
        {branding.logoMode === 'svg' && (
          <div className="space-y-2">
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Inline SVG Code</span>
              <Code className="w-3.5 h-3.5 text-zinc-500" />
            </label>
            <textarea
              rows={4}
              value={branding.logoSvgContent || ''}
              onChange={(e) => setBranding({ ...branding, logoSvgContent: e.target.value })}
              placeholder='<svg viewBox="0 0 32 32">...</svg>'
              className="app-input font-mono text-xs"
            />
          </div>
        )}
      </section>

      {/* 3. Logo Title & Sub-Tagline */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span>Logo Title &amp; Tagline Editor</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Customize the dual-word brand wordmark and the micro-tagline shown in the navigation bar and footer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
              Wordmark Part 1 (Default: ZAVIAN)
            </label>
            <input
              type="text"
              value={branding.wordmark1}
              onChange={(e) => setBranding({ ...branding, wordmark1: e.target.value })}
              className="app-input"
              placeholder="ZAVIAN"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
              Wordmark Part 2 (Default: LABS)
            </label>
            <input
              type="text"
              value={branding.wordmark2}
              onChange={(e) => setBranding({ ...branding, wordmark2: e.target.value })}
              className="app-input"
              placeholder="LABS"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
            Sub-Tagline (Default: AI AUTOMATION &amp; SOFTWARE STUDIO)
          </label>
          <input
            type="text"
            value={branding.tagline}
            onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
            className="app-input"
            placeholder="AI AUTOMATION & SOFTWARE STUDIO"
          />
        </div>
      </section>

      {/* Live Preview Card */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
            Real-Time Live Preview
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            THEME: {branding.activeThemeId.toUpperCase()}
          </span>
        </div>

        <div className="p-8 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center">
          <ZavianLogo
            showTagline={true}
            wordmarkWhite={branding.wordmark1}
            wordmarkCrimson={branding.wordmark2}
            wordmark1Color={branding.wordmark1Color}
            wordmark2Color={branding.wordmark2Color}
            tagline={branding.tagline}
            logoMode={branding.logoMode}
            logoImageUrl={branding.logoImageUrl}
            logoSvgContent={branding.logoSvgContent}
            size="lg"
          />
        </div>
      </section>
    </div>
  );
}
