/**
 * Componentes de Estados de Erro - UI
 *
 * @description
 * Este módulo fornece componentes React para exibir diferentes tipos de erros
 * de forma consistente na aplicação. Inclui componentes específicos para cada
 * tipo de erro (network, validation, permission, etc.) e um hook para tratamento
 * de erros.
 *
 * Funcionalidades principais:
 * - Componente genérico de erro (ErrorState)
 * - Componentes especializados por tipo de erro
 * - Hook para tratamento de erros (useErrorHandler)
 * - Suporte a ações (retry, goHome, goBack)
 * - Acessibilidade completa (ARIA)
 *
 * @module components/ui/ErrorStates
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { ErrorState, NetworkError, useErrorHandler } from '@/shared/components/ui/ErrorStates';
 *
 * // Componente genérico
 * <ErrorState
 *   type="network"
 *   message="Falha na conexão"
 *   onRetry={ () => retry() }
 * />
 *
 * // Componente especializado
 * <NetworkError
 *   message="Sem conexão com a internet"
 *   onRetry={ () => retry() }
 * />
 *
 * // Hook para tratamento
 * const { handleError } = useErrorHandler();

 * const result = handleError(error, 'Mensagem customizada');

 * ```
 */

import React from "react";
import { AlertCircle, WifiOff, XCircle, AlertTriangle, Bug, RefreshCw, Home, ArrowLeft,  } from 'lucide-react';
import Button from "./Button";

/**
 * Tipo de erro
 *
 * @description
 * Tipos de erro suportados pelo sistema de estados de erro.
 *
 * @type {'network' | 'validation' | 'permission' | 'notFound' | 'server' | 'generic'}
 */
export type ErrorType =
  | "network"
  | "validation"
  | "permission"
  | "notFound"
  | "server"
  | "generic";

/**
 * Configuração de tipos de erro
 *
 * @description
 * Mapeia cada tipo de erro para sua configuração visual (ícone, cores, título).
 *
 * @constant {Record<ErrorType, ErrorConfig>}
 */
const errorConfig: Record<
  ErrorType,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    defaultTitle: string;
  }
  > = {
  network: {
    icon: WifiOff,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    defaultTitle: "Problema de conexão",
  },
  validation: {
    icon: AlertCircle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    defaultTitle: "Dados inválidos",
  },
  permission: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    defaultTitle: "Acesso negado",
  },
  notFound: {
    icon: AlertTriangle,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    defaultTitle: "Não encontrado",
  },
  server: {
    icon: Bug,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    defaultTitle: "Erro no servidor",
  },
  generic: {
    icon: AlertCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    defaultTitle: "Erro",
  },};

/**
 * Interface de props base para componentes de erro
 *
 * @description
 * Props compartilhadas por todos os componentes de erro.
 *
 * @example
 * ```tsx
 * const props: BaseErrorProps = {
 *   type: 'network',
 *   title: 'Erro de Conexão',
 *   message: 'Não foi possível conectar ao servidor',
 *   onRetry: () => retry(),
 *   retryLabel: 'Tentar novamente'
 *};

 * ```
 */
export interface BaseErrorProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  className?: string;
  onRetry???: (e: any) => void;
  onGoHome???: (e: any) => void;
  onGoBack???: (e: any) => void;
  retryLabel?: string;
  goHomeLabel?: string;
  goBackLabel?: string;
  children?: React.ReactNode; }

/**
 * Componente genérico de estado de erro
 *
 * @description
 * Componente que exibe estados de erro de forma consistente na aplicação.
 * Suporta diferentes tipos de erro, mensagens customizadas e ações (retry, goHome, goBack).
 *
 * @param {BaseErrorProps} props - Props do componente
 * @param {ErrorType} [props.type='generic'] - Tipo de erro a ser exibido
 * @param {string} [props.title] - Título customizado (usa título padrão se não fornecido)
 * @param {string} [props.message] - Mensagem de erro
 * @param {string} [props.className] - Classes CSS adicionais
 * @param {Function} [props.onRetry] - Callback para ação de retry
 * @param {Function} [props.onGoHome] - Callback para ação de ir para home
 * @param {Function} [props.onGoBack] - Callback para ação de voltar
 * @param {string} [props.retryLabel='Tentar novamente'] - Label do botão retry
 * @param {string} [props.goHomeLabel='Início'] - Label do botão goHome
 * @param {string} [props.goBackLabel='Voltar'] - Label do botão goBack
 * @param {React.ReactNode} [props.children] - Conteúdo adicional a ser renderizado
 * @returns {JSX.Element} Componente de erro renderizado
 *
 * @example
 * ```tsx
 * <ErrorState
 *   type="network"
 *   title="Erro de Conexão"
 *   message="Não foi possível conectar ao servidor"
 *   onRetry={ () => retryConnection() }
 *   retryLabel="Tentar novamente"
 * />
 * ```
 */
