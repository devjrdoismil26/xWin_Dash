/**
 * Componente AdvancedThemeProvider - Sistema de Temas Avançado
 *
 * @description
 * Sistema completo de gerenciamento de temas com transições suaves, preferências
 * avançadas (modo, cor, variante), suporte a modo automático baseado em horário,
 * acessibilidade (movimento reduzido, alto contraste) e persistência em localStorage.
 * Fornece o Provider `AdvancedThemeProvider`, hook `useAdvancedTheme` e componente
 * `ThemeSwitcher` para controle de temas.
 *
 * @example
 * ```tsx
 * import { AdvancedThemeProvider, useAdvancedTheme } from '@/shared/components/ui/AdvancedThemeProvider';
 *
 * <AdvancedThemeProvider />
 *   <App / />
 * </AdvancedThemeProvider>
 *
 * const MyComponent = () => {
 *   const { currentTheme, setMode, setColor, toggleMode } = useAdvancedTheme();

 *   return <div>Tema atual: {currentTheme}</div>;
 *};

 * ```
 *
 * @module components/ui/AdvancedThemeProvider
 * @since 1.0.0
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ENHANCED_TRANSITIONS } from './design-tokens';

/**
 * Modos de tema disponíveis
 *
 * @description
 * Tipos de modo de tema suportados pelo sistema.
 *
 * @typedef {('light' | 'dark' | 'system' | 'auto')} ThemeMode
 * @property {'light'} light - Modo claro fixo
 * @property {'dark'} dark - Modo escuro fixo
 * @property {'system'} system - Seguir preferência do sistema operacional
 * @property {'auto'} auto - Alternar automaticamente baseado em horário
 */
export type ThemeMode = "light" | "dark" | "system" | "auto";

/**
 * Cores de tema disponíveis
 *
 * @description
 * Paletas de cores disponíveis para personalização do tema.
 *
 * @typedef {('blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink')} ThemeColor
 */
export type ThemeColor =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "red"
  | "pink";

/**
 * Variantes de design disponíveis
 *
 * @description
 * Estilos visuais diferentes para o tema.
 *
 * @typedef {('default' | 'minimal' | 'colorful' | 'corporate')} ThemeVariant
 */
export type ThemeVariant = "default" | "minimal" | "colorful" | "corporate";

/**
 * Preferências completas de tema
 *
 * @description
 * Interface que define todas as preferências configuráveis do tema.
 *
 * @interface ThemePreferences
 * @property {ThemeMode} mode - Modo de tema atual
 * @property {ThemeColor} color - Cor do tema atual
 * @property {ThemeVariant} variant - Variante de design atual
 * @property {boolean} reducedMotion - Se deve respeitar preferência de movimento reduzido
 * @property {boolean} highContrast - Se deve usar alto contraste
 * @property {'sm' | 'md' | 'lg' | 'xl'} fontSize - Tamanho da fonte
 * @property { enabled: boolean; lightTime: string; darkTime: string } autoSwitch - Configuração de alternância automática
 */
export interface ThemePreferences {
  mode: ThemeMode;
  color: ThemeColor;
  variant: ThemeVariant;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: "sm" | "md" | "lg" | "xl";
  autoSwitch: {
    enabled: boolean;
  lightTime: string;
  // '07:00'
    darkTime: string;
  // '19:00';
};

}

/**
 * Tipo do contexto de tema
 *
 * @description
 * Interface que define o valor do contexto de tema, incluindo estado e ações.
 *
 * @interface ThemeContextType
 * @property {ThemePreferences} preferences - Preferências atuais do tema
 * @property {'light' | 'dark'} currentTheme - Tema atual calculado
 * @property {boolean} isSystemDark - Se o sistema operacional está em modo escuro
 * @property {(mode: ThemeMode) => void} setMode - Função para definir modo de tema
 * @property {(color: ThemeColor) => void} setColor - Função para definir cor do tema
 * @property {(variant: ThemeVariant) => void} setVariant - Função para definir variante
 * @property {() => void} toggleMode - Função para alternar entre light e dark
 * @property {(preferences: Partial<ThemePreferences>) => void} updatePreferences - Função para atualizar múltiplas preferências
 * @property {() => void} resetToDefaults - Função para resetar para preferências padrão
 */
export interface ThemeContextType {
  preferences: ThemePreferences;
  currentTheme: "light" | "dark";
  isSystemDark: boolean;
  // Actions
  setMode?: (e: any) => void;
  setColor?: (e: any) => void;
  setVariant?: (e: any) => void;
  toggleMode??: (e: any) => void;
  updatePreferences?: (e: any) => void;
  resetToDefaults??: (e: any) => void; }

// ===== DEFAULT PREFERENCES =====
const DEFAULT_PREFERENCES: ThemePreferences = {
  mode: "system",
  color: "blue",
  variant: "default",
  reducedMotion: false,
  highContrast: false,
  fontSize: "md",
  autoSwitch: {
    enabled: false,
    lightTime: "07:00",
    darkTime: "19:00",
  },};

