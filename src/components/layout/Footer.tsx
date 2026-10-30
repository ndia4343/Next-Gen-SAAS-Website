'use client';

import React from 'react';
import { Box } from 'lucide-react';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { FooterData, ThemeBrandingConfig } from '@/lib/types';

interface FooterProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: FooterData;
  themeBranding?: ThemeBrandingConfig;
}

export default function Footer({ onOpenQuoteModal }: FooterProps = {}) {
  const { lenis } = useSmoothScroll();

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
      const el = document.getElementById('project-support');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative bg-[#050508] text-zinc-400 border-t border-zinc-800/80 pt-8 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Main Grid - Reduced padding & tighter gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 pb-6">
          
          {/* Left Column (Span 5) */}
          <div className="lg:col-span-5 space-y-2.5">
            <a href="#overview" className="inline-flex items-center gap-2 group">
              <Box className="w-5 h-5 text-white group-hover:text-purple-400 transition-colors" />
              <div className="flex items-center text-base tracking-wider">
                <span className="font-extrabold text-white">ZAVIAN</span>
                <span className="font-bold text-[#8B5CF6] ml-1">LABS</span>
              </div>
            </a>

            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              Every missed lead is lost revenue. <br />
              <span className="text-[#8B5CF6]">We make sure none slip away.</span>
            </h3>

            {/* Tightened 2-line subtext */}
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Intelligent voice agents, WhatsApp booking systems, and custom software that capture and track every opportunity around the clock.
            </p>

            {/* Compact Email Pill */}
            <div className="pt-0.5">
              <a
                href="mailto:contact@zavianlabs.com"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-mono"
              >
                <span>contact@zavianlabs.com</span>
                <span className="text-zinc-500">↗</span>
              </a>
            </div>
          </div>

          {/* Services (Span 3) */}
          <div className="lg:col-span-3 space-y-2">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300">Services</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    if (onOpenQuoteModal) {
                      e.preventDefault();
                      onOpenQuoteModal('voice_receptionist');
                    }
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  AI Voice Receptionists
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    if (onOpenQuoteModal) {
                      e.preventDefault();
                      onOpenQuoteModal('whatsapp_funnel');
                    }
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  WhatsApp Booking Systems
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    if (onOpenQuoteModal) {
                      e.preventDefault();
                      onOpenQuoteModal('multi_agent');
                    }
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Custom Software & Dashboards
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation (Span 2) */}
          <div className="lg:col-span-2 space-y-2">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300">Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#overview" className="text-zinc-400 hover:text-white transition-colors">Overview</a></li>
              <li><a href="#services" className="text-zinc-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#solutions" className="text-zinc-400 hover:text-white transition-colors">Solutions</a></li>
              <li><a href="#project-support" className="text-zinc-400 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Get Started (Span 2) - Compact without oversized card */}
          <div className="lg:col-span-2 space-y-2">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300">Get Started</h4>
            <p className="text-xs text-zinc-400 leading-snug">
              Deploy autonomous systems into your business.
            </p>
            <a
              href="#project-support"
              onClick={handleStartProject}
              className="inline-flex items-center justify-center w-full px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-all shadow-[0_0_12px_rgba(139,92,246,0.25)] cursor-pointer"
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

          <div className="flex items-center gap-4 pr-32">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-400 font-medium">SYSTEMS OPERATIONAL</span>
            </div>
            <ThemeToggle />
            <button onClick={scrollToTop} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs cursor-pointer">
              TOP ↑
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
