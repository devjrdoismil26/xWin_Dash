/**
 * Componentes de Estados de Loading - UI
 *
 * @description
 * Este módulo fornece componentes React e hooks para exibir diferentes tipos de
 * estados de loading na aplicação. Inclui componentes de spinner, skeleton loaders,
 * e hook para gerenciamento de estados de loading.
 *
 * Funcionalidades principais:
 * - LoadingSpinner com múltiplas variantes (spinner, dots, pulse)
 * - LoadingSkeleton para estruturas de conteúdo
 * - TableLoadingSkeleton para tabelas
 * - CardLoadingSkeleton para grids de cards
 * - Hook useLoadingState para gerenciamento centralizado
 * - Exportação de componentes de SkeletonLoaders
 *
 * @module components/ui/LoadingStates
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { LoadingSpinner, LoadingSkeleton, useLoadingState } from '@/shared/components/ui/LoadingStates';
 *
 * // Spinner simples
 * <LoadingSpinner size="md" variant="spinner" / />
 *
 * // Skeleton loader
 * <LoadingSkeleton lines={5} avatar / />
 *
 * // Hook para gerenciar estados
 * const { isLoading, startLoading, stopLoading } = useLoadingState();

 * ```
 */

import React from "react";
import Button from "./Button";
import { getSizeClasses } from './design-tokens';

/**
 * Variantes de loading disponíveis
 *
 * @description
 * Tipos de loading que podem ser exibidos.
 *
 * @typedef {('spinner' | 'dots' | 'pulse' | 'skeleton')} LoadingVariant
 * @property {'spinner'} spinner - Spinner circular animado
 * @property {'dots'} dots - Pontos animados saltitantes
 * @property {'pulse'} pulse - Círculo com pulso
 * @property {'skeleton'} skeleton - Skeleton loader para estruturas
 */
export type LoadingVariant = "spinner" | "dots" | "pulse" | "skeleton";

/**
 * Props do componente LoadingSpinner
 *
 * @description
 * Propriedades que podem ser passadas para o componente LoadingSpinner.
 *
 * @interface LoadingSpinnerProps
 * @property {string} [className] - Classes CSS adicionais para customização
 * @property {ComponentSize} [size='md'] - Tamanho do spinner (sm, md, lg)
 * @property {string} [text='Carregando conteúdo'] - Texto a ser exibido ao lado do spinner
 * @property {boolean} [showText=true] - Se deve exibir o texto
 * @property {Exclude<LoadingVariant, 'skeleton'>} [variant='spinner'] - Variante do loading
 */
