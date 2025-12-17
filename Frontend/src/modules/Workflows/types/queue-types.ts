// Workflow Queue Types

export interface WorkflowExecutionQueue {
  id: string;
  workflow_id: string;
  status: WorkflowExecutionQueueStatus;
  priority: WorkflowExecutionPriority;
  scheduled_at?: Date;
  started_at?: Date;
  completed_at?: Date;
  data?: string; }

export type WorkflowExecutionQueueStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type WorkflowExecutionPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface WorkflowExecutionQueueStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  average_wait_time: number;
  average_processing_time: number; }

export interface WorkflowExecutionQueueFilter {
  status?: WorkflowExecutionQueueStatus;
  priority?: WorkflowExecutionPriority;
  workflow_id?: string;
  from_date?: string;
  to_date?: string; }

export interface WorkflowExecutionQueueSort {
  field: 'created_at' | 'priority' | 'status';
  order: 'asc' | 'desc'; }

export interface WorkflowQueueStatus {
  is_running: boolean;
  pending_count: number;
  processing_count: number;
  workers_active: number; }

export interface WorkflowExecutionQueueResponse {
  data: WorkflowExecutionQueue[];
  total: number;
  page: number;
  per_page: number;
  success?: boolean;
  message?: string;
  error?: string; }

export interface WorkflowExecutionQueueApiResponse {
  success: boolean;
  data?: WorkflowExecutionQueue | WorkflowExecutionQueue[];
  error?: string;
  message?: string; }
