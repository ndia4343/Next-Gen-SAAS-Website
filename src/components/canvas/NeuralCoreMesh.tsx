'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { ScrollTrigger } from '@/lib/gsap';

export default function NeuralCoreMesh() {
  const coreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const innerIcosaRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

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

  const particleCount = 1800;
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const scl = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      scl[i] = Math.random() * 2.5 + 0.5;
    }
    return [pos, scl];
  }, [particleCount]);

  useFrame((state, delta) => {
    const scrollProgress = scrollProgressRef.current || ScrollTrigger.getAll()[0]?.progress || 0;

    // Mutate mesh refs directly — never trigger React re-renders in useFrame
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.22;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;

      if (scrollProgress < 0.25) {
        // Hero: Centered view
        coreRef.current.position.set(0, 0, 0);
        coreRef.current.scale.setScalar(1);
      } else if (scrollProgress >= 0.25 && scrollProgress < 0.65) {
        // Core Expertise: Pull back and elevate behind the 3 columns
        const t = (scrollProgress - 0.25) / 0.4;
        coreRef.current.position.z = THREE.MathUtils.lerp(0, -2.4, t);
        coreRef.current.position.y = THREE.MathUtils.lerp(0, -0.7, t);
        coreRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 1.3, t));
      } else {
        // Bento Section: Shift to diagonal accent
        const t = (scrollProgress - 0.65) / 0.35;
        coreRef.current.position.x = THREE.MathUtils.lerp(0, 1.7, t);
        coreRef.current.position.y = THREE.MathUtils.lerp(-0.7, -2.0, t);
        coreRef.current.position.z = THREE.MathUtils.lerp(-2.4, -3.8, t);
      }
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.4;
      ring1Ref.current.rotation.y += delta * 0.2;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.32;
      ring2Ref.current.rotation.z += delta * 0.15;
    }

    if (innerIcosaRef.current) {
      innerIcosaRef.current.rotation.y -= delta * 0.45;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={coreRef} dispose={null}>
      <Float floatIntensity={1.2} rotationIntensity={0.5} speed={2}>
        {/* Core Wireframe Mesh */}
        <mesh ref={innerIcosaRef}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial
            color="#DC2626"
            emissive="#DC2626"
            emissiveIntensity={1.8}
            wireframe
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* Outer Orbiting Glass Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.9, 0.05, 32, 100]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.8}
            chromaticAberration={0.12}
            anisotropy={0.3}
            distortion={0.35}
            distortionScale={0.3}
            temporalDistortion={0.2}
            color="#ffffff"
            roughness={0.08}
          />
        </mesh>

        <mesh ref={ring2Ref}>
          <torusGeometry args={[2.3, 0.035, 32, 100]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.6}
            chromaticAberration={0.18}
            anisotropy={0.4}
            color="#DC2626"
            roughness={0.1}
          />
        </mesh>

        <Sparkles
          color="#EF4444"
          count={100}
          opacity={0.6}
          scale={5}
          size={2.2}
          speed={0.4}
        />
      </Float>

      {/* Particle Array */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#DC2626"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
