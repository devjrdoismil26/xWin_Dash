/**
 * Exportações centralizadas dos hooks do módulo Analytics
 */

// Hook principal
export { useAnalytics } from './useAnalytics';

// Hooks especializados
export { useAnalyticsDashboard } from './useAnalyticsDashboard';
export { useAnalyticsFilters } from './useAnalyticsFilters';
export { useAnalyticsRealTime } from './useAnalyticsRealTime';
export { useAnalyticsReports } from './useAnalyticsReports';

// Store
export { 
  useAnalyticsStore,
  useAnalyticsDashboard as useAnalyticsDashboardStore,
  useAnalyticsReports as useAnalyticsReportsStore,
  useAnalyticsRealTime as useAnalyticsRealTimeStore,
  useAnalyticsFilters as useAnalyticsFiltersStore,
  useAnalyticsConfig,
  useAnalyticsState
} from './useAnalyticsStore';

// Hook do Google Analytics (se existir)
export { useGoogleAnalytics } from './useGoogleAnalytics';
