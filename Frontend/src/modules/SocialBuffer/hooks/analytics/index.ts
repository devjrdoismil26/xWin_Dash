/**
 * Hooks de Analytics do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para todos os hooks de analytics do SocialBuffer.
 * Re-exporta stores especializados (m?tricas, hashtags, relat?rios) e o
 * store orquestrador principal com todos os tipos relacionados.
 *
 * @module modules/SocialBuffer/hooks/analytics
 * @since 1.0.0
 */

/**
 * Sub-stores
 *
 * @description
 * Re-exporta stores especializados de analytics.
 */
export { useAnalyticsMetricsStore } from './useAnalyticsMetricsStore';
export { useAnalyticsHashtagsStore } from './useAnalyticsHashtagsStore';
export { useAnalyticsReportsStore } from './useAnalyticsReportsStore';

/**
 * Store orquestrador
 *
 * @description
 * Re-exporta o store orquestrador principal de analytics.
 */
export { useAnalyticsStore } from './useAnalyticsStore';

/**
 * Types
 *
 * @description
 * Re-exporta todos os tipos TypeScript dos stores de analytics.
 */
export type {
  AnalyticsParams,
  BasicMetrics,
  PlatformMetrics,
  TimeSeriesMetrics,
  ContentMetrics
} from '@/services/analytics/analyticsMetricsService';

export type {
  HashtagMetrics,
  HashtagAnalysis,
  HashtagSuggestions
} from '@/services/analytics/analyticsHashtagsService';

export type {
  LinkMetrics,
  EngagementMetrics,
  AudienceMetrics,
  AnalyticsReport,
  PeriodComparison
} from '@/services/analytics/analyticsReportsService';
