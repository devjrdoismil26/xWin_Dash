/**
 * Componente de toggle de tema
 *
 * @description
 * Permite alternar entre temas claro, escuro e sistema. Suporta seleção de cores
 * quando showColorPicker está habilitado. Pode ser renderizado em modo compacto.
 *
 * @module layouts/components/Header/ThemeToggle
 * @since 1.0.0
 */

import React from "react";
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useTheme } from '@/shared/components/ThemeProvider';
import { useAdvancedTheme } from '@/shared/components/ui/AdvancedThemeProvider';
import Button from "@/shared/components/ui/Button";
import Dropdown from "@/shared/components/ui/Dropdown";

/**
 * Props do componente ThemeToggle
 *
 * @interface ThemeToggleProps
 * @property {string} [className] - Classes CSS adicionais
 * @property {boolean} [showColorPicker] - Se deve exibir seletor de cores no dropdown (padrão: false)
 * @property {boolean} [compact] - Se deve renderizar apenas o ícone sem texto (padrão: true)
 */
interface ThemeToggleProps {
  className?: string;
  showColorPicker?: boolean;
  compact?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ThemeToggle
 *
 * @description
 * Botão para alternar entre temas claro, escuro e sistema. Suporta seleção de cores
 * através de dropdown quando showColorPicker está habilitado. Modo compacto exibe apenas ícone.
 *
 * @param {ThemeToggleProps} props - Props do componente
 * @returns {JSX.Element} Toggle de tema
 *
 * @example
 * ```tsx
 * // Modo compacto (apenas ícone)
 * <ThemeToggle compact={true} / />
 *
 * // Com seletor de cores
 * <ThemeToggle showColorPicker={true} compact={false} / />
 * ```
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "",
  showColorPicker = false,
  compact = true,
   }) => {
  const { theme, setTheme } = useTheme();

  const advancedTheme = useAdvancedTheme();

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");

    else if (theme === "dark") setTheme("system");

    else setTheme("light");};

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    } ;

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Modo claro";
      case "dark":
        return "Modo escuro";
      default:
        return "Modo sistema";
    } ;

  if (compact) {
    return (
              <Button
        variant="ghost"
        size="sm"
        onClick={ toggleTheme }
        className={`p-2 ${className} `}
        title={`Alternar tema - ${getLabel()}`} />
        {getIcon()}
      </Button>);

  }

  if (showColorPicker) { return (
        <>
      <Dropdown />
      <Dropdown.Trigger asChild />
          <Button variant="ghost" size="sm" className={className } />
            {getIcon()}
            <span className="ml-2 hidden sm:inline">{getLabel()}</span></Button></Dropdown.Trigger>
        <Dropdown.Content align="right" className="w-48" />
          <div className="Tema">$2</div>
          </div>

          {/* Mode Selection */}
          <div className=" ">$2</div><div className="{(["light", "dark", "system"] as const).map((mode: unknown) => (">$2</div>
                <button
                  key={ mode }
                  onClick={ () => setTheme(mode) }
                  className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                    theme === mode
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  } `}
  >
                  {mode === "light" && "☀️ Modo claro"}
                  {mode === "dark" && "🌙 Modo escuro"}
                  {mode === "system" && "💻 Modo sistema"}
                </button>
              ))}
            </div>

          {/* Color Picker */}
          <div className=" ">$2</div><div className="Cor do tema">$2</div>
            </div>
            <div className="{(">$2</div>
                ["blue", "purple", "green", "orange", "red", "pink"] as const
              ).map((color: unknown) => (
                <button
                  key={ color }
                  onClick={ () => advancedTheme.setColor(color) }
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    advancedTheme.preferences.color === color
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
        </Dropdown.Content>
      </Dropdown>);

  }

  return (
            <Button
      variant="ghost"
      size="sm"
      onClick={ toggleTheme }
      className={className} title={`Alternar tema - ${getLabel()}`} />
      {getIcon()}
      <span className="ml-2 hidden sm:inline">{getLabel()}</span>
    </Button>);};

export default ThemeToggle;
