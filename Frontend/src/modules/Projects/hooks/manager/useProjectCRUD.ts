import { useState, useCallback } from 'react';
import { ProjectManager, ProjectManagerFilters } from '../../ProjectsManager/types/projectsManagerTypes';
import projectsManagerService from '../../ProjectsManager/services/projectsManagerService';

export const useProjectCRUD = () => {
  const [projects, setProjects] = useState<ProjectManager[]>([]);

  const [currentProject, setCurrentProject] = useState<ProjectManager | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchManagedProjects = useCallback(async (filters?: ProjectManagerFilters, page = 1) => {
    setLoading(true);

    setError(null);

    try {
      const response = await projectsManagerService.getManagedProjects(filters, page);

      setProjects(response.data);

    } catch (err: unknown) {
      setError(err.message || 'Erro ao buscar projetos');

    } finally {
      setLoading(false);

    } , []);

  const fetchProjectManager = useCallback(async (id: string) => {
    setLoading(true);

    setError(null);

    try {
      const project = await projectsManagerService.getProjectManager(id);

      setCurrentProject(project);

    } catch (err: unknown) {
      setError(err.message || 'Erro ao buscar projeto');

    } finally {
      setLoading(false);

    } , []);

  const updateProjectMode = useCallback(async (id: string, mode: 'normal' | 'universe') => {
    setLoading(true);

    setError(null);

    try {
      const updated = await projectsManagerService.updateProjectMode(id, mode);

      setCurrentProject(updated);

      return updated;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao atualizar modo');

      return null;
    } finally {
      setLoading(false);

    } , []);

  const updateProjectModules = useCallback(async (id: string, modules: string[]) => {
    setLoading(true);

    setError(null);

    try {
      const updated = await projectsManagerService.updateProjectModules(id, modules);

      setCurrentProject(updated);

      return updated;
    } catch (err: unknown) {
      setError(err.message || 'Erro ao atualizar módulos');

      return null;
    } finally {
      setLoading(false);

    } , []);

  return {
    projects,
    currentProject,
    loading,
    error,
    setCurrentProject,
    fetchManagedProjects,
    fetchProjectManager,
    updateProjectMode,
    updateProjectModules};
};
