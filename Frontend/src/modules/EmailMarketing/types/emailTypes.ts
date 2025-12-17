// EmailMarketing Types
export interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  from_name: string;
  from_email: string;
  reply_to: string;
  status: EmailCampaignStatus;
  type: EmailCampaignType;
  template_id?: number;
  list_id: number;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
  stats?: EmailCampaignStats; }

export type EmailCampaignStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'sending' 
  | 'sent' 
  | 'paused' 
  | 'cancelled';

export type EmailCampaignType = 
  | 'regular' 
  | 'automated' 
  | 'ab_test' 
  | 'remarketing';

export interface EmailCampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  spam_reports: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number; }

export interface EmailList {
  id: number;
  name: string;
  description?: string;
  subscribers_count: number;
  unsubscribed_count: number;
  created_at: string;
  updated_at: string;
  tags?: string[];
  is_active: boolean; }

export interface EmailSubscriber {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  status: EmailSubscriberStatus;
  subscribed_at: string;
  unsubscribed_at?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  list_id: number;
  created_at: string;
  updated_at: string; }

export type EmailSubscriberStatus = 
  | 'subscribed' 
  | 'unsubscribed' 
  | 'bounced' 
  | 'complained';

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  type: EmailTemplateType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  preview_url?: string; }

export type EmailTemplateType = 
  | 'html' 
  | 'text' 
  | 'responsive';

export interface EmailSegment {
  id: number;
  name: string;
  description?: string;
  conditions: EmailSegmentCondition[];
  subscribers_count: number;
  created_at: string;
  updated_at: string; }

export interface EmailSegmentCondition {
  field: string;
  operator: EmailSegmentOperator;
  value: string | number;
  logic?: 'and' | 'or'; }

export type EmailSegmentOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with' 
  | 'greater_than' 
  | 'less_than' 
  | 'is_empty' 
  | 'is_not_empty';

export interface EmailAutomation {
  id: number;
  name: string;
  trigger: EmailAutomationTrigger;
  status: EmailAutomationStatus;
  steps: EmailAutomationStep[];
  created_at: string;
  updated_at: string; }

export interface EmailAutomationTrigger {
  type: EmailAutomationTriggerType;
  conditions: EmailAutomationCondition[]; }

export type EmailAutomationTriggerType = 
  | 'subscriber_added' 
  | 'subscriber_removed' 
  | 'email_opened' 
  | 'email_clicked' 
  | 'date_based' 
  | 'custom';

export interface EmailAutomationCondition {
  field: string;
  operator: string;
  value: string | number; }

export interface EmailAutomationStep {
  id: string;
  type: EmailAutomationStepType;
  delay?: number;
  delay_unit?: 'minutes' | 'hours' | 'days';
  email_template_id?: number;
  conditions?: EmailAutomationCondition[]; }

export type EmailAutomationStepType = 
  | 'send_email' 
  | 'wait' 
  | 'condition' 
  | 'add_tag' 
  | 'remove_tag' 
  | 'add_to_list' 
  | 'remove_from_list';

export type EmailAutomationStatus = 
  | 'draft' 
  | 'active' 
  | 'paused' 
  | 'completed';

export interface EmailAnalytics {
  total_campaigns: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_bounced: number;
  total_unsubscribed: number;
  average_open_rate: number;
  average_click_rate: number;
  average_bounce_rate: number;
  top_performing_campaigns: EmailCampaign[];
  recent_activity: EmailActivity[]; }

export interface EmailActivity {
  id: number;
  type: EmailActivityType;
  description: string;
  timestamp: string;
  campaign_id?: number;
  subscriber_id?: number; }

export type EmailActivityType = 
  | 'campaign_created' 
  | 'campaign_sent' 
  | 'email_opened' 
  | 'email_clicked' 
  | 'subscriber_added' 
  | 'subscriber_removed' 
  | 'bounce' 
  | 'complaint';

// Component Props Types
export interface EmailCampaignFormProps {
  campaign?: EmailCampaign;
  templates: EmailTemplate[];
  lists: EmailList[];
  onSave??: (e: any) => void;
  onCancel???: (e: any) => void;
  [key: string]: unknown; }

export interface EmailCampaignListProps {
  campaigns: EmailCampaign[];
  loading?: boolean;
  error?: string;
  onCampaignEdit??: (e: any) => void;
  onCampaignDelete??: (e: any) => void;
  onCampaignSend??: (e: any) => void;
  [key: string]: unknown; }

export interface EmailListManagerProps {
  lists: EmailList[];
  loading?: boolean;
  error?: string;
  onListCreate???: (e: any) => void;
  onListEdit??: (e: any) => void;
  onListDelete??: (e: any) => void;
  [key: string]: unknown; }

