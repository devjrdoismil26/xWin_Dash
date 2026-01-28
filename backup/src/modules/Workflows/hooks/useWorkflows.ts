import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { workflowService } from '../services/workflowService';
import { workflowExecutorsService } from '../services/workflowExecutorsService';
import { Workflow, WorkflowExecution, WorkflowAnalytics } from '../types/workflowTypes';

interface WorkflowFilters {
  status: string;
  search: string;
  dateRange: any;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface WorkflowPagination {
  page: number;
  perPage: number;
  total: number;
}

interface WorkflowState {
  // ===== STATE =====
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  workflowExecutions: WorkflowExecution[];
  currentExecution: WorkflowExecution | null;
  workflowMetrics: WorkflowAnalytics | null;
  generalMetrics: any;
  systemPerformanceMetrics: any;
  availableNodes: any[];
  workflowTemplates: any[];
  dragDropStatistics: any;
  
  // UI State
  loading: boolean;
  error: string | null;
  selectedWorkflowId: string | number | null;
  canvasData: any;
  validationResults: any;
  
  // Filters and pagination
  filters: WorkflowFilters;
  pagination: WorkflowPagination;
}

interface WorkflowActions {
  // ===== ACTIONS =====

  // Workflow CRUD Actions
  fetchWorkflows: (params?: any) => Promise<void>;
  fetchWorkflow: (workflowId: string | number) => Promise<void>;
  createWorkflow: (workflowData: Partial<Workflow>) => Promise<{ success: boolean; data?: Workflow; error?: string }>;
  updateWorkflow: (workflowId: string | number, workflowData: Partial<Workflow>) => Promise<{ success: boolean; data?: Workflow; error?: string }>;
  deleteWorkflow: (workflowId: string | number) => Promise<{ success: boolean; error?: string }>;

