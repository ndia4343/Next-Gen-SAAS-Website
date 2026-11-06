'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useVelocity } from 'framer-motion';

export default function AmbientOrbitalCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Exact Pointer Coordinates (Zero Latency for Click Point Dot)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Damped Coordinates for Orbital Ring (Claude / Anthropic Weight & Inertia)
  const springConfig = { stiffness: 400, damping: 28 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Scroll Velocity Tracking
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 220, damping: 35 });

  // Continuous Angle Tracking for Orbit Satellite
  const orbitRotate = useMotionValue(0);

  // 1. Desktop & Fine Pointer Detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    const updatePointerType = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updatePointerType();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updatePointerType);
      return () => mediaQuery.removeEventListener('change', updatePointerType);
    }
  }, []);

  // 2. Pointer Movement & Window Visibility Listeners
  useEffect(() => {
    if (!isDesktop) return;

    const handlePointerMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Clickable Hover Detection (Button, A, Role Button, Custom Cursor Expand)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor-expand], .cursor-pointer'
      );
      setIsHovered(Boolean(clickable));
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isDesktop, isVisible, mouseX, mouseY]);

  // 3. Scroll Velocity Reaction: Orbital Speed Modulation
  // Stationary: 8s per cycle (45 deg/s)
  // Rapid Scroll: Accelerates up to 1.2s per cycle (300 deg/s)
  useEffect(() => {
    if (!isDesktop) return;

    let lastTime = performance.now();
    let currentAngle = 0;
    let rafId: number;

    const updateOrbit = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const v = Math.abs(smoothVelocity.get() || 0);
      const progress = Math.min(v / 2200, 1);
      const speedDegPerSec = 45 + progress * (300 - 45); // 45 deg/s (8s) to 300 deg/s (1.2s)

      currentAngle = (currentAngle + speedDegPerSec * dt) % 360;
      orbitRotate.set(currentAngle);

      rafId = requestAnimationFrame(updateOrbit);
    };

    rafId = requestAnimationFrame(updateOrbit);
    return () => cancelAnimationFrame(rafId);
  }, [isDesktop, smoothVelocity, orbitRotate]);

  if (!isDesktop) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      
      {/* Outer Orbit Ring (Claude Editorial Aesthetic) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 58 : 34,
          height: isHovered ? 58 : 34,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          width: { type: 'spring', stiffness: 360, damping: 26 },
          height: { type: 'spring', stiffness: 360, damping: 26 },
          opacity: { duration: 0.18 },
        }}
        className={`pointer-events-none fixed top-0 left-0 rounded-full border transition-colors duration-200 flex items-center justify-center ${
          isHovered
            ? 'border-stone-400/35 dark:border-stone-500/35 bg-stone-500/10 dark:bg-stone-400/10 backdrop-blur-[2px]'
            : 'border-stone-400/50 dark:border-stone-600/50 bg-stone-500/5 dark:bg-stone-400/5'
        }`}
      >
        {/* Dynamic Rotating Orbital Axis */}
        <motion.div
          style={{ rotate: orbitRotate }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* The Orbiting Satellite (4px Claude Terracotta / Warm Clay Dot) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#D97757] shadow-[0_0_8px_rgba(217,119,87,0.9)]" />
        </motion.div>
      </motion.div>

      {/* Center Precision Click Dot (Zero-Latency Exact Click Point) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovered ? 0.75 : 1,
        }}
        transition={{ duration: 0.12 }}
        className="pointer-events-none fixed top-0 left-0 w-1 h-1 rounded-full bg-stone-800 dark:bg-stone-100 shadow-xs"
      />

    </div>
  );
}
