/**
 * Hook principal do módulo Analytics - Orquestrador
 * @module modules/Analytics/hooks/useAnalytics
 * @description
 * Hook orquestrador que coordena todos os hooks especializados do módulo Analytics,
 * fornecendo interface unificada para operações de dashboard, filtros, tempo real e relatórios.
 * @since 1.0.0
 */

import { useCallback, useEffect } from 'react';
import { useAnalyticsDashboard } from './useAnalyticsDashboard';
import { useAnalyticsFilters } from './useAnalyticsFilters';
import { useAnalyticsRealTime } from './useAnalyticsRealTime';
import { useAnalyticsReports } from './useAnalyticsReports';
import { useAnalyticsStore } from './useAnalyticsStore';

/**
 * Hook useAnalytics - Hook Orquestrador do Módulo Analytics
 * @function
 * @description
 * Hook orquestrador que coordena todos os hooks especializados do módulo Analytics,
 * fornecendo interface unificada para operações de dashboard, filtros, tempo real e relatórios.
 *
 * @returns {object} Objeto com estado consolidado, hooks especializados e funções de conveniência
 *
 * @example
 * ```typescript
 * const {
 *   loading,
 *   dashboard,
 *   filters,
 *   realTime,
 *   reports,
 *   getMainMetrics,
 *   getInsightsByType,
 *   exportData
 * } = useAnalytics();

 * ```
 */
export const useAnalytics = () => {
  // Hooks especializados
  const dashboard = useAnalyticsDashboard();

  const filters = useAnalyticsFilters();

  const realTime = useAnalyticsRealTime();

  const reports = useAnalyticsReports();

  // Store principal
  const {
    currentView,
    setCurrentView,
    setError,
    setLoading
  } = useAnalyticsStore();

  // Inicialização
  useEffect(() => {
    // Carregar dados iniciais
    dashboard.loadDashboardData();

    reports.loadReports();

  }, []);

  // Funções de conveniência
  const getMainMetrics = useCallback(() => {
    return dashboard.getMainMetrics();

  }, [dashboard]);

  const getInsightsByType = useCallback((type: string) => {
    return dashboard.getInsightsByType(type);

  }, [dashboard]);

  const getChartsByType = useCallback((type: string) => {
    return dashboard.getChartsByType(type);

  }, [dashboard]);

  const getReportsByType = useCallback((type: string) => {
    return reports.getReportsByType(type);

  }, [reports]);

  const getPublicReports = useCallback(() => {
    return reports.getPublicReports();

  }, [reports]);

  const getUserReports = useCallback(() => {
    return reports.getUserReports();

  }, [reports]);

  const getRecentReports = useCallback((limit: number = 5) => {
    return reports.getRecentReports(limit);

  }, [reports]);

  const searchReports = useCallback((query: string) => {
    return reports.searchReports(query);

  }, [reports]);

  const getReportsStats = useCallback(() => {
    return reports.getReportsStats();

  }, [reports]);

  const getMetricsSummary = useCallback(() => {
    return dashboard.getMetricsSummary();

  }, [dashboard]);

  const getComparisonData = useCallback(() => {
    return dashboard.getComparisonData();

  }, [dashboard]);

  const hasData = useCallback(() => {
    return dashboard.hasData();

  }, [dashboard]);

  const getDashboardStatus = useCallback(() => {
    return dashboard.getDashboardStatus();

  }, [dashboard]);

  const exportDashboardData = useCallback(async (format: string = 'json') => {
    return dashboard.exportDashboardData(format);

  }, [dashboard]);

  // Funções não definidas (implementadas)
  const fetchDashboardData = useCallback(async () => {
    await dashboard.loadDashboardData();

  }, [dashboard]);

  const fetchModuleStats = useCallback(async () => {
    // Implementar se necessário
  }, []);

  const exportData = useCallback(async (format: string) => {
    try {
      await exportDashboardData(format);

    } catch (error) {
      console.error('Error exporting data:', error);

    } , [exportDashboardData]);

  const getMetricLabel = useCallback((metric: string) => {
    const labels: Record<string, string> = {
      'page_views': 'Visualizações de Página',
      'unique_visitors': 'Visitantes Únicos',
      'bounce_rate': 'Taxa de Rejeição',
      'avg_session_duration': 'Duração Média da Sessão',
      'conversion_rate': 'Taxa de Conversão',
      'revenue': 'Receita'};

    return labels[metric] || metric;
  }, []);

  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');

  }, []);

  const getTimeRangeLabel = useCallback((range: string) => {
    const labels: Record<string, string> = {
      'today': 'Hoje',
      'yesterday': 'Ontem',
      '7days': 'Últimos 7 dias',
      '30days': 'Últimos 30 dias',
      '90days': 'Últimos 90 dias'};

    return labels[range] || range;
  }, []);

  const getDeviceIcon = useCallback((device: string) => {
    // Implementar se necessário
    return null;
  }, []);

  const getDeviceLabel = useCallback((device: string) => {
    const labels: Record<string, string> = {
      'desktop': 'Monitor',
      'mobile': 'Mobile',
      'tablet': 'Tablet'};

    return labels[device] || device;
  }, []);

  const getTrafficSourceIcon = useCallback((source: string) => {
    // Implementar se necessário
    return null;
  }, []);

  const getTrafficSourceLabel = useCallback((source: string) => {
    const labels: Record<string, string> = {
      'google': 'Google',
      'facebook': 'Facebook',
      'direct': 'Direto',
      'referral': 'Referência'};

    return labels[source] || source;
  }, []);

  return {
    // Estado principal
    loading: dashboard.loading || filters.loading || realTime.loading || reports.loading,
    error: dashboard.error || filters.error || realTime.error || reports.error,
    currentView,
    
    // Hooks especializados
    dashboard,
    filters,
    realTime,
    reports,
    
    // Funções de conveniência
    getMainMetrics,
    getInsightsByType,
    getChartsByType,
    getReportsByType,
    getPublicReports,
    getUserReports,
    getRecentReports,
    searchReports,
    getReportsStats,
    getMetricsSummary,
    getComparisonData,
    hasData,
    getDashboardStatus,
    exportDashboardData,
    
    // Funções não definidas (implementadas)
    fetchDashboardData,
    fetchModuleStats,
    exportData,
    getMetricLabel,
    formatDate,
    getTimeRangeLabel,
    getDeviceIcon,
    getDeviceLabel,
    getTrafficSourceIcon,
    getTrafficSourceLabel,
    
    // Controle de estado
    setCurrentView,
    setError,
    setLoading};
};

export default useAnalytics;
