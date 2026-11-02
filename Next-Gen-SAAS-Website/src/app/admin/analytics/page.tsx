'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  Users,
  Eye,
  Activity,
  Globe2,
  FileSpreadsheet,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  RefreshCw,
  Clock,
  Shield,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { LeadSubmission, AdminAuditLog } from '@/lib/types';

interface AnalyticsData {
  metrics: {
    totalVisits: number;
    uniqueVisitors: number;
    avgVisitCount: string;
    totalLeads: number;
    activeRegionsCount: number;
  };
  geoHeatmap: Array<{
    city: string;
    region: string;
    country: string;
    count: number;
    lastSeen: string;
  }>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  recentVisitors: Array<{
    visitorId: string;
    ipAddress: string;
    city: string;
    region: string;
    country: string;
    visitCount: number;
    lastVisitedAt: string;
    deviceType: string;
    browser: string;
    currentPage: string;
  }>;
}

type TabType = 'traffic' | 'leads' | 'audit';

export default function AnalyticsAndAuditPage() {
  const [activeTab, setActiveTab] = useState<TabType>('traffic');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLead, setSearchLead] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [resAnalytics, resLeads, resAudit] = await Promise.all([
        fetch('/api/analytics/overview'),
        fetch('/api/admin/leads'),
        fetch('/api/admin/audit'),
      ]);

      if (resAnalytics.ok) {
        setAnalyticsData(await resAnalytics.json());
      }
      if (resLeads.ok) {
        const leadJson = await resLeads.json();
        setLeads(leadJson.leads || []);
      }
      if (resAudit.ok) {
        const auditJson = await resAudit.json();
        setAuditLogs(auditJson.logs || []);
      }
    } catch (err) {
      console.error('Failed to load telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const downloadLeadsCSV = () => {
    if (!leads.length) return;
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Company',
      'Service',
      'Scope',
      'Timeline',
      'City',
      'Country',
      'Visit Count',
      'Timestamp',
    ];
    const rows = leads.map((l) => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${l.selectedService.replace(/"/g, '""')}"`,
      `"${l.projectScope.replace(/"/g, '""')}"`,
      `"${l.timeline || ''}"`,
      `"${l.city || ''}"`,
      `"${l.country || ''}"`,
      l.visitCountAtSubmission || 1,
      `"${l.timestamp}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `zavian_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((l) => {
    const q = searchLead.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.company && l.company.toLowerCase().includes(q)) ||
      l.selectedService.toLowerCase().includes(q) ||
      (l.city && l.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Analytics &amp; Audit Logs"
        subtitle="Real-time visitor telemetry, identified lead intelligence, and security audit logs"
        onRefresh={fetchAll}
      />

      <main className="p-8 space-y-8 flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'traffic', label: 'Traffic Intelligence', icon: Activity },
            { id: 'leads', label: `Identified Leads (${leads.length})`, icon: Users },
            { id: 'audit', label: `Admin Audit Logs (${auditLogs.length})`, icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isTabActive
                    ? 'bg-red-600/15 border border-red-500/40 text-white shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isTabActive ? 'text-red-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: TRAFFIC INTELLIGENCE */}
        {activeTab === 'traffic' && (
          <div className="space-y-8">
            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Total Visits
                  </span>
                  <div className="p-2 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {loading ? '...' : analyticsData?.metrics.totalVisits.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">Aggregated session volume</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Unique Visitors
                  </span>
                  <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {loading ? '...' : analyticsData?.metrics.uniqueVisitors.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">Deduplicated client devices</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Avg Frequency
                  </span>
                  <div className="p-2 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {loading ? '...' : `${analyticsData?.metrics.avgVisitCount}x`}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">Sessions per identified device</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Identified Leads
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {loading ? '...' : leads.length}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">Converted high-intent inquiries</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Global Regions
                  </span>
                  <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400">
                    <Globe2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white tracking-tight">
                  {loading ? '...' : analyticsData?.metrics.activeRegionsCount}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">Resolved IP geographic nodes</div>
              </div>
            </div>

            {/* Middle Section: Heatmap & Devices */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Geolocation Table */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">Geographic Origin Heatmap</h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      Visitor volume distributed by city, region, and nation
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">EDGE RESOLVED</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/10 text-zinc-500 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">City / Region</th>
                        <th className="pb-3 font-semibold">Country</th>
                        <th className="pb-3 font-semibold text-right">Visits</th>
                        <th className="pb-3 font-semibold text-right">Latest Touch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-zinc-500">
                            Loading telemetry...
                          </td>
                        </tr>
                      ) : !analyticsData?.geoHeatmap.length ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-zinc-500">
                            No geographic data recorded yet.
                          </td>
                        </tr>
                      ) : (
                        analyticsData.geoHeatmap.map((item, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 flex items-center gap-2 text-zinc-200">
                              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <span>
                                {item.city}, {item.region}
                              </span>
                            </td>
                            <td className="py-3 text-zinc-400">{item.country}</td>
                            <td className="py-3 text-right text-white font-bold">{item.count}</td>
                            <td className="py-3 text-right text-zinc-500 text-[11px]">
                              {new Date(item.lastSeen).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Device & Browser Breakdowns */}
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/10">
                  <h3 className="text-base font-bold text-white tracking-tight mb-4">Device Architecture</h3>
                  <div className="space-y-3">
                    {['Desktop', 'Mobile', 'Tablet'].map((device) => {
                      const count = analyticsData?.deviceBreakdown[device] || 0;
                      const total = analyticsData?.metrics.uniqueVisitors || 1;
                      const percent = Math.round((count / total) * 100);
                      const Icon = device === 'Desktop' ? Monitor : device === 'Mobile' ? Smartphone : Tablet;

                      return (
                        <div key={device} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="flex items-center gap-2 text-zinc-300">
                              <Icon className="w-3.5 h-3.5 text-zinc-500" />
                              <span>{device}</span>
                            </span>
                            <span className="text-zinc-400">
                              {count} ({percent}%)
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/10">
                  <h3 className="text-base font-bold text-white tracking-tight mb-4">Client Browsers</h3>
                  <div className="space-y-2">
                    {analyticsData &&
                      Object.entries(analyticsData.browserBreakdown).map(([browser, count]) => {
                        const total = analyticsData.metrics.uniqueVisitors || 1;
                        const percent = Math.round((count / total) * 100);
                        return (
                          <div
                            key={browser}
                            className="flex items-center justify-between text-xs font-mono p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
                          >
                            <span className="text-zinc-300">{browser}</span>
                            <span className="text-zinc-400 font-bold">
                              {count} ({percent}%)
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Visitor Sessions Feed */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Recent Visitor Sessions</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Anonymous device sessions with frequency tracking
                  </p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">UPDATED REAL-TIME</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-500 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Visitor Token</th>
                      <th className="pb-3 font-semibold">Location</th>
                      <th className="pb-3 font-semibold">Device / Browser</th>
                      <th className="pb-3 font-semibold text-center">Visit Count</th>
                      <th className="pb-3 font-semibold text-right">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-zinc-500">
                          Loading sessions...
                        </td>
                      </tr>
                    ) : !analyticsData?.recentVisitors.length ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-zinc-500">
                          No active sessions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      analyticsData.recentVisitors.map((v) => (
                        <tr key={v.visitorId} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 text-red-400 font-mono">{v.visitorId.slice(0, 16)}...</td>
                          <td className="py-3 text-zinc-300">
                            {v.city}, {v.country}
                          </td>
                          <td className="py-3 text-zinc-400">
                            {v.deviceType} · {v.browser}
                          </td>
                          <td className="py-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 font-bold">
                              {v.visitCount} visits
                            </span>
                          </td>
                          <td className="py-3 text-right text-zinc-500">
                            {new Date(v.lastVisitedAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IDENTIFIED LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="Search leads by name, email, company, service..."
                  value={searchLead}
                  onChange={(e) => setSearchLead(e.target.value)}
                  className="app-input pl-10"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={downloadLeadsCSV}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs flex items-center gap-2 cursor-pointer transition-all shrink-0"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export CSV ({filteredLeads.length})</span>
              </button>
            </div>

            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-500 uppercase tracking-wider">
                      <th className="p-4 font-semibold">Lead Contact</th>
                      <th className="p-4 font-semibold">Company / Service</th>
                      <th className="p-4 font-semibold">Scope &amp; Timeline</th>
                      <th className="p-4 font-semibold">Location / IP</th>
                      <th className="p-4 font-semibold text-center">Visits</th>
                      <th className="p-4 font-semibold text-right">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500">
                          Loading identified leads...
                        </td>
                      </tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500">
                          No leads matching search query.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-white text-sm">{lead.name}</div>
                            <div className="text-zinc-400 text-[11px]">{lead.email}</div>
                            {lead.phone && <div className="text-red-400 text-[10px]">{lead.phone}</div>}
                          </td>
                          <td className="p-4">
                            <div className="text-zinc-200 font-semibold">{lead.company || 'Direct Founder'}</div>
                            <span className="inline-block px-2 py-0.5 rounded bg-red-600/10 text-red-400 border border-red-500/20 text-[10px] mt-1">
                              {lead.selectedService}
                            </span>
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="text-zinc-300 text-[11px] line-clamp-2">{lead.projectScope}</p>
                            <span className="text-[10px] text-zinc-500 font-mono">Timeline: {lead.timeline}</span>
                          </td>
                          <td className="p-4">
                            <div className="text-zinc-300">
                              {lead.city || 'Edge Node'}, {lead.country || 'Global'}
                            </div>
                            <div className="text-[10px] text-zinc-500">{lead.ipAddress}</div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                              {lead.visitCountAtSubmission || 1} touches
                            </span>
                          </td>
                          <td className="p-4 text-right text-zinc-500 text-[11px]">
                            {new Date(lead.timestamp).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Security Access Trail</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Immutable logs of every Super Admin authentication attempt with exact timestamp and IP resolution
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">AUDIT ACTIVE</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-500 uppercase tracking-wider">
                      <th className="p-4 font-semibold">Timestamp</th>
                      <th className="p-4 font-semibold">Administrator</th>
                      <th className="p-4 font-semibold">Location (IP Geolocation)</th>
                      <th className="p-4 font-semibold">Client IP</th>
                      <th className="p-4 font-semibold text-right">Auth Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          Loading audit trail...
                        </td>
                      </tr>
                    ) : auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          No audit records found.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => {
                        const isSuccess = log.status === 'SUCCESS';
                        return (
                          <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              <div className="text-white font-bold">{log.loginFormatted}</div>
                              <div className="text-[10px] text-zinc-500">{log.loginAt}</div>
                            </td>
                            <td className="p-4">
                              <div className="text-zinc-200">{log.adminName}</div>
                              <div className="text-zinc-500 text-[11px]">{log.adminEmail}</div>
                            </td>
                            <td className="p-4">
                              <div className="text-zinc-300 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                <span>{log.city}, {log.region}</span>
                              </div>
                              <div className="text-[10px] text-zinc-500">{log.country}</div>
                            </td>
                            <td className="p-4 text-zinc-400">{log.ipAddress}</td>
                            <td className="p-4 text-right">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  isSuccess
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                }`}
                              >
                                {isSuccess ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                  <AlertCircle className="w-3 h-3" />
                                )}
                                <span>{log.status}</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
