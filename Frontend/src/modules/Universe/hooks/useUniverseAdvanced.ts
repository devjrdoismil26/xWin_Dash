import { useState, useEffect, useCallback } from 'react';
import universeService from '../services/universeService';
import { getErrorMessage } from '@/utils/errorHelpers';
import { UniverseInstance, UniverseSnapshot, UniverseTemplate, UniverseStats, UniverseFormData, UniverseFilters, UniverseActivity, UniverseBlock, UniverseCanvas, UniverseResponse } from '../services/universeService';

// ===== ANALYTICS INTERFACES =====
export interface UniverseAnalyticsOverview {
  totalInstances: number;
  activeInstances: number;
  totalTemplates: number;
  totalSnapshots: number;
  recentActivity: number;
  aiSuggestions: number;
  automationsRunning: number;
  performanceMetrics: {
    averageResponseTime: number;
  successRate: number;
  errorRate: number; };

  period: {
    start: string;
    end: string;};

}

export interface UniverseInstanceAnalytics {
  instanceId: number;
  instanceName: string;
  totalBlocks: number;
  totalConnections: number;
  executionCount: number;
  successRate: number;
  averageExecutionTime: number;
  lastExecution: string;
  errorCount: number;
  performance: {
    cpu: number;
  memory: number;
  storage: number; };

  period: {
    start: string;
    end: string;};

}

export interface UniversePerformanceAnalytics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  peakExecutionTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
  period: {
    start: string;
  end: string; };

  trends: {
    executions: Array<{ date: string; count: number }>;
    performance: Array<{ date: string; time: number }>;
    errors: Array<{ date: string; count: number }>;};

}

export interface UniverseUsageAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalInstances: number;
  activeInstances: number;
  totalTemplates: number;
  totalSnapshots: number;
  averageSessionTime: number;
  peakConcurrentUsers: number;
  period: {
    start: string;
  end: string; };

  usage: {
    byUser: Array<{ userId: number; userName: string; instances: number; sessions: number }>;
    byTemplate: Array<{ templateId: number; templateName: string; usage: number }>;
    byTime: Array<{ hour: number; users: number; instances: number }>;};

}

export interface UniverseErrorAnalytics {
  totalErrors: number;
  criticalErrors: number;
  warningErrors: number;
  infoErrors: number;
  errorRate: number;
  period: {
    start: string;
  end: string; };

  errors: {
    byType: Array<{ type: string; count: number; percentage: number }>;
    byInstance: Array<{ instanceId: number; instanceName: string; count: number }>;
    byTime: Array<{ date: string; count: number }>;};

  topErrors: Array<{
    id: string;
    message: string;
    count: number;
    lastOccurrence: string;
    instanceId: number;
  }>;
}

export interface UniverseTrendsAnalytics {
  period: {
    start: string;
  end: string; };

  trends: {
    instances: Array<{ date: string; count: number }>;
    users: Array<{ date: string; count: number }>;
    executions: Array<{ date: string; count: number }>;
    errors: Array<{ date: string; count: number }>;
    performance: Array<{ date: string; time: number }>;};

  growth: {
    instances: number;
    users: number;
    executions: number;
    errors: number;};

  predictions: {
    instances: Array<{ date: string; predicted: number; confidence: number }>;
    users: Array<{ date: string; predicted: number; confidence: number }>;
    executions: Array<{ date: string; predicted: number; confidence: number }>;};

}

