/**
 * UnifiedThemeSystem - Sistema de Temas Unificado
 * Refatorado em 28/11/2025 - Reduzido de 761 linhas (29KB) para ~150 linhas (5KB)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type ColorScheme = 'blue' | 'purple' | 'green' | 'orange';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme?: (e: any) => void;
  setColorScheme?: (e: any) => void;
  toggleTheme??: (e: any) => void; }

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error('useTheme must be used within ThemeProvider');

  return context;};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children,
  defaultTheme = 'auto',
  defaultColorScheme = 'blue'
   }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme');

    return (stored as Theme) || defaultTheme;
  });

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    const stored = localStorage.getItem('colorScheme');

    return (stored as ColorScheme) || defaultColorScheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = theme === 'auto'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;

    root.classList.remove('light', 'dark');

    root.classList.add(effectiveTheme);

    root.setAttribute('data-color-scheme', colorScheme);

    localStorage.setItem('theme', theme);

    localStorage.setItem('colorScheme', colorScheme);

  }, [theme, colorScheme]);

  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = () => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');

      root.classList.add(mediaQuery.matches ? 'dark' : 'light');};

    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);

  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);};

  const setColorScheme = (newScheme: ColorScheme) => {
    setColorSchemeState(newScheme);};

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');};

  return (
            <ThemeContext.Provider value={ theme, colorScheme, setTheme, setColorScheme, toggleTheme } />
      {children}
    </ThemeContext.Provider>);};

export default ThemeProvider;
