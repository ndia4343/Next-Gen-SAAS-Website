'use client';

import React, { useState, useEffect } from 'react';
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

  const defaultNavLinks = [
    { id: '1', label: 'Overview', href: '#hero', target: '_self' },
    { id: '2', label: 'Services', href: '#core-expertise', target: '_self' },
    { id: '3', label: 'Solutions', href: '#project-support', target: '_self' },
  ];

  const rawLinks = content?.navItems?.filter((i) => i.active !== false) || defaultNavLinks;
  const navLinks = rawLinks.map((item) => {
    if (item.href === '#core-expertise' || item.label === 'Core Expertise') {
      return { ...item, label: 'Services', href: '#core-expertise' };
    }
    if (item.href === '#project-support' || item.label === 'Project Support') {
      return { ...item, label: 'Solutions', href: '#project-support' };
    }
    return item;
  });

  return (
    <header className="contents">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl h-16 rounded-full px-5 sm:px-7 flex items-center justify-between bg-zinc-950/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <a href="#hero" className="flex items-center gap-2.5 group focus:outline-none">
          {/* Cube Icon */}
          <div className="w-7 h-7 flex items-center justify-center text-zinc-200 transition-transform duration-300 group-hover:scale-105 shrink-0">
            {(branding?.logoMode === 'image' || (branding?.logoMode !== 'svg' && branding?.logoImageUrl)) && branding?.logoImageUrl ? (
              <img
                src={branding.logoImageUrl}
                alt="Brand Logo"
                className="w-full h-full object-contain p-0.5"
              />
            ) : branding?.logoMode === 'svg' && branding?.logoSvgContent ? (
              <div
                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: branding.logoSvgContent }}
              />
            ) : (
              <img
                src="/images/zavian-cube-mark.png"
                alt="Brand Logo"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Clean Wordmark */}
          <div className="flex items-center gap-2 leading-none">
            <span className="font-black text-base tracking-wider text-zinc-100">
              {branding?.wordmark1 || 'ZAVIAN'}
            </span>
            <span className="font-light text-base tracking-widest text-[#A855F7]">
              {branding?.wordmark2 || 'LABS'}
            </span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.target || '_self'}
              className="text-zinc-300 hover:text-white transition-colors duration-200 font-medium text-xs tracking-wider uppercase"
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
