/**
 * Serviço especializado para configurações de autenticação
 * Gerencia configurações de segurança e autenticação
 */

import { apiClient } from '@/services';
import { Setting, SettingsResponse, SettingsFilters } from '../types';

class AuthSettingsService {
  private api = apiClient;

  /**
   * Busca configurações de autenticação
   */
  async getAuthSettings(filters: SettingsFilters = {}): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/auth', { params: filters });
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
   * Atualiza configuração de autenticação
   */
  async updateAuthSetting(key: string, value: any): Promise<SettingsResponse> {
    try {
      const response = await this.api.put(`/settings/auth/${key}`, { value });
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
   * Busca configurações de 2FA
   */
  async get2FASettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/auth/2fa');
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
   * Atualiza configurações de 2FA
   */
  async update2FASettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/auth/2fa', settings);
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
   * Ativa 2FA
   */
  async enable2FA(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/settings/auth/2fa/enable');
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
   * Desativa 2FA
   */
  async disable2FA(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/settings/auth/2fa/disable');
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
   * Busca configurações de OAuth
   */
  async getOAuthSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/auth/oauth');
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
   * Atualiza configurações de OAuth
   */
  async updateOAuthSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/auth/oauth', settings);
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
   * Ativa OAuth
   */
  async enableOAuth(provider: string): Promise<SettingsResponse> {
    try {
      const response = await this.api.post(`/settings/auth/oauth/${provider}/enable`);
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
   * Desativa OAuth
   */
  async disableOAuth(provider: string): Promise<SettingsResponse> {
    try {
      const response = await this.api.post(`/settings/auth/oauth/${provider}/disable`);
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
   * Busca configurações de sessão
   */
  async getSessionSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/auth/session');
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
   * Atualiza configurações de sessão
   */
  async updateSessionSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/auth/session', settings);
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
   * Busca configurações de senha
   */
  async getPasswordSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/auth/password');
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
   * Atualiza configurações de senha
   */
  async updatePasswordSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/auth/password', settings);
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
   * Busca configurações de bloqueio de conta
   */
  async getAccountLockoutSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/auth/account-lockout');
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
   * Atualiza configurações de bloqueio de conta
   */
  async updateAccountLockoutSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/auth/account-lockout', settings);
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
   * Busca configurações de IP
   */
  async getIPSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/auth/ip');
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
   * Atualiza configurações de IP
   */
  async updateIPSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/auth/ip', settings);
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
   * Busca configurações de auditoria
   */
  async getAuditSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/auth/audit');
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
   * Atualiza configurações de auditoria
   */
  async updateAuditSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/auth/audit', settings);
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
   * Busca configurações de captcha
   */
  async getCaptchaSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/auth/captcha');
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
   * Atualiza configurações de captcha
   */
  async updateCaptchaSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/auth/captcha', settings);
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
   * Ativa captcha
   */
  async enableCaptcha(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/settings/auth/captcha/enable');
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
   * Desativa captcha
   */
  async disableCaptcha(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/settings/auth/captcha/disable');
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
   * Busca configurações de SSO
   */
  async getSSOSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/settings/auth/sso');
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
   * Atualiza configurações de SSO
   */
  async updateSSOSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/settings/auth/sso', settings);
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
   * Ativa SSO
   */
  async enableSSO(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/settings/auth/sso/enable');
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
   * Desativa SSO
   */
  async disableSSO(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/settings/auth/sso/disable');
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

export const authSettingsService = new AuthSettingsService();
export default authSettingsService;
