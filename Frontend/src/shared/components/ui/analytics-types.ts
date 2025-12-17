export interface MetricData {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
  format?: 'number' | 'currency' | 'percentage';
  unit?: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  trend?: Array<{ date: string;
  value: number
  [key: string]: unknown; }>;
}

export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap';
  data: string[];
  config?: {
    xAxis?: string;
  yAxis?: string;
  color?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  stacked?: boolean;
  [key: string]: unknown; };

  insights?: string[];
}

export interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  actionable: boolean;
  actionLabel?: string;
  onAction???: (e: any) => void;
  metrics?: string[];
  timeframe?: string; }

export interface Segment {
  id: string;
  name: string;
  description: string;
  size: number;
  growth: number;
  characteristics: Record<string, any>;
  metrics: Record<string, number>; }

export interface AdvancedAnalyticsProps {
  metrics?: MetricData[];
  charts?: ChartData[];
  insights?: Insight[];
  segments?: Segment[];
  loading?: boolean;
  error?: string;
  timeRange?: '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange??: (e: any) => void;
  onRefresh???: (e: any) => void;
  onExport???: (e: any) => void;
  className?: string;
  [key: string]: unknown; }
