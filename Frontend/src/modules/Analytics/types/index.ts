/**
 * Exportações centralizadas dos tipos do módulo Analytics
 */

// Re-exportar todos os tipos do arquivo principal
export * from './analyticsTypes';

// Re-exportações para conveniência
export type {
  AnalyticsMetricType,
  AnalyticsDeviceType,
  AnalyticsTrafficSource,
  AnalyticsReportType,
  AnalyticsPeriod,
  AnalyticsStatus,
  AnalyticsExportFormat,
  AnalyticsInsightType,
  AnalyticsMetric,
  AnalyticsDashboardData,
  AnalyticsChart,
  AnalyticsInsight,
  AnalyticsReport,
  AnalyticsFilters,
  AnalyticsRealTimeData,
  AnalyticsModuleStats,
  AnalyticsConfig,
  AnalyticsResponse,
  AnalyticsPagination,
  GoogleAnalyticsData,
  AnalyticsIntegration
} from './analyticsTypes';
export { AnalyticsActions };
