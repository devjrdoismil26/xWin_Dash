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
  updated_at: string;
}

export type WorkflowStatus = 
  | 'draft' 
  | 'active' 
  | 'paused' 
  | 'archived';

export interface WorkflowTrigger {
  type: WorkflowTriggerType;
  conditions: WorkflowCondition[];
  schedule?: WorkflowSchedule;
}

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
  logic?: 'and' | 'or';
}

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
  cron_expression?: string;
}

export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  name: string;
  config: Record<string, any>;
  position: WorkflowPosition;
  connections: string[];
  conditions?: WorkflowCondition[];
}

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
  y: number;
}

export interface WorkflowCanvasData {
  nodes: WorkflowCanvasNode[];
  edges: WorkflowCanvasEdge[];
  viewport: WorkflowViewport;
}

export interface WorkflowCanvasNode {
  id: string;
  type: string;
  position: WorkflowPosition;
  data: Record<string, any>;
  selected?: boolean;
}

export interface WorkflowCanvasEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

export interface WorkflowViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface WorkflowExecution {
  id: number;
  workflow_id: number;
  status: WorkflowExecutionStatus;
  trigger_data: Record<string, any>;
  context: Record<string, any>;
  started_at: string;
  completed_at?: string;
  error_message?: string;
  steps_executed: WorkflowExecutionStep[];
}

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
  output_data?: Record<string, any>;
}

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
  execution_trends: WorkflowExecutionTrend[];
}

export interface WorkflowExecutionTrend {
  date: string;
  executions: number;
  successful: number;
  failed: number;
}

export interface WorkflowTemplate {
  id: number;
  name: string;
  description: string;
  category: WorkflowTemplateCategory;
  template_data: Workflow;
  is_public: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

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
  value: any;
  scope: WorkflowVariableScope;
  description?: string;
}

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
  onWorkflowSave?: (workflow: Workflow) => void;
  onWorkflowTest?: (workflow: Workflow) => void;
  onWorkflowPublish?: (workflow: Workflow) => void;
}

export interface WorkflowCanvasProps {
  canvasData: WorkflowCanvasData;
  onCanvasUpdate?: (canvasData: WorkflowCanvasData) => void;
  onNodeAdd?: (node: WorkflowCanvasNode) => void;
  onNodeUpdate?: (nodeId: string, node: WorkflowCanvasNode) => void;
  onNodeDelete?: (nodeId: string) => void;
  onEdgeAdd?: (edge: WorkflowCanvasEdge) => void;
  onEdgeDelete?: (edgeId: string) => void;
}

export interface WorkflowStepEditorProps {
  step: WorkflowStep;
  onStepUpdate?: (step: WorkflowStep) => void;
  onStepDelete?: (stepId: string) => void;
  onClose?: () => void;
}

export interface WorkflowTriggerEditorProps {
  trigger: WorkflowTrigger;
  onTriggerUpdate?: (trigger: WorkflowTrigger) => void;
  onClose?: () => void;
}

export interface WorkflowExecutionListProps {
  executions: WorkflowExecution[];
  loading?: boolean;
  error?: string;
  onExecutionView?: (executionId: number) => void;
  onExecutionRetry?: (executionId: number) => void;
  onExecutionCancel?: (executionId: number) => void;
}

export interface WorkflowExecutionDetailsProps {
  execution: WorkflowExecution;
  workflow: Workflow;
  loading?: boolean;
  error?: string;
  onExecutionRetry?: (executionId: number) => void;
  onExecutionCancel?: (executionId: number) => void;
}

