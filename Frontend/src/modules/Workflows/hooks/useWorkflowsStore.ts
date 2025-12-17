import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { workflowsService } from '../services';
import { Workflow, WorkflowStatus } from '../types/workflowTypes';
import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto

// Interface para filtros de workflow
export interface WorkflowFilters {
  status?: WorkflowStatus;
  search?: string;
  trigger_type?: string;
  created_after?: string;
  created_before?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// Interface para paginação
export interface WorkflowPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number; }

// Interface para seleção
export interface WorkflowSelection {
  selectedIds: Set<string | number>;
  isAllSelected: boolean; }

// Estado do store
interface WorkflowsStoreState {
  // ===== CORE STATE =====
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  loading: boolean;
  error: string | null;
  // ===== FILTERS & PAGINATION =====
  filters: WorkflowFilters;
  pagination: WorkflowPagination;
  // ===== SELECTION =====
  selection: WorkflowSelection;
  // ===== UI STATE =====
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  lastFetchTime: number | null; }

// Ações do store
interface WorkflowsStoreActions {
  // ===== WORKFLOW CRUD =====
  fetchWorkflows: (params?: WorkflowFilters & { page?: number;
  limit?: number;
}) => Promise<void>;
  fetchWorkflow: (workflowId: string | number) => Promise<void>;
  createWorkflow: (workflowData: Record<string, any>) => Promise<{ success: boolean; data?: Workflow; error?: string }>;
  updateWorkflow: (workflowId: string | number, workflowData: Record<string, any>) => Promise<{ success: boolean; data?: Workflow; error?: string }>;
  deleteWorkflow: (workflowId: string | number) => Promise<{ success: boolean; error?: string }>;
  
  // ===== WORKFLOW ACTIONS =====
  duplicateWorkflow: (workflowId: string | number, newName?: string) => Promise<{ success: boolean; data?: Workflow; error?: string }>;
  toggleWorkflowStatus: (workflowId: string | number) => Promise<{ success: boolean; data?: Workflow; error?: string }>;
  
  // ===== FILTERS =====
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  updateFilter?: (e: any) => void;
  
  // ===== PAGINATION =====
  setPage?: (e: any) => void;
  setLimit?: (e: any) => void;
  
  // ===== SELECTION =====
  selectWorkflow?: (e: any) => void;
  deselectWorkflow?: (e: any) => void;
  selectAll??: (e: any) => void;
  clearSelection??: (e: any) => void;
  toggleSelection?: (e: any) => void;
  
  // ===== BULK ACTIONS =====
  deleteSelected: () => Promise<{ success: boolean; deletedCount: number; errors: string[] }>;
  toggleSelectedStatus: () => Promise<{ success: boolean; updatedCount: number; errors: string[] }>;
  
  // ===== UTILITY =====
  refreshWorkflows: () => Promise<void>;
  clearError??: (e: any) => void;
  reset??: (e: any) => void;
}

// Store completo
type WorkflowsStore = WorkflowsStoreState & WorkflowsStoreActions;

// Estado inicial
const initialState: WorkflowsStoreState = {
  workflows: [],
  currentWorkflow: null,
  loading: false,
  error: null,
  
  filters: {
    status: undefined,
    search: '',
    trigger_type: undefined,
    created_after: undefined,
    created_before: undefined,
    sort_by: 'created_at',
    sort_order: 'desc'
  },
  
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  },
  
  selection: {
    selectedIds: new Set(),
    isAllSelected: false
  },
  
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  lastFetchTime: null};

/**
 * Store principal para gerenciamento de workflows
 * Responsável por operações CRUD básicas, filtros e seleção
 */
