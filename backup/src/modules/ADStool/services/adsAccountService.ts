/**
 * Service de Contas do módulo ADStool
 * Responsável pelo gerenciamento de contas de anúncios
 */

import { apiClient } from '@/services';
import { AdsAccount, AdsAccountStatus, AdsPlatform, AdsResponse } from '../types';

class AdsAccountService {
  private api = apiClient;

  /**
   * Busca todas as contas
   */
  async getAccounts(): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/accounts');
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
   * Busca conta específica por ID
   */
  async getAccountById(accountId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/accounts/${accountId}`);
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
   * Cria nova conta
   */
  async createAccount(data: Partial<AdsAccount>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/accounts', data);
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
   * Atualiza conta existente
   */
  async updateAccount(accountId: string, data: Partial<AdsAccount>): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/accounts/${accountId}`, data);
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
   * Remove conta
   */
  async deleteAccount(accountId: string): Promise<AdsResponse> {
    try {
      await this.api.delete(`/adstool/accounts/${accountId}`);
      return {
        success: true,
        message: 'Conta removida com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Conecta conta com plataforma
   */
  async connectAccount(platform: AdsPlatform, credentials: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/accounts/connect', {
        platform,
        credentials
      });
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
   * Desconecta conta
   */
  async disconnectAccount(accountId: string): Promise<AdsResponse> {
    try {
      await this.api.post(`/adstool/accounts/${accountId}/disconnect`);
      return {
        success: true,
        message: 'Conta desconectada com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza status da conta
   */
  async updateAccountStatus(accountId: string, status: AdsAccountStatus): Promise<AdsResponse> {
    try {
      const response = await this.api.patch(`/adstool/accounts/${accountId}/status`, { status });
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
   * Sincroniza dados da conta
   */
  async syncAccount(accountId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/accounts/${accountId}/sync`);
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
   * Busca contas por plataforma
   */
  async getAccountsByPlatform(platform: AdsPlatform): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/accounts/platform/${platform}`);
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
   * Busca contas por status
   */
  async getAccountsByStatus(status: AdsAccountStatus): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/accounts/status/${status}`);
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
   * Valida credenciais da conta
   */
  async validateAccountCredentials(platform: AdsPlatform, credentials: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/accounts/validate', {
        platform,
        credentials
      });
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
   * Busca estatísticas da conta
   */
  async getAccountStats(accountId: string, period?: string): Promise<AdsResponse> {
    try {
      const params = period ? { period } : {};
      const response = await this.api.get(`/adstool/accounts/${accountId}/stats`, { params });
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
   * Atualiza orçamento da conta
   */
  async updateAccountBudget(accountId: string, budget: number): Promise<AdsResponse> {
    try {
      const response = await this.api.patch(`/adstool/accounts/${accountId}/budget`, { budget });
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
   * Busca configurações da conta
   */
  async getAccountSettings(accountId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/accounts/${accountId}/settings`);
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
   * Atualiza configurações da conta
   */
  async updateAccountSettings(accountId: string, settings: any): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/accounts/${accountId}/settings`, settings);
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
   * Testa conexão da conta
   */
  async testAccountConnection(accountId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/accounts/${accountId}/test`);
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
   * Busca histórico de atividades da conta
   */
  async getAccountActivity(accountId: string, limit?: number): Promise<AdsResponse> {
    try {
      const params = limit ? { limit } : {};
      const response = await this.api.get(`/adstool/accounts/${accountId}/activity`, { params });
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

export const adsAccountService = new AdsAccountService();
export default adsAccountService;
