import { useState, useEffect, useCallback, useMemo } from 'react';
import { useProjectsCore } from '../ProjectsCore/hooks/useProjectsCore';
import { useProjectsManager } from '../ProjectsManager/hooks/useProjectsManager';
// useProjectsAdvanced refatorado em hooks modulares
// import { useProjectsAdvanced } from '../ProjectsAdvanced/hooks/useProjectsAdvanced';
import {
  ProjectCore,
  ProjectManager,
  ProjectAdvanced,
  ProjectStatus,
  ProjectMode
} from '../types/projectsTypes';

interface UseProjectsReturn {
  // State
  projects: ProjectCore[];
  currentProject: ProjectCore | null;
  loading: boolean;
  error: string | null;

  // Core operations
  fetchProjects: (filters?: any, page?: number) => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (projectData: Partial<ProjectCore>) => Promise<ProjectCore | null>;
  updateProject: (id: string, projectData: Partial<ProjectCore>) => Promise<ProjectCore | null>;
  deleteProject: (id: string) => Promise<boolean>;

  // Manager operations
  updateProjectMode: (id: string, mode: ProjectMode) => Promise<ProjectManager | null>;
  updateProjectModules: (id: string, modules: string[]) => Promise<ProjectManager | null>;
  getProjectMembers: (projectId: string) => Promise<any[]>;
  addProjectMember: (projectId: string, memberData: any) => Promise<any>;
  updateProjectSettings: (projectId: string, settings: any) => Promise<any>;

  // Advanced operations
  getProjectTemplates: (projectId: string) => Promise<any[]>;
  getProjectTimeline: (projectId: string) => Promise<any>;
  getProjectMilestones: (projectId: string) => Promise<any[]>;
  getProjectResources: (projectId: string) => Promise<any[]>;
  getProjectBudget: (projectId: string) => Promise<any>;
  getProjectRisks: (projectId: string) => Promise<any[]>;
  getProjectAnalytics: (projectId: string) => Promise<any>;

  // Navigation
  navigateToProject: (project: ProjectCore) => void;
  navigateToUniverse: () => void;

  // Utilities
  clearError: () => void;
  setCurrentProject: (project: ProjectCore | null) => void;
}

