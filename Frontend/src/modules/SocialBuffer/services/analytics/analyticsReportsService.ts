/**
 * Serviço de Relatórios de Analytics do SocialBuffer
 *
 * @description
 * Serviço responsável por relatórios de analytics incluindo métricas de links,
 * engajamento, audiência, comparações de período e geração de relatórios.
 * Gerencia cache com TTL maior para relatórios pesados.
 *
 * @module modules/SocialBuffer/services/analytics/analyticsReportsService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { SocialPost } from '../../types';

/**
 * Cache para relatórios de analytics
 *
 * @description
 * Cache em memória para relatórios com TTL de 15 minutos (relatórios são mais pesados).
 */
const reportsCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 15 * 60 * 1000; // 15 minutos (relatórios são mais pesados)

// Interface para parâmetros de analytics
export interface AnalyticsParams {
  date_from?: string;
  date_to?: string;
  account_id?: string;
  platform?: string;
  metric_type?: string;
  group_by?: 'day' | 'week' | 'month';
  timezone?: string; }

// Interface para métricas de links
export interface LinkMetrics {
  link_id: string;
  original_url: string;
  short_url: string;
  clicks: number;
  unique_clicks: number;
  click_rate: number;
  referrers: Array<{
    source: string;
  clicks: number;
  percentage: number; }>;
  countries: Array<{
    country: string;
    clicks: number;
    percentage: number;
  }>;
  devices: Array<{
    device: string;
    clicks: number;
    percentage: number;
  }>;
  posts: SocialPost[];
  created_at: string;
  last_click: string;
}

// Interface para métricas de engajamento
export interface EngagementMetrics {
  total_engagement: number;
  average_engagement: number;
  engagement_rate: number;
  engagement_by_type: {
    likes: number;
  comments: number;
  shares: number;
  saves: number;
  reactions: number; };

  engagement_trends: Array<{
    date: string;
    engagement: number;
    engagement_rate: number;
  }>;
  top_engaging_posts: SocialPost[];
  engagement_by_platform: Record<string, {
    engagement: number;
    engagement_rate: number;
  }>;
}

// Interface para métricas de audiência
export interface AudienceMetrics {
  total_followers: number;
  followers_growth: number;
  followers_growth_rate: number;
  demographics: {
    age_groups: Record<string, number>;
  genders: Record<string, number>;
  locations: Record<string, number>;
  interests: Record<string, number>; };

  engagement_behavior: {
    most_active_hours: number[];
    most_active_days: string[];
    average_session_duration: number;
    bounce_rate: number;};

  audience_quality: {
    real_followers_percentage: number;
    engagement_rate: number;
    reach_rate: number;
    quality_score: number;};

}

// Interface para relatório de analytics
export interface AnalyticsReport {
  id: string;
  title: string;
  description: string;
  period: {
    from: string;
  to: string; };

  metrics: {
    basic: unknown;
    platform: string[];
    timeseries: string[];
    content: string[];
    hashtags: string[];
    links: string[];
    engagement: unknown;
    audience: unknown;};

  insights: {
    insights: string[];
    recommendations: string[];
    trends: Array<{
      metric: string;
      trend: 'up' | 'down' | 'stable';
      percentage: number;
      description: string;
    }>;};

  generated_at: string;
  generated_by: string;
}

// Interface para comparação de períodos
export interface PeriodComparison {
  current_period: {
    from: string;
  to: string;
  metrics: unknown; };

  previous_period: {
    from: string;
    to: string;
    metrics: unknown;};

  comparison: {
    metric: string;
    current_value: number;
    previous_value: number;
    change: number;
    change_percentage: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  summary: {
    total_improvements: number;
    total_declines: number;
    overall_trend: 'up' | 'down' | 'stable';
    key_insights: string[];};

}

// =========================================
// SERVIÇO DE RELATÓRIOS DE ANALYTICS
// =========================================

class AnalyticsReportsService {
  // ===== MÉTRICAS DE LINKS =====

