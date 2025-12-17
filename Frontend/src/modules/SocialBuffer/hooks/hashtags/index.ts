/**
 * Hooks de Hashtags do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para hooks de hashtags do SocialBuffer.
 * Re-exporta store principal de hashtags com todos os tipos relacionados.
 *
 * @module modules/SocialBuffer/hooks/hashtags
 * @since 1.0.0
 */

/**
 * Store principal
 *
 * @description
 * Re-exporta o store principal de hashtags.
 */
export { useSocialHashtagsStore } from './useSocialHashtagsStore';

/**
 * Types
 *
 * @description
 * Re-exporta todos os tipos TypeScript do store de hashtags.
 */
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
} from '@/services/hashtagsService';
