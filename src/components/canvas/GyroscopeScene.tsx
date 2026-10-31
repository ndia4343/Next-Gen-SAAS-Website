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

    // High-contrast gradient with cyan pulses and deliberate break gaps for visible motion
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0.0, '#8b5cf6');      // Neon Violet
    grad.addColorStop(0.22, '#38bdf8');     // Electric Cyan Pulse
    grad.addColorStop(0.45, 'transparent'); // Break gap (ensures rotation is clearly visible)
    grad.addColorStop(0.65, '#a855f7');     // Synthwave Purple
    grad.addColorStop(0.85, '#22d3ee');     // Bright Ice Cyan
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

    // 1. Subtle anti-gravity vertical float (docked at -0.55 to guarantee clearance below eyebrow badge)
    if (systemRef.current) {
      systemRef.current.position.y = -0.55 + Math.sin(t * 0.7) * 0.06;
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

    // 4. Texture UV offset animation (forces visible light beam travel around the circumference)
    if (orbitTexture) {
      orbitTexture.offset.x = (orbitTexture.offset.x + delta * 0.15) % 1;
    }
  });

  const blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    // Lowered origin prevents the upper arc from touching or clipping behind the eyebrow badge
    <group ref={systemRef} position={[0, -0.55, 0]}>
      {/* Central Wireframe Sphere */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.9, 2]} />
        <meshBasicMaterial
          color={isLight ? '#6d28d9' : '#a855f7'}
          wireframe
          transparent
          opacity={isLight ? 0.55 : 0.28}
          depthWrite={false}
          blending={blending}
        />
      </mesh>

      {/* Ring 1: Thin Near-Horizontal Equatorial Ring */}
      <group rotation={[1.35, 0, 0]}>
        <mesh ref={ring1MeshRef}>
          {/* Scaled to 2.85 */}
          <torusGeometry args={[2.85, 0.012, 16, 120]} />
          <meshBasicMaterial
            map={orbitTexture ?? undefined}
            transparent
            opacity={isLight ? 0.80 : 0.40}
            depthWrite={false}
            blending={blending}
          />
        </mesh>
      </group>

      {/* Ring 2: Diagonal Slicing Ribbon */}
      <group rotation={[0.82, 0, 0.48]}>
        <mesh ref={ring2MeshRef}>
          {/* Scaled from 3.25 down to 3.05 to clear the eyebrow */}
          <torusGeometry args={[3.05, 0.022, 16, 120]} />
          <meshBasicMaterial
            map={orbitTexture ?? undefined}
            transparent
            opacity={isLight ? 0.85 : 0.48}
            depthWrite={false}
            blending={blending}
          />
        </mesh>
      </group>
    </group>
  );
}

export default GyroscopeScene;
