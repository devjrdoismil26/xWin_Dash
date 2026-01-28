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
