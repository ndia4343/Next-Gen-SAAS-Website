'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedService: string;
}

export default function QuoteModal({ isOpen, onClose, preselectedService }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    selectedService: preselectedService,
    projectScope: '',
    timeline: 'Within 30 Days',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, selectedService: preselectedService }));
    }
  }, [preselectedService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const vid = typeof window !== 'undefined' ? localStorage.getItem('zavian_vid') : undefined;
      const payload = {
        ...formData,
        visitorId: vid || undefined,
      };

      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Submission failed');
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting scope');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl p-8 border border-white/15 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white cursor-pointer"
          aria-label="Close quote modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Scope Dispatched</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Our engineering solutions team is assessing your requirements and telemetry.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="text-xs font-mono text-red-500 font-bold uppercase tracking-[0.2em] mb-1">
                ZAVIAN LABS ONBOARDING
              </div>
              <h3 className="text-2xl font-bold text-white">Project Scope &amp; Quote</h3>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Syed Bilal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="app-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Corporate Email *</label>
                <input
                  required
                  type="email"
                  placeholder="bilal@enterprise.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Company / Firm</label>
                <input
                  type="text"
                  placeholder="Acme Global Inc."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="app-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Selected Focus</label>
              <input
                type="text"
                value={formData.selectedService}
                onChange={(e) => setFormData({ ...formData, selectedService: e.target.value })}
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Architecture &amp; Deliverables *</label>
              <textarea
                required
                rows={3}
                placeholder="Timeline, tech stack constraints, user volume..."
                value={formData.projectScope}
                onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                className="app-input resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-sm tracking-wide transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting Scope...' : 'Request Project Quote'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
