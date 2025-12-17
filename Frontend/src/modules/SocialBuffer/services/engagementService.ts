/**
 * Serviço de Engajamento do SocialBuffer
 *
 * @description
 * Serviço responsável por todas as operações relacionadas a engajamento.
 * Gerencia dados de engajamento, monitoramento, análise e cache.
 *
 * @module modules/SocialBuffer/services/engagementService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { SocialPost, SocialAccount, SocialSchedule } from '../types/socialTypes';

/**
 * Cache para engajamento
 *
 * @description
 * Cache em memória para engajamento com TTL de 2 minutos.
 */
const engagementCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 2 * 60 * 1000; // 2 minutos (engajamento muda muito frequentemente)

// Interface para parâmetros de engajamento
export interface EngagementParams {
  date_from?: string;
  date_to?: string;
  account_id?: string;
  platform?: string;
  post_id?: string;
  engagement_type?: 'likes' | 'comments' | 'shares' | 'saves' | 'reactions';
  group_by?: 'hour' | 'day' | 'week' | 'month'; }

// Interface para dados de engajamento
export interface EngagementData {
  post_id: string;
  post: SocialPost;
  engagement: {
    likes: number;
  comments: number;
  shares: number;
  saves: number;
  reactions: number;
  total: number;
  [key: string]: unknown; };

  engagement_rate: number;
  reach: number;
  impressions: number;
  clicks: number;
  last_updated: string;
}

// Interface para monitoramento de engajamento
export interface EngagementMonitoring {
  post_id: string;
  post: SocialPost;
  current_engagement: EngagementData;
  previous_engagement?: EngagementData;
  growth: {
    likes_growth: number;
  comments_growth: number;
  shares_growth: number;
  total_growth: number;
  engagement_rate_growth: number; };

  alerts: Array<{
    type: 'spike' | 'drop' | 'milestone' | 'warning';
    message: string;
    value: number;
    threshold: number;
    timestamp: string;
  }>;
  is_monitoring: boolean;
  monitoring_settings: {
    check_interval: number; // em minutos
    spike_threshold: number; // porcentagem
    drop_threshold: number; // porcentagem
    milestone_thresholds: number[];
    enable_alerts: boolean;};

}

// Interface para interações
export interface Interaction {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  type: 'like' | 'comment' | 'share' | 'save' | 'reaction';
  content?: string;
  // para comentários
  reaction_type?: string;
  // para reações específicas
  timestamp: string;
  platform: string;
  metadata?: {
    location?: string;
  device?: string;
  browser?: string; };

}

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

    sentiment_analysis: {
      positive: number;
      neutral: number;
      negative: number;
      overall_sentiment: 'positive' | 'neutral' | 'negative';};

    top_engagers: Array<{
      user_id: string;
      user_name: string;
      engagement_count: number;
      engagement_types: string[];
    }>;
    engagement_patterns: Array<{
      time_period: string;
      engagement_level: 'low' | 'medium' | 'high';
      dominant_type: string;
    }>;};

  recommendations: string[];
  insights: string[];
}

// Interface para métricas de engajamento em tempo real
export interface RealTimeEngagement {
  post_id: string;
  post: SocialPost;
  current_metrics: {
    likes: number;
  comments: number;
  shares: number;
  saves: number;
  reactions: number;
  total: number; };

  recent_activity: Array<{
    type: string;
    count: number;
    timestamp: string;
  }>;
  engagement_velocity: {
    current_rate: number; // engajamentos por minuto
    peak_rate: number;
    average_rate: number;
    trend: 'increasing' | 'decreasing' | 'stable';};

  live_interactions: Interaction[];
  is_trending: boolean;
  trending_score: number;
}

// Interface para campanhas de engajamento
export interface EngagementCampaign {
  id: string;
  name: string;
  description: string;
  posts: string[];
  // IDs dos posts
  start_date: string;
  end_date: string;
  target_engagement: number;
  current_engagement: number;
  engagement_rate: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  strategies: Array<{
    type: 'boost' | 'cross_promote' | 'influencer' | 'paid' | 'organic';
  description: string;
  budget?: number;
  status: 'active' | 'paused' | 'completed'; }>;
  results: {
    total_engagement: number;
    engagement_growth: number;
    reach_growth: number;
    cost_per_engagement: number;
    roi: number;};

  created_at: string;
  updated_at: string;
}

