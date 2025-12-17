// =========================================
// EXPORTS - COMPONENTES DO MÓDULO MEDIA LIBRARY
// =========================================
// Arquivo centralizado de exportações de componentes

// Componentes principais
export { default as MediaHeader } from './MediaHeader';
export { default as MediaMetrics } from './MediaMetrics';
export { default as MediaFilters } from './MediaFilters';
export { default as MediaGrid } from './MediaGrid';
export { default as MediaList } from './MediaList';
export { default as MediaActions } from './MediaActions';

// Novos componentes especializados
export { MediaLibraryDashboard } from './MediaLibraryDashboard';
export { MediaLibraryHeader } from './MediaLibraryHeader';
export { MediaLibraryStats } from './MediaLibraryStats';
export { MediaLibraryContent } from './MediaLibraryContent';
export { MediaLibraryUploader } from './MediaLibraryUploader';

// Lazy Components
export * from './LazyComponents';

// Re-exportar componentes dos submódulos
export * from '../MediaCore/components';
export * from '../MediaManager/components';
export * from '../MediaAnalytics/components';
export * from '../MediaAI/components';
