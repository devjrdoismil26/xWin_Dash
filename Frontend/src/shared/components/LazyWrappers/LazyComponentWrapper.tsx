/**
 * Componente LazyComponentWrapper
 *
 * @description
 * Wrapper para carregar componentes de forma lazy usando React.lazy.
 * Permite code splitting e melhor performance ao carregar componentes
 * apenas quando necessário.
 *
 * @module components/LazyWrappers/LazyComponentWrapper
 * @since 1.0.0
 */

import React, {
  Suspense,
  lazy,
  useMemo,
  ComponentType,
  ReactNode,
} from "react";
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';

/**
 * Props do componente LazyComponentWrapper
 *
 * @interface LazyComponentWrapperProps
 * @property {() => Promise<{ default: ComponentType }>} loader - Função de import dinâmica
 * @property {ReactNode} [fallback] - Componente exibido durante carregamento (opcional)
 * @property {Record<string, any>} [props] - Props adicionais passadas ao componente lazy
 */
interface LazyComponentWrapperProps {
  loader: () => Promise<{ default: ComponentType<Record<string, any>>
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }>;
  fallback?: ReactNode;
  [key: string]: unknown;
}

/**
 * Componente LazyComponentWrapper
 *
 * @description
 * Wrapper que carrega componentes de forma lazy usando React.lazy.
 * Permite code splitting, melhorando a performance inicial da aplicação.
 * Exibe um fallback durante o carregamento do componente.
 *
 * @param {LazyComponentWrapperProps} props - Props do componente
 * @param {() => Promise<{ default: ComponentType }>} props.loader - Função de import dinâmica
 * @param {ReactNode} [props.fallback] - Componente exibido durante carregamento
 * @param {Record<string, any>} [props.rest] - Props adicionais para o componente lazy
 * @returns {JSX.Element} Componente lazy envolvido em Suspense
 *
 * @example
 * ```tsx
 * // Uso básico
 * <LazyComponentWrapper loader={ () => import('../pages/Dashboard') } />
 *
 * // Com fallback customizado
 * <LazyComponentWrapper
 *   loader={ () => import('../pages/Dashboard') }
 *   fallback={ <CustomLoader /> }
 * />
 *
 * // Com props
 * <LazyComponentWrapper
 *   loader={ () => import('../shared/components/UserCard') }
 *   userId="123"
 *   name="João"
 * />
 * ```
 */
const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = ({ loader,
  fallback = <LoadingSpinner />,
  ...props
   }) => { /**
   * Componente lazy memoizado
   *
   * @description
   * Memoiza o componente lazy para evitar recriações desnecessárias.
   * O loader é usado como dependência para garantir que mudanças
   * no loader resultem em um novo componente lazy.
   */
  const LazyComponent = useMemo(() => lazy(loader), [loader]);

  return (
        <>
      <Suspense fallback={fallback } />
      <LazyComponent {...props} / />
    </Suspense>);};

export default LazyComponentWrapper;
