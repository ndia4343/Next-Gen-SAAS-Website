export type PredefinedThemeId =
  | 'crimson-cyber'
  | 'obsidian-flame'
  | 'electric-cyan'
  | 'neon-violet'
  | 'emerald-matrix';

export interface ColorTheme {
  id: PredefinedThemeId;
  name: string;
  tagline: string;
  primary: string;         // Primary accent color
  secondary: string;       // Secondary accent color / amber / cyan
  titleHighlight: string;  // Headline highlight color
  descriptionText: string; // High-contrast body text
  lightTint3D: string;     // Color passed to 3D canvas directional & point lights
  glow: string;            // Shadow / glow color
}

export const PREDEFINED_THEMES: Record<PredefinedThemeId, ColorTheme> = {
  'crimson-cyber': {
    id: 'crimson-cyber',
    name: 'Crimson Cyber',
    tagline: 'Signature Red & Amber (Default)',
    primary: '#DC2626',
    secondary: '#FF6B00',
    titleHighlight: '#EF4444',
    descriptionText: '#D4D4D8',
    lightTint3D: '#DC2626',
    glow: 'rgba(220, 38, 38, 0.45)',
  },
  'obsidian-flame': {
    id: 'obsidian-flame',
    name: 'Obsidian Flame',
    tagline: 'Vibrant Orange & Gold',
    primary: '#FF6B00',
    secondary: '#F59E0B',
    titleHighlight: '#FF7A1A',
    descriptionText: '#E4E4E7',
    lightTint3D: '#FF6B00',
    glow: 'rgba(255, 107, 0, 0.45)',
  },
  'electric-cyan': {
    id: 'electric-cyan',
    name: 'Electric Cyan',
    tagline: 'Neural Azure & Teal',
    primary: '#00B4D8',
    secondary: '#06B6D4',
    titleHighlight: '#38BDF8',
    descriptionText: '#E2E8F0',
    lightTint3D: '#00B4D8',
    glow: 'rgba(0, 180, 216, 0.45)',
  },
  'neon-violet': {
    id: 'neon-violet',
    name: 'Neon Violet',
    tagline: 'Synthwave Purple & Indigo',
    primary: '#8B5CF6',
    secondary: '#6366F1',
    titleHighlight: '#A855F7',
    descriptionText: '#E0E7FF',
    lightTint3D: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.45)',
  },
  'emerald-matrix': {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    tagline: 'Quantum Green & Mint',
    primary: '#10B981',
    secondary: '#14B8A6',
    titleHighlight: '#34D399',
    descriptionText: '#D1FAE5',
    lightTint3D: '#10B981',
    glow: 'rgba(16, 185, 129, 0.45)',
  },
};

export const DEFAULT_THEME_ID: PredefinedThemeId = 'crimson-cyber';

export function getTheme(id?: string | null): ColorTheme {
  if (id && id in PREDEFINED_THEMES) {
    return PREDEFINED_THEMES[id as PredefinedThemeId];
  }
  return PREDEFINED_THEMES[DEFAULT_THEME_ID];
}

export function getThemeCssVariables(theme: ColorTheme): Record<string, string> {
  return {
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-title-accent': theme.titleHighlight,
    '--theme-desc': theme.descriptionText,
    '--theme-glow': theme.glow,
    '--theme-3d-light': theme.lightTint3D,
  };
}
