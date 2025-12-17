/**
 * @module modules/Dashboard/components/ExecutiveMasterDashboard
 * @description
 * Dashboard executivo master unificado - Refatorado em componentes modulares
 * 
 * Este arquivo agora serve como re-export do componente refatorado.
 * A implementação completa está em ./Executive/ExecutiveMasterDashboard.tsx
 * 
 * Componentes modulares:
 * - ExecutiveHeader: Cabeçalho com controles
 * - ExecutiveMetricsCards: Cards de métricas principais
 * - ExecutiveTrendCharts: Gráficos de tendência
 * - ExecutiveModuleWidgets: Widgets dos módulos
 * - ExecutiveRecentActivity: Atividades recentes
 * 
 * @example
 * ```typescript
 * import ExecutiveMasterDashboard from './ExecutiveMasterDashboard';
 * <ExecutiveMasterDashboard / />
 * ```
 * 
 * @since 1.0.0
 * @refactored 2025-11-28
 */

export { ExecutiveMasterDashboard as default } from './Executive';
export * from './Executive';
