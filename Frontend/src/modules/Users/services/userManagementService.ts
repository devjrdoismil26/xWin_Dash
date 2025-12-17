import { apiClient } from '@/services';
import { User, UserProfile, UserRole, UserResponse, UserListResponse, UserFilters, UserBulkUpdate, UserBulkDelete, UserBulkResponse } from '../types/user.types';

// Cache para usuários
const usersCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Interface para parâmetros de busca
export interface UserSearchParams {
  search?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// Interface para resposta paginada
export interface UserPaginatedResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  total_pages: number; }

// Interface para criação de usuário
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
  phone?: string;
  timezone?: string;
  language?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  [key: string]: unknown; }

// Interface para atualização de usuário
export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  phone?: string;
  timezone?: string;
  language?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  [key: string]: unknown; }

// Interface para estatísticas de usuários
export interface UserManagementStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  pending_users: number;
  users_by_role: Record<string, number>;
  users_by_status: Record<string, number>;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
  users_growth_rate: number;
  average_session_duration: number;
  most_active_users: User[]; }

// Interface para validação de usuário
export interface UserValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[]; }

// Interface para operações em lote
export interface BulkOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: Array<{
    user_id: string;
  error: string; }>;
  results: Array<{
    user_id: string;
    success: boolean;
    data?: Record<string, any>;
  }>;
}

/**
 * Service para gerenciamento de usuários
 * Responsável por CRUD, validação e operações em lote
 */
class UserManagementService {
  private baseUrl = '/api/users';

