/**
 * Serviços da MediaLibrary - Entry Point
 *
 * @description
 * Entry point centralizado para todos os serviços do módulo MediaLibrary.
 * Re-exporta serviço principal e funções utilitárias.
 *
 * @module modules/MediaLibrary/services
 * @since 1.0.0
 */

/**
 * Serviço principal
 *
 * @description
 * Re-exporta o serviço orquestrador principal da MediaLibrary.
 */
export { default as mediaLibraryService } from './mediaLibraryService';

/**
 * Re-exportações para conveniência
 *
 * @description
 * Re-exporta funções utilitárias para conveniência.
 */
export { getCurrentProjectId, getAuthHeaders } from './mediaLibraryService';