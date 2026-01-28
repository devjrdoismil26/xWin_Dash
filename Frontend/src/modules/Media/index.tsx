/**
 * Exportações otimizadas do módulo MediaLibrary
 * Entry point principal com lazy loading
 */
import React from 'react';

/**
 * MediaLibrary Module - Export otimizado com lazy loading inteligente
 * Substitui o export antigo por um sistema de lazy loading otimizado
 */

import { lazy } from 'react';

// Lazy loading apenas para componentes pesados
const MediaLibraryModule = lazy(() => import('./MediaLibraryModule'));

// Export direto para componentes leves

// Export do módulo principal com lazy loading
export { MediaLibraryModule };

// Export de hooks
export { useMediaLibrary } from './hooks/useMediaLibrary';
export { useMediaLibrarySimple } from './hooks/useMediaLibrarySimple';
export { useMediaLibraryStore } from './hooks/useMediaLibraryStore';

// Export de serviços
export { default as mediaLibraryService } from './services/mediaLibraryService';

// Export de tipos
export * from './types';
