import "@/lib/react-19-polyfill";
import type { Metadata } from 'next';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import ThemeProvider, { ThemeMode } from '@/components/providers/ThemeProvider';
import SceneCanvasWrapper from '@/components/canvas/SceneCanvasWrapper';
import VisitorTracker from '@/components/analytics/VisitorTracker';
import { getStorefrontContent } from '@/lib/siteContent';

export const metadata: Metadata = {
  title: 'ZAVIAN LABS // 3D SaaS & AI Engineering Studio',
  description: 'GPU-accelerated WebGL motion and autonomous agent architectures.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let activeThemeId = 'crimson-cyber';
  let defaultMode: ThemeMode = 'dark';
  try {
    const content = await getStorefrontContent();
    activeThemeId = content.themeBranding?.activeThemeId || 'crimson-cyber';
    defaultMode = (content.themeBranding?.defaultMode as ThemeMode) || 'dark';
  } catch {
    // fallback
  }

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Anti-Flicker Script: Synchronously applies dark/light class before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('zavian_theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var mode = (saved === 'dark' || saved === 'light') ? saved : '${defaultMode}';
                  var root = document.documentElement;
                  root.classList.remove('dark', 'light');
                  root.classList.add(mode);
                  root.setAttribute('data-theme', mode);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-[#060609] text-zinc-100 transition-colors duration-300 overflow-x-hidden">
        <ThemeProvider initialThemeId={activeThemeId} initialMode={defaultMode}>
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
