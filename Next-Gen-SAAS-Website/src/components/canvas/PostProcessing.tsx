'use client';

import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom intensity={0.85} luminanceThreshold={0.95} mipmapBlur radius={0.7} />
      <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.035} />
      <Vignette darkness={1.1} eskil={false} offset={0.15} />
    </EffectComposer>
  );
}
