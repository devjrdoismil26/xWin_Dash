/**
 * Hook principal do módulo AuraCore - Orquestrador
 * Coordena todos os hooks especializados do AuraCore
 */
import { useCallback, useEffect } from 'react';
import { useAuraStore } from './useAuraStore';
import { AuraStats, AuraModule, AuraQuickAction, AuraNotification } from '../types';

export const useAuraCore = () => {
  // Store principal
  const {
    stats,
    modules,
    quick_actions,
    notifications,
    dashboardData,
    loading,
    error,
    currentView,
    fetchStats,
    fetchModules,
    fetchQuickActions,
    fetchNotifications,
    fetchDashboardData,
    refreshDashboard,
    executeQuickAction,
    markNotificationAsRead,
    clearNotifications,
    updateConfig,
    applyFilters,
    clearFilters,
    setCurrentView,
    setError,
    setLoading
  } = useAuraStore();

  // Inicialização
  useEffect(() => {
    // Carregar dados iniciais
    fetchStats();
    fetchModules();
    fetchQuickActions();
    fetchNotifications();
    fetchDashboardData();
  }, []);

  // Funções de conveniência
  const getStatsSummary = useCallback(() => {
    if (!stats) return null;
    
    return {
      total_connections: stats.total_connections,
      active_flows: stats.active_flows,
      messages_sent: stats.messages_sent,
      response_time: stats.response_time,
      uptime: stats.uptime
    };
  }, [stats]);

  const getModulesByStatus = useCallback((status: string) => {
    return modules.filter(module => module.status === status);
  }, [modules]);

  const getActiveModules = useCallback(() => {
    return modules.filter(module => module.status === 'active');
  }, [modules]);

  const getQuickActionsByType = useCallback((type: string) => {
    return quick_actions.filter(action => action.type === type);
  }, [quick_actions]);

  const getEnabledQuickActions = useCallback(() => {
    return quick_actions.filter(action => action.enabled);
  }, [quick_actions]);

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  const getNotificationsByType = useCallback((type: string) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  const getDashboardStatus = useCallback(() => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!dashboardData) return 'empty';
    return 'success';
  }, [loading, error, dashboardData]);

  const hasData = useCallback(() => {
    return dashboardData && (
      stats !== null ||
      modules.length > 0 ||
      quick_actions.length > 0 ||
      notifications.length > 0
    );
  }, [dashboardData, stats, modules, quick_actions, notifications]);

  const getSystemHealth = useCallback(() => {
    if (!stats) return 'unknown';
    
    const { uptime, response_time } = stats;
    
    if (uptime < 95 || response_time > 5000) return 'critical';
    if (uptime < 99 || response_time > 2000) return 'warning';
    return 'healthy';
  }, [stats]);

  const getPerformanceScore = useCallback(() => {
    if (!stats) return 0;
    
    const { uptime, response_time } = stats;
    const uptimeScore = Math.min(uptime, 100);
    const responseTimeScore = Math.max(0, 100 - (response_time / 100));
    
    return Math.round((uptimeScore + responseTimeScore) / 2);
  }, [stats]);

  const getTrendData = useCallback(() => {
    if (!stats?.metrics) return [];
    
    return stats.metrics.map(metric => ({
      name: metric.name,
      value: metric.value,
      change: metric.change_percentage || 0,
      trend: metric.trend
    }));
  }, [stats]);

  const getTopModules = useCallback((limit: number = 5) => {
    return modules
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [modules]);

  const getRecentActivity = useCallback(() => {
    const activities = [];
    
    // Adicionar atividades dos módulos
    modules.forEach(module => {
      if (module.last_activity) {
        activities.push({
          type: 'module',
          id: module.id,
          title: module.title,
          description: `Módulo ${module.title} ativo`,
          timestamp: module.last_activity,
          status: module.status
        });
      }
    });
    
    // Adicionar notificações recentes
    notifications.slice(0, 5).forEach(notification => {
      activities.push({
        type: 'notification',
        id: notification.id,
        title: notification.title,
        description: notification.message,
        timestamp: notification.timestamp,
        status: notification.type
      });
    });
    
    // Ordenar por timestamp
    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [modules, notifications]);

  const exportDashboardData = useCallback(async (format: string = 'json') => {
    if (!dashboardData) return;
    
    try {
      const dataStr = JSON.stringify(dashboardData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aura-dashboard-${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Erro ao exportar dados do dashboard');
    }
  }, [dashboardData, setError]);

  const refreshAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchStats(),
        fetchModules(),
        fetchQuickActions(),
        fetchNotifications(),
        fetchDashboardData()
      ]);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar dados');
    } finally {
      setLoading(false);
    }
  }, [
    fetchStats,
    fetchModules,
    fetchQuickActions,
    fetchNotifications,
    fetchDashboardData,
    setLoading,
    setError
  ]);

  return {
    // Estado principal
    loading,
    error,
    currentView,
    
    // Dados
    stats,
    modules,
    quick_actions,
    notifications,
    dashboardData,
    
    // Ações
    fetchStats,
    fetchModules,
    fetchQuickActions,
    fetchNotifications,
    fetchDashboardData,
    refreshDashboard,
    executeQuickAction,
    markNotificationAsRead,
    clearNotifications,
    updateConfig,
    applyFilters,
    clearFilters,
    setCurrentView,
    setError,
    setLoading,
    
    // Funções de conveniência
    getStatsSummary,
    getModulesByStatus,
    getActiveModules,
    getQuickActionsByType,
    getEnabledQuickActions,
    getUnreadNotifications,
    getNotificationsByType,
    getDashboardStatus,
    hasData,
    getSystemHealth,
    getPerformanceScore,
    getTrendData,
    getTopModules,
    getRecentActivity,
    exportDashboardData,
    refreshAllData
  };
};
