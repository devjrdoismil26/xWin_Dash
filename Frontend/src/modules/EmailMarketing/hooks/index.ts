/**
 * Exportações centralizadas dos hooks do módulo EmailMarketing
 */

// Stores refatorados
export * from './stores';

// Hook orquestrador principal
export { useEmailMarketing } from './useEmailMarketing';
export { useEmailMarketingAdvanced } from './useEmailMarketingAdvanced';
export { useEmailMarketingValidated } from './useEmailMarketingValidated';

// Hooks especializados
export { useEmailCampaigns } from './useEmailCampaigns';
export { useEmailTemplates } from './useEmailTemplates';
export { useEmailSegments } from './useEmailSegments';

// Re-exportar hooks de subpastas
export { useEmailMarketingCore } from '../EmailMarketingCore/hooks/useEmailMarketingCore';
export { useEmailMarketingStore as useEmailMarketingCoreStore } from '../EmailMarketingCore/hooks/useEmailMarketingStore';
export { useEmailCampaigns as useEmailCampaignsCore, useCampaignBuilder } from '../EmailCampaigns/hooks';
export { useEmailTemplates as useEmailTemplatesCore, useTemplateEditor } from '../EmailTemplates/hooks';
export { useEmailSegments as useEmailSegmentsCore, useSegmentBuilder } from '../EmailSegments/hooks';
