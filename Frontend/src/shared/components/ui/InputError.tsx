/**
 * Componente InputError - Mensagem de Erro de Input
 *
 * @description
 * Componente que exibe mensagens de erro para campos de formul?rio.
 * Suporta duas props (message e text) para compatibilidade com vers?es anteriores.
 * Projetado para ser usado em conjunto com componentes de formul?rio.
 *
 * Funcionalidades principais:
 * - Exibi??o de mensagens de erro
 * - Suporte a duas props para compatibilidade (message, text)
 * - Estilo consistente com design system
 * - Renderiza??o condicional (n?o renderiza se n?o houver mensagem)
 * - Suporte completo a dark mode
 *
 * @module components/ui/InputError
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import InputError from '@/shared/components/ui/InputError';
 *
 * // Erro b?sico
 * <InputError message="Campo obrigat?rio" / />
 *
 * // Erro com compatibilidade (text)
 * <InputError text="Email inv?lido" / />
 *
 * // Erro com classes customizadas
 * <InputError message="Erro customizado" className="mb-2" />
 * ```
 */

import React from "react";

/**
 * Props do componente InputError
 *
 * @description
 * Propriedades que podem ser passadas para o componente InputError.
 *
 * @interface InputErrorProps
 * @property {string} [message] - Mensagem de erro (preferido)
 * @property {string} [text] - Mensagem de erro (para compatibilidade com vers?es anteriores)
 * @property {string} [className] - Classes CSS adicionais
 */
interface InputErrorProps {
  message?: string;
  text?: string;
  // For backward compatibility
className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente InputError
 *
 * @description
 * Renderiza uma mensagem de erro para campos de formul?rio. Suporta duas
 * props (message e text) para compatibilidade com vers?es anteriores.
 * N?o renderiza nada se n?o houver mensagem de erro.
 *
 * @component
 * @param {InputErrorProps} props - Props do componente
 * @param {string} [props.message] - Mensagem de erro (preferido)
 * @param {string} [props.text] - Mensagem de erro (para compatibilidade)
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element | null} Componente de erro ou null se n?o houver mensagem
 */
const InputError: React.FC<InputErrorProps> = ({ message,
  text,
  className = "",
   }) => {
  const errorMessage = message || text;
  if (!errorMessage) return null;
  return (
            <p className={`text-sm text-red-600 mt-1 ${className} `}>{errorMessage}</p>);};

export default InputError;
