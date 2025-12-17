/**
 * Componente Input - Campo de Entrada de Texto
 *
 * @description
 * Componente de input de texto com suporte a label, erro, helper text, ?cones,
 * estados de sucesso/erro e tema. Projetado para ser o componente de input padr?o
 * da aplica??o.
 *
 * Funcionalidades principais:
 * - Label opcional
 * - Mensagens de erro e helper text
 * - Estado de sucesso visual
 * - Suporte a ?cones (esquerda/direita)
 * - Tema customiz?vel
 * - Integra??o com React Hook Form via forwardRef
 * - Suporte completo a dark mode
 * - Estados de erro e sucesso com feedback visual
 * - Acessibilidade (ARIA, labels)
 *
 * @module components/ui/Input
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Input from '@/shared/components/ui/Input';
 * import { Search, Mail } from 'lucide-react';
 *
 * // Input b?sico com label
 * <Input label="Email" type="email" placeholder="seu@email.com" / />
 *
 * // Input com ?cone e erro
 * <Input
 *   label="Buscar"
 *   icon={ <Search /> }
 *   error="Campo obrigat?rio"
 * />
 *
 * // Input com estado de sucesso
 * <Input
 *   label="Email"
 *   type="email"
 *   success
 *   helperText="Email v?lido"
 * / />
 * ```
 */

import React from "react";
import { cn } from '@/lib/utils';

/**
 * Props do componente Input
 *
 * @description
 * Propriedades que podem ser passadas para o componente Input.
 * Estende todas as propriedades de input HTML padr?o.
 *
 * @interface InputProps
 * @extends React.InputHTMLAttributes<HTMLInputElement />
 * @property {string} [label] - Label do campo
 * @property {string} [error] - Mensagem de erro
 * @property {string} [helperText] - Texto de ajuda
 * @property {boolean} [success=false] - Estado de sucesso
 * @property {React.ReactNode} [icon] - ?cone ? esquerda
 * @property {React.ReactNode} [rightIcon] - ?cone ? direita
 * @property {string} [theme] - Tema customiz?vel
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  theme?: string;
}

/**
 * Componente Input
 *
 * @description
 * Renderiza um campo de entrada de texto com suporte a label, erro, helper text e ?cones.
 *
 * @component
 * @param {InputProps} props - Props do componente
 * @param {React.Ref<HTMLInputElement>} ref - Refer?ncia para o elemento input
 * @returns {JSX.Element} Componente de input
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      success,
      icon,
      rightIcon,
      theme,
      ...props
    },
    ref,
  ) => {
    return (
              <div className="{label && (">$2</div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white" />
            {label}
          </label>
        )}
        <div className="{icon && (">$2</div>
            <div className="{icon}">$2</div>
    </div>
  )}
          <input
            ref={ ref }
            className={cn(
              "w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              error && "border-red-500 dark:border-red-400 focus:ring-red-500",
              success &&
                "border-green-500 dark:border-green-400 focus:ring-green-500",
              icon && "pl-10",
              rightIcon && "pr-10",
              className,
            )} { ...props }>
          {rightIcon && (
            <div className="{rightIcon}">$2</div>
    </div>
  )}
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400" />
            {helperText}
          </p>
        )}
      </div>);

  },);

Input.displayName = "Input";

export { Input };

export default Input;
