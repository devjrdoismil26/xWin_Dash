/**
 * Tipos TypeScript para o módulo Activity
 *
 * @description
 * Consolida todas as interfaces e tipos relacionados a logs de atividade.
 * Inclui ActivityLog, ActivityStats, ActivityFilters e tipos relacionados.
 *
 * @module modules/Activity/types/activityTypes
 * @since 1.0.0
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
  updated_at: string; }

export interface ActivityStats {
  today_logs: number;
  total_logs: number;
  error_logs: number;
  security_logs: number;
  active_users: number;
  api_calls: number; }

export interface ActivityFilters {
  search?: string;
  type?: 'all' | 'login' | 'create' | 'update' | 'delete' | 'email' | 'security' | 'api' | 'error';
  user?: 'all' | 'admin' | 'user' | 'system';
  date?: 'all' | 'today' | 'yesterday' | 'week' | 'month';
  page?: number;
  per_page?: number; }

export interface ActivityPagination {
  current_page: number;
  from: number;
  to: number;
  per_page: number;
  total: number;
  last_page: number;
  pagination?: { page?: number;
  limit?: number;
  total?: number; };

  count?: number;
}

export interface ActivityResponse {
  success: boolean;
  data: ActivityLog[];
  pagination?: ActivityPagination;
  stats?: ActivityStats;
  message?: string;
  error?: string;
  total?: number;
  count?: number; }

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  filters?: ActivityFilters;
  include_properties?: boolean;
  [key: string]: unknown; }

export interface ActivityOperation {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  started_at: string;
  completed_at?: string;
  error?: string; }

// Re-export enums and constants from activityEnums.ts
export * from './activityEnums';