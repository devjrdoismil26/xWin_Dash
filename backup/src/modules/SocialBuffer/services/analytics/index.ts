// =========================================
// ANALYTICS SERVICES EXPORTS - SOCIAL BUFFER
// =========================================

// Sub-services
export { analyticsMetricsService } from './analyticsMetricsService';
export { analyticsHashtagsService } from './analyticsHashtagsService';
export { analyticsReportsService } from './analyticsReportsService';

// Service orquestrador
export { analyticsService } from './analyticsService';

// Types
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
