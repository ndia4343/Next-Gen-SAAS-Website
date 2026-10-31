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

    // Rich blend: Neon Violet -> Electric Blue -> Electric Cyan -> Deep Indigo
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0.0, '#7c3aed');      // Violet
    grad.addColorStop(0.20, '#1d4ed8');     // Electric Royal Blue
    grad.addColorStop(0.35, '#38bdf8');     // Vivid Cyan Pulse
    grad.addColorStop(0.50, 'transparent'); // Break gap for clear motion
    grad.addColorStop(0.68, '#2563eb');     // Electric Blue
    grad.addColorStop(0.85, '#22d3ee');     // Ice Cyan
    grad.addColorStop(1.0, '#7c3aed');

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

    // Hover float anchored safely lower at y = -0.68
    if (systemRef.current) {
      systemRef.current.position.y = -0.68 + Math.sin(t * 0.7) * 0.05;
    }

    // Slow sphere rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.12;
    }

    // Counter-rotational orbital speeds
    if (ring1MeshRef.current) {
      ring1MeshRef.current.rotation.z += delta * 0.28;
    }
    if (ring2MeshRef.current) {
      ring2MeshRef.current.rotation.z -= delta * 0.22;
    }

    // Continuous visible pulse travel
    if (orbitTexture) {
      orbitTexture.offset.x = (orbitTexture.offset.x + delta * 0.16) % 1;
    }
  });

  const blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    // Lowered origin completely clears the eyebrow badge and navbar
    <group ref={systemRef} position={[0, -0.68, 0]}>
      {/* Central Wireframe Sphere */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.85, 2]} />
        <meshBasicMaterial
          color={isLight ? '#7c3aed' : '#9333ea'}
          wireframe
          transparent
          opacity={isLight ? 0.50 : 0.25}
          depthWrite={false}
          blending={blending}
        />
      </mesh>

      {/* Ring 1: Thin Equatorial Ring */}
      <group rotation={[1.38, 0, 0]}>
        <mesh ref={ring1MeshRef}>
          <torusGeometry args={[2.55, 0.012, 16, 120]} />
          <meshBasicMaterial
            map={orbitTexture ?? undefined}
            transparent
            opacity={isLight ? 0.80 : 0.42}
            depthWrite={false}
            blending={blending}
          />
        </mesh>
      </group>

      {/* Ring 2: Broader Diagonal Slicing Ribbon */}
      <group rotation={[1.05, 0, 0.38]}>
        <mesh ref={ring2MeshRef}>
          <torusGeometry args={[2.80, 0.024, 16, 120]} />
          <meshBasicMaterial
            map={orbitTexture ?? undefined}
            transparent
            opacity={isLight ? 0.85 : 0.55}
            depthWrite={false}
            blending={blending}
          />
        </mesh>
      </group>
    </group>
  );
}

export default GyroscopeScene;
