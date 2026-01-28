import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { WorkflowStatus, WorkflowTriggerType } from '../types/workflowTypes';

// Interface para filtros de workflow
export interface WorkflowFilters {
  status?: WorkflowStatus;
  search?: string;
  trigger_type?: WorkflowTriggerType;
  created_after?: string;
  created_before?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Interface para filtros de execução
export interface ExecutionFilters {
  workflow_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Interface para filtros de fila
export interface QueueFilters {
  status?: string;
  priority?: string;
  workflow_id?: number;
  created_after?: string;
  created_before?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Interface para filtros de métricas
export interface MetricsFilters {
  workflow_id?: number;
  start_date?: string;
  end_date?: string;
  period?: 'hour' | 'day' | 'week' | 'month' | 'year';
  group_by?: 'workflow' | 'status' | 'trigger_type' | 'date';
}

// Interface para preset de filtros
export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: WorkflowFilters | ExecutionFilters | QueueFilters | MetricsFilters;
  type: 'workflow' | 'execution' | 'queue' | 'metrics';
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Interface para histórico de filtros
export interface FilterHistory {
  id: string;
  filters: WorkflowFilters | ExecutionFilters | QueueFilters | MetricsFilters;
  type: 'workflow' | 'execution' | 'queue' | 'metrics';
  applied_at: string;
  result_count: number;
}

// Estado do store
interface FiltersStoreState {
  // ===== ACTIVE FILTERS =====
  workflowFilters: WorkflowFilters;
  executionFilters: ExecutionFilters;
  queueFilters: QueueFilters;
  metricsFilters: MetricsFilters;
  
  // ===== FILTER PRESETS =====
  filterPresets: FilterPreset[];
  
  // ===== FILTER HISTORY =====
  filterHistory: FilterHistory[];
  maxHistoryItems: number;
  
  // ===== UI STATE =====
  activeFilters: {
    workflow: boolean;
    execution: boolean;
    queue: boolean;
    metrics: boolean;
  };
  
  // ===== PERSISTENCE =====
  autoSave: boolean;
  lastSaved: string | null;
}

// Ações do store
interface FiltersStoreActions {
  // ===== WORKFLOW FILTERS =====
  setWorkflowFilters: (filters: Partial<WorkflowFilters>) => void;
  clearWorkflowFilters: () => void;
  updateWorkflowFilter: (key: keyof WorkflowFilters, value: any) => void;
  
  // ===== EXECUTION FILTERS =====
  setExecutionFilters: (filters: Partial<ExecutionFilters>) => void;
  clearExecutionFilters: () => void;
  updateExecutionFilter: (key: keyof ExecutionFilters, value: any) => void;
  
  // ===== QUEUE FILTERS =====
  setQueueFilters: (filters: Partial<QueueFilters>) => void;
  clearQueueFilters: () => void;
  updateQueueFilter: (key: keyof QueueFilters, value: any) => void;
  
  // ===== METRICS FILTERS =====
  setMetricsFilters: (filters: Partial<MetricsFilters>) => void;
  clearMetricsFilters: () => void;
  updateMetricsFilter: (key: keyof MetricsFilters, value: any) => void;
  
  // ===== FILTER PRESETS =====
  saveFilterPreset: (name: string, description: string, filters: any, type: 'workflow' | 'execution' | 'queue' | 'metrics') => void;
  loadFilterPreset: (presetId: string) => void;
  deleteFilterPreset: (presetId: string) => void;
  updateFilterPreset: (presetId: string, updates: Partial<FilterPreset>) => void;
  
  // ===== FILTER HISTORY =====
  addToFilterHistory: (filters: any, type: 'workflow' | 'execution' | 'queue' | 'metrics', resultCount: number) => void;
  clearFilterHistory: () => void;
  removeFromFilterHistory: (historyId: string) => void;
  getFilterHistory: (type?: 'workflow' | 'execution' | 'queue' | 'metrics') => FilterHistory[];
  
  // ===== ACTIVE FILTERS =====
  setActiveFilters: (type: 'workflow' | 'execution' | 'queue' | 'metrics', active: boolean) => void;
  clearAllActiveFilters: () => void;
  
  // ===== PERSISTENCE =====
  saveFilters: () => void;
  loadFilters: () => void;
  setAutoSave: (enabled: boolean) => void;
  
