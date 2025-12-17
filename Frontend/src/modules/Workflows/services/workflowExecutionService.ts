import { apiClient } from '@/services';
import { Workflow, WorkflowExecution, WorkflowExecutionStatus, WorkflowExecutionQueue, WorkflowExecutionQueueStatus, WorkflowExecutionPriority } from '../types/workflowTypes';

// Cache para execuções
const executionCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 2 * 60 * 1000; // 2 minutos (execuções mudam mais frequentemente)

// Interface para parâmetros de execução
export interface ExecutionParams {
  workflow_id: number;
  variables?: Record<string, any>;
  priority?: WorkflowExecutionPriority;
  scheduled_at?: string;
  timeout?: number; }

// Interface para parâmetros de busca de execuções
export interface ExecutionSearchParams {
  workflow_id?: number;
  status?: WorkflowExecutionStatus;
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// Interface para resposta paginada de execuções
export interface ExecutionPaginatedResponse {
  data: WorkflowExecution[];
  total: number;
  page: number;
  limit: number;
  total_pages: number; }

// Interface para estatísticas de execução
export interface ExecutionStats {
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  running_executions: number;
  average_execution_time: number;
  success_rate: number; }

/**
 * Service para execução de workflows
 * Responsável por iniciar, monitorar e controlar execuções
 */
class WorkflowExecutionService {
  private baseUrl = '/api/workflow-executions';

  /**
   * Executa um workflow
   */
  async executeWorkflow(params: ExecutionParams): Promise<WorkflowExecution> {
    try {
      // Validação básica
      this.validateExecutionParams(params);

      const response = await apiClient.post(this.baseUrl, params);

      // Limpar cache relacionado
      this.clearExecutionCache();

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao executar workflow:', error);

      throw new Error('Falha ao executar workflow');

    } /**
   * Para uma execução em andamento
   */
  async stopExecution(executionId: number): Promise<WorkflowExecution> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${executionId}/stop`);

      // Limpar cache relacionado
      this.clearExecutionCache();

      executionCache.delete(`execution_${executionId}`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao parar execução ${executionId}:`, error);

