import { apiClient } from '@/services';

// ===== INTERFACES TYPESCRIPT NATIVAS =====
export interface WorkflowExecutor {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  version: string;
  is_active: boolean;
  config_schema: any;
  capabilities: string[];
  dependencies: string[];
  created_at: string;
  updated_at: string;
}

export interface ExecutorConfig {
  [key: string]: any;
}

export interface ExecutionContext {
  workflow_id: string;
  execution_id: string;
  node_id: string;
  payload: any;
  variables: any;
}

export interface ExecutorMetadata {
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  tags: string[];
  documentation_url?: string;
  support_url?: string;
}

export interface ExecutorStatistics {
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_execution_time: number;
  last_execution_at?: string;
  error_rate: number;
}

export interface ExecutorHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  last_check: string;
  response_time: number;
  error_count: number;
  uptime_percentage: number;
}

export interface ExecutorData {
  id: string;
  [key: string]: any;
}

export interface ExecutorResponse {
  success: boolean;
  data?: ExecutorData | ExecutorData[];
  message?: string;
  error?: string;
}

class WorkflowExecutorsService {
  private api = apiClient;

  // ===== EXECUTOR REGISTRY =====
  async getAvailableExecutors(): Promise<ExecutorResponse> {
    try {
      const response = await this.api.get('/workflows/drag-drop/nodes');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch available executors'
      };
    }
  }

  // ===== NODE EXECUTION =====
  async executeNode(nodeType: string, nodeConfig: ExecutorConfig, executionContext: ExecutionContext = {} as ExecutionContext): Promise<ExecutorResponse> {
    try {
      const response = await this.api.post('/workflows/nodes/execute', {
        node_type: nodeType,
        node_config: nodeConfig,
        execution_context: executionContext
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to execute node'
      };
    }
  }

  async testNode(nodeType: string, nodeConfig: ExecutorConfig): Promise<ExecutorResponse> {
    try {
      const response = await this.api.post('/workflows/nodes/test', {
        node_type: nodeType,
        node_config: nodeConfig
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to test node'
      };
    }
  }

  // ===== EXECUTOR CATEGORIES =====
  async getExecutorsByCategory(category: string): Promise<ExecutorResponse> {
    try {
      const response = await this.api.get(`/workflows/executors/category/${category}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch executors by category'
      };
    }
  }

  // ===== EXECUTOR CONFIGURATION =====
  async getExecutorConfigSchema(nodeType: string): Promise<ExecutorResponse> {
    try {
      const response = await this.api.get(`/workflows/executors/${nodeType}/config-schema`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch executor config schema'
      };
    }
  }

  async validateExecutorConfig(nodeType: string, nodeConfig: ExecutorConfig): Promise<ExecutorResponse> {
    try {
      const response = await this.api.post(`/workflows/executors/${nodeType}/validate`, {
        node_config: nodeConfig
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to validate executor config'
      };
    }
  }

  // ===== EXECUTOR METADATA =====
  async getExecutorMetadata(nodeType: string): Promise<ExecutorResponse> {
    try {
      const response = await this.api.get(`/workflows/executors/${nodeType}/metadata`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch executor metadata'
      };
    }
  }

  // ===== EXECUTOR STATISTICS =====
  async getExecutorStatistics(nodeType: string | null = null): Promise<ExecutorResponse> {
    try {
      const url = nodeType 
        ? `/workflows/executors/${nodeType}/statistics`
        : '/workflows/executors/statistics';

      const response = await this.api.get(url);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch executor statistics'
      };
    }
  }

  // ===== EXECUTOR HEALTH CHECK =====
  async checkExecutorHealth(nodeType: string): Promise<ExecutorResponse> {
    try {
      const response = await this.api.get(`/workflows/executors/${nodeType}/health`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check executor health'
      };
    }
  }

  // ===== EXECUTOR DEPENDENCIES =====
  async getExecutorDependencies(nodeType: string): Promise<ExecutorResponse> {
    try {
      const response = await this.api.get(`/workflows/executors/${nodeType}/dependencies`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch executor dependencies'
      };
    }
  }

  // ===== EXECUTOR CAPABILITIES =====
  async getExecutorCapabilities(nodeType: string): Promise<ExecutorResponse> {
    try {
      const response = await this.api.get(`/workflows/executors/${nodeType}/capabilities`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch executor capabilities'
      };
    }
  }

  // ===== UTILITY METHODS =====
  getExecutorCategories(): Array<{ value: string; label: string; description: string }> {
    return [
      { value: 'trigger', label: 'Triggers', description: 'Event triggers and webhooks' },
      { value: 'action', label: 'Actions', description: 'Data processing and API calls' },
      { value: 'condition', label: 'Conditions', description: 'Logic and decision nodes' },
      { value: 'transform', label: 'Transforms', description: 'Data transformation and mapping' },
      { value: 'integration', label: 'Integrations', description: 'Third-party service connections' },
      { value: 'utility', label: 'Utilities', description: 'Helper and utility functions' }
    ];
  }

  formatExecutorForDisplay(executor: any): any {
    return {
      ...executor,
      category_label: this.getExecutorCategories().find(c => c.value === executor.category)?.label || executor.category,
      is_active_label: executor.is_active ? 'Active' : 'Inactive',
      created_at_formatted: new Date(executor.created_at).toLocaleDateString(),
      updated_at_formatted: new Date(executor.updated_at).toLocaleDateString()
    };
  }

  formatStatisticsForDisplay(stats: any): any {
    return {
      ...stats,
      success_rate: stats.total_executions > 0 ? ((stats.successful_executions / stats.total_executions) * 100).toFixed(2) + '%' : '0%',
      error_rate_formatted: (stats.error_rate * 100).toFixed(2) + '%',
      average_execution_time_formatted: stats.average_execution_time ? `${stats.average_execution_time}ms` : 'N/A',
      last_execution_formatted: stats.last_execution_at ? new Date(stats.last_execution_at).toLocaleString() : 'Never'
    };
  }

  formatHealthForDisplay(health: any): any {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      healthy: { label: 'Healthy', color: 'green' },
      degraded: { label: 'Degraded', color: 'yellow' },
      unhealthy: { label: 'Unhealthy', color: 'red' }
    };

    return {
      ...health,
      status_label: statusMap[health.status]?.label || health.status,
      status_color: statusMap[health.status]?.color || 'gray',
      response_time_formatted: `${health.response_time}ms`,
      uptime_formatted: `${health.uptime_percentage.toFixed(2)}%`,
      last_check_formatted: new Date(health.last_check).toLocaleString()
    };
  }

  validateExecutorConfigSchema(config: any, schema: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!schema || !schema.properties) {
      return { isValid: true, errors: [] };
    }

    Object.keys(schema.properties).forEach(key => {
      const property = schema.properties[key];
      const value = config[key];

      if (property.required && (value === undefined || value === null || value === '')) {
        errors.push(`${key} is required`);
      }

      if (value !== undefined && property.type) {
        if (property.type === 'string' && typeof value !== 'string') {
          errors.push(`${key} must be a string`);
        } else if (property.type === 'number' && typeof value !== 'number') {
          errors.push(`${key} must be a number`);
        } else if (property.type === 'boolean' && typeof value !== 'boolean') {
          errors.push(`${key} must be a boolean`);
        } else if (property.type === 'array' && !Array.isArray(value)) {
          errors.push(`${key} must be an array`);
        } else if (property.type === 'object' && typeof value !== 'object') {
          errors.push(`${key} must be an object`);
        }
      }

      if (value !== undefined && property.enum && !property.enum.includes(value)) {
        errors.push(`${key} must be one of: ${property.enum.join(', ')}`);
      }

      if (value !== undefined && property.minimum && value < property.minimum) {
        errors.push(`${key} must be at least ${property.minimum}`);
      }

      if (value !== undefined && property.maximum && value > property.maximum) {
        errors.push(`${key} must be at most ${property.maximum}`);
      }

      if (value !== undefined && property.minLength && value.length < property.minLength) {
        errors.push(`${key} must be at least ${property.minLength} characters long`);
      }

      if (value !== undefined && property.maxLength && value.length > property.maxLength) {
        errors.push(`${key} must be at most ${property.maxLength} characters long`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

const workflowExecutorsService = new WorkflowExecutorsService();
export { workflowExecutorsService };
export default workflowExecutorsService;
