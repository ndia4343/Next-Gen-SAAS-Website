'use client';

import '@/lib/react-19-polyfill';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/components/providers/ThemeProvider';

export function GyroscopeScene({ isLight }: { isLight: boolean }) {
  const systemRef = useRef<THREE.Group>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Anti-gravity hover
    if (systemRef.current) {
      systemRef.current.position.y = Math.sin(t * 0.75) * 0.12;
    }

    // 2. Violet core slow continuous rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.12;
    }

    // 3. Ring 1 (Forward diagonal plane: ~40°)
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = 0.7 + Math.sin(t * 0.35) * 0.06;
      ring1Ref.current.rotation.y = 0.35 + Math.cos(t * 0.25) * 0.05;
      ring1Ref.current.rotation.z += delta * 0.16;
    }

    // 4. Ring 2 (Opposing intersecting diagonal plane: ~38° — NEVER vertical)
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -0.65 + Math.cos(t * 0.3) * 0.06;
      ring2Ref.current.rotation.y = -0.55 + Math.sin(t * 0.2) * 0.05;
      ring2Ref.current.rotation.z -= delta * 0.12;
    }
  });

  const blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    <>
      <ambientLight intensity={isLight ? 0.8 : 0.5} />
      <pointLight color="#8b5cf6" intensity={isLight ? 1.5 : 1.0} distance={10} />

      <group ref={systemRef} position={[0, 0, 0]}>
        {/* Central Wireframe Sphere: Synthwave Violet */}
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[2.2, 2]} />
          <meshBasicMaterial
            color={isLight ? '#6d28d9' : '#a855f7'}
            wireframe
            transparent
            opacity={isLight ? 0.6 : 0.35}
            depthWrite={false}
            blending={blending}
          />
        </mesh>

        {/* Ring 1 (Royal Indigo-Violet Orbit): Ultra-Thin Laser Profile */}
        <mesh ref={ring1Ref} position={[0, 0, 0]}>
          <torusGeometry args={[3.4, 0.016, 16, 120]} />
          <meshBasicMaterial
            color={isLight ? '#5b21b6' : '#7c3aed'}
            transparent
            opacity={isLight ? 0.75 : 0.42}
            depthWrite={false}
            blending={blending}
          />
        </mesh>

        {/* Ring 2 (Electric Cyan / Ice-Blue Counter-Orbit): Delicate Laser Profile */}
        <mesh ref={ring2Ref} position={[0, 0, 0]}>
          <torusGeometry args={[3.7, 0.014, 16, 120]} />
          <meshBasicMaterial
            color={isLight ? '#0284c7' : '#38bdf8'}
            transparent
            opacity={isLight ? 0.7 : 0.28}
            depthWrite={false}
            blending={blending}
          />
        </mesh>
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
