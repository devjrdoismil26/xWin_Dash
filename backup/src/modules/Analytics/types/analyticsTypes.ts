/**
 * Tipos principais do módulo Analytics
 */

// Tipos de métricas
export type AnalyticsMetricType = 
  | 'page_views' 
  | 'unique_visitors' 
  | 'bounce_rate' 
  | 'avg_session_duration' 
  | 'conversion_rate' 
  | 'revenue' 
  | 'sessions' 
  | 'page_per_session' 
  | 'avg_time_on_page';

// Tipos de dispositivos
export type AnalyticsDeviceType = 'desktop' | 'mobile' | 'tablet';

// Tipos de fontes de tráfego
export type AnalyticsTrafficSource = 'google' | 'facebook' | 'direct' | 'referral' | 'social' | 'email' | 'organic' | 'paid';

// Tipos de relatórios
export type AnalyticsReportType = 'overview' | 'traffic' | 'conversions' | 'audience' | 'behavior' | 'acquisition' | 'real_time';

// Tipos de períodos
export type AnalyticsPeriod = 'today' | 'yesterday' | '7days' | '30days' | '90days' | '1year' | 'custom';

// Tipos de status
export type AnalyticsStatus = 'active' | 'inactive' | 'error' | 'loading' | 'pending';

// Tipos de formatos de exportação
export type AnalyticsExportFormat = 'json' | 'csv' | 'xlsx' | 'pdf';

// Tipos de insights
export type AnalyticsInsightType = 'trend' | 'anomaly' | 'opportunity' | 'warning' | 'success';

// Tipos de métricas
export type AnalyticsMetric = {
  id: string;
  name: string;
  type: AnalyticsMetricType;
  value: number;
  previous_value?: number;
  change_percentage?: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  description?: string;
  timestamp: string;
};

// Tipos de dados de dashboard
export type AnalyticsDashboardData = {
  id: string;
  metrics: AnalyticsMetric[];
  charts: AnalyticsChart[];
  insights: AnalyticsInsight[];
  real_time_data?: AnalyticsRealTimeData;
  last_updated: string;
  period: AnalyticsPeriod;
};

// Tipos de gráficos
export type AnalyticsChart = {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  title: string;
  data: any[];
  options?: any;
  period: AnalyticsPeriod;
  created_at: string;
};

// Tipos de insights
export type AnalyticsInsight = {
  id: string;
  type: AnalyticsInsightType;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  data: any;
  recommendations?: string[];
  created_at: string;
};

// Tipos de relatórios
export type AnalyticsReport = {
  id: string;
  name: string;
  type: AnalyticsReportType;
  description?: string;
  filters: AnalyticsFilters;
  data: any;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_public: boolean;
};

// Tipos de filtros
export type AnalyticsFilters = {
  date_range: AnalyticsPeriod;
  start_date?: string;
  end_date?: string;
  report_type: AnalyticsReportType;
  metrics?: AnalyticsMetricType[];
  devices?: AnalyticsDeviceType[];
  traffic_sources?: AnalyticsTrafficSource[];
  custom_filters?: Record<string, any>;
};

// Tipos de dados em tempo real
export type AnalyticsRealTimeData = {
  active_users: number;
  page_views: number;
  top_pages: Array<{
    page: string;
    views: number;
  }>;
  top_sources: Array<{
    source: string;
    users: number;
  }>;
  top_devices: Array<{
    device: AnalyticsDeviceType;
    users: number;
  }>;
  last_updated: string;
};

// Tipos de estatísticas de módulos
export type AnalyticsModuleStats = {
  total_reports: number;
  total_metrics: number;
  total_insights: number;
  active_reports: number;
  last_report_date?: string;
  most_used_metrics: AnalyticsMetricType[];
  performance_score: number;
};

// Tipos de configuração
export type AnalyticsConfig = {
  real_time_enabled: boolean;
  auto_refresh: boolean;
  refresh_interval: number;
  default_period: AnalyticsPeriod;
  default_report_type: AnalyticsReportType;
  notifications_enabled: boolean;
  export_format: AnalyticsExportFormat;
  theme: 'light' | 'dark' | 'auto';
};

// Tipos de resposta da API
export type AnalyticsResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    total?: number;
    page?: number;
    per_page?: number;
    last_updated?: string;
  };
};

// Tipos de paginação
export type AnalyticsPagination = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

// Tipos de dados de Google Analytics
export type GoogleAnalyticsData = {
  property_id: string;
  view_id: string;
  metrics: AnalyticsMetric[];
  dimensions: Array<{
    name: string;
    values: string[];
  }>;
  last_updated: string;
};

// Tipos de integração
export type AnalyticsIntegration = {
  id: string;
  name: string;
  type: 'google_analytics' | 'facebook_analytics' | 'custom';
  status: AnalyticsStatus;
  config: Record<string, any>;
  last_sync?: string;
  created_at: string;
  updated_at: string;
};
