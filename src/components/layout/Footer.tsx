'use client';

import React, { useState, useEffect } from 'react';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { FooterData, ThemeBrandingConfig } from '@/lib/types';

interface FooterProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: FooterData;
  themeBranding?: ThemeBrandingConfig;
}

const BOOKING_URL = 'https://calendar.app.google/u5vL88X41qmGBCky5';

export default function Footer({ onOpenQuoteModal, themeBranding: initialBranding }: FooterProps = {}) {
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

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(`#${targetId}`);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative z-20 bg-[#F8FAFC] dark:bg-[#07070A] border-t border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-zinc-400 pt-12 pb-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10">
          
          {/* Left Column (Brand Anchor) */}
          <div className="lg:col-span-5 space-y-4">
            <a 
              href="#hero" 
              onClick={(e) => handleNavScroll(e, 'hero')} 
              className="inline-flex items-center gap-2.5 group focus:outline-none"
            >
              {/* Cube Icon */}
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-zinc-200 transition-transform duration-300 group-hover:scale-105 shrink-0">
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
              <div className="flex items-center text-base tracking-wider leading-none">
                <span className="font-extrabold text-slate-950 dark:text-white transition-colors">{branding?.wordmark1 || 'ZAVIAN'}</span>
                <span className="font-bold text-[#9333EA] dark:text-[#A855F7] ml-1.5 transition-colors">{branding?.wordmark2 || 'LABS'}</span>
              </div>
            </a>

            {/* High-Contrast Visible Headline */}
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-2 leading-snug transition-colors">
              Zero missed inquiries.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-500 to-[#38BDF8]">
                Zero human delay.
              </span>
            </h3>

            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed max-w-sm transition-colors">
              Intelligent voice agents, WhatsApp booking systems, and custom software that capture and track every opportunity around the clock.
            </p>

            {/* Email Contact Pill */}
            <div className="pt-1">
              <a
                href="mailto:contact@zavianlabs.com"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-white hover:border-purple-300 dark:hover:border-white/30 shadow-xs transition-all text-xs font-mono group"
              >
                <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="font-medium">contact@zavianlabs.com</span>
                <span className="text-slate-400 group-hover:text-purple-600 dark:group-hover:text-white transition-colors">↗</span>
              </a>
            </div>
          </div>

          {/* Systems Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-slate-900 dark:text-zinc-300 font-bold">Systems</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => {
                    if (onOpenQuoteModal) {
                      e.preventDefault();
                      onOpenQuoteModal('voice_receptionist');
                    } else {
                      handleNavScroll(e, 'how-it-works');
                    }
                  }}
                  className="text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                >
                  AI Voice Receptionist
                </a>
              </li>
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => {
                    if (onOpenQuoteModal) {
                      e.preventDefault();
                      onOpenQuoteModal('whatsapp_funnel');
                    } else {
                      handleNavScroll(e, 'how-it-works');
                    }
                  }}
                  className="text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                >
                  WhatsApp Booking Concierge
                </a>
              </li>
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => {
                    if (onOpenQuoteModal) {
                      e.preventDefault();
                      onOpenQuoteModal('profit_dashboard');
                    } else {
                      handleNavScroll(e, 'how-it-works');
                    }
                  }}
                  className="text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                >
                  Live Revenue Dashboards
                </a>
              </li>
              <li>
                <a 
                  href="#core-expertise" 
                  onClick={(e) => {
                    if (onOpenQuoteModal) {
                      e.preventDefault();
                      onOpenQuoteModal('estimation_engine');
                    } else {
                      handleNavScroll(e, 'core-expertise');
                    }
                  }}
                  className="text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                >
                  SolarPro Calculation Engine
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-slate-900 dark:text-zinc-300 font-bold">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="#hero" 
                  onClick={(e) => handleNavScroll(e, 'hero')}
                  className="text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                >
                  Overview
                </a>
              </li>
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => handleNavScroll(e, 'how-it-works')}
                  className="text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#core-expertise" 
                  onClick={(e) => handleNavScroll(e, 'core-expertise')}
                  className="text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                >
                  Industries
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/971500000000?text=Hi%20Zavian%20Labs%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20autonomous%20systems"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Direct WhatsApp</span>
                  <span className="text-slate-400 text-[10px]">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Action Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-slate-900 dark:text-zinc-300 font-bold">Get Started</h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-snug">
              Deploy autonomous systems into your business.
            </p>
            <div className="pt-1">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-semibold rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-[0_2px_12px_rgba(147,51,234,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                Book Discovery Call →
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-slate-200/80 dark:border-white/10 mb-6" />

        {/* Operational Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500 dark:text-zinc-500">
          <div>
            &copy; 2026 <strong className="font-bold text-slate-900 dark:text-white">ZAVIAN LABS</strong>. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYSTEMS OPERATIONAL</span>
            </div>
            <ThemeToggle />
            <button 
              onClick={scrollToTop} 
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-white text-xs cursor-pointer transition-colors"
            >
              TOP ↑
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}