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
        <a
          href="#hero"
          aria-label="ZAVIAN LABS Home"
          className="group flex flex-row flex-nowrap items-center gap-2.5 sm:gap-3.5 pointer-events-auto select-none focus:outline-none"
        >
          {/* Existing 3D Isometric Interlocking Cube Icon */}
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105 group-hover:rotate-[-2deg]">
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
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="navCubeDark" x1="10%" y1="0%" x2="90%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#64748B" />
                  </linearGradient>
                  <linearGradient id="navCubeFacet" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                <g
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-[url(#navCubeDark)] drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
                >
                  <path d="M35 15 L12 30 L12 66 L35 81" />
                  <path d="M65 85 L88 70 L88 34 L65 19" />
                  <path d="M35 15 L50 25 L65 19" />
                  <path d="M12 30 L35 45 L50 35 L35 15" />
                  <path d="M50 25 L65 35" />
                  <path d="M35 45 L35 81" />
                  <path d="M65 19 L65 55" />
                  <path d="M35 45 L50 55 L65 45 L88 34" />
                  <path d="M50 55 L50 75 L35 81" />
                  <path d="M50 75 L65 85" />
                  <path d="M50 55 L65 65 L88 70" />
                </g>

                <polygon points="35,15 50,25 35,45 12,30" fill="url(#navCubeFacet)" />
                <polygon points="65,19 88,34 65,45 50,25" fill="url(#navCubeFacet)" />
              </svg>
            )}
          </div>

          {/* Brand Wordmark & Subtitle */}
          <div className="flex flex-col text-left justify-center leading-none">
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-wider text-zinc-100">
                {branding?.wordmark1 || 'ZAVIAN'}
              </span>
              <span className="font-light text-base tracking-widest text-[#A855F7]">
                {branding?.wordmark2 || 'LABS'}
              </span>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-400 mt-1 select-none">
              {branding?.tagline || 'AI Automation & Software Studio'}
            </span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.target || '_self'}
              className="hover:text-white transition-colors"
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