export const ErrorState: React.FC<BaseErrorProps> = ({ type = "generic",
  title,
  message,
  className = "",
  onRetry,
  onGoHome,
  onGoBack,
  retryLabel = "Tentar novamente",
  goHomeLabel = "Início",
  goBackLabel = "Voltar",
  children,
   }) => {
  const cfg = errorConfig[type];
  const Icon = cfg.icon;
  const finalTitle = title || cfg.defaultTitle;

  return (
        <>
      <div
      className={`w-full border ${cfg.borderColor} ${cfg.bgColor} rounded-lg p-4 ${className}`}
      role="alert"
      aria-live="assertive">
      </div><div className=" ">$2</div><Icon className={`h-5 w-5 ${cfg.color} mt-0.5`} / />
        <div className=" ">$2</div><h3 className="text-sm font-medium text-gray-900">{finalTitle}</h3>
          {message && <p className="mt-1 text-sm text-gray-700">{message}</p>}
          {children}
          {(onRetry || onGoBack || onGoHome) && (
            <div className="{onRetry && (">$2</div>
                <Button
                  size="sm"
                  onClick={ onRetry }
                  icon={ <RefreshCw className="h-4 w-4" />  }>
                  {retryLabel}
                </Button>
              )}
              {onGoBack && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={ onGoBack }
                  icon={ <ArrowLeft className="h-4 w-4" />  }>
                  {goBackLabel}
                </Button>
              )}
              {onGoHome && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={ onGoHome }
                  icon={ <Home className="h-4 w-4" />  }>
                  {goHomeLabel}
                </Button>
              )}
            </div>
          )}
        </div>
    </div>);};

/**
 * Componente de erro de rede
 *
 * @description
 * Componente especializado para exibir erros de conexão/rede.
 *
 * @param {Omit<BaseErrorProps, 'type'>} props - Props do componente (sem type, sempre 'network')
 * @returns {JSX.Element} Componente de erro de rede
 *
 * @example
 * ```tsx
 * <NetworkError
 *   message="Sem conexão com a internet"
 *   onRetry={ () => retry() }
 * />
 * ```
 */
export const NetworkError: React.FC<Omit<BaseErrorProps, "type">> = (props: unknown) => (
  <ErrorState type="network" {...props} / />);

/**
 * Componente de erro de validação
 *
 * @description
 * Componente especializado para exibir erros de validação de dados.
 *
 * @param {Omit<BaseErrorProps, 'type'>} props - Props do componente (sem type, sempre 'validation')
 * @returns {JSX.Element} Componente de erro de validação
 *
 * @example
 * ```tsx
 * <ValidationError
 *   message="Dados inválidos"
 *   onRetry={ () => retry() }
 * />
 * ```
 */
export const ValidationError: React.FC<Omit<BaseErrorProps, "type">> = (
  props,
) => <ErrorState type="validation" { ...props } />;

/**
 * Componente de erro de permissão
 *
 * @description
 * Componente especializado para exibir erros de acesso/permissão negada.
 *
 * @param {Omit<BaseErrorProps, 'type'>} props - Props do componente (sem type, sempre 'permission')
 * @returns {JSX.Element} Componente de erro de permissão
 *
 * @example
 * ```tsx
 * <PermissionError
 *   message="Você não tem permissão para acessar este recurso"
 *   onGoHome={ () => navigate('/') }
 * />
 * ```
 */
export const PermissionError: React.FC<Omit<BaseErrorProps, "type">> = (
  props,
) => <ErrorState type="permission" { ...props } />;

/**
 * Componente de erro de recurso não encontrado
 *
 * @description
 * Componente especializado para exibir erros de recurso não encontrado (404).
 *
 * @param {Omit<BaseErrorProps, 'type'>} props - Props do componente (sem type, sempre 'notFound')
 * @returns {JSX.Element} Componente de erro de não encontrado
 *
 * @example
 * ```tsx
 * <NotFoundError
 *   message="Página não encontrada"
 *   onGoHome={ () => navigate('/') }
 * />
 * ```
 */
