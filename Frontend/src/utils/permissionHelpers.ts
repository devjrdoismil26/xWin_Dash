/**
 * FE-027: Utilitários de Permissão
 * @module utils/permissionHelpers
 * @description
 * Funções utilitárias para trabalhar com permissões e roles.
 */
import { User } from '@/contexts/AuthContext';

/**
 * Verifica se o usuário tem uma permissão específica
 */
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);};

/**
 * Verifica se o usuário tem todas as permissões especificadas
 */
export const hasAllPermissions = (user: User | null, permissions: string[]): boolean => {
  if (!user || !user.permissions || permissions.length === 0) return false;
  return permissions.every(perm => user.permissions.includes(perm));};

/**
 * Verifica se o usuário tem pelo menos uma das permissões especificadas
 */
export const hasAnyPermission = (user: User | null, permissions: string[]): boolean => {
  if (!user || !user.permissions || permissions.length === 0) return false;
  return permissions.some(perm => user.permissions.includes(perm));};

/**
 * Verifica se o usuário tem uma role específica
 */
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);};

/**
 * Verifica se o usuário tem pelo menos uma das roles especificadas
 */
export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user || !user.roles || roles.length === 0) return false;
  return roles.some(role => user.roles.includes(role));};

/**
 * Verifica se o usuário é admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin') || hasRole(user, 'super_admin');};

/**
 * Gera permissões padrão para um recurso
 */
export const getResourcePermissions = (resource: string) => ({
  view: `${resource}.view`,
  create: `${resource}.create`,
  edit: `${resource}.edit`,
  update: `${resource}.update`,
  delete: `${resource}.delete`,
  destroy: `${resource}.destroy`,
});

/**
 * Verifica se o usuário pode realizar uma ação em um recurso
 */
export const canPerformAction = (
  user: User | null,
  resource: string,
  action: 'view' | 'create' | 'edit' | 'update' | 'delete' | 'destroy'
): boolean => {
  if (isAdmin(user)) return true;
  
  const permissions = getResourcePermissions(resource);

  const permission = permissions[action];
  
  return hasPermission(user, permission);};
