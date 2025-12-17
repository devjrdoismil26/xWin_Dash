/**
 * Hooks do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para todos os hooks do módulo SocialBuffer.
 * Re-exporta stores especializados, analytics, hashtags, links, media, engagement
 * e o store orquestrador principal com todos os tipos relacionados.
 *
 * @module modules/SocialBuffer/hooks
 * @since 1.0.0
 */

/**
 * Exportações dos stores especializados
 *
 * @description
 * Re-exporta stores especializados: accounts, posts e schedules.
 */
export { useAccountsStore } from './useAccountsStore';
export { usePostsStore } from './usePostsStore';
export { useSchedulesStore } from './useSchedulesStore';

/**
 * Exportações dos stores de analytics (refatorados)
 *
 * @description
 * Re-exporta todos os stores de analytics incluindo métricas, hashtags e relatórios.
 */
export * from './analytics';

/**
 * Exportações dos stores de hashtags (novos)
 *
 * @description
 * Re-exporta store de hashtags com tipos relacionados.
 */
export * from './hashtags';

/**
 * Exportações dos stores de links (novos)
 *
 * @description
 * Re-exporta store de links com tipos relacionados.
 */
export * from './links';

/**
 * Exportações dos stores de media (novos)
 *
 * @description
 * Re-exporta store de mídia com tipos relacionados.
 */
export * from './media';

/**
 * Exportações dos stores de engagement (novos)
 *
 * @description
 * Re-exporta store de engajamento com tipos relacionados.
 */
export * from './engagement';

/**
 * Exportação do store orquestrador principal
 *
 * @description
 * Re-exporta o store orquestrador principal do SocialBuffer.
 */
export { useSocialBufferStore } from './useSocialBufferStore';

/**
 * Exportação do hook de UI (novo)
 *
 * @description
 * Re-exporta hook de UI do SocialBuffer.
 */
export { useSocialBufferUI } from './useSocialBufferUI';

/**
 * Exportações dos tipos dos stores
 *
 * @description
 * Re-exporta todos os tipos TypeScript dos stores especializados.
 */
export type {
  AccountsState,
  AccountsActions,
  AccountsStore
} from './useAccountsStore';

export type {
  PostsState,
  PostsActions,
  PostsStore
} from './usePostsStore';

export type {
  SchedulesState,
  SchedulesActions,
  SchedulesStore
} from './useSchedulesStore';

export type {
  AnalyticsState,
  AnalyticsActions,
  AnalyticsStore
} from './useAnalyticsStore';

// Exportação do store principal (será criado posteriormente)
// export default useSocialBufferStore;
