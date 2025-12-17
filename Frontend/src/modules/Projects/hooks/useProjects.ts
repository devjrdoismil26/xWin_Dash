/**
import { getErrorMessage } from '@/utils/errorHelpers';
import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto
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
  createProject: (data: unknown) => Promise<Project>;
  updateProject: (id: string, data: unknown) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  // Hooks especializados
  core: ReturnType<typeof useProjectsCore>;
  // Utilitários
  clearError??: (e: any) => void;
  refresh: () => Promise<void>; }

export const useProjects = (): UseProjectsReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();

  const store = useProjectsStore();

  const core = useProjectsCore();

  // Lógica de orquestração
  const loadProjects = useCallback(async (filters?: ProjectFilters) => {
    try {
      await core.loadProjects(filters);

      showSuccess('Projetos carregados com sucesso!');

    } catch (error: unknown) {
      showError('Erro ao carregar projetos', getErrorMessage(error));

    } , [core, showSuccess, showError]);

  const createProject = useCallback(async (data: unknown) => {
    try {
      const result = await core.createProject(data);

      showSuccess('Projeto criado com sucesso!');

      return result;
    } catch (error: unknown) {
      showError('Erro ao criar projeto', getErrorMessage(error));

      throw error;
    } , [core, showSuccess, showError]);

  const updateProject = useCallback(async (id: string, data: unknown) => {
    try {
      const result = await core.updateProject(id, data);

      showSuccess('Projeto atualizado com sucesso!');

      return result;
    } catch (error: unknown) {
      showError('Erro ao atualizar projeto', getErrorMessage(error));

      throw error;
    } , [core, showSuccess, showError]);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await core.deleteProject(id);

      showSuccess('Projeto excluído com sucesso!');

    } catch (error: unknown) {
      showError('Erro ao excluir projeto', getErrorMessage(error));

      throw error;
    } , [core, showSuccess, showError]);

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
    refresh: loadProjects};
};
