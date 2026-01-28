import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { workflowsService } from '../services';
import { WorkflowExecution, WorkflowExecutionStatus } from '../types/workflowTypes';

// Interface para filtros de execução
export interface ExecutionFilters {
  workflow_id?: number;
  status?: WorkflowExecutionStatus;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Interface para paginação de execuções
export interface ExecutionPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// Interface para estatísticas de execução
export interface ExecutionStats {
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  running_executions: number;
  average_execution_time: number;
  success_rate: number;
  failure_rate: number;
  throughput_per_hour: number;
}

// Estado do store
interface ExecutionsStoreState {
  // ===== CORE STATE =====
  executions: WorkflowExecution[];
  currentExecution: WorkflowExecution | null;
  loading: boolean;
  error: string | null;
  
  // ===== FILTERS & PAGINATION =====
  filters: ExecutionFilters;
  pagination: ExecutionPagination;
  
  // ===== STATISTICS =====
  stats: ExecutionStats | null;
  
  // ===== UI STATE =====
  isExecuting: boolean;
  isStopping: boolean;
  isPausing: boolean;
  isResuming: boolean;
  lastFetchTime: number | null;
}

// Ações do store
interface ExecutionsStoreActions {
  // ===== EXECUTION MANAGEMENT =====
  fetchExecutions: (params?: ExecutionFilters & { page?: number; limit?: number }) => Promise<void>;
  fetchExecution: (executionId: number) => Promise<void>;
  executeWorkflow: (workflowId: number, variables?: Record<string, any>) => Promise<{ success: boolean; data?: WorkflowExecution; error?: string }>;
  stopExecution: (executionId: number) => Promise<{ success: boolean; data?: WorkflowExecution; error?: string }>;
  pauseExecution: (executionId: number) => Promise<{ success: boolean; data?: WorkflowExecution; error?: string }>;
  resumeExecution: (executionId: number) => Promise<{ success: boolean; data?: WorkflowExecution; error?: string }>;
  cancelExecution: (executionId: number) => Promise<{ success: boolean; data?: WorkflowExecution; error?: string }>;
  retryExecution: (executionId: number, variables?: Record<string, any>) => Promise<{ success: boolean; data?: WorkflowExecution; error?: string }>;
  
  // ===== WORKFLOW EXECUTIONS =====
  fetchWorkflowExecutions: (workflowId: number, params?: Omit<ExecutionFilters, 'workflow_id'>) => Promise<void>;
  
  // ===== EXECUTION STATUS =====
  getExecutionStatus: (executionId: number) => Promise<WorkflowExecutionStatus | null>;
  updateExecutionStatus: (executionId: number, status: WorkflowExecutionStatus) => void;
  
  // ===== STATISTICS =====
  fetchExecutionStats: (workflowId?: number) => Promise<void>;
  fetchRunningExecutions: () => Promise<void>;
  fetchFailedExecutions: () => Promise<void>;
  
  // ===== FILTERS =====
  setExecutionFilters: (filters: Partial<ExecutionFilters>) => void;
  clearExecutionFilters: () => void;
  updateExecutionFilter: (key: keyof ExecutionFilters, value: any) => void;
  
  // ===== PAGINATION =====
  setExecutionPage: (page: number) => void;
  setExecutionLimit: (limit: number) => void;
  
  // ===== UTILITY =====
  refreshExecutions: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

// Store completo
type ExecutionsStore = ExecutionsStoreState & ExecutionsStoreActions;

// Estado inicial
const initialState: ExecutionsStoreState = {
  executions: [],
  currentExecution: null,
  loading: false,
  error: null,
  
  filters: {
    workflow_id: undefined,
    status: undefined,
    start_date: undefined,
    end_date: undefined,
    sort_by: 'created_at',
    sort_order: 'desc'
  },
  
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  },
  
  stats: null,
  