export interface WorkflowAnalyticsDashboardProps {
  analytics: WorkflowAnalytics;
  loading?: boolean;
  error?: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export interface WorkflowTemplateManagerProps {
  templates: WorkflowTemplate[];
  loading?: boolean;
  error?: string;
  onTemplateCreate?: () => void;
  onTemplateEdit?: (template: WorkflowTemplate) => void;
  onTemplateDelete?: (templateId: number) => void;
  onTemplateUse?: (template: WorkflowTemplate) => void;
}

export interface WorkflowVariableManagerProps {
  variables: WorkflowVariable[];
  loading?: boolean;
  error?: string;
  onVariableCreate?: () => void;
  onVariableEdit?: (variable: WorkflowVariable) => void;
  onVariableDelete?: (variableId: string) => void;
}

export interface WorkflowManagerProps {
  workflows: Workflow[];
  loading?: boolean;
  error?: string;
  onWorkflowCreate?: () => void;
  onWorkflowEdit?: (workflow: Workflow) => void;
  onWorkflowDelete?: (workflowId: number) => void;
  onWorkflowToggle?: (workflowId: number) => void;
  onWorkflowDuplicate?: (workflowId: number) => void;
}

export interface WorkflowDashboardProps {
  workflows: Workflow[];
  executions: WorkflowExecution[];
  analytics: WorkflowAnalytics;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

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
  updatedAt: string;
}

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
  errorRate: number;
}

export interface WorkflowExecutionQueueFilter {
  status?: WorkflowExecutionQueueStatus[];
  priority?: WorkflowExecutionPriority[];
  workflowId?: number[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface WorkflowExecutionQueueSort {
  field: 'scheduledAt' | 'priority' | 'status' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface WorkflowExecutionQueuePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WorkflowExecutionQueueResponse {
  items: WorkflowExecutionQueue[];
  stats: WorkflowExecutionQueueStats;
  pagination: WorkflowExecutionQueuePagination;
}

// ===== QUEUE MANAGEMENT TYPES =====
export interface WorkflowQueueProcessResult {
  processed: number;
  failed: number;
  skipped: number;
  errors: string[];
  processingTime: number;
}

export interface WorkflowQueueRetryResult {
  retried: number;
  failed: number;
  errors: string[];
}

export interface WorkflowQueueClearResult {
  cleared: number;
  errors: string[];
}

export interface WorkflowQueueStatus {
  isProcessing: boolean;
  currentProcessing: number;
  queueSize: number;
  lastProcessedAt?: string;
  nextScheduledAt?: string;
  errors: string[];
}

// ===== API RESPONSE TYPES =====
export interface WorkflowExecutionQueueApiResponse {
  success: boolean;
  data: WorkflowExecutionQueueResponse | WorkflowExecutionQueue | WorkflowQueueProcessResult | WorkflowQueueRetryResult | WorkflowQueueClearResult | WorkflowQueueStatus;
  message?: string;
  error?: string;
}

// ===== HOOK RETURN TYPES =====
export interface UseWorkflowExecutionQueueReturn {
  queue: WorkflowExecutionQueue[];
  stats: WorkflowExecutionQueueStats;
  pagination: WorkflowExecutionQueuePagination;
  loading: boolean;
  error: string | null;
  filters: WorkflowExecutionQueueFilter;
  sort: WorkflowExecutionQueueSort;
  setFilters: (filters: WorkflowExecutionQueueFilter) => void;
  setSort: (sort: WorkflowExecutionQueueSort) => void;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
  processQueue: () => Promise<void>;
  retryFailed: () => Promise<void>;
  retryAll: () => Promise<void>;
  clearQueue: () => Promise<void>;
  cancelExecution: (id: string) => Promise<void>;
  retryExecution: (id: string) => Promise<void>;
}

export interface UseWorkflowQueueStatusReturn {
  status: WorkflowQueueStatus | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  startProcessing: () => Promise<void>;
  stopProcessing: () => Promise<void>;
}

export interface UseWorkflowQueueManagementReturn {
  loading: boolean;
  error: string | null;
  processQueue: () => Promise<WorkflowQueueProcessResult>;
  retryFailed: () => Promise<WorkflowQueueRetryResult>;
  retryAll: () => Promise<WorkflowQueueRetryResult>;
  clearQueue: () => Promise<WorkflowQueueClearResult>;
  cancelExecution: (id: string) => Promise<void>;
  retryExecution: (id: string) => Promise<void>;
  updateExecutionPriority: (id: string, priority: WorkflowExecutionPriority) => Promise<void>;
}
