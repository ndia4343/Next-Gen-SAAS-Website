'use client';

import '@/lib/react-19-polyfill';
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTheme } from '@/components/providers/ThemeProvider';
import { GyroscopeScene } from './GyroscopeScene';

export { GyroscopeScene };

export function GyroscopeCanvas() {
  const [mounted, setMounted] = useState(false);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D Canvas sits directly on the single unified website background (no bluish flares) */}
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <GyroscopeScene key={isLight ? 'light' : 'dark'} isLight={isLight} />
      </Canvas>
    </div>
  );
}

export default GyroscopeCanvas;