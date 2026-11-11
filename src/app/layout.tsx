import "@/lib/react-19-polyfill";
import type { Metadata } from 'next';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import ThemeProvider, { ThemeMode } from '@/components/providers/ThemeProvider';
import VisitorTracker from '@/components/analytics/VisitorTracker';
import { getStorefrontContent } from '@/lib/siteContent';
import { getServerSiteConfig } from '@/lib/site-config-store';
import { defaultConfig } from '@/lib/default-config';
import { SiteConfigProvider } from '@/context/SiteConfigContext';

export const metadata: Metadata = {
  title: 'ZAVIAN LABS // Voice Receptionists, WhatsApp Automation & Custom Software',
  description:
    'We build AI voice receptionists, WhatsApp automation, workflows, dashboards, and custom software for businesses that run on conversations.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let activeThemeId = 'crimson-cyber';
  let defaultMode: ThemeMode = 'light';
  let initialSiteConfig = defaultConfig;
  try {
    const [content, serverConfig] = await Promise.all([
      getStorefrontContent(),
      getServerSiteConfig(),
    ]);
    activeThemeId = content.themeBranding?.activeThemeId || 'crimson-cyber';
    defaultMode = (content.themeBranding?.defaultMode as ThemeMode) || 'light';
    initialSiteConfig = serverConfig;
  } catch {
    // fallback
  }

  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Anti-Flicker Script: Synchronously applies light editorial class before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var root = document.documentElement;
                  var isAdmin = window.location && window.location.pathname && window.location.pathname.indexOf('/admin') === 0;
                  var saved = localStorage.getItem('zavian_theme');
                  var mode = isAdmin ? ((saved === 'dark' || saved === 'light') ? saved : 'dark') : '${initialSiteConfig.branding.enableLightMode ? 'light' : 'dark'}';
                  root.classList.remove('dark', 'light');
                  root.classList.add(mode);
                  root.setAttribute('data-theme', mode);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="relative antialiased bg-[#FFFFFF] text-[#0A0A0A] transition-colors duration-300 overflow-x-hidden font-sans">
        <SiteConfigProvider initialConfig={initialSiteConfig}>
          <ThemeProvider initialThemeId={activeThemeId} initialMode={defaultMode}>
            <SmoothScrollProvider>
              <VisitorTracker />
              <div className="relative z-10">{children}</div>
            </SmoothScrollProvider>
          </ThemeProvider>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
