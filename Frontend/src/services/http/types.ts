/**
 * Tipos HTTP - Serviços Globais
 *
 * @description
 * Este módulo contém todas as interfaces e tipos TypeScript utilizados
 * pelos serviços HTTP da aplicação. Inclui tipos para requisições, respostas,
 * autenticação, projetos, leads, produtos, workflows, email marketing, dashboard
 * e Aura (WhatsApp).
 *
 * Funcionalidades principais:
 * - Tipos base (ApiResponse, ApiError, PaginationParams)
 * - Tipos de autenticação (LoginCredentials, AuthResponse, User)
 * - Tipos de projetos (Project, ProjectSettings)
 * - Tipos de leads (Lead, LeadStatus, LeadActivity)
 * - Tipos de produtos (Product, CreateProductData)
 * - Tipos de workflows (Workflow, WorkflowStep, WorkflowVariable)
 * - Tipos de email marketing (EmailCampaign, EmailTemplate, EmailSegment)
 * - Tipos de dashboard (DashboardStats, DashboardMetrics)
 * - Tipos de Aura/WhatsApp (AuraConnection, AuraFlow, AuraChat)
 * - Tipos de configuração (ApiConfig, DownloadConfig)
 *
 * @module services/http/types
 * @since 1.0.0
 *
 * @example
 * ```ts
 * import { ApiResponse, User, Project } from '@/services/http/types';
 *
 * // Usar tipos em funções
 * async function getUsers(): Promise<ApiResponse<User[]>> {
 *   // ...
 * }
 * ```
 */

import { AxiosResponse, AxiosRequestConfig } from 'axios';

// ========================================
// TIPOS BASE
// ========================================

/**
 * Interface para resposta padronizada da API
 *
 * @description
 * Estrutura padrão de resposta da API que inclui sucesso/erro, dados,
 * mensagens e metadados de paginação quando aplicável.
 *
 * @template T - Tipo dos dados retornados (padrão: unknown)
 *
 * @example
 * ```ts
 * // Resposta simples
 * const response: ApiResponse<User> ={ *   success: true,
 *   data: { id: '1', name: 'John'  }
 *};

 *
 * // Resposta com paginação
 * const response: ApiResponse<User[]> ={ *   success: true,
 *   data: [...users],
 *   meta: {
 *     current_page: 1,
 *     per_page: 10,
 *     total: 100,
 *     last_page: 10
 *    }
 *};

 * ```
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;};

}

/**
 * Interface para erros da API
 *
 * @description
 * Estrutura padronizada para erros retornados pela API, incluindo mensagem,
 * código de status HTTP, código de erro e detalhes adicionais.
 *
 * @example
 * ```ts
 * const error: ApiError ={ *   message: 'Recurso não encontrado',
 *   status: 404,
 *   code: 'NOT_FOUND',
 *   details: { resource: 'user', id: '123'  }
 *};

 * ```
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: string; }

/**
 * Interface para parâmetros de paginação
 *
 * @description
 * Parâmetros utilizados para paginação, busca e ordenação de recursos.
 *
 * @example
 * ```ts
 * const params: PaginationParams = {
 *   page: 1,
 *   per_page: 10,
 *   search: 'john',
 *   sort: 'created_at',
 *   order: 'desc'
 *};

 * ```
 */
export interface PaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  pagination?: { page?: number;
  limit?: number;
  total?: number; };

  total?: number;
  count?: number;
}

/**
 * Interface para configuração de requisições HTTP
 *
 * @description
 * Estende AxiosRequestConfig com opções adicionais específicas da aplicação,
 * como controle de loading e tratamento de erros.
 *
 * @extends AxiosRequestConfig
 *
 * @example
 * ```ts
 * const config: ApiRequestConfig = {
 *   showLoading: true,
 *   showError: true,
 *   retryAttempts: 3,
 *   timeout: 5000
 *};

 * ```
 */
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
  remember?: boolean; }

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_accepted: boolean;
  [key: string]: unknown; }

export interface ForgotPasswordData {
  email: string;
  [key: string]: unknown; }

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
  [key: string]: unknown; }

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
  email_verified_at?: string; }

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
  data?: string;
  success?: boolean;
  message?: string;
  error?: string; }

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
  created_by: string; }

