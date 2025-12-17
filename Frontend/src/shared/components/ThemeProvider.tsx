/**
 * Provider de Tema - ThemeProvider
 *
 * @description
 * Provider que gerencia o tema da aplica??o (light/dark/system),
 * sincroniza com localStorage e detecta prefer?ncias do sistema.
 *
 * @module components/ThemeProvider
 * @since 1.0.0
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

/**
 * Tipo de tema dispon?vel
 */
export type Theme = "light" | "dark" | "system";

/**
 * Tipo do Contexto de Tema
 *
 * @interface ThemeContextType
 * @property {Theme} theme - Tema atual
 * @property {Function} setTheme - Fun??o para definir tema
 * @property {Function} toggleTheme - Fun??o para alternar tema
 */
interface ThemeContextType {
  theme: Theme;
  setTheme?: (e: any) => void;
  toggleTheme??: (e: any) => void;
  toggleMode???: (e: any) => void;
  isDark?: boolean;
  updateTheme??: (e: any) => void; }

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook para usar o contexto de tema
 *
 * @description
 * Hook que retorna o contexto de tema. Deve ser usado dentro de um ThemeProvider.
 *
 * @returns {ThemeContextType} Objeto com tema e fun??es de controle
 * @throws {Error} Se usado fora de um ThemeProvider
 *
 * @example
 * ```tsx
 * const { theme, setTheme, toggleTheme } = useTheme();

 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");

  }
  return context;};

/**
 * Props do ThemeProvider
 *
 * @interface ThemeProviderProps
 * @property {React.ReactNode} children - Componentes filhos
 * @property {Theme} [defaultTheme='system'] - Tema padr?o (opcional)
 * @property {string} [storageKey='vite-ui-theme'] - Chave do localStorage (opcional)
 */
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string; }

/**
 * Provider de Tema
 *
 * @description
 * Provider que gerencia o tema da aplica??o, incluindo:
 * - Sincroniza??o com localStorage
 * - Detec??o de prefer?ncias do sistema (quando theme='system')
 * - Aplica??o de classes CSS no elemento raiz
 * - Toggle entre light/dark/system
 *
 * @param {ThemeProviderProps} props - Props do provider
 * @param {React.ReactNode} props.children - Componentes filhos
 * @param {Theme} [props.defaultTheme='system'] - Tema padr?o
 * @param {string} [props.storageKey='vite-ui-theme'] - Chave do localStorage
 * @returns {JSX.Element} Provider do contexto de tema
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="light" storageKey="my-app-theme" />
 *   <App / />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
   }) => {
  /**
   * Estado do tema atual
   *
   * @description
   * Inicializa o tema a partir do localStorage ou usa o defaultTheme.
   * Verifica se est? no servidor (SSR) antes de acessar localStorage.
   */
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    return savedTheme || defaultTheme;
  });

  /**
   * Aplica o tema ao elemento raiz do documento
   *
   * @description
   * Efeito que aplica classes CSS e atributos no elemento raiz (html)
   * baseado no tema atual. Se o tema for 'system', detecta a prefer?ncia
   * do sistema operacional.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);

      root.setAttribute("data-theme", systemTheme);

      return;
    }

    root.classList.add(theme);

    root.setAttribute("data-theme", theme);

  }, [theme]);

  /**
   * Listener para mudan?as na prefer?ncia do sistema
   *
   * @description
   * Efeito que monitora mudan?as na prefer?ncia de tema do sistema
   * quando o tema est? definido como 'system'.
   */
  useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (): void => {
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");

      root.classList.add(systemTheme);

      root.setAttribute("data-theme", systemTheme);};

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);

  }, [theme]);

  /**
   * Define um novo tema
   *
   * @description
   * Salva o tema no localStorage e atualiza o estado.
   *
   * @param {Theme} newTheme - Novo tema a ser aplicado
   */
  const setTheme = useCallback(
    (newTheme: Theme): void => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, newTheme);

      }
      setThemeState(newTheme);

    },
    [storageKey],);

  /**
   * Alterna o tema entre light -> dark -> system -> light
   *
   * @description
   * Cicla entre os tr?s temas dispon?veis.
   */
  const toggleTheme = useCallback((): void => {
    if (theme === "light") {
      setTheme("dark");

    } else if (theme === "dark") {
      setTheme("system");

    } else {
      setTheme("light");

    } , [theme, setTheme]);

  /**
   * Valor do contexto de tema
   *
   * @description
   * Memoiza o valor do contexto para evitar re-renders desnecess?rios.
   */
  // Helper para verificar se está em modo dark
  const isDark = useMemo(() => {
    if (theme === "system") {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return theme === "dark";
  }, [theme]);

  const contextValue = useMemo<ThemeContextType>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      toggleMode: toggleTheme,
      isDark,
      updateTheme: setTheme,
    }),
    [theme, setTheme, toggleTheme, isDark],);

  return (
            <ThemeContext.Provider value={ contextValue } />
      {children}
    </ThemeContext.Provider>);};

export default ThemeProvider;
