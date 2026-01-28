/**
 * Tipos TypeScript para o módulo Activity
 * Consolida todas as interfaces e tipos relacionados a logs de atividade
 */

export interface ActivityLog {
  id: string;
  log_name: string;
  description: string;
  subject_type?: string;
  subject_id?: string;
  causer_type?: string;
  causer_id?: string;
  properties?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ActivityStats {
  today_logs: number;
  total_logs: number;
  error_logs: number;
  security_logs: number;
  active_users: number;
  api_calls: number;
}

export interface ActivityFilters {
  search?: string;
  type?: 'all' | 'login' | 'create' | 'update' | 'delete' | 'email' | 'security' | 'api' | 'error';
  user?: 'all' | 'admin' | 'user' | 'system';
  date?: 'all' | 'today' | 'yesterday' | 'week' | 'month';
  page?: number;
  per_page?: number;
}

export interface ActivityPagination {
  current_page: number;
  from: number;
  to: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ActivityResponse {
  success: boolean;
  data: ActivityLog[];
  pagination?: ActivityPagination;
  stats?: ActivityStats;
  message?: string;
  error?: string;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  filters?: ActivityFilters;
  include_properties?: boolean;
}

export interface ActivityOperation {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  started_at: string;
  completed_at?: string;
  error?: string;
}

// Re-export enums and constants from activityEnums.ts
export * from './activityEnums';