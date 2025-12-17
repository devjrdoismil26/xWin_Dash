import { apiClient } from '@/services';
import { WorkflowPerformanceMetrics, WorkflowSystemMetrics, WorkflowAnalytics } from '../types/workflowTypes';

// Cache para métricas
const metricsCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos (métricas mudam menos frequentemente)

// Interface para filtros de métricas
export interface MetricsFilterParams {
  workflow_id?: number;
  start_date?: string;
  end_date?: string;
  period?: 'hour' | 'day' | 'week' | 'month' | 'year';
  group_by?: 'workflow' | 'status' | 'trigger_type' | 'date'; }

// Interface para estatísticas de execução
export interface ExecutionStats {
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  running_executions: number;
  average_execution_time: number;
  success_rate: number;
  failure_rate: number;
  throughput_per_hour: number; }

// Interface para métricas de performance
export interface PerformanceMetrics {
  average_execution_time: number;
  min_execution_time: number;
  max_execution_time: number;
  median_execution_time: number;
  p95_execution_time: number;
  p99_execution_time: number;
  execution_time_trend: Array<{
    date: string;
  average_time: number;
  count: number; }>;
}

// Interface para métricas de sistema
export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  active_connections: number;
  queue_size: number;
  processing_rate: number;
  error_rate: number;
  uptime: number; }

// Interface para relatório de performance
export interface PerformanceReport {
  period: string;
  total_workflows: number;
  total_executions: number;
  execution_stats: ExecutionStats;
  performance_metrics: PerformanceMetrics;
  system_metrics: SystemMetrics;
  top_performing_workflows: Array<{
    workflow_id: number;
  workflow_name: string;
  success_rate: number;
  average_execution_time: number;
  execution_count: number; }>;
  slowest_workflows: Array<{
    workflow_id: number;
    workflow_name: string;
    average_execution_time: number;
    execution_count: number;
  }>;
  most_failed_workflows: Array<{
    workflow_id: number;
    workflow_name: string;
    failure_rate: number;
    failure_count: number;
  }>;
}

/**
 * Service para métricas e estatísticas de workflows
 * Responsável por coleta, análise e relatórios de performance
 */
class WorkflowMetricsService {
  private baseUrl = '/api/workflow-metrics';

