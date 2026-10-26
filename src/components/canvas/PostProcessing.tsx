"use client";

import React from "react";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";

export default function PostProcessing() {
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        luminanceThreshold={0.95}
        mipmapBlur
        intensity={0.85}
      />
      <Noise opacity={0.035} />
      <Vignette eskil={false} offset={0.15} darkness={1.05} />
    </EffectComposer>
  );
}
