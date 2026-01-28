/**
 * Exportações centralizadas dos hooks do ADStool
 */

// Hook principal orquestrador
export { default as useADStool } from './useADStool';

// Hooks especializados
export { default as useAdsAccounts } from './useAdsAccounts';
export { default as useAdsCampaigns } from './useAdsCampaigns';
export { default as useAdsCreatives } from './useAdsCreatives';
export { default as useAdsAnalytics } from './useAdsAnalytics';
export { default as useAdsTemplates } from './useAdsTemplates';

// Hook avançado (manter para compatibilidade)
export { default as useADStoolAdvanced } from './useADStoolAdvanced';
