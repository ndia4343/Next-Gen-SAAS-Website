"use client";

import "@/lib/react-19-polyfill";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, AdaptiveDpr, Preload } from "@react-three/drei";
import NeuralCoreMesh from "./NeuralCoreMesh";
import PostProcessing from "./PostProcessing";

export default function SceneCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#060609]">
      <Canvas
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.8]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={45} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[0, 0, 2]} intensity={1.5} color="#DC2626" />

        <Suspense fallback={null}>
          <NeuralCoreMesh />
          <PostProcessing />
          <AdaptiveDpr pixelated />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
