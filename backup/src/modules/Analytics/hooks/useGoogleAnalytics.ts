import { useState, useCallback } from 'react';

export interface GoogleAnalyticsConfig {
  propertyId: string;
  accessToken: string;
  baseUrl?: string;
}

export interface GoogleAnalyticsMetrics {
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
  engagedSessions: number;
  bounceRate: number;
  averageSessionDuration: number;
  newUsers: number;
  totalUsers: number;
  conversions: number;
  revenue: number;
  eventCount: number;
}

export interface GoogleAnalyticsDimension {
  date?: string;
  country?: string;
  city?: string;
  deviceCategory?: string;
  operatingSystem?: string;
  browser?: string;
  pagePath?: string;
  pageTitle?: string;
  sessionDefaultChannelGrouping?: string;
  sessionSource?: string;
  eventName?: string;
}

export interface GoogleAnalyticsReport {
  totals: GoogleAnalyticsMetrics;
  rows: Array<GoogleAnalyticsDimension & GoogleAnalyticsMetrics>;
  metadata: {
    metrics: Array<{ name: string }>;
    dimensions: Array<{ name: string }>;
  };
}

export interface GoogleAnalyticsFilters {
  dimension: string;
  operator: 'EXACT' | 'BEGINS_WITH' | 'ENDS_WITH' | 'CONTAINS' | 'REGEXP';
  value: string;
}

export const useGoogleAnalytics = () => {
  const [config, setConfig] = useState<GoogleAnalyticsConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const setConfiguration = useCallback((newConfig: GoogleAnalyticsConfig) => {
    setConfig(newConfig);
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    if (!config) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/analytics/google/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setIsConnected(result.connected);
      return result.connected;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao testar conexão';
      setError(errorMessage);
      setIsConnected(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [config]);

  const getReport = useCallback(async (
    metrics: string[] = ['activeUsers', 'sessions'],
    dimensions: string[] = ['date'],
    startDate: string = '7daysAgo',
    endDate: string = 'today',
    filters: GoogleAnalyticsFilters[] = []
  ): Promise<GoogleAnalyticsReport | null> => {
    if (!config) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/analytics/google/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({
          config,
          metrics,
          dimensions,
          startDate,
          endDate,
          filters,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter relatório';
      setError(errorMessage);
      console.error('Error fetching Google Analytics report:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [config]);

  const getTopPages = useCallback(async (
    limit: number = 10,
    startDate: string = '30daysAgo',
    endDate: string = 'today'
  ): Promise<GoogleAnalyticsReport | null> => {
    return getReport(
      ['screenPageViews', 'activeUsers'],
      ['pagePath', 'pageTitle'],
      startDate,
      endDate
    );
  }, [getReport]);

  const getTrafficSources = useCallback(async (
    startDate: string = '30daysAgo',
    endDate: string = 'today'
  ): Promise<GoogleAnalyticsReport | null> => {
    return getReport(
      ['sessions', 'activeUsers', 'engagedSessions'],
      ['sessionDefaultChannelGrouping', 'sessionSource'],
      startDate,
      endDate
    );
  }, [getReport]);

  const getRealTimeMetrics = useCallback(async (): Promise<GoogleAnalyticsReport | null> => {
    if (!config) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/analytics/google/realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ config }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter métricas em tempo real';
      setError(errorMessage);
      console.error('Error fetching real-time metrics:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [config]);

  const getCustomEvents = useCallback(async (
    eventName: string,
    startDate: string = '7daysAgo',
    endDate: string = 'today'
  ): Promise<GoogleAnalyticsReport | null> => {
    return getReport(
      ['eventCount', 'totalUsers'],
      ['eventName', 'date'],
      startDate,
      endDate,
      [
        {
          dimension: 'eventName',
          operator: 'EXACT',
          value: eventName,
        },
      ]
    );
  }, [getReport]);

  const getPropertyInfo = useCallback(async (): Promise<any> => {
    if (!config) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/analytics/google/property-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ config }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter informações da propriedade';
      setError(errorMessage);
      console.error('Error fetching property info:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [config]);

  const saveConfiguration = useCallback(async (): Promise<boolean> => {
    if (!config) return false;

    try {
      const response = await fetch('/api/v1/analytics/google/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      console.error('Error saving Google Analytics configuration:', err);
      return false;
    }
  }, [config]);

  const loadConfiguration = useCallback(async (): Promise<GoogleAnalyticsConfig | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/analytics/google/config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const loadedConfig = result.data;
      
      if (loadedConfig) {
        setConfig(loadedConfig);
        setIsConnected(true);
      }
      
      return loadedConfig;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar configuração';
      setError(errorMessage);
      console.error('Error loading Google Analytics configuration:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper functions
  const formatMetricValue = useCallback((metric: string, value: number): string => {
    const formatters: Record<string, (val: number) => string> = {
      'activeUsers': (val) => new Intl.NumberFormat('pt-BR').format(val),
      'sessions': (val) => new Intl.NumberFormat('pt-BR').format(val),
      'screenPageViews': (val) => new Intl.NumberFormat('pt-BR').format(val),
      'engagedSessions': (val) => new Intl.NumberFormat('pt-BR').format(val),
      'bounceRate': (val) => new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(val / 100),
      'averageSessionDuration': (val) => {
        const minutes = Math.floor(val / 60);
        const seconds = Math.floor(val % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      },
      'newUsers': (val) => new Intl.NumberFormat('pt-BR').format(val),
      'totalUsers': (val) => new Intl.NumberFormat('pt-BR').format(val),
      'conversions': (val) => new Intl.NumberFormat('pt-BR').format(val),
      'revenue': (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val),
      'eventCount': (val) => new Intl.NumberFormat('pt-BR').format(val),
    };

    return formatters[metric]?.(value) || new Intl.NumberFormat('pt-BR').format(value);
  }, []);

  const getMetricIcon = useCallback((metric: string): string => {
    const icons: Record<string, string> = {
      'activeUsers': 'Users',
      'sessions': 'Activity',
      'screenPageViews': 'Eye',
      'engagedSessions': 'Zap',
      'bounceRate': 'TrendingDown',
      'averageSessionDuration': 'Clock',
      'newUsers': 'UserPlus',
      'totalUsers': 'Users',
      'conversions': 'Target',
      'revenue': 'DollarSign',
      'eventCount': 'BarChart3',
    };
    return icons[metric] || 'BarChart3';
  }, []);

  const getMetricColor = useCallback((metric: string): string => {
    const colors: Record<string, string> = {
      'activeUsers': 'blue',
      'sessions': 'green',
      'screenPageViews': 'purple',
      'engagedSessions': 'orange',
      'bounceRate': 'red',
      'averageSessionDuration': 'indigo',
      'newUsers': 'emerald',
      'totalUsers': 'blue',
      'conversions': 'green',
      'revenue': 'yellow',
      'eventCount': 'purple',
    };
    return colors[metric] || 'gray';
  }, []);

  return {
    // State
    config,
    loading,
    error,
    isConnected,
    
    // Actions
    setConfiguration,
    testConnection,
    getReport,
    getTopPages,
    getTrafficSources,
    getRealTimeMetrics,
    getCustomEvents,
    getPropertyInfo,
    saveConfiguration,
    loadConfiguration,
    
    // Helpers
    formatMetricValue,
    getMetricIcon,
    getMetricColor,
  };
};
