// Workflows Types
export interface Workflow {
  id: number;
  name: string;
  description?: string;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  canvas_data?: WorkflowCanvasData;
  is_active: boolean;
  executions_count: number;
  success_rate: number;
  last_execution?: string;
  created_at: string;
  updated_at: string; }

export type WorkflowStatus = 
  | 'draft' 
  | 'active' 
  | 'paused' 
  | 'archived';

export interface WorkflowTrigger {
  type: WorkflowTriggerType;
  conditions: WorkflowCondition[];
  schedule?: WorkflowSchedule; }

export type WorkflowTriggerType = 
  | 'webhook' 
  | 'schedule' 
  | 'email_received' 
  | 'form_submitted' 
  | 'user_action' 
  | 'api_call' 
  | 'manual';

export interface WorkflowCondition {
  field: string;
  operator: WorkflowOperator;
  value: string | number | boolean;
  logic?: 'and' | 'or'; }

export type WorkflowOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'greater_than' 
  | 'less_than' 
  | 'is_empty' 
  | 'is_not_empty' 
  | 'starts_with' 
  | 'ends_with';

export interface WorkflowSchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  time: string;
  timezone: string;
  days?: number[];
  cron_expression?: string; }

export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  name: string;
  config: Record<string, any>;
  position: WorkflowPosition;
  connections: string[];
  conditions?: WorkflowCondition[]; }

export type WorkflowStepType = 
  | 'send_email' 
  | 'send_sms' 
  | 'webhook' 
  | 'delay' 
  | 'condition' 
  | 'assign_variable' 
  | 'create_lead' 
  | 'update_lead' 
  | 'add_tag' 
  | 'remove_tag' 
  | 'create_task' 
  | 'send_notification' 
  | 'api_call' 
  | 'data_transform' 
  | 'loop' 
  | 'merge_data';

export interface WorkflowPosition {
  x: number;
  y: number; }

export interface WorkflowCanvasData {
  nodes: WorkflowCanvasNode[];
  edges: WorkflowCanvasEdge[];
  viewport: WorkflowViewport;
  [key: string]: unknown; }

export interface WorkflowCanvasNode {
  id: string;
  type: string;
  position: WorkflowPosition;
  data: Record<string, any>;
  selected?: boolean; }

export interface WorkflowCanvasEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean; }

export interface WorkflowViewport {
  x: number;
  y: number;
  zoom: number; }

export interface WorkflowExecution {
  id: number;
  workflow_id: number;
  status: WorkflowExecutionStatus;
  trigger_data: Record<string, any>;
  context: Record<string, any>;
  started_at: string;
  completed_at?: string;
  error_message?: string;
  steps_executed: WorkflowExecutionStep[]; }

export type WorkflowExecutionStatus = 
  | 'running' 
  | 'completed' 
  | 'failed' 
  | 'paused' 
  | 'cancelled';

export interface WorkflowExecutionStep {
  step_id: string;
  status: WorkflowExecutionStatus;
  started_at: string;
  completed_at?: string;
  error_message?: string;
  output_data?: Record<string, any>; }

export interface WorkflowAnalytics {
  total_workflows: number;
  active_workflows: number;
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_execution_time: number;
  success_rate: number;
  top_performing_workflows: Workflow[];
  recent_executions: WorkflowExecution[];
  execution_trends: WorkflowExecutionTrend[]; }

export interface WorkflowExecutionTrend {
  date: string;
  executions: number;
  successful: number;
  failed: number; }

export interface WorkflowTemplate {
  id: number;
  name: string;
  description: string;
  category: WorkflowTemplateCategory;
  template_data: Workflow;
  is_public: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string; }

export type WorkflowTemplateCategory = 
  | 'lead_nurturing' 
  | 'email_marketing' 
  | 'customer_support' 
  | 'sales_automation' 
  | 'data_processing' 
  | 'notifications' 
  | 'integrations' 
  | 'custom';

export interface WorkflowVariable {
  id: string;
  name: string;
  type: WorkflowVariableType;
  value: string | number | boolean | Record<string, any> | unknown[];
  scope: WorkflowVariableScope;
  description?: string; }

export type WorkflowVariableType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'array' 
  | 'object' 
  | 'date';

export type WorkflowVariableScope = 
  | 'global' 
  | 'workflow' 
  | 'execution' 
  | 'step';

// Component Props Types
export interface WorkflowBuilderProps {
  workflow: Workflow;
  onWorkflowSave??: (e: any) => void;
  onWorkflowTest??: (e: any) => void;
  onWorkflowPublish??: (e: any) => void;
  [key: string]: unknown; }

