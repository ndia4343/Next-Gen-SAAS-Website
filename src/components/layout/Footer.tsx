'use client';

import React, { useState } from 'react';
import { useSmoothScroll } from '@/components/providers/SmoothScrollProvider';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { FooterData, ThemeBrandingConfig } from '@/lib/types';

interface FooterProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: FooterData;
  themeBranding?: ThemeBrandingConfig;
}

export default function Footer({ onOpenQuoteModal }: FooterProps = {}) {
  const [copied, setCopied] = useState(false);
  const email = "contact@zavianlabs.com";
  const { lenis } = useSmoothScroll();

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14">
          
          {/* Brand & Catchy Hero Tagline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-white tracking-widest text-lg">ZAVIAN</span>
                <span className="text-[#8B5CF6] font-semibold text-lg ml-1">LABS</span>
              </div>
            </div>

            {/* Catchy, High-Impact Tagline */}
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug pt-1">
              Autonomous intelligence. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#FF6B00]">
                Engineered for scale.
              </span>
            </h3>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              We design and deploy production-grade AI receptionists, automated booking workflows, and modern web applications that run your operations on autopilot.
            </p>

            {/* Direct Email Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 p-1.5 pr-3.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs">
                <button
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded-full bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-purple-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Copy email to clipboard"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={`mailto:${email}`}
                  className="text-zinc-300 hover:text-white font-mono transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Real Solutions (No internal tool names) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              Solutions
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
              <li>
                <a 
                  href="#services" 
                  onClick={(e) => {
                    if (onOpenQuoteModal) {
                      e.preventDefault();
                      onOpenQuoteModal('custom_software');
                    }
                  }}
                  className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="text-zinc-600">›</span> Custom SaaS Platforms
                </a>
              </li>
            </ul>
          </div>

          {/* Exact Site Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
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
                <a href="#project-support" className="text-zinc-400 hover:text-white transition-colors">Project Support</a>
              </li>
            </ul>
          </div>

          {/* Action Card */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
              Get Started
            </h4>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <p className="text-xs text-zinc-400">
                Have a project or custom workflow in mind?
              </p>
              <button
                type="button"
                onClick={handleStartProject}
                className="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:opacity-95 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
              >
                Start a Project →
              </button>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-zinc-800/80 mb-6" />

        {/* Bottom Bar: Copyright, Telemetry, and Top Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div>
            © {new Date().getFullYear()} ZAVIAN LABS. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-semibold tracking-wider">SYSTEMS OPERATIONAL</span>
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
