/**
 * Componente ApplicationLogo - Logo da Aplica??o
 *
 * @description
 * Componente que renderiza o logo da aplica??o xWin Dash. Exibe um SVG
 * customizado com o nome da aplica??o e cores do tema.
 *
 * Funcionalidades principais:
 * - SVG responsivo com dimens?es customiz?veis
 * - Classes CSS adicionais para personaliza??o
 * - Layout simples e acess?vel
 *
 * @module components/ui/ApplicationLogo
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import ApplicationLogo from '@/shared/components/ui/ApplicationLogo';
 *
 * // Logo padr?o
 * <ApplicationLogo / />
 *
 * // Logo com tamanho customizado
 * <ApplicationLogo width={200} height={60} / />
 *
 * // Logo com classes adicionais
 * <ApplicationLogo className="mb-4" />
 * ```
 */

import React from "react";

/**
 * Props do componente ApplicationLogo
 *
 * @description
 * Propriedades que podem ser passadas para o componente ApplicationLogo.
 *
 * @interface ApplicationLogoProps
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 * @property {number} [width=120] - Largura do logo em pixels (opcional, padr?o: 120)
 * @property {number} [height=40] - Altura do logo em pixels (opcional, padr?o: 40)
 */
interface ApplicationLogoProps {
  className?: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ApplicationLogo
 *
 * @description
 * Renderiza o logo da aplica??o como um SVG com o texto "xWin Dash".
 *
 * @component
 * @param {ApplicationLogoProps} props - Props do componente
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {number} [props.width=120] - Largura do logo
 * @param {number} [props.height=40] - Altura do logo
 * @returns {JSX.Element} Componente de logo
 */
const ApplicationLogo: React.FC<ApplicationLogoProps> = ({ className = "",
  width = 120,
  height = 40,
   }) => (
  <svg
    width={ width }
    height={ height }
    viewBox="0 0 120 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className } />
    <rect width="120" height="40" rx="8" fill="#3B82F6" / />
    <text
      x="60"
      y="25"
      textAnchor="middle"
      className="fill-white text-lg font-bold" />
      xWin Dash
    </text>
  </svg>);

export default ApplicationLogo;
