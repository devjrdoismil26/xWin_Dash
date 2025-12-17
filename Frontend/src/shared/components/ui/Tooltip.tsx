/**
 * Componente Tooltip
 *
 * @description
 * Componente de tooltip reutiliz?vel com suporte a diferentes posicionamentos,
 * delay configur?vel, e acessibilidade completa.
 *
 * @module components/ui/Tooltip
 * @since 1.0.0
 */

import React, { useState, useCallback } from "react";
import { cn } from '@/lib/utils';

/**
 * Posi??es dispon?veis para o tooltip
 */
export type TooltipPosition = "top" | "bottom" | "left" | "right";

/**
 * Props do componente Tooltip
 *
 * @interface TooltipProps
 * @property {React.ReactNode} children - Elemento que acionar? o tooltip
 * @property {React.ReactNode | string} content - Conte?do do tooltip
 * @property {TooltipPosition} [position='top'] - Posi??o padr?o do tooltip
 * @property {TooltipPosition} [placement] - Posi??o espec?fica (sobrescreve position)
 * @property {number} [delay=200] - Delay em ms antes de mostrar o tooltip
 * @property {string} [className] - Classes CSS adicionais (opcional)
 * @property {boolean} [disabled=false] - Se o tooltip est? desabilitado
 */
export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode | string;
  position?: TooltipPosition;
  placement?: TooltipPosition;
  delay?: number;
  className?: string;
  disabled?: boolean; }

/**
 * Componente Tooltip
 *
 * @description
 * Tooltip reutiliz?vel que aparece quando o usu?rio passa o mouse sobre
 * um elemento. Suporta diferentes posicionamentos e delay configur?vel.
 *
 * @param {TooltipProps} props - Props do componente
 * @param {React.ReactNode} props.children - Elemento que acionar? o tooltip
 * @param {React.ReactNode | string} props.content - Conte?do do tooltip
 * @param {TooltipPosition} [props.position='top'] - Posi??o padr?o
 * @param {TooltipPosition} [props.placement] - Posi??o espec?fica
 * @param {number} [props.delay=200] - Delay em ms antes de mostrar
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {boolean} [props.disabled=false] - Se o tooltip est? desabilitado
 * @returns {JSX.Element} Tooltip renderizado
 *
 * @example
 * ```tsx
 * <Tooltip content="Informa??o adicional" position="top" />
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
const Tooltip: React.FC<TooltipProps> = ({ children,
  content,
  position = "top",
  placement,
  delay = 200,
  className,
  disabled = false,
   }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  /**
   * Posi??o atual do tooltip (placement tem prioridade sobre position)
   */
  const actualPosition: TooltipPosition = placement || position;

  /**
   * Handler para quando o mouse entra no elemento
   *
   * @description
   * Configura um timeout para mostrar o tooltip ap?s o delay especificado.
   */
  const handleMouseEnter = useCallback((): void => {
    if (disabled) return;

    // Limpar timeout anterior se existir
    if (timeoutId) {
      clearTimeout(timeoutId);

    }

    const id = setTimeout(() => {
      setIsVisible(true);

    }, delay);

    setTimeoutId(id);

  }, [disabled, delay, timeoutId]);

  /**
   * Handler para quando o mouse sai do elemento
   *
   * @description
   * Limpa o timeout e esconde o tooltip imediatamente.
   */
  const handleMouseLeave = useCallback((): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);

      setTimeoutId(null);

    }
    setIsVisible(false);

  }, [timeoutId]);

  /**
   * Classes CSS para posicionamento do tooltip
   */
  const positionClasses: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",};

  /**
   * Classes CSS para a seta do tooltip
   */
  const arrowClasses: Record<TooltipPosition, string> = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900",
    bottom:
      "bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900",
    left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900",
    right:
      "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900",};

  return (
        <>
      <div
      className="relative inline-block"
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ handleMouseLeave  }>
      </div>{children}
      { isVisible && content && (
        <div
          role="tooltip"
          aria-live="polite"
          className={cn(
            "absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-800 rounded shadow-lg whitespace-nowrap",
            positionClasses[actualPosition],
            className,
          )  }>
        </div>{typeof content === "string" ? <span>{content}</span> : content}
          <div
            className={cn(
              "absolute w-0 h-0 border-4",
              arrowClasses[actualPosition],
            )} aria-hidden="true"
          / />
          )}
        </div>
    </div>);};

export { Tooltip };

export default Tooltip;
