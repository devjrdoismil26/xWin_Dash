import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Palette, Eye, Settings, Contrast, Droplets } from 'lucide-react';

// Interfaces
interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  fontSize: 'small' | 'medium' | 'large';
  density: 'compact' | 'normal' | 'comfortable';
  animations: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  accent: string;
  preview: string[];
  description: string;
}

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  toggleMode: () => void;
  isDark: boolean;
  colorPalettes: ColorPalette[];
  previewTheme: (config: Partial<ThemeConfig>) => void;
  resetPreview: () => void;
  exportTheme: () => string;
  importTheme: (config: string) => void;
}

// Paletas de cores predefinidas
const defaultColorPalettes: ColorPalette[] = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    primary: 'blue',
    accent: 'indigo',
    preview: ['#3B82F6', '#6366F1', '#1E40AF'],
    description: 'Paleta azul clássica e confiável'
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: 'purple',
    accent: 'pink',
    preview: ['#8B5CF6', '#EC4899', '#7C3AED'],
    description: 'Elegante e sofisticada'
  },
  {
    id: 'green',
    name: 'Nature Green',
    primary: 'emerald',
    accent: 'teal',
    preview: ['#10B981', '#14B8A6', '#059669'],
    description: 'Fresca e natural'
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    primary: 'orange',
    accent: 'red',
    preview: ['#F97316', '#EF4444', '#EA580C'],
    description: 'Vibrante e energética'
  },
  {
    id: 'gray',
    name: 'Professional Gray',
    primary: 'slate',
    accent: 'gray',
    preview: ['#64748B', '#6B7280', '#475569'],
    description: 'Profissional e neutra'
  },
  {
    id: 'rose',
    name: 'Elegant Rose',
    primary: 'rose',
    accent: 'pink',
    preview: ['#F43F5E', '#EC4899', '#E11D48'],
    description: 'Elegante e moderna'
  }
];

// Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider
export const UnifiedThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'light',
    primaryColor: 'blue',
    accentColor: 'indigo',
    borderRadius: 'medium',
    fontSize: 'medium',
    density: 'normal',
    animations: true,
    highContrast: false,
    reducedMotion: false,
    colorBlindMode: 'none'
  });

  const [previewConfig, setPreviewConfig] = useState<Partial<ThemeConfig> | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Detectar preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateDarkMode = () => {
      const effectiveTheme = previewConfig || theme;
      if (effectiveTheme.mode === 'auto') {
        setIsDark(mediaQuery.matches);
      } else {
        setIsDark(effectiveTheme.mode === 'dark');
      }
    };

    updateDarkMode();
    mediaQuery.addEventListener('change', updateDarkMode);
    
    return () => mediaQuery.removeEventListener('change', updateDarkMode);
  }, [theme, previewConfig]);

  // Aplicar tema ao documento
  useEffect(() => {
    const effectiveTheme = { ...theme, ...previewConfig };
    const root = document.documentElement;
    
    // Classe do modo escuro
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // CSS Custom Properties
    const colorMap = {
      blue: { primary: '#3B82F6', secondary: '#1E40AF', light: '#DBEAFE' },
      purple: { primary: '#8B5CF6', secondary: '#7C3AED', light: '#EDE9FE' },
      emerald: { primary: '#10B981', secondary: '#059669', light: '#D1FAE5' },
      orange: { primary: '#F97316', secondary: '#EA580C', light: '#FED7AA' },
      slate: { primary: '#64748B', secondary: '#475569', light: '#F1F5F9' },
      rose: { primary: '#F43F5E', secondary: '#E11D48', light: '#FFE4E6' },
      indigo: { primary: '#6366F1', secondary: '#4F46E5', light: '#E0E7FF' },
      pink: { primary: '#EC4899', secondary: '#DB2777', light: '#FCE7F3' },
      teal: { primary: '#14B8A6', secondary: '#0D9488', light: '#CCFBF1' },
      red: { primary: '#EF4444', secondary: '#DC2626', light: '#FEE2E2' },
      gray: { primary: '#6B7280', secondary: '#4B5563', light: '#F9FAFB' }
    };

    const primaryColors = colorMap[effectiveTheme.primaryColor] || colorMap.blue;
    const accentColors = colorMap[effectiveTheme.accentColor] || colorMap.indigo;

    root.style.setProperty('--color-primary', primaryColors.primary);
    root.style.setProperty('--color-primary-dark', primaryColors.secondary);
    root.style.setProperty('--color-primary-light', primaryColors.light);
    root.style.setProperty('--color-accent', accentColors.primary);
    root.style.setProperty('--color-accent-dark', accentColors.secondary);
    root.style.setProperty('--color-accent-light', accentColors.light);

    // Border radius
    const radiusMap = {
      none: '0px',
      small: '4px',
      medium: '8px',
      large: '16px'
    };
    root.style.setProperty('--border-radius', radiusMap[effectiveTheme.borderRadius]);

    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--font-size-base', fontSizeMap[effectiveTheme.fontSize]);

    // Density
    const densityMap = {
      compact: { spacing: '0.5rem', padding: '0.25rem' },
      normal: { spacing: '1rem', padding: '0.5rem' },
      comfortable: { spacing: '1.5rem', padding: '0.75rem' }
    };
    const density = densityMap[effectiveTheme.density];
    root.style.setProperty('--spacing-unit', density.spacing);
    root.style.setProperty('--padding-unit', density.padding);

    // Acessibilidade
    if (effectiveTheme.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
    } else if (effectiveTheme.animations) {
      root.style.setProperty('--animation-duration', '200ms');
    } else {
      root.style.setProperty('--animation-duration', '0ms');
    }

    // Alto contraste
    if (effectiveTheme.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Daltonismo
    root.className = root.className.replace(/colorblind-\w+/g, '');
    if (effectiveTheme.colorBlindMode !== 'none') {
      root.classList.add(`colorblind-${effectiveTheme.colorBlindMode}`);
    }

  }, [theme, previewConfig, isDark]);

  // Salvar tema no localStorage
  useEffect(() => {
    localStorage.setItem('theme-config', JSON.stringify(theme));
  }, [theme]);

  // Carregar tema do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme-config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTheme(parsed);
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
      }
    }
  }, []);

  const updateTheme = useCallback((updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleMode = useCallback(() => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : prev.mode === 'dark' ? 'auto' : 'light'
    }));
  }, []);

  const previewTheme = useCallback((config: Partial<ThemeConfig>) => {
    setPreviewConfig(config);
  }, []);

  const resetPreview = useCallback(() => {
    setPreviewConfig(null);
  }, []);

  const exportTheme = useCallback(() => {
    return JSON.stringify(theme, null, 2);
  }, [theme]);

  const importTheme = useCallback((config: string) => {
    try {
      const parsed = JSON.parse(config);
      setTheme(parsed);
    } catch (error) {
      throw new Error('Configuração de tema inválida');
    }
  }, []);

  const value: ThemeContextType = {
    theme,
    updateTheme,
    toggleMode,
    isDark,
    colorPalettes: defaultColorPalettes,
    previewTheme,
    resetPreview,
    exportTheme,
    importTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar o tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro do UnifiedThemeProvider');
  }
  return context;
};