  /**
   * Busca usuários com filtros
   */
  async getUsers(params: UserSearchParams = {}): Promise<UserPaginatedResponse> {
    try {
      const cacheKey = `users_${JSON.stringify(params)}`;
      const cached = usersCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl, { params });

      const result = {
        data: (response as any).data.data || (response as any).data,
        total: (response as any).data.total || (response as any).data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || (response as any).data.length) / (params.limit || 10))};

      // Cache do resultado
      usersCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      throw new Error('Falha ao carregar usuários');

    } /**
   * Busca um usuário específico por ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const cacheKey = `user_${id}`;
      const cached = usersCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);

      // Cache do resultado
      usersCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar usuário');

    } /**
   * Cria um novo usuário
   */
  async createUser(data: CreateUserData): Promise<User> {
    try {
      // Validação básica
      this.validateUserData(data);

      const response = await apiClient.post(this.baseUrl, data);

      // Limpar cache relacionado
      this.clearUsersCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao criar usuário');

    } /**
   * Atualiza um usuário existente
   */
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);

      // Limpar cache relacionado
      this.clearUsersCache();

      usersCache.delete(`user_${id}`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao atualizar usuário');

    } /**
   * Remove um usuário
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);

      // Limpar cache relacionado
      this.clearUsersCache();

      usersCache.delete(`user_${id}`);

    } catch (error) {
      throw new Error('Falha ao remover usuário');

    } /**
   * Ativa um usuário
   */
  async activateUser(id: string): Promise<User> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/activate`);

      // Limpar cache relacionado
      this.clearUsersCache();

      usersCache.delete(`user_${id}`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao ativar usuário');

    } /**
   * Desativa um usuário
   */
  async deactivateUser(id: string): Promise<User> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/deactivate`);

      // Limpar cache relacionado
      this.clearUsersCache();

      usersCache.delete(`user_${id}`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao desativar usuário');

    } /**
   * Suspende um usuário
   */
  async suspendUser(id: string, reason?: string): Promise<User> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/suspend`, {
        reason
      });

      // Limpar cache relacionado
      this.clearUsersCache();

      usersCache.delete(`user_${id}`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao suspender usuário');

    } /**
   * Remove suspensão de um usuário
   */
  async unsuspendUser(id: string): Promise<User> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/unsuspend`);

      // Limpar cache relacionado
      this.clearUsersCache();

      usersCache.delete(`user_${id}`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao remover suspensão do usuário');

    } /**
   * Obtém estatísticas de gerenciamento de usuários
   */
  async getUserManagementStats(): Promise<UserManagementStats> {
    try {
      const cacheKey = 'user_management_stats';
      const cached = usersCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/stats`);

      // Cache do resultado
      usersCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter estatísticas de usuários');

    } /**
   * Valida dados de usuário
   */
  async validateUser(data: CreateUserData | UpdateUserData): Promise<UserValidation> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/validate`, data);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao validar usuário');

    } /**
   * Busca usuários por email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/by-email`, {
        params: { email } );

      return (response as any).data as any;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error('Falha ao buscar usuário por email');

    } /**
   * Busca usuários por role
   */
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const result = await this.getUsers({ role, limit: 1000 });

      return result.data;
    } catch (error) {
      throw new Error('Falha ao buscar usuários por role');

    } /**
   * Busca usuários por status
   */
  async getUsersByStatus(status: string): Promise<User[]> {
    try {
      const result = await this.getUsers({ status: status as 'active' | 'inactive' | 'suspended' | 'pending', limit: 1000 });

      return result.data;
    } catch (error) {
      throw new Error('Falha ao buscar usuários por status');

    } /**
   * Operações em lote - Criar usuários
   */
  async bulkCreateUsers(users: CreateUserData[]): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/bulk/create`, {
        users
      });

      // Limpar cache relacionado
      this.clearUsersCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao criar usuários em lote');

    } /**
   * Operações em lote - Atualizar usuários
   */
  async bulkUpdateUsers(updates: Array<{ id: string; data: UpdateUserData }>): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/bulk/update`, {
        updates
      });

      // Limpar cache relacionado
      this.clearUsersCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao atualizar usuários em lote');

    } /**
   * Operações em lote - Remover usuários
   */
  async bulkDeleteUsers(userIds: string[]): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/bulk/delete`, {
        data: { user_ids: userIds } );

      // Limpar cache relacionado
      this.clearUsersCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao remover usuários em lote');

    } /**
   * Operações em lote - Ativar usuários
   */
  async bulkActivateUsers(userIds: string[]): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/bulk/activate`, {
        user_ids: userIds
      });

      // Limpar cache relacionado
      this.clearUsersCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao ativar usuários em lote');

    } /**
   * Operações em lote - Desativar usuários
   */
  async bulkDeactivateUsers(userIds: string[]): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/bulk/deactivate`, {
        user_ids: userIds
      });

      // Limpar cache relacionado
      this.clearUsersCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao desativar usuários em lote');

    } /**
   * Operações em lote - Suspender usuários
   */
  async bulkSuspendUsers(userIds: string[], reason?: string): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/bulk/suspend`, {
        user_ids: userIds,
        reason
      });

      // Limpar cache relacionado
      this.clearUsersCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao suspender usuários em lote');

    } /**
   * Duplica um usuário
   */
  async duplicateUser(id: string, overrides?: Partial<CreateUserData>): Promise<User> {
    try {
      const user = await this.getUserById(id);

      const duplicateData: CreateUserData = {
        name: `${user.name} (Copy)`,
        email: `copy_${user.email}`,
        password: 'TempPassword123!',
        role: user.role,
        status: 'inactive',
        ...overrides};

      return await this.createUser(duplicateData);

    } catch (error) {
      throw new Error('Falha ao duplicar usuário');

    } /**
   * Exporta usuários
   */
  async exportUsers(params: UserSearchParams = {}, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.post(
        `${this.baseUrl}/export`,
        { ...params, format },
        { responseType: 'blob' });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao exportar usuários');

    } /**
   * Importa usuários
   */
  async importUsers(file: File): Promise<BulkOperationResult> {
    try {
      const formData = new FormData();

      formData.append('file', file);

      const response = await apiClient.post(`${this.baseUrl}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        } );

      // Limpar cache relacionado
      this.clearUsersCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao importar usuários');

    } /**
   * Valida dados básicos do usuário
   */
  private validateUserData(data: CreateUserData): void {
    if (!data.name || (data as any).name.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');

    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Email inválido');

    }

    if (!data.password || (data as any).password.length < 8) {
      throw new Error('Senha deve ter pelo menos 8 caracteres');

    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      throw new Error('Telefone inválido');

    } /**
   * Valida formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);

  }

  /**
   * Valida formato de telefone
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));

  }

  /**
   * Limpa cache de usuários
   */
  private clearUsersCache(): void {
    usersCache.clear();

  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of usersCache.keys()) {
        if (key.includes(pattern)) {
          usersCache.delete(key);

        } } else {
      usersCache.clear();

    } /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: usersCache.size,
      keys: Array.from(usersCache.keys())};

  } // Instância singleton
export const userManagementService = new UserManagementService();

export default userManagementService;
