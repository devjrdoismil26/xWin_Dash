// ========================================
// HOOK DE GESTÃO DE RECURSOS DE PROJETO
// ========================================
import { useState, useCallback } from 'react';
import { ProjectResource } from '../../types/projectsAdvancedTypes';

export const useProjectResources = () => {
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProjectResources = useCallback(async (projectId: string): Promise<ProjectResource[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock implementation
      const mockResources: ProjectResource[] = [
        {
          id: '1',
          projectId,
          name: 'Senior Developer',
          type: 'human',
          category: 'development',
          description: 'Senior full-stack developer',
          availability: 100,
          cost: 150,
          unit: 'hour',
          allocatedHours: 40,
          totalHours: 160,
          skills: ['React', 'Node.js', 'TypeScript'],
          status: 'available',
          assignedTo: 'user1',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setResources(prev => {
        const existing = prev.filter(r => r.projectId === projectId);
        if (existing.length === 0) {
          return [...prev, ...mockResources];
        }
        return prev;
      });
      
      return mockResources;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project resources');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProjectResource = useCallback(async (projectId: string, resourceData: Partial<ProjectResource>): Promise<ProjectResource | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newResource: ProjectResource = {
        id: Date.now().toString(),
        projectId,
        name: resourceData.name || 'New Resource',
        type: resourceData.type || 'human',
        category: resourceData.category || 'general',
        description: resourceData.description || '',
        availability: resourceData.availability || 100,
        cost: resourceData.cost || 0,
        unit: resourceData.unit || 'hour',
        allocatedHours: resourceData.allocatedHours || 0,
        totalHours: resourceData.totalHours || 0,
        skills: resourceData.skills || [],
        status: resourceData.status || 'available',
        assignedTo: resourceData.assignedTo || null,
        startDate: resourceData.startDate || new Date().toISOString(),
        endDate: resourceData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setResources(prev => [...prev, newResource]);
      return newResource;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project resource');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectResource = useCallback(async (projectId: string, resourceId: string, resourceData: Partial<ProjectResource>): Promise<ProjectResource | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedResource: ProjectResource = {
        id: resourceId,
        projectId,
        name: resourceData.name || 'Updated Resource',
        type: resourceData.type || 'human',
        category: resourceData.category || 'general',
        description: resourceData.description || '',
        availability: resourceData.availability || 100,
        cost: resourceData.cost || 0,
        unit: resourceData.unit || 'hour',
        allocatedHours: resourceData.allocatedHours || 0,
        totalHours: resourceData.totalHours || 0,
        skills: resourceData.skills || [],
        status: resourceData.status || 'available',
        assignedTo: resourceData.assignedTo || null,
        startDate: resourceData.startDate || new Date().toISOString(),
        endDate: resourceData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setResources(prev => prev.map(r => r.id === resourceId ? updatedResource : r));
      return updatedResource;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project resource');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProjectResource = useCallback(async (projectId: string, resourceId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      setResources(prev => prev.filter(r => r.id !== resourceId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project resource');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    resources,
    loading,
    error,
    getProjectResources,
    createProjectResource,
    updateProjectResource,
    deleteProjectResource
  };
};