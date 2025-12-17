/**
 * Tipos do SocialBuffer - Entry Point
 *
 * @description
 * Entry point centralizado para todos os tipos TypeScript do módulo SocialBuffer.
 * Re-exporta todos os tipos do arquivo principal (socialTypes) e fornece
 * re-exportações para conveniência.
 *
 * @module modules/SocialBuffer/types
 * @since 1.0.0
 */

/**
 * Re-exportar todos os tipos do arquivo principal
 *
 * @description
 * Re-exporta todos os tipos e interfaces do arquivo socialTypes.ts.
 */
export * from './socialTypes';

/**
 * Re-exportações para conveniência
 *
 * @description
 * Re-exportações adicionais de tipos para facilitar imports em outras partes
 * da aplicação. Inclui tipos de posts, accounts, schedules, hashtags, links,
 * media, engagement e analytics.
 */
export type {
  SocialAccount,
  SocialAccountStatus,
  SocialPlatform,
  SocialPost,
  SocialPostStatus,
  SocialPostType,
  SocialPostContent,
  SocialPostMedia,
  SocialPostSchedule,
  SocialPostAnalytics,
  SocialPostEngagement,
  SocialPostMetrics,
  SocialPostStats,
  SocialPostReport,
  SocialPostAnalytics,
  SocialPostDashboard,
  SocialPostMonitor,
  SocialPostAlert,
  SocialPostNotification,
  SocialPostWebhook,
  SocialPostAPI,
  SocialPostIntegration,
  SocialPostSync,
  SocialPostBackup,
  SocialPostRestore,
  SocialPostMigration,
  SocialPostUpgrade,
  SocialPostDowngrade,
  SocialPostMaintenance,
  SocialPostHealth,
  SocialPostPerformance,
  SocialPostSecurity,
  SocialPostCompliance,
  SocialPostAudit,
  SocialPostLog,
  SocialPostMetrics,
  SocialPostStats,
  SocialPostReport,
  SocialPostAnalytics,
  SocialPostDashboard,
  SocialPostMonitor,
  SocialPostAlert,
  SocialPostNotification,
  SocialPostWebhook,
  SocialPostAPI,
  SocialPostIntegration,
  SocialPostSync,
  SocialPostBackup,
  SocialPostRestore,
  SocialPostMigration,
  SocialPostUpgrade,
  SocialPostDowngrade,
  SocialPostMaintenance,
  SocialPostHealth,
  SocialPostPerformance,
  SocialPostSecurity,
  SocialPostCompliance,
  SocialPostAudit
} from './socialTypes';