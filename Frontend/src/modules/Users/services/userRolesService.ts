import { apiClient } from '@/services';
import { User, UserRole, UserPermission } from '../types/user.types';

// Cache para roles e permissões
const rolesCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 15 * 60 * 1000; // 15 minutos (roles mudam raramente)

// Interface para role
export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  permissions: string[];
  is_system_role: boolean;
  created_at: string;
  updated_at: string; }

// Interface para permissão
export interface Permission {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  category: string;
  created_at: string;
  updated_at: string; }

// Interface para atribuição de role
export interface RoleAssignment {
  user_id: string;
  role_id: string;
  assigned_by: string;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean; }

// Interface para criação de role
export interface CreateRoleData {
  name: string;
  display_name: string;
  description?: string;
  permissions: string[];
  [key: string]: unknown; }

// Interface para atualização de role
export interface UpdateRoleData {
  display_name?: string;
  description?: string;
  permissions?: string[];
  [key: string]: unknown; }

// Interface para estatísticas de roles
export interface RoleStats {
  total_roles: number;
  system_roles: number;
  custom_roles: number;
  users_by_role: Record<string, number>;
  permissions_by_role: Record<string, number>;
  most_used_roles: Array<{
    role: Role;
  user_count: number; }>;
  least_used_roles: Array<{
    role: Role;
    user_count: number;
  }>;
}

// Interface para validação de role
export interface RoleValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[]; }

// Interface para verificação de permissão
export interface PermissionCheck {
  has_permission: boolean;
  granted_by: string[];
  denied_by: string[];
  reason?: string; }

/**
 * Service para gerenciamento de roles e permissões
 * Responsável por roles, permissões, atribuições e verificações
 */
class UserRolesService {
  private baseUrl = '/api/users/roles';

  /**
   * Obtém todas as roles
   */
  async getRoles(): Promise<Role[]> {
    try {
      const cacheKey = 'all_roles';
      const cached = rolesCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl);

      // Cache do resultado
      rolesCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar roles');

    } /**
   * Obtém uma role específica por ID
   */
  async getRoleById(id: string): Promise<Role> {
    try {
      const cacheKey = `role_${id}`;
      const cached = rolesCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);

      // Cache do resultado
      rolesCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar role');

    } /**
   * Cria uma nova role
   */
  async createRole(data: CreateRoleData): Promise<Role> {
    try {
      // Validação básica
      this.validateRoleData(data);

      const response = await apiClient.post(this.baseUrl, data);

      // Limpar cache relacionado
      this.clearRolesCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao criar role');

    } /**
   * Atualiza uma role existente
   */
  async updateRole(id: string, data: UpdateRoleData): Promise<Role> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);

      // Limpar cache relacionado
      this.clearRolesCache();

      rolesCache.delete(`role_${id}`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao atualizar role');

    } /**
   * Remove uma role
   */
  async deleteRole(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);

      // Limpar cache relacionado
      this.clearRolesCache();

