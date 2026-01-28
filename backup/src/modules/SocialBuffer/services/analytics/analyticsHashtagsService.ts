// =========================================
// ANALYTICS HASHTAGS SERVICE - SOCIAL BUFFER
// =========================================

import { apiClient } from '@/services';
import { SocialPost } from '../../types/socialTypes';

// Cache para analytics de hashtags
const hashtagsAnalyticsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos (hashtags mudam menos frequentemente)

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

// Interface para análise de hashtags
export interface HashtagAnalysis {
  hashtag: string;
  platform: string;
  popularity_score: number;
  engagement_score: number;
  competition_level: 'low' | 'medium' | 'high';
  suggested_usage: 'high' | 'medium' | 'low';
  related_hashtags: string[];
  optimal_posting_times: string[];
  audience_insights: {
    age_groups: Record<string, number>;
    interests: string[];
    locations: string[];
  };
}

// Interface para sugestões de hashtags
export interface HashtagSuggestions {
  trending: string[];
  relevant: string[];
  popular: string[];
  niche: string[];
  engagement_boost: string[];
  competition_low: string[];
  mix: string[];
}

// =========================================
// SERVIÇO DE ANALYTICS DE HASHTAGS
// =========================================

class AnalyticsHashtagsService {
  // ===== MÉTRICAS DE HASHTAGS =====

  /**
   * Buscar métricas de hashtags
   */
  async getHashtagMetrics(params: AnalyticsParams = {}): Promise<HashtagMetrics[]> {
    const cacheKey = `hashtag_metrics_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = hashtagsAnalyticsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/analytics/hashtags/metrics', { params });
      const data = response.data;

      // Salvar no cache
      hashtagsAnalyticsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar métricas de hashtags:', error);
      throw new Error('Falha ao buscar métricas de hashtags');
    }
  }

  /**
   * Buscar análise de hashtag específica
   */
  async getHashtagAnalysis(hashtag: string, platform: string): Promise<HashtagAnalysis> {
    const cacheKey = `hashtag_analysis_${hashtag}_${platform}`;
    
    // Verificar cache
    const cached = hashtagsAnalyticsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get(`/analytics/hashtags/analysis/${hashtag}`, {
        params: { platform }
      });
      const data = response.data;

      // Salvar no cache
      hashtagsAnalyticsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar análise de hashtag:', error);
      throw new Error('Falha ao buscar análise de hashtag');
    }
  }

  /**
   * Buscar sugestões de hashtags
   */
  async getHashtagSuggestions(content: string, platform: string): Promise<HashtagSuggestions> {
    const cacheKey = `hashtag_suggestions_${content}_${platform}`;
    
    // Verificar cache
    const cached = hashtagsAnalyticsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.post('/analytics/hashtags/suggestions', {
        content,
        platform
      });
      const data = response.data;

      // Salvar no cache
      hashtagsAnalyticsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar sugestões de hashtags:', error);
      throw new Error('Falha ao buscar sugestões de hashtags');
    }
  }

  /**
   * Buscar hashtags trending
   */
  async getTrendingHashtags(platform: string, limit: number = 20): Promise<string[]> {
    const cacheKey = `trending_hashtags_${platform}_${limit}`;
    
    // Verificar cache
    const cached = hashtagsAnalyticsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/analytics/hashtags/trending', {
        params: { platform, limit }
      });
      const data = response.data;

      // Salvar no cache
      hashtagsAnalyticsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar hashtags trending:', error);
      throw new Error('Falha ao buscar hashtags trending');
    }
  }

  /**
   * Buscar hashtags relacionadas
   */
  async getRelatedHashtags(hashtag: string, platform: string): Promise<string[]> {
    const cacheKey = `related_hashtags_${hashtag}_${platform}`;
    
    // Verificar cache
    const cached = hashtagsAnalyticsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get(`/analytics/hashtags/related/${hashtag}`, {
        params: { platform }
      });
      const data = response.data;

      // Salvar no cache
      hashtagsAnalyticsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar hashtags relacionadas:', error);
      throw new Error('Falha ao buscar hashtags relacionadas');
    }
  }

  // ===== UTILITÁRIOS =====

  /**
   * Limpar cache de analytics de hashtags
   */
  clearCache(): void {
    hashtagsAnalyticsCache.clear();
  }

  /**
   * Invalidar cache específico
   */
  invalidateCache(pattern: string): void {
    for (const key of hashtagsAnalyticsCache.keys()) {
      if (key.includes(pattern)) {
        hashtagsAnalyticsCache.delete(key);
      }
    }
  }

  /**
   * Calcular score de popularidade
   */
  calculatePopularityScore(usageCount: number, totalHashtags: number): number {
    if (totalHashtags === 0) return 0;
    return (usageCount / totalHashtags) * 100;
  }

  /**
   * Calcular score de engajamento
   */
  calculateEngagementScore(engagement: number, reach: number): number {
    if (reach === 0) return 0;
    return (engagement / reach) * 100;
  }

  /**
   * Determinar nível de competição
   */
  determineCompetitionLevel(usageCount: number): 'low' | 'medium' | 'high' {
    if (usageCount < 1000) return 'low';
    if (usageCount < 10000) return 'medium';
    return 'high';
  }

  /**
   * Sugerir uso de hashtag
   */
  suggestHashtagUsage(popularityScore: number, engagementScore: number): 'high' | 'medium' | 'low' {
    const combinedScore = (popularityScore + engagementScore) / 2;
    
    if (combinedScore >= 70) return 'high';
    if (combinedScore >= 40) return 'medium';
    return 'low';
  }
}

// =========================================
// EXPORTAÇÃO
// =========================================

export const analyticsHashtagsService = new AnalyticsHashtagsService();
export default analyticsHashtagsService;
