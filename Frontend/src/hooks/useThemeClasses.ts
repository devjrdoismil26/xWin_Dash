/**
 * Hook useThemeClasses - Classes de Tema
 *
 * @description
 * Hook para gerar classes CSS com tema aplicado de forma consistente
 * em toda a aplicação. Fornece acesso a classes pré-configuradas para
 * botões, inputs, cards, layouts e componentes comuns, todas com tema
 * aplicado automaticamente.
 *
 * Funcionalidades principais:
 * - Geração automática de classes com tema
 * - Classes pré-configuradas para componentes comuns
 * - Integração com ThemeProvider e AdvancedThemeProvider
 * - Consistência visual em toda a aplicação
 *
 * @module hooks/useThemeClasses
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { useThemeClasses } from '@/hooks/useThemeClasses';
 *
 * const { themeClass, classes } = useThemeClasses();

 *
 * // Usar classes pré-configuradas
 * <button className={classes.button.primary } >Botão</button>
 *
 * // Aplicar tema a classes customizadas
 * <div className={themeClass('bg-white dark:bg-gray-800') } >Conteúdo</div>
 * ```
 */

import { useTheme } from '@/shared/components/ThemeProvider';
import { useAdvancedTheme } from '@/shared/components/ui/AdvancedThemeProvider';
import { COMMON_CLASSES, getThemeClasses } from '@/config/theme';

/**
 * Hook useThemeClasses
 *
 * @description
 * Hook que fornece funções e objetos com classes CSS pré-configuradas
 * com tema aplicado automaticamente.
 *
 * @hook
 * @returns {Object} Objeto com themeClass e classes
 * @property {(baseClasses: string) => string} themeClass - Função para aplicar tema a classes
 * @property {Object} classes - Objeto com classes pré-configuradas (button, input, card, layout)
 *
 * @example
 * ```tsx
 * const { themeClass, classes } = useThemeClasses();

 *
 * // Classes de botão
 * const primaryButton = classes.button.primary;
 *
 * // Aplicar tema
 * const themedDiv = themeClass('p-4 bg-white dark:bg-gray-800');

 * ```
 */
export const useThemeClasses = () => {
  const { theme } = useTheme();

  const advancedTheme = useAdvancedTheme();

  const currentTheme = advancedTheme.currentTheme;

  /**
   * Gera classes CSS com tema aplicado
   */
  const themeClass = (baseClasses: string) => {
    return getThemeClasses(baseClasses, currentTheme);};

  /**
   * Classes comuns para componentes
   */
  const classes = {
    // Botões
    button: {
      base: COMMON_CLASSES.button.base,
      primary: `${COMMON_CLASSES.button.base} ${COMMON_CLASSES.button.primary}`,
      secondary: `${COMMON_CLASSES.button.base} ${COMMON_CLASSES.button.secondary}`,
      outline: `${COMMON_CLASSES.button.base} ${COMMON_CLASSES.button.outline}`,
      ghost: `${COMMON_CLASSES.button.base} ${COMMON_CLASSES.button.ghost}`,
    },

    // Inputs
    input: {
      base: COMMON_CLASSES.input.base,
      error: `${COMMON_CLASSES.input.base} ${COMMON_CLASSES.input.error}`,
    },

    // Cards
    card: {
      base: COMMON_CLASSES.card.base,
      elevated: COMMON_CLASSES.card.elevated,
    },

    // Layouts
    layout: {
      page: COMMON_CLASSES.layout.page,
      container: COMMON_CLASSES.layout.container,
      header: COMMON_CLASSES.layout.header,
    },

    // Cores do tema atual
    colors: {
      primary: currentTheme === "dark" ? "text-blue-400" : "text-blue-600",
      secondary: currentTheme === "dark" ? "text-gray-400" : "text-gray-600",
      success: currentTheme === "dark" ? "text-green-400" : "text-green-600",
      warning: currentTheme === "dark" ? "text-yellow-400" : "text-yellow-600",
      error: currentTheme === "dark" ? "text-red-400" : "text-red-600",
      info: currentTheme === "dark" ? "text-blue-400" : "text-blue-600",
    },

    // Backgrounds do tema atual
    backgrounds: {
      primary: currentTheme === "dark" ? "bg-gray-800" : "bg-white",
      secondary: currentTheme === "dark" ? "bg-gray-700" : "bg-gray-50",
      page: currentTheme === "dark" ? "bg-gray-900" : "bg-gray-50",
    },

    // Textos do tema atual
    text: {
      primary: currentTheme === "dark" ? "text-white" : "text-gray-900",
      secondary: currentTheme === "dark" ? "text-gray-400" : "text-gray-600",
      tertiary: currentTheme === "dark" ? "text-gray-400" : "text-gray-500",
      muted: currentTheme === "dark" ? "text-gray-400" : "text-gray-500",
    },

    // Bordas do tema atual
    borders: {
      primary: currentTheme === "dark" ? "border-gray-700" : "border-gray-200",
      secondary:
        currentTheme === "dark" ? "border-gray-600" : "border-gray-300",
      focus: currentTheme === "dark" ? "border-blue-400" : "border-blue-500",
    },};

  return {
    theme,
    currentTheme,
    advancedTheme,
    themeClass,
    classes,};
};

export default useThemeClasses;
