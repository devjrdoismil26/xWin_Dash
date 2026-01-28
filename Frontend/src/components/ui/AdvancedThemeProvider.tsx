/**
 * Advanced Theme Provider - xWin Dash
 * Sistema completo de temas com transições suaves e preferências avançadas
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ENHANCED_TRANSITIONS } from './design-tokens';

// ===== THEME TYPES =====
export type ThemeMode = 'light' | 'dark' | 'system' | 'auto';
export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink';
export type ThemeVariant = 'default' | 'minimal' | 'colorful' | 'corporate';

export interface ThemePreferences {
  mode: ThemeMode;
  color: ThemeColor;
  variant: ThemeVariant;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  autoSwitch: {
    enabled: boolean;
    lightTime: string; // '07:00'
    darkTime: string;  // '19:00'
  };
}

export interface ThemeContextType {
  preferences: ThemePreferences;
  currentTheme: 'light' | 'dark';
  isSystemDark: boolean;
  
  // Actions
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  setVariant: (variant: ThemeVariant) => void;
  toggleMode: () => void;
  updatePreferences: (preferences: Partial<ThemePreferences>) => void;
  resetToDefaults: () => void;
}

// ===== DEFAULT PREFERENCES =====
const DEFAULT_PREFERENCES: ThemePreferences = {
  mode: 'system',
  color: 'blue',
  variant: 'default',
  reducedMotion: false,
  highContrast: false,
  fontSize: 'md',
  autoSwitch: {
    enabled: false,
    lightTime: '07:00',
    darkTime: '19:00',
  },
};

// ===== CONTEXT =====
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ===== PROVIDER =====
interface AdvancedThemeProviderProps {
  children: React.ReactNode;
  storageKey?: string;
  enableTransitions?: boolean;
}

export const AdvancedThemeProvider: React.FC<AdvancedThemeProviderProps> = ({
  children,
  storageKey = 'xwin-theme-preferences',
  enableTransitions = true,
}) => {
  const [preferences, setPreferences] = useState<ThemePreferences>(DEFAULT_PREFERENCES);
  const [isSystemDark, setIsSystemDark] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedPreferences = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsedPreferences });
      }
    } catch (error) {
      console.warn('Failed to load theme preferences:', error);
    }

    setIsInitialized(true);
  }, [storageKey]);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences: ThemePreferences) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(newPreferences));
    } catch (error) {
      console.warn('Failed to save theme preferences:', error);
    }
  }, [storageKey]);

  // Monitor system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsSystemDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Monitor reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({
        ...prev,
        reducedMotion: e.matches
      }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Calculate current theme
  useEffect(() => {
    if (!isInitialized) return;

    let newTheme: 'light' | 'dark' = 'light';

    switch (preferences.mode) {
      case 'dark':
        newTheme = 'dark';
        break;
      case 'light':
        newTheme = 'light';
        break;
      case 'system':
        newTheme = isSystemDark ? 'dark' : 'light';
        break;
      case 'auto':
        if (preferences.autoSwitch.enabled) {
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const [lightHour, lightMin] = preferences.autoSwitch.lightTime.split(':').map(Number);
          const [darkHour, darkMin] = preferences.autoSwitch.darkTime.split(':').map(Number);
          const lightTime = lightHour * 60 + lightMin;
          const darkTime = darkHour * 60 + darkMin;
          
          if (lightTime < darkTime) {
            // Normal day (light at 7am, dark at 7pm)
            newTheme = currentTime >= lightTime && currentTime < darkTime ? 'light' : 'dark';
          } else {
            // Inverted (light at 7pm, dark at 7am)
            newTheme = currentTime >= lightTime || currentTime < darkTime ? 'light' : 'dark';
          }
        } else {
          newTheme = isSystemDark ? 'dark' : 'light';
        }
        break;
    }

    setCurrentTheme(newTheme);
  }, [preferences.mode, preferences.autoSwitch, isSystemDark, isInitialized]);

  // Apply theme to DOM
  useEffect(() => {
    if (!isInitialized) return;

    const root = document.documentElement;
    
    // Add transition class if enabled
    if (enableTransitions && !preferences.reducedMotion) {
      root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    } else {
      root.style.transition = '';
    }

    // Apply theme classes
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);

    // Apply color scheme
    root.classList.remove('theme-blue', 'theme-purple', 'theme-green', 'theme-orange', 'theme-red', 'theme-pink');
    root.classList.add(`theme-${preferences.color}`);

    // Apply variant
    root.classList.remove('variant-default', 'variant-minimal', 'variant-colorful', 'variant-corporate');
    root.classList.add(`variant-${preferences.variant}`);

    // Apply font size
    root.classList.remove('text-sm', 'text-md', 'text-lg', 'text-xl');
    root.classList.add(`text-${preferences.fontSize}`);

    // Apply accessibility features
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [currentTheme, preferences, isInitialized, enableTransitions]);

  // Auto-switch timer
  useEffect(() => {
    if (!preferences.autoSwitch.enabled || preferences.mode !== 'auto') return;

    const checkTime = () => {
      // Force recalculation by updating preferences
      setPreferences(prev => ({ ...prev }));
    };

    // Check every minute
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [preferences.autoSwitch.enabled, preferences.mode]);

  // Actions
  const setMode = useCallback((mode: ThemeMode) => {
    const newPreferences = { ...preferences, mode };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  const setColor = useCallback((color: ThemeColor) => {
    const newPreferences = { ...preferences, color };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  const setVariant = useCallback((variant: ThemeVariant) => {
    const newPreferences = { ...preferences, variant };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  const toggleMode = useCallback(() => {
    const newMode = currentTheme === 'light' ? 'dark' : 'light';
    setMode(newMode);
  }, [currentTheme, setMode]);

  const updatePreferences = useCallback((updates: Partial<ThemePreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  const resetToDefaults = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    savePreferences(DEFAULT_PREFERENCES);
  }, [savePreferences]);

  const contextValue: ThemeContextType = {
    preferences,
    currentTheme,
    isSystemDark,
    setMode,
    setColor,
    setVariant,
    toggleMode,
    updatePreferences,
    resetToDefaults,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// ===== HOOK =====
export const useAdvancedTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAdvancedTheme must be used within an AdvancedThemeProvider');
  }
  return context;
};

// ===== THEME SWITCHER COMPONENT =====
interface ThemeSwitcherProps {
  className?: string;
  showColorPicker?: boolean;
  showVariantPicker?: boolean;
  compact?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  showColorPicker = true,
  showVariantPicker = false,
  compact = false,
}) => {
  const { preferences, currentTheme, setMode, setColor, setVariant, toggleMode } = useAdvancedTheme();

  if (compact) {
    return (
      <button
        onClick={toggleMode}
        className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
        title={`Alternar para modo ${currentTheme === 'light' ? 'escuro' : 'claro'}`}
      >
        {currentTheme === 'light' ? '🌙' : '☀️'}
      </button>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Modo do Tema</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(['light', 'dark', 'system', 'auto'] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setMode(mode)}
              className={`p-2 text-xs rounded-lg border transition-colors ${
                preferences.mode === mode
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {mode === 'light' && '☀️ Claro'}
              {mode === 'dark' && '🌙 Escuro'}
              {mode === 'system' && '💻 Sistema'}
              {mode === 'auto' && '🕐 Auto'}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div>
          <label className="block text-sm font-medium mb-2">Cor do Tema</label>
          <div className="flex space-x-2">
            {(['blue', 'purple', 'green', 'orange', 'red', 'pink'] as ThemeColor[]).map((color) => (
              <button
                key={color}
                onClick={() => setColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  preferences.color === color ? 'border-gray-900 dark:border-white' : 'border-gray-300'
                }`}
                style={{
                  backgroundColor:
                    color === 'blue' ? '#3b82f6' :
                    color === 'purple' ? '#8b5cf6' :
                    color === 'green' ? '#10b981' :
                    color === 'orange' ? '#f59e0b' :
                    color === 'red' ? '#ef4444' :
                    '#ec4899'
                }}
                title={`Tema ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Variant Picker */}
      {showVariantPicker && (
        <div>
          <label className="block text-sm font-medium mb-2">Variante do Design</label>
          <div className="grid grid-cols-2 gap-2">
            {(['default', 'minimal', 'colorful', 'corporate'] as ThemeVariant[]).map((variant) => (
              <button
                key={variant}
                onClick={() => setVariant(variant)}
                className={`p-2 text-xs rounded-lg border transition-colors ${
                  preferences.variant === variant
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {variant === 'default' && 'Padrão'}
                {variant === 'minimal' && 'Minimalista'}
                {variant === 'colorful' && 'Colorido'}
                {variant === 'corporate' && 'Corporativo'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Components are already exported individually above

// Default export for compatibility
export default AdvancedThemeProvider;
