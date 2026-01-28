// =========================================
// TYPES - MÓDULO MEDIA LIBRARY CONSOLIDADO
// =========================================
// Arquivo único de tipos para o módulo Media Library
// Consolida todas as interfaces dos arquivos mediaLibraryTypes.ts e mediaLibraryService.ts

// =========================================
// TIPOS PRINCIPAIS
// =========================================

export interface MediaFile {
  id: string;
  user_id: string;
  project_id?: string;
  folder_id?: string;
  disk: string;
  path: string;
  filename: string;
  mime_type: string;
  type: string;
  type_label: string;
  size: number;
  human_readable_size: string;
  alt_text?: string;
  caption?: string;
  tags?: string[];
  mediable_type?: string;
  mediable_id?: string;
  metadata?: any;
  url: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  exists: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaMetadata {
  // Image metadata
  camera?: {
    make?: string;
    model?: string;
    lens?: string;
    focal_length?: number;
    aperture?: string;
    shutter_speed?: string;
    iso?: number;
    flash?: boolean;
  };
  // Video metadata
  video?: {
    codec?: string;
    bitrate?: number;
    framerate?: number;
    resolution?: string;
    aspect_ratio?: string;
  };
  // Audio metadata
  audio?: {
    codec?: string;
    bitrate?: number;
    sample_rate?: number;
    channels?: number;
    duration?: number;
  };
  // Document metadata
  document?: {
    pages?: number;
    author?: string;
    title?: string;
    subject?: string;
    keywords?: string[];
    created_date?: string;
    modified_date?: string;
  };
  // General metadata
  exif?: { [key: string]: any };
  gps?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    location?: string;
  };
  colors?: {
    dominant?: string;
    palette?: string[];
  };
  faces?: {
    count: number;
    detected: boolean;
    coordinates?: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      confidence: number;
    }>;
  };
}

export interface MediaFolder {
  id: string;
  project_id?: string;
  user_id: string;
  parent_id?: string;
  name: string;
  full_path: string;
  children?: MediaFolder[];
  media?: MediaFile[];
  children_count?: number;
  media_count?: number;
  parent?: MediaFolder;
  project?: any;
  user?: any;
  created_at: string;
  updated_at: string;
}

export interface MediaPermissions {
  can_view: boolean;
  can_upload: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_share: boolean;
  can_download: boolean;
  can_comment: boolean;
  can_tag: boolean;
}

// ===== UPLOAD E PROCESSAMENTO =====

export interface MediaUpload {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  media_id?: string;
  folder_id?: string;
  metadata?: Partial<MediaFile>;
  started_at: string;
  completed_at?: string;
  duration?: number;
  retry_count: number;
  max_retries: number;
}

export interface MediaUploadConfig {
  max_file_size: number; // bytes
  allowed_types: string[];
  allowed_extensions: string[];
  max_files_per_upload: number;
  auto_resize: boolean;
  generate_thumbnails: boolean;
  extract_metadata: boolean;
  detect_faces: boolean;
  compress_images: boolean;
  compress_videos: boolean;
  watermark?: {
    enabled: boolean;
    text?: string;
    image?: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
  };
}

export interface MediaProcessingJob {
  id: string;
  media_id: string;
  type: 'thumbnail' | 'resize' | 'compress' | 'watermark' | 'metadata' | 'face_detection' | 'color_extraction';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  started_at: string;
  completed_at?: string;
  duration?: number;
  result?: any;
  retry_count: number;
  max_retries: number;
}

// ===== BUSCA E FILTROS =====

