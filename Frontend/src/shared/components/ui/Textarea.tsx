/**
 * Componente Textarea - Campo de Texto Multilinha
 *
 * @description
 * Componente de textarea para entrada de texto multilinha. Suporta label,
 * erro, helper text, estados de sucesso/erro e tema. Projetado para ser o
 * componente de textarea padr?o da aplica??o.
 *
 * Funcionalidades principais:
 * - Label opcional
 * - Mensagens de erro e helper text
 * - Estado de sucesso visual
 * - Resize configur?vel
 * - Integra??o com React Hook Form via forwardRef
 * - Suporte completo a dark mode
 * - Estados de erro e sucesso com feedback visual
 * - Acessibilidade (ARIA, labels)
 *
 * @module components/ui/Textarea
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { Textarea } from '@/shared/components/ui/Textarea';
 *
 * // Textarea b?sico
 * <Textarea label="Descri??o" placeholder="Digite sua descri??o..." / />
 *
 * // Textarea com erro
 * <Textarea
 *   label="Coment?rio"
 *   error="Campo obrigat?rio"
 *   rows={ 5 }
 * / />
 *
 * // Textarea com estado de sucesso
 * <Textarea
 *   label="Mensagem"
 *   success
 *   helperText="Texto v?lido"
 *   rows={ 4 }
 * / />
 * ```
 */

import React from "react";
import PropTypes from "prop-types";
import { cn } from '@/lib/utils';

/**
 * Props do componente Textarea
 *
 * @description
 * Propriedades que podem ser passadas para o componente Textarea.
 * Estende todas as propriedades de textarea HTML padr?o.
 *
 * @interface TextareaProps
 * @extends React.TextareaHTMLAttributes<HTMLTextAreaElement />
 * @property {string} [label] - Label do campo
 * @property {string} [error] - Mensagem de erro
 * @property {string} [helperText] - Texto de ajuda
 * @property {boolean} [success=false] - Estado de sucesso
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  className?: string;
}

/**
 * Componente Textarea
 *
 * @description
 * Renderiza um campo de textarea com suporte a label, erro, helper text
 * e estados de sucesso/erro. Usa React.forwardRef para integra??o com
 * React Hook Form.
 *
 * @component
 * @param {TextareaProps} props - Props do componente
 * @param {string} [props.label] - Label do campo
 * @param {string} [props.error] - Mensagem de erro
 * @param {string} [props.helperText] - Texto de ajuda
 * @param {boolean} [props.success=false] - Estado de sucesso
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de textarea
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, helperText, success = false, className = "", ...props },
    ref,
  ) => {
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    return (
              <div className="{label && (">$2</div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" />
            {label}
          </label>
        )}
        <textarea
          ref={ ref }
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-800 px-3 py-2 text-sm",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-y",
            hasError &&
              "border-red-500 dark:border-red-500 focus-visible:ring-red-500",
            hasSuccess &&
              "border-green-500 dark:border-green-500 focus-visible:ring-green-500",
            className,
          )} aria-invalid={ hasError }
          aria-describedby={ error
              ? "textarea-error"
              : helperText
                ? "textarea-helper"
                : undefined
           }
          { ...props }>
          {error && (
          <p
            id="textarea-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id="textarea-helper"
            className="mt-1 text-sm text-gray-500 dark:text-gray-400" />
            {helperText}
          </p>
        )}
      </div>);

  },);

Textarea.displayName = "Textarea";

export { Textarea };

export default Textarea;