// Componente de Controle de Tema
export const ThemeController: React.FC = () => {
  const { theme, updateTheme, toggleMode, isDark, colorPalettes, previewTheme, resetPreview } = useTheme();
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'colors' | 'accessibility' | 'advanced'>('appearance');

  return (
    <>
      {/* Botão de controle rápido */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col space-y-2">
          {/* Toggle rápido de modo */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMode}
            className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all"
            title={`Modo atual: ${theme.mode === 'auto' ? 'Automático' : theme.mode === 'dark' ? 'Escuro' : 'Claro'}`}
          >
            {theme.mode === 'auto' ? (
              <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : isDark ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </motion.button>

          {/* Botão do painel de temas */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowThemePanel(true)}
            className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all"
            title="Personalizar tema"
          >
            <Palette className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </motion.button>
        </div>
      </div>

      {/* Painel de Temas */}
      <AnimatePresence>
        {showThemePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowThemePanel(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Personalização de Tema
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={resetPreview}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  >
                    Resetar Preview
                  </button>
                  <button
                    onClick={() => setShowThemePanel(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex h-[calc(90vh-120px)]">
                {/* Sidebar de Tabs */}
                <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
                  <nav className="space-y-2">
                    {[
                      { id: 'appearance', label: 'Aparência', icon: Eye },
                      { id: 'colors', label: 'Cores', icon: Palette },
                      { id: 'accessibility', label: 'Acessibilidade', icon: Eye },
                      { id: 'advanced', label: 'Avançado', icon: Settings }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Conteúdo das Tabs */}
                <div className="flex-1 overflow-y-auto">
                  {activeTab === 'appearance' && (
                    <AppearanceTab theme={theme} updateTheme={updateTheme} previewTheme={previewTheme} />
                  )}
                  {activeTab === 'colors' && (
                    <ColorsTab 
                      theme={theme} 
                      updateTheme={updateTheme} 
                      previewTheme={previewTheme}
                      colorPalettes={colorPalettes}
                    />
                  )}
                  {activeTab === 'accessibility' && (
                    <AccessibilityTab theme={theme} updateTheme={updateTheme} previewTheme={previewTheme} />
                  )}
                  {activeTab === 'advanced' && (
                    <AdvancedTab theme={theme} updateTheme={updateTheme} />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Tab de Aparência
interface TabProps {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  previewTheme: (config: Partial<ThemeConfig>) => void;
}

const AppearanceTab: React.FC<TabProps> = ({ theme, updateTheme, previewTheme }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Modo de Tema */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Modo de Tema</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { mode: 'light', label: 'Claro', icon: Sun },
            { mode: 'dark', label: 'Escuro', icon: Moon },
            { mode: 'auto', label: 'Automático', icon: Monitor }
          ].map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => updateTheme({ mode: mode as any })}
              onMouseEnter={() => previewTheme({ mode: mode as any })}
              className={`p-4 border-2 rounded-lg transition-all text-center ${
                theme.mode === mode
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600 dark:text-gray-300" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bordas Arredondadas</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { radius: 'none', label: 'Nenhuma' },
            { radius: 'small', label: 'Pequena' },
            { radius: 'medium', label: 'Média' },
            { radius: 'large', label: 'Grande' }
          ].map(({ radius, label }) => (
            <button
              key={radius}
              onClick={() => updateTheme({ borderRadius: radius as any })}
              onMouseEnter={() => previewTheme({ borderRadius: radius as any })}
              className={`p-3 border-2 transition-all ${
                theme.borderRadius === radius
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
              style={{ borderRadius: radius === 'none' ? '0' : radius === 'small' ? '4px' : radius === 'medium' ? '8px' : '16px' }}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Densidade */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Densidade da Interface</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { density: 'compact', label: 'Compacta', description: 'Mais informações em menos espaço' },
            { density: 'normal', label: 'Normal', description: 'Equilibrio entre espaço e informação' },
            { density: 'comfortable', label: 'Confortável', description: 'Mais espaço para facilitar a leitura' }
          ].map(({ density, label, description }) => (
            <button
              key={density}
              onClick={() => updateTheme({ density: density as any })}
              onMouseEnter={() => previewTheme({ density: density as any })}
              className={`p-4 border-2 rounded-lg transition-all text-left ${
                theme.density === density
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tamanho da Fonte */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tamanho da Fonte</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { size: 'small', label: 'Pequena' },
            { size: 'medium', label: 'Média' },
            { size: 'large', label: 'Grande' }
          ].map(({ size, label }) => (
            <button
              key={size}
              onClick={() => updateTheme({ fontSize: size as any })}
              onMouseEnter={() => previewTheme({ fontSize: size as any })}
              className={`p-3 border-2 rounded-lg transition-all ${
                theme.fontSize === size
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <div 
                className="font-medium text-gray-900 dark:text-white"
                style={{ fontSize: size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px' }}
              >
                {label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tab de Cores
interface ColorsTabProps extends TabProps {
  colorPalettes: ColorPalette[];
}

const ColorsTab: React.FC<ColorsTabProps> = ({ theme, updateTheme, previewTheme, colorPalettes }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Paletas de Cores</h3>
        <div className="grid grid-cols-2 gap-4">
          {colorPalettes.map((palette) => (
            <button
              key={palette.id}
              onClick={() => updateTheme({ primaryColor: palette.primary, accentColor: palette.accent })}
              onMouseEnter={() => previewTheme({ primaryColor: palette.primary, accentColor: palette.accent })}
              className={`p-4 border-2 rounded-lg transition-all text-left ${
                theme.primaryColor === palette.primary
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex space-x-1">
                  {palette.preview.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{palette.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{palette.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tab de Acessibilidade
const AccessibilityTab: React.FC<TabProps> = ({ theme, updateTheme, previewTheme }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Alto Contraste */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alto Contraste</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Aumenta o contraste para melhor legibilidade</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={theme.highContrast}
            onChange={(e) => updateTheme({ highContrast: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Movimento Reduzido */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Movimento Reduzido</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Reduz animações para pessoas sensíveis ao movimento</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={theme.reducedMotion}
            onChange={(e) => updateTheme({ reducedMotion: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Suporte para Daltonismo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Suporte para Daltonismo</h3>
        <div className="space-y-2">
          {[
            { mode: 'none', label: 'Nenhum' },
            { mode: 'protanopia', label: 'Protanopia (dificuldade com vermelho)' },
            { mode: 'deuteranopia', label: 'Deuteranopia (dificuldade com verde)' },
            { mode: 'tritanopia', label: 'Tritanopia (dificuldade com azul)' }
          ].map(({ mode, label }) => (
            <label key={mode} className="flex items-center space-x-3">
              <input
                type="radio"
                name="colorBlindMode"
                checked={theme.colorBlindMode === mode}
                onChange={() => updateTheme({ colorBlindMode: mode as any })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-900 dark:text-white">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tab Avançado
const AdvancedTab: React.FC<Omit<TabProps, 'previewTheme'>> = ({ theme, updateTheme }) => {
  const { exportTheme, importTheme } = useTheme();
  const [importText, setImportText] = useState('');

  const handleExport = () => {
    const config = exportTheme();
    navigator.clipboard.writeText(config);
    alert('Configuração copiada para a área de transferência!');
  };

  const handleImport = () => {
    try {
      importTheme(importText);
      setImportText('');
      alert('Tema importado com sucesso!');
    } catch (error) {
      alert('Erro ao importar tema: ' + error.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Animações */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Animações</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ativar/desativar animações da interface</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={theme.animations}
            onChange={(e) => updateTheme({ animations: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Exportar/Importar */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backup do Tema</h3>
        <div className="space-y-4">
          <button
            onClick={handleExport}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Exportar Configuração
          </button>
          
          <div>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Cole aqui a configuração do tema para importar..."
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Importar Configuração
            </button>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reset</h3>
        <button
          onClick={() => updateTheme({
            mode: 'light',
            primaryColor: 'blue',
            accentColor: 'indigo',
            borderRadius: 'medium',
            fontSize: 'medium',
            density: 'normal',
            animations: true,
            highContrast: false,
            reducedMotion: false,
            colorBlindMode: 'none'
          })}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Restaurar Padrões
        </button>
      </div>
    </div>
  );
};

export default UnifiedThemeProvider;