// ===== CONTEXT =====
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Props do componente AdvancedThemeProvider
 *
 * @description
 * Propriedades que podem ser passadas para o componente AdvancedThemeProvider.
 *
 * @interface AdvancedThemeProviderProps
 * @property {React.ReactNode} children - Componentes filhos
 * @property {string} [storageKey='xwin-theme-preferences'] - Chave para localStorage (opcional, padrão: 'xwin-theme-preferences')
 * @property {boolean} [enableTransitions=true] - Se habilita transições de tema (opcional, padrão: true)
 */
interface AdvancedThemeProviderProps {
  children: React.ReactNode;
  storageKey?: string;
  enableTransitions?: boolean; }

/**
 * Componente AdvancedThemeProvider
 *
 * @description
 * Provider principal que gerencia o tema da aplicação, incluindo modo,
 * cor, variante e preferências de acessibilidade. Persiste configurações
 * em localStorage e aplica o tema ao DOM.
 *
 * @component
 * @param {AdvancedThemeProviderProps} props - Props do componente
 * @returns {JSX.Element} Provider de tema
 */
export const AdvancedThemeProvider: React.FC<AdvancedThemeProviderProps> = ({ children,
  storageKey = "xwin-theme-preferences",
  enableTransitions = true,
   }) => {
  const [preferences, setPreferences] =
    useState<ThemePreferences>(DEFAULT_PREFERENCES);

  const [isSystemDark, setIsSystemDark] = useState(false);

  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  const [isInitialized, setIsInitialized] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const parsedPreferences = JSON.parse(stored);

        setPreferences({ ...DEFAULT_PREFERENCES, ...parsedPreferences });

      } catch (error) {
    }

    setIsInitialized(true);

  }, [storageKey]);

  // Save preferences to localStorage
  const savePreferences = useCallback(
    (newPreferences: ThemePreferences) => {
      if (typeof window === "undefined") return;

      try {
        localStorage.setItem(storageKey, JSON.stringify(newPreferences));

      } catch (error) {
      } ,
    [storageKey],);

  // Monitor system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    setIsSystemDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);};

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);

  }, []);

  // Monitor reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setPreferences((prev: unknown) => ({
        ...prev,
        reducedMotion: e.matches,
      }));};

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);

  }, []);

  // Calculate current theme
  useEffect(() => {
    if (!isInitialized) return;

    let newTheme: "light" | "dark" = "light";

    switch (preferences.mode) {
      case "dark":
        newTheme = "dark";
        break;
      case "light":
        newTheme = "light";
        break;
      case "system":
        newTheme = isSystemDark ? "dark" : "light";
        break;
      case "auto":
        if (preferences.autoSwitch.enabled) {
          const now = new Date();

          const currentTime = now.getHours() * 60 + now.getMinutes();

          const [lightHour, lightMin] = preferences.autoSwitch.lightTime
            .split(":")
            .map(Number);

          const [darkHour, darkMin] = preferences.autoSwitch.darkTime
            .split(":")
            .map(Number);

          const lightTime = lightHour * 60 + lightMin;
          const darkTime = darkHour * 60 + darkMin;

          if (lightTime < darkTime) {
            // Normal day (light at 7am, dark at 7pm)
            newTheme =
              currentTime >= lightTime && currentTime < darkTime
                ? "light"
                : "dark";
          } else {
            // Inverted (light at 7pm, dark at 7am)
            newTheme =
              currentTime >= lightTime || currentTime < darkTime
                ? "light"
                : "dark";
          } else {
          newTheme = isSystemDark ? "dark" : "light";
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
      root.style.transition = "background-color 0.3s ease, color 0.3s ease";
    } else {
      root.style.transition = "";
    }

    // Apply theme classes
    root.classList.remove("light", "dark");

    root.classList.add(currentTheme);

    // Apply color scheme
    root.classList.remove(
      "theme-blue",
      "theme-purple",
      "theme-green",
      "theme-orange",
      "theme-red",
      "theme-pink",);

    root.classList.add(`theme-${preferences.color}`);

    // Apply variant
    root.classList.remove(
      "variant-default",
      "variant-minimal",
      "variant-colorful",
      "variant-corporate",);

    root.classList.add(`variant-${preferences.variant}`);

    // Apply font size
    root.classList.remove("text-sm", "text-md", "text-lg", "text-xl");

    root.classList.add(`text-${preferences.fontSize}`);

    // Apply accessibility features
    if (preferences.highContrast) {
      root.classList.add("high-contrast");

    } else {
      root.classList.remove("high-contrast");

    }

    if (preferences.reducedMotion) {
      root.classList.add("reduce-motion");

    } else {
      root.classList.remove("reduce-motion");

    } , [currentTheme, preferences, isInitialized, enableTransitions]);

  // Auto-switch timer
  useEffect(() => {
    if (!preferences.autoSwitch.enabled || preferences.mode !== "auto") return;

    const checkTime = () => {
      // Force recalculation by updating preferences
      setPreferences((prev: unknown) => ({ ...prev }));};

    // Check every minute
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);

  }, [preferences.autoSwitch.enabled, preferences.mode]);

  // Actions
  const setMode = useCallback(
    (mode: ThemeMode) => {
      const newPreferences = { ...preferences, mode};

      setPreferences(newPreferences);

      savePreferences(newPreferences);

    },
    [preferences, savePreferences],);

  const setColor = useCallback(
    (color: ThemeColor) => {
      const newPreferences = { ...preferences, color};

      setPreferences(newPreferences);

      savePreferences(newPreferences);

    },
    [preferences, savePreferences],);

  const setVariant = useCallback(
    (variant: ThemeVariant) => {
      const newPreferences = { ...preferences, variant};

      setPreferences(newPreferences);

      savePreferences(newPreferences);

    },
    [preferences, savePreferences],);

  const toggleMode = useCallback(() => {
    const newMode = currentTheme === "light" ? "dark" : "light";
    setMode(newMode);

  }, [currentTheme, setMode]);

  const updatePreferences = useCallback(
    (updates: Partial<ThemePreferences>) => {
      const newPreferences = { ...preferences, ...updates};

      setPreferences(newPreferences);

      savePreferences(newPreferences);

    },
    [preferences, savePreferences],);

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
    resetToDefaults,};

  return (
            <ThemeContext.Provider value={ contextValue } />
      {children}
    </ThemeContext.Provider>);};

