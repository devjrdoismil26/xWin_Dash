import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { workflowsService } from '../services';
import { WorkflowAnalytics, WorkflowPerformanceMetrics, WorkflowSystemMetrics } from '../types/workflowTypes';

// Interface para filtros de métricas
export interface MetricsFilters {
  workflow_id?: number;
  start_date?: string;
  end_date?: string;
  period?: 'hour' | 'day' | 'week' | 'month' | 'year';
  group_by?: 'workflow' | 'status' | 'trigger_type' | 'date';
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
    count: number;
  }>;
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
  uptime: number;
}

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
    execution_count: number;
  }>;
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

// Interface para métricas em tempo real
export interface RealTimeMetrics {
  active_executions: number;
  queue_size: number;
  processing_rate: number;
  error_rate: number;
  system_health: 'healthy' | 'warning' | 'critical';
}

// Interface para tendências de execução
export interface ExecutionTrends {
  date: string;
  executions: number;
  successful: number;
  failed: number;
  average_time: number;
}

// Estado do store
interface MetricsStoreState {
  // ===== CORE STATE =====
  workflowMetrics: WorkflowAnalytics | null;
  executionStats: ExecutionStats | null;
  performanceMetrics: WorkflowPerformanceMetrics | null;
  systemMetrics: WorkflowSystemMetrics | null;
  performanceReport: PerformanceReport | null;
  realTimeMetrics: RealTimeMetrics | null;
  executionTrends: ExecutionTrends[];
  
  // ===== FILTERS =====
  filters: MetricsFilters;
  
  // ===== UI STATE =====
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  
  // ===== LOADING STATES =====
  isLoadingWorkflowMetrics: boolean;
  isLoadingExecutionStats: boolean;
  isLoadingPerformanceMetrics: boolean;
  isLoadingSystemMetrics: boolean;
  isLoadingPerformanceReport: boolean;
  isLoadingRealTimeMetrics: boolean;
  isLoadingExecutionTrends: boolean;
}

// Ações do store
interface MetricsStoreActions {
  // ===== METRICS FETCHING =====
  fetchWorkflowMetrics: (params?: MetricsFilters) => Promise<void>;
  fetchExecutionStats: (params?: MetricsFilters) => Promise<void>;
  fetchPerformanceData: (params?: MetricsFilters) => Promise<void>;
  fetchSystemMetrics: () => Promise<void>;
  fetchPerformanceReport: (params?: MetricsFilters) => Promise<void>;
  fetchRealTimeMetrics: () => Promise<void>;
  fetchExecutionTrends: (params?: MetricsFilters) => Promise<void>;
  
  // ===== WORKFLOW SPECIFIC METRICS =====
  fetchWorkflowMetricsById: (workflowId: number, params?: Omit<MetricsFilters, 'workflow_id'>) => Promise<void>;
  fetchWorkflowExecutionStats: (workflowId: number, params?: Omit<MetricsFilters, 'workflow_id'>) => Promise<void>;
  fetchWorkflowPerformanceData: (workflowId: number, params?: Omit<MetricsFilters, 'workflow_id'>) => Promise<void>;
  
  // ===== FILTERS =====
  setMetricsFilters: (filters: Partial<MetricsFilters>) => void;
  clearMetricsFilters: () => void;
  updateMetricsFilter: (key: keyof MetricsFilters, value: any) => void;
  
  // ===== UTILITY =====
  refreshAllMetrics: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

// Store completo
type MetricsStore = MetricsStoreState & MetricsStoreActions;

// Estado inicial
const initialState: MetricsStoreState = {
  workflowMetrics: null,
  executionStats: null,
  performanceMetrics: null,
  systemMetrics: null,
  performanceReport: null,
  realTimeMetrics: null,
  executionTrends: [],
  
  filters: {
    workflow_id: undefined,
    start_date: undefined,
    end_date: undefined,
    period: 'day',
    group_by: 'date'
  },
  
  loading: false,
  error: null,
  lastFetchTime: null,
  
  isLoadingWorkflowMetrics: false,
  isLoadingExecutionStats: false,
  isLoadingPerformanceMetrics: false,
  isLoadingSystemMetrics: false,
  isLoadingPerformanceReport: false,
  isLoadingRealTimeMetrics: false,
  isLoadingExecutionTrends: false
};

/**
 * Store para métricas e estatísticas de workflows
 * Responsável por coleta, análise e relatórios de performance
 */
export const useMetricsStore = create<MetricsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ===== METRICS FETCHING =====

      fetchWorkflowMetrics: async (params) => {
        set({ isLoadingWorkflowMetrics: true, error: null });
        
        try {
          const currentState = get();
          const searchParams = {
            ...currentState.filters,
            ...params
          };

          const metrics = await workflowsService.getWorkflowMetrics(searchParams);
          
          set({
            workflowMetrics: metrics,
            isLoadingWorkflowMetrics: false,
            lastFetchTime: Date.now()
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar métricas de workflows',
            isLoadingWorkflowMetrics: false
          });
        }
      },

