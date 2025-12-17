/**
 * Módulo Dashboard - Entry Point
 *
 * @description
 * Entry point principal do módulo Dashboard com exportações otimizadas.
 * Usa lazy loading para componentes pesados e importação direta para
 * componentes frequentemente usados.
 *
 * @module modules/Dashboard
 * @since 1.0.0
 */

import React from 'react';

// Main Dashboard Component - Direct import (main entry point)
export { default as DashboardMain } from './DashboardMain';

// Lazy loading otimizado - apenas para componentes pesados
export const ExecutiveMasterDashboard = React.lazy(() => import('./shared/components/ExecutiveMasterDashboard'));

export const MetricsOverview = React.lazy(() => import('./shared/components/MetricsOverview'));

export const AdvancedDashboard = React.lazy(() => import('./shared/components/AdvancedDashboard'));

export const WidgetManager = React.lazy(() => import('./shared/components/WidgetManager'));

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
export const ADSPerformanceWidget = React.lazy(() => import('./shared/components/widgets/ADSPerformanceWidget'));

export const AIProcessingWidget = React.lazy(() => import('./shared/components/widgets/AIProcessingWidget'));

export const AnalyticsOverviewWidget = React.lazy(() => import('./shared/components/widgets/AnalyticsOverviewWidget'));

export const AuraConversationsWidget = React.lazy(() => import('./shared/components/widgets/AuraConversationsWidget'));

export const CalendarIntegrationWidget = React.lazy(() => import('./shared/components/widgets/CalendarIntegrationWidget'));

export const EmailMarketingWidget = React.lazy(() => import('./shared/components/widgets/EmailMarketingWidget'));

export const MediaLibraryWidget = React.lazy(() => import('./shared/components/widgets/MediaLibraryWidget'));

export const ProductsPerformanceWidget = React.lazy(() => import('./shared/components/widgets/ProductsPerformanceWidget'));

export const SocialBufferWidget = React.lazy(() => import('./shared/components/widgets/SocialBufferWidget'));

export const UniverseWidget = React.lazy(() => import('./shared/components/widgets/UniverseWidget'));

export const WorkflowsStatusWidget = React.lazy(() => import('./shared/components/widgets/WorkflowsStatusWidget'));

// Advanced Components - Lazy loaded (heavy components)
export const AlertManager = React.lazy(() => import('./shared/components/AlertManager'));

export const DashboardExportButton = React.lazy(() => import('./shared/components/DashboardExportButton'));

export const DashboardPeriodSelector = React.lazy(() => import('./shared/components/DashboardPeriodSelector'));

export const DashboardSelector = React.lazy(() => import('./shared/components/DashboardSelector'));

export const LayoutManager = React.lazy(() => import('./shared/components/LayoutManager'));

export const WidgetRefreshManager = React.lazy(() => import('./shared/components/WidgetRefreshManager'));

// Chart Components - Lazy loaded (heavy components)
export const LeadsTrendChart = React.lazy(() => import('./shared/components/LeadsTrendChart'));

export const ScoreDistributionChart = React.lazy(() => import('./shared/components/ScoreDistributionChart'));

export const SegmentGrowthChart = React.lazy(() => import('./shared/components/SegmentGrowthChart'));

// Exportação padrão
export { default } from './DashboardMain';
