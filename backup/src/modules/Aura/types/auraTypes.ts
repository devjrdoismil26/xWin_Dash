// Aura Types
export interface AuraConnection {
  id: number;
  name: string;
  platform: AuraPlatform;
  status: AuraConnectionStatus;
  config: AuraConnectionConfig;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}

export type AuraPlatform = 
  | 'whatsapp' 
  | 'telegram' 
  | 'instagram' 
  | 'facebook' 
  | 'website' 
  | 'email';

export type AuraConnectionStatus = 
  | 'active' 
  | 'inactive' 
  | 'error' 
  | 'pending';

export interface AuraConnectionConfig {
  api_key?: string;
  webhook_url?: string;
  phone_number?: string;
  username?: string;
  access_token?: string;
  page_id?: string;
  business_id?: string;
}

export interface AuraChat {
  id: number;
  connection_id: number;
  contact_id: string;
  contact_name: string;
  contact_phone?: string;
  status: AuraChatStatus;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export type AuraChatStatus = 
  | 'active' 
  | 'closed' 
  | 'archived' 
  | 'blocked';

export interface AuraMessage {
  id: number;
  chat_id: number;
  type: AuraMessageType;
  content: string;
  direction: AuraMessageDirection;
  status: AuraMessageStatus;
  timestamp: string;
  metadata?: Record<string, any>;
}

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
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'failed';

export interface AuraFlow {
  id: number;
  name: string;
  description?: string;
  trigger: AuraFlowTrigger;
  nodes: AuraFlowNode[];
  status: AuraFlowStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuraFlowTrigger {
  type: AuraTriggerType;
  conditions: AuraTriggerCondition[];
}

export type AuraTriggerType = 
  | 'message_received' 
  | 'keyword' 
  | 'time_based' 
  | 'webhook' 
  | 'user_action';

export interface AuraTriggerCondition {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with';
  value: string;
}

export interface AuraFlowNode {
  id: string;
  type: AuraNodeType;
  position: { x: number; y: number };
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
  updated_at: string;
}

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
  flows_active: number;
}

// Component Props Types
export interface AuraSidebarProps {
  connections: AuraConnection[];
  chats: AuraChat[];
  selectedChat?: AuraChat;
  onChatSelect?: (chat: AuraChat) => void;
  onConnectionSelect?: (connection: AuraConnection) => void;
}

export interface ConnectionManagerProps {
  connections: AuraConnection[];
  loading?: boolean;
  error?: string;
  onConnectionCreate?: () => void;
  onConnectionUpdate?: (connection: AuraConnection) => void;
  onConnectionDelete?: (connectionId: number) => void;
  onConnectionTest?: (connectionId: number) => void;
}

export interface ContactDetailsProps {
  chat: AuraChat;
  onUpdate?: (chat: AuraChat) => void;
  onClose?: () => void;
}

export interface FlowCanvasProps {
  flow: AuraFlow;
  onFlowUpdate?: (flow: AuraFlow) => void;
  onNodeAdd?: (node: AuraFlowNode) => void;
  onNodeUpdate?: (nodeId: string, node: AuraFlowNode) => void;
  onNodeDelete?: (nodeId: string) => void;
}

export interface MessageSenderProps {
  chatId: number;
  onMessageSend?: (message: Partial<AuraMessage>) => void;
  onTemplateSelect?: (template: AuraTemplate) => void;
}

export interface NodeEditorProps {
  node: AuraFlowNode;
  onNodeUpdate?: (node: AuraFlowNode) => void;
  onClose?: () => void;
}

export interface StatusMonitorProps {
  connections: AuraConnection[];
  stats: AuraStats;
  loading?: boolean;
  error?: string;
}

export interface TemplateEditorProps {
  template?: AuraTemplate;
  onSave?: (template: AuraTemplate) => void;
  onCancel?: () => void;
}

export interface LinkLeadModalProps {
  isOpen: boolean;
  chat: AuraChat;
  onLink?: (leadId: number) => void;
  onClose?: () => void;
}

export interface AuraDashboardProps {
  connections: AuraConnection[];
  chats: AuraChat[];
  flows: AuraFlow[];
  stats: AuraStats;
  loading?: boolean;
  error?: string;
}

export interface AuraIntegrationTestProps {
  connection: AuraConnection;
  onTest?: () => void;
  onSave?: (config: AuraConnectionConfig) => void;
}

export interface AuraChatListProps {
  chats: AuraChat[];
  selectedChat?: AuraChat;
  onChatSelect?: (chat: AuraChat) => void;
  onChatClose?: (chatId: number) => void;
  onChatArchive?: (chatId: number) => void;
}

export interface AuraMessageListProps {
  messages: AuraMessage[];
  chat: AuraChat;
  loading?: boolean;
  error?: string;
  onMessageSend?: (message: Partial<AuraMessage>) => void;
  onMessageRead?: (messageId: number) => void;
}

export interface AuraFlowBuilderProps {
  flow: AuraFlow;
  onFlowSave?: (flow: AuraFlow) => void;
  onFlowTest?: (flow: AuraFlow) => void;
  onFlowPublish?: (flow: AuraFlow) => void;
}

export interface AuraFlowNodeProps {
  node: AuraFlowNode;
  isSelected?: boolean;
  onSelect?: (nodeId: string) => void;
  onUpdate?: (node: AuraFlowNode) => void;
  onDelete?: (nodeId: string) => void;
}

export interface AuraFlowExecutionProps {
  flow: AuraFlow;
  executions: AuraFlowExecution[];
  loading?: boolean;
  error?: string;
  onExecutionStart?: (flowId: number) => void;
  onExecutionStop?: (executionId: number) => void;
}

export interface AuraFlowExecution {
  id: number;
  flow_id: number;
  status: 'running' | 'completed' | 'failed' | 'paused';
  started_at: string;
  completed_at?: string;
  error_message?: string;
  context: Record<string, any>;
}

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
    end: string;
  };
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
    totalChats: number;
  };
  trends: {
    messages: AuraTrendData[];
    responseTime: AuraTrendData[];
    engagement: AuraTrendData[];
  };
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
    conversionRate: number;
  };
  trends: {
    executions: AuraTrendData[];
    successRate: AuraTrendData[];
    executionTime: AuraTrendData[];
  };
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
  roi: number;
}

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
  engagementByTime: AuraTimeEngagement[];
}

