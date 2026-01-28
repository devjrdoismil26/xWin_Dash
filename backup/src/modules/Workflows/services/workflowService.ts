import { apiClient } from '@/services';
import {
  Workflow,
  WorkflowExecution,
  WorkflowStep,
  WorkflowTrigger,
  WorkflowCanvasData,
  WorkflowAnalytics,
  WorkflowTemplate,
  WorkflowVariable,
  WorkflowStatus,
  WorkflowTriggerType,
  WorkflowCondition,
  WorkflowOperator,
  WorkflowSchedule,
  WorkflowStepType,
  WorkflowStepConfig,
  WorkflowExecutionStatus,
  WorkflowCanvasNode,
  WorkflowCanvasEdge,
  WorkflowValidationResult,
  WorkflowPerformanceMetrics,
  WorkflowSystemMetrics,
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
  WorkflowQueueStatus,
  WorkflowExecutionQueueApiResponse
} from '../types/workflowTypes';

export interface WorkflowAnalytics {
  successful_executions: number;
  failed_executions: number;
  average_execution_time: number;
  last_execution_at?: string;
}

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
  template_data: WorkflowCanvasData;
}

export interface WorkflowVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  value: any;
  description?: string;
  is_required: boolean;
  default_value?: any;
}

export interface WorkflowStatus {
  id: string;
  name: string;
  description: string;
  color: string;
  is_active: boolean;
  is_final: boolean;
  order: number;
}

export interface WorkflowTriggerType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  config_schema: any;
  is_enabled: boolean;
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: WorkflowOperator;
  value: any;
  logical_operator?: 'AND' | 'OR';
}

export interface WorkflowOperator {
  id: string;
  name: string;
  symbol: string;
  description: string;
  data_types: string[];
}

export interface WorkflowSchedule {
  id: string;
  name: string;
  cron_expression: string;
  timezone: string;
  is_active: boolean;
  next_run_at?: string;
  last_run_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStepType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  config_schema: any;
  is_enabled: boolean;
  input_ports: number;
  output_ports: number;
}

export interface WorkflowStepConfig {
  [key: string]: any;
}

export interface WorkflowExecutionStatus {
  id: string;
  name: string;
  description: string;
  color: string;
  is_final: boolean;
  order: number;
}

export interface WorkflowCanvasNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
  style?: any;
}

export interface WorkflowCanvasEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  style?: any;
  data?: any;
}