      fetchExecutionStats: async (params) => {
        set({ isLoadingExecutionStats: true, error: null });
        
        try {
          const currentState = get();
          const searchParams = {
            ...currentState.filters,
            ...params
          };

          const stats = await workflowsService.getExecutionStats(searchParams);
          
          set({
            executionStats: stats,
            isLoadingExecutionStats: false,
            lastFetchTime: Date.now()
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas de execuções',
            isLoadingExecutionStats: false
          });
        }
      },

      fetchPerformanceData: async (params) => {
        set({ isLoadingPerformanceMetrics: true, error: null });
        
        try {
          const currentState = get();
          const searchParams = {
            ...currentState.filters,
            ...params
          };

          const performanceData = await workflowsService.getPerformanceData(searchParams);
          
          set({
            performanceMetrics: performanceData,
            isLoadingPerformanceMetrics: false,
            lastFetchTime: Date.now()
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar dados de performance',
            isLoadingPerformanceMetrics: false
          });
        }
      },

      fetchSystemMetrics: async () => {
        set({ isLoadingSystemMetrics: true, error: null });
        
        try {
          const systemMetrics = await workflowsService.getSystemMetrics();
          
          set({
            systemMetrics,
            isLoadingSystemMetrics: false,
            lastFetchTime: Date.now()
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar métricas de sistema',
            isLoadingSystemMetrics: false
          });
        }
      },

      fetchPerformanceReport: async (params) => {
        set({ isLoadingPerformanceReport: true, error: null });
        
        try {
          const currentState = get();
          const searchParams = {
            ...currentState.filters,
            ...params
          };

          const report = await workflowsService.getPerformanceReport(searchParams);
          
          set({
            performanceReport: report,
            isLoadingPerformanceReport: false,
            lastFetchTime: Date.now()
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar relatório de performance',
            isLoadingPerformanceReport: false
          });
        }
      },

      fetchRealTimeMetrics: async () => {
        set({ isLoadingRealTimeMetrics: true, error: null });
        
        try {
          // Assumindo que existe um método para métricas em tempo real
          const realTimeMetrics = await workflowsService.getSystemMetrics(); // Placeholder
          
          set({
            realTimeMetrics: realTimeMetrics as any, // Type assertion
            isLoadingRealTimeMetrics: false,
            lastFetchTime: Date.now()
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar métricas em tempo real',
            isLoadingRealTimeMetrics: false
          });
        }
      },

      fetchExecutionTrends: async (params) => {
        set({ isLoadingExecutionTrends: true, error: null });
        
        try {
          const currentState = get();
          const searchParams = {
            ...currentState.filters,
            ...params
          };

          // Assumindo que existe um método para tendências
          const trends = await workflowsService.getPerformanceData(searchParams); // Placeholder
          
          set({
            executionTrends: trends as any, // Type assertion
            isLoadingExecutionTrends: false,
            lastFetchTime: Date.now()
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar tendências de execução',
            isLoadingExecutionTrends: false
          });
        }
      },

      // ===== WORKFLOW SPECIFIC METRICS =====

      fetchWorkflowMetricsById: async (workflowId, params) => {
        await get().fetchWorkflowMetrics({
          ...params,
          workflow_id: workflowId
        });
      },

      fetchWorkflowExecutionStats: async (workflowId, params) => {
        await get().fetchExecutionStats({
          ...params,
          workflow_id: workflowId
        });
      },

      fetchWorkflowPerformanceData: async (workflowId, params) => {
        await get().fetchPerformanceData({
          ...params,
          workflow_id: workflowId
        });
      },

      // ===== FILTERS =====

      setMetricsFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters }
        }));
      },

      clearMetricsFilters: () => {
        set({
          filters: initialState.filters
        });
      },

      updateMetricsFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value }
        }));
      },

      // ===== UTILITY =====

      refreshAllMetrics: async () => {
        set({ loading: true, error: null });
        
        try {
          const currentState = get();
          
          // Buscar todas as métricas em paralelo
          await Promise.all([
            get().fetchWorkflowMetrics(),
            get().fetchExecutionStats(),
            get().fetchPerformanceData(),
            get().fetchSystemMetrics(),
            get().fetchPerformanceReport(),
            get().fetchRealTimeMetrics(),
            get().fetchExecutionTrends()
          ]);
          
          set({ loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao atualizar métricas',
            loading: false
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      }
    }),
    {
      name: 'metrics-store',
      partialize: (state) => ({
        filters: state.filters
      })
    }
  )
);

export default useMetricsStore;
