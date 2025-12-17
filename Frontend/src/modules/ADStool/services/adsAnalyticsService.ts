/**
 * Service de Analytics do módulo ADStool
 * @module modules/ADStool/services/adsAnalyticsService
 * @description
 * Service responsável por analytics e relatórios de anúncios, incluindo
 * performance de campanhas, contas e criativos, métricas em tempo real,
 * relatórios personalizados, ROI, conversões, demografia, dispositivos,
 * localização, horários, palavras-chave, competidores, insights de otimização,
 * tendências, audiência, exportação de relatórios, agendamento e alertas.
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { AdsAnalytics, AdsPerformance, AdsResponse } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

/**
 * Classe AdsAnalyticsService - Service de Analytics
 * @class
 * @description
 * Service que gerencia todas as operações relacionadas a analytics e relatórios,
 * fornecendo métricas, insights e análises detalhadas de performance.
 * 
 * @example
 * ```typescript
 * import { adsAnalyticsService } from '@/modules/ADStool/services/adsAnalyticsService';
 * 
 * // Buscar analytics gerais
 * const analytics = await adsAnalyticsService.getAnalytics();

 * 
 * // Buscar performance de campanha
 * const campaignPerf = await adsAnalyticsService.getCampaignPerformance('campaign123', 'last_7_days');

 * 
 * // Buscar relatório de ROI
 * const roiReport = await adsAnalyticsService.getROIReport();

 * ```
 */
class AdsAnalyticsService {
  private api = apiClient;

  /**
   * Busca analytics gerais
   * @param {Record<string, any>} [filters] - Filtros opcionais para os analytics
   * @returns {Promise<AdsResponse>} Resposta com analytics gerais ou erro
   */

  async getAnalytics(filters?: Record<string, any>): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/analytics', { params: filters }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async getAnalyticsSummary(params?: string): Promise<any> {
    try {
      const response = await this.apiClient.get('/ads/analytics/summary', { params });

      return response.data as any;
    } catch (error) {
      console.error('getAnalyticsSummary error:', error);

      throw error;
    } async getAnalyticsOverview(params?: string): Promise<any> {
    try {
      const response = await this.apiClient.get('/ads/analytics/overview', { params });

      return response.data as any;
    } catch (error) {
      console.error('getAnalyticsOverview error:', error);

      throw error;
    } async getCampaignAnalytics(campaignId: number): Promise<any> {
    try {
      const response = await this.apiClient.get(`/ads/campaigns/${campaignId}/analytics`);

      return response.data as any;
    } catch (error) {
      console.error('getCampaignAnalytics error:', error);

      throw error;
    } async getAccountAnalytics(accountId: number): Promise<any> {
    try {
      const response = await this.apiClient.get(`/ads/accounts/${accountId}/analytics`);

      return response.data as any;
    } catch (error) {
      console.error('getAccountAnalytics error:', error);

      throw error;
    } async getCreativeAnalytics(creativeId: number): Promise<any> {
    try {
      const response = await this.apiClient.get(`/ads/creatives/${creativeId}/analytics`);

      return response.data as any;
    } catch (error) {
      console.error('getCreativeAnalytics error:', error);

      throw error;
    } async getKeywordInsights(params?: string): Promise<any> {
    try {
      const response = await this.apiClient.get('/ads/keywords/insights', { params });

      return response.data as any;
    } catch (error) {
      console.error('getKeywordInsights error:', error);

      throw error;
    } async getPerformanceInsights(params?: string): Promise<any> {
    try {
      const response = await this.apiClient.get('/ads/performance/insights', { params });

      return response.data as any;
    } catch (error) {
      console.error('getPerformanceInsights error:', error);

      throw error;
    } async generateReport(params: unknown): Promise<any> {
    try {
      const response = await this.apiClient.post('/ads/reports/generate', params);

      return response.data as any;
    } catch (error) {
      console.error('generateReport error:', error);

      throw error;
    } async getReportStatus(reportId: number): Promise<any> {
    try {
      const response = await this.apiClient.get(`/ads/reports/${reportId}/status`);

      return response.data as any;
    } catch (error) {
      console.error('getReportStatus error:', error);

      throw error;
    } async downloadReport(reportId: number): Promise<any> {
    try {
      const response = await this.apiClient.get(`/ads/reports/${reportId}/download`);

      return response.data as any;
    } catch (error) {
      console.error('downloadReport error:', error);

      throw error;
    } async getAvailableReports(): Promise<any> {
    try {
      const response = await this.apiClient.get('/ads/reports');

      return response.data as any;
    } catch (error) {
      console.error('getAvailableReports error:', error);

      throw error;
    } async compareCampaigns(campaignIds: number[]): Promise<any> {
    try {
      const response = await this.apiClient.post('/ads/campaigns/compare', { campaignIds });

      return response.data as any;
    } catch (error) {
      console.error('compareCampaigns error:', error);

      throw error;
    } async compareAccounts(accountIds: number[]): Promise<any> {
    try {
      const response = await this.apiClient.post('/ads/accounts/compare', { accountIds });

      return response.data as any;
    } catch (error) {
      console.error('compareAccounts error:', error);

      throw error;
    } async compareTimePeriods(params: unknown): Promise<any> {
    try {
      const response = await this.apiClient.post('/ads/analytics/compare-periods', params);

      return response.data as any;
    } catch (error) {
      console.error('compareTimePeriods error:', error);

      throw error;
    } }