/**
 * Configuração Unificada de Tema - xWin Dash
 *
 * @description
 * Configuração centralizada de tema que define todas as cores, espaçamentos,
 * variantes e estilos para toda a aplicação. Suporta modo claro e escuro
 * com transições suaves.
 *
 * Funcionalidades principais:
 * - Cores principais e secundárias (light/dark)
 * - Backgrounds para diferentes contextos
 * - Espaçamentos padronizados
 * - Variantes de componentes
 * - Configurações de tipografia
 * - Transições e animações
 *
 * @module config/theme
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { THEME_CONFIG } from '@/config/theme';
 *
 * // Usar cores do tema
 * const primaryColor = THEME_CONFIG.colors.primary.light;
 * const backgroundColor = THEME_CONFIG.backgrounds.primary.light;
 * ```
 */

export const THEME_CONFIG: unknown = {
  // Cores principais
  colors: {
    primary: {
      light: "blue-600",
      dark: "blue-400",
      hover: {
        light: "blue-700",
        dark: "blue-300",
      },
    },
    secondary: {
      light: "gray-600",
      dark: "gray-400",
      hover: {
        light: "gray-700",
        dark: "gray-300",
      },
    },
    success: {
      light: "green-600",
      dark: "green-400",
    },
    warning: {
      light: "yellow-600",
      dark: "yellow-400",
    },
    error: {
      light: "red-600",
      dark: "red-400",
    },
    info: {
      light: "blue-600",
      dark: "blue-400",
    },
  },

  // Backgrounds
  backgrounds: {
    primary: {
      light: "white",
      dark: "gray-800",
    },
    secondary: {
      light: "gray-50",
      dark: "gray-700",
    },
    elevated: {
      light: "gray-50",
      dark: "gray-700",
    },
    page: {
      light: "gray-50",
      dark: "gray-900",
    },
  },

  // Textos
  text: {
    primary: {
      light: "gray-900",
      dark: "white",
    },
    secondary: {
      light: "gray-600",
      dark: "gray-400",
    },
    tertiary: {
      light: "gray-500",
      dark: "gray-400",
    },
    muted: {
      light: "gray-500",
      dark: "gray-400",
    },
  },

  // Bordas
  borders: {
    primary: {
      light: "gray-200",
      dark: "gray-700",
    },
    secondary: {
      light: "gray-300",
      dark: "gray-600",
    },
    focus: {
      light: "blue-500",
      dark: "blue-400",
    },
  },

  // Sombras
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  },

  // Transições
  transitions: {
    fast: "transition-all duration-150 ease-in-out",
    normal: "transition-all duration-200 ease-in-out",
    slow: "transition-all duration-300 ease-in-out",
  },

  // Espaçamentos
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },

  // Border radius
  radius: {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  },
} as const;

/**
 * Gera classes CSS para tema light/dark
 */
export const getThemeClasses = (baseClasses: string,
  variant: "light" | "dark" = "light",
) => {
  const isDark = variant === "dark";

  return baseClasses
    .replace(/bg-white/g, isDark ? "bg-gray-800" : "bg-white")
    .replace(/bg-gray-50/g, isDark ? "bg-gray-700" : "bg-gray-50")
    .replace(/text-gray-900/g, isDark ? "text-white" : "text-gray-900")
    .replace(/text-gray-600/g, isDark ? "text-gray-400" : "text-gray-600")
    .replace(/text-gray-500/g, isDark ? "text-gray-400" : "text-gray-500")
    .replace(/border-gray-200/g, isDark ? "border-gray-700" : "border-gray-200")
    .replace(
      /border-gray-300/g,
      isDark ? "border-gray-600" : "border-gray-300",);};

/**
 * Classes CSS comuns para componentes
 */
export const COMMON_CLASSES: unknown = {
  // Botões
  button: {
    base: "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out",
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    outline:
      "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700",
    ghost:
      "text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700",
  },

  // Inputs
  input: {
    base: "w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    error: "border-red-500 dark:border-red-400 focus:ring-red-500",
  },

  // Cards
  card: {
    base: "rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm",
    elevated:
      "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-250 ease-in-out hover:-translate-y-1",
  },

  // Layouts
  layout: {
    page: "min-h-screen bg-gray-50 dark:bg-gray-900",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    header:
      "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm",
  },
} as const;

export default THEME_CONFIG;