export interface MediaSearchFilters {
  query?: string;
  type?: MediaType;
  folder_id?: string;
  tags?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  size_range?: {
    min: number;
    max: number;
  };
  dimensions?: {
    min_width?: number;
    min_height?: number;
    max_width?: number;
    max_height?: number;
  };
  duration_range?: {
    min: number;
    max: number;
  };
  is_public?: boolean;
  is_featured?: boolean;
  uploaded_by?: string;
  sort_by?: 'name' | 'size' | 'date' | 'type' | 'downloads' | 'views';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface MediaSearchResult {
  files: MediaFile[];
  folders: MediaFolder[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  facets: {
    types: { [key: string]: number };
    folders: { [key: string]: number };
    tags: { [key: string]: number };
    dates: { [key: string]: number };
    sizes: { [key: string]: number };
  };
  suggestions: string[];
  search_time: number;
}

// ===== TIPOS DE MÍDIA =====

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';

export interface MediaTypeInfo {
  type: MediaType;
  label: string;
  icon: string;
  color: string;
  extensions: string[];
  mime_types: string[];
  max_size?: number;
  supported_operations: string[];
}

export const MEDIA_TYPES: MediaTypeInfo[] = [
  {
    type: 'image',
    label: 'Imagem',
    icon: 'Image',
    color: 'green',
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'ico'],
    mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff', 'image/x-icon'],
    max_size: 50 * 1024 * 1024, // 50MB
    supported_operations: ['resize', 'crop', 'rotate', 'filter', 'watermark', 'compress']
  },
  {
    type: 'video',
    label: 'Vídeo',
    icon: 'Video',
    color: 'purple',
    extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
    mime_types: ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/webm', 'video/x-matroska'],
    max_size: 500 * 1024 * 1024, // 500MB
    supported_operations: ['compress', 'thumbnail', 'trim', 'watermark']
  },
  {
    type: 'audio',
    label: 'Áudio',
    icon: 'Music',
    color: 'blue',
    extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
    mime_types: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg', 'audio/x-ms-wma', 'audio/mp4'],
    max_size: 100 * 1024 * 1024, // 100MB
    supported_operations: ['compress', 'convert', 'trim']
  },
  {
    type: 'document',
    label: 'Documento',
    icon: 'FileText',
    color: 'orange',
    extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'],
    mime_types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'application/rtf'],
    max_size: 50 * 1024 * 1024, // 50MB
    supported_operations: ['preview', 'extract_text', 'convert']
  },
  {
    type: 'archive',
    label: 'Arquivo',
    icon: 'Archive',
    color: 'gray',
    extensions: ['zip', 'rar', '7z', 'tar', 'gz'],
    mime_types: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', 'application/gzip'],
    max_size: 200 * 1024 * 1024, // 200MB
    supported_operations: ['extract', 'compress']
  },
  {
    type: 'other',
    label: 'Outros',
    icon: 'File',
    color: 'gray',
    extensions: [],
    mime_types: [],
    supported_operations: ['download']
  }
];

// ===== ESTATÍSTICAS =====

export interface MediaStats {
  total_files: number;
  total_folders: number;
  total_size: number;
  size_by_type: { [key in MediaType]: number };
  count_by_type: { [key in MediaType]: number };
  storage_used: number;
  storage_limit: number;
  storage_percentage: number;
  recent_uploads: number;
  popular_files: MediaFile[];
  storage_trend: Array<{
    date: string;
    size: number;
    files: number;
  }>;
  top_folders: Array<{
    folder: MediaFolder;
    file_count: number;
    total_size: number;
  }>;
  most_downloaded: MediaFile[];
  most_viewed: MediaFile[];
  upload_activity: Array<{
    date: string;
    uploads: number;
    size: number;
  }>;
}

// ===== COMENTÁRIOS E COLABORAÇÃO =====

export interface MediaComment {
  id: string;
  media_id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  created_at: string;
  updated_at?: string;
  replies?: MediaComment[];
  is_resolved?: boolean;
  mentions?: string[];
}

export interface MediaShare {
  id: string;
  media_id: string;
  shared_with: {
    user_id?: string;
    email?: string;
    role: 'viewer' | 'editor' | 'admin';
  };
  permissions: MediaPermissions;
  expires_at?: string;
  password?: string;
  download_limit?: number;
  download_count: number;
  created_at: string;
  created_by: string;
  is_active: boolean;
}

export interface MediaVersion {
  id: string;
  media_id: string;
  version: number;
  filename: string;
  size: number;
  mime_type: string;
  url: string;
  thumbnail_url?: string;
  changes: string;
  created_at: string;
  created_by: string;
  is_current: boolean;
}

// ===== TAGS E CATEGORIZAÇÃO =====

export interface MediaTag {
  id: string;
  name: string;
  color?: string;
  description?: string;
  usage_count: number;
  created_at: string;
  created_by: string;
  is_system: boolean;
}

