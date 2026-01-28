/**
 * Exportações centralizadas dos serviços do ADStool
 */

// Serviço principal (orquestrador)
export { default as adsService } from './adsService';

// Serviços especializados
export { default as adsAccountService } from './adsAccountService';
export { default as adsCampaignService } from './adsCampaignService';
export { default as adsCreativeService } from './adsCreativeService';
export { default as adsAnalyticsService } from './adsAnalyticsService';
export { default as adsTemplateService } from './adsTemplateService';
