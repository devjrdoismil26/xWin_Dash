/**
 * Hook especializado para dashboard do módulo Analytics
 * Máximo: 200 linhas
 */
import { useCallback, useState, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { AnalyticsService } from '../services/analyticsService';
import { AnalyticsDashboardData, AnalyticsFilters } from '../types';

interface UseAnalyticsDashboardReturn {
  // Estado
  dashboardData: AnalyticsDashboardData | null;
  currentDashboard: AnalyticsDashboardData | null;
  loading: boolean;
  error: string | null;
  
  // Ações
  loadDashboardData: (filters?: AnalyticsFilters) => Promise<void>;
  createDashboard: (data: Partial<AnalyticsDashboardData>) => Promise<AnalyticsDashboardData>;
  updateDashboard: (id: string, data: Partial<AnalyticsDashboardData>) => Promise<AnalyticsDashboardData>;
  deleteDashboard: (id: string) => Promise<void>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useAnalyticsDashboard = (): UseAnalyticsDashboardReturn => {
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardData | null>(null);
  const [currentDashboard, setCurrentDashboard] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAdvancedNotifications();
  
  const loadDashboardData = useCallback(async (filters?: AnalyticsFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AnalyticsService.getDashboardData(filters);
      setDashboardData(result.data || null);
      showSuccess('Dashboard carregado com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar dashboard';
      setError(errorMessage);
      showError('Erro ao carregar dashboard', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const createDashboard = useCallback(async (data: Partial<AnalyticsDashboardData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AnalyticsService.createDashboard(data);
      setDashboardData(prev => prev ? { ...prev, ...result.data } : result.data);
      showSuccess('Dashboard criado com sucesso!');
      return result.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar dashboard';
      setError(errorMessage);
      showError('Erro ao criar dashboard', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const updateDashboard = useCallback(async (id: string, data: Partial<AnalyticsDashboardData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AnalyticsService.updateDashboard(id, data);
      setDashboardData(prev => prev ? { ...prev, ...result.data } : result.data);
      showSuccess('Dashboard atualizado com sucesso!');
      return result.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar dashboard';
      setError(errorMessage);
      showError('Erro ao atualizar dashboard', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const deleteDashboard = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await AnalyticsService.deleteDashboard(id);
      setDashboardData(null);
      setCurrentDashboard(null);
      showSuccess('Dashboard excluído com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir dashboard';
      setError(errorMessage);
      showError('Erro ao excluir dashboard', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  return {
    dashboardData,
    currentDashboard,
    loading,
    error,
    loadDashboardData,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    clearError: () => setError(null),
    refresh: loadDashboardData
  };
};