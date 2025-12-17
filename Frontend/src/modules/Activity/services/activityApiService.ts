/**
 * Serviço de API para o módulo Activity
 *
 * @description
 * Responsável por todas as chamadas HTTP para a API do módulo Activity.
 * Gerencia requisições de logs, estatísticas e exportação.
 *
 * @module modules/Activity/services/activityApiService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { ActivityLog, ActivityStats, ActivityFilters, ActivityResponse, UserActivityStats, SystemHealthStats, RealTimeLog } from '../types';

class ActivityApiService {
  private baseUrl = '/api/v1/activity/logs';

  /**
   * Busca logs de atividade
   */
  async getLogs(filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);

      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);

      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);

      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);

        if (dateRange.from) params.append('date_from', dateRange.from);

        if (dateRange.to) params.append('date_to', dateRange.to);

      }
      if (filters.page) params.append('page', filters.page.toString());

      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const result = await apiClient.get<{ data: ActivityLog[]; meta: Record<string, any> }>(this.baseUrl, { params: Object.fromEntries(params) });

      return {
        success: true,
        data: result.data,
        pagination: result.meta};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca log específico por ID
   */
  async getLogById(logId: string): Promise<ActivityResponse> {
    try {
      const result = await apiClient.get<{ data: ActivityLog }>(`${this.baseUrl}/${logId}`);

      return {
        success: true,
        data: result.data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca estatísticas de logs
   */
  async getLogStats(filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);

      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);

      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);

      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);

        if (dateRange.from) params.append('date_from', dateRange.from);

        if (dateRange.to) params.append('date_to', dateRange.to);

      }

      const result = await apiClient.get<{ data: ActivityStats }>(`${this.baseUrl}/stats`, { params: Object.fromEntries(params) });

      return {
        success: true,
        data: result.data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca estatísticas de atividade
   * 
   * @param {ActivityFilters} filters - Filtros para buscar estatísticas (opcional)
   * @returns {Promise<ActivityResponse>} Resposta com estatísticas de atividade ou erro
   */
  async getActivityStats(filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);

      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);

      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);

      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);

        if (dateRange.from) params.append('date_from', dateRange.from);

        if (dateRange.to) params.append('date_to', dateRange.to);

      }

      const result = await apiClient.get<{ data: ActivityStats }>(`/api/v1/activity/stats`, { params: Object.fromEntries(params) });

      return {
        success: true,
        data: result.data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca estatísticas de usuário
   */
  async getUserActivityStats(userId: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);

      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);

      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);

        if (dateRange.from) params.append('date_from', dateRange.from);

        if (dateRange.to) params.append('date_to', dateRange.to);

      }

      const result = await apiClient.get<{ data: UserActivityStats }>(`${this.baseUrl}/user/${userId}/stats`, { params: Object.fromEntries(params) });

      return {
        success: true,
        data: result.data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca estatísticas de saúde do sistema
   */
  async getSystemHealthStats(): Promise<ActivityResponse> {
    try {
      const result = await apiClient.get<{ data: SystemHealthStats }>(`${this.baseUrl}/system-health`);

      return {
        success: true,
        data: result.data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca logs em tempo real
   * 
   * @returns {Promise<ActivityResponse>} Resposta com logs em tempo real ou erro
   */
  async getRealTimeLogs(): Promise<ActivityResponse> {
    try {
      const result = await apiClient.get<{ data: RealTimeLog[] }>(`${this.baseUrl}/realtime`);

      return {
        success: true,
        data: result.data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca logs por tipo
   * 
   * @param {string} type - Tipo de log a ser buscado
   * @param {ActivityFilters} filters - Filtros adicionais (opcional)
   * @returns {Promise<ActivityResponse>} Resposta com logs filtrados por tipo ou erro
   */
  async getLogsByType(type: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();

      params.append('log_name', type);

      if (filters.search) params.append('search', filters.search);

      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);

      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);

        if (dateRange.from) params.append('date_from', dateRange.from);

        if (dateRange.to) params.append('date_to', dateRange.to);

      }
      if (filters.page) params.append('page', filters.page.toString());

      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const data = await apiClient.get(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);

      }

      const result = await response;
      return {
        success: true,
        data: result.data,
        pagination: result.meta};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao carregar logs por tipo';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca logs por usuário
   */
  async getLogsByUser(userId: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();

      params.append('causer_id', userId);

      if (filters.search) params.append('search', filters.search);

      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);

      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);

        if (dateRange.from) params.append('date_from', dateRange.from);

        if (dateRange.to) params.append('date_to', dateRange.to);

      }
      if (filters.page) params.append('page', filters.page.toString());

      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const result = await apiClient.get<{ data: ActivityLog[]; meta: Record<string, any> }>(`${this.baseUrl}/user/${userId}`, { params: Object.fromEntries(params) });

      return {
        success: true,
        data: result.data,
        pagination: result.meta};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca logs por período
   * 
   * @param {string} startDate - Data de início (formato ISO)
   * @param {string} endDate - Data de fim (formato ISO)
   * @param {ActivityFilters} filters - Filtros adicionais (opcional)
   * @returns {Promise<ActivityResponse>} Resposta com logs do período ou erro
   */
  async getLogsByDateRange(startDate: string, endDate: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();

      params.append('date_from', startDate);

      params.append('date_to', endDate);

      if (filters.search) params.append('search', filters.search);

      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);

      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);

      if (filters.page) params.append('page', filters.page.toString());

      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const result = await apiClient.get<{ data: ActivityLog[]; meta: Record<string, any> }>(this.baseUrl, { params: Object.fromEntries(params) });

      return {
        success: true,
        data: result.data,
        pagination: result.meta};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca logs com query de texto
   */
  async searchLogs(query: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();

      params.append('search', query);

      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);

      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);

      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);

        if (dateRange.from) params.append('date_from', dateRange.from);

        if (dateRange.to) params.append('date_to', dateRange.to);

      }
      if (filters.page) params.append('page', filters.page.toString());

      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const result = await apiClient.get<{ data: ActivityLog[]; meta: Record<string, any> }>(this.baseUrl, { params: Object.fromEntries(params) });

      return {
        success: true,
        data: result.data,
        pagination: result.meta};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Exporta logs
   * 
   * @param {ActivityFilters} filters - Filtros para exportação (opcional)
   * @param {string} format - Formato de exportação ('csv', 'json', 'pdf', 'xlsx')
   * @returns {Promise<ActivityResponse>} Resposta indicando sucesso ou erro
   */
  async exportLogs(filters: ActivityFilters = {}, format = 'csv'): Promise<ActivityResponse> {
    try {
      const params = new URLSearchParams();

      params.append('format', format);

      if (filters.search) params.append('search', filters.search);

      if (filters.type && filters.type !== 'all') params.append('log_name', filters.type);

      if (filters.user && filters.user !== 'all') params.append('causer_type', filters.user);

      if (filters.date) {
        const dateRange = this.getDateRange(filters.date);

        if (dateRange.from) params.append('date_from', dateRange.from);

        if (dateRange.to) params.append('date_to', dateRange.to);

      }

      await apiClient.download(`${this.baseUrl}/export?${params.toString()}`, `activity-logs-${new Date().toISOString().split('T')[0]}.${format}`);

      return {
        success: true,
        data: { exported: true, format } ;

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Limpa logs antigos
   */
  async clearOldLogs(daysToKeep = 30): Promise<ActivityResponse> {
    try {
      const result = await apiClient.delete<{ data: Record<string, any> }>(`${this.baseUrl}/clear`, { data: { days_to_keep: daysToKeep } );

      return {
        success: true,
        data: result.data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Exclui logs em lote
   */
  async bulkDeleteLogs(ids: string[]): Promise<ActivityResponse> {
    try {
      const result = await apiClient.delete<{ data: Record<string, any> }>(`${this.baseUrl}/bulk-delete`, { data: { ids } );

      return {
        success: true,
        data: result.data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca filtros disponíveis
   * 
   * @returns {Promise<ActivityResponse>} Resposta com filtros disponíveis ou erro
   */
  async getAvailableFilters(): Promise<ActivityResponse> {
    try {
      const result = await apiClient.get<{ data: Record<string, any> }>(`${this.baseUrl}/filters`);

      return {
        success: true,
        data: result.data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Conecta a atualizações em tempo real
   */
  subscribeToRealTimeUpdates(callback?: (e: any) => void): EventSource {
    const eventSource = new EventSource(`${this.baseUrl}/stream`);

    eventSource.onmessage = (event: unknown) => {
      try {
        const data = JSON.parse(event.data);

        callback(data);

      } catch (error) {
        console.error('Erro ao processar dados em tempo real:', error);

      } ;

    eventSource.onerror = (error: unknown) => {
      console.error('Erro na conexão em tempo real:', error);};

    return eventSource;
  }

  // ===== HELPER METHODS =====
  
  /**
   * Converte filtro de data em range
   * 
   * @param {string} dateFilter - Filtro de data ('today', 'yesterday', 'week', 'month', 'all')
   * @returns {from?: string, to?: string} Objeto com data de início e fim
   * @private
   */
  private getDateRange(dateFilter: string = 'all'): { from?: string; to?: string } {
    const now = new Date();

    switch (dateFilter) {
      case 'today':
        return { from: now.toISOString().split('T')[0]};

      case 'yesterday': {
        const yesterday = new Date(now);

        yesterday.setDate(yesterday.getDate() - 1);

        return { from: yesterday.toISOString().split('T')[0]};

      }
      case 'week': {
        const weekAgo = new Date(now);

        weekAgo.setDate(weekAgo.getDate() - 7);

        return { from: weekAgo.toISOString().split('T')[0]};

      }
      case 'month': {
        const monthAgo = new Date(now);

        monthAgo.setMonth(monthAgo.getMonth() - 1);

        return { from: monthAgo.toISOString().split('T')[0]};

      }
      default:
        return {};

    } }

export const activityApiService = new ActivityApiService();

export default activityApiService;
