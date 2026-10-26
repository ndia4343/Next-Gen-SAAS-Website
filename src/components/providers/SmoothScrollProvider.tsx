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
    // 1. Ensure ScrollTrigger is registered on the client
    gsap.registerPlugin(ScrollTrigger);

    // 2. Instantiate Lenis with smooth physics
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

    // 3. Wire lenis.on('scroll', ScrollTrigger.update)
    lenis.on("scroll", ScrollTrigger.update);

    // 4. Drive lenis.raf(time * 1000) inside gsap.ticker.add()
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);

    // 5. Configure gsap.ticker.lagSmoothing(0) to prevent WebGL camera drift against DOM
    gsap.ticker.lagSmoothing(0);

    // 6. Call ScrollTrigger.refresh() after component mount and DOM layout
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(refreshTimeout);
      window.removeEventListener("resize", handleResize);
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
