/**
 * Activity Module - Refactored Entry Point
 * 
 * @description
 * Novo ponto de entrada do módulo Activity refatorado.
 * Implementa lazy loading e exports otimizados.
 * 
 * @module modules/Activity/index.refactored
 * @since 2.0.0
 */

import { lazy } from 'react';

// ===== PAGES (Lazy Loading) =====
export const ActivityListPage = lazy(() => 
  import('./pages/ActivityListPage').then(m => ({ default: m.ActivityListPage })));

export const ActivityDetailPage = lazy(() => 
  import('./pages/ActivityDetailPage').then(m => ({ default: m.ActivityDetailPage })));

export const ActivityAnalyticsPage = lazy(() => 
  import('./pages/ActivityAnalyticsPage').then(m => ({ default: m.ActivityAnalyticsPage })));

// ===== COMPONENTS (Direct Exports) =====
export { ActivityMetricsCards } from './components/ActivityMetricsCards';
export { ActivityTable } from './components/ActivityTable';
export { ActivityFiltersPanel } from './components/ActivityFiltersPanel';
export { ActivityFormModal } from './components/ActivityFormModal';

// ===== HOOKS (Direct Exports) =====
export { useActivityRefactored } from './hooks/useActivityRefactored';

// ===== SERVICES (Direct Exports) =====
export { default as activityService } from './services/activityService';

// ===== TYPES (Direct Exports) =====
export type {
  ActivityLog,
  ActivityStats,
  ActivityFilters,
  ActivityResponse,
} from './types';

// ===== MODULE INFO =====
export const ACTIVITY_MODULE_INFO = {
  name: 'Activity',
  version: '2.0.0',
  refactored: true,
  pages: ['ActivityListPage', 'ActivityDetailPage', 'ActivityAnalyticsPage'],
  components: ['ActivityMetricsCards', 'ActivityTable', 'ActivityFiltersPanel', 'ActivityFormModal'],
  hooks: ['useActivityRefactored'],};

export default {
  ActivityListPage,
  ActivityDetailPage,
  ActivityAnalyticsPage,
  useActivityRefactored,
  activityService,
  ACTIVITY_MODULE_INFO,};
