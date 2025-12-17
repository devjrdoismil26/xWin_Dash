import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { workflowsService } from '../services';
import { WorkflowExecutionQueue, WorkflowExecutionQueueStatus, WorkflowExecutionPriority } from '../types/workflowTypes';
import { getErrorMessage } from '@/utils/errorHelpers';
import { workflowQueueService } from '@/services/workflowQueueService';

// Interface para filtros de fila
export interface QueueFilters {
  status?: WorkflowExecutionQueueStatus;
  priority?: WorkflowExecutionPriority;
  workflow_id?: number;
  created_after?: string;
  created_before?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// Interface para paginação de fila
export interface QueuePagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number; }

// Interface para estatísticas de fila
export interface QueueStats {
  total_items: number;
  pending_items: number;
  processing_items: number;
  completed_items: number;
  failed_items: number;
  average_wait_time: number;
  average_processing_time: number;
  throughput_per_hour: number; }

// Interface para status da fila
export interface QueueStatus {
  is_processing: boolean;
  is_paused: boolean;
  current_throughput: number;
  estimated_completion_time?: string;
  last_processed_at?: string;
  error_count: number;
  warning_count: number; }

// Estado do store
interface QueueStoreState {
  // ===== CORE STATE =====
  queue: WorkflowExecutionQueue[];
  currentQueueItem: WorkflowExecutionQueue | null;
  loading: boolean;
  error: string | null;
  // ===== FILTERS & PAGINATION =====
  filters: QueueFilters;
  pagination: QueuePagination;
  // ===== STATISTICS & STATUS =====
  stats: QueueStats | null;
  status: QueueStatus | null;
  // ===== UI STATE =====
  isAdding: boolean;
  isRemoving: boolean;
  isProcessing: boolean;
  isPausing: boolean;
  isResuming: boolean;
  lastFetchTime: number | null; }

// Ações do store
interface QueueStoreActions {
  // ===== QUEUE MANAGEMENT =====
  fetchQueue: (params?: QueueFilters & { page?: number;
  limit?: number;
}) => Promise<void>;
  fetchQueueItem: (queueId: number) => Promise<void>;
  addToQueue: (params: Record<string, any>) => Promise<{ success: boolean; data?: WorkflowExecutionQueue; error?: string }>;
  removeFromQueue: (queueId: number) => Promise<{ success: boolean; error?: string }>;
  updateQueueItem: (queueId: number, params: Record<string, any>) => Promise<{ success: boolean; data?: WorkflowExecutionQueue; error?: string }>;
  
  // ===== QUEUE OPERATIONS =====
  processQueue: () => Promise<{ success: boolean; processedCount: number; errors: string[] }>;
  pauseQueue: () => Promise<{ success: boolean; error?: string }>;
  resumeQueue: () => Promise<{ success: boolean; error?: string }>;
  clearQueue: (status?: WorkflowExecutionQueueStatus) => Promise<{ success: boolean; clearedCount: number; error?: string }>;
  
  // ===== PRIORITY MANAGEMENT =====
  setPriority: (queueId: number, priority: WorkflowExecutionPriority) => Promise<{ success: boolean; data?: WorkflowExecutionQueue; error?: string }>;
  reorderQueue: (queueIds: number[]) => Promise<{ success: boolean; error?: string }>;
  
  // ===== BULK OPERATIONS =====
  retryQueueItems: (queueIds: number[]) => Promise<{ success: boolean; retriedCount: number; errors: string[] }>;
  removeQueueItems: (queueIds: number[]) => Promise<{ success: boolean; removedCount: number; errors: string[] }>;
  
  // ===== STATISTICS & STATUS =====
  fetchQueueStats: () => Promise<void>;
  fetchQueueStatus: () => Promise<void>;
  
  // ===== FILTERS =====
  setQueueFilters?: (e: any) => void;
  clearQueueFilters??: (e: any) => void;
  updateQueueFilter?: (e: any) => void;
  
  // ===== PAGINATION =====
  setQueuePage?: (e: any) => void;
  setQueueLimit?: (e: any) => void;
  
  // ===== UTILITY =====
  refreshQueue: () => Promise<void>;
  clearError??: (e: any) => void;
  reset??: (e: any) => void;
}

// Store completo
type QueueStore = QueueStoreState & QueueStoreActions;

// Estado inicial
const initialState: QueueStoreState = {
  queue: [],
  currentQueueItem: null,
  loading: false,
  error: null,
  
  filters: {
    status: undefined,
    priority: undefined,
    workflow_id: undefined,
    created_after: undefined,
    created_before: undefined,
    sort_by: 'created_at',
    sort_order: 'asc'
  },
  
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  },
  
  stats: null,
  status: null,
  
  isAdding: false,
  isRemoving: false,
  isProcessing: false,
  isPausing: false,
  isResuming: false,
  lastFetchTime: null};