export interface EmailSubscriberManagerProps {
  subscribers: EmailSubscriber[];
  lists: EmailList[];
  loading?: boolean;
  error?: string;
  onSubscriberAdd???: (e: any) => void;
  onSubscriberEdit??: (e: any) => void;
  onSubscriberDelete??: (e: any) => void;
  onSubscriberImport???: (e: any) => void;
  [key: string]: unknown; }

export interface EmailTemplateManagerProps {
  templates: EmailTemplate[];
  loading?: boolean;
  error?: string;
  onTemplateCreate???: (e: any) => void;
  onTemplateEdit??: (e: any) => void;
  onTemplateDelete??: (e: any) => void;
  onTemplatePreview??: (e: any) => void;
  [key: string]: unknown; }

export interface EmailSegmentManagerProps {
  segments: EmailSegment[];
  loading?: boolean;
  error?: string;
  onSegmentCreate???: (e: any) => void;
  onSegmentEdit??: (e: any) => void;
  onSegmentDelete??: (e: any) => void;
  [key: string]: unknown; }

export interface EmailAutomationManagerProps {
  automations: EmailAutomation[];
  templates: EmailTemplate[];
  loading?: boolean;
  error?: string;
  onAutomationCreate???: (e: any) => void;
  onAutomationEdit??: (e: any) => void;
  onAutomationDelete??: (e: any) => void;
  onAutomationToggle??: (e: any) => void;
  [key: string]: unknown; }

export interface EmailAnalyticsDashboardProps {
  analytics: EmailAnalytics;
  loading?: boolean;
  error?: string;
  period?: string;
  onPeriodChange??: (e: any) => void;
  [key: string]: unknown; }

export interface EmailRemarketingCampaignProps {
  campaigns: EmailCampaign[];
  loading?: boolean;
  error?: string;
  onCampaignCreate???: (e: any) => void;
  onCampaignEdit??: (e: any) => void;
  onCampaignDelete??: (e: any) => void;
  [key: string]: unknown; }

export interface EmailOptimizationProps {
  campaigns: EmailCampaign[];
  loading?: boolean;
  error?: string;
  onOptimize??: (e: any) => void;
  onABTest??: (e: any) => void;
  [key: string]: unknown; }

// ===== NEW ENDPOINT INTERFACES =====

// Automation Flows
export interface EmailAutomationFlow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  trigger: EmailAutomationTrigger;
  steps: EmailAutomationStep[];
  performance: EmailAutomationPerformance;
  created_at: string;
  updated_at: string; }

export interface EmailAutomationPerformance {
  total_subscribers: number;
  emails_sent: number;
  emails_delivered: number;
  emails_opened: number;
  emails_clicked: number;
  conversion_rate: number;
  revenue_generated: number; }

// Automation Triggers
export interface EmailAutomationTriggerAdvanced {
  id: string;
  name: string;
  type: EmailAutomationTriggerType;
  conditions: EmailAutomationCondition[];
  is_active: boolean;
  created_at: string;
  updated_at: string; }

// Automation Conditions
export interface EmailAutomationConditionAdvanced {
  id: string;
  name: string;
  field: string;
  operator: string;
  value: string | number;
  logic: 'and' | 'or';
  is_active: boolean;
  created_at: string;
  updated_at: string; }

// Automation Actions
export interface EmailAutomationAction {
  id: string;
  name: string;
  type: EmailAutomationActionType;
  config: Record<string, any>;
  delay: number;
  delay_unit: 'minutes' | 'hours' | 'days';
  is_active: boolean;
  created_at: string;
  updated_at: string; }

export type EmailAutomationActionType = 
  | 'send_email'
  | 'add_tag'
  | 'remove_tag'
  | 'add_to_list'
  | 'remove_from_list'
  | 'update_field'
  | 'wait'
  | 'condition'
  | 'webhook';

// Automation Logs
export interface EmailAutomationLog {
  id: string;
  flow_id: string;
  subscriber_id: string;
  step_id: string;
  action: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  executed_at: string;
  created_at: string; }

// Deliverability
export interface EmailDeliverability {
  id: string;
  domain: string;
  reputation_score: number;
  bounce_rate: number;
  complaint_rate: number;
  spam_rate: number;
  authentication: {
    spf: boolean;
  dkim: boolean;
  dmarc: boolean; };

  blacklists: string[];
  recommendations: string[];
  last_checked: string;
}

export interface EmailDeliverabilityTest {
  id: string;
  test_type: 'spam_check' | 'authentication' | 'reputation' | 'content';
  email_content: string;
  test_results: {
    score: number;
  issues: string[];
  recommendations: string[]; };

