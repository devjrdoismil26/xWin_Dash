/**
 * Serviços do EmailMarketing - Entry Point
 *
 * @description
 * Entry point centralizado para todos os serviços do módulo EmailMarketing.
 * Re-exporta serviço principal e funções utilitárias.
 *
 * @module modules/EmailMarketing/services
 * @since 1.0.0
 */

/**
 * Serviço principal
 *
 * @description
 * Re-exporta o serviço orquestrador principal do EmailMarketing.
 */
export { default as emailMarketingService } from './emailMarketingService';

/**
 * Re-exportações para conveniência
 *
 * @description
 * Re-exporta funções utilitárias para conveniência.
 */
export { getCurrentProjectId, getAuthHeaders } from './emailMarketingService';