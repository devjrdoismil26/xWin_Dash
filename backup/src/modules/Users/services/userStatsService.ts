import { apiClient } from '@/services';
import {
  User,
  UserStats,
  SystemStats
} from '../types/userTypes';

// Cache para estatísticas
const statsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Interface para estatísticas gerais de usuários
export interface UserGeneralStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  pending_users: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
  users_growth_rate: number;
  average_session_duration: number;
  most_active_users: User[];
  users_by_status: Record<string, number>;
  users_by_role: Record<string, number>;
}

// Interface para estatísticas de crescimento
export interface UserGrowthStats {
  period: 'day' | 'week' | 'month' | 'year';
  data: Array<{
    date: string;
    new_users: number;
    active_users: number;
    total_users: number;
    growth_rate: number;
  }>;
  total_growth: number;
  average_growth_rate: number;
  peak_growth_period: {
    date: string;
    growth: number;
  };
}

// Interface para estatísticas de atividade
export interface UserActivityStats {
  total_logins: number;
  logins_today: number;
  logins_this_week: number;
  logins_this_month: number;
  average_logins_per_user: number;
  most_active_users: Array<{
    user: User;
    login_count: number;
    last_login: string;
  }>;
  login_trends: Array<{
    date: string;
    count: number;
  }>;
  peak_login_hours: Array<{
    hour: number;
    count: number;
  }>;
  login_sources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
}

// Interface para estatísticas de roles
export interface UserRoleStats {
  total_roles: number;
  system_roles: number;
  custom_roles: number;
  users_by_role: Record<string, number>;
  role_distribution: Array<{
    role: string;
    count: number;
    percentage: number;
  }>;
  most_used_roles: Array<{
    role: string;
    count: number;
  }>;
  least_used_roles: Array<{
    role: string;
    count: number;
  }>;
}

// Interface para estatísticas de localização
export interface UserLocationStats {
  total_countries: number;
  total_cities: number;
  users_by_country: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
  users_by_city: Array<{
    city: string;
    country: string;
    count: number;
  }>;
  top_countries: Array<{
    country: string;
    count: number;
  }>;
  top_cities: Array<{
    city: string;
    country: string;
    count: number;
  }>;
}

// Interface para estatísticas de dispositivos
export interface UserDeviceStats {
  total_devices: number;
  devices_by_type: Record<string, number>;
  devices_by_os: Record<string, number>;
  devices_by_browser: Record<string, number>;
  mobile_vs_desktop: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  most_used_devices: Array<{
    device: string;
    count: number;
  }>;
  most_used_os: Array<{
    os: string;
    count: number;
  }>;
  most_used_browsers: Array<{
    browser: string;
    count: number;
  }>;
}

// Interface para estatísticas de tempo
export interface UserTimeStats {
  users_by_timezone: Array<{
    timezone: string;
    count: number;
  }>;
  peak_activity_hours: Array<{
    hour: number;
    count: number;
  }>;
  peak_activity_days: Array<{
    day: string;
    count: number;
  }>;
  average_session_duration: number;
  longest_sessions: Array<{
    user: User;
    duration: number;
    date: string;
  }>;
}

// Interface para estatísticas de retenção
export interface UserRetentionStats {
  period: 'day' | 'week' | 'month';
  cohorts: Array<{
    cohort_date: string;
    total_users: number;
    retention_rates: Array<{
      period: number;
      rate: number;
    }>;
  }>;
  average_retention_rate: number;
  best_retention_cohort: {
    date: string;
    rate: number;
  };
  worst_retention_cohort: {
    date: string;
    rate: number;
  };
}

// Interface para parâmetros de estatísticas
export interface StatsParams {
  date_from?: string;
  date_to?: string;
  period?: 'day' | 'week' | 'month' | 'year';
  group_by?: 'day' | 'week' | 'month' | 'year';
  filters?: Record<string, any>;
}

/**
 * Service para estatísticas e métricas de usuários
 * Responsável por coleta, análise e relatórios de estatísticas
 */
class UserStatsService {
  private baseUrl = '/api/users/stats';

