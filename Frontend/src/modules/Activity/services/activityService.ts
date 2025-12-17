/**
 * Serviço principal do módulo Activity
 *
 * @description
 * Orquestrador que coordena os serviços especializados de Activity:
 * API service, cache service e validation service. Fornece interface
 * unificada para operações de atividade.
 *
 * @module modules/Activity/services/activityService
 * @since 1.0.0
 */

import { ActivityLog, ActivityStats, ActivityFilters, ActivityResponse, UserActivityStats, SystemHealthStats, RealTimeLog } from '../types';
import activityApiService from './activityApiService';
import activityCacheService from './activityCacheService';
import activityValidationService from './activityValidationService';
import { formatTimestamp, formatRelativeTime, formatLogDescription, formatNumber, formatPercentage, formatDuration, formatActivitySummary, formatHealthStatus } from '../utils/activityFormatters';

class ActivityService {
  /**
   * Busca logs de atividade com cache
   * 
   * @param {ActivityFilters} filters - Filtros para buscar logs (opcional)
   * @returns {Promise<ActivityResponse>} Resposta com logs ou erro
   */
  async getLogs(filters: ActivityFilters = {}): Promise<ActivityResponse> {
    // Validar e sanitizar filtros
    const sanitizedFilters = activityValidationService.sanitizeFilters(filters);

    const validation = activityValidationService.validateFilters(sanitizedFilters);

    if (!validation.isValid) {
      return {
        success: false,
        error: `Filtros inválidos: ${validation.errors.join(', ')}`};

    }

    // Tentar obter do cache primeiro
    const cachedLogs = activityCacheService.getCachedLogs(sanitizedFilters);

    if (cachedLogs) {
      return {
        success: true,
        data: cachedLogs};

    }

    // Buscar da API
    const response = await activityApiService.getLogs(sanitizedFilters);

    // Cachear resultado se bem-sucedido
    if (response.success && (response as any).data) {
      activityCacheService.cacheLogs(sanitizedFilters, (response as any).data as ActivityLog[]);

    }

    return response;
  }

  /**
   * Busca log específico por ID com cache
   * 
   * @param {string} logId - ID do log a ser buscado
   * @returns {Promise<ActivityResponse>} Resposta com log ou erro
   */
  async getLogById(logId: string): Promise<ActivityResponse> {
    if (!activityValidationService.validateLogId(logId)) {
      return {
        success: false,
        error: 'ID do log é inválido'};

    }

    // Tentar obter do cache primeiro
    const cachedLog = activityCacheService.getCachedLog(logId);

    if (cachedLog) {
      return {
        success: true,
        data: cachedLog};

    }

    // Buscar da API
    const response = await activityApiService.getLogById(logId);

    // Cachear resultado se bem-sucedido
    if (response.success && (response as any).data) {
      activityCacheService.cacheLog(logId, (response as any).data as ActivityLog);

    }

    return response;
  }

  /**
   * Busca estatísticas com cache
   * 
   * @param {ActivityFilters} filters - Filtros para buscar estatísticas (opcional)
   * @returns {Promise<ActivityResponse>} Resposta com estatísticas ou erro
   */
  async getLogStats(filters: ActivityFilters = {}): Promise<ActivityResponse> {
    // Validar e sanitizar filtros
    const sanitizedFilters = activityValidationService.sanitizeFilters(filters);

    const validation = activityValidationService.validateFilters(sanitizedFilters);

    if (!validation.isValid) {
      return {
        success: false,
        error: `Filtros inválidos: ${validation.errors.join(', ')}`};

    }

    // Tentar obter do cache primeiro
    const cachedStats = activityCacheService.getCachedStats(sanitizedFilters);

    if (cachedStats) {
      return {
        success: true,
        data: cachedStats};

    }

    // Buscar da API
    const response = await activityApiService.getLogStats(sanitizedFilters);

    // Cachear resultado se bem-sucedido
    if (response.success && (response as any).data) {
      activityCacheService.cacheStats(sanitizedFilters, (response as any).data as ActivityStats);

    }

    return response;
  }

  /**
   * Busca estatísticas de atividade
   * 
   * @param {ActivityFilters} filters - Filtros para buscar estatísticas (opcional)
   * @returns {Promise<ActivityResponse>} Resposta com estatísticas de atividade ou erro
   */
  async getActivityStats(filters: ActivityFilters = {}): Promise<ActivityResponse> {
    const sanitizedFilters = activityValidationService.sanitizeFilters(filters);

    const validation = activityValidationService.validateFilters(sanitizedFilters);

    if (!validation.isValid) {
      return {
        success: false,
        error: `Filtros inválidos: ${validation.errors.join(', ')}`};

    }

    return await activityApiService.getActivityStats(sanitizedFilters);

  }

