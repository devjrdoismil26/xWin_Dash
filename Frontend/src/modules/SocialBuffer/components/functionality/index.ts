/**
 * Componentes de Funcionalidade do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para componentes de funcionalidade do SocialBuffer.
 * Re-exporta gerenciadores especializados: accounts, posts, schedules, hashtags,
 * links, media, analytics e engagement.
 *
 * @module modules/SocialBuffer/components/functionality
 * @since 1.0.0
 */

/**
 * Componentes de funcionalidades especializadas
 *
 * @description
 * Re-exporta gerenciadores especializados do SocialBuffer.
 */
export { default as SocialAccountsManager } from './SocialAccountsManager';
export { default as SocialPostsManager } from './SocialPostsManager';
export { default as SocialSchedulesManager } from './SocialSchedulesManager';
export { default as SocialHashtagsManager } from './SocialHashtagsManager';
export { default as SocialLinksManager } from './SocialLinksManager';
export { default as SocialMediaManager } from './SocialMediaManager';
export { default as SocialAnalyticsManager } from './SocialAnalyticsManager';
export { default as SocialEngagementManager } from './SocialEngagementManager';
