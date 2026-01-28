import { apiClient } from '@/services';
import {
  SocialAccount,
  SocialPost,
  SocialSchedule,
  SocialLink
} from '../types/socialTypes';

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

// Interface para métricas de hashtags
export interface HashtagMetrics {
  hashtag: string;
  usage_count: number;
  total_engagement: number;
  average_engagement: number;
  engagement_rate: number;
  reach: number;
  impressions: number;
  posts: SocialPost[];
}

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
    percentage: number;
  }>;
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
  browsers: Array<{
    browser: string;
    clicks: number;
    percentage: number;
  }>;
}

// Interface para métricas de engajamento
export interface EngagementMetrics {
  total_engagement: number;
  engagement_rate: number;
  engagement_by_type: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    reactions: number;
  };
  engagement_trends: TimeSeriesMetrics[];
  top_engaging_posts: SocialPost[];
  engagement_by_time: Array<{
    hour: number;
    engagement: number;
    posts_count: number;
  }>;
  engagement_by_day: Array<{
    day: string;
    engagement: number;
    posts_count: number;
  }>;
}

// Interface para métricas de audiência
export interface AudienceMetrics {
  total_followers: number;
  followers_growth: number;
  followers_growth_rate: number;
  audience_demographics: {
    age_groups: Array<{
      age_group: string;
      percentage: number;
    }>;
    genders: Array<{
      gender: string;
      percentage: number;
    }>;
    countries: Array<{
      country: string;
      percentage: number;
    }>;
    cities: Array<{
      city: string;
      percentage: number;
    }>;
  };
  audience_interests: Array<{
    interest: string;
    percentage: number;
  }>;
  audience_activity: Array<{
    hour: number;
    activity: number;
  }>;
}

// Interface para relatório completo
export interface AnalyticsReport {
  period: {
    from: string;
    to: string;
  };
  basic_metrics: BasicMetrics;
  platform_metrics: PlatformMetrics[];
  time_series: TimeSeriesMetrics[];
  content_metrics: ContentMetrics[];
  hashtag_metrics: HashtagMetrics[];
  link_metrics: LinkMetrics[];
  engagement_metrics: EngagementMetrics;
  audience_metrics: AudienceMetrics;
  insights: string[];
  recommendations: string[];
  generated_at: string;
}

// Interface para comparação de períodos
export interface PeriodComparison {
  current_period: AnalyticsReport;
  previous_period: AnalyticsReport;
  changes: {
    posts_count: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
    engagement: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
    reach: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
    impressions: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
    clicks: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
    engagement_rate: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
    reach_rate: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
    click_rate: { value: number; percentage: number; trend: 'up' | 'down' | 'stable' };
  };
  insights: string[];
}

/**
 * Service para analytics e métricas do SocialBuffer
 * Responsável por coleta, análise e relatórios de performance
 */
class AnalyticsService {
  private baseUrl = '/api/social-buffer/analytics';

