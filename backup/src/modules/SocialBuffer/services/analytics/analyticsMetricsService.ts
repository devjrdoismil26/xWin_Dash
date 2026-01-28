// =========================================
// ANALYTICS METRICS SERVICE - SOCIAL BUFFER
// =========================================

import { apiClient } from '@/services';
import {
  SocialAccount,
  SocialPost,
  SocialSchedule,
  SocialLink
} from '../../types/socialTypes';

// Cache para analytics
const analyticsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos (analytics mudam frequentemente)

// Interface para parâmetros de analytics
export interface AnalyticsParams {
  date_from?: string;
  date_to?: string;
  account_id?: string;
  platform?: string;
  metric_type?: string;
  group_by?: 'day' | 'week' | 'month';
  timezone?: string;
}

// Interface para métricas básicas
export interface BasicMetrics {
  total_posts: number;
  total_engagement: number;
  total_reach: number;
  total_impressions: number;
  total_clicks: number;
  total_shares: number;
  total_likes: number;
  total_comments: number;
  average_engagement_rate: number;
  average_reach_rate: number;
  average_click_rate: number;
}

// Interface para métricas por plataforma
export interface PlatformMetrics {
  platform: string;
  posts_count: number;
  engagement: number;
  reach: number;
  impressions: number;
  clicks: number;
  shares: number;
  likes: number;
  comments: number;
  engagement_rate: number;
  reach_rate: number;
  click_rate: number;
  best_performing_post?: SocialPost;
  worst_performing_post?: SocialPost;
}

// Interface para métricas temporais
export interface TimeSeriesMetrics {
  date: string;
  posts_count: number;
  engagement: number;
  reach: number;
  impressions: number;
  clicks: number;
  shares: number;
  likes: number;
  comments: number;
  engagement_rate: number;
  reach_rate: number;
  click_rate: number;
}

// Interface para métricas de conteúdo
export interface ContentMetrics {
  content_type: string;
  posts_count: number;
  total_engagement: number;
  average_engagement: number;
  engagement_rate: number;
  best_performing: SocialPost[];
  worst_performing: SocialPost[];
}

// =========================================
// SERVIÇO DE MÉTRICAS DE ANALYTICS
// =========================================

class AnalyticsMetricsService {
  // ===== MÉTRICAS BÁSICAS =====

  /**
   * Buscar métricas básicas
   */
  async getBasicMetrics(params: AnalyticsParams = {}): Promise<BasicMetrics> {
    const cacheKey = `basic_metrics_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = analyticsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/analytics/metrics/basic', { params });
      const data = response.data;

      // Salvar no cache
      analyticsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas básicas:', error);
      throw new Error('Falha ao buscar métricas básicas');
    }
  }

  /**
   * Buscar métricas por plataforma
   */
  async getPlatformMetrics(params: AnalyticsParams = {}): Promise<PlatformMetrics[]> {
    const cacheKey = `platform_metrics_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = analyticsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/analytics/metrics/platform', { params });
      const data = response.data;

      // Salvar no cache
      analyticsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas por plataforma:', error);
      throw new Error('Falha ao buscar métricas por plataforma');
    }
  }

  /**
   * Buscar métricas temporais
   */
  async getTimeSeriesMetrics(params: AnalyticsParams = {}): Promise<TimeSeriesMetrics[]> {
    const cacheKey = `timeseries_metrics_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = analyticsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/analytics/metrics/timeseries', { params });
      const data = response.data;

      // Salvar no cache
      analyticsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas temporais:', error);
      throw new Error('Falha ao buscar métricas temporais');
    }
  }

  /**
   * Buscar métricas de conteúdo
   */
  async getContentMetrics(params: AnalyticsParams = {}): Promise<ContentMetrics[]> {
    const cacheKey = `content_metrics_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = analyticsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/analytics/metrics/content', { params });
      const data = response.data;

      // Salvar no cache
      analyticsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas de conteúdo:', error);
      throw new Error('Falha ao buscar métricas de conteúdo');
    }
  }

  // ===== UTILITÁRIOS =====

  /**
   * Limpar cache de analytics
   */
  clearCache(): void {
    analyticsCache.clear();
  }

  /**
   * Invalidar cache específico
   */
  invalidateCache(pattern: string): void {
    for (const key of analyticsCache.keys()) {
      if (key.includes(pattern)) {
        analyticsCache.delete(key);
      }
    }
  }

  /**
   * Calcular taxa de engajamento
   */
  calculateEngagementRate(engagement: number, reach: number): number {
    if (reach === 0) return 0;
    return (engagement / reach) * 100;
  }

  /**
   * Calcular taxa de alcance
   */
  calculateReachRate(reach: number, followers: number): number {
    if (followers === 0) return 0;
    return (reach / followers) * 100;
  }

  /**
   * Calcular taxa de cliques
   */
  calculateClickRate(clicks: number, impressions: number): number {
    if (impressions === 0) return 0;
    return (clicks / impressions) * 100;
  }
}

// =========================================
// EXPORTAÇÃO
// =========================================

export const analyticsMetricsService = new AnalyticsMetricsService();
export default analyticsMetricsService;
