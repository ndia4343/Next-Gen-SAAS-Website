'use client';

import '@/lib/react-19-polyfill';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function OrbitScene() {
  const sphereRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (sphereRef.current) sphereRef.current.rotation.y += delta * 0.15;
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.1;
      ringRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      {/* Electric Orange warm inner core glow */}
      <pointLight color="#ff5722" intensity={1.8} distance={8} />

      {/* Wireframe Sphere */}
      <mesh ref={sphereRef}>
        <icosahedronGeometry args={[2.2, 2]} />
        <meshBasicMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Neon Purple Orbit Ring */}
      <mesh ref={ringRef} rotation={[1.2, 0.4, 0]}>
        <torusGeometry args={[3.6, 0.04, 16, 100]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

export default function BackgroundOrbit() {
  const [mounted, setMounted] = useState(false);

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
      {/* Subtle radial glow in dark mode to restore ambient tech depth */}
      <div className="absolute inset-0 hidden dark:block pointer-events-none [background:radial-gradient(ellipse_at_top,rgba(124,58,237,0.08),transparent_70%)]" />
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <OrbitScene />
      </Canvas>
    </div>
  );
}
