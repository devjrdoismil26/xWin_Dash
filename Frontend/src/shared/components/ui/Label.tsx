/**
 * Componente Label - Label de Formul?rio
 *
 * @description
 * Componente de label reutiliz?vel para campos de formul?rio. Estende
 * as propriedades padr?o de label HTML com estilos consistentes e
 * suporte a dark mode.
 *
 * Funcionalidades principais:
 * - Estilos consistentes com design system
 * - Suporte completo a dark mode
 * - Integra??o com React.forwardRef
 * - Acessibilidade (for/id association)
 * - Suporte a classes customizadas
 *
 * @module components/ui/Label
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { Label } from '@/shared/components/ui/Label';
 *
 * // Label b?sico
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" / />
 *
 * // Label com classes customizadas
 * <Label htmlFor="name" className="font-bold" />
 *   Nome completo
 * </Label>
 * ```
 */

import React from "react";
import { cn } from '@/lib/utils';

/**
 * Props do componente Label
 *
 * @description
 * Propriedades que podem ser passadas para o componente Label.
 * Estende todas as propriedades de label HTML padr?o.
 *
 * @interface LabelProps
 * @extends React.LabelHTMLAttributes<HTMLLabelElement />
 * @property {React.ReactNode} children - Conte?do do label
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 */
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Componente Label
 *
 * @description
 * Renderiza um label de formul?rio com estilos consistentes e suporte
 * a dark mode. Usa React.forwardRef para permitir acesso direto ao elemento.
 *
 * @component
 * @param {LabelProps} props - Props do componente
 * @param {React.ReactNode} props.children - Conte?do do label
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de label
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
              <label
        ref={ ref }
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          "text-gray-900 dark:text-gray-100",
          className,
        )} { ...props } />
        {children}
      </label>);

  },);

Label.displayName = "Label";

export { Label };

export default Label;
