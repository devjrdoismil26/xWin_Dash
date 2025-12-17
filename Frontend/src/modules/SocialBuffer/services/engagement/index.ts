/**
 * Servi?os de Engajamento do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para todos os servi?os de engajamento do SocialBuffer.
 * Re-exporta servi?os especializados (monitoramento, intera??es, an?lise) e o
 * orquestrador principal com todos os tipos relacionados.
 *
 * @module modules/SocialBuffer/services/engagement
 * @since 1.0.0
 */

/**
 * Sub-services
 *
 * @description
 * Re-exporta servi?os especializados de engajamento.
 */
export { engagementMonitoringService } from './engagementMonitoringService';
export { engagementInteractionsService } from './engagementInteractionsService';
export { engagementAnalysisService } from './engagementAnalysisService';

/**
 * Service orquestrador
 *
 * @description
 * Re-exporta o servi?o orquestrador principal de engajamento.
 */
export { engagementService } from './engagementService';

/**
 * Types
 *
 * @description
 * Re-exporta todos os tipos TypeScript dos servi?os de engajamento.
 */
export type {
  EngagementParams,
  EngagementData,
  EngagementMonitoring,
  EngagementAlert
} from './engagementMonitoringService';

export type {
  Interaction,
  Comment,
  Reaction,
  Share
} from './engagementInteractionsService';

export type {
  EngagementAnalysis,
  EngagementInsights,
  EngagementForecast
} from './engagementAnalysisService';
