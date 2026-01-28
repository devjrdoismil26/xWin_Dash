/**
 * Service orquestrador do módulo Settings
 * Coordena os serviços especializados
 */

import { Setting, SettingsResponse, SettingsFilters } from '../types';
import generalSettingsService from './generalSettingsService';
import authSettingsService from './authSettingsService';
import { settingsCacheService } from './settingsCacheService';
import { settingsErrorService } from './settingsErrorService';
import { settingsOptimizationService } from './settingsOptimizationService';

class SettingsService {
  /**
   * Busca todas as configurações
   */
  async getSettings(filters: SettingsFilters = {}): Promise<SettingsResponse> {
    try {
      // Tentar obter do cache primeiro
      const cachedSettings = settingsCacheService.getCachedSettings(filters);
      if (cachedSettings) {
        return {
          success: true,
          data: cachedSettings
        };
      }

      // Buscar configurações gerais
      const generalResponse = await generalSettingsService.getGeneralSettings(filters);
      if (!generalResponse.success) {
        return generalResponse;
      }

      // Buscar configurações de autenticação
      const authResponse = await authSettingsService.getAuthSettings(filters);
      if (!authResponse.success) {
        return authResponse;
      }

      // Combinar resultados
      const combinedData = {
        general: generalResponse.data,
        auth: authResponse.data
      };

      // Cachear resultado
      settingsCacheService.cacheSettings(filters, combinedData);

      return {
        success: true,
        data: combinedData
      };
    } catch (error: any) {
      return settingsErrorService.handleError(error);
    }
  }

  /**
   * Busca configuração específica
   */
  async getSetting(key: string): Promise<SettingsResponse> {
    try {
      // Tentar obter do cache primeiro
      const cachedSetting = settingsCacheService.getCachedSetting(key);
      if (cachedSetting) {
        return {
          success: true,
          data: cachedSetting
        };
      }

      // Determinar categoria baseada na chave
      const category = this.getCategoryFromKey(key);
      
      let response: SettingsResponse;
      switch (category) {
        case 'general':
          response = await generalSettingsService.getGeneralSettings({ search: key });
          break;
        case 'auth':
          response = await authSettingsService.getAuthSettings({ search: key });
          break;
        default:
          response = await generalSettingsService.getGeneralSettings({ search: key });
      }

      if (response.success && response.data) {
        settingsCacheService.cacheSetting(key, response.data);
      }

      return response;
    } catch (error: any) {
      return settingsErrorService.handleError(error);
    }
  }

  /**
   * Atualiza configuração
   */
  async updateSetting(key: string, value: any): Promise<SettingsResponse> {
    try {
      // Validar dados
      const validation = settingsOptimizationService.validateSetting(key, value);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Determinar categoria baseada na chave
      const category = this.getCategoryFromKey(key);
      
      let response: SettingsResponse;
      switch (category) {
        case 'general':
          response = await generalSettingsService.updateGeneralSetting(key, value);
          break;
        case 'auth':
          response = await authSettingsService.updateAuthSetting(key, value);
          break;
        default:
          response = await generalSettingsService.updateGeneralSetting(key, value);
      }

      if (response.success) {
        // Invalidar cache
        settingsCacheService.invalidateSetting(key);
        settingsCacheService.invalidateCategory(category);
      }

      return response;
    } catch (error: any) {
      return settingsErrorService.handleError(error);
    }
  }

  /**
   * Cria nova configuração
   */
  async createSetting(setting: Omit<Setting, 'id'>): Promise<SettingsResponse> {
    try {
      // Validar dados
      const validation = settingsOptimizationService.validateSetting(setting.key, setting.value);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      let response: SettingsResponse;
      switch (setting.category) {
        case 'general':
          response = await generalSettingsService.createGeneralSetting(setting);
          break;
        case 'security':
          response = await authSettingsService.updateAuthSetting(setting.key, setting.value);
          break;
        default:
          response = await generalSettingsService.createGeneralSetting(setting);
      }

      if (response.success) {
        // Invalidar cache
        settingsCacheService.invalidateCategory(setting.category);
      }

      return response;
    } catch (error: any) {
      return settingsErrorService.handleError(error);
    }
  }

