/**
 * Hook especializado para dashboard do Analytics
 * @module modules/Analytics/hooks/useAnalyticsDashboard
 * @description
 * Hook especializado para gerenciar dados do dashboard, métricas e insights,
 * incluindo carregamento, atualização, filtros e exportação de dados.
 * @since 1.0.0
 */

import { useCallback, useState, useEffect } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { useAnalyticsStore } from './useAnalyticsStore';
import { AnalyticsDashboardData, AnalyticsFilters } from '../types';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

/**
 * Hook useAnalyticsDashboard - Hook de Dashboard de Analytics
 * @function
 * @description
 * Hook especializado para gerenciar dados do dashboard de analytics, incluindo
 * carregamento, atualização, métricas principais, métricas de performance,
 * métricas de conversão, insights por tipo, gráficos e exportação de dados.
 *
 * @returns {object} Objeto com estado, dados do dashboard e ações
 *
 * @example
 * ```typescript
 * const {
 *   dashboardData,
 *   loading,
 *   getMainMetrics,
 *   getInsightsByType,
 *   exportDashboardData
 * } = useAnalyticsDashboard();

 * ```
 */
export const useAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const { showSuccess, showError } = useAdvancedNotifications();

  const {
    dashboardData,
    fetchDashboardData,
    refreshDashboard
  } = useAnalyticsStore();

  // Carregar dados do dashboard na inicialização
  useEffect(() => {
    if (!dashboardData) {
      loadDashboardData();

    } , []);

  // Carregar dados do dashboard
  const loadDashboardData = useCallback(async (filters?: AnalyticsFilters) => {
    setLoading(true);

    setError(null);

    try {
      await fetchDashboardData();

      setLastRefresh(new Date());

      showSuccess('Dashboard carregado com sucesso!');

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err) || 'Erro ao carregar dashboard';
      setError(errorMessage);

      showError('Erro ao carregar dashboard', errorMessage);

    } finally {
      setLoading(false);

    } , [fetchDashboardData, showSuccess, showError]);

  // Atualizar dashboard
  const updateDashboard = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      await refreshDashboard();

      setLastRefresh(new Date());

      showSuccess('Dashboard atualizado com sucesso!');

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err) || 'Erro ao atualizar dashboard';
      setError(errorMessage);

      showError('Erro ao atualizar dashboard', errorMessage);

    } finally {
      setLoading(false);

    } , [refreshDashboard, showSuccess, showError]);

  // Obter métricas principais
  const getMainMetrics = useCallback(() => {
    if (!dashboardData?.metrics) return [];
    
    const mainMetrics = [
      'page_views',
      'unique_visitors',
      'bounce_rate',
      'conversion_rate'
    ];
    
    return dashboardData.metrics.filter(metric => 
      mainMetrics.includes(metric.type));

  }, [dashboardData]);

  // Obter métricas de performance
  const getPerformanceMetrics = useCallback(() => {
    if (!dashboardData?.metrics) return [];
    
    const performanceMetrics = [
      'avg_session_duration',
      'page_per_session',
      'avg_time_on_page'
    ];
    
    return dashboardData.metrics.filter(metric => 
      performanceMetrics.includes(metric.type));

  }, [dashboardData]);

  // Obter métricas de conversão
  const getConversionMetrics = useCallback(() => {
    if (!dashboardData?.metrics) return [];
    
    const conversionMetrics = [
      'conversion_rate',
      'revenue'
    ];
    
    return dashboardData.metrics.filter(metric => 
      conversionMetrics.includes(metric.type));

  }, [dashboardData]);

  // Obter insights por tipo
  const getInsightsByType = useCallback((type: string) => {
    if (!dashboardData?.insights) return [];
    
    return dashboardData.insights.filter(insight => insight.type === type);

  }, [dashboardData]);

  // Obter insights de alta prioridade
  const getHighPriorityInsights = useCallback(() => {
    if (!dashboardData?.insights) return [];
    
    return dashboardData.insights.filter(insight => 
      insight.impact === 'high' && insight.confidence > 0.8);

  }, [dashboardData]);

  // Obter gráficos por tipo
  const getChartsByType = useCallback((type: string) => {
    if (!dashboardData?.charts) return [];
    
    return dashboardData.charts.filter(chart => chart.type === type);

  }, [dashboardData]);

  // Calcular resumo de métricas
  const getMetricsSummary = useCallback(() => {
    if (!dashboardData?.metrics) return null;
    
    const totalMetrics = dashboardData.metrics.length;
    const positiveTrends = dashboardData.metrics.filter(m => m.trend === 'up').length;
    const negativeTrends = dashboardData.metrics.filter(m => m.trend === 'down').length;
    const stableTrends = dashboardData.metrics.filter(m => m.trend === 'stable').length;
    
    return {
      total: totalMetrics,
      positive: positiveTrends,
      negative: negativeTrends,
      stable: stableTrends,
      positivePercentage: (positiveTrends / totalMetrics) * 100,
      negativePercentage: (negativeTrends / totalMetrics) * 100};

  }, [dashboardData]);

  // Obter dados de comparação
  const getComparisonData = useCallback(() => {
    if (!dashboardData?.metrics) return null;
    
    return dashboardData.metrics.map(metric => ({
      name: metric.name,
      current: metric.value,
      previous: metric.previous_value || 0,
      change: metric.change_percentage || 0,
      trend: metric.trend
    }));

  }, [dashboardData]);

  // Verificar se há dados
  const hasData = useCallback(() => {
    return dashboardData && (
      dashboardData.metrics.length > 0 ||
      dashboardData.charts.length > 0 ||
      dashboardData.insights.length > 0);

  }, [dashboardData]);

  // Obter status do dashboard
  const getDashboardStatus = useCallback(() => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!hasData()) return 'empty';
    return 'success';
  }, [loading, error, hasData]);

  // Exportar dados do dashboard
  const exportDashboardData = useCallback(async (format: string = 'json') => {
    if (!dashboardData) return;
    
    try {
      const dataStr = JSON.stringify(dashboardData, null, 2);

      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');

      link.href = url;
      link.download = `analytics-dashboard-${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();

      URL.revokeObjectURL(url);

      showSuccess('Dashboard exportado com sucesso!');

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err) || 'Erro ao exportar dashboard';
      setError(errorMessage);

      showError('Erro ao exportar dashboard', errorMessage);

    } , [dashboardData, showSuccess, showError]);

  return {
    // Estado
    dashboardData,
    loading,
    error,
    lastRefresh,
    
    // Ações
    loadDashboardData,
    updateDashboard,
    exportDashboardData,
    
    // Utilitários
    getMainMetrics,
    getPerformanceMetrics,
    getConversionMetrics,
    getInsightsByType,
    getHighPriorityInsights,
    getChartsByType,
    getMetricsSummary,
    getComparisonData,
    hasData,
    getDashboardStatus,
    
    // Controle de erro
    clearError: () => setError(null)};
};
