/**
 * @module modules/Aura/types/auraTypes
 * @description
 * Tipos TypeScript principais do m?dulo Aura.
 * 
 * Define todos os tipos, interfaces e enums relacionados a:
 * - Conex?es e plataformas (WhatsApp, Telegram, Instagram, Facebook, etc.)
 * - Chats e mensagens
 * - Fluxos e n?s
 * - Templates
 * - Estat?sticas
 * - Analytics (overview, connection, flow, performance, engagement, conversion, ROI)
 * - Relat?rios e dashboards
 * - Alertas e monitoramento
 * - Props de componentes React
 * - Tipos de retorno de hooks
 * 
 * @example
 * ```typescript
 * import { *   AuraConnection, *   AuraChat, *   AuraFlow, *   AuraPlatform, *   AuraAnalyticsOverview 
 * } from './auraTypes';
 * 
 * const connection: AuraConnection = {
 *   id: 1,
 *   name: 'WhatsApp Business',
 *   platform: 'whatsapp',
 *   status: 'active',
 *   // ...
 *};

 * ```
 * 
 * @since 1.0.0
 */
export interface AuraConnection {
  id: string;
  // UUID
  name: string;
  description?: string;
  phone_number: string;
  business_name?: string;
  connection_type: 'api' | 'qr' | 'webhook';
  status: AuraConnectionStatus;
  credentials?: Record<string, any>;
  settings?: Record<string, any>;
  webhook_config?: Record<string, any>;
  last_activity_at?: string;
  connected_at?: string;
  disconnected_at?: string;
  error_message?: string;
  messages_sent_today: number;
  messages_received_today: number;
  created_at: string;
  updated_at: string; }

export type AuraPlatform = 
  | 'whatsapp' 
  | 'telegram' 
  | 'instagram' 
  | 'facebook' 
  | 'website' 
  | 'email';

export type AuraConnectionStatus = 
  | 'connected' 
  | 'disconnected' 
  | 'error' 
  | 'connecting';

export interface AuraConnectionConfig {
  api_key?: string;
  webhook_url?: string;
  phone_number?: string;
  username?: string;
  access_token?: string;
  page_id?: string;
  business_id?: string;
  [key: string]: unknown; }

export interface AuraChat {
  id: string;
  // UUID
  connection_id: string;
  contact_phone: string;
  contact_name?: string;
  contact_avatar?: string;
  status: AuraChatStatus;
  last_message_at?: string;
  unread_count: number;
  contact_info?: Record<string, any>;
  labels?: string[];
  is_business: boolean;
  is_group: boolean;
  group_name?: string;
  group_participants?: string[];
  assigned_to?: string;
  lead_id?: string;
  created_at: string;
  updated_at: string; }

export type AuraChatStatus = 
  | 'active' 
  | 'closed' 
  | 'archived' 
  | 'blocked';

export interface AuraMessage {
  id: string;
  // UUID
  chat_id: string;
  whatsapp_message_id?: string;
  type: AuraMessageType;
  content: string;
  media?: string[];
  direction: AuraMessageDirection;
  status: AuraMessageStatus;
  timestamp: string;
  metadata?: Record<string, any>; }

export type AuraMessageType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'document' 
  | 'location' 
  | 'contact' 
  | 'template';

export type AuraMessageDirection = 
  | 'inbound' 
  | 'outbound';

export type AuraMessageStatus = 
  | 'pending'
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'failed'
  | 'scheduled';

export interface AuraFlow {
  id: string;
  // UUID
  connection_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  triggers?: string[];
  structure?: {
    nodes: AuraFlowNode[];
  edges?: string[]; };

