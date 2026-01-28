// ===== INTERFACES TYPESCRIPT NATIVAS =====
export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: {
    [key: string]: {
      type: string;
      required?: boolean;
      default?: any;
      options?: string[];
      maxLength?: number;
    };
  };
  body?: {
    [key: string]: {
      type: string;
      required?: boolean;
      default?: any;
      options?: string[];
      maxLength?: number;
    };
  };
}

export interface ApiEndpoints {
  [category: string]: {
    [action: string]: ApiEndpoint;
  };
}

export interface EndpointValidation {
  valid: boolean;
  errors: string[];
}

// ===== WORKFLOW API ENDPOINT MAPPING =====
export const workflowApiEndpoints: ApiEndpoints = {
  // ===== WORKFLOW CRUD =====
  workflows: {
    list: {
      method: 'GET',
      path: '/api/workflows',
      description: 'List all workflows for authenticated user',
      parameters: {
        per_page: { type: 'number', default: 15 },
        page: { type: 'number', default: 1 },
        status: { type: 'string', options: ['draft', 'active', 'paused', 'archived'] },
        search: { type: 'string' },
        sort_by: { type: 'string', default: 'updated_at' },
        sort_order: { type: 'string', options: ['asc', 'desc'], default: 'desc' }
      }
    },
    create: {
      method: 'POST',
      path: '/api/workflows',
      description: 'Create new workflow',
      body: {
        name: { type: 'string', required: true, maxLength: 255 },
        description: { type: 'string' },
        status: { type: 'string', options: ['draft', 'active', 'paused'], default: 'draft' },
        definition: { type: 'object', required: true },
        category: { type: 'string' },
        tags: { type: 'array' }
      }
    },
    get: {
      method: 'GET',
      path: '/api/workflows/{workflow}',
      description: 'Get specific workflow by ID',
      parameters: {
        workflow: { type: 'number', required: true }
      }
    },
    update: {
      method: 'PUT',
      path: '/api/workflows/{workflow}',
      description: 'Update workflow',
      parameters: {
        workflow: { type: 'number', required: true }
      },
      body: {
        name: { type: 'string', maxLength: 255 },
        description: { type: 'string' },
        status: { type: 'string', options: ['draft', 'active', 'paused', 'archived'] },
        definition: { type: 'object' },
        category: { type: 'string' },
        tags: { type: 'array' }
      }
    },
    delete: {
      method: 'DELETE',
      path: '/api/workflows/{workflow}',
      description: 'Delete workflow',
      parameters: {
        workflow: { type: 'number', required: true }
      }
    },
    execute: {
      method: 'POST',
      path: '/api/workflows/{workflow}/execute',
      description: 'Execute workflow',
      parameters: {
        workflow: { type: 'number', required: true }
      },
      body: {
        initial_payload: { type: 'object', default: {} }
      }
    },
    simulate: {
      method: 'POST',
      path: '/api/workflows/{workflow}/simulate',
      description: 'Simulate workflow execution',
      parameters: {
        workflow: { type: 'number', required: true }
      },
      body: {
        payload: { type: 'object', default: {} }
      }
    },
    clone: {
      method: 'POST',
      path: '/api/workflows/{workflow}/clone',
      description: 'Clone workflow',
      parameters: {
        workflow: { type: 'number', required: true }
      },
      body: {
        name: { type: 'string' },
        description: { type: 'string' }
      }
    },
    toggleActive: {
      method: 'PATCH',
      path: '/api/workflows/{workflow}/toggle-active',
      description: 'Toggle workflow active status',
      parameters: {
        workflow: { type: 'number', required: true }
      }
    }
  },

  // ===== WORKFLOW EXECUTION =====
  execution: {
    list: {
      method: 'GET',
      path: '/api/workflows/{workflow}/executions',
      description: 'Get workflow executions',
      parameters: {
        workflow: { type: 'number', required: true },
        per_page: { type: 'number', default: 15 },
        page: { type: 'number', default: 1 },
        status: { type: 'string', options: ['pending', 'running', 'completed', 'failed', 'cancelled', 'paused'] }
      }
    },
    pause: {
      method: 'POST',
      path: '/api/workflows/executions/{execution}/pause',
      description: 'Pause workflow execution',
      parameters: {
        execution: { type: 'number', required: true }
      }
    },
    resume: {
      method: 'POST',
      path: '/api/workflows/executions/{execution}/resume',
      description: 'Resume workflow execution',
      parameters: {
        execution: { type: 'number', required: true }
      }
    },
    cancel: {
      method: 'POST',
      path: '/api/workflows/executions/{execution}/cancel',
      description: 'Cancel workflow execution',
      parameters: {
        execution: { type: 'number', required: true }
      }
    }
  },

  // ===== WORKFLOW NODES =====
  nodes: {
    create: {
      method: 'POST',
      path: '/api/workflows/{id}/nodes',
      description: 'Create workflow node',
      parameters: {
        id: { type: 'number', required: true }
      },
      body: {
        name: { type: 'string', required: true },
        type: { type: 'string', required: true },
        config: { type: 'object', required: true },
        position_x: { type: 'number', default: 0 },
        position_y: { type: 'number', default: 0 },
        next_node_id: { type: 'number' },
        true_node_id: { type: 'number' },
        false_node_id: { type: 'number' }
      }
    },
    update: {
      method: 'PUT',
      path: '/api/workflows/{workflowId}/nodes/{nodeId}',
      description: 'Update workflow node',
      parameters: {
        workflowId: { type: 'number', required: true },
        nodeId: { type: 'number', required: true }
      },
      body: {
        name: { type: 'string' },
        type: { type: 'string' },
        config: { type: 'object' },
        position_x: { type: 'number' },
        position_y: { type: 'number' },
        next_node_id: { type: 'number' },
        true_node_id: { type: 'number' },
        false_node_id: { type: 'number' }
      }
    },
    delete: {
      method: 'DELETE',
      path: '/api/workflows/{workflowId}/nodes/{nodeId}',
      description: 'Delete workflow node',
      parameters: {
        workflowId: { type: 'number', required: true },
        nodeId: { type: 'number', required: true }
      }
    }
  },

  // ===== WORKFLOW DEFINITION & CANVAS =====
  definition: {
    save: {
      method: 'POST',
      path: '/api/workflows/{workflow}/definition',
      description: 'Save workflow definition/canvas',
      parameters: {
        workflow: { type: 'number', required: true }
      },
      body: {
        definition: { type: 'object', required: true },
        nodes: { type: 'array' },
        edges: { type: 'array' }
      }
    },
    get: {
      method: 'GET',
      path: '/api/workflows/{workflow}/definition',
      description: 'Get workflow definition/canvas',
      parameters: {
        workflow: { type: 'number', required: true }
      }
    }
  },

  // ===== WORKFLOW VALIDATION =====
  validation: {
    validate: {
      method: 'POST',
      path: '/api/workflows/{workflow}/validate',
      description: 'Validate workflow',
      parameters: {
        workflow: { type: 'number', required: true }
      }
    }
  },

  // ===== WORKFLOW METRICS =====
  metrics: {
    general: {
      method: 'GET',
      path: '/api/workflows/metrics',
      description: 'Get general workflow metrics',
      parameters: {
        date_range: { type: 'string' }
      }
    },
    system: {
      method: 'GET',
      path: '/api/workflows/system/performance',
      description: 'Get system performance metrics',
      parameters: {
        date_range: { type: 'string' }
      }
    },
    workflow: {
      method: 'GET',
      path: '/api/workflows/{workflow}/metrics',
      description: 'Get workflow specific metrics',
      parameters: {
        workflow: { type: 'number', required: true },
        date_range: { type: 'string' }
      }
    }
  },

  // ===== WORKFLOW LOGS =====
  logs: {
    workflow: {
      method: 'GET',
      path: '/api/workflows/{id}/logs',
      description: 'Get workflow node logs',
      parameters: {
        id: { type: 'number', required: true },
        per_page: { type: 'number', default: 15 },
        page: { type: 'number', default: 1 },
        level: { type: 'string', options: ['info', 'warning', 'error', 'debug'] },
        date_range: { type: 'string' }
      }
    }
  },

  // ===== PROJECT WORKFLOWS =====
  project: {
    list: {
      method: 'GET',
      path: '/api/projects/{projectId}/workflows',
      description: 'List workflows for specific project',
      parameters: {
        projectId: { type: 'number', required: true },
        per_page: { type: 'number', default: 15 },
        page: { type: 'number', default: 1 }
      }
    },
    create: {
      method: 'POST',
      path: '/api/projects/{projectId}/workflows',
      description: 'Create workflow for project',
      parameters: {
        projectId: { type: 'number', required: true }
      },
      body: {
        name: { type: 'string', required: true },
        description: { type: 'string' },
        status: { type: 'string', options: ['draft', 'active', 'paused'], default: 'draft' },
        definition: { type: 'object', required: true }
      }
    },
    get: {
      method: 'GET',
      path: '/api/projects/{projectId}/workflows/{workflowId}',
      description: 'Get project workflow',
      parameters: {
        projectId: { type: 'number', required: true },
        workflowId: { type: 'number', required: true }
      }
    },
    update: {
      method: 'PUT',
      path: '/api/projects/{projectId}/workflows/{workflowId}',
      description: 'Update project workflow',
      parameters: {
        projectId: { type: 'number', required: true },
        workflowId: { type: 'number', required: true }
      },
      body: {
        name: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string', options: ['draft', 'active', 'paused', 'completed', 'failed'] },
        definition: { type: 'object' }
      }
    },
    delete: {
      method: 'DELETE',
      path: '/api/projects/{projectId}/workflows/{workflowId}',
      description: 'Delete project workflow',
      parameters: {
        projectId: { type: 'number', required: true },
        workflowId: { type: 'number', required: true }
      }
    }
  },

  // ===== WEBHOOKS =====
  webhooks: {
    trigger: {
      method: 'POST',
      path: '/webhooks/{workflowId}/trigger',
      description: 'Trigger workflow via webhook (public endpoint)',
      parameters: {
        workflowId: { type: 'number', required: true }
      },
      body: {
        payload: { type: 'object', default: {} },
        headers: { type: 'object' }
      }
    },
    docs: {
      method: 'GET',
      path: '/webhooks/{workflowId}/docs',
      description: 'Get webhook documentation',
      parameters: {
        workflowId: { type: 'number', required: true }
      }
    },
    test: {
      method: 'POST',
      path: '/webhooks/{workflowId}/test',
      description: 'Test webhook (debug mode only)',
      parameters: {
        workflowId: { type: 'number', required: true }
      },
      body: {
        payload: { type: 'object', default: {} }
      }
    }
  },

  // ===== DRAG & DROP =====
  dragDrop: {
    getNodes: {
      method: 'GET',
      path: '/api/workflows/drag-drop/nodes',
      description: 'Get available nodes for canvas'
    },
    validate: {
      method: 'POST',
      path: '/api/workflows/drag-drop/validate',
      description: 'Validate workflow definition',
      body: {
        definition: { type: 'object', required: true }
      }
    },
    save: {
      method: 'POST',
      path: '/api/workflows/drag-drop/save',
      description: 'Save workflow from canvas',
      body: {
        name: { type: 'string', required: true },
        description: { type: 'string' },
        definition: { type: 'object', required: true },
        nodes: { type: 'array' },
        edges: { type: 'array' }
      }
    },
    update: {
      method: 'PUT',
      path: '/api/workflows/drag-drop/{workflow}',
      description: 'Update workflow from canvas',
      parameters: {
        workflow: { type: 'number', required: true }
      },
      body: {
        name: { type: 'string' },
        description: { type: 'string' },
        definition: { type: 'object' },
        nodes: { type: 'array' },
        edges: { type: 'array' }
      }
    },
    duplicate: {
      method: 'POST',
      path: '/api/workflows/drag-drop/{workflow}/duplicate',
      description: 'Duplicate workflow',
      parameters: {
        workflow: { type: 'number', required: true }
      },
      body: {
        name: { type: 'string' },
        description: { type: 'string' }
      }
    },
    getTemplates: {
      method: 'GET',
      path: '/api/workflows/drag-drop/templates',
      description: 'Get workflow templates'
    },
    createFromTemplate: {
      method: 'POST',
      path: '/api/workflows/drag-drop/templates/create',
      description: 'Create workflow from template',
      body: {
        template_id: { type: 'number', required: true },
        name: { type: 'string' },
        description: { type: 'string' }
      }
    },
    getStatistics: {
      method: 'GET',
      path: '/api/workflows/drag-drop/statistics',
      description: 'Get drag & drop statistics'
    }
  },

  // ===== CANVAS =====
  canvas: {
    autoOrganize: {
      method: 'POST',
      path: '/api/workflows/canvas/{workflow}/auto-organize',
      description: 'Auto-organize canvas nodes',
      parameters: {
        workflow: { type: 'number', required: true }
      }
    },
    align: {
      method: 'POST',
      path: '/api/workflows/canvas/{workflow}/align',
      description: 'Align canvas nodes',
      parameters: {
        workflow: { type: 'number', required: true }
      },
      body: {
        alignment: { type: 'string', options: ['left', 'center', 'right', 'top', 'middle', 'bottom'] }
      }
    },
    optimize: {
      method: 'POST',
      path: '/api/workflows/canvas/{workflow}/optimize',
      description: 'Optimize canvas layout',
      parameters: {
        workflow: { type: 'number', required: true }
      },
      body: {
        optimization_type: { type: 'string', options: ['minimize_crossings', 'minimize_length', 'hierarchical'] }
      }
    },
    analyze: {
      method: 'GET',
      path: '/api/workflows/canvas/{workflow}/analyze',
      description: 'Analyze canvas',
      parameters: {
        workflow: { type: 'number', required: true }
      }
    },
    export: {
      method: 'POST',
      path: '/api/workflows/canvas/{workflow}/export',
      description: 'Export canvas configuration',
      parameters: {
        workflow: { type: 'number', required: true }
      },
      body: {
        format: { type: 'string', options: ['json', 'png', 'svg'] },
        include_metadata: { type: 'boolean', default: true }
      }
    }
  },

  // ===== ORCHESTRATION =====
  orchestration: {
    orchestrate: {
      method: 'POST',
      path: '/api/workflows/orchestrate',
      description: 'Orchestrate workflows',
      body: {
        workflow_ids: { type: 'array', required: true },
        execution_order: { type: 'string', options: ['sequential', 'parallel'] },
        dependencies: { type: 'array' }
      }
    },
    export: {
      method: 'POST',
      path: '/api/workflows/export',
      description: 'Export workflows',
      body: {
        workflow_ids: { type: 'array' },
        format: { type: 'string', options: ['json', 'yaml'] },
        include_executions: { type: 'boolean', default: false }
      }
    }
  }
};

