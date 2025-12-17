/**
 * Service de API de Analytics
 * @module modules/Analytics/services/analyticsApiService
 * @description
 * Service responsável por gerenciar chamadas à API de analytics, incluindo
 * obtenção de dados, métricas, relatórios e dashboards.
 * @since 1.0.0
 */

import { apiClient } from '@/services';

/**
 * Interface AnalyticsData - Dados de Analytics
 * @interface AnalyticsData
 * @description
 * Interface que representa dados de analytics retornados pela API.
 * @property {string} id - ID único do dado
 * @property {string} name - Nome do dado
 * @property {number} value - Valor numérico
 * @property {string} timestamp - Data/hora em formato ISO 8601
 */
interface AnalyticsData {
  id: string;
  name: string;
  value: number;
  timestamp: string;
  [key: string]: unknown; }

/**
 * Interface AnalyticsResponse - Resposta da API de Analytics
 * @interface AnalyticsResponse
 * @description
 * Interface que representa a resposta padrão da API de analytics.
 * @property {boolean} success - Se a requisição foi bem-sucedida
 * @property {T} [data] - Dados retornados (opcional)
 * @property {string} [error] - Mensagem de erro (opcional)
 * @template T - Tipo dos dados retornados (padrão: AnalyticsData)
 */
interface AnalyticsResponse<T = AnalyticsData> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Classe AnalyticsApiService - Service de API de Analytics
 * @class
 * @description
 * Service responsável por gerenciar chamadas à API de analytics, incluindo
 * obtenção de dados, métricas, relatórios e dashboards.
 *
 * @example
 * ```typescript
 * import analyticsApiService from '@/modules/Analytics/services/analyticsApiService';
 *
 * // Obter dados de analytics
 * const data = await analyticsApiService.getAnalyticsData('7d');

 *
 * // Obter métricas
 * const metrics = await analyticsApiService.getMetrics();

 * ```
 */
class AnalyticsApiService {
  private api = apiClient;

  /**
   * Obter dados de analytics
   * @description
   * Busca dados de analytics para um período específico.
   *
   * @param {string} [period='7d'] - Período dos dados (ex: '7d', '30d', '1y') (opcional, padrão: '7d')
   * @returns {Promise<AnalyticsResponse<AnalyticsData[]>>} Resposta com dados de analytics
   *
   * @example
   * ```typescript
   * const response = await analyticsApiService.getAnalyticsData('30d');

   * if (response.success) {
   *   
   * }
   * ```
   */
  async getAnalyticsData(period: string = '7d'): Promise<AnalyticsResponse<AnalyticsData[]>> {
    try {
      const response = await this.api.get('/analytics/data', {
        params: { period } ) as { data: AnalyticsResponse<AnalyticsData[]>};

      return (response as any).data as any;
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao carregar dados de analytics'};

    } async getMetrics(): Promise<AnalyticsResponse<Record<string, any>>> {
    try {
      const response = await this.api.get('/analytics/metrics') as { data: AnalyticsResponse<Record<string, any>>};

      return (response as any).data as any;
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao carregar métricas'};

    } /**
   * Obter relatórios de analytics
   * @description
   * Busca lista de relatórios de analytics disponíveis.
   *
   * @returns {Promise<AnalyticsResponse<Record<string, any>[]>>} Resposta com lista de relatórios
   *
   * @example
   * ```typescript
   * const response = await analyticsApiService.getReports();

   * if (response.success) {
   *   
   * }
   * ```
   */
  async getReports(): Promise<AnalyticsResponse<Record<string, any>[]>> {
    try {
      const response = await this.api.get('/analytics/reports') as { data: AnalyticsResponse<Record<string, any>[]>};

      return (response as any).data as any;
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao carregar relatórios'};

    } }

const instance = new AnalyticsApiService();

export const analyticsApiService = instance;
export default instance;