// ========================================
// HOOK DE ANALYTICS DE PROJETO
// ========================================
import { useState, useCallback } from 'react';
import { ProjectAnalytics } from '../../types/projectsAdvancedTypes';

export const useProjectAnalytics = () => {
  const [analytics, setAnalytics] = useState<ProjectAnalytics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProjectAnalytics = useCallback(async (projectId: string): Promise<ProjectAnalytics[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock implementation
      const mockAnalytics: ProjectAnalytics[] = [
        {
          id: '1',
          projectId,
          type: 'performance',
          metrics: {
            progress: 75,
            velocity: 8.5,
            burndown: 65,
            quality: 92
          },
          trends: {
            progress: 'increasing',
            velocity: 'stable',
            burndown: 'decreasing',
            quality: 'stable'
          },
          insights: [
            'Project is on track for completion',
            'Velocity is consistent',
            'Quality metrics are above target'
          ],
          recommendations: [
            'Continue current pace',
            'Monitor quality metrics',
            'Prepare for final sprint'
          ],
          generatedAt: new Date().toISOString(),
          period: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setAnalytics(prev => {
        const existing = prev.filter(a => a.projectId === projectId);
        if (existing.length === 0) {
          return [...prev, ...mockAnalytics];
        }
        return prev;
      });
      
      return mockAnalytics;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project analytics');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const generateProjectAnalytics = useCallback(async (projectId: string, type: string, period: { start: string; end: string }): Promise<ProjectAnalytics | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newAnalytics: ProjectAnalytics = {
        id: Date.now().toString(),
        projectId,
        type,
        metrics: {
          progress: Math.floor(Math.random() * 100),
          velocity: Math.random() * 10,
          burndown: Math.floor(Math.random() * 100),
          quality: Math.floor(Math.random() * 100)
        },
        trends: {
          progress: 'increasing',
          velocity: 'stable',
          burndown: 'decreasing',
          quality: 'stable'
        },
        insights: [
          'Generated analytics insights',
          'Performance metrics calculated',
          'Trends analyzed'
        ],
        recommendations: [
          'Review performance metrics',
          'Adjust project timeline if needed',
          'Monitor quality indicators'
        ],
        generatedAt: new Date().toISOString(),
        period,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setAnalytics(prev => [...prev, newAnalytics]);
      return newAnalytics;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate project analytics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectAnalytics = useCallback(async (projectId: string, analyticsId: string, analyticsData: Partial<ProjectAnalytics>): Promise<ProjectAnalytics | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedAnalytics: ProjectAnalytics = {
        id: analyticsId,
        projectId,
        type: analyticsData.type || 'performance',
        metrics: analyticsData.metrics || {
          progress: 0,
          velocity: 0,
          burndown: 0,
          quality: 0
        },
        trends: analyticsData.trends || {
          progress: 'stable',
          velocity: 'stable',
          burndown: 'stable',
          quality: 'stable'
        },
        insights: analyticsData.insights || [],
        recommendations: analyticsData.recommendations || [],
        generatedAt: new Date().toISOString(),
        period: analyticsData.period || {
          start: new Date().toISOString(),
          end: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setAnalytics(prev => prev.map(a => a.id === analyticsId ? updatedAnalytics : a));
      return updatedAnalytics;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project analytics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProjectAnalytics = useCallback(async (projectId: string, analyticsId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      setAnalytics(prev => prev.filter(a => a.id !== analyticsId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project analytics');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analytics,
    loading,
    error,
    getProjectAnalytics,
    generateProjectAnalytics,
    updateProjectAnalytics,
    deleteProjectAnalytics
  };
};