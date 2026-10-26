import "@/lib/react-19-polyfill";
import type { Metadata } from 'next';
import '@/lib/react-19-polyfill';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';
import SceneCanvasWrapper from '@/components/canvas/SceneCanvasWrapper';
import VisitorTracker from '@/components/analytics/VisitorTracker';
import { getStorefrontContent } from '@/lib/siteContent';

export const metadata: Metadata = {
  title: 'ZAVIAN LABS // 3D SaaS & AI Engineering Studio',
  description: 'GPU-accelerated WebGL motion and autonomous agent architectures.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let activeThemeId = 'crimson-cyber';
  try {
    const content = await getStorefrontContent();
    activeThemeId = content.themeBranding?.activeThemeId || 'crimson-cyber';
  } catch {
    // fallback
  }

  return (
    <html lang="en">
      <body className="antialiased bg-[#060609] text-zinc-100 overflow-x-hidden">
        <ThemeProvider initialThemeId={activeThemeId}>
          <SmoothScrollProvider>
            <VisitorTracker />
            <SceneCanvasWrapper />
            <div className="relative z-10">{children}</div>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
