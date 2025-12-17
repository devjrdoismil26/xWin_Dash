import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboardService';
import { DashboardMetrics, DashboardStats, RecentActivity, TopLead, RecentProject, DashboardData, UseDashboardMetricsReturn } from '../types/dashboardTypes';

export const useDashboardMetrics = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      const result = await dashboardService.getMetrics();

      if (result.success) {
        setData(result.data);

      } else {
        throw new Error(result.error || 'Erro ao carregar métricas do dashboard');

      } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);

      console.error('Erro ao buscar métricas do dashboard:', err);

    } finally {
      setLoading(false);

    } , []);

  const fetchActivities = useCallback(async () => {
    try {
      const result = await dashboardService.getActivities();

      if (result.success && data) {
        setData(prev => prev ? {
          ...prev,
          recent_activities: result.data
        } : null);

      } catch (err) {
      console.error('Erro ao buscar atividades:', err);

    } , [data]);

  const fetchOverview = useCallback(async () => {
    try {
      const result = await dashboardService.getOverview();

      if (result.success && data) {
        setData(prev => prev ? {
          ...prev,
          metrics: {
            ...prev.metrics,
            ...result.data
          } : null);

      } catch (err) {
      console.error('Erro ao buscar overview:', err);

    } , [data]);

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchMetrics(),
      fetchActivities(),
      fetchOverview()
    ]);

  }, [fetchMetrics, fetchActivities, fetchOverview]);

  const getGrowthPercentage = useCallback((current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  }, []);

  const getConversionRate = useCallback((converted: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((converted / total) * 100 * 10) / 10;
  }, []);

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  }, []);

  const formatNumber = useCallback((value: number): string => {
    return new Intl.NumberFormat('pt-BR').format(value);

  }, []);

  const formatPercentage = useCallback((value: number): string => {
    return `${value >= 0 ? '+' : ''}${value}%`;
  }, []);

  const getMetricTrend = useCallback((current: number, previous: number): 'up' | 'down' | 'stable' => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }, []);

  const getMetricColor = useCallback((trend: 'up' | 'down' | 'stable', isPositive: boolean = true): string => {
    if (trend === 'up') return isPositive ? 'text-green-600' : 'text-red-600';
    if (trend === 'down') return isPositive ? 'text-red-600' : 'text-green-600';
    return 'text-gray-600';
  }, []);

  const getMetricIcon = useCallback((trend: 'up' | 'down' | 'stable'): string => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  }, []);

  const calculateKPIs = useCallback(() => {
    if (!data) return null;

    const { metrics } = data;
    
    return {
      leadsGrowth: getGrowthPercentage(metrics.leads_growth, 0),
      usersGrowth: getGrowthPercentage(metrics.users_growth, 0),
      conversionRate: metrics.conversion_rate,
      activeProjectsRate: metrics.total_projects > 0 
        ? Math.round((metrics.active_projects / metrics.total_projects) * 100 * 10) / 10 
        : 0,
      revenuePerLead: metrics.total_revenue && metrics.total_leads > 0
        ? Math.round((metrics.total_revenue / metrics.total_leads) * 100) / 100
        : 0,};

  }, [data, getGrowthPercentage]);

  const getTopPerformers = useCallback(() => {
    if (!data) return { topLeads: [], topProjects: []};

    return {
      topLeads: (data as any).top_leads.slice(0, 5),
      topProjects: (data as any).recent_projects.slice(0, 5),};

  }, [data]);

  const getActivitySummary = useCallback(() => {
    if (!data) return null;

    const activities = (data as any).recent_activities;
    const now = new Date();

    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recent24h = activities.filter(activity => 
      new Date(activity.timestamp) > last24h
    ).length;

    const recent7d = activities.filter(activity => 
      new Date(activity.timestamp) > last7d
    ).length;

    return {
      last24h,
      last7d,
      total: activities.length,};

  }, [data]);

  useEffect(() => {
    fetchMetrics();

  }, [fetchMetrics]);

  return {
    data,
    loading,
    error,
    fetchMetrics,
    fetchActivities,
    fetchOverview,
    refreshData,
    getGrowthPercentage,
    getConversionRate,
    formatCurrency,
    formatNumber,
    formatPercentage,
    getMetricTrend,
    getMetricColor,
    getMetricIcon,
    calculateKPIs,
    getTopPerformers,
    getActivitySummary,};
};

export default useDashboardMetrics;