export interface ProjectSettings {
  timezone: string;
  currency: string;
  date_format: string;
  notifications: {
    email: boolean;
  push: boolean;
  sms: boolean;
  [key: string]: unknown; };

  integrations: {
    [key: string]: boolean;};

}

export interface CreateProjectData {
  name: string;
  description?: string;
  settings?: Partial<ProjectSettings>;
  [key: string]: unknown; }

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
  last_activity_at?: string; }

export interface LeadStatus {
  id: string;
  name: string;
  color: string;
  is_final: boolean;
  order: number; }

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

  pagination?: { page?: number; limit?: number; total?: number;};

  total?: number;
  count?: number;
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
  [key: string]: unknown; }

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
  created_at: string; }

export interface CreateLeadActivityData {
  type: LeadActivity['type'];
  description: string;
  metadata?: Record<string, any>;
  [key: string]: unknown; }

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
  track_inventory: boolean; };

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
  [key: string]: unknown; }

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
  created_by: string; }

export interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  order: number;
  conditions?: WorkflowCondition[]; }

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  value: unknown;
  description?: string; }

export interface WorkflowCondition {
  field: string;
  operator: string;
  value: unknown;
  logical_operator?: 'AND' | 'OR'; }

export interface CreateWorkflowData {
  name: string;
  description?: string;
  trigger_type: string;
  trigger_config: Record<string, any>;
  steps: Omit<WorkflowStep, 'id'>[];
  variables?: WorkflowVariable[];
  [key: string]: unknown; }

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
  unsubscribed: number; };

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
  created_by: string; }

export interface EmailSegment {
  id: string;
  name: string;
  description?: string;
  criteria: Record<string, any>;
  subscriber_count: number;
  created_at: string;
  updated_at: string;
  created_by: string; }

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  tags: string[];
  custom_fields: Record<string, any>;
  subscribed_at: string;
  unsubscribed_at?: string;
  last_activity_at?: string; }

export interface CreateEmailCampaignData {
  name: string;
  subject: string;
  content: string;
  template_id?: string;
  segment_ids: string[];
  scheduled_at?: string;
  [key: string]: unknown; }

export interface CreateEmailTemplateData {
  name: string;
  subject: string;
  content: string;
  type: 'html' | 'text';
  category?: string;
  tags?: string[];
  is_public?: boolean;
  [key: string]: unknown; }

export interface CreateEmailSegmentData {
  name: string;
  description?: string;
  criteria: Record<string, any>;
  [key: string]: unknown; }

export interface CreateEmailSubscriberData {
  email: string;
  name?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  [key: string]: unknown; }

// ========================================
// TIPOS DE DASHBOARD
// ========================================

export interface DashboardStats {
  leads: {
    total: number;
  new_today: number;
  converted_today: number;
  conversion_rate: number; };

  revenue: {
    total: number;
    this_month: number;
    last_month: number;
    growth_rate: number;};

  activities: {
    total_today: number;
    pending_tasks: number;
    overdue_tasks: number;};

  performance: {
    response_time_avg: number;
    satisfaction_score: number;
    completion_rate: number;};

}

export interface DashboardMetrics {
  period: string;
  leads: {
    created: number[];
  converted: number[];
  labels: string[]; };

  revenue: {
    amount: number[];
    labels: string[];};

  activities: {
    completed: number[];
    pending: number[];
    labels: string[];};

}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  user: {
    id: string;
  name: string;
  avatar?: string; };

  entity: {
    type: string;
    id: string;
    name: string;};

  created_at: string;
}

// ========================================
// TIPOS DE DASHBOARD - WIDGETS, ALERTAS E NOTIFICAÇÕES
// ========================================

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  position: {
    x: number;
  y: number;
  w: number;
  h: number; };

  config: Record<string, any>;
  data?: string;
  created_at: string;
  updated_at: string;
}

export interface WidgetConfig {
  type: string;
  title?: string;
  position?: {
    x: number;
  y: number;
  w: number;
  h: number;
  [key: string]: unknown; };

  config?: Record<string, any>;
}

export interface DashboardAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: Record<string, any>; }

