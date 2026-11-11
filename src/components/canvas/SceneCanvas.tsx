'use client';

import "@/lib/react-19-polyfill";
import React, { Suspense, useState, useEffect, Component, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import NeuralCoreMesh from './NeuralCoreMesh';
import PostProcessing from './PostProcessing';
import { useTheme } from '@/components/providers/ThemeProvider';

// Graceful Error Boundary to catch GPU / WebGL Shader compilation crashes
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn("WebGL Canvas failed to render context:", error);
  }
  render() {
    if (this.state.hasError) {
      return null; // Fail silently without breaking the website DOM
    }
    return this.props.children;
  }
}

interface SceneCanvasProps {
  className?: string;
}

export default function SceneCanvas({
  className = "w-full h-full pointer-events-none flex items-center justify-center",
}: SceneCanvasProps) {
  const { theme, mode } = useTheme();
  const isLight = mode === 'light';

  // Prevent Next.js SSR from attempting to execute R3F Canvas before hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} />;
  }

  // Precision palette: Silver base with neon purple accent and subtle ice blue rim
  const purpleAccent = theme?.primary || '#9333EA';
  const iceBlueAccent = theme?.secondary || '#38BDF8';

  return (
    <div className={className}>
      <CanvasErrorBoundary>
        <Canvas
          className="w-full h-full pointer-events-none"
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
          }}
          dpr={[1, 1.5]} // Restrict upper DPR to 1.5 to protect laptop iGPUs
        >
          
          {/* Base Ambient & Key Studio Lighting */}
          <ambientLight intensity={isLight ? 0.9 : 0.45} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={isLight ? 1.5 : 1.2} 
            color="#ffffff" 
          />
          
          {/* Neon Purple Backlight / Rim Fill */}
          <directionalLight
            position={[-10, -5, -5]}
            intensity={isLight ? 2.2 : 1.8}
            color={purpleAccent}
          />
          
          {/* Core Specular Point Light (Ice Blue / Cyan Glow) */}
          <pointLight
            position={[0, 0, 0]}
            intensity={isLight ? 2.4 : 1.9}
            color={iceBlueAccent}
            distance={isLight ? 7.5 : 6}
          />

          <Suspense fallback={null}>
            <NeuralCoreMesh theme={theme} mode={mode} />
            <PostProcessing />
          </Suspense>

          <AdaptiveDpr pixelated />
          <Preload all />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}