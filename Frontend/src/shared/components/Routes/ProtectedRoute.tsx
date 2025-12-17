/**
 * Componente ProtectedRoute
 *
 * @description
 * Componente de rota protegida que verifica autenticação e permissões
 * antes de renderizar os filhos. Redireciona para login ou unauthorized
 * se as condições não forem atendidas.
 *
 * @module components/Routes/ProtectedRoute
 * @since 1.0.0
 */

import React, { useEffect } from "react";
import { router } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';

/**
 * Props do componente ProtectedRoute
 *
 * @interface ProtectedRouteProps
 * @property {React.ReactNode} children - Componentes filhos a serem protegidos
 * @property {string[]} [requiredPermissions=[]] - Lista de permissões necessárias (opcional)
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[]; }

/**
 * Componente ProtectedRoute
 *
 * @description
 * Componente que protege rotas verificando:
 * - Autenticação do usuário
 * - Permissões específicas (se fornecidas)
 * - Redireciona automaticamente se não autenticado ou sem permissões
 *
 * @param {ProtectedRouteProps} props - Props do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 * @param {string[]} [props.requiredPermissions=[]] - Permissões necessárias
 * @returns {JSX.Element | null} Componentes filhos ou null se redirecionado
 *
 * @example
 * ```tsx
 * // Rota protegida apenas por autenticação
 * <ProtectedRoute />
 *   <Dashboard / />
 * </ProtectedRoute>
 *
 * // Rota protegida com permissões específicas
 * <ProtectedRoute requiredPermissions={ ['users.create', 'users.edit'] } />
 *   <UserManagement / />
 * </ProtectedRoute>
 * ```
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children,
  requiredPermissions = [] as unknown[],
   }) => {
  const { isAuthenticated, user, loading } = useAuth();

  /**
   * Verifica permissões do usuário
   *
   * @description
   * Verifica se o usuário possui todas as permissões necessárias.
   *
   * @param {string[]} permissions - Lista de permissões necessárias
   * @returns {boolean} Se o usuário possui todas as permissões
   */
  const hasRequiredPermissions = (permissions: string[]): boolean => {
    if (permissions.length === 0) return true;
    if (!user?.permissions || user.permissions.length === 0) return false;
    return permissions.every((permission: unknown) =>
      user.permissions.includes(permission),);};

  /**
   * Efeito para redirecionar se não autenticado
   *
   * @description
   * Redireciona para login se o usuário não estiver autenticado
   * e não estiver em estado de carregamento.
   */
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.visit("/login");

    } , [loading, isAuthenticated]);

  /**
   * Efeito para redirecionar se não tiver permissões
   *
   * @description
   * Redireciona para página de não autorizado se o usuário
   * não tiver as permissões necessárias.
   */
  useEffect(() => {
    if (!loading && isAuthenticated && requiredPermissions.length > 0) {
      if (!hasRequiredPermissions(requiredPermissions)) {
        router.visit("/unauthorized");

      } }, [loading, isAuthenticated, requiredPermissions, user?.permissions]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <LoadingSpinner text="Verificando autenticação..." />;
  }

  // Não renderizar se não autenticado (será redirecionado)
  if (!isAuthenticated) {
    return null;
  }

  // Não renderizar se não tiver permissões (será redirecionado)
  if (
    requiredPermissions.length > 0 &&
    !hasRequiredPermissions(requiredPermissions)
  ) {
    return null;
  }

  // Renderizar filhos se todas as condições forem atendidas
  return <>{children}</>;};

export default ProtectedRoute;
