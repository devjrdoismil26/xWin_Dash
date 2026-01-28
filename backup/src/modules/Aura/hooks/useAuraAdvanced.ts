import { useState, useEffect, useCallback } from 'react';
import { auraService } from '../services/auraService';
import {
  AuraAnalyticsOverview,
  AuraConnectionAnalytics,
  AuraFlowAnalytics,
  AuraPerformanceMetrics,
  AuraEngagementMetrics,
  AuraConversionMetrics,
  AuraROIMetrics,
  AuraTrendData,
  AuraBenchmark,
  AuraReport,
  AuraDashboard,
  AuraAlert,
  UseAuraAnalyticsReturn,
  UseAuraTrendsReturn,
  UseAuraBenchmarksReturn,
  UseAuraReportsReturn,
  UseAuraDashboardsReturn,
  UseAuraAlertsReturn
} from '../types/auraTypes';

// ===== ANALYTICS HOOKS =====
export const useAuraAnalytics = (): UseAuraAnalyticsReturn => {
  const [overview, setOverview] = useState<AuraAnalyticsOverview | null>(null);
  const [connectionAnalytics, setConnectionAnalytics] = useState<AuraConnectionAnalytics | null>(null);
  const [flowAnalytics, setFlowAnalytics] = useState<AuraFlowAnalytics | null>(null);
  const [performance, setPerformance] = useState<AuraPerformanceMetrics | null>(null);
  const [engagement, setEngagement] = useState<AuraEngagementMetrics | null>(null);
  const [conversion, setConversion] = useState<AuraConversionMetrics | null>(null);
  const [roi, setROI] = useState<AuraROIMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await auraService.getAnalyticsOverview();
      if (response.success) {
        setOverview(response.data as AuraAnalyticsOverview);
      } else {
        setError(response.error || 'Failed to fetch overview');
      }
    } catch (err) {
      setError('Failed to fetch overview');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConnectionAnalytics = useCallback(async (connectionId: string) => {
    try {
      setLoading(true);
      const response = await auraService.getConnectionAnalytics(connectionId);
      if (response.success) {
        setConnectionAnalytics(response.data as AuraConnectionAnalytics);
      } else {
        setError(response.error || 'Failed to fetch connection analytics');
      }
    } catch (err) {
      setError('Failed to fetch connection analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFlowAnalytics = useCallback(async (flowId: string) => {
    try {
      setLoading(true);
      const response = await auraService.getFlowAnalytics(flowId);
      if (response.success) {
        setFlowAnalytics(response.data as AuraFlowAnalytics);
      } else {
        setError(response.error || 'Failed to fetch flow analytics');
      }
    } catch (err) {
      setError('Failed to fetch flow analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPerformance = useCallback(async () => {
    try {
      setLoading(true);
      const response = await auraService.getPerformanceAnalytics();
      if (response.success) {
        setPerformance(response.data as AuraPerformanceMetrics);
      } else {
        setError(response.error || 'Failed to fetch performance analytics');
      }
    } catch (err) {
      setError('Failed to fetch performance analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEngagement = useCallback(async () => {
    try {
      setLoading(true);
      const response = await auraService.getEngagementAnalytics();
      if (response.success) {
        setEngagement(response.data as AuraEngagementMetrics);
      } else {
        setError(response.error || 'Failed to fetch engagement analytics');
      }
    } catch (err) {
      setError('Failed to fetch engagement analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConversion = useCallback(async () => {
    try {
      setLoading(true);
      const response = await auraService.getConversionAnalytics();
      if (response.success) {
        setConversion(response.data as AuraConversionMetrics);
      } else {
        setError(response.error || 'Failed to fetch conversion analytics');
      }
    } catch (err) {
      setError('Failed to fetch conversion analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchROI = useCallback(async () => {
    try {
      setLoading(true);
      const response = await auraService.getROIAnalytics();
      if (response.success) {
        setROI(response.data as AuraROIMetrics);
      } else {
        setError(response.error || 'Failed to fetch ROI analytics');
      }
    } catch (err) {
      setError('Failed to fetch ROI analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchOverview(),
      fetchPerformance(),
      fetchEngagement(),
      fetchConversion(),
      fetchROI()
    ]);
  }, [fetchOverview, fetchPerformance, fetchEngagement, fetchConversion, fetchROI]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    overview,
    connectionAnalytics,
    flowAnalytics,
    performance,
    engagement,
    conversion,
    roi,
    loading,
    error,
    refresh
  };
};

export const useAuraTrends = (): UseAuraTrendsReturn => {
  const [trends, setTrends] = useState<AuraTrendData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      const response = await auraService.getTrendsAnalytics(params);
      if (response.success) {
        setTrends(response.data);
      } else {
        setError(response.error || 'Failed to fetch trends');
      }
    } catch (err) {
      setError('Failed to fetch trends');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchTrends();
  }, [fetchTrends]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    trends,
    loading,
    error,
    refresh
  };
};

export const useAuraBenchmarks = (): UseAuraBenchmarksReturn => {
  const [benchmarks, setBenchmarks] = useState<AuraBenchmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBenchmarks = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      const response = await auraService.getBenchmarksAnalytics(params);
      if (response.success) {
        setBenchmarks(response.data);
      } else {
        setError(response.error || 'Failed to fetch benchmarks');
      }
    } catch (err) {
      setError('Failed to fetch benchmarks');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchBenchmarks();
  }, [fetchBenchmarks]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    benchmarks,
    loading,
    error,
    refresh
  };
};

// ===== REPORTS HOOKS =====
export const useAuraReports = (): UseAuraReportsReturn => {
  const [reports, setReports] = useState<AuraReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      const response = await auraService.getReports(params);
      if (response.success) {
        setReports(response.data);
      } else {
        setError(response.error || 'Failed to fetch reports');
      }
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = useCallback(async (data: Partial<AuraReport>) => {
    try {
      setLoading(true);
      const response = await auraService.createReport(data);
      if (response.success) {
        await fetchReports();
      } else {
        setError(response.error || 'Failed to create report');
      }
    } catch (err) {
      setError('Failed to create report');
    } finally {
      setLoading(false);
    }
  }, [fetchReports]);

  const updateReport = useCallback(async (id: string, data: Partial<AuraReport>) => {
    try {
      setLoading(true);
      const response = await auraService.updateReport(id, data);
      if (response.success) {
        await fetchReports();
      } else {
        setError(response.error || 'Failed to update report');
      }
    } catch (err) {
      setError('Failed to update report');
    } finally {
      setLoading(false);
    }
  }, [fetchReports]);

  const deleteReport = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await auraService.deleteReport(id);
      if (response.success) {
        await fetchReports();
      } else {
        setError(response.error || 'Failed to delete report');
      }
    } catch (err) {
      setError('Failed to delete report');
    } finally {
      setLoading(false);
    }
  }, [fetchReports]);

  const generateReport = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await auraService.generateReport(id);
      if (response.success) {
        await fetchReports();
      } else {
        setError(response.error || 'Failed to generate report');
      }
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  }, [fetchReports]);

  const refresh = useCallback(async () => {
    await fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    reports,
    loading,
    error,
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    refresh
  };
};

// ===== DASHBOARDS HOOKS =====
export const useAuraDashboards = (): UseAuraDashboardsReturn => {
  const [dashboards, setDashboards] = useState<AuraDashboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboards = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      const response = await auraService.getDashboards(params);
      if (response.success) {
        setDashboards(response.data);
      } else {
        setError(response.error || 'Failed to fetch dashboards');
      }
    } catch (err) {
      setError('Failed to fetch dashboards');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDashboard = useCallback(async (data: Partial<AuraDashboard>) => {
    try {
      setLoading(true);
      const response = await auraService.createDashboard(data);
      if (response.success) {
        await fetchDashboards();
      } else {
        setError(response.error || 'Failed to create dashboard');
      }
    } catch (err) {
      setError('Failed to create dashboard');
    } finally {
      setLoading(false);
    }
  }, [fetchDashboards]);

  const updateDashboard = useCallback(async (id: string, data: Partial<AuraDashboard>) => {
    try {
      setLoading(true);
      const response = await auraService.updateDashboard(id, data);
      if (response.success) {
        await fetchDashboards();
      } else {
        setError(response.error || 'Failed to update dashboard');
      }
    } catch (err) {
      setError('Failed to update dashboard');
    } finally {
      setLoading(false);
    }
  }, [fetchDashboards]);

  const deleteDashboard = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await auraService.deleteDashboard(id);
      if (response.success) {
        await fetchDashboards();
      } else {
        setError(response.error || 'Failed to delete dashboard');
      }
    } catch (err) {
      setError('Failed to delete dashboard');
    } finally {
      setLoading(false);
    }
  }, [fetchDashboards]);

  const setDefaultDashboard = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await auraService.setDefaultDashboard(id);
      if (response.success) {
        await fetchDashboards();
      } else {
        setError(response.error || 'Failed to set default dashboard');
      }
    } catch (err) {
      setError('Failed to set default dashboard');
    } finally {
      setLoading(false);
    }
  }, [fetchDashboards]);

  const refresh = useCallback(async () => {
    await fetchDashboards();
  }, [fetchDashboards]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    dashboards,
    loading,
    error,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    setDefaultDashboard,
    refresh
  };
};