  // ===== UTILITY =====
  reset: () => void;
  exportFilters: () => string;
  importFilters: (data: string) => void;
}

// Store completo
type FiltersStore = FiltersStoreState & FiltersStoreActions;

// Estado inicial
const initialState: FiltersStoreState = {
  workflowFilters: {
    status: undefined,
    search: '',
    trigger_type: undefined,
    created_after: undefined,
    created_before: undefined,
    sort_by: 'created_at',
    sort_order: 'desc'
  },
  
  executionFilters: {
    workflow_id: undefined,
    status: undefined,
    start_date: undefined,
    end_date: undefined,
    sort_by: 'created_at',
    sort_order: 'desc'
  },
  
  queueFilters: {
    status: undefined,
    priority: undefined,
    workflow_id: undefined,
    created_after: undefined,
    created_before: undefined,
    sort_by: 'created_at',
    sort_order: 'asc'
  },
  
  metricsFilters: {
    workflow_id: undefined,
    start_date: undefined,
    end_date: undefined,
    period: 'day',
    group_by: 'date'
  },
  
  filterPresets: [],
  filterHistory: [],
  maxHistoryItems: 50,
  
  activeFilters: {
    workflow: false,
    execution: false,
    queue: false,
    metrics: false
  },
  
  autoSave: true,
  lastSaved: null
};

/**
 * Store para gerenciamento de filtros
 * Responsável por filtros, presets e histórico
 */
export const useFiltersStore = create<FiltersStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ===== WORKFLOW FILTERS =====

