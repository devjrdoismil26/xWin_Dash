/**
 * @deprecated Este arquivo foi refatorado e dividido em stores especializados
 * @see ./stores/useEmailMarketingStore.ts
 * 
 * Stores disponíveis:
 * - useCampaignsStore: Gerenciamento de campanhas
 * - useTemplatesStore: Gerenciamento de templates
 * - useSegmentsStore: Gerenciamento de segmentos
 * - useSubscribersStore: Gerenciamento de subscribers
 * - useMetricsStore: Métricas e estatísticas
 */

export * from './stores';
export { useEmailMarketingStore as default } from './stores';
