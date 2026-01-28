import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { workflowsService } from '../services';
import { WorkflowExecutionQueue, WorkflowExecutionQueueStatus, WorkflowExecutionPriority } from '../types/workflowTypes';

// Interface para filtros de fila
export interface QueueFilters {
  status?: WorkflowExecutionQueueStatus;
  priority?: WorkflowExecutionPriority;
  workflow_id?: number;
  created_after?: string;
  created_before?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Interface para paginação de fila
export interface QueuePagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// Interface para estatísticas de fila
export interface QueueStats {
  total_items: number;
  pending_items: number;
  processing_items: number;
  completed_items: number;
  failed_items: number;
  average_wait_time: number;
  average_processing_time: number;
  throughput_per_hour: number;
}

// Interface para status da fila
export interface QueueStatus {
  is_processing: boolean;
  is_paused: boolean;
  current_throughput: number;
  estimated_completion_time?: string;
  last_processed_at?: string;
  error_count: number;
  warning_count: number;
}

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
  lastFetchTime: number | null;
}

// Ações do store
interface QueueStoreActions {
  // ===== QUEUE MANAGEMENT =====
  fetchQueue: (params?: QueueFilters & { page?: number; limit?: number }) => Promise<void>;
  fetchQueueItem: (queueId: number) => Promise<void>;
  addToQueue: (params: any) => Promise<{ success: boolean; data?: WorkflowExecutionQueue; error?: string }>;
  removeFromQueue: (queueId: number) => Promise<{ success: boolean; error?: string }>;
  updateQueueItem: (queueId: number, params: any) => Promise<{ success: boolean; data?: WorkflowExecutionQueue; error?: string }>;
  
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
  setQueueFilters: (filters: Partial<QueueFilters>) => void;
  clearQueueFilters: () => void;
  updateQueueFilter: (key: keyof QueueFilters, value: any) => void;
  
  // ===== PAGINATION =====
  setQueuePage: (page: number) => void;
  setQueueLimit: (limit: number) => void;
  
  // ===== UTILITY =====
  refreshQueue: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
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
  lastFetchTime: null
};

/**
 * Store para gerenciamento de filas de execução
 * Responsável por operações de fila, priorização e processamento
 */
