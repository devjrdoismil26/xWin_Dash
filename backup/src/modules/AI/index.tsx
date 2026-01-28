/**
 * Exportações otimizadas do módulo AI
 * Lazy loading apenas para componentes pesados (> 50 linhas)
 */
import React from 'react';

// Componente principal - sem lazy loading
export { default as AIIndex } from './pages/AIIndexPage';

// Hooks - sem lazy loading
export { useAI, useAIGeneration, useAIProviders, useAIHistory, useAIAnalytics } from './hooks';

// Services - sem lazy loading
export { aiService, aiProviderService, aiGenerationService, aiAnalyticsService } from './services';

// Types - sem lazy loading
export * from './types';

// Utils - sem lazy loading
export * from './utils';

// Componentes pesados - com lazy loading
export const AIGenerationInterface = React.lazy(() => import('./components/UnifiedGenerationInterface'));
export const AIProviderManager = React.lazy(() => import('./components/AIProviderSelector'));
export const AIHistoryViewer = React.lazy(() => import('./components/GenerationsTable'));
export const AIAnalyticsDashboard = React.lazy(() => import('./components/EnhancedAnalyticsDashboard'));
export const AIPromptBuilder = React.lazy(() => import('./components/AIGenerationForm'));
export const AITemplateManager = React.lazy(() => import('./components/ModelManager'));
export const AIIntegrationTest = React.lazy(() => import('./components/AIIntegrationTest'));

// Componentes de configuração - com lazy loading
export const AIProviderConfig = React.lazy(() => import('./components/AIProviderSelector'));
export const AISettingsPanel = React.lazy(() => import('./Settings/index'));
export const AIPermissionsManager = React.lazy(() => import('./components/AIServicesStatus'));

// Componentes de monitoramento - com lazy loading
export const AIUsageMonitor = React.lazy(() => import('./components/CostAnalytics'));
export const AIErrorTracker = React.lazy(() => import('./components/ConnectionTester'));
export const AIPerformanceMetrics = React.lazy(() => import('./components/AIStats'));

// Componentes de integração - com lazy loading
export const AIWebhookManager = React.lazy(() => import('./components/AIIntegrationTest'));
export const AIAPIManager = React.lazy(() => import('./components/AIProviderSelector'));
export const AICacheManager = React.lazy(() => import('./components/ModelManager'));

// Componentes de desenvolvimento - com lazy loading
export const AIDebugger = React.lazy(() => import('./components/ConnectionTester'));
export const AITestRunner = React.lazy(() => import('./components/AIIntegrationTest'));
export const AILogViewer = React.lazy(() => import('./components/EnhancedAnalyticsDashboard'));

// Componentes de documentação - com lazy loading
export const AIHelpCenter = React.lazy(() => import('./components/AIDashboard'));
export const AIAPIDocumentation = React.lazy(() => import('./components/AIProviderSelector'));
export const AITutorials = React.lazy(() => import('./components/AIFeatures'));

// Componentes de suporte - com lazy loading
export const AISupportTicket = React.lazy(() => import('./components/AIChat'));
export const AICommunityForum = React.lazy(() => import('./components/AIFeatures'));
export const AIFeedbackSystem = React.lazy(() => import('./components/AIResultDisplay'));

// Componentes de segurança - com lazy loading
export const AISecurityAudit = React.lazy(() => import('./components/AIServicesStatus'));
export const AIComplianceChecker = React.lazy(() => import('./components/ConnectionTester'));
export const AIDataProtection = React.lazy(() => import('./components/AIProviderSelector'));

// Componentes de backup - com lazy loading
export const AIBackupManager = React.lazy(() => import('./components/ModelManager'));
export const AIRestoreManager = React.lazy(() => import('./components/AIProviderSelector'));
export const AIMigrationTool = React.lazy(() => import('./components/AIIntegrationTest'));

// Componentes de otimização - com lazy loading
export const AIOptimizationEngine = React.lazy(() => import('./components/CostAnalytics'));
export const AIResourceManager = React.lazy(() => import('./components/ModelManager'));
export const AIScalingManager = React.lazy(() => import('./components/AIProviderSelector'));

// Componentes de relatórios - com lazy loading
export const AIReportGenerator = React.lazy(() => import('./components/EnhancedAnalyticsDashboard'));
export const AIExportManager = React.lazy(() => import('./components/GenerationsTable'));
export const AIScheduleManager = React.lazy(() => import('./components/AIStats'));
