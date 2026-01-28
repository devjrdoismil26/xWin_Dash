/**
 * 🤖 AI Laboratory Block - Main Exports
 * 
 * Bloco de Laboratório de IA integrado com PyLab para o Universe
 */

// Main Component
export { default as AILaboratoryBlock } from './AILaboratoryBlock';

// Components
export { default as ImageGenerator } from './components/ImageGenerator';
export { default as VideoGenerator } from './components/VideoGenerator';
export { default as MediaGallery } from './components/MediaGallery';
export { default as SystemStatus } from './components/SystemStatus';
export { default as GenerationProgress } from './components/GenerationProgress';
export { default as PromptEnhancer } from './components/PromptEnhancer';

// Hooks
export { useAILaboratory } from './hooks/useAILaboratory';

// Services
export { aiLaboratoryApi } from './services/aiLaboratoryApi';

// Types
export * from './types';

// Re-export main component as default
export { AILaboratoryBlock as default } from './AILaboratoryBlock';
