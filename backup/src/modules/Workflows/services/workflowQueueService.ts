import { apiClient } from '@/services';
import {
  WorkflowExecutionQueue,
  WorkflowExecutionQueueStatus,
  WorkflowExecutionPriority,
  WorkflowExecutionQueueStats,
  WorkflowExecutionQueueFilter,
  WorkflowExecutionQueueSort,
  WorkflowExecutionQueuePagination,
  WorkflowExecutionQueueResponse,
  WorkflowQueueProcessResult,
  WorkflowQueueRetryResult,
  WorkflowQueueClearResult,
  WorkflowQueueStatus
} from '../types/workflowTypes';

// Cache para filas
const queueCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1 * 60 * 1000; // 1 minuto (filas mudam frequentemente)

// Interface para adicionar à fila
export interface AddToQueueParams {
  workflow_id: number;
  variables?: Record<string, any>;
  priority?: WorkflowExecutionPriority;
  scheduled_at?: string;
  timeout?: number;
  retry_count?: number;
}

// Interface para atualizar item da fila
export interface UpdateQueueItemParams {
  priority?: WorkflowExecutionPriority;
  scheduled_at?: string;
  variables?: Record<string, any>;
}

// Interface para filtros de fila
export interface QueueFilterParams {
  status?: WorkflowExecutionQueueStatus;
  priority?: WorkflowExecutionPriority;
  workflow_id?: number;
  created_after?: string;
  created_before?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Service para gerenciamento de filas de execução
 * Responsável por operações de fila, priorização e processamento
 */
class WorkflowQueueService {
  private baseUrl = '/api/workflow-queue';

  /**
   * Obtém a fila de execuções
   */
  async getExecutionQueue(params: QueueFilterParams = {}): Promise<WorkflowExecutionQueueResponse> {
    try {
      const cacheKey = `queue_${JSON.stringify(params)}`;
      const cached = queueCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl, { params });
      
      // Cache do resultado
      queueCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar fila de execuções:', error);
      throw new Error('Falha ao carregar fila de execuções');
    }
  }

  /**
   * Adiciona item à fila de execução
   */
  async addToQueue(params: AddToQueueParams): Promise<WorkflowExecutionQueue> {
    try {
      // Validação básica
      this.validateQueueParams(params);

      const response = await apiClient.post(this.baseUrl, params);
      
      // Limpar cache relacionado
      this.clearQueueCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar à fila:', error);
      throw new Error('Falha ao adicionar à fila');
    }
  }

  /**
   * Remove item da fila
   */
  async removeFromQueue(queueId: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${queueId}`);
      
      // Limpar cache relacionado
      this.clearQueueCache();
    } catch (error) {
      console.error(`Erro ao remover item ${queueId} da fila:`, error);
      throw new Error('Falha ao remover item da fila');
    }
  }

  /**
   * Atualiza item da fila
   */
  async updateQueueItem(queueId: number, params: UpdateQueueItemParams): Promise<WorkflowExecutionQueue> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${queueId}`, params);
      
