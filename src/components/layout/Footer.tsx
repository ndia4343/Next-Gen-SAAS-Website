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
    <footer className="relative z-20 bg-[#07070A] border-t border-neutral-800 text-zinc-400 pt-12 pb-12 transition-colors duration-300">
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
              <div className="w-8 h-8 rounded-xl bg-white/[0.08] p-1 border border-white/15 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-sm">
                {(branding?.logoMode === 'image' || (branding?.logoMode !== 'svg' && branding?.logoImageUrl)) && branding?.logoImageUrl ? (
                  <img
                    src={branding.logoImageUrl}
                    alt="Brand Logo"
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18))' }}
                    className="w-full h-full object-contain p-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
                  />
                ) : branding?.logoMode === 'svg' && branding?.logoSvgContent ? (
                  <div
                    className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full text-white"
                    dangerouslySetInnerHTML={{ __html: branding.logoSvgContent }}
                  />
                ) : (
                  <img
                    src="/images/zavian-cube-mark.png"
                    alt="Brand Logo"
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18))' }}
                    className="w-full h-full object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
                  />
                )}
              </div>
              <div className="flex items-center text-base tracking-wider leading-none">
                <span className="font-extrabold text-white">{branding?.wordmark1 || 'ZAVIAN'}</span>
                <span className="font-bold text-[#A855F7] ml-1.5">{branding?.wordmark2 || 'LABS'}</span>
              </div>
            </a>

            {/* High-Contrast Visible Headline */}
            <h3 className="text-2xl font-extrabold tracking-tight text-white mb-2 leading-snug">
              <span className="text-white" style={{ color: '#ffffff' }}>Zero missed inquiries.</span>{' '}
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 inline-block font-extrabold"
                style={{
                  backgroundImage: 'linear-gradient(to right, #a78bfa, #a5b4fc, #22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Zero human delay.
              </span>
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Intelligent voice agents, WhatsApp booking systems, and custom software that capture and track every opportunity around the clock.
            </p>

            {/* Email Contact Pill */}
            <div className="pt-1">
              <a
                href="mailto:contact@zavianlabs.com"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 shadow-xs transition-all text-xs font-mono group"
              >
                <svg className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="font-medium text-zinc-300 group-hover:text-white">contact@zavianlabs.com</span>
                <span className="text-zinc-500 group-hover:text-white transition-colors">↗</span>
              </a>
            </div>
          </div>

          {/* Systems Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-200 font-bold">Systems</h4>
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
                  className="text-zinc-400 hover:text-white transition-colors"
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
                  className="text-zinc-400 hover:text-white transition-colors"
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
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Live Revenue Dashboards
                </a>
              </li>
              <li>
                <a 
                  href="#industries" 
                  onClick={(e) => {
                    if (onOpenQuoteModal) {
                      e.preventDefault();
                      onOpenQuoteModal('estimation_engine');
                    } else {
                      handleNavScroll(e, 'industries');
                    }
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  SolarPro Calculation Engine
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-200 font-bold">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="#hero" 
                  onClick={(e) => handleNavScroll(e, 'hero')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Overview
                </a>
              </li>
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => handleNavScroll(e, 'how-it-works')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#industries" 
                  onClick={(e) => handleNavScroll(e, 'industries')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Industries
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/971500000000?text=Hi%20Zavian%20Labs%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20autonomous%20systems"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Direct WhatsApp</span>
                  <span className="text-zinc-500 text-[10px]">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Action Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-200 font-bold">Get Started</h4>
            <p className="text-xs text-zinc-400 leading-snug">
              Deploy autonomous systems into your business.
            </p>
            <div className="pt-1">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-semibold rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                Book Discovery Call →
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-zinc-800/80 mb-6" />

        {/* Operational Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div>
            &copy; 2026 <strong className="font-bold text-white">ZAVIAN LABS</strong>. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYSTEMS OPERATIONAL</span>
            </div>
            <ThemeToggle />
            <button 
              onClick={scrollToTop} 
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs cursor-pointer transition-colors"
            >
              TOP ↑
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}