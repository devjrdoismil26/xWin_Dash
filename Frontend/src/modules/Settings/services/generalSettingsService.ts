/**
 * Serviço de Configurações Gerais (Simplificado)
 *
 * @description
 * Serviço simplificado para gerenciar configurações gerais da aplicação.
 * Este serviço fornece uma interface simplificada para operações CRUD
 * em diferentes tipos de configurações do sistema.
 *
 * @module modules/Settings/services/generalSettingsService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { Setting, SettingsResponse, SettingsFilters } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

/**
 * Classe GeneralSettingsService (Versão Simplificada)
 *
 * @description
 * Serviço simplificado para gerenciar configurações gerais, do sistema,
 * aparência, notificações, backup, manutenção, cache, logs e performance.
 */
class GeneralSettingsService {
  private api = apiClient;

  /**
   * Busca configurações gerais
   *
   * @param {SettingsFilters} [filters={}] - Filtros opcionais
   * @returns {Promise<SettingsResponse>} Promise com as configurações gerais
   *
   * @example
   * ```ts
   * const settings = await generalSettingsService.getGeneralSettings({ search: 'theme' });

   * ```
   */
  async getGeneralSettings(filters: SettingsFilters = {}): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings', { params: filters });

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configuração geral
   *
   * @param {string} key - Chave da configuração
   * @param {any} value - Novo valor da configuração
   * @returns {Promise<SettingsResponse>} Promise com resultado
   */
  async updateGeneralSetting(key: string, value: unknown): Promise<SettingsResponse> {
    try {
      const response = await this.api.put(`/api/v1/core/settings/${key}`, { value });

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Cria nova configuração geral
   *
   * @param {Omit<Setting, 'id'>} setting - Dados da configuração (sem ID)
   * @returns {Promise<SettingsResponse>} Promise com a configuração criada
   */
  async createGeneralSetting(setting: Omit<Setting, 'id'>): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/api/v1/core/settings', setting);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Exclui configuração geral
   *
   * @param {string} key - Chave da configuração a ser excluída
   * @returns {Promise<SettingsResponse>} Promise com resultado
   */
  async deleteGeneralSetting(key: string): Promise<SettingsResponse> {
    try {
      await this.api.delete(`/settings/general/${key}`);

      return {
        success: true,
        data: { deleted: true } ;

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de sistema
   */
  async getSystemSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/system');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de sistema
   */
  /**
   * Atualiza configurações de sistema
   *
   * @param {Record<string, any>} settings - Objeto com configurações
   * @returns {Promise<SettingsResponse>} Promise com resultado
   */
  async updateSystemSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/system', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de aparência
   */
  async getAppearanceSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/appearance');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de aparência
   */
  async updateAppearanceSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/appearance', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de notificações
   */
  async getNotificationSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/notifications');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de notificações
   */
  async updateNotificationSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/notifications', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de backup
   */
  async getBackupSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/backup');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de backup
   */
  async updateBackupSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/backup', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Executa backup manual
   */
  async executeBackup(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/api/v1/core/settings/backup/execute');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Restaura backup
   */
  async restoreBackup(backupId: string): Promise<SettingsResponse> {
    try {
      const response = await this.api.post(`/settings/backup/restore/${backupId}`);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de manutenção
   */
  async getMaintenanceSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/maintenance');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de manutenção
   */
  async updateMaintenanceSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/maintenance', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Ativa modo de manutenção
   */
  async enableMaintenanceMode(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/api/v1/core/settings/maintenance/enable');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Desativa modo de manutenção
   */
  async disableMaintenanceMode(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/api/v1/core/settings/maintenance/disable');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de cache
   */
  async getCacheSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/cache');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de cache
   */
  async updateCacheSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/cache', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Limpa cache
   */
  async clearCache(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/api/v1/core/settings/cache/clear');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de logs
   */
  async getLogSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/logs');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de logs
   */
  async updateLogSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/logs', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de performance
   */
  async getPerformanceSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/performance');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de performance
   */
  async updatePerformanceSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/performance', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } }

export const generalSettingsService = new GeneralSettingsService();

export default generalSettingsService;