export interface UniverseAnalyticsReport {
  id: string;
  name: string;
  description: string;
  type: 'overview' | 'performance' | 'usage' | 'errors' | 'trends' | 'custom';
  parameters: Record<string, any>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  enabled: boolean; };

  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'json';
  lastGenerated?: string;
  nextGeneration?: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface UniverseAnalyticsDashboard {
  id: string;
  name: string;
  description: string;
  widgets: Array<{
    id: string;
  type: 'chart' | 'metric' | 'table' | 'gauge' | 'map';
  title: string;
  configuration: Record<string, any>;
  position: { x: number;
  y: number;
  width: number;
  height: number;
};

  }>;
  layout: {
    columns: number;
    rows: number;
    gap: number;};

  isPublic: boolean;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UniverseAnalyticsAlert {
  id: string;
  name: string;
  description: string;
  condition: {
    metric: string;
  operator: '>' | '<' | '=' | '>=' | '<=' | '!=' | 'contains' | 'not_contains';
  value: unknown;
  threshold: number; };

  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notifications: {
    email: boolean;
    webhook: boolean;
    slack: boolean;
    teams: boolean;};

  recipients: string[];
  lastTriggered?: string;
  triggerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UniverseAnalyticsHealth {
  overall: 'healthy' | 'warning' | 'critical';
  score: number;
  checks: Array<{
    name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  lastCheck: string; }>;
  metrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    throughput: number;};

  recommendations: string[];
  lastCheck: string;
}

export interface UniverseAnalyticsStatus {
  system: 'online' | 'offline' | 'maintenance';
  instances: {
    total: number;
  active: number;
  inactive: number;
  suspended: number; };

  services: Array<{
    name: string;
    status: 'online' | 'offline' | 'degraded';
    responseTime: number;
    lastCheck: string;
  }>;
  performance: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;};

  lastUpdate: string;
}

// ===== HOOK RETURN TYPES =====
export interface UseUniverseAnalyticsReturn {
  overview: UniverseAnalyticsOverview | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>; }

export interface UseUniverseInstanceAnalyticsReturn {
  analytics: UniverseInstanceAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>; }

export interface UseUniversePerformanceAnalyticsReturn {
  performance: UniversePerformanceAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>; }

export interface UseUniverseUsageAnalyticsReturn {
  usage: UniverseUsageAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>; }

export interface UseUniverseErrorAnalyticsReturn {
  errors: UniverseErrorAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>; }

export interface UseUniverseTrendsAnalyticsReturn {
  trends: UniverseTrendsAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>; }

export interface UseUniverseAnalyticsReportsReturn {
  reports: UniverseAnalyticsReport[];
  loading: boolean;
  error: string | null;
  createReport: (data: Partial<UniverseAnalyticsReport>) => Promise<void>;
  updateReport: (id: string, data: Partial<UniverseAnalyticsReport>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  generateReport: (id: string) => Promise<void>;
  refetch: () => Promise<void>; }

export interface UseUniverseAnalyticsDashboardsReturn {
  dashboards: UniverseAnalyticsDashboard[];
  loading: boolean;
  error: string | null;
  createDashboard: (data: Partial<UniverseAnalyticsDashboard>) => Promise<void>;
  updateDashboard: (id: string, data: Partial<UniverseAnalyticsDashboard>) => Promise<void>;
  deleteDashboard: (id: string) => Promise<void>;
  refetch: () => Promise<void>; }

export interface UseUniverseAnalyticsAlertsReturn {
  alerts: UniverseAnalyticsAlert[];
  loading: boolean;
  error: string | null;
  createAlert: (data: Partial<UniverseAnalyticsAlert>) => Promise<void>;
  updateAlert: (id: string, data: Partial<UniverseAnalyticsAlert>) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  toggleAlert: (id: string, enabled: boolean) => Promise<void>;
  refetch: () => Promise<void>; }

export interface UseUniverseAnalyticsHealthReturn {
  health: UniverseAnalyticsHealth | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>; }

export interface UseUniverseAnalyticsStatusReturn {
  status: UniverseAnalyticsStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>; }

// ===== CUSTOM HOOKS =====
export const useUniverseAnalyticsOverview = (params: Record<string, any> = {}): UseUniverseAnalyticsReturn => {
  const [overview, setOverview] = useState<UniverseAnalyticsOverview | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await universeService.getAnalyticsOverview(params);

      if (response.success) {
        setOverview(response.data as UniverseAnalyticsOverview);

      } else {
        setError(response.error || 'Erro ao carregar overview');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [params]);

  useEffect(() => {
    fetchOverview();

  }, [fetchOverview]);

  return { overview, loading, error, refetch: fetchOverview};
};

export const useUniverseInstanceAnalytics = (instanceId: number, params: Record<string, any> = {}): UseUniverseInstanceAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<UniverseInstanceAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await universeService.getInstanceAnalytics(instanceId, params);