// ===== HOOK =====
export const useAdvancedTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      "useAdvancedTheme must be used within an AdvancedThemeProvider",);

  }
  return context;};

// ===== THEME SWITCHER COMPONENT =====
interface ThemeSwitcherProps {
  className?: string;
  showColorPicker?: boolean;
  showVariantPicker?: boolean;
  compact?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = "",
  showColorPicker = true,
  showVariantPicker = false,
  compact = false,
   }) => {
  const {
    preferences,
    currentTheme,
    setMode,
    setColor,
    setVariant,
    toggleMode,
  } = useAdvancedTheme();

  if (compact) {
    return (
              <button
        onClick={ toggleMode }
        className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className} `}
        title={`Alternar para modo ${currentTheme === "light" ? "escuro" : "claro"}`} />
        {currentTheme === "light" ? "🌙" : "☀️"}
      </button>);

  }

  return (
        <>
      <div className={`space-y-4 ${className} `}>
      </div>{/* Mode Selector */}
      <div>
           
        </div><label className="block text-sm font-medium mb-2">Modo do Tema</label>
        <div className="{(["light", "dark", "system", "auto"] as ThemeMode[]).map((mode: unknown) => (">$2</div>
            <button
              key={ mode }
              onClick={ () => setMode(mode) }
              className={`p-2 text-xs rounded-lg border transition-colors ${
                preferences.mode === mode
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                  : "border-gray-300 hover:border-gray-400"
              } `}
  >
              {mode === "light" && "☀️ Claro"}
              {mode === "dark" && "🌙 Escuro"}
              {mode === "system" && "💻 Sistema"}
              {mode === "auto" && "🕐 Auto"}
            </button>
          ))}
        </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div>
           
        </div><label className="block text-sm font-medium mb-2">Cor do Tema</label>
          <div className="{(">$2</div>
              [
                "blue",
                "purple",
                "green",
                "orange",
                "red",
                "pink",
              ] as ThemeColor[]
            ).map((color: unknown) => (
              <button
                key={ color }
                onClick={ () => setColor(color) }
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  preferences.color === color
                    ? "border-gray-900 dark:border-white"
                    : "border-gray-300"
                } `}
                style={backgroundColor:
                    color === "blue"
                      ? "#3b82f6"
                      : color === "purple"
                        ? "#8b5cf6"
                        : color === "green"
                          ? "#10b981"
                          : color === "orange"
                            ? "#f59e0b"
                            : color === "red"
                              ? "#ef4444"
                              : "#ec4899",
                } title={`Tema ${color}`} />
            ))}
          </div>
      )}

      {/* Variant Picker */}
      {showVariantPicker && (
        <div>
           
        </div><label className="block text-sm font-medium mb-2" />
            Variante do Design
          </label>
          <div className="{(">$2</div>
              ["default", "minimal", "colorful", "corporate"] as ThemeVariant[]
            ).map((variant: unknown) => (
              <button
                key={ variant }
                onClick={ () => setVariant(variant) }
                className={`p-2 text-xs rounded-lg border transition-colors ${
                  preferences.variant === variant
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-300 hover:border-gray-400"
                } `}
  >
                {variant === "default" && "Padrão"}
                {variant === "minimal" && "Minimalista"}
                {variant === "colorful" && "Colorido"}
                {variant === "corporate" && "Corporativo"}
              </button>
            ))}
          </div>
      )}
    </div>);};

// Components are already exported individually above

// Default export for compatibility
export default AdvancedThemeProvider;
