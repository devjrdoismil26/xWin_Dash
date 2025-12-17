/**
 * Serviços do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para todos os serviços do módulo SocialBuffer.
 * Re-exporta serviços especializados, analytics, engagement e tipos relacionados.
 *
 * @module modules/SocialBuffer/services
 * @since 1.0.0
 */

/**
 * Exportações dos services especializados
 *
 * @description
 * Re-exporta serviços especializados: accounts, posts, schedules, hashtags,
 * links e media.
 */
export { accountsService } from './accountsService';
export { postsService } from './postsService';
export { schedulesService } from './schedulesService';
export { hashtagsService } from './hashtagsService';
export { linksService } from './linksService';
export { mediaService } from './mediaService';

/**
 * Exportações dos services de analytics (refatorados)
 *
 * @description
 * Re-exporta todos os serviços de analytics incluindo métricas, hashtags e relatórios.
 */
export * from './analytics';

/**
 * Exportações dos services de engagement (refatorados)
 *
 * @description
 * Re-exporta todos os serviços de engagement incluindo monitoramento, interações e análise.
 */
export * from './engagement';

/**
 * Exportações dos tipos dos services
 *
 * @description
 * Re-exporta todos os tipos TypeScript dos serviços especializados.
 */
export type {
  AccountSearchParams,
  AccountPaginatedResponse,
  AccountConnectionData,
  AccountSyncData,
  AccountStats,
  AccountValidation
} from './accountsService';

export type {
  PostSearchParams,
  PostPaginatedResponse,
  CreatePostData,
  UpdatePostData,
  PostStats,
  PostValidation,
  PostAnalysis,
  PostOptimization
} from './postsService';

export type {
  ScheduleSearchParams,
  SchedulePaginatedResponse,
  CreateScheduleData,
  UpdateScheduleData,
  ScheduleStats,
  ScheduleValidation,
  OptimalTimeSuggestion,
  CalendarEvent
} from './schedulesService';

export type {
  HashtagSearchParams,
  HashtagPaginatedResponse,
  CreateHashtagData,
  UpdateHashtagData,
  HashtagStats,
  HashtagValidation,
  HashtagAnalysis,
  HashtagSuggestion,
  TrendingHashtag,
  PopularHashtag,
  RelatedHashtag,
  HashtagGroup
} from './hashtagsService';

export type {
  LinkSearchParams,
  LinkPaginatedResponse,
  CreateLinkData,
  UpdateLinkData,
  LinkStats,
  LinkValidation,
  LinkAnalytics,
  QRCodeData
} from './linksService';

export type {
  MediaSearchParams,
  MediaPaginatedResponse,
  UploadMediaData,
  UpdateMediaData,
  MediaStats,
  MediaOptimization,
  MediaAnalysis,
  MediaGallery
} from './mediaService';

export type {
  AnalyticsParams,
  BasicMetrics,
  PlatformMetrics,
  TimeSeriesMetrics,
  ContentMetrics,
  HashtagMetrics,
  LinkMetrics,
  EngagementMetrics,
  AudienceMetrics,
  AnalyticsReport,
  PeriodComparison
} from './analyticsService';

export type {
  EngagementParams,
  EngagementData,
  EngagementMonitoring,
  Interaction,
  EngagementAnalysis,
  RealTimeEngagement,
  EngagementCampaign,
  EngagementOptimization
} from './engagementService';

// Exportação do service principal (Facade)
export { socialBufferService } from './socialBufferService';
export default socialBufferService;
