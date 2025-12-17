/**
 * Componente GlobalError - Erro Global Modal
 *
 * @description
 * Componente que exibe um modal de erro global com backdrop, ?cone, t?tulo,
 * mensagem e bot?es de a??o (tentar novamente e fechar). Ideal para erros
 * cr?ticos que requerem aten??o imediata do usu?rio.
 *
 * @example
 * ```tsx
 * <GlobalError
 *   title="Erro ao salvar"
 *   message="N?o foi poss?vel salvar os dados"
 *   onRetry={ () => retrySave() }
 *   onClose={ () => closeError() }
 * />
 * ```
 *
 * @module components/ui/GlobalError
 * @since 1.0.0
 */
import React from "react";
import { AlertCircle } from 'lucide-react';
import Button from "./Button";

/**
 * Props do componente GlobalError
 *
 * @description
 * Propriedades que podem ser passadas para o componente GlobalError.
 *
 * @interface GlobalErrorProps
 * @property {string} [title] - T?tulo do erro (padr?o: 'Ocorreu um erro')
 * @property {string} [message] - Mensagem de erro a ser exibida (padr?o: 'Algo deu errado. Por favor, tente novamente.')
 * @property {() => void} [onRetry] - Fun??o chamada quando o usu?rio clica em "Tentar novamente"
 * @property {() => void} [onClose] - Fun??o chamada quando o usu?rio clica em "Fechar"
 * @property {string} [retryLabel] - Label do bot?o de tentar novamente (padr?o: 'Tentar novamente')
 * @property {string} [closeLabel] - Label do bot?o de fechar (padr?o: 'Fechar')
 * @property {string} [className] - Classes CSS adicionais para customiza??o
 */
interface GlobalErrorProps {
  /** T?tulo do erro (padr?o: 'Ocorreu um erro') */
title?: string;
  /** Mensagem de erro a ser exibida (padr?o: 'Algo deu errado. Por favor, tente novamente.') */
message?: string;
  /** Fun??o chamada quando o usu?rio clica em "Tentar novamente" */
onRetry???: (e: any) => void;
  /** Fun??o chamada quando o usu?rio clica em "Fechar" */
onClose???: (e: any) => void;
  /** Label do bot?o de tentar novamente (padr?o: 'Tentar novamente') */
retryLabel?: string;
  /** Label do bot?o de fechar (padr?o: 'Fechar') */
closeLabel?: string;
  /** Classes CSS adicionais para customiza??o */
className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente GlobalError
 *
 * @description
 * Renderiza um modal de erro global fixo na tela com backdrop, ?cone de alerta,
 * t?tulo, mensagem e bot?es de a??o opcionais.
 *
 * @component
 * @param {GlobalErrorProps} props - Props do componente
 * @returns {JSX.Element} Modal de erro global estilizado
 */
const GlobalError: React.FC<GlobalErrorProps> = ({ title = "Ocorreu um erro",
  message = "Algo deu errado. Por favor, tente novamente.",
  onRetry,
  onClose,
  retryLabel = "Tentar novamente",
  closeLabel = "Fechar",
  className = "",
   }) => {
  return (
        <>
      <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className} `}
      role="alert"
      aria-live="assertive">
      </div><div className="absolute inset-0 bg-black/40">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><AlertCircle className="h-6 w-6 text-red-500 mt-0.5" />
          <div className=" ">$2</div><h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
          </div>
        <div className="{ onClose && (">$2</div>
            <Button variant="secondary" onClick={onClose } />
              {closeLabel}
            </Button>
          )}
          {onRetry && (
            <Button onClick={onRetry} variant="primary" />
              {retryLabel}
            </Button>
          )}
        </div>
    </div>);};

export default GlobalError;
