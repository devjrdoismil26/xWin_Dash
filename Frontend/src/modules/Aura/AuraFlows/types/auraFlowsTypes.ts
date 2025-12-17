/**
 * @module modules/Aura/AuraFlows/types/auraFlowsTypes
 * @description
 * Tipos TypeScript principais do módulo AuraFlows.
 * 
 * Define todos os tipos, interfaces e enums relacionados a:
 * - Status e tipos de fluxos
 * - Nós e conexões de fluxo
 * - Triggers e condições
 * - Execuções e passos de execução
 * - Templates e variáveis
 * - Métricas e analytics
 * - Monitoramento e backups
 * - Colaboração e compartilhamento
 * 
 * @example
 * ```typescript
 * import { AuraFlow, FlowNode, FlowStatus, FlowTriggerType } from './auraFlowsTypes';
 * 
 * const flow: AuraFlow = {
 *   id: 'flow-123',
 *   name: 'Fluxo de Boas-vindas',
 *   status: 'active',
 *   trigger_type: 'message_received',
 *   // ...
 *};

 * ```
 * 
 * @since 1.0.0
 */

// Tipos de status de fluxo
export type FlowStatus = 'draft' | 'active' | 'paused' | 'stopped' | 'error';

// Tipos de nós de fluxo
export type FlowNodeType = 'start' | 'message' | 'condition' | 'action' | 'end';

// Tipos de condições
export type FlowConditionType = 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';

// Tipos de ações
export type FlowActionType = 'send_message' | 'wait' | 'redirect' | 'webhook' | 'database';

// Tipos de triggers
export type FlowTriggerType = 'message_received' | 'time_based' | 'webhook' | 'manual';

// Tipos de nós de fluxo
export type FlowNode = {
  id: string;
  type: FlowNodeType;
  title: string;
  description?: string;
  position: {
    x: number;
    y: number;};

  data: unknown;
  connections: string[];
  created_at: string;
  updated_at: string;};

// Tipos de conexões de fluxo
export type FlowConnection = {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
  created_at: string;};

// Tipos de fluxo
export type AuraFlow = {
  id: string;
  name: string;
  description?: string;
  status: FlowStatus;
  trigger_type: FlowTriggerType;
  trigger_config: Record<string, any>;
  nodes: FlowNode[];
  connections: FlowConnection[];
  variables: Record<string, any>;
  settings: FlowSettings;
  created_at: string;
  updated_at: string;
  created_by: string;
  version: number;
  is_template: boolean;
  template_id?: string;};

// Tipos de configurações de fluxo
export type FlowSettings = {
  max_executions: number;
  timeout: number;
  retry_attempts: number;
  retry_delay: number;
  error_handling: 'stop' | 'continue' | 'retry';
  logging_enabled: boolean;
  notifications_enabled: boolean;
  webhook_url?: string;
  webhook_secret?: string;};

// Tipos de execução de fluxo
export type FlowExecution = {
  id: string;
  flow_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  duration?: number;
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  error_message?: string;
  steps: FlowExecutionStep[];
  context: Record<string, any>;};

// Tipos de passo de execução
export type FlowExecutionStep = {
  id: string;
  node_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  started_at: string;
  completed_at?: string;
  duration?: number;
  input_data: unknown;
  output_data?: string;
  error_message?: string;
  retry_count: number;};

// Tipos de template de fluxo
export type FlowTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  flow: AuraFlow;
  preview_image?: string;
  usage_count: number;
  rating: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_public: boolean;};

// Tipos de variáveis de fluxo
export type FlowVariable = {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: unknown;
  description?: string;
  required: boolean;
  default_value?: string;
  validation_rules?: Record<string, any>;};

// Tipos de condições de fluxo
export type FlowCondition = {
  id: string;
  type: FlowConditionType;
  field: string;
  operator: string;
  value: unknown;
  logical_operator?: 'AND' | 'OR';
  conditions?: FlowCondition[];};

// Tipos de ações de fluxo
export type FlowAction = {
  id: string;
  type: FlowActionType;
  name: string;
  description?: string;
  config: unknown;
  timeout?: number;
  retry_attempts?: number;
  retry_delay?: number;
  on_error?: 'stop' | 'continue' | 'retry';};

// Tipos de triggers de fluxo
export type FlowTrigger = {
  id: string;
  type: FlowTriggerType;
  name: string;
  description?: string;
  config: Record<string, any>;
  enabled: boolean;
  last_triggered?: string;
  trigger_count: number;};

// Tipos de dados de fluxo
export type FlowData = {
  id: string;
  flow_id: string;
  key: string;
  value: unknown;
  type: string;
  created_at: string;
  updated_at: string;};

// Tipos de logs de fluxo
export type FlowLog = {
  id: string;
  flow_id: string;
  execution_id?: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: Record<string, any>;
  timestamp: string;
  source: string;};

// Tipos de métricas de fluxo
export type FlowMetrics = {
  id: string;
  flow_id: string;
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_duration: number;
  last_execution?: string;
  success_rate: number;
  error_rate: number;
  period: string;
  created_at: string;
  updated_at: string;};

// Tipos de analytics de fluxo
export type FlowAnalytics = {
  id: string;
  flow_id: string;
  period: string;
  executions: number;
  success_rate: number;
  average_duration: number;
  peak_executions: number;
  error_count: number;
  most_common_errors: string[];
  performance_score: number;
  created_at: string;
  updated_at: string;};

// Tipos de monitoramento de fluxo
export type FlowMonitoring = {
  id: string;
  flow_id: string;
  status: FlowStatus;
  health_score: number;
  last_execution?: string;
  next_execution?: string;
  active_executions: number;
  queued_executions: number;
  error_count: number;
  warning_count: number;
  uptime: number;
  last_updated: string;};

// Tipos de backup de fluxo
export type FlowBackup = {
  id: string;
  flow_id: string;
  name: string;
  description?: string;
  flow_data: AuraFlow;
  created_at: string;
  created_by: string;
  size: number;
  version: number;};

// Tipos de versão de fluxo
export type FlowVersion = {
  id: string;
  flow_id: string;
  version: number;
  name: string;
  description?: string;
  flow_data: AuraFlow;
  created_at: string;
  created_by: string;
  is_active: boolean;
  changes: string[];};

// Tipos de colaboração de fluxo
export type FlowCollaboration = {
  id: string;
  flow_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  permissions: string[];
  invited_at: string;
  accepted_at?: string;
  last_activity?: string;};

// Tipos de comentários de fluxo
export type FlowComment = {
  id: string;
  flow_id: string;
  user_id: string;
  content: string;
  node_id?: string;
  position?: {
    x: number;
    y: number;};

  created_at: string;
  updated_at: string;
  replies: FlowComment[];};

// Tipos de favoritos de fluxo
export type FlowFavorite = {
  id: string;
  flow_id: string;
  user_id: string;
  created_at: string;};

// Tipos de compartilhamento de fluxo
export type FlowShare = {
  id: string;
  flow_id: string;
  share_token: string;
  permissions: string[];
  expires_at?: string;
  created_at: string;
  created_by: string;
  access_count: number;
  last_accessed?: string;};

// Tipos de exportação de fluxo
export type FlowExport = {
  id: string;
  flow_id: string;
  format: 'json' | 'yaml' | 'xml';
  data: Record<string, any>;
  created_at: string;
  created_by: string;
  size: number;};

// Tipos de importação de fluxo
export type FlowImport = {
  id: string;
  name: string;
  format: 'json' | 'yaml' | 'xml';
  data: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  created_by: string;
  error_message?: string;
  imported_flow_id?: string;};
