import { apiClient } from '@/services';
import { User, UserBulkUpdate, UserBulkDelete, UserBulkResponse } from '../types/user.types';

// Cache para operações em lote
const bulkCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

// Interface para resultado de operação em lote
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
  total_time: number;
  average_time_per_item: number;
}

// Interface para operação de criação em lote
export interface BulkCreateData {
  users: Array<{
    name: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  website?: string;
  location?: string;
  [key: string]: unknown; }>;
  options?: {
    skip_duplicates?: boolean;
    validate_emails?: boolean;
    send_welcome_email?: boolean;
    assign_default_role?: string;};

}

// Interface para operação de atualização em lote
export interface BulkUpdateData {
  updates: Array<{
    user_id: string;
  data: {
      name?: string;
  email?: string;
  role?: string;
  status?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  website?: string;
  location?: string;
  [key: string]: unknown; };

  }>;
  options?: {
    validate_data?: boolean;
    skip_invalid?: boolean;
    update_timestamps?: boolean;};

}

// Interface para operação de remoção em lote
export interface BulkDeleteData {
  user_ids: string[];
  options?: {
    soft_delete?: boolean;
  backup_data?: boolean;
  notify_users?: boolean;
  reason?: string;
  [key: string]: unknown; };

}

// Interface para operação de atribuição de roles em lote
export interface BulkRoleAssignmentData {
  user_ids: string[];
  role_id: string;
  options?: {
    remove_existing_roles?: boolean;
  expires_at?: string;
  notify_users?: boolean;
  [key: string]: unknown; };

}

// Interface para operação de remoção de roles em lote
export interface BulkRoleRemovalData {
  user_ids: string[];
  role_id: string;
  options?: {
    notify_users?: boolean;
  [key: string]: unknown; };

}

// Interface para operação de ativação em lote
export interface BulkActivationData {
  user_ids: string[];
  options?: {
    notify_users?: boolean;
  send_activation_email?: boolean;
  [key: string]: unknown; };

}

// Interface para operação de desativação em lote
export interface BulkDeactivationData {
  user_ids: string[];
  options?: {
    notify_users?: boolean;
  reason?: string;
  [key: string]: unknown; };

}

// Interface para operação de suspensão em lote
export interface BulkSuspensionData {
  user_ids: string[];
  reason?: string;
  options?: {
    notify_users?: boolean;
  duration?: number;
  // em dias
  [key: string]: unknown; };

}

// Interface para operação de importação em lote
export interface BulkImportData {
  file: File;
  options?: {
    format: 'csv' | 'excel' | 'json';
  mapping: Record<string, string>;
  skip_duplicates?: boolean;
  validate_data?: boolean;
  create_profiles?: boolean;
  assign_default_role?: string;
  [key: string]: unknown; };

}

// Interface para operação de exportação em lote
export interface BulkExportData {
  user_ids?: string[];
  filters?: {
    role?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  [key: string]: unknown; };

  format: 'csv' | 'excel' | 'pdf' | 'json';
  fields?: string[];
}

// Interface para progresso de operação em lote
export interface BulkOperationProgress {
  operation_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  // 0-100
  processed: number;
  total: number;
  errors: number;
  start_time: string;
  estimated_completion?: string;
  current_item?: string; }

/**
 * Service para operações em lote de usuários
 * Responsável por operações massivas, importação, exportação e processamento assíncrono
 */
class UserBulkService {
  private baseUrl = '/api/users/bulk';