  /**
   * Busca estatísticas de usuário
   * 
   * @param {string} userId - ID do usuário
   * @param {ActivityFilters} filters - Filtros adicionais (opcional)
   * @returns {Promise<ActivityResponse>} Resposta com estatísticas do usuário ou erro
   */
  async getUserActivityStats(userId: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    if (!activityValidationService.validateUserId(userId)) {
      return {
        success: false,
        error: 'ID de usuário inválido'};

    }

    const sanitizedFilters = activityValidationService.sanitizeFilters(filters);

    const validation = activityValidationService.validateFilters(sanitizedFilters);

    if (!validation.isValid) {
      return {
        success: false,
        error: `Filtros inválidos: ${validation.errors.join(', ')}`};

    }

    return await activityApiService.getUserActivityStats(userId, sanitizedFilters);

  }

  /**
   * Busca estatísticas de saúde do sistema
   */
  async getSystemHealthStats(): Promise<ActivityResponse> {
    return await activityApiService.getSystemHealthStats();

  }

  /**
   * Busca logs em tempo real
   * 
   * @returns {Promise<ActivityResponse>} Resposta com logs em tempo real ou erro
   */
  async getRealTimeLogs(): Promise<ActivityResponse> {
    return await activityApiService.getRealTimeLogs();

  }

  /**
   * Busca logs por tipo
   * 
   * @param {string} type - Tipo de log a ser buscado
   * @param {ActivityFilters} filters - Filtros adicionais (opcional)
   * @returns {Promise<ActivityResponse>} Resposta com logs filtrados por tipo ou erro
   */
  async getLogsByType(type: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    if (!activityValidationService.validateLogType(type)) {
      return {
        success: false,
        error: 'Tipo de log inválido'};

    }

    const sanitizedFilters = activityValidationService.sanitizeFilters(filters);

    const validation = activityValidationService.validateFilters(sanitizedFilters);

    if (!validation.isValid) {
      return {
        success: false,
        error: `Filtros inválidos: ${validation.errors.join(', ')}`};

    }

    return await activityApiService.getLogsByType(type, sanitizedFilters);

  }

  /**
   * Busca logs por usuário
   */
  async getLogsByUser(userId: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    if (!activityValidationService.validateUserId(userId)) {
      return {
        success: false,
        error: 'ID de usuário inválido'};

    }

    const sanitizedFilters = activityValidationService.sanitizeFilters(filters);

    const validation = activityValidationService.validateFilters(sanitizedFilters);

    if (!validation.isValid) {
      return {
        success: false,
        error: `Filtros inválidos: ${validation.errors.join(', ')}`};

    }

    return await activityApiService.getLogsByUser(userId, sanitizedFilters);

  }

  /**
   * Busca logs por período
   * 
   * @param {string} startDate - Data de início (formato ISO)
   * @param {string} endDate - Data de fim (formato ISO)
   * @param {ActivityFilters} filters - Filtros adicionais (opcional)
   * @returns {Promise<ActivityResponse>} Resposta com logs do período ou erro
   */
  async getLogsByDateRange(startDate: string, endDate: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    const dateValidation = activityValidationService.validateDateRange(startDate, endDate);

    if (!dateValidation.isValid) {
      return {
        success: false,
        error: dateValidation.error || 'Range de datas inválido'};

    }

    const sanitizedFilters = activityValidationService.sanitizeFilters(filters);

    const validation = activityValidationService.validateFilters(sanitizedFilters);

    if (!validation.isValid) {
      return {
        success: false,
        error: `Filtros inválidos: ${validation.errors.join(', ')}`};

    }

    return await activityApiService.getLogsByDateRange(startDate, endDate, sanitizedFilters);

  }

  /**
   * Busca logs com query de texto
   */
  async searchLogs(query: string, filters: ActivityFilters = {}): Promise<ActivityResponse> {
    const queryValidation = activityValidationService.validateSearchQuery(query);

    if (!queryValidation.isValid) {
      return {
        success: false,
        error: queryValidation.error || 'Query de busca inválida'};

    }

    const sanitizedFilters = activityValidationService.sanitizeFilters(filters);

    const validation = activityValidationService.validateFilters(sanitizedFilters);

    if (!validation.isValid) {
      return {
        success: false,
        error: `Filtros inválidos: ${validation.errors.join(', ')}`};

    }

    return await activityApiService.searchLogs(query, sanitizedFilters);

  }

