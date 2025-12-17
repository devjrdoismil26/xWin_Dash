/**
 * Service para integração com API de usuários
 * Conecta o frontend com o backend Laravel
 */

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { User, UserFilters, UserBulkUpdate, UserBulkDelete, UserImport } from '../types/user.types';

// =========================================
// INTERFACES
// =========================================

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  validation_errors?: Record<string, string[]>;
}

interface UserListResponse extends ApiResponse<{
  users: User[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from?: number;
    to?: number;};

}> {}

interface UserResponse extends ApiResponse<User> {}

interface UserStatsResponse extends ApiResponse<{
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  pending_users: number;
  new_users_today: number;
  users_growth_rate: number;
  average_session_duration: number;
  users_by_role: Record<string, number>;
  users_by_status: Record<string, number>;
}> {}

interface UserSearchResponse extends ApiResponse<{
  results: User[];
  total: number;
  query: string;
  filters: Record<string, any>;
}> {}

interface UserBulkResponse extends ApiResponse<{
  processed: number;
  successful: number;
  failed: number;
  errors: string[];
}> {}

interface UserExportResponse extends ApiResponse<{
  file_url: string;
  file_name: string;
  file_size: number;
  export_date: string;
  total_records: number;
}> {}

interface UserImportResponse extends ApiResponse<{
  total_records: number;
  imported: number;
  skipped: number;
  errors: string[];
  import_id: string;
}> {}

// =========================================
// SERVICE CLASS
// =========================================

class UsersApiService {
  private baseUrl = '/api/v1/users';

