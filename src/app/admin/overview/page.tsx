'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { WebsiteContent, FloatingStat } from '@/lib/types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Layout, ArrowRight, Sparkles } from 'lucide-react';

export default function OverviewCmsPage() {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
      }
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setStatus({ type: 'success', message: 'Overview module saved & live storefront revalidated!' });
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Save error' });
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => {
    if (!content) return;
    const newStat: FloatingStat = {
      label: 'New SLA Metric',
      value: '99.99%',
      subtext: 'High Availability',
    };
    setContent({
      ...content,
      hero: {
        ...content.hero,
        floatingStats: [...content.hero.floatingStats, newStat],
      },
    });
  };

  const removeStat = (index: number) => {
    if (!content) return;
    setContent({
      ...content,
      hero: {
        ...content.hero,
        floatingStats: content.hero.floatingStats.filter((_, i) => i !== index),
      },
    });
  };

  const updateStat = (index: number, field: keyof FloatingStat, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      hero: {
        ...content.hero,
        floatingStats: content.hero.floatingStats.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    });
  };

  if (loading || !content) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 font-mono text-xs">
        Loading Overview Module...
      </div>
    );
  }

  const { hero } = content;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Overview"
        subtitle="Manage the primary hero introduction, display headline, dual action triggers, and SLA telemetry strip"
        onRefresh={fetchContent}
      />

      <main className="p-8 space-y-8 flex-1 max-w-5xl">
        {status && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-mono border ${
              status.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/60 border-red-500/30 text-red-300'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {/* Top Eyebrow Badge Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Kinetic Top Eyebrow Badge</h2>
              <p className="text-xs text-zinc-400 font-mono">Pill badge hovering above the main headline</p>
            </div>
            <button
              onClick={() =>
                setContent({
                  ...content,
                  hero: { ...hero, badgeVisible: !hero.badgeVisible },
                })
              }
              className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors cursor-pointer ${
                hero.badgeVisible
                  ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500'
              }`}
            >
              {hero.badgeVisible ? 'Badge Visible' : 'Badge Hidden'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Badge Text</label>
              <input
                type="text"
                value={hero.badgeText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...hero, badgeText: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Indicator Dot Hex Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={hero.badgeDotColor}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...hero, badgeDotColor: e.target.value },
                    })
                  }
                  className="app-input"
                />
                <div
                  className="w-10 h-10 rounded-xl border border-white/15 shrink-0"
                  style={{ backgroundColor: hero.badgeDotColor }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Headline & Copy Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="pb-4 border-b border-white/5">
            <h2 className="text-base font-bold text-white tracking-tight">Display Headline &amp; Body Copy</h2>
            <p className="text-xs text-zinc-400 font-mono">Split-word color tags for the kinetic hero presentation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Title Line 1</label>
              <input
                type="text"
                value={hero.titleLine1}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...hero, titleLine1: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Title Highlight (Theme Gradient)</label>
              <input
                type="text"
                value={hero.titleHighlight}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...hero, titleHighlight: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Title Line 2</label>
              <input
                type="text"
                value={hero.titleLine2}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...hero, titleLine2: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Description Copy</label>
            <textarea
              rows={3}
              value={hero.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...hero, description: e.target.value },
                })
              }
              className="app-input"
            />
          </div>
        </div>

        {/* CTAs Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="pb-4 border-b border-white/5">
            <h2 className="text-base font-bold text-white tracking-tight">Hero Call-To-Action Triggers</h2>
            <p className="text-xs text-zinc-400 font-mono">Primary and secondary conversion buttons</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Primary CTA Button Label</label>
              <input
                type="text"
                value={hero.primaryCtaText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...hero, primaryCtaText: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Primary CTA Target (#core-expertise)</label>
              <input
                type="text"
                value={hero.primaryCtaLink}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...hero, primaryCtaLink: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-zinc-400 mb-1">Secondary CTA Button Label</label>
              <input
                type="text"
                value={hero.secondaryCtaText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...hero, secondaryCtaText: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>
          </div>
        </div>

        {/* SLA Telemetry Metrics Strip */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">SLA Telemetry Metric Cards</h2>
              <p className="text-xs text-zinc-400 font-mono">Floating HUD metrics under the hero buttons</p>
            </div>
            <button
              onClick={addStat}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Metric Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hero.floatingStats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Metric #{idx + 1}</span>
                  <button
                    onClick={() => removeStat(idx)}
                    className="text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(idx, 'label', e.target.value)}
                      className="app-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(idx, 'value', e.target.value)}
                      className="app-input text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">Subtext</label>
                  <input
                    type="text"
                    value={stat.subtext || ''}
                    onChange={(e) => updateStat(idx, 'subtext', e.target.value)}
                    className="app-input text-xs"
                    placeholder="e.g. High Availability"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Updates...' : 'Publish Overview Changes'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
