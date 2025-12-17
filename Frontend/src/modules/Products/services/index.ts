/**
 * Exportações centralizadas dos serviços do módulo Products
 */

// Serviços principais
export { default as productsService } from './productsService';
export { default as productsApiService } from './productsApiService';
export { default as productsCacheService } from './productsCacheService';
export { default as productsErrorService } from './productsErrorService';
export { default as productsOptimizationService } from './productsOptimizationService';
export { default as productsValidationService } from './productsValidationService';

// Re-exportações para conveniência
export { getCurrentProjectId, getAuthHeaders } from './productsService';