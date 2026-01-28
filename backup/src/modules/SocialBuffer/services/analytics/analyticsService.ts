// =========================================
// ANALYTICS SERVICE ORQUESTRADOR - SOCIAL BUFFER
// =========================================

import { analyticsMetricsService } from './analyticsMetricsService';
import { analyticsHashtagsService } from './analyticsHashtagsService';
import { analyticsReportsService } from './analyticsReportsService';

// Re-exportar tipos dos sub-services
export type {
  AnalyticsParams,
  BasicMetrics,
  PlatformMetrics,
  TimeSeriesMetrics,
  ContentMetrics
} from './analyticsMetricsService';

export type {
  HashtagMetrics,
  HashtagAnalysis,
  HashtagSuggestions
} from './analyticsHashtagsService';

export type {
  LinkMetrics,
  EngagementMetrics,
  AudienceMetrics,
  AnalyticsReport,
  PeriodComparison
} from './analyticsReportsService';

// =========================================
// SERVIÇO ORQUESTRADOR DE ANALYTICS
// =========================================

class AnalyticsService {
  // ===== MÉTRICAS BÁSICAS =====

  /**
   * Buscar métricas básicas
   */
  async getBasicMetrics(params?: any) {
    return analyticsMetricsService.getBasicMetrics(params);
  }

  /**
   * Buscar métricas por plataforma
   */
  async getPlatformMetrics(params?: any) {
    return analyticsMetricsService.getPlatformMetrics(params);
  }

  /**
   * Buscar métricas temporais
   */
  async getTimeSeriesMetrics(params?: any) {
    return analyticsMetricsService.getTimeSeriesMetrics(params);
  }

  /**
   * Buscar métricas de conteúdo
   */
  async getContentMetrics(params?: any) {
    return analyticsMetricsService.getContentMetrics(params);
  }

  // ===== MÉTRICAS DE HASHTAGS =====

  /**
   * Buscar métricas de hashtags
   */
  async getHashtagMetrics(params?: any) {
    return analyticsHashtagsService.getHashtagMetrics(params);
  }

  /**
   * Buscar análise de hashtag
   */
  async getHashtagAnalysis(hashtag: string, platform: string) {
    return analyticsHashtagsService.getHashtagAnalysis(hashtag, platform);
  }

  /**
   * Buscar sugestões de hashtags
   */
  async getHashtagSuggestions(content: string, platform: string) {
    return analyticsHashtagsService.getHashtagSuggestions(content, platform);
  }

  /**
   * Buscar hashtags trending
   */
  async getTrendingHashtags(platform: string, limit?: number) {
    return analyticsHashtagsService.getTrendingHashtags(platform, limit);
  }

  /**
   * Buscar hashtags relacionadas
   */
  async getRelatedHashtags(hashtag: string, platform: string) {
    return analyticsHashtagsService.getRelatedHashtags(hashtag, platform);
  }

  // ===== MÉTRICAS DE LINKS =====

  /**
   * Buscar métricas de links
   */
  async getLinkMetrics(params?: any) {
    return analyticsReportsService.getLinkMetrics(params);
  }

  /**
   * Buscar métricas de engajamento
   */
  async getEngagementMetrics(params?: any) {
    return analyticsReportsService.getEngagementMetrics(params);
  }

  /**
   * Buscar métricas de audiência
   */
  async getAudienceMetrics(params?: any) {
    return analyticsReportsService.getAudienceMetrics(params);
  }

  // ===== RELATÓRIOS =====

  /**
   * Gerar relatório de analytics
   */
  async generateReport(params: any) {
    return analyticsReportsService.generateReport(params);
  }

  /**
   * Buscar relatório por ID
   */
  async getReport(reportId: string) {
    return analyticsReportsService.getReport(reportId);
  }

  /**
   * Listar relatórios
   */
  async listReports(params?: any) {
    return analyticsReportsService.listReports(params);
  }

  /**
   * Exportar relatório
   */
  async exportReport(reportId: string, format?: 'pdf' | 'excel' | 'csv') {
    return analyticsReportsService.exportReport(reportId, format);
  }

  // ===== COMPARAÇÕES =====

  /**
   * Comparar períodos
   */
  async comparePeriods(currentPeriod: any, previousPeriod: any, params?: any) {
    return analyticsReportsService.comparePeriods(currentPeriod, previousPeriod, params);
  }

  // ===== UTILITÁRIOS =====

  /**
   * Limpar cache de analytics
   */
  clearCache(): void {
    analyticsMetricsService.clearCache();
    analyticsHashtagsService.clearCache();
    analyticsReportsService.clearCache();
  }

  /**
   * Invalidar cache específico
   */
  invalidateCache(pattern: string): void {
    analyticsMetricsService.invalidateCache(pattern);
    analyticsHashtagsService.invalidateCache(pattern);
    analyticsReportsService.invalidateCache(pattern);
  }

  /**
   * Calcular taxa de engajamento
   */
  calculateEngagementRate(engagement: number, reach: number): number {
    return analyticsMetricsService.calculateEngagementRate(engagement, reach);
  }

  /**
   * Calcular taxa de alcance
   */
  calculateReachRate(reach: number, followers: number): number {
    return analyticsMetricsService.calculateReachRate(reach, followers);
  }

  /**
   * Calcular taxa de cliques
   */
  calculateClickRate(clicks: number, impressions: number): number {
    return analyticsMetricsService.calculateClickRate(clicks, impressions);
  }

  /**
   * Calcular score de popularidade
   */
  calculatePopularityScore(usageCount: number, totalHashtags: number): number {
    return analyticsHashtagsService.calculatePopularityScore(usageCount, totalHashtags);
  }

  /**
   * Calcular score de engajamento
   */
  calculateEngagementScore(engagement: number, reach: number): number {
    return analyticsHashtagsService.calculateEngagementScore(engagement, reach);
  }

  /**
   * Determinar nível de competição
   */
  determineCompetitionLevel(usageCount: number): 'low' | 'medium' | 'high' {
    return analyticsHashtagsService.determineCompetitionLevel(usageCount);
  }

  /**
   * Sugerir uso de hashtag
   */
  suggestHashtagUsage(popularityScore: number, engagementScore: number): 'high' | 'medium' | 'low' {
    return analyticsHashtagsService.suggestHashtagUsage(popularityScore, engagementScore);
  }

  /**
   * Calcular taxa de crescimento
   */
  calculateGrowthRate(current: number, previous: number): number {
    return analyticsReportsService.calculateGrowthRate(current, previous);
  }
}

// =========================================
// EXPORTAÇÃO
// =========================================

export const analyticsService = new AnalyticsService();
export default analyticsService;
