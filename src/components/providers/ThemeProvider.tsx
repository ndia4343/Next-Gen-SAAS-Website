'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorTheme, PredefinedThemeId, getTheme, PREDEFINED_THEMES } from '@/lib/theme';

interface ThemeContextValue {
  themeId: PredefinedThemeId;
  theme: ColorTheme;
  setThemeId: (id: PredefinedThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
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
}

export default function ThemeProvider({
  children,
  initialThemeId = 'crimson-cyber',
}: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<PredefinedThemeId>(
    (initialThemeId in PREDEFINED_THEMES ? initialThemeId : 'crimson-cyber') as PredefinedThemeId
  );

  const theme = getTheme(themeId);

  useEffect(() => {
    if (initialThemeId && initialThemeId in PREDEFINED_THEMES) {
      setThemeId(initialThemeId as PredefinedThemeId);
    }
  }, [initialThemeId]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-title-accent', theme.titleHighlight);
    root.style.setProperty('--theme-desc', theme.descriptionText);
    root.style.setProperty('--theme-glow', theme.glow);
    root.style.setProperty('--theme-3d-light', theme.lightTint3D);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ themeId, theme, setThemeId }}>
      {/* Inline styles for zero-flash SSR hydration */}
      <style
        id="theme-css-vars"
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --theme-primary: ${theme.primary};
              --theme-secondary: ${theme.secondary};
              --theme-title-accent: ${theme.titleHighlight};
              --theme-desc: ${theme.descriptionText};
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
