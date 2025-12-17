export interface MediaApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;};

  meta?: {
    timestamp: string;
    request_id: string;
    version: string;};

}

export interface MediaBulkResponse<T> {
  success: boolean;
  data: {
    created: T[];
    updated: T[];
    deleted: string[];
    failed: Array<{ id: string; error: string 
  message?: string;
}>;};

  summary: {
    total: number;
    successful: number;
    failed: number;};

}

export interface MediaEvent {
  type: 'upload_started' | 'upload_progress' | 'upload_completed' | 'upload_failed' | 'file_deleted' | 'file_moved' | 'file_shared' | 'folder_created' | 'folder_deleted';
  media_id?: string;
  folder_id?: string;
  data: unknown;
  timestamp: string;
  user_id?: string; }

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
  action_label?: string; }

export interface MediaHistory {
  id: string;
  media_id: string;
  action: 'upload' | 'download' | 'view' | 'edit' | 'delete' | 'move' | 'copy' | 'share' | 'tag' | 'comment';
  details: unknown;
  user_id?: string;
  user_name?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string; }

export interface MediaAudit {
  id: string;
  media_id: string;
  event_type: 'access' | 'modification' | 'deletion' | 'sharing' | 'permission_change';
  old_value?: string;
  new_value?: string;
  user_id?: string;
  user_name?: string;
  ip_address?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical'; }
