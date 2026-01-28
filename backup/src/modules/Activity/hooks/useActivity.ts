/**
 * Hook principal do módulo Activity
 * Orquestrador que coordena hooks especializados
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useActivityStore } from './useActivityStore';
import { useActivityLogs } from './useActivityLogs';
import { ActivityFilters, ActivityModuleStats } from '../types';

export const useActivity = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [stats, setStats] = useState<ActivityModuleStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [filters, setFilters] = useState<ActivityFilters>({});
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);
  
  // Use the store for main data operations
  const {
    logs,
    loading,
    error,
    pagination,
    fetchLogs,
    fetchLogById,
    getLogStats,
    exportLogs,
    clearOldLogs,
    getTotalLogs,
    getLogsByType: getLogsByTypeFromStore,
    getLogsByUser: getLogsByUserFromStore,
    getRecentLogs: getRecentLogsFromStore,
    getErrorLogs: getErrorLogsFromStore,
    getSecurityLogs: getSecurityLogsFromStore,
  } = useActivityStore();

  // Legacy hook for compatibility
  const {
    getLogType,
    getLogIcon,
    getLogColor,
    formatLogDescription,
  } = useActivityLogs();

  // Fetch comprehensive stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const statsData = await getLogStats();
      if (statsData) {
        setStats({
          total_logs: statsData.total_logs,
          today_logs: statsData.today_logs,
          active_users: statsData.active_users,
          error_logs: statsData.error_logs,
          api_calls: statsData.api_calls,
          recent_activities: statsData.today_logs,
          top_users: Object.entries(statsData.by_user || {}).map(([user, count]) => ({
            user,
            count: count as number
          })),
          activity_trend: Object.entries(statsData.by_type || {}).map(([type, count]) => ({
            date: type,
            count: count as number
          }))
        });
      }
    } catch (err) {
      console.error('Error fetching activity stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [getLogStats]);

  // Apply filters and fetch logs
  const applyFilters = useCallback(async (newFilters: ActivityFilters) => {
    setFilters(newFilters);
    
    // Convert frontend filters to backend filters
    const backendFilters = {
      search: newFilters.search,
      log_name: newFilters.type !== 'all' ? newFilters.type : undefined,
      causer_type: newFilters.user !== 'all' ? newFilters.user : undefined,
      date_from: getDateFromFilter(newFilters.date),
      date_to: getDateToFilter(newFilters.date),
      per_page: 15,
      page: 1,
    };

    await fetchLogs(backendFilters);
  }, [fetchLogs]);

  // Real-time updates
  const enableRealTime = useCallback(() => {
    setRealTimeEnabled(true);
  }, []);

  const disableRealTime = useCallback(() => {
    setRealTimeEnabled(false);
  }, []);

  // Auto-refresh for real-time
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      fetchLogs();
      fetchStats();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [realTimeEnabled, fetchLogs, fetchStats]);

  // Initial load
  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [fetchLogs, fetchStats]);

  // Helper functions
  const getDateFromFilter = (dateFilter: string = 'all'): string | undefined => {
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        return now.toISOString().split('T')[0];
      case 'yesterday': {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      }
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo.toISOString().split('T')[0];
      }
      case 'month': {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return monthAgo.toISOString().split('T')[0];
      }
      default:
        return undefined;
    }
  };

  const getDateToFilter = (dateFilter: string = 'all'): string | undefined => {
    if (dateFilter === 'all') return undefined;
    
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const getFilteredLogs = useCallback(() => {
    return logs.filter(log => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          log.description?.toLowerCase().includes(searchLower) ||
          log.log_name?.toLowerCase().includes(searchLower) ||
          (log.properties && JSON.stringify(log.properties).toLowerCase().includes(searchLower))
        );
      }
      return true;
    });
  }, [logs, filters]);

  const exportData = useCallback(async (format: 'csv' | 'json' = 'csv') => {
    const backendFilters = {
      search: filters.search,
      log_name: filters.type !== 'all' ? filters.type : undefined,
      causer_type: filters.user !== 'all' ? filters.user : undefined,
      date_from: getDateFromFilter(filters.date),
      date_to: getDateToFilter(filters.date),
    };

    return await exportLogs(backendFilters, format);
  }, [filters, exportLogs]);

  const clearOldData = useCallback(async (daysToKeep: number = 30) => {
    const success = await clearOldLogs(daysToKeep);
    if (success) {
      await fetchStats();
    }
    return success;
  }, [clearOldLogs, fetchStats]);

  // Selection handlers
  const handleEntitySelect = useCallback((id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(logs.map(log => log.id));
  }, [logs]);

  const handleClearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // Memoizar dados computados para performance
  const activityStats = useMemo(() => {
    if (!stats) return { total: 0, today: 0, activeUsers: 0, errors: 0 };

    return {
      total: stats.total_logs,
      today: stats.today_logs,
      activeUsers: stats.active_users,
      errors: stats.error_logs,
    };
  }, [stats]);

  const hasActivity = useMemo(() => {
    return logs.length > 0;
  }, [logs]);

  const hasEntities = useMemo(() => {
    return logs.length > 0;
  }, [logs]);

  const hasSelection = useMemo(() => {
    return selectedIds.length > 0;
  }, [selectedIds.length]);

  return {
    // State
    logs: getFilteredLogs(),
    loading,
    error,
    pagination,
    stats,
    activityStats,
    hasActivity,
    hasEntities,
    hasSelection,
    statsLoading,
    filters,
    selectedIds,
    
    // Actions
    applyFilters,
    fetchEntities: fetchLogs,
    fetchLogs,
    fetchLogById,
    fetchStats,
    exportData,
    clearOldData,
    setFilters,
    clearFilters: () => setFilters({}),
    
    // Selection
    handleEntitySelect,
    handleSelectAll,
    handleClearSelection,
    
    // Helpers
    getLogType,
    getLogIcon,
    getLogColor,
    formatLogDescription,
    getLogsByType: getLogsByTypeFromStore,
    getLogsByUser: getLogsByUserFromStore,
    getRecentLogs: getRecentLogsFromStore,
    getErrorLogs: getErrorLogsFromStore,
    getSecurityLogs: getSecurityLogsFromStore,
    
    // Computed
    totalLogs: logs.length,
    errorCount: getErrorLogsFromStore().length,
    securityCount: getSecurityLogsFromStore().length,
    recentCount: getRecentLogsFromStore(5).length,
  };
};
