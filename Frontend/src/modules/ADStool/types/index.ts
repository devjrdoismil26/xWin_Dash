/**
 * Exportações centralizadas dos tipos do ADStool
 */

// Tipos principais
export type { AdsAccount, AdsAccountStatus, AdsPlatform } from './adsAccountTypes';
export type { AdsCampaign, AdsCampaignStatus, AdsObjective, AdsTargeting } from './adsCampaignTypes';
export type { AdsCreative, AdsCreativeType, AdsCreativeStatus, AdsCreativeContent } from './adsCreativeTypes';
export type { AdsAnalytics, AdsPerformance } from './adsAnalyticsTypes';
export type { AdsTemplate, AdsOptimization } from './adsTemplateTypes';

// Tipos de integração
export type { 
  AdsIntegration, 
  AdsApiConfig, 
  AdsIntegrationTestProps,
  AdsApiConfigurationManagerProps,
  AdsSchedulerProps,
  AdsSchedulerEvent
} from './adsIntegrationTypes';

// Tipos de resposta
export interface AdsResponse<T = Record<string, any>> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos de filtros
export interface AdsFilters {
  platform?: string;
  status?: string;
  date_range?: {
    start: string;
  end: string; };

  search?: string;
}

// Tipos de paginação
export interface AdsPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number; }