export interface DashboardNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
  metadata?: Record<string, any>; }

export interface DashboardConfig {
  layout: 'grid' | 'list';
  theme: 'light' | 'dark' | 'auto';
  widgets: DashboardWidget[];
  refresh_interval: number;
  auto_refresh: boolean;
  settings: Record<string, any>;
  [key: string]: unknown; }

// ========================================
// TIPOS DE PROJETOS - MEMBROS E ESTATÍSTICAS
// ========================================

export interface ProjectMember {
  id: string;
  user_id: string;
  project_id: string;
  role: string;
  permissions: string[];
  user: {
    id: string;
  name: string;
  email: string;
  avatar?: string; };

  created_at: string;
  updated_at: string;
}

export interface ProjectStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_members: number;
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  revenue: number;
  expenses: number;
  profit: number; }

export interface ProjectBackup {
  id: string;
  project_id: string;
  filename: string;
  size: number;
  created_at: string;
  created_by: string;
  metadata?: Record<string, any>; }

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
  last_activity: string; };

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
  last_execution?: string; };

  created_at: string;
  updated_at: string;
}

export interface AuraFlowStep {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  order: number;
  conditions?: AuraFlowCondition[]; }

export interface AuraFlowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  value: unknown;
  description?: string; }

export interface AuraFlowCondition {
  field: string;
  operator: string;
  value: unknown;
  logical_operator?: 'AND' | 'OR'; }

export interface AuraChat {
  id: string;
  connection_id: string;
  contact: {
    phone: string;
  name?: string;
  avatar?: string; };

  status: 'active' | 'closed' | 'archived';
  last_message?: {
    content: string;
    direction: 'inbound' | 'outbound';
    timestamp: string;};

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
  created_at: string; }

export interface CreateAuraConnectionData {
  name: string;
  platform: 'whatsapp' | 'telegram' | 'instagram';
  config: Record<string, any>;
  [key: string]: unknown; }

export interface CreateAuraFlowData {
  name: string;
  description?: string;
  trigger_type: string;
  trigger_config: Record<string, any>;
  steps: Omit<AuraFlowStep, 'id'>[];
  variables?: AuraFlowVariable[];
  [key: string]: unknown; }

export interface CreateAuraChatData {
  connection_id: string;
  contact: {
    phone: string;
  name?: string;
  [key: string]: unknown; };

  tags?: string[];
}

export interface SendAuraMessageData {
  content: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'document' | 'location';
  metadata?: Record<string, any>;
  [key: string]: unknown; }

// ========================================
// TIPOS DE INTERCEPTORS
// ========================================

/**
 * Interface para interceptor de requisições HTTP
 *
 * @description
 * Estrutura para interceptores de requisição do Axios, permitindo modificar
 * requisições antes de serem enviadas ou tratar erros de requisição.
 *
 * @example
 * ```ts
 * const interceptor: RequestInterceptor = {
 *   onFulfilled: (config: unknown) => {
 *     config.headers.Authorization = `Bearer ${token}`;
 *     return config;
 *   },
 *   onRejected: (error: unknown) => {
 *     return Promise.reject(error);

 *   }
 *};

 * ```
 */
export interface RequestInterceptor {
  onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onRejected?: (error: unknown) => any; }

/**
 * Interface para interceptor de respostas HTTP
 *
 * @description
 * Estrutura para interceptores de resposta do Axios, permitindo modificar
 * respostas antes de serem processadas ou tratar erros de resposta.
 *
 * @example
 * ```ts
 * const interceptor: ResponseInterceptor = {
 *   onFulfilled: (response: unknown) => {
 *     // Processar resposta
 *     return response;
 *   },
 *   onRejected: (error: unknown) => {
 *     // Tratar erro
 *     return Promise.reject(error);

 *   }
 *};

 * ```
 */
export interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: unknown) => any;
  data?: string;
  success?: boolean;
  message?: string; }

// ========================================
// TIPOS DE CONFIGURAÇÃO
// ========================================

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  headers: Record<string, string>;
  [key: string]: unknown; }

export interface DownloadConfig {
  filename: string;
  responseType: 'blob';
  headers?: Record<string, string>;
  [key: string]: unknown; }
