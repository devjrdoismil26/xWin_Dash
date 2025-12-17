/**
 * Componente InputLabel - Label de Campo de Formul?rio
 *
 * @description
 * Componente de label reutiliz?vel para campos de formul?rio com suporte
 * a indicador de obrigat?rio, valor e children. Estende as propriedades
 * padr?o de label HTML com funcionalidades adicionais.
 *
 * Funcionalidades principais:
 * - Suporte a value ou children
 * - Indicador visual de campo obrigat?rio (asterisco)
 * - Integra??o com React.forwardRef
 * - Estilo consistente com design system
 * - Suporte completo a dark mode
 * - Acessibilidade (for/id association)
 *
 * @module components/ui/InputLabel
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import InputLabel from '@/shared/components/ui/InputLabel';
 *
 * // Label b?sico
 * <InputLabel value="Nome" / />
 *
 * // Label com indicador obrigat?rio
 * <InputLabel value="Email" required / />
 *
 * // Label com children
 * <InputLabel htmlFor="username" />
 *   Nome de usu?rio
 * </InputLabel>
 * ```
 */

import React from "react";

/**
 * Props do componente InputLabel
 *
 * @description
 * Propriedades que podem ser passadas para o componente InputLabel.
 * Estende todas as propriedades de label HTML padr?o.
 *
 * @interface InputLabelProps
 * @extends React.LabelHTMLAttributes<HTMLLabelElement />
 * @property {string} [value] - Texto do label (alternativa a children)
 * @property {string} [className] - Classes CSS adicionais
 * @property {React.ReactNode} [children] - Conte?do do label (alternativa a value)
 * @property {boolean} [required=false] - Se o campo ? obrigat?rio (mostra asterisco)
 */
interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
  className?: string;
  children?: React.ReactNode;
  required?: boolean;
}

/**
 * Componente InputLabel
 *
 * @description
 * Renderiza um label para campos de formul?rio com suporte a indicador de obrigat?rio.
 *
 * @component
 * @param {InputLabelProps} props - Props do componente
 * @param {React.Ref<HTMLLabelElement>} ref - Refer?ncia para o elemento label
 * @returns {JSX.Element} Componente de label
 */
const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ value, className = "", children, required = false, ...props }, ref) => (
    <label
      ref={ ref }
      className={`block text-sm font-medium text-gray-700 mb-1 ${className} `}
      { ...props } />
      {value || children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  ),);

InputLabel.displayName = "InputLabel";

export default InputLabel;
