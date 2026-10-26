'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ZavianLogo from '@/components/ui/ZavianLogo';
import {
  Palette,
  Compass,
  Layout,
  Cpu,
  Layers,
  FileText,
  BarChart3,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const ADMIN_MODULES = [
  {
    group: 'IDENTITY & DESIGN',
    items: [
      { label: 'Theme & Branding', href: '/admin/branding', icon: Palette },
    ],
  },
  {
    group: 'CONTENT MANAGEMENT',
    items: [
      { label: 'Header Navigation', href: '/admin/header', icon: Compass },
      { label: 'Overview', href: '/admin/overview', icon: Layout },
      { label: 'Core Expertise', href: '/admin/core-expertise', icon: Cpu },
      { label: 'Project Support', href: '/admin/project-support', icon: Layers },
      { label: 'Footer Navigation', href: '/admin/footer', icon: FileText },
    ],
  },
  {
    group: 'INTELLIGENCE SUITE',
    items: [
      { label: 'Analytics & Audit Logs', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <aside className="w-72 bg-[#060609] border-r border-white/10 flex flex-col shrink-0 min-h-screen">
      {/* Brand & Badge */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/branding" className="block mb-2">
          <ZavianLogo showTagline={true} />
        </Link>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/10 border border-red-500/20 text-[10px] font-mono text-red-400 font-semibold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          SUPER ADMIN CMS 2.0
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {ADMIN_MODULES.map((group) => (
          <div key={group.group}>
            <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">
              {group.group}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === '/admin/overview' && pathname === '/admin/hero');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                      isActive
                        ? 'bg-[var(--theme-primary,#dc2626)]/15 text-white border border-[var(--theme-primary,#dc2626)]/40 font-semibold shadow-lg'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--theme-title-accent,#ef4444)]' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Controls */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/5 transition-all border border-white/5"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            <span>Live Storefront</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">LIVE ↗</span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
