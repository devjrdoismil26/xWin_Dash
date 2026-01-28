// ========================================
// PRODUCTS MODULE - ANALYTICS TYPES
// ========================================

export interface AnalyticsDashboard {
  id: string;
  name: string;
  description: string;
  widgets: AnalyticsWidget[];
  layout: DashboardLayout;
  filters: AnalyticsFilter[];
  refreshInterval: number;
  isPublic: boolean;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsWidget {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  data: WidgetData;
  config: WidgetConfig;
  position: WidgetPosition;
  size: WidgetSize;
  refreshInterval: number;
  isVisible: boolean;
}

export interface WidgetData {
  source: DataSource;
  query: DataQuery;
  aggregation: DataAggregation;
  filters: DataFilter[];
  timeRange: TimeRange;
  groupBy: string[];
  metrics: Metric[];
}

export interface WidgetConfig {
  chartType: ChartType;
  colors: string[];
  showLegend: boolean;
  showGrid: boolean;
  showTooltip: boolean;
  animation: boolean;
  responsive: boolean;
  customOptions: Record<string, any>;
}

export interface WidgetPosition {
  x: number;
  y: number;
  z: number;
}

export interface WidgetSize {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gap: number;
  padding: number;
  backgroundColor: string;
  backgroundImage?: string;
}

export interface AnalyticsFilter {
  id: string;
  name: string;
  type: FilterType;
  field: string;
  operator: FilterOperator;
  value: any;
  isActive: boolean;
}

export enum WidgetType {
  METRIC = 'metric',
  CHART = 'chart',
  TABLE = 'table',
  HEATMAP = 'heatmap',
  FUNNEL = 'funnel',
  COHORT = 'cohort',
  RETENTION = 'retention',
  CONVERSION = 'conversion',
  REVENUE = 'revenue',
  TRAFFIC = 'traffic',
  ENGAGEMENT = 'engagement',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom'
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  DOUGHNUT = 'doughnut',
  AREA = 'area',
  SCATTER = 'scatter',
  RADAR = 'radar',
  POLAR = 'polar',
  BUBBLE = 'bubble',
  GAUGE = 'gauge',
  TREEMAP = 'treemap',
  SANKEY = 'sankey',
  WATERFALL = 'waterfall',
  CANDLESTICK = 'candlestick'
}

export enum DataSource {
  PRODUCTS = 'products',
  LANDING_PAGES = 'landing_pages',
  FORMS = 'forms',
  CONVERSIONS = 'conversions',
  TRAFFIC = 'traffic',
  USERS = 'users',
  SESSIONS = 'sessions',
  EVENTS = 'events',
  CUSTOM = 'custom'
}

export enum FilterType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  RANGE = 'range'
}

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  BETWEEN = 'between',
  NOT_BETWEEN = 'not_between',
  IN = 'in',
  NOT_IN = 'not_in',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null'
}

// ========================================
// METRICS & KPIs
// ========================================

export interface Metric {
  id: string;
  name: string;
  description: string;
  type: MetricType;
  calculation: MetricCalculation;
  unit: string;
  format: MetricFormat;
  target?: number;
  benchmark?: number;
  trend: TrendData;
  alerts: MetricAlert[];
}

export interface MetricCalculation {
  formula: string;
  fields: string[];
  aggregation: AggregationType;
  filters: DataFilter[];
  timeWindow: TimeWindow;
}

export interface MetricFormat {
  type: FormatType;
  decimals: number;
  prefix: string;
  suffix: string;
  thousandsSeparator: string;
  decimalSeparator: string;
}

export interface TrendData {
  direction: TrendDirection;
  percentage: number;
  period: string;
  isSignificant: boolean;
  confidence: number;
}

export interface MetricAlert {
  id: string;
  name: string;
  condition: AlertCondition;
  threshold: number;
  operator: AlertOperator;
  isActive: boolean;
  notifications: AlertNotification[];
}

export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  SUMMARY = 'summary'
}

export enum AggregationType {
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
  COUNT = 'count',
  COUNT_DISTINCT = 'count_distinct',
  MEDIAN = 'median',
  PERCENTILE = 'percentile',
  STDDEV = 'stddev',
  VARIANCE = 'variance'
}

export enum FormatType {
  NUMBER = 'number',
  CURRENCY = 'currency',
  PERCENTAGE = 'percentage',
  DURATION = 'duration',
  CUSTOM = 'custom'
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable'
}

export enum AlertCondition {
  ABOVE = 'above',
  BELOW = 'below',
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CHANGE = 'change',
  NO_CHANGE = 'no_change'
}

export enum AlertOperator {
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals'
}

// ========================================
// DATA QUERIES & FILTERS
// ========================================

