import { apiClient } from '@/services';
import { User, UserActivity } from '../types/user.types';

// Cache para atividades
const activityCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 2 * 60 * 1000; // 2 minutos (atividades mudam frequentemente)

// Interface para atividade
export interface Activity {
  id: string;
  user_id: string;
  user: User;
  type: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  location?: {
    country?: string;
  city?: string;
  region?: string; };

  created_at: string;
  updated_at: string;
}

// Interface para parâmetros de busca de atividades
export interface ActivitySearchParams {
  user_id?: string;
  type?: string;
  action?: string;
  date_from?: string;
  date_to?: string;
  ip_address?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// Interface para resposta paginada de atividades
export interface ActivityPaginatedResponse {
  data: Activity[];
  total: number;
  page: number;
  limit: number;
  total_pages: number; }

// Interface para criação de atividade
export interface CreateActivityData {
  user_id: string;
  type: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  [key: string]: unknown; }

// Interface para estatísticas de atividade
export interface ActivityStats {
  total_activities: number;
  activities_today: number;
  activities_this_week: number;
  activities_this_month: number;
  activities_by_type: Record<string, number>;
  activities_by_action: Record<string, number>;
  most_active_users: Array<{
    user: User;
  activity_count: number; }>;
  activity_trends: Array<{
    date: string;
    count: number;
  }>;
  peak_activity_hours: Array<{
    hour: number;
    count: number;
  }>;
  activities_by_location: Array<{
    location: string;
    count: number;
  }>;
}

// Interface para tipos de atividade
export interface ActivityType {
  name: string;
  display_name: string;
  description: string;
  category: string;
  is_system: boolean;
  requires_metadata: boolean;
  metadata_schema?: Record<string, any>; }

// Interface para filtros de atividade
export interface ActivityFilters {
  types?: string[];
  actions?: string[];
  users?: string[];
  date_range?: {
    from: string;
  to: string; };

  locations?: string[];
  ip_addresses?: string[];
}

// Interface para relatório de atividade
export interface ActivityReport {
  period: {
    from: string;
  to: string; };

  total_activities: number;
  unique_users: number;
  activities_by_type: Record<string, number>;
  activities_by_user: Array<{
    user: User;
    count: number;
    last_activity: string;
  }>;
  top_actions: Array<{
    action: string;
    count: number;
  }>;
  activity_timeline: Array<{
    date: string;
    count: number;
  }>;
  generated_at: string;
}

/**
 * Service para gerenciamento de atividades de usuário
 * Responsável por logging, busca, filtros e estatísticas de atividades
 */
class UserActivityService {
  private baseUrl = '/api/users/activities';

