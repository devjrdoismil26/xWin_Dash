// ========================================
// HOOK DE GESTÃO DE ORÇAMENTOS DE PROJETO
// ========================================
import { useState, useCallback } from 'react';
import { ProjectBudget } from '../../types/projectsAdvancedTypes';

export const useProjectBudgets = () => {
  const [budgets, setBudgets] = useState<ProjectBudget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProjectBudgets = useCallback(async (projectId: string): Promise<ProjectBudget[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock implementation
      const mockBudgets: ProjectBudget[] = [
        {
          id: '1',
          projectId,
          name: 'Main Budget',
          description: 'Primary project budget',
          totalAmount: 100000,
          allocatedAmount: 75000,
          spentAmount: 45000,
          remainingAmount: 30000,
          currency: 'USD',
          categories: [
            {
              id: '1',
              name: 'Development',
              allocatedAmount: 50000,
              spentAmount: 30000,
              remainingAmount: 20000
            },
            {
              id: '2',
              name: 'Marketing',
              allocatedAmount: 25000,
              spentAmount: 15000,
              remainingAmount: 10000
            }
          ],
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setBudgets(prev => {
        const existing = prev.filter(b => b.projectId === projectId);
        if (existing.length === 0) {
          return [...prev, ...mockBudgets];
        }
        return prev;
      });
      
      return mockBudgets;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project budgets');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProjectBudget = useCallback(async (projectId: string, budgetData: Partial<ProjectBudget>): Promise<ProjectBudget | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newBudget: ProjectBudget = {
        id: Date.now().toString(),
        projectId,
        name: budgetData.name || 'New Budget',
        description: budgetData.description || '',
        totalAmount: budgetData.totalAmount || 0,
        allocatedAmount: budgetData.allocatedAmount || 0,
        spentAmount: budgetData.spentAmount || 0,
        remainingAmount: budgetData.remainingAmount || 0,
        currency: budgetData.currency || 'USD',
        categories: budgetData.categories || [],
        status: budgetData.status || 'active',
        startDate: budgetData.startDate || new Date().toISOString(),
        endDate: budgetData.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setBudgets(prev => [...prev, newBudget]);
      return newBudget;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project budget');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectBudget = useCallback(async (projectId: string, budgetId: string, budgetData: Partial<ProjectBudget>): Promise<ProjectBudget | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedBudget: ProjectBudget = {
        id: budgetId,
        projectId,
        name: budgetData.name || 'Updated Budget',
        description: budgetData.description || '',
        totalAmount: budgetData.totalAmount || 0,
        allocatedAmount: budgetData.allocatedAmount || 0,
        spentAmount: budgetData.spentAmount || 0,
        remainingAmount: budgetData.remainingAmount || 0,
        currency: budgetData.currency || 'USD',
        categories: budgetData.categories || [],
        status: budgetData.status || 'active',
        startDate: budgetData.startDate || new Date().toISOString(),
        endDate: budgetData.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setBudgets(prev => prev.map(b => b.id === budgetId ? updatedBudget : b));
      return updatedBudget;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project budget');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProjectBudget = useCallback(async (projectId: string, budgetId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      setBudgets(prev => prev.filter(b => b.id !== budgetId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project budget');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    budgets,
    loading,
    error,
    getProjectBudgets,
    createProjectBudget,
    updateProjectBudget,
    deleteProjectBudget
  };
};