  variables?: Record<string, any>;
  execution_count: number;
  last_executed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuraFlowNode {
  id: string;
  type: string;
  data: Record<string, any>;
  position?: { x: number;
  y: number;
};

  next?: string;
}

export interface AuraTemplate {
  id: string;
  // UUID
  connection_id: string;
  name: string;
  language: string;
  category: string;
  content: string;
  components?: string[];
  variables?: string[];
  status: 'pending' | 'approved' | 'rejected';
  whatsapp_template_id?: string;
  rejection_reason?: string;
  usage_count: number;
  created_at: string;
  updated_at: string; }

export interface AuraStats {
  id: string;
  // UUID
  connection_id: string;
  date: string;
  messages_sent: number;
  messages_received: number;
  chats_opened: number;
  chats_closed: number;
  avg_response_time: number;
  flows_executed: number;
  templates_sent: number;
  success_rate: number;
  metrics?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string; }

export interface AuraFlowTrigger {
  type: AuraTriggerType;
  conditions: AuraTriggerCondition[]; }

export type AuraTriggerType = 
  | 'message_received' 
  | 'keyword' 
  | 'time_based' 
  | 'webhook' 
  | 'user_action';

export interface AuraTriggerCondition {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with';
  value: string; }

export interface AuraFlowNode {
  id: string;
  type: AuraNodeType;
  position: { x: number;
  y: number;
};

