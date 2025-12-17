// ========================================
// LEADS ADVANCED HOOKS (REFATORADO)
// ========================================
// Este arquivo agora re-exporta todos os hooks avançados modulares

export { useLeadImportExport, useLeadDuplicates, useLeadScoring, useLeadAutomation, useLeadAttribution, useLeadForecasting, useLeadHealth, useLeadEngagement, useLeadPerformance, useLeadROI, useLeadSources } from './advanced';

// Export main hook that combines all advanced features
export const useLeadsAdvanced = () => {
  const importExport = useLeadImportExport();

  const duplicates = useLeadDuplicates();

  const scoring = useLeadScoring();

  const automation = useLeadAutomation();

  const attribution = useLeadAttribution();

  const forecasting = useLeadForecasting();

  const health = useLeadHealth();

  const engagement = useLeadEngagement();

  const performance = useLeadPerformance();

  const roi = useLeadROI();

  const sources = useLeadSources();

  return {
    importExport,
    duplicates,
    scoring,
    automation,
    attribution,
    forecasting,
    health,
    engagement,
    performance,
    roi,
    sources};
};
