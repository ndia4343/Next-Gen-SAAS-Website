'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { LeadSubmission } from '@/lib/types';
import { Download, Search, Mail, Phone, Building2, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const q = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.company && lead.company.toLowerCase().includes(q)) ||
      lead.selectedService.toLowerCase().includes(q) ||
      (lead.city && lead.city.toLowerCase().includes(q)) ||
      (lead.country && lead.country.toLowerCase().includes(q))
    );
  });

  const exportCsv = () => {
    if (!leads.length) return;

    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Service',
      'Scope',
      'Timeline',
      'Visits Before Inquiry',
      'City',
      'Region',
      'Country',
      'IP Address',
      'Submitted At',
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone || ''}"`,
      `"${l.company || ''}"`,
      `"${l.selectedService}"`,
      `"${(l.projectScope || '').replace(/"/g, '""')}"`,
      `"${l.timeline}"`,
      l.visitCountAtSubmission,
      `"${l.city || ''}"`,
      `"${l.region || ''}"`,
      `"${l.country || ''}"`,
      `"${l.ipAddress || ''}"`,
      `"${l.timestamp}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `zavian-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Identified Leads &amp; Contacts"
        subtitle="Inquiries stitched with visitor telemetry and session frequency"
        onRefresh={fetchLeads}
      />

      <main className="p-8 space-y-6 flex-1">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, company, service or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="app-input pl-10 text-xs"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCsv}
              disabled={!leads.length}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 border border-white/10 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV ({filteredLeads.length})</span>
            </button>
          </div>
        </div>

        {/* Leads Table Container */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Lead Profile</th>
                  <th className="py-4 px-6 font-semibold">Focus &amp; Scope</th>
                  <th className="py-4 px-6 font-semibold">Visitor Telemetry</th>
                  <th className="py-4 px-6 font-semibold">Location</th>
                  <th className="py-4 px-6 font-semibold text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500 font-mono">
                      Querying lead database...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500 font-mono">
                      {searchTerm ? 'No leads matching your search criteria.' : 'No inquiries captured yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Contact */}
                      <td className="py-4 px-6 space-y-1">
                        <div className="text-white font-bold text-sm tracking-tight">{lead.name}</div>
                        <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                          <Mail className="w-3 h-3 text-red-500 shrink-0" />
                          <a href={`mailto:${lead.email}`} className="hover:text-white transition-colors">
                            {lead.email}
                          </a>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                            <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        {lead.company && (
                          <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
                            <Building2 className="w-3 h-3 shrink-0" />
                            <span>{lead.company}</span>
                          </div>
                        )}
                      </td>

                      {/* Service & Scope */}
                      <td className="py-4 px-6 max-w-xs space-y-1.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                          {lead.selectedService}
                        </span>
                        <p className="text-zinc-300 text-xs line-clamp-2 leading-relaxed">
                          {lead.projectScope}
                        </p>
                        <div className="text-[10px] text-zinc-500">Timeline: {lead.timeline}</div>
                      </td>

                      {/* Stitched Telemetry */}
                      <td className="py-4 px-6 space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-600/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold">
                          <Sparkles className="w-3 h-3" />
                          <span>{lead.visitCountAtSubmission} visits prior</span>
                        </div>
                        {lead.ipAddress && (
                          <div className="text-[10px] text-zinc-500 font-mono">IP: {lead.ipAddress}</div>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6 space-y-0.5 text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{lead.city || 'Unknown City'}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 pl-5">
                          {lead.region}, {lead.country}
                        </div>
                      </td>

                      {/* Submitted At */}
                      <td className="py-4 px-6 text-right space-y-0.5">
                        <div className="text-zinc-200">
                          {new Date(lead.timestamp).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-zinc-500 text-[11px]">
                          {new Date(lead.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
