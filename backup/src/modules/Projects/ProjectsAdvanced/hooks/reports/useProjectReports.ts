// ========================================
// HOOK DE GESTÃO DE RELATÓRIOS DE PROJETO
// ========================================
import { useState, useCallback } from 'react';
import { ProjectReport } from '../../types/projectsAdvancedTypes';

export const useProjectReports = () => {
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProjectReports = useCallback(async (projectId: string): Promise<ProjectReport[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock implementation
      const mockReports: ProjectReport[] = [
        {
          id: '1',
          projectId,
          name: 'Weekly Status Report',
          type: 'status',
          description: 'Weekly project status update',
          template: 'weekly_status',
          data: {
            progress: 75,
            milestones: 3,
            risks: 2,
            budget: 45000
          },
          generatedBy: 'user1',
          generatedAt: new Date().toISOString(),
          status: 'completed',
          format: 'pdf',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setReports(prev => {
        const existing = prev.filter(r => r.projectId === projectId);
        if (existing.length === 0) {
          return [...prev, ...mockReports];
        }
        return prev;
      });
      
      return mockReports;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project reports');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProjectReport = useCallback(async (projectId: string, reportData: Partial<ProjectReport>): Promise<ProjectReport | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newReport: ProjectReport = {
        id: Date.now().toString(),
        projectId,
        name: reportData.name || 'New Report',
        type: reportData.type || 'status',
        description: reportData.description || '',
        template: reportData.template || 'default',
        data: reportData.data || {},
        generatedBy: 'current_user',
        generatedAt: new Date().toISOString(),
        status: reportData.status || 'pending',
        format: reportData.format || 'pdf',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setReports(prev => [...prev, newReport]);
      return newReport;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project report');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectReport = useCallback(async (projectId: string, reportId: string, reportData: Partial<ProjectReport>): Promise<ProjectReport | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedReport: ProjectReport = {
        id: reportId,
        projectId,
        name: reportData.name || 'Updated Report',
        type: reportData.type || 'status',
        description: reportData.description || '',
        template: reportData.template || 'default',
        data: reportData.data || {},
        generatedBy: 'current_user',
        generatedAt: new Date().toISOString(),
        status: reportData.status || 'pending',
        format: reportData.format || 'pdf',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));
      return updatedReport;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project report');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProjectReport = useCallback(async (projectId: string, reportId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      setReports(prev => prev.filter(r => r.id !== reportId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project report');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reports,
    loading,
    error,
    getProjectReports,
    createProjectReport,
    updateProjectReport,
    deleteProjectReport
  };
};