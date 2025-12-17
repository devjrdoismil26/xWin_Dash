import { apiClient } from '@/services';
/**
 * @module modules/Dashboard/hooks/useDashboardCore
 * @description
 * Hook principal orquestrador do Dashboard.
 * 
 * Coordena todos os hooks especializados:
 * - useDashboardMetrics (métricas e KPIs)
 * - useDashboardWidgets (gerenciamento de widgets)
 * - useDashboardAdvanced (recursos avançados)
 * - Gerenciamento de filtros e configurações
 * - Auto-refresh e exportação
 * 
 * @example
 * ```typescript
 * import { useDashboardCore } from './hooks/useDashboardCore';
 * 
 * const CoreComponent = () => {
 *   const {
 *     metrics,
 *     widgets,
 *     filters,
 *     settings,
 *     refreshDashboard,
 *     exportDashboard
 *   } = useDashboardCore();

 * 
 *   return <div>...</div>;
 *};

 * ```
 * 
 * @since 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useDashboardMetrics } from './useDashboardMetrics';
import { useDashboardWidgets } from './useDashboardWidgets';
import { useDashboardAdvanced } from './useDashboardAdvanced';
import { DashboardFilters, DashboardSettings } from '../types';

export const useDashboardCore = () => {
  // Estado principal
  const [filters, setFilters] = useState<DashboardFilters>({
    date_range: '30days',
    project_id: '',
    user_id: '',
    campaign_id: '',
    metric_type: ''
  });

  const [settings, setSettings] = useState<DashboardSettings>({
    theme: 'light',
    layout: 'grid',
    auto_refresh: true,
    refresh_interval: 30000,
    show_advanced_metrics: false
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Hooks especializados
  const metrics = useDashboardMetrics();

  const widgets = useDashboardWidgets();

  const advanced = useDashboardAdvanced();

  // Ações principais
  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));

  }, []);

  const updateSettings = useCallback((newSettings: Partial<DashboardSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));

  }, []);

  const refreshDashboard = useCallback(async () => {
    setIsRefreshing(true);

    setLastRefresh(new Date());

    try {
      await Promise.all([
        metrics.refreshData(),
        widgets.refreshAllWidgets(),
        advanced.refreshAll()
      ]);

    } catch (error) {
      console.error('Erro ao atualizar dashboard:', error);

    } finally {
      setIsRefreshing(false);

    } , [metrics.refreshData, widgets.refreshAllWidgets, advanced.refreshAll]);

  const exportDashboard = useCallback(async (format: 'json' | 'csv' = 'json') => {
    try {
      const data = await apiClient.get('/api/v1/dashboard/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          format,
          filters,
          include_widgets: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);

      }

      const blob = await (response as any).blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);

      a.click();

      window.URL.revokeObjectURL(url);

      document.body.removeChild(a);

      return true;
    } catch (error) {
      console.error('Erro ao exportar dashboard:', error);

      return false;
    } , [filters]);

  // Auto-refresh effect
  useEffect(() => {
    if (!settings.auto_refresh || settings.refresh_interval <= 0) return;

    const interval = setInterval(() => {
      refreshDashboard();

    }, settings.refresh_interval);

    return () => clearInterval(interval);

  }, [settings.auto_refresh, settings.refresh_interval, refreshDashboard]);

  // Load initial data
  useEffect(() => {
    refreshDashboard();

  }, [refreshDashboard]);

  return {
    // Estado principal
    filters,
    settings,
    isRefreshing,
    lastRefresh,
    
    // Hooks especializados
    metrics,
    widgets,
    advanced,
    
    // Ações principais
    updateFilters,
    updateSettings,
    refreshDashboard,
    exportDashboard};
};