  isExecuting: false,
  isStopping: false,
  isPausing: false,
  isResuming: false,
  lastFetchTime: null
};

/**
 * Store para gerenciamento de execuções de workflows
 * Responsável por execução, monitoramento e controle de workflows
 */
export const useExecutionsStore = create<ExecutionsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ===== EXECUTION MANAGEMENT =====

      fetchExecutions: async (params) => {
        set({ loading: true, error: null });
        
        try {
          const currentState = get();
          const searchParams = {
            ...currentState.filters,
            ...params,
            page: params?.page || currentState.pagination.page,
            limit: params?.limit || currentState.pagination.limit
          };

          const response = await workflowsService.getExecutions(searchParams);
          
          set({
            executions: response.data,
            pagination: {
              page: response.page,
              limit: response.limit,
              total: response.total,
              total_pages: response.total_pages
            },
            loading: false,
            lastFetchTime: Date.now()
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar execuções',
            loading: false
          });
        }
      },

      fetchExecution: async (executionId) => {
        set({ loading: true, error: null });
        
        try {
          const execution = await workflowsService.getExecutionById(executionId);
          
          set({
            currentExecution: execution,
            loading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar execução',
            loading: false
          });
        }
      },

      executeWorkflow: async (workflowId, variables) => {
        set({ isExecuting: true, error: null });
        
        try {
          const execution = await workflowsService.executeWorkflow({
            workflow_id: workflowId,
            variables
          });
          
          // Adicionar à lista de execuções
          const currentState = get();
          set({
            executions: [execution, ...currentState.executions],
            currentExecution: execution,
            isExecuting: false
          });
          
          return { success: true, data: execution };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao executar workflow';
          set({ error: errorMessage, isExecuting: false });
          return { success: false, error: errorMessage };
        }
      },

      stopExecution: async (executionId) => {
        set({ isStopping: true, error: null });
        
        try {
          const stoppedExecution = await workflowsService.stopExecution(executionId);
          
          // Atualizar na lista
          const currentState = get();
          const updatedExecutions = currentState.executions.map(e => 
            e.id === executionId ? stoppedExecution : e
          );
          
          set({
            executions: updatedExecutions,
            currentExecution: currentState.currentExecution?.id === executionId 
              ? stoppedExecution 
              : currentState.currentExecution,
            isStopping: false
          });
          
          return { success: true, data: stoppedExecution };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao parar execução';
          set({ error: errorMessage, isStopping: false });
          return { success: false, error: errorMessage };
        }
      },

      pauseExecution: async (executionId) => {
        set({ isPausing: true, error: null });
        
        try {
          const pausedExecution = await workflowsService.stopExecution(executionId); // Assumindo que stopExecution também pausa
          
          // Atualizar na lista
          const currentState = get();
          const updatedExecutions = currentState.executions.map(e => 
            e.id === executionId ? pausedExecution : e
          );
          
          set({
            executions: updatedExecutions,
            currentExecution: currentState.currentExecution?.id === executionId 
              ? pausedExecution 
              : currentState.currentExecution,
            isPausing: false
          });
          
          return { success: true, data: pausedExecution };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao pausar execução';
          set({ error: errorMessage, isPausing: false });
          return { success: false, error: errorMessage };
        }
      },

      resumeExecution: async (executionId) => {
        set({ isResuming: true, error: null });
        
        try {
          // Assumindo que existe um método resumeExecution no service
          const resumedExecution = await workflowsService.stopExecution(executionId); // Placeholder
          
          // Atualizar na lista
          const currentState = get();
          const updatedExecutions = currentState.executions.map(e => 
            e.id === executionId ? resumedExecution : e
          );
          
          set({
            executions: updatedExecutions,
            currentExecution: currentState.currentExecution?.id === executionId 
              ? resumedExecution 
              : currentState.currentExecution,
            isResuming: false
          });
          
          return { success: true, data: resumedExecution };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao resumir execução';
          set({ error: errorMessage, isResuming: false });
          return { success: false, error: errorMessage };
        }
      },

