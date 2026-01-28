// ========================================
// HOOK DE GESTÃO DE MILESTONES DE PROJETO
// ========================================
import { useState, useCallback } from 'react';
import { ProjectMilestone } from '../../types/projectsAdvancedTypes';

export const useProjectMilestones = () => {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProjectMilestones = useCallback(async (projectId: string): Promise<ProjectMilestone[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock implementation
      const mockMilestones: ProjectMilestone[] = [
        {
          id: '1',
          projectId,
          name: 'Project Kickoff',
          description: 'Initial project kickoff meeting',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          priority: 'high',
          dependencies: [],
          deliverables: ['Project charter', 'Team assignments'],
          progress: 0,
          completedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setMilestones(prev => {
        const existing = prev.filter(m => m.projectId === projectId);
        if (existing.length === 0) {
          return [...prev, ...mockMilestones];
        }
        return prev;
      });
      
      return mockMilestones;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project milestones');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProjectMilestone = useCallback(async (projectId: string, milestoneData: Partial<ProjectMilestone>): Promise<ProjectMilestone | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newMilestone: ProjectMilestone = {
        id: Date.now().toString(),
        projectId,
        name: milestoneData.name || 'New Milestone',
        description: milestoneData.description || '',
        dueDate: milestoneData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: milestoneData.status || 'pending',
        priority: milestoneData.priority || 'medium',
        dependencies: milestoneData.dependencies || [],
        deliverables: milestoneData.deliverables || [],
        progress: milestoneData.progress || 0,
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setMilestones(prev => [...prev, newMilestone]);
      return newMilestone;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project milestone');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectMilestone = useCallback(async (projectId: string, milestoneId: string, milestoneData: Partial<ProjectMilestone>): Promise<ProjectMilestone | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedMilestone: ProjectMilestone = {
        id: milestoneId,
        projectId,
        name: milestoneData.name || 'Updated Milestone',
        description: milestoneData.description || '',
        dueDate: milestoneData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: milestoneData.status || 'pending',
        priority: milestoneData.priority || 'medium',
        dependencies: milestoneData.dependencies || [],
        deliverables: milestoneData.deliverables || [],
        progress: milestoneData.progress || 0,
        completedAt: milestoneData.completedAt || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setMilestones(prev => prev.map(m => m.id === milestoneId ? updatedMilestone : m));
      return updatedMilestone;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project milestone');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProjectMilestone = useCallback(async (projectId: string, milestoneId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      setMilestones(prev => prev.filter(m => m.id !== milestoneId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project milestone');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeProjectMilestone = useCallback(async (projectId: string, milestoneId: string): Promise<ProjectMilestone | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const completedMilestone: ProjectMilestone = {
        id: milestoneId,
        projectId,
        name: 'Completed Milestone',
        description: '',
        dueDate: new Date().toISOString(),
        status: 'completed',
        priority: 'medium',
        dependencies: [],
        deliverables: [],
        progress: 100,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setMilestones(prev => prev.map(m => m.id === milestoneId ? completedMilestone : m));
      return completedMilestone;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete project milestone');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    milestones,
    loading,
    error,
    getProjectMilestones,
    createProjectMilestone,
    updateProjectMilestone,
    deleteProjectMilestone,
    completeProjectMilestone
  };
};