/**
 * Service para integração com API de usuários
 * Conecta o frontend com o backend Laravel
 */

import { User, UserFilters, UserBulkUpdate, UserBulkDelete, UserImport } from '../types/userTypes';

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
    to?: number;
  };
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
  filters: any;
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
   * Fazer requisição HTTP com tratamento de erros
   */
  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
          validation_errors: data.validation_errors
        };
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro de conexão'
      };
    }
  }

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

    return this.makeRequest(`${this.baseUrl}/users?${params}`);
  }

  /**
   * Criar novo usuário
   */
  async createUser(userData: Partial<User>): Promise<UserResponse> {
    return this.makeRequest(`${this.baseUrl}/users`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  /**
   * Obter usuário por ID
   */
  async getUserById(id: string): Promise<UserResponse> {
    return this.makeRequest(`${this.baseUrl}/users/${id}`);
  }

  /**
   * Atualizar usuário
   */
  async updateUser(id: string, userData: Partial<User>): Promise<UserResponse> {
    return this.makeRequest(`${this.baseUrl}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  /**
   * Excluir usuário
   */
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    return this.makeRequest(`${this.baseUrl}/users/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Buscar usuários
   */
  async searchUsers(query: string, filters: UserFilters = {}): Promise<UserSearchResponse> {
    const params = new URLSearchParams();
    params.append('query', query);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.makeRequest(`${this.baseUrl}/search?${params}`);
  }

  /**
   * Obter usuários por role
   */
  async getUsersByRole(role: string, filters: UserFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.makeRequest(`${this.baseUrl}/by-role/${role}?${params}`);
  }

  /**
   * Obter usuários por status
   */
  async getUsersByStatus(status: string, filters: UserFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.makeRequest(`${this.baseUrl}/by-status/${status}?${params}`);
  }

  /**
   * Atualizar status do usuário
   */
  async updateUserStatus(id: string, status: string): Promise<UserResponse> {
    return this.makeRequest(`${this.baseUrl}/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  /**
   * Atualizar role do usuário
   */
  async updateUserRole(id: string, role: string): Promise<UserResponse> {
    return this.makeRequest(`${this.baseUrl}/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
  }

  /**
   * Resetar senha do usuário
   */
  async resetUserPassword(id: string, password: string, password_confirmation: string): Promise<ApiResponse<null>> {
    return this.makeRequest(`${this.baseUrl}/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ 
        password, 
        password_confirmation 
      })
    });
  }

  /**
   * Enviar email de verificação
   */
  async sendVerificationEmail(id: string): Promise<ApiResponse<null>> {
    return this.makeRequest(`${this.baseUrl}/users/${id}/send-verification`, {
      method: 'POST'
    });
  }

  /**
   * Obter estatísticas de usuários
   */
  async getUserStats(): Promise<UserStatsResponse> {
    return this.makeRequest(`${this.baseUrl}/statistics`);
  }

  /**
   * Operações em lote - atualizar múltiplos usuários
   */
  async bulkUpdateUsers(bulkData: UserBulkUpdate): Promise<UserBulkResponse> {
    return this.makeRequest(`${this.baseUrl}/bulk-update`, {
      method: 'POST',
      body: JSON.stringify(bulkData)
    });
  }

  /**
   * Operações em lote - excluir múltiplos usuários
   */
  async bulkDeleteUsers(bulkData: UserBulkDelete): Promise<UserBulkResponse> {
    return this.makeRequest(`${this.baseUrl}/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify(bulkData)
    });
  }

  /**
   * Exportar usuários
   */
  async exportUsers(filters: UserFilters = {}): Promise<UserExportResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.makeRequest(`${this.baseUrl}/export?${params}`);
  }

  /**
   * Importar usuários
   */
  async importUsers(importData: UserImport): Promise<UserImportResponse> {
    const formData = new FormData();
    formData.append('file', importData.file);
    formData.append('mapping', JSON.stringify(importData.mapping));
    formData.append('options', JSON.stringify(importData.options));

    try {
      const response = await fetch(`${this.baseUrl}/import`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
          validation_errors: data.validation_errors
        };
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro de conexão'
      };
    }
  }

  /**
   * Obter atividades do usuário
   */
  async getUserActivity(userId: string, filters: any = {}): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.makeRequest(`${this.baseUrl}/users/${userId}/activity?${params}`);
  }

  /**
   * Obter estatísticas de atividade do usuário
   */
  async getUserActivityStats(userId: string, filters: any = {}): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.makeRequest(`${this.baseUrl}/users/${userId}/activity/stats?${params}`);
  }

  /**
   * Exportar atividades do usuário
   */
  async exportUserActivity(userId: string, filters: any = {}): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.makeRequest(`${this.baseUrl}/users/${userId}/activity/export?${params}`);
  }

  /**
   * Obter notificações do usuário
   */
  async getNotifications(filters: any = {}): Promise<ApiResponse<any>> {
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
    return this.makeRequest(`${this.baseUrl}/notifications/${notificationId}/mark-as-read`, {
      method: 'PATCH'
    });
  }

  /**
   * Marcar todas as notificações como lidas
   */
  async markAllNotificationsAsRead(): Promise<ApiResponse<null>> {
    return this.makeRequest(`${this.baseUrl}/notifications/mark-all-as-read`, {
      method: 'POST'
    });
  }

  /**
   * Excluir notificação
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<null>> {
    return this.makeRequest(`${this.baseUrl}/notifications/${notificationId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Obter contagem de notificações não lidas
   */
  async getUnreadNotificationsCount(): Promise<ApiResponse<{ count: number }>> {
    return this.makeRequest(`${this.baseUrl}/notifications/unread`);
  }

  /**
   * Obter preferências do usuário
   */
  async getUserPreferences(userId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`${this.baseUrl}/users/${userId}/preferences`);
  }

  /**
   * Atualizar preferências do usuário
   */
  async updateUserPreferences(userId: string, preferences: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`${this.baseUrl}/users/${userId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }
}

// =========================================
// EXPORTS
// =========================================

export const usersApiService = new UsersApiService();
export default usersApiService;