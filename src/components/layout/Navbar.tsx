'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Sparkles } from 'lucide-react';
import { HeaderData, ThemeBrandingConfig } from '@/lib/types';

interface NavbarProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: HeaderData;
  themeBranding?: ThemeBrandingConfig;
}

export default function Navbar({ onOpenQuoteModal, content, themeBranding: initialBranding }: NavbarProps) {
  const [branding, setBranding] = useState<ThemeBrandingConfig | undefined>(initialBranding);

  useEffect(() => {
    // 1. Sync from localStorage for instant client reflection
    try {
      const saved = localStorage.getItem('zavian_theme_branding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.logoImageUrl || parsed.logoMode)) {
          setBranding((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {}

    // 2. Listen to live branding updates from admin panel in same tab or across tabs
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeBrandingConfig>;
      if (customEvent.detail) {
        setBranding(customEvent.detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'zavian_theme_branding' && e.newValue) {
        try {
          setBranding(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('zavian_branding_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    // 3. Background fetch latest from server API
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.content?.themeBranding) {
          setBranding((prev) => ({ ...prev, ...data.content.themeBranding }));
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('zavian_branding_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (initialBranding) {
      setBranding((prev) => ({ ...initialBranding, ...(prev?.logoImageUrl ? { logoImageUrl: prev.logoImageUrl, logoMode: prev.logoMode } : {}) }));
    }
  }, [initialBranding]);

  const handleOpen = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal(content?.ctaActionId || 'Discovery Call');
    }
  };

  const navLinks = content?.navItems?.filter((i) => i.active !== false) || [
    { id: '1', label: 'Overview', href: '#hero', target: '_self' },
    { id: '2', label: 'Core Expertise', href: '#core-expertise', target: '_self' },
    { id: '3', label: 'Project Support', href: '#project-support', target: '_self' },
  ];

  return (
    <header className="fixed top-5 inset-x-0 z-40 max-w-7xl mx-auto px-6">
      <nav className="glass-panel rounded-full px-6 py-3.5 flex items-center justify-between shadow-2xl transition-colors duration-300">
        <Logo
          href="#hero"
          showTagline={true}
          wordmarkWhite={branding?.wordmark1 || content?.brandWordmark1}
          wordmarkCrimson={branding?.wordmark2 || content?.brandWordmark2}
          wordmark1Color={branding?.wordmark1Color}
          wordmark2Color={branding?.wordmark2Color}
          tagline={branding?.tagline || content?.tagline}
          logoMode={branding?.logoMode}
          logoImageUrl={branding?.logoImageUrl}
          logoSvgContent={branding?.logoSvgContent}
        />

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.target || '_self'}
              className="hover:text-white dark:hover:text-white light:hover:text-zinc-950 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={handleOpen}
            className="px-5 py-2.5 rounded-full bg-[var(--theme-primary,#dc2626)] hover:brightness-110 text-white font-medium text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-[var(--theme-glow,rgba(220,38,38,0.3))] hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content?.ctaText || 'Book Discovery'}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
