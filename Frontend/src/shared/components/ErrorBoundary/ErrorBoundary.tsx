/**
 * Componente ErrorBoundary
 *
 * @description
 * Boundary de erro React que captura erros de renderização em componentes filhos
 * e exibe uma tela de erro amigável ao usuário, permitindo recuperação.
 *
 * @module components/ErrorBoundary/ErrorBoundary
 * @since 1.0.0
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { toast } from 'sonner';

/**
 * Props do ErrorBoundary
 *
 * @interface ErrorBoundaryProps
 * @property {ReactNode} children - Componentes filhos a serem envolvidos pelo boundary
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Estado do ErrorBoundary
 *
 * @interface ErrorBoundaryState
 * @property {boolean} hasError - Se ocorreu um erro
 * @property {Error | null} [error] - Erro capturado (opcional)
 * @property {ErrorInfo | null} [errorInfo] - Informações do erro (opcional)
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: ErrorInfo | null; }

/**
 * Componente ErrorBoundary
 *
 * @description
 * Class Component que implementa Error Boundary do React para capturar
 * erros de renderização, lifecycle methods e construtores de componentes filhos.
 * Exibe uma UI amigável de erro e permite recuperação através de reset.
 *
 * @class ErrorBoundary
 * @extends {Component<ErrorBoundaryProps, ErrorBoundaryState>}
 *
 * @example
 * ```tsx
 * <ErrorBoundary />
 *   <App / />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Construtor do ErrorBoundary
   *
   * @param {ErrorBoundaryProps} props - Props do componente
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,};

  }

  /**
   * Método estático para atualizar estado quando erro é capturado
   *
   * @description
   * Atualiza o estado para indicar que um erro ocorreu.
   * Este método é chamado durante a fase de renderização.
   *
   * @static
   * @param {Error} error - Erro capturado
   * @returns {ErrorBoundaryState} Novo estado com hasError=true
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,};

  }

  /**
   * Método chamado após um erro ser capturado
   *
   * @description
   * Registra o erro e informações adicionais para debugging.
   * Pode ser usado para enviar erros a serviços de monitoramento.
   *
   * @param {Error} error - Erro capturado
   * @param {ErrorInfo} errorInfo - Informações adicionais do erro
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Salvar erro e informações no estado
    this.setState({
      error,
      errorInfo,
    });

    // Log detalhado para debugging
    console.error('ErrorBoundary caught an error:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      stack: (error as any).stack,
    });

    // Notificar usuário
    toast.error("Ocorreu um erro inesperado. A equipe foi notificada.", {
      description: "Tente atualizar a página ou voltar.",
      duration: 5000,
    });

    // Enviar erro para serviço de monitoramento (Sentry, LogRocket, etc.)
    if (typeof window !== 'undefined') {
      // Integração com Sentry
      if ((window as Record<string, any>).Sentry) {
        const Sentry = (window as Record<string, any>).Sentry as {
          captureException?: (e: any) => void;};

        Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
          },
        });

      }
      
      // Integração com LogRocket (se disponível)
      if ((window as Record<string, any>).LogRocket) {
        const LogRocket = (window as Record<string, any>).LogRocket as {
          captureException?: (e: any) => void;};

        LogRocket.captureException(error);

      } }

  /**
   * Handler para resetar o error boundary
   *
   * @description
   * Reseta o estado do error boundary, permitindo tentar renderizar novamente.
   */
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });};

  /**
   * Handler para recarregar a página
   *
   * @description
   * Recarrega completamente a página para garantir um estado limpo.
   */
  private handleReload = (): void => {
    window.location.reload();};

  /**
   * Handler para voltar na história do navegador
   *
   * @description
   * Retorna para a página anterior no histórico do navegador.
   */
  private handleGoBack = (): void => {
    window.history.back();};

  /**
   * Renderiza o componente
   *
   * @description
   * Se houver erro, renderiza UI de erro. Caso contrário, renderiza children.
   *
   * @returns {ReactNode} UI de erro ou children
   */
  render(): ReactNode {
    if (this.state.hasError) {
      return (
                <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={ 2 }
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                / /></svg></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2" />
              Algo deu errado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6" />
              Ocorreu um erro inesperado. Por favor, tente uma das opções
              abaixo.
            </p>
            <div className=" ">$2</div><button
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                onClick={ this.handleReload }
                aria-label="Recarregar página" />
                Atualizar
              </button>
              <button
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                onClick={ this.handleGoBack }
                aria-label="Voltar para página anterior" />
                Voltar
              </button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700" />
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" />
                  Detalhes do erro (modo desenvolvimento)
                </summary>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-48 whitespace-pre-wrap break-words" />
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
      </details>
    </>
  )}
          </div>);

    }

    return this.props.children;
  } export { ErrorBoundary };

export default ErrorBoundary;
