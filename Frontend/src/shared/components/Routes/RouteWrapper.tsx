/**
 * Componente RouteWrapper - Wrapper de Rotas com Prote??o e Error Boundary
 *
 * @description
 * Componente wrapper que envolve rotas com funcionalidades de prote??o de
 * autentica??o, error boundary e lazy loading. Combina m?ltiplas camadas de
 * prote??o em um ?nico componente para facilitar o uso.
 *
 * Funcionalidades principais:
 * - Prote??o de rotas com autentica??o opcional
 * - Verifica??o de permiss?es espec?ficas
 * - Error boundary para capturar erros
 * - Lazy loading com Suspense e fallback
 * - Loading states customiz?veis
 *
 * @module components/Routes/RouteWrapper
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import RouteWrapper from '@/shared/components/Routes/RouteWrapper';
 *
 * // Rota p?blica com error boundary
 * <RouteWrapper />
 *   <PublicPage / />
 * </RouteWrapper>
 *
 * // Rota protegida com autentica??o
 * <RouteWrapper requiresAuth />
 *   <Dashboard / />
 * </RouteWrapper>
 *
 * // Rota protegida com permiss?es
 * <RouteWrapper requiresAuth requiredPermissions={ ['admin'] } />
 *   <AdminPanel / />
 * </RouteWrapper>
 * ```
 */

import React, { Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import ErrorBoundary from "@/shared/components/ErrorBoundary/ErrorBoundary";
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';

/**
 * Props do componente RouteWrapper
 *
 * @description
 * Propriedades que podem ser passadas para o componente RouteWrapper.
 *
 * @interface RouteWrapperProps
 * @property {React.ReactNode} children - Componentes filhos a serem envolvidos
 * @property {boolean} [requiresAuth=false] - Se a rota requer autentica??o (opcional, padr?o: false)
 * @property {string[]} [requiredPermissions=[]] - Lista de permiss?es necess?rias (opcional, padr?o: [])
 * @property {React.ReactNode} [fallback] - Componente exibido durante loading (opcional, padr?o: LoadingSpinner)
 *
 * @example
 * ```tsx
 * const props: RouteWrapperProps = {
 *   children: <MyComponent />,
 *   requiresAuth: true,
 *   requiredPermissions: ['admin', 'editor'],
 *   fallback: <CustomLoader / />
 *};

 * ```
 */
interface RouteWrapperProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiredPermissions?: string[];
  fallback?: React.ReactNode; }

/**
 * Componente RouteWrapper
 *
 * @description
 * Wrapper que combina ErrorBoundary, Suspense (lazy loading) e ProtectedRoute
 * em um ?nico componente. Aplica as prote??es em cascata baseado nas props.
 *
 * @param {RouteWrapperProps} props - Props do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 * @param {boolean} [props.requiresAuth=false] - Se requer autentica??o
 * @param {string[]} [props.requiredPermissions=[]] - Permiss?es necess?rias
 * @param {React.ReactNode} [props.fallback] - Fallback do Suspense
 * @returns {JSX.Element} Componentes filhos envolvidos com prote??es
 *
 * @example
 * ```tsx
 * <RouteWrapper requiresAuth requiredPermissions={ ['admin'] } />
 *   <AdminDashboard / />
 * </RouteWrapper>
 * ```
 */
const RouteWrapper: React.FC<RouteWrapperProps> = ({ children,
  requiresAuth = false,
  requiredPermissions = [] as unknown[],
  fallback = <LoadingSpinner />,
   }) => {
  const wrappedChildren = (
    <ErrorBoundary />
      <Suspense fallback={ fallback }>{children}</Suspense>
    </ErrorBoundary>);

  if (requiresAuth) { return (
              <ProtectedRoute requiredPermissions={requiredPermissions } />
        {wrappedChildren}
      </ProtectedRoute>);

  }

  return wrappedChildren;};

export default RouteWrapper;
