// =========================================
// EXPORTS - HOOKS DO MÓDULO MEDIA LIBRARY
// =========================================
// Arquivo centralizado de exportações de hooks

// Hook principal orquestrador
export { useMediaLibrary } from './useMediaLibrary';

// Hooks especializados (implementados diretamente)
export { useMediaCore } from './useMediaCore';
export { useMediaManager } from './useMediaManager';
export { useMediaAnalytics } from './useMediaAnalytics';
export { useMediaAI } from './useMediaAI';

// Hooks legados (para compatibilidade)
export { useMedia } from './useMedia';
export { useMediaUpload } from './useMediaUpload';
export { useMediaSelector } from './useMediaSelector';
