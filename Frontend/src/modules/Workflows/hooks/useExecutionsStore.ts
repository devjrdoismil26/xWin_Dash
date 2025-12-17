import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { workflowsService } from '../services';
import { WorkflowExecution, WorkflowExecutionStatus } from '../types/workflowTypes';
import { getErrorMessage } from '@/utils/errorHelpers';

// Interface para filtros de execução
export interface ExecutionFilters {
  workflow_id?: number;
  status?: WorkflowExecutionStatus;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// Interface para paginação de execuções
export interface ExecutionPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number; }

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
  lastFetchTime: number | null; }

// Ações do store
interface ExecutionsStoreActions {
  // ===== EXECUTION MANAGEMENT =====
  fetchExecutions: (params?: ExecutionFilters & { page?: number;
  limit?: number;
}) => Promise<void>;
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
  updateExecutionStatus?: (e: any) => void;
  
  // ===== STATISTICS =====
  fetchExecutionStats: (workflowId?: number) => Promise<void>;
  fetchRunningExecutions: () => Promise<void>;
  fetchFailedExecutions: () => Promise<void>;
  
  // ===== FILTERS =====
  setExecutionFilters?: (e: any) => void;
  clearExecutionFilters??: (e: any) => void;
  updateExecutionFilter?: (e: any) => void;
  
  // ===== PAGINATION =====
  setExecutionPage?: (e: any) => void;
  setExecutionLimit?: (e: any) => void;
  
  // ===== UTILITY =====
  refreshExecutions: () => Promise<void>;
  clearError??: (e: any) => void;
  reset??: (e: any) => void;
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
  lastFetchTime: null};

/**
 * Store para gerenciamento de execuções de workflows
 * Responsável por execução, monitoramento e controle de workflows
 */
