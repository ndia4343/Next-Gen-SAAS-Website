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
  const ring1MeshRef = useRef<THREE.Mesh>(null!);
  const ring2MeshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle anti-gravity vertical float (docked at y = -0.75 to pull rings below badge and clear buttons)
    if (systemRef.current) {
      systemRef.current.position.y = -0.75 + Math.sin(t * 0.7) * 0.05;
    }

    // Slow continuous sphere rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.12;
      sphereRef.current.rotation.x += delta * 0.04;
    }

    // Ring 1 counter-rotational spin
    if (ring1MeshRef.current) {
      ring1MeshRef.current.rotation.z += delta * 0.22;
    }

    // Ring 2 counter-rotational spin
    if (ring2MeshRef.current) {
      ring2MeshRef.current.rotation.z -= delta * 0.18;
    }

    // Continuous visible pulse travel along circumference
    if (orbitTexture) {
      orbitTexture.offset.x = (orbitTexture.offset.x + delta * 0.18) % 1;
    }
  });

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

      {/* Positioned at y = -0.75: pulls top ring arc below badge and clears bottom buttons */}
      <group ref={systemRef} position={[0, -0.75, 0]}>
        {/* Central Wireframe Sphere */}
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshBasicMaterial
            color={isLight ? '#5b21b6' : '#a855f7'}
            wireframe
            transparent
            opacity={isLight ? 0.25 : 0.20}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>

        {/* Ring 1: Equatorial Orbit (Dim & Delicate) */}
        <group rotation={[1.38, 0, 0]}>
          <mesh ref={ring1MeshRef}>
            {/* Thinned tube from 0.012 to 0.009 */}
            <torusGeometry args={[2.45, 0.009, 16, 120]} />
            <meshBasicMaterial
              map={orbitTexture ?? undefined}
              transparent
              opacity={0.32} // Dimmed so it sits gently in the background
              depthWrite={false}
              blending={THREE.NormalBlending}
            />
          </mesh>
        </group>

        {/* Ring 2: Diagonal Ribbon (Subtle Secondary Accent) */}
        <group rotation={[1.05, 0, 0.38]}>
          <mesh ref={ring2MeshRef}>
            {/* Thinned tube from 0.024 down to 0.014 */}
            <torusGeometry args={[2.65, 0.014, 16, 120]} />
            <meshBasicMaterial
              map={orbitTexture ?? undefined}
              transparent
              opacity={0.38} // Kept visible, but never blocks text
              depthWrite={false}
              blending={THREE.NormalBlending}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}

export default GyroscopeScene;