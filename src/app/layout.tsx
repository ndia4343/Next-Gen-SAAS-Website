import type { Metadata } from 'next';
import '@/lib/react-19-polyfill';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import SceneCanvasWrapper from '@/components/canvas/SceneCanvasWrapper';

export const metadata: Metadata = {
  title: 'ZAVIAN LABS // 3D SaaS & AI Engineering Studio',
  description: 'GPU-accelerated WebGL motion and autonomous agent architectures.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#060609] text-zinc-100 overflow-x-hidden">
        <SmoothScrollProvider>
          <SceneCanvasWrapper />
          <div className="relative z-10">
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