export interface MediaCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  children: MediaCategory[];
  color?: string;
  icon?: string;
  file_count: number;
  created_at: string;
  created_by: string;
}

// ===== INTELIGÊNCIA ARTIFICIAL =====

export interface MediaAI {
  id: string;
  media_id: string;
  type: 'auto_tag' | 'face_recognition' | 'object_detection' | 'text_extraction' | 'color_analysis' | 'similarity_search';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  confidence?: number;
  created_at: string;
  completed_at?: string;
  error?: string;
}

export interface MediaSimilarity {
  media_id: string;
  similar_files: Array<{
    file: MediaFile;
    similarity: number;
    reason: 'visual' | 'metadata' | 'content' | 'tags';
  }>;
  created_at: string;
}

export interface MediaAutoTag {
  media_id: string;
  tags: Array<{
    tag: string;
    confidence: number;
    source: 'ai' | 'metadata' | 'filename' | 'content';
  }>;
  created_at: string;
}

// ===== CONFIGURAÇÕES =====

export interface MediaLibrarySettings {
  user_id: string;
  default_folder: string;
  auto_organize: boolean;
  auto_tag: boolean;
  generate_thumbnails: boolean;
  extract_metadata: boolean;
  detect_faces: boolean;
  compress_uploads: boolean;
  watermark_uploads: boolean;
  max_file_size: number;
  allowed_types: MediaType[];
  storage_provider: 'local' | 's3' | 'gcs' | 'azure';
  storage_config: any;
  backup_enabled: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  retention_policy: {
    enabled: boolean;
    days: number;
    action: 'delete' | 'archive';
  };
  created_at: string;
  updated_at: string;
}

// ===== EXPORTAÇÃO E INTEGRAÇÃO =====

export interface MediaExport {
  id: string;
  type: 'files' | 'folders' | 'search_results';
  format: 'zip' | 'tar' | 'json' | 'csv';
  filters: MediaSearchFilters;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_url?: string;
  file_size?: number;
  created_at: string;
  completed_at?: string;
  created_by: string;
  expires_at?: string;
}

