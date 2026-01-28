/**
 * Service de Templates do módulo ADStool
 * Responsável pelo gerenciamento de templates e otimizações
 */

import { apiClient } from '@/services';
import { AdsResponse } from '../types';

interface AdsTemplate {
  id: string;
  name: string;
  type: 'campaign' | 'creative' | 'account';
  platform: string;
  category: string;
  description: string;
  content: any;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface AdsOptimization {
  id: string;
  name: string;
  type: string;
  rules: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class AdsTemplateService {
  private api = apiClient;

  /**
   * Busca todos os templates
   */
  async getTemplates(type?: string, platform?: string): Promise<AdsResponse> {
    try {
      const params: any = {};
      if (type) params.type = type;
      if (platform) params.platform = platform;
      
      const response = await this.api.get('/adstool/templates', { params });
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
   * Busca template específico por ID
   */
  async getTemplateById(templateId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/templates/${templateId}`);
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
   * Cria novo template
   */
  async createTemplate(data: Partial<AdsTemplate>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/templates', data);
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
   * Atualiza template existente
   */
  async updateTemplate(templateId: string, data: Partial<AdsTemplate>): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/templates/${templateId}`, data);
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
   * Remove template
   */
  async deleteTemplate(templateId: string): Promise<AdsResponse> {
    try {
      await this.api.delete(`/adstool/templates/${templateId}`);
      return {
        success: true,
        message: 'Template removido com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Duplica template
   */
  async duplicateTemplate(templateId: string, newName?: string): Promise<AdsResponse> {
    try {
      const data = newName ? { name: newName } : {};
      const response = await this.api.post(`/adstool/templates/${templateId}/duplicate`, data);
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
   * Busca templates por categoria
   */
  async getTemplatesByCategory(category: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/templates/category/${category}`);
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
   * Busca templates por plataforma
   */
  async getTemplatesByPlatform(platform: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/templates/platform/${platform}`);
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
   * Busca templates públicos
   */
  async getPublicTemplates(): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/templates/public');
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
   * Busca templates do usuário
   */
  async getUserTemplates(): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/templates/user');
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
   * Aplica template
   */
  async applyTemplate(templateId: string, targetId: string, customizations?: any): Promise<AdsResponse> {
    try {
      const data = {
        target_id: targetId,
        customizations
      };
      const response = await this.api.post(`/adstool/templates/${templateId}/apply`, data);
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
   * Busca otimizações
   */
  async getOptimizations(): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/optimizations');
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
   * Cria nova otimização
   */
  async createOptimization(data: Partial<AdsOptimization>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/optimizations', data);
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
   * Atualiza otimização
   */
  async updateOptimization(optimizationId: string, data: Partial<AdsOptimization>): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/optimizations/${optimizationId}`, data);
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
   * Remove otimização
   */
  async deleteOptimization(optimizationId: string): Promise<AdsResponse> {
    try {
      await this.api.delete(`/adstool/optimizations/${optimizationId}`);
      return {
        success: true,
        message: 'Otimização removida com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Ativa/desativa otimização
   */
  async toggleOptimization(optimizationId: string, isActive: boolean): Promise<AdsResponse> {
    try {
      const response = await this.api.patch(`/adstool/optimizations/${optimizationId}/toggle`, { is_active: isActive });
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
   * Aplica otimização
   */
  async applyOptimization(optimizationId: string, targetIds: string[]): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/optimizations/${optimizationId}/apply`, { target_ids: targetIds });
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
   * Busca sugestões de templates
   */
  async getTemplateSuggestions(criteria: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/templates/suggestions', criteria);
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
  async getOptimizationSuggestions(targetId: string, type: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/optimizations/suggestions/${targetId}`, { 
        params: { type } 
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
   * Busca histórico de templates
   */
  async getTemplateHistory(templateId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/templates/${templateId}/history`);
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
   * Busca histórico de otimizações
   */
  async getOptimizationHistory(optimizationId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/optimizations/${optimizationId}/history`);
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
   * Valida template
   */
  async validateTemplate(templateId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/templates/${templateId}/validate`);
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
   * Testa template
   */
  async testTemplate(templateId: string, testData?: any): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/templates/${templateId}/test`, testData);
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

export const adsTemplateService = new AdsTemplateService();
export default adsTemplateService;
