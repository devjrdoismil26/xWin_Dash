/**
 * Componentes do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para todos os componentes do módulo SocialBuffer.
 * Re-exporta componentes especializados, UI, funcionalidade, performance,
 * acessibilidade, tema e i18n com tipos relacionados.
 *
 * @module modules/SocialBuffer/components
 * @since 1.0.0
 */

/**
 * Exportações dos componentes especializados
 *
 * @description
 * Re-exporta componentes principais: dashboard e stats.
 */
export { default as SocialBufferDashboard } from './SocialBufferDashboard';
export { default as SocialBufferStats } from './SocialBufferStats';

/**
 * Exportações dos componentes de UI (novos)
 *
 * @description
 * Re-exporta todos os componentes de UI do SocialBuffer.
 */
export * from './ui';

/**
 * Exportações dos componentes de funcionalidade (novos)
 *
 * @description
 * Re-exporta todos os componentes de funcionalidade do SocialBuffer.
 */
export * from './functionality';

/**
 * Exportações dos componentes de performance (novos)
 *
 * @description
 * Re-exporta todos os componentes de performance do SocialBuffer.
 */
export * from './performance';

/**
 * Exportações dos componentes de acessibilidade (novos)
 *
 * @description
 * Re-exporta todos os componentes de acessibilidade do SocialBuffer.
 */
export * from './accessibility';

/**
 * Exportações dos componentes de tema (novos)
 *
 * @description
 * Re-exporta todos os componentes de tema do SocialBuffer.
 */
export * from './theming';

/**
 * Exportações dos componentes de i18n (novos)
 *
 * @description
 * Re-exporta todos os componentes de i18n do SocialBuffer.
 */
export * from './i18n';

/**
 * Exportações dos tipos dos componentes
 *
 * @description
 * Re-exporta todos os tipos TypeScript dos componentes.
 */
export type { SocialBufferDashboardProps } from './SocialBufferDashboard';
export type { SocialBufferStatsProps } from './SocialBufferStats';

// Re-exportação de componentes existentes (se houver)
