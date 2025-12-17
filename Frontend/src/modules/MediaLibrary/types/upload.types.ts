export interface MediaUpload {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  media_id?: string;
  folder_id?: string;
  metadata?: string;
  started_at: string;
  completed_at?: string;
  duration?: number;
  retry_count: number;
  max_retries: number; }

export interface MediaUploadConfig {
  max_file_size: number;
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
  [key: string]: unknown; };

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
  result?: string;
  retry_count: number;
  max_retries: number; }

export type MediaOperation = 'resize' | 'crop' | 'rotate' | 'filter' | 'watermark' | 'compress' | 'convert' | 'extract' | 'preview';
export type MediaStorageProvider = 'local' | 's3' | 'gcs' | 'azure' | 'cloudinary';
