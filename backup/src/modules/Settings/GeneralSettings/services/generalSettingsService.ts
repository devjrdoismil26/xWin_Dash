import { apiClient } from '@/services';
// import { withCache, invalidateSettingsCache } from '../services/settingsCacheService';
// import { validateGeneralSettingsData, handleSettingsError, withErrorHandling, withRetry } from '../services/settingsErrorService';

// =========================================
// TIPOS - CONFIGURAÇÕES GERAIS
// =========================================

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
}

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
}

export interface GeneralSettingsResponse {
  success: boolean;
  data?: GeneralSettings | GeneralSettings[];
  message?: string;
  error?: string;
}

export interface GeneralSettingsFilters {
  search?: string;
  theme?: string;
  language?: string;
  maintenance_mode?: boolean;
  debug_mode?: boolean;
}

// =========================================
// SERVIÇO - CONFIGURAÇÕES GERAIS
// =========================================

class GeneralSettingsService {
  private api = apiClient;

  // ===== CONFIGURAÇÕES GERAIS =====
  
  /**
   * Buscar todas as configurações gerais
   */
  async getGeneralSettings(filters: GeneralSettingsFilters = {}): Promise<GeneralSettingsResponse> {
    return withCache('general-settings', async () => {
      try {
        const response = await this.api.get('/settings/general', { params: filters });
        return {
          success: true,
          data: response.data
        };
      } catch (error: any) {
        return handleSettingsError(error, 'getGeneralSettings', { filters });
      }
    });
  }

  /**
   * Buscar configuração geral por ID
   */
  async getGeneralSettingById(id: string): Promise<GeneralSettingsResponse> {
    return withCache(`general-setting-${id}`, async () => {
      try {
        const response = await this.api.get(`/settings/general/${id}`);
        return {
          success: true,
          data: response.data
        };
      } catch (error: any) {
        return handleSettingsError(error, 'getGeneralSettingById', { id });
      }
    });
  }

  /**
   * Criar nova configuração geral
   */
  async createGeneralSetting(data: GeneralSettingsFormData): Promise<GeneralSettingsResponse> {
    // Validar dados antes de enviar
    const validation = validateGeneralSettingsData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/settings/general', data));
      
      // Invalidar cache de configurações gerais
      invalidateSettingsCache('general-settings');
      
      return {
        success: true,
        data: response.data
      };
    }, 'createGeneralSetting', { settingId: data.app_name });
  }

  /**
   * Atualizar configuração geral
   */
  async updateGeneralSetting(id: string, data: Partial<GeneralSettingsFormData>): Promise<GeneralSettingsResponse> {
    // Validar dados antes de enviar
    const validation = validateGeneralSettingsData(data);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.put(`/settings/general/${id}`, data));
      
      // Invalidar cache específico e geral
      invalidateSettingsCache(`general-setting-${id}`);
      invalidateSettingsCache('general-settings');
      
      return {
        success: true,
        data: response.data
      };
    }, 'updateGeneralSetting', { settingId: id });
  }

  /**
   * Deletar configuração geral
   */
  async deleteGeneralSetting(id: string): Promise<GeneralSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.delete(`/settings/general/${id}`));
      
      // Invalidar cache específico e geral
      invalidateSettingsCache(`general-setting-${id}`);
      invalidateSettingsCache('general-settings');
      
      return {
        success: true,
        data: response.data
      };
    }, 'deleteGeneralSetting', { settingId: id });
  }

  /**
   * Atualizar múltiplas configurações gerais
   */
  async updateMultipleGeneralSettings(settings: Record<string, any>): Promise<GeneralSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.put('/settings/general/bulk', { settings }));
      
      // Invalidar cache de configurações gerais
      invalidateSettingsCache('general-settings');
      
      return {
        success: true,
        data: response.data
      };
    }, 'updateMultipleGeneralSettings', { settingsCount: Object.keys(settings).length });
  }

  /**
   * Resetar configurações gerais para padrão
   */
  async resetGeneralSettings(): Promise<GeneralSettingsResponse> {
    return withErrorHandling(async () => {
      const response = await withRetry(() => this.api.post('/settings/general/reset'));
      
      // Invalidar cache de configurações gerais
      invalidateSettingsCache('general-settings');
      
      return {
        success: true,
        data: response.data
      };
    }, 'resetGeneralSettings', {});
  }

  // ===== CONFIGURAÇÕES ESPECÍFICAS =====

  /**
   * Atualizar configuração de tema
   */
  async updateTheme(theme: 'light' | 'dark' | 'auto'): Promise<GeneralSettingsResponse> {
    return this.updateGeneralSetting('theme', { theme });
  }

  /**
   * Atualizar configuração de idioma
   */
  async updateLanguage(language: string): Promise<GeneralSettingsResponse> {
    return this.updateGeneralSetting('language', { language });
  }

  /**
   * Atualizar configuração de timezone
   */
  async updateTimezone(timezone: string): Promise<GeneralSettingsResponse> {
    return this.updateGeneralSetting('timezone', { timezone });
  }

  /**
   * Atualizar modo de manutenção
   */
  async updateMaintenanceMode(enabled: boolean): Promise<GeneralSettingsResponse> {
    return this.updateGeneralSetting('maintenance_mode', { maintenance_mode: enabled });
  }

  /**
   * Atualizar modo de debug
   */
  async updateDebugMode(enabled: boolean): Promise<GeneralSettingsResponse> {
    return this.updateGeneralSetting('debug_mode', { debug_mode: enabled });
  }

  /**
   * Atualizar nível de log
   */
  async updateLogLevel(level: 'error' | 'warn' | 'info' | 'debug'): Promise<GeneralSettingsResponse> {
    return this.updateGeneralSetting('log_level', { log_level: level });
  }

  // ===== UTILITÁRIOS =====

  /**
   * Obter configurações padrão
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
      auto_logout: true
    };
  }

  /**
   * Validar configuração de tema
   */
  validateTheme(theme: string): boolean {
    return ['light', 'dark', 'auto'].includes(theme);
  }

  /**
   * Validar configuração de idioma
   */
  validateLanguage(language: string): boolean {
    const supportedLanguages = ['pt-BR', 'en-US', 'es-ES', 'fr-FR'];
    return supportedLanguages.includes(language);
  }

  /**
   * Validar configuração de timezone
   */
  validateTimezone(timezone: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Formatar configuração para exibição
   */
  formatGeneralSetting(setting: GeneralSettings): Record<string, any> {
    return {
      ...setting,
      formatted_created_at: setting.created_at ? new Date(setting.created_at).toLocaleString('pt-BR') : '',
      formatted_updated_at: setting.updated_at ? new Date(setting.updated_at).toLocaleString('pt-BR') : '',
      formatted_max_upload_size: `${(setting.max_upload_size / 1048576).toFixed(1)} MB`,
      formatted_session_timeout: `${Math.floor(setting.session_timeout / 60)} minutos`
    };
  }

  /**
   * Obter estatísticas das configurações gerais
   */
  async getGeneralSettingsStats(): Promise<GeneralSettingsResponse> {
    return withCache('general-settings-stats', async () => {
      try {
        const response = await this.api.get('/settings/general/stats');
        return {
          success: true,
          data: response.data
        };
      } catch (error: any) {
        return handleSettingsError(error, 'getGeneralSettingsStats', {});
      }
    });
  }
}

// =========================================
// EXPORTS - SERVIÇO DE CONFIGURAÇÕES GERAIS
// =========================================

const generalSettingsService = new GeneralSettingsService();
export { generalSettingsService };
export default generalSettingsService;
