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
  sort_order?: 'asc' | 'desc'; }

// Interface para filtros de execução
export interface ExecutionFilters {
  workflow_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// Interface para filtros de fila
export interface QueueFilters {
  status?: string;
  priority?: string;
  workflow_id?: number;
  created_after?: string;
  created_before?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// Interface para filtros de métricas
export interface MetricsFilters {
  workflow_id?: number;
  start_date?: string;
  end_date?: string;
  period?: 'hour' | 'day' | 'week' | 'month' | 'year';
  group_by?: 'workflow' | 'status' | 'trigger_type' | 'date'; }

// Interface para preset de filtros
export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: WorkflowFilters | ExecutionFilters | QueueFilters | MetricsFilters;
  type: 'workflow' | 'execution' | 'queue' | 'metrics';
  is_default: boolean;
  created_at: string;
  updated_at: string; }

// Interface para histórico de filtros
export interface FilterHistory {
  id: string;
  filters: WorkflowFilters | ExecutionFilters | QueueFilters | MetricsFilters;
  type: 'workflow' | 'execution' | 'queue' | 'metrics';
  applied_at: string;
  result_count: number; }

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
  metrics: boolean; };

  // ===== PERSISTENCE =====
  autoSave: boolean;
  lastSaved: string | null;
}

// Ações do store
interface FiltersStoreActions {
  // ===== WORKFLOW FILTERS =====
  setWorkflowFilters?: (e: any) => void;
  clearWorkflowFilters??: (e: any) => void;
  updateWorkflowFilter?: (e: any) => void;
  // ===== EXECUTION FILTERS =====
  setExecutionFilters?: (e: any) => void;
  clearExecutionFilters??: (e: any) => void;
  updateExecutionFilter?: (e: any) => void;
  // ===== QUEUE FILTERS =====
  setQueueFilters?: (e: any) => void;
  clearQueueFilters??: (e: any) => void;
  updateQueueFilter?: (e: any) => void;
  // ===== METRICS FILTERS =====
  setMetricsFilters?: (e: any) => void;
  clearMetricsFilters??: (e: any) => void;
  updateMetricsFilter?: (e: any) => void;
  // ===== FILTER PRESETS =====
  saveFilterPreset?: (e: any) => void;
  loadFilterPreset?: (e: any) => void;
  deleteFilterPreset?: (e: any) => void;
  updateFilterPreset?: (e: any) => void;
  // ===== FILTER HISTORY =====
  addToFilterHistory?: (e: any) => void;
  clearFilterHistory??: (e: any) => void;
  removeFromFilterHistory?: (e: any) => void;
  getFilterHistory: (type?: 'workflow' | 'execution' | 'queue' | 'metrics') => FilterHistory[];
  // ===== ACTIVE FILTERS =====
  setActiveFilters?: (e: any) => void;
  clearAllActiveFilters??: (e: any) => void;
  // ===== PERSISTENCE =====
  saveFilters??: (e: any) => void;
  loadFilters??: (e: any) => void;
  setAutoSave?: (e: any) => void;
  // ===== UTILITY =====
  reset??: (e: any) => void;
  exportFilters: () => string;
  importFilters?: (e: any) => void; }

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
  lastSaved: null};

/**
 * Store para gerenciamento de filtros
 * Responsável por filtros, presets e histórico
 */
