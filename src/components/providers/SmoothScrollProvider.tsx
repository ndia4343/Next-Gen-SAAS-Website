"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface SmoothScrollContextType {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Instantiate Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // 2. Hook lenis.on('scroll', ScrollTrigger.update)
    lenis.on("scroll", ScrollTrigger.update);

    // 3. Hook gsap.ticker.add((time) => lenis.raf(time * 1000))
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);

    // 4. Set gsap.ticker.lagSmoothing(0) to prevent 3D WebGL camera drift against DOM scroll coordinates
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
