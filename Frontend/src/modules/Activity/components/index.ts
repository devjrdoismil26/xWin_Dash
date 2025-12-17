/**
 * Exportações de componentes do módulo Activity
 * Centraliza todos os componentes
 */

// ===== LEGACY EXPORTS =====
export { default as ActivityDashboard } from './ActivityDashboard';
export { default as ActivityStats } from './ActivityStats';
export { default as ActivityFilters } from './ActivityFilters';
export { default as ActivityList } from './ActivityList';
export { default as ActivityActions } from './ActivityActions';
export { default as ActivityBreadcrumbs } from './ActivityBreadcrumbs';
export { default as ActivityIntegrationTest } from './ActivityIntegrationTest';

// ===== REFACTORED EXPORTS =====
export { ActivityMetricsCards } from './ActivityMetricsCards';
export { ActivityTable } from './ActivityTable';
export { ActivityFiltersPanel } from './ActivityFiltersPanel';
export { ActivityFormModal } from './ActivityFormModal';
