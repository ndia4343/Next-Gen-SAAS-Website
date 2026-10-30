'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
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
        {/* Glowing Geometric Wireframe Core - Adaptive Light/Dark */}
        <mesh ref={innerIcosaRef}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={isLight ? 0.75 : 1.8}
            wireframe
            roughness={isLight ? 0.15 : 0.2}
            metalness={isLight ? 0.95 : 0.9}
          />
        </mesh>

        {/* Orbiting Refractive Glass Ring 1 */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.9, 0.05, 32, 100]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={isLight ? 0.9 : 0.8}
            roughness={0.08}
            distortion={0.35}
            distortionScale={0.3}
            temporalDistortion={0.2}
            chromaticAberration={0.12}
            anisotropy={0.3}
            color={isLight ? '#475569' : '#ffffff'}
          />
        </mesh>

        {/* Orbiting Refractive Glass Ring 2 */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[2.3, 0.035, 32, 100]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={isLight ? 0.75 : 0.6}
            roughness={0.1}
            chromaticAberration={0.18}
            anisotropy={0.4}
            color={primaryColor}
          />
        </mesh>
      </Float>
    </group>
  );
}
