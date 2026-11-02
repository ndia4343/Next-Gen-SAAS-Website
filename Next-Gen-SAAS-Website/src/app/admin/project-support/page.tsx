'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { WebsiteContent, BentoCard } from '@/lib/types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Layers } from 'lucide-react';

export default function ProjectSupportCmsPage() {
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
      setStatus({ type: 'success', message: 'Project Support saved & storefront revalidated!' });
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Save error' });
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (id: string, field: keyof BentoCard, value: any) => {
    if (!content) return;
    setContent({
      ...content,
      projectSupport: {
        ...content.projectSupport,
        cards: content.projectSupport.cards.map((c) =>
          c.id === id ? { ...c, [field]: value } : c
        ),
      },
    });
  };

  const addCard = () => {
    if (!content) return;
    const newCard: BentoCard = {
      id: `bento-${Date.now()}`,
      numberTag: `0${content.projectSupport.cards.length + 1} / CUSTOM`,
      title: 'New Service Capability',
      description: 'High-performance bespoke engineering service built to your specifications.',
      ctaText: 'Contact for a Quote ↗',
      accentColor: 'orange',
    };
    setContent({
      ...content,
      projectSupport: {
        ...content.projectSupport,
        cards: [...content.projectSupport.cards, newCard],
      },
    });
  };

  const removeCard = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      projectSupport: {
        ...content.projectSupport,
        cards: content.projectSupport.cards.filter((c) => c.id !== id),
      },
    });
  };

  if (loading || !content) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 font-mono text-xs">
        Loading Project Support CMS...
      </div>
    );
  }

  const { projectSupport } = content;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Project Support"
        subtitle="Manage the 4 capability matrices: Software, Data, AI, and Media services"
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
            <h2 className="text-base font-bold text-white tracking-tight">Section Headlines</h2>
            <p className="text-xs text-zinc-400 font-mono">3-Color display typography tags</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Eyebrow Tag</label>
              <input
                type="text"
                value={projectSupport.eyebrow}
                onChange={(e) =>
                  setContent({
                    ...content,
                    projectSupport: { ...projectSupport, eyebrow: e.target.value },
                  })
                }
                className="app-input text-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Title Part 1 (White)</label>
              <input
                type="text"
                value={projectSupport.headlineWhite || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    projectSupport: { ...projectSupport, headlineWhite: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Highlight (Orange)</label>
              <input
                type="text"
                value={projectSupport.headlineOrange || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    projectSupport: { ...projectSupport, headlineOrange: e.target.value },
                  })
                }
                className="app-input text-[#FF6B00] font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Highlight (Cyan)</label>
              <input
                type="text"
                value={projectSupport.headlineCyan || ''}
                onChange={(e) =>
                  setContent({
                    ...content,
                    projectSupport: { ...projectSupport, headlineCyan: e.target.value },
                  })
                }
                className="app-input text-[#00B4D8] font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Section Subtitle</label>
            <textarea
              rows={2}
              value={projectSupport.subtitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  projectSupport: { ...projectSupport, subtitle: e.target.value },
                })
              }
              className="app-input resize-none"
            />
          </div>
        </div>

        {/* Bento Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Bento Grid Service Cards ({projectSupport.cards.length})
            </h2>
            <button
              onClick={addCard}
              className="px-3.5 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/40 text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projectSupport.cards.map((card) => (
              <div key={card.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-xs font-mono text-zinc-500 font-bold">{card.numberTag}</span>
                  <button
                    onClick={() => removeCard(card.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">Number / Tag</label>
                  <input
                    type="text"
                    value={card.numberTag}
                    onChange={(e) => updateCard(card.id, 'numberTag', e.target.value)}
                    className="app-input"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">Card Title</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                    className="app-input font-bold text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={card.description}
                    onChange={(e) => updateCard(card.id, 'description', e.target.value)}
                    className="app-input resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">CTA Action Text</label>
                  <input
                    type="text"
                    value={card.ctaText}
                    onChange={(e) => updateCard(card.id, 'ctaText', e.target.value)}
                    className="app-input"
                  />
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
            <span>{saving ? 'Publishing Updates...' : 'Publish Bento Grid Changes'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