  // Workflow Execution Actions
  executeWorkflow: (workflowId: string | number, executionData?: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  simulateWorkflow: (workflowId: string | number, simulationData?: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  cloneWorkflow: (workflowId: string | number, cloneData?: any) => Promise<{ success: boolean; data?: Workflow; error?: string }>;
  toggleWorkflowActive: (workflowId: string | number) => Promise<{ success: boolean; data?: Workflow; error?: string }>;

  // Workflow Definition/Canvas Actions
  saveWorkflowDefinition: (workflowId: string | number, definition: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  fetchWorkflowDefinition: (workflowId: string | number) => Promise<{ success: boolean; data?: any; error?: string }>;

  // Execution Management Actions
  fetchWorkflowExecutions: (workflowId: string | number, params?: any) => Promise<void>;
  pauseExecution: (executionId: string | number) => Promise<{ success: boolean; data?: any; error?: string }>;
  resumeExecution: (executionId: string | number) => Promise<{ success: boolean; data?: any; error?: string }>;
  cancelExecution: (executionId: string | number) => Promise<{ success: boolean; data?: any; error?: string }>;

  // Validation Actions
  validateWorkflow: (workflowId: string | number, definition?: any) => Promise<{ success: boolean; data?: any; error?: string }>;

  // Metrics Actions
  fetchWorkflowMetrics: (workflowId: string | number, params?: any) => Promise<void>;
  fetchGeneralMetrics: (params?: any) => Promise<void>;
  fetchSystemPerformanceMetrics: (params?: any) => Promise<void>;

  // Canvas/Available Nodes Actions
  fetchAvailableNodes: () => Promise<void>;

  // Executor Actions
  executeNode: (nodeType: string, nodeConfig: any, executionContext?: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  testNode: (nodeType: string, nodeConfig: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  getExecutorConfigSchema: (nodeType: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  validateExecutorConfig: (nodeType: string, nodeConfig: any) => Promise<{ success: boolean; data?: any; error?: string }>;

  fetchWorkflowTemplates: () => Promise<void>;
  createFromTemplate: (templateId: string | number, templateData?: any) => Promise<{ success: boolean; data?: Workflow; error?: string }>;
  fetchDragDropStatistics: () => Promise<void>;

  // Canvas Layout Actions
  autoOrganizeCanvas: (workflowId: string | number) => Promise<{ success: boolean; data?: any; error?: string }>;
  alignCanvasNodes: (workflowId: string | number, alignmentData: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  optimizeCanvasLayout: (workflowId: string | number, optimizationData?: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  analyzeCanvas: (workflowId: string | number) => Promise<{ success: boolean; data?: any; error?: string }>;
  exportCanvasConfig: (workflowId: string | number, exportOptions?: any) => Promise<{ success: boolean; data?: any; error?: string }>;

  // Orchestration Actions
  orchestrateWorkflows: (orchestrationData: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  exportWorkflows: (exportOptions?: any) => Promise<{ success: boolean; data?: any; error?: string }>;

  // UI State Actions
  setSelectedWorkflow: (workflowId: string | number | null) => void;
  setCanvasData: (canvasData: any) => void;
  setFilters: (filters: Partial<WorkflowFilters>) => void;
  setPagination: (pagination: Partial<WorkflowPagination>) => void;
  clearError: () => void;
  resetState: () => void;

  // ===== COMPUTED VALUES =====
  getActiveWorkflows: () => Workflow[];
  getWorkflowsByStatus: (status: string) => Workflow[];
  getRecentWorkflows: (limit?: number) => Workflow[];
  getRunningExecutions: () => WorkflowExecution[];
  getFailedExecutions: () => WorkflowExecution[];
  getWorkflowStatistics: () => any;
}

type WorkflowStore = WorkflowState & WorkflowActions;

const useWorkflowsStore = create<WorkflowStore>()(
  devtools(
    (set, get) => ({
      // ===== STATE =====
      workflows: [],
      currentWorkflow: null,
      workflowExecutions: [],
      currentExecution: null,
      workflowMetrics: null,
      generalMetrics: null,
      systemPerformanceMetrics: null,
      availableNodes: [],
      workflowTemplates: [],
      dragDropStatistics: null,
      
      // UI State
      loading: false,
      error: null,
      selectedWorkflowId: null,
      canvasData: null,
      validationResults: null,
      
      // Filters and pagination
      filters: {
        status: '',
        search: '',
        dateRange: null,
        sortBy: 'updated_at',
        sortOrder: 'desc'
      },
      pagination: {
        page: 1,
        perPage: 10,
        total: 0
      },

      // ===== ACTIONS =====

      // Workflow CRUD Actions
      fetchWorkflows: async (params: any = {}) => {
        set({ loading: true, error: null });
        try {
          const { filters, pagination } = get();
          const queryParams = {
            ...params,
            ...filters,
            page: pagination.page,
            per_page: pagination.perPage
          };
          
          const result = await workflowService.getWorkflows(queryParams);
          
          if (result.success) {
            set({ 
              workflows: result.data.data || result.data,
              pagination: {
                ...pagination,
                total: result.data.total || result.data.length || 0
              },
              loading: false 
            });
          } else {
            set({ error: result.error, loading: false });
          }
        } catch (error: any) {
          set({ error: 'Failed to fetch workflows', loading: false });
        }
      },

      fetchWorkflow: async (workflowId: string | number) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.getWorkflow(workflowId);
          
          if (result.success) {
            set({ 
              currentWorkflow: result.data,
              selectedWorkflowId: workflowId,
              loading: false 
            });
          } else {
            set({ error: result.error, loading: false });
          }
        } catch (error: any) {
          set({ error: 'Failed to fetch workflow', loading: false });
        }
      },

      createWorkflow: async (workflowData: Partial<Workflow>) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.createWorkflow(workflowData);
          
          if (result.success) {
            const { workflows } = get();
            set({ 
              workflows: [result.data, ...workflows],
              currentWorkflow: result.data,
              selectedWorkflowId: result.data.id,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to create workflow';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      updateWorkflow: async (workflowId: string | number, workflowData: Partial<Workflow>) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.updateWorkflow(workflowId, workflowData);
          
          if (result.success) {
            const { workflows, currentWorkflow } = get();
            const updatedWorkflows = workflows.map(w => 
              w.id === workflowId ? result.data : w
            );
            
            set({ 
              workflows: updatedWorkflows,
              currentWorkflow: currentWorkflow?.id === workflowId ? result.data : currentWorkflow,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to update workflow';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      deleteWorkflow: async (workflowId: string | number) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.deleteWorkflow(workflowId);
          
          if (result.success) {
            const { workflows, currentWorkflow, selectedWorkflowId } = get();
            const filteredWorkflows = workflows.filter(w => w.id !== workflowId);
            
            set({ 
              workflows: filteredWorkflows,
              currentWorkflow: currentWorkflow?.id === workflowId ? null : currentWorkflow,
              selectedWorkflowId: selectedWorkflowId === workflowId ? null : selectedWorkflowId,
              loading: false 
            });
            return { success: true };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to delete workflow';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      // Workflow Execution Actions
      executeWorkflow: async (workflowId: string | number, executionData: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.executeWorkflow(workflowId, executionData);
          
          if (result.success) {
            set({ 
              currentExecution: result.data,
              loading: false 
            });
            // Refresh executions list
            get().fetchWorkflowExecutions(workflowId);
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to execute workflow';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      simulateWorkflow: async (workflowId: string | number, simulationData: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.simulateWorkflow(workflowId, simulationData);
          
          if (result.success) {
            set({ loading: false });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to simulate workflow';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      cloneWorkflow: async (workflowId: string | number, cloneData: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.cloneWorkflow(workflowId, cloneData);
          
          if (result.success) {
            const { workflows } = get();
            set({ 
              workflows: [result.data, ...workflows],
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to clone workflow';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      toggleWorkflowActive: async (workflowId: string | number) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.toggleWorkflowActive(workflowId);
          
          if (result.success) {
            const { workflows, currentWorkflow } = get();
            const updatedWorkflows = workflows.map(w => 
              w.id === workflowId ? result.data : w
            );
            
            set({ 
              workflows: updatedWorkflows,
              currentWorkflow: currentWorkflow?.id === workflowId ? result.data : currentWorkflow,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to toggle workflow status';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      // Workflow Definition/Canvas Actions
      saveWorkflowDefinition: async (workflowId: string | number, definition: any) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.saveWorkflowDefinition(workflowId, definition);
          
          if (result.success) {
            set({ 
              canvasData: definition,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to save workflow definition';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      fetchWorkflowDefinition: async (workflowId: string | number) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.getWorkflowDefinition(workflowId);
          
          if (result.success) {
            set({ 
              canvasData: result.data,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to fetch workflow definition';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      // Execution Management Actions
      fetchWorkflowExecutions: async (workflowId: string | number, params: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.getWorkflowExecutions(workflowId, params);
          
          if (result.success) {
            set({ 
              workflowExecutions: result.data.data || result.data,
              loading: false 
            });
          } else {
            set({ error: result.error, loading: false });
          }
        } catch (error: any) {
          set({ error: 'Failed to fetch workflow executions', loading: false });
        }
      },

      pauseExecution: async (executionId: string | number) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.pauseExecution(executionId);
          
          if (result.success) {
            const { workflowExecutions } = get();
            const updatedExecutions = workflowExecutions.map(e => 
              e.id === executionId ? result.data : e
            );
            set({ 
              workflowExecutions: updatedExecutions,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to pause execution';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      resumeExecution: async (executionId: string | number) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.resumeExecution(executionId);
          
          if (result.success) {
            const { workflowExecutions } = get();
            const updatedExecutions = workflowExecutions.map(e => 
              e.id === executionId ? result.data : e
            );
            set({ 
              workflowExecutions: updatedExecutions,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to resume execution';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      cancelExecution: async (executionId: string | number) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.cancelExecution(executionId);
          
          if (result.success) {
            const { workflowExecutions } = get();
            const updatedExecutions = workflowExecutions.map(e => 
              e.id === executionId ? result.data : e
            );
            set({ 
              workflowExecutions: updatedExecutions,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to cancel execution';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      // Validation Actions
      validateWorkflow: async (workflowId: string | number, definition: any = null) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.validateWorkflow(workflowId, definition);
          
          if (result.success) {
            set({ 
              validationResults: result.data,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to validate workflow';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      // Metrics Actions
      fetchWorkflowMetrics: async (workflowId: string | number, params: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.getWorkflowMetrics(workflowId, params);
          
          if (result.success) {
            set({ 
              workflowMetrics: result.data,
              loading: false 
            });
          } else {
            set({ error: result.error, loading: false });
          }
        } catch (error: any) {
          set({ error: 'Failed to fetch workflow metrics', loading: false });
        }
      },

      fetchGeneralMetrics: async (params: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.getGeneralMetrics(params);
          
          if (result.success) {
            set({ 
              generalMetrics: result.data,
              loading: false 
            });
          } else {
            set({ error: result.error, loading: false });
          }
        } catch (error: any) {
          set({ error: 'Failed to fetch general metrics', loading: false });
        }
      },

      fetchSystemPerformanceMetrics: async (params: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.getSystemPerformanceMetrics(params);
          
          if (result.success) {
            set({ 
              systemPerformanceMetrics: result.data,
              loading: false 
            });
          } else {
            set({ error: result.error, loading: false });
          }
        } catch (error: any) {
          set({ error: 'Failed to fetch system performance metrics', loading: false });
        }
      },

      // Canvas/Available Nodes Actions
      fetchAvailableNodes: async () => {
        set({ loading: true, error: null });
        try {
          const result = await workflowExecutorsService.getAvailableExecutors();
          
          if (result.success) {
            set({ 
              availableNodes: result.data,
              loading: false 
            });
          } else {
            set({ error: result.error, loading: false });
          }
        } catch (error: any) {
          set({ error: 'Failed to fetch available nodes', loading: false });
        }
      },

      // Executor Actions
      executeNode: async (nodeType: string, nodeConfig: any, executionContext: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowExecutorsService.executeNode(nodeType, nodeConfig, executionContext);
          
          if (result.success) {
            set({ loading: false });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to execute node';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      testNode: async (nodeType: string, nodeConfig: any) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowExecutorsService.testNode(nodeType, nodeConfig);
          
          if (result.success) {
            set({ loading: false });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to test node';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      getExecutorConfigSchema: async (nodeType: string) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowExecutorsService.getExecutorConfigSchema(nodeType);
          
          if (result.success) {
            set({ loading: false });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to fetch executor config schema';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      validateExecutorConfig: async (nodeType: string, nodeConfig: any) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowExecutorsService.validateExecutorConfig(nodeType, nodeConfig);
          
          if (result.success) {
            set({ loading: false });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to validate executor config';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      fetchWorkflowTemplates: async () => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.getWorkflowTemplates();
          
          if (result.success) {
            set({ 
              workflowTemplates: result.data,
              loading: false 
            });
          } else {
            set({ error: result.error, loading: false });
          }
        } catch (error: any) {
          set({ error: 'Failed to fetch workflow templates', loading: false });
        }
      },

      createFromTemplate: async (templateId: string | number, templateData: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.createFromTemplate(templateId, templateData);
          
          if (result.success) {
            const { workflows } = get();
            set({ 
              workflows: [result.data, ...workflows],
              currentWorkflow: result.data,
              selectedWorkflowId: result.data.id,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to create workflow from template';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      fetchDragDropStatistics: async () => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.getDragDropStatistics();
          
          if (result.success) {
            set({ 
              dragDropStatistics: result.data,
              loading: false 
            });
          } else {
            set({ error: result.error, loading: false });
          }
        } catch (error: any) {
          set({ error: 'Failed to fetch drag & drop statistics', loading: false });
        }
      },

      // Canvas Layout Actions
      autoOrganizeCanvas: async (workflowId: string | number) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.autoOrganizeCanvas(workflowId);
          
          if (result.success) {
            set({ 
              canvasData: result.data,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to auto-organize canvas';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      alignCanvasNodes: async (workflowId: string | number, alignmentData: any) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.alignCanvasNodes(workflowId, alignmentData);
          
          if (result.success) {
            set({ 
              canvasData: result.data,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to align canvas nodes';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      optimizeCanvasLayout: async (workflowId: string | number, optimizationData: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.optimizeCanvasLayout(workflowId, optimizationData);
          
          if (result.success) {
            set({ 
              canvasData: result.data,
              loading: false 
            });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to optimize canvas layout';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      analyzeCanvas: async (workflowId: string | number) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.analyzeCanvas(workflowId);
          
          if (result.success) {
            set({ loading: false });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to analyze canvas';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      exportCanvasConfig: async (workflowId: string | number, exportOptions: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.exportCanvasConfig(workflowId, exportOptions);
          
          if (result.success) {
            set({ loading: false });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to export canvas config';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      // Orchestration Actions
      orchestrateWorkflows: async (orchestrationData: any) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.orchestrateWorkflows(orchestrationData);
          
          if (result.success) {
            set({ loading: false });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to orchestrate workflows';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      exportWorkflows: async (exportOptions: any = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await workflowService.exportWorkflows(exportOptions);
          
          if (result.success) {
            set({ loading: false });
            return { success: true, data: result.data };
          } else {
            set({ error: result.error, loading: false });
            return { success: false, error: result.error };
          }
        } catch (error: any) {
          const errorMsg = 'Failed to export workflows';
          set({ error: errorMsg, loading: false });
          return { success: false, error: errorMsg };
        }
      },

      // UI State Actions
      setSelectedWorkflow: (workflowId: string | number | null) => {
        set({ selectedWorkflowId: workflowId });
      },

      setCanvasData: (canvasData: any) => {
        set({ canvasData });
      },

      setFilters: (filters: Partial<WorkflowFilters>) => {
        set({ filters: { ...get().filters, ...filters } });
      },

      setPagination: (pagination: Partial<WorkflowPagination>) => {
        set({ pagination: { ...get().pagination, ...pagination } });
      },

      clearError: () => {
        set({ error: null });
      },

      resetState: () => {
        set({
          workflows: [],
          currentWorkflow: null,
          workflowExecutions: [],
          currentExecution: null,
          workflowMetrics: null,
          generalMetrics: null,
          systemPerformanceMetrics: null,
          availableNodes: [],
          workflowTemplates: [],
          dragDropStatistics: null,
          loading: false,
          error: null,
          selectedWorkflowId: null,
          canvasData: null,
          validationResults: null,
          filters: {
            status: '',
            search: '',
            dateRange: null,
            sortBy: 'updated_at',
            sortOrder: 'desc'
          },
          pagination: {
            page: 1,
            perPage: 10,
            total: 0
          }
        });
      },

      // ===== COMPUTED VALUES =====
      
      // Get active workflows
      getActiveWorkflows: () => {
        const { workflows } = get();
        return workflows.filter(w => w.status === 'active');
      },

      // Get workflows by status
      getWorkflowsByStatus: (status: string) => {
        const { workflows } = get();
        return workflows.filter(w => w.status === status);
      },

      // Get recent workflows
      getRecentWorkflows: (limit: number = 5) => {
        const { workflows } = get();
        return workflows
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, limit);
      },

      // Get running executions
      getRunningExecutions: () => {
        const { workflowExecutions } = get();
        return workflowExecutions.filter(e => e.status === 'running');
      },

      // Get failed executions
      getFailedExecutions: () => {
        const { workflowExecutions } = get();
        return workflowExecutions.filter(e => e.status === 'failed');
      },

      // Get workflow statistics
      getWorkflowStatistics: () => {
        const { workflows, workflowExecutions } = get();
        return {
          totalWorkflows: workflows.length,
          activeWorkflows: workflows.filter(w => w.status === 'active').length,
          draftWorkflows: workflows.filter(w => w.status === 'draft').length,
          totalExecutions: workflowExecutions.length,
          runningExecutions: workflowExecutions.filter(e => e.status === 'running').length,
          completedExecutions: workflowExecutions.filter(e => e.status === 'completed').length,
          failedExecutions: workflowExecutions.filter(e => e.status === 'failed').length
        };
      }
    }),
    {
      name: 'workflows-store',
      partialize: (state) => ({
        filters: state.filters,
        pagination: state.pagination,
        selectedWorkflowId: state.selectedWorkflowId
      })
    }
  )
);

export const useWorkflows = useWorkflowsStore;
export default useWorkflowsStore;
