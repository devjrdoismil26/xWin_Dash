import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import type {
  Workflow,
  WorkflowExecution,
  WorkflowStep,
  WorkflowExecutionQueueApiResponse
} from '../types/workflowTypes';

export interface WorkflowAnalytics {
  successful_executions: number;
  failed_executions: number;
  average_execution_time: number;
  last_execution_at?: string; }

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  usage_count: number;
  rating: number;
  template_data: WorkflowCanvasData; }

export interface WorkflowVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  value: string | number | boolean | Record<string, any> | unknown[];
  description?: string;
  is_required: boolean;
  default_value?: string | number | boolean | Record<string, any> | unknown[]; }

export interface WorkflowStatus {
  id: string;
  name: string;
  description: string;
  color: string;
  is_active: boolean;
  is_final: boolean;
  order: number; }

export interface WorkflowTriggerType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  config_schema: Record<string, any>;
  is_enabled: boolean; }

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: WorkflowOperator;
  value: string | number | boolean | Record<string, any> | unknown[];
  logical_operator?: 'AND' | 'OR'; }

export interface WorkflowOperator {
  id: string;
  name: string;
  symbol: string;
  description: string;
  data_types: string[]; }

export interface WorkflowSchedule {
  id: string;
  name: string;
  cron_expression: string;
  timezone: string;
  is_active: boolean;
  next_run_at?: string;
  last_run_at?: string;
  created_at: string;
  updated_at: string; }

export interface WorkflowStepType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  config_schema: Record<string, any>;
  is_enabled: boolean;
  input_ports: number;
  output_ports: number; }

export interface WorkflowStepConfig {
  [key: string]: unknown; }

export interface WorkflowExecutionStatus {
  id: string;
  name: string;
  description: string;
  color: string;
  is_final: boolean;
  order: number; }

export interface WorkflowCanvasNode {
  id: string;
  type: string;
  position: { x: number;
  y: number;
};

  data: Record<string, any>;
  style?: Record<string, any>;
}

export interface WorkflowCanvasEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  style?: Record<string, any>;
  data?: Record<string, any>; }

export interface WorkflowCanvasData {
  nodes: WorkflowCanvasNode[];
  edges: WorkflowCanvasEdge[];
  viewport: {
    x: number;
  y: number;
  zoom: number;
  [key: string]: unknown; };

}

export interface WorkflowValidationResult {
  is_valid: boolean;
  errors: string[];
  warnings: string[]; }

export interface WorkflowPerformanceMetrics {
  execution_time: number;
  memory_usage: number;
  cpu_usage: number;
  network_requests: number;
  database_queries: number; }

export interface WorkflowSystemMetrics {
  total_workflows: number;
  active_workflows: number;
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_execution_time: number;
  system_uptime: number;
  memory_usage: number;
  cpu_usage: number; }

class WorkflowService {
  private baseUrl = '/api/workflows';

