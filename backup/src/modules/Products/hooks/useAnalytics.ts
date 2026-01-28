// ========================================
// PRODUCTS MODULE - ANALYTICS HOOK
// ========================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { 
  AnalyticsDashboard,
  AnalyticsWidget,
  WidgetType,
  ChartType,
  DataSource,
  Metric,
  ConversionEvent,
  ConversionFunnel,
  HeatmapData,
  UserSession,
  TimeRange,
  TimeGranularity
} from '../types/analytics';

interface UseAnalyticsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseAnalyticsReturn {
  // Data
  dashboards: AnalyticsDashboard[];
  widgets: AnalyticsWidget[];
  metrics: Metric[];
  loading: boolean;
  error: string | null;
  
  // Dashboard Management
  createDashboard: (data: Partial<AnalyticsDashboard>) => Promise<AnalyticsDashboard>;
  updateDashboard: (id: string, data: Partial<AnalyticsDashboard>) => Promise<AnalyticsDashboard>;
  deleteDashboard: (id: string) => Promise<void>;
  duplicateDashboard: (id: string) => Promise<AnalyticsDashboard>;
  
  // Widget Management
  createWidget: (dashboardId: string, data: Partial<AnalyticsWidget>) => Promise<AnalyticsWidget>;
  updateWidget: (id: string, data: Partial<AnalyticsWidget>) => Promise<AnalyticsWidget>;
  deleteWidget: (id: string) => Promise<void>;
  duplicateWidget: (id: string) => Promise<AnalyticsWidget>;
  moveWidget: (id: string, position: { x: number; y: number }) => Promise<AnalyticsWidget>;
  resizeWidget: (id: string, size: { width: number; height: number }) => Promise<AnalyticsWidget>;
  
  // Data Fetching
  getWidgetData: (id: string, timeRange?: TimeRange) => Promise<any>;
  getMetricData: (id: string, timeRange?: TimeRange) => Promise<any>;
  getConversionData: (targetId: string, timeRange?: TimeRange) => Promise<ConversionEvent[]>;
  getFunnelData: (funnelId: string, timeRange?: TimeRange) => Promise<ConversionFunnel>;
  getHeatmapData: (pageId: string, type: string) => Promise<HeatmapData>;
  getSessionData: (timeRange?: TimeRange) => Promise<UserSession[]>;
  
  // Real-time Analytics
  getRealTimeData: (widgetId: string) => Promise<any>;
  subscribeToRealTime: (widgetId: string, callback: (data: any) => void) => void;
  unsubscribeFromRealTime: (widgetId: string) => void;
  
  // Export & Reporting
  exportDashboard: (id: string, format: 'pdf' | 'excel' | 'csv') => Promise<Blob>;
  exportWidget: (id: string, format: 'pdf' | 'excel' | 'csv') => Promise<Blob>;
  generateReport: (dashboardId: string, options: any) => Promise<Blob>;
  scheduleReport: (dashboardId: string, schedule: any) => Promise<void>;
  
  // Utilities
  refresh: () => Promise<void>;
  getDashboard: (id: string) => AnalyticsDashboard | undefined;
  getWidget: (id: string) => AnalyticsWidget | undefined;
  getMetric: (id: string) => Metric | undefined;
  
