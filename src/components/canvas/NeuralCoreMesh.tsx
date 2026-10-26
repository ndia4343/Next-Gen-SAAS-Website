"use client";

import React, { useRef, useMemo, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsap";

export default function NeuralCoreMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const innerCoreRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  const crimsonLightRef = useRef<THREE.PointLight>(null!);
  const orangeLightRef = useRef<THREE.DirectionalLight>(null!);
  const cyanLightRef = useRef<THREE.DirectionalLight>(null!);

  const scrollProgressRef = useRef(0);

  useEffect(() => {
    // Dedicated page-level scroll trigger
    const st = ScrollTrigger.create({
      id: "neural-core-scroll",
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    // Refresh immediately to calculate current viewport offset
    requestAnimationFrame(() => {
      st.refresh();
    });

    return () => {
      st.kill();
    };
  }, []);

  // GPU particle field (1,800 points) using bufferGeometry and additive blending
  const { particlePositions, particleColors } = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const crimson = new THREE.Color("#DC2626");
    const cyan = new THREE.Color("#00B4D8");
    const orange = new THREE.Color("#FF6B00");
    const white = new THREE.Color("#FFFFFF");

    for (let i = 0; i < count; i++) {
      const radius = 2.0 + Math.random() * 6.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const rand = Math.random();
      let c = crimson;
      if (rand < 0.4) c = crimson;
      else if (rand < 0.7) c = cyan;
      else if (rand < 0.88) c = orange;
      else c = white;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { particlePositions: positions, particleColors: colors };
  }, []);

  // CRITICAL PERFORMANCE RULE: Never update React state inside useFrame.
  // Directly mutate mesh and camera refs.
  useFrame((state, delta) => {
    const p = scrollProgressRef.current;
    const t = state.clock.getElapsedTime();

    // Keyframe Choreography for mesh position & scale
    // 0% - 25% (Hero): Centered at [0, 0, 0]
    // 25% - 65% (Core Expertise): Move back to Z: -2.5, Y: -0.8, scale 1.35x
    // 65% - 100% (Project Support Bento): Shift to X: 1.8, Y: -2.2, Z: -4.0
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetScale = 1.0;

    if (p <= 0.25) {
      targetX = 0;
      targetY = 0;
      targetZ = 0;
      targetScale = 1.0;
    } else if (p > 0.25 && p <= 0.65) {
      const progressNorm = (p - 0.25) / 0.4;
      targetX = 0;
      targetY = THREE.MathUtils.lerp(0, -0.8, progressNorm);
      targetZ = THREE.MathUtils.lerp(0, -2.5, progressNorm);
      targetScale = THREE.MathUtils.lerp(1.0, 1.35, progressNorm);
    } else {
      const progressNorm = (p - 0.65) / 0.35;
      targetX = THREE.MathUtils.lerp(0, 1.8, progressNorm);
      targetY = THREE.MathUtils.lerp(-0.8, -2.2, progressNorm);
      targetZ = THREE.MathUtils.lerp(-2.5, -4.0, progressNorm);
      targetScale = THREE.MathUtils.lerp(1.35, 1.15, progressNorm);
    }

    if (groupRef.current) {
      // Smooth interpolation toward target coordinates
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.08
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.08
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        targetZ,
        0.08
      );

      const currentScale = groupRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08);
      groupRef.current.scale.set(nextScale, nextScale, nextScale);

      // Responsive pointer tilt
      const pointerX = state.pointer.x * 0.35;
      const pointerY = state.pointer.y * 0.25;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointerX + t * 0.1,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointerY,
        0.05
      );
    }

    // Inner wireframe icosahedron rotation & dynamic pulse
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x += delta * 0.45;
      innerCoreRef.current.rotation.y += delta * 0.65;
      const breathing = 1 + Math.sin(t * 1.8) * 0.06;
      innerCoreRef.current.scale.set(breathing, breathing, breathing);

      const mat = innerCoreRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        if (p < 0.25) {
          mat.emissive.setRGB(0.86, 0.15 + Math.sin(t * 2) * 0.1, 0.15);
          mat.emissiveIntensity = 2.0;
        } else if (p < 0.65) {
          mat.emissive.setRGB(0.95, 0.08, 0.08);
          mat.emissiveIntensity = 2.6;
        } else {
          mat.emissive.setRGB(0.95, 0.42, 0.05);
          mat.emissiveIntensity = 2.2;
        }
      }
    }

    // Two orbiting refractive glass rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.35 + p * 1.5;
      ring1Ref.current.rotation.y = t * 0.45;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.28 + p * 2.0;
      ring2Ref.current.rotation.z = t * 0.32;
    }

    // GPU particles rotation
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05 + p * 0.8;
      particlesRef.current.rotation.x = Math.sin(t * 0.04) * 0.1;
    }

    // Dynamic section rim lighting adjustments
    if (orangeLightRef.current && cyanLightRef.current && crimsonLightRef.current) {
      if (p > 0.6) {
        const bentoFactor = Math.min(1, (p - 0.6) / 0.3);
        orangeLightRef.current.intensity = 3.5 * bentoFactor;
        cyanLightRef.current.intensity = 3.5 * bentoFactor;
        crimsonLightRef.current.intensity = 1.0;
      } else {
        orangeLightRef.current.intensity = 0.8;
        cyanLightRef.current.intensity = 1.0;
        crimsonLightRef.current.intensity = 3.0;
      }
    }
  });

  return (
    <Suspense fallback={null}>
      {/* Dynamic Lights */}
      <ambientLight intensity={0.6} />
      <pointLight
        ref={crimsonLightRef}
        position={[0, 0, 2]}
        color="#DC2626"
        intensity={3.0}
        distance={12}
      />
      <directionalLight
        ref={orangeLightRef}
        position={[-5, 4, 3]}
        color="#FF6B00"
        intensity={0.8}
      />
      <directionalLight
        ref={cyanLightRef}
        position={[5, -3, 3]}
        color="#00B4D8"
        intensity={1.0}
      />

      {/* Ambient Sparkles */}
      <Sparkles
        count={220}
        scale={12}
        size={2.2}
        speed={0.35}
        color="#EF4444"
      />

      {/* Synchronized Core Mesh Group */}
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Inner wireframe icosahedron (#DC2626 emissive, #EF4444 color) */}
        <mesh ref={innerCoreRef}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial
            wireframe
            color="#EF4444"
            emissive="#DC2626"
            emissiveIntensity={2.2}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* Orbiting Refractive Glass Ring 1 */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.75, 0.038, 24, 100]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            resolution={256}
            thickness={0.8}
            roughness={0.08}
            ior={1.48}
            transmission={0.92}
            chromaticAberration={0.06}
            color="#FFFFFF"
          />
        </mesh>

        {/* Orbiting Refractive Glass Ring 2 */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.1, 0.03, 24, 100]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            resolution={256}
            thickness={0.65}
            roughness={0.12}
            ior={1.52}
            transmission={0.88}
            chromaticAberration={0.08}
            color="#00B4D8"
          />
        </mesh>

        {/* GPU particle field (1,800 points) */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[particleColors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.035}
            vertexColors
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>
    </Suspense>
  );
}
