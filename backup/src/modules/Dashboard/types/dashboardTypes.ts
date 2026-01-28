// ===== DASHBOARD MODULE - CONSOLIDATED TYPES =====

// ===== CORE DATA INTERFACES =====
export interface DashboardMetrics {
  total_leads: number;
  total_users: number;
  total_projects: number;
  active_projects: number;
  total_campaigns: number;
  total_revenue: number;
  conversion_rate: number;
  leads_growth: number;
  users_growth: number;
  projects_growth: number;
  campaigns_growth: number;
  revenue_growth: number;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  data: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
  settings: any;
}

export interface DashboardFilters {
  date_range: string;
  project_id?: string;
  user_id?: string;
  campaign_id?: string;
  metric_type?: string;
}

export interface DashboardSettings {
  theme: string;
  layout: string;
  auto_refresh: boolean;
  refresh_interval: number;
  show_advanced_metrics: boolean;
}

// ===== MODULE-SPECIFIC INTERFACES =====
export interface ADSPerformanceData {
  clicks?: number;
  impressions?: number;
  ctr?: number;
  cpc?: number;
  cost?: number;
}

export interface AIProcessingData {
  processedItems?: number;
  accuracy?: number;
  processingTime?: number;
  status?: 'processing' | 'completed' | 'error';
}

export interface AnalyticsOverviewData {
  totalViews?: number;
  uniqueVisitors?: number;
  bounceRate?: number;
  avgSessionDuration?: number;
}

export interface AuraConversationsData {
  totalConversations?: number;
  activeConversations?: number;
  avgResponseTime?: number;
  satisfaction?: number;
}

export interface EmailMarketingData {
  sent?: number;
  delivered?: number;
  opened?: number;
  clicked?: number;
  unsubscribed?: number;
}

export interface MediaLibraryData {
  totalFiles?: number;
  totalSize?: number;
  recentUploads?: number;
  storageUsed?: number;
}

export interface ProductsPerformanceData {
  totalProducts?: number;
  activeProducts?: number;
  totalSales?: number;
  avgRating?: number;
}

export interface SocialBufferData {
  scheduledPosts?: number;
  publishedPosts?: number;
  engagement?: number;
  reach?: number;
}

export interface UniverseData {
  totalUsers?: number;
  activeUsers?: number;
  newUsers?: number;
  retention?: number;
}

export interface WorkflowsStatusData {
  totalWorkflows?: number;
  activeWorkflows?: number;
  completedWorkflows?: number;
  failedWorkflows?: number;
}

export interface CalendarIntegrationData {
  totalEvents?: number;
  upcomingEvents?: number;
  completedEvents?: number;
  cancelledEvents?: number;
}

export interface ProjectsStatsData {
  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;
  overdueProjects?: number;
}

// ===== COMPONENT PROPS TYPES =====
export interface DashboardExportButtonProps {
  onExport: () => void;
}

export interface DashboardMetricsCardsProps {
  metrics?: DashboardMetrics;
}

export interface DashboardPeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  periods: string[];
}

export interface DashboardSelectorProps {
  selectedDashboard: string;
  onDashboardChange: (dashboard: string) => void;
  dashboards: string[];
}

export interface WidgetProps {
  data?: any;
  loading?: boolean;
  error?: string;
}

export interface ChartProps {
  data: any[];
  loading?: boolean;
  error?: string;
}

export interface RecentActivitiesProps {
  activities: RecentActivity[];
  loading?: boolean;
  error?: string;
}

export interface ProjectsStatsSummaryProps {
  stats: ProjectsStatsData;
  loading?: boolean;
  error?: string;
}

export interface DashboardStats {
  leads_by_status: Record<string, number>;
  leads_by_source: Record<string, number>;
  monthly_leads: Record<string, number>;
  projects_by_status: Record<string, number>;
  users_by_role: Record<string, number>;
  revenue_by_month: Record<string, number>;
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  count: number;
  timestamp: string;
  type: 'lead' | 'project' | 'user' | 'campaign' | 'system';
  user_id?: string;
  user_name?: string;
  metadata?: any;
}

export interface TopLead {
  id: number;
  name: string;
  email: string;
  score: number;
  status: string;
  source: string;
  created_at: string;
  last_activity_at?: string;
}