  /**
   * Buscar métricas de links
   */
  async getLinkMetrics(params: AnalyticsParams = {}): Promise<LinkMetrics[]> {
    const cacheKey = `link_metrics_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = reportsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/analytics/links/metrics', { params });

      const data = (response as any).data;

      // Salvar no cache
      reportsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas de links:', error);

      throw new Error('Falha ao buscar métricas de links');

    } /**
   * Buscar métricas de engajamento
   */
  async getEngagementMetrics(params: AnalyticsParams = {}): Promise<EngagementMetrics> {
    const cacheKey = `engagement_metrics_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = reportsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/analytics/engagement/metrics', { params });

      const data = (response as any).data;

      // Salvar no cache
      reportsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas de engajamento:', error);

      throw new Error('Falha ao buscar métricas de engajamento');

    } /**
   * Buscar métricas de audiência
   */
  async getAudienceMetrics(params: AnalyticsParams = {}): Promise<AudienceMetrics> {
    const cacheKey = `audience_metrics_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = reportsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/analytics/audience/metrics', { params });

      const data = (response as any).data;

      // Salvar no cache
      reportsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas de audiência:', error);

      throw new Error('Falha ao buscar métricas de audiência');

    } // ===== RELATÓRIOS =====

  /**
   * Gerar relatório de analytics
   */
  async generateReport(params: AnalyticsParams & {
    title: string;
    description?: string;
  }): Promise<AnalyticsReport> {
    try {
      const response = await apiClient.post('/analytics/reports/generate', params);

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);

      throw new Error('Falha ao gerar relatório');

    } /**
   * Buscar relatório por ID
   */
  async getReport(reportId: string): Promise<AnalyticsReport> {
    const cacheKey = `report_${reportId}`;
    
    // Verificar cache
    const cached = reportsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get(`/analytics/reports/${reportId}`);

      const data = (response as any).data;

      // Salvar no cache
      reportsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);

      throw new Error('Falha ao buscar relatório');

    } /**
   * Listar relatórios
   */
  async listReports(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{ data: AnalyticsReport[]; total: number; page: number; limit: number }> {
    try {
      const response = await apiClient.get('/analytics/reports', { params });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao listar relatórios:', error);

      throw new Error('Falha ao listar relatórios');

    } /**
   * Exportar relatório
   */
  async exportReport(reportId: string, format: 'pdf' | 'excel' | 'csv' = 'pdf'): Promise<Blob> {
    try {
      const response = await apiClient.get(`/analytics/reports/${reportId}/export`, {
        params: { format },
        responseType: 'blob'
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);

      throw new Error('Falha ao exportar relatório');

    } // ===== COMPARAÇÕES =====

  /**
   * Comparar períodos
   */
  async comparePeriods(
    currentPeriod: { from: string; to: string },
    previousPeriod: { from: string; to: string },
    params: Omit<AnalyticsParams, 'date_from' | 'date_to'> ={  }
  ): Promise<PeriodComparison> {
    const cacheKey = `period_comparison_${JSON.stringify({ currentPeriod, previousPeriod, params })}`;
    
    // Verificar cache
    const cached = reportsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.post('/analytics/compare-periods', {
        current_period: currentPeriod,
        previous_period: previousPeriod,
        ...params
      });

      const data = (response as any).data;

      // Salvar no cache
      reportsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao comparar períodos:', error);

      throw new Error('Falha ao comparar períodos');

    } // ===== UTILITÁRIOS =====

  /**
   * Limpar cache de relatórios
   */
  clearCache(): void {
    reportsCache.clear();

  }

  /**
   * Invalidar cache específico
   */
  invalidateCache(pattern: string): void {
    for (const key of reportsCache.keys()) {
      if (key.includes(pattern)) {
        reportsCache.delete(key);

      } }

  /**
   * Calcular taxa de cliques
   */
  calculateClickRate(clicks: number, impressions: number): number {
    if (impressions === 0) return 0;
    return (clicks / impressions) * 100;
  }

  /**
   * Calcular taxa de engajamento
   */
  calculateEngagementRate(engagement: number, reach: number): number {
    if (reach === 0) return 0;
    return (engagement / reach) * 100;
  }

  /**
   * Calcular taxa de crescimento
   */
  calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  } // =========================================
// EXPORTAÇÃO
// =========================================

export const analyticsReportsService = new AnalyticsReportsService();

export default analyticsReportsService;
