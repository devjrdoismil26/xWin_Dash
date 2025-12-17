// Componentes refatorados
export { LeadsTable } from './LeadsTable';
export { LeadsMetricsCards } from './LeadsMetricsCards';
export { LeadsFiltersPanel } from './LeadsFiltersPanel';
export { LeadFormModal } from './LeadFormModal';

// Componentes legados (manter compatibilidade)
export { default as LeadsHeader } from './LeadsHeader';
export { default as LeadsMetrics } from './LeadsMetrics';
export { default as LeadsFilters } from './LeadsFilters';

// Re-exportar componentes dos submódulos
export * from '../LeadsCore/components';
export * from '../LeadsManager/components';
export * from '../LeadsSegments/components';
export * from '../LeadsAnalytics/components';
export * from '../LeadsCustomFields/components';
