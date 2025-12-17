import { workflowManagementService } from './workflowManagementService';
import { workflowExecutionService } from './workflowExecutionService';
import { workflowQueueService } from './workflowQueueService';
import { workflowMetricsService } from './workflowMetricsService';
import { workflowTemplatesService } from './workflowTemplatesService';
import { workflowValidationService } from './workflowValidationService';
import { workflowCanvasService } from './workflowCanvasService';

import { Workflow, WorkflowExecution, WorkflowExecutionStatus, WorkflowExecutionQueue, WorkflowAnalytics, WorkflowTemplate, WorkflowCanvasData, WorkflowValidationResult, WorkflowPerformanceMetrics, WorkflowSystemMetrics } from '../types/workflowTypes';

// Re-exportar interfaces dos services especializados
export type {
  WorkflowSearchParams,
  WorkflowPaginatedResponse,
  CreateWorkflowData,
  UpdateWorkflowData
} from './workflowManagementService';

export type {
  ExecutionParams,
  ExecutionSearchParams,
  ExecutionPaginatedResponse,
  ExecutionStats
} from './workflowExecutionService';

export type {
  AddToQueueParams,
  UpdateQueueItemParams,
  QueueFilterParams
} from './workflowQueueService';

export type {
  MetricsFilterParams,
  PerformanceReport
} from './workflowMetricsService';

export type {
  CreateTemplateData,
  UpdateTemplateData,
  TemplateSearchParams,
  TemplatePaginatedResponse,
  UseTemplateParams
} from './workflowTemplatesService';

export type {
  DetailedValidationResult,
  ExecutionValidationResult,
  TemplateValidationResult
} from './workflowValidationService';

export type {
  OptimizedLayout,
  LayoutConfig,
  CanvasStats
} from './workflowCanvasService';

// Interface para configuração global
export interface WorkflowsServiceConfig {
  cache_enabled: boolean;
  cache_ttl: number;
  retry_attempts: number;
  retry_delay: number;
  auto_optimize_canvas: boolean;
  validation_strict_mode: boolean;
  [key: string]: unknown; }

// Interface para estatísticas globais
export interface GlobalWorkflowStats {
  total_workflows: number;
  active_workflows: number;
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  running_executions: number;
  queue_size: number;
  system_health: 'healthy' | 'warning' | 'critical';
  last_sync: string; }

/**
 * Service orquestrador para workflows
 * Implementa padrão Facade para integrar todos os services especializados
 */
class WorkflowsService {
  private config: WorkflowsServiceConfig = {
    cache_enabled: true,
    cache_ttl: 5 * 60 * 1000, // 5 minutos
    retry_attempts: 3,
    retry_delay: 1000,
    auto_optimize_canvas: true,
    validation_strict_mode: false};

  // ==================== WORKFLOW MANAGEMENT ====================

  /**
   * Obtém workflows com filtros
   */
  async getWorkflows(params?: Record<string, any>) {
    return this.executeWithRetry(() => 
      workflowManagementService.getWorkflows(params));

  }

  /**
   * Obtém workflow por ID
   */
  async getWorkflowById(id: number) {
    return this.executeWithRetry(() => 
      workflowManagementService.getWorkflowById(id));

  }

