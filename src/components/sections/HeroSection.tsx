'use client';

import '@/lib/react-19-polyfill';
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { GyroscopeScene } from '@/components/canvas/GyroscopeScene';
import { HeroSectionData } from '@/lib/types';

const CAPABILITIES = [
  'AI Voice Receptionists',
  'WhatsApp Lead Automation',
  'Business Intelligence Systems',
  'Custom Enterprise Software',
];

interface HeroProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: HeroSectionData;
}

export function Hero({ onOpenQuoteModal, content }: HeroProps = {}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (subIndex === CAPABILITIES[index].length + 1 && !isDeleting) {
      const pause = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pause);
    }
    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % CAPABILITIES.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 30 : 60);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting]);

  const handlePrimaryClick = (e: React.MouseEvent) => {
    if (onOpenQuoteModal) {
      e.preventDefault();
      onOpenQuoteModal('Live Demo');
    }
  };

  return (
    <section 
      id="hero"
      className="relative w-full min-h-[92vh] flex flex-col items-center justify-between overflow-hidden bg-[#f8f9fb] dark:bg-[#07070a] text-neutral-900 dark:text-white pt-32 pb-12 px-6 transition-colors scroll-mt-24"
    >
      {/* 1. 3D Canvas Layer (Strictly behind content, no dark blobs) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 7.2], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <GyroscopeScene />
          </Canvas>
        )}
      </div>

      {/* 2. Hero Content (Clear Stacking Hierarchy) */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto my-auto">
        
        {/* Eyebrow: Floats well above the ring arc */}
        {content?.badgeVisible !== false && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-sm backdrop-blur-md mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-neutral-700 dark:text-neutral-300">
              AI Voice & Business Automation
            </span>
          </div>
        )}

        {/* Headline: Clean, Dominant, Completely Uncut */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-neutral-950 dark:text-white">
          Never Miss Another <br />
          <span className="bg-gradient-to-r from-violet-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
            Opportunity.
          </span>
        </h1>

        {/* Subheading: Crisp and Legible */}
        <p className="mt-5 text-base sm:text-lg font-medium text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
          AI receptionists and intelligent automations that capture leads, handle conversations, and book appointments — around the clock.
        </p>

        {/* Buttons: Cleanly positioned above the typewriter */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={handlePrimaryClick}
            className="px-7 py-3.5 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 font-bold text-sm tracking-wide shadow-xl transition-all active:scale-95"
          >
            Book a Live Demo →
          </button>
          <a 
            href="#voice-demo"
            className="px-7 py-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/60 text-neutral-800 dark:text-white hover:bg-white dark:hover:bg-neutral-800 font-bold text-sm tracking-wide shadow-sm backdrop-blur-md transition-all active:scale-95"
          >
            Hear It in Action →
          </a>
        </div>

      </div>

      {/* 3. Docked Typewriter: Positioned safely below the animation */}
      <div className="relative z-10 mt-10 flex justify-center w-full">
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/95 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 shadow-sm backdrop-blur-md">
          <span className="text-xs sm:text-sm font-bold tracking-wide text-neutral-500 dark:text-neutral-400 select-none">
            We build
          </span>
          <span className="text-xs sm:text-sm font-bold tracking-tight text-blue-600 dark:text-cyan-400 min-h-[1.25rem] flex items-center whitespace-nowrap">
            <span>{CAPABILITIES[index].substring(0, subIndex)}</span>
            <span className="inline-block w-1.5 h-3.5 ml-1 bg-blue-600 dark:bg-cyan-400 animate-pulse flex-shrink-0" />
          </span>
        </div>
      </div>

    </section>
  );
}

export const HeroSection = Hero;
export default Hero;