  /**
   * Exclui configuração
   */
  async deleteSetting(key: string): Promise<SettingsResponse> {
    try {
      // Determinar categoria baseada na chave
      const category = this.getCategoryFromKey(key);
      
      let response: SettingsResponse;
      switch (category) {
        case 'general':
          response = await generalSettingsService.deleteGeneralSetting(key);
          break;
        case 'auth':
          response = await authSettingsService.updateAuthSetting(key, null);
          break;
        default:
          response = await generalSettingsService.deleteGeneralSetting(key);
      }

      if (response.success) {
        // Invalidar cache
        settingsCacheService.invalidateSetting(key);
        settingsCacheService.invalidateCategory(category);
      }

      return response;
    } catch (error: any) {
      return settingsErrorService.handleError(error);
    }
  }

  /**
   * Busca configurações por categoria
   */
  async getSettingsByCategory(category: string): Promise<SettingsResponse> {
    try {
      // Tentar obter do cache primeiro
      const cachedSettings = settingsCacheService.getCachedCategory(category);
      if (cachedSettings) {
        return {
          success: true,
          data: cachedSettings
        };
      }

      let response: SettingsResponse;
      switch (category) {
        case 'general':
          response = await generalSettingsService.getGeneralSettings();
          break;
        case 'auth':
        case 'security':
          response = await authSettingsService.getAuthSettings();
          break;
        default:
          response = await generalSettingsService.getGeneralSettings();
      }

      if (response.success && response.data) {
        settingsCacheService.cacheCategory(category, response.data);
      }

      return response;
    } catch (error: any) {
      return settingsErrorService.handleError(error);
    }
  }

  /**
   * Atualiza múltiplas configurações
   */
  async updateMultipleSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const results = [];
      const errors = [];

      for (const [key, value] of Object.entries(settings)) {
        const result = await this.updateSetting(key, value);
        if (result.success) {
          results.push({ key, success: true });
        } else {
          errors.push({ key, error: result.error });
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          error: `Erro ao atualizar ${errors.length} configurações`,
          data: { results, errors }
        };
      }

      return {
        success: true,
        data: { results, errors: [] }
      };
    } catch (error: any) {
      return settingsErrorService.handleError(error);
    }
  }

  /**
   * Exporta configurações
   */
  async exportSettings(format: 'json' | 'csv' = 'json'): Promise<SettingsResponse> {
    try {
      const response = await this.getSettings();
      if (!response.success) {
        return response;
      }

      const exportData = settingsOptimizationService.formatForExport(response.data, format);
      
      return {
        success: true,
        data: exportData
      };
    } catch (error: any) {
      return settingsErrorService.handleError(error);
    }
  }

  /**
   * Importa configurações
   */
  async importSettings(data: any): Promise<SettingsResponse> {
    try {
      const validation = settingsOptimizationService.validateImportData(data);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      const results = [];
      const errors = [];

      for (const setting of data) {
        const result = await this.updateSetting(setting.key, setting.value);
        if (result.success) {
          results.push({ key: setting.key, success: true });
        } else {
          errors.push({ key: setting.key, error: result.error });
        }
      }

      return {
        success: errors.length === 0,
        data: { results, errors },
        error: errors.length > 0 ? `Erro ao importar ${errors.length} configurações` : undefined
      };
    } catch (error: any) {
      return settingsErrorService.handleError(error);
    }
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    settingsCacheService.clear();
  }

  /**
   * Obtém informações do cache
   */
  getCacheInfo() {
    return settingsCacheService.getCacheInfo();
  }

  /**
   * Determina categoria baseada na chave
   */
  private getCategoryFromKey(key: string): string {
    const authKeys = ['2fa', 'oauth', 'session', 'password', 'lockout', 'ip', 'audit', 'captcha', 'sso'];
    const generalKeys = ['system', 'appearance', 'notification', 'backup', 'maintenance', 'cache', 'log', 'performance'];
    
    if (authKeys.some(authKey => key.includes(authKey))) {
      return 'auth';
    }
    
    if (generalKeys.some(generalKey => key.includes(generalKey))) {
      return 'general';
    }
    
    return 'general';
  }
}

export const settingsService = new SettingsService();
export default settingsService;
