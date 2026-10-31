'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function useOrbitTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Glowing Neon Blend matching reference: Electric Cyan + White Specular Core + Electric Blue + Violet
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0.00, '#00f5ff');       // Radiant Electric Cyan
    grad.addColorStop(0.08, '#ffffff');       // Pure White Specular Flash
    grad.addColorStop(0.18, '#38bdf8');       // Vivid Cyan Beam
    grad.addColorStop(0.28, '#2563eb');       // Electric Blue
    grad.addColorStop(0.38, '#1d4ed8');       // Deep Electric Royal Blue
    grad.addColorStop(0.48, 'transparent');   // Break gap for visible rotation motion
    grad.addColorStop(0.56, '#7c3aed');       // Synthwave Violet
    grad.addColorStop(0.66, '#2563eb');       // Electric Blue Beam
    grad.addColorStop(0.76, '#00f5ff');       // Electric Cyan Pulse
    grad.addColorStop(0.85, '#ffffff');       // Brilliant White Specular Flare
    grad.addColorStop(0.92, '#38bdf8');       // Electric Cyan
    grad.addColorStop(1.00, '#00f5ff');       // Seamless Loop

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 64);

    // Multi-beam streak layer: Adds horizontal luminous filament lines along the ring's length
    const streakGrad = ctx.createLinearGradient(0, 0, 0, 64);
    streakGrad.addColorStop(0.0, 'rgba(255,255,255,0.3)');
    streakGrad.addColorStop(0.5, 'rgba(255,255,255,1.0)');
    streakGrad.addColorStop(1.0, 'rgba(255,255,255,0.3)');
    ctx.fillStyle = streakGrad;
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillRect(0, 18, 1024, 28);

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
  const ring1MeshesRef = useRef<THREE.Group>(null!);
  const ring2MeshesRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle anti-gravity vertical float (docked at y = -0.48 for clean text framing and navbar clearance)
    if (systemRef.current) {
      systemRef.current.position.y = -0.48 + Math.sin(t * 0.7) * 0.05;
    }

    // Slow continuous sphere rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.12;
      sphereRef.current.rotation.x += delta * 0.04;
    }

    // Ring 1 counter-rotational spin
    if (ring1MeshesRef.current) {
      ring1MeshesRef.current.rotation.z += delta * 0.22;
    }

    // Ring 2 counter-rotational spin
    if (ring2MeshesRef.current) {
      ring2MeshesRef.current.rotation.z -= delta * 0.18;
    }

    // Continuous visible pulse travel along circumference
    if (orbitTexture) {
      orbitTexture.offset.x = (orbitTexture.offset.x + delta * 0.18) % 1;
    }
  });

  const blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    <>
      <ambientLight intensity={isLight ? 0.9 : 0.6} />
      <pointLight color="#00f5ff" intensity={isLight ? 1.5 : 1.3} distance={12} position={[0, 0, 2]} />
      <pointLight color="#2563eb" intensity={isLight ? 1.2 : 1.0} distance={10} position={[0, -0.5, 1]} />
      <pointLight color="#7c3aed" intensity={isLight ? 1.2 : 0.9} distance={10} position={[0, 1, -2]} />

      {/* Positioned at y = -0.48: frames the text, stays clear of the floating navbar */}
      <group ref={systemRef} position={[0, -0.48, 0]}>
        {/* Central Wireframe Sphere */}
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.85, 2]} />
          <meshBasicMaterial
            color={isLight ? '#6d28d9' : '#a855f7'}
            wireframe
            transparent
            opacity={isLight ? 0.45 : 0.28}
            depthWrite={false}
            blending={blending}
          />
        </mesh>

        {/* Ring 1: Horizontal Saturn-Style Disc Ring (Tilted forward ~75°) */}
        <group rotation={[1.32, 0, -0.06]}>
          <group ref={ring1MeshesRef}>
            {/* Core Radiant Tube */}
            <mesh>
              <torusGeometry args={[3.15, 0.055, 24, 160]} />
              <meshBasicMaterial
                map={orbitTexture ?? undefined}
                transparent
                opacity={isLight ? 0.90 : 0.72}
                depthWrite={false}
                blending={blending}
              />
            </mesh>

            {/* Inner Concentric Filament Strand */}
            <mesh>
              <torusGeometry args={[3.02, 0.018, 16, 140]} />
              <meshBasicMaterial
                map={orbitTexture ?? undefined}
                transparent
                opacity={isLight ? 0.75 : 0.48}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Outer Concentric Filament Strand */}
            <mesh>
              <torusGeometry args={[3.28, 0.016, 16, 140]} />
              <meshBasicMaterial
                map={orbitTexture ?? undefined}
                transparent
                opacity={isLight ? 0.75 : 0.45}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Soft Atmospheric Neon Aura Halo (Controlled glow to ensure text legibility) */}
            <mesh>
              <torusGeometry args={[3.15, 0.14, 16, 90]} />
              <meshBasicMaterial
                map={orbitTexture ?? undefined}
                transparent
                opacity={isLight ? 0.22 : 0.18}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        </group>

        {/* Ring 2: Diagonal Slicing Ribbon (Tilted up to the right / across center) */}
        <group rotation={[0.72, -0.14, -0.62]}>
          <group ref={ring2MeshesRef}>
            {/* Core Radiant Tube */}
            <mesh>
              <torusGeometry args={[2.78, 0.065, 24, 160]} />
              <meshBasicMaterial
                map={orbitTexture ?? undefined}
                transparent
                opacity={isLight ? 0.92 : 0.78}
                depthWrite={false}
                blending={blending}
              />
            </mesh>

            {/* Inner Concentric Filament Strand */}
            <mesh>
              <torusGeometry args={[2.66, 0.020, 16, 140]} />
              <meshBasicMaterial
                map={orbitTexture ?? undefined}
                transparent
                opacity={isLight ? 0.78 : 0.52}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Outer Concentric Filament Strand */}
            <mesh>
              <torusGeometry args={[2.90, 0.018, 16, 140]} />
              <meshBasicMaterial
                map={orbitTexture ?? undefined}
                transparent
                opacity={isLight ? 0.75 : 0.48}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Soft Atmospheric Neon Aura Halo (Controlled glow to ensure text legibility) */}
            <mesh>
              <torusGeometry args={[2.78, 0.16, 16, 90]} />
              <meshBasicMaterial
                map={orbitTexture ?? undefined}
                transparent
                opacity={isLight ? 0.24 : 0.20}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}

export default GyroscopeScene;