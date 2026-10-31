'use client';

import '@/lib/react-19-polyfill';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/components/providers/ThemeProvider';

function useOrbitTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0.0, '#8b5cf6'); // Neon Violet
    grad.addColorStop(0.28, '#38bdf8'); // Electric Cyan
    grad.addColorStop(0.5, '#7c3aed'); // Deep Indigo
    grad.addColorStop(0.78, '#22d3ee'); // Ice Blue Glow
    grad.addColorStop(1.0, '#8b5cf6');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 16);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);
}

export function GyroscopeScene({ isLight = false }: { isLight?: boolean }) {
  const orbitTexture = useOrbitTexture();

  const systemRef = useRef<THREE.Group>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  const ring1MeshRef = useRef<THREE.Mesh>(null!);
  const ring2MeshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle vertical hover (anti-gravity)
    if (systemRef.current) {
      systemRef.current.position.y = -0.25 + Math.sin(t * 0.7) * 0.08;
    }

    // Slow sphere rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.12;
    }

    // Smooth orbital counter-rotation along local disk
    if (ring1MeshRef.current) ring1MeshRef.current.rotation.z += delta * 0.35;
    if (ring2MeshRef.current) ring2MeshRef.current.rotation.z -= delta * 0.25;
  });

  const blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    <>
      <ambientLight intensity={isLight ? 0.8 : 0.5} />
      <pointLight color="#8b5cf6" intensity={isLight ? 1.5 : 1.0} distance={10} />

      {/* Base position shifted to [0, -0.25, 0] to guarantee clearance under navbar */}
      <group ref={systemRef} position={[0, -0.25, 0]}>
        {/* Central Wireframe Sphere */}
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[2.0, 2]} />
          <meshBasicMaterial
            color={isLight ? '#6d28d9' : '#a855f7'}
            wireframe
            transparent
            opacity={isLight ? 0.6 : 0.32}
            depthWrite={false}
            blending={blending}
          />
        </mesh>

        {/* Ring 1: Midway diagonal tilt (48° pitch, +25° roll) */}
        <group rotation={[0.84, 0, 0.44]}>
          <mesh ref={ring1MeshRef}>
            {/* Scaled down from 3.4 to 2.85 to eliminate navbar collision */}
            <torusGeometry args={[2.85, 0.014, 16, 120]} />
            <meshBasicMaterial
              map={orbitTexture ?? undefined}
              transparent
              opacity={isLight ? 0.82 : 0.42}
              depthWrite={false}
              blending={blending}
            />
          </mesh>
        </group>

        {/* Ring 2: Midway diagonal tilt (48° pitch, -25° roll — 50° total scissor gap) */}
        <group rotation={[0.84, 0, -0.44]}>
          <mesh ref={ring2MeshRef}>
            {/* Scaled down from 3.65 to 3.10 */}
            <torusGeometry args={[3.1, 0.013, 16, 120]} />
            <meshBasicMaterial
              map={orbitTexture ?? undefined}
              transparent
              opacity={isLight ? 0.75 : 0.36}
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
