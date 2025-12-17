/**
 * Enums de Analytics
 * @module modules/Analytics/types/analyticsEnums
 * @description
 * Enums específicos para o módulo Analytics, incluindo tipos de métricas,
 * dispositivos, fontes de tráfego, gráficos, insights, períodos e muito mais.
 * @since 1.0.0
 */

/**
 * Enum MetricType - Tipos de Métricas
 * @enum {string}
 * @description
 * Enum para tipos de métricas de analytics disponíveis.
 */
export enum MetricType {
  PAGE_VIEWS = 'page_views',
  UNIQUE_VISITORS = 'unique_visitors',
  SESSIONS = 'sessions',
  BOUNCE_RATE = 'bounce_rate',
  AVG_SESSION_DURATION = 'avg_session_duration',
  CONVERSION_RATE = 'conversion_rate',
  REVENUE = 'revenue',
  TRANSACTIONS = 'transactions',
  NEW_VISITORS = 'new_visitors',
  RETURNING_VISITORS = 'returning_visitors',
  PAGE_LOAD_TIME = 'page_load_time',
  EXIT_RATE = 'exit_rate',
  CUSTOM_EVENTS = 'custom_events',
  GOAL_COMPLETIONS = 'goal_completions',
  ECOMMERCE_REVENUE = 'ecommerce_revenue',
  SOCIAL_INTERACTIONS = 'social_interactions'
}

/**
 * Enum para tipos de dispositivos
 */
export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  TV = 'tv',
  WEARABLE = 'wearable',
  CONSOLE = 'console',
  OTHER = 'other'
}

/**
 * Enum para fontes de tráfego
 */
export enum TrafficSource {
  ORGANIC = 'organic',
  DIRECT = 'direct',
  SOCIAL = 'social',
  EMAIL = 'email',
  PAID = 'paid',
  REFERRAL = 'referral',
  DISPLAY = 'display',
  VIDEO = 'video',
  AFFILIATE = 'affiliate',
  CPM = 'cpm',
  CPC = 'cpc',
  OTHER = 'other'
}

/**
 * Enum para tipos de gráficos
 */
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  AREA = 'area',
  SCATTER = 'scatter',
  DONUT = 'donut',
  RADAR = 'radar',
  HEATMAP = 'heatmap',
  TREEMAP = 'treemap',
  SANKEY = 'sankey',
  FUNNEL = 'funnel',
  GAUGE = 'gauge',
  WATERFALL = 'waterfall',
  CANDLESTICK = 'candlestick',
  BUBBLE = 'bubble'
}

/**
 * Enum para tipos de insights
 */
export enum InsightType {
  TREND = 'trend',
  ANOMALY = 'anomaly',
  OPPORTUNITY = 'opportunity',
  WARNING = 'warning',
  SUCCESS = 'success',
  PREDICTION = 'prediction',
  CORRELATION = 'correlation',
  SEGMENTATION = 'segmentation',
  COHORT = 'cohort',
  FUNNEL = 'funnel',
  RETENTION = 'retention',
  CHURN = 'churn'
}

/**
 * Enum para níveis de impacto
 */
export enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Enum para tendências
 */
export enum Trend {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
  VOLATILE = 'volatile'
}

/**
 * Enum para períodos de tempo
 */
export enum DateRange {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = '7days',
  LAST_30_DAYS = '30days',
  LAST_90_DAYS = '90days',
  LAST_365_DAYS = '365days',
  THIS_WEEK = 'this_week',
  LAST_WEEK = 'last_week',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  THIS_QUARTER = 'this_quarter',
  LAST_QUARTER = 'last_quarter',
  THIS_YEAR = 'this_year',
  LAST_YEAR = 'last_year',
  CUSTOM = 'custom'
}

/**
 * Enum para tipos de relatórios
 */
export enum ReportType {
  OVERVIEW = 'overview',
  TRAFFIC = 'traffic',
  CONVERSIONS = 'conversions',
  AUDIENCE = 'audience',
  BEHAVIOR = 'behavior',
  ACQUISITION = 'acquisition',
  ECOMMERCE = 'ecommerce',
  GOALS = 'goals',
  CUSTOM = 'custom'
}

/**
 * Enum para formatos de exportação
 */
export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  EXCEL = 'excel',
  PDF = 'pdf',
  XML = 'xml',
  HTML = 'html',
  PNG = 'png',
  JPEG = 'jpeg',
  SVG = 'svg'
}

/**
 * Enum para frequências de agendamento
 */
export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

/**
 * Enum para status de processamento
 */
export enum ProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
  RETRYING = 'retrying'
}

/**
 * Enum para tipos de notificação
 */
export enum NotificationType {
  EMAIL = 'email',
  SLACK = 'slack',
  WEBHOOK = 'webhook',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  DISCORD = 'discord',
  TEAMS = 'teams'
}

/**
 * Enum para tipos de integração
 */
