import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ProjectCore,
  ProjectCoreFilters,
  ProjectCoreMetrics,
  ProjectCoreActivity,
  ProjectCoreSearchResult,
  ProjectStatus
} from '../types/projectsCoreTypes';
import projectsCoreService from '../services/projectsCoreService';

interface UseProjectsCoreReturn {
  // State
  projects: ProjectCore[];
  currentProject: ProjectCore | null;
  metrics: ProjectCoreMetrics | null;
  activity: ProjectCoreActivity[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Actions
  fetchProjects: (filters?: ProjectCoreFilters, page?: number) => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (projectData: Partial<ProjectCore>) => Promise<ProjectCore | null>;
  updateProject: (id: string, projectData: Partial<ProjectCore>) => Promise<ProjectCore | null>;
  deleteProject: (id: string) => Promise<boolean>;
  updateProjectStatus: (id: string, status: ProjectStatus) => Promise<ProjectCore | null>;
  archiveProject: (id: string) => Promise<ProjectCore | null>;
  restoreProject: (id: string) => Promise<ProjectCore | null>;
  searchProjects: (query: string, filters?: ProjectCoreFilters) => Promise<void>;
  bulkUpdateStatus: (projectIds: string[], status: ProjectStatus) => Promise<boolean>;
  bulkDelete: (projectIds: string[]) => Promise<boolean>;
  fetchMetrics: () => Promise<void>;
  fetchActivity: (projectId: string, limit?: number) => Promise<void>;
  exportProjects: (format: 'csv' | 'excel' | 'pdf', filters?: ProjectCoreFilters) => Promise<Blob | null>;
  validateProjectName: (name: string, excludeId?: string) => Promise<{ valid: boolean; message?: string }>;
  clearCache: () => Promise<void>;
  clearError: () => void;
  setCurrentProject: (project: ProjectCore | null) => void;
}

export const useProjectsCore = (): UseProjectsCoreReturn => {
  // State
  const [projects, setProjects] = useState<ProjectCore[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectCore | null>(null);
  const [metrics, setMetrics] = useState<ProjectCoreMetrics | null>(null);
  const [activity, setActivity] = useState<ProjectCoreActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch projects with filters and pagination
  const fetchProjects = useCallback(async (filters?: ProjectCoreFilters, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsCoreService.getProjects(filters, { page, limit: pagination.limit });
      
      setProjects(result.projects);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  // Fetch single project
  const fetchProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsCoreService.getProjectById(id);
      
      if (result.success) {
        setCurrentProject(result.data);
      } else {
        setError(result.message || 'Failed to fetch project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create project
  const createProject = useCallback(async (projectData: Partial<ProjectCore>): Promise<ProjectCore | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsCoreService.createProject(projectData);
      
      if (result.success) {
        setProjects(prev => [result.data, ...prev]);
        return result.data;
      } else {
        setError(result.message || 'Failed to create project');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update project
  const updateProject = useCallback(async (id: string, projectData: Partial<ProjectCore>): Promise<ProjectCore | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsCoreService.updateProject(id, projectData);
      
      if (result.success) {
        setProjects(prev => prev.map(p => p.id === id ? result.data : p));
        if (currentProject?.id === id) {
          setCurrentProject(result.data);
        }
        return result.data;
      } else {
        setError(result.message || 'Failed to update project');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id]);

  // Delete project
  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsCoreService.deleteProject(id);
      
      if (result.success) {
        setProjects(prev => prev.filter(p => p.id !== id));
        if (currentProject?.id === id) {
          setCurrentProject(null);
        }
        return true;
      } else {
        setError(result.message || 'Failed to delete project');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id]);

  // Update project status
  const updateProjectStatus = useCallback(async (id: string, status: ProjectStatus): Promise<ProjectCore | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsCoreService.updateProjectStatus(id, status);
      
      if (result.success) {
        setProjects(prev => prev.map(p => p.id === id ? result.data : p));
        if (currentProject?.id === id) {
          setCurrentProject(result.data);
        }
        return result.data;
      } else {
        setError(result.message || 'Failed to update project status');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project status');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id]);

  // Archive project
  const archiveProject = useCallback(async (id: string): Promise<ProjectCore | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsCoreService.archiveProject(id);
      
      if (result.success) {
        setProjects(prev => prev.map(p => p.id === id ? result.data : p));
        if (currentProject?.id === id) {
          setCurrentProject(result.data);
        }
        return result.data;
      } else {
        setError(result.message || 'Failed to archive project');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive project');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id]);

  // Restore project
  const restoreProject = useCallback(async (id: string): Promise<ProjectCore | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsCoreService.restoreProject(id);
      
      if (result.success) {
        setProjects(prev => prev.map(p => p.id === id ? result.data : p));
        if (currentProject?.id === id) {
          setCurrentProject(result.data);
        }
        return result.data;
      } else {
        setError(result.message || 'Failed to restore project');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore project');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProject?.id]);

  // Search projects
  const searchProjects = useCallback(async (query: string, filters?: ProjectCoreFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsCoreService.searchProjects(query, filters);
      
      setProjects(result.projects);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Bulk update status
  const bulkUpdateStatus = useCallback(async (projectIds: string[], status: ProjectStatus): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsCoreService.bulkUpdateStatus(projectIds, status);
      
      if (result.success) {
        // Refresh projects to get updated data
        await fetchProjects();
        return true;
      } else {
        setError(result.message || 'Failed to bulk update project status');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update project status');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  // Bulk delete
  const bulkDelete = useCallback(async (projectIds: string[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectsCoreService.bulkDelete(projectIds);
      
      if (result.success) {
        setProjects(prev => prev.filter(p => !projectIds.includes(p.id)));
        return true;
      } else {
        setError(result.message || 'Failed to bulk delete projects');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk delete projects');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch metrics
  const fetchMetrics = useCallback(async () => {
    try {
      setError(null);
      
      const result = await projectsCoreService.getProjectMetrics();
      
      if (result.success) {
        setMetrics(result.data);
      } else {
        setError(result.message || 'Failed to fetch metrics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    }
  }, []);

  // Fetch activity
  const fetchActivity = useCallback(async (projectId: string, limit?: number) => {
    try {
      setError(null);
      
      const result = await projectsCoreService.getProjectActivity(projectId, limit);
      
      if (result.success) {
        setActivity(result.data);
      } else {
        setError(result.message || 'Failed to fetch activity');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity');
    }
  }, []);

  // Export projects
  const exportProjects = useCallback(async (format: 'csv' | 'excel' | 'pdf', filters?: ProjectCoreFilters): Promise<Blob | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const blob = await projectsCoreService.exportProjects(format, filters);
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export projects');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate project name
  const validateProjectName = useCallback(async (name: string, excludeId?: string): Promise<{ valid: boolean; message?: string }> => {
    try {
      setError(null);
      
      const result = await projectsCoreService.validateProjectName(name, excludeId);
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to validate project name');
        return { valid: false, message: result.message };
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate project name');
      return { valid: false, message: err instanceof Error ? err.message : 'Validation failed' };
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(async () => {
    try {
      setError(null);
      
      const result = await projectsCoreService.clearCache();
      
      if (!result.success) {
        setError(result.message || 'Failed to clear cache');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cache');
    }
  }, []);

  // Computed values
  const activeProjects = useMemo(() => 
    projects.filter(p => p.status === 'active'), 
    [projects]
  );

  const archivedProjects = useMemo(() => 
    projects.filter(p => p.status === 'archived'), 
    [projects]
  );

  const recentProjects = useMemo(() => 
    [...projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5),
    [projects]
  );

  // Auto-fetch metrics on mount
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    // State
    projects,
    currentProject,
    metrics,
    activity,
    loading,
    error,
    pagination,

    // Actions
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    archiveProject,
    restoreProject,
    searchProjects,
    bulkUpdateStatus,
    bulkDelete,
    fetchMetrics,
    fetchActivity,
    exportProjects,
    validateProjectName,
    clearCache,
    clearError,
    setCurrentProject,

    // Computed values (for convenience)
    activeProjects,
    archivedProjects,
    recentProjects
  };
};
