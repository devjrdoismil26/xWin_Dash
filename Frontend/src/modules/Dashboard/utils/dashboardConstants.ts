/**
 * Constantes do módulo Dashboard
 *
 * @description
 * Constantes e enums para o módulo Dashboard incluindo tipos de widgets,
 * métricas, períodos, temas, layouts, status e configurações padrão.
 *
 * @module modules/Dashboard/utils/dashboardConstants
 * @since 1.0.0
 */

/**
 * Constantes do Dashboard
 *
 * @constant DASHBOARD_CONSTANTS
 * @description
 * Todas as constantes do módulo Dashboard organizadas por categoria.
 */
export const DASHBOARD_CONSTANTS: unknown = {
  // Tipos de widgets
  WIDGET_TYPES: ['metric', 'chart', 'table', 'list', 'gauge', 'progress'] as const,
  
  // Tipos de métricas
  METRIC_TYPES: ['leads', 'users', 'projects', 'campaigns', 'revenue'] as const,
  
  // Períodos de data
  DATE_RANGES: ['today', 'yesterday', '7days', '30days', '90days', '365days'] as const,
  
  // Temas disponíveis
  THEMES: ['light', 'dark', 'auto'] as const,
  
  // Layouts disponíveis
  LAYOUTS: ['grid', 'list', 'compact'] as const,
  
  // Status de widgets
  WIDGET_STATUS: ['active', 'inactive', 'loading', 'error'] as const,
  
  // Tipos de alertas
  ALERT_TYPES: ['info', 'warning', 'error', 'success'] as const,
  
  // Prioridades de alertas
  ALERT_PRIORITIES: ['low', 'medium', 'high', 'critical'] as const,
  
  // Intervalos de atualização (em ms)
  REFRESH_INTERVALS: {
    REALTIME: 1000,
    FAST: 5000,
    NORMAL: 30000,
    SLOW: 60000,
    VERY_SLOW: 300000
  },
  
  // Limites
  LIMITS: {
    MAX_WIDGETS: 20,
    MAX_ACTIVITIES: 100,
    MAX_EXPORT_SIZE: 10000,
    MAX_FILTERS: 10
  },
  
  // Configurações padrão
  DEFAULTS: {
    THEME: 'light',
    LAYOUT: 'grid',
    REFRESH_INTERVAL: 30000,
    AUTO_REFRESH: true,
    SHOW_ADVANCED_METRICS: false,
    DATE_RANGE: '30days'
  },
  
  // Cores para tendências
  TREND_COLORS: {
    UP: '#10B981',
    DOWN: '#EF4444',
    STABLE: '#6B7280'
  },
  
  // Cores para métricas
  METRIC_COLORS: {
    LEADS: '#3B82F6',
    USERS: '#8B5CF6',
    PROJECTS: '#F59E0B',
    CAMPAIGNS: '#10B981',
    REVENUE: '#EF4444'
  },
  
  // Tamanhos de widgets
  WIDGET_SIZES: {
    SMALL: { width: 1, height: 1 },
    MEDIUM: { width: 2, height: 1 },
    LARGE: { width: 2, height: 2 },
    XLARGE: { width: 4, height: 2 } ,
  
  // Tipos de exportação
  EXPORT_FORMATS: ['json', 'csv', 'xlsx', 'pdf'] as const,
  
  // Configurações de cache
  CACHE: {
    TTL: 300000, // 5 minutos
    MAX_SIZE: 100,
    ENABLED: true
  },
  
  // Configurações de API
  API: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  } as const;

export const DASHBOARD_CONFIG: unknown = {
  // Configurações de performance
  PERFORMANCE: {
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 1000,
    LAZY_LOAD_THRESHOLD: 100
  },
  
  // Configurações de UI
  UI: {
    ANIMATION_DURATION: 300,
    TRANSITION_DURATION: 500,
    LOADING_TIMEOUT: 10000
  },
  
  // Configurações de notificações
  NOTIFICATIONS: {
    AUTO_HIDE_DELAY: 5000,
    MAX_NOTIFICATIONS: 5,
    POSITION: 'top-right'
  } as const;

// Tipos derivados das constantes
export type WidgetType = typeof DASHBOARD_CONSTANTS.WIDGET_TYPES[number];
export type MetricType = typeof DASHBOARD_CONSTANTS.METRIC_TYPES[number];
export type DateRange = typeof DASHBOARD_CONSTANTS.DATE_RANGES[number];
export type Theme = typeof DASHBOARD_CONSTANTS.THEMES[number];
export type Layout = typeof DASHBOARD_CONSTANTS.LAYOUTS[number];
export type WidgetStatus = typeof DASHBOARD_CONSTANTS.WIDGET_STATUS[number];
export type AlertType = typeof DASHBOARD_CONSTANTS.ALERT_TYPES[number];
export type AlertPriority = typeof DASHBOARD_CONSTANTS.ALERT_PRIORITIES[number];
export type ExportFormat = typeof DASHBOARD_CONSTANTS.EXPORT_FORMATS[number];