export const useQueueStore = create<QueueStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ===== QUEUE MANAGEMENT =====

      fetchQueue: async (params) => {
        set({ loading: true, error: null });
        
        try {
          const currentState = get();
          const searchParams = {
            ...currentState.filters,
            ...params,
            page: params?.page || currentState.pagination.page,
            limit: params?.limit || currentState.pagination.limit
          };

          const response = await workflowsService.getExecutionQueue(searchParams);
          
          set({
            queue: response.data || [],
            pagination: {
              page: response.page || 1,
              limit: response.limit || 10,
              total: response.total || 0,
              total_pages: response.total_pages || 0
            },
            loading: false,
            lastFetchTime: Date.now()
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar fila',
            loading: false
          });
        }
      },

      fetchQueueItem: async (queueId) => {
        set({ loading: true, error: null });
        
        try {
          // Assumindo que existe um método para buscar item específico da fila
          const queueItem = await workflowsService.getExecutionQueue({ id: queueId });
          
          set({
            currentQueueItem: queueItem.data?.[0] || null,
            loading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar item da fila',
            loading: false
          });
        }
      },

      addToQueue: async (params) => {
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
          
          return { success: true, data: queueItem };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar à fila';
          set({ error: errorMessage, isAdding: false });
          return { success: false, error: errorMessage };
        }
      },

      removeFromQueue: async (queueId) => {
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
          
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao remover da fila';
          set({ error: errorMessage, isRemoving: false });
          return { success: false, error: errorMessage };
        }
      },

      updateQueueItem: async (queueId, params) => {
        set({ loading: true, error: null });
        
        try {
          // Assumindo que existe um método para atualizar item da fila
          const updatedItem = await workflowsService.addToQueue(params); // Placeholder
          
          // Atualizar na lista
          const currentState = get();
          const updatedQueue = currentState.queue.map(item => 
            item.id === queueId ? updatedItem : item
          );
          
          set({
            queue: updatedQueue,
            currentQueueItem: currentState.currentQueueItem?.id === queueId 
              ? updatedItem 
              : currentState.currentQueueItem,
            loading: false
          });
          
          return { success: true, data: updatedItem };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar item da fila';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      // ===== QUEUE OPERATIONS =====

      processQueue: async () => {
        set({ isProcessing: true, error: null });
        
        try {
          // Assumindo que existe um método para processar fila
          const result = await workflowsService.getExecutionQueue({}); // Placeholder
          
          set({ isProcessing: false });
          
          return { 
            success: true, 
            processedCount: 0, // Seria obtido do resultado real
            errors: [] 
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao processar fila';
          set({ error: errorMessage, isProcessing: false });
          return { 
            success: false, 
            processedCount: 0, 
            errors: [errorMessage] 
          };
        }
      },

      pauseQueue: async () => {
        set({ isPausing: true, error: null });
        
        try {
          // Assumindo que existe um método para pausar fila
          await workflowsService.getExecutionQueue({}); // Placeholder
          
          set({ isPausing: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao pausar fila';
          set({ error: errorMessage, isPausing: false });
          return { success: false, error: errorMessage };
        }
      },

      resumeQueue: async () => {
        set({ isResuming: true, error: null });
        
        try {
          // Assumindo que existe um método para resumir fila
          await workflowsService.getExecutionQueue({}); // Placeholder
          
          set({ isResuming: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao resumir fila';
          set({ error: errorMessage, isResuming: false });
          return { success: false, error: errorMessage };
        }
      },

      clearQueue: async (status) => {
        set({ loading: true, error: null });
        
        try {
          // Assumindo que existe um método para limpar fila
          await workflowsService.getExecutionQueue({}); // Placeholder
          
          // Limpar lista local
          set({
            queue: [],
            loading: false
          });
          
          return { success: true, clearedCount: 0 };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao limpar fila';
          set({ error: errorMessage, loading: false });
          return { success: false, clearedCount: 0, error: errorMessage };
        }
      },

      // ===== PRIORITY MANAGEMENT =====

      setPriority: async (queueId, priority) => {
        set({ loading: true, error: null });
        
        try {
          const updatedItem = await get().updateQueueItem(queueId, { priority });
          
          set({ loading: false });
          return { success: true, data: updatedItem.data };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao definir prioridade';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      reorderQueue: async (queueIds) => {
        set({ loading: true, error: null });
        
        try {
          // Assumindo que existe um método para reordenar fila
          await workflowsService.getExecutionQueue({}); // Placeholder
          
          set({ loading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao reordenar fila';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      // ===== BULK OPERATIONS =====

      retryQueueItems: async (queueIds) => {
        set({ loading: true, error: null });
        
        const errors: string[] = [];
        let retriedCount = 0;
        
        for (const queueId of queueIds) {
          try {
            await get().updateQueueItem(queueId, { status: 'pending' });
            retriedCount++;
          } catch (error) {
            errors.push(`Erro ao tentar novamente item ${queueId}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
          }
        }
        
        set({ loading: false });
        
        return { 
          success: errors.length === 0, 
          retriedCount, 
          errors 
        };
      },

      removeQueueItems: async (queueIds) => {
        set({ loading: true, error: null });
        
        const errors: string[] = [];
        let removedCount = 0;
        
        for (const queueId of queueIds) {
          try {
            await get().removeFromQueue(queueId);
            removedCount++;
          } catch (error) {
            errors.push(`Erro ao remover item ${queueId}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
          }
        }
        
        set({ loading: false });
        
        return { 
          success: errors.length === 0, 
          removedCount, 
          errors 
        };
      },

      // ===== STATISTICS & STATUS =====

      fetchQueueStats: async () => {
        try {
          const stats = await workflowsService.getQueueStatus();
          set({ stats: stats as any }); // Type assertion para compatibilidade
        } catch (error) {
          console.error('Erro ao obter estatísticas da fila:', error);
        }
      },

      fetchQueueStatus: async () => {
        try {
          const status = await workflowsService.getQueueStatus();
          set({ status: status as any }); // Type assertion para compatibilidade
        } catch (error) {
          console.error('Erro ao obter status da fila:', error);
        }
      },

      // ===== FILTERS =====

      setQueueFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 }
        }));
      },

      clearQueueFilters: () => {
        set((state) => ({
          filters: initialState.filters,
          pagination: { ...state.pagination, page: 1 }
        }));
      },

      updateQueueFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
          pagination: { ...state.pagination, page: 1 }
        }));
      },

      // ===== PAGINATION =====

      setQueuePage: (page) => {
        set((state) => ({
          pagination: { ...state.pagination, page }
        }));
      },

      setQueueLimit: (limit) => {
        set((state) => ({
          pagination: { ...state.pagination, limit, page: 1 }
        }));
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
      }
    }),
    {
      name: 'queue-store',
      partialize: (state) => ({
        filters: state.filters,
        pagination: state.pagination
      })
    }
  )
);

export default useQueueStore;
