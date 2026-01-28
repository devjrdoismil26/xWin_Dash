// ========================================
// EXPORTS - HOOKS DO MÓDULO LEADS
// ========================================
// Arquivo centralizado de exportações de hooks

// Hook principal orquestrador
export { useLeads } from './useLeads';

// Store principal
export { useLeadsStore } from './useLeadsStore';

// Hooks especializados (re-exportados dos submódulos)
export { useLeadsCore } from '../LeadsCore/hooks/useLeadsCore';
export { useLeadsManager } from '../LeadsManager/hooks/useLeadsManager';
export { useLeadsSegments } from '../LeadsSegments/hooks/useLeadsSegments';
export { useLeadsAnalytics } from '../LeadsAnalytics/hooks/useLeadsAnalytics';
export { useLeadsCustomFields } from '../LeadsCustomFields/hooks/useLeadsCustomFields';

// Hooks legados (para compatibilidade)
export { useLeadsAdvanced } from './useLeadsAdvanced';
export { useLeadCategorization } from './useLeadCategorization';
export { useLeadTags } from './useLeadTags';
