'use client';

import React from 'react';
import { Boxes } from 'lucide-react';
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

  const handleStartProject = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal('Discovery Call');
    } else {
      const el = document.getElementById('project-support');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#050508] text-zinc-400 border-t border-zinc-800/80 pt-16 pb-28 md:pb-14">
      {/* Subtle top neon ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14">
          
          {/* Column 1: Exact Brand Logo & High-Impact Copy (Span 5) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Logo */}
            <a href="#overview" className="inline-flex items-center gap-2.5 group">
              <Boxes className="w-6 h-6 text-white" />
              <div className="flex items-center text-lg tracking-wider">
                <span className="font-extrabold text-white">ZAVIAN</span>
                <span className="font-bold text-[#8B5CF6] ml-1.5">LABS</span>
              </div>
            </a>

            {/* Tagline */}
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug pt-1">
              Every missed lead is lost revenue. <br />
              <span className="text-[#8B5CF6]">
                We make sure none slip away.
              </span>
            </h3>

            {/* Subtext */}
            <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
              Built to capture, convert, and track every opportunity—from first contact to final booking. Powered by intelligent automation and custom systems that keep your business moving around the clock.
            </p>

            {/* Direct Email Badge */}
            <div className="pt-1">
              <a
                href="mailto:contact@zavianlabs.com"
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all group"
              >
                <svg className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="font-mono text-xs">contact@zavianlabs.com</span>
                <span className="text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-xs">↗</span>
              </a>
            </div>
          </div>

          {/* Column 2: Exact Services (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    if (onOpenQuoteModal) {
                      e.preventDefault();
                      onOpenQuoteModal('voice_receptionist');
                    }
                  }}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="text-zinc-600">›</span> AI Voice Receptionists
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
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="text-zinc-600">›</span> WhatsApp Booking Systems
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
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="text-zinc-600">›</span> Autonomous Workflows
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Exact Navigation (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#overview" className="text-zinc-400 hover:text-white transition-colors">Overview</a>
              </li>
              <li>
                <a href="#services" className="text-zinc-400 hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="#solutions" className="text-zinc-400 hover:text-white transition-colors">Solutions</a>
              </li>
              <li>
                <a href="#project-support" className="text-zinc-400 hover:text-white transition-colors">Support</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Action (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
              Get Started
            </h4>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ready to deploy autonomous AI systems into your business?
              </p>
              <button
                type="button"
                onClick={handleStartProject}
                className="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:opacity-95 shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all cursor-pointer"
              >
                Start a Project →
              </button>
            </div>
          </div>

        </div>

        {/* Subtle Horizontal Divider */}
        <div className="h-[1px] w-full bg-zinc-800/80 mb-6" />

        {/* Bottom Bar: Copyright with Bold Company Name, Operational Status, and Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} <strong className="font-bold text-white tracking-wider">ZAVIAN LABS</strong>. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-semibold tracking-wider">SYSTEMS OPERATIONAL</span>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-400">LATENCY: 24MS</span>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all group cursor-pointer"
                title="Back to Top"
              >
                <span>TOP</span>
                <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