export interface DataQuery {
  id: string;
  name: string;
  description: string;
  source: DataSource;
  fields: QueryField[];
  joins: QueryJoin[];
  where: QueryCondition[];
  groupBy: string[];
  having: QueryCondition[];
  orderBy: QueryOrder[];
  limit: number;
  offset: number;
  isCached: boolean;
  cacheTTL: number;
  lastExecuted: Date;
  executionTime: number;
}

export interface QueryField {
  name: string;
  alias?: string;
  function?: AggregationType;
  expression?: string;
}

export interface QueryJoin {
  table: string;
  type: JoinType;
  condition: string;
}

export interface QueryCondition {
  field: string;
  operator: FilterOperator;
  value: any;
  logic?: 'AND' | 'OR';
}

export interface QueryOrder {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface DataFilter {
  id: string;
  name: string;
  field: string;
  operator: FilterOperator;
  value: any;
  isActive: boolean;
  isRequired: boolean;
}

export interface TimeRange {
  start: Date;
  end: Date;
  granularity: TimeGranularity;
  timezone: string;
}

export interface TimeWindow {
  value: number;
  unit: TimeUnit;
  offset?: number;
}

export enum JoinType {
  INNER = 'inner',
  LEFT = 'left',
  RIGHT = 'right',
  FULL = 'full'
}

export enum TimeGranularity {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export enum TimeUnit {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year'
}

// ========================================
// CONVERSION TRACKING
// ========================================

export interface ConversionEvent {
  id: string;
  type: ConversionType;
  source: string;
  target: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  properties: Record<string, any>;
  value: number;
  currency: string;
  attribution: AttributionData;
}

export interface AttributionData {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  referrer: string;
  landingPage: string;
  firstTouch: Date;
  lastTouch: Date;
  touchpoints: Touchpoint[];
}

export interface Touchpoint {
  timestamp: Date;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  value: number;
  weight: number;
}

export interface ConversionFunnel {
  id: string;
  name: string;
  description: string;
  steps: FunnelStep[];
  metrics: FunnelMetrics;
  analysis: FunnelAnalysis;
  optimizations: FunnelOptimization[];
}

export interface FunnelStep {
  id: string;
  name: string;
  description: string;
  type: FunnelStepType;
  condition: string;
  order: number;
  metrics: StepMetrics;
}

export interface FunnelMetrics {
  totalVisitors: number;
  totalConversions: number;
  conversionRate: number;
  dropOffRate: number;
  avgTimeToConvert: number;
  revenue: number;
  cost: number;
  roi: number;
}

export interface FunnelAnalysis {
  bottlenecks: Bottleneck[];
  opportunities: Opportunity[];
  insights: Insight[];
  recommendations: Recommendation[];
}

export interface FunnelOptimization {
  id: string;
  name: string;
  description: string;
  type: OptimizationType;
  impact: ImpactLevel;
  effort: EffortLevel;
  implementation: string;
  expectedImprovement: number;
  status: OptimizationStatus;
}

export interface Bottleneck {
  step: string;
  dropOffRate: number;
  impact: ImpactLevel;
  causes: string[];
  solutions: string[];
}

export interface Opportunity {
  step: string;
  potential: number;
  impact: ImpactLevel;
  effort: EffortLevel;
  description: string;
}

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
  impact: ImpactLevel;
  data: Record<string, any>;
}

export interface Recommendation {
  type: RecommendationType;
  title: string;
  description: string;
  priority: Priority;
  impact: ImpactLevel;
  effort: EffortLevel;
  implementation: string;
  expectedResult: string;
}

export interface StepMetrics {
  visitors: number;
  conversions: number;
  conversionRate: number;
  dropOffRate: number;
  avgTimeOnStep: number;
  bounceRate: number;
}

export enum ConversionType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  FORM_SUBMIT = 'form_submit',
  PURCHASE = 'purchase',
  SIGNUP = 'signup',
  DOWNLOAD = 'download',
  SHARE = 'share',
  CUSTOM = 'custom'
}

export enum FunnelStepType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  FORM_SUBMIT = 'form_submit',
  PURCHASE = 'purchase',
  SIGNUP = 'signup',
  DOWNLOAD = 'download',
  SHARE = 'share',
  CUSTOM = 'custom'
}

export enum AnalyticsOptimizationType {
  CONTENT = 'content',
  DESIGN = 'design',
  UX = 'ux',
  PERFORMANCE = 'performance',
  SEO = 'seo',
  CONVERSION = 'conversion'
}

export enum AnalyticsImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum AnalyticsEffortLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum AnalyticsOptimizationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum InsightType {
  TREND = 'trend',
  PATTERN = 'pattern',
  ANOMALY = 'anomaly',
  CORRELATION = 'correlation',
  PREDICTION = 'prediction'
}

