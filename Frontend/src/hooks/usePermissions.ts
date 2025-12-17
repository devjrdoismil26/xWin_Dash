/**
 * FE-022: Hook para Verificação de Permissões
 * @module hooks/usePermissions
 * @description
 * Hook que fornece utilitários para verificar permissões e roles do usuário.
 * Facilita a verificação de permissões em componentes.
 */
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

/**
 * FE-022: Hook para verificação de permissões
 * 
 * @returns {Object} Objeto com funções de verificação de permissões
 */
export const usePermissions = () => {
  const { user, hasRole, hasAnyRole, can, isAuthenticated } = useAuth();

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated || !user) return false;
    return can(permission);};

  /**
   * Verifica se o usuário tem todas as permissões especificadas
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return permissions.every(perm => can(perm));};

  /**
   * Verifica se o usuário tem pelo menos uma das permissões especificadas
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return permissions.some(perm => can(perm));};

  /**
   * Verifica se o usuário tem uma role específica
   */
  const hasUserRole = (role: string): boolean => {
    if (!isAuthenticated || !user) return false;
    return hasRole(role);};

  /**
   * Verifica se o usuário tem pelo menos uma das roles especificadas
   */
  const hasAnyUserRole = (roles: string[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return hasAnyRole(roles);};

  /**
   * Verifica se o usuário é admin
   */
  const isAdmin = useMemo(() => {
    return hasUserRole('admin') || hasUserRole('super_admin');

  }, [user]);

  /**
   * Verifica se o usuário pode editar
   */
  const canEdit = (resource: string): boolean => {
    return hasPermission(`${resource}.edit`) || 
           hasPermission(`${resource}.update`) ||
           isAdmin;};

  /**
   * Verifica se o usuário pode deletar
   */
  const canDelete = (resource: string): boolean => {
    return hasPermission(`${resource}.delete`) || 
           hasPermission(`${resource}.destroy`) ||
           isAdmin;};

  /**
   * Verifica se o usuário pode criar
   */
  const canCreate = (resource: string): boolean => {
    return hasPermission(`${resource}.create`) || 
           hasPermission(`${resource}.store`) ||
           isAdmin;};

  /**
   * Verifica se o usuário pode visualizar
   */
  const canView = (resource: string): boolean => {
    return hasPermission(`${resource}.view`) || 
           hasPermission(`${resource}.show`) ||
           hasPermission(`${resource}.index`) ||
           isAdmin;};

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasUserRole,
    hasAnyUserRole,
    isAdmin,
    canEdit,
    canDelete,
    canCreate,
    canView,
    isAuthenticated,
    user,};
};

export default usePermissions;
