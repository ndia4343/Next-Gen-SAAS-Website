'use client';

import '@/lib/react-19-polyfill';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/components/providers/ThemeProvider';

function OrbitScene({ isLight }: { isLight: boolean }) {
  const sphereRef = useRef<THREE.Mesh>(null!);
  const innerSphereRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (sphereRef.current) sphereRef.current.rotation.y += delta * 0.15;
    if (innerSphereRef.current) innerSphereRef.current.rotation.y -= delta * 0.2;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.1;
      ring1Ref.current.rotation.x += delta * 0.05;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.08;
      ring2Ref.current.rotation.z += delta * 0.06;
    }
  });

  return (
    <>
      <ambientLight intensity={isLight ? 0.9 : 0.6} />
      {/* Electric Orange warm inner core glow */}
      <pointLight color="#ff5722" intensity={isLight ? 2.5 : 1.8} distance={isLight ? 10 : 8} />

      {/* Inner Electric Orange Warm Core */}
      <mesh ref={innerSphereRef}>
        <icosahedronGeometry args={[1.0, 1]} />
        <meshBasicMaterial
          color={isLight ? "#f97316" : "#ff5722"}
          wireframe
          transparent
          opacity={isLight ? 0.65 : 0.3}
          depthWrite={false}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </mesh>

      {/* Central Wireframe Sphere: Synthwave Violet */}
      <mesh ref={sphereRef}>
        <icosahedronGeometry args={[2.2, 2]} />
        <meshBasicMaterial
          color={isLight ? "#6d28d9" : "#a855f7"}
          wireframe
          transparent
          opacity={isLight ? 0.72 : 0.38}
          depthWrite={false}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </mesh>

      {/* Primary Orbit Ring 1 (Outer Diagonal Tilt): Royal Indigo-Violet */}
      <mesh ref={ring1Ref} rotation={[1.1, 0.4, 0]}>
        <torusGeometry args={[3.6, isLight ? 0.055 : 0.035, 16, 120]} />
        <meshBasicMaterial
          color={isLight ? "#5b21b6" : "#7c3aed"}
          transparent
          opacity={isLight ? 0.88 : 0.42}
          depthWrite={false}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </mesh>

      {/* Secondary Orbit Ring 2 (Intersecting Counter-Angle): Neon Violet */}
      <mesh ref={ring2Ref} rotation={[-0.8, 1.2, 0.5]}>
        <torusGeometry args={[3.8, isLight ? 0.05 : 0.03, 16, 120]} />
        <meshBasicMaterial
          color={isLight ? "#7c3aed" : "#8b5cf6"}
          transparent
          opacity={isLight ? 0.85 : 0.35}
          depthWrite={false}
          blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </mesh>
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
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.14),rgba(139,92,246,0.06)_50%,transparent_85%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.18),rgba(139,92,246,0.08)_50%,transparent_85%)]" />

      {/* Sphere Center Aura */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.16)_0%,rgba(249,115,22,0.06)_35%,rgba(99,102,241,0.04)_55%,transparent_75%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.24)_0%,rgba(99,102,241,0.08)_45%,transparent_70%)]" />

      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <OrbitScene key={isLight ? 'light' : 'dark'} isLight={isLight} />
      </Canvas>
    </div>
  );
}