// ===== ALERTS HOOKS =====
export const useAuraAlerts = (): UseAuraAlertsReturn => {
  const [alerts, setAlerts] = useState<AuraAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async (params: any = {}) => {
    try {
      setLoading(true);
      const response = await auraService.getAlerts(params);
      if (response.success) {
        setAlerts(response.data);
      } else {
        setError(response.error || 'Failed to fetch alerts');
      }
    } catch (err) {
      setError('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAlert = useCallback(async (data: Partial<AuraAlert>) => {
    try {
      setLoading(true);
      const response = await auraService.createAlert(data);
      if (response.success) {
        await fetchAlerts();
      } else {
        setError(response.error || 'Failed to create alert');
      }
    } catch (err) {
      setError('Failed to create alert');
    } finally {
      setLoading(false);
    }
  }, [fetchAlerts]);

  const updateAlert = useCallback(async (id: string, data: Partial<AuraAlert>) => {
    try {
      setLoading(true);
      const response = await auraService.updateAlert(id, data);
      if (response.success) {
        await fetchAlerts();
      } else {
        setError(response.error || 'Failed to update alert');
      }
    } catch (err) {
      setError('Failed to update alert');
    } finally {
      setLoading(false);
    }
  }, [fetchAlerts]);

  const deleteAlert = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await auraService.deleteAlert(id);
      if (response.success) {
        await fetchAlerts();
      } else {
        setError(response.error || 'Failed to delete alert');
      }
    } catch (err) {
      setError('Failed to delete alert');
    } finally {
      setLoading(false);
    }
  }, [fetchAlerts]);

  const toggleAlert = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await auraService.toggleAlert(id);
      if (response.success) {
        await fetchAlerts();
      } else {
        setError(response.error || 'Failed to toggle alert');
      }
    } catch (err) {
      setError('Failed to toggle alert');
    } finally {
      setLoading(false);
    }
  }, [fetchAlerts]);

  const refresh = useCallback(async () => {
    await fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    alerts,
    loading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
    refresh
  };
};
