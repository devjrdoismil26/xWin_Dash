/**
 * Componente Progress - Barra de Progresso
 *
 * @description
 * Componente de barra de progresso com suporte a valor, m?ximo e gradiente.
 * Projetado para ser o componente de progresso padr?o da aplica??o.
 *
 * Funcionalidades principais:
 * - Valor e m?ximo configur?veis
 * - C?lculo autom?tico de porcentagem
 * - Gradiente visual (blue to purple)
 * - Anima??o suave de transi??o
 * - Suporte completo a dark mode
 * - Layout responsivo
 *
 * @module components/ui/Progress
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Progress from '@/shared/components/ui/Progress';
 *
 * // Progresso b?sico
 * <Progress value={50} max={100} / />
 *
 * // Progresso customizado
 * <Progress value={75} max={100} className="h-4" />
 *
 * // Progresso com valores espec?ficos
 * <Progress value={3} max={10} / />
 * ```
 */

import React from "react";

/**
 * Props do componente Progress
 *
 * @description
 * Propriedades que podem ser passadas para o componente Progress.
 *
 * @interface ProgressProps
 * @property {number} [value=0] - Valor atual do progresso
 * @property {number} [max=100] - Valor m?ximo do progresso
 * @property {string} [className=''] - Classes CSS adicionais
 * @property {React.HTMLAttributes<HTMLDivElement>} ...props - Props adicionais de div
 */
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  className?: string;
}

/**
 * Componente Progress
 *
 * @description
 * Renderiza uma barra de progresso com valor, m?ximo e gradiente visual.
 *
 * @component
 * @param {ProgressProps} props - Props do componente
 * @returns {JSX.Element} Componente de barra de progresso
 */
const Progress = ({
  value = 0,
  max = 100,
  className = "",
  ...props
}: ProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
        <>
      <div
      className={`w-full bg-gray-200 rounded-full overflow-hidden ${className} `}
      { ...props }>
      </div><div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
        style={width: `${percentage} %` } / />);

        </div>};

export { Progress };

export default Progress;
