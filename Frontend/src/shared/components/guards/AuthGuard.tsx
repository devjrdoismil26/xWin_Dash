/**
 * FE-021: Guard de Autenticação para Rotas
 * @module components/guards/AuthGuard
 * @description
 * Componente guard que protege rotas baseado em autenticação e permissões.
 * Redireciona usuários não autenticados ou sem permissões adequadas.
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: string | string[];
  requirePermission?: string | string[];
  redirectTo?: string; }

/**
 * FE-021: Guard de Autenticação
 * 
 * @param {AuthGuardProps} props
 * @param {React.ReactNode} props.children - Componentes filhos a serem protegidos
 * @param {boolean} [props.requireAuth=true] - Se requer autenticação (padrão: true)
 * @param {string|string[]} [props.requireRole] - Role(s) requerida(s) (opcional)
 * @param {string|string[]} [props.requirePermission] - Permissão(ões) requerida(s) (opcional)
 * @param {string} [props.redirectTo='/login'] - Rota de redirecionamento (padrão: '/login')
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children,
  requireAuth = true,
  requireRole,
  requirePermission,
  redirectTo = '/login',
   }) => {
  const { user, isAuthenticated, hasRole, hasAnyRole, can } = useAuth();

  const location = useLocation();

  // Verificar autenticação
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={ from: location } replace />;
  }

  // Verificar role
  if (requireRole) {
    const roles = Array.isArray(requireRole) ? requireRole : [requireRole];
    const hasRequiredRole = roles.length === 1 
      ? hasRole(roles[0])
      : hasAnyRole(roles);

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    } // Verificar permissão
  if (requirePermission) {
    const permissions = Array.isArray(requirePermission) 
      ? requirePermission 
      : [requirePermission];
    
    const hasRequiredPermission = permissions.every(perm => can(perm));

    if (!hasRequiredPermission) {
      return <Navigate to="/unauthorized" replace />;
    } return <>{children}</>;};

export default AuthGuard;
