'use client';

import '@/lib/react-19-polyfill';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/components/providers/ThemeProvider';

// Generate circular gradient texture (Purple -> Cyan -> Purple)
function useOrbitGradient() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0.0, '#8b5cf6'); // Neon Violet
    grad.addColorStop(0.25, '#38bdf8'); // Electric Cyan
    grad.addColorStop(0.5, '#7c3aed'); // Deep Indigo-Purple
    grad.addColorStop(0.75, '#22d3ee'); // Ice Blue
    grad.addColorStop(1.0, '#8b5cf6'); // Wrap back to Violet

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 16);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);
}

export function GyroscopeScene({ isLight = false }: { isLight?: boolean }) {
  const gradientTexture = useOrbitGradient();

  const systemRef = useRef<THREE.Group>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  const ring1MeshRef = useRef<THREE.Mesh>(null!);
  const ring2MeshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Gentle anti-gravity vertical float
    if (systemRef.current) {
      systemRef.current.position.y = Math.sin(t * 0.7) * 0.1;
    }

    // 2. Slow sphere rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.1;
    }

    // 3. Smooth, stable orbit rotation along local ring plane (NO WOBBLE)
    if (ring1MeshRef.current) {
      ring1MeshRef.current.rotation.z += delta * 0.22;
    }
    if (ring2MeshRef.current) {
      ring2MeshRef.current.rotation.z -= delta * 0.18;
    }
  });

  const blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    <>
      <ambientLight intensity={isLight ? 0.8 : 0.5} />
      <pointLight color="#8b5cf6" intensity={isLight ? 1.5 : 1.0} distance={10} />

      <group ref={systemRef} position={[0, 0, 0]}>
        {/* Central Wireframe Sphere */}
        <mesh ref={sphereRef}>
          <icosahedronGeometry args={[2.2, 2]} />
          <meshBasicMaterial
            color={isLight ? '#6d28d9' : '#a855f7'}
            wireframe
            transparent
            opacity={isLight ? 0.6 : 0.32}
            depthWrite={false}
            blending={blending}
          />
        </mesh>

        {/* Orbit 1: Locked Diagonal Tilt Group (~45°) */}
        <group rotation={[0.75, 0.45, 0]}>
          <mesh ref={ring1MeshRef}>
            <torusGeometry args={[3.45, 0.016, 16, 120]} />
            <meshBasicMaterial
              map={gradientTexture ?? undefined}
              transparent
              opacity={isLight ? 0.82 : 0.45}
              depthWrite={false}
              blending={blending}
            />
          </mesh>
        </group>

        {/* Orbit 2: Locked Counter-Angle Intersecting Group (~-40°) */}
        <group rotation={[-0.7, -0.5, 0.3]}>
          <mesh ref={ring2MeshRef}>
            <torusGeometry args={[3.75, 0.014, 16, 120]} />
            <meshBasicMaterial
              map={gradientTexture ?? undefined}
              transparent
              opacity={isLight ? 0.75 : 0.38}
              depthWrite={false}
              blending={blending}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}

export default function BackgroundOrbit() {
  const [mounted, setMounted] = useState(false);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient Synthwave Radial Flare (Behind Canvas) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.12),rgba(139,92,246,0.05)_50%,transparent_85%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.18),rgba(139,92,246,0.08)_50%,transparent_85%)]" />

      {/* Sphere Center Aura */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.12)_0%,rgba(34,211,238,0.04)_35%,rgba(99,102,241,0.05)_55%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.22)_0%,rgba(34,211,238,0.05)_35%,rgba(99,102,241,0.08)_55%,transparent_70%)]" />

      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <GyroscopeScene key={isLight ? 'light' : 'dark'} isLight={isLight} />
      </Canvas>
    </div>
  );
}