      // Limpar cache relacionado
      this.clearQueueCache();
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar item ${queueId} da fila:`, error);
      throw new Error('Falha ao atualizar item da fila');
    }
  }

  /**
   * Define prioridade de um item da fila
   */
  async setPriority(queueId: number, priority: WorkflowExecutionPriority): Promise<WorkflowExecutionQueue> {
    try {
      return await this.updateQueueItem(queueId, { priority });
    } catch (error) {
      console.error(`Erro ao definir prioridade do item ${queueId}:`, error);
      throw new Error('Falha ao definir prioridade');
    }
  }

  /**
   * Reordena a fila
   */
  async reorderQueue(queueIds: number[]): Promise<WorkflowExecutionQueue[]> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/reorder`, { queue_ids: queueIds });
      
      // Limpar cache relacionado
      this.clearQueueCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao reordenar fila:', error);
      throw new Error('Falha ao reordenar fila');
    }
  }

  /**
   * Processa itens da fila
   */
  async processQueue(): Promise<WorkflowQueueProcessResult> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/process`);
      
      // Limpar cache relacionado
      this.clearQueueCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao processar fila:', error);
      throw new Error('Falha ao processar fila');
    }
  }

  /**
   * Retry de itens falhados na fila
   */
  async retryQueueItems(queueIds: number[]): Promise<WorkflowQueueRetryResult> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/retry`, { queue_ids: queueIds });
      
      // Limpar cache relacionado
      this.clearQueueCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao tentar novamente itens da fila:', error);
      throw new Error('Falha ao tentar novamente itens da fila');
    }
  }

  /**
   * Limpa a fila
   */
  async clearQueue(status?: WorkflowExecutionQueueStatus): Promise<WorkflowQueueClearResult> {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.post(`${this.baseUrl}/clear`, params);
      
      // Limpar cache relacionado
      this.clearQueueCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao limpar fila:', error);
      throw new Error('Falha ao limpar fila');
    }
  }

  /**
   * Obtém status da fila
   */
  async getQueueStatus(): Promise<WorkflowQueueStatus> {
    try {
      const cacheKey = 'queue_status';
      const cached = queueCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/status`);
      
      // Cache do resultado
      queueCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status da fila:', error);
      throw new Error('Falha ao obter status da fila');
    }
  }

  /**
   * Obtém estatísticas da fila
   */
  async getQueueStats(): Promise<WorkflowExecutionQueueStats> {
    try {
      const cacheKey = 'queue_stats';
      const cached = queueCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/stats`);
      
      // Cache do resultado
      queueCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas da fila:', error);
      throw new Error('Falha ao obter estatísticas da fila');
    }
  }

  /**
   * Obtém itens da fila por prioridade
   */
  async getQueueByPriority(priority: WorkflowExecutionPriority): Promise<WorkflowExecutionQueue[]> {
    try {
      const result = await this.getExecutionQueue({ 
        priority, 
        limit: 1000 
      });
      return result.data || [];
    } catch (error) {
      console.error(`Erro ao buscar fila por prioridade ${priority}:`, error);
      throw new Error('Falha ao buscar fila por prioridade');
    }
  }

  /**
   * Obtém itens da fila por status
   */
  async getQueueByStatus(status: WorkflowExecutionQueueStatus): Promise<WorkflowExecutionQueue[]> {
    try {
      const result = await this.getExecutionQueue({ 
        status, 
        limit: 1000 
      });
      return result.data || [];
    } catch (error) {
      console.error(`Erro ao buscar fila por status ${status}:`, error);
      throw new Error('Falha ao buscar fila por status');
    }
  }

  /**
   * Obtém itens pendentes da fila
   */
  async getPendingQueueItems(): Promise<WorkflowExecutionQueue[]> {
    return this.getQueueByStatus('pending' as WorkflowExecutionQueueStatus);
  }

  /**
   * Obtém itens em processamento da fila
   */
  async getProcessingQueueItems(): Promise<WorkflowExecutionQueue[]> {
    return this.getQueueByStatus('processing' as WorkflowExecutionQueueStatus);
  }

  /**
   * Obtém itens falhados da fila
   */
  async getFailedQueueItems(): Promise<WorkflowExecutionQueue[]> {
    return this.getQueueByStatus('failed' as WorkflowExecutionQueueStatus);
  }

  /**
   * Pausa processamento da fila
   */
  async pauseQueue(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/pause`);
      
      // Limpar cache relacionado
      this.clearQueueCache();
    } catch (error) {
      console.error('Erro ao pausar fila:', error);
      throw new Error('Falha ao pausar fila');
    }
  }

  /**
   * Resume processamento da fila
   */
  async resumeQueue(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/resume`);
      
      // Limpar cache relacionado
      this.clearQueueCache();
    } catch (error) {
      console.error('Erro ao resumir fila:', error);
      throw new Error('Falha ao resumir fila');
    }
  }

  /**
   * Valida parâmetros da fila
   */
  private validateQueueParams(params: AddToQueueParams): void {
    if (!params.workflow_id) {
      throw new Error('ID do workflow é obrigatório');
    }

    if (params.timeout && params.timeout < 1) {
      throw new Error('Timeout deve ser maior que 0');
    }

    if (params.retry_count && params.retry_count < 0) {
      throw new Error('Número de tentativas deve ser maior ou igual a 0');
    }

    if (params.scheduled_at) {
      const scheduledDate = new Date(params.scheduled_at);
      if (scheduledDate <= new Date()) {
        throw new Error('Data agendada deve ser no futuro');
      }
    }
  }

  /**
   * Limpa cache da fila
   */
  private clearQueueCache(): void {
    queueCache.clear();
  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of queueCache.keys()) {
        if (key.includes(pattern)) {
          queueCache.delete(key);
        }
      }
    } else {
      queueCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: queueCache.size,
      keys: Array.from(queueCache.keys())
    };
  }
}

// Instância singleton
export const workflowQueueService = new WorkflowQueueService();
export default workflowQueueService;
