/**
 * Componente Alert - Alertas e Notifica??es
 *
 * @description
 * Componente de alerta para exibir mensagens informativas, de sucesso,
 * aviso ou erro. Suporta m?ltiplas variantes, ?cones e estilos customiz?veis.
 *
 * Funcionalidades principais:
 * - M?ltiplas variantes (default, success, warning, error, info)
 * - ?cones autom?ticos por variante
 * - Suporte a t?tulo e descri??o
 * - Bot?o de fechar opcional
 * - Acessibilidade (role="alert", aria-live)
 * - Suporte completo a dark mode
 * - Estilos customiz?veis via className
 *
 * @module components/ui/alert
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Alert from '@/shared/components/ui/alert';
 *
 * // Alert b?sico
 * <Alert variant="info" />
 *   Esta ? uma mensagem informativa
 * </Alert>
 *
 * // Alert com t?tulo e descri??o
 * <Alert
 *   variant="success"
 *   title="Opera??o conclu?da"
 *   description="Os dados foram salvos com sucesso."
 * / />
 *
 * // Alert com bot?o de fechar
 * <Alert
 *   variant="error"
 * />
 *   Erro ao processar requisi??o
 * </Alert>
 * ```
 */

import React from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Variantes dispon?veis para o alert
 *
 * @typedef {'default' | 'success' | 'warning' | 'error' | 'info'} AlertVariant
 */
type AlertVariant = "default" | "success" | "warning" | "error" | "info";

/**
 * Props do componente Alert
 *
 * @description
 * Propriedades que podem ser passadas para o componente Alert.
 *
 * @interface AlertProps
 * @property {React.ReactNode} children - Conte?do do alerta
 * @property {AlertVariant} [variant='default'] - Variante do alerta (opcional, padr?o: 'default')
 * @property {string} [title] - T?tulo do alerta (opcional)
 * @property {string} [description] - Descri??o do alerta (opcional)
 * @property {boolean} [dismissible=false] - Se o alerta pode ser fechado (opcional, padr?o: false)
 * @property {() => void} [onClose] - Fun??o chamada ao fechar o alerta (opcional)
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 */
interface AlertProps {
  children?: React.ReactNode;
  variant?: AlertVariant;
  title?: string;
  description?: string;
  dismissible?: boolean;
  onClose???: (e: any) => void;
  className?: string; }

/**
 * Componente Alert
 *
 * @description
 * Renderiza um alerta com suporte a m?ltiplas variantes, ?cones autom?ticos
 * e bot?o de fechar opcional. Componente acess?vel com role="alert" e aria-live.
 *
 * @component
 * @param {AlertProps} props - Props do componente
 * @param {React.ReactNode} [props.children] - Conte?do do alerta
 * @param {AlertVariant} [props.variant='default'] - Variante do alerta
 * @param {string} [props.title] - T?tulo do alerta
 * @param {string} [props.description] - Descri??o do alerta
 * @param {boolean} [props.dismissible=false] - Se pode ser fechado
 * @param {() => void} [props.onClose] - Fun??o ao fechar
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de alerta
 */
const Alert: React.FC<AlertProps> = ({ children,
  variant = "default",
  title,
  description,
  dismissible = false,
  onClose,
  className = "",
   }) => {
  const variantConfig = {
    default: {
      bg: "bg-gray-50 dark:bg-gray-800",
      border: "border-gray-200 dark:border-gray-700",
      text: "text-gray-800 dark:text-gray-200",
      icon: Info,
      iconColor: "text-gray-500 dark:text-gray-400",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-200",
      icon: CheckCircle,
      iconColor: "text-green-500 dark:text-green-400",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-800 dark:text-yellow-200",
      icon: AlertTriangle,
      iconColor: "text-yellow-500 dark:text-yellow-400",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      icon: AlertCircle,
      iconColor: "text-red-500 dark:text-red-400",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-200",
      icon: Info,
      iconColor: "text-blue-500 dark:text-blue-400",
    },};

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
        <>
      <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-lg border p-4 ${config.bg} ${config.border} ${config.text} ${className}`}>
      </div><Icon
        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.iconColor} `}
        aria-hidden="true"
      / />
      <div className="{title && ">$2</div><h4 className="font-semibold mb-1">{title}</h4>}
        {description && <p className="text-sm opacity-90">{description}</p>}
        {children && !description && <div>{children}</div>}
      </div>
      {dismissible && onClose && (
        <button
          type="button"
          onClick={ onClose }
          className={`flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${config.text} opacity-70 hover:opacity-100`}
          aria-label="Fechar alerta" />
          <X className="h-4 w-4" />
        </button>
      )}
    </div>);};

// Named exports for compatibility
export const AlertTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h4 className={`font-semibold mb-1 ${className} `}>{children}</h4>);

export const AlertDescription = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm opacity-90 ${className} `}>{children}</p>);

export { Alert };

export default Alert;
