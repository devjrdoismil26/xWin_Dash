/**
 * Exportações centralizadas dos tipos do módulo EmailMarketingCore
 */

// Tipos principais
export * from './emailMarketingCoreTypes';

// Re-exportar tipos específicos para facilitar importação
export type {
  EmailMarketingMetrics,
  EmailMarketingStats,
  EmailMarketingDashboard,
  EmailMarketingActivity,
  EmailCampaign,
  EmailTemplate,
  EmailSegment,
  SegmentCriteria,
  EmailSubscriber,
  EmailMarketingResponse,
  EmailMarketingMetricsResponse,
  EmailMarketingDashboardResponse,
  EmailMarketingPeriod,
  DateRange,
  EmailMarketingFilters,
  EmailMarketingSettings,
  UseEmailMarketingCoreReturn,
  EmailMarketingDashboardProps,
  EmailMarketingHeaderProps,
  EmailMarketingMetricsProps,
  EmailMarketingActionsProps
} from './emailMarketingCoreTypes';
