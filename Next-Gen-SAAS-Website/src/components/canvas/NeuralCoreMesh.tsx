'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { ColorTheme } from '@/lib/theme';
import { ThemeMode } from '@/components/providers/ThemeProvider';

interface NeuralCoreMeshProps {
  theme?: ColorTheme;
  mode?: ThemeMode;
}

export default function NeuralCoreMesh({ theme, mode = 'dark' }: NeuralCoreMeshProps) {
  const isLight = mode === 'light';
  const primaryColor = theme?.primary || '#DC2626';

  const coreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const innerIcosaRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      // Idle rotation + subtle sine hover
      coreRef.current.rotation.y += delta * 0.22;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
      coreRef.current.position.set(0, 0, 0);
      coreRef.current.scale.setScalar(1);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.42;
      ring1Ref.current.rotation.y += delta * 0.2;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.34;
      ring2Ref.current.rotation.z += delta * 0.16;
    }

    if (innerIcosaRef.current) {
      innerIcosaRef.current.rotation.y -= delta * 0.5;
    }
  });

  return (
    <group ref={coreRef} dispose={null}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
        {/* Glowing Geometric Wireframe Core - Delicate Ice-Blue */}
        <mesh ref={innerIcosaRef}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.6}
            wireframe
            transparent
            opacity={0.25}
            depthWrite={false}
          />
        </mesh>

        {/* Orbiting Wireframe Orbit Ring 1 - Delicate Ice-Blue */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.9, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.5}
            wireframe
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </mesh>

        {/* Orbiting Wireframe Orbit Ring 2 - Delicate Ice-Blue */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[2.3, 0.018, 16, 100]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.5}
            wireframe
            transparent
            opacity={0.20}
            depthWrite={false}
          />
        </mesh>
      </Float>
    </group>
  );
}