  /**
   * Cria múltiplos usuários
   */
  async bulkCreateUsers(data: BulkCreateData): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/create`, data);

      // Limpar cache relacionado
      this.clearBulkCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao criar usuários em lote');

    } /**
   * Atualiza múltiplos usuários
   */
  async bulkUpdateUsers(data: BulkUpdateData): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/update`, data);

      // Limpar cache relacionado
      this.clearBulkCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao atualizar usuários em lote');

    } /**
   * Remove múltiplos usuários
   */
  async bulkDeleteUsers(data: BulkDeleteData): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/delete`, {
        data
      });

      // Limpar cache relacionado
      this.clearBulkCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao remover usuários em lote');

    } /**
   * Atribui role a múltiplos usuários
   */
  async bulkAssignRole(data: BulkRoleAssignmentData): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/assign-role`, data);

      // Limpar cache relacionado
      this.clearBulkCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao atribuir role em lote');

    } /**
   * Remove role de múltiplos usuários
   */
  async bulkRemoveRole(data: BulkRoleRemovalData): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/remove-role`, {
        data
      });

      // Limpar cache relacionado
      this.clearBulkCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao remover role em lote');

    } /**
   * Ativa múltiplos usuários
   */
  async bulkActivateUsers(data: BulkActivationData): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/activate`, data);

      // Limpar cache relacionado
      this.clearBulkCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao ativar usuários em lote');

    } /**
   * Desativa múltiplos usuários
   */
  async bulkDeactivateUsers(data: BulkDeactivationData): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/deactivate`, data);

      // Limpar cache relacionado
      this.clearBulkCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao desativar usuários em lote');

    } /**
   * Suspende múltiplos usuários
   */
  async bulkSuspendUsers(data: BulkSuspensionData): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/suspend`, data);

      // Limpar cache relacionado
      this.clearBulkCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao suspender usuários em lote');

    } /**
   * Remove suspensão de múltiplos usuários
   */
  async bulkUnsuspendUsers(userIds: string[]): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/unsuspend`, {
        user_ids: userIds
      });

      // Limpar cache relacionado
      this.clearBulkCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao remover suspensão de usuários em lote');

    } /**
   * Importa usuários de arquivo
   */
  async bulkImportUsers(data: BulkImportData): Promise<BulkOperationResult> {
    try {
      const formData = new FormData();

      formData.append('file', (data as any).file);

      formData.append('options', JSON.stringify(data.options || {}));

      const response = await apiClient.post(`${this.baseUrl}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        } );

      // Limpar cache relacionado
      this.clearBulkCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao importar usuários');

    } /**
   * Exporta usuários
   */
  async bulkExportUsers(data: BulkExportData): Promise<Blob> {
    try {
      const response = await apiClient.post(
        `${this.baseUrl}/export`,
        data,
        { responseType: 'blob' });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao exportar usuários');

    } /**
   * Inicia operação assíncrona em lote
   */
  async startBulkOperation(operation: string, data: Record<string, any>): Promise<{ operation_id: string }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/start`, {
        operation,
        data
      });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao iniciar operação em lote');

    } /**
   * Obtém progresso de operação em lote
   */
  async getBulkOperationProgress(operationId: string): Promise<BulkOperationProgress> {
    try {
      const cacheKey = `bulk_progress_${operationId}`;
      const cached = bulkCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/progress/${operationId}`);

      // Cache do resultado
      bulkCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter progresso da operação');

    } /**
   * Cancela operação em lote
   */
  async cancelBulkOperation(operationId: string): Promise<void> {
    try {
      await apiClient.patch(`${this.baseUrl}/cancel/${operationId}`);

      // Limpar cache relacionado
      bulkCache.delete(`bulk_progress_${operationId}`);

    } catch (error) {
      throw new Error('Falha ao cancelar operação');

    } /**
   * Obtém resultado de operação em lote
   */
  async getBulkOperationResult(operationId: string): Promise<BulkOperationResult> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/result/${operationId}`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter resultado da operação');

    } /**
   * Obtém histórico de operações em lote
   */
  async getBulkOperationHistory(params: {
    page?: number;
    limit?: number;
    status?: string;
    operation?: string;
    date_from?: string;
    date_to?: string;
  } = {}): Promise<{
    data: Array<{
      operation_id: string;
      operation: string;
      status: string;
      processed: number;
      total: number;
      errors: number;
      start_time: string;
      end_time?: string;
      duration?: number;
    }>;
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    try {
      const cacheKey = `bulk_history_${JSON.stringify(params)}`;
      const cached = bulkCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/history`, { params });

      const result = {
        data: (response as any).data.data || (response as any).data,
        total: (response as any).data.total || (response as any).data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || (response as any).data.length) / (params.limit || 10))};

      // Cache do resultado
      bulkCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      throw new Error('Falha ao obter histórico de operações em lote');

    } /**
   * Valida dados para operação em lote
   */
  async validateBulkData(operation: string, data: Record<string, any>): Promise<{
    is_valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
    valid_count: number;
    invalid_count: number;
  }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/validate`, {
        operation,
        data
      });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao validar dados para operação em lote');

    } /**
   * Obtém template para importação
   */
  async getImportTemplate(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/import-template`, {
        params: { format },
        responseType: 'blob'
      });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter template de importação');

    } /**
   * Obtém estatísticas de operações em lote
   */
  async getBulkOperationStats(): Promise<{
    total_operations: number;
    successful_operations: number;
    failed_operations: number;
    operations_by_type: Record<string, number>;
    average_processing_time: number;
    total_processed_items: number;
    total_failed_items: number;
    success_rate: number;
  }> {
    try {
      const cacheKey = 'bulk_operation_stats';
      const cached = bulkCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/stats`);

      // Cache do resultado
      bulkCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter estatísticas de operações em lote');

    } /**
   * Limpa dados de operações antigas
   */
  async cleanupOldOperations(daysToKeep: number = 30): Promise<{ deleted_count: number }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/cleanup`, {
        data: { days_to_keep: daysToKeep } );

      // Limpar cache relacionado
      this.clearBulkCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao limpar operações antigas');

    } /**
   * Obtém configurações de operações em lote
   */
  async getBulkOperationSettings(): Promise<{
    max_batch_size: number;
    max_concurrent_operations: number;
    timeout_seconds: number;
    retry_attempts: number;
    retry_delay_seconds: number;
    auto_cleanup_days: number;
    notification_enabled: boolean;
  }> {
    try {
      const cacheKey = 'bulk_operation_settings';
      const cached = bulkCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/settings`);

      // Cache do resultado
      bulkCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter configurações de operações em lote');

    } /**
   * Atualiza configurações de operações em lote
   */
  async updateBulkOperationSettings(settings: Partial<{
    max_batch_size: number;
    max_concurrent_operations: number;
    timeout_seconds: number;
    retry_attempts: number;
    retry_delay_seconds: number;
    auto_cleanup_days: number;
    notification_enabled: boolean;
  }>): Promise<void> {
    try {
      await apiClient.put(`${this.baseUrl}/settings`, settings);

      // Limpar cache relacionado
      bulkCache.delete('bulk_operation_settings');

    } catch (error) {
      throw new Error('Falha ao atualizar configurações de operações em lote');

    } /**
   * Limpa cache de operações em lote
   */
  private clearBulkCache(): void {
    bulkCache.clear();

  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of bulkCache.keys()) {
        if (key.includes(pattern)) {
          bulkCache.delete(key);

        } } else {
      bulkCache.clear();

    } /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: bulkCache.size,
      keys: Array.from(bulkCache.keys())};

  } // Instância singleton
export const userBulkService = new UserBulkService();

export default userBulkService;