  config: Record<string, any>;
  connections: string[];
}

export type AuraNodeType = 
  | 'message' 
  | 'condition' 
  | 'delay' 
  | 'webhook' 
  | 'assign' 
  | 'tag' 
  | 'transfer';

export type AuraFlowStatus = 
  | 'draft' 
  | 'active' 
  | 'paused' 
  | 'archived';

export interface AuraTemplate {
  id: number;
  name: string;
  type: AuraTemplateType;
  content: string;
  variables: string[];
  platform: AuraPlatform;
  is_active: boolean;
  created_at: string;
  updated_at: string; }

export type AuraTemplateType = 
  | 'welcome' 
  | 'follow_up' 
  | 'reminder' 
  | 'notification' 
  | 'promotional' 
  | 'support';

export interface AuraStats {
  total_chats: number;
  active_chats: number;
  total_messages: number;
  response_time_avg: number;
  satisfaction_score: number;
  connections_active: number;
  flows_active: number; }

// Component Props Types
export interface AuraSidebarProps {
  connections: AuraConnection[];
  chats: AuraChat[];
  selectedChat?: AuraChat;
  onChatSelect??: (e: any) => void;
  onConnectionSelect??: (e: any) => void;
  [key: string]: unknown; }

export interface ConnectionManagerProps {
  connections: AuraConnection[];
  loading?: boolean;
  error?: string;
  onConnectionCreate???: (e: any) => void;
  onConnectionUpdate??: (e: any) => void;
  onConnectionDelete??: (e: any) => void;
  onConnectionTest??: (e: any) => void;
  [key: string]: unknown; }

export interface ContactDetailsProps {
  chat: AuraChat;
  onUpdate??: (e: any) => void;
  onClose???: (e: any) => void;
  [key: string]: unknown; }

export interface FlowCanvasProps {
  flow: AuraFlow;
  onFlowUpdate??: (e: any) => void;
  onNodeAdd??: (e: any) => void;
  onNodeUpdate??: (e: any) => void;
  onNodeDelete??: (e: any) => void;
  [key: string]: unknown; }

export interface MessageSenderProps {
  chatId: number;
  onMessageSend??: (e: any) => void;
  onTemplateSelect??: (e: any) => void;
  [key: string]: unknown; }

export interface NodeEditorProps {
  node: AuraFlowNode;
  onNodeUpdate??: (e: any) => void;
  onClose???: (e: any) => void;
  [key: string]: unknown; }

export interface StatusMonitorProps {
  connections: AuraConnection[];
  stats: AuraStats;
  loading?: boolean;
  error?: string;
  [key: string]: unknown; }

export interface TemplateEditorProps {
  template?: AuraTemplate;
  onSave??: (e: any) => void;
  onCancel???: (e: any) => void;
  [key: string]: unknown; }

export interface LinkLeadModalProps {
  isOpen: boolean;
  chat: AuraChat;
  onLink??: (e: any) => void;
  onClose???: (e: any) => void;
  [key: string]: unknown; }

export interface AuraDashboardProps {
  connections: AuraConnection[];
  chats: AuraChat[];
  flows: AuraFlow[];
  stats: AuraStats;
  loading?: boolean;
  error?: string;
  [key: string]: unknown; }

export interface AuraIntegrationTestProps {
  connection: AuraConnection;
  onTest???: (e: any) => void;
  onSave??: (e: any) => void;
  [key: string]: unknown; }

export interface AuraChatListProps {
  chats: AuraChat[];
  selectedChat?: AuraChat;
  onChatSelect??: (e: any) => void;
  onChatClose??: (e: any) => void;
  onChatArchive??: (e: any) => void;
  [key: string]: unknown; }

export interface AuraMessageListProps {
  messages: AuraMessage[];
  chat: AuraChat;
  loading?: boolean;
  error?: string;
  onMessageSend??: (e: any) => void;
  onMessageRead??: (e: any) => void;
  [key: string]: unknown; }

export interface AuraFlowBuilderProps {
  flow: AuraFlow;
  onFlowSave??: (e: any) => void;
  onFlowTest??: (e: any) => void;
  onFlowPublish??: (e: any) => void;
  [key: string]: unknown; }

export interface AuraFlowNodeProps {
  node: AuraFlowNode;
  isSelected?: boolean;
  onSelect??: (e: any) => void;
  onUpdate??: (e: any) => void;
  onDelete??: (e: any) => void;
  [key: string]: unknown; }

export interface AuraFlowExecutionProps {
  flow: AuraFlow;
  executions: AuraFlowExecution[];
  loading?: boolean;
  error?: string;
  onExecutionStart??: (e: any) => void;
  onExecutionStop??: (e: any) => void;
  [key: string]: unknown; }

export interface AuraFlowExecution {
  id: number;
  flow_id: number;
  status: 'running' | 'completed' | 'failed' | 'paused';
  started_at: string;
  completed_at?: string;
  error_message?: string;
  context: Record<string, any>; }

// ===== ANALYTICS TYPES =====
export interface AuraAnalyticsOverview {
  totalConnections: number;
  activeConnections: number;
  totalFlows: number;
  activeFlows: number;
  totalChats: number;
  activeChats: number;
  totalMessages: number;
  responseTimeAvg: number;
  engagementRate: number;
  satisfactionScore: number;
  period: {
    start: string;
  end: string; };

}

export interface AuraConnectionAnalytics {
  connectionId: string;
  connectionName: string;
  platform: AuraPlatform;
  metrics: {
    totalMessages: number;
  inboundMessages: number;
  outboundMessages: number;
  responseTime: number;
  engagementRate: number;
  satisfactionScore: number;
  activeChats: number;
  totalChats: number; };

  trends: {
    messages: AuraTrendData[];
    responseTime: AuraTrendData[];
    engagement: AuraTrendData[];};

  topFlows: AuraFlowPerformance[];
  performance: AuraPerformanceMetrics;
}

export interface AuraFlowAnalytics {
  flowId: string;
  flowName: string;
  metrics: {
    totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  successRate: number;
  avgExecutionTime: number;
  totalUsers: number;
  conversionRate: number; };

  trends: {
    executions: AuraTrendData[];
    successRate: AuraTrendData[];
    executionTime: AuraTrendData[];};

  nodePerformance: AuraNodePerformance[];
  userJourney: AuraUserJourney[];
}

export interface AuraPerformanceMetrics {
  messagesPerHour: number;
  responseTime: number;
  engagementRate: number;
  satisfactionScore: number;
  conversionRate: number;
  retentionRate: number;
  churnRate: number;
  revenue: number;
  cost: number;
  roi: number; }

export interface AuraEngagementMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  engagementRate: number;
  sessionDuration: number;
  messagesPerSession: number;
  userRetention: AuraRetentionData[];
  engagementByPlatform: AuraPlatformEngagement[];
  engagementByTime: AuraTimeEngagement[]; }

