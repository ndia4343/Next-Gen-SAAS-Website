import type { Metadata } from 'next';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import SceneCanvas from '@/components/canvas/SceneCanvas';

export const metadata: Metadata = {
  title: 'ZAVIAN LABS // 3D SaaS & AI Engineering Studio',
  description: 'Production-grade WebGL interfaces, autonomous Agentic AI, and full-stack software development.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#060609] text-zinc-100 overflow-x-hidden">
        <SmoothScrollProvider>
          <SceneCanvas />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