      if (response.success) {
        setAnalytics(response.data as UniverseInstanceAnalytics);

      } else {
        setError(response.error || 'Erro ao carregar analytics da instância');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [instanceId, params]);

  useEffect(() => {
    if (instanceId) {
      fetchAnalytics();

    } , [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics};
};

export const useUniversePerformanceAnalytics = (params: Record<string, any> = {}): UseUniversePerformanceAnalyticsReturn => {
  const [performance, setPerformance] = useState<UniversePerformanceAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await universeService.getPerformanceAnalytics(params);

      if (response.success) {
        setPerformance(response.data as UniversePerformanceAnalytics);

      } else {
        setError(response.error || 'Erro ao carregar analytics de performance');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [params]);

  useEffect(() => {
    fetchPerformance();

  }, [fetchPerformance]);

  return { performance, loading, error, refetch: fetchPerformance};
};

export const useUniverseUsageAnalytics = (params: Record<string, any> = {}): UseUniverseUsageAnalyticsReturn => {
  const [usage, setUsage] = useState<UniverseUsageAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await universeService.getUsageAnalytics(params);

      if (response.success) {
        setUsage(response.data as UniverseUsageAnalytics);

      } else {
        setError(response.error || 'Erro ao carregar analytics de uso');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [params]);

  useEffect(() => {
    fetchUsage();

  }, [fetchUsage]);

  return { usage, loading, error, refetch: fetchUsage};
};

export const useUniverseErrorAnalytics = (params: Record<string, any> = {}): UseUniverseErrorAnalyticsReturn => {
  const [errors, setErrors] = useState<UniverseErrorAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchErrors = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await universeService.getErrorAnalytics(params);

      if (response.success) {
        setErrors(response.data as UniverseErrorAnalytics);

      } else {
        setError(response.error || 'Erro ao carregar analytics de erros');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [params]);

  useEffect(() => {
    fetchErrors();

  }, [fetchErrors]);

  return { errors, loading, error, refetch: fetchErrors};
};

export const useUniverseTrendsAnalytics = (params: Record<string, any> = {}): UseUniverseTrendsAnalyticsReturn => {
  const [trends, setTrends] = useState<UniverseTrendsAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchTrends = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await universeService.getTrendsAnalytics(params);

      if (response.success) {
        setTrends(response.data as UniverseTrendsAnalytics);

      } else {
        setError(response.error || 'Erro ao carregar analytics de tendências');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [params]);

  useEffect(() => {
    fetchTrends();

  }, [fetchTrends]);

  return { trends, loading, error, refetch: fetchTrends};
};

export const useUniverseAnalyticsReports = (params: Record<string, any> = {}): UseUniverseAnalyticsReportsReturn => {
  const [reports, setReports] = useState<UniverseAnalyticsReport[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await universeService.getAnalyticsReports(params);

      if (response.success) {
        setReports(response.data as UniverseAnalyticsReport[]);

      } else {
        setError(response.error || 'Erro ao carregar relatórios');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [params]);

  const createReport = useCallback(async (data: Partial<UniverseAnalyticsReport>) => {
    const response = await universeService.createAnalyticsReport(data);

    if (response.success) {
      await fetchReports();

    } else {
      throw new Error(response.error || 'Erro ao criar relatório');

    } , [fetchReports]);

  const updateReport = useCallback(async (id: string, data: Partial<UniverseAnalyticsReport>) => {
    // Implementar updateReport no service
    await fetchReports();

  }, [fetchReports]);

  const deleteReport = useCallback(async (id: string) => {
    // Implementar deleteReport no service
    await fetchReports();

  }, [fetchReports]);

  const generateReport = useCallback(async (id: string) => {
    // Implementar generateReport no service
  }, []);

  useEffect(() => {
    fetchReports();

  }, [fetchReports]);

  return { 
    reports, 
    loading, 
    error, 
    createReport, 
    updateReport, 
    deleteReport, 
    generateReport, 
    refetch: fetchReports};
};

export const useUniverseAnalyticsDashboards = (params: Record<string, any> = {}): UseUniverseAnalyticsDashboardsReturn => {
  const [dashboards, setDashboards] = useState<UniverseAnalyticsDashboard[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchDashboards = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await universeService.getAnalyticsDashboards(params);

      if (response.success) {
        setDashboards(response.data as UniverseAnalyticsDashboard[]);

      } else {
        setError(response.error || 'Erro ao carregar dashboards');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [params]);

  const createDashboard = useCallback(async (data: Partial<UniverseAnalyticsDashboard>) => {
    const response = await universeService.createAnalyticsDashboard(data);

    if (response.success) {
      await fetchDashboards();

    } else {
      throw new Error(response.error || 'Erro ao criar dashboard');

    } , [fetchDashboards]);

  const updateDashboard = useCallback(async (id: string, data: Partial<UniverseAnalyticsDashboard>) => {
    // Implementar updateDashboard no service
    await fetchDashboards();

  }, [fetchDashboards]);

  const deleteDashboard = useCallback(async (id: string) => {
    // Implementar deleteDashboard no service
    await fetchDashboards();

  }, [fetchDashboards]);

  useEffect(() => {
    fetchDashboards();

  }, [fetchDashboards]);

  return { 
    dashboards, 
    loading, 
    error, 
    createDashboard, 
    updateDashboard, 
    deleteDashboard, 
    refetch: fetchDashboards};
};

export const useUniverseAnalyticsAlerts = (params: Record<string, any> = {}): UseUniverseAnalyticsAlertsReturn => {
  const [alerts, setAlerts] = useState<UniverseAnalyticsAlert[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await universeService.getAnalyticsAlerts(params);

      if (response.success) {
        setAlerts(response.data as UniverseAnalyticsAlert[]);

      } else {
        setError(response.error || 'Erro ao carregar alertas');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [params]);

  const createAlert = useCallback(async (data: Partial<UniverseAnalyticsAlert>) => {
    const response = await universeService.createAnalyticsAlert(data);

    if (response.success) {
      await fetchAlerts();

    } else {
      throw new Error(response.error || 'Erro ao criar alerta');

    } , [fetchAlerts]);

  const updateAlert = useCallback(async (id: string, data: Partial<UniverseAnalyticsAlert>) => {
    // Implementar updateAlert no service
    await fetchAlerts();

  }, [fetchAlerts]);

  const deleteAlert = useCallback(async (id: string) => {
    // Implementar deleteAlert no service
    await fetchAlerts();

  }, [fetchAlerts]);

  const toggleAlert = useCallback(async (id: string, enabled: boolean) => {
    await updateAlert(id, { enabled });

  }, [updateAlert]);

  useEffect(() => {
    fetchAlerts();

  }, [fetchAlerts]);

  return { 
    alerts, 
    loading, 
    error, 
    createAlert, 
    updateAlert, 
    deleteAlert, 
    toggleAlert, 
    refetch: fetchAlerts};
};

export const useUniverseAnalyticsHealth = (params: Record<string, any> = {}): UseUniverseAnalyticsHealthReturn => {
  const [health, setHealth] = useState<UniverseAnalyticsHealth | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await universeService.getAnalyticsHealth(params);

      if (response.success) {
        setHealth(response.data as UniverseAnalyticsHealth);

      } else {
        setError(response.error || 'Erro ao carregar saúde do sistema');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [params]);

  useEffect(() => {
    fetchHealth();

  }, [fetchHealth]);

  return { health, loading, error, refetch: fetchHealth};
};

export const useUniverseAnalyticsStatus = (params: Record<string, any> = {}): UseUniverseAnalyticsStatusReturn => {
  const [status, setStatus] = useState<UniverseAnalyticsStatus | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await universeService.getAnalyticsStatus(params);

      if (response.success) {
        setStatus(response.data as UniverseAnalyticsStatus);

      } else {
        setError(response.error || 'Erro ao carregar status do sistema');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , [params]);

  useEffect(() => {
    fetchStatus();

  }, [fetchStatus]);

  return { status, loading, error, refetch: fetchStatus};
};