export const useProjects = (): UseProjectsReturn => {
  // Initialize hooks for each module
  const coreHook = useProjectsCore();
  const managerHook = useProjectsManager();
  const advancedHook = useProjectsAdvanced();

  // Navigation state
  const [navigationState, setNavigationState] = useState<{
    currentProject: ProjectCore | null;
    universeMode: boolean;
  }>({
    currentProject: null,
    universeMode: false
  });

  // Computed state
  const loading = useMemo(() => 
    coreHook.loading || managerHook.loading || advancedHook.loading,
    [coreHook.loading, managerHook.loading, advancedHook.loading]
  );

  const error = useMemo(() => 
    coreHook.error || managerHook.error || advancedHook.error,
    [coreHook.error, managerHook.error, advancedHook.error]
  );

  // Navigation functions
  const navigateToProject = useCallback((project: ProjectCore) => {
    setNavigationState(prev => ({
      ...prev,
      currentProject: project,
      universeMode: false
    }));
    coreHook.setCurrentProject(project);
  }, [coreHook]);

  const navigateToUniverse = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      universeMode: true,
      currentProject: null
    }));
  }, []);

  // Core operations (delegated to core hook)
  const fetchProjects = useCallback(async (filters?: any, page?: number) => {
    await coreHook.fetchProjects(filters, page);
  }, [coreHook]);

  const fetchProject = useCallback(async (id: string) => {
    await coreHook.fetchProject(id);
  }, [coreHook]);

  const createProject = useCallback(async (projectData: Partial<ProjectCore>): Promise<ProjectCore | null> => {
    return await coreHook.createProject(projectData);
  }, [coreHook]);

  const updateProject = useCallback(async (id: string, projectData: Partial<ProjectCore>): Promise<ProjectCore | null> => {
    return await coreHook.updateProject(id, projectData);
  }, [coreHook]);

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    return await coreHook.deleteProject(id);
  }, [coreHook]);

  // Manager operations (delegated to manager hook)
  const updateProjectMode = useCallback(async (id: string, mode: ProjectMode): Promise<ProjectManager | null> => {
    return await managerHook.updateProjectMode(id, mode);
  }, [managerHook]);

  const updateProjectModules = useCallback(async (id: string, modules: string[]): Promise<ProjectManager | null> => {
    return await managerHook.updateProjectModules(id, modules);
  }, [managerHook]);

  const getProjectMembers = useCallback(async (projectId: string): Promise<any[]> => {
    const result = await managerHook.getProjectMembers(projectId);
    return result || [];
  }, [managerHook]);

  const addProjectMember = useCallback(async (projectId: string, memberData: any): Promise<any> => {
    return await managerHook.addProjectMember(projectId, memberData);
  }, [managerHook]);

  const updateProjectSettings = useCallback(async (projectId: string, settings: any): Promise<any> => {
    return await managerHook.updateProjectSettings(projectId, settings);
  }, [managerHook]);

  // Advanced operations (delegated to advanced hook)
  const getProjectTemplates = useCallback(async (projectId: string): Promise<any[]> => {
    const result = await advancedHook.getProjectTemplates(projectId);
    return result || [];
  }, [advancedHook]);

  const getProjectTimeline = useCallback(async (projectId: string): Promise<any> => {
    return await advancedHook.getProjectTimeline(projectId);
  }, [advancedHook]);

  const getProjectMilestones = useCallback(async (projectId: string): Promise<any[]> => {
    const result = await advancedHook.getProjectMilestones(projectId);
    return result || [];
  }, [advancedHook]);

  const getProjectResources = useCallback(async (projectId: string): Promise<any[]> => {
    const result = await advancedHook.getProjectResources(projectId);
    return result || [];
  }, [advancedHook]);

  const getProjectBudget = useCallback(async (projectId: string): Promise<any> => {
    return await advancedHook.getProjectBudget(projectId);
  }, [advancedHook]);

  const getProjectRisks = useCallback(async (projectId: string): Promise<any[]> => {
    const result = await advancedHook.getProjectRisks(projectId);
    return result || [];
  }, [advancedHook]);

  const getProjectAnalytics = useCallback(async (projectId: string): Promise<any> => {
    return await advancedHook.getProjectAnalytics(projectId);
  }, [advancedHook]);

  // Utility functions
  const clearError = useCallback(() => {
    coreHook.clearError();
    managerHook.clearError();
    advancedHook.clearError();
  }, [coreHook, managerHook, advancedHook]);

  const setCurrentProject = useCallback((project: ProjectCore | null) => {
    coreHook.setCurrentProject(project);
    setNavigationState(prev => ({
      ...prev,
      currentProject: project
    }));
  }, [coreHook]);

  // Computed values
  const projects = useMemo(() => coreHook.projects, [coreHook.projects]);
  const currentProject = useMemo(() => 
    navigationState.currentProject || coreHook.currentProject,
    [navigationState.currentProject, coreHook.currentProject]
  );

  // Auto-fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    // State
    projects,
    currentProject,
    loading,
    error,

    // Core operations
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,

    // Manager operations
    updateProjectMode,
    updateProjectModules,
    getProjectMembers,
    addProjectMember,
    updateProjectSettings,

    // Advanced operations
    getProjectTemplates,
    getProjectTimeline,
    getProjectMilestones,
    getProjectResources,
    getProjectBudget,
    getProjectRisks,
    getProjectAnalytics,

    // Navigation
    navigateToProject,
    navigateToUniverse,

    // Utilities
    clearError,
    setCurrentProject
  };
};
