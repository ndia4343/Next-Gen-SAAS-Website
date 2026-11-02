'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { WebsiteContent, FooterLink } from '@/lib/types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function FooterCmsPage() {
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
      setStatus({ type: 'success', message: 'Footer & legal metadata saved & live site revalidated!' });
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Save error' });
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    if (!content) return;
    const newLink: FooterLink = {
      id: `foot-${Date.now()}`,
      label: 'New Link',
      href: '#',
    };
    setContent({
      ...content,
      footer: {
        ...content.footer,
        links: [...content.footer.links, newLink],
      },
    });
  };

  const removeLink = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      footer: {
        ...content.footer,
        links: content.footer.links.filter((l) => l.id !== id),
      },
    });
  };

  const updateLink = (id: string, field: keyof FooterLink, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      footer: {
        ...content.footer,
        links: content.footer.links.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
      },
    });
  };

  if (loading || !content) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 font-mono text-xs">
        Loading Footer CMS...
      </div>
    );
  }

  const { footer } = content;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Footer Navigation"
        subtitle="Manage footer navigation links, system status indicators, and legal notices"
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

        {/* Footer Brand Info */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="pb-4 border-b border-white/5">
            <h2 className="text-base font-bold text-white tracking-tight">Footer Brand &amp; Statement</h2>
            <p className="text-xs text-zinc-400 font-mono">Mission copy and call to action</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Brand Wordmark 1</label>
              <input
                type="text"
                value={footer.brandWordmark1}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...footer, brandWordmark1: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Brand Wordmark 2</label>
              <input
                type="text"
                value={footer.brandWordmark2}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...footer, brandWordmark2: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">CTA Button Text</label>
              <input
                type="text"
                value={footer.ctaText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...footer, ctaText: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Mission Paragraph</label>
            <textarea
              rows={3}
              value={footer.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  footer: { ...footer, description: e.target.value },
                })
              }
              className="app-input resize-none"
            />
          </div>
        </div>

        {/* Footer Navigation Links CRUD */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Footer Links ({footer.links.length})
              </h2>
              <p className="text-xs text-zinc-400 font-mono">Anchors and external resource links</p>
            </div>
            <button
              onClick={addLink}
              className="px-3.5 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/40 text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {footer.links.map((link) => (
              <div
                key={link.id}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                    className="app-input text-xs py-1.5"
                    placeholder="Link Label"
                  />
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updateLink(link.id, 'href', e.target.value)}
                    className="app-input text-xs py-1.5"
                    placeholder="Target URL / #anchor"
                  />
                </div>

                <button
                  onClick={() => removeLink(link.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Status & Copyright Bar */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="pb-4 border-b border-white/5">
            <h2 className="text-base font-bold text-white tracking-tight">System Telemetry &amp; Legal Notices</h2>
            <p className="text-xs text-zinc-400 font-mono">Live status badges and legal copyright line</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Operational Status Text</label>
              <input
                type="text"
                value={footer.statusLabel}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...footer, statusLabel: e.target.value },
                  })
                }
                className="app-input text-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Latency Label</label>
              <input
                type="text"
                value={footer.latencyLabel}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...footer, latencyLabel: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Region Label</label>
              <input
                type="text"
                value={footer.regionLabel}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { ...footer, regionLabel: e.target.value },
                  })
                }
                className="app-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Copyright Notice</label>
            <input
              type="text"
              value={footer.copyright}
              onChange={(e) =>
                setContent({
                  ...content,
                  footer: { ...footer, copyright: e.target.value },
                })
              }
              className="app-input"
            />
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
            <span>{saving ? 'Publishing Updates...' : 'Publish Footer Changes'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
