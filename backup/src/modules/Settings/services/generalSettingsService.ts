/**
 * Serviço especializado para configurações gerais
 * Gerencia configurações básicas do sistema
 */

import { apiClient } from '@/services';
import { Setting, SettingsResponse, SettingsFilters } from '../types';

class GeneralSettingsService {
  private api = apiClient;

  /**
   * Busca configurações gerais
   */
  async getGeneralSettings(filters: SettingsFilters = {}): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/general', { params: filters });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza configuração geral
   */
  async updateGeneralSetting(key: string, value: any): Promise<SettingsResponse> {
    try {
      const response = await this.api.put(`/settings/general/${key}`, { value });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cria nova configuração geral
   */
  async createGeneralSetting(setting: Omit<Setting, 'id'>): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/settings/general', setting);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Exclui configuração geral
   */
  async deleteGeneralSetting(key: string): Promise<SettingsResponse> {
    try {
      await this.api.delete(`/settings/general/${key}`);
      return {
        success: true,
        data: { deleted: true }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca configurações de sistema
   */
  async getSystemSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/system');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza configurações de sistema
   */
  async updateSystemSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/system', settings);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca configurações de aparência
   */
  async getAppearanceSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/appearance');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza configurações de aparência
   */
  async updateAppearanceSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/appearance', settings);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca configurações de notificações
   */
  async getNotificationSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/notifications');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza configurações de notificações
   */
  async updateNotificationSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/notifications', settings);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca configurações de backup
   */
  async getBackupSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/backup');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza configurações de backup
   */
  async updateBackupSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/backup', settings);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Executa backup manual
   */
  async executeBackup(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/settings/backup/execute');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Restaura backup
   */
  async restoreBackup(backupId: string): Promise<SettingsResponse> {
    try {
      const response = await this.api.post(`/settings/backup/restore/${backupId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca configurações de manutenção
   */
  async getMaintenanceSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/maintenance');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza configurações de manutenção
   */
  async updateMaintenanceSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/maintenance', settings);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Ativa modo de manutenção
   */
  async enableMaintenanceMode(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/settings/maintenance/enable');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Desativa modo de manutenção
   */
  async disableMaintenanceMode(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/settings/maintenance/disable');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca configurações de cache
   */
  async getCacheSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/cache');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza configurações de cache
   */
  async updateCacheSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/cache', settings);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Limpa cache
   */
  async clearCache(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/settings/cache/clear');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca configurações de logs
   */
  async getLogSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/logs');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza configurações de logs
   */
  async updateLogSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/logs', settings);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca configurações de performance
   */
  async getPerformanceSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/performance');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza configurações de performance
   */
  async updatePerformanceSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/performance', settings);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const generalSettingsService = new GeneralSettingsService();
export default generalSettingsService;
