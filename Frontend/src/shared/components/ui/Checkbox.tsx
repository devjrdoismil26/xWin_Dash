/**
 * Componente Checkbox - Campo de Sele??o
 *
 * @description
 * Componente de checkbox com suporte a m?ltiplos tamanhos, estados e
 * personaliza??o. Estende as propriedades padr?o de input HTML com
 * funcionalidades adicionais.
 *
 * Funcionalidades principais:
 * - M?ltiplos tamanhos (sm, md, lg, xl)
 * - Estados de foco com ring
 * - Estilos customiz?veis via className
 * - Suporte a todas as props padr?o de input
 * - Otimizado com React.memo
 * - Integra??o com formul?rios
 *
 * @module components/ui/Checkbox
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Checkbox from '@/shared/components/ui/Checkbox';
 *
 * // Checkbox b?sico
 * <Checkbox / />
 *
 * // Checkbox com tamanho
 * <Checkbox size="lg" / />
 *
 * // Checkbox com label
 * <label />
 *   <Checkbox checked={isChecked} onChange={handleChange} / />
 *   Aceito os termos
 * </label>
 * ```
 */

import React from "react";

/**
 * Tamanhos dispon?veis para o checkbox
 *
 * @typedef {'sm' | 'md' | 'lg' | 'xl'} ComponentSize
 */
type ComponentSize = "sm" | "md" | "lg" | "xl";

/**
 * Props do componente Checkbox
 *
 * @description
 * Propriedades que podem ser passadas para o componente Checkbox.
 * Estende todas as propriedades de input HTML padr?o, exceto 'size'
 * que ? usado para controlar o tamanho visual.
 *
 * @interface CheckboxProps
 * @extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>
 * @property {string} [className] - Classes CSS adicionais (opcional)
 * @property {ComponentSize} [size='md'] - Tamanho do checkbox (opcional, padr?o: 'md')
 */
interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  className?: string;
  size?: ComponentSize;
}

/**
 * Componente Checkbox
 *
 * @description
 * Renderiza um checkbox com suporte a m?ltiplos tamanhos e estilos.
 * Componente otimizado com React.memo para melhor performance.
 *
 * @component
 * @param {CheckboxProps} props - Props do componente
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {ComponentSize} [props.size='md'] - Tamanho do checkbox
 * @returns {JSX.Element} Componente de checkbox
 */
const Checkbox = React.memo(function Checkbox({
  className = "",
  size = "md",
  ...props
}: CheckboxProps) {
  const sizeClasses: Record<ComponentSize, string> = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6",};

  const baseClasses = `${sizeClasses[size]} rounded border-gray-300 text-blue-600 focus:ring-blue-500`;
  return (
            <input
      type="checkbox"
      className={`${baseClasses} ${className}`}
      {...props}
    / />);

});

export { Checkbox };

export default Checkbox;
