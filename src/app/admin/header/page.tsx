'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { WebsiteContent, HeaderNavItem } from '@/lib/types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Compass, Eye } from 'lucide-react';

export default function HeaderCmsPage() {
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
      setStatus({ type: 'success', message: 'Header navigation saved & storefront cache revalidated!' });
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Save error' });
    } finally {
      setSaving(false);
    }
  };

  const addNavItem = () => {
    if (!content) return;
    const newItem: HeaderNavItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      href: '#',
      target: '_self',
      active: true,
    };
    setContent({
      ...content,
      header: {
        ...content.header,
        navItems: [...content.header.navItems, newItem],
      },
    });
  };

  const removeNavItem = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      header: {
        ...content.header,
        navItems: content.header.navItems.filter((i) => i.id !== id),
      },
    });
  };

  const updateNavItem = (id: string, field: keyof HeaderNavItem, value: any) => {
    if (!content) return;
    setContent({
      ...content,
      header: {
        ...content.header,
        navItems: content.header.navItems.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    });
  };

  if (loading || !content) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 font-mono text-xs">
        Loading Header CMS...
      </div>
    );
  }

  const { header } = content;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Header Navigation"
        subtitle="Full CRUD control over navbar menu links, anchor routes, and header CTA button"
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

        {/* Brandmark Configuration Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Brand Identity &amp; Wordmark</h2>
              <p className="text-xs text-zinc-400 font-mono">Control brand rendering across the top navigation bar</p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400">
              STOREFRONT BRAND
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Primary Wordmark (White)</label>
              <input
                type="text"
                value={header.brandWordmark1}
                onChange={(e) =>
                  setContent({
                    ...content,
                    header: { ...header, brandWordmark1: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Accent Wordmark (Crimson)</label>
              <input
                type="text"
                value={header.brandWordmark2}
                onChange={(e) =>
                  setContent({
                    ...content,
                    header: { ...header, brandWordmark2: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Sub-Tagline</label>
              <input
                type="text"
                value={header.tagline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    header: { ...header, tagline: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-mono text-zinc-400 mb-1">Header Action Button Label</label>
            <input
              type="text"
              value={header.ctaText}
              onChange={(e) =>
                setContent({
                  ...content,
                  header: { ...header, ctaText: e.target.value },
                })
              }
              className="app-input"
            />
          </div>
        </div>

        {/* Navigation Items CRUD */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Navigation Links (Menu Items)</h2>
              <p className="text-xs text-zinc-400 font-mono">Add, edit, toggle visibility, or delete navigation links</p>
            </div>
            <button
              onClick={addNavItem}
              className="px-3.5 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/40 text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-3">
            {header.navItems.map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <div className="text-xs font-mono text-zinc-500 w-6">0{index + 1}</div>

                <div className="flex-1">
                  <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">Label</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateNavItem(item.id, 'label', e.target.value)}
                    className="app-input text-xs py-1.5"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">Target Anchor / URL</label>
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => updateNavItem(item.id, 'href', e.target.value)}
                    className="app-input text-xs py-1.5"
                  />
                </div>

                <div className="w-28">
                  <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">Target</label>
                  <select
                    value={item.target}
                    onChange={(e) => updateNavItem(item.id, 'target', e.target.value as '_self' | '_blank')}
                    className="app-input text-xs py-1.5"
                  >
                    <option value="_self">_self (Same)</option>
                    <option value="_blank">_blank (New Tab)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4 sm:pt-0">
                  <button
                    onClick={() => updateNavItem(item.id, 'active', !item.active)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-colors cursor-pointer ${
                      item.active
                        ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                    }`}
                  >
                    {item.active ? 'Active' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => removeNavItem(item.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
            <span>{saving ? 'Publishing Updates...' : 'Publish Header Changes'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
