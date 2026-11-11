'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { GyroscopeScene } from '@/components/canvas/GyroscopeScene';

interface Hero3DCanvasProps {
  isLight: boolean;
}

export default function Hero3DCanvas({ isLight }: Hero3DCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <GyroscopeScene isLight={isLight} />
    </Canvas>
  );
}