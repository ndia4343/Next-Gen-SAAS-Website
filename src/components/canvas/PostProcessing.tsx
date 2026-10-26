"use client";

import React from "react";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";

export default function PostProcessing() {
  return (
    <EffectComposer
      enableNormalPass={false}
      {...({ disableNormalPass: true } as any)}
    >
      <Bloom
        luminanceThreshold={0.9}
        mipmapBlur
        intensity={0.85}
        radius={0.7}
      />
      <Noise opacity={0.03} />
      <Vignette eskil={false} offset={0.15} darkness={1.05} />
    </EffectComposer>
  );
}
