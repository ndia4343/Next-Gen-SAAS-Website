'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
}

export default function AdminHeader({ title, subtitle, onRefresh }: AdminHeaderProps) {
  const [revalidating, setRevalidating] = useState(false);
  const [revalidated, setRevalidated] = useState(false);

  const handleInstantRevalidate = async () => {
    setRevalidating(true);
    setRevalidated(false);
    try {
      if (onRefresh) {
        onRefresh();
      }
      setRevalidated(true);
      setTimeout(() => setRevalidated(false), 3000);
    } catch {
      // ignore
    } finally {
      setRevalidating(false);
    }
  };

  return (
    <header className="h-20 bg-[#060609]/90 backdrop-blur-xl border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span>{title}</span>
        </h1>
        {subtitle && <p className="text-xs text-zinc-400 font-mono mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {onRefresh && (
          <button
            onClick={handleInstantRevalidate}
            disabled={revalidating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
          >
            {revalidated ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Synced</span>
              </>
            ) : (
              <>
                <RefreshCw className={`w-3.5 h-3.5 ${revalidating ? 'animate-spin text-red-400' : 'text-zinc-400'}`} />
                <span>Refresh Data</span>
              </>
            )}
          </button>
        )}

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-mono font-medium tracking-wide transition-all shadow-md shadow-red-600/20"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Storefront</span>
        </Link>
      </div>
    </header>
  );
}
