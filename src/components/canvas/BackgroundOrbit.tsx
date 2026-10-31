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
    canvas.width = 1024;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Two-tone gradient with distinct light pulses so motion is immediately visible
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0.0, '#8b5cf6');   // Neon Violet
    grad.addColorStop(0.22, '#38bdf8');  // Electric Cyan Beam
    grad.addColorStop(0.45, 'transparent'); // Break gap for visible rotation
    grad.addColorStop(0.65, '#a855f7');  // Synthwave Violet
    grad.addColorStop(0.85, '#22d3ee');  // Bright Cyan Pulse
    grad.addColorStop(1.0, '#8b5cf6');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 32);

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

    // 1. Subtle anti-gravity vertical float (docked at -0.4 to clear the navbar)
    if (systemRef.current) {
      systemRef.current.position.y = -0.4 + Math.sin(t * 0.7) * 0.06;
    }

    // 2. Slow sphere rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.12;
    }

    // 3. Counter-rotational orbital speeds
    if (ring1MeshRef.current) {
      ring1MeshRef.current.rotation.z += delta * 0.28;
    }
    if (ring2MeshRef.current) {
      ring2MeshRef.current.rotation.z -= delta * 0.22;
    }

    // 4. Texture UV offset animation (guarantees traveling light pulses)
    if (orbitTexture) {
      orbitTexture.offset.x = (orbitTexture.offset.x + delta * 0.16) % 1;
    }
  });

  const blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    <>
      <ambientLight intensity={isLight ? 0.8 : 0.5} />
      <pointLight color="#8b5cf6" intensity={isLight ? 1.5 : 1.0} distance={10} />

      {/* Docked system group anchored low to prevent clipping floating navbar */}
      <group ref={systemRef} position={[0, -0.4, 0]}>
        {/* Central Wireframe Sphere */}
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[2.0, 2]} />
          <meshBasicMaterial
            color={isLight ? '#6d28d9' : '#a855f7'}
            wireframe
            transparent
            opacity={isLight ? 0.6 : 0.3}
            depthWrite={false}
            blending={blending}
          />
        </mesh>

        {/* Ring 1: Thin Near-Horizontal Equatorial Ring (Saturn Style) */}
        <group rotation={[1.30, 0, -0.1]}>
          <mesh ref={ring1MeshRef}>
            <torusGeometry args={[3.2, 0.012, 16, 120]} />
            <meshBasicMaterial
              map={orbitTexture ?? undefined}
              transparent
              opacity={isLight ? 0.8 : 0.38}
              depthWrite={false}
              blending={blending}
            />
          </mesh>
        </group>

        {/* Ring 2: Noticeably Broader Diagonal Ribbon Slicing Upward */}
        <group rotation={[0.70, 0.15, 0.72]}>
          <mesh ref={ring2MeshRef}>
            <torusGeometry args={[2.8, 0.034, 16, 120]} />
            <meshBasicMaterial
              map={orbitTexture ?? undefined}
              transparent
              opacity={isLight ? 0.85 : 0.45}
              depthWrite={false}
              blending={blending}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}

export function GyroscopeCanvas() {
  const [mounted, setMounted] = useState(false);
  const { mode } = useTheme();
  const isLight = mode === 'light';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
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

export default GyroscopeCanvas;
