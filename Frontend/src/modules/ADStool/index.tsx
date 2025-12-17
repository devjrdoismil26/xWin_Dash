/**
 * Exportações otimizadas do módulo ADStool
 * Entry point principal com lazy loading
 */
import React from 'react';

// Default export - página principal
export { default } from './pages/ADStoolIndexPage';

// Exportar componentes principais
export { default as ADStoolIntegrationTest } from './components/ADStoolIntegrationTest';

// Exportar hooks
export { default as useADStool } from './hooks/useADStool';

// Exportar serviços
export { default as adsService } from './services/adsService';