/**
 * Store para gerenciamento de filas de execução
 * Responsável por operações de fila, priorização e processamento
 */
export const useQueueStore = create<QueueStore>()(
  devtools(
    (set: unknown, get: unknown) => ({
      ...initialState,

      // ===== QUEUE MANAGEMENT =====

      fetchQueue: async (params: unknown) => {
        set({ loading: true, error: null });

        try {
          const currentState = get();

          const searchParams = {
            ...currentState.filters,
            ...params,
            page: params?.page || currentState.pagination.page,
            limit: params?.limit || currentState.pagination.limit};

          const response = await workflowsService.getExecutionQueue(searchParams);

          set({
            queue: (response as any).data || [],
            pagination: {
              page: (response as any).page || 1,
              limit: (response as any).limit || 10,
              total: (response as any).total || 0,
              total_pages: (response as any).total_pages || 0
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

      fetchQueueItem: async (queueId: unknown) => {
        set({ loading: true, error: null });

        try {
          // Buscar item específico da fila usando filtro por ID
          const result = await workflowsService.getExecutionQueue({ 
            page: 1, 
            limit: 1 
          });

          // Encontrar o item específico na lista
          const queueItem = result.data?.find((item: WorkflowExecutionQueue) => item.id === queueId) || null;
          
          set({
            currentQueueItem: queueItem,
            loading: false
          });

        } catch (error) {
          set({
            error: getErrorMessage(error),
            loading: false
          });

        } ,

      addToQueue: async (params: unknown) => {
        set({ isAdding: true, error: null });

        try {
          const queueItem = await workflowsService.addToQueue(params);

          // Adicionar à lista
          const currentState = get();

          set({
            queue: [queueItem, ...currentState.queue],
            currentQueueItem: queueItem,
            isAdding: false
          });

          return { success: true, data: queueItem};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isAdding: false });

          return { success: false, error: errorMessage};

        } ,

      removeFromQueue: async (queueId: unknown) => {
        set({ isRemoving: true, error: null });

        try {
          await workflowsService.removeFromQueue(queueId);

          // Remover da lista
          const currentState = get();

          const filteredQueue = currentState.queue.filter(item => item.id !== queueId);

          set({
            queue: filteredQueue,
            currentQueueItem: currentState.currentQueueItem?.id === queueId 
              ? null 
              : currentState.currentQueueItem,
            isRemoving: false
          });

          return { success: true};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isRemoving: false });

          return { success: false, error: errorMessage};

        } ,

      updateQueueItem: async (queueId: unknown, params: unknown) => {
        set({ loading: true, error: null });

        try {
          // Usar método correto do workflowQueueService
          const updatedItem = await workflowQueueService.updateQueueItem(queueId, params);

          // Atualizar na lista
          const currentState = get();

          const updatedQueue = currentState.queue.map(item => 
            item.id === queueId ? updatedItem : item);

          set({
            queue: updatedQueue,
            currentQueueItem: currentState.currentQueueItem?.id === queueId 
              ? updatedItem 
              : currentState.currentQueueItem,
            loading: false
          });

          return { success: true, data: updatedItem};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, loading: false });

          return { success: false, error: errorMessage};

        } ,

      // ===== QUEUE OPERATIONS =====

      processQueue: async () => {
        set({ isProcessing: true, error: null });

        try {
          // Usar método correto do workflowQueueService
          const result = await workflowQueueService.processQueue();

          // Atualizar fila após processamento
          await get().refreshQueue();

          set({ isProcessing: false });

          return { 
            success: result.success ?? true, 
            processedCount: result.processed_count ?? 0,
            errors: result.errors ?? []};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isProcessing: false });

          return { 
            success: false, 
            processedCount: 0, 
            errors: [errorMessage]};

        } ,

      pauseQueue: async () => {
        set({ isPausing: true, error: null });

        try {
          // Usar método correto do workflowQueueService
          await workflowQueueService.pauseQueue();

          // Atualizar status da fila
          await get().fetchQueueStatus();

          set({ isPausing: false });

          return { success: true};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isPausing: false });

          return { success: false, error: errorMessage};

        } ,

      resumeQueue: async () => {
        set({ isResuming: true, error: null });

        try {
          // Usar método correto do workflowQueueService
          await workflowQueueService.resumeQueue();

          // Atualizar status da fila
          await get().fetchQueueStatus();

          set({ isResuming: false });

          return { success: true};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isResuming: false });

          return { success: false, error: errorMessage};

        } ,

      clearQueue: async (status: unknown) => {
        set({ loading: true, error: null });

        try {
          // Usar método correto do workflowQueueService
          const result = await workflowQueueService.clearQueue(status);

          // Limpar lista local e atualizar
          await get().refreshQueue();

          set({
            loading: false
          });

          return { 
            success: result.success ?? true, 
            clearedCount: result.cleared_count ?? 0};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, loading: false });

          return { success: false, clearedCount: 0, error: errorMessage};

        } ,

      // ===== PRIORITY MANAGEMENT =====

      setPriority: async (queueId: unknown, priority: unknown) => {
        set({ loading: true, error: null });

        try {
          const updatedItem = await get().updateQueueItem(queueId, { priority });

          set({ loading: false });

          return { success: true, data: updatedItem.data};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, loading: false });

          return { success: false, error: errorMessage};

        } ,

      reorderQueue: async (queueIds: unknown) => {
        set({ loading: true, error: null });

        try {
          // Usar método correto do workflowQueueService
          const reorderedQueue = await workflowQueueService.reorderQueue(queueIds);

          // Atualizar lista local com nova ordem
          set({
            queue: reorderedQueue,
            loading: false
          });

          return { success: true};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, loading: false });

          return { success: false, error: errorMessage};

        } ,

      // ===== BULK OPERATIONS =====

      retryQueueItems: async (queueIds: unknown) => {
        set({ loading: true, error: null });

        const errors: string[] = [];
        let retriedCount = 0;
        
        for (const queueId of queueIds) {
          try {
            await get().updateQueueItem(queueId, { status: 'pending' });

            retriedCount++;
          } catch (error) {
            errors.push(`Erro ao tentar novamente item ${queueId}: ${getErrorMessage(error)}`);

          } set({ loading: false });

        return { 
          success: errors.length === 0, 
          retriedCount, 
          errors};

      },

      removeQueueItems: async (queueIds: unknown) => {
        set({ loading: true, error: null });

        const errors: string[] = [];
        let removedCount = 0;
        
        for (const queueId of queueIds) {
          try {
            await get().removeFromQueue(queueId);

            removedCount++;
          } catch (error) {
            errors.push(`Erro ao remover item ${queueId}: ${getErrorMessage(error)}`);

          } set({ loading: false });

        return { 
          success: errors.length === 0, 
          removedCount, 
          errors};

      },

      // ===== STATISTICS & STATUS =====

      fetchQueueStats: async () => {
        try {
          // Usar método correto do workflowQueueService
          const stats = await workflowQueueService.getQueueStats();

          // Converter para QueueStats
          if (stats && typeof stats === 'object') {
            const queueStats: QueueStats = {
              total_items: stats.total_items ?? 0,
              pending_items: stats.pending_items ?? 0,
              processing_items: stats.processing_items ?? 0,
              completed_items: stats.completed_items ?? 0,
              failed_items: stats.failed_items ?? 0,
              average_wait_time: stats.average_wait_time ?? 0,
              average_processing_time: stats.average_processing_time ?? 0,
              throughput_per_hour: stats.throughput_per_hour ?? 0,};

            set({ stats: queueStats });

          } catch (error) {
          console.error('Erro ao obter estatísticas da fila:', error);

        } ,

      fetchQueueStatus: async () => {
        try {
          // Usar método correto do workflowQueueService
          const status = await workflowQueueService.getQueueStatus();

          // Converter para QueueStatus
          if (status && typeof status === 'object') {
            const queueStatus: QueueStatus = {
              is_processing: status.is_processing ?? false,
              is_paused: status.is_paused ?? false,
              current_throughput: status.current_throughput ?? 0,
              estimated_completion_time: status.estimated_completion_time,
              last_processed_at: status.last_processed_at,
              error_count: status.error_count ?? 0,
              warning_count: status.warning_count ?? 0,};

            set({ status: queueStatus });

          } catch (error) {
          console.error('Erro ao obter status da fila:', error);

        } ,

      // ===== FILTERS =====

      setQueueFilters: (filters: unknown) => {
        set((state: unknown) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 } ));

      },

      clearQueueFilters: () => {
        set((state: unknown) => ({
          filters: initialState.filters,
          pagination: { ...state.pagination, page: 1 } ));

      },

      updateQueueFilter: (key: unknown, value: unknown) => {
        set((state: unknown) => ({
          filters: { ...state.filters, [key]: value },
          pagination: { ...state.pagination, page: 1 } ));

      },

      // ===== PAGINATION =====

      setQueuePage: (page: unknown) => {
        set((state: unknown) => ({
          pagination: { ...state.pagination, page } ));

      },

      setQueueLimit: (limit: unknown) => {
        set((state: unknown) => ({
          pagination: { ...state.pagination, limit, page: 1 } ));

      },

      // ===== UTILITY =====

      refreshQueue: async () => {
        const state = get();

        await get().fetchQueue({
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
      name: 'queue-store',
      partialize: (state: unknown) => ({
        filters: state.filters,
        pagination: state.pagination
      })
  }
  ));

export default useQueueStore;
