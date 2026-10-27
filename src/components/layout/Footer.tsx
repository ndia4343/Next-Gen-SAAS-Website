'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { Logo } from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { FooterData, ThemeBrandingConfig } from '@/lib/types';

interface FooterProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: FooterData;
  themeBranding?: ThemeBrandingConfig;
}

const defaultLinks = [
  { id: '1', label: 'Overview', href: '#hero' },
  { id: '2', label: '01 / Core Expertise', href: '#core-expertise' },
  { id: '3', label: '02 / Project Support', href: '#project-support' },
];

export default function Footer({ onOpenQuoteModal, content, themeBranding: initialBranding }: FooterProps) {
  const { lenis } = useSmoothScroll();
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
      setBranding((prev) => ({ ...initialBranding, ...(prev?.logoImageUrl ? { logoImageUrl: prev.logoImageUrl, logoMode: prev.logoMode } : {}) }));
    }
  }, [initialBranding]);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenQuote = (service: string = 'Discovery Call') => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal(service);
    }
  };

  const links = content?.links && content.links.length > 0 ? content.links : defaultLinks;

  return (
    <footer className="relative z-20 border-t border-white/10 dark:border-white/10 light:border-black/10 bg-[#060609]/80 dark:bg-[#060609]/80 light:bg-white/80 backdrop-blur-2xl py-16 px-6 lg:px-12 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        <div>
          <div className="mb-4">
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
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-400 light:text-zinc-600 max-w-md leading-relaxed font-normal">
            {content?.description ||
              'Architecting next-generation autonomous AI systems, GPU-accelerated 3D WebGL interfaces, and production-grade software ecosystems. Zero templates. Pure engineering.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider">
          <ThemeToggle />

          <button
            onClick={() => handleOpenQuote('Discovery Call')}
            className="px-5 py-2.5 rounded-full bg-[var(--theme-primary,#dc2626)] hover:brightness-110 text-white font-medium transition-all shadow-lg shadow-[var(--theme-glow,rgba(220,38,38,0.3))] hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{content?.ctaText || 'Start a Project'}</span>
          </button>

          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="text-zinc-400 hover:text-white dark:text-zinc-400 dark:hover:text-white light:text-zinc-600 light:hover:text-zinc-950 transition-colors"
            >
              {link.label}
            </a>
          ))}

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-white dark:hover:text-white light:hover:text-zinc-950 hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-mono cursor-pointer"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
            <span>TOP</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 dark:border-white/5 light:border-black/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-4">
        <div>
          {content?.copyright || '© 2026 ZAVIAN LABS. ALL RIGHTS RESERVED.'}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {content?.statusLabel || 'SYSTEMS OPERATIONAL'}
          </span>
          <span>{content?.latencyLabel || 'LATENCY: 24MS'}</span>
          <span>{content?.regionLabel || 'US-EAST / CLOUDFLARE EDGE'}</span>
        </div>
      </div>
    </footer>
  );
}