  /**
   * Obtém métricas de workflows
   */
  async getWorkflowMetrics(params: MetricsFilterParams = {}): Promise<WorkflowAnalytics> {
    try {
      const cacheKey = `workflow_metrics_${JSON.stringify(params)}`;
      const cached = metricsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/workflows`, { params });

      // Cache do resultado
      metricsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter métricas de workflows:', error);

      throw new Error('Falha ao obter métricas de workflows');

    } /**
   * Obtém estatísticas de execuções
   */
  async getExecutionStats(params: MetricsFilterParams = {}): Promise<ExecutionStats> {
    try {
      const cacheKey = `execution_stats_${JSON.stringify(params)}`;
      const cached = metricsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/executions`, { params });

      // Cache do resultado
      metricsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter estatísticas de execuções:', error);

      throw new Error('Falha ao obter estatísticas de execuções');

    } /**
   * Obtém dados de performance
   */
  async getPerformanceData(params: MetricsFilterParams = {}): Promise<WorkflowPerformanceMetrics> {
    try {
      const cacheKey = `performance_data_${JSON.stringify(params)}`;
      const cached = metricsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/performance`, { params });

      // Cache do resultado
      metricsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter dados de performance:', error);

      throw new Error('Falha ao obter dados de performance');

    } /**
   * Obtém métricas de sistema
   */
  async getSystemMetrics(): Promise<WorkflowSystemMetrics> {
    try {
      const cacheKey = 'system_metrics';
      const cached = metricsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/system`);

      // Cache do resultado
      metricsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter métricas de sistema:', error);

      throw new Error('Falha ao obter métricas de sistema');

    } /**
   * Obtém relatório completo de performance
   */
  async getPerformanceReport(params: MetricsFilterParams = {}): Promise<PerformanceReport> {
    try {
      const cacheKey = `performance_report_${JSON.stringify(params)}`;
      const cached = metricsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/report`, { params });

      // Cache do resultado
      metricsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter relatório de performance:', error);

      throw new Error('Falha ao obter relatório de performance');

    } /**
   * Obtém métricas de um workflow específico
   */
  async getWorkflowMetricsById(workflowId: number, params: Omit<MetricsFilterParams, 'workflow_id'> = {}): Promise<WorkflowAnalytics> {
    return this.getWorkflowMetrics({ ...params, workflow_id: workflowId });

  }

  /**
   * Obtém estatísticas de execuções de um workflow específico
   */
  async getWorkflowExecutionStats(workflowId: number, params: Omit<MetricsFilterParams, 'workflow_id'> = {}): Promise<ExecutionStats> {
    return this.getExecutionStats({ ...params, workflow_id: workflowId });

  }

  /**
   * Obtém dados de performance de um workflow específico
   */
  async getWorkflowPerformanceData(workflowId: number, params: Omit<MetricsFilterParams, 'workflow_id'> = {}): Promise<WorkflowPerformanceMetrics> {
    return this.getPerformanceData({ ...params, workflow_id: workflowId });

  }

  /**
   * Obtém métricas em tempo real
   */
  async getRealTimeMetrics(): Promise<{
    active_executions: number;
    queue_size: number;
    processing_rate: number;
    error_rate: number;
    system_health: 'healthy' | 'warning' | 'critical';
  }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/realtime`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter métricas em tempo real:', error);

      throw new Error('Falha ao obter métricas em tempo real');

    } /**
   * Obtém tendências de execução
   */
  async getExecutionTrends(params: MetricsFilterParams = {}): Promise<Array<{
    date: string;
    executions: number;
    successful: number;
    failed: number;
    average_time: number;
  }>> {
    try {
      const cacheKey = `execution_trends_${JSON.stringify(params)}`;
      const cached = metricsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/trends`, { params });

      // Cache do resultado
      metricsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter tendências de execução:', error);

      throw new Error('Falha ao obter tendências de execução');

    } /**
   * Obtém métricas de uso de recursos
   */
  async getResourceUsageMetrics(params: MetricsFilterParams = {}): Promise<{
    cpu_usage: Array<{ date: string; usage: number }>;
    memory_usage: Array<{ date: string; usage: number }>;
    disk_usage: Array<{ date: string; usage: number }>;
    network_usage: Array<{ date: string; usage: number }>;
  }> {
    try {
      const cacheKey = `resource_usage_${JSON.stringify(params)}`;
      const cached = metricsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/resources`, { params });

      // Cache do resultado
      metricsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter métricas de uso de recursos:', error);

      throw new Error('Falha ao obter métricas de uso de recursos');

    } /**
   * Obtém alertas de performance
   */
  async getPerformanceAlerts(): Promise<Array<{
    id: string;
    type: 'performance' | 'error' | 'resource';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    workflow_id?: number;
    workflow_name?: string;
    created_at: string;
    resolved: boolean;
  }>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/alerts`);

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter alertas de performance:', error);

      throw new Error('Falha ao obter alertas de performance');

    } /**
   * Exporta métricas para CSV
   */
  async exportMetrics(params: MetricsFilterParams = {}, format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/export`, {
        params: { ...params, format },
        responseType: 'blob'
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao exportar métricas:', error);

      throw new Error('Falha ao exportar métricas');

    } /**
   * Limpa cache de métricas
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of metricsCache.keys()) {
        if (key.includes(pattern)) {
          metricsCache.delete(key);

        } } else {
      metricsCache.clear();

    } /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: metricsCache.size,
      keys: Array.from(metricsCache.keys())};

  }

  /**
   * Força atualização de métricas
   */
  async refreshMetrics(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/refresh`);

      // Limpar cache
      this.clearCache();

    } catch (error) {
      console.error('Erro ao atualizar métricas:', error);

      throw new Error('Falha ao atualizar métricas');

    } }

// Instância singleton
export const workflowMetricsService = new WorkflowMetricsService();

export default workflowMetricsService;
