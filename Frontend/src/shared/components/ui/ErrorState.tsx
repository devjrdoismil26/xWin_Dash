/**
 * Componente ErrorState - Estado de Erro
 *
 * @description
 * Componente que exibe uma tela de erro com mensagem, ?cone e op??o de
 * tentar novamente. Ideal para exibir erros de forma amig?vel e permitir
 * que o usu?rio recupere da falha.
 *
 * @example
 * ```tsx
 * <ErrorState
 *   message="N?o foi poss?vel carregar os dados"
 *   onRetry={ () => refetchData() }
 * />
 * ```
 *
 * @module components/ui/ErrorState
 * @since 1.0.0
 */
import React from "react";
import { AlertCircle } from 'lucide-react';

/**
 * Props do componente ErrorState
 *
 * @description
 * Propriedades que podem ser passadas para o componente ErrorState.
 *
 * @interface ErrorStateProps
 * @property {string} [message] - Mensagem de erro a ser exibida (padr?o: 'Ocorreu um erro')
 * @property {() => void} [onRetry] - Fun??o chamada quando o usu?rio clica em "Tentar Novamente"
 * @property {string} [className] - Classes CSS adicionais para customiza??o
 */
interface ErrorStateProps {
  /** Mensagem de erro a ser exibida (padr?o: 'Ocorreu um erro') */
message?: string;
  /** Fun??o chamada quando o usu?rio clica em "Tentar Novamente" */
onRetry???: (e: any) => void;
  /** Classes CSS adicionais para customiza??o */
className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ErrorState
 *
 * @description
 * Renderiza uma tela de erro centralizada com ?cone de alerta, t?tulo,
 * mensagem e bot?o opcional para tentar novamente.
 *
 * @component
 * @param {ErrorStateProps} props - Props do componente
 * @returns {JSX.Element} Tela de erro estilizada
 */
const ErrorState: React.FC<ErrorStateProps> = ({ message = "Ocorreu um erro",
  onRetry,
  className = "",
   }) => {
  return (
        <>
      <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className} `}>
      </div><AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Erro</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={ onRetry }
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" />
          Tentar Novamente
        </button>
      )}
    </div>);};

export { ErrorState };

export default ErrorState;
