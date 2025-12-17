/**
 * Componente ScrollArea - ?rea de Rolagem
 *
 * @description
 * Componente de ?rea de rolagem customiz?vel com suporte a altura m?xima,
 * controle de scrollbar e estilos customiz?veis.
 *
 * Funcionalidades principais:
 * - Altura m?xima configur?vel
 * - Controle de visibilidade do scrollbar
 * - Estilos customiz?veis via className
 * - Suporte completo a dark mode
 * - Classes de scrollbar customizadas
 *
 * @module components/ui/ScrollArea
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { ScrollArea } from '@/shared/components/ui/ScrollArea';
 *
 * // ?rea de rolagem b?sica
 * <ScrollArea maxHeight="500px" />
 *   {longContent}
 * </ScrollArea>
 *
 * // ?rea de rolagem sem scrollbar
 * <ScrollArea maxHeight="300px" showScrollbar={ false } />
 *   {content}
 * </ScrollArea>
 * ```
 */

import React from "react";

/**
 * Props do componente ScrollArea
 *
 * @description
 * Propriedades que podem ser passadas para o componente ScrollArea.
 * Estende todas as propriedades de div HTML padr?o.
 *
 * @interface ScrollAreaProps
 * @extends React.HTMLAttributes<HTMLDivElement />
 * @property {React.ReactNode} children - Conte?do da ?rea de rolagem
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 * @property {string} [maxHeight='400px'] - Altura m?xima em pixels ou unidades CSS (opcional, padr?o: '400px')
 * @property {boolean} [showScrollbar=true] - Se mostra o scrollbar (opcional, padr?o: true)
 */
interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
  showScrollbar?: boolean;
}

/**
 * Componente ScrollArea
 *
 * @description
 * Renderiza uma ?rea de rolagem com altura m?xima configur?vel e controle
 * de visibilidade do scrollbar.
 *
 * @component
 * @param {ScrollAreaProps} props - Props do componente
 * @param {React.ReactNode} props.children - Conte?do da ?rea de rolagem
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {string} [props.maxHeight='400px'] - Altura m?xima
 * @param {boolean} [props.showScrollbar=true] - Se mostra o scrollbar
 * @returns {JSX.Element} Componente de ?rea de rolagem
 */
export const ScrollArea: React.FC<ScrollAreaProps> = ({ children,
  className = "",
  maxHeight = "400px",
  showScrollbar = true,
  ...props
   }) => {
  const scrollbarClasses = showScrollbar
    ? "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
    : "scrollbar-hide";
  return (
        <>
      <div
      className={`overflow-auto ${scrollbarClasses} ${className}`}
      style={maxHeight } { ...props }>
      </div>{children}
    </div>);};

export const ScrollBar = () => null;

export default ScrollArea;
