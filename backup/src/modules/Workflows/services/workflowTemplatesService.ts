import { apiClient } from '@/services';
import {
  WorkflowTemplate,
  WorkflowCanvasData,
  WorkflowStep,
  WorkflowTrigger
} from '../types/workflowTypes';

// Cache para templates
const templateCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos (templates mudam menos frequentemente)

// Interface para criação de template
export interface CreateTemplateData {
  name: string;
  description: string;
  category: string;
  tags: string[];
  is_public: boolean;
  template_data: WorkflowCanvasData;
  preview_image?: string;
}

// Interface para atualização de template
export interface UpdateTemplateData {
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  is_public?: boolean;
  template_data?: WorkflowCanvasData;
  preview_image?: string;
}

// Interface para busca de templates
export interface TemplateSearchParams {
  category?: string;
  tags?: string[];
  is_public?: boolean;
  created_by?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'usage_count' | 'rating';
  sort_order?: 'asc' | 'desc';
}

// Interface para resposta paginada de templates
export interface TemplatePaginatedResponse {
  data: WorkflowTemplate[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Interface para categorias de templates
export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  template_count: number;
  is_active: boolean;
}

// Interface para uso de template
export interface UseTemplateParams {
  template_id: string;
  workflow_name: string;
  workflow_description?: string;
  variables?: Record<string, any>;
}

/**
 * Service para gerenciamento de templates de workflow
 * Responsável por criação, busca e uso de templates
 */
class WorkflowTemplatesService {
  private baseUrl = '/api/workflow-templates';

  /**
   * Obtém templates com filtros
   */
  async getTemplates(params: TemplateSearchParams = {}): Promise<TemplatePaginatedResponse> {
    try {
      const cacheKey = `templates_${JSON.stringify(params)}`;
      const cached = templateCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl, { params });
      
      const result = {
        data: response.data.data || response.data,
        total: response.data.total || response.data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || response.data.length) / (params.limit || 10))
      };