  /**
   * Cria novo workflow
   */
  async createWorkflow(data: Record<string, any>) {
    // Validação antes de criar
    if (this.config.validation_strict_mode) {
      const validation = workflowValidationService.validateWorkflow({
        id: 0,
        name: (data as any).name,
        description: (data as any).description,
        status: 'draft',
        trigger: (data as any).trigger,
        steps: (data as any).steps,
        canvas_data: (data as any).canvas_data,
        is_active: false,
        executions_count: 0,
        success_rate: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
  });

      if (!validation.is_valid) {
        throw new Error(`Workflow inválido: ${validation.errors.map(e => e.message).join(', ')}`);

      } const workflow = await this.executeWithRetry(() => 
      workflowManagementService.createWorkflow(data));

    return workflow;
  }

  /**
   * Atualiza workflow
   */
  async updateWorkflow(id: number, data: Record<string, any>) {
    const workflow = await this.executeWithRetry(() => 
      workflowManagementService.updateWorkflow(id, data));

    return workflow;
  }

  /**
   * Remove workflow
   */
  async deleteWorkflow(id: number) {
    return this.executeWithRetry(() => 
      workflowManagementService.deleteWorkflow(id));

  }

  // ==================== WORKFLOW EXECUTION ====================

  /**
   * Executa workflow
   */
  async executeWorkflow(params: Record<string, any>) {
    // Validação antes de executar
    if (this.config.validation_strict_mode) {
      const workflow = await this.getWorkflowById(params.workflow_id);

      const validation = workflowValidationService.validateExecution(workflow, params.variables);

      if (!validation.is_valid) {
        throw new Error(`Execução inválida: ${validation.errors.map(e => e.message).join(', ')}`);

      } return this.executeWithRetry(() => 
      workflowExecutionService.executeWorkflow(params));

  }

  /**
   * Para execução
   */
  async stopExecution(executionId: number) {
    return this.executeWithRetry(() => 
      workflowExecutionService.stopExecution(executionId));

  }

  /**
   * Pausa execução
   */
  async pauseExecution(executionId: number) {
    return this.executeWithRetry(() => 
      workflowExecutionService.pauseExecution(executionId));

  }

  /**
   * Resume execução pausada
   */
  async resumeExecution(executionId: number) {
    return this.executeWithRetry(() => 
      workflowExecutionService.resumeExecution(executionId));

  }

  /**
   * Cancela execução
   */
  async cancelExecution(executionId: number) {
    return this.executeWithRetry(() => 
      workflowExecutionService.cancelExecution(executionId));

  }

  /**
   * Retry execução falhada
   */
  async retryExecution(executionId: number, variables?: Record<string, any>) {
    return this.executeWithRetry(() => 
      workflowExecutionService.retryExecution(executionId, variables));

  }

  /**
   * Obtém execuções
   */
  async getExecutions(params?: Record<string, any>) {
    return this.executeWithRetry(() => 
      workflowExecutionService.getExecutions(params));

  }

  /**
   * Obtém execução por ID
   */
  async getExecutionById(executionId: number) {
    return this.executeWithRetry(() => 
      workflowExecutionService.getExecutionById(executionId));

  }

  // ==================== WORKFLOW QUEUE ====================

  /**
   * Obtém fila de execuções
   */
  async getExecutionQueue(params?: Record<string, any>) {
    return this.executeWithRetry(() => 
      workflowQueueService.getExecutionQueue(params));

  }

  /**
   * Adiciona à fila
   */
  async addToQueue(params: Record<string, any>) {
    return this.executeWithRetry(() => 
      workflowQueueService.addToQueue(params));

  }

  /**
   * Remove da fila
   */
  async removeFromQueue(queueId: number) {
    return this.executeWithRetry(() => 
      workflowQueueService.removeFromQueue(queueId));

  }

  /**
   * Obtém status da fila
   */
  async getQueueStatus() {
    return this.executeWithRetry(() => 
      workflowQueueService.getQueueStatus());

  }

  // ==================== WORKFLOW METRICS ====================

  /**
   * Obtém métricas de workflows
   */
  async getWorkflowMetrics(params?: Record<string, any>) {
    return this.executeWithRetry(() => 
      workflowMetricsService.getWorkflowMetrics(params));

  }

  /**
   * Obtém estatísticas de execuções
   */
  async getExecutionStats(params?: Record<string, any>) {
    return this.executeWithRetry(() => 
      workflowMetricsService.getExecutionStats(params));

  }

  /**
   * Obtém dados de performance
   */
  async getPerformanceData(params?: Record<string, any>) {
    return this.executeWithRetry(() => 
      workflowMetricsService.getPerformanceData(params));

  }

  /**
   * Obtém métricas de sistema
   */
  async getSystemMetrics() {
    return this.executeWithRetry(() => 
      workflowMetricsService.getSystemMetrics());

  }

  /**
   * Obtém relatório de performance
   */
  async getPerformanceReport(params?: Record<string, any>) {
    return this.executeWithRetry(() => 
      workflowMetricsService.getPerformanceReport(params));

  }

  // ==================== WORKFLOW TEMPLATES ====================

  /**
   * Obtém templates
   */
  async getTemplates(params?: Record<string, any>) {
    return this.executeWithRetry(() => 
      workflowTemplatesService.getTemplates(params));

  }

  /**
   * Obtém template por ID
   */
  async getTemplateById(templateId: string) {
    return this.executeWithRetry(() => 
      workflowTemplatesService.getTemplateById(templateId));

  }

  /**
   * Cria template
   */
  async createTemplate(data: Record<string, any>) {
    // Validação antes de criar
    if (this.config.validation_strict_mode) {
      const validation = workflowValidationService.validateTemplate(data);

      if (!validation.is_valid) {
        throw new Error(`Template inválido: ${validation.errors.map(e => e.message).join(', ')}`);

      } return this.executeWithRetry(() => 
      workflowTemplatesService.createTemplate(data));

  }

  /**
   * Usa template
   */
  async useTemplate(params: Record<string, any>) {
    return this.executeWithRetry(() => 
      workflowTemplatesService.useTemplate(params));

  }

  // ==================== WORKFLOW VALIDATION ====================

  /**
   * Valida workflow
   */
  validateWorkflow(workflow: Workflow) {
    return workflowValidationService.validateWorkflow(workflow);

  }

  /**
   * Valida execução
   */
  validateExecution(workflow: Workflow, variables?: Record<string, any>) {
    return workflowValidationService.validateExecution(workflow, variables);

  }

  /**
   * Valida template
   */
  validateTemplate(template: WorkflowTemplate) {
    return workflowValidationService.validateTemplate(template);

  }

  // ==================== NODERED INTEGRATION ====================
  // Métodos de integração NodeRED removidos - implementar quando necessário

  // ==================== CANVAS MANAGEMENT ====================

  /**
   * Salva layout do canvas
   */
  async saveCanvasLayout(workflowId: number, canvasData: WorkflowCanvasData, config?: Record<string, any>) {
    // Otimizar layout se habilitado
    if (this.config.auto_optimize_canvas) {
      const optimizedLayout = workflowCanvasService.optimizeLayout(canvasData, config);

      return this.executeWithRetry(() => 
        workflowCanvasService.saveCanvasLayout(workflowId, canvasData, config));

    }

    return this.executeWithRetry(() => 
      workflowCanvasService.saveCanvasLayout(workflowId, canvasData, config));

  }

  /**
   * Carrega layout do canvas
   */
  async loadCanvasLayout(workflowId: number) {
    return this.executeWithRetry(() => 
      workflowCanvasService.loadCanvasLayout(workflowId));

  }

  /**
   * Otimiza layout do canvas
   */
  optimizeCanvasLayout(canvasData: WorkflowCanvasData, config?: Record<string, any>) {
    return workflowCanvasService.optimizeLayout(canvasData, config);

  }

  /**
   * Obtém estatísticas do canvas
   */
  getCanvasStats(canvasData: WorkflowCanvasData) {
    return workflowCanvasService.getCanvasStats(canvasData);

  }

  // ==================== UTILITY METHODS ====================

  /**
   * Obtém estatísticas globais
   */
  async getGlobalStats(): Promise<GlobalWorkflowStats> {
    try {
      const [
        workflows,
        executions,
        queueStatus,
        systemMetrics,
        nodeRedStatus
      ] = await Promise.all([
        this.getWorkflows({ limit: 1 }),
        this.getExecutionStats(),
        this.getQueueStatus(),
        this.getSystemMetrics(),
      ]);

      return {
        total_workflows: workflows.total,
        active_workflows: workflows.data.filter((w: Workflow) => w.is_active).length,
        total_executions: executions.total_executions,
        successful_executions: executions.successful_executions,
        failed_executions: executions.failed_executions,
        running_executions: executions.running_executions,
        queue_size: queueStatus.pending_count || 0,
        system_health: this.determineSystemHealth(systemMetrics),
        last_sync: new Date().toISOString()};

    } catch (error) {
      console.error('Erro ao obter estatísticas globais:', error);

      throw new Error('Falha ao obter estatísticas globais');

    } /**
   * Determina saúde do sistema
   */
  private determineSystemHealth(systemMetrics: WorkflowSystemMetrics): 'healthy' | 'warning' | 'critical' {
    if (systemMetrics.cpu_usage > 90 || systemMetrics.memory_usage > 90) {
      return 'critical';
    } else if (systemMetrics.cpu_usage > 70 || systemMetrics.memory_usage > 70) {
      return 'warning';
    }
    return 'healthy';
  }

  /**
   * Executa operação com retry automático
   */
  private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.retry_attempts; attempt++) {
      try {
        return await operation();

      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.config.retry_attempts) {
          await this.delay(this.config.retry_delay * attempt);

        } }
    
    throw lastError!;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));

  }

  /**
   * Limpa todos os caches
   */
  clearAllCaches(): void {
    workflowManagementService.clearCache();

    workflowExecutionService.clearCache();

    workflowQueueService.clearCache();

    workflowMetricsService.clearCache();

    workflowTemplatesService.clearCache();

    workflowCanvasService.clearCache();

  }

  /**
   * Obtém configuração atual
   */
  getConfig(): WorkflowsServiceConfig {
    return { ...this.config};

  }

  /**
   * Atualiza configuração
   */
  updateConfig(newConfig: Partial<WorkflowsServiceConfig>): void {
    this.config = { ...this.config, ...newConfig};

  }

  /**
   * Obtém estatísticas de todos os caches
   */
  getAllCacheStats(): Record<string, { size: number; keys: string[] }> {
    return {
      management: workflowManagementService.getCacheStats(),
      execution: workflowExecutionService.getCacheStats(),
      queue: workflowQueueService.getCacheStats(),
      metrics: workflowMetricsService.getCacheStats(),
      templates: workflowTemplatesService.getCacheStats(),
      canvas: workflowCanvasService.getCacheStats()};

  } // Instância singleton
export const workflowsService = new WorkflowsService();

export default workflowsService;
