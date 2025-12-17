// =========================================
// EXPORTS - TIPOS DO MÓDULO MEDIA LIBRARY
// =========================================
// Arquivo centralizado de exportações de tipos
// Consolida todas as interfaces e tipos do módulo Media Library

// Re-export all types from the consolidated mediaLibraryTypes.ts
export * from './mediaLibraryTypes';

// =========================================
// EXPORTS ORGANIZADOS POR CATEGORIA
// =========================================

// Tipos principais
export type {
  MediaFile,
  MediaFolder,
  MediaMetadata,
  MediaPermissions
} from './mediaLibraryTypes';

// Upload e processamento
export type {
  MediaUpload,
  MediaUploadConfig,
  MediaProcessingJob
} from './mediaLibraryTypes';

// Busca e filtros
export type {
  MediaSearchFilters,
  MediaSearchResult
} from './mediaLibraryTypes';

// Tipos de mídia
export type {
  MediaType,
  MediaTypeInfo,
  MEDIA_TYPES
} from './mediaLibraryTypes';

// Estatísticas
export type {
  MediaStats
} from './mediaLibraryTypes';

// Comentários e colaboração
export type {
  MediaComment,
  MediaShare,
  MediaVersion
} from './mediaLibraryTypes';

// Tags e categorização
export type {
  MediaTag,
  MediaCategory
} from './mediaLibraryTypes';

// Inteligência artificial
export type {
  MediaAI,
  MediaSimilarity,
  MediaAutoTag
} from './mediaLibraryTypes';

// Configurações
export type {
  MediaLibrarySettings
} from './mediaLibraryTypes';

// Exportação e integração
export type {
  MediaExport,
  MediaIntegration
} from './mediaLibraryTypes';

// Histórico e auditoria
export type {
  MediaHistory,
  MediaAudit
} from './mediaLibraryTypes';

// Resposta da API
export type {
  MediaApiResponse,
  MediaBulkResponse
} from './mediaLibraryTypes';

// Utilitários
export type {
  MediaViewMode,
  MediaSortBy,
  MediaSortOrder,
  MediaOperation,
  MediaStorageProvider,
  MediaBackupFrequency
} from './mediaLibraryTypes';

// Eventos
export type {
  MediaEvent
} from './mediaLibraryTypes';

// Notificações
export type {
  MediaNotification
} from './mediaLibraryTypes';

// Templates
export type {
  MediaTemplate
} from './mediaLibraryTypes';

// Workflows
export type {
  MediaWorkflow,
  MediaWorkflowExecution
} from './mediaLibraryTypes';
