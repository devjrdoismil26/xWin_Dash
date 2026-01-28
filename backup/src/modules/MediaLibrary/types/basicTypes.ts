/**
 * Tipos básicos para os componentes da MediaLibrary
 */

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio' | 'archive';
  size: number;
  modifiedAt: string;
  folderId?: string;
  url?: string;
  thumbnail?: string;
}

export interface Folder {
  id: string;
  name: string;
  itemCount: number;
  size: number;
  modifiedAt: string;
  parent?: Folder;
}

export interface MediaStats {
  total: number;
  images: number;
  videos: number;
  documents: number;
  audio: number;
  storageUsage: number;
  recentActivity: number;
}

export interface Breadcrumb {
  name: string;
  id: string;
}
