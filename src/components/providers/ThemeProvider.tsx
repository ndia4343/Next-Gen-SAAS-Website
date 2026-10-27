'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ColorTheme, PredefinedThemeId, getTheme, PREDEFINED_THEMES } from '@/lib/theme';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  themeId: PredefinedThemeId;
  theme: ColorTheme;
  setThemeId: (id: PredefinedThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  setMode: () => {},
  toggleMode: () => {},
  themeId: 'crimson-cyber',
  theme: PREDEFINED_THEMES['crimson-cyber'],
  setThemeId: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  initialThemeId?: string;
  initialMode?: ThemeMode;
}

export default function ThemeProvider({
  children,
  initialThemeId = 'crimson-cyber',
  initialMode = 'dark',
}: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<PredefinedThemeId>(
    (initialThemeId in PREDEFINED_THEMES ? initialThemeId : 'crimson-cyber') as PredefinedThemeId
  );
  const [mode, setModeState] = useState<ThemeMode>(initialMode);
  const [mounted, setMounted] = useState(false);

  const theme = getTheme(themeId);

  // Sync mode with localStorage & prefers-color-scheme on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('zavian_theme');
      if (saved === 'dark' || saved === 'light') {
        setModeState(saved as ThemeMode);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setModeState('light');
      }
    } catch {
      // fallback to initialMode
    }
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('zavian_theme', newMode);
    } catch {}
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('zavian_theme', next);
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    if (initialThemeId && initialThemeId in PREDEFINED_THEMES) {
      setThemeId(initialThemeId as PredefinedThemeId);
    }
  }, [initialThemeId]);

  // Synchronize DOM classes and CSS variables whenever theme or mode changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(mode);
    root.setAttribute('data-theme', mode);

    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-title-accent', theme.titleHighlight);
    root.style.setProperty(
      '--theme-desc',
      mode === 'light' ? '#475569' : theme.descriptionText
    );
    root.style.setProperty('--theme-glow', theme.glow);
    root.style.setProperty('--theme-3d-light', theme.lightTint3D);
  }, [theme, mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode, themeId, theme, setThemeId }}>
      {/* Inline styles for zero-flash SSR hydration */}
      <style
        id="theme-css-vars"
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --theme-primary: ${theme.primary};
              --theme-secondary: ${theme.secondary};
              --theme-title-accent: ${theme.titleHighlight};
              --theme-desc: ${mode === 'light' ? '#475569' : theme.descriptionText};
              --theme-glow: ${theme.glow};
              --theme-3d-light: ${theme.lightTint3D};
            }
          `,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
}
