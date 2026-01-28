import { apiClient } from '@/services';
import {
  User,
  UserAuditLog
} from '../types/userTypes';

// Cache para auditoria
const auditCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Interface para log de auditoria
export interface AuditLog {
  id: string;
  user_id: string;
  user: User;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  changes?: Record<string, {
    old: any;
    new: any;
  }>;
  ip_address?: string;
  user_agent?: string;
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Interface para parâmetros de busca de auditoria
export interface AuditSearchParams {
  user_id?: string;
  action?: string;
  resource_type?: string;
  resource_id?: string;
  date_from?: string;
  date_to?: string;
  ip_address?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Interface para resposta paginada de auditoria
export interface AuditPaginatedResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Interface para criação de log de auditoria
export interface CreateAuditLogData {
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

// Interface para estatísticas de auditoria
export interface AuditStats {
  total_logs: number;
  logs_today: number;
  logs_this_week: number;
  logs_this_month: number;
  logs_by_action: Record<string, number>;
  logs_by_resource_type: Record<string, number>;
  logs_by_user: Array<{
    user: User;
    count: number;
  }>;
  most_audited_resources: Array<{
    resource_type: string;
    resource_id: string;
    count: number;
  }>;
  audit_trends: Array<{
    date: string;
    count: number;
  }>;
  top_actions: Array<{
    action: string;
    count: number;
  }>;
}

// Interface para tipos de ação de auditoria
export interface AuditActionType {
  name: string;
  display_name: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  requires_approval: boolean;
  is_system_action: boolean;
}

// Interface para filtros de auditoria
export interface AuditFilters {
  actions?: string[];
  resource_types?: string[];
  users?: string[];
  date_range?: {
    from: string;
    to: string;
  };
  severities?: string[];
  ip_addresses?: string[];
  locations?: string[];
}

// Interface para relatório de auditoria
export interface AuditReport {
  period: {
    from: string;
    to: string;
  };
  total_logs: number;
  unique_users: number;
  logs_by_action: Record<string, number>;
  logs_by_user: Array<{
    user: User;
    count: number;
    last_action: string;
  }>;
  top_actions: Array<{
    action: string;
    count: number;
  }>;
  audit_timeline: Array<{
    date: string;
    count: number;
  }>;
  security_events: Array<{
    type: string;
    count: number;
    severity: string;
  }>;
  generated_at: string;
}

// Interface para configurações de auditoria
export interface AuditSettings {
  enabled: boolean;
  log_levels: string[];
  retention_days: number;
  auto_cleanup: boolean;
  real_time_alerts: boolean;
  alert_thresholds: {
    failed_logins: number;
    privilege_escalation: number;
    data_export: number;
    admin_actions: number;
  };
  excluded_actions: string[];
  excluded_users: string[];
  ip_whitelist: string[];
  notification_recipients: string[];
}

/**
 * Service para sistema de auditoria de usuários
 * Responsável por logging, busca, filtros e relatórios de auditoria
 */
class UserAuditService {
  private baseUrl = '/api/users/audit';

  /**
   * Busca logs de auditoria com filtros
   */
  async getAuditLogs(params: AuditSearchParams = {}): Promise<AuditPaginatedResponse> {
    try {
      const cacheKey = `audit_logs_${JSON.stringify(params)}`;
      const cached = auditCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl, { params });
      
      const result = {
        data: response.data.data || response.data,
        total: response.data.total || response.data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || response.data.length) / (params.limit || 10))
      };

