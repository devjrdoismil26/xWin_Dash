/**
 * Componente SimpleSelect - Select Simples
 *
 * @description
 * Componente de select HTML nativo estilizado com Tailwind CSS. Fornece uma
 * interface simples e acess?vel para sele??o de op??es em formul?rios.
 * Diferente de componentes de select avan?ados, este componente utiliza o
 * elemento <select> nativo do HTML, garantindo melhor compatibilidade e
 * acessibilidade nativa.
 *
 * @example
 * ```tsx
 * <SimpleSelect
 *   value={ selectedValue }
 *   onChange={ (e: unknown) => setSelectedValue(e.target.value) }
 * >
 *   <option value="option1">Op??o 1</option>
 *   <option value="option2">Op??o 2</option>
 * </SimpleSelect>
 * ```
 *
 * @module components/ui/SimpleSelect
 * @since 1.0.0
 */
import React from "react";
import { cn } from '@/lib/utils';

/**
 * Props do componente SimpleSelect
 *
 * @description
 * Propriedades que podem ser passadas para o componente SimpleSelect.
 *
 * @interface SimpleSelectProps
 * @property {string | number} [value] - Valor atual selecionado do select
 * @property {(event: React.ChangeEvent<HTMLSelectElement>) => void} onChange - Fun??o chamada quando o valor muda
 * @property {React.ReactNode} children - Elementos <option> do select
 * @property {string} [className] - Classes CSS adicionais para customiza??o
 * @property {boolean} [disabled] - Se o select est? desabilitado
 * @property {React.HTMLAttributes<HTMLSelectElement>} [props] - Props adicionais do elemento select HTML nativo
 */
interface SimpleSelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  /** Valor atual selecionado do select */
  value?: string | number;
  /** Fun??o chamada quando o valor muda */
  onChange?: (e: any) => void;
  /** Elementos <option> do select */
  children: React.ReactNode;
  /** Classes CSS adicionais para customiza??o */
  className?: string;
  /** Se o select est? desabilitado */
  disabled?: boolean;
}

/**
 * Componente SimpleSelect
 *
 * @description
 * Renderiza um elemento <select> HTML nativo estilizado com Tailwind CSS.
 * Ideal para casos simples onde n?o ? necess?rio um componente de select
 * avan?ado com busca ou m?ltipla sele??o.
 *
 * @component
 * @param {SimpleSelectProps} props - Props do componente
 * @returns {JSX.Element} Elemento select estilizado
 */
const SimpleSelect: React.FC<SimpleSelectProps> = ({ value,
  onChange,
  onValueChange,
  children,
  className = "",
  disabled = false,
  ...props
   }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event);

    }
    if (onValueChange) {
      onValueChange(event.target.value);

    } ;

  return (
            <select
      value={ value }
      onChange={ handleChange }
      onChange={ onChange }
      disabled={ disabled }
      className={cn(
        "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "bg-white text-gray-900",
        "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
        className,
      )} { ...props } />
      {children}
    </select>);};

// Named exports for compatibility
export const Select = SimpleSelect;
export const SelectTrigger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`select-trigger ${className} `}>{children}</div>);

export const SelectValue = ({ children, className = '' }: { children?: React.ReactNode; className?: string; placeholder?: string }) => (
  <span className={`select-value ${className} `}>{children}</span>);

export const SelectContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`select-content ${className} `}>{children}</div>);

export const SelectItem = ({ children, value, className = '' }: { children: React.ReactNode; value: string; className?: string }) => (
  <option value={value} className={className } >{children}</option>);

export default SimpleSelect;
