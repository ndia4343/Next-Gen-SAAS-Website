'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function useOrbitTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Glowing Neon Blend: Electric Blue -> Vivid Cyan -> White Core Specular -> Violet
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0.00, '#1d4ed8');       // Deep Electric Blue
    grad.addColorStop(0.12, '#2563eb');       // Electric Blue Beam
    grad.addColorStop(0.24, '#00f5ff');       // Radiant Electric Cyan
    grad.addColorStop(0.34, '#ffffff');       // Pure White Specular Core Flare
    grad.addColorStop(0.42, '#38bdf8');       // Electric Cyan Pulse
    grad.addColorStop(0.50, 'transparent');   // Break gap for visible rotation motion
    grad.addColorStop(0.60, '#7c3aed');       // Neon Violet
    grad.addColorStop(0.72, '#2563eb');       // Electric Royal Blue
    grad.addColorStop(0.84, '#00f5ff');       // Cyan Beam
    grad.addColorStop(0.92, '#e0f2fe');       // Ice White Shimmer
    grad.addColorStop(1.00, '#1d4ed8');       // Seamless Loop

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
  const ring1GlowRef = useRef<THREE.Mesh>(null!);
  const ring2GlowRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle anti-gravity vertical float (docked at y = -0.48 for clean text framing and navbar clearance)
    if (systemRef.current) {
      systemRef.current.position.y = -0.48 + Math.sin(t * 0.7) * 0.05;
    }

    // Slow continuous sphere rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.12;
    }

    // Ring 1 counter-rotational spin
    if (ring1MeshRef.current) {
      ring1MeshRef.current.rotation.z += delta * 0.25;
    }
    if (ring1GlowRef.current) {
      ring1GlowRef.current.rotation.z += delta * 0.25;
    }

    // Ring 2 counter-rotational spin
    if (ring2MeshRef.current) {
      ring2MeshRef.current.rotation.z -= delta * 0.20;
    }
    if (ring2GlowRef.current) {
      ring2GlowRef.current.rotation.z -= delta * 0.20;
    }

    // Continuous visible pulse travel along circumference
    if (orbitTexture) {
      orbitTexture.offset.x = (orbitTexture.offset.x + delta * 0.16) % 1;
    }
  });

  const blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    <>
      <ambientLight intensity={isLight ? 0.9 : 0.6} />
      <pointLight color="#00f5ff" intensity={isLight ? 1.4 : 1.2} distance={12} position={[0, 0, 2]} />
      <pointLight color="#2563eb" intensity={isLight ? 1.0 : 0.8} distance={9} position={[0, -0.5, 1]} />
      <pointLight color="#7c3aed" intensity={isLight ? 1.2 : 0.8} distance={10} position={[0, 1, -2]} />

      {/* Positioned at y = -0.48: frames the text, stays clear of the navbar */}
      <group ref={systemRef} position={[0, -0.48, 0]}>
        {/* Central Wireframe Sphere */}
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.85, 2]} />
          <meshBasicMaterial
            color={isLight ? '#6d28d9' : '#a855f7'}
            wireframe
            transparent
            opacity={isLight ? 0.45 : 0.25}
            depthWrite={false}
            blending={blending}
          />
        </mesh>

        {/* Ring 1: Horizontal Saturn-Style Disc Ring (Tilted forward ~74°) */}
        <group rotation={[1.29, 0, -0.07]}>
          {/* Main Core Tube */}
          <mesh ref={ring1MeshRef}>
            <torusGeometry args={[3.20, 0.024, 16, 140]} />
            <meshBasicMaterial
              map={orbitTexture ?? undefined}
              transparent
              opacity={isLight ? 0.85 : 0.58}
              depthWrite={false}
              blending={blending}
            />
          </mesh>
          {/* Soft Outer Neon Glow Halo (Toned down for text legibility) */}
          <mesh ref={ring1GlowRef}>
            <torusGeometry args={[3.20, 0.052, 16, 90]} />
            <meshBasicMaterial
              map={orbitTexture ?? undefined}
              transparent
              opacity={isLight ? 0.20 : 0.16}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>

        {/* Ring 2: Steep Diagonal / Upright Ribbon Slicing Across Center */}
        <group rotation={[0.65, 0.16, 0.55]}>
          {/* Main Core Tube */}
          <mesh ref={ring2MeshRef}>
            <torusGeometry args={[2.82, 0.034, 16, 140]} />
            <meshBasicMaterial
              map={orbitTexture ?? undefined}
              transparent
              opacity={isLight ? 0.88 : 0.64}
              depthWrite={false}
              blending={blending}
            />
          </mesh>
          {/* Soft Outer Neon Glow Halo (Toned down for text legibility) */}
          <mesh ref={ring2GlowRef}>
            <torusGeometry args={[2.82, 0.068, 16, 90]} />
            <meshBasicMaterial
              map={orbitTexture ?? undefined}
              transparent
              opacity={isLight ? 0.24 : 0.18}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}

export default GyroscopeScene;