  /**
   * Obtém métricas básicas
   */
  async getBasicMetrics(params: AnalyticsParams = {}): Promise<BasicMetrics> {
    try {
      const cacheKey = `basic_metrics_${JSON.stringify(params)}`;
      const cached = analyticsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/basic`, { params });
      
      // Cache do resultado
      analyticsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas básicas:', error);
      throw new Error('Falha ao carregar métricas básicas');
    }
  }

  /**
   * Obtém métricas por plataforma
   */
  async getPlatformMetrics(params: AnalyticsParams = {}): Promise<PlatformMetrics[]> {
    try {
      const cacheKey = `platform_metrics_${JSON.stringify(params)}`;
      const cached = analyticsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/platforms`, { params });
      
      // Cache do resultado
      analyticsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas por plataforma:', error);
      throw new Error('Falha ao carregar métricas por plataforma');
    }
  }

  /**
   * Obtém métricas temporais (série temporal)
   */
  async getTimeSeriesMetrics(params: AnalyticsParams = {}): Promise<TimeSeriesMetrics[]> {
    try {
      const cacheKey = `time_series_${JSON.stringify(params)}`;
      const cached = analyticsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/time-series`, { params });
      
      // Cache do resultado
      analyticsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas temporais:', error);
      throw new Error('Falha ao carregar métricas temporais');
    }
  }

  /**
   * Obtém métricas de conteúdo
   */
  async getContentMetrics(params: AnalyticsParams = {}): Promise<ContentMetrics[]> {
    try {
      const cacheKey = `content_metrics_${JSON.stringify(params)}`;
      const cached = analyticsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/content`, { params });
      
      // Cache do resultado
      analyticsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas de conteúdo:', error);
      throw new Error('Falha ao carregar métricas de conteúdo');
    }
  }

  /**
   * Obtém métricas de hashtags
   */
  async getHashtagMetrics(params: AnalyticsParams = {}): Promise<HashtagMetrics[]> {
    try {
      const cacheKey = `hashtag_metrics_${JSON.stringify(params)}`;
      const cached = analyticsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/hashtags`, { params });
      
      // Cache do resultado
      analyticsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas de hashtags:', error);
      throw new Error('Falha ao carregar métricas de hashtags');
    }
  }

  /**
   * Obtém métricas de links
   */
  async getLinkMetrics(params: AnalyticsParams = {}): Promise<LinkMetrics[]> {
    try {
      const cacheKey = `link_metrics_${JSON.stringify(params)}`;
      const cached = analyticsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/links`, { params });
      
      // Cache do resultado
      analyticsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas de links:', error);
      throw new Error('Falha ao carregar métricas de links');
    }
  }

  /**
   * Obtém métricas de engajamento
   */
  async getEngagementMetrics(params: AnalyticsParams = {}): Promise<EngagementMetrics> {
    try {
      const cacheKey = `engagement_metrics_${JSON.stringify(params)}`;
      const cached = analyticsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/engagement`, { params });
      
      // Cache do resultado
      analyticsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas de engajamento:', error);
      throw new Error('Falha ao carregar métricas de engajamento');
    }
  }

  /**
   * Obtém métricas de audiência
   */
  async getAudienceMetrics(params: AnalyticsParams = {}): Promise<AudienceMetrics> {
    try {
      const cacheKey = `audience_metrics_${JSON.stringify(params)}`;
      const cached = analyticsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/audience`, { params });
      
      // Cache do resultado
      analyticsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas de audiência:', error);
      throw new Error('Falha ao carregar métricas de audiência');
    }
  }

  /**
   * Gera relatório completo de analytics
   */
  async generateReport(params: AnalyticsParams = {}): Promise<AnalyticsReport> {
    try {
      const cacheKey = `full_report_${JSON.stringify(params)}`;
      const cached = analyticsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.post(`${this.baseUrl}/report`, params);
      
      // Cache do resultado
      analyticsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw new Error('Falha ao gerar relatório');
    }
  }

  /**
   * Compara métricas entre períodos
   */
  async comparePeriods(
    currentParams: AnalyticsParams,
    previousParams: AnalyticsParams
  ): Promise<PeriodComparison> {
    try {
      const cacheKey = `period_comparison_${JSON.stringify({ currentParams, previousParams })}`;
      const cached = analyticsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.post(`${this.baseUrl}/compare`, {
        current_period: currentParams,
        previous_period: previousParams
      });
      
      // Cache do resultado
      analyticsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao comparar períodos:', error);
      throw new Error('Falha ao comparar períodos');
    }
  }

  /**
   * Exporta relatório em formato específico
   */
  async exportReport(
    params: AnalyticsParams,
    format: 'pdf' | 'excel' | 'csv' = 'pdf'
  ): Promise<Blob> {
    try {
      const response = await apiClient.post(
        `${this.baseUrl}/export`,
        { ...params, format },
        { responseType: 'blob' }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      throw new Error('Falha ao exportar relatório');
    }
  }

  /**
   * Obtém insights automáticos
   */
  async getInsights(params: AnalyticsParams = {}): Promise<{
    insights: string[];
    recommendations: string[];
    trends: Array<{
      metric: string;
      trend: 'up' | 'down' | 'stable';
      percentage: number;
      description: string;
    }>;
  }> {
    try {
      const cacheKey = `insights_${JSON.stringify(params)}`;
      const cached = analyticsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/insights`, { params });
      
      // Cache do resultado
      analyticsCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter insights:', error);
      throw new Error('Falha ao obter insights');
    }
  }

  /**
   * Obtém métricas em tempo real
   */
  async getRealTimeMetrics(): Promise<{
    active_posts: number;
    scheduled_posts: number;
    total_engagement_today: number;
    total_reach_today: number;
    top_performing_post: SocialPost | null;
    recent_activity: Array<{
      type: string;
      description: string;
      timestamp: string;
      value?: number;
    }>;
  }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/realtime`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter métricas em tempo real:', error);
      throw new Error('Falha ao obter métricas em tempo real');
    }
  }

  /**
   * Obtém métricas de performance de posts específicos
   */
  async getPostPerformance(postIds: string[]): Promise<Array<{
    post_id: string;
    post: SocialPost;
    metrics: {
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
    };
  }>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/posts/performance`, {
        post_ids: postIds
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter performance dos posts:', error);
      throw new Error('Falha ao obter performance dos posts');
    }
  }

  /**
   * Obtém métricas de performance de contas específicas
   */
  async getAccountPerformance(accountIds: string[]): Promise<Array<{
    account_id: string;
    account: SocialAccount;
    metrics: PlatformMetrics;
    growth: {
      followers_growth: number;
      engagement_growth: number;
      reach_growth: number;
    };
  }>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/accounts/performance`, {
        account_ids: accountIds
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter performance das contas:', error);
      throw new Error('Falha ao obter performance das contas');
    }
  }

  /**
   * Limpa cache de analytics
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of analyticsCache.keys()) {
        if (key.includes(pattern)) {
          analyticsCache.delete(key);
        }
      }
    } else {
      analyticsCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: analyticsCache.size,
      keys: Array.from(analyticsCache.keys())
    };
  }
}

// Instância singleton
export const analyticsService = new AnalyticsService();
export default analyticsService;
