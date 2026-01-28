/**
 * Hook orquestrador do módulo Analytics
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useAnalyticsStore } from './useAnalyticsStore';
import { useAnalyticsDashboard } from './useAnalyticsDashboard';
import { useAnalyticsReports } from './useAnalyticsReports';
import { useAnalyticsFilters } from './useAnalyticsFilters';
import { useAnalyticsRealTime } from './useAnalyticsRealTime';
import { AnalyticsFilters, AnalyticsReport } from '../types';

interface UseAnalyticsReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  
  // Dados principais
  dashboardData: any | null;
  reports: AnalyticsReport[];
  filters: AnalyticsFilters;
  
  // Ações principais
  loadDashboard: (filters?: AnalyticsFilters) => Promise<void>;
  createReport: (data: any) => Promise<AnalyticsReport>;
  updateReport: (id: string, data: any) => Promise<AnalyticsReport>;
  deleteReport: (id: string) => Promise<void>;
  
  // Hooks especializados
  dashboard: ReturnType<typeof useAnalyticsDashboard>;
  reports: ReturnType<typeof useAnalyticsReports>;
  filters: ReturnType<typeof useAnalyticsFilters>;
  realTime: ReturnType<typeof useAnalyticsRealTime>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();
  const store = useAnalyticsStore();
  const dashboard = useAnalyticsDashboard();
  const reports = useAnalyticsReports();
  const filters = useAnalyticsFilters();
  const realTime = useAnalyticsRealTime();
  
  // Lógica de orquestração
  const loadDashboard = useCallback(async (filters?: AnalyticsFilters) => {
    try {
      await dashboard.loadDashboardData(filters);
      showSuccess('Dashboard carregado com sucesso!');
    } catch (error: any) {
      showError('Erro ao carregar dashboard', error.message);
    }
  }, [dashboard, showSuccess, showError]);
  
  const createReport = useCallback(async (data: any) => {
    try {
      const result = await reports.createReport(data);
      showSuccess('Relatório criado com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao criar relatório', error.message);
      throw error;
    }
  }, [reports, showSuccess, showError]);
  
  const updateReport = useCallback(async (id: string, data: any) => {
    try {
      const result = await reports.editReport(id, data);
      showSuccess('Relatório atualizado com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao atualizar relatório', error.message);
      throw error;
    }
  }, [reports, showSuccess, showError]);
  
  const deleteReport = useCallback(async (id: string) => {
    try {
      await reports.removeReport(id);
      showSuccess('Relatório excluído com sucesso!');
    } catch (error: any) {
      showError('Erro ao excluir relatório', error.message);
      throw error;
    }
  }, [reports, showSuccess, showError]);
  
  // Inicialização
  useEffect(() => {
    loadDashboard();
    reports.loadReports();
  }, []);
  
  return {
    loading: store.loading || dashboard.loading || reports.loading || filters.loading || realTime.loading,
    error: store.error || dashboard.error || reports.error || filters.error || realTime.error,
    dashboardData: store.dashboardData,
    reports: store.reports,
    filters: store.filters,
    loadDashboard,
    createReport,
    updateReport,
    deleteReport,
    dashboard,
    reports,
    filters,
    realTime,
    clearError: () => {
      store.setError(null);
      dashboard.clearError();
      reports.clearError();
      filters.clearError();
      realTime.clearError();
    },
    refresh: loadDashboard
  };
};