import type { MediaType } from './core.types';
import type { MediaSearchFilters } from './search.types';

export interface MediaWorkflow {
  id: string;
  name: string;
  description?: string;
  trigger: 'upload' | 'manual' | 'schedule' | 'webhook';
  conditions: string[];
  actions: Array<{ type: string;
  config: unknown;
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
  result?: string;
  error?: string;
  started_at?: string;
  completed_at?: string;
  duration?: number; }>;
  error?: string;
  retry_count: number;
  max_retries: number;
}

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
  storage_config: unknown;
  backup_enabled: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  retention_policy: {
    enabled: boolean;
  days: number;
  action: 'delete' | 'archive';
  [key: string]: unknown; };

  created_at: string;
  updated_at: string;
}

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
  expires_at?: string; }

export interface MediaIntegration {
  id: string;
  name: string;
  type: 'cloud_storage' | 'cms' | 'social_media' | 'ai_service' | 'custom';
  config: unknown;
  is_active: boolean;
  last_sync?: string;
  sync_frequency: number;
  created_at: string;
  updated_at: string;
  user_id: string; }

export interface MediaTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'folder_structure' | 'upload_preset' | 'processing_workflow';
  content: unknown;
  is_public: boolean;
  is_featured: boolean;
  usage_count: number;
  rating: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  author_id: string; }
