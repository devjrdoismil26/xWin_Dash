/**
 * Exportações centralizadas dos componentes do módulo AI
 */

// Componentes principais
export { default as AIDashboard } from './AIDashboard';
export { default as AIHeader } from './AIHeader';
export { default as AIServicesStatus } from './AIServicesStatus';
export { default as AIStats } from './AIStats';
export { default as AIFeatures } from './AIFeatures';

// Componentes existentes (sem lazy loading)
export { default as AIChat } from './AIChat';
export { default as AIGenerationForm } from './AIGenerationForm';
export { default as AIProviderSelector } from './AIProviderSelector';
export { default as AIResultDisplay } from './AIResultDisplay';
export { default as ConnectionTester } from './ConnectionTester';
export { default as GenerationForm } from './GenerationForm';
export { default as GenerationsTable } from './GenerationsTable';
export { default as ResultViewer } from './ResultViewer';
export { default as TextGeneration } from './TextGeneration';

// Componentes com lazy loading (componentes pesados)
export { default as AIIntegrationTest } from './AIIntegrationTest';
export { default as RevolutionaryAIInterface } from './RevolutionaryAIInterface';
export { default as AdvancedAIDashboard } from './AdvancedAIDashboard';
export { default as EnhancedAnalyticsDashboard } from './EnhancedAnalyticsDashboard';
export { default as CostAnalytics } from './CostAnalytics';
export { default as ModelManager } from './ModelManager';
