/**
 * Hook orquestrador do módulo Workflows
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useWorkflowsStore } from './useWorkflowsStore';
import { useWorkflowsCore } from './useWorkflowsCore';
import { useWorkflowsExecutions } from './useWorkflowsExecutions';
import { Workflow, WorkflowExecution, WorkflowFilters } from '../types';

interface UseWorkflowsReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  
  // Dados principais
  workflows: Workflow[];
  executions: WorkflowExecution[];
  
  // Ações principais
  loadWorkflows: (filters?: WorkflowFilters) => Promise<void>;
  createWorkflow: (data: any) => Promise<Workflow>;
  updateWorkflow: (id: string, data: any) => Promise<Workflow>;
  deleteWorkflow: (id: string) => Promise<void>;
  
  // Hooks especializados
  core: ReturnType<typeof useWorkflowsCore>;
  executions: ReturnType<typeof useWorkflowsExecutions>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useWorkflows = (): UseWorkflowsReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();
  const store = useWorkflowsStore();
  const core = useWorkflowsCore();
  const executions = useWorkflowsExecutions();
  
  // Lógica de orquestração
  const loadWorkflows = useCallback(async (filters?: WorkflowFilters) => {
    try {
      await core.loadWorkflows(filters);
      showSuccess('Workflows carregados com sucesso!');
    } catch (error: any) {
      showError('Erro ao carregar workflows', error.message);
    }
  }, [core, showSuccess, showError]);
  
  const createWorkflow = useCallback(async (data: any) => {
    try {
      const result = await core.createWorkflow(data);
      showSuccess('Workflow criado com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao criar workflow', error.message);
      throw error;
    }
  }, [core, showSuccess, showError]);
  
  const updateWorkflow = useCallback(async (id: string, data: any) => {
    try {
      const result = await core.updateWorkflow(id, data);
      showSuccess('Workflow atualizado com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao atualizar workflow', error.message);
      throw error;
    }
  }, [core, showSuccess, showError]);
  
  const deleteWorkflow = useCallback(async (id: string) => {
    try {
      await core.deleteWorkflow(id);
      showSuccess('Workflow excluído com sucesso!');
    } catch (error: any) {
      showError('Erro ao excluir workflow', error.message);
      throw error;
    }
  }, [core, showSuccess, showError]);
  
  // Inicialização
  useEffect(() => {
    loadWorkflows();
    executions.loadExecutions();
  }, []);
  
  return {
    loading: store.loading || core.loading || executions.loading,
    error: store.error || core.error || executions.error,
    workflows: store.workflows,
    executions: store.executions,
    loadWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    core,
    executions,
    clearError: () => {
      store.clearError();
      core.clearError();
      executions.clearError();
    },
    refresh: loadWorkflows
  };
};