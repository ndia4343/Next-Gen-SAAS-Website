'use client';

import React, { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Sparkles } from 'lucide-react';
import { HeaderData, ThemeBrandingConfig } from '@/lib/types';

const BOOKING_URL = 'https://calendar.app.google/u5vL88X41qmGBCky5';

interface NavbarProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: HeaderData;
  themeBranding?: ThemeBrandingConfig;
}

export default function Navbar({ onOpenQuoteModal, content, themeBranding: initialBranding }: NavbarProps) {
  const [branding, setBranding] = useState<ThemeBrandingConfig | undefined>(initialBranding);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zavian_theme_branding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.logoImageUrl || parsed.logoMode)) {
          setBranding((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {}

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
      setBranding((prev) => ({
        ...initialBranding,
        ...(prev?.logoImageUrl ? { logoImageUrl: prev.logoImageUrl, logoMode: prev.logoMode } : {}),
      }));
    }
  }, [initialBranding]);

  const navLinks = [
    { id: '1', label: 'Overview', href: '#hero' },
    { id: '2', label: 'How It Works', href: '#how-it-works' },
    { id: '3', label: 'Industries', href: '#industries' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.slice(1);
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-5 pointer-events-none transition-all duration-300">
      <nav className="pointer-events-auto w-full max-w-5xl mx-auto h-16 rounded-full px-5 sm:px-7 flex items-center justify-between bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-colors duration-300">
        
        {/* Brand Mark Link */}
        <a 
          href="#hero" 
          onClick={(e) => handleScroll(e, '#hero')}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer"
        >
          {/* Logo Container */}
          <div className="h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0">
            {(branding?.logoMode === 'image' || (branding?.logoMode !== 'svg' && branding?.logoImageUrl)) && branding?.logoImageUrl ? (
              <img
                src={branding.logoImageUrl}
                alt="Brand Logo"
                className="h-8 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
              />
            ) : branding?.logoMode === 'svg' && branding?.logoSvgContent ? (
              <div
                className="h-8 w-auto flex items-center justify-center [&>svg]:h-8 [&>svg]:w-auto text-white"
                dangerouslySetInnerHTML={{ __html: branding.logoSvgContent }}
              />
            ) : (
              <img
                src="/images/zavian-cube-mark.png"
                alt="Brand Logo"
                className="h-8 w-auto object-contain rounded-lg bg-slate-900 dark:bg-white/[0.08] p-0.5 border border-slate-800 dark:border-white/10 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
              />
            )}
          </div>

          {/* Wordmark */}
          <div className="flex items-center tracking-tight text-[15px] leading-none">
            <span className="font-black text-slate-900 dark:text-white transition-colors">
              {branding?.wordmark1 || 'ZAVIAN'}
            </span>
            <span className="font-light tracking-widest text-[#9333EA] dark:text-[#A855F7] ml-1.5 transition-colors">
              {branding?.wordmark2 || 'LABS'}
            </span>
          </div>
        </a>

        {/* Minimal Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="text-slate-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 font-medium text-xs tracking-wider uppercase cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={content?.ctaLink || BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 hover:opacity-95 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all duration-300 shadow-[0_2px_12px_rgba(147,51,234,0.25)] hover:shadow-[0_4px_18px_rgba(147,51,234,0.35)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-100" />
            <span>{content?.ctaText || 'BOOK DISCOVERY CALL'}</span>
          </a>
        </div>

      </nav>
    </header>
  );
}