export const NotFoundError: React.FC<Omit<BaseErrorProps, "type">> = (
  props,
) => <ErrorState type="notFound" { ...props } />;

/**
 * Componente de erro de servidor
 *
 * @description
 * Componente especializado para exibir erros de servidor (500+).
 *
 * @param {Omit<BaseErrorProps, 'type'>} props - Props do componente (sem type, sempre 'server')
 * @returns {JSX.Element} Componente de erro de servidor
 *
 * @example
 * ```tsx
 * <ServerError
 *   message="Erro interno do servidor"
 *   onRetry={ () => retry() }
 * />
 * ```
 */
export const ServerError: React.FC<Omit<BaseErrorProps, "type">> = (props: unknown) => (
  <ErrorState type="server" {...props} / />);

/**
 * Componente de erro genérico
 *
 * @description
 * Componente especializado para exibir erros genéricos não categorizados.
 *
 * @param {Omit<BaseErrorProps, 'type'>} props - Props do componente (sem type, sempre 'generic')
 * @returns {JSX.Element} Componente de erro genérico
 *
 * @example
 * ```tsx
 * <GenericError
 *   message="Ocorreu um erro inesperado"
 *   onRetry={ () => retry() }
 * />
 * ```
 */
export const GenericError: React.FC<Omit<BaseErrorProps, "type">> = (props: unknown) => (
  <ErrorState type="generic" {...props} / />);

/**
 * Interface de resultado de erro tratado
 *
 * @description
 * Estrutura retornada pelo hook useErrorHandler após processar um erro.
 *
 * @example
 * ```ts
 * const result: HandledErrorResult = {
 *   message: 'Erro de conexão',
 *   type: 'network'
 *};

 * ```
 */
export interface HandledErrorResult {
  message: string;
  type: ErrorType; }

/**
 * Hook para tratamento de erros
 *
 * @description
 * Hook que fornece uma função para tratar erros de forma padronizada,
 * categorizando automaticamente o tipo de erro baseado no status HTTP
 * ou estrutura do erro.
 *
 * @returns {Object} Objeto com função handleError
 * @returns {Function} returns.handleError - Função para tratar erros
 *
 * @example
 * ```tsx
 * const { handleError } = useErrorHandler();

 *
 * try {
 *   await apiCall();

 * } catch (error) {
 *   const result = handleError(error, 'Mensagem customizada');

 * }
 * ```
 */
export const useErrorHandler = () => {
  /**
   * Trata um erro e retorna tipo e mensagem categorizados
   *
   * @description
   * Analisa um erro e determina seu tipo (network, server, validation, etc.)
   * e mensagem apropriada. Suporta erros do Axios, strings e objetos Error.
   *
   * @param {any} error - Erro a ser tratado
   * @param {string} [customMessage] - Mensagem customizada (opcional)
   * @returns {HandledErrorResult} Objeto com tipo e mensagem do erro
   *
   * @example
   * ```tsx
   * const result = handleError(error, 'Falha ao carregar dados');

   * // { type: 'network', message: 'Falha ao carregar dados' }
   * ```
   */
  const handleError = React.useCallback(
    (error: unknown, customMessage?: string): HandledErrorResult => {
      let message = customMessage || "Ocorreu um erro inesperado.";
      let type: ErrorType = "generic";

      // Tratar diferentes formas de erro
      if (typeof error === "string") {
        message = error;
      } else {
        // Verificar se é um objeto com estrutura de erro HTTP ou Error
        const errorObj = error as {
          response?: { status?: number; data?: { message?: string } ;

          status?: number;
          message?: string;};

        const status: number | undefined =
          errorObj.response?.status ?? errorObj.status;
        const dataMessage: string | undefined =
          errorObj.response?.data?.message ?? errorObj.message;

        if (dataMessage) {
          message = dataMessage;
        } else if (error instanceof Error) {
          message = (error as any).message || message;
        }

        if (typeof status === "number") {
          if (status === 0) {
            type = "network";
          } else if (status === 401 || status === 403) {
            type = "permission";
          } else if (status === 404) {
            type = "notFound";
          } else if (status === 422) {
            type = "validation";
          } else if (status >= 500) {
            type = "server";
          } else {
            type = "generic";
          } }

      return { message, type};

    },
    [],);

  return { handleError};
};

export default ErrorState;
