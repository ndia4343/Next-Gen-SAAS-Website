'use client';

import "@/lib/react-19-polyfill";
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload, PerspectiveCamera } from '@react-three/drei';
import NeuralCoreMesh from './NeuralCoreMesh';
import PostProcessing from './PostProcessing';

export default function SceneCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-screen h-screen overflow-hidden">
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
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={45} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-10, -5, -5]} intensity={1.8} color="#DC2626" />
        <pointLight position={[0, 0, 0]} intensity={2.0} color="#FF6B00" distance={6} />

        <Suspense fallback={null}>
          <NeuralCoreMesh />
          <PostProcessing />
        </Suspense>

        <AdaptiveDpr pixelated />
        <Preload all />
      </Canvas>
    </div>
  );
}
