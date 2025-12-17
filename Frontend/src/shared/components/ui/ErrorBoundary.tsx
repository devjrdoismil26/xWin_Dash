/**
 * Componente ErrorBoundary - Boundary de Erro React
 *
 * @description
 * Componente ErrorBoundary que captura erros JavaScript em qualquer lugar
 * da árvore de componentes filho, registra esses erros e exibe uma UI de
 * fallback em vez de deixar a árvore de componentes quebrar completamente.
 *
 * Funcionalidades principais:
 * - Captura de erros JavaScript na árvore de componentes
 * - Registro de erros no console
 * - UI de fallback customizável
 * - Prevenção de crash completo da aplicação
 * - Integração com React Error Boundary API
 *
 * @module components/ui/ErrorBoundary
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary';
 *
 * <ErrorBoundary fallback={ <CustomErrorFallback />  }>
 *   <App / />
 * </ErrorBoundary>
 * ```
 */

import React, { Component, ErrorInfo, ReactNode } from "react";

/**
 * Props do componente ErrorBoundary
 *
 * @description
 * Propriedades que podem ser passadas para o componente ErrorBoundary.
 *
 * @interface Props
 * @property {ReactNode} children - Componentes filhos a serem protegidos
 * @property {ReactNode} [fallback] - Componente de fallback customizado (opcional)
 */
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Estado do componente ErrorBoundary
 *
 * @description
 * Estado interno do ErrorBoundary para rastrear erros capturados.
 *
 * @interface State
 * @property {boolean} hasError - Se um erro foi capturado
 * @property {Error} [error] - Objeto de erro capturado (opcional)
 */
interface State {
  hasError: boolean;
  error?: Error; }

/**
 * Componente ErrorBoundary
 *
 * @description
 * Classe de componente que implementa React Error Boundary para capturar
 * erros em componentes filhos e exibir uma UI de fallback.
 *
 * @class ErrorBoundary
 * @extends Component<Props, State />
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,};

  /**
   * Método estático que atualiza o estado baseado em um erro capturado
   *
   * @description
   * Chamado durante a fase de renderização quando um erro é lançado em um
   * componente filho. Atualiza o estado para mostrar a UI de fallback.
   *
   * @static
   * @param {Error} error - Erro capturado
   * @returns {State} Novo estado com hasError=true e o erro
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error};

  }

  /**
   * Método que registra informações sobre o erro
   *
   * @description
   * Chamado após um erro ser capturado. Usado para logar informações
   * sobre o erro (ex: para serviços de monitoramento de erros).
   *
   * @param {Error} error - Erro capturado
   * @param {ErrorInfo} errorInfo - Informações adicionais sobre o erro
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  }

  public render() {
    if (this.state.hasError) {
      return (
                this.props.fallback || (
          <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-lg font-semibold text-red-600 mb-2" />
                Algo deu errado
              </h2>
              <p className="text-gray-600" />
                Ocorreu um erro inesperado. Tente recarregar a página.
              </p>
      </div>
    </>
  ));

    }

    return this.props.children;
  } export default ErrorBoundary;
export { ErrorBoundary };
