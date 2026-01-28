/**
 * Interfaces específicas do módulo Activity
 * Interfaces adicionais que complementam os tipos principais
 */

import { ActivityLog, ActivityStats, ActivityFilters } from './activityTypes';

export interface ActivityModuleStats {
  total_logs: number;
  today_logs: number;
  active_users: number;
  error_logs: number;
  api_calls: number;
  recent_activities: number;
  top_users: Array<{ user: string; count: number }>;
  activity_trend: Array<{ date: string; count: number }>;
}

export interface UserActivityStats {
  user_id: string;
  user_name: string;
  total_actions: number;
  actions_today: number;
  actions_this_week: number;
  actions_this_month: number;
  most_used_actions: Array<{
    action: string;
    count: number;
  }>;
  most_used_modules: Array<{
    module: string;
    count: number;
  }>;
  last_activity: string;
  activity_trend: Array<{
    date: string;
    count: number;
  }>;
}

export interface SystemHealthStats {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time: number;
  error_rate: number;
  uptime_percentage: number;
  active_users: number;
  system_load: number;
  memory_usage: number;
  disk_usage: number;
  last_updated: string;
}

export interface RealTimeLog {
  id: string;
  log_name: string;
  description: string;
  subject_type?: string;
  subject_id?: string;
  causer_type?: string;
  causer_id?: string;
  properties?: Record<string, any>;
  created_at: string;
}

export interface ActivityData {
  id: string;
  [key: string]: any;
}

export interface ActivityResponse {
  success: boolean;
  data?: ActivityData | ActivityData[];
  message?: string;
  error?: string;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface ActivityLogResponse {
  data: ActivityLog[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface ActivityLogFilters {
  search?: string;
  log_name?: string;
  causer_type?: string;
  subject_type?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export interface ActivityLogStats {
  total_logs: number;
  today_logs: number;
  active_users: number;
  error_logs: number;
  api_calls: number;
  by_type: Record<string, number>;
  by_user: Record<string, number>;
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
