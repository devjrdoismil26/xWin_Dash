/**
 * Serviço de Análise de Engajamento do SocialBuffer
 *
 * @description
 * Serviço responsável por análise profunda de engajamento incluindo scores,
 * insights de audiência, padrões de engajamento e recomendações. Gerencia cache.
 *
 * @module modules/SocialBuffer/services/engagement/engagementAnalysisService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { SocialPost } from '../../types';

/**
 * Cache para análise de engajamento
 *
 * @description
 * Cache em memória para análises com TTL de 5 minutos (análises são mais pesadas).
 */
const engagementAnalysisCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos (análises são mais pesadas)

// Interface para parâmetros de engajamento
export interface EngagementParams {
  date_from?: string;
  date_to?: string;
  account_id?: string;
  platform?: string;
  post_id?: string;
  engagement_type?: 'likes' | 'comments' | 'shares' | 'saves' | 'reactions';
  group_by?: 'hour' | 'day' | 'week' | 'month'; }

// Interface para análise de engajamento
export interface EngagementAnalysis {
  post_id: string;
  post: SocialPost;
  analysis: {
    engagement_score: number;
  // 0-100
    virality_potential: number;
  // 0-100
    audience_resonance: number;
  // 0-100
    optimal_posting_time: boolean;
  content_performance: {
      text_performance: number;
  image_performance: number;
  video_performance: number;
  hashtag_performance: number; };

    engagement_patterns: {
      peak_hours: number[];
      peak_days: string[];
      engagement_velocity: number;
      engagement_decay: number;};

    audience_insights: {
      demographics: Record<string, number>;
      interests: string[];
      behaviors: string[];};
};

  recommendations: {
    content_improvements: string[];
    timing_optimizations: string[];
    audience_targeting: string[];
    engagement_boosters: string[];};

  benchmarks: {
    industry_average: number;
    account_average: number;
    platform_average: number;
    performance_rating: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';};

}

// Interface para insights de engajamento
export interface EngagementInsights {
  total_insights: number;
  insights: Array<{
    type: 'trend' | 'pattern' | 'anomaly' | 'opportunity' | 'warning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  // 0-100
    actionable: boolean;
  recommendations: string[]; }>;
  trends: Array<{
    metric: string;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
    description: string;
    significance: 'high' | 'medium' | 'low';
  }>;
  opportunities: Array<{
    type: 'content' | 'timing' | 'audience' | 'platform';
    title: string;
    description: string;
    potential_impact: number; // 0-100
    effort_required: 'low' | 'medium' | 'high';
    priority: 'high' | 'medium' | 'low';
  }>;
}

// Interface para previsão de engajamento
export interface EngagementForecast {
  post_id: string;
  forecast: {
    predicted_engagement: number;
  confidence_interval: {
      lower: number;
  upper: number; };

    factors: Array<{
      factor: string;
      impact: number; // -100 to 100
      description: string;
    }>;};

  recommendations: {
    optimal_posting_time: string;
    content_suggestions: string[];
    audience_targeting: string[];
    engagement_boosters: string[];};

  risk_assessment: {
    low_engagement_risk: number; // 0-100
    factors: string[];
    mitigation_strategies: string[];};

}

// =========================================
// SERVIÇO DE ANÁLISE DE ENGAJAMENTO
// =========================================

class EngagementAnalysisService {
  // ===== ANÁLISE DE ENGAJAMENTO =====

