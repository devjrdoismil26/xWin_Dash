/**
 * Tipos consolidados para o módulo EmailMarketingCore
 * Funcionalidades básicas e dashboard
 */

// ===== CORE DATA INTERFACES =====
export interface EmailMarketingMetrics {
  total_campaigns: number;
  active_campaigns: number;
  total_templates: number;
  total_segments: number;
  total_subscribers: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  revenue_generated: number;
  campaigns_sent: number;
  emails_delivered: number;
  conversion_rate: number; }

export interface EmailMarketingStats {
  campaigns_by_status: Record<string, number>;
  campaigns_by_type: Record<string, number>;
  monthly_campaigns: Record<string, number>;
  templates_by_category: Record<string, number>;
  segments_by_type: Record<string, number>;
  subscribers_by_source: Record<string, number>;
  revenue_by_month: Record<string, number>; }

export interface EmailMarketingDashboard {
  metrics: EmailMarketingMetrics;
  stats: EmailMarketingStats;
  recent_activities: EmailMarketingActivity[];
  top_performers: {
    campaigns: EmailCampaign[];
  templates: EmailTemplate[];
  segments: EmailSegment[]; };

}

export interface EmailMarketingActivity {
  id: string;
  type: 'campaign' | 'template' | 'segment' | 'subscriber' | 'system';
  action: string;
  description: string;
  timestamp: string;
  user_id?: string;
  user_name?: string;
  metadata?: Record<string, any>; }

// ===== CORE INTERFACES =====
export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  type: 'regular' | 'automated' | 'ab_test' | 'remarketing';
  template_id?: string;
  segment_id?: string;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  metrics?: {
    sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  revenue: number; };

}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  usage_count: number;
  preview_url?: string; }

export interface EmailSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  subscriber_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string; }

export interface SegmentCriteria {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | number | boolean | null;
  logic?: 'and' | 'or'; }

export interface EmailSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'complained';
  source: string;
  subscribed_at: string;
  unsubscribed_at?: string;
  tags: string[];
  custom_fields: Record<string, any>; }

// ===== API RESPONSE INTERFACES =====
export interface EmailMarketingResponse {
  success: boolean;
  data?: Record<string, any>;
  message?: string;
  error?: string; }

export interface EmailMarketingMetricsResponse {
  success: boolean;
  data?: EmailMarketingMetrics;
  message?: string;
  error?: string; }

export interface EmailMarketingDashboardResponse {
  success: boolean;
  data?: EmailMarketingDashboard;
  message?: string;
  error?: string; }

// ===== UTILITY TYPES =====
export type EmailMarketingPeriod = 'today' | 'yesterday' | '7days' | '30days' | '90days' | '365days' | 'custom';

export interface DateRange {
  start: string;
  end: string; }

export interface EmailMarketingFilters {
  period?: EmailMarketingPeriod;
  dateRange?: DateRange;
  status?: string;
  type?: string;
  category?: string;
  [key: string]: unknown; }

export interface EmailMarketingSettings {
  theme: string;
  layout: string;
  auto_refresh: boolean;
  refresh_interval: number;
  show_advanced_metrics: boolean;
  notifications_enabled: boolean;
  real_time_enabled: boolean;
  [key: string]: unknown; }

// ===== HOOK RETURN TYPES =====
export interface UseEmailMarketingCoreReturn {
  metrics: EmailMarketingMetrics | null;
  stats: EmailMarketingStats | null;
  dashboard: EmailMarketingDashboard | null;
  loading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchDashboard: () => Promise<void>;
  refreshData: () => Promise<void>;
  getMetricsSummary: () => Record<string, any>;
  getPerformanceMetrics: () => Record<string, any>;
  getTrendAnalysis: () => Record<string, any>;
  formatMetrics: (metrics: EmailMarketingMetrics) => Record<string, any>;
  calculateGrowth: (current: number, previous: number) => number;
  getMetricTrend: (current: number, previous: number) => 'up' | 'down' | 'stable'; }

// ===== COMPONENT PROPS TYPES =====
export interface EmailMarketingDashboardProps {
  data?: EmailMarketingDashboard;
  loading?: boolean;
  error?: string;
  onRefresh???: (e: any) => void;
  onExport???: (e: any) => void;
  className?: string;
  [key: string]: unknown; }

export interface EmailMarketingHeaderProps {
  totalCampaigns: number;
  totalTemplates: number;
  totalSegments: number;
  totalSubscribers: number;
  onRefresh???: (e: any) => void;
  onExport???: (e: any) => void;
  className?: string;
  [key: string]: unknown; }

export interface EmailMarketingMetricsProps {
  metrics?: EmailMarketingMetrics;
  loading?: boolean;
  error?: string;
  className?: string;
  [key: string]: unknown; }

export interface EmailMarketingActionsProps {
  onCreateCampaign???: (e: any) => void;
  onCreateTemplate???: (e: any) => void;
  onCreateSegment???: (e: any) => void;
  onViewAnalytics???: (e: any) => void;
  className?: string;
  [key: string]: unknown; }