  /**
   * Exporta logs
   * 
   * @param {ActivityFilters} filters - Filtros para exportação (opcional)
   * @param {string} format - Formato de exportação ('csv', 'json', 'pdf', 'xlsx')
   * @returns {Promise<ActivityResponse>} Resposta indicando sucesso ou erro
   */
  async exportLogs(filters: ActivityFilters = {}, format = 'csv'): Promise<ActivityResponse> {
    if (!activityValidationService.validateExportFormat(format)) {
      return {
        success: false,
        error: 'Formato de exportação inválido'};

    }

    const sanitizedFilters = activityValidationService.sanitizeFilters(filters);

    const validation = activityValidationService.validateFilters(sanitizedFilters);

    if (!validation.isValid) {
      return {
        success: false,
        error: `Filtros inválidos: ${validation.errors.join(', ')}`};

    }

    return await activityApiService.exportLogs(sanitizedFilters, format);

  }

  /**
   * Limpa logs antigos
   */
  async clearOldLogs(daysToKeep = 30): Promise<ActivityResponse> {
    const validation = activityValidationService.validateCleanupPeriod(daysToKeep);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || 'Período de limpeza inválido'};

    }

    const response = await activityApiService.clearOldLogs(daysToKeep);

    // Limpar cache relacionado se bem-sucedido
    if (response.success) {
      activityCacheService.invalidateLogsCache();

    }

    return response;
  }

  /**
   * Exclui logs em lote
   * 
   * @param {string[]} ids - Array de IDs dos logs a serem excluídos
   * @returns {Promise<ActivityResponse>} Resposta indicando sucesso ou erro
   */
  async bulkDeleteLogs(ids: string[]): Promise<ActivityResponse> {
    const validation = activityValidationService.validateIds(ids);

    if (!validation.isValid) {
      return {
        success: false,
        error: `IDs inválidos: ${validation.errors.join(', ')}`};

    }

    const response = await activityApiService.bulkDeleteLogs(ids);

    // Limpar cache relacionado se bem-sucedido
    if (response.success) {
      activityCacheService.invalidateLogsCache();

    }

    return response;
  }

  /**
   * Busca filtros disponíveis
   */
  async getAvailableFilters(): Promise<ActivityResponse> {
    return await activityApiService.getAvailableFilters();

  }

  /**
   * Conecta a atualizações em tempo real
   */
  subscribeToRealTimeUpdates(callback?: (e: any) => void): EventSource {
    const eventSource = activityApiService.subscribeToRealTimeUpdates(callback);

    // Invalidar cache quando receber atualizações
    eventSource.onmessage = (event: unknown) => {
      try {
        const data = JSON.parse(event.data);

        callback(data);

        activityCacheService.invalidateLogsCache();

      } catch (error) {
        console.error('Erro ao processar dados em tempo real:', error);

      } ;

    return eventSource;
  }

  // ===== UTILITY METHODS =====
  
  /**
   * Formata timestamp
   * 
   * @param {string} timestamp - Timestamp a ser formatado
   * @returns {string} Timestamp formatado
   */
  formatTimestamp(timestamp: string): string {
    return formatTimestamp(timestamp);

  }

  /**
   * Formata tempo relativo
   */
  formatRelativeTime(timestamp: string): string {
    return formatRelativeTime(timestamp);

  }

  /**
   * Formata descrição do log
   */
  formatLogDescription(log: ActivityLog): string {
    return formatLogDescription(log);

  }

  /**
   * Formata número
   */
  formatNumber(value: number): string {
    return formatNumber(value);

  }

  /**
   * Formata porcentagem
   */
  formatPercentage(value: number): string {
    return formatPercentage(value);

  }

  /**
   * Formata duração
   */
  formatDuration(milliseconds: number): string {
    return formatDuration(milliseconds);

  }

  /**
   * Formata resumo de atividade
   */
  formatActivitySummary(stats: Record<string, any>): string {
    return formatActivitySummary(stats);

  }

  /**
   * Formata status de saúde
   * 
   * @param {number} percentage - Porcentagem de saúde (0-100)
   * @returns {status: string, color: string} Objeto com status e cor
   */
  formatHealthStatus(percentage: number): { status: string; color: string } {
    return formatHealthStatus(percentage);

  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    activityCacheService.clear();

  }

  /**
   * Obtém informações do cache
   */
  getCacheInfo() {
    return activityCacheService.getCacheInfo();

  } export const activityService = new ActivityService();

export default activityService;