  // Time Range Helpers
  getTimeRange: (type: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'last90days' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom') => TimeRange;
  formatTimeRange: (timeRange: TimeRange) => string;
  
  // Data Processing
  aggregateData: (data: any[], groupBy: string, metrics: string[]) => any[];
  calculateGrowthRate: (current: number, previous: number) => number;
  calculateTrend: (data: number[]) => 'up' | 'down' | 'stable';
  formatNumber: (value: number, format: 'number' | 'currency' | 'percentage' | 'duration') => string;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}): UseAnalyticsReturn => {
  const { autoRefresh = false, refreshInterval = 30000 } = options;
  
  // Using router directly for API calls
  
  // State
  const [dashboards, setDashboards] = useState<AnalyticsDashboard[]>([]);
  const [widgets, setWidgets] = useState<AnalyticsWidget[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realTimeSubscriptions, setRealTimeSubscriptions] = useState<Map<string, any>>(new Map());

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dashboardsResponse, widgetsResponse, metricsResponse] = await Promise.all([
        fetch('/api/analytics/dashboards'),
        fetch('/api/analytics/widgets'),
        fetch('/api/analytics/metrics')
      ]);
      
      const dashboardsData = await dashboardsResponse.json();
      const widgetsData = await widgetsResponse.json();
      const metricsData = await metricsResponse.json();
      
      if (dashboardsData) {
        setDashboards(dashboardsData as AnalyticsDashboard[]);
      }
      
      if (widgetsData) {
        setWidgets(widgetsData as AnalyticsWidget[]);
      }
      
      if (metricsData) {
        setMetrics(metricsData as Metric[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  // Dashboard management
  const createDashboard = useCallback(async (data: Partial<AnalyticsDashboard>): Promise<AnalyticsDashboard> => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const newDashboard = await response.json() as AnalyticsDashboard;
      
      if (newDashboard) {
        setDashboards(prev => [newDashboard, ...prev]);
        return newDashboard;
      }
      
      throw new Error('Failed to create dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDashboard = useCallback(async (id: string, data: Partial<AnalyticsDashboard>): Promise<AnalyticsDashboard> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/dashboards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedDashboard = await response.json() as AnalyticsDashboard;
      
      if (updatedDashboard) {
        setDashboards(prev => prev.map(d => d.id === id ? updatedDashboard : d));
        return updatedDashboard;
      }
      
      throw new Error('Failed to update dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const deleteDashboard = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await fetch(`/api/analytics/dashboards/${id}`, { method: 'DELETE' });
      
      setDashboards(prev => prev.filter(d => d.id !== id));
      setWidgets(prev => prev.filter(w => w.id !== id)); // Remove widgets from deleted dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicateDashboard = useCallback(async (id: string): Promise<AnalyticsDashboard> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/dashboards/${id}/duplicate`, { method: 'POST' });
      const duplicatedDashboard = await response.json() as AnalyticsDashboard;
      
      if (duplicatedDashboard) {
        setDashboards(prev => [duplicatedDashboard, ...prev]);
        return duplicatedDashboard;
      }
      
      throw new Error('Failed to duplicate dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Widget management
  const createWidget = useCallback(async (dashboardId: string, data: Partial<AnalyticsWidget>): Promise<AnalyticsWidget> => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, dashboardId })
      });
      const newWidget = await response.json() as AnalyticsWidget;
      
      if (newWidget) {
        setWidgets(prev => [newWidget, ...prev]);
        return newWidget;
      }
      
      throw new Error('Failed to create widget');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create widget');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWidget = useCallback(async (id: string, data: Partial<AnalyticsWidget>): Promise<AnalyticsWidget> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/widgets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedWidget = await response.json() as AnalyticsWidget;
      
      if (updatedWidget) {
        setWidgets(prev => prev.map(w => w.id === id ? updatedWidget : w));
        return updatedWidget;
      }
      
      throw new Error('Failed to update widget');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update widget');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const deleteWidget = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await fetch(`/api/analytics/widgets/${id}`, { method: 'DELETE' });
      
      setWidgets(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete widget');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicateWidget = useCallback(async (id: string): Promise<AnalyticsWidget> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/widgets/${id}/duplicate`, { method: 'POST' });
      const duplicatedWidget = await response.json() as AnalyticsWidget;
      
      if (duplicatedWidget) {
        setWidgets(prev => [duplicatedWidget, ...prev]);
        return duplicatedWidget;
      }
      
      throw new Error('Failed to duplicate widget');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate widget');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const moveWidget = useCallback(async (id: string, position: { x: number; y: number }): Promise<AnalyticsWidget> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/widgets/${id}/position`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position })
      });
      const updatedWidget = await response.json() as AnalyticsWidget;
      
      if (updatedWidget) {
        setWidgets(prev => prev.map(w => w.id === id ? updatedWidget : w));
        return updatedWidget;
      }
      
      throw new Error('Failed to move widget');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move widget');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const resizeWidget = useCallback(async (id: string, size: { width: number; height: number }): Promise<AnalyticsWidget> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/widgets/${id}/size`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size })
      });
      const updatedWidget = await response.json() as AnalyticsWidget;
      
      if (updatedWidget) {
        setWidgets(prev => prev.map(w => w.id === id ? updatedWidget : w));
        return updatedWidget;
      }
      
      throw new Error('Failed to resize widget');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resize widget');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  // Data fetching
  const getWidgetData = useCallback(async (id: string, timeRange?: TimeRange): Promise<any> => {
    try {
      const response = await fetch(`/api/analytics/widgets/${id}/data?timeRange=${timeRange}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch widget data');
      throw err;
    }
  }, []);

  const getMetricData = useCallback(async (id: string, timeRange?: TimeRange): Promise<any> => {
    try {
      const response = await fetch(`/api/analytics/metrics/${id}/data?timeRange=${timeRange}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metric data');
      throw err;
    }
  }, []);

  const getConversionData = useCallback(async (targetId: string, timeRange?: TimeRange): Promise<ConversionEvent[]> => {
    try {
      const response = await fetch(`/api/analytics/conversions?targetId=${targetId}&timeRange=${timeRange}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversion data');
      throw err;
    }
  }, []);

  const getFunnelData = useCallback(async (funnelId: string, timeRange?: TimeRange): Promise<ConversionFunnel> => {
    try {
      const response = await fetch(`/api/analytics/funnels/${funnelId}?timeRange=${timeRange}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch funnel data');
      throw err;
    }
  }, []);

  const getHeatmapData = useCallback(async (pageId: string, type: string): Promise<HeatmapData> => {
    try {
      const response = await fetch(`/api/analytics/heatmaps?pageId=${pageId}&type=${type}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch heatmap data');
      throw err;
    }
  }, []);

  const getSessionData = useCallback(async (timeRange?: TimeRange): Promise<UserSession[]> => {
    try {
      const response = await fetch(`/api/analytics/sessions?timeRange=${timeRange}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch session data');
      throw err;
    }
  }, []);

  // Real-time analytics
  const getRealTimeData = useCallback(async (widgetId: string): Promise<any> => {
    try {
      const response = await fetch(`/api/analytics/widgets/${widgetId}/realtime`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch real-time data');
      throw err;
    }
  }, []);

  const subscribeToRealTime = useCallback((widgetId: string, callback: (data: any) => void) => {
    // Implementation would depend on your real-time solution (WebSocket, Server-Sent Events, etc.)
    // This is a placeholder for the real-time subscription logic
    const subscription = {
      widgetId,
      callback,
      interval: setInterval(async () => {
        try {
          const data = await getRealTimeData(widgetId);
          callback(data);
        } catch (err) {
          console.error('Real-time data fetch error:', err);
        }
      }, 5000) // Poll every 5 seconds
    };
    
    setRealTimeSubscriptions(prev => new Map(prev.set(widgetId, subscription)));
  }, [getRealTimeData]);

  const unsubscribeFromRealTime = useCallback((widgetId: string) => {
    const subscription = realTimeSubscriptions.get(widgetId);
    if (subscription) {
      clearInterval(subscription.interval);
      setRealTimeSubscriptions(prev => {
        const newMap = new Map(prev);
        newMap.delete(widgetId);
        return newMap;
      });
    }
  }, [realTimeSubscriptions]);

  // Export & Reporting
  const exportDashboard = useCallback(async (id: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> => {
    try {
      const response = await fetch(`/api/analytics/dashboards/${id}/export?format=${format}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export dashboard');
      throw err;
    }
  }, []);

  const exportWidget = useCallback(async (id: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> => {
    try {
      const response = await fetch(`/api/analytics/widgets/${id}/export?format=${format}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export widget');
      throw err;
    }
  }, []);

  const generateReport = useCallback(async (dashboardId: string, options: any): Promise<Blob> => {
    try {
      const response = await fetch(`/api/analytics/dashboards/${dashboardId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      throw err;
    }
  }, []);

  const scheduleReport = useCallback(async (dashboardId: string, schedule: any): Promise<void> => {
    try {
      await fetch(`/api/analytics/dashboards/${dashboardId}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule report');
      throw err;
    }
  }, []);

  // Utilities
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const getDashboard = useCallback((id: string): AnalyticsDashboard | undefined => {
    return dashboards.find(d => d.id === id);
  }, [dashboards]);

  const getWidget = useCallback((id: string): AnalyticsWidget | undefined => {
    return widgets.find(w => w.id === id);
  }, [widgets]);

  const getMetric = useCallback((id: string): Metric | undefined => {
    return metrics.find(m => m.id === id);
  }, [metrics]);

  // Time range helpers
  const getTimeRange = useCallback((type: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'last90days' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'custom'): TimeRange => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    switch (type) {
      case 'today':
        return { start: startOfDay, end: endOfDay, granularity: TimeGranularity.HOUR, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      case 'yesterday': {
        const yesterday = new Date(startOfDay);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: yesterday, end: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1), granularity: TimeGranularity.HOUR, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      }
      case 'last7days': {
        const last7Days = new Date(startOfDay);
        last7Days.setDate(last7Days.getDate() - 7);
        return { start: last7Days, end: endOfDay, granularity: TimeGranularity.DAY, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      }
      case 'last30days': {
        const last30Days = new Date(startOfDay);
        last30Days.setDate(last30Days.getDate() - 30);
        return { start: last30Days, end: endOfDay, granularity: TimeGranularity.DAY, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      }
      case 'last90days': {
        const last90Days = new Date(startOfDay);
        last90Days.setDate(last90Days.getDate() - 90);
        return { start: last90Days, end: endOfDay, granularity: TimeGranularity.DAY, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      }
      case 'thisMonth': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: startOfMonth, end: endOfDay, granularity: TimeGranularity.DAY, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      }
      case 'lastMonth': {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        return { start: startOfLastMonth, end: endOfLastMonth, granularity: TimeGranularity.DAY, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      }
      case 'thisYear': {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return { start: startOfYear, end: endOfDay, granularity: TimeGranularity.MONTH, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      }
      case 'lastYear': {
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        return { start: startOfLastYear, end: endOfLastYear, granularity: TimeGranularity.MONTH, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
      }
      default:
        return { start: startOfDay, end: endOfDay, granularity: TimeGranularity.HOUR, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };
    }
  }, []);

  const formatTimeRange = useCallback((timeRange: TimeRange): string => {
    const start = timeRange.start.toLocaleDateString();
    const end = timeRange.end.toLocaleDateString();
    return `${start} - ${end}`;
  }, []);

  // Data processing
  const aggregateData = useCallback((data: any[], groupBy: string, metrics: string[]): any[] => {
    const grouped = data.reduce((acc, item) => {
      const key = item[groupBy];
      if (!acc[key]) {
        acc[key] = { [groupBy]: key };
        metrics.forEach(metric => {
          acc[key][metric] = 0;
        });
      }
      metrics.forEach(metric => {
        acc[key][metric] += item[metric] || 0;
      });
      return acc;
    }, {});
    
    return Object.values(grouped);
  }, []);

  const calculateGrowthRate = useCallback((current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }, []);

  const calculateTrend = useCallback((data: number[]): 'up' | 'down' | 'stable' => {
    if (data.length < 2) return 'stable';
    
    const first = data[0];
    const last = data[data.length - 1];
    const diff = last - first;
    const threshold = Math.abs(first) * 0.05; // 5% threshold
    
    if (diff > threshold) return 'up';
    if (diff < -threshold) return 'down';
    return 'stable';
  }, []);

  const formatNumber = useCallback((value: number, format: 'number' | 'currency' | 'percentage' | 'duration'): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percentage':
        return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(value / 100);
      case 'duration': {
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const seconds = Math.floor(value % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  }, []);

  return {
    // Data
    dashboards,
    widgets,
    metrics,
    loading,
    error,
    
    // Dashboard Management
    createDashboard,
    updateDashboard,
    deleteDashboard,
    duplicateDashboard,
    
    // Widget Management
    createWidget,
    updateWidget,
    deleteWidget,
    duplicateWidget,
    moveWidget,
    resizeWidget,
    
    // Data Fetching
    getWidgetData,
    getMetricData,
    getConversionData,
    getFunnelData,
    getHeatmapData,
    getSessionData,
    
    // Real-time Analytics
    getRealTimeData,
    subscribeToRealTime,
    unsubscribeFromRealTime,
    
    // Export & Reporting
    exportDashboard,
    exportWidget,
    generateReport,
    scheduleReport,
    
    // Utilities
    refresh,
    getDashboard,
    getWidget,
    getMetric,
    
    // Time Range Helpers
    getTimeRange,
    formatTimeRange,
    
    // Data Processing
    aggregateData,
    calculateGrowthRate,
    calculateTrend,
    formatNumber
  };
};
