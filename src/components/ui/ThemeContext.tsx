import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/* ── Layout overrides ─────────────────────────────────────────────── */
export interface WindowOverride {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  /** Set false to hide this window entirely for this theme */
  visible?: boolean;
}

export interface LayoutOverrides {
  /** Per-window overrides; key is the window id (CoreId) */
  windows?: Record<string, WindowOverride>;
}

/* ── Per-theme config ─────────────────────────────────────────────── */
export interface ThemeConfig {
  /** True for light-background themes (affects logo filters, partner logos, etc.) */
  isLight?: boolean;
  /** Traffic-light dot colors: [close, minimize, maximize] */
  dotColors?: [string, string, string];
  /** Audio track path, e.g. '/my-theme.mp3' */
  audioTrack?: string;
  /** Initial window layout overrides */
  layout?: LayoutOverrides;
  /** Copy overrides keyed by dot-path, e.g. 'hero.tagline' */
  content?: Record<string, string>;
  /** Section variant overrides keyed by section id, e.g. { hero: 'minimal' } */
  sectionVariants?: Record<string, string>;
  /** Custom background variant — 'helm-wave' replaces GridBackground with the mesh */
  backgroundVariant?: string;
}

/* ── Theme definition ─────────────────────────────────────────────── */
export interface ThemeDefinition {
  id: string;
  label: string;
  /** Representative accent color for the preview dot */
  accent: string;
  /** Optional per-theme config — existing themes omit this */
  config?: ThemeConfig;
}

export const THEMES: ThemeDefinition[] = [
  { id: 'default',      label: 'default',        accent: '#533AFD' },
  { id: 'stripe-dev',   label: 'dark',          accent: '#AAE87B' },
  { id: 'midnight',     label: 'midnight',      accent: '#15BE53' },
  { id: 'cybervision',  label: 'cybervision',   accent: '#00FF66' },
  { id: 'vaporwave',    label: 'vaporwave',     accent: '#D61C8C' },
  { id: '配色事典',      label: '配色事典',       accent: '#4F6F60' },

  /* ── Experimental themes ────────────────────────────────────────── */
  { id: 'dev',      label: 'dev',      accent: '#533AFD' },
  { id: 'dev-lite', label: 'dev lite', accent: '#533AFD' },

  {
    id: 'helm-wave',
    label: 'helm wave',
    accent: '#6B5EE8',
    config: {
      isLight: true,
      dotColors: ['#F07EC8', '#6B5EE8', '#F0A830'],
      backgroundVariant: 'helm-wave',
    },
  },
];

/* ── Context ──────────────────────────────────────────────────────── */
interface ThemeContextValue {
  theme: string;
  setTheme: (id: string) => void;
  themes: ThemeDefinition[];
  /** The config object for the active theme, or {} if none is defined */
  themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'default',
  setTheme: () => {},
  themes: THEMES,
  themeConfig: {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>(() => {
    return localStorage.getItem('theme') ?? 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'stripe-dev') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const themeConfig = useMemo<ThemeConfig>(() => {
    return THEMES.find(t => t.id === theme)?.config ?? {};
  }, [theme]);

  const setTheme = (id: string) => setThemeState(id);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
