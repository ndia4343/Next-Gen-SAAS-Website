'use client';

import '@/lib/react-19-polyfill';
import React, { Component, ReactNode } from 'react';
import dynamic from 'next/dynamic';

const SceneCanvas = dynamic(() => import('./SceneCanvas'), {
  ssr: false,
});

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('3D WebGL Canvas bypassed due to runtime context:', error);
  }

  render() {
    if (this.state.hasError) {
      return <div className="fixed inset-0 z-0 pointer-events-none bg-[#060609]" />;
    }
    return this.props.children;
  }
}

export default function SceneCanvasWrapper() {
  return (
    <CanvasErrorBoundary>
      <SceneCanvas />
    </CanvasErrorBoundary>
  );
}
