// Extended Workflow Types - Missing exports
import { Workflow } from './workflowTypes';

// Missing types from index.ts exports
export interface WorkflowType extends Workflow {}
export interface WorkflowNode {
  id: string;
  type: string;
  data: Record<string, any>;
  position?: { x: number;
  y: number;
};

}

export type WorkflowNodeType = string;
export type WorkflowNodeStatus = 'idle' | 'running' | 'completed' | 'failed';
export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string; }

export interface WorkflowExecutionResult {
  success: boolean;
  data?: string;
  error?: string; }

export interface WorkflowExecutionError {
  message: string;
  code?: string;
  details?: string; }

export interface WorkflowExecutionLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: string; }

export interface WorkflowExecutionMetrics {
  duration: number;
  steps_completed: number;
  steps_failed: number;
  memory_used?: number; }

export interface WorkflowExecutionStats {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  average_duration: number; }

export interface WorkflowExecutionReport {
  id: string;
  workflow_id: string;
  status: string;
  metrics: WorkflowExecutionMetrics;
  logs: WorkflowExecutionLog[]; }

export interface WorkflowExecutionAnalytics {
  executions_by_day: Array<{ date: string;
  count: number;
}>;
  success_rate: number;
  average_duration: number;
}

export interface WorkflowExecutionDashboard {
  total_executions: number;
  active_executions: number;
  failed_executions: number;
  metrics: WorkflowExecutionMetrics; }

export interface WorkflowExecutionMonitor {
  workflow_id: string;
  status: string;
  progress: number;
  current_step?: string; }

export interface WorkflowExecutionAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date; }

export interface WorkflowExecutionNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info'; }

export interface WorkflowExecutionWebhook {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>; }

export interface WorkflowExecutionAPI {
  endpoint: string;
  method: string;
  data?: string; }

export interface WorkflowExecutionIntegration {
  type: string;
  config: Record<string, any>; }

export interface WorkflowExecutionSync {
  last_sync: Date;
  status: 'synced' | 'pending' | 'failed'; }

export interface WorkflowExecutionBackup {
  id: string;
  created_at: Date;
  size: number; }

export interface WorkflowExecutionRestore {
  backup_id: string;
  status: 'pending' | 'completed' | 'failed'; }

export interface WorkflowExecutionMigration {
  from_version: string;
  to_version: string;
  status: string; }

export interface WorkflowExecutionUpgrade {
  version: string;
  changes: string[]; }

export interface WorkflowExecutionDowngrade {
  version: string;
  reason: string; }

export interface WorkflowExecutionMaintenance {
  scheduled_at: Date;
  duration: number;
  type: string; }

export interface WorkflowExecutionHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Array<{ name: string;
  status: boolean;
}>;
}

export interface WorkflowExecutionPerformance {
  cpu_usage: number;
  memory_usage: number;
  response_time: number; }

export interface WorkflowExecutionSecurity {
  encrypted: boolean;
  access_level: string; }

export interface WorkflowExecutionCompliance {
  compliant: boolean;
  standards: string[]; }

export interface WorkflowExecutionAudit {
  user_id: string;
  action: string;
  timestamp: Date; }

export interface WorkflowExecutionLogs {
  logs: WorkflowExecutionLog[];
  total: number; }

// Template types
export interface WorkflowTemplateType {
  id: string;
  name: string;
  category: string; }

export type WorkflowTemplateStatus = 'draft' | 'published' | 'archived';

export interface WorkflowTemplateCategory {
  id: string;
  name: string;
  description?: string; }

export interface WorkflowTemplateTag {
  id: string;
  name: string; }

export interface WorkflowTemplateRating {
  rating: number;
  count: number; }

export interface WorkflowTemplateReview {
  id: string;
  user_id: string;
  rating: number;
  comment: string; }

export interface WorkflowTemplateComment {
  id: string;
  user_id: string;
  text: string;
  created_at: Date; }

export interface WorkflowTemplateLike {
  user_id: string;
  created_at: Date; }

export interface WorkflowTemplateShare {
  shared_with: string[];
  permissions: string[]; }

export interface WorkflowTemplateDownload {
  count: number;
  last_downloaded: Date; }

export interface WorkflowTemplateUsage {
  count: number;
  last_used: Date; }

export interface WorkflowTemplateAnalytics {
  views: number;
  downloads: number;
  usage: number; }

export interface WorkflowTemplateStats {
  total_templates: number;
  published: number;
  draft: number; }

export interface WorkflowTemplateReport {
  id: string;
  template_id: string;
  metrics: unknown; }

export interface WorkflowTemplateDashboard {
  total: number;
  popular: string[];
  recent: string[]; }

export interface WorkflowTemplatePerformance {
  load_time: number;
  execution_time: number; }

export interface WorkflowTemplateMonitor {
  status: string;
  health: string; }

export interface WorkflowTemplateAlert {
  type: string;
  message: string; }

export interface WorkflowTemplateNotification {
  title: string;
  message: string; }

export interface WorkflowTemplateWebhook {
  url: string;
  events: string[]; }

export interface WorkflowTemplateAPI {
  endpoint: string;
  methods: string[]; }

export interface WorkflowTemplateIntegration {
  type: string;
  enabled: boolean; }

export interface WorkflowTemplateSync {
  last_sync: Date;
  status: string; }

export interface WorkflowTemplateBackup {
  id: string;
  created_at: Date; }

export interface WorkflowTemplateRestore {
  backup_id: string;
  status: string; }

export interface WorkflowTemplateMigration {
  from_version: string;
  to_version: string; }

export interface WorkflowTemplateUpgrade {
  version: string;
  features: string[]; }

export interface WorkflowTemplateDowngrade {
  version: string;
  reason: string; }

export interface WorkflowTemplateMaintenance {
  scheduled: boolean;
  date?: Date; }

export interface WorkflowTemplateHealth {
  status: 'healthy' | 'unhealthy'; }

export interface WorkflowTemplateSecurity {
  encrypted: boolean;
  access_control: boolean; }

export interface WorkflowTemplateCompliance {
  compliant: boolean;
  standards: string[]; }

export interface WorkflowTemplateAudit {
  logs: string[];
  last_audit: Date; }

// Filters
export interface WorkflowFilters {
  status?: string;
  created_after?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  trigger_type?: string; }