export const useFiltersStore = create<FiltersStore>()(
  devtools(
    (set: unknown, get: unknown) => ({
      ...initialState,

      // ===== WORKFLOW FILTERS =====

      setWorkflowFilters: (filters: unknown) => {
        set((state: unknown) => ({
          workflowFilters: { ...state.workflowFilters, ...filters },
          activeFilters: { ...state.activeFilters, workflow: true } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      clearWorkflowFilters: () => {
        set((state: unknown) => ({
          workflowFilters: initialState.workflowFilters,
          activeFilters: { ...state.activeFilters, workflow: false } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      updateWorkflowFilter: (key: unknown, value: unknown) => {
        set((state: unknown) => ({
          workflowFilters: { ...state.workflowFilters, [key]: value },
          activeFilters: { ...state.activeFilters, workflow: true } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      // ===== EXECUTION FILTERS =====

      setExecutionFilters: (filters: unknown) => {
        set((state: unknown) => ({
          executionFilters: { ...state.executionFilters, ...filters },
          activeFilters: { ...state.activeFilters, execution: true } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      clearExecutionFilters: () => {
        set((state: unknown) => ({
          executionFilters: initialState.executionFilters,
          activeFilters: { ...state.activeFilters, execution: false } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      updateExecutionFilter: (key: unknown, value: unknown) => {
        set((state: unknown) => ({
          executionFilters: { ...state.executionFilters, [key]: value },
          activeFilters: { ...state.activeFilters, execution: true } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      // ===== QUEUE FILTERS =====

      setQueueFilters: (filters: unknown) => {
        set((state: unknown) => ({
          queueFilters: { ...state.queueFilters, ...filters },
          activeFilters: { ...state.activeFilters, queue: true } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      clearQueueFilters: () => {
        set((state: unknown) => ({
          queueFilters: initialState.queueFilters,
          activeFilters: { ...state.activeFilters, queue: false } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      updateQueueFilter: (key: unknown, value: unknown) => {
        set((state: unknown) => ({
          queueFilters: { ...state.queueFilters, [key]: value },
          activeFilters: { ...state.activeFilters, queue: true } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      // ===== METRICS FILTERS =====

      setMetricsFilters: (filters: unknown) => {
        set((state: unknown) => ({
          metricsFilters: { ...state.metricsFilters, ...filters },
          activeFilters: { ...state.activeFilters, metrics: true } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      clearMetricsFilters: () => {
        set((state: unknown) => ({
          metricsFilters: initialState.metricsFilters,
          activeFilters: { ...state.activeFilters, metrics: false } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      updateMetricsFilter: (key: unknown, value: unknown) => {
        set((state: unknown) => ({
          metricsFilters: { ...state.metricsFilters, [key]: value },
          activeFilters: { ...state.activeFilters, metrics: true } ));

        if (get().autoSave) {
          get().saveFilters();

        } ,

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
          updated_at: new Date().toISOString()};

        set((state: unknown) => ({
          filterPresets: [...state.filterPresets, preset]
        }));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      loadFilterPreset: (presetId: unknown) => {
        const state = get();

        const preset = state.filterPresets.find(p => p.id === presetId);

        if (!preset) {
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

      deleteFilterPreset: (presetId: unknown) => {
        set((state: unknown) => ({
          filterPresets: state.filterPresets.filter(p => p.id !== presetId)
  }));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      updateFilterPreset: (presetId: unknown, updates: unknown) => {
        set((state: unknown) => ({
          filterPresets: state.filterPresets.map(p => 
            p.id === presetId 
              ? { ...p, ...updates, updated_at: new Date().toISOString() }
              : p
          )
  }));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      // ===== FILTER HISTORY =====

      addToFilterHistory: (filters: unknown, type: unknown, resultCount: unknown) => {
        const historyItem: FilterHistory = {
          id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          filters,
          type,
          applied_at: new Date().toISOString(),
          result_count: resultCount};

        set((state: unknown) => {
          const newHistory = [historyItem, ...state.filterHistory];
          
          // Limitar histórico
          if (newHistory.length > state.maxHistoryItems) {
            newHistory.splice(state.maxHistoryItems);

          }
          
          return { filterHistory: newHistory};

        });

        if (get().autoSave) {
          get().saveFilters();

        } ,

      clearFilterHistory: () => {
        set({ filterHistory: [] });

        if (get().autoSave) {
          get().saveFilters();

        } ,

      removeFromFilterHistory: (historyId: unknown) => {
        set((state: unknown) => ({
          filterHistory: state.filterHistory.filter(h => h.id !== historyId)
  }));

        if (get().autoSave) {
          get().saveFilters();

        } ,

      getFilterHistory: (type: unknown) => {
        const state = get();

        if (type) {
          return state.filterHistory.filter(h => h.type === type);

        }
        return state.filterHistory;
      },

      // ===== ACTIVE FILTERS =====

      setActiveFilters: (type: unknown, active: unknown) => {
        set((state: unknown) => ({
          activeFilters: { ...state.activeFilters, [type]: active } ));

      },

      clearAllActiveFilters: () => {
        set({
          activeFilters: {
            workflow: false,
            execution: false,
            queue: false,
            metrics: false
          } );

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
            lastSaved: new Date().toISOString()};

          localStorage.setItem('workflows-filters', JSON.stringify(dataToSave));

          set({ lastSaved: new Date().toISOString() });

        } catch (error) {
          console.error('Erro ao salvar filtros:', error);

        } ,

      loadFilters: () => {
        try {
          const saved = localStorage.getItem('workflows-filters');

          if (saved) {
            const data = JSON.parse(saved);

            set({
              workflowFilters: (data as any).workflowFilters || initialState.workflowFilters,
              executionFilters: (data as any).executionFilters || initialState.executionFilters,
              queueFilters: (data as any).queueFilters || initialState.queueFilters,
              metricsFilters: (data as any).metricsFilters || initialState.metricsFilters,
              filterPresets: (data as any).filterPresets || [],
              filterHistory: (data as any).filterHistory || [],
              lastSaved: (data as any).lastSaved
            });

          } catch (error) {
          console.error('Erro ao carregar filtros:', error);

        } ,

      setAutoSave: (enabled: unknown) => {
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
          exported_at: new Date().toISOString()};

        return JSON.stringify(exportData, null, 2);

      },

      importFilters: (data: unknown) => {
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

          } catch (error) {
          console.error('Erro ao importar filtros:', error);

          throw new Error('Formato de dados inválido');

        } }),
    {
      name: 'filters-store',
      partialize: (state: unknown) => ({
        workflowFilters: state.workflowFilters,
        executionFilters: state.executionFilters,
        queueFilters: state.queueFilters,
        metricsFilters: state.metricsFilters,
        filterPresets: state.filterPresets,
        filterHistory: state.filterHistory.slice(0, 10), // Persistir apenas os últimos 10
        autoSave: state.autoSave
      })
  }
  ));

export default useFiltersStore;