export enum IntegrationType {
  GOOGLE_ANALYTICS = 'google_analytics',
  FACEBOOK_ANALYTICS = 'facebook_analytics',
  TWITTER_ANALYTICS = 'twitter_analytics',
  LINKEDIN_ANALYTICS = 'linkedin_analytics',
  INSTAGRAM_ANALYTICS = 'instagram_analytics',
  YOUTUBE_ANALYTICS = 'youtube_analytics',
  TIKTOK_ANALYTICS = 'tiktok_analytics',
  CUSTOM_API = 'custom_api',
  WEBHOOK = 'webhook',
  DATABASE = 'database',
  FILE_IMPORT = 'file_import'
}

/**
 * Enum para tipos de eventos
 */
export enum EventType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  SCROLL = 'scroll',
  FORM_SUBMIT = 'form_submit',
  PURCHASE = 'purchase',
  SIGN_UP = 'sign_up',
  LOGIN = 'login',
  LOGOUT = 'logout',
  SEARCH = 'search',
  DOWNLOAD = 'download',
  VIDEO_PLAY = 'video_play',
  VIDEO_PAUSE = 'video_pause',
  VIDEO_COMPLETE = 'video_complete',
  CUSTOM = 'custom'
}

/**
 * Enum para tipos de segmentos
 */
export enum SegmentType {
  DEMOGRAPHIC = 'demographic',
  BEHAVIORAL = 'behavioral',
  GEOGRAPHIC = 'geographic',
  TECHNOLOGICAL = 'technological',
  TEMPORAL = 'temporal',
  CUSTOM = 'custom'
}

/**
 * Enum para tipos de funis
 */
export enum FunnelType {
  CONVERSION = 'conversion',
  RETENTION = 'retention',
  CHURN = 'churn',
  ENGAGEMENT = 'engagement',
  MONETIZATION = 'monetization',
  CUSTOM = 'custom'
}

/**
 * Enum para tipos de coortes
 */
export enum CohortType {
  ACQUISITION = 'acquisition',
  BEHAVIORAL = 'behavioral',
  RETENTION = 'retention',
  REVENUE = 'revenue',
  CUSTOM = 'custom'
}

/**
 * Enum para tipos de alertas
 */
export enum AlertType {
  THRESHOLD = 'threshold',
  ANOMALY = 'anomaly',
  TREND = 'trend',
  GOAL = 'goal',
  ERROR = 'error',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom'
}

/**
 * Enum para severidade de alertas
 */
export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Enum para tipos de widgets
 */
export enum WidgetType {
  METRIC = 'metric',
  CHART = 'chart',
  TABLE = 'table',
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  MAP = 'map',
  CALENDAR = 'calendar',
  PROGRESS = 'progress',
  GAUGE = 'gauge',
  KPI = 'kpi',
  CUSTOM = 'custom'
}

/**
 * Enum para temas
 */
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
  CUSTOM = 'custom'
}

/**
 * Enum para tipos de cache
 */
export enum CacheType {
  MEMORY = 'memory',
  REDIS = 'redis',
  DATABASE = 'database',
  FILE = 'file',
  CDN = 'cdn'
}

/**
 * Enum para tipos de compressão
 */
export enum CompressionType {
  NONE = 'none',
  GZIP = 'gzip',
  BROTLI = 'brotli',
  DEFLATE = 'deflate',
  LZ4 = 'lz4'
}

/**
 * Enum para tipos de criptografia
 */
export enum EncryptionType {
  NONE = 'none',
  AES_256_CBC = 'aes_256_cbc',
  AES_256_GCM = 'aes_256_gcm',
  RSA_2048 = 'rsa_2048',
  RSA_4096 = 'rsa_4096'
}

/**
 * Enum para tipos de autenticação
 */
export enum AuthType {
  NONE = 'none',
  BASIC = 'basic',
  BEARER = 'bearer',
  API_KEY = 'api_key',
  OAUTH2 = 'oauth2',
  JWT = 'jwt'
}

/**
 * Enum para tipos de validação
 */
export enum ValidationType {
  REQUIRED = 'required',
  EMAIL = 'email',
  URL = 'url',
  NUMBER = 'number',
  DATE = 'date',
  REGEX = 'regex',
  CUSTOM = 'custom'
}

/**
 * Enum para tipos de transformação
 */
export enum TransformType {
  NONE = 'none',
  UPPERCASE = 'uppercase',
  LOWERCASE = 'lowercase',
  TRIM = 'trim',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  JSON = 'json',
  CUSTOM = 'custom'
}

export default {
  MetricType,
  DeviceType,
  TrafficSource,
  ChartType,
  InsightType,
  ImpactLevel,
  Trend,
  DateRange,
  ReportType,
  ExportFormat,
  ScheduleFrequency,
  ProcessingStatus,
  NotificationType,
  IntegrationType,
  EventType,
  SegmentType,
  FunnelType,
  CohortType,
  AlertType,
  AlertSeverity,
  WidgetType,
  Theme,
  CacheType,
  CompressionType,
  EncryptionType,
  AuthType,
  ValidationType,
  TransformType};