  created_at: string;
}

// Compliance
export interface EmailCompliance {
  id: string;
  gdpr_compliant: boolean;
  can_spam_compliant: boolean;
  ccpa_compliant: boolean;
  unsubscribe_mechanism: boolean;
  privacy_policy: boolean;
  data_retention_policy: boolean;
  consent_management: boolean;
  last_audit: string;
  next_audit: string; }

export interface EmailComplianceCheck {
  id: string;
  check_type: 'gdpr' | 'can_spam' | 'ccpa' | 'general';
  status: 'pass' | 'fail' | 'warning';
  issues: string[];
  recommendations: string[];
  checked_at: string; }

// A/B Testing
export interface EmailABTest {
  id: string;
  name: string;
  description: string;
  campaign_id: string;
  test_type: 'subject' | 'content' | 'send_time' | 'from_name';
  variants: EmailABTestVariant[];
  traffic_split: number;
  winner_criteria: 'open_rate' | 'click_rate' | 'conversion_rate' | 'revenue';
  status: 'draft' | 'running' | 'completed' | 'paused';
  start_date: string;
  end_date?: string;
  results?: EmailABTestResults;
  created_at: string;
  updated_at: string; }

export interface EmailABTestVariant {
  id: string;
  name: string;
  content: string;
  traffic_percentage: number;
  metrics: {
    sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number; };

}

export interface EmailABTestResults {
  winner_variant_id: string;
  confidence_level: number;
  statistical_significance: boolean;
  improvement_percentage: number;
  test_duration: number;
  total_participants: number; }

// Personalization
export interface EmailPersonalization {
  id: string;
  name: string;
  description: string;
  rules: EmailPersonalizationRule[];
  is_active: boolean;
  performance: {
    usage_count: number;
  improvement_rate: number;
  revenue_impact: number; };

  created_at: string;
  updated_at: string;
}

export interface EmailPersonalizationRule {
  id: string;
  condition: EmailPersonalizationCondition;
  action: EmailPersonalizationAction;
  priority: number;
  is_active: boolean; }

export interface EmailPersonalizationCondition {
  field: string;
  operator: string;
  value: string | number;
  logic?: 'and' | 'or'; }

export interface EmailPersonalizationAction {
  type: 'change_subject' | 'change_content' | 'change_send_time' | 'add_dynamic_content';
  config: Record<string, any>; }

// Optimization
export interface EmailOptimization {
  id: string;
  campaign_id: string;
  optimization_type: 'send_time' | 'subject_line' | 'content' | 'frequency';
  current_value: string;
  optimized_value: string;
  improvement_percentage: number;
  confidence_score: number;
  applied: boolean;
  applied_at?: string;
  created_at: string; }

// ===== API RESPONSE INTERFACES =====
export interface EmailAutomationFlowResponse {
  success: boolean;
  data?: EmailAutomationFlow | EmailAutomationFlow[];
  message?: string;
  error?: string; }

export interface EmailAutomationTriggerResponse {
  success: boolean;
  data?: EmailAutomationTriggerAdvanced | EmailAutomationTriggerAdvanced[];
  message?: string;
  error?: string; }

export interface EmailAutomationConditionResponse {
  success: boolean;
  data?: EmailAutomationConditionAdvanced | EmailAutomationConditionAdvanced[];
  message?: string;
  error?: string; }

export interface EmailAutomationActionResponse {
  success: boolean;
  data?: EmailAutomationAction | EmailAutomationAction[];
  message?: string;
  error?: string; }

export interface EmailAutomationLogResponse {
  success: boolean;
  data?: EmailAutomationLog | EmailAutomationLog[];
  message?: string;
  error?: string; }

export interface EmailDeliverabilityResponse {
  success: boolean;
  data?: EmailDeliverability;
  message?: string;
  error?: string; }

export interface EmailComplianceResponse {
  success: boolean;
  data?: EmailCompliance;
  message?: string;
  error?: string; }

export interface EmailABTestResponse {
  success: boolean;
  data?: EmailABTest | EmailABTest[];
  message?: string;
  error?: string; }

export interface EmailPersonalizationResponse {
  success: boolean;
  data?: EmailPersonalization | EmailPersonalization[];
  message?: string;
  error?: string; }

export interface EmailOptimizationResponse {
  success: boolean;
  data?: EmailOptimization | EmailOptimization[];
  message?: string;
  error?: string; }

