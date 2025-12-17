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
  metadata?: string;
  url: string;
  dimensions?: { width: number;
  height: number;
};

  duration?: number;
  exists: boolean;
  created_at: string;
  updated_at: string;
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
  project?: string;
  user?: string;
  created_at: string;
  updated_at: string; }

export interface MediaPermissions {
  can_view: boolean;
  can_upload: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_share: boolean;
  can_download: boolean;
  can_comment: boolean;
  can_tag: boolean; }

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
export type MediaViewMode = 'grid' | 'list' | 'timeline' | 'map';
export type MediaSortBy = 'name' | 'size' | 'date' | 'type' | 'downloads' | 'views' | 'modified';
export type MediaSortOrder = 'asc' | 'desc';
