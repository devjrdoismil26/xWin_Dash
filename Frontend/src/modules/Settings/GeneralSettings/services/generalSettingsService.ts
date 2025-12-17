/**
 * Serviço de Configurações Gerais
 *
 * @description
 * Serviço para gerenciar configurações gerais da aplicação, incluindo
 * tema, idioma, timezone, manutenção, debug e outras configurações do sistema.
 *
 * @module modules/Settings/GeneralSettings/services/generalSettingsService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/errorHelpers';

// =========================================
// TIPOS - CONFIGURAÇÕES GERAIS
// =========================================

/**
 * Interface de Configurações Gerais
 *
 * @interface GeneralSettings
 * @property {string} [id] - ID único da configuração (opcional)
 * @property {string} app_name - Nome da aplicação
 * @property {string} app_version - Versão da aplicação
 * @property {string} [app_description] - Descrição da aplicação (opcional)
 * @property {string} [app_logo] - URL do logo da aplicação (opcional)
 * @property {string} [app_favicon] - URL do favicon (opcional)
 * @property {string} timezone - Timezone da aplicação
 * @property {string} language - Idioma da aplicação
 * @property {string} currency - Moeda padrão
 * @property {string} date_format - Formato de data
 * @property {'12h' | '24h'} time_format - Formato de hora
 * @property {'light' | 'dark' | 'auto'} theme - Tema da aplicação
 * @property {boolean} maintenance_mode - Modo de manutenção ativo
 * @property {boolean} debug_mode - Modo de debug ativo
 * @property {'error' | 'warn' | 'info' | 'debug'} log_level - Nível de log
 * @property {number} max_upload_size - Tamanho máximo de upload (bytes)
 * @property {string[]} allowed_file_types - Tipos de arquivo permitidos
 * @property {number} session_timeout - Timeout de sessão (segundos)
 * @property {boolean} auto_logout - Logout automático
 * @property {string} [created_at] - Data de criação (ISO 8601, opcional)
 * @property {string} [updated_at] - Data de atualização (ISO 8601, opcional)
 */
export interface GeneralSettings {
  id?: string;
  app_name: string;
  app_version: string;
  app_description?: string;
  app_logo?: string;
  app_favicon?: string;
  timezone: string;
  language: string;
  currency: string;
  date_format: string;
  time_format: '12h' | '24h';
  theme: 'light' | 'dark' | 'auto';
  maintenance_mode: boolean;
  debug_mode: boolean;
  log_level: 'error' | 'warn' | 'info' | 'debug';
  max_upload_size: number;
  allowed_file_types: string[];
  session_timeout: number;
  auto_logout: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown; }

/**
 * Interface de Dados do Formulário de Configurações Gerais
 *
 * @interface GeneralSettingsFormData
 * @extends Partial<GeneralSettings />
 */
export interface GeneralSettingsFormData {
  app_name: string;
  app_version: string;
  app_description?: string;
  app_logo?: string;
  app_favicon?: string;
  timezone: string;
  language: string;
  currency: string;
  date_format: string;
  time_format: '12h' | '24h';
  theme: 'light' | 'dark' | 'auto';
  maintenance_mode: boolean;
  debug_mode: boolean;
  log_level: 'error' | 'warn' | 'info' | 'debug';
  max_upload_size: number;
  allowed_file_types: string[];
  session_timeout: number;
  auto_logout: boolean;
  [key: string]: unknown; }

/**
 * Interface de Resposta das Configurações Gerais
 *
 * @interface GeneralSettingsResponse
 * @property {boolean} success - Se a operação foi bem-sucedida
 * @property {GeneralSettings | GeneralSettings[]} [data] - Dados retornados (opcional)
 * @property {string} [message] - Mensagem de sucesso (opcional)
 * @property {string} [error] - Mensagem de erro (opcional)
 */
export interface GeneralSettingsResponse {
  success: boolean;
  data?: GeneralSettings | GeneralSettings[];
  message?: string;
  error?: string;
  [key: string]: unknown; }

