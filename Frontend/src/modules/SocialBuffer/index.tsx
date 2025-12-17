/**
 * Módulo SocialBuffer - Entry Point
 *
 * @description
 * Entry point principal do módulo SocialBuffer com exportações otimizadas.
 * Inclui componentes, hooks e serviços principais com lazy loading.
 *
 * @module modules/SocialBuffer
 * @since 1.0.0
 */

import React from 'react';

// Default export - página principal
export { default } from './pages/SocialBufferIndexPage';

// Exportar componentes principais
export { default as SocialBufferIntegrationTest } from './components/SocialBufferIntegrationTest';

// Exportar hooks
export { default as useSocialBuffer } from './hooks/useSocialBuffer';

// Exportar serviços
export { default as socialBufferService } from './services/socialBufferService';