export enum RecommendationType {
  CONTENT = 'content',
  DESIGN = 'design',
  UX = 'ux',
  PERFORMANCE = 'performance',
  SEO = 'seo',
  CONVERSION = 'conversion',
  TECHNICAL = 'technical'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// ========================================
// HEATMAPS & USER BEHAVIOR
// ========================================

export interface HeatmapData {
  id: string;
  type: HeatmapType;
  pageId: string;
  data: HeatmapPoint[];
  metadata: HeatmapMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
  intensity: number;
  element: string;
  elementType: string;
  clicks?: number;
  hovers?: number;
  scrolls?: number;
}

export interface HeatmapMetadata {
  totalSessions: number;
  totalUsers: number;
  timeRange: TimeRange;
  deviceType: DeviceType;
  browser: string;
  resolution: string;
  viewport: ViewportSize;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface UserSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  pageViews: PageView[];
  events: SessionEvent[];
  device: DeviceInfo;
  location: LocationInfo;
  referrer: string;
  utm: UTMParameters;
  conversion: boolean;
  conversionValue: number;
}

export interface PageView {
  id: string;
  url: string;
  title: string;
  timestamp: Date;
  duration: number;
  scrollDepth: number;
  interactions: Interaction[];
}

export interface SessionEvent {
  id: string;
  type: EventType;
  name: string;
  timestamp: Date;
  properties: Record<string, any>;
  value: number;
}

export interface Interaction {
  type: InteractionType;
  element: string;
  timestamp: Date;
  position: Position;
  properties: Record<string, any>;
}

export interface DeviceInfo {
  type: DeviceType;
  os: string;
  browser: string;
  version: string;
  resolution: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface LocationInfo {
  country: string;
  region: string;
  city: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

export interface UTMParameters {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
}

export interface Position {
  x: number;
  y: number;
}

export enum HeatmapType {
  CLICK = 'click',
  MOVE = 'move',
  SCROLL = 'scroll',
  ATTENTION = 'attention',
  CONVERSION = 'conversion'
}

export enum DeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
  TV = 'tv',
  WEARABLE = 'wearable'
}

export enum EventType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  HOVER = 'hover',
  SCROLL = 'scroll',
  FORM_SUBMIT = 'form_submit',
  PURCHASE = 'purchase',
  SIGNUP = 'signup',
  DOWNLOAD = 'download',
  SHARE = 'share',
  CUSTOM = 'custom'
}

export enum InteractionType {
  CLICK = 'click',
  HOVER = 'hover',
  SCROLL = 'scroll',
  FOCUS = 'focus',
  BLUR = 'blur',
  INPUT = 'input',
  SUBMIT = 'submit',
  RESIZE = 'resize',
  CUSTOM = 'custom'
}

// ========================================
// ALERTS & NOTIFICATIONS
// ========================================

export interface AlertNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: Severity;
  isRead: boolean;
  createdAt: Date;
  actions: NotificationAction[];
}

export interface NotificationAction {
  id: string;
  label: string;
  type: ActionType;
  url?: string;
  data?: Record<string, any>;
}

export enum NotificationType {
  ALERT = 'alert',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ActionType {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  CUSTOM = 'custom'
}

// ========================================
// EXPORT ALL TYPES
// ========================================

export type {
  AnalyticsDashboard,
  AnalyticsWidget,
  WidgetData,
  WidgetConfig,
  WidgetPosition,
  WidgetSize,
  DashboardLayout,
  AnalyticsFilter,
  WidgetType,
  ChartType,
  DataSource,
  FilterType,
  FilterOperator,
  Metric,
  MetricCalculation,
  MetricFormat,
  TrendData,
  MetricAlert,
  MetricType,
  AggregationType,
  FormatType,
  TrendDirection,
  AlertCondition,
  AlertOperator,
  DataQuery,
  QueryField,
  QueryJoin,
  QueryCondition,
  QueryOrder,
  DataFilter,
  TimeRange,
  TimeWindow,
  JoinType,
  TimeGranularity,
  TimeUnit,
  ConversionEvent,
  AttributionData,
  Touchpoint,
  ConversionFunnel,
  FunnelStep,
  FunnelMetrics,
  FunnelAnalysis,
  FunnelOptimization,
  Bottleneck,
  Opportunity,
  Insight,
  Recommendation,
  StepMetrics,
  ConversionType,
  FunnelStepType,
  OptimizationType,
  ImpactLevel,
  EffortLevel,
  OptimizationStatus,
  InsightType,
  RecommendationType,
  Priority,
  HeatmapData,
  HeatmapPoint,
  HeatmapMetadata,
  ViewportSize,
  UserSession,
  PageView,
  SessionEvent,
  Interaction,
  DeviceInfo,
  LocationInfo,
  UTMParameters,
  Position,
  HeatmapType,
  DeviceType,
  EventType,
  InteractionType,
  AlertNotification,
  NotificationAction,
  NotificationType,
  Severity,
  ActionType
};
