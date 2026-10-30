'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ScrollTrigger } from '@/lib/gsap';
import { ColorTheme } from '@/lib/theme';
import { ThemeMode } from '@/components/providers/ThemeProvider';

interface NeuralCoreMeshProps {
  theme?: ColorTheme;
  mode?: ThemeMode;
}

export default function NeuralCoreMesh({ theme, mode = 'dark' }: NeuralCoreMeshProps) {
  const isLight = mode === 'light';
  const primaryColor = theme?.primary || '#DC2626';
  const highlightColor = theme?.titleHighlight || '#EF4444';

  const coreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const innerIcosaRef = useRef<THREE.Mesh>(null);

  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    requestAnimationFrame(() => {
      st.refresh();
    });

    return () => {
      st.kill();
    };
  }, []);

  useFrame((state, delta) => {
    const scrollProgress = scrollProgressRef.current || ScrollTrigger.getAll()[0]?.progress || 0;

    if (coreRef.current) {
      // Idle rotation + subtle sine hover
      coreRef.current.rotation.y += delta * 0.22;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;

      // Choreographed scroll camera/mesh states
      if (scrollProgress < 0.25) {
        // Hero Section (0% - 25%): Centered focus (scaled down 20% to eliminate text collision)
        coreRef.current.position.set(0, 0, 0);
        coreRef.current.scale.setScalar(0.8);
      } else if (scrollProgress >= 0.25 && scrollProgress < 0.65) {
        // Core Expertise (25% - 65%): Pulls back behind columns, expands
        const t = (scrollProgress - 0.25) / 0.4;
        coreRef.current.position.z = THREE.MathUtils.lerp(0, -2.4, t);
        coreRef.current.position.y = THREE.MathUtils.lerp(0, -0.7, t);
        coreRef.current.scale.setScalar(THREE.MathUtils.lerp(0.8, 1.25, t));
      } else {
        // Bento Grid (65% - 100%): Shifts to right diagonal accent
        const t = (scrollProgress - 0.65) / 0.35;
        coreRef.current.position.x = THREE.MathUtils.lerp(0, 1.8, t);
        coreRef.current.position.y = THREE.MathUtils.lerp(-0.7, -2.1, t);
        coreRef.current.position.z = THREE.MathUtils.lerp(-2.4, -3.9, t);
      }
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
