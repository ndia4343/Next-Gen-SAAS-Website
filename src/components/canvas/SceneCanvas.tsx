"use client";

import "@/lib/react-19-polyfill";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, AdaptiveDpr, Preload } from "@react-three/drei";
import NeuralCoreMesh from "./NeuralCoreMesh";
import PostProcessing from "./PostProcessing";

export default function SceneCanvas() {
  return (
    <div className="fixed inset-0 top-0 left-0 w-screen h-screen pointer-events-none z-0 overflow-hidden bg-[#060609]">
      <Canvas
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.8]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={45} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-10, -5, -5]} intensity={2.5} color="#DC2626" />

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
