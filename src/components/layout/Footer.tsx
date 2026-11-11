'use client';

import React, { useState, useEffect } from 'react';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import { FooterData, ThemeBrandingConfig } from '@/lib/types';
import { useSiteConfig } from '@/context/SiteConfigContext';

interface FooterProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: FooterData;
  themeBranding?: ThemeBrandingConfig;
}

export default function Footer({ themeBranding: initialBranding }: FooterProps = {}) {
  const { config } = useSiteConfig();
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

  const iconSize = Math.max(24, Math.min(64, config.branding.logoIconSize || 36));
  const logoSrc =
    config.branding.logoImageUrl ||
    (branding?.logoImageUrl ? branding.logoImageUrl : '/images/zavian-cube-mark.png');
  const wordmark1 = config.branding.logoTextPrimary || branding?.wordmark1 || 'ZAVIAN';
  const wordmark2 = config.branding.logoTextSecondary || branding?.wordmark2 || 'LABS';
  const companyName = config.branding.companyName || `${wordmark1} ${wordmark2}`;
  const contactEmail = config.branding.contactEmail || 'contact@zavianlabs.com';
  const bookingUrl = config.branding.calendarBookingUrl || 'https://calendar.app.google/u5vL88X41qmGBCky5';

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
              className="inline-flex items-center gap-3 group focus:outline-none"
            >
              {/* Cube Icon (dynamic size matching Navbar lockup) */}
              <div
                className="rounded-xl p-[1.5px] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-[0_0_20px_rgba(94,227,255,0.18)]"
                style={{
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  background:
                    'linear-gradient(135deg, rgba(242,244,248,0.65) 0%, rgba(138,146,162,0.4) 50%, rgba(94,227,255,0.45) 100%)',
                }}
              >
                <div className="w-full h-full rounded-[10px] bg-[#07080b] p-1 flex items-center justify-center overflow-hidden">
                  {branding?.logoMode === 'svg' && branding?.logoSvgContent ? (
                    <div
                      className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full text-white"
                      dangerouslySetInnerHTML={{ __html: branding.logoSvgContent }}
                    />
                  ) : (
                    <img
                      src={logoSrc}
                      alt={companyName}
                      style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18))' }}
                      className="w-full h-full object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center text-[15px] tracking-widest leading-none uppercase">
                <span className="font-bold text-[#eceef2]">{wordmark1}</span>
                <span className="font-normal text-[#b4a0ff] ml-1.5">{wordmark2}</span>
              </div>
            </a>

            {/* High-Contrast Headline */}
            <h3 className="text-2xl font-serif-instrument tracking-tight text-white mb-2 leading-snug">
              Every call answered.{' '}
              <span className="italic text-[#b4a0ff]">Every booking tracked.</span>
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {config.branding.tagline || 'AI AUTOMATION & SOFTWARE STUDIO'} &mdash; Voice receptionists, WhatsApp follow-ups, live revenue dashboards, and custom software built around how your business operates.
            </p>

            {/* Email Contact Pill */}
            <div className="pt-1">
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 shadow-xs transition-all text-xs font-mono group"
              >
                <svg className="w-3.5 h-3.5 text-[#5ee3ff] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="font-medium text-zinc-300 group-hover:text-white">{contactEmail}</span>
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
                  href="#voice-simulation" 
                  onClick={(e) => handleNavScroll(e, 'voice-simulation')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  AI Voice Receptionist
                </a>
              </li>
              <li>
                <a 
                  href="#voice-simulation" 
                  onClick={(e) => handleNavScroll(e, 'voice-simulation')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  WhatsApp Automation
                </a>
              </li>
              <li>
                <a 
                  href="#connected-hub" 
                  onClick={(e) => handleNavScroll(e, 'connected-hub')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Connected Systems Hub
                </a>
              </li>
              <li>
                <a 
                  href="#command-center" 
                  onClick={(e) => handleNavScroll(e, 'command-center')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Command Center &amp; SolarPro
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
                  href="#voice-simulation" 
                  onClick={(e) => handleNavScroll(e, 'voice-simulation')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Voice Simulation
                </a>
              </li>
              <li>
                <a 
                  href="#connected-hub" 
                  onClick={(e) => handleNavScroll(e, 'connected-hub')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Connected Hub
                </a>
              </li>
              <li>
                <a 
                  href="#command-center" 
                  onClick={(e) => handleNavScroll(e, 'command-center')}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Command Center
                </a>
              </li>
            </ul>
          </div>

          {/* Action Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-200 font-bold">Get Started</h4>
            <p className="text-xs text-zinc-400 leading-snug">
              See how this fits your calls, schedule, and team.
            </p>
            <div className="pt-1">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-semibold rounded-full bg-[#eceef2] hover:bg-white text-[#07080b] shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
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
            &copy; 2026 <strong className="font-bold text-white">{companyName}</strong>. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYSTEMS OPERATIONAL</span>
            </div>
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