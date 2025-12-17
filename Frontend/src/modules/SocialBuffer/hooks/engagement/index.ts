/**
 * Hooks de Engajamento do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para hooks de engajamento do SocialBuffer.
 * Re-exporta store principal de engajamento com todos os tipos relacionados.
 *
 * @module modules/SocialBuffer/hooks/engagement
 * @since 1.0.0
 */

/**
 * Store principal
 *
 * @description
 * Re-exporta o store principal de engajamento.
 */
export { useSocialEngagementStore } from './useSocialEngagementStore';

/**
 * Types
 *
 * @description
 * Re-exporta todos os tipos TypeScript do store de engajamento.
 */
export type {
  EngagementParams,
  EngagementData,
  EngagementMonitoring,
  EngagementAlert,
  Interaction,
  Comment,
  Reaction,
  Share,
  EngagementAnalysis,
  EngagementInsights,
  EngagementForecast
} from '@/services/engagement/engagementService';