      setWorkflowFilters: (filters) => {
        set((state) => ({
          workflowFilters: { ...state.workflowFilters, ...filters },
          activeFilters: { ...state.activeFilters, workflow: true }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      clearWorkflowFilters: () => {
        set((state) => ({
          workflowFilters: initialState.workflowFilters,
          activeFilters: { ...state.activeFilters, workflow: false }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      updateWorkflowFilter: (key, value) => {
        set((state) => ({
          workflowFilters: { ...state.workflowFilters, [key]: value },
          activeFilters: { ...state.activeFilters, workflow: true }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      // ===== EXECUTION FILTERS =====

      setExecutionFilters: (filters) => {
        set((state) => ({
          executionFilters: { ...state.executionFilters, ...filters },
          activeFilters: { ...state.activeFilters, execution: true }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      clearExecutionFilters: () => {
        set((state) => ({
          executionFilters: initialState.executionFilters,
          activeFilters: { ...state.activeFilters, execution: false }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      updateExecutionFilter: (key, value) => {
        set((state) => ({
          executionFilters: { ...state.executionFilters, [key]: value },
          activeFilters: { ...state.activeFilters, execution: true }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      // ===== QUEUE FILTERS =====

      setQueueFilters: (filters) => {
        set((state) => ({
          queueFilters: { ...state.queueFilters, ...filters },
          activeFilters: { ...state.activeFilters, queue: true }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      clearQueueFilters: () => {
        set((state) => ({
          queueFilters: initialState.queueFilters,
          activeFilters: { ...state.activeFilters, queue: false }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      updateQueueFilter: (key, value) => {
        set((state) => ({
          queueFilters: { ...state.queueFilters, [key]: value },
          activeFilters: { ...state.activeFilters, queue: true }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      // ===== METRICS FILTERS =====

      setMetricsFilters: (filters) => {
        set((state) => ({
          metricsFilters: { ...state.metricsFilters, ...filters },
          activeFilters: { ...state.activeFilters, metrics: true }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      clearMetricsFilters: () => {
        set((state) => ({
          metricsFilters: initialState.metricsFilters,
          activeFilters: { ...state.activeFilters, metrics: false }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      updateMetricsFilter: (key, value) => {
        set((state) => ({
          metricsFilters: { ...state.metricsFilters, [key]: value },
          activeFilters: { ...state.activeFilters, metrics: true }
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      // ===== FILTER PRESETS =====

      saveFilterPreset: (name, description, filters, type) => {
        const preset: FilterPreset = {
          id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name,
          description,
          filters,
          type,
          is_default: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set((state) => ({
          filterPresets: [...state.filterPresets, preset]
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      loadFilterPreset: (presetId) => {
        const state = get();
        const preset = state.filterPresets.find(p => p.id === presetId);
        
        if (!preset) {
          console.warn(`Preset ${presetId} não encontrado`);
          return;
        }
        
        switch (preset.type) {
          case 'workflow':
            get().setWorkflowFilters(preset.filters as WorkflowFilters);
            break;
          case 'execution':
            get().setExecutionFilters(preset.filters as ExecutionFilters);
            break;
          case 'queue':
            get().setQueueFilters(preset.filters as QueueFilters);
            break;
          case 'metrics':
            get().setMetricsFilters(preset.filters as MetricsFilters);
            break;
        }
        
        // Adicionar ao histórico
        get().addToFilterHistory(preset.filters, preset.type, 0);
      },

      deleteFilterPreset: (presetId) => {
        set((state) => ({
          filterPresets: state.filterPresets.filter(p => p.id !== presetId)
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      updateFilterPreset: (presetId, updates) => {
        set((state) => ({
          filterPresets: state.filterPresets.map(p => 
            p.id === presetId 
              ? { ...p, ...updates, updated_at: new Date().toISOString() }
              : p
          )
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      // ===== FILTER HISTORY =====

      addToFilterHistory: (filters, type, resultCount) => {
        const historyItem: FilterHistory = {
          id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          filters,
          type,
          applied_at: new Date().toISOString(),
          result_count: resultCount
        };
        
        set((state) => {
          const newHistory = [historyItem, ...state.filterHistory];
          
          // Limitar histórico
          if (newHistory.length > state.maxHistoryItems) {
            newHistory.splice(state.maxHistoryItems);
          }
          
          return { filterHistory: newHistory };
        });
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      clearFilterHistory: () => {
        set({ filterHistory: [] });
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      removeFromFilterHistory: (historyId) => {
        set((state) => ({
          filterHistory: state.filterHistory.filter(h => h.id !== historyId)
        }));
        
        if (get().autoSave) {
          get().saveFilters();
        }
      },

      getFilterHistory: (type) => {
        const state = get();
        if (type) {
          return state.filterHistory.filter(h => h.type === type);
        }
        return state.filterHistory;
      },

      // ===== ACTIVE FILTERS =====

      setActiveFilters: (type, active) => {
        set((state) => ({
          activeFilters: { ...state.activeFilters, [type]: active }
        }));
      },

      clearAllActiveFilters: () => {
        set({
          activeFilters: {
            workflow: false,
            execution: false,
            queue: false,
            metrics: false
          }
        });
      },

      // ===== PERSISTENCE =====

      saveFilters: () => {
        try {
          const state = get();
          const dataToSave = {
            workflowFilters: state.workflowFilters,
            executionFilters: state.executionFilters,
            queueFilters: state.queueFilters,
            metricsFilters: state.metricsFilters,
            filterPresets: state.filterPresets,
            filterHistory: state.filterHistory.slice(0, 20), // Salvar apenas os últimos 20
            lastSaved: new Date().toISOString()
          };
          
          localStorage.setItem('workflows-filters', JSON.stringify(dataToSave));
          
          set({ lastSaved: new Date().toISOString() });
        } catch (error) {
          console.error('Erro ao salvar filtros:', error);
        }
      },

      loadFilters: () => {
        try {
          const saved = localStorage.getItem('workflows-filters');
          if (saved) {
            const data = JSON.parse(saved);
            
            set({
              workflowFilters: data.workflowFilters || initialState.workflowFilters,
              executionFilters: data.executionFilters || initialState.executionFilters,
              queueFilters: data.queueFilters || initialState.queueFilters,
              metricsFilters: data.metricsFilters || initialState.metricsFilters,
              filterPresets: data.filterPresets || [],
              filterHistory: data.filterHistory || [],
              lastSaved: data.lastSaved
            });
          }
        } catch (error) {
          console.error('Erro ao carregar filtros:', error);
        }
      },

      setAutoSave: (enabled) => {
        set({ autoSave: enabled });
      },

      // ===== UTILITY =====

      reset: () => {
        set(initialState);
        localStorage.removeItem('workflows-filters');
      },

      exportFilters: () => {
        const state = get();
        const exportData = {
          workflowFilters: state.workflowFilters,
          executionFilters: state.executionFilters,
          queueFilters: state.queueFilters,
          metricsFilters: state.metricsFilters,
          filterPresets: state.filterPresets,
          exported_at: new Date().toISOString()
        };
        
        return JSON.stringify(exportData, null, 2);
      },

      importFilters: (data) => {
        try {
          const importData = JSON.parse(data);
          
          set({
            workflowFilters: importData.workflowFilters || initialState.workflowFilters,
            executionFilters: importData.executionFilters || initialState.executionFilters,
            queueFilters: importData.queueFilters || initialState.queueFilters,
            metricsFilters: importData.metricsFilters || initialState.metricsFilters,
            filterPresets: importData.filterPresets || []
          });
          
          if (get().autoSave) {
            get().saveFilters();
          }
        } catch (error) {
          console.error('Erro ao importar filtros:', error);
          throw new Error('Formato de dados inválido');
        }
      }
    }),
    {
      name: 'filters-store',
      partialize: (state) => ({
        workflowFilters: state.workflowFilters,
        executionFilters: state.executionFilters,
        queueFilters: state.queueFilters,
        metricsFilters: state.metricsFilters,
        filterPresets: state.filterPresets,
        filterHistory: state.filterHistory.slice(0, 10), // Persistir apenas os últimos 10
        autoSave: state.autoSave
      })
    }
  )
);

export default useFiltersStore;
