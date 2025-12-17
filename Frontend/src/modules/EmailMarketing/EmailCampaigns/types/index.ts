/**
 * Exportações centralizadas dos tipos do módulo EmailCampaigns
 */

// Tipos principais
export * from './emailCampaignsTypes';

// Re-exportar tipos específicos para facilitar importação
export type {
  EmailCampaign,
  CampaignVariant,
  CampaignImage,
  CampaignMetrics,
  CampaignAnalytics,
  TimeSeriesData,
  LinkPerformance,
  DeviceStats,
  LocationStats,
  CampaignBuilder,
  CampaignBuilderData,
  CampaignBuilderErrors,
  CampaignResponse,
  CampaignAnalyticsResponse,
  CampaignFilters,
  CampaignSort,
  UseEmailCampaignsReturn,
  UseCampaignBuilderReturn,
  CampaignListProps,
  CampaignCreatorProps,
  CampaignAnalyticsProps,
  CampaignBuilderProps
} from './emailCampaignsTypes';
