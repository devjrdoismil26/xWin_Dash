/**
 * Exportações centralizadas dos hooks do módulo AI
 */

// Hook principal (orquestrador)
export { useAI } from './useAI';

// Hooks especializados
export { useAIGeneration } from './useAIGeneration';
export { useAIProviders } from './useAIProviders';
export { useAIHistory } from './useAIHistory';
export { useAIAnalytics } from './useAIAnalytics';

// Store
export { useAIStore, useAIServicesStatus, useAIProviders as useAIProvidersSelector, useAIGenerations, useAIConfig, useAIState } from './useAIStore';

// Re-exportações para compatibilidade
// export { default as useAIStore } from './useAIStore';
