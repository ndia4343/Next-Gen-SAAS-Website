'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function useOrbitTexture(isLight: boolean) {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 1024, 0);

    if (isLight) {
      // Premium Light Mode: Deep Electric Royal Blue, Regal Indigo, Rich Violet with crisp Sky Blue accents (No washed-out cyan dominance)
      grad.addColorStop(0.00, '#1e40af');       // Deep Cobalt Blue
      grad.addColorStop(0.12, '#2563eb');       // Electric Royal Blue
      grad.addColorStop(0.22, '#0284c7');       // Rich Ocean Sky Blue (crisp accent)
      grad.addColorStop(0.32, '#38bdf8');       // Sky Blue Shimmer
      grad.addColorStop(0.42, '#1d4ed8');       // Electric Blue
      grad.addColorStop(0.50, 'rgba(29, 78, 216, 0.20)'); // Break gap for motion
      grad.addColorStop(0.58, '#6d28d9');       // Deep Violet
      grad.addColorStop(0.70, '#7c3aed');       // Vibrant Royal Purple
      grad.addColorStop(0.80, '#4338ca');       // Regal Indigo
      grad.addColorStop(0.90, '#1e40af');       // Deep Cobalt Blue
      grad.addColorStop(1.00, '#1e40af');       // Seamless Loop
    } else {
      // Dark Mode: Multi-chromatic Electric Royal Blue + Neon Violet body, with sharp Cyan pulses & White specular flares (Not cyan alone)
      grad.addColorStop(0.00, '#1e3a8a');       // Deep Navy/Royal Blue Base
      grad.addColorStop(0.10, '#1d4ed8');       // Deep Electric Blue
      grad.addColorStop(0.20, '#2563eb');       // Electric Blue Beam
      grad.addColorStop(0.28, '#00f5ff');       // Radiant Cyan Energy Pulse
      grad.addColorStop(0.34, '#ffffff');       // Pure White Specular Flash
      grad.addColorStop(0.40, '#38bdf8');       // Electric Sky Cyan
      grad.addColorStop(0.48, '#2563eb');       // Electric Blue
      grad.addColorStop(0.54, 'transparent');   // Break gap for visible rotation motion
      grad.addColorStop(0.60, '#8b5cf6');       // Neon Violet
      grad.addColorStop(0.70, '#7c3aed');       // Synthwave Purple
      grad.addColorStop(0.80, '#1d4ed8');       // Deep Electric Blue
      grad.addColorStop(0.88, '#3b82f6');       // Royal Blue Flare
      grad.addColorStop(0.94, '#60a5fa');       // Ice Blue Shimmer
      grad.addColorStop(1.00, '#1e3a8a');       // Seamless Loop
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 64);

    // Multi-beam streak layer: Adds horizontal luminous filament lines along the ring's length
    const streakGrad = ctx.createLinearGradient(0, 0, 0, 64);
    if (isLight) {
      streakGrad.addColorStop(0.0, 'rgba(30, 58, 138, 0.15)');
      streakGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      streakGrad.addColorStop(1.0, 'rgba(30, 58, 138, 0.15)');
    } else {
      streakGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.25)');
      streakGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      streakGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.25)');
    }
    ctx.fillStyle = streakGrad;
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillRect(0, 18, 1024, 28);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [isLight]);
}

export function GyroscopeScene({ isLight = false }: { isLight?: boolean }) {
  const orbitTexture = useOrbitTexture(isLight);

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
      <ambientLight intensity={isLight ? 1.1 : 0.6} />
      <pointLight
        color={isLight ? '#1d4ed8' : '#2563eb'}
        intensity={isLight ? 1.6 : 1.2}
        distance={12}
        position={[0, 0, 2]}
      />
      <pointLight
        color={isLight ? '#7c3aed' : '#00f5ff'}
        intensity={isLight ? 1.3 : 1.0}
        distance={10}
        position={[0, -0.5, 1]}
      />
      <pointLight
        color={isLight ? '#4338ca' : '#7c3aed'}
        intensity={isLight ? 1.2 : 0.9}
        distance={10}
        position={[0, 1, -2]}
      />

      {/* Positioned at y = -0.48: frames the text, stays clear of the floating navbar */}
      <group ref={systemRef} position={[0, -0.48, 0]}>
        {/* Central Wireframe Sphere */}
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.85, 2]} />
          <meshBasicMaterial
            color={isLight ? '#5b21b6' : '#a855f7'}
            wireframe
            transparent
            opacity={isLight ? 0.42 : 0.26}
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
                opacity={isLight ? 0.95 : 0.75}
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
                opacity={isLight ? 0.85 : 0.50}
                depthWrite={false}
                blending={blending}
              />
            </mesh>

            {/* Outer Concentric Filament Strand */}
            <mesh>
              <torusGeometry args={[3.28, 0.016, 16, 140]} />
              <meshBasicMaterial
                map={orbitTexture ?? undefined}
                transparent
                opacity={isLight ? 0.80 : 0.45}
                depthWrite={false}
                blending={blending}
              />
            </mesh>

            {/* Atmospheric Depth Halo (Controlled for high contrast on light & dark) */}
            <mesh>
              <torusGeometry args={[3.15, 0.13, 16, 90]} />
              <meshBasicMaterial
                color={isLight ? '#3b82f6' : undefined}
                map={isLight ? undefined : (orbitTexture ?? undefined)}
                transparent
                opacity={isLight ? 0.14 : 0.18}
                depthWrite={false}
                blending={blending}
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
                opacity={isLight ? 0.95 : 0.78}
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
                opacity={isLight ? 0.85 : 0.52}
                depthWrite={false}
                blending={blending}
              />
            </mesh>

            {/* Outer Concentric Filament Strand */}
            <mesh>
              <torusGeometry args={[2.90, 0.018, 16, 140]} />
              <meshBasicMaterial
                map={orbitTexture ?? undefined}
                transparent
                opacity={isLight ? 0.80 : 0.48}
                depthWrite={false}
                blending={blending}
              />
            </mesh>

            {/* Atmospheric Depth Halo */}
            <mesh>
              <torusGeometry args={[2.78, 0.15, 16, 90]} />
              <meshBasicMaterial
                color={isLight ? '#3b82f6' : undefined}
                map={isLight ? undefined : (orbitTexture ?? undefined)}
                transparent
                opacity={isLight ? 0.14 : 0.20}
                depthWrite={false}
                blending={blending}
              />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}

export default GyroscopeScene;