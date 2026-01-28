import { apiClient } from '@/services';
import {
  Workflow,
  WorkflowStatus,
  WorkflowTrigger,
  WorkflowStep,
  WorkflowCanvasData,
  WorkflowValidationResult
} from '../types/workflowTypes';

// Cache para workflows
const workflowCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Interface para parâmetros de busca
export interface WorkflowSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: WorkflowStatus;
  trigger_type?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Interface para resposta paginada
export interface WorkflowPaginatedResponse {
  data: Workflow[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Interface para criação de workflow
export interface CreateWorkflowData {
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  canvas_data?: WorkflowCanvasData;
  is_active?: boolean;
}

// Interface para atualização de workflow
export interface UpdateWorkflowData {
  name?: string;
  description?: string;
  trigger?: WorkflowTrigger;
  steps?: WorkflowStep[];
  canvas_data?: WorkflowCanvasData;
  is_active?: boolean;
}

/**
 * Service para gerenciamento de workflows
 * Responsável por operações CRUD básicas de workflows
 */
class WorkflowManagementService {
  private baseUrl = '/api/workflows';

  /**
   * Busca workflows com filtros e paginação
   */
  async getWorkflows(params: WorkflowSearchParams = {}): Promise<WorkflowPaginatedResponse> {
    try {
      const cacheKey = `workflows_${JSON.stringify(params)}`;
      const cached = workflowCache.get(cacheKey);
      
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
      workflowCache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar workflows:', error);
      throw new Error('Falha ao carregar workflows');
    }
  }

  /**
   * Busca um workflow específico por ID
   */
  async getWorkflowById(id: number): Promise<Workflow> {
    try {
      const cacheKey = `workflow_${id}`;
      const cached = workflowCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      
      // Cache do resultado
      workflowCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar workflow ${id}:`, error);
      throw new Error('Falha ao carregar workflow');
    }
  }

  /**
   * Cria um novo workflow
   */
  async createWorkflow(data: CreateWorkflowData): Promise<Workflow> {
    try {
      // Validação básica
      this.validateWorkflowData(data);

      const response = await apiClient.post(this.baseUrl, data);
      
      // Limpar cache relacionado
      this.clearWorkflowCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar workflow:', error);
      throw new Error('Falha ao criar workflow');
    }
  }

  /**
   * Atualiza um workflow existente
   */
  async updateWorkflow(id: number, data: UpdateWorkflowData): Promise<Workflow> {
    try {
      // Validação básica
      if (data.name !== undefined) {
        this.validateWorkflowName(data.name);
      }

      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
      
      // Limpar cache relacionado
      this.clearWorkflowCache();
      workflowCache.delete(`workflow_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar workflow ${id}:`, error);
      throw new Error('Falha ao atualizar workflow');
    }
  }

  /**
   * Remove um workflow
   */
  async deleteWorkflow(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
      
      // Limpar cache relacionado
      this.clearWorkflowCache();
      workflowCache.delete(`workflow_${id}`);
    } catch (error) {
      console.error(`Erro ao remover workflow ${id}:`, error);
      throw new Error('Falha ao remover workflow');
    }
  }

  /**
   * Duplica um workflow existente
   */
  async duplicateWorkflow(id: number, newName?: string): Promise<Workflow> {
    try {
      const originalWorkflow = await this.getWorkflowById(id);
      
      const duplicateData: CreateWorkflowData = {
        name: newName || `${originalWorkflow.name} (Cópia)`,
        description: originalWorkflow.description,
        trigger: originalWorkflow.trigger,
        steps: originalWorkflow.steps,
        canvas_data: originalWorkflow.canvas_data,
        is_active: false // Duplicatas começam inativas
      };

      return await this.createWorkflow(duplicateData);
    } catch (error) {
      console.error(`Erro ao duplicar workflow ${id}:`, error);
      throw new Error('Falha ao duplicar workflow');
    }
  }

  /**
   * Ativa/desativa um workflow
   */
  async toggleWorkflowStatus(id: number): Promise<Workflow> {
    try {
      const workflow = await this.getWorkflowById(id);
      return await this.updateWorkflow(id, { is_active: !workflow.is_active });
    } catch (error) {
      console.error(`Erro ao alterar status do workflow ${id}:`, error);
      throw new Error('Falha ao alterar status do workflow');
    }
  }

  /**
   * Busca workflows por status
   */
  async getWorkflowsByStatus(status: WorkflowStatus): Promise<Workflow[]> {
    try {
      const result = await this.getWorkflows({ status, limit: 1000 });
      return result.data;
    } catch (error) {
      console.error(`Erro ao buscar workflows por status ${status}:`, error);
      throw new Error('Falha ao buscar workflows por status');
    }
  }

  /**
   * Busca workflows ativos
   */
  async getActiveWorkflows(): Promise<Workflow[]> {
    return this.getWorkflowsByStatus('active');
  }

  /**
   * Busca workflows em rascunho
   */
  async getDraftWorkflows(): Promise<Workflow[]> {
    return this.getWorkflowsByStatus('draft');
  }

  /**
   * Valida dados básicos do workflow
   */
  private validateWorkflowData(data: CreateWorkflowData): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Nome do workflow é obrigatório');
    }

    if (data.name.length > 100) {
      throw new Error('Nome do workflow deve ter no máximo 100 caracteres');
    }

    if (!data.trigger) {
      throw new Error('Trigger do workflow é obrigatório');
    }

    if (!data.steps || data.steps.length === 0) {
      throw new Error('Workflow deve ter pelo menos um step');
    }
  }

  /**
   * Valida nome do workflow
   */
  private validateWorkflowName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome do workflow é obrigatório');
    }

    if (name.length > 100) {
      throw new Error('Nome do workflow deve ter no máximo 100 caracteres');
    }
  }

  /**
   * Limpa cache de workflows
   */
  private clearWorkflowCache(): void {
    workflowCache.clear();
  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of workflowCache.keys()) {
        if (key.includes(pattern)) {
          workflowCache.delete(key);
        }
      }
    } else {
      workflowCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: workflowCache.size,
      keys: Array.from(workflowCache.keys())
    };
  }
}

// Instância singleton
export const workflowManagementService = new WorkflowManagementService();
export default workflowManagementService;
