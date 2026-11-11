'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { HeaderData, ThemeBrandingConfig } from '@/lib/types';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { WHATSAPP_NUMBER } from '@/lib/default-config';

interface NavbarProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: HeaderData;
  themeBranding?: ThemeBrandingConfig;
}

const NAV_LINKS = [
  { id: 'demo', label: 'Demo', href: '#voice-simulation' },
  { id: 'how-it-works', label: 'How it works', href: '#how-it-works' },
  { id: 'dashboard', label: 'Dashboard', href: '#command-center' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
];

export default function Navbar({ themeBranding: initialBranding }: NavbarProps) {
  const { config } = useSiteConfig();
  const [branding, setBranding] = useState<ThemeBrandingConfig | undefined>(initialBranding);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileOpen(false);
      const targetId = href.slice(1);
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  const iconSize = Math.max(24, Math.min(64, config.branding.logoIconSize || 36));
  const logoSrc =
    config.branding.logoImageUrl ||
    (branding?.logoImageUrl ? branding.logoImageUrl : '/images/zavian-cube-mark.png');
  const bookingUrl =
    config.branding.calendarBookingUrl || 'https://calendar.app.google/u5vL88X41qmGBCky5';
  const wordmark1 = config.branding.logoTextPrimary || branding?.wordmark1 || 'ZAVIAN';
  const wordmark2 = config.branding.logoTextSecondary || branding?.wordmark2 || 'LABS';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-4 pt-4 sm:pt-5 pointer-events-none">
      <nav
        aria-label="Primary"
        className="pointer-events-auto w-full max-w-[1140px] mx-auto rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 bg-[#0c0e13]/85 backdrop-blur-xl border border-white/15 shadow-[0_14px_45px_rgba(7,8,11,0.38)] transition-all duration-300"
      >
        {/* Brand Lockup */}
        <a
          href="#hero"
          onClick={(e) => handleScroll(e, '#hero')}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer shrink-0"
        >
          <div
            className="relative rounded-xl p-[1.5px] shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-[0_0_20px_rgba(94,227,255,0.22)]"
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              background:
                'linear-gradient(135deg, rgba(242,244,248,0.75) 0%, rgba(138,146,162,0.45) 45%, rgba(94,227,255,0.55) 100%)',
            }}
          >
            <div className="w-full h-full rounded-[10px] bg-[#07080b] p-1 flex items-center justify-center overflow-hidden shadow-inner">
              {branding?.logoMode === 'svg' && branding?.logoSvgContent ? (
                <div
                  className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full text-white"
                  dangerouslySetInnerHTML={{ __html: branding.logoSvgContent }}
                />
              ) : (
                <img
                  src={logoSrc}
                  alt={config.branding.companyName || 'Brand Logo'}
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18))' }}
                  className="w-full h-full object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
                />
              )}
            </div>
          </div>

          <div className="flex items-center text-sm sm:text-[15px] leading-none uppercase tracking-widest">
            <span className="font-bold text-[#eceef2]">{wordmark1}</span>
            <span className="font-normal text-[#b4a0ff] ml-1.5">{wordmark2}</span>
          </div>
        </a>

        {/* Navigation Pills */}
        <div className="hidden lg:flex items-center gap-1.5">
          {NAV_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="px-3.5 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.08em] text-[#a0a7b3] hover:text-[#eceef2] hover:bg-white/[0.06] transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {WHATSAPP_NUMBER && (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="zl-btn hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] text-[#eceef2] font-semibold text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Chat on WhatsApp</span>
            </a>
          )}

          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="zl-btn hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#eceef2] hover:bg-white text-[#07080b] font-semibold text-xs tracking-wide transition-all cursor-pointer whitespace-nowrap shadow-[0_4px_18px_rgba(236,238,242,0.18)]"
          >
            <span>Book a free audit</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden w-10 h-10 rounded-full bg-white/[0.07] border border-white/15 text-[#eceef2] flex items-center justify-center hover:bg-white/12 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Pill Panel */}
      {mobileOpen && (
        <div className="pointer-events-auto lg:hidden mt-2 w-full max-w-[420px] rounded-3xl bg-[#0c0e13]/95 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-4 flex flex-col gap-1.5">
          {NAV_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="px-4 py-3 rounded-2xl font-mono text-xs uppercase tracking-widest text-[#d0d5df] hover:text-white hover:bg-white/[0.07] transition-colors"
            >
              {item.label}
            </a>
          ))}
          {WHATSAPP_NUMBER && (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="mt-1 px-4 py-3 rounded-2xl border border-white/15 bg-white/[0.06] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Chat on WhatsApp</span>
            </a>
          )}
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-4 py-3 rounded-2xl bg-[#eceef2] text-[#07080b] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <span>Book a free audit</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </header>
  );
}