export interface AuraConversionMetrics {
  totalConversions: number;
  conversionRate: number;
  conversionValue: number;
  avgConversionTime: number;
  conversionFunnel: AuraConversionStep[];
  conversionByFlow: AuraFlowConversion[];
  conversionByPlatform: AuraPlatformConversion[];
  conversionTrends: AuraTrendData[]; }

export interface AuraROIMetrics {
  totalRevenue: number;
  totalCost: number;
  roi: number;
  costPerAcquisition: number;
  lifetimeValue: number;
  paybackPeriod: number;
  revenueByPlatform: AuraPlatformRevenue[];
  costByPlatform: AuraPlatformCost[];
  roiByFlow: AuraFlowROI[];
  roiTrends: AuraTrendData[]; }

export interface AuraTrendData {
  date: string;
  value: number;
  change?: number;
  changePercent?: number;
  [key: string]: unknown; }

export interface AuraFlowPerformance {
  flowId: string;
  flowName: string;
  executions: number;
  successRate: number;
  avgExecutionTime: number;
  conversionRate: number;
  revenue: number; }

export interface AuraNodePerformance {
  nodeId: string;
  nodeType: AuraNodeType;
  nodeName: string;
  executions: number;
  successRate: number;
  avgExecutionTime: number;
  errorRate: number;
  bottlenecks: string[]; }

export interface AuraUserJourney {
  userId: string;
  flowId: string;
  steps: AuraJourneyStep[];
  completed: boolean;
  conversionValue: number;
  duration: number;
  startedAt: string;
  completedAt?: string; }

export interface AuraJourneyStep {
  nodeId: string;
  nodeType: AuraNodeType;
  nodeName: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
  data: Record<string, any>; }

export interface AuraRetentionData {
  period: string;
  day1: number;
  day7: number;
  day30: number;
  day90: number;
  [key: string]: unknown; }

export interface AuraPlatformEngagement {
  platform: AuraPlatform;
  users: number;
  messages: number;
  engagementRate: number;
  avgSessionDuration: number; }

export interface AuraTimeEngagement {
  hour: number;
  users: number;
  messages: number;
  engagementRate: number; }

export interface AuraConversionStep {
  step: string;
  users: number;
  conversions: number;
  conversionRate: number;
  dropoffRate: number; }

export interface AuraFlowConversion {
  flowId: string;
  flowName: string;
  conversions: number;
  conversionRate: number;
  conversionValue: number; }

export interface AuraPlatformConversion {
  platform: AuraPlatform;
  conversions: number;
  conversionRate: number;
  conversionValue: number; }

export interface AuraPlatformRevenue {
  platform: AuraPlatform;
  revenue: number;
  percentage: number; }

export interface AuraPlatformCost {
  platform: AuraPlatform;
  cost: number;
  percentage: number; }

export interface AuraFlowROI {
  flowId: string;
  flowName: string;
  revenue: number;
  cost: number;
  roi: number; }

export interface AuraBenchmark {
  metric: string;
  yourValue: number;
  industryAverage: number;
  percentile: number;
  recommendation: string; }

export interface AuraReport {
  id: string;
  name: string;
  description: string;
  type: 'overview' | 'connection' | 'flow' | 'performance' | 'engagement' | 'conversion' | 'roi';
  parameters: Record<string, any>;
  schedule?: AuraReportSchedule;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastGenerated?: string;
  nextGeneration?: string; }

export interface AuraReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[]; }

export interface AuraDashboard {
  id: string;
  name: string;
  description: string;
  widgets: AuraDashboardWidget[];
  layout: AuraDashboardLayout;
  isPublic: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string; }