// ===== HOOK RETURN TYPES =====
export interface UseEmailAutomationFlowsReturn {
  flows: EmailAutomationFlow[];
  loading: boolean;
  error: string | null;
  getFlows: () => Promise<void>;
  getFlow: (id: string) => Promise<EmailAutomationFlow | null>;
  activateFlow: (id: string) => Promise<boolean>;
  deactivateFlow: (id: string) => Promise<boolean>; }

export interface UseEmailAutomationTriggersReturn {
  triggers: EmailAutomationTriggerAdvanced[];
  loading: boolean;
  error: string | null;
  getTriggers: () => Promise<void>;
  createTrigger: (data: unknown) => Promise<EmailAutomationTriggerAdvanced | null>;
  updateTrigger: (id: string, data: unknown) => Promise<EmailAutomationTriggerAdvanced | null>;
  deleteTrigger: (id: string) => Promise<boolean>; }

export interface UseEmailAutomationConditionsReturn {
  conditions: EmailAutomationConditionAdvanced[];
  loading: boolean;
  error: string | null;
  getConditions: () => Promise<void>;
  createCondition: (data: Record<string, any>) => Promise<EmailAutomationConditionAdvanced | null>;
  updateCondition: (id: string, data: Record<string, any>) => Promise<EmailAutomationConditionAdvanced | null>;
  deleteCondition: (id: string) => Promise<boolean>; }

export interface UseEmailAutomationActionsReturn {
  actions: EmailAutomationAction[];
  loading: boolean;
  error: string | null;
  getActions: () => Promise<void>;
  createAction: (data: unknown) => Promise<EmailAutomationAction | null>;
  updateAction: (id: string, data: unknown) => Promise<EmailAutomationAction | null>;
  deleteAction: (id: string) => Promise<boolean>; }

export interface UseEmailAutomationLogsReturn {
  logs: EmailAutomationLog[];
  loading: boolean;
  error: string | null;
  getLogs: (flowId?: string) => Promise<void>; }

export interface UseEmailAutomationPerformanceReturn {
  performance: EmailAutomationPerformance | null;
  loading: boolean;
  error: string | null;
  getPerformance: (flowId: string) => Promise<void>; }

export interface UseEmailDeliverabilityReturn {
  deliverability: EmailDeliverability | null;
  loading: boolean;
  error: string | null;
  getDeliverability: () => Promise<void>;
  testDeliverability: (testData: Record<string, any>) => Promise<EmailDeliverabilityTest | null>; }

export interface UseEmailComplianceReturn {
  compliance: EmailCompliance | null;
  loading: boolean;
  error: string | null;
  getCompliance: () => Promise<void>;
  checkCompliance: (checkType: string) => Promise<EmailComplianceCheck | null>; }

export interface UseEmailABTestingReturn {
  tests: EmailABTest[];
  loading: boolean;
  error: string | null;
  getTests: () => Promise<void>;
  createTest: (data: unknown) => Promise<EmailABTest | null>;
  updateTest: (id: string, data: unknown) => Promise<EmailABTest | null>;
  deleteTest: (id: string) => Promise<boolean>;
  startTest: (id: string) => Promise<boolean>;
  stopTest: (id: string) => Promise<boolean>; }

export interface UseEmailPersonalizationReturn {
  personalizations: EmailPersonalization[];
  loading: boolean;
  error: string | null;
  getPersonalizations: () => Promise<void>;
  createPersonalization: (data: Record<string, any>) => Promise<EmailPersonalization | null>;
  updatePersonalization: (id: string, data: Record<string, any>) => Promise<EmailPersonalization | null>;
  deletePersonalization: (id: string) => Promise<boolean>; }

export interface UseEmailOptimizationReturn {
  optimizations: EmailOptimization[];
  loading: boolean;
  error: string | null;
  getOptimizations: () => Promise<void>;
  applyOptimization: (id: string) => Promise<boolean>; }

// Missing types for exports
export type EmailListStatus = 'active' | 'inactive' | 'archived';
export type EmailFilters = Record<string, any>;

export interface EmailAutomationExecutionAnalytics {
  total_executions: number;
  successful: number;
  failed: number;
  avg_duration: number; }

export interface EmailAutomationExecutionDashboard {
  metrics: EmailAutomationExecutionAnalytics;
  recent_executions: EmailAutomationExecution[]; }

export interface EmailAutomationExecutionDowngrade {
  id: string;
  from_version: string;
  to_version: string;
  status: string; }

export interface EmailAutomationExecutionMaintenance {
  id: string;
  type: string;
  scheduled_at: string;
  status: string; }

export interface EmailAutomationExecutionSecurity {
  id: string;
  check_type: string;
  passed: boolean;
  issues: string[]; }

export interface EmailAutomationExecutionCompliance {
  id: string;
  regulation: string;
  compliant: boolean;
  violations: string[]; }
