/**
 * FE-023: Componente para Esconder Ações Não Autorizadas
 * @module components/guards/PermissionGate
 * @description
 * Componente que renderiza children apenas se o usuário tiver as permissões necessárias.
 * Útil para esconder botões, ações e seções baseado em permissões.
 */
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string | string[];
  role?: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode; }

/**
 * FE-023: Componente PermissionGate
 * 
 * Renderiza children apenas se o usuário tiver as permissões/roles necessárias.
 * 
 * @param {PermissionGateProps} props
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado se autorizado
 * @param {string|string[]} [props.permission] - Permissão(ões) requerida(s)
 * @param {string|string[]} [props.role] - Role(s) requerida(s)
 * @param {boolean} [props.requireAll=false] - Se requer todas as permissões (padrão: false, qualquer uma)
 * @param {React.ReactNode} [props.fallback] - Conteúdo a renderizar se não autorizado (opcional)
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({ children,
  permission,
  role,
  requireAll = false,
  fallback = null,
   }) => {
  const {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasUserRole,
    hasAnyUserRole,
  } = usePermissions();

  let isAuthorized = true;

  // Verificar permissões
  if (permission) {
    const permissions = Array.isArray(permission) ? permission : [permission];
    isAuthorized = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

  }

  // Verificar roles (se ainda autorizado)
  if (isAuthorized && role) {
    const roles = Array.isArray(role) ? role : [role];
    isAuthorized = roles.length === 1
      ? hasUserRole(roles[0])
      : hasAnyUserRole(roles);

  }

  if (!isAuthorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;};

export default PermissionGate;