      // Cache do resultado
      templateCache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      throw new Error('Falha ao carregar templates');
    }
  }

  /**
   * Obtém um template específico por ID
   */
  async getTemplateById(templateId: string): Promise<WorkflowTemplate> {
    try {
      const cacheKey = `template_${templateId}`;
      const cached = templateCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${templateId}`);
      
      // Cache do resultado
      templateCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar template ${templateId}:`, error);
      throw new Error('Falha ao carregar template');
    }
  }

  /**
   * Cria um novo template
   */
  async createTemplate(data: CreateTemplateData): Promise<WorkflowTemplate> {
    try {
      // Validação básica
      this.validateTemplateData(data);

      const response = await apiClient.post(this.baseUrl, data);
      
      // Limpar cache relacionado
      this.clearTemplateCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar template:', error);
      throw new Error('Falha ao criar template');
    }
  }

  /**
   * Atualiza um template existente
   */
  async updateTemplate(templateId: string, data: UpdateTemplateData): Promise<WorkflowTemplate> {
    try {
      // Validação básica
      if (data.name !== undefined) {
        this.validateTemplateName(data.name);
      }

      const response = await apiClient.put(`${this.baseUrl}/${templateId}`, data);
      
      // Limpar cache relacionado
      this.clearTemplateCache();
      templateCache.delete(`template_${templateId}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar template ${templateId}:`, error);
      throw new Error('Falha ao atualizar template');
    }
  }

  /**
   * Remove um template
   */
  async deleteTemplate(templateId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${templateId}`);
      
      // Limpar cache relacionado
      this.clearTemplateCache();
      templateCache.delete(`template_${templateId}`);
    } catch (error) {
      console.error(`Erro ao remover template ${templateId}:`, error);
      throw new Error('Falha ao remover template');
    }
  }

  /**
   * Usa um template para criar um workflow
   */
  async useTemplate(params: UseTemplateParams): Promise<{
    workflow_id: number;
    workflow_name: string;
    message: string;
  }> {
    try {
      // Validação básica
      this.validateUseTemplateParams(params);

      const response = await apiClient.post(`${this.baseUrl}/${params.template_id}/use`, {
        workflow_name: params.workflow_name,
        workflow_description: params.workflow_description,
        variables: params.variables
      });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao usar template ${params.template_id}:`, error);
      throw new Error('Falha ao usar template');
    }
  }

  /**
   * Obtém templates por categoria
   */
  async getTemplatesByCategory(category: string, params: Omit<TemplateSearchParams, 'category'> = {}): Promise<TemplatePaginatedResponse> {
    return this.getTemplates({ ...params, category });
  }

  /**
   * Obtém templates públicos
   */
  async getPublicTemplates(params: Omit<TemplateSearchParams, 'is_public'> = {}): Promise<TemplatePaginatedResponse> {
    return this.getTemplates({ ...params, is_public: true });
  }

  /**
   * Obtém templates do usuário atual
   */
  async getUserTemplates(params: Omit<TemplateSearchParams, 'created_by'> = {}): Promise<TemplatePaginatedResponse> {
    return this.getTemplates({ ...params, created_by: 'me' });
  }

  /**
   * Obtém templates mais populares
   */
  async getPopularTemplates(limit: number = 10): Promise<WorkflowTemplate[]> {
    try {
      const result = await this.getTemplates({
        sort_by: 'usage_count',
        sort_order: 'desc',
        limit
      });
      return result.data;
    } catch (error) {
      console.error('Erro ao buscar templates populares:', error);
      throw new Error('Falha ao buscar templates populares');
    }
  }

  /**
   * Obtém templates mais bem avaliados
   */
  async getTopRatedTemplates(limit: number = 10): Promise<WorkflowTemplate[]> {
    try {
      const result = await this.getTemplates({
        sort_by: 'rating',
        sort_order: 'desc',
        limit
      });
      return result.data;
    } catch (error) {
      console.error('Erro ao buscar templates mais bem avaliados:', error);
      throw new Error('Falha ao buscar templates mais bem avaliados');
    }
  }

  /**
   * Obtém categorias de templates
   */
  async getTemplateCategories(): Promise<TemplateCategory[]> {
    try {
      const cacheKey = 'template_categories';
      const cached = templateCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/categories`);
      
      // Cache do resultado
      templateCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias de templates:', error);
      throw new Error('Falha ao buscar categorias de templates');
    }
  }

  /**
   * Avalia um template
   */
  async rateTemplate(templateId: string, rating: number, comment?: string): Promise<void> {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Avaliação deve ser entre 1 e 5');
      }

      await apiClient.post(`${this.baseUrl}/${templateId}/rate`, {
        rating,
        comment
      });
      
      // Limpar cache relacionado
      templateCache.delete(`template_${templateId}`);
    } catch (error) {
      console.error(`Erro ao avaliar template ${templateId}:`, error);
      throw new Error('Falha ao avaliar template');
    }
  }

  /**
   * Duplica um template
   */
  async duplicateTemplate(templateId: string, newName?: string): Promise<WorkflowTemplate> {
    try {
      const originalTemplate = await this.getTemplateById(templateId);
      
      const duplicateData: CreateTemplateData = {
        name: newName || `${originalTemplate.name} (Cópia)`,
        description: originalTemplate.description,
        category: originalTemplate.category,
        tags: originalTemplate.tags,
        is_public: false, // Duplicatas começam privadas
        template_data: originalTemplate.template_data,
        preview_image: originalTemplate.preview_image
      };

      return await this.createTemplate(duplicateData);
    } catch (error) {
      console.error(`Erro ao duplicar template ${templateId}:`, error);
      throw new Error('Falha ao duplicar template');
    }
  }

  /**
   * Exporta um template
   */
  async exportTemplate(templateId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${templateId}/export`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao exportar template ${templateId}:`, error);
      throw new Error('Falha ao exportar template');
    }
  }

  /**
   * Importa um template
   */
  async importTemplate(file: File): Promise<WorkflowTemplate> {
    try {
      const formData = new FormData();
      formData.append('template_file', file);

      const response = await apiClient.post(`${this.baseUrl}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Limpar cache relacionado
      this.clearTemplateCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao importar template:', error);
      throw new Error('Falha ao importar template');
    }
  }

  /**
   * Valida dados do template
   */
  private validateTemplateData(data: CreateTemplateData): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Nome do template é obrigatório');
    }

    if (data.name.length > 100) {
      throw new Error('Nome do template deve ter no máximo 100 caracteres');
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new Error('Descrição do template é obrigatória');
    }

    if (!data.category || data.category.trim().length === 0) {
      throw new Error('Categoria do template é obrigatória');
    }

    if (!data.template_data) {
      throw new Error('Dados do template são obrigatórios');
    }
  }

  /**
   * Valida nome do template
   */
  private validateTemplateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome do template é obrigatório');
    }

    if (name.length > 100) {
      throw new Error('Nome do template deve ter no máximo 100 caracteres');
    }
  }

  /**
   * Valida parâmetros de uso de template
   */
  private validateUseTemplateParams(params: UseTemplateParams): void {
    if (!params.template_id) {
      throw new Error('ID do template é obrigatório');
    }

    if (!params.workflow_name || params.workflow_name.trim().length === 0) {
      throw new Error('Nome do workflow é obrigatório');
    }

    if (params.workflow_name.length > 100) {
      throw new Error('Nome do workflow deve ter no máximo 100 caracteres');
    }
  }

  /**
   * Limpa cache de templates
   */
  private clearTemplateCache(): void {
    templateCache.clear();
  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of templateCache.keys()) {
        if (key.includes(pattern)) {
          templateCache.delete(key);
        }
      }
    } else {
      templateCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: templateCache.size,
      keys: Array.from(templateCache.keys())
    };
  }
}

// Instância singleton
export const workflowTemplatesService = new WorkflowTemplatesService();
export default workflowTemplatesService;
