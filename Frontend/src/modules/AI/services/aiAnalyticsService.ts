/**
 * Service de Analytics AI
 * @module modules/AI/services/aiAnalyticsService
 * @description
 * Service responsável por gerenciar métricas, relatórios e insights de IA,
 * incluindo analytics por período, métricas em tempo real, tendências,
 * análises de custos, comparações, previsões e exportação de relatórios.
 * @since 1.0.0
 */
import { apiClient } from '@/services';
import { AIAnalytics, AIPeriod, AIResponse } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

/**
 * Classe AIAnalyticsService - Service de Analytics de IA
 * @class
 * @description
 * Service que gerencia todas as operações relacionadas a analytics de IA,
 * fornecendo métricas, insights e análises detalhadas de performance.
 * 
 * @example
 * ```typescript
 * import { aiAnalyticsService } from '@/modules/AI/services/aiAnalyticsService';
 * 
 * // Buscar analytics por período
 * const analytics = await aiAnalyticsService.getAnalytics('week');

 * 
 * // Buscar métricas em tempo real
 * const realTimeMetrics = await aiAnalyticsService.getRealTimeMetrics();

 * 
 * // Buscar tendências
 * const trends = await aiAnalyticsService.getTrends('month');

 * ```
 */
class AIAnalyticsService {
  private api = apiClient;

  /**
   * Obter analytics por período
   */
  async getAnalytics(period: AIPeriod): Promise<AIAnalytics> {
    try {
      const response = await this.api.get('/ai/analytics', {
        params: { period } ) as { data: AIAnalytics};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter analytics: ${getErrorMessage(error)}`);

    } /**
   * Obter métricas em tempo real
   */
  async getRealTimeMetrics(): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/realtime') as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter métricas em tempo real: ${getErrorMessage(error)}`);

    } /**
   * Obter tendências
   */
  async getTrends(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/trends', {
        params: { period } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter tendências: ${getErrorMessage(error)}`);

    } /**
   * Obter insights
   */
  async getInsights(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/insights', {
        params: { period } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter insights: ${getErrorMessage(error)}`);

    } /**
   * Obter relatório detalhado
   */
  async getDetailedReport(period: AIPeriod, format: 'json' | 'pdf' = 'json'): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/report', {
        params: { period, format } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter relatório: ${getErrorMessage(error)}`);

    } /**
   * Obter estatísticas de uso por provedor
   */
  async getProviderUsageStats(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/provider-usage', {
        params: { period } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter estatísticas de provedores: ${getErrorMessage(error)}`);

    } /**
   * Obter estatísticas de custos
   */
  async getCostAnalytics(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/costs', {
        params: { period } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter analytics de custos: ${getErrorMessage(error)}`);

    } /**
   * Obter estatísticas de qualidade
   */
  async getQualityAnalytics(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/quality', {
        params: { period } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter analytics de qualidade: ${getErrorMessage(error)}`);

    } /**
   * Obter estatísticas de performance
   */
  async getPerformanceAnalytics(period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/performance', {
        params: { period } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter analytics de performance: ${getErrorMessage(error)}`);

    } /**
   * Obter comparação entre períodos
   */
  async getPeriodComparison(currentPeriod: AIPeriod, previousPeriod: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/comparison', {
        params: { current_period: currentPeriod, previous_period: previousPeriod } ) as { data: AIResponse};

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter comparação de períodos: ${getErrorMessage(error)}`);

    } /**
   * Obter previsões
   */
  async getForecasts(period: AIPeriod, forecastDays: number = 30): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/forecasts', {
        params: { period, forecast_days: forecastDays } );

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter previsões: ${getErrorMessage(error)}`);

    } /**
   * Obter alertas
   */
  async getAlerts(): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/alerts');

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter alertas: ${getErrorMessage(error)}`);

    } /**
   * Configurar alertas
   */
  async configureAlerts(alertConfig: Record<string, any>): Promise<AIResponse> {
    try {
      const response = await this.api.post('/ai/analytics/alerts/configure', alertConfig);

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao configurar alertas: ${getErrorMessage(error)}`);

    } /**
   * Exportar analytics
   */
  async exportAnalytics(period: AIPeriod, format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<Blob> {
    try {
      const response = await this.api.get('/ai/analytics/export', {
        params: { period, format },
        responseType: 'blob'
      });

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao exportar analytics: ${getErrorMessage(error)}`);

    } /**
   * Obter dashboard data
   */
  async getDashboardData(): Promise<AIResponse> {
    try {
      const response = await this.api.get('/ai/analytics/dashboard');

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter dados do dashboard: ${getErrorMessage(error)}`);

    } /**
   * Obter métricas customizadas
   */
  async getCustomMetrics(metrics: string[], period: AIPeriod): Promise<AIResponse> {
    try {
      const response = await this.api.post('/ai/analytics/custom-metrics', {
        metrics,
        period
      });

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao obter métricas customizadas: ${getErrorMessage(error)}`);

    } /**
   * Criar relatório personalizado
   */
  async createCustomReport(reportConfig: Record<string, any>): Promise<AIResponse> {
    try {
      const response = await this.api.post('/ai/analytics/custom-report', reportConfig);

      return (response as any).data as any;
    } catch (error: unknown) {
      throw new Error(`Erro ao criar relatório personalizado: ${getErrorMessage(error)}`);

    } }

export default new AIAnalyticsService();
