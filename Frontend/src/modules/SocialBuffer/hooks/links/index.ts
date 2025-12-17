/**
 * Hooks de Links do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para hooks de links do SocialBuffer.
 * Re-exporta store principal de links com todos os tipos relacionados.
 *
 * @module modules/SocialBuffer/hooks/links
 * @since 1.0.0
 */

/**
 * Store principal
 *
 * @description
 * Re-exporta o store principal de links.
 */
export { useSocialLinksStore } from './useSocialLinksStore';

/**
 * Types
 *
 * @description
 * Re-exporta todos os tipos TypeScript do store de links.
 */
export type {
  LinkSearchParams,
  LinkPaginatedResponse,
  CreateLinkData,
  UpdateLinkData,
  LinkStats,
  LinkValidation,
  LinkAnalytics,
  QRCodeData
} from '@/services/linksService';
