'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function useSilverSparkTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Liquid Platinum Base with High-Voltage Diamond & Cyan Sparks
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0.0, 'rgba(203, 213, 225, 0.25)'); // Delicate platinum edge
    grad.addColorStop(0.20, 'rgba(148, 163, 184, 0.40)'); // Brushed silver
    grad.addColorStop(0.38, '#38bdf8');                  // Electric Cyan spark trace
    grad.addColorStop(0.42, '#ffffff');                  // Pure Diamond White specular flash
    grad.addColorStop(0.46, '#38bdf8');                  // Cyan falloff
    grad.addColorStop(0.60, 'rgba(148, 163, 184, 0.20)'); // Silver bridge
    grad.addColorStop(0.78, '#a855f7');                  // Faint violet shimmer
    grad.addColorStop(0.82, '#ffffff');                  // Second diamond spark
    grad.addColorStop(1.0, 'rgba(203, 213, 225, 0.25)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);
}

export function GyroscopeScene({ isLight = false }: { isLight?: boolean } = {}) {
  const silverSparkTexture = useSilverSparkTexture();
  const groupRef = useRef<THREE.Group>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Gentle vertical hover breathing
    if (groupRef.current) {
      groupRef.current.position.y = -0.32 + Math.sin(t * 0.8) * 0.03;
    }

    // Smooth opposing rotations
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.22;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.18;
    }

    // Moving spark pulse speed
    if (silverSparkTexture) {
      silverSparkTexture.offset.x = (silverSparkTexture.offset.x + delta * 0.18) % 1;
    }
  });

  return (
    // Anchored and scaled down to prevent collisions with top and bottom text
    <group ref={groupRef} position={[0, -0.32, 0]}>
      {/* Ring 1: Primary Precision Gimbal Ring */}
      <group rotation={[1.18, 0, 0.28]}>
        <mesh ref={ring1Ref}>
          {/* Tighter radius (2.18) and ultra-thin hair-line tube (0.007) */}
          <torusGeometry args={[2.18, 0.007, 16, 120]} />
          <meshBasicMaterial
            map={silverSparkTexture ?? undefined}
            transparent
            opacity={0.65}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Ring 2: Diagonal Silver Orbit */}
      <group rotation={[0.82, 0, -0.42]}>
        <mesh ref={ring2Ref}>
          {/* Complementary radius (2.36) and refined tube width (0.011) */}
          <torusGeometry args={[2.36, 0.011, 16, 120]} />
          <meshBasicMaterial
            map={silverSparkTexture ?? undefined}
            transparent
            opacity={0.75}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

export default GyroscopeScene;