export interface RecentProject {
  id: number;
  name: string;
  description: string;
  status: string;
  owner_id: number;
  created_at: string;
  updated_at?: string;
  deadline?: string;
  progress?: number;
  owner?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recent_activities: RecentActivity[];
  top_leads: TopLead[];
  recent_projects: RecentProject[];
  stats: DashboardStats;
}

// ===== WIDGET INTERFACES =====
export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number; w: number; h: number };
  visible: boolean;
  settings: Record<string, any>;
}

export interface WidgetData {
  [key: string]: any;
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
  columns: number;
  gap: number;
}

// ===== API RESPONSE INTERFACES =====
export interface DashboardResponse {
  success: boolean;
  data?: DashboardData | any;
  message?: string;
  error?: string;
}

export interface WidgetResponse {
  success: boolean;
  data?: WidgetData | any;
  message?: string;
  error?: string;
}

export interface LayoutResponse {
  success: boolean;
  data?: DashboardLayout;
  message?: string;
  error?: string;
}

// ===== UTILITY TYPES =====
export type DashboardPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface DateRange {
  start: string;
  end: string;
}

export interface DashboardFilters {
  period?: DashboardPeriod;
  dateRange?: DateRange;
  status?: string;
  source?: string;
  [key: string]: any;
}

// ===== NEW ENDPOINT INTERFACES =====
export interface WidgetDataResponse {
  widget_id: string;
  data: any;
  last_updated: string;
  refresh_interval: number;
  cache_expires_at: string;
}

export interface DashboardLayoutItem {
  id: string;
  name: string;
  description?: string;
  widgets: WidgetConfig[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface DashboardShare {
  id: string;
  token: string;
  dashboard_id: string;
  permissions: {
    view: boolean;
    edit: boolean;
    export: boolean;
  };
  expires_at?: string;
  created_at: string;
  created_by: string;
  access_count: number;
  last_accessed_at?: string;
}

export interface DashboardSubscription {
  id: string;
  user_id: string;
  dashboard_id: string;
  notification_types: string[];
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardAlert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  created_at: string;
  read_at?: string;
  metadata?: any;
}

export interface UniverseDashboardData {
  instances: {
    total: number;
    active: number;
    inactive: number;
  };
  performance: {
    avg_response_time: number;
    success_rate: number;
    error_rate: number;
  };
  recent_activities: RecentActivity[];
  system_health: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    last_check: string;
  };
}

// ===== HOOK RETURN TYPES =====
export interface UseDashboardMetricsReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  fetchOverview: () => Promise<void>;
  refreshData: () => Promise<void>;
  getGrowthPercentage: (current: number, previous: number) => number;
  getConversionRate: (converted: number, total: number) => number;
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
  formatPercentage: (value: number) => string;
  getMetricTrend: (current: number, previous: number) => 'up' | 'down' | 'stable';
  getMetricColor: (trend: 'up' | 'down' | 'stable', isPositive?: boolean) => string;
  getMetricIcon: (trend: 'up' | 'down' | 'stable') => string;
  calculateKPIs: () => any;
  getTopPerformers: () => { topLeads: TopLead[]; topProjects: RecentProject[] };
  getActivitySummary: () => any;
}

export interface UseDashboardWidgetsReturn {
  layout: DashboardLayout;
  widgetData: WidgetData;
  loading: boolean;
  error: string | null;
  fetchWidgetData: (widgetId: string) => Promise<void>;
  fetchAllWidgetData: () => Promise<void>;
  updateWidgetConfig: (widgetId: string, config: Partial<WidgetConfig>) => Promise<void>;
  updateWidgetPosition: (widgetId: string, position: { x: number; y: number; w: number; h: number }) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  addWidget: (widget: Omit<WidgetConfig, 'id'>) => void;
  removeWidget: (widgetId: string) => void;
  resetLayout: () => void;
  saveLayout: () => Promise<boolean>;
  loadLayout: () => Promise<void>;
  getWidgetById: (widgetId: string) => WidgetConfig | undefined;
  getVisibleWidgets: () => WidgetConfig[];
  getWidgetData: (widgetId: string) => any;
  refreshWidget: (widgetId: string) => Promise<void>;
  refreshAllWidgets: () => Promise<void>;
  exportWidgetData: (widgetId: string) => string;
  exportAllWidgetData: () => string;
}
