/**
 * Exportações centralizadas dos serviços do módulo EmailMarketing
 */

// Serviço principal
export { default as emailMarketingService } from './emailMarketingService';

// Re-exportações para conveniência
export { getCurrentProjectId, getAuthHeaders } from './emailMarketingService';