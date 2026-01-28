/**
 * Exportações otimizadas do módulo Aura
 * Entry point principal com lazy loading
 */
import React from 'react';

// Exportar componentes principais
export { default as AuraIntegrationTest } from './components/AuraIntegrationTest';

// Exportar hooks
export { default as useAuraStore } from './hooks/useAuraStore';
export { default as useAura } from './hooks/useAura';

// Exportar serviços
export { default as auraService } from './services/auraService';
export { getCurrentProjectId, getAuthHeaders } from './services/auraService';
