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
  isVisible: boolean; }

export interface WidgetData {
  source: DataSource;
  query: DataQuery;
  aggregation: DataAggregation;
  filters: DataFilter[];
  timeRange: TimeRange;
  groupBy: string[];
  metrics: Metric[];
  [key: string]: unknown; }

export interface WidgetConfig {
  chartType: ChartType;
  colors: string[];
  showLegend: boolean;
  showGrid: boolean;
  showTooltip: boolean;
  animation: boolean;
  responsive: boolean;
  customOptions: Record<string, any>;
  [key: string]: unknown; }

export interface WidgetPosition {
  x: number;
  y: number;
  z: number; }

export interface WidgetSize {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number; }

export type WidgetType = 'chart' | 'table' | 'metric' | 'map' | 'funnel' | 'heatmap' | 'gauge' | 'progress';
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'radar' | 'polar';
export type DataSource = 'products' | 'orders' | 'customers' | 'analytics' | 'custom';
export type DataQuery = Record<string, any>;
export type DataAggregation = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median';
export type DataFilter = Record<string, any>;
export type TimeRange = { start: Date; end: Date } | 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth';
export type Metric = { name: string; field: string; aggregation: DataAggregation};
