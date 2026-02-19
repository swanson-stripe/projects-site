import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ThemeDefinition {
  id: string;
  label: string;
  /** Representative accent color for the preview dot */
  accent: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: 'stripe-dev',  label: 'dark',           accent: '#AAE87B' },
  { id: 'midnight',    label: 'midnight',       accent: '#15BE53' },
  { id: 'cybervision', label: 'cybervision',    accent: '#00FF66' },
  { id: 'vaporwave',   label: 'vaporwave',      accent: '#D61C8C' },
];

interface ThemeContextValue {
  theme: string;
  setTheme: (id: string) => void;
  themes: ThemeDefinition[];
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'stripe-dev',
  setTheme: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>(() => {
    return localStorage.getItem('theme') ?? 'stripe-dev';
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

  const setTheme = (id: string) => setThemeState(id);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
