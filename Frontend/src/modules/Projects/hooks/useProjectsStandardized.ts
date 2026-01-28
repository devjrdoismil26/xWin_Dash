/**
 * Hook orquestrador do módulo Projects
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useProjectsStore } from './useProjectsStore';
import { useProjectsCore } from './useProjectsCore';
import { Project, ProjectFilters } from '../types';

interface UseProjectsReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  
  // Dados principais
  projects: Project[];
  currentProject: Project | null;
  
  // Ações principais
  loadProjects: (filters?: ProjectFilters) => Promise<void>;
  createProject: (data: any) => Promise<Project>;
  updateProject: (id: string, data: any) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  
  // Hooks especializados
  core: ReturnType<typeof useProjectsCore>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useProjects = (): UseProjectsReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();
  const store = useProjectsStore();
  const core = useProjectsCore();
  
  // Lógica de orquestração
  const loadProjects = useCallback(async (filters?: ProjectFilters) => {
    try {
      await core.loadProjects(filters);
      showSuccess('Projetos carregados com sucesso!');
    } catch (error: any) {
      showError('Erro ao carregar projetos', error.message);
    }
  }, [core, showSuccess, showError]);
  
  const createProject = useCallback(async (data: any) => {
    try {
      const result = await core.createProject(data);
      showSuccess('Projeto criado com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao criar projeto', error.message);
      throw error;
    }
  }, [core, showSuccess, showError]);
  
  const updateProject = useCallback(async (id: string, data: any) => {
    try {
      const result = await core.updateProject(id, data);
      showSuccess('Projeto atualizado com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao atualizar projeto', error.message);
      throw error;
    }
  }, [core, showSuccess, showError]);
  
  const deleteProject = useCallback(async (id: string) => {
    try {
      await core.deleteProject(id);
      showSuccess('Projeto excluído com sucesso!');
    } catch (error: any) {
      showError('Erro ao excluir projeto', error.message);
      throw error;
    }
  }, [core, showSuccess, showError]);
  
  // Inicialização
  useEffect(() => {
    loadProjects();
  }, []);
  
  return {
    loading: store.loading || core.loading,
    error: store.error || core.error,
    projects: store.projects,
    currentProject: store.currentProject,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    core,
    clearError: () => {
      store.clearError();
      core.clearError();
    },
    refresh: loadProjects
  };
};