// Interface para otimização de engajamento
export interface EngagementOptimization {
  post_id: string;
  post: SocialPost;
  current_performance: EngagementData;
  optimization_suggestions: Array<{
    type: 'timing' | 'content' | 'hashtags' | 'audience' | 'format';
  priority: 'high' | 'medium' | 'low';
  description: string;
  expected_improvement: number;
  // porcentagem
    implementation: string; }>;
  optimal_timing: {
    best_hours: number[];
    best_days: string[];
    timezone: string;
    reasoning: string;};

  content_recommendations: {
    suggested_hashtags: string[];
    suggested_mentions: string[];
    content_length: 'short' | 'medium' | 'long';
    media_suggestions: string[];};

  audience_insights: {
    most_engaged_segments: string[];
    engagement_demographics: {
      age_groups: Array<{ age_group: string; engagement_rate: number }>;
      genders: Array<{ gender: string; engagement_rate: number }>;
      locations: Array<{ location: string; engagement_rate: number }>;};
};

}

/**
 * Service para engajamento e monitoramento do SocialBuffer
 * Responsável por monitoramento, análise e otimização de engajamento
 */
class EngagementService {
  private baseUrl = '/api/social-buffer/engagement';

  /**
   * Obtém dados de engajamento de um post
   */
  async getPostEngagement(postId: string): Promise<EngagementData> {
    try {
      const cacheKey = `post_engagement_${postId}`;
      const cached = engagementCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/posts/${postId}`);

      // Cache do resultado
      engagementCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao obter engajamento do post ${postId}:`, error);

      throw new Error('Falha ao carregar engajamento do post');

    } /**
   * Obtém engajamento de múltiplos posts
   */
  async getMultiplePostsEngagement(postIds: string[]): Promise<EngagementData[]> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/posts/batch`, {
        post_ids: postIds
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter engajamento de múltiplos posts:', error);

      throw new Error('Falha ao carregar engajamento dos posts');

    } /**
   * Inicia monitoramento de engajamento
   */
  async startEngagementMonitoring(
    postId: string,
    settings: EngagementMonitoring['monitoring_settings']
  ): Promise<EngagementMonitoring> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/monitoring/start`, {
        post_id: postId,
        settings
      });

      // Limpar cache relacionado
      this.clearEngagementCache();

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao iniciar monitoramento do post ${postId}:`, error);

      throw new Error('Falha ao iniciar monitoramento');

    } /**
   * Para monitoramento de engajamento
   */
  async stopEngagementMonitoring(postId: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/monitoring/stop`, {
        post_id: postId
      });

      // Limpar cache relacionado
      this.clearEngagementCache();

    } catch (error) {
      console.error(`Erro ao parar monitoramento do post ${postId}:`, error);

      throw new Error('Falha ao parar monitoramento');

    } /**
   * Obtém status de monitoramento
   */
  async getMonitoringStatus(postId: string): Promise<EngagementMonitoring> {
    try {
      const cacheKey = `monitoring_status_${postId}`;
      const cached = engagementCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/monitoring/${postId}`);

      // Cache do resultado
      engagementCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao obter status de monitoramento do post ${postId}:`, error);

      throw new Error('Falha ao carregar status de monitoramento');

    } /**
   * Obtém interações de um post
   */
  async getPostInteractions(
    postId: string,
    params: EngagementParams ={  }
  ): Promise<Interaction[]> {
    try {
      const cacheKey = `post_interactions_${postId}_${JSON.stringify(params)}`;
      const cached = engagementCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/posts/${postId}/interactions`, {
        params
      });

      // Cache do resultado
      engagementCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao obter interações do post ${postId}:`, error);

      throw new Error('Falha ao carregar interações do post');

    } /**
   * Analisa engajamento de um post
   */
  async analyzePostEngagement(postId: string): Promise<EngagementAnalysis> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/posts/${postId}/analyze`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao analisar engajamento do post ${postId}:`, error);

      throw new Error('Falha ao analisar engajamento do post');

    } /**
   * Obtém engajamento em tempo real
   */
  async getRealTimeEngagement(postId: string): Promise<RealTimeEngagement> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/realtime/${postId}`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao obter engajamento em tempo real do post ${postId}:`, error);

      throw new Error('Falha ao obter engajamento em tempo real');

    } /**
   * Cria campanha de engajamento
   */
  async createEngagementCampaign(data: Omit<EngagementCampaign, 'id' | 'created_at' | 'updated_at'>): Promise<EngagementCampaign> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/campaigns`, data);

      // Limpar cache relacionado
      this.clearEngagementCache();

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao criar campanha de engajamento:', error);

      throw new Error('Falha ao criar campanha de engajamento');

    } /**
   * Obtém campanhas de engajamento
   */
  async getEngagementCampaigns(): Promise<EngagementCampaign[]> {
    try {
      const cacheKey = 'engagement_campaigns';
      const cached = engagementCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/campaigns`);

      // Cache do resultado
      engagementCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter campanhas de engajamento:', error);

      throw new Error('Falha ao carregar campanhas de engajamento');

    } /**
   * Atualiza campanha de engajamento
   */
  async updateEngagementCampaign(
    campaignId: string,
    data: Partial<EngagementCampaign />
  ): Promise<EngagementCampaign> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/campaigns/${campaignId}`, data);

      // Limpar cache relacionado
      this.clearEngagementCache();

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao atualizar campanha ${campaignId}:`, error);

      throw new Error('Falha ao atualizar campanha de engajamento');

    } /**
   * Remove campanha de engajamento
   */
  async deleteEngagementCampaign(campaignId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/campaigns/${campaignId}`);

      // Limpar cache relacionado
      this.clearEngagementCache();

    } catch (error) {
      console.error(`Erro ao remover campanha ${campaignId}:`, error);

      throw new Error('Falha ao remover campanha de engajamento');

    } /**
   * Obtém sugestões de otimização de engajamento
   */
  async getEngagementOptimization(postId: string): Promise<EngagementOptimization> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/optimization/${postId}`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao obter otimização de engajamento do post ${postId}:`, error);

      throw new Error('Falha ao obter otimização de engajamento');

    } /**
   * Aplica otimizações de engajamento
   */
  async applyEngagementOptimization(
    postId: string,
    optimizations: string[]
  ): Promise<{ success: boolean; applied_optimizations: string[]; results: unknown }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/optimization/${postId}/apply`, {
        optimizations
      });

      // Limpar cache relacionado
      this.clearEngagementCache();

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao aplicar otimizações do post ${postId}:`, error);

      throw new Error('Falha ao aplicar otimizações de engajamento');

    } /**
   * Obtém métricas de engajamento por período
   */
  async getEngagementMetrics(params: EngagementParams = {}): Promise<{
    total_engagement: number;
    engagement_rate: number;
    engagement_by_type: {
      likes: number;
      comments: number;
      shares: number;
      saves: number;
      reactions: number;};

    engagement_trends: Array<{
      date: string;
      engagement: number;
      engagement_rate: number;
    }>;
    top_performing_posts: Array<{
      post: SocialPost;
      engagement: number;
      engagement_rate: number;
    }>;
    engagement_by_platform: Array<{
      platform: string;
      engagement: number;
      engagement_rate: number;
    }>;
  }> {
    try {
      const cacheKey = `engagement_metrics_${JSON.stringify(params)}`;
      const cached = engagementCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/metrics`, { params });

      // Cache do resultado
      engagementCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter métricas de engajamento:', error);

      throw new Error('Falha ao carregar métricas de engajamento');

    } /**
   * Obtém alertas de engajamento
   */
  async getEngagementAlerts(): Promise<Array<{
    id: string;
    post_id: string;
    post: SocialPost;
    type: 'spike' | 'drop' | 'milestone' | 'warning';
    message: string;
    value: number;
    threshold: number;
    timestamp: string;
    is_read: boolean;
  }>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/alerts`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter alertas de engajamento:', error);

      throw new Error('Falha ao carregar alertas de engajamento');

    } /**
   * Marca alerta como lido
   */
  async markAlertAsRead(alertId: string): Promise<void> {
    try {
      await apiClient.put(`${this.baseUrl}/alerts/${alertId}/read`);

    } catch (error) {
      console.error(`Erro ao marcar alerta ${alertId} como lido:`, error);

      throw new Error('Falha ao marcar alerta como lido');

    } /**
   * Limpa cache de engajamento
   */
  private clearEngagementCache(): void {
    engagementCache.clear();

  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of engagementCache.keys()) {
        if (key.includes(pattern)) {
          engagementCache.delete(key);

        } } else {
      engagementCache.clear();

    } /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: engagementCache.size,
      keys: Array.from(engagementCache.keys())};

  } // Instância singleton
export const engagementService = new EngagementService();

export default engagementService;