export const useExecutionsStore = create<ExecutionsStore>()(
  devtools(
    (set: unknown, get: unknown) => ({
      ...initialState,

      // ===== EXECUTION MANAGEMENT =====

      fetchExecutions: async (params: unknown) => {
        set({ loading: true, error: null });

        try {
          const currentState = get();

          const searchParams = {
            ...currentState.filters,
            ...params,
            page: params?.page || currentState.pagination.page,
            limit: params?.limit || currentState.pagination.limit};

          const response = await workflowsService.getExecutions(searchParams);

          set({
            executions: (response as any).data,
            pagination: {
              page: (response as any).page,
              limit: (response as any).limit,
              total: (response as any).total,
              total_pages: (response as any).total_pages
            },
            loading: false,
            lastFetchTime: Date.now()
  });

        } catch (error) {
          set({
            error: getErrorMessage(error),
            loading: false
          });

        } ,

      fetchExecution: async (executionId: unknown) => {
        set({ loading: true, error: null });

        try {
          const execution = await workflowsService.getExecutionById(executionId);

          set({
            currentExecution: execution,
            loading: false
          });

        } catch (error) {
          set({
            error: error instanceof Error ? (error as any).message : 'Erro ao carregar execução',
            loading: false
          });

        } ,

      executeWorkflow: async (workflowId: unknown, variables: unknown) => {
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

          return { success: true, data: execution};

        } catch (error) {
          const errorMessage = getErrorMessage(error) + 'Erro ao executar workflow';
          set({ error: errorMessage, isExecuting: false });

          return { success: false, error: errorMessage};

        } ,

      stopExecution: async (executionId: unknown) => {
        set({ isStopping: true, error: null });

        try {
          const stoppedExecution = await workflowsService.stopExecution(executionId);

          // Atualizar na lista
          const currentState = get();

          const updatedExecutions = currentState.executions.map(e => 
            e.id === executionId ? stoppedExecution : e);

          set({
            executions: updatedExecutions,
            currentExecution: currentState.currentExecution?.id === executionId 
              ? stoppedExecution 
              : currentState.currentExecution,
            isStopping: false
          });

          return { success: true, data: stoppedExecution};

        } catch (error) {
          const errorMessage = getErrorMessage(error) + 'Erro ao parar execução';
          set({ error: errorMessage, isStopping: false });

          return { success: false, error: errorMessage};

        } ,

      pauseExecution: async (executionId: unknown) => {
        set({ isPausing: true, error: null });

        try {
          const pausedExecution = await workflowsService.pauseExecution(executionId);

          // Atualizar na lista
          const currentState = get();

          const updatedExecutions = currentState.executions.map(e => 
            e.id === executionId ? pausedExecution : e);

          set({
            executions: updatedExecutions,
            currentExecution: currentState.currentExecution?.id === executionId 
              ? pausedExecution 
              : currentState.currentExecution,
            isPausing: false
          });

          return { success: true, data: pausedExecution};

        } catch (error) {
          const errorMessage = getErrorMessage(error) + 'Erro ao pausar execução';
          set({ error: errorMessage, isPausing: false });

          return { success: false, error: errorMessage};

        } ,

      resumeExecution: async (executionId: unknown) => {
        set({ isResuming: true, error: null });

        try {
          const resumedExecution = await workflowsService.resumeExecution(executionId);

          // Atualizar na lista
          const currentState = get();

          const updatedExecutions = currentState.executions.map(e => 
            e.id === executionId ? resumedExecution : e);

          set({
            executions: updatedExecutions,
            currentExecution: currentState.currentExecution?.id === executionId 
              ? resumedExecution 
              : currentState.currentExecution,
            isResuming: false
          });

          return { success: true, data: resumedExecution};

        } catch (error) {
          const errorMessage = getErrorMessage(error) + 'Erro ao resumir execução';
          set({ error: errorMessage, isResuming: false });

          return { success: false, error: errorMessage};

        } ,

      cancelExecution: async (executionId: unknown) => {
        set({ isStopping: true, error: null });

        try {
          const cancelledExecution = await workflowsService.cancelExecution(executionId);

          // Atualizar na lista
          const currentState = get();

          const updatedExecutions = currentState.executions.map(e => 
            e.id === executionId ? cancelledExecution : e);

          set({
            executions: updatedExecutions,
            currentExecution: currentState.currentExecution?.id === executionId 
              ? cancelledExecution 
              : currentState.currentExecution,
            isStopping: false
          });

          return { success: true, data: cancelledExecution};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isStopping: false });

          return { success: false, error: errorMessage};

        } ,

      retryExecution: async (executionId: unknown, variables: unknown) => {
        set({ isExecuting: true, error: null });

        try {
          // Obter execução original para pegar workflow_id
          const currentState = get();

          const originalExecution = currentState.executions.find(e => e.id === executionId) 
            || currentState.currentExecution;
          
          if (!originalExecution) {
            throw new Error('Execução original não encontrada');

          }

          // Usar método retryExecution do service
          const retriedExecution = await workflowsService.retryExecution(executionId, variables);

          // Adicionar à lista de execuções
          set({
            executions: [retriedExecution, ...currentState.executions],
            currentExecution: retriedExecution,
            isExecuting: false
          });

          return { success: true, data: retriedExecution};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isExecuting: false });

          return { success: false, error: errorMessage};

        } ,

      // ===== WORKFLOW EXECUTIONS =====

      fetchWorkflowExecutions: async (workflowId: unknown, params: unknown) => {
        await get().fetchExecutions({
          ...params,
          workflow_id: workflowId
        });

      },

      // ===== EXECUTION STATUS =====

      getExecutionStatus: async (executionId: unknown) => {
        try {
          const execution = await workflowsService.getExecutionById(executionId);

          return execution.status;
        } catch (error) {
          console.error(`Erro ao obter status da execução ${executionId}:`, error);

          return null;
        } ,

      updateExecutionStatus: (executionId: unknown, status: unknown) => {
        set((state: unknown) => ({
          executions: state.executions.map(e => 
            e.id === executionId ? { ...e, status } : e
          ),
          currentExecution: state.currentExecution?.id === executionId 
            ? { ...state.currentExecution, status }
            : state.currentExecution
        }));

      },

      // ===== STATISTICS =====

      fetchExecutionStats: async (workflowId: unknown) => {
        try {
          const stats = await workflowsService.getExecutionStats(workflowId ? { workflow_id: workflowId } : {});

          set({ stats });

        } catch (error) {
          console.error('Erro ao obter estatísticas de execuções:', error);

        } ,

      fetchRunningExecutions: async () => {
        await get().fetchExecutions({ status: 'running' as WorkflowExecutionStatus });

      },

      fetchFailedExecutions: async () => {
        await get().fetchExecutions({ status: 'failed' as WorkflowExecutionStatus });

      },

      // ===== FILTERS =====

      setExecutionFilters: (filters: unknown) => {
        set((state: unknown) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 } ));

      },

      clearExecutionFilters: () => {
        set((state: unknown) => ({
          filters: initialState.filters,
          pagination: { ...state.pagination, page: 1 } ));

      },

      updateExecutionFilter: (key: unknown, value: unknown) => {
        set((state: unknown) => ({
          filters: { ...state.filters, [key]: value },
          pagination: { ...state.pagination, page: 1 } ));

      },

      // ===== PAGINATION =====

      setExecutionPage: (page: unknown) => {
        set((state: unknown) => ({
          pagination: { ...state.pagination, page } ));

      },

      setExecutionLimit: (limit: unknown) => {
        set((state: unknown) => ({
          pagination: { ...state.pagination, limit, page: 1 } ));

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

      } ),
    {
      name: 'executions-store',
      partialize: (state: unknown) => ({
        filters: state.filters,
        pagination: state.pagination
      })
  }
  ));

export default useExecutionsStore;