      throw new Error('Falha ao parar execução');

    } /**
   * Pausa uma execução
   */
  async pauseExecution(executionId: number): Promise<WorkflowExecution> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${executionId}/pause`);

      // Limpar cache relacionado
      this.clearExecutionCache();

      executionCache.delete(`execution_${executionId}`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao pausar execução ${executionId}:`, error);

      throw new Error('Falha ao pausar execução');

    } /**
   * Resume uma execução pausada
   */
  async resumeExecution(executionId: number): Promise<WorkflowExecution> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${executionId}/resume`);

      // Limpar cache relacionado
      this.clearExecutionCache();

      executionCache.delete(`execution_${executionId}`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao resumir execução ${executionId}:`, error);

      throw new Error('Falha ao resumir execução');

    } /**
   * Busca execuções com filtros
   */
  async getExecutions(params: ExecutionSearchParams = {}): Promise<ExecutionPaginatedResponse> {
    try {
      const cacheKey = `executions_${JSON.stringify(params)}`;
      const cached = executionCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl, { params });

      const result = {
        data: (response as any).data.data || (response as any).data,
        total: (response as any).data.total || (response as any).data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || (response as any).data.length) / (params.limit || 10))};

      // Cache do resultado
      executionCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      console.error('Erro ao buscar execuções:', error);

      throw new Error('Falha ao carregar execuções');

    } /**
   * Busca uma execução específica por ID
   */
  async getExecutionById(executionId: number): Promise<WorkflowExecution> {
    try {
      const cacheKey = `execution_${executionId}`;
      const cached = executionCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${executionId}`);

      // Cache do resultado
      executionCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao buscar execução ${executionId}:`, error);

      throw new Error('Falha ao carregar execução');

    } /**
   * Obtém status de uma execução
   */
  async getExecutionStatus(executionId: number): Promise<WorkflowExecutionStatus> {
    try {
      const execution = await this.getExecutionById(executionId);

      return execution.status;
    } catch (error) {
      console.error(`Erro ao obter status da execução ${executionId}:`, error);

      throw new Error('Falha ao obter status da execução');

    } /**
   * Busca execuções de um workflow específico
   */
  async getWorkflowExecutions(workflowId: number, params: Omit<ExecutionSearchParams, 'workflow_id'> = {}): Promise<ExecutionPaginatedResponse> {
    return this.getExecutions({ ...params, workflow_id: workflowId });

  }

  /**
   * Busca execuções em andamento
   */
  async getRunningExecutions(): Promise<WorkflowExecution[]> {
    try {
      const result = await this.getExecutions({ 
        status: 'running' as WorkflowExecutionStatus, 
        limit: 1000 
      });

      return result.data;
    } catch (error) {
      console.error('Erro ao buscar execuções em andamento:', error);

      throw new Error('Falha ao buscar execuções em andamento');

    } /**
   * Busca execuções falhadas
   */
  async getFailedExecutions(): Promise<WorkflowExecution[]> {
    try {
      const result = await this.getExecutions({ 
        status: 'failed' as WorkflowExecutionStatus, 
        limit: 1000 
      });

      return result.data;
    } catch (error) {
      console.error('Erro ao buscar execuções falhadas:', error);

      throw new Error('Falha ao buscar execuções falhadas');

    } /**
   * Obtém estatísticas de execuções
   */
  async getExecutionStats(workflowId?: number): Promise<ExecutionStats> {
    try {
      const cacheKey = `execution_stats_${workflowId || 'all'}`;
      const cached = executionCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const url = workflowId ? `${this.baseUrl}/stats/${workflowId}` : `${this.baseUrl}/stats`;
      const response = await apiClient.get(url);

      // Cache do resultado
      executionCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter estatísticas de execuções:', error);

      throw new Error('Falha ao obter estatísticas de execuções');

    } /**
   * Retry de uma execução falhada
   */
  async retryExecution(executionId: number, variables?: Record<string, any>): Promise<WorkflowExecution> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${executionId}/retry`, { variables });

      // Limpar cache relacionado
      this.clearExecutionCache();

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao tentar novamente execução ${executionId}:`, error);

      throw new Error('Falha ao tentar novamente execução');

    } /**
   * Cancela uma execução
   */
  async cancelExecution(executionId: number): Promise<WorkflowExecution> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${executionId}/cancel`);

      // Limpar cache relacionado
      this.clearExecutionCache();

      executionCache.delete(`execution_${executionId}`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao cancelar execução ${executionId}:`, error);

      throw new Error('Falha ao cancelar execução');

    } /**
   * Obtém logs de uma execução
   */
  async getExecutionLogs(executionId: number): Promise<unknown[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${executionId}/logs`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao obter logs da execução ${executionId}:`, error);

      throw new Error('Falha ao obter logs da execução');

    } /**
   * Valida parâmetros de execução
   */
  private validateExecutionParams(params: ExecutionParams): void {
    if (!params.workflow_id) {
      throw new Error('ID do workflow é obrigatório');

    }

    if (params.timeout && params.timeout < 1) {
      throw new Error('Timeout deve ser maior que 0');

    }

    if (params.scheduled_at) {
      const scheduledDate = new Date(params.scheduled_at);

      if (scheduledDate <= new Date()) {
        throw new Error('Data agendada deve ser no futuro');

      } }

  /**
   * Limpa cache de execuções
   */
  private clearExecutionCache(): void {
    executionCache.clear();

  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of executionCache.keys()) {
        if (key.includes(pattern)) {
          executionCache.delete(key);

        } } else {
      executionCache.clear();

    } /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: executionCache.size,
      keys: Array.from(executionCache.keys())};

  } // Instância singleton
export const workflowExecutionService = new WorkflowExecutionService();

export default workflowExecutionService;
