import { useState, useCallback, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import {
  AnalyticsDashboard,
  AnalyticsReport,
  AnalyticsMetric,
  AnalyticsInsight,
  AnalyticsDashboardItem,
  AnalyticsSegment,
  AnalyticsFunnel,
  AnalyticsCohort,
  AnalyticsGoal,
  AnalyticsAlert,
  AnalyticsExport,
  AnalyticsIntegration,
  AnalyticsRealTimeData,
  AnalyticsFilters,
  AnalyticsReportFilters,
  AnalyticsDashboardFilters,
  UseAnalyticsReturn,
  UseAnalyticsReportsReturn,
  UseAnalyticsMetricsReturn,
  UseAnalyticsInsightsReturn,
  UseAnalyticsDashboardsReturn,
  UseAnalyticsSegmentsReturn,
  UseAnalyticsFunnelsReturn,
  UseAnalyticsCohortsReturn,
  UseAnalyticsGoalsReturn,
  UseAnalyticsAlertsReturn,
  UseAnalyticsExportsReturn,
  UseAnalyticsIntegrationsReturn,
  UseAnalyticsRealTimeReturn
} from '../types/analyticsTypes';

interface UseAnalyticsAdvancedReturn {
  // Dashboard
  dashboard: AnalyticsDashboard | null;
  dashboardLoading: boolean;
  dashboardError: string | null;
  fetchDashboard: (filters?: AnalyticsFilters) => Promise<void>;
  refreshDashboard: () => Promise<void>;

  // Reports
  reports: AnalyticsReport[];
  reportsLoading: boolean;
  reportsError: string | null;
  reportsPagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  fetchReports: (filters?: AnalyticsReportFilters) => Promise<void>;
  createReport: (reportData: any) => Promise<boolean>;
  updateReport: (reportId: string, reportData: any) => Promise<boolean>;
  deleteReport: (reportId: string) => Promise<boolean>;
  exportReport: (reportId: string, format?: string) => Promise<boolean>;
  scheduleReport: (reportId: string, schedule: any) => Promise<boolean>;
  shareReport: (reportId: string, permissions: any) => Promise<boolean>;

  // Metrics
  metrics: AnalyticsMetric[];
  metricsLoading: boolean;
  metricsError: string | null;
  fetchMetrics: (filters?: AnalyticsFilters) => Promise<void>;
  getMetricDetails: (metricId: string) => Promise<AnalyticsMetric | null>;

  // Insights
  insights: AnalyticsInsight[];
  insightsLoading: boolean;
  insightsError: string | null;
  fetchInsights: (filters?: AnalyticsFilters) => Promise<void>;
  generateInsights: (filters?: AnalyticsFilters) => Promise<boolean>;

  // Dashboards
  dashboards: AnalyticsDashboardItem[];
  currentDashboard: AnalyticsDashboardItem | null;
  dashboardsLoading: boolean;
  dashboardsError: string | null;
  fetchDashboards: (filters?: AnalyticsDashboardFilters) => Promise<void>;
  getDashboard: (dashboardId: string) => Promise<void>;
  createDashboard: (dashboardData: any) => Promise<boolean>;
  updateDashboard: (dashboardId: string, dashboardData: any) => Promise<boolean>;
  deleteDashboard: (dashboardId: string) => Promise<boolean>;

  // Segments
  segments: AnalyticsSegment[];
  segmentsLoading: boolean;
  segmentsError: string | null;
  fetchSegments: (filters?: AnalyticsFilters) => Promise<void>;
  createSegment: (segmentData: any) => Promise<boolean>;
  updateSegment: (segmentId: string, segmentData: any) => Promise<boolean>;
  deleteSegment: (segmentId: string) => Promise<boolean>;

  // Funnels
  funnels: AnalyticsFunnel[];
  funnelsLoading: boolean;
  funnelsError: string | null;
  fetchFunnels: (filters?: AnalyticsFilters) => Promise<void>;
  createFunnel: (funnelData: any) => Promise<boolean>;
  updateFunnel: (funnelId: string, funnelData: any) => Promise<boolean>;
  deleteFunnel: (funnelId: string) => Promise<boolean>;

  // Cohorts
  cohorts: AnalyticsCohort[];
  cohortsLoading: boolean;
  cohortsError: string | null;
  fetchCohorts: (filters?: AnalyticsFilters) => Promise<void>;
  createCohort: (cohortData: any) => Promise<boolean>;
  updateCohort: (cohortId: string, cohortData: any) => Promise<boolean>;
  deleteCohort: (cohortId: string) => Promise<boolean>;

  // Goals
  goals: AnalyticsGoal[];
  goalsLoading: boolean;
  goalsError: string | null;
  fetchGoals: (filters?: AnalyticsFilters) => Promise<void>;
  createGoal: (goalData: any) => Promise<boolean>;
  updateGoal: (goalId: string, goalData: any) => Promise<boolean>;
  deleteGoal: (goalId: string) => Promise<boolean>;

  // Alerts
  alerts: AnalyticsAlert[];
  alertsLoading: boolean;
  alertsError: string | null;
  fetchAlerts: (filters?: AnalyticsFilters) => Promise<void>;
  createAlert: (alertData: any) => Promise<boolean>;
  updateAlert: (alertId: string, alertData: any) => Promise<boolean>;
  deleteAlert: (alertId: string) => Promise<boolean>;

  // Exports
  exports: AnalyticsExport[];
  exportsLoading: boolean;
  exportsError: string | null;
  fetchExports: (filters?: AnalyticsFilters) => Promise<void>;
  createExport: (exportData: any) => Promise<boolean>;
  downloadExport: (exportId: string) => Promise<boolean>;

  // Integrations
  integrations: AnalyticsIntegration[];
  integrationsLoading: boolean;
  integrationsError: string | null;
  fetchIntegrations: (filters?: AnalyticsFilters) => Promise<void>;
  createIntegration: (integrationData: any) => Promise<boolean>;
  updateIntegration: (integrationId: string, integrationData: any) => Promise<boolean>;
  deleteIntegration: (integrationId: string) => Promise<boolean>;
  testIntegration: (integrationId: string) => Promise<boolean>;

  // Real-time
  realTimeData: AnalyticsRealTimeData | null;
  realTimeLoading: boolean;
  realTimeError: string | null;
  fetchRealTimeData: () => Promise<void>;
  startRealTimeUpdates: () => void;
  stopRealTimeUpdates: () => void;

  // Utility
  refreshAll: () => Promise<void>;
}

export const useAnalyticsAdvanced = (): UseAnalyticsAdvancedReturn => {
  // Dashboard State
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Reports State
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [reportsPagination, setReportsPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });

  // Metrics State
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // Insights State
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  // Dashboards State
  const [dashboards, setDashboards] = useState<AnalyticsDashboardItem[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<AnalyticsDashboardItem | null>(null);
  const [dashboardsLoading, setDashboardsLoading] = useState(false);
  const [dashboardsError, setDashboardsError] = useState<string | null>(null);

  // Segments State
  const [segments, setSegments] = useState<AnalyticsSegment[]>([]);
  const [segmentsLoading, setSegmentsLoading] = useState(false);
  const [segmentsError, setSegmentsError] = useState<string | null>(null);

  // Funnels State
  const [funnels, setFunnels] = useState<AnalyticsFunnel[]>([]);
  const [funnelsLoading, setFunnelsLoading] = useState(false);
  const [funnelsError, setFunnelsError] = useState<string | null>(null);

  // Cohorts State
  const [cohorts, setCohorts] = useState<AnalyticsCohort[]>([]);
  const [cohortsLoading, setCohortsLoading] = useState(false);
  const [cohortsError, setCohortsError] = useState<string | null>(null);

  // Goals State
  const [goals, setGoals] = useState<AnalyticsGoal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [goalsError, setGoalsError] = useState<string | null>(null);

  // Alerts State
  const [alerts, setAlerts] = useState<AnalyticsAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  // Exports State
  const [exports, setExports] = useState<AnalyticsExport[]>([]);
  const [exportsLoading, setExportsLoading] = useState(false);
  const [exportsError, setExportsError] = useState<string | null>(null);

  // Integrations State
  const [integrations, setIntegrations] = useState<AnalyticsIntegration[]>([]);
  const [integrationsLoading, setIntegrationsLoading] = useState(false);
  const [integrationsError, setIntegrationsError] = useState<string | null>(null);

  // Real-time State
  const [realTimeData, setRealTimeData] = useState<AnalyticsRealTimeData | null>(null);
  const [realTimeLoading, setRealTimeLoading] = useState(false);
  const [realTimeError, setRealTimeError] = useState<string | null>(null);
  const [realTimeInterval, setRealTimeInterval] = useState<NodeJS.Timeout | null>(null);

  // ===== DASHBOARD =====
  const fetchDashboard = useCallback(async (filters: AnalyticsFilters = {}) => {
    setDashboardLoading(true);
    setDashboardError(null);
    try {
      const response = await analyticsService.getDashboard();
      if (response.success) {
        setDashboard(response.data);
      } else {
        setDashboardError(response.error || 'Erro ao carregar dashboard');
      }
    } catch (error: any) {
      setDashboardError(error.message);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    await fetchDashboard();
  }, [fetchDashboard]);

  // ===== REPORTS =====
  const fetchReports = useCallback(async (filters: AnalyticsReportFilters = {}) => {
    setReportsLoading(true);
    setReportsError(null);
    try {
      const response = await analyticsService.getReports(filters);
      if (response.success) {
        if (response.data?.reports) {
          setReports(response.data.reports);
          setReportsPagination(response.data.pagination);
        } else {
          setReports(response.data || []);
        }
      } else {
        setReportsError(response.error || 'Erro ao carregar relatórios');
      }
    } catch (error: any) {
      setReportsError(error.message);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  const createReport = useCallback(async (reportData: any): Promise<boolean> => {
    try {
      const response = await analyticsService.createReport(reportData);
      if (response.success) {
        await fetchReports();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [fetchReports]);

  const updateReport = useCallback(async (reportId: string, reportData: any): Promise<boolean> => {
    try {
      const response = await analyticsService.updateReport(reportId, reportData);
      if (response.success) {
        await fetchReports();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [fetchReports]);

  const deleteReport = useCallback(async (reportId: string): Promise<boolean> => {
    try {
      const response = await analyticsService.deleteReport(reportId);
      if (response.success) {
        await fetchReports();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [fetchReports]);

  const exportReport = useCallback(async (reportId: string, format = 'csv'): Promise<boolean> => {
    try {
      const response = await analyticsService.exportReport(reportId, format);
      if (response.success) {
        // Handle file download
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportId}-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, []);

  const scheduleReport = useCallback(async (reportId: string, schedule: any): Promise<boolean> => {
    try {
      const response = await analyticsService.scheduleReport(reportId, schedule);
      return response.success;
    } catch (error) {
      return false;
    }
  }, []);

  const shareReport = useCallback(async (reportId: string, permissions: any): Promise<boolean> => {
    try {
      const response = await analyticsService.shareReport(reportId, permissions);
      return response.success;
    } catch (error) {
      return false;
    }
  }, []);

  // ===== METRICS =====
  const fetchMetrics = useCallback(async (filters: AnalyticsFilters = {}) => {
    setMetricsLoading(true);
    setMetricsError(null);
    try {
      const response = await analyticsService.getMetrics(filters);
      if (response.success) {
        setMetrics(response.data || []);
      } else {
        setMetricsError(response.error || 'Erro ao carregar métricas');
      }
    } catch (error: any) {
      setMetricsError(error.message);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  const getMetricDetails = useCallback(async (metricId: string): Promise<AnalyticsMetric | null> => {
    try {
      const response = await analyticsService.getMetricDetails(metricId);
      return response.success ? response.data : null;
    } catch (error) {
      return null;
    }
  }, []);

  // ===== INSIGHTS =====
  const fetchInsights = useCallback(async (filters: AnalyticsFilters = {}) => {
    setInsightsLoading(true);
    setInsightsError(null);
    try {
      const response = await analyticsService.getInsights();
      if (response.success) {
        setInsights(response.data || []);
      } else {
        setInsightsError(response.error || 'Erro ao carregar insights');
      }
    } catch (error: any) {
      setInsightsError(error.message);
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  const generateInsights = useCallback(async (filters: AnalyticsFilters = {}): Promise<boolean> => {
    try {
      const response = await analyticsService.generateInsights(filters);
      if (response.success) {
        await fetchInsights();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [fetchInsights]);

  // ===== DASHBOARDS =====
  const fetchDashboards = useCallback(async (filters: AnalyticsDashboardFilters = {}) => {
    setDashboardsLoading(true);
    setDashboardsError(null);
    try {
      const response = await analyticsService.getDashboards(filters);
      if (response.success) {
        if (response.data?.dashboards) {
          setDashboards(response.data.dashboards);
        } else {
          setDashboards(response.data || []);
        }
      } else {
        setDashboardsError(response.error || 'Erro ao carregar dashboards');
      }
    } catch (error: any) {
      setDashboardsError(error.message);
    } finally {
      setDashboardsLoading(false);
    }
  }, []);

  const getDashboard = useCallback(async (dashboardId: string) => {
    setDashboardsLoading(true);
    setDashboardsError(null);
    try {
      // Note: This endpoint might need to be implemented in the backend
      // For now, we'll find it from the existing dashboards
      const dashboard = dashboards.find(d => d.id === dashboardId);
      if (dashboard) {
        setCurrentDashboard(dashboard);
      }
    } catch (error: any) {
      setDashboardsError(error.message);
    } finally {
      setDashboardsLoading(false);
    }
  }, [dashboards]);

  const createDashboard = useCallback(async (dashboardData: any): Promise<boolean> => {
    try {
      const response = await analyticsService.createDashboard(dashboardData);
      if (response.success) {
        await fetchDashboards();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [fetchDashboards]);

  const updateDashboard = useCallback(async (dashboardId: string, dashboardData: any): Promise<boolean> => {
    try {
      const response = await analyticsService.updateDashboard(dashboardId, dashboardData);
      if (response.success) {
        await fetchDashboards();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [fetchDashboards]);

  const deleteDashboard = useCallback(async (dashboardId: string): Promise<boolean> => {
    try {
      const response = await analyticsService.deleteDashboard(dashboardId);
      if (response.success) {
        await fetchDashboards();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [fetchDashboards]);

  // ===== SEGMENTS =====
  const fetchSegments = useCallback(async (filters: AnalyticsFilters = {}) => {
    setSegmentsLoading(true);
    setSegmentsError(null);
    try {
      const response = await analyticsService.getSegments(filters);
      if (response.success) {
        if (response.data?.segments) {
          setSegments(response.data.segments);
        } else {
          setSegments(response.data || []);
        }
      } else {
        setSegmentsError(response.error || 'Erro ao carregar segmentos');
      }
    } catch (error: any) {
      setSegmentsError(error.message);
    } finally {
      setSegmentsLoading(false);
    }
  }, []);

  const createSegment = useCallback(async (segmentData: any): Promise<boolean> => {
    try {
      const response = await analyticsService.createSegment(segmentData);
      if (response.success) {
        await fetchSegments();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [fetchSegments]);

  const updateSegment = useCallback(async (segmentId: string, segmentData: any): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchSegments();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchSegments]);

  const deleteSegment = useCallback(async (segmentId: string): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchSegments();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchSegments]);

  // ===== FUNNELS =====
  const fetchFunnels = useCallback(async (filters: AnalyticsFilters = {}) => {
    setFunnelsLoading(true);
    setFunnelsError(null);
    try {
      const response = await analyticsService.getFunnels(filters);
      if (response.success) {
        if (response.data?.funnels) {
          setFunnels(response.data.funnels);
        } else {
          setFunnels(response.data || []);
        }
      } else {
        setFunnelsError(response.error || 'Erro ao carregar funnels');
      }
    } catch (error: any) {
      setFunnelsError(error.message);
    } finally {
      setFunnelsLoading(false);
    }
  }, []);

  const createFunnel = useCallback(async (funnelData: any): Promise<boolean> => {
    try {
      const response = await analyticsService.createFunnel(funnelData);
      if (response.success) {
        await fetchFunnels();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [fetchFunnels]);

  const updateFunnel = useCallback(async (funnelId: string, funnelData: any): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchFunnels();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchFunnels]);

  const deleteFunnel = useCallback(async (funnelId: string): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchFunnels();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchFunnels]);

  // ===== COHORTS =====
  const fetchCohorts = useCallback(async (filters: AnalyticsFilters = {}) => {
    setCohortsLoading(true);
    setCohortsError(null);
    try {
      const response = await analyticsService.getCohorts(filters);
      if (response.success) {
        if (response.data?.cohorts) {
          setCohorts(response.data.cohorts);
        } else {
          setCohorts(response.data || []);
        }
      } else {
        setCohortsError(response.error || 'Erro ao carregar cohorts');
      }
    } catch (error: any) {
      setCohortsError(error.message);
    } finally {
      setCohortsLoading(false);
    }
  }, []);

  const createCohort = useCallback(async (cohortData: any): Promise<boolean> => {
    try {
      const response = await analyticsService.createCohort(cohortData);
      if (response.success) {
        await fetchCohorts();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [fetchCohorts]);

  const updateCohort = useCallback(async (cohortId: string, cohortData: any): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchCohorts();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchCohorts]);

  const deleteCohort = useCallback(async (cohortId: string): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchCohorts();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchCohorts]);

  // ===== GOALS =====
  const fetchGoals = useCallback(async (filters: AnalyticsFilters = {}) => {
    setGoalsLoading(true);
    setGoalsError(null);
    try {
      // Note: This endpoint might need to be implemented in the backend
      setGoals([]);
    } catch (error: any) {
      setGoalsError(error.message);
    } finally {
      setGoalsLoading(false);
    }
  }, []);

  const createGoal = useCallback(async (goalData: any): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchGoals();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchGoals]);

  const updateGoal = useCallback(async (goalId: string, goalData: any): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchGoals();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchGoals]);

  const deleteGoal = useCallback(async (goalId: string): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchGoals();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchGoals]);

  // ===== ALERTS =====
  const fetchAlerts = useCallback(async (filters: AnalyticsFilters = {}) => {
    setAlertsLoading(true);
    setAlertsError(null);
    try {
      // Note: This endpoint might need to be implemented in the backend
      setAlerts([]);
    } catch (error: any) {
      setAlertsError(error.message);
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  const createAlert = useCallback(async (alertData: any): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchAlerts();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchAlerts]);

  const updateAlert = useCallback(async (alertId: string, alertData: any): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchAlerts();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchAlerts]);

  const deleteAlert = useCallback(async (alertId: string): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchAlerts();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchAlerts]);

  // ===== EXPORTS =====
  const fetchExports = useCallback(async (filters: AnalyticsFilters = {}) => {
    setExportsLoading(true);
    setExportsError(null);
    try {
      // Note: This endpoint might need to be implemented in the backend
      setExports([]);
    } catch (error: any) {
      setExportsError(error.message);
    } finally {
      setExportsLoading(false);
    }
  }, []);

  const createExport = useCallback(async (exportData: any): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchExports();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchExports]);

  const downloadExport = useCallback(async (exportId: string): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  // ===== INTEGRATIONS =====
  const fetchIntegrations = useCallback(async (filters: AnalyticsFilters = {}) => {
    setIntegrationsLoading(true);
    setIntegrationsError(null);
    try {
      // Note: This endpoint might need to be implemented in the backend
      setIntegrations([]);
    } catch (error: any) {
      setIntegrationsError(error.message);
    } finally {
      setIntegrationsLoading(false);
    }
  }, []);

  const createIntegration = useCallback(async (integrationData: any): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchIntegrations();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchIntegrations]);

  const updateIntegration = useCallback(async (integrationId: string, integrationData: any): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchIntegrations();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchIntegrations]);

  const deleteIntegration = useCallback(async (integrationId: string): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      await fetchIntegrations();
      return true;
    } catch (error) {
      return false;
    }
  }, [fetchIntegrations]);

  const testIntegration = useCallback(async (integrationId: string): Promise<boolean> => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  // ===== REAL-TIME =====
  const fetchRealTimeData = useCallback(async () => {
    setRealTimeLoading(true);
    setRealTimeError(null);
    try {
      const response = await analyticsService.getRealTimeMetrics();
      if (response.success) {
        setRealTimeData(response.data);
      } else {
        setRealTimeError(response.error || 'Erro ao carregar dados em tempo real');
      }
    } catch (error: any) {
      setRealTimeError(error.message);
    } finally {
      setRealTimeLoading(false);
    }
  }, []);

  const startRealTimeUpdates = useCallback(() => {
    if (realTimeInterval) return;

    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 30000); // Update every 30 seconds

    setRealTimeInterval(interval);
  }, [realTimeInterval, fetchRealTimeData]);

  const stopRealTimeUpdates = useCallback(() => {
    if (realTimeInterval) {
      clearInterval(realTimeInterval);
      setRealTimeInterval(null);
    }
  }, [realTimeInterval]);

  // ===== UTILITY =====
  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchDashboard(),
      fetchReports(),
      fetchMetrics(),
      fetchInsights(),
      fetchDashboards(),
      fetchSegments(),
      fetchFunnels(),
      fetchCohorts(),
      fetchGoals(),
      fetchAlerts(),
      fetchExports(),
      fetchIntegrations(),
      fetchRealTimeData()
    ]);
  }, [
    fetchDashboard,
    fetchReports,
    fetchMetrics,
    fetchInsights,
    fetchDashboards,
    fetchSegments,
    fetchFunnels,
    fetchCohorts,
    fetchGoals,
    fetchAlerts,
    fetchExports,
    fetchIntegrations,
    fetchRealTimeData
  ]);

  // ===== EFFECTS =====
  useEffect(() => {
    fetchDashboard();
    fetchReports();
    fetchMetrics();
    fetchInsights();
    fetchDashboards();
    fetchSegments();
    fetchFunnels();
    fetchCohorts();
    fetchGoals();
    fetchAlerts();
    fetchExports();
    fetchIntegrations();
    fetchRealTimeData();
  }, [
    fetchDashboard,
    fetchReports,
    fetchMetrics,
    fetchInsights,
    fetchDashboards,
    fetchSegments,
    fetchFunnels,
    fetchCohorts,
    fetchGoals,
    fetchAlerts,
    fetchExports,
    fetchIntegrations,
    fetchRealTimeData
  ]);

  // Cleanup real-time updates on unmount
  useEffect(() => {
    return () => {
      stopRealTimeUpdates();
    };
  }, [stopRealTimeUpdates]);

  return {
    // Dashboard
    dashboard,
    dashboardLoading,
    dashboardError,
    fetchDashboard,
    refreshDashboard,

    // Reports
    reports,
    reportsLoading,
    reportsError,
    reportsPagination,
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
    exportReport,
    scheduleReport,
    shareReport,

    // Metrics
    metrics,
    metricsLoading,
    metricsError,
    fetchMetrics,
    getMetricDetails,

    // Insights
    insights,
    insightsLoading,
    insightsError,
    fetchInsights,
    generateInsights,

    // Dashboards
    dashboards,
    currentDashboard,
    dashboardsLoading,
    dashboardsError,
    fetchDashboards,
    getDashboard,
    createDashboard,
    updateDashboard,
    deleteDashboard,

    // Segments
    segments,
    segmentsLoading,
    segmentsError,
    fetchSegments,
    createSegment,
    updateSegment,
    deleteSegment,

    // Funnels
    funnels,
    funnelsLoading,
    funnelsError,
    fetchFunnels,
    createFunnel,
    updateFunnel,
    deleteFunnel,

    // Cohorts
    cohorts,
    cohortsLoading,
    cohortsError,
    fetchCohorts,
    createCohort,
    updateCohort,
    deleteCohort,

    // Goals
    goals,
    goalsLoading,
    goalsError,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,

    // Alerts
    alerts,
    alertsLoading,
    alertsError,
    fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert,

    // Exports
    exports,
    exportsLoading,
    exportsError,
    fetchExports,
    createExport,
    downloadExport,

    // Integrations
    integrations,
    integrationsLoading,
    integrationsError,
    fetchIntegrations,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    testIntegration,

    // Real-time
    realTimeData,
    realTimeLoading,
    realTimeError,
    fetchRealTimeData,
    startRealTimeUpdates,
    stopRealTimeUpdates,

    // Utility
    refreshAll
  };
};

export default useAnalyticsAdvanced;
