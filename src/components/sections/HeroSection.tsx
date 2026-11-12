'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { HeroSectionData } from '@/lib/types';
import { useSiteConfig } from '@/context/SiteConfigContext';

interface HeroProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: HeroSectionData;
}

export function Hero({}: HeroProps = {}) {
  const { config } = useSiteConfig();
  const sectionRef = useRef<HTMLElement>(null);
  const [coreBoost, setCoreBoost] = useState(false);

  const hero = config.hero;
  const marqueeItems =
    config.marquee.items.length > 0
      ? config.marquee.items
      : [
          '24/7 CALL PICKUP',
          'CALENDAR BOOKINGS',
          'WHATSAPP CONFIRMATIONS',
          'AFTER-HOURS COVERAGE',
          'CUSTOM WORKFLOWS',
        ];
  const bookingUrl =
    config.branding.calendarBookingUrl || 'https://calendar.app.google/u5vL88X41qmGBCky5';

  const fontSizePx = Math.max(36, Math.min(110, hero.headlineFontSize || 88));
  const minMobilePx = Math.min(36, Math.round(fontSizePx * 0.56));
  const fluidVw = (fontSizePx / 14.4).toFixed(2);
  const fontFamilyClass = hero.headlineFontFamily === 'sans' ? 'font-sans' : 'font-serif-instrument';

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
  };

  const handleHearSampleCall = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('voice-simulation');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('zavian:play-clinic-demo'));
    }, 350);
  };

  const handleSelectSecondarySector = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectorId: 'solar' | 'hr' | 'custom'
  ) => {
    e.preventDefault();
    const target = document.getElementById('voice-simulation');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('zavian:select-industry', { detail: sectorId }));
    }, 250);
  };

  const scrollToTarget = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    customEventName?: string
  ) => {
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

  const primaryHref = hero.primaryCtaLink || '#voice-simulation';
  const secondaryHref =
    hero.secondaryCtaLink && hero.secondaryCtaLink.startsWith('http')
      ? hero.secondaryCtaLink
      : bookingUrl;

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hero-dark-canvas relative w-full bg-[#07080b] text-[#eceef2] overflow-hidden pt-28 sm:pt-32"
    >
      <div id="overview" className="absolute top-0 left-0 pointer-events-none" />

      {/* Atmospheric Dark Studio Lighting & Micro-Grid */}
      <div
        className="pointer-events-none absolute -top-44 -right-28 w-[760px] h-[760px] rounded-full blur-3xl opacity-90"
        style={{
          background:
            'radial-gradient(circle, rgba(94,227,255,0.20) 0%, rgba(167,139,250,0.12) 42%, transparent 70%)',
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
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 pt-6 pb-14 lg:pb-16 min-h-[600px] lg:min-h-[630px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
        
        {/* LEFT: Editorial Clinic-First Typography & CTAs */}
        <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
          
          {/* Eyebrow / Tagline */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] font-mono text-[11px] sm:text-xs tracking-[0.08em] text-[#b8bfcc] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#5ee3ff] shadow-[0_0_12px_#5ee3ff]" />
            <span>{hero.eyebrowBadge}</span>
          </div>

          {/* H1 Display Headline */}
          <h1
            className={`mt-7 ${fontFamilyClass} ${hero.headlineFontWeight} text-[#eceef2] tracking-[-0.02em] leading-[0.95]`}
            style={{ fontSize: `clamp(${minMobilePx}px, ${fluidVw}vw, ${fontSizePx}px)` }}
          >
            {hero.headlinePrefix}{' '}
            <span className="italic chrome-text inline-block pr-2">
              {hero.headlineAccent}
            </span>{' '}
            {hero.headlineSuffix}
          </h1>

          {/* Clinic-Focused Subheadline */}
          <p className="mt-7 max-w-[540px] text-[17px] sm:text-[18.5px] leading-[1.6] text-[#a0a7b3] font-normal">
            {hero.subheadline}
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <a
              href={primaryHref}
              onClick={(e) => {
                if (primaryHref === '#voice-simulation') {
                  handleHearSampleCall(e);
                } else if (primaryHref.startsWith('#')) {
                  scrollToTarget(e, primaryHref.slice(1));
                }
              }}
              target={primaryHref.startsWith('http') ? '_blank' : undefined}
              rel={primaryHref.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="zl-btn inline-flex items-center gap-3 min-h-[52px] px-7 rounded-full bg-[#eceef2] hover:bg-white text-[#07080b] font-semibold text-[15px] shadow-[0_8px_30px_rgba(236,238,242,0.18)] cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="w-0 h-0 border-l-[9px] border-l-current border-y-[6px] border-y-transparent translate-x-[1px]"
              />
              <span>{hero.primaryCtaText || 'Hear it answer a call'}</span>
            </a>

            <a
              href={secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="zl-btn inline-flex items-center min-h-[52px] px-7 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/35 text-[#eceef2] font-semibold text-[15px] backdrop-blur-md cursor-pointer"
            >
              {hero.secondaryCtaText || 'Book a free missed-call audit'}
            </a>
          </div>

          {/* Sub-Hero Anchor Row for Secondary Sectors */}
          <p className="mt-6 text-xs sm:text-[13px] text-[#8d95a5] leading-relaxed">
            <span>Also built for: </span>
            <a
              href="#voice-simulation"
              onClick={(e) => handleSelectSecondarySector(e, 'solar')}
              className="text-[#c8ceda] hover:text-white underline decoration-white/25 underline-offset-4 transition-colors cursor-pointer"
            >
              Solar &amp; installers
            </a>
            <span className="mx-2 text-white/30">&middot;</span>
            <a
              href="#voice-simulation"
              onClick={(e) => handleSelectSecondarySector(e, 'hr')}
              className="text-[#c8ceda] hover:text-white underline decoration-white/25 underline-offset-4 transition-colors cursor-pointer"
            >
              HR &amp; recruitment
            </a>
            <span className="mx-2 text-white/30">&middot;</span>
            <a
              href="#voice-simulation"
              onClick={(e) => handleSelectSecondarySector(e, 'custom')}
              className="text-[#c8ceda] hover:text-white underline decoration-white/25 underline-offset-4 transition-colors cursor-pointer"
            >
              Custom workflows
            </a>
          </p>

        </div>

        {/* RIGHT: Interactive 3D Gyroscopic Metallic Sphere & Orbiting Tags */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[360px] sm:min-h-[460px] lg:min-h-[520px]">
          <div
            onClick={() => {
              setCoreBoost(true);
              setTimeout(() => setCoreBoost(false), 900);
            }}
            className="relative w-full max-w-[500px] aspect-square flex items-center justify-center anim-float-core cursor-pointer select-none"
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
                <div
                  className="absolute inset-0 rounded-full mix-blend-overlay"
                  style={{
                    background:
                      'conic-gradient(from 210deg, transparent 0deg, rgba(94,227,255,0.42) 60deg, transparent 120deg, rgba(167,139,250,0.42) 220deg, transparent 300deg)',
                  }}
                />
                <motion.div
                  style={{ x: sheenX, y: sheenY, rotate: -24 }}
                  className="absolute left-[16%] top-[12%] w-[36%] h-[21%] rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.92),transparent_70%)] pointer-events-none"
                />
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
              style={{ x: chipVoiceX, y: chipVoiceY }}
              className="zl-btn absolute left-[2%] sm:left-0 top-[15%] z-20 inline-flex items-center gap-2 min-h-[42px] px-4 sm:px-[18px] rounded-full border border-white/20 bg-[#0c0e13]/78 hover:border-[#5ee3ff]/70 hover:shadow-[0_0_24px_rgba(94,227,255,0.3)] backdrop-blur-md font-mono text-[11px] sm:text-xs tracking-[0.09em] uppercase text-[#eceef2] cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5ee3ff]" />
              <span>Voice</span>
            </motion.a>

            <motion.a
              href="#voice-simulation"
              onClick={(e) => scrollToTarget(e, 'voice-simulation', 'zavian:focus-whatsapp')}
              style={{ x: chipWaX, y: chipWaY }}
              className="zl-btn absolute right-[2%] sm:right-0 top-[24%] z-20 inline-flex items-center gap-2 min-h-[42px] px-4 sm:px-[18px] rounded-full border border-white/20 bg-[#0c0e13]/78 hover:border-[#5ee3ff]/70 hover:shadow-[0_0_24px_rgba(94,227,255,0.3)] backdrop-blur-md font-mono text-[11px] sm:text-xs tracking-[0.09em] uppercase text-[#eceef2] cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
              <span>WhatsApp</span>
            </motion.a>

            <motion.a
              href="#how-it-works"
              onClick={(e) => scrollToTarget(e, 'how-it-works')}
              style={{ x: chipWorkflowX, y: chipWorkflowY }}
              className="zl-btn absolute left-[4%] bottom-[13%] z-20 inline-flex items-center gap-2 min-h-[42px] px-4 sm:px-[18px] rounded-full border border-white/20 bg-[#0c0e13]/78 hover:border-[#b4a0ff]/70 hover:shadow-[0_0_24px_rgba(180,160,255,0.3)] backdrop-blur-md font-mono text-[11px] sm:text-xs tracking-[0.09em] uppercase text-[#eceef2] cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
              <span>Workflows</span>
            </motion.a>

            <motion.a
              href="#command-center"
              onClick={(e) => scrollToTarget(e, 'command-center')}
              style={{ x: chipDashX, y: chipDashY }}
              className="zl-btn absolute right-[4%] bottom-[8%] z-20 inline-flex items-center gap-2 min-h-[42px] px-4 sm:px-[18px] rounded-full border border-white/20 bg-[#0c0e13]/78 hover:border-[#5ee3ff]/70 hover:shadow-[0_0_24px_rgba(94,227,255,0.3)] backdrop-blur-md font-mono text-[11px] sm:text-xs tracking-[0.09em] uppercase text-[#eceef2] cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5ee3ff]" />
              <span>Dashboards</span>
            </motion.a>

          </div>
        </div>

      </div>

      {/* CONTINUOUS SLOW OBSIDIAN TICKER: Smooth seamless marquee with subtle dark seam */}
      <div className="relative z-20 w-full overflow-hidden py-4 border-t border-b border-white/10 bg-[#07080b]">
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 5%, rgba(94,227,255,0.35) 35%, rgba(167,139,250,0.35) 65%, transparent 95%)',
          }}
        />

        <div
          className="marquee-track flex items-center whitespace-nowrap"
          style={{
            animationDuration: `${config.marquee?.speedSeconds || 60}s`,
          }}
        >
          {[0, 1].map((dup) => (
            <div
              key={dup}
              aria-hidden={dup === 1 ? true : undefined}
              className="flex items-center gap-10 pr-10 py-1.5 opacity-75 font-mono text-[11px] tracking-[0.12em] uppercase text-[#9aa1ad] shrink-0"
            >
              {[...marqueeItems, ...marqueeItems].map((item, idx) => (
                <span
                  key={`${dup}-${idx}`}
                  className="flex items-center gap-2.5 leading-none py-1"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 flex items-center leading-none ${
                      idx % 2 === 0
                        ? 'bg-[#5ee3ff]/85 shadow-[0_0_8px_rgba(94,227,255,0.55)]'
                        : 'bg-[#a78bfa]/85 shadow-[0_0_8px_rgba(167,139,250,0.55)]'
                    }`}
                  />
                  <span className="leading-none flex items-center">{item}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const HeroSection = Hero;
export default Hero;