export interface WorkflowCanvasData {
  nodes: WorkflowCanvasNode[];
  edges: WorkflowCanvasEdge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface WorkflowValidationResult {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface WorkflowPerformanceMetrics {
  execution_time: number;
  memory_usage: number;
  cpu_usage: number;
  network_requests: number;
  database_queries: number;
}

export interface WorkflowSystemMetrics {
  total_workflows: number;
  active_workflows: number;
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_execution_time: number;
  system_uptime: number;
  memory_usage: number;
  cpu_usage: number;
}

class WorkflowService {
  private baseUrl = '/api/workflows';

  // Workflow CRUD operations
  async getWorkflows(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    category?: string;
  }): Promise<{ data: Workflow[]; meta: any }> {
    const response = await apiClient.get(this.baseUrl, { params });
    return response.data;
  }

  async getWorkflow(id: string): Promise<Workflow> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    const response = await apiClient.post(this.baseUrl, workflow);
    return response.data;
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, workflow);
    return response.data;
  }

  async deleteWorkflow(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Workflow execution operations
  async executeWorkflow(id: string, variables?: Record<string, any>): Promise<WorkflowExecution> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/execute`, { variables });
    return response.data;
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
  ): Promise<{ data: WorkflowExecution[]; meta: any }> {
    const response = await apiClient.get(`${this.baseUrl}/${workflowId}/executions`, { params });
    return response.data;
  }

  async getWorkflowExecution(workflowId: string, executionId: string): Promise<WorkflowExecution> {
    const response = await apiClient.get(`${this.baseUrl}/${workflowId}/executions/${executionId}`);
    return response.data;
  }

  async cancelWorkflowExecution(workflowId: string, executionId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${workflowId}/executions/${executionId}/cancel`);
  }

  async retryWorkflowExecution(workflowId: string, executionId: string): Promise<WorkflowExecution> {
    const response = await apiClient.post(`${this.baseUrl}/${workflowId}/executions/${executionId}/retry`);
    return response.data;
  }

  // Workflow analytics
  async getWorkflowAnalytics(id: string): Promise<WorkflowAnalytics> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/analytics`);
    return response.data;
  }

  async getSystemMetrics(): Promise<WorkflowSystemMetrics> {
    const response = await apiClient.get(`${this.baseUrl}/system/metrics`);
    return response.data;
  }

  // Workflow templates
  async getWorkflowTemplates(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    category?: string;
    is_public?: boolean;
  }): Promise<{ data: WorkflowTemplate[]; meta: any }> {
    const response = await apiClient.get(`${this.baseUrl}/templates`, { params });
    return response.data;
  }

  async getWorkflowTemplate(id: string): Promise<WorkflowTemplate> {
    const response = await apiClient.get(`${this.baseUrl}/templates/${id}`);
    return response.data;
  }

  async createWorkflowFromTemplate(templateId: string, workflowData: Partial<Workflow>): Promise<Workflow> {
    const response = await apiClient.post(`${this.baseUrl}/templates/${templateId}/create`, workflowData);
    return response.data;
  }

  // Workflow validation
  async validateWorkflow(workflowData: WorkflowCanvasData): Promise<WorkflowValidationResult> {
    const response = await apiClient.post(`${this.baseUrl}/validate`, workflowData);
    return response.data;
  }

  // Workflow triggers
  async getWorkflowTriggers(): Promise<WorkflowTriggerType[]> {
    const response = await apiClient.get(`${this.baseUrl}/triggers`);
    return response.data;
  }

  async getWorkflowTriggerTypes(): Promise<WorkflowTriggerType[]> {
    const response = await apiClient.get(`${this.baseUrl}/trigger-types`);
    return response.data;
  }

  // Workflow steps
  async getWorkflowStepTypes(): Promise<WorkflowStepType[]> {
    const response = await apiClient.get(`${this.baseUrl}/step-types`);
    return response.data;
  }

  async getWorkflowStepType(id: string): Promise<WorkflowStepType> {
    const response = await apiClient.get(`${this.baseUrl}/step-types/${id}`);
    return response.data;
  }

  // Workflow schedules
  async getWorkflowSchedules(workflowId: string): Promise<WorkflowSchedule[]> {
    const response = await apiClient.get(`${this.baseUrl}/${workflowId}/schedules`);
    return response.data;
  }

  async createWorkflowSchedule(workflowId: string, schedule: Partial<WorkflowSchedule>): Promise<WorkflowSchedule> {
    const response = await apiClient.post(`${this.baseUrl}/${workflowId}/schedules`, schedule);
    return response.data;
  }

  async updateWorkflowSchedule(
    workflowId: string,
    scheduleId: string,
    schedule: Partial<WorkflowSchedule>
  ): Promise<WorkflowSchedule> {
    const response = await apiClient.put(`${this.baseUrl}/${workflowId}/schedules/${scheduleId}`, schedule);
    return response.data;
  }

  async deleteWorkflowSchedule(workflowId: string, scheduleId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${workflowId}/schedules/${scheduleId}`);
  }

  // Workflow variables
  async getWorkflowVariables(workflowId: string): Promise<WorkflowVariable[]> {
    const response = await apiClient.get(`${this.baseUrl}/${workflowId}/variables`);
    return response.data;
  }

  async createWorkflowVariable(workflowId: string, variable: Partial<WorkflowVariable>): Promise<WorkflowVariable> {
    const response = await apiClient.post(`${this.baseUrl}/${workflowId}/variables`, variable);
    return response.data;
  }

  async updateWorkflowVariable(
    workflowId: string,
    variableId: string,
    variable: Partial<WorkflowVariable>
  ): Promise<WorkflowVariable> {
    const response = await apiClient.put(`${this.baseUrl}/${workflowId}/variables/${variableId}`, variable);
    return response.data;
  }

  async deleteWorkflowVariable(workflowId: string, variableId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${workflowId}/variables/${variableId}`);
  }

  // Workflow statuses
  async getWorkflowStatuses(): Promise<WorkflowStatus[]> {
    const response = await apiClient.get(`${this.baseUrl}/statuses`);
    return response.data;
  }

  async getWorkflowExecutionStatuses(): Promise<WorkflowExecutionStatus[]> {
    const response = await apiClient.get(`${this.baseUrl}/execution-statuses`);
    return response.data;
  }

  // Workflow operators
  async getWorkflowOperators(): Promise<WorkflowOperator[]> {
    const response = await apiClient.get(`${this.baseUrl}/operators`);
    return response.data;
  }

  // Workflow performance
  async getWorkflowPerformanceMetrics(id: string): Promise<WorkflowPerformanceMetrics> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/performance`);
    return response.data;
  }

  // Workflow export/import
  async exportWorkflow(id: string): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/export`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async importWorkflow(file: File): Promise<Workflow> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`${this.baseUrl}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  // Workflow cloning
  async cloneWorkflow(id: string, newName: string): Promise<Workflow> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/clone`, { name: newName });
    return response.data;
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
  async getWorkflowComments(id: string): Promise<any[]> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/comments`);
    return response.data;
  }

  async addWorkflowComment(id: string, comment: { content: string; parent_id?: string }): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/comments`, comment);
    return response.data;
  }

  // Workflow favorites
  async addWorkflowToFavorites(id: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${id}/favorite`);
  }

  async removeWorkflowFromFavorites(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}/favorite`);
  }

  async getFavoriteWorkflows(): Promise<Workflow[]> {
    const response = await apiClient.get(`${this.baseUrl}/favorites`);
    return response.data;
  }

  // Workflow search
  async searchWorkflows(query: string, filters?: {
    status?: string;
    category?: string;
    tags?: string[];
    created_by?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<{ data: Workflow[]; meta: any }> {
    const response = await apiClient.get(`${this.baseUrl}/search`, {
      params: { q: query, ...filters }
    });
    return response.data;
  }

  // Workflow categories
  async getWorkflowCategories(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/categories`);
    return response.data;
  }

  // Workflow tags
  async getWorkflowTags(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/tags`);
    return response.data;
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
    recent_activities: any[];
  }> {
    const response = await apiClient.get(`${this.baseUrl}/statistics`);
    return response.data;
  }

  // Workflow health check
  async getWorkflowHealthCheck(id: string): Promise<{
    is_healthy: boolean;
    issues: string[];
    recommendations: string[];
    last_check: string;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/health`);
    return response.data;
  }

  // Workflow backup/restore
  async backupWorkflow(id: string): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/backup`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async restoreWorkflow(file: File): Promise<Workflow> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`${this.baseUrl}/restore`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
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
      const response = await apiClient.get('/api/workflows/executions/queue', { params });
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

  async processExecutionQueue(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post('/api/workflows/executions/queue/process');
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

  async getExecutionQueueStatus(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/status');
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

  async clearExecutionQueue(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/clear');
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

  async retryFailedExecutions(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/retry-failed');
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

  async retryAllExecutions(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/retry-all');
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

  async getExecutionQueueItem(id: string): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get(`/api/workflows/executions/queue/${id}`);
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

  async updateExecutionQueueItem(id: string, data: Partial<WorkflowExecutionQueue>): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.put(`/api/workflows/executions/queue/${id}`, data);
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

  async deleteExecutionQueueItem(id: string): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.delete(`/api/workflows/executions/queue/${id}`);
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

  async cancelExecutionQueueItem(id: string): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post(`/api/workflows/executions/queue/${id}/cancel`);
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

  async retryExecutionQueueItem(id: string): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post(`/api/workflows/executions/queue/${id}/retry`);
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

  async updateExecutionPriority(id: string, priority: WorkflowExecutionPriority): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post(`/api/workflows/executions/queue/${id}/priority`, { priority });
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

  async getExecutionQueueStats(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/stats');
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

  async pauseExecutionQueue(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post('/api/workflows/executions/queue/pause');
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

  async resumeExecutionQueue(): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.post('/api/workflows/executions/queue/resume');
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

  async getExecutionQueueHistory(params: {
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<WorkflowExecutionQueueApiResponse> {
    try {
      const response = await apiClient.get('/api/workflows/executions/queue/history', { params });
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

const workflowService = new WorkflowService();
export { workflowService };
export default workflowService;