export interface AuraConversionMetrics {
  totalConversions: number;
  conversionRate: number;
  conversionValue: number;
  avgConversionTime: number;
  conversionFunnel: AuraConversionStep[];
  conversionByFlow: AuraFlowConversion[];
  conversionByPlatform: AuraPlatformConversion[];
  conversionTrends: AuraTrendData[];
}

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
  roiTrends: AuraTrendData[];
}

export interface AuraTrendData {
  date: string;
  value: number;
  change?: number;
  changePercent?: number;
}

export interface AuraFlowPerformance {
  flowId: string;
  flowName: string;
  executions: number;
  successRate: number;
  avgExecutionTime: number;
  conversionRate: number;
  revenue: number;
}

export interface AuraNodePerformance {
  nodeId: string;
  nodeType: AuraNodeType;
  nodeName: string;
  executions: number;
  successRate: number;
  avgExecutionTime: number;
  errorRate: number;
  bottlenecks: string[];
}

export interface AuraUserJourney {
  userId: string;
  flowId: string;
  steps: AuraJourneyStep[];
  completed: boolean;
  conversionValue: number;
  duration: number;
  startedAt: string;
  completedAt?: string;
}

export interface AuraJourneyStep {
  nodeId: string;
  nodeType: AuraNodeType;
  nodeName: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
  data: Record<string, any>;
}

export interface AuraRetentionData {
  period: string;
  day1: number;
  day7: number;
  day30: number;
  day90: number;
}

