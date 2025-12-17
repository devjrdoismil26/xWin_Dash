export interface Media {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  format: string;
  size: number;
  url: string;
  thumbnail_url: string;
  folder_id?: string;
  alt_text?: string;
  tags: string[];
  metadata: {
    created_at: string;
  updated_at: string;
  uploaded_by: string; };

  is_favorite: boolean;
  views_count: number;
  downloads_count: number;
}

export interface MediaFolder {
  id: string;
  name: string;
  parent_id?: string;
  full_path?: string;
  created_at: string;
  updated_at: string; }

export interface MediaStats {
  total_files: number;
  total_size: number;
  by_type: {
    images: number;
  videos: number;
  audio: number;
  documents: number;
  others: number; };

  storage_used_percentage: number;
  recent_uploads: number;
  favorites_count: number;
}

export interface MediaLibrary {
  files: Media[];
  folders: MediaFolder[];
  stats: MediaStats; }
