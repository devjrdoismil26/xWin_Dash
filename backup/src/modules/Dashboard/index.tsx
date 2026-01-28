/**
 * Exportações otimizadas do módulo Dashboard
 * Entry point principal com lazy loading
 */
import React from 'react';

// Main Dashboard Component - Direct import (main entry point)
export { default as DashboardMain } from './DashboardMain';

// Lazy loading otimizado - apenas para componentes pesados
export const ExecutiveMasterDashboard = React.lazy(() => import('./components/ExecutiveMasterDashboard'));
export const MetricsOverview = React.lazy(() => import('./components/MetricsOverview'));
export const AdvancedDashboard = React.lazy(() => import('./components/AdvancedDashboard'));
export const WidgetManager = React.lazy(() => import('./components/WidgetManager'));

// Core Components - Direct imports (no lazy loading for frequently used components)
export { default as DashboardMetricsCards } from './components/DashboardMetricsCards';
export { default as RecentActivities } from './components/RecentActivities';
export { default as ProjectsStatsSummary } from './components/ProjectsStatsSummary';

// Core Hooks - Direct imports
export { useDashboard } from './hooks/useDashboard';
export { useDashboardCore } from './hooks/useDashboardCore';
export { useDashboardMetrics } from './hooks/useDashboardMetrics';
export { useDashboardWidgets } from './hooks/useDashboardWidgets';
export { default as useDashboardAdvanced } from './hooks/useDashboardAdvanced';

// Core Services - Direct imports
export { default as dashboardService } from './services/dashboardService';

// Core Types - Direct imports
export * from './types/dashboardTypes';

// Widget Components - Lazy loaded (used less frequently)
export const ADSPerformanceWidget = React.lazy(() => import('./components/widgets/ADSPerformanceWidget'));
export const AIProcessingWidget = React.lazy(() => import('./components/widgets/AIProcessingWidget'));
export const AnalyticsOverviewWidget = React.lazy(() => import('./components/widgets/AnalyticsOverviewWidget'));
export const AuraConversationsWidget = React.lazy(() => import('./components/widgets/AuraConversationsWidget'));
export const CalendarIntegrationWidget = React.lazy(() => import('./components/widgets/CalendarIntegrationWidget'));
export const EmailMarketingWidget = React.lazy(() => import('./components/widgets/EmailMarketingWidget'));
export const MediaLibraryWidget = React.lazy(() => import('./components/widgets/MediaLibraryWidget'));
export const ProductsPerformanceWidget = React.lazy(() => import('./components/widgets/ProductsPerformanceWidget'));
export const SocialBufferWidget = React.lazy(() => import('./components/widgets/SocialBufferWidget'));
export const UniverseWidget = React.lazy(() => import('./components/widgets/UniverseWidget'));
export const WorkflowsStatusWidget = React.lazy(() => import('./components/widgets/WorkflowsStatusWidget'));

// Advanced Components - Lazy loaded (heavy components)
export const AlertManager = React.lazy(() => import('./components/AlertManager'));
export const DashboardExportButton = React.lazy(() => import('./components/DashboardExportButton'));
export const DashboardPeriodSelector = React.lazy(() => import('./components/DashboardPeriodSelector'));
export const DashboardSelector = React.lazy(() => import('./components/DashboardSelector'));
export const LayoutManager = React.lazy(() => import('./components/LayoutManager'));
export const WidgetRefreshManager = React.lazy(() => import('./components/WidgetRefreshManager'));

// Chart Components - Lazy loaded (heavy components)
export const LeadsTrendChart = React.lazy(() => import('./components/LeadsTrendChart'));
export const ScoreDistributionChart = React.lazy(() => import('./components/ScoreDistributionChart'));
export const SegmentGrowthChart = React.lazy(() => import('./components/SegmentGrowthChart'));

// Exportação padrão
export { default } from './DashboardMain';
