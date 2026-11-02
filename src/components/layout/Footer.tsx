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

  const handleStartProject = (e: React.MouseEvent) => {
    if (onOpenQuoteModal) {
      e.preventDefault();
      onOpenQuoteModal('Discovery Call');
    } else {
      const el = document.getElementById('industries') || document.getElementById('how-it-works');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative z-20 bg-neutral-950 border-t border-neutral-800 text-zinc-400 pt-8 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Main Grid - Reduced padding & tighter gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 pb-6">
          
          {/* Left Column (Span 5) */}
          <div className="lg:col-span-5 space-y-2.5">
            <a href="#overview" className="inline-flex items-center gap-2.5 group focus:outline-none">
              {/* Cube Icon: Exactly identical to Navbar */}
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
              <div className="flex items-center text-base tracking-wider">
                <span className="font-extrabold text-white">{branding?.wordmark1 || 'ZAVIAN'}</span>
                <span className="font-bold text-[#8B5CF6] ml-1">{branding?.wordmark2 || 'LABS'}</span>
              </div>
            </a>

            <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
              Zero missed inquiries.{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
                Zero human delay.
              </span>
            </h3>

            {/* Tightened 2-line subtext */}
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Intelligent voice agents, WhatsApp booking systems, and custom software that capture and track every opportunity around the clock.
            </p>

            {/* Compact Email Pill */}
            <div className="pt-0.5">
              <a
                href="mailto:contact@zavianlabs.com"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 text-zinc-200 hover:text-white hover:border-zinc-500 transition-all text-xs font-mono group"
              >
                <svg className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="text-zinc-200 group-hover:text-white font-medium">contact@zavianlabs.com</span>
                <span className="text-zinc-400 group-hover:text-zinc-200">↗</span>
              </a>
            </div>
          </div>

          {/* Systems (Span 3) */}
          <div className="lg:col-span-3 space-y-2">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300">Systems</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => {
                    if (onOpenQuoteModal) {
                      e.preventDefault();
                      onOpenQuoteModal('voice_receptionist');
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
                    }
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  SolarPro Calculation Engine
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation (Span 2) */}
          <div className="lg:col-span-2 space-y-2">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300">Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a 
                  href="#hero" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Overview
                </a>
              </li>
              <li>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="#industries" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
                  }}
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

          {/* Get Started (Span 2) - Compact without oversized card */}
          <div className="lg:col-span-2 space-y-2">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300">Get Started</h4>
            <p className="text-xs text-zinc-400 leading-snug">
              Deploy autonomous systems into your business.
            </p>
            <a
              href="#industries"
              onClick={handleStartProject}
              className="inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-medium shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Start a Project →
            </a>
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-zinc-800/80 mb-4" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} <strong className="font-bold text-white">ZAVIAN LABS</strong>. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-400 font-medium">SYSTEMS OPERATIONAL</span>
            </div>
            <ThemeToggle />
            <button onClick={scrollToTop} className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white text-xs cursor-pointer">
              TOP ↑
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
