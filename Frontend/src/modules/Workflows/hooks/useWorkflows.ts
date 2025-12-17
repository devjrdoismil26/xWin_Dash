/**
 * Hook orquestrador do módulo Workflows
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useWorkflowsStore } from './useWorkflowsStore';
import { useExecutionsStore } from './useExecutionsStore';
import { Workflow, WorkflowExecution, WorkflowFilters } from '../types';

interface UseWorkflowsReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  // Dados principais
  workflows: Workflow[];
  executions: WorkflowExecution[];
  workflowExecutions: WorkflowExecution[];
  // Ações principais
  loadWorkflows: (filters?: WorkflowFilters) => Promise<void>;
  createWorkflow: (data: Record<string, any>) => Promise<Workflow>;
  updateWorkflow: (id: string, data: Record<string, any>) => Promise<Workflow>;
  deleteWorkflow: (id: string) => Promise<void>;
  // Ações de execução
  fetchWorkflowExecutions: (workflowId?: string) => Promise<void>;
  pauseExecution: (executionId: string) => Promise<void>;
  resumeExecution: (executionId: string) => Promise<void>;
  cancelExecution: (executionId: string) => Promise<void>;
  // Hooks especializados
  store: ReturnType<typeof useWorkflowsStore>;
  executionsStore: ReturnType<typeof useExecutionsStore>;
  // Utilitários
  clearError??: (e: any) => void;
  refresh: () => Promise<void>; }

export const useWorkflows = (): UseWorkflowsReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();

  const store = useWorkflowsStore();

  const executionsStore = useExecutionsStore();

  // Lógica de orquestração
  const loadWorkflows = useCallback(async (filters?: WorkflowFilters) => {
    try {
      await store.fetchWorkflows(filters);

      showSuccess('Workflows carregados com sucesso!');

    } catch (error: unknown) {
      showError('Erro ao carregar workflows', getErrorMessage(error));

    } , [store, showSuccess, showError]);

  const createWorkflow = useCallback(async (data: Record<string, any>) => {
    try {
      const result = await store.createWorkflow(data);

      if (result.success && result.data) {
        showSuccess('Workflow criado com sucesso!');

        return result.data;
      }
      throw new Error(result.error || 'Erro ao criar workflow');

    } catch (error: unknown) {
      showError('Erro ao criar workflow', getErrorMessage(error));

      throw error;
    } , [store, showSuccess, showError]);

  const updateWorkflow = useCallback(async (id: string, data: Record<string, any>) => {
    try {
      const result = await store.updateWorkflow(id, data);

      if (result.success && result.data) {
        showSuccess('Workflow atualizado com sucesso!');

        return result.data;
      }
      throw new Error(result.error || 'Erro ao atualizar workflow');

    } catch (error: unknown) {
      showError('Erro ao atualizar workflow', getErrorMessage(error));

      throw error;
    } , [store, showSuccess, showError]);

  const deleteWorkflow = useCallback(async (id: string) => {
    try {
      const result = await store.deleteWorkflow(id);

      if (result.success) {
        showSuccess('Workflow excluído com sucesso!');

      } else {
        throw new Error(result.error || 'Erro ao excluir workflow');

      } catch (error: unknown) {
      showError('Erro ao excluir workflow', getErrorMessage(error));

    } , [store, showSuccess, showError]);

  // Wrappers para métodos de execução
  const fetchWorkflowExecutions = useCallback(async (workflowId?: string) => {
    await executionsStore.fetchExecutions(workflowId ? { workflow_id: workflowId } : undefined);

  }, [executionsStore]);

  const pauseExecution = useCallback(async (executionId: string) => {
    await executionsStore.pauseExecution(Number(executionId));

  }, [executionsStore]);

  const resumeExecution = useCallback(async (executionId: string) => {
    await executionsStore.resumeExecution(Number(executionId));

  }, [executionsStore]);

  const cancelExecution = useCallback(async (executionId: string) => {
    await executionsStore.cancelExecution(Number(executionId));

  }, [executionsStore]);

  // Inicialização
  useEffect(() => {
    loadWorkflows();

    executionsStore.fetchExecutions();

  }, []);

  return {
    loading: store.loading || executionsStore.loading,
    error: store.error || executionsStore.error,
    workflows: store.workflows,
    executions: executionsStore.executions,
    workflowExecutions: executionsStore.executions,
    loadWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    fetchWorkflowExecutions,
    pauseExecution,
    resumeExecution,
    cancelExecution,
    store,
    executionsStore,
    clearError: () => {
      store.clearError();

      executionsStore.clearError();

    },
    refresh: loadWorkflows};
};

export default useWorkflows;
