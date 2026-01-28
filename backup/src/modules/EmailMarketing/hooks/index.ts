/**
 * Exportações centralizadas dos hooks do módulo EmailMarketing
 */

// Hook orquestrador principal
export { useEmailMarketing } from './useEmailMarketing';

// Re-exportar hooks especializados
export { useEmailMarketingCore } from '../EmailMarketingCore/hooks/useEmailMarketingCore';
export { useEmailMarketingStore } from '../EmailMarketingCore/hooks/useEmailMarketingStore';
export { useEmailCampaigns, useCampaignBuilder } from '../EmailCampaigns/hooks';
export { useEmailTemplates, useTemplateEditor } from '../EmailTemplates/hooks';
export { useEmailSegments, useSegmentBuilder } from '../EmailSegments/hooks';
