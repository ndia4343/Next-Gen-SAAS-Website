'use client';

import "@/lib/react-19-polyfill";
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload, PerspectiveCamera } from '@react-three/drei';
import NeuralCoreMesh from './NeuralCoreMesh';
import PostProcessing from './PostProcessing';
import { useTheme } from '@/components/providers/ThemeProvider';

interface SceneCanvasProps {
  className?: string;
}

export default function SceneCanvas({
  className = "w-full h-full pointer-events-none flex items-center justify-center",
}: SceneCanvasProps) {
  const { theme, mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <div className={className}>
      <Canvas
        className="w-full h-full pointer-events-none"
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        dpr={[1, 1.8]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5.2]} fov={45} />
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
