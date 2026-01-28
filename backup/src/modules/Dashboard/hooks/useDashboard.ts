/**
 * Hook principal do Dashboard
 * Interface simplificada que expõe funcionalidades essenciais
 */

import { useCallback } from 'react';
import { useDashboardCore } from './useDashboardCore';

export const useDashboard = () => {
  const core = useDashboardCore();
  const { metrics, widgets, advanced } = core;

  // Funções de conveniência
  const getDashboardSummary = useCallback(() => {
    if (!metrics.data) return null;

    const kpis = metrics.calculateKPIs();
    const topPerformers = metrics.getTopPerformers();
    const activitySummary = metrics.getActivitySummary();

    return {
      metrics: metrics.data.metrics,
      kpis,
      topPerformers,
      activitySummary,
      lastRefresh: core.lastRefresh,
      totalWidgets: widgets.getVisibleWidgets().length,
      activeWidgets: widgets.getVisibleWidgets().filter(widget => 
        widgets.widgetData[widget.id] && Object.keys(widgets.widgetData[widget.id]).length > 0
      ).length,
    };
  }, [metrics, widgets, core.lastRefresh]);

  const getPerformanceMetrics = useCallback(() => {
    if (!metrics.data) return null;

    return {
      conversionRate: metrics.getConversionRate(
        metrics.data.metrics.total_leads,
        metrics.data.metrics.total_users
      ),
      growthRate: {
        leads: metrics.getGrowthPercentage(
          metrics.data.metrics.total_leads,
          metrics.data.metrics.leads_growth
        ),
        users: metrics.getGrowthPercentage(
          metrics.data.metrics.total_users,
          metrics.data.metrics.users_growth
        ),
        projects: metrics.getGrowthPercentage(
          metrics.data.metrics.total_projects,
          metrics.data.metrics.projects_growth
        ),
        revenue: metrics.getGrowthPercentage(
          metrics.data.metrics.total_revenue,
          metrics.data.metrics.revenue_growth
        ),
      },
      trends: {
        leads: metrics.getMetricTrend(
          metrics.data.metrics.total_leads,
          metrics.data.metrics.leads_growth
        ),
        users: metrics.getMetricTrend(
          metrics.data.metrics.total_users,
          metrics.data.metrics.users_growth
        ),
        projects: metrics.getMetricTrend(
          metrics.data.metrics.total_projects,
          metrics.data.metrics.projects_growth
        ),
        revenue: metrics.getMetricTrend(
          metrics.data.metrics.total_revenue,
          metrics.data.metrics.revenue_growth
        ),
      },
    };
  }, [metrics]);

  const getTrendAnalysis = useCallback(() => {
    if (!metrics.data) return null;

    const performanceMetrics = getPerformanceMetrics();
    if (!performanceMetrics) return null;

    return {
      overallTrend: performanceMetrics.growthRate.leads > 0 ? 'up' : 'down',
      topPerformer: Object.entries(performanceMetrics.growthRate)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'leads',
      bottomPerformer: Object.entries(performanceMetrics.growthRate)
        .sort(([,a], [,b]) => a - b)[0]?.[0] || 'revenue',
      averageGrowth: Object.values(performanceMetrics.growthRate)
        .reduce((sum, rate) => sum + rate, 0) / Object.keys(performanceMetrics.growthRate).length,
    };
  }, [metrics, getPerformanceMetrics]);

  const getAlerts = useCallback(() => {
    return advanced.alerts.filter(alert => !alert.is_read);
  }, [advanced.alerts]);

  const getQuickActions = useCallback(() => {
    return [
      {
        id: 'refresh',
        label: 'Atualizar Dashboard',
        action: core.refreshDashboard,
        icon: 'RefreshCw',
      },
      {
        id: 'export',
        label: 'Exportar Dados',
        action: core.exportDashboard,
        icon: 'Download',
      },
      {
        id: 'settings',
        label: 'Configurações',
        action: () => core.setCurrentView('settings'),
        icon: 'Settings',
      },
      {
        id: 'add-widget',
        label: 'Adicionar Widget',
        action: () => widgets.addWidget({
          type: 'metric',
          title: 'Novo Widget',
          position: { x: 0, y: 0, w: 4, h: 2 },
          visible: true,
          settings: {},
        }),
        icon: 'Plus',
      },
    ];
  }, [core, widgets]);

  return {
    // Estado principal
    loading: core.loading || metrics.loading || widgets.loading || advanced.loading,
    error: core.error || metrics.error || widgets.error || advanced.error,
    currentView: core.currentView,
    
    // Dados principais
    data: metrics.data,
    layout: widgets.layout,
    widgetData: widgets.widgetData,
    alerts: advanced.alerts,
    universeData: advanced.universeData,
    
    // Hooks especializados
    core,
    metrics,
    widgets,
    advanced,
    
    // Funções de conveniência
    getDashboardSummary,
    getPerformanceMetrics,
    getTrendAnalysis,
    getAlerts,
    getQuickActions,
    
    // Ações principais
    updateFilters: core.updateFilters,
    updateSettings: core.updateSettings,
    refreshDashboard: core.refreshDashboard,
    exportDashboard: core.exportDashboard,
    
    // Ações de widgets
    updateWidgetConfig: widgets.updateWidgetConfig,
    updateWidgetPosition: widgets.updateWidgetPosition,
    toggleWidgetVisibility: widgets.toggleWidgetVisibility,
    addWidget: widgets.addWidget,
    removeWidget: widgets.removeWidget,
    resetLayout: widgets.resetLayout,
    saveLayout: widgets.saveLayout,
    loadLayout: widgets.loadLayout,
    getWidgetById: widgets.getWidgetById,
    getVisibleWidgets: widgets.getVisibleWidgets,
    getWidgetData: widgets.getWidgetData,
    refreshWidget: widgets.refreshWidget,
    refreshAllWidgets: widgets.refreshAllWidgets,
    
    // Ações de layout
    fetchLayouts: advanced.fetchLayouts,
    getLayoutById: advanced.getLayoutById,
    createLayout: advanced.createLayout,
    updateLayout: advanced.updateLayout,
    deleteLayout: advanced.deleteLayout,
    setDefaultLayout: advanced.setDefaultLayout,
    
    // Ações de alertas
    fetchAlerts: advanced.fetchAlerts,
    markAlertAsRead: advanced.markAlertAsRead,
    markAllAlertsAsRead: advanced.markAllAlertsAsRead,
    
    // Ações do universo
    fetchUniverseData: advanced.fetchUniverseData,
    
    // Ações de compartilhamento
    shareDashboard: advanced.shareDashboard,
    getSharedDashboard: advanced.getSharedDashboard,
    subscribeToDashboard: advanced.subscribeToDashboard,
    unsubscribeFromDashboard: advanced.unsubscribeFromDashboard,
  };
};
