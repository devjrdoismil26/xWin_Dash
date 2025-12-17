/**
 * Hooks de M?dia do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para hooks de m?dia do SocialBuffer.
 * Re-exporta store principal de m?dia com todos os tipos relacionados.
 *
 * @module modules/SocialBuffer/hooks/media
 * @since 1.0.0
 */

/**
 * Store principal
 *
 * @description
 * Re-exporta o store principal de m?dia.
 */
export { useSocialMediaStore } from './useSocialMediaStore';

/**
 * Types
 *
 * @description
 * Re-exporta todos os tipos TypeScript do store de m?dia.
 */
export type {
  MediaSearchParams,
  MediaPaginatedResponse,
  UploadMediaData,
  UpdateMediaData,
  MediaStats,
  MediaOptimization,
  MediaAnalysis,
  MediaGallery
} from '@/services/mediaService';
