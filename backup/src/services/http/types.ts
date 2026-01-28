// ========================================
// TIPOS HTTP - SERVIÇOS GLOBAIS
// ========================================

import { AxiosResponse, AxiosRequestConfig } from 'axios';

// ========================================
// TIPOS BASE
// ========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ApiRequestConfig extends AxiosRequestConfig {
  showLoading?: boolean;
  showError?: boolean;
  retryAttempts?: number;
}

// ========================================
// TIPOS DE AUTENTICAÇÃO
// ========================================

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_accepted: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
  email_verified_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

// ========================================
// TIPOS DE PROJETOS
// ========================================

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  settings: ProjectSettings;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ProjectSettings {
  timezone: string;
  currency: string;
  date_format: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  integrations: {
    [key: string]: boolean;
  };
}

export interface CreateProjectData {
  name: string;
  description?: string;
  settings?: Partial<ProjectSettings>;
}

// ========================================
// TIPOS DE LEADS
// ========================================

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  source: string;
  status: LeadStatus;
  score: number;
  tags: string[];
  custom_fields: Record<string, any>;
  assigned_to?: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  last_activity_at?: string;
}

export interface LeadStatus {
  id: string;
  name: string;
  color: string;
  is_final: boolean;
  order: number;
}

export interface LeadFilters extends PaginationParams {
  status?: string;
  source?: string;
  assigned_to?: string;
  tags?: string[];
  score_min?: number;
  score_max?: number;
  date_from?: string;
  date_to?: string;
  custom_fields?: Record<string, any>;
}

export interface CreateLeadData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  source: string;
  status_id?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  assigned_to?: string;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  score?: number;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'task' | 'status_change' | 'score_change';
  description: string;
  metadata?: Record<string, any>;
  created_by: string;
  created_at: string;
}

export interface CreateLeadActivityData {
  type: LeadActivity['type'];
  description: string;
  metadata?: Record<string, any>;
}

// ========================================
// TIPOS DE PRODUTOS
// ========================================

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  sku?: string;
  category?: string;
  tags: string[];
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  inventory: {
    quantity: number;
    low_stock_threshold: number;
    track_inventory: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  sku?: string;
  category?: string;
  tags?: string[];
  images?: string[];
  inventory?: Partial<Product['inventory']>;
}

// ========================================
// TIPOS DE WORKFLOWS
// ========================================

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'draft';
  trigger_type: string;
  trigger_config: Record<string, any>;
  steps: WorkflowStep[];
  variables: WorkflowVariable[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  order: number;
  conditions?: WorkflowCondition[];
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  value: any;
  description?: string;
}

export interface WorkflowCondition {
  field: string;
  operator: string;
  value: any;
  logical_operator?: 'AND' | 'OR';
}

export interface CreateWorkflowData {
  name: string;
  description?: string;
  trigger_type: string;
  trigger_config: Record<string, any>;
  steps: Omit<WorkflowStep, 'id'>[];
  variables?: WorkflowVariable[];
}

// ========================================
// TIPOS DE EMAIL MARKETING
// ========================================

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_id?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  segment_ids: string[];
  scheduled_at?: string;
  sent_at?: string;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'html' | 'text';
  category?: string;
  tags: string[];
  is_public: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface EmailSegment {
  id: string;
  name: string;
  description?: string;
  criteria: Record<string, any>;
  subscriber_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  tags: string[];
  custom_fields: Record<string, any>;
  subscribed_at: string;
  unsubscribed_at?: string;
  last_activity_at?: string;
}

export interface CreateEmailCampaignData {
  name: string;
  subject: string;
  content: string;
  template_id?: string;
  segment_ids: string[];
  scheduled_at?: string;
}

export interface CreateEmailTemplateData {
  name: string;
  subject: string;
  content: string;
  type: 'html' | 'text';
  category?: string;
  tags?: string[];
  is_public?: boolean;
}

export interface CreateEmailSegmentData {
  name: string;
  description?: string;
  criteria: Record<string, any>;
}

export interface CreateEmailSubscriberData {
  email: string;
  name?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

// ========================================
// TIPOS DE DASHBOARD
// ========================================

export interface DashboardStats {
  leads: {
    total: number;
    new_today: number;
    converted_today: number;
    conversion_rate: number;
  };
  revenue: {
    total: number;
    this_month: number;
    last_month: number;
    growth_rate: number;
  };
  activities: {
    total_today: number;
    pending_tasks: number;
    overdue_tasks: number;
  };
  performance: {
    response_time_avg: number;
    satisfaction_score: number;
    completion_rate: number;
  };
}

export interface DashboardMetrics {
  period: string;
  leads: {
    created: number[];
    converted: number[];
    labels: string[];
  };
  revenue: {
    amount: number[];
    labels: string[];
  };
  activities: {
    completed: number[];
    pending: number[];
    labels: string[];
  };
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  entity: {
    type: string;
    id: string;
    name: string;
  };
  created_at: string;
}

// ========================================
// TIPOS DE AURA (WHATSAPP)
// ========================================

export interface AuraConnection {
  id: string;
  name: string;
  platform: 'whatsapp' | 'telegram' | 'instagram';
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  webhook_url?: string;
  statistics: {
    messages_sent: number;
    messages_received: number;
    active_chats: number;
    last_activity: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AuraFlow {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'draft';
  trigger_type: string;
  trigger_config: Record<string, any>;
  steps: AuraFlowStep[];
  variables: AuraFlowVariable[];
  statistics: {
    executions: number;
    success_rate: number;
    avg_execution_time: number;
    last_execution?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AuraFlowStep {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  order: number;
  conditions?: AuraFlowCondition[];
}

export interface AuraFlowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  value: any;
  description?: string;
}

export interface AuraFlowCondition {
  field: string;
  operator: string;
  value: any;
  logical_operator?: 'AND' | 'OR';
}

export interface AuraChat {
  id: string;
  connection_id: string;
  contact: {
    phone: string;
    name?: string;
    avatar?: string;
  };
  status: 'active' | 'closed' | 'archived';
  last_message?: {
    content: string;
    direction: 'inbound' | 'outbound';
    timestamp: string;
  };
  unread_count: number;
  assigned_to?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export interface AuraMessage {
  id: string;
  chat_id: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'location';
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CreateAuraConnectionData {
  name: string;
  platform: 'whatsapp' | 'telegram' | 'instagram';
  config: Record<string, any>;
}

export interface CreateAuraFlowData {
  name: string;
  description?: string;
  trigger_type: string;
  trigger_config: Record<string, any>;
  steps: Omit<AuraFlowStep, 'id'>[];
  variables?: AuraFlowVariable[];
}

export interface CreateAuraChatData {
  connection_id: string;
  contact: {
    phone: string;
    name?: string;
  };
  tags?: string[];
}

export interface SendAuraMessageData {
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'location';
  metadata?: Record<string, any>;
}

// ========================================
// TIPOS DE INTERCEPTORS
// ========================================

export interface RequestInterceptor {
  onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onRejected?: (error: any) => any;
}

export interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: any) => any;
}

// ========================================
// TIPOS DE CONFIGURAÇÃO
// ========================================

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  headers: Record<string, string>;
}

export interface DownloadConfig {
  filename: string;
  responseType: 'blob';
  headers?: Record<string, string>;
}
