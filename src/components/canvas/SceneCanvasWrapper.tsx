'use client';

import '@/lib/react-19-polyfill';
import React from 'react';
import dynamic from 'next/dynamic';

const SceneCanvas = dynamic(() => import('./SceneCanvas'), {
  ssr: false,
});

export default function SceneCanvasWrapper() {
  return <SceneCanvas />;
}