  // Workflow CRUD operations
  async getWorkflows(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    category?: string;
  }): Promise<{ data: Workflow[]; meta: Record<string, any> }> {
    const response = await apiClient.get(this.baseUrl, { params }) as { data: { data: Workflow[]; meta: Record<string, any> } };

    return (response as any).data as any;
  }

  async getWorkflow(id: string): Promise<Workflow> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`) as { data: Workflow };

    return (response as any).data as any;
  }

  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    const response = await apiClient.post(this.baseUrl, workflow) as { data: Workflow };

    return (response as any).data as any;
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, workflow) as { data: Workflow };

    return (response as any).data as any;
  }

  async deleteWorkflow(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);

  }

  // Workflow execution operations
  async executeWorkflow(id: string, variables?: Record<string, any>): Promise<WorkflowExecution> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/execute`, { variables }) as { data: WorkflowExecution};

    return (response as any).data as any;
  }

  async getWorkflowExecutions(
    workflowId: string,
    params?: {
      page?: number;
      per_page?: number;
      status?: string;
      date_from?: string;
      date_to?: string;
    }
  ): Promise<{ data: WorkflowExecution[]; meta: Record<string, any> }> {
    const response = await apiClient.get(`${this.baseUrl}/${workflowId}/executions`, { params }) as { data: { data: WorkflowExecution[]; meta: Record<string, any> } };

    return (response as any).data as any;
  }

  async getWorkflowExecution(workflowId: string, executionId: string): Promise<WorkflowExecution> {
    const response = await apiClient.get(`${this.baseUrl}/${workflowId}/executions/${executionId}`) as { data: WorkflowExecution };

    return (response as any).data as any;
  }

  async cancelWorkflowExecution(workflowId: string, executionId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${workflowId}/executions/${executionId}/cancel`);

  }

  async retryWorkflowExecution(workflowId: string, executionId: string): Promise<WorkflowExecution> {
    const response = await apiClient.post(`${this.baseUrl}/${workflowId}/executions/${executionId}/retry`) as { data: WorkflowExecution};

    return (response as any).data as any;
  }

  // Workflow analytics
  async getWorkflowAnalytics(id: string): Promise<WorkflowAnalytics> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/analytics`) as { data: WorkflowAnalytics};

    return (response as any).data as any;
  }

  async getSystemMetrics(): Promise<WorkflowSystemMetrics> {
    const response = await apiClient.get(`${this.baseUrl}/system/metrics`) as { data: WorkflowSystemMetrics};

    return (response as any).data as any;
  }

  // Workflow templates
  async getWorkflowTemplates(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    category?: string;
    is_public?: boolean;
  }): Promise<{ data: WorkflowTemplate[]; meta: Record<string, any> }> {
    const response = await apiClient.get(`${this.baseUrl}/templates`, { params }) as { data: { data: WorkflowTemplate[]; meta: Record<string, any> };

    return (response as any).data as any;
  }

  async getWorkflowTemplate(id: string): Promise<WorkflowTemplate> {
    const response = await apiClient.get(`${this.baseUrl}/templates/${id}`) as { data: WorkflowTemplate };

    return (response as any).data as any;
  }

  async createWorkflowFromTemplate(templateId: string, workflowData: Partial<Workflow>): Promise<Workflow> {
    const response = await apiClient.post(`${this.baseUrl}/templates/${templateId}/create`, workflowData) as { data: Workflow };

    return (response as any).data as any;
  }

  // Workflow validation
  async validateWorkflow(workflowData: WorkflowCanvasData): Promise<WorkflowValidationResult> {
    const response = await apiClient.post(`${this.baseUrl}/validate`, workflowData) as { data: WorkflowValidationResult};

    return (response as any).data as any;
  }

  // Workflow triggers
  async getWorkflowTriggers(): Promise<WorkflowTriggerType[]> {
    const response = await apiClient.get(`${this.baseUrl}/triggers`) as { data: WorkflowTriggerType[]};

    return (response as any).data as any;
  }

  async getWorkflowTriggerTypes(): Promise<WorkflowTriggerType[]> {
    const response = await apiClient.get(`${this.baseUrl}/trigger-types`) as { data: WorkflowTriggerType[]};

    return (response as any).data as any;
  }

  // Workflow steps
  async getWorkflowStepTypes(): Promise<WorkflowStepType[]> {
    const response = await apiClient.get(`${this.baseUrl}/step-types`) as { data: WorkflowStepType[]};

    return (response as any).data as any;
  }

  async getWorkflowStepType(id: string): Promise<WorkflowStepType> {
    const response = await apiClient.get(`${this.baseUrl}/step-types/${id}`) as { data: WorkflowStepType};

    return (response as any).data as any;
  }

  // Workflow schedules
  async getWorkflowSchedules(workflowId: string): Promise<WorkflowSchedule[]> {
    const response = await apiClient.get(`${this.baseUrl}/${workflowId}/schedules`) as { data: WorkflowSchedule[]};

    return (response as any).data as any;
  }

  async createWorkflowSchedule(workflowId: string, schedule: Partial<WorkflowSchedule>): Promise<WorkflowSchedule> {
    const response = await apiClient.post(`${this.baseUrl}/${workflowId}/schedules`, schedule) as { data: WorkflowSchedule};

    return (response as any).data as any;
  }

  async updateWorkflowSchedule(
    workflowId: string,
    scheduleId: string,
    schedule: Partial<WorkflowSchedule />
  ): Promise<WorkflowSchedule> {
    const response = await apiClient.put(`${this.baseUrl}/${workflowId}/schedules/${scheduleId}`, schedule) as { data: WorkflowSchedule};

    return (response as any).data as any;
  }

  async deleteWorkflowSchedule(workflowId: string, scheduleId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${workflowId}/schedules/${scheduleId}`);

  }

  // Workflow variables
  async getWorkflowVariables(workflowId: string): Promise<WorkflowVariable[]> {
    const response = await apiClient.get(`${this.baseUrl}/${workflowId}/variables`) as { data: WorkflowVariable[]};

    return (response as any).data as any;
  }

  async createWorkflowVariable(workflowId: string, variable: Partial<WorkflowVariable>): Promise<WorkflowVariable> {
    const response = await apiClient.post(`${this.baseUrl}/${workflowId}/variables`, variable) as { data: WorkflowVariable};

    return (response as any).data as any;
  }

  async updateWorkflowVariable(
    workflowId: string,
    variableId: string,
    variable: Partial<WorkflowVariable />
  ): Promise<WorkflowVariable> {
    const response = await apiClient.put(`${this.baseUrl}/${workflowId}/variables/${variableId}`, variable) as { data: WorkflowVariable};

    return (response as any).data as any;
  }

  async deleteWorkflowVariable(workflowId: string, variableId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${workflowId}/variables/${variableId}`);

  }

  // Workflow statuses
  async getWorkflowStatuses(): Promise<WorkflowStatus[]> {
    const response = await apiClient.get(`${this.baseUrl}/statuses`) as { data: WorkflowStatus[]};

    return (response as any).data as any;
  }

  async getWorkflowExecutionStatuses(): Promise<WorkflowExecutionStatus[]> {
    const response = await apiClient.get(`${this.baseUrl}/execution-statuses`) as { data: WorkflowExecutionStatus[]};

    return (response as any).data as any;
  }

  // Workflow operators
  async getWorkflowOperators(): Promise<WorkflowOperator[]> {
    const response = await apiClient.get(`${this.baseUrl}/operators`) as { data: WorkflowOperator[]};

    return (response as any).data as any;
  }

  // Workflow performance
  async getWorkflowPerformanceMetrics(id: string): Promise<WorkflowPerformanceMetrics> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/performance`) as { data: WorkflowPerformanceMetrics};

    return (response as any).data as any;
  }

  // Workflow export/import
  async exportWorkflow(id: string): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/export`, {
      responseType: 'blob'
    }) as { data: Blob};

    return (response as any).data as any;
  }

  async importWorkflow(file: File): Promise<Workflow> {
    const formData = new FormData();

    formData.append('file', file);

    const response = await apiClient.post(`${this.baseUrl}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      } ) as { data: Workflow };

    return (response as any).data as any;
  }

  // Workflow cloning
  async cloneWorkflow(id: string, newName: string): Promise<Workflow> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/clone`, { name: newName }) as { data: Workflow };

    return (response as any).data as any;
  }

  // Workflow sharing
  async shareWorkflow(id: string, permissions: {
    is_public: boolean;
    allowed_users?: string[];
    allowed_roles?: string[];
  }): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${id}/share`, permissions);

  }

  // Workflow comments
  async getWorkflowComments(id: string): Promise<unknown[]> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/comments`) as { data: string[]};

    return (response as any).data as any;
  }

  async addWorkflowComment(id: string, comment: { content: string; parent_id?: string }): Promise<Record<string, any>> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/comments`, comment) as { data: Record<string, any>};

    return (response as any).data as any;
  }

  // Workflow favorites
  async addWorkflowToFavorites(id: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${id}/favorite`);

  }

  async removeWorkflowFromFavorites(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}/favorite`);

  }

  async getFavoriteWorkflows(): Promise<Workflow[]> {
    const response = await apiClient.get(`${this.baseUrl}/favorites`) as { data: Workflow[]};

    return (response as any).data as any;
  }

  // Workflow search
  async searchWorkflows(query: string, filters?: {
    status?: string;
    category?: string;
    tags?: string[];
    created_by?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<{ data: Workflow[]; meta: Record<string, any> }> {
    const response = await apiClient.get(`${this.baseUrl}/search`, {
      params: { q: query, ...filters } ) as { data: { data: Workflow[]; meta: Record<string, any> };

    return (response as any).data as any;
  }

  // Workflow categories
  async getWorkflowCategories(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/categories`) as { data: string[]};

    return (response as any).data as any;
  }

  // Workflow tags
  async getWorkflowTags(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/tags`) as { data: string[]};

    return (response as any).data as any;
  }

  // Workflow statistics
  async getWorkflowStatistics(): Promise<{
    total_workflows: number;
    active_workflows: number;
    total_executions: number;
    successful_executions: number;
    failed_executions: number;
    average_execution_time: number;
    most_used_templates: WorkflowTemplate[];
    recent_activities: string[];
  }> {
    const response = await apiClient.get(`${this.baseUrl}/statistics`) as { data: {
      total_workflows: number;
      active_workflows: number;
      total_executions: number;
      successful_executions: number;
      failed_executions: number;
      average_execution_time: number;
      most_used_templates: WorkflowTemplate[];
      recent_activities: string[];
    };

    return (response as any).data as any;
  }

  // Workflow health check
  async getWorkflowHealthCheck(id: string): Promise<{
    is_healthy: boolean;
    issues: string[];
    recommendations: string[];
    last_check: string;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/health`) as { data: {
      is_healthy: boolean;
      issues: string[];
      recommendations: string[];
      last_check: string;
    };

    return (response as any).data as any;
  }

  // Workflow backup/restore
  async backupWorkflow(id: string): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/backup`, {
      responseType: 'blob'
    }) as { data: Blob};

    return (response as any).data as any;
  }

  async restoreWorkflow(file: File): Promise<Workflow> {
    const formData = new FormData();

    formData.append('file', file);

    const response = await apiClient.post(`${this.baseUrl}/restore`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      } ) as { data: Workflow };

    return (response as any).data as any;
  }

  // ===== EXECUTION QUEUE METHODS =====
  async getExecutionQueue(params: {
    page?: number;
    limit?: number;
    status?: WorkflowExecutionQueueStatus[];
    priority?: WorkflowExecutionPriority[];
    workflowId?: number[];
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    sort?: WorkflowExecutionQueueSort;
  } = {}): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue', { params }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async processExecutionQueue(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post('/api/workflows/executions/queue/process') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async getExecutionQueueStatus(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/status') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async clearExecutionQueue(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/clear') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async retryFailedExecutions(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/retry-failed') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async retryAllExecutions(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/retry-all') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async getExecutionQueueItem(id: string): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get(`/api/workflows/executions/queue/${id}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async updateExecutionQueueItem(id: string, data: Partial<WorkflowExecutionQueue>): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.put(`/api/workflows/executions/queue/${id}`, data) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async deleteExecutionQueueItem(id: string): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.delete(`/api/workflows/executions/queue/${id}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async cancelExecutionQueueItem(id: string): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post(`/api/workflows/executions/queue/${id}/cancel`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async retryExecutionQueueItem(id: string): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post(`/api/workflows/executions/queue/${id}/retry`);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async updateExecutionPriority(id: string, priority: WorkflowExecutionPriority): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post(`/api/workflows/executions/queue/${id}/priority`, { priority });

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async getExecutionQueueStats(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/stats');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async pauseExecutionQueue(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post('/api/workflows/executions/queue/pause');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async resumeExecutionQueue(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post('/api/workflows/executions/queue/resume');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async getExecutionQueueHistory(params: {
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/history', { params });

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } }

const workflowService = new WorkflowService();

export { workflowService };

export default workflowService;
