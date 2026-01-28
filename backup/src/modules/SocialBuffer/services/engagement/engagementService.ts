// =========================================
// ENGAGEMENT SERVICE ORQUESTRADOR - SOCIAL BUFFER
// =========================================

import { engagementMonitoringService } from './engagementMonitoringService';
import { engagementInteractionsService } from './engagementInteractionsService';
import { engagementAnalysisService } from './engagementAnalysisService';

// Re-exportar tipos dos sub-services
export type {
  EngagementParams,
  EngagementData,
  EngagementMonitoring,
  EngagementAlert
} from './engagementMonitoringService';

export type {
  Interaction,
  Comment,
  Reaction,
  Share
} from './engagementInteractionsService';

export type {
  EngagementAnalysis,
  EngagementInsights,
  EngagementForecast
} from './engagementAnalysisService';

// =========================================
// SERVIÇO ORQUESTRADOR DE ENGAJAMENTO
// =========================================

class EngagementService {
  // ===== MONITORAMENTO =====

  /**
   * Iniciar monitoramento de engajamento
   */
  async startMonitoring(postId: string, settings?: any) {
    return engagementMonitoringService.startMonitoring(postId, settings);
  }

  /**
   * Parar monitoramento de engajamento
   */
  async stopMonitoring(postId: string) {
    return engagementMonitoringService.stopMonitoring(postId);
  }

  /**
   * Buscar status de monitoramento
   */
  async getMonitoringStatus(postId: string) {
    return engagementMonitoringService.getMonitoringStatus(postId);
  }

  /**
   * Atualizar configurações de monitoramento
   */
  async updateMonitoringSettings(postId: string, settings: any) {
    return engagementMonitoringService.updateMonitoringSettings(postId, settings);
  }

  /**
   * Listar posts em monitoramento
   */
  async listMonitoredPosts(params?: any) {
    return engagementMonitoringService.listMonitoredPosts(params);
  }

  // ===== ALERTAS =====

  /**
   * Buscar alertas de engajamento
   */
  async getEngagementAlerts(params?: any) {
    return engagementMonitoringService.getEngagementAlerts(params);
  }

  /**
   * Marcar alerta como lido
   */
  async markAlertAsRead(alertId: string) {
    return engagementMonitoringService.markAlertAsRead(alertId);
  }

  /**
   * Marcar todos os alertas como lidos
   */
  async markAllAlertsAsRead() {
    return engagementMonitoringService.markAllAlertsAsRead();
  }

  /**
   * Deletar alerta
   */
  async deleteAlert(alertId: string) {
    return engagementMonitoringService.deleteAlert(alertId);
  }

  // ===== INTERAÇÕES =====

  /**
   * Buscar interações de um post
   */
  async getPostInteractions(postId: string, params?: any) {
    return engagementInteractionsService.getPostInteractions(postId, params);
  }

  /**
   * Buscar todas as interações
   */
  async getAllInteractions(params?: any) {
    return engagementInteractionsService.getAllInteractions(params);
  }

  // ===== COMENTÁRIOS =====

  /**
   * Buscar comentários de um post
   */
  async getPostComments(postId: string, params?: any) {
    return engagementInteractionsService.getPostComments(postId, params);
  }

  /**
   * Responder a um comentário
   */
  async replyToComment(commentId: string, content: string) {
    return engagementInteractionsService.replyToComment(commentId, content);
  }

  /**
   * Curtir um comentário
   */
  async likeComment(commentId: string) {
    return engagementInteractionsService.likeComment(commentId);
  }

  /**
   * Deletar comentário
   */
  async deleteComment(commentId: string) {
    return engagementInteractionsService.deleteComment(commentId);
  }

  // ===== REAÇÕES =====

  /**
   * Buscar reações de um post
   */
  async getPostReactions(postId: string) {
    return engagementInteractionsService.getPostReactions(postId);
  }

  /**
   * Adicionar reação a um post
   */
  async addReaction(postId: string, reactionType: string) {
    return engagementInteractionsService.addReaction(postId, reactionType);
  }

  /**
   * Remover reação de um post
   */
  async removeReaction(postId: string, reactionType: string) {
    return engagementInteractionsService.removeReaction(postId, reactionType);
  }

  // ===== COMPARTILHAMENTOS =====

  /**
   * Buscar compartilhamentos de um post
   */
  async getPostShares(postId: string, params?: any) {
    return engagementInteractionsService.getPostShares(postId, params);
  }

