/**
 * Exportações centralizadas dos tipos do módulo Dashboard
 */

// Tipos principais
export * from './dashboardTypes';

// Re-exportar tipos específicos para facilitar importação
export type {
  DashboardMetrics,
  DashboardWidget,
  DashboardFilters,
  DashboardSettings,
  DashboardStats,
  RecentActivity,
  TopLead,
  RecentProject,
  DashboardData,
  WidgetConfig,
  WidgetData,
  DashboardLayout,
  DashboardResponse,
  WidgetResponse,
  LayoutResponse,
  DashboardPeriod,
  DateRange,
  WidgetDataResponse,
  DashboardLayoutItem,
  DashboardShare,
  DashboardSubscription,
  DashboardAlert,
  UniverseDashboardData,
  UseDashboardMetricsReturn,
  UseDashboardWidgetsReturn
} from './dashboardTypes';

// Chart data types
export interface LeadsTrendData {
  date: string;
  leads: number;
  conversions: number;
  [key: string]: unknown; }

export interface ScoreDistributionData {
  score: string;
  count: number;
  percentage: number;
  [key: string]: unknown; }

export interface SegmentGrowthData {
  segment: string;
  current: number;
  previous: number;
  growth: number;
  [key: string]: unknown; }
