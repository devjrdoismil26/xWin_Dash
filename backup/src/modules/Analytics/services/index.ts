/**
 * Exportações centralizadas dos serviços do módulo Analytics
 */

// Serviço principal
export { default as analyticsService } from './analyticsService';

// Re-exportações para conveniência
export { getCurrentProjectId, getAuthHeaders } from './analyticsService';