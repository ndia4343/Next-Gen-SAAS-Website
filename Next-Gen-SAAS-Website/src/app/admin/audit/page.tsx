'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { AdminAuditLog } from '@/lib/types';
import { ShieldAlert, ShieldCheck, MapPin, Monitor, Clock, User, Phone, Mail } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Admin Login Audit Logs"
        subtitle="Immutable security logs capturing credentials, IP geolocation, and timestamp on every attempt"
        onRefresh={fetchLogs}
      />

      <main className="p-8 space-y-6 flex-1">
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Admin Identity</th>
                  <th className="py-4 px-6 font-semibold">Resolved Location</th>
                  <th className="py-4 px-6 font-semibold">Network &amp; Client</th>
                  <th className="py-4 px-6 font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500 font-mono">
                      Retrieving security audit logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500 font-mono">
                      No security audit records logged.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isSuccess = log.status === 'SUCCESS';
                    return (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                              isSuccess
                                ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-400'
                                : 'bg-red-600/10 border border-red-500/30 text-red-400'
                            }`}
                          >
                            {isSuccess ? (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>AUTHENTICATED</span>
                              </>
                            ) : (
                              <>
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>FAILED ATTEMPT</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Admin Identity */}
                        <td className="py-4 px-6 space-y-1">
                          <div className="text-white font-bold">{log.adminName}</div>
                          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                            <Mail className="w-3 h-3 text-red-500" />
                            <span>{log.adminEmail}</span>
                          </div>
                          {log.adminPhone && log.adminPhone !== 'N/A' && (
                            <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                              <Phone className="w-3 h-3" />
                              <span>{log.adminPhone}</span>
                            </div>
                          )}
                        </td>

                        {/* Location */}
                        <td className="py-4 px-6 space-y-0.5 text-zinc-300">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span className="font-semibold">{log.city}</span>
                          </div>
                          <div className="text-[11px] text-zinc-500 pl-5">
                            {log.region}, {log.country}
                          </div>
                        </td>

                        {/* Network & IP */}
                        <td className="py-4 px-6 space-y-1 text-zinc-400 text-[11px]">
                          <div className="text-zinc-200 font-mono font-bold">IP: {log.ipAddress}</div>
                          {log.userAgent && (
                            <div className="text-[10px] text-zinc-500 truncate max-w-xs" title={log.userAgent}>
                              {log.userAgent}
                            </div>
                          )}
                        </td>

                        {/* Timestamp */}
                        <td className="py-4 px-6 text-right space-y-0.5">
                          <div className="text-zinc-200">{log.loginFormatted}</div>
                          <div className="text-zinc-500 text-[10px] font-mono">
                            {new Date(log.loginAt).toISOString()}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