  /**
   * Analisar engajamento de um post
   */
  async analyzePostEngagement(postId: string): Promise<EngagementAnalysis> {
    const cacheKey = `engagement_analysis_${postId}`;
    
    // Verificar cache
    const cached = engagementAnalysisCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get(`/engagement/analysis/post/${postId}`);

      const data = (response as any).data;

      // Salvar no cache
      engagementAnalysisCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao analisar engajamento do post:', error);

      throw new Error('Falha ao analisar engajamento do post');

    } /**
   * Analisar engajamento de múltiplos posts
   */
  async analyzeMultiplePosts(postIds: string[]): Promise<EngagementAnalysis[]> {
    try {
      const response = await apiClient.post('/engagement/analysis/multiple', {
        post_ids: postIds
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao analisar engajamento de múltiplos posts:', error);

      throw new Error('Falha ao analisar engajamento de múltiplos posts');

    } /**
   * Analisar engajamento por período
   */
  async analyzeEngagementByPeriod(params: EngagementParams): Promise<EngagementAnalysis[]> {
    const cacheKey = `engagement_analysis_period_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = engagementAnalysisCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/engagement/analysis/period', { params });

      const data = (response as any).data;

      // Salvar no cache
      engagementAnalysisCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao analisar engajamento por período:', error);

      throw new Error('Falha ao analisar engajamento por período');

    } // ===== INSIGHTS =====

  /**
   * Buscar insights de engajamento
   */
  async getEngagementInsights(params: EngagementParams): Promise<EngagementInsights> {
    const cacheKey = `engagement_insights_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = engagementAnalysisCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/engagement/insights', { params });

      const data = (response as any).data;

      // Salvar no cache
      engagementAnalysisCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar insights de engajamento:', error);

      throw new Error('Falha ao buscar insights de engajamento');

    } /**
   * Buscar insights específicos por tipo
   */
  async getInsightsByType(type: 'trend' | 'pattern' | 'anomaly' | 'opportunity' | 'warning', params: EngagementParams): Promise<EngagementInsights['insights']> {
    try {
      const response = await apiClient.get(`/engagement/insights/${type}`, { params });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao buscar insights por tipo:', error);

      throw new Error('Falha ao buscar insights por tipo');

    } // ===== PREVISÕES =====

  /**
   * Prever engajamento de um post
   */
  async forecastPostEngagement(postId: string): Promise<EngagementForecast> {
    const cacheKey = `engagement_forecast_${postId}`;
    
    // Verificar cache
    const cached = engagementAnalysisCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get(`/engagement/forecast/post/${postId}`);

      const data = (response as any).data;

      // Salvar no cache
      engagementAnalysisCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao prever engajamento do post:', error);

      throw new Error('Falha ao prever engajamento do post');

    } /**
   * Prever engajamento baseado em conteúdo
   */
  async forecastEngagementByContent(content: {
    text?: string;
    hashtags?: string[];
    media_type?: 'image' | 'video' | 'text';
    platform: string;
  }): Promise<EngagementForecast> {
    try {
      const response = await apiClient.post('/engagement/forecast/content', content);

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao prever engajamento por conteúdo:', error);

      throw new Error('Falha ao prever engajamento por conteúdo');

    } // ===== UTILITÁRIOS =====

  /**
   * Limpar cache de análise
   */
  clearCache(): void {
    engagementAnalysisCache.clear();

  }

  /**
   * Invalidar cache específico
   */
  invalidateCache(pattern: string): void {
    for (const key of engagementAnalysisCache.keys()) {
      if (key.includes(pattern)) {
        engagementAnalysisCache.delete(key);

      } }

  /**
   * Calcular score de engajamento
   */
  calculateEngagementScore(engagement: number, reach: number, followers: number): number {
    if (reach === 0 || followers === 0) return 0;
    
    const engagementRate = (engagement / reach) * 100;
    const reachRate = (reach / followers) * 100;
    
    // Score combinado (0-100)
    return Math.min(100, (engagementRate * 0.7) + (reachRate * 0.3));

  }

  /**
   * Calcular potencial de viralidade
   */
  calculateViralityPotential(shares: number, comments: number, totalEngagement: number): number {
    if (totalEngagement === 0) return 0;
    
    const shareRate = (shares / totalEngagement) * 100;
    const commentRate = (comments / totalEngagement) * 100;
    
    // Potencial de viralidade (0-100)
    return Math.min(100, (shareRate * 0.6) + (commentRate * 0.4));

  }

  /**
   * Calcular ressonância da audiência
   */
  calculateAudienceResonance(engagement: number, reach: number, impressions: number): number {
    if (impressions === 0) return 0;
    
    const engagementRate = (engagement / impressions) * 100;
    const reachRate = (reach / impressions) * 100;
    
    // Ressonância da audiência (0-100)
    return Math.min(100, (engagementRate * 0.5) + (reachRate * 0.5));

  }

  /**
   * Determinar classificação de performance
   */
  determinePerformanceRating(score: number): 'excellent' | 'good' | 'average' | 'below_average' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    if (score >= 20) return 'below_average';
    return 'poor';
  } // =========================================
// EXPORTAÇÃO
// =========================================

export const engagementAnalysisService = new EngagementAnalysisService();

export default engagementAnalysisService;