export interface MediaIntegration {
  id: string;
  name: string;
  type: 'cloud_storage' | 'cms' | 'social_media' | 'ai_service' | 'custom';
  config: any;
  is_active: boolean;
  last_sync?: string;
  sync_frequency: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// ===== HISTÓRICO E AUDITORIA =====

export interface MediaHistory {
  id: string;
  media_id: string;
  action: 'upload' | 'download' | 'view' | 'edit' | 'delete' | 'move' | 'copy' | 'share' | 'tag' | 'comment';
  details: any;
  user_id?: string;
  user_name?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export interface MediaAudit {
  id: string;
  media_id: string;
  event_type: 'access' | 'modification' | 'deletion' | 'sharing' | 'permission_change';
  old_value?: any;
  new_value?: any;
  user_id?: string;
  user_name?: string;
  ip_address?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// ===== TIPOS DE RESPOSTA DA API =====

export interface MediaApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  meta?: {
    timestamp: string;
    request_id: string;
    version: string;
  };
}

export interface MediaBulkResponse<T> {
  success: boolean;
  data: {
    created: T[];
    updated: T[];
    deleted: string[];
    failed: {
      id: string;
      error: string;
    }[];
  };
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// ===== TIPOS DE UTILITÁRIOS =====

export type MediaViewMode = 'grid' | 'list' | 'timeline' | 'map';

export type MediaSortBy = 'name' | 'size' | 'date' | 'type' | 'downloads' | 'views' | 'modified';

export type MediaSortOrder = 'asc' | 'desc';

export type MediaOperation = 'resize' | 'crop' | 'rotate' | 'filter' | 'watermark' | 'compress' | 'convert' | 'extract' | 'preview';

export type MediaStorageProvider = 'local' | 's3' | 'gcs' | 'azure' | 'cloudinary';

export type MediaBackupFrequency = 'daily' | 'weekly' | 'monthly' | 'manual';

// ===== TIPOS DE EVENTOS =====

export interface MediaEvent {
  type: 'upload_started' | 'upload_progress' | 'upload_completed' | 'upload_failed' | 'file_deleted' | 'file_moved' | 'file_shared' | 'folder_created' | 'folder_deleted';
  media_id?: string;
  folder_id?: string;
  data: any;
  timestamp: string;
  user_id?: string;
}

// ===== TIPOS DE NOTIFICAÇÕES =====

export interface MediaNotification {
  id: string;
  type: 'upload_complete' | 'share_received' | 'comment_added' | 'storage_warning' | 'quota_exceeded';
  title: string;
  message: string;
  media_id?: string;
  folder_id?: string;
  is_read: boolean;
  created_at: string;
  user_id: string;
  action_url?: string;
  action_label?: string;
}

// ===== TIPOS DE TEMPLATES =====

export interface MediaTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'folder_structure' | 'upload_preset' | 'processing_workflow';
  content: any;
  is_public: boolean;
  is_featured: boolean;
  usage_count: number;
  rating: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  author_id: string;
}

// ===== TIPOS DE WORKFLOWS =====

export interface MediaWorkflow {
  id: string;
  name: string;
  description?: string;
  trigger: 'upload' | 'manual' | 'schedule' | 'webhook';
  conditions: any[];
  actions: Array<{
    type: string;
    config: any;
    order: number;
  }>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface MediaWorkflowExecution {
  id: string;
  workflow_id: string;
  media_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  duration?: number;
  steps: Array<{
    action: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    result?: any;
    error?: string;
    started_at?: string;
    completed_at?: string;
    duration?: number;
  }>;
  error?: string;
  retry_count: number;
  max_retries: number;
}

// =========================================
// TIPOS DE RESPOSTA DA API
// =========================================

export interface MediaApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  meta?: {
    timestamp: string;
    request_id: string;
    version: string;
  };
}

export interface MediaBulkResponse<T> {
  success: boolean;
  data: {
    created: T[];
    updated: T[];
    deleted: string[];
    failed: {
      id: string;
      error: string;
    }[];
  };
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// =========================================
// TIPOS DE UTILITÁRIOS
// =========================================

export type MediaViewMode = 'grid' | 'list' | 'timeline' | 'map';

export type MediaSortBy = 'name' | 'size' | 'date' | 'type' | 'downloads' | 'views' | 'modified';

export type MediaSortOrder = 'asc' | 'desc';

export type MediaOperation = 'resize' | 'crop' | 'rotate' | 'filter' | 'watermark' | 'compress' | 'convert' | 'extract' | 'preview';

export type MediaStorageProvider = 'local' | 's3' | 'gcs' | 'azure' | 'cloudinary';

export type MediaBackupFrequency = 'daily' | 'weekly' | 'monthly' | 'manual';

// =========================================
// TIPOS DE EVENTOS
// =========================================

export interface MediaEvent {
  type: 'upload_started' | 'upload_progress' | 'upload_completed' | 'upload_failed' | 'file_deleted' | 'file_moved' | 'file_shared' | 'folder_created' | 'folder_deleted';
  media_id?: string;
  folder_id?: string;
  data: any;
  timestamp: string;
  user_id?: string;
}

// =========================================
// TIPOS DE NOTIFICAÇÕES
// =========================================

export interface MediaNotification {
  id: string;
  type: 'upload_complete' | 'share_received' | 'comment_added' | 'storage_warning' | 'quota_exceeded';
  title: string;
  message: string;
  media_id?: string;
  folder_id?: string;
  is_read: boolean;
  created_at: string;
  user_id: string;
  action_url?: string;
  action_label?: string;
}

// =========================================
// TIPOS DE TEMPLATES
// =========================================

export interface MediaTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'folder_structure' | 'upload_preset' | 'processing_workflow';
  content: any;
  is_public: boolean;
  is_featured: boolean;
  usage_count: number;
  rating: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  author_id: string;
}

// =========================================
// TIPOS DE WORKFLOWS
// =========================================

export interface MediaWorkflow {
  id: string;
  name: string;
  description?: string;
  trigger: 'upload' | 'manual' | 'schedule' | 'webhook';
  conditions: any[];
  actions: Array<{
    type: string;
    config: any;
    order: number;
  }>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}