export interface AuraDashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'gauge' | 'map';
  title: string;
  config: Record<string, any>;
  position: {
    x: number;
  y: number;
  width: number;
  height: number; };

  refreshInterval?: number;
}

export interface AuraDashboardLayout {
  columns: number;
  rows: number;
  gap: number;
  padding: number; }

export interface AuraAlert {
  id: string;
  name: string;
  description: string;
  type: 'metric' | 'threshold' | 'anomaly' | 'trend';
  condition: AuraAlertCondition;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  recipients: string[];
  lastTriggered?: string;
  triggerCount: number;
  createdAt: string;
  updatedAt: string; }

export interface AuraAlertCondition {
  metric: string;
  operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'contains' | 'not_contains';
  value: number | string;
  timeWindow: number;
  threshold: number; }

// ===== API RESPONSE TYPES =====
export interface AuraAnalyticsResponse {
  success: boolean;
  data: AuraAnalyticsOverview | AuraConnectionAnalytics | AuraFlowAnalytics | AuraPerformanceMetrics | AuraEngagementMetrics | AuraConversionMetrics | AuraROIMetrics;
  message?: string;
  error?: string; }

export interface AuraTrendsResponse {
  success: boolean;
  data: AuraTrendData[];
  message?: string;
  error?: string; }

export interface AuraBenchmarksResponse {
  success: boolean;
  data: AuraBenchmark[];
  message?: string;
  error?: string; }

export interface AuraReportsResponse {
  success: boolean;
  data: AuraReport[];
  message?: string;
  error?: string; }

export interface AuraDashboardsResponse {
  success: boolean;
  data: AuraDashboard[];
  message?: string;
  error?: string; }

export interface AuraAlertsResponse {
  success: boolean;
  data: AuraAlert[];
  message?: string;
  error?: string; }

// ===== HOOK RETURN TYPES =====
export interface UseAuraAnalyticsReturn {
  overview: AuraAnalyticsOverview | null;
  connectionAnalytics: AuraConnectionAnalytics | null;
  flowAnalytics: AuraFlowAnalytics | null;
  performance: AuraPerformanceMetrics | null;
  engagement: AuraEngagementMetrics | null;
  conversion: AuraConversionMetrics | null;
  roi: AuraROIMetrics | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>; }

export interface UseAuraTrendsReturn {
  trends: AuraTrendData[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>; }

export interface UseAuraBenchmarksReturn {
  benchmarks: AuraBenchmark[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>; }

export interface UseAuraReportsReturn {
  reports: AuraReport[];
  loading: boolean;
  error: string | null;
  createReport: (data: Partial<AuraReport>) => Promise<void>;
  updateReport: (id: string, data: Partial<AuraReport>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  generateReport: (id: string) => Promise<void>;
  refresh: () => Promise<void>; }

export interface UseAuraDashboardsReturn {
  dashboards: AuraDashboard[];
  loading: boolean;
  error: string | null;
  createDashboard: (data: Partial<AuraDashboard>) => Promise<void>;
  updateDashboard: (id: string, data: Partial<AuraDashboard>) => Promise<void>;
  deleteDashboard: (id: string) => Promise<void>;
  setDefaultDashboard: (id: string) => Promise<void>;
  refresh: () => Promise<void>; }

export interface UseAuraAlertsReturn {
  alerts: AuraAlert[];
  loading: boolean;
  error: string | null;
  createAlert: (data: Partial<AuraAlert>) => Promise<void>;
  updateAlert: (id: string, data: Partial<AuraAlert>) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  toggleAlert: (id: string) => Promise<void>;
  refresh: () => Promise<void>; }

export { AuraFlowExecutionDashboard };

export { AuraFlowExecutionNotification };

export { AuraFlowExecutionIntegration };

export { AuraFlowExecutionDowngrade };

export { AuraFlowExecutionMaintenance };

export { AuraFlowExecutionCompliance };
