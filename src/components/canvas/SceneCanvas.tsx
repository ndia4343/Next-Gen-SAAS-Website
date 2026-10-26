"use client";

import "@/lib/react-19-polyfill";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, AdaptiveDpr, Preload } from "@react-three/drei";
import NeuralCoreMesh from "./NeuralCoreMesh";
import PostProcessing from "./PostProcessing";

export default function SceneCanvas() {
  return (
    <div className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden bg-[#060609]">
      <Canvas
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.8]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={45} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, -5, -3]} intensity={0.5} color="#00B4D8" />
        <pointLight position={[0, 0, 2]} intensity={2.0} color="#DC2626" />

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