// ===== UTILITY FUNCTIONS =====
export const buildApiUrl = (endpoint: ApiEndpoint, parameters: { [key: string]: any } = {}): string => {
  let url = endpoint.path;
  
  Object.entries(parameters).forEach(([key, value]) => {
    if (endpoint.parameters && endpoint.parameters[key]) {
      url = url.replace(`{${key}}`, value.toString());
    }
  });
  
  return url;
};

export const buildQueryString = (endpoint: ApiEndpoint, parameters: { [key: string]: any } = {}): string => {
  const queryParams: string[] = [];
  
  Object.entries(parameters).forEach(([key, value]) => {
    if (endpoint.parameters && endpoint.parameters[key] && value !== undefined) {
      queryParams.push(`${key}=${encodeURIComponent(value)}`);
    }
  });
  
  return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
};

export const getEndpoint = (category: string, action: string): ApiEndpoint | null => {
  return workflowApiEndpoints[category]?.[action] || null;
};

export const getAllEndpoints = (): ApiEndpoints => {
  return workflowApiEndpoints;
};

export const getEndpointsByCategory = (category: string): { [action: string]: ApiEndpoint } => {
  return workflowApiEndpoints[category] || {};
};

export const validateEndpointParameters = (endpoint: ApiEndpoint, parameters: { [key: string]: any }): EndpointValidation => {
  const errors: string[] = [];
  
  if (endpoint.parameters) {
    Object.entries(endpoint.parameters).forEach(([key, config]) => {
      if (config.required && !parameters[key]) {
        errors.push(`${key} is required`);
      }
    });
  }
  
  return { valid: errors.length === 0, errors };
};

export default workflowApiEndpoints;