/**
 * Interface de Filtros para Configurações Gerais
 *
 * @interface GeneralSettingsFilters
 * @property {string} [search] - Busca por texto (opcional)
 * @property {string} [theme] - Filtrar por tema (opcional)
 * @property {string} [language] - Filtrar por idioma (opcional)
 * @property {boolean} [maintenance_mode] - Filtrar por modo de manutenção (opcional)
 * @property {boolean} [debug_mode] - Filtrar por modo de debug (opcional)
 */
export interface GeneralSettingsFilters {
  search?: string;
  theme?: string;
  language?: string;
  maintenance_mode?: boolean;
  debug_mode?: boolean;
  [key: string]: unknown; }

// =========================================
// SERVIÇO - CONFIGURAÇÕES GERAIS
// =========================================

/**
 * Classe GeneralSettingsService
 *
 * @description
 * Serviço para gerenciar todas as operações relacionadas a configurações gerais.
 * Fornece métodos para CRUD completo, validação e utilitários.
 */
class GeneralSettingsService {
  private api = apiClient;

  // ===== CONFIGURAÇÕES GERAIS =====

  /**
   * Busca todas as configurações gerais
   *
   * @param {GeneralSettingsFilters} [filters={}] - Filtros opcionais
   * @returns {Promise<GeneralSettingsResponse>} Promise com as configurações
   *
   * @example
   * ```ts
   * const settings = await generalSettingsService.getGeneralSettings({ theme: 'dark' });

   * ```
   */
  async getGeneralSettings(filters: GeneralSettingsFilters = {}): Promise<GeneralSettingsResponse> {
    try {
      const response = await this.api.get<GeneralSettings | GeneralSettings[]>('/settings/general', {
        params: filters,
      });

      return {
        success: true,
        data: response,};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro ao buscar configurações gerais';
      console.error('Erro em getGeneralSettings:', error);

      return {
        success: false,
        error: errorMessage,};

    } /**
   * Busca configuração geral por ID
   *
   * @param {string} id - ID da configuração
   * @returns {Promise<GeneralSettingsResponse>} Promise com a configuração
   *
   * @example
   * ```ts
   * const setting = await generalSettingsService.getGeneralSettingById('setting-id');

   * ```
   */
  async getGeneralSettingById(id: string): Promise<GeneralSettingsResponse> {
    try {
      const response = await this.api.get<GeneralSettings>(`/settings/general/${id}`);

      return {
        success: true,
        data: response,};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro ao buscar configuração';
      console.error('Erro em getGeneralSettingById:', error);

      return {
        success: false,
        error: errorMessage,};

    } /**
   * Cria nova configuração geral
   *
   * @param {GeneralSettingsFormData} data - Dados da configuração
   * @returns {Promise<GeneralSettingsResponse>} Promise com a configuração criada
   *
   * @example
   * ```ts
   * const result = await generalSettingsService.createGeneralSetting({
   *   app_name: 'xWin Dash',
   *   app_version: '1.0.0',
   *   theme: 'light',
   *   // ...
   * });

   * ```
   */
  async createGeneralSetting(data: GeneralSettingsFormData): Promise<GeneralSettingsResponse> {
    try {
      // Validar dados básicos
      if (!data.app_name || !data.app_version) {
        return {
          success: false,
          error: 'Nome e versão da aplicação são obrigatórios',};

      }

      const response = await this.api.post<GeneralSettings>('/settings/general', data);

      return {
        success: true,
        data: response,
        message: 'Configuração criada com sucesso',};

    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError && (error as any).response?.data?.message
          ? (error as any).response.data.message
          : error instanceof Error
          ? getErrorMessage(error)
          : 'Erro ao criar configuração';
      console.error('Erro em createGeneralSetting:', error);

      return {
        success: false,
        error: errorMessage,};

    } /**
   * Atualiza configuração geral
   *
   * @param {string} id - ID da configuração
   * @param {Partial<GeneralSettingsFormData>} data - Dados parciais para atualização
   * @returns {Promise<GeneralSettingsResponse>} Promise com a configuração atualizada
   *
   * @example
   * ```ts
   * const result = await generalSettingsService.updateGeneralSetting('setting-id', {
   *   theme: 'dark',
   *   language: 'pt-BR'
   * });

   * ```
   */
  async updateGeneralSetting(
    id: string,
    data: Partial<GeneralSettingsFormData />
  ): Promise<GeneralSettingsResponse> {
    try {
      const response = await this.api.put<GeneralSettings>(`/settings/general/${id}`, data);

      return {
        success: true,
        data: response,
        message: 'Configuração atualizada com sucesso',};

    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError && (error as any).response?.data?.message
          ? (error as any).response.data.message
          : error instanceof Error
          ? getErrorMessage(error)
          : 'Erro ao atualizar configuração';
      console.error('Erro em updateGeneralSetting:', error);

      return {
        success: false,
        error: errorMessage,};

    } /**
   * Deleta configuração geral
   *
   * @param {string} id - ID da configuração
   * @returns {Promise<GeneralSettingsResponse>} Promise com resultado da deleção
   *
   * @example
   * ```ts
   * const result = await generalSettingsService.deleteGeneralSetting('setting-id');

   * ```
   */
  async deleteGeneralSetting(id: string): Promise<GeneralSettingsResponse> {
    try {
      await this.api.delete(`/settings/general/${id}`);

      return {
        success: true,
        message: 'Configuração deletada com sucesso',};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro ao deletar configuração';
      console.error('Erro em deleteGeneralSetting:', error);

      return {
        success: false,
        error: errorMessage,};

    } /**
   * Atualiza múltiplas configurações gerais
   *
   * @param {Record<string, any>} settings - Objeto com múltiplas configurações
   * @returns {Promise<GeneralSettingsResponse>} Promise com resultado da atualização
   *
   * @example
   * ```ts
   * const result = await generalSettingsService.updateMultipleGeneralSettings({
   *   theme: 'dark',
   *   language: 'pt-BR',
   *   timezone: 'America/Sao_Paulo'
   * });

   * ```
   */
  async updateMultipleGeneralSettings(settings: Record<string, any>): Promise<GeneralSettingsResponse> {
    try {
      const response = await this.api.put<GeneralSettings>('/settings/general/bulk', { settings });

      return {
        success: true,
        data: response,
        message: 'Configurações atualizadas com sucesso',};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro ao atualizar configurações';
      console.error('Erro em updateMultipleGeneralSettings:', error);

      return {
        success: false,
        error: errorMessage,};

    } /**
   * Reseta configurações gerais para padrão
   *
   * @returns {Promise<GeneralSettingsResponse>} Promise com as configurações resetadas
   *
   * @example
   * ```ts
   * const result = await generalSettingsService.resetGeneralSettings();

   * ```
   */
  async resetGeneralSettings(): Promise<GeneralSettingsResponse> {
    try {
      const response = await this.api.post<GeneralSettings>('/settings/general/reset');

      return {
        success: true,
        data: response,
        message: 'Configurações resetadas com sucesso',};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro ao resetar configurações';
      console.error('Erro em resetGeneralSettings:', error);

      return {
        success: false,
        error: errorMessage,};

    } // ===== CONFIGURAÇÕES ESPECÍFICAS =====

  /**
   * Atualiza configuração de tema
   *
   * @param {'light' | 'dark' | 'auto'} theme - Novo tema
   * @returns {Promise<GeneralSettingsResponse>} Promise com resultado
   */
  async updateTheme(theme: 'light' | 'dark' | 'auto'): Promise<GeneralSettingsResponse> {
    return this.updateMultipleGeneralSettings({ theme });

  }

  /**
   * Atualiza configuração de idioma
   *
   * @param {string} language - Novo idioma
   * @returns {Promise<GeneralSettingsResponse>} Promise com resultado
   */
  async updateLanguage(language: string): Promise<GeneralSettingsResponse> {
    return this.updateMultipleGeneralSettings({ language });

  }

  /**
   * Atualiza configuração de timezone
   *
   * @param {string} timezone - Novo timezone
   * @returns {Promise<GeneralSettingsResponse>} Promise com resultado
   */
  async updateTimezone(timezone: string): Promise<GeneralSettingsResponse> {
    return this.updateMultipleGeneralSettings({ timezone });

  }

  /**
   * Atualiza modo de manutenção
   *
   * @param {boolean} enabled - Se o modo de manutenção deve estar ativo
   * @returns {Promise<GeneralSettingsResponse>} Promise com resultado
   */
  async updateMaintenanceMode(enabled: boolean): Promise<GeneralSettingsResponse> {
    return this.updateMultipleGeneralSettings({ maintenance_mode: enabled });

  }

  /**
   * Atualiza modo de debug
   *
   * @param {boolean} enabled - Se o modo de debug deve estar ativo
   * @returns {Promise<GeneralSettingsResponse>} Promise com resultado
   */
  async updateDebugMode(enabled: boolean): Promise<GeneralSettingsResponse> {
    return this.updateMultipleGeneralSettings({ debug_mode: enabled });

  }

  /**
   * Atualiza nível de log
   *
   * @param {'error' | 'warn' | 'info' | 'debug'} level - Novo nível de log
   * @returns {Promise<GeneralSettingsResponse>} Promise com resultado
   */
  async updateLogLevel(level: 'error' | 'warn' | 'info' | 'debug'): Promise<GeneralSettingsResponse> {
    return this.updateMultipleGeneralSettings({ log_level: level });

  }

  // ===== UTILITÁRIOS =====

  /**
   * Obtém configurações padrão
   *
   * @returns {GeneralSettings} Configurações padrão
   */
  getDefaultGeneralSettings(): GeneralSettings {
    return {
      app_name: 'xWin Dash',
      app_version: '1.0.0',
      app_description: 'Plataforma de gestão empresarial',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      currency: 'BRL',
      date_format: 'DD/MM/YYYY',
      time_format: '24h',
      theme: 'light',
      maintenance_mode: false,
      debug_mode: false,
      log_level: 'info',
      max_upload_size: 10485760, // 10MB
      allowed_file_types: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
      session_timeout: 3600, // 1 hora
      auto_logout: true,};

  }

  /**
   * Valida configuração de tema
   *
   * @param {string} theme - Tema a validar
   * @returns {boolean} Se o tema é válido
   */
  validateTheme(theme: string): boolean {
    return ['light', 'dark', 'auto'].includes(theme);

  }

  /**
   * Valida configuração de idioma
   *
   * @param {string} language - Idioma a validar
   * @returns {boolean} Se o idioma é válido
   */
  validateLanguage(language: string): boolean {
    const supportedLanguages = ['pt-BR', 'en-US', 'es-ES', 'fr-FR'];
    return supportedLanguages.includes(language);

  }

  /**
   * Valida configuração de timezone
   *
   * @param {string} timezone - Timezone a validar
   * @returns {boolean} Se o timezone é válido
   */
  validateTimezone(timezone: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });

      return true;
    } catch {
      return false;
    } /**
   * Formata configuração para exibição
   *
   * @param {GeneralSettings} setting - Configuração a formatar
   * @returns {Record<string, any>} Configuração formatada
   */
  formatGeneralSetting(setting: GeneralSettings): Record<string, any> {
    return {
      ...setting,
      formatted_created_at: setting.created_at
        ? new Date(setting.created_at).toLocaleString('pt-BR')
        : '',
      formatted_updated_at: setting.updated_at
        ? new Date(setting.updated_at).toLocaleString('pt-BR')
        : '',
      formatted_max_upload_size: `${(setting.max_upload_size / 1048576).toFixed(1)} MB`,
      formatted_session_timeout: `${Math.floor(setting.session_timeout / 60)} minutos`,};

  }

  /**
   * Obtém estatísticas das configurações gerais
   *
   * @returns {Promise<GeneralSettingsResponse>} Promise com estatísticas
   */
  async getGeneralSettingsStats(): Promise<GeneralSettingsResponse> {
    try {
      const response = await this.api.get<Record<string, any>>('/settings/general/stats');

      return {
        success: true,
        data: response as any as GeneralSettings,};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro ao buscar estatísticas';
      console.error('Erro em getGeneralSettingsStats:', error);

      return {
        success: false,
        error: errorMessage,};

    } }

// =========================================
// EXPORTS - SERVIÇO DE CONFIGURAÇÕES GERAIS
// =========================================

const generalSettingsService = new GeneralSettingsService();

export { generalSettingsService };

export default generalSettingsService;