  /**
   * Obtém estatísticas gerais de usuários
   */
  async getGeneralStats(params?: StatsParams): Promise<UserGeneralStats> {
    try {
      const cacheKey = `general_stats_${JSON.stringify(params || {})}`;
      const cached = statsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/general`, { params });
      
      // Cache do resultado
      statsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas gerais:', error);
      throw new Error('Falha ao obter estatísticas gerais');
    }
  }

  /**
   * Obtém estatísticas de crescimento
   */
  async getGrowthStats(params: StatsParams): Promise<UserGrowthStats> {
    try {
      const cacheKey = `growth_stats_${JSON.stringify(params)}`;
      const cached = statsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/growth`, { params });
      
      // Cache do resultado
      statsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas de crescimento:', error);
      throw new Error('Falha ao obter estatísticas de crescimento');
    }
  }

  /**
   * Obtém estatísticas de atividade
   */
  async getActivityStats(params?: StatsParams): Promise<UserActivityStats> {
    try {
      const cacheKey = `activity_stats_${JSON.stringify(params || {})}`;
      const cached = statsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/activity`, { params });
      
      // Cache do resultado
      statsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas de atividade:', error);
      throw new Error('Falha ao obter estatísticas de atividade');
    }
  }

  /**
   * Obtém estatísticas de roles
   */
  async getRoleStats(params?: StatsParams): Promise<UserRoleStats> {
    try {
      const cacheKey = `role_stats_${JSON.stringify(params || {})}`;
      const cached = statsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/roles`, { params });
      
      // Cache do resultado
      statsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas de roles:', error);
      throw new Error('Falha ao obter estatísticas de roles');
    }
  }

  /**
   * Obtém estatísticas de localização
   */
  async getLocationStats(params?: StatsParams): Promise<UserLocationStats> {
    try {
      const cacheKey = `location_stats_${JSON.stringify(params || {})}`;
      const cached = statsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/location`, { params });
      
      // Cache do resultado
      statsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas de localização:', error);
      throw new Error('Falha ao obter estatísticas de localização');
    }
  }

  /**
   * Obtém estatísticas de dispositivos
   */
  async getDeviceStats(params?: StatsParams): Promise<UserDeviceStats> {
    try {
      const cacheKey = `device_stats_${JSON.stringify(params || {})}`;
      const cached = statsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/devices`, { params });
      
      // Cache do resultado
      statsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas de dispositivos:', error);
      throw new Error('Falha ao obter estatísticas de dispositivos');
    }
  }

  /**
   * Obtém estatísticas de tempo
   */
  async getTimeStats(params?: StatsParams): Promise<UserTimeStats> {
    try {
      const cacheKey = `time_stats_${JSON.stringify(params || {})}`;
      const cached = statsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/time`, { params });
      
      // Cache do resultado
      statsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas de tempo:', error);
      throw new Error('Falha ao obter estatísticas de tempo');
    }
  }

  /**
   * Obtém estatísticas de retenção
   */
  async getRetentionStats(params: StatsParams): Promise<UserRetentionStats> {
    try {
      const cacheKey = `retention_stats_${JSON.stringify(params)}`;
      const cached = statsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/retention`, { params });
      
      // Cache do resultado
      statsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas de retenção:', error);
      throw new Error('Falha ao obter estatísticas de retenção');
    }
  }

  /**
   * Obtém estatísticas de um usuário específico
   */
  async getUserStats(userId: string, params?: StatsParams): Promise<UserStats> {
    try {
      const cacheKey = `user_stats_${userId}_${JSON.stringify(params || {})}`;
      const cached = statsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/user/${userId}`, { params });
      
      // Cache do resultado
      statsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter estatísticas do usuário ${userId}:`, error);
      throw new Error('Falha ao obter estatísticas do usuário');
    }
  }

  /**
   * Obtém estatísticas do sistema
   */
  async getSystemStats(): Promise<SystemStats> {
    try {
      const cacheKey = 'system_stats';
      const cached = statsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/system`);
      
      // Cache do resultado
      statsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas do sistema:', error);
      throw new Error('Falha ao obter estatísticas do sistema');
    }
  }

  /**
   * Obtém estatísticas em tempo real
   */
  async getRealTimeStats(): Promise<{
    active_users_now: number;
    new_users_today: number;
    total_logins_today: number;
    system_load: number;
    last_updated: string;
  }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/realtime`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas em tempo real:', error);
      throw new Error('Falha ao obter estatísticas em tempo real');
    }
  }

  /**
   * Gera relatório de estatísticas
   */
  async generateStatsReport(params: {
    type: 'general' | 'growth' | 'activity' | 'roles' | 'location' | 'devices' | 'time' | 'retention';
    date_from: string;
    date_to: string;
    format?: 'json' | 'csv' | 'excel' | 'pdf';
  }): Promise<any> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/report`, params);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório de estatísticas:', error);
      throw new Error('Falha ao gerar relatório de estatísticas');
    }
  }

  /**
   * Exporta estatísticas
   */
  async exportStats(params: StatsParams, format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.post(
        `${this.baseUrl}/export`,
        { ...params, format },
        { responseType: 'blob' }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar estatísticas:', error);
      throw new Error('Falha ao exportar estatísticas');
    }
  }

  /**
   * Obtém comparação de períodos
   */
  async comparePeriods(
    currentParams: StatsParams,
    previousParams: StatsParams
  ): Promise<{
    current_period: any;
    previous_period: any;
    changes: {
      total_users: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
      active_users: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
      new_users: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
      growth_rate: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
    };
    insights: string[];
  }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/compare`, {
        current_period: currentParams,
        previous_period: previousParams
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao comparar períodos:', error);
      throw new Error('Falha ao comparar períodos');
    }
  }

  /**
   * Obtém insights automáticos
   */
  async getInsights(params?: StatsParams): Promise<{
    insights: string[];
    recommendations: string[];
    trends: Array<{
      metric: string;
      trend: 'up' | 'down' | 'stable';
      percentage: number;
      description: string;
    }>;
    alerts: Array<{
      type: 'warning' | 'error' | 'info';
      message: string;
      value: number;
      threshold: number;
    }>;
  }> {
    try {
      const cacheKey = `insights_${JSON.stringify(params || {})}`;
      const cached = statsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/insights`, { params });
      
      // Cache do resultado
      statsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter insights:', error);
      throw new Error('Falha ao obter insights');
    }
  }

  /**
   * Obtém métricas de performance
   */
  async getPerformanceMetrics(): Promise<{
    response_time: number;
    cache_hit_rate: number;
    error_rate: number;
    throughput: number;
    last_updated: string;
  }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/performance`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas de performance:', error);
      throw new Error('Falha ao obter métricas de performance');
    }
  }

  /**
   * Limpa cache de estatísticas
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of statsCache.keys()) {
        if (key.includes(pattern)) {
          statsCache.delete(key);
        }
      }
    } else {
      statsCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: statsCache.size,
      keys: Array.from(statsCache.keys())
    };
  }
}

// Instância singleton
export const userStatsService = new UserStatsService();
export default userStatsService;
