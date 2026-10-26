'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { WebsiteContent, ExpertiseCard, FeatureItem } from '@/lib/types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Box, Star, Check } from 'lucide-react';

export default function CoreExpertiseCmsPage() {
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
      setStatus({ type: 'success', message: 'Core Expertise saved & storefront cache revalidated!' });
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Save error' });
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (cardId: string, field: keyof ExpertiseCard, value: any) => {
    if (!content) return;
    setContent({
      ...content,
      coreExpertise: {
        ...content.coreExpertise,
        cards: content.coreExpertise.cards.map((c) =>
          c.id === cardId ? { ...c, [field]: value } : c
        ),
      },
    });
  };

  const addChecklistItem = (cardId: string) => {
    if (!content) return;
    const newItem: FeatureItem = {
      id: `check-${Date.now()}`,
      text: 'New Capability Feature',
      highlighted: false,
    };
    setContent({
      ...content,
      coreExpertise: {
        ...content.coreExpertise,
        cards: content.coreExpertise.cards.map((c) =>
          c.id === cardId ? { ...c, checklist: [...c.checklist, newItem] } : c
        ),
      },
    });
  };

  const removeChecklistItem = (cardId: string, itemId: string) => {
    if (!content) return;
    setContent({
      ...content,
      coreExpertise: {
        ...content.coreExpertise,
        cards: content.coreExpertise.cards.map((c) =>
          c.id === cardId ? { ...c, checklist: c.checklist.filter((i) => i.id !== itemId) } : c
        ),
      },
    });
  };

  const updateChecklistItem = (cardId: string, itemId: string, text: string) => {
    if (!content) return;
    setContent({
      ...content,
      coreExpertise: {
        ...content.coreExpertise,
        cards: content.coreExpertise.cards.map((c) =>
          c.id === cardId
            ? {
                ...c,
                checklist: c.checklist.map((item) =>
                  item.id === itemId ? { ...item, text } : item
                ),
              }
            : c
        ),
      },
    });
  };

  if (loading || !content) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 font-mono text-xs">
        Loading Core Expertise CMS...
      </div>
    );
  }

  const { coreExpertise } = content;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Core Expertise"
        subtitle='Manage the 3-Tier "Build & Grow" matrix, checklists, and featured tiers'
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

        {/* Section Header Controls */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="pb-4 border-b border-white/5">
            <h2 className="text-base font-bold text-white tracking-tight">Section Titles &amp; Copy</h2>
            <p className="text-xs text-zinc-400 font-mono">Typography tags for the section headline</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Eyebrow Tag</label>
              <input
                type="text"
                value={coreExpertise.eyebrow}
                onChange={(e) =>
                  setContent({
                    ...content,
                    coreExpertise: { ...coreExpertise, eyebrow: e.target.value },
                  })
                }
                className="app-input text-red-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Primary Title (White)</label>
              <input
                type="text"
                value={coreExpertise.mainTitleWhite}
                onChange={(e) =>
                  setContent({
                    ...content,
                    coreExpertise: { ...coreExpertise, mainTitleWhite: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Accent Title (Crimson)</label>
              <input
                type="text"
                value={coreExpertise.mainTitleCrimson}
                onChange={(e) =>
                  setContent({
                    ...content,
                    coreExpertise: { ...coreExpertise, mainTitleCrimson: e.target.value },
                  })
                }
                className="app-input text-red-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Section Subtitle</label>
            <textarea
              rows={2}
              value={coreExpertise.subtitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  coreExpertise: { ...coreExpertise, subtitle: e.target.value },
                })
              }
              className="app-input resize-none"
            />
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">Interactive 3D Tilt Cards (3 Tiers)</h2>
            <span className="text-xs font-mono text-zinc-500">CARDS SYNCED WITH STOREFRONT</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {coreExpertise.cards.map((card, index) => (
              <div
                key={card.id}
                className={`p-6 rounded-3xl border transition-all ${
                  card.isFeatured
                    ? 'glass-panel-crimson border-red-500/50'
                    : 'glass-panel border-white/10'
                }`}
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-500 font-bold">TIER {index + 1}</span>
                    <h3 className="text-lg font-bold text-white">{card.title}</h3>
                  </div>

                  <button
                    onClick={() => updateCard(card.id, 'isFeatured', !card.isFeatured)}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono border transition-colors cursor-pointer ${
                      card.isFeatured
                        ? 'bg-red-600 border-red-500 text-white font-bold shadow-lg shadow-red-600/30'
                        : 'bg-white/5 border-white/10 text-zinc-400'
                    }`}
                  >
                    {card.isFeatured ? '★ Featured Spotlight' : 'Standard Tier'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 mb-1">Card Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                      className="app-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={card.ctaText}
                      onChange={(e) => updateCard(card.id, 'ctaText', e.target.value)}
                      className="app-input"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={card.description}
                    onChange={(e) => updateCard(card.id, 'description', e.target.value)}
                    className="app-input resize-none"
                  />
                </div>

                {/* Checklist CRUD */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      Included Deliverables Checklist ({card.checklist.length})
                    </span>
                    <button
                      onClick={() => addChecklistItem(card.id)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {card.checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => updateChecklistItem(card.id, item.id, e.target.value)}
                          className="bg-transparent text-xs text-zinc-200 outline-none flex-1 font-mono"
                        />
                        <button
                          onClick={() => removeChecklistItem(card.id, item.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publish Action Button */}
        <div className="sticky bottom-6 z-20 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-xl shadow-red-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Updates...' : 'Publish Core Expertise Changes'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