export interface WorkflowCanvasProps {
  canvasData: WorkflowCanvasData;
  onCanvasUpdate??: (e: any) => void;
  onNodeAdd??: (e: any) => void;
  onNodeUpdate??: (e: any) => void;
  onNodeDelete??: (e: any) => void;
  onEdgeAdd??: (e: any) => void;
  onEdgeDelete??: (e: any) => void;
  [key: string]: unknown; }

export interface WorkflowStepEditorProps {
  step: WorkflowStep;
  onStepUpdate??: (e: any) => void;
  onStepDelete??: (e: any) => void;
  onClose???: (e: any) => void;
  [key: string]: unknown; }

export interface WorkflowTriggerEditorProps {
  trigger: WorkflowTrigger;
  onTriggerUpdate??: (e: any) => void;
  onClose???: (e: any) => void;
  [key: string]: unknown; }

export interface WorkflowExecutionListProps {
  executions: WorkflowExecution[];
  loading?: boolean;
  error?: string;
  onExecutionView??: (e: any) => void;
  onExecutionRetry??: (e: any) => void;
  onExecutionCancel??: (e: any) => void;
  [key: string]: unknown; }

export interface WorkflowExecutionDetailsProps {
  execution: WorkflowExecution;
  workflow: Workflow;
  loading?: boolean;
  error?: string;
  onExecutionRetry??: (e: any) => void;
  onExecutionCancel??: (e: any) => void;
  [key: string]: unknown; }

export interface WorkflowAnalyticsDashboardProps {
  analytics: WorkflowAnalytics;
  loading?: boolean;
  error?: string;
  period?: string;
  onPeriodChange??: (e: any) => void;
  [key: string]: unknown; }

export interface WorkflowTemplateManagerProps {
  templates: WorkflowTemplate[];
  loading?: boolean;
  error?: string;
  onTemplateCreate???: (e: any) => void;
  onTemplateEdit??: (e: any) => void;
  onTemplateDelete??: (e: any) => void;
  onTemplateUse??: (e: any) => void;
  [key: string]: unknown; }

export interface WorkflowVariableManagerProps {
  variables: WorkflowVariable[];
  loading?: boolean;
  error?: string;
  onVariableCreate???: (e: any) => void;
  onVariableEdit??: (e: any) => void;
  onVariableDelete??: (e: any) => void;
  [key: string]: unknown; }

export interface WorkflowManagerProps {
  workflows: Workflow[];
  loading?: boolean;
  error?: string;
  onWorkflowCreate???: (e: any) => void;
  onWorkflowEdit??: (e: any) => void;
  onWorkflowDelete??: (e: any) => void;
  onWorkflowToggle??: (e: any) => void;
  onWorkflowDuplicate??: (e: any) => void;
  [key: string]: unknown; }

export interface WorkflowDashboardProps {
  workflows: Workflow[];
  executions: WorkflowExecution[];
  analytics: WorkflowAnalytics;
  loading?: boolean;
  error?: string;
  onRefresh???: (e: any) => void;
  [key: string]: unknown; }

// ===== EXECUTION QUEUE TYPES =====
export interface WorkflowExecutionQueue {
  id: string;
  workflowId: number;
  workflowName: string;
  status: WorkflowExecutionQueueStatus;
  priority: WorkflowExecutionPriority;
  triggerData: Record<string, any>;
  context: Record<string, any>;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  updatedAt: string; }

export type WorkflowExecutionQueueStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'retrying';

export type WorkflowExecutionPriority = 
  | 'low' 
  | 'normal' 
  | 'high' 
  | 'critical';

export interface WorkflowExecutionQueueStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  cancelled: number;
  retrying: number;
  averageProcessingTime: number;
  averageWaitTime: number;
  throughput: number;
  errorRate: number; }

export interface WorkflowExecutionQueueFilter {
  status?: WorkflowExecutionQueueStatus[];
  priority?: WorkflowExecutionPriority[];
  workflowId?: number[];
  dateFrom?: string;
  dateTo?: string;
  search?: string; }

export interface WorkflowExecutionQueueSort {
  field: 'scheduledAt' | 'priority' | 'status' | 'createdAt';
  direction: 'asc' | 'desc'; }

export interface WorkflowExecutionQueuePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  pagination?: { page?: number;
  limit?: number;
  total?: number; };

  count?: number;
}

export interface WorkflowExecutionQueueResponse {
  items: WorkflowExecutionQueue[];
  stats: WorkflowExecutionQueueStats;
  pagination: WorkflowExecutionQueuePagination;
  data?: string;
  success?: boolean;
  message?: string;
  error?: string;
  total?: number;
  count?: number; }

