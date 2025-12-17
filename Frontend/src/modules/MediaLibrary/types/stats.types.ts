import type { MediaFile, MediaFolder, MediaType } from './core.types';

export interface MediaStats {
  total_files: number;
  total_folders: number;
  total_size: number;
  size_by_type: { [key in MediaType]: number;
};

  count_by_type: { [key in MediaType]: number};

  storage_used: number;
  storage_limit: number;
  storage_percentage: number;
  recent_uploads: number;
  popular_files: MediaFile[];
  storage_trend: Array<{ date: string; size: number; files: number }>;
  top_folders: Array<{ folder: MediaFolder; file_count: number; total_size: number }>;
  most_downloaded: MediaFile[];
  most_viewed: MediaFile[];
  upload_activity: Array<{ date: string; uploads: number; size: number }>;
}
