'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { WebsiteContent, UseCaseVertical } from '@/lib/types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';

export default function UseCasesCmsPage() {
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
      setStatus({ type: 'success', message: 'Use Cases & Blueprints saved & storefront cache revalidated!' });
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Save error' });
    } finally {
      setSaving(false);
    }
  };

  const updateVertical = (id: string, field: keyof UseCaseVertical, value: any) => {
    if (!content) return;
    setContent({
      ...content,
      useCases: {
        ...content.useCases,
        verticals: content.useCases.verticals.map((v) =>
          v.id === id ? { ...v, [field]: value } : v
        ),
      },
    });
  };

  const addVertical = () => {
    if (!content) return;
    const newVertical: UseCaseVertical = {
      id: `vert-${Date.now()}`,
      title: 'New Industry Vertical',
      accentColor: '#DC2626',
      speedBadge: '< 45 SECONDS',
      clientConfidentialName: 'Confidential Client · City',
      bottleneckDescription: 'Operational bottleneck and lead conversion delay description.',
      capabilities: ['Automated intake workflow', 'Conversational AI dispatch', 'Real-time database sync', 'Executive dashboard'],
      simulatorScript: 'Autonomous agent simulation transcript',
    };
    setContent({
      ...content,
      useCases: {
        ...content.useCases,
        verticals: [...content.useCases.verticals, newVertical],
      },
    });
  };

  const removeVertical = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      useCases: {
        ...content.useCases,
        verticals: content.useCases.verticals.filter((v) => v.id !== id),
      },
    });
  };

  if (loading || !content) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 font-mono text-xs">
        Loading 60s Lead Engine CMS...
      </div>
    );
  }

  const { useCases } = content;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="60s Lead Engine &amp; Industry Blueprints"
        subtitle="Manage industry verticals, client case studies, and automated conversion scripts"
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
            <p className="text-xs text-zinc-400 font-mono">Overview headings for the 60-Second Lead Engine</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Eyebrow Tag</label>
              <input
                type="text"
                value={useCases.eyebrow}
                onChange={(e) =>
                  setContent({
                    ...content,
                    useCases: { ...useCases, eyebrow: e.target.value },
                  })
                }
                className="app-input text-red-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Primary Headline</label>
              <input
                type="text"
                value={useCases.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    useCases: { ...useCases, headline: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Subheadline</label>
            <input
              type="text"
              value={useCases.subheadline}
              onChange={(e) =>
                setContent({
                  ...content,
                  useCases: { ...useCases, subheadline: e.target.value },
                })
              }
              className="app-input"
            />
          </div>
        </div>

        {/* Industry Verticals List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Industry Verticals ({useCases.verticals.length})
              </h2>
              <p className="text-xs text-zinc-400 font-mono">Custom blueprints with SLA speeds &amp; confidentiality names</p>
            </div>
            <button
              onClick={addVertical}
              className="px-3.5 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/40 text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vertical</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {useCases.verticals.map((vert, index) => (
              <div key={vert.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-500 font-bold">0{index + 1}</span>
                    <h3 className="text-base font-bold text-white">{vert.title}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold">
                      {vert.speedBadge}
                    </span>
                    <button
                      onClick={() => removeVertical(vert.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 mb-1">Vertical Title</label>
                    <input
                      type="text"
                      value={vert.title}
                      onChange={(e) => updateVertical(vert.id, 'title', e.target.value)}
                      className="app-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 mb-1">Speed SLA Badge</label>
                    <input
                      type="text"
                      value={vert.speedBadge}
                      onChange={(e) => updateVertical(vert.id, 'speedBadge', e.target.value)}
                      className="app-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 mb-1">Confidential Client Alias</label>
                    <input
                      type="text"
                      value={vert.clientConfidentialName}
                      onChange={(e) => updateVertical(vert.id, 'clientConfidentialName', e.target.value)}
                      className="app-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">Bottleneck Description</label>
                  <textarea
                    rows={2}
                    value={vert.bottleneckDescription}
                    onChange={(e) => updateVertical(vert.id, 'bottleneckDescription', e.target.value)}
                    className="app-input resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 mb-1">Simulation Script Preview</label>
                  <input
                    type="text"
                    value={vert.simulatorScript || ''}
                    onChange={(e) => updateVertical(vert.id, 'simulatorScript', e.target.value)}
                    className="app-input text-xs"
                    placeholder="WhatsApp booking agent with automated deposit collection"
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
            <span>{saving ? 'Publishing Updates...' : 'Publish Blueprints Changes'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
