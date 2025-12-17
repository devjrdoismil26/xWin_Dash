/**
 * Componente ThemeToggle
 *
 * @description
 * Componente para alternar o tema da aplica??o (light/dark/system).
 * Pode exibir vers?o simples ou avan?ada com controle de cores.
 *
 * @module components/ThemeToggle
 * @since 1.0.0
 */

import React, { useCallback, useMemo } from "react";
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAdvancedTheme } from './ui/AdvancedThemeProvider';
import Button from "./ui/Button";

/**
 * Props do componente ThemeToggle
 *
 * @interface ThemeToggleProps
 * @property {string} [className] - Classes CSS adicionais (opcional)
 * @property {boolean} [showAdvanced=false] - Se mostra vers?o avan?ada (opcional)
 */
interface ThemeToggleProps {
  className?: string;
  showAdvanced?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ThemeToggle
 *
 * @description
 * Bot?o para alternar o tema da aplica??o. Suporta dois modos:
 * - Simples: Apenas toggle do tema (light/dark/system)
 * - Avan?ado: Inclui controle de cores do tema avan?ado
 *
 * @param {ThemeToggleProps} props - Props do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {boolean} [props.showAdvanced=false] - Se mostra vers?o avan?ada
 * @returns {JSX.Element} Componente de toggle de tema
 *
 * @example
 * ```tsx
 * // Vers?o simples
 * <ThemeToggle / />
 *
 * // Vers?o avan?ada
 * <ThemeToggle showAdvanced / />
 * ```
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "",
  showAdvanced = false,
   }) => {
  const { theme, toggleTheme } = useTheme();

  const advancedTheme = useAdvancedTheme();

  /**
   * Obt?m o ?cone baseado no tema atual
   *
   * @returns {JSX.Element} ?cone do tema
   */
  const getIcon = useCallback((): JSX.Element => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" aria-hidden="true" />;
      case "dark":
        return <Moon className="h-4 w-4" aria-hidden="true" />;
      default:
        return <Monitor className="h-4 w-4" aria-hidden="true" />;
    } , [theme]);

  /**
   * Obt?m o r?tulo do tema atual
   *
   * @returns {string} R?tulo do tema
   */
  const getLabel = useCallback((): string => {
    switch (theme) {
      case "light":
        return "Modo claro";
      case "dark":
        return "Modo escuro";
      default:
        return "Modo sistema";
    } , [theme]);

  /**
   * Alterna a cor do tema avan?ado
   *
   * @description
   * Cicla entre as cores dispon?veis: blue -> purple -> green -> orange -> red -> pink -> blue
   */
  const toggleAdvancedColor = useCallback((): void => {
    const colorCycle: Array<
      "blue" | "purple" | "green" | "orange" | "red" | "pink"
    > = ["blue", "purple", "green", "orange", "red", "pink"];
    const currentIndex = colorCycle.indexOf(
      advancedTheme.preferences.color as (typeof colorCycle)[number],);

    const nextIndex = (currentIndex + 1) % colorCycle.length;
    advancedTheme.setColor(colorCycle[nextIndex]);

  }, [advancedTheme]);

  /**
   * ?cone do tema atual
   */
  const icon = useMemo(() => getIcon(), [getIcon]);

  /**
   * R?tulo do tema atual
   */
  const label = useMemo(() => getLabel(), [getLabel]);

  // Vers?o avan?ada com controle de cores
  if (showAdvanced) {
    return (
        <>
      <div className={`flex items-center space-x-2 ${className} `}>
      </div><Button
          variant="ghost"
          size="sm"
          onClick={ toggleTheme }
          aria-label={`Alternar tema - ${label}`}
          title={ label } />
          {icon}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={ toggleAdvancedColor }
          aria-label="Alternar cor do tema"
          title="Alternar cor do tema" />
          <Palette className="h-4 w-4" aria-hidden="true" / /></Button></div>);

  }

  // Vers?o simples
  return (
            <Button
      variant="ghost"
      size="sm"
      onClick={ toggleTheme }
      className={className} aria-label={`Alternar tema - ${label}`}
      title={ label } />
      {icon}
    </Button>);};

export default ThemeToggle;
