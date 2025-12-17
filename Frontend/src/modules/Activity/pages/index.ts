/**
 * Exportações de páginas do módulo Activity
 * Centraliza todas as páginas
 */

// ===== LEGACY EXPORTS =====
export { default as ActivityIndexPage } from './ActivityIndexPage';
export { default as ActivityDetailPage } from './ActivityDetailPage';
export { default as ActivityCreatePage } from './ActivityCreatePage';

// ===== REFACTORED EXPORTS =====
export { ActivityListPage } from './ActivityListPage';
export { ActivityAnalyticsPage } from './ActivityAnalyticsPage';
export { ActivityDetailPage as ActivityDetailPageRefactored } from './ActivityDetailPage';
