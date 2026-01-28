// ========================================
// HOOK DE GESTÃO DE TIMELINES DE PROJETO
// ========================================
import { useState, useCallback } from 'react';
import { ProjectTimeline } from '../../types/projectsAdvancedTypes';

export const useProjectTimelines = () => {
  const [timelines, setTimelines] = useState<ProjectTimeline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProjectTimeline = useCallback(async (projectId: string): Promise<ProjectTimeline | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock implementation
      const mockTimeline: ProjectTimeline = {
        id: '1',
        projectId,
        name: 'Project Timeline',
        description: 'Main project timeline',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        phases: [
          {
            id: '1',
            name: 'Planning Phase',
            description: 'Initial planning and setup',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'in_progress',
            dependencies: [],
            milestones: []
          }
        ],
        dependencies: [],
        criticalPath: [],
        bufferTime: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTimelines(prev => {
        const existing = prev.find(t => t.projectId === projectId);
        if (existing) {
          return prev.map(t => t.projectId === projectId ? mockTimeline : t);
        }
        return [...prev, mockTimeline];
      });
      
      return mockTimeline;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project timeline');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProjectTimeline = useCallback(async (projectId: string, timelineData: Partial<ProjectTimeline>): Promise<ProjectTimeline | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newTimeline: ProjectTimeline = {
        id: Date.now().toString(),
        projectId,
        name: timelineData.name || 'New Timeline',
        description: timelineData.description || '',
        startDate: timelineData.startDate || new Date().toISOString(),
        endDate: timelineData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        phases: timelineData.phases || [],
        dependencies: timelineData.dependencies || [],
        criticalPath: timelineData.criticalPath || [],
        bufferTime: timelineData.bufferTime || 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTimelines(prev => [...prev, newTimeline]);
      return newTimeline;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project timeline');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectTimeline = useCallback(async (projectId: string, timelineId: string, timelineData: Partial<ProjectTimeline>): Promise<ProjectTimeline | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTimeline: ProjectTimeline = {
        id: timelineId,
        projectId,
        name: timelineData.name || 'Updated Timeline',
        description: timelineData.description || '',
        startDate: timelineData.startDate || new Date().toISOString(),
        endDate: timelineData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        phases: timelineData.phases || [],
        dependencies: timelineData.dependencies || [],
        criticalPath: timelineData.criticalPath || [],
        bufferTime: timelineData.bufferTime || 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTimelines(prev => prev.map(t => t.id === timelineId ? updatedTimeline : t));
      return updatedTimeline;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project timeline');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProjectTimeline = useCallback(async (projectId: string, timelineId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      setTimelines(prev => prev.filter(t => t.id !== timelineId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project timeline');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    timelines,
    loading,
    error,
    getProjectTimeline,
    createProjectTimeline,
    updateProjectTimeline,
    deleteProjectTimeline
  };
};