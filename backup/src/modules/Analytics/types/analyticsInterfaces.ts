// ========================================
// INTERFACES - ANALYTICS
// ========================================
// Interfaces específicas para o módulo Analytics

/**
 * Interface para configurações de analytics
 */
export interface AnalyticsConfig {
  enabled: boolean;
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
    prefix: string;
  };
  realtime: {
    enabled: boolean;
    websocketUrl: string;
    refreshInterval: number;
    maxConnections: number;
  };
  processing: {
    batchSize: number;
    chunkSize: number;
    maxExecutionTime: number;
  };
  export: {
    formats: string[];
    maxSize: number;
    timeout: number;
  };
  integrations: {
    googleAnalytics: {
      enabled: boolean;
      clientId?: string;
      clientSecret?: string;
      propertyId?: string;
      viewId?: string;
    };
    facebookAnalytics: {
      enabled: boolean;
      appId?: string;
      appSecret?: string;
      accessToken?: string;
    };
  };
  security: {
    rateLimiting: {
      enabled: boolean;
      maxRequests: number;
      decayMinutes: number;
    };
    dataEncryption: {
      enabled: boolean;
      algorithm: string;
      key?: string;
    };
  };
  monitoring: {
    enabled: boolean;
    metrics: {
      performance: boolean;
      errors: boolean;
      usage: boolean;
    };
    alerts: {
      enabled: boolean;
      thresholds: {
        responseTime: number;
        errorRate: number;
        memoryUsage: number;
      };
    };
  };
}

/**
 * Interface para dados de dashboard
 */
export interface AnalyticsDashboardData {
  id: string;
  name: string;
  description?: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: AnalyticsFilters;
  settings: DashboardSettings;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublic: boolean;
  isDefault: boolean;
}

/**
 * Interface para layout do dashboard
 */
export interface DashboardLayout {
  columns: number;
  rows: number;
  grid: GridItem[];
  breakpoints: {
    mobile: LayoutBreakpoint;
    tablet: LayoutBreakpoint;
    desktop: LayoutBreakpoint;
  };
}

/**
 * Interface para item do grid
 */
export interface GridItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  widgetId: string;
  locked?: boolean;
}

/**
 * Interface para breakpoint de layout
 */
export interface LayoutBreakpoint {
  columns: number;
  gutter: number;
  margin: number;
}

/**
 * Interface para widget do dashboard
 */
export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'insight' | 'table' | 'text' | 'image';
  title: string;
  description?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  data: any;
  config: WidgetConfig;
  refreshInterval?: number;
  lastUpdated?: string;
}

/**
 * Interface para configuração de widget
 */
export interface WidgetConfig {
  theme?: 'light' | 'dark' | 'auto';
  colors?: string[];
  showTitle?: boolean;
  showDescription?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  animation?: boolean;
  interactive?: boolean;
  exportable?: boolean;
  refreshable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
}

/**
 * Interface para configurações do dashboard
 */
export interface DashboardSettings {
  theme: 'light' | 'dark' | 'auto';
  autoRefresh: boolean;
  refreshInterval: number;
  realTimeEnabled: boolean;
  notificationsEnabled: boolean;
  exportEnabled: boolean;
  sharingEnabled: boolean;
  customCSS?: string;
  customJS?: string;
}

/**
 * Interface para dados de tempo real
 */
