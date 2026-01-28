// ========================================
// EXPORTS - HOOKS DO LEADS CORE
// ========================================
// Hooks para funcionalidades básicas do módulo Leads

// useLeadCategorization moved to main hooks directory
export { useLeadTags } from './useLeadTags';
export { useLeadsCore } from './useLeadsCore';

// Store
export { 
  useLeadsStore, 
  useLeadsSelector, 
  useLeadsData, 
  useLeadsUI, 
  useLeadsFilters, 
  useLeadsAnalytics 
} from './useLeadsStore';