export interface AuraPlatformEngagement {
  platform: AuraPlatform;
  users: number;
  messages: number;
  engagementRate: number;
  avgSessionDuration: number;
}

export interface AuraTimeEngagement {
  hour: number;
  users: number;
  messages: number;
  engagementRate: number;
}

export interface AuraConversionStep {
  step: string;
  users: number;
  conversions: number;
  conversionRate: number;
  dropoffRate: number;
}

export interface AuraFlowConversion {
  flowId: string;
  flowName: string;
  conversions: number;
  conversionRate: number;
  conversionValue: number;
}

export interface AuraPlatformConversion {
  platform: AuraPlatform;
  conversions: number;
  conversionRate: number;
  conversionValue: number;
}

export interface AuraPlatformRevenue {
  platform: AuraPlatform;
  revenue: number;
  percentage: number;
}

export interface AuraPlatformCost {
  platform: AuraPlatform;
  cost: number;
  percentage: number;
}

export interface AuraFlowROI {
  flowId: string;
  flowName: string;
  revenue: number;
  cost: number;
  roi: number;
}

export interface AuraBenchmark {
  metric: string;
  yourValue: number;
  industryAverage: number;
  percentile: number;
  recommendation: string;
}

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
  nextGeneration?: string;
}

export interface AuraReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
}

export interface AuraDashboard {
  id: string;
  name: string;
  description: string;
  widgets: AuraDashboardWidget[];
  layout: AuraDashboardLayout;
  isPublic: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuraDashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'gauge' | 'map';
  title: string;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  refreshInterval?: number;
}

export interface AuraDashboardLayout {
  columns: number;
  rows: number;
  gap: number;
  padding: number;
}

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
  updatedAt: string;
}

export interface AuraAlertCondition {
  metric: string;
  operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'contains' | 'not_contains';
  value: number | string;
  timeWindow: number;
  threshold: number;
}

// ===== API RESPONSE TYPES =====
export interface AuraAnalyticsResponse {
  success: boolean;
  data: AuraAnalyticsOverview | AuraConnectionAnalytics | AuraFlowAnalytics | AuraPerformanceMetrics | AuraEngagementMetrics | AuraConversionMetrics | AuraROIMetrics;
  message?: string;
  error?: string;
}

export interface AuraTrendsResponse {
  success: boolean;
  data: AuraTrendData[];
  message?: string;
  error?: string;
}

export interface AuraBenchmarksResponse {
  success: boolean;
  data: AuraBenchmark[];
  message?: string;
  error?: string;
}

export interface AuraReportsResponse {
  success: boolean;
  data: AuraReport[];
  message?: string;
  error?: string;
}

export interface AuraDashboardsResponse {
  success: boolean;
  data: AuraDashboard[];
  message?: string;
  error?: string;
}

export interface AuraAlertsResponse {
  success: boolean;
  data: AuraAlert[];
  message?: string;
  error?: string;
}

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
  refresh: () => Promise<void>;
}

export interface UseAuraTrendsReturn {
  trends: AuraTrendData[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseAuraBenchmarksReturn {
  benchmarks: AuraBenchmark[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseAuraReportsReturn {
  reports: AuraReport[];
  loading: boolean;
  error: string | null;
  createReport: (data: Partial<AuraReport>) => Promise<void>;
  updateReport: (id: string, data: Partial<AuraReport>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  generateReport: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export interface UseAuraDashboardsReturn {
  dashboards: AuraDashboard[];
  loading: boolean;
  error: string | null;
  createDashboard: (data: Partial<AuraDashboard>) => Promise<void>;
  updateDashboard: (id: string, data: Partial<AuraDashboard>) => Promise<void>;
  deleteDashboard: (id: string) => Promise<void>;
  setDefaultDashboard: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export interface UseAuraAlertsReturn {
  alerts: AuraAlert[];
  loading: boolean;
  error: string | null;
  createAlert: (data: Partial<AuraAlert>) => Promise<void>;
  updateAlert: (id: string, data: Partial<AuraAlert>) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  toggleAlert: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}