export interface LoadingSpinnerProps {
  className?: string;
  size?: ComponentSize;
  text?: string;
  showText?: boolean;
  variant?: Exclude<LoadingVariant, "skeleton">;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente LoadingSpinner
 *
 * @description
 * Renderiza um spinner de loading com múltiplas variantes (spinner, dots, pulse)
 * e suporte a texto opcional. Componente padrão para indicar carregamento.
 *
 * @component
 * @param {LoadingSpinnerProps} props - Props do componente
 * @returns {JSX.Element} Spinner de loading estilizado
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = "",
  size = "md",
  text = "Carregando conteúdo",
  showText = true,
  variant = "spinner",
   }) => {
  const sizeClasses = getSizeClasses(size, "icon");

  const textSizeClasses = getSizeClasses(size, "text");

  if (variant === "dots") {
    return (
        <>
      <div
        className={`flex items-center justify-center space-x-2 ${className} `}>
      </div><div className=" ">$2</div><div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce">
           
        </div><div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={animationDelay: "0.1s" } />
           
        </div><div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={animationDelay: "0.2s" } >
           
        </div>{showText && text && (
          <span className={`text-gray-600 ${textSizeClasses} `}>{text}</span>
        )}
      </div>);

  }

  if (variant === "pulse") {
    return (
        <>
      <div
        className={`flex items-center justify-center space-x-3 ${className} `}>
      </div><div
          className={`bg-blue-600 rounded-full animate-pulse ${sizeClasses} `}
  >
          {showText && text && (
          <span className={`text-gray-600 ${textSizeClasses} `}>{text}</span>
        )}
      </div>);

  }

  return (
        <>
      <div className={`flex items-center justify-center space-x-3 ${className} `}>
      </div><div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses} `}
  >
          {showText && text && (
        <span className={`text-gray-600 ${textSizeClasses} `}>{text}</span>
      )}
    </div>);};

/**
 * Props do componente LoadingSkeleton
 *
 * @description
 * Propriedades que podem ser passadas para o componente LoadingSkeleton.
 *
 * @interface LoadingSkeletonProps
 * @property {string} [className] - Classes CSS adicionais para customização
 * @property {number} [lines] - Número de linhas skeleton a exibir (padrão: 3)
 * @property {boolean} [avatar] - Se deve exibir um skeleton de avatar (padrão: false)
 */
export interface LoadingSkeletonProps {
  /** Classes CSS adicionais para customização */
className?: string;
  /** Número de linhas skeleton a exibir (padrão: 3) */
lines?: number;
  /** Se deve exibir um skeleton de avatar (padrão: false) */
avatar?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties; }

/**
 * Componente LoadingSkeleton
 *
 * @description
 * Renderiza um skeleton loader com linhas placeholder e opção de avatar.
 * Ideal para mostrar a estrutura de conteúdo enquanto dados estão carregando.
 *
 * @component
 * @param {LoadingSkeletonProps} props - Props do componente
 * @returns {JSX.Element} Skeleton loader estilizado
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = "",
  lines = 3,
  avatar = false,
   }) => {
  return (
        <>
      <div className={`space-y-3 ${className} `}>
      </div>{avatar && (
        <div className=" ">$2</div><div className="rounded-full bg-gray-200 h-10 w-10">
           
        </div><div className=" ">$2</div><div className="h-3 bg-gray-200 rounded w-24" / />
           
        </div></div>
      )}
      {Array.from({ length: lines }).map((_: unknown, index: unknown) => (
        <div key={index} className="h-4 bg-gray-200 rounded w-full">
          ))}
        </div>
    </div>);};

/**
 * Retorno do hook useLoadingState
 *
 * @description
 * Interface que define o retorno do hook useLoadingState, incluindo estados
 * e funções para gerenciar loading, erro e sucesso.
 *
 * @interface UseLoadingState
 * @property {boolean} isLoading - Se está atualmente em estado de loading
 * @property {string | null} error - Mensagem de erro atual ou null
 * @property {string | null} success - Mensagem de sucesso atual ou null
 * @property {() => void} startLoading - Função para iniciar o estado de loading
 * @property {() => void} stopLoading - Função para parar o estado de loading
 * @property {(message: string) => void} setErrorState - Função para definir estado de erro
 * @property {(message: string) => void} setSuccessState - Função para definir estado de sucesso
 * @property {() => void} reset - Função para resetar todos os estados
 */
export interface UseLoadingState {
  /** Se está atualmente em estado de loading */
  isLoading: boolean;
  /** Mensagem de erro atual ou null */
  error: string | null;
  /** Mensagem de sucesso atual ou null */
  success: string | null;
  /** Função para iniciar o estado de loading */
  startLoading??: (e: any) => void;
  /** Função para parar o estado de loading */
  stopLoading??: (e: any) => void;
  /** Função para definir estado de erro */
  setErrorState?: (e: any) => void;
  /** Função para definir estado de sucesso */
  setSuccessState?: (e: any) => void;
  /** Função para resetar todos os estados */
  reset??: (e: any) => void; }

/**
 * Hook useLoadingState - Gerenciamento de Estados de Loading
 *
 * @description
 * Hook personalizado para gerenciar estados de loading, erro e sucesso de
 * forma centralizada. Fornece funções para controlar cada estado e resetar
 * todos os estados de uma vez.
 *
 * @hook
 * @param {boolean} [initialLoading] - Estado inicial de loading (padrão: false)
 * @returns {UseLoadingState} Objeto com estados e funções de controle
 *
 * @example
 * ```tsx
 * const { isLoading, error, startLoading, setErrorState } = useLoadingState();

 *
 * const handleFetch = async () => {
 *   startLoading();

 *   try {
 *     await fetchData();

 *   } catch (err) {
 *     setErrorState('Erro ao carregar dados');

 *   }
 *};

 * ```
 */
export const useLoadingState = (
  initialLoading: boolean = false,
): UseLoadingState => {
  const [isLoading, setIsLoading] = React.useState<boolean>(initialLoading);

  const [error, setError] = React.useState<string | null>(null);

  const [success, setSuccess] = React.useState<string | null>(null);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);

    setError(null);

    setSuccess(null);

  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);

  }, []);

  const setErrorState = React.useCallback((message: string) => {
    setIsLoading(false);

    setError(message);

    setSuccess(null);

  }, []);

  const setSuccessState = React.useCallback((message: string) => {
    setIsLoading(false);

    setError(null);

    setSuccess(message);

  }, []);

  const reset = React.useCallback(() => {
    setIsLoading(false);

    setError(null);

    setSuccess(null);

  }, []);

  return {
    isLoading,
    error,
    success,
    startLoading,
    stopLoading,
    setErrorState,
    setSuccessState,
    reset,};
};

/**
 * Props do componente TableLoadingSkeleton
 *
 * @description
 * Propriedades que podem ser passadas para o componente TableLoadingSkeleton.
 *
 * @interface TableLoadingSkeletonProps
 * @property {number} [rows] - Número de linhas da tabela skeleton (padrão: 5)
 * @property {number} [columns] - Número de colunas da tabela skeleton (padrão: 4)
 * @property {string} [className] - Classes CSS adicionais para customização
 */
export interface TableLoadingSkeletonProps {
  /** Número de linhas da tabela skeleton (padrão: 5) */
rows?: number;
  /** Número de colunas da tabela skeleton (padrão: 4) */
columns?: number;
  /** Classes CSS adicionais para customização */
className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties; }

/**
 * Componente TableLoadingSkeleton
 *
 * @description
 * Renderiza um skeleton loader em formato de tabela com número configurável
 * de linhas e colunas. Ideal para mostrar a estrutura de uma tabela enquanto
 * dados estão carregando.
 *
 * @component
 * @param {TableLoadingSkeletonProps} props - Props do componente
 * @returns {JSX.Element} Skeleton loader de tabela estilizado
 */
export const TableLoadingSkeleton: React.FC<TableLoadingSkeletonProps> = ({ rows = 5,
  columns = 4,
  className = "",
   }) => {
  return (
        <>
      <div className={`space-y-3 ${className} `}>
      </div><div
        className="grid gap-4"
        style={gridTemplateColumns: `repeat(${columns} , minmax(0, 1fr))` } >
           
        </div>{Array.from({ length: columns }).map((_: unknown, index: unknown) => (
          <div key={`thead-${index}`} className="h-5 bg-gray-200 rounded">
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_: unknown, rowIndex: unknown) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4"
          style={gridTemplateColumns: `repeat(${columns} , minmax(0, 1fr))` } >
           
        </div>{Array.from({ length: columns }).map((_: unknown, colIndex: unknown) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4 bg-gray-200 rounded"
            />
          ))}
        </div>
    </div>
  ))}
    </div>);};

/**
 * Props do componente CardLoadingSkeleton
 *
 * @description
 * Propriedades que podem ser passadas para o componente CardLoadingSkeleton.
 *
 * @interface CardLoadingSkeletonProps
 * @property {number} [count] - Número de cards skeleton a exibir (padrão: 3)
 * @property {string} [className] - Classes CSS adicionais para customização
 */
export interface CardLoadingSkeletonProps {
  /** Número de cards skeleton a exibir (padrão: 3) */
count?: number;
  /** Classes CSS adicionais para customização */
className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties; }

/**
 * Componente CardLoadingSkeleton
 *
 * @description
 * Renderiza um grid de cards skeleton com número configurável de cards.
 * Ideal para mostrar a estrutura de um grid de cards enquanto dados estão
 * carregando.
 *
 * @component
 * @param {CardLoadingSkeletonProps} props - Props do componente
 * @returns {JSX.Element} Grid de cards skeleton estilizado
 */
export const CardLoadingSkeleton: React.FC<CardLoadingSkeletonProps> = ({ count = 3,
  className = "",
   }) => {
  return (
        <>
      <div
      className={`grid gap-4 ${className} `}
      style={gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" } >
      </div>{Array.from({ length: count }).map((_: unknown, index: unknown) => (
        <div
          key={`card-${index}`}
          className="border border-gray-200 rounded-lg p-4 space-y-3">
           
        </div><div className="h-32 bg-gray-200 rounded">
           
        </div><div className="h-4 bg-gray-200 rounded w-2/3">
           
        </div><div className="h-4 bg-gray-200 rounded w-1/2">
           
        </div><div className=" ">$2</div><Button variant="secondary" disabled />
              <span className="opacity-60">Aguarde</span></Button></div>
      ))}
    </div>);};

// Export all skeleton components from SkeletonLoaders
export { DashboardSkeleton, TableSkeleton, ChatSkeleton, FormSkeleton, CardGridSkeleton, ProfileSkeleton, CalendarSkeleton,  } from "./SkeletonLoaders";

export default LoadingSpinner;