  /**
   * Listar usuários com filtros e paginação
   */
  async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);

    if (filters.status) params.append('status', filters.status);

    if (filters.role) params.append('role', filters.role);

    if (filters.date_from) params.append('date_from', filters.date_from);

    if (filters.date_to) params.append('date_to', filters.date_to);

    if (filters.page) params.append('page', filters.page.toString());

    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    if (filters.sort_by) params.append('sort_by', filters.sort_by);

    if (filters.sort_order) params.append('sort_order', filters.sort_order);

    try {
      const data = await apiClient.get<UserListResponse>(`${this.baseUrl}/users`, { params: Object.fromEntries(params) });

      return data;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Criar novo usuário
   */
  async createUser(userData: Partial<User>): Promise<UserResponse> {
    try {
      const result = await apiClient.post<UserResponse>(`${this.baseUrl}/users`, userData);

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Obter usuário por ID
   */
  async getUserById(id: string): Promise<UserResponse> {
    try {
      const data = await apiClient.get<UserResponse>(`${this.baseUrl}/users/${id}`);

      return data;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualizar usuário
   */
  async updateUser(id: string, userData: Partial<User>): Promise<UserResponse> {
    try {
      const result = await apiClient.put<UserResponse>(`${this.baseUrl}/users/${id}`, userData);

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Excluir usuário
   */
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    try {
      const result = await apiClient.delete<ApiResponse<null>>(`${this.baseUrl}/users/${id}`);

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Buscar usuários
   */
  async searchUsers(query: string, filters: UserFilters = {}): Promise<UserSearchResponse> {
    const params = new URLSearchParams();

    params.append('query', query);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());

    });

    try {
      const data = await apiClient.get<UserSearchResponse>(`${this.baseUrl}/search`, { params: Object.fromEntries(params) });

      return data;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Obter usuários por role
   */
  async getUsersByRole(role: string, filters: UserFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());

    });

    try {
      const data = await apiClient.get<UserListResponse>(`${this.baseUrl}/by-role/${role}`, { params: Object.fromEntries(params) });

      return data;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Obter usuários por status
   */
  async getUsersByStatus(status: string, filters: UserFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());

    });

    try {
      const data = await apiClient.get<UserListResponse>(`${this.baseUrl}/by-status/${status}`, { params: Object.fromEntries(params) });

      return data;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualizar status do usuário
   */
  async updateUserStatus(id: string, status: string): Promise<UserResponse> {
    try {
      const result = await apiClient.patch<UserResponse>(`${this.baseUrl}/users/${id}/status`, { status });

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualizar role do usuário
   */
  async updateUserRole(id: string, role: string): Promise<UserResponse> {
    try {
      const result = await apiClient.patch<UserResponse>(`${this.baseUrl}/users/${id}/role`, { role });

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Resetar senha do usuário
   */
  async resetUserPassword(id: string, password: string, password_confirmation: string): Promise<ApiResponse<null>> {
    try {
      const result = await apiClient.post<ApiResponse<null>>(`${this.baseUrl}/users/${id}/reset-password`, { 
        password, 
        password_confirmation 
      });

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Enviar email de verificação
   */
  async sendVerificationEmail(id: string): Promise<ApiResponse<null>> {
    try {
      const result = await apiClient.post<ApiResponse<null>>(`${this.baseUrl}/users/${id}/send-verification`);

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Obter estatísticas de usuários
   */
  async getUserStats(): Promise<UserStatsResponse> {
    try {
      const data = await apiClient.get<UserStatsResponse>(`${this.baseUrl}/statistics`);

      return data;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Operações em lote - atualizar múltiplos usuários
   */
  async bulkUpdateUsers(bulkData: UserBulkUpdate): Promise<UserBulkResponse> {
    try {
      const result = await apiClient.post<UserBulkResponse>(`${this.baseUrl}/bulk-update`, bulkData);

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Operações em lote - excluir múltiplos usuários
   */
  async bulkDeleteUsers(bulkData: UserBulkDelete): Promise<UserBulkResponse> {
    try {
      const result = await apiClient.post<UserBulkResponse>(`${this.baseUrl}/bulk-delete`, bulkData);

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Exportar usuários
   */
  async exportUsers(filters: UserFilters = {}): Promise<UserExportResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());

    });

    try {
      await apiClient.download(`${this.baseUrl}/export?${params}`, 'users-export.xlsx');

      return {
        success: true,
        data: {
          file_url: '',
          file_name: 'users-export.xlsx',
          file_size: 0,
          export_date: new Date().toISOString(),
          total_records: 0
        } ;

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Importar usuários
   */
  async importUsers(importData: UserImport): Promise<UserImportResponse> {
    const formData = new FormData();

    formData.append('file', importData.file);

    formData.append('mapping', JSON.stringify(importData.mapping));

    formData.append('options', JSON.stringify(importData.options));

    try {
      const data = await apiClient.upload<UserImportResponse>(`${this.baseUrl}/import`, formData);

      return data;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Obter atividades do usuário
   */
  async getUserActivity(userId: string, filters: Record<string, any> = {}): Promise<ApiResponse<Record<string, any>>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());

    });

    try {
      const data = await apiClient.get<ApiResponse<Record<string, any>>>(`${this.baseUrl}/users/${userId}/activity`, { params: Object.fromEntries(params) });

      return data;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Obter estatísticas de atividade do usuário
   */
  async getUserActivityStats(userId: string, filters: Record<string, any> = {}): Promise<ApiResponse<Record<string, any>>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());

    });

    try {
      const data = await apiClient.get<ApiResponse<Record<string, any>>>(`${this.baseUrl}/users/${userId}/activity/stats`, { params: Object.fromEntries(params) });

      return data;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Exportar atividades do usuário
   */
  async exportUserActivity(userId: string, filters: Record<string, any> = {}): Promise<ApiResponse<Record<string, any>>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());

    });

    try {
      await apiClient.download(`${this.baseUrl}/users/${userId}/activity/export?${params}`, `user-${userId}-activity-export.xlsx`);

      return {
        success: true,
        data: null};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Obter notificações do usuário
   */
  async getNotifications(filters: Record<string, any> = {}): Promise<ApiResponse<Record<string, any>>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());

    });

    return this.makeRequest(`${this.baseUrl}/notifications?${params}`);

  }

  /**
   * Marcar notificação como lida
   */
  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<null>> {
    try {
      const result = await apiClient.patch<ApiResponse<null>>(`${this.baseUrl}/notifications/${notificationId}/mark-as-read`);

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Marcar todas as notificações como lidas
   */
  async markAllNotificationsAsRead(): Promise<ApiResponse<null>> {
    try {
      const result = await apiClient.post<ApiResponse<null>>(`${this.baseUrl}/notifications/mark-all-as-read`);

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Excluir notificação
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<null>> {
    try {
      const result = await apiClient.delete<ApiResponse<null>>(`${this.baseUrl}/notifications/${notificationId}`);

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Obter contagem de notificações não lidas
   */
  async getUnreadNotificationsCount(): Promise<ApiResponse<{ count: number }>> {
    try {
      const data = await apiClient.get<ApiResponse<{ count: number }>>(`${this.baseUrl}/notifications/unread`);

      return data;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Obter preferências do usuário
   */
  async getUserPreferences(userId: string): Promise<ApiResponse<Record<string, any>>> {
    try {
      const data = await apiClient.get<ApiResponse<Record<string, any>>>(`${this.baseUrl}/users/${userId}/preferences`);

      return data;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualizar preferências do usuário
   */
  async updateUserPreferences(userId: string, preferences: Record<string, any>): Promise<ApiResponse<Record<string, any>>> {
    try {
      const result = await apiClient.put<ApiResponse<Record<string, any>>>(`${this.baseUrl}/users/${userId}/preferences`, preferences);

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } }

// =========================================
// EXPORTS
// =========================================

export const usersApiService = new UsersApiService();

export default usersApiService;