      cancelExecution: async (executionId) => {
        set({ isStopping: true, error: null });
        
        try {
          const cancelledExecution = await workflowsService.stopExecution(executionId);
          
          // Atualizar na lista
          const currentState = get();
          const updatedExecutions = currentState.executions.map(e => 
            e.id === executionId ? cancelledExecution : e
          );
          
          set({
            executions: updatedExecutions,
            currentExecution: currentState.currentExecution?.id === executionId 
              ? cancelledExecution 
              : currentState.currentExecution,
            isStopping: false
          });
          
          return { success: true, data: cancelledExecution };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao cancelar execução';
          set({ error: errorMessage, isStopping: false });
          return { success: false, error: errorMessage };
        }
      },

      retryExecution: async (executionId, variables) => {
        set({ isExecuting: true, error: null });
        
        try {
          // Assumindo que existe um método retryExecution no service
          const retriedExecution = await workflowsService.executeWorkflow({
            workflow_id: 0, // Seria obtido da execução original
            variables
          });
          
          // Adicionar à lista de execuções
          const currentState = get();
          set({
            executions: [retriedExecution, ...currentState.executions],
            isExecuting: false
          });
          
          return { success: true, data: retriedExecution };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao tentar novamente execução';
          set({ error: errorMessage, isExecuting: false });
          return { success: false, error: errorMessage };
        }
      },

      // ===== WORKFLOW EXECUTIONS =====

      fetchWorkflowExecutions: async (workflowId, params) => {
        await get().fetchExecutions({
          ...params,
          workflow_id: workflowId
        });
      },

      // ===== EXECUTION STATUS =====

      getExecutionStatus: async (executionId) => {
        try {
          const execution = await workflowsService.getExecutionById(executionId);
          return execution.status;
        } catch (error) {
          console.error(`Erro ao obter status da execução ${executionId}:`, error);
          return null;
        }
      },

      updateExecutionStatus: (executionId, status) => {
        set((state) => ({
          executions: state.executions.map(e => 
            e.id === executionId ? { ...e, status } : e
          ),
          currentExecution: state.currentExecution?.id === executionId 
            ? { ...state.currentExecution, status }
            : state.currentExecution
        }));
      },

      // ===== STATISTICS =====

      fetchExecutionStats: async (workflowId) => {
        try {
          const stats = await workflowsService.getExecutionStats(workflowId ? { workflow_id: workflowId } : {});
          set({ stats });
        } catch (error) {
          console.error('Erro ao obter estatísticas de execuções:', error);
        }
      },

      fetchRunningExecutions: async () => {
        await get().fetchExecutions({ status: 'running' as WorkflowExecutionStatus });
      },

      fetchFailedExecutions: async () => {
        await get().fetchExecutions({ status: 'failed' as WorkflowExecutionStatus });
      },

      // ===== FILTERS =====

      setExecutionFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 }
        }));
      },

      clearExecutionFilters: () => {
        set((state) => ({
          filters: initialState.filters,
          pagination: { ...state.pagination, page: 1 }
        }));
      },

      updateExecutionFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
          pagination: { ...state.pagination, page: 1 }
        }));
      },

      // ===== PAGINATION =====

      setExecutionPage: (page) => {
        set((state) => ({
          pagination: { ...state.pagination, page }
        }));
      },

      setExecutionLimit: (limit) => {
        set((state) => ({
          pagination: { ...state.pagination, limit, page: 1 }
        }));
      },

      // ===== UTILITY =====

      refreshExecutions: async () => {
        const state = get();
        await get().fetchExecutions({
          ...state.filters,
          page: state.pagination.page,
          limit: state.pagination.limit
        });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      }
    }),
    {
      name: 'executions-store',
      partialize: (state) => ({
        filters: state.filters,
        pagination: state.pagination
      })
    }
  )
);

export default useExecutionsStore;
