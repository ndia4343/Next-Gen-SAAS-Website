'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { HeroSectionData } from '@/lib/types';

interface HeroProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: HeroSectionData;
}

type CoreTagId = 'default' | 'voice' | 'whatsapp' | 'workflows' | 'dashboards' | 'core';

const TAG_HINTS: Record<CoreTagId, string> = {
  default: 'MOVE YOUR CURSOR OVER THE CORE',
  core: 'CLICK ANY TAG BELOW TO INSPECT A SYSTEM IN ACTION',
  voice: 'VOICE — ANSWERS CALLS IN < 400MS & BOOKS DIRECTLY',
  whatsapp: 'WHATSAPP — INSTANT FOLLOW-UPS, QUOTES & CONFIRMATIONS',
  workflows: 'WORKFLOWS — WIRES PHONE, WHATSAPP, CALENDAR & CRM TOGETHER',
  dashboards: 'DASHBOARDS — TRACKS RECOVERED REVENUE & CONVERSIONS LIVE',
};

const MARQUEE_ITEMS = [
  'AI VOICE RECEPTIONISTS',
  'WHATSAPP AUTOMATION',
  'BUSINESS WORKFLOWS',
  'CUSTOM DASHBOARDS',
  'TAILORED SOFTWARE',
];

export function Hero({}: HeroProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredTag, setHoveredTag] = useState<CoreTagId>('default');
  const [coreBoost, setCoreBoost] = useState(false);

  // Smooth spring cursor tracking (-1 to 1 normalized around hero)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 160, damping: 24, mass: 0.7 });
  const smoothY = useSpring(rawY, { stiffness: 160, damping: 24, mass: 0.7 });

  const rotateX = useTransform(smoothY, [-1, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [-1, 1], [-20, 20]);

  // Parallax layers for floating tags
  const chipVoiceX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const chipVoiceY = useTransform(smoothY, [-1, 1], [-14, 14]);
  const chipWaX = useTransform(smoothX, [-1, 1], [24, -24]);
  const chipWaY = useTransform(smoothY, [-1, 1], [16, -16]);
  const chipWorkflowX = useTransform(smoothX, [-1, 1], [-26, 26]);
  const chipWorkflowY = useTransform(smoothY, [-1, 1], [18, -18]);
  const chipDashX = useTransform(smoothX, [-1, 1], [16, -16]);
  const chipDashY = useTransform(smoothY, [-1, 1], [-16, 16]);

  // Specular glint offset inside core metallic sphere
  const sheenX = useTransform(smoothX, [-1, 1], [-14, 14]);
  const sheenY = useTransform(smoothY, [-1, 1], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    rawX.set(Math.max(-1, Math.min(1, nx)));
    rawY.set(Math.max(-1, Math.min(1, ny)));
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setHoveredTag('default');
  };

  const handleHearSampleCall = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('voice-simulation');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    // Notify interactive audio simulation to switch to Dental and begin sample call
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('zavian:play-clinic-demo'));
    }, 350);
  };

  const scrollToTarget = (e: React.MouseEvent<HTMLAnchorElement>, id: string, customEventName?: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    if (customEventName) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(customEventName));
      }, 350);
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#07080b] text-[#eceef2] overflow-hidden pt-28 sm:pt-32"
    >
      <div id="overview" className="absolute top-0 left-0 pointer-events-none" />

      {/* Atmospheric Dark Studio Lighting & Micro-Grid */}
      <div
        className="pointer-events-none absolute -top-44 -right-28 w-[760px] h-[760px] rounded-full blur-3xl opacity-90"
        style={{
          background: 'radial-gradient(circle, rgba(94,227,255,0.20) 0%, rgba(167,139,250,0.12) 42%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-40 w-[620px] h-[620px] rounded-full blur-3xl opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.16) 0%, transparent 68%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.75) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Main Hero Grid */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 pt-6 pb-16 lg:pb-20 min-h-[680px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
        
        {/* LEFT: Editorial Typography & CTAs */}
        <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
          
          {/* Subtle Architectural Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] font-mono text-[11px] sm:text-xs tracking-[0.12em] uppercase text-[#a0a7b3] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#5ee3ff] shadow-[0_0_12px_#5ee3ff] animate-pulse" />
            <span>Voice &bull; WhatsApp &bull; Custom Software</span>
          </div>

          {/* Instrument Serif Display Headline */}
          <h1
            className="mt-7 font-serif-instrument font-normal text-[#eceef2] tracking-[-0.02em] leading-[0.95]"
            style={{ fontSize: 'clamp(52px, 6.2vw, 96px)' }}
          >
            Technology that{' '}
            <span className="italic chrome-text inline-block pr-2">
              picks up
            </span>{' '}
            the phone.
          </h1>

          {/* Clear Business-Focused Copy */}
          <p className="mt-7 max-w-[530px] text-[17px] sm:text-[19px] leading-[1.6] text-[#a0a7b3] font-normal">
            We build AI voice receptionists, WhatsApp automation, workflows, dashboards and custom software for businesses that run on conversations.
          </p>

          {/* Dual Interactive Action Pills */}
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <a
              href="#voice-simulation"
              onClick={handleHearSampleCall}
              className="zl-btn inline-flex items-center gap-3 min-h-[52px] px-7 rounded-full bg-[#eceef2] hover:bg-white text-[#07080b] font-semibold text-[15px] shadow-[0_8px_30px_rgba(236,238,242,0.18)] cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="w-0 h-0 border-l-[9px] border-l-current border-y-[6px] border-y-transparent translate-x-[1px]"
              />
              <span>Hear a sample call</span>
            </a>

            <a
              href="#connected-hub"
              onClick={(e) => scrollToTarget(e, 'connected-hub')}
              className="zl-btn inline-flex items-center min-h-[52px] px-7 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/35 text-[#eceef2] font-semibold text-[15px] backdrop-blur-md cursor-pointer"
            >
              Explore the systems
            </a>
          </div>

          {/* Live Cursor Hint / Active Node Preview */}
          <div className="mt-10 flex items-center gap-3.5 font-mono text-[11px] sm:text-xs tracking-[0.09em] uppercase text-[#9aa1ad]">
            <span className="w-10 h-[1px] bg-white/25 shrink-0" />
            <span className={hoveredTag !== 'default' ? 'text-[#5ee3ff] transition-colors' : 'transition-colors'}>
              {TAG_HINTS[hoveredTag]}
            </span>
          </div>

        </div>

        {/* RIGHT: Interactive 3D Gyroscopic Metallic Sphere & Orbiting Tags */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[480px] lg:min-h-[540px]">
          <div
            onMouseEnter={() => setHoveredTag('core')}
            onMouseLeave={() => setHoveredTag('default')}
            onClick={() => {
              setCoreBoost(true);
              setTimeout(() => setCoreBoost(false), 900);
            }}
            className="relative w-full max-w-[520px] aspect-square flex items-center justify-center anim-float-core cursor-pointer select-none"
            style={{ perspective: '1100px' }}
          >
            {/* Outer Radiance Corona */}
            <div
              className={`pointer-events-none absolute inset-[8%] rounded-full blur-2xl transition-opacity duration-500 ${
                coreBoost ? 'opacity-100 scale-105' : 'opacity-85'
              }`}
              style={{
                background:
                  'radial-gradient(circle, rgba(94,227,255,0.28) 0%, rgba(167,139,250,0.22) 45%, transparent 72%)',
              }}
            />

            {/* 3D Tilting Gyroscope Core Rig */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Metallic Sculpted Center Sphere */}
              <div
                className="relative w-[42%] h-[42%] rounded-full overflow-hidden transition-transform duration-500"
                style={{
                  background:
                    'radial-gradient(circle at 32% 26%, #ffffff 0%, #dde1e8 9%, #8a93a4 30%, #2c3342 60%, #07080c 100%)',
                  boxShadow:
                    '0 32px 84px rgba(0,0,0,0.62), inset -18px -22px 50px rgba(0,0,0,0.45), 0 0 68px rgba(94,227,255,0.24)',
                  transform: coreBoost ? 'translateZ(24px) scale(1.04)' : 'translateZ(0px)',
                }}
              >
                {/* Iridescent cyan-lavender conic metallic glaze */}
                <div
                  className="absolute inset-0 rounded-full mix-blend-overlay"
                  style={{
                    background:
                      'conic-gradient(from 210deg, transparent 0deg, rgba(94,227,255,0.42) 60deg, transparent 120deg, rgba(167,139,250,0.42) 220deg, transparent 300deg)',
                  }}
                />
                {/* Cursor-reactive bright specular reflection */}
                <motion.div
                  style={{ x: sheenX, y: sheenY, rotate: -24 }}
                  className="absolute left-[16%] top-[12%] w-[36%] h-[21%] rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.92),transparent_70%)] pointer-events-none"
                />
                {/* Precision equatorial shimmer */}
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>

              {/* Ring 1: Electric Cyan Gyro Ring + Satellite */}
              <div
                className="pointer-events-none absolute inset-[4%] rounded-full border-[1.5px] border-[#5ee3ff]/75 anim-spin-a"
                style={{
                  transformStyle: 'preserve-3d',
                  animationDuration: coreBoost ? '9s' : '22s',
                  boxShadow: '0 0 22px rgba(94,227,255,0.42), inset 0 0 22px rgba(94,227,255,0.14)',
                }}
              >
                <span className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-[14px] h-[14px] rounded-full bg-[#5ee3ff] shadow-[0_0_18px_#5ee3ff]" />
              </div>

              {/* Ring 2: Lavender Gyro Ring + Satellite */}
              <div
                className="pointer-events-none absolute inset-[12%] rounded-full border-[1.5px] border-[#a78bfa]/80 anim-spin-b"
                style={{
                  transformStyle: 'preserve-3d',
                  animationDuration: coreBoost ? '12s' : '30s',
                  boxShadow: '0 0 22px rgba(167,139,250,0.42)',
                }}
              >
                <span className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-[12px] h-[12px] rounded-full bg-[#a78bfa] shadow-[0_0_16px_#a78bfa]" />
              </div>

              {/* Ring 3: Platinum Silver Fine Gimbal + Metallic Node */}
              <div
                className="pointer-events-none absolute inset-[20%] rounded-full border border-[#dce2ee]/50 anim-spin-c"
                style={{
                  transformStyle: 'preserve-3d',
                  animationDuration: coreBoost ? '16s' : '40s',
                }}
              >
                <span className="absolute top-1/2 -right-[5px] -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-[#e6eaf2] shadow-[0_0_10px_rgba(255,255,255,0.65)]" />
              </div>
            </motion.div>

            {/* 4 Interactive Parallax Capability Pills */}
            <motion.a
              href="#voice-simulation"
              onClick={handleHearSampleCall}
              onMouseEnter={() => setHoveredTag('voice')}
              onMouseLeave={() => setHoveredTag('core')}
              style={{ x: chipVoiceX, y: chipVoiceY }}
              className="zl-btn absolute left-[2%] sm:left-0 top-[15%] z-20 inline-flex items-center gap-2 min-h-[42px] px-4 sm:px-[18px] rounded-full border border-white/20 bg-[#0c0e13]/78 hover:border-[#5ee3ff]/70 hover:shadow-[0_0_24px_rgba(94,227,255,0.3)] backdrop-blur-md font-mono text-[11px] sm:text-xs tracking-[0.09em] uppercase text-[#eceef2] cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5ee3ff]" />
              <span>Voice</span>
            </motion.a>

            <motion.a
              href="#voice-simulation"
              onClick={(e) => scrollToTarget(e, 'voice-simulation', 'zavian:focus-whatsapp')}
              onMouseEnter={() => setHoveredTag('whatsapp')}
              onMouseLeave={() => setHoveredTag('core')}
              style={{ x: chipWaX, y: chipWaY }}
              className="zl-btn absolute right-[2%] sm:right-0 top-[24%] z-20 inline-flex items-center gap-2 min-h-[42px] px-4 sm:px-[18px] rounded-full border border-white/20 bg-[#0c0e13]/78 hover:border-[#5ee3ff]/70 hover:shadow-[0_0_24px_rgba(94,227,255,0.3)] backdrop-blur-md font-mono text-[11px] sm:text-xs tracking-[0.09em] uppercase text-[#eceef2] cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
              <span>WhatsApp</span>
            </motion.a>

            <motion.a
              href="#connected-hub"
              onClick={(e) => scrollToTarget(e, 'connected-hub')}
              onMouseEnter={() => setHoveredTag('workflows')}
              onMouseLeave={() => setHoveredTag('core')}
              style={{ x: chipWorkflowX, y: chipWorkflowY }}
              className="zl-btn absolute left-[4%] bottom-[13%] z-20 inline-flex items-center gap-2 min-h-[42px] px-4 sm:px-[18px] rounded-full border border-white/20 bg-[#0c0e13]/78 hover:border-[#b4a0ff]/70 hover:shadow-[0_0_24px_rgba(180,160,255,0.3)] backdrop-blur-md font-mono text-[11px] sm:text-xs tracking-[0.09em] uppercase text-[#eceef2] cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
              <span>Workflows</span>
            </motion.a>

            <motion.a
              href="#command-center"
              onClick={(e) => scrollToTarget(e, 'command-center')}
              onMouseEnter={() => setHoveredTag('dashboards')}
              onMouseLeave={() => setHoveredTag('core')}
              style={{ x: chipDashX, y: chipDashY }}
              className="zl-btn absolute right-[4%] bottom-[8%] z-20 inline-flex items-center gap-2 min-h-[42px] px-4 sm:px-[18px] rounded-full border border-white/20 bg-[#0c0e13]/78 hover:border-[#5ee3ff]/70 hover:shadow-[0_0_24px_rgba(94,227,255,0.3)] backdrop-blur-md font-mono text-[11px] sm:text-xs tracking-[0.09em] uppercase text-[#eceef2] cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5ee3ff]" />
              <span>Dashboards</span>
            </motion.a>

          </div>
        </div>

      </div>

      {/* MARQUEE STRIP: Permanently Obsidian Dark + Glowing Separator Before Editorial Light Mode */}
      <div className="relative w-full bg-[#090b10] border-t border-white/12 overflow-hidden">
        {/* Top subtle cyan-lavender hairline luminescence */}
        <div
          className="pointer-events-none h-[1px] w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 5%, rgba(94,227,255,0.5) 35%, rgba(167,139,250,0.5) 65%, transparent 95%)',
          }}
        />

        <div className="py-5 overflow-hidden relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#090b10] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#090b10] to-transparent z-10" />

          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            {[0, 1, 2].map((dup) => (
              <div
                key={dup}
                className="flex items-center gap-12 font-mono text-[11.5px] sm:text-xs tracking-[0.14em] uppercase text-[#b8bfcc] shrink-0"
              >
                {MARQUEE_ITEMS.map((item, idx) => (
                  <span key={`${dup}-${idx}`} className="inline-flex items-center gap-3.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        idx % 2 === 0 ? 'bg-[#5ee3ff]' : 'bg-[#a78bfa]'
                      }`}
                    />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom glowing seam leading into #eceff3 Light Editorial Canvas */}
        <div
          className="h-[2px] w-full"
          style={{
            background:
              'linear-gradient(90deg, rgba(6,120,143,0.25) 0%, rgba(94,227,255,0.65) 35%, rgba(90,63,209,0.65) 65%, rgba(6,120,143,0.25) 100%)',
          }}
        />
      </div>
    </section>
  );
}

export const HeroSection = Hero;
export default Hero;