export const useWorkflowsStore = create<WorkflowsStore>()(
  devtools(
    (set: unknown, get: unknown) => ({
      ...initialState,

      // ===== WORKFLOW CRUD =====

      fetchWorkflows: async (params: unknown) => {
        set({ loading: true, error: null });

        try {
          const currentState = get();

          const searchParams = {
            ...currentState.filters,
            ...params,
            page: params?.page || currentState.pagination.page,
            limit: params?.limit || currentState.pagination.limit};

          const response = await workflowsService.getWorkflows(searchParams);

          set({
            workflows: (response as any).data,
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

      fetchWorkflow: async (workflowId: unknown) => {
        set({ loading: true, error: null });

        try {
          const workflow = await workflowsService.getWorkflowById(Number(workflowId));

          set({
            currentWorkflow: workflow,
            loading: false
          });

        } catch (error) {
          set({
            error: getErrorMessage(error),
            loading: false
          });

        } ,

      createWorkflow: async (workflowData: unknown) => {
        set({ isCreating: true, error: null });

        try {
          const newWorkflow = await workflowsService.createWorkflow(workflowData);

          // Adicionar à lista atual
          const currentState = get();

          set({
            workflows: [newWorkflow, ...currentState.workflows],
            currentWorkflow: newWorkflow,
            isCreating: false
          });

          return { success: true, data: newWorkflow};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isCreating: false });

          return { success: false, error: errorMessage};

        } ,

      updateWorkflow: async (workflowId: unknown, workflowData: unknown) => {
        set({ isUpdating: true, error: null });

        try {
          const updatedWorkflow = await workflowsService.updateWorkflow(Number(workflowId), workflowData);

          // Atualizar na lista
          const currentState = get();

          const updatedWorkflows = currentState.workflows.map(w => 
            w.id === Number(workflowId) ? updatedWorkflow : w);

          set({
            workflows: updatedWorkflows,
            currentWorkflow: currentState.currentWorkflow?.id === Number(workflowId) 
              ? updatedWorkflow 
              : currentState.currentWorkflow,
            isUpdating: false
          });

          return { success: true, data: updatedWorkflow};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isUpdating: false });

          return { success: false, error: errorMessage};

        } ,

      deleteWorkflow: async (workflowId: unknown) => {
        set({ isDeleting: true, error: null });

        try {
          await workflowsService.deleteWorkflow(Number(workflowId));

          // Remover da lista
          const currentState = get();

          const filteredWorkflows = currentState.workflows.filter(w => w.id !== Number(workflowId));

          set({
            workflows: filteredWorkflows,
            currentWorkflow: currentState.currentWorkflow?.id === Number(workflowId) 
              ? null 
              : currentState.currentWorkflow,
            isDeleting: false
          });

          return { success: true};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isDeleting: false });

          return { success: false, error: errorMessage};

        } ,

      // ===== WORKFLOW ACTIONS =====

      duplicateWorkflow: async (workflowId: unknown, newName: unknown) => {
        set({ isCreating: true, error: null });

        try {
          const duplicatedWorkflow = await workflowsService.createWorkflow({
            name: newName || `Cópia do Workflow ${workflowId}`,
            // Aqui você adicionaria os dados do workflow original
          });

          const currentState = get();

          set({
            workflows: [duplicatedWorkflow, ...currentState.workflows],
            isCreating: false
          });

          return { success: true, data: duplicatedWorkflow};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isCreating: false });

          return { success: false, error: errorMessage};

        } ,

      toggleWorkflowStatus: async (workflowId: unknown) => {
        set({ isUpdating: true, error: null });

        try {
          const currentState = get();

          const workflow = currentState.workflows.find(w => w.id === Number(workflowId));

          if (!workflow) {
            throw new Error('Workflow não encontrado');

          }
          
          const updatedWorkflow = await workflowsService.updateWorkflow(Number(workflowId), {
            is_active: !workflow.is_active
          });

          // Atualizar na lista
          const updatedWorkflows = currentState.workflows.map(w => 
            w.id === Number(workflowId) ? updatedWorkflow : w);

          set({
            workflows: updatedWorkflows,
            currentWorkflow: currentState.currentWorkflow?.id === Number(workflowId) 
              ? updatedWorkflow 
              : currentState.currentWorkflow,
            isUpdating: false
          });

          return { success: true, data: updatedWorkflow};

        } catch (error) {
          const errorMessage = getErrorMessage(error);

          set({ error: errorMessage, isUpdating: false });

          return { success: false, error: errorMessage};

        } ,

      // ===== FILTERS =====

      setFilters: (filters: unknown) => {
        set((state: unknown) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 } // Reset para primeira página
        }));

      },

      clearFilters: () => {
        set((state: unknown) => ({
          filters: initialState.filters,
          pagination: { ...state.pagination, page: 1 } ));

      },

      updateFilter: (key: unknown, value: unknown) => {
        set((state: unknown) => ({
          filters: { ...state.filters, [key]: value },
          pagination: { ...state.pagination, page: 1 } ));

      },

      // ===== PAGINATION =====

      setPage: (page: unknown) => {
        set((state: unknown) => ({
          pagination: { ...state.pagination, page } ));

      },

      setLimit: (limit: unknown) => {
        set((state: unknown) => ({
          pagination: { ...state.pagination, limit, page: 1 } ));

      },

      // ===== SELECTION =====

      selectWorkflow: (workflowId: unknown) => {
        set((state: unknown) => {
          const newSelectedIds = new Set(state.selection.selectedIds);

          newSelectedIds.add(workflowId);

          return {
            selection: {
              selectedIds: newSelectedIds,
              isAllSelected: newSelectedIds.size === state.workflows.length
            } ;

        });

      },

      deselectWorkflow: (workflowId: unknown) => {
        set((state: unknown) => {
          const newSelectedIds = new Set(state.selection.selectedIds);

          newSelectedIds.delete(workflowId);

          return {
            selection: {
              selectedIds: newSelectedIds,
              isAllSelected: false
            } ;

        });

      },

      selectAll: () => {
        set((state: unknown) => ({
          selection: {
            selectedIds: new Set(state.workflows.map(w => w.id)),
            isAllSelected: true
          } ));

      },

      clearSelection: () => {
        set({
          selection: {
            selectedIds: new Set(),
            isAllSelected: false
          } );

      },

      toggleSelection: (workflowId: unknown) => {
        const state = get();

        if (state.selection.selectedIds.has(workflowId)) {
          get().deselectWorkflow(workflowId);

        } else {
          get().selectWorkflow(workflowId);

        } ,

      // ===== BULK ACTIONS =====

      deleteSelected: async () => {
        const state = get();

        const selectedIds = Array.from(state.selection.selectedIds);

        if (selectedIds.length === 0) {
          return { success: true, deletedCount: 0, errors: []};

        }
        
        set({ isDeleting: true, error: null });

        const errors: string[] = [];
        let deletedCount = 0;
        
        for (const workflowId of selectedIds) {
          try {
            await workflowsService.deleteWorkflow(Number(workflowId));

            deletedCount++;
          } catch (error) {
            errors.push(`Erro ao remover workflow ${workflowId}: ${getErrorMessage(error)}`);

          } // Atualizar lista
        const currentState = get();

        const filteredWorkflows = currentState.workflows.filter(w => !selectedIds.includes(w.id));

        set({
          workflows: filteredWorkflows,
          selection: {
            selectedIds: new Set(),
            isAllSelected: false
          },
          isDeleting: false
        });

        return { success: errors.length === 0, deletedCount, errors};

      },

      toggleSelectedStatus: async () => {
        const state = get();

        const selectedIds = Array.from(state.selection.selectedIds);

        if (selectedIds.length === 0) {
          return { success: true, updatedCount: 0, errors: []};

        }
        
        set({ isUpdating: true, error: null });

        const errors: string[] = [];
        let updatedCount = 0;
        
        for (const workflowId of selectedIds) {
          try {
            await get().toggleWorkflowStatus(workflowId);

            updatedCount++;
          } catch (error) {
            errors.push(`Erro ao alterar status do workflow ${workflowId}: ${getErrorMessage(error)}`);

          } set({ isUpdating: false });

        return { success: errors.length === 0, updatedCount, errors};

      },

      // ===== UTILITY =====

      refreshWorkflows: async () => {
        const state = get();

        await get().fetchWorkflows({
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
      name: 'workflows-store',
      partialize: (state: unknown) => ({
        filters: state.filters,
        pagination: state.pagination
      })
  }
  ));

export default useWorkflowsStore;
