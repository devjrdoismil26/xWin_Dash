/**
 * Exportações otimizadas do módulo EmailMarketing
 * Entry point principal com lazy loading
 */
import React from 'react';

// Default export - página principal
export { default } from './pages/CampaignsIndex';

// Exportar componentes principais
export { default as EmailMarketingIntegrationTest } from './components/EmailMarketingIntegrationTest';

// Exportar hooks
export { default as useEmailMarketingStore } from './hooks/useEmailMarketingStore';

// Exportar serviços
export { default as emailMarketingService } from './services/emailMarketingService';
