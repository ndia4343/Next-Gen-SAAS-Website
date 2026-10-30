'use client';

import "@/lib/react-19-polyfill";
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload, PerspectiveCamera } from '@react-three/drei';
import NeuralCoreMesh from './NeuralCoreMesh';
import PostProcessing from './PostProcessing';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function SceneCanvas() {
  const { theme, mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 opacity-30 dark:opacity-35 w-screen h-screen overflow-hidden">
      <Canvas
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.8]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6.0]} fov={45} />
        <ambientLight intensity={isLight ? 0.85 : 0.4} />
        <directionalLight position={[10, 10, 5]} intensity={isLight ? 1.6 : 1.2} color="#ffffff" />
        <directionalLight
          position={[-10, -5, -5]}
          intensity={isLight ? 2.4 : 1.8}
          color={theme?.lightTint3D || '#DC2626'}
        />
        <pointLight
          position={[0, 0, 0]}
          intensity={isLight ? 2.6 : 2.0}
          color={theme?.secondary || '#FF6B00'}
          distance={isLight ? 7.5 : 6}
        />

        <Suspense fallback={null}>
          <NeuralCoreMesh theme={theme} mode={mode} />
          <PostProcessing />
        </Suspense>

        <AdaptiveDpr pixelated />
        <Preload all />
      </Canvas>
    </div>
  );
}
