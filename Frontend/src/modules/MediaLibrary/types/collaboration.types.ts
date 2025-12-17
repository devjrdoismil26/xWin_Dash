import type { MediaPermissions } from './core.types';

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
  mentions?: string[]; }

export interface MediaShare {
  id: string;
  media_id: string;
  shared_with: {
    user_id?: string;
  email?: string;
  role: 'viewer' | 'editor' | 'admin'; };

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
  is_current: boolean; }

export interface MediaTag {
  id: string;
  name: string;
  color?: string;
  description?: string;
  usage_count: number;
  created_at: string;
  created_by: string;
  is_system: boolean; }

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
  created_by: string; }
