/**
 * Exportações centralizadas dos serviços do módulo Projects
 */

// Serviço principal
export { default as projectsService } from './projectsService';

// Re-exportações para conveniência
export { getCurrentProjectId, getAuthHeaders } from './projectsService';