      rolesCache.delete(`role_${id}`);

    } catch (error) {
      throw new Error('Falha ao remover role');

    } /**
   * Obtém todas as permissões
   */
  async getPermissions(): Promise<Permission[]> {
    try {
      const cacheKey = 'all_permissions';
      const cached = rolesCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/permissions`);

      // Cache do resultado
      rolesCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar permissões');

    } /**
   * Obtém permissões por categoria
   */
  async getPermissionsByCategory(): Promise<Record<string, Permission[]>> {
    try {
      const cacheKey = 'permissions_by_category';
      const cached = rolesCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const permissions = await this.getPermissions();

      const grouped = permissions.reduce((acc: unknown, permission: unknown) => {
        if (!acc[permission.category]) {
          acc[permission.category] = [];
        }
        acc[permission.category].push(permission);

        return acc;
      }, {} as Record<string, Permission[]>);

      // Cache do resultado
      rolesCache.set(cacheKey, { data: grouped, timestamp: Date.now() });

      return grouped;
    } catch (error) {
      throw new Error('Falha ao carregar permissões por categoria');

    } /**
   * Atribui uma role a um usuário
   */
  async assignRole(userId: string, roleId: string, expiresAt?: string): Promise<RoleAssignment> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/assign`, {
        user_id: userId,
        role_id: roleId,
        expires_at: expiresAt
      });

      // Limpar cache relacionado
      this.clearUserRolesCache(userId);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao atribuir role');

    } /**
   * Remove uma role de um usuário
   */
  async removeRole(userId: string, roleId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/assign`, {
        data: {
          user_id: userId,
          role_id: roleId
        } );

      // Limpar cache relacionado
      this.clearUserRolesCache(userId);

    } catch (error) {
      throw new Error('Falha ao remover role');

    } /**
   * Obtém roles de um usuário
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    try {
      const cacheKey = `user_roles_${userId}`;
      const cached = rolesCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/user/${userId}`);

      // Cache do resultado
      rolesCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar roles do usuário');

    } /**
   * Obtém permissões de um usuário
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      const cacheKey = `user_permissions_${userId}`;
      const cached = rolesCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/user/${userId}/permissions`);

      // Cache do resultado
      rolesCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar permissões do usuário');

    } /**
   * Verifica se um usuário tem uma permissão específica
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/${userId}/permission/${permission}`);

      return (response as any).data.has_permission;
    } catch (error) {
      return false;
    } /**
   * Verifica se um usuário tem uma role específica
   */
  async hasRole(userId: string, role: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/${userId}/role/${role}`);

      return (response as any).data.has_role;
    } catch (error) {
      return false;
    } /**
   * Verifica múltiplas permissões de um usuário
   */
  async checkPermissions(userId: string, permissions: string[]): Promise<Record<string, boolean>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/user/${userId}/permissions/check`, {
        permissions
      });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao verificar permissões');

    } /**
   * Verifica múltiplas roles de um usuário
   */
  async checkRoles(userId: string, roles: string[]): Promise<Record<string, boolean>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/user/${userId}/roles/check`, {
        roles
      });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao verificar roles');

    } /**
   * Obtém detalhes de verificação de permissão
   */
  async getPermissionCheck(userId: string, permission: string): Promise<PermissionCheck> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/user/${userId}/permission/${permission}/details`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter detalhes da permissão');

    } /**
   * Obtém usuários com uma role específica
   */
  async getUsersByRole(roleId: string): Promise<User[]> {
    try {
      const cacheKey = `users_by_role_${roleId}`;
      const cached = rolesCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${roleId}/users`);

      // Cache do resultado
      rolesCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter usuários da role');

    } /**
   * Obtém usuários com uma permissão específica
   */
  async getUsersByPermission(permission: string): Promise<User[]> {
    try {
      const cacheKey = `users_by_permission_${permission}`;
      const cached = rolesCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/permission/${permission}/users`);

      // Cache do resultado
      rolesCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter usuários da permissão');

    } /**
   * Obtém estatísticas de roles
   */
  async getRoleStats(): Promise<RoleStats> {
    try {
      const cacheKey = 'role_stats';
      const cached = rolesCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/stats`);

      // Cache do resultado
      rolesCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter estatísticas de roles');

    } /**
   * Valida dados de role
   */
  async validateRole(data: CreateRoleData | UpdateRoleData): Promise<RoleValidation> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/validate`, data);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao validar role');

    } /**
   * Duplica uma role
   */
  async duplicateRole(roleId: string, overrides?: Partial<CreateRoleData>): Promise<Role> {
    try {
      const role = await this.getRoleById(roleId);

      const duplicateData: CreateRoleData = {
        name: `${role.name}_copy`,
        display_name: `${role.display_name} (Copy)`,
        description: role.description,
        permissions: role.permissions,
        ...overrides};

      return await this.createRole(duplicateData);

    } catch (error) {
      throw new Error('Falha ao duplicar role');

    } /**
   * Atribui múltiplas roles a um usuário
   */
  async assignMultipleRoles(userId: string, roleIds: string[]): Promise<RoleAssignment[]> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/assign-multiple`, {
        user_id: userId,
        role_ids: roleIds
      });

      // Limpar cache relacionado
      this.clearUserRolesCache(userId);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao atribuir múltiplas roles');

    } /**
   * Remove múltiplas roles de um usuário
   */
  async removeMultipleRoles(userId: string, roleIds: string[]): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/assign-multiple`, {
        data: {
          user_id: userId,
          role_ids: roleIds
        } );

      // Limpar cache relacionado
      this.clearUserRolesCache(userId);

    } catch (error) {
      throw new Error('Falha ao remover múltiplas roles');

    } /**
   * Valida dados básicos da role
   */
  private validateRoleData(data: CreateRoleData): void {
    if (!data.name || (data as any).name.trim().length < 2) {
      throw new Error('Nome da role deve ter pelo menos 2 caracteres');

    }

    if (!data.display_name || (data as any).display_name.trim().length < 2) {
      throw new Error('Nome de exibição da role deve ter pelo menos 2 caracteres');

    }

    if (!data.permissions || !Array.isArray(data.permissions)) {
      throw new Error('Permissões devem ser um array');

    }

    if (data.description && (data as any).description.length > 500) {
      throw new Error('Descrição deve ter no máximo 500 caracteres');

    } /**
   * Limpa cache de roles
   */
  private clearRolesCache(): void {
    rolesCache.clear();

  }

  /**
   * Limpa cache de roles de usuário específico
   */
  private clearUserRolesCache(userId: string): void {
    for (const key of rolesCache.keys()) {
      if (key.includes(`user_${userId}`)) {
        rolesCache.delete(key);

      } }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of rolesCache.keys()) {
        if (key.includes(pattern)) {
          rolesCache.delete(key);

        } } else {
      rolesCache.clear();

    } /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: rolesCache.size,
      keys: Array.from(rolesCache.keys())};

  } // Instância singleton
export const userRolesService = new UserRolesService();

export default userRolesService;