// ===== QUEUE MANAGEMENT TYPES =====
export interface WorkflowQueueProcessResult {
  processed: number;
  failed: number;
  skipped: number;
  errors: string[];
  processingTime: number; }

export interface WorkflowQueueRetryResult {
  retried: number;
  failed: number;
  errors: string[]; }

export interface WorkflowQueueClearResult {
  cleared: number;
  errors: string[]; }

export interface WorkflowQueueStatus {
  isProcessing: boolean;
  currentProcessing: number;
  queueSize: number;
  lastProcessedAt?: string;
  nextScheduledAt?: string;
  errors: string[]; }

// ===== API RESPONSE TYPES =====
export interface WorkflowExecutionQueueApiResponse {
  success: boolean;
  data: WorkflowExecutionQueueResponse | WorkflowExecutionQueue | WorkflowQueueProcessResult | WorkflowQueueRetryResult | WorkflowQueueClearResult | WorkflowQueueStatus;
  message?: string;
  error?: string; }

// ===== HOOK RETURN TYPES =====
export interface UseWorkflowExecutionQueueReturn {
  queue: WorkflowExecutionQueue[];
  stats: WorkflowExecutionQueueStats;
  pagination: WorkflowExecutionQueuePagination;
  loading: boolean;
  error: string | null;
  filters: WorkflowExecutionQueueFilter;
  sort: WorkflowExecutionQueueSort;
  setFilters?: (e: any) => void;
  setSort?: (e: any) => void;
  setPage?: (e: any) => void;
  refresh: () => Promise<void>;
  processQueue: () => Promise<void>;
  retryFailed: () => Promise<void>;
  retryAll: () => Promise<void>;
  clearQueue: () => Promise<void>;
  cancelExecution: (id: string) => Promise<void>;
  retryExecution: (id: string) => Promise<void>;
  total?: number;
  count?: number; }

export interface UseWorkflowQueueStatusReturn {
  status: WorkflowQueueStatus | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  startProcessing: () => Promise<void>;
  stopProcessing: () => Promise<void>; }

export interface UseWorkflowQueueManagementReturn {
  loading: boolean;
  error: string | null;
  processQueue: () => Promise<WorkflowQueueProcessResult>;
  retryFailed: () => Promise<WorkflowQueueRetryResult>;
  retryAll: () => Promise<WorkflowQueueRetryResult>;
  clearQueue: () => Promise<WorkflowQueueClearResult>;
  cancelExecution: (id: string) => Promise<void>;
  retryExecution: (id: string) => Promise<void>;
  updateExecutionPriority: (id: string, priority: WorkflowExecutionPriority) => Promise<void>; }


// ===== ADDITIONAL WORKFLOW TYPES =====

export type WorkflowConnectionType = 'success' | 'failure' | 'conditional' | 'default';

export interface WorkflowValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[]; }

export interface WorkflowPerformanceMetrics {
  average_execution_time: number;
  success_rate: number;
  total_executions: number;
  failed_executions: number; }

export interface WorkflowSystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  active_workflows: number;
  queued_workflows: number; }

export interface WorkflowExecutionNotification {
  execution_id: number;
  type: 'started' | 'completed' | 'failed' | 'paused';
  message: string;
  timestamp: string; }

export interface WorkflowExecutionCompliance {
  execution_id: number;
  compliant: boolean;
  regulations: string[];
  audit_trail: string[]; }

export interface WorkflowTemplatePerformance {
  template_id: number;
  usage_count: number;
  success_rate: number;
  average_duration: number; }

export interface WorkflowTemplateIntegration {
  template_id: number;
  integrations: string[];
  webhooks: string[]; }

export interface WorkflowTemplateNotification {
  template_id: number;
  notification_channels: string[];
  recipients: string[]; }

export interface WorkflowTemplateDashboard {
  template_id: number;
  widgets: string[];
  layout: Record<string, any>; }

export interface WorkflowTemplateMaintenance {
  template_id: number;
  last_updated: string;
  next_review: string;
  status: 'active' | 'deprecated' | 'archived'; }

export interface WorkflowTemplateMigration {
  from_version: string;
  to_version: string;
  changes: string[];
  status: 'pending' | 'in_progress' | 'completed'; }

export interface WorkflowTemplateCompliance {
  template_id: number;
  compliant: boolean;
  standards: string[];
  last_audit: string; }

export interface WorkflowTemplateDowngrade {
  template_id: number;
  from_version: string;
  to_version: string;
  reason: string; }