  /**
   * Compartilhar um post
   */
  async sharePost(postId: string, shareType: string, message?: string) {
    return engagementInteractionsService.sharePost(postId, shareType, message);
  }

  // ===== ANÁLISE =====

  /**
   * Analisar engajamento de um post
   */
  async analyzePostEngagement(postId: string) {
    return engagementAnalysisService.analyzePostEngagement(postId);
  }

  /**
   * Analisar engajamento de múltiplos posts
   */
  async analyzeMultiplePosts(postIds: string[]) {
    return engagementAnalysisService.analyzeMultiplePosts(postIds);
  }

  /**
   * Analisar engajamento por período
   */
  async analyzeEngagementByPeriod(params: any) {
    return engagementAnalysisService.analyzeEngagementByPeriod(params);
  }

  // ===== INSIGHTS =====

  /**
   * Buscar insights de engajamento
   */
  async getEngagementInsights(params: any) {
    return engagementAnalysisService.getEngagementInsights(params);
  }

  /**
   * Buscar insights específicos por tipo
   */
  async getInsightsByType(type: string, params: any) {
    return engagementAnalysisService.getInsightsByType(type as any, params);
  }

  // ===== PREVISÕES =====

  /**
   * Prever engajamento de um post
   */
  async forecastPostEngagement(postId: string) {
    return engagementAnalysisService.forecastPostEngagement(postId);
  }

  /**
   * Prever engajamento baseado em conteúdo
   */
  async forecastEngagementByContent(content: any) {
    return engagementAnalysisService.forecastEngagementByContent(content);
  }

  // ===== UTILITÁRIOS =====

  /**
   * Limpar cache de engajamento
   */
  clearCache(): void {
    engagementMonitoringService.clearCache();
    engagementInteractionsService.clearCache();
    engagementAnalysisService.clearCache();
  }

  /**
   * Invalidar cache específico
   */
  invalidateCache(pattern: string): void {
    engagementMonitoringService.invalidateCache(pattern);
    engagementInteractionsService.invalidateCache(pattern);
    engagementAnalysisService.invalidateCache(pattern);
  }

  /**
   * Calcular crescimento de engajamento
   */
  calculateEngagementGrowth(current: number, previous: number): number {
    return engagementMonitoringService.calculateEngagementGrowth(current, previous);
  }

  /**
   * Determinar severidade do alerta
   */
  determineAlertSeverity(change: number, threshold: number): 'low' | 'medium' | 'high' | 'critical' {
    return engagementMonitoringService.determineAlertSeverity(change, threshold);
  }

  /**
   * Verificar se deve gerar alerta
   */
  shouldGenerateAlert(current: number, previous: number, threshold: number): boolean {
    return engagementMonitoringService.shouldGenerateAlert(current, previous, threshold);
  }

  /**
   * Analisar sentimento de comentário
   */
  analyzeCommentSentiment(content: string): 'positive' | 'neutral' | 'negative' {
    return engagementInteractionsService.analyzeCommentSentiment(content);
  }

  /**
   * Filtrar interações por tipo
   */
  filterInteractionsByType(interactions: any[], type: string): any[] {
    return engagementInteractionsService.filterInteractionsByType(interactions, type);
  }

  /**
   * Agrupar interações por usuário
   */
  groupInteractionsByUser(interactions: any[]): Record<string, any[]> {
    return engagementInteractionsService.groupInteractionsByUser(interactions);
  }

  /**
   * Calcular score de engajamento
   */
  calculateEngagementScore(engagement: number, reach: number, followers: number): number {
    return engagementAnalysisService.calculateEngagementScore(engagement, reach, followers);
  }

  /**
   * Calcular potencial de viralidade
   */
  calculateViralityPotential(shares: number, comments: number, totalEngagement: number): number {
    return engagementAnalysisService.calculateViralityPotential(shares, comments, totalEngagement);
  }

  /**
   * Calcular ressonância da audiência
   */
  calculateAudienceResonance(engagement: number, reach: number, impressions: number): number {
    return engagementAnalysisService.calculateAudienceResonance(engagement, reach, impressions);
  }

  /**
   * Determinar classificação de performance
   */
  determinePerformanceRating(score: number): 'excellent' | 'good' | 'average' | 'below_average' | 'poor' {
    return engagementAnalysisService.determinePerformanceRating(score);
  }
}

// =========================================
// EXPORTAÇÃO
// =========================================

export const engagementService = new EngagementService();
export default engagementService;
