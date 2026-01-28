import React from 'react';
import { AlertCircle, WifiOff, XCircle, AlertTriangle, Bug, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Button from './Button';

export type ErrorType = 'network' | 'validation' | 'permission' | 'notFound' | 'server' | 'generic';

const errorConfig: Record<ErrorType, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; borderColor: string; defaultTitle: string }> = {
  network: { icon: WifiOff, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', defaultTitle: 'Problema de conexão' },
  validation: { icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', defaultTitle: 'Dados inválidos' },
  permission: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', defaultTitle: 'Acesso negado' },
  notFound: { icon: AlertTriangle, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', defaultTitle: 'Não encontrado' },
  server: { icon: Bug, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', defaultTitle: 'Erro no servidor' },
  generic: { icon: AlertCircle, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', defaultTitle: 'Erro' },
};

export interface BaseErrorProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  className?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  onGoBack?: () => void;
  retryLabel?: string;
  goHomeLabel?: string;
  goBackLabel?: string;
  children?: React.ReactNode;
}

export const ErrorState: React.FC<BaseErrorProps> = ({
  type = 'generic',
  title,
  message,
  className = '',
  onRetry,
  onGoHome,
  onGoBack,
  retryLabel = 'Tentar novamente',
  goHomeLabel = 'Início',
  goBackLabel = 'Voltar',
  children,
}) => {
  const cfg = errorConfig[type];
  const Icon = cfg.icon;
  const finalTitle = title || cfg.defaultTitle;

  return (
    <div className={`w-full border ${cfg.borderColor} ${cfg.bgColor} rounded-lg p-4 ${className}`} role="alert" aria-live="assertive">
      <div className="flex items-start">
        <Icon className={`h-5 w-5 ${cfg.color} mt-0.5`} />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900">{finalTitle}</h3>
          {message && <p className="mt-1 text-sm text-gray-700">{message}</p>}
          {children}
          {(onRetry || onGoBack || onGoHome) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {onRetry && (
                <Button size="sm" onClick={onRetry} icon={<RefreshCw className="h-4 w-4" />}>
                  {retryLabel}
                </Button>
              )}
              {onGoBack && (
                <Button size="sm" variant="secondary" onClick={onGoBack} icon={<ArrowLeft className="h-4 w-4" />}>
                  {goBackLabel}
                </Button>
              )}
              {onGoHome && (
                <Button size="sm" variant="secondary" onClick={onGoHome} icon={<Home className="h-4 w-4" />}>
                  {goHomeLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const NetworkError: React.FC<Omit<BaseErrorProps, 'type'>> = (props) => <ErrorState type="network" {...props} />;
export const ValidationError: React.FC<Omit<BaseErrorProps, 'type'>> = (props) => <ErrorState type="validation" {...props} />;
export const PermissionError: React.FC<Omit<BaseErrorProps, 'type'>> = (props) => <ErrorState type="permission" {...props} />;
export const NotFoundError: React.FC<Omit<BaseErrorProps, 'type'>> = (props) => <ErrorState type="notFound" {...props} />;
export const ServerError: React.FC<Omit<BaseErrorProps, 'type'>> = (props) => <ErrorState type="server" {...props} />;
export const GenericError: React.FC<Omit<BaseErrorProps, 'type'>> = (props) => <ErrorState type="generic" {...props} />;

export interface HandledErrorResult { message: string; type: ErrorType }

export const useErrorHandler = () => {
  const handleError = React.useCallback((error: unknown, customMessage?: string): HandledErrorResult => {
    let message = customMessage || 'Ocorreu um erro inesperado.';
    let type: ErrorType = 'generic';

    // Axios-like error shapes
    const anyErr = error as any;
    const status: number | undefined = anyErr?.response?.status ?? anyErr?.status;
    const dataMessage: string | undefined = anyErr?.response?.data?.message || anyErr?.message;

    if (typeof error === 'string') {
      message = error;
    } else if (dataMessage) {
      message = dataMessage;
    }

    if (typeof status === 'number') {
      if (status === 0) type = 'network';
      else if (status === 401 || status === 403) type = 'permission';
      else if (status === 404) type = 'notFound';
      else if (status === 422) type = 'validation';
      else if (status >= 500) type = 'server';
      else type = 'generic';
    }

    return { message, type };
  }, []);

  return { handleError };
};

export default ErrorState;
