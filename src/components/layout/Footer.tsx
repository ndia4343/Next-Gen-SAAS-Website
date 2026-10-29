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

export default function Footer({ onOpenQuoteModal, content }: FooterProps = {}) {
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

  const handleOpenQuote = (service: string = 'Discovery Call') => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal(service);
    } else {
      const el = document.getElementById('project-support');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#050508] text-zinc-400 overflow-hidden border-t border-zinc-800/80 pt-16 pb-28 md:pb-16">
      {/* Top subtle neon ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/70 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-24 bg-[#8B5CF6]/15 blur-3xl pointer-events-none" />

      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
          
          {/* Column 1: Brand & Direct Inquiries (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              {/* 3D Cube Icon */}
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]">
                <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-white tracking-widest text-lg">ZAVIAN</span>
                <span className="text-[#8B5CF6] font-semibold text-lg ml-1">LABS</span>
              </div>
            </div>

            <p className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
              AI Automation & Software Studio
            </p>

            <p className="text-sm text-zinc-300 leading-relaxed max-w-sm">
              Architecting next-generation autonomous AI systems, GPU-accelerated 3D WebGL interfaces, and production-grade software ecosystems. Zero templates. Pure engineering.
            </p>

            {/* Direct Contact Card with Copy Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs">
                <button
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded-full bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-purple-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Click to copy email"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <a
                  href={`mailto:${email}`}
                  className="text-zinc-300 hover:text-white font-mono transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* LinkedIn Hub & Network */}
            <div className="pt-1">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-all group"
              >
                <svg className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>Connect on LinkedIn</span>
                <span className="text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
            </div>
          </div>

          {/* Column 2: Capabilities & Engineering (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              Engineering Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li 
                onClick={() => handleOpenQuote('voice_receptionist')}
                className="text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
              >
                <span className="text-zinc-400">›</span> AI Voice Receptionists (Vapi/Retell)
              </li>
              <li 
                onClick={() => handleOpenQuote('whatsapp_funnel')}
                className="text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
              >
                <span className="text-zinc-400">›</span> WhatsApp Autonomous Workflows
              </li>
              <li 
                onClick={() => handleOpenQuote('interactive_3d')}
                className="text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
              >
                <span className="text-zinc-400">›</span> Interactive 3D WebGL Web Apps
              </li>
              <li 
                onClick={() => handleOpenQuote('multi_agent')}
                className="text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
              >
                <span className="text-zinc-400">›</span> Multi-Agent Pipeline Automations
              </li>
              <li 
                onClick={() => handleOpenQuote('estimation_engine')}
                className="text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
              >
                <span className="text-zinc-400">›</span> Custom SaaS & Solar Calculation Engines
              </li>
            </ul>
          </div>

          {/* Column 3: Global Delivery & Architecture (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
              Global Delivery
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="border-l border-zinc-800 pl-3">
                <p className="text-zinc-300 font-medium">United States & Americas</p>
                <p className="text-zinc-400 font-mono">EST / PST Direct Sync</p>
              </div>
              <div className="border-l border-zinc-800 pl-3">
                <p className="text-zinc-300 font-medium">United Kingdom & Europe</p>
                <p className="text-zinc-400 font-mono">GMT Remote Delivery</p>
              </div>
              <div className="border-l border-zinc-800 pl-3">
                <p className="text-zinc-300 font-medium">GCC & Middle East</p>
                <p className="text-zinc-400 font-mono">GST Real-time Coverage</p>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono pt-1">
                ● High-velocity sprint cycles • Zero downtime
              </p>
            </div>
          </div>

          {/* Column 4: Quick Navigation & CTA (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="text-zinc-300 hover:text-white transition-colors">Overview</a>
              </li>
              <li>
                <a href="#core-expertise" className="text-zinc-300 hover:text-white transition-colors">Core Expertise</a>
              </li>
              <li>
                <a href="#project-support" className="text-zinc-300 hover:text-white transition-colors">Project Support</a>
              </li>
              <li>
                <a href="#privacy" className="text-zinc-300 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms" className="text-zinc-300 hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>

            {/* Start a Project Trigger */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => handleOpenQuote('Discovery Call')}
                className="inline-flex items-center justify-center w-full px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:opacity-90 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
              >
                Start a Project →
              </button>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-4" />

        {/* Bottom Bar: Copyright, Telemetry, and Scroll to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} ZAVIAN LABS. ALL RIGHTS RESERVED.</span>
          </div>

          {/* Center / Right Telemetry */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-semibold tracking-wider">SYSTEMS OPERATIONAL</span>
              <span className="text-zinc-400">|</span>
              <span className="text-zinc-300">LATENCY: 24MS</span>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {/* Back to top button */}
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

      {/* Massive Faint Watermark Background */}
      <div 
        className="absolute bottom-2 left-1/2 -translate-x-1/2 select-none pointer-events-none text-[8rem] sm:text-[12rem] lg:text-[15rem] font-black tracking-tighter text-white/[0.015] whitespace-nowrap leading-none z-0"
        aria-hidden="true"
      >
        ZAVIAN LABS
      </div>
    </footer>
  );
}