      // Cache do resultado
      auditCache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error);
      throw new Error('Falha ao carregar logs de auditoria');
    }
  }

  /**
   * Busca um log de auditoria específico por ID
   */
  async getAuditLogById(id: string): Promise<AuditLog> {
    try {
      const cacheKey = `audit_log_${id}`;
      const cached = auditCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      
      // Cache do resultado
      auditCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar log de auditoria ${id}:`, error);
      throw new Error('Falha ao carregar log de auditoria');
    }
  }

  /**
   * Registra um novo log de auditoria
   */
  async logAuditEvent(data: CreateAuditLogData): Promise<AuditLog> {
    try {
      // Validação básica
      this.validateAuditData(data);

      const response = await apiClient.post(this.baseUrl, data);
      
      // Limpar cache relacionado
      this.clearAuditCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar log de auditoria:', error);
      throw new Error('Falha ao registrar log de auditoria');
    }
  }

  /**
   * Obtém logs de auditoria de um usuário específico
   */
  async getUserAuditLogs(userId: string, params: Omit<AuditSearchParams, 'user_id'> = {}): Promise<AuditPaginatedResponse> {
    try {
      return await this.getAuditLogs({ ...params, user_id: userId });
    } catch (error) {
      console.error(`Erro ao buscar logs de auditoria do usuário ${userId}:`, error);
      throw new Error('Falha ao carregar logs de auditoria do usuário');
    }
  }

  /**
   * Obtém logs de auditoria por ação
   */
  async getAuditLogsByAction(action: string, params: Omit<AuditSearchParams, 'action'> = {}): Promise<AuditPaginatedResponse> {
    try {
      return await this.getAuditLogs({ ...params, action });
    } catch (error) {
      console.error(`Erro ao buscar logs de auditoria da ação ${action}:`, error);
      throw new Error('Falha ao carregar logs de auditoria da ação');
    }
  }

  /**
   * Obtém logs de auditoria por tipo de recurso
   */
  async getAuditLogsByResourceType(resourceType: string, params: Omit<AuditSearchParams, 'resource_type'> = {}): Promise<AuditPaginatedResponse> {
    try {
      return await this.getAuditLogs({ ...params, resource_type: resourceType });
    } catch (error) {
      console.error(`Erro ao buscar logs de auditoria do tipo de recurso ${resourceType}:`, error);
      throw new Error('Falha ao carregar logs de auditoria do tipo de recurso');
    }
  }

  /**
   * Obtém logs de auditoria por recurso específico
   */
  async getAuditLogsByResource(resourceType: string, resourceId: string, params: Omit<AuditSearchParams, 'resource_type' | 'resource_id'> = {}): Promise<AuditPaginatedResponse> {
    try {
      return await this.getAuditLogs({ ...params, resource_type: resourceType, resource_id: resourceId });
    } catch (error) {
      console.error(`Erro ao buscar logs de auditoria do recurso ${resourceType}:${resourceId}:`, error);
      throw new Error('Falha ao carregar logs de auditoria do recurso');
    }
  }

  /**
   * Obtém logs de auditoria recentes
   */
  async getRecentAuditLogs(limit: number = 50): Promise<AuditLog[]> {
    try {
      const cacheKey = `recent_audit_logs_${limit}`;
      const cached = auditCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/recent`, {
        params: { limit }
      });
      
      // Cache do resultado
      auditCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria recentes:', error);
      throw new Error('Falha ao carregar logs de auditoria recentes');
    }
  }

  /**
   * Obtém logs de auditoria de hoje
   */
  async getTodayAuditLogs(): Promise<AuditLog[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await this.getAuditLogs({
        date_from: today,
        date_to: today,
        limit: 1000
      });
      return result.data;
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria de hoje:', error);
      throw new Error('Falha ao carregar logs de auditoria de hoje');
    }
  }

  /**
   * Obtém estatísticas de auditoria
   */
  async getAuditStats(params?: {
    date_from?: string;
    date_to?: string;
    user_id?: string;
  }): Promise<AuditStats> {
    try {
      const cacheKey = `audit_stats_${JSON.stringify(params || {})}`;
      const cached = auditCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/stats`, { params });
      
      // Cache do resultado
      auditCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas de auditoria:', error);
      throw new Error('Falha ao obter estatísticas de auditoria');
    }
  }

  /**
   * Obtém tipos de ação de auditoria
   */
  async getAuditActionTypes(): Promise<AuditActionType[]> {
    try {
      const cacheKey = 'audit_action_types';
      const cached = auditCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/action-types`);
      
      // Cache do resultado
      auditCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter tipos de ação de auditoria:', error);
      throw new Error('Falha ao carregar tipos de ação de auditoria');
    }
  }

  /**
   * Gera relatório de auditoria
   */
  async generateAuditReport(params: {
    date_from: string;
    date_to: string;
    filters?: AuditFilters;
  }): Promise<AuditReport> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/report`, params);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório de auditoria:', error);
      throw new Error('Falha ao gerar relatório de auditoria');
    }
  }

  /**
   * Exporta logs de auditoria
   */
  async exportAuditLogs(params: AuditSearchParams = {}, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.post(
        `${this.baseUrl}/export`,
        { ...params, format },
        { responseType: 'blob' }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar logs de auditoria:', error);
      throw new Error('Falha ao exportar logs de auditoria');
    }
  }

  /**
   * Remove logs de auditoria antigos
   */
  async cleanupOldAuditLogs(daysToKeep: number = 365): Promise<{ deleted_count: number }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/cleanup`, {
        data: { days_to_keep: daysToKeep }
      });
      
      // Limpar cache relacionado
      this.clearAuditCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao limpar logs de auditoria antigos:', error);
      throw new Error('Falha ao limpar logs de auditoria antigos');
    }
  }

  /**
   * Obtém logs de auditoria por IP
   */
  async getAuditLogsByIP(ipAddress: string): Promise<AuditLog[]> {
    try {
      const result = await this.getAuditLogs({
        ip_address: ipAddress,
        limit: 1000
      });
      return result.data;
    } catch (error) {
      console.error(`Erro ao buscar logs de auditoria por IP ${ipAddress}:`, error);
      throw new Error('Falha ao buscar logs de auditoria por IP');
    }
  }

  /**
   * Obtém logs de auditoria por localização
   */
  async getAuditLogsByLocation(location: string): Promise<AuditLog[]> {
    try {
      const result = await this.getAuditLogs({
        // Assumindo que há um filtro por localização
        limit: 1000
      });
      
      // Filtrar por localização (implementação básica)
      return result.data.filter(log => 
        log.location?.city === location || 
        log.location?.country === location ||
        log.location?.region === location
      );
    } catch (error) {
      console.error(`Erro ao buscar logs de auditoria por localização ${location}:`, error);
      throw new Error('Falha ao buscar logs de auditoria por localização');
    }
  }

  /**
   * Obtém eventos de segurança
   */
  async getSecurityEvents(params: {
    severity?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  } = {}): Promise<AuditLog[]> {
    try {
      const result = await this.getAuditLogs({
        ...params,
        // Assumindo que há um filtro para eventos de segurança
        limit: params.limit || 100
      });
      
      // Filtrar eventos de segurança (implementação básica)
      const securityActions = ['login_failed', 'privilege_escalation', 'data_export', 'admin_action'];
      return result.data.filter(log => securityActions.includes(log.action));
    } catch (error) {
      console.error('Erro ao buscar eventos de segurança:', error);
      throw new Error('Falha ao buscar eventos de segurança');
    }
  }

  /**
   * Obtém configurações de auditoria
   */
  async getAuditSettings(): Promise<AuditSettings> {
    try {
      const cacheKey = 'audit_settings';
      const cached = auditCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/settings`);
      
      // Cache do resultado
      auditCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter configurações de auditoria:', error);
      throw new Error('Falha ao obter configurações de auditoria');
    }
  }

  /**
   * Atualiza configurações de auditoria
   */
  async updateAuditSettings(settings: Partial<AuditSettings>): Promise<AuditSettings> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/settings`, settings);
      
      // Limpar cache relacionado
      auditCache.delete('audit_settings');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar configurações de auditoria:', error);
      throw new Error('Falha ao atualizar configurações de auditoria');
    }
  }

  /**
   * Obtém alertas de auditoria
   */
  async getAuditAlerts(): Promise<Array<{
    id: string;
    type: string;
    severity: string;
    message: string;
    user_id: string;
    resource_type: string;
    resource_id: string;
    created_at: string;
    is_resolved: boolean;
    resolved_at?: string;
    resolved_by?: string;
  }>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/alerts`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter alertas de auditoria:', error);
      throw new Error('Falha ao obter alertas de auditoria');
    }
  }

  /**
   * Resolve alerta de auditoria
   */
  async resolveAuditAlert(alertId: string, resolvedBy: string, notes?: string): Promise<void> {
    try {
      await apiClient.patch(`${this.baseUrl}/alerts/${alertId}/resolve`, {
        resolved_by: resolvedBy,
        notes
      });
    } catch (error) {
      console.error(`Erro ao resolver alerta de auditoria ${alertId}:`, error);
      throw new Error('Falha ao resolver alerta de auditoria');
    }
  }

  /**
   * Valida dados básicos de auditoria
   */
  private validateAuditData(data: CreateAuditLogData): void {
    if (!data.user_id) {
      throw new Error('ID do usuário é obrigatório');
    }

    if (!data.action || data.action.trim().length < 1) {
      throw new Error('Ação é obrigatória');
    }

    if (!data.resource_type || data.resource_type.trim().length < 1) {
      throw new Error('Tipo de recurso é obrigatório');
    }

    if (!data.resource_id || data.resource_id.trim().length < 1) {
      throw new Error('ID do recurso é obrigatório');
    }
  }

  /**
   * Limpa cache de auditoria
   */
  private clearAuditCache(): void {
    auditCache.clear();
  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of auditCache.keys()) {
        if (key.includes(pattern)) {
          auditCache.delete(key);
        }
      }
    } else {
      auditCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: auditCache.size,
      keys: Array.from(auditCache.keys())
    };
  }
}

// Instância singleton
export const userAuditService = new UserAuditService();
export default userAuditService;
