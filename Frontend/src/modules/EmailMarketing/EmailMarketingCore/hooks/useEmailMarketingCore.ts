/**
 * Hook principal para o módulo EmailMarketingCore
 * Gerencia métricas, dashboard e funcionalidades básicas
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { EmailMarketingMetrics, EmailMarketingStats, EmailMarketingDashboard, EmailMarketingFilters, UseEmailMarketingCoreReturn } from '../types';

export const useEmailMarketingCore = (): UseEmailMarketingCoreReturn => {
  // Estado principal
  const [metrics, setMetrics] = useState<EmailMarketingMetrics | null>(null);

  const [stats, setStats] = useState<EmailMarketingStats | null>(null);

  const [dashboard, setDashboard] = useState<EmailMarketingDashboard | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Função para buscar métricas
  const fetchMetrics = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const result = await apiClient.get<{ success: boolean; data?: EmailMarketingMetrics; error?: string }>('/api/v1/email-marketing/metrics');

      if (result.success && result.data) {
        setMetrics(result.data);

      } else {
        throw new Error(result.error || 'Failed to fetch metrics');

      } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error fetching email marketing metrics:', err);

    } finally {
      setLoading(false);

    } , []);

  // Função para buscar estatísticas
  const fetchStats = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const result = await apiClient.get<{ success: boolean; data?: EmailMarketingStats; error?: string }>('/api/v1/email-marketing/stats');

      if (result.success && result.data) {
        setStats(result.data);

      } else {
        throw new Error(result.error || 'Failed to fetch stats');

      } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error fetching email marketing stats:', err);

    } finally {
      setLoading(false);

    } , []);

  // Função para buscar dados do dashboard
  const fetchDashboard = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const result = await apiClient.get<{ success: boolean; data?: EmailMarketingDashboard; error?: string }>('/api/v1/email-marketing/dashboard');

      if (result.success && result.data) {
        setDashboard(result.data);

      } else {
        throw new Error(result.error || 'Failed to fetch dashboard data');

      } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error fetching email marketing dashboard:', err);

    } finally {
      setLoading(false);

    } , []);

  // Função para atualizar todos os dados
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchMetrics(),
      fetchStats(),
      fetchDashboard()
    ]);

  }, [fetchMetrics, fetchStats, fetchDashboard]);

  // Função para obter resumo das métricas
  const getMetricsSummary = useCallback(() => {
    if (!metrics) return null;

    return {
      total_campaigns: metrics.total_campaigns,
      active_campaigns: metrics.active_campaigns,
      total_subscribers: metrics.total_subscribers,
      open_rate: metrics.open_rate,
      click_rate: metrics.click_rate,
      conversion_rate: metrics.conversion_rate,
      revenue_generated: metrics.revenue_generated};

  }, [metrics]);

  // Função para obter métricas de performance
  const getPerformanceMetrics = useCallback(() => {
    if (!metrics) return null;

    return {
      engagement: {
        open_rate: metrics.open_rate,
        click_rate: metrics.click_rate,
        conversion_rate: metrics.conversion_rate
      },
      deliverability: {
        bounce_rate: metrics.bounce_rate,
        unsubscribe_rate: metrics.unsubscribe_rate
      },
      volume: {
        campaigns_sent: metrics.campaigns_sent,
        emails_delivered: metrics.emails_delivered
      },
      revenue: {
        total: metrics.revenue_generated,
        per_campaign: metrics.campaigns_sent > 0 
          ? metrics.revenue_generated / metrics.campaigns_sent 
          : 0
      } ;

  }, [metrics]);

  // Função para obter análise de tendências
  const getTrendAnalysis = useCallback(() => {
    if (!stats) return null;

    return {
      campaigns_trend: stats.campaigns_by_status,
      monthly_performance: stats.monthly_campaigns,
      template_usage: stats.templates_by_category,
      segment_distribution: stats.segments_by_type,
      subscriber_growth: stats.subscribers_by_source,
      revenue_trend: stats.revenue_by_month};

  }, [stats]);

  // Função para formatar métricas
  const formatMetrics = useCallback((metricsData: EmailMarketingMetrics) => {
    return {
      total_campaigns: new Intl.NumberFormat('pt-BR').format(metricsData.total_campaigns),
      active_campaigns: new Intl.NumberFormat('pt-BR').format(metricsData.active_campaigns),
      total_subscribers: new Intl.NumberFormat('pt-BR').format(metricsData.total_subscribers),
      open_rate: `${metricsData.open_rate.toFixed(1)}%`,
      click_rate: `${metricsData.click_rate.toFixed(1)}%`,
      conversion_rate: `${metricsData.conversion_rate.toFixed(1)}%`,
      revenue_generated: new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(metricsData.revenue_generated)};

  }, []);

  // Função para calcular crescimento
  const calculateGrowth = useCallback((current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }, []);

  // Função para determinar tendência
  const getMetricTrend = useCallback((current: number, previous: number): 'up' | 'down' | 'stable' => {
    const growth = calculateGrowth(current, previous);

    if (growth > 1) return 'up';
    if (growth < -1) return 'down';
    return 'stable';
  }, [calculateGrowth]);

  // Carregar dados iniciais
  useEffect(() => {
    refreshData();

  }, [refreshData]);

  return {
    metrics,
    stats,
    dashboard,
    loading,
    error,
    fetchMetrics,
    fetchStats,
    fetchDashboard,
    refreshData,
    getMetricsSummary,
    getPerformanceMetrics,
    getTrendAnalysis,
    formatMetrics,
    calculateGrowth,
    getMetricTrend};
};
