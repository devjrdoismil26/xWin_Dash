/**
 * Service de Campanhas do módulo ADStool
 * Responsável pelo gerenciamento de campanhas de anúncios
 */

import { apiClient } from '@/services';
import { AdsCampaign, AdsCampaignStatus, AdsObjective, AdsTargeting, AdsResponse } from '../types';

class AdsCampaignService {
  private api = apiClient;

  /**
   * Busca todas as campanhas
   */
  async getCampaigns(accountId?: string): Promise<AdsResponse> {
    try {
      const params = accountId ? { account_id: accountId } : {};
      const response = await this.api.get('/adstool/campaigns', { params });
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
   * Busca campanha específica por ID
   */
  async getCampaignById(campaignId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/campaigns/${campaignId}`);
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
   * Cria nova campanha
   */
  async createCampaign(data: Partial<AdsCampaign>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/campaigns', data);
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
   * Atualiza campanha existente
   */
  async updateCampaign(campaignId: string, data: Partial<AdsCampaign>): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/campaigns/${campaignId}`, data);
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
   * Remove campanha
   */
  async deleteCampaign(campaignId: string): Promise<AdsResponse> {
    try {
      await this.api.delete(`/adstool/campaigns/${campaignId}`);
      return {
        success: true,
        message: 'Campanha removida com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza status da campanha
   */
  async updateCampaignStatus(campaignId: string, status: AdsCampaignStatus): Promise<AdsResponse> {
    try {
      const response = await this.api.patch(`/adstool/campaigns/${campaignId}/status`, { status });
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
   * Pausa campanha
   */
  async pauseCampaign(campaignId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/campaigns/${campaignId}/pause`);
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
   * Resume campanha
   */
  async resumeCampaign(campaignId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/campaigns/${campaignId}/resume`);
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
   * Duplica campanha
   */
  async duplicateCampaign(campaignId: string, newName?: string): Promise<AdsResponse> {
    try {
      const data = newName ? { name: newName } : {};
      const response = await this.api.post(`/adstool/campaigns/${campaignId}/duplicate`, data);
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
   * Busca campanhas por status
   */
  async getCampaignsByStatus(status: AdsCampaignStatus): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/campaigns/status/${status}`);
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
   * Busca campanhas por objetivo
   */
  async getCampaignsByObjective(objective: AdsObjective): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/campaigns/objective/${objective}`);
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
   * Busca campanhas por conta
   */
  async getCampaignsByAccount(accountId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/campaigns/account/${accountId}`);
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
   * Atualiza orçamento da campanha
   */
  async updateCampaignBudget(campaignId: string, budget: number): Promise<AdsResponse> {
    try {
      const response = await this.api.patch(`/adstool/campaigns/${campaignId}/budget`, { budget });
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
   * Atualiza targeting da campanha
   */
  async updateCampaignTargeting(campaignId: string, targeting: AdsTargeting): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/campaigns/${campaignId}/targeting`, targeting);
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
   * Busca estatísticas da campanha
   */
  async getCampaignStats(campaignId: string, period?: string): Promise<AdsResponse> {
    try {
      const params = period ? { period } : {};
      const response = await this.api.get(`/adstool/campaigns/${campaignId}/stats`, { params });
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
   * Otimiza campanha automaticamente
   */
  async optimizeCampaign(campaignId: string, options?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/campaigns/${campaignId}/optimize`, options);
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
   * Busca sugestões de otimização
   */
  async getOptimizationSuggestions(campaignId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/campaigns/${campaignId}/suggestions`);
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
   * Aplica sugestão de otimização
   */
  async applyOptimizationSuggestion(campaignId: string, suggestionId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/campaigns/${campaignId}/suggestions/${suggestionId}/apply`);
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
   * Busca histórico de campanha
   */
  async getCampaignHistory(campaignId: string, limit?: number): Promise<AdsResponse> {
    try {
      const params = limit ? { limit } : {};
      const response = await this.api.get(`/adstool/campaigns/${campaignId}/history`, { params });
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
   * Cria campanha a partir de template
   */
  async createCampaignFromTemplate(templateId: string, data: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/campaigns/template/${templateId}`, data);
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

export const adsCampaignService = new AdsCampaignService();
export default adsCampaignService;
