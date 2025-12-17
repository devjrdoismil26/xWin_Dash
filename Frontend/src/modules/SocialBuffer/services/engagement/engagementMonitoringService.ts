/**
 * Serviço de Monitoramento de Engajamento do SocialBuffer
 *
 * @description
 * Serviço responsável por monitoramento de engajamento incluindo alertas,
 * crescimento, métricas em tempo real e notificações. Gerencia cache.
 *
 * @module modules/SocialBuffer/services/engagement/engagementMonitoringService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { SocialPost } from '../../types';

/**
 * Cache para monitoramento de engajamento
 *
 * @description
 * Cache em memória para monitoramento com TTL de 2 minutos.
 */
const engagementMonitoringCache = new Map<string, { data: unknown; timestamp: number }>();

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

// Interface para alertas de engajamento
export interface EngagementAlert {
  id: string;
  post_id: string;
  type: 'spike' | 'drop' | 'milestone' | 'warning';
  message: string;
  value: number;
  threshold: number;
  timestamp: string;
  is_read: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical'; }

// =========================================
// SERVIÇO DE MONITORAMENTO DE ENGAJAMENTO
// =========================================

class EngagementMonitoringService {
  // ===== MONITORAMENTO =====

  /**
   * Iniciar monitoramento de engajamento
   */
  async startMonitoring(postId: string, settings: Partial<EngagementMonitoring['monitoring_settings']> = {}): Promise<EngagementMonitoring> {
    try {
      const response = await apiClient.post(`/engagement/monitoring/start/${postId}`, {
        monitoring_settings: {
          check_interval: 15, // 15 minutos
          spike_threshold: 50, // 50%
          drop_threshold: 30, // 30%
          milestone_thresholds: [100, 500, 1000, 5000, 10000],
          enable_alerts: true,
          ...settings
        } );

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao iniciar monitoramento:', error);

      throw new Error('Falha ao iniciar monitoramento');

    } /**
   * Parar monitoramento de engajamento
   */
  async stopMonitoring(postId: string): Promise<void> {
    try {
      await apiClient.post(`/engagement/monitoring/stop/${postId}`);

    } catch (error) {
      console.error('Erro ao parar monitoramento:', error);

      throw new Error('Falha ao parar monitoramento');

    } /**
   * Buscar status de monitoramento
   */
  async getMonitoringStatus(postId: string): Promise<EngagementMonitoring> {
    const cacheKey = `monitoring_status_${postId}`;
    
    // Verificar cache
    const cached = engagementMonitoringCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get(`/engagement/monitoring/status/${postId}`);

      const data = (response as any).data;

      // Salvar no cache
      engagementMonitoringCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar status de monitoramento:', error);

      throw new Error('Falha ao buscar status de monitoramento');

    } /**
   * Atualizar configurações de monitoramento
   */
  async updateMonitoringSettings(postId: string, settings: Partial<EngagementMonitoring['monitoring_settings']>): Promise<EngagementMonitoring> {
    try {
      const response = await apiClient.put(`/engagement/monitoring/settings/${postId}`, {
        monitoring_settings: settings
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao atualizar configurações de monitoramento:', error);

      throw new Error('Falha ao atualizar configurações de monitoramento');

    } /**
   * Listar posts em monitoramento
   */
  async listMonitoredPosts(params: {
    account_id?: string;
    platform?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ data: EngagementMonitoring[]; total: number; page: number; limit: number }> {
    try {
      const response = await apiClient.get('/engagement/monitoring/posts', { params });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao listar posts em monitoramento:', error);

      throw new Error('Falha ao listar posts em monitoramento');

    } // ===== ALERTAS =====

  /**
   * Buscar alertas de engajamento
   */
  async getEngagementAlerts(params: {
    post_id?: string;
    type?: string;
    severity?: string;
    is_read?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<{ data: EngagementAlert[]; total: number; page: number; limit: number }> {
    try {
      const response = await apiClient.get('/engagement/alerts', { params });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao buscar alertas de engajamento:', error);

      throw new Error('Falha ao buscar alertas de engajamento');

    } /**
   * Marcar alerta como lido
   */
  async markAlertAsRead(alertId: string): Promise<void> {
    try {
      await apiClient.put(`/engagement/alerts/${alertId}/read`);

    } catch (error) {
      console.error('Erro ao marcar alerta como lido:', error);

      throw new Error('Falha ao marcar alerta como lido');

    } /**
   * Marcar todos os alertas como lidos
   */
  async markAllAlertsAsRead(): Promise<void> {
    try {
      await apiClient.put('/engagement/alerts/read-all');

    } catch (error) {
      console.error('Erro ao marcar todos os alertas como lidos:', error);

      throw new Error('Falha ao marcar todos os alertas como lidos');

    } /**
   * Deletar alerta
   */
  async deleteAlert(alertId: string): Promise<void> {
    try {
      await apiClient.delete(`/engagement/alerts/${alertId}`);

    } catch (error) {
      console.error('Erro ao deletar alerta:', error);

      throw new Error('Falha ao deletar alerta');

    } // ===== UTILITÁRIOS =====

  /**
   * Limpar cache de monitoramento
   */
  clearCache(): void {
    engagementMonitoringCache.clear();

  }

  /**
   * Invalidar cache específico
   */
  invalidateCache(pattern: string): void {
    for (const key of engagementMonitoringCache.keys()) {
      if (key.includes(pattern)) {
        engagementMonitoringCache.delete(key);

      } }

  /**
   * Calcular crescimento de engajamento
   */
  calculateEngagementGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Determinar severidade do alerta
   */
  determineAlertSeverity(change: number, threshold: number): 'low' | 'medium' | 'high' | 'critical' {
    const percentage = Math.abs(change);

    if (percentage >= threshold * 2) return 'critical';
    if (percentage >= threshold * 1.5) return 'high';
    if (percentage >= threshold) return 'medium';
    return 'low';
  }

  /**
   * Verificar se deve gerar alerta
   */
  shouldGenerateAlert(current: number, previous: number, threshold: number): boolean {
    const change = Math.abs(this.calculateEngagementGrowth(current, previous));

    return change >= threshold;
  } // =========================================
// EXPORTAÇÃO
// =========================================

export const engagementMonitoringService = new EngagementMonitoringService();

export default engagementMonitoringService;
