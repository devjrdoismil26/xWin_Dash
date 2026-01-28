/**
 * Service de Criativos do módulo ADStool
 * Responsável pelo gerenciamento de criativos de anúncios
 */

import { apiClient } from '@/services';
import { AdsCreative, AdsCreativeType, AdsCreativeStatus, AdsCreativeContent, AdsResponse } from '../types';

class AdsCreativeService {
  private api = apiClient;

  /**
   * Busca todos os criativos
   */
  async getCreatives(campaignId?: string): Promise<AdsResponse> {
    try {
      const params = campaignId ? { campaign_id: campaignId } : {};
      const response = await this.api.get('/adstool/creatives', { params });
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
   * Busca criativo específico por ID
   */
  async getCreativeById(creativeId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/creatives/${creativeId}`);
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
   * Cria novo criativo
   */
  async createCreative(data: Partial<AdsCreative>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/creatives', data);
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
   * Atualiza criativo existente
   */
  async updateCreative(creativeId: string, data: Partial<AdsCreative>): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/creatives/${creativeId}`, data);
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
   * Remove criativo
   */
  async deleteCreative(creativeId: string): Promise<AdsResponse> {
    try {
      await this.api.delete(`/adstool/creatives/${creativeId}`);
      return {
        success: true,
        message: 'Criativo removido com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Atualiza status do criativo
   */
  async updateCreativeStatus(creativeId: string, status: AdsCreativeStatus): Promise<AdsResponse> {
    try {
      const response = await this.api.patch(`/adstool/creatives/${creativeId}/status`, { status });
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
   * Aprova criativo
   */
  async approveCreative(creativeId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/creatives/${creativeId}/approve`);
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
   * Rejeita criativo
   */
  async rejectCreative(creativeId: string, reason?: string): Promise<AdsResponse> {
    try {
      const data = reason ? { reason } : {};
      const response = await this.api.post(`/adstool/creatives/${creativeId}/reject`, data);
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
   * Duplica criativo
   */
  async duplicateCreative(creativeId: string, newName?: string): Promise<AdsResponse> {
    try {
      const data = newName ? { name: newName } : {};
      const response = await this.api.post(`/adstool/creatives/${creativeId}/duplicate`, data);
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
   * Busca criativos por tipo
   */
  async getCreativesByType(type: AdsCreativeType): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/creatives/type/${type}`);
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
   * Busca criativos por status
   */
  async getCreativesByStatus(status: AdsCreativeStatus): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/creatives/status/${status}`);
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
   * Busca criativos por campanha
   */
  async getCreativesByCampaign(campaignId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/creatives/campaign/${campaignId}`);
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
   * Atualiza conteúdo do criativo
   */
  async updateCreativeContent(creativeId: string, content: AdsCreativeContent): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/creatives/${creativeId}/content`, content);
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
   * Upload de mídia para criativo
   */
  async uploadCreativeMedia(creativeId: string, file: File, type: string): Promise<AdsResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await this.api.post(`/adstool/creatives/${creativeId}/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
   * Busca estatísticas do criativo
   */
  async getCreativeStats(creativeId: string, period?: string): Promise<AdsResponse> {
    try {
      const params = period ? { period } : {};
      const response = await this.api.get(`/adstool/creatives/${creativeId}/stats`, { params });
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
   * Testa criativo
   */
  async testCreative(creativeId: string, testData?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/creatives/${creativeId}/test`, testData);
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
   * Gera preview do criativo
   */
  async generateCreativePreview(creativeId: string, platform?: string): Promise<AdsResponse> {
    try {
      const params = platform ? { platform } : {};
      const response = await this.api.get(`/adstool/creatives/${creativeId}/preview`, { params });
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
   * Busca sugestões de criativo
   */
  async getCreativeSuggestions(campaignId: string, objective?: string): Promise<AdsResponse> {
    try {
      const params = objective ? { objective } : {};
      const response = await this.api.get(`/adstool/creatives/suggestions/${campaignId}`, { params });
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
   * Aplica sugestão de criativo
   */
  async applyCreativeSuggestion(creativeId: string, suggestionId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/creatives/${creativeId}/suggestions/${suggestionId}/apply`);
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
   * Busca histórico do criativo
   */
  async getCreativeHistory(creativeId: string, limit?: number): Promise<AdsResponse> {
    try {
      const params = limit ? { limit } : {};
      const response = await this.api.get(`/adstool/creatives/${creativeId}/history`, { params });
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
   * Cria criativo a partir de template
   */
  async createCreativeFromTemplate(templateId: string, data: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/creatives/template/${templateId}`, data);
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
   * Valida criativo
   */
  async validateCreative(creativeId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/creatives/${creativeId}/validate`);
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

export const adsCreativeService = new AdsCreativeService();
export default adsCreativeService;
