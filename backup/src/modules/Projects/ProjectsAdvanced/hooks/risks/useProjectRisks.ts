// ========================================
// HOOK DE GESTÃO DE RISCOS DE PROJETO
// ========================================
import { useState, useCallback } from 'react';
import { ProjectRisk } from '../../types/projectsAdvancedTypes';

export const useProjectRisks = () => {
  const [risks, setRisks] = useState<ProjectRisk[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProjectRisks = useCallback(async (projectId: string): Promise<ProjectRisk[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock implementation
      const mockRisks: ProjectRisk[] = [
        {
          id: '1',
          projectId,
          title: 'Technical Complexity Risk',
          description: 'Risk of technical complexity exceeding estimates',
          category: 'technical',
          probability: 'medium',
          impact: 'high',
          severity: 'high',
          status: 'open',
          mitigation: 'Regular technical reviews and expert consultation',
          contingency: 'Additional development time buffer',
          owner: 'user1',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setRisks(prev => {
        const existing = prev.filter(r => r.projectId === projectId);
        if (existing.length === 0) {
          return [...prev, ...mockRisks];
        }
        return prev;
      });
      
      return mockRisks;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project risks');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProjectRisk = useCallback(async (projectId: string, riskData: Partial<ProjectRisk>): Promise<ProjectRisk | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newRisk: ProjectRisk = {
        id: Date.now().toString(),
        projectId,
        title: riskData.title || 'New Risk',
        description: riskData.description || '',
        category: riskData.category || 'general',
        probability: riskData.probability || 'low',
        impact: riskData.impact || 'low',
        severity: riskData.severity || 'low',
        status: riskData.status || 'open',
        mitigation: riskData.mitigation || '',
        contingency: riskData.contingency || '',
        owner: riskData.owner || 'current_user',
        dueDate: riskData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setRisks(prev => [...prev, newRisk]);
      return newRisk;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project risk');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectRisk = useCallback(async (projectId: string, riskId: string, riskData: Partial<ProjectRisk>): Promise<ProjectRisk | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedRisk: ProjectRisk = {
        id: riskId,
        projectId,
        title: riskData.title || 'Updated Risk',
        description: riskData.description || '',
        category: riskData.category || 'general',
        probability: riskData.probability || 'low',
        impact: riskData.impact || 'low',
        severity: riskData.severity || 'low',
        status: riskData.status || 'open',
        mitigation: riskData.mitigation || '',
        contingency: riskData.contingency || '',
        owner: riskData.owner || 'current_user',
        dueDate: riskData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setRisks(prev => prev.map(r => r.id === riskId ? updatedRisk : r));
      return updatedRisk;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project risk');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProjectRisk = useCallback(async (projectId: string, riskId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      setRisks(prev => prev.filter(r => r.id !== riskId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project risk');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    risks,
    loading,
    error,
    getProjectRisks,
    createProjectRisk,
    updateProjectRisk,
    deleteProjectRisk
  };
};