  /**
   * Busca atividades com filtros
   */
  async getActivities(params: ActivitySearchParams = {}): Promise<ActivityPaginatedResponse> {
    try {
      const cacheKey = `activities_${JSON.stringify(params)}`;
      const cached = activityCache.get(cacheKey);

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
      activityCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      throw new Error('Falha ao carregar atividades');

    } /**
   * Busca uma atividade específica por ID
   */
  async getActivityById(id: string): Promise<Activity> {
    try {
      const cacheKey = `activity_${id}`;
      const cached = activityCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);

      // Cache do resultado
      activityCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar atividade');

    } /**
   * Registra uma nova atividade
   */
  async logActivity(data: CreateActivityData): Promise<Activity> {
    try {
      // Validação básica
      this.validateActivityData(data);

      const response = await apiClient.post(this.baseUrl, data);

      // Limpar cache relacionado
      this.clearActivityCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao registrar atividade');

    } /**
   * Obtém atividades de um usuário específico
   */
  async getUserActivities(userId: string, params: Omit<ActivitySearchParams, 'user_id'> = {}): Promise<ActivityPaginatedResponse> {
    try {
      return await this.getActivities({ ...params, user_id: userId });

    } catch (error) {
      throw new Error('Falha ao carregar atividades do usuário');

    } /**
   * Obtém atividades por tipo
   */
  async getActivitiesByType(type: string, params: Omit<ActivitySearchParams, 'type'> = {}): Promise<ActivityPaginatedResponse> {
    try {
      return await this.getActivities({ ...params, type });

    } catch (error) {
      throw new Error('Falha ao carregar atividades do tipo');

    } /**
   * Obtém atividades por ação
   */
  async getActivitiesByAction(action: string, params: Omit<ActivitySearchParams, 'action'> = {}): Promise<ActivityPaginatedResponse> {
    try {
      return await this.getActivities({ ...params, action });

    } catch (error) {
      throw new Error('Falha ao carregar atividades da ação');

    } /**
   * Obtém atividades recentes
   */
  async getRecentActivities(limit: number = 50): Promise<Activity[]> {
    try {
      const cacheKey = `recent_activities_${limit}`;
      const cached = activityCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/recent`, {
        params: { limit } );

      // Cache do resultado
      activityCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar atividades recentes');

    } /**
   * Obtém atividades de hoje
   */
  async getTodayActivities(): Promise<Activity[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await this.getActivities({
        date_from: today,
        date_to: today,
        limit: 1000
      });

      return result.data;
    } catch (error) {
      throw new Error('Falha ao carregar atividades de hoje');

    } /**
   * Obtém estatísticas de atividades
   */
  async getActivityStats(params?: {
    date_from?: string;
    date_to?: string;
    user_id?: string;
  }): Promise<ActivityStats> {
    try {
      const cacheKey = `activity_stats_${JSON.stringify(params || {})}`;
      const cached = activityCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/stats`, { params });

      // Cache do resultado
      activityCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter estatísticas de atividades');

    } /**
   * Obtém tipos de atividade disponíveis
   */
  async getActivityTypes(): Promise<ActivityType[]> {
    try {
      const cacheKey = 'activity_types';
      const cached = activityCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/types`);

      // Cache do resultado
      activityCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar tipos de atividade');

    } /**
   * Gera relatório de atividades
   */
  async generateActivityReport(params: {
    date_from: string;
    date_to: string;
    filters?: ActivityFilters;
  }): Promise<ActivityReport> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/report`, params);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao gerar relatório de atividades');

    } /**
   * Exporta atividades
   */
  async exportActivities(params: ActivitySearchParams = {}, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.post(
        `${this.baseUrl}/export`,
        { ...params, format },
        { responseType: 'blob' });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao exportar atividades');

    } /**
   * Remove atividades antigas
   */
  async cleanupOldActivities(daysToKeep: number = 90): Promise<{ deleted_count: number }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/cleanup`, {
        data: { days_to_keep: daysToKeep } );

      // Limpar cache relacionado
      this.clearActivityCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao limpar atividades antigas');

    } /**
   * Obtém atividades por localização
   */
  async getActivitiesByLocation(location: string): Promise<Activity[]> {
    try {
      const result = await this.getActivities({
        // Assumindo que há um filtro por localização
        limit: 1000
      });

      // Filtrar por localização (implementação básica)
      return result.data.filter(activity => 
        activity.location?.city === location || 
        activity.location?.country === location ||
        activity.location?.region === location);

    } catch (error) {
      throw new Error('Falha ao buscar atividades por localização');

    } /**
   * Obtém atividades por IP
   */
  async getActivitiesByIP(ipAddress: string): Promise<Activity[]> {
    try {
      const result = await this.getActivities({
        ip_address: ipAddress,
        limit: 1000
      });

      return result.data;
    } catch (error) {
      throw new Error('Falha ao buscar atividades por IP');

    } /**
   * Obtém usuários mais ativos
   */
  async getMostActiveUsers(limit: number = 10, params?: {
    date_from?: string;
    date_to?: string;
  }): Promise<Array<{ user: User; activity_count: number }>> {
    try {
      const cacheKey = `most_active_users_${limit}_${JSON.stringify(params || {})}`;
      const cached = activityCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/most-active`, {
        params: { limit, ...params } );

      // Cache do resultado
      activityCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter usuários mais ativos');

    } /**
   * Obtém tendências de atividade
   */
  async getActivityTrends(params: {
    period: 'day' | 'week' | 'month';
    date_from?: string;
    date_to?: string;
  }): Promise<Array<{ date: string; count: number }>> {
    try {
      const cacheKey = `activity_trends_${JSON.stringify(params)}`;
      const cached = activityCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/trends`, { params });

      // Cache do resultado
      activityCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter tendências de atividade');

    } /**
   * Valida dados básicos da atividade
   */
  private validateActivityData(data: CreateActivityData): void {
    if (!data.user_id) {
      throw new Error('ID do usuário é obrigatório');

    }

    if (!data.type || (data as any).type.trim().length < 1) {
      throw new Error('Tipo da atividade é obrigatório');

    }

    if (!data.action || (data as any).action.trim().length < 1) {
      throw new Error('Ação da atividade é obrigatória');

    }

    if (!data.description || (data as any).description.trim().length < 1) {
      throw new Error('Descrição da atividade é obrigatória');

    }

    if (data.description && (data as any).description.length > 1000) {
      throw new Error('Descrição deve ter no máximo 1000 caracteres');

    } /**
   * Limpa cache de atividades
   */
  private clearActivityCache(): void {
    activityCache.clear();

  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of activityCache.keys()) {
        if (key.includes(pattern)) {
          activityCache.delete(key);

        } } else {
      activityCache.clear();

    } /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: activityCache.size,
      keys: Array.from(activityCache.keys())};

  } // Instância singleton
export const userActivityService = new UserActivityService();

export default userActivityService;