export interface RealTimeData {
  activeUsers: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: TopPage[];
  trafficSources: TrafficSource[];
  devices: DeviceData[];
  locations: LocationData[];
  events: RealTimeEvent[];
  lastUpdate: string;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

/**
 * Interface para página mais visitada
 */
export interface TopPage {
  path: string;
  title?: string;
  views: number;
  users: number;
  avgTimeOnPage: number;
  bounceRate: number;
  exitRate: number;
}

/**
 * Interface para fonte de tráfego
 */
export interface TrafficSource {
  source: string;
  medium?: string;
  campaign?: string;
  users: number;
  sessions: number;
  percentage: number;
  conversionRate: number;
  revenue: number;
}

/**
 * Interface para dados de dispositivo
 */
export interface DeviceData {
  device: string;
  category: 'desktop' | 'mobile' | 'tablet';
  users: number;
  sessions: number;
  percentage: number;
  avgSessionDuration: number;
  bounceRate: number;
}

/**
 * Interface para dados de localização
 */
export interface LocationData {
  country: string;
  region?: string;
  city?: string;
  users: number;
  sessions: number;
  percentage: number;
  avgSessionDuration: number;
  conversionRate: number;
}

/**
 * Interface para evento em tempo real
 */
export interface RealTimeEvent {
  id: string;
  type: 'page_view' | 'click' | 'scroll' | 'form_submit' | 'purchase' | 'custom';
  timestamp: string;
  userId?: string;
  sessionId: string;
  page: string;
  data: Record<string, any>;
  value?: number;
}

/**
 * Interface para dados de integração
 */
export interface IntegrationData {
  id: string;
  name: string;
  type: 'google_analytics' | 'facebook_analytics' | 'custom_api' | 'webhook';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  config: Record<string, any>;
  lastSync?: string;
  syncInterval: number;
  dataMapping: DataMapping[];
  credentials?: {
    encrypted: boolean;
    fields: string[];
  };
}

/**
 * Interface para mapeamento de dados
 */
export interface DataMapping {
  sourceField: string;
  targetField: string;
  transform?: 'none' | 'uppercase' | 'lowercase' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: any;
}

/**
 * Interface para dados de exportação
 */
export interface ExportData {
  id: string;
  name: string;
  format: 'json' | 'csv' | 'excel' | 'pdf';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  size?: number;
  url?: string;
  expiresAt?: string;
  createdAt: string;
  filters: AnalyticsFilters;
  options: ExportOptions;
}

/**
 * Interface para opções de exportação
 */
export interface ExportOptions {
  includeCharts: boolean;
  includeRawData: boolean;
  includeSummary: boolean;
  dateRange: string;
  customDateRange?: {
    start: string;
    end: string;
  };
  filters: string[];
  emailNotification: boolean;
  emailAddress?: string;
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
  };
}

/**
 * Interface para dados de agendamento
 */
export interface ScheduleData {
  id: string;
  name: string;
  type: 'report' | 'export' | 'insight' | 'notification';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time: string;
  timezone: string;
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
  config: Record<string, any>;
  notifications: NotificationConfig[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para configuração de notificação
 */
export interface NotificationConfig {
  type: 'email' | 'slack' | 'webhook' | 'sms' | 'push';
  enabled: boolean;
  config: Record<string, any>;
  recipients: string[];
  template?: string;
  conditions?: NotificationCondition[];
}

/**
 * Interface para condição de notificação
 */
export interface NotificationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
  logic?: 'and' | 'or';
}

/**
 * Interface para dados de performance
 */
export interface PerformanceData {
  id: string;
  timestamp: string;
  metrics: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
  };
  context: {
    endpoint: string;
    method: string;
    statusCode: number;
    userAgent: string;
    ip: string;
  };
}

/**
 * Interface para dados de auditoria
 */
export interface AuditData {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ip: string;
  userAgent: string;
  result: 'success' | 'failure' | 'error';
  duration?: number;
}

/**
 * Interface para dados de cache
 */
export interface CacheData {
  key: string;
  value: any;
  ttl: number;
  createdAt: string;
  expiresAt: string;
  hits: number;
  misses: number;
  size: number;
  compressed: boolean;
}

/**
 * Interface para dados de erro
 */
export interface ErrorData {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  stack?: string;
  context: {
    userId?: string;
    sessionId?: string;
    url?: string;
    userAgent?: string;
    ip?: string;
  };
  metadata: Record<string, any>;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export default {
  AnalyticsConfig,
  AnalyticsDashboardData,
  DashboardLayout,
  GridItem,
  LayoutBreakpoint,
  DashboardWidget,
  WidgetConfig,
  DashboardSettings,
  RealTimeData,
  TopPage,
  TrafficSource,
  DeviceData,
  LocationData,
  RealTimeEvent,
  IntegrationData,
  DataMapping,
  ExportData,
  ExportOptions,
  ScheduleData,
  NotificationConfig,
  NotificationCondition,
  PerformanceData,
  AuditData,
  CacheData,
  ErrorData
};