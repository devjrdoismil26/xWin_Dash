// =========================================
// THEME PROVIDER - SOCIAL BUFFER
// =========================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// =========================================
// INTERFACES
// =========================================

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface Typography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

interface BorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

interface Shadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

interface Theme {
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

interface ThemeContextType {
  currentTheme: Theme;
  availableThemes: Theme[];
  setTheme: (themeName: string) => void;
  createCustomTheme: (theme: Partial<Theme>) => void;
  updateTheme: (updates: Partial<Theme>) => void;
  resetTheme: () => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  customThemes?: Theme[];
}

// =========================================
// TEMAS PREDEFINIDOS
// =========================================

const defaultThemes: Theme[] = [
  {
    name: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  {
    name: 'dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#94a3b8',
      accent: '#fbbf24',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)'
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  {
    name: 'high-contrast',
    colors: {
      primary: '#0000ff',
      secondary: '#808080',
      accent: '#ff8000',
      background: '#ffffff',
      surface: '#f0f0f0',
      text: '#000000',
      textSecondary: '#333333',
      border: '#000000',
      success: '#008000',
      warning: '#ff8000',
      error: '#ff0000',
      info: '#0000ff'
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
      fontSize: {
        xs: '0.875rem',
        sm: '1rem',
        base: '1.125rem',
        lg: '1.25rem',
        xl: '1.375rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        light: 400,
        normal: 500,
        medium: 600,
        semibold: 700,
        bold: 800
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.375rem',
      xl: '0.5rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 0 0 1px #000000',
      md: '0 0 0 2px #000000',
      lg: '0 0 0 3px #000000',
      xl: '0 0 0 4px #000000',
      '2xl': '0 0 0 5px #000000',
      inner: 'inset 0 0 0 1px #000000'
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  }
];

// =========================================
// CONTEXT
// =========================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// =========================================
// PROVIDER
// =========================================

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light',
  customThemes = []
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0]);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([...defaultThemes, ...customThemes]);

  // ===== INICIALIZAÇÃO =====

  useEffect(() => {
    const savedTheme = localStorage.getItem('social-buffer-theme');
    const themeName = savedTheme || defaultTheme;
    
    const theme = availableThemes.find(t => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
    }
  }, [defaultTheme, availableThemes]);

  // ===== APLICAR TEMA =====

  const applyTheme = useCallback((theme: Theme) => {
    const root = document.documentElement;
    
    // Aplicar variáveis CSS
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    
    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value.toString());
    });
    
    Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
      root.style.setProperty(`--line-height-${key}`, value.toString());
    });
    
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value);
    });
    
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
    
    Object.entries(theme.breakpoints).forEach(([key, value]) => {
      root.style.setProperty(`--breakpoint-${key}`, value);
    });
    
    // Aplicar classe do tema
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${theme.name}`);
    
    // Aplicar fonte
    root.style.setProperty('--font-family', theme.typography.fontFamily);
  }, []);

  // ===== AÇÕES =====

  const setTheme = useCallback((themeName: string) => {
    const theme = availableThemes.find(t => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      localStorage.setItem('social-buffer-theme', themeName);
    }
  }, [availableThemes, applyTheme]);

  const createCustomTheme = useCallback((themeData: Partial<Theme>) => {
    const newTheme: Theme = {
      name: `custom-${Date.now()}`,
      colors: { ...defaultThemes[0].colors, ...themeData.colors },
      typography: { ...defaultThemes[0].typography, ...themeData.typography },
      spacing: { ...defaultThemes[0].spacing, ...themeData.spacing },
      borderRadius: { ...defaultThemes[0].borderRadius, ...themeData.borderRadius },
      shadows: { ...defaultThemes[0].shadows, ...themeData.shadows },
      breakpoints: { ...defaultThemes[0].breakpoints, ...themeData.breakpoints },
      ...themeData
    };
    
    setAvailableThemes(prev => [...prev, newTheme]);
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  const updateTheme = useCallback((updates: Partial<Theme>) => {
    const updatedTheme = { ...currentTheme, ...updates };
    setCurrentTheme(updatedTheme);
    applyTheme(updatedTheme);
  }, [currentTheme, applyTheme]);

  const resetTheme = useCallback(() => {
    const defaultThemeObj = defaultThemes.find(t => t.name === defaultTheme) || defaultThemes[0];
    setCurrentTheme(defaultThemeObj);
    applyTheme(defaultThemeObj);
    localStorage.removeItem('social-buffer-theme');
  }, [defaultTheme, applyTheme]);

  const exportTheme = useCallback(() => {
    return JSON.stringify(currentTheme, null, 2);
  }, [currentTheme]);

  const importTheme = useCallback((themeData: string) => {
    try {
      const theme = JSON.parse(themeData) as Theme;
      createCustomTheme(theme);
    } catch (error) {
      console.error('Erro ao importar tema:', error);
    }
  }, [createCustomTheme]);

  // ===== CONTEXT VALUE =====

  const contextValue: ThemeContextType = {
    currentTheme,
    availableThemes,
    setTheme,
    createCustomTheme,
    updateTheme,
    resetTheme,
    exportTheme,
    importTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// =========================================
// HOOK
// =========================================

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// =========================================
// COMPONENTES DE TEMA
// =========================================

interface ThemeSelectorProps {
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = '' }) => {
  const { currentTheme, availableThemes, setTheme } = useTheme();

  return (
    <div className={`theme-selector ${className}`}>
      <label htmlFor="theme-select" className="block text-sm font-medium mb-2">
        Tema
      </label>
      <select
        id="theme-select"
        value={currentTheme.name}
        onChange={(e) => setTheme(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {availableThemes.map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

interface ThemePreviewProps {
  theme: Theme;
  className?: string;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, className = '' }) => {
  return (
    <div 
      className={`theme-preview ${className}`}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontFamily: theme.typography.fontFamily
      }}
    >
      <div className="space-y-2">
        <h3 style={{ color: theme.colors.primary, fontSize: theme.typography.fontSize.lg }}>
          {theme.name}
        </h3>
        <div className="flex space-x-2">
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: theme.colors.secondary }}
          />
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: theme.colors.accent }}
          />
        </div>
      </div>
    </div>
  );
};

// =========================================
// CSS PARA TEMAS
// =========================================

export const themeStyles = `
  /* Variáveis CSS para temas */
  :root {
    --color-primary: #3b82f6;
    --color-secondary: #64748b;
    --color-accent: #f59e0b;
    --color-background: #ffffff;
    --color-surface: #f8fafc;
    --color-text: #1e293b;
    --color-text-secondary: #64748b;
    --color-border: #e2e8f0;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-info: #3b82f6;
    
    --font-family: Inter, system-ui, sans-serif;
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
    
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --spacing-3xl: 4rem;
    
    --border-radius-none: 0;
    --border-radius-sm: 0.125rem;
    --border-radius-md: 0.375rem;
    --border-radius-lg: 0.5rem;
    --border-radius-xl: 0.75rem;
    --border-radius-full: 9999px;
    
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
    
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;
  }

  /* Classes de tema */
  .theme-light {
    color-scheme: light;
  }

  .theme-dark {
    color-scheme: dark;
  }

  .theme-high-contrast {
    color-scheme: light;
  }
`;

export default ThemeProvider;
