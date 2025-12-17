/**
 * Servi?os de Analytics do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para todos os servi?os de analytics do SocialBuffer.
 * Re-exporta servi?os especializados (m?tricas, hashtags, relat?rios) e o
 * orquestrador principal com todos os tipos relacionados.
 *
 * @module modules/SocialBuffer/services/analytics
 * @since 1.0.0
 */

/**
 * Sub-services
 *
 * @description
 * Re-exporta servi?os especializados de analytics.
 */
export { analyticsMetricsService } from './analyticsMetricsService';
export { analyticsHashtagsService } from './analyticsHashtagsService';
export { analyticsReportsService } from './analyticsReportsService';

/**
 * Service orquestrador
 *
 * @description
 * Re-exporta o servi?o orquestrador principal de analytics.
 */
export { analyticsService } from './analyticsService';

/**
 * Types
 *
 * @description
 * Re-exporta todos os tipos TypeScript dos servi?os de analytics.
 */
export type {
  AnalyticsParams,
  BasicMetrics,
  PlatformMetrics,
  TimeSeriesMetrics,
  ContentMetrics
} from './analyticsMetricsService';

export type {
  HashtagMetrics,
  HashtagAnalysis,
  HashtagSuggestions
} from './analyticsHashtagsService';

export type {
  LinkMetrics,
  EngagementMetrics,
  AudienceMetrics,
  AnalyticsReport,
  PeriodComparison
} from './analyticsReportsService';
