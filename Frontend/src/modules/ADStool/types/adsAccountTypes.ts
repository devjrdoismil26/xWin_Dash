/**
 * Tipos relacionados a contas de anúncios
 * @module modules/ADStool/types/adsAccountTypes
 * @description
 * Definições de tipos e interfaces para contas de anúncios, incluindo
 * estruturas de dados, status, credenciais, configurações, estatísticas,
 * atividades, conexões, validações, sincronizações, orçamentos, alertas,
 * integrações, permissões, equipes, backups, auditorias, conformidade,
 * performance, otimizações, relatórios, templates, workflows, uso de API,
 * custos, metas e outros tipos relacionados.
 * @since 1.0.0
 */

/**
 * Interface AdsAccount - Conta de Anúncios
 * @interface AdsAccount
 * @description
 * Representa uma conta de anúncios no sistema, contendo informações
 * sobre a plataforma, status, orçamento, moeda, fuso horário e timestamps.
 * 
 * @property {number} id - ID único da conta
 * @property {string} name - Nome da conta
 * @property {AdsPlatform} platform - Plataforma de anúncios
 * @property {string} account_id - ID da conta na plataforma
 * @property {AdsAccountStatus} status - Status da conta
 * @property {number} [budget] - Orçamento da conta (opcional)
 * @property {string} currency - Moeda da conta
 * @property {string} timezone - Fuso horário da conta
 * @property {string} created_at - Data de criação (ISO 8601)
 * @property {string} updated_at - Data de atualização (ISO 8601)
 * 
 * @example
 * ```typescript
 * const account: AdsAccount = {
 *   id: 1,
 *   name: 'Minha Conta Google Ads',
 *   platform: 'google_ads',
 *   account_id: '123456789',
 *   status: 'active',
 *   budget: 10000,
 *   currency: 'BRL',
 *   timezone: 'America/Sao_Paulo',
 *   created_at: '2024-01-01T00:00:00Z',
 *   updated_at: '2024-01-01T00:00:00Z'
 *};

 * ```
 */
export interface AdsAccount {
  id: number;
  name: string;
  platform: AdsPlatform;
  account_id: string;
  status: AdsAccountStatus;
  budget?: number;
  currency: string;
  timezone: string;
  last_sync?: string;
  created_at: string;
  updated_at: string; }

/**
 * Tipo AdsPlatform - Plataformas de Anúncios Suportadas
 * @typedef {('google_ads' | 'facebook_ads' | 'linkedin_ads' | 'twitter_ads' | 'tiktok_ads')} AdsPlatform
 * @description
 * Tipo union que representa todas as plataformas de anúncios suportadas pelo sistema.
 */
export type AdsPlatform = 
  | 'google_ads' 
  | 'facebook_ads' 
  | 'linkedin_ads' 
  | 'twitter_ads' 
  | 'tiktok_ads';

/**
 * Tipo AdsAccountStatus - Status de Conta
 * @typedef {('active' | 'paused' | 'suspended' | 'pending')} AdsAccountStatus
 * @description
 * Tipo union que representa os possíveis status de uma conta de anúncios.
 * - active: Conta ativa e operacional
 * - paused: Conta pausada temporariamente
 * - suspended: Conta suspensa (bloqueada)
 * - pending: Conta pendente de ativação
 */
export type AdsAccountStatus = 
  | 'active' 
  | 'paused' 
  | 'suspended' 
  | 'pending';

export interface AdsAccountCredentials {
  platform: AdsPlatform;
  access_token?: string;
  refresh_token?: string;
  client_id?: string;
  client_secret?: string;
  developer_token?: string;
  customer_id?: string;
  manager_id?: string;
  app_id?: string;
  app_secret?: string;
  ad_account_id?: string;
  business_id?: string;
  pixel_id?: string;
  conversion_api_token?: string;
  linkedin_company_id?: string;
  twitter_ads_account_id?: string;
  tiktok_advertiser_id?: string;
  tiktok_app_id?: string;
  tiktok_secret?: string; }

export interface AdsAccountSettings {
  id: number;
  account_id: number;
  auto_pause_enabled: boolean;
  auto_pause_threshold: number;
  notifications_enabled: boolean;
  email_notifications: boolean;
  slack_notifications: boolean;
  webhook_url?: string;
  timezone: string;
  currency: string;
  language: string;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; }

export interface AdsAccountStats {
  account_id: number;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  period_start: string;
  period_end: string;
  created_at: string; }

export interface AdsAccountActivity {
  id: number;
  account_id: number;
  action: string;
  description: string;
  user_id?: number;
  metadata?: Record<string, any>;
  created_at: string; }

export interface AdsAccountConnection {
  id: number;
  account_id: number;
  platform: AdsPlatform;
  status: 'connected' | 'disconnected' | 'error' | 'expired';
  last_sync: string;
  sync_frequency: number;
  error_message?: string;
  created_at: string;
  updated_at: string; }

export interface AdsAccountValidation {
  is_valid: boolean;
  platform: AdsPlatform;
  account_id: string;
  account_name?: string;
  permissions: string[];
  errors: string[];
  warnings: string[];
  validated_at: string; }

export interface AdsAccountSync {
  id: number;
  account_id: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  items_synced: number;
  errors: string[];
  metadata?: Record<string, any>; }

export interface AdsAccountBudget {
  id: number;
  account_id: number;
  daily_budget: number;
  monthly_budget?: number;
  currency: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string; }

export interface AdsAccountAlert {
  id: number;
  account_id: number;
  type: 'budget' | 'performance' | 'error' | 'connection';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  is_read: boolean;
  metadata?: Record<string, any>;
  created_at: string; }

export interface AdsAccountIntegration {
  id: number;
  account_id: number;
  integration_type: 'webhook' | 'api' | 'sftp' | 'email';
  integration_name: string;
  configuration: Record<string, any>;
  is_active: boolean;
  last_sync?: string;
  created_at: string;
  updated_at: string; }

export interface AdsAccountPermission {
  id: number;
  account_id: number;
  user_id: number;
  permission: 'read' | 'write' | 'admin' | 'owner';
  granted_by: number;
  granted_at: string;
  expires_at?: string; }

export interface AdsAccountTeam {
  id: number;
  account_id: number;
  user_id: number;
  role: 'viewer' | 'editor' | 'admin' | 'owner';
  invited_by: number;
  invited_at: string;
  accepted_at?: string;
  status: 'pending' | 'active' | 'inactive'; }

export interface AdsAccountBackup {
  id: number;
  account_id: number;
  backup_type: 'full' | 'incremental' | 'differential';
  backup_data: Record<string, any>;
  backup_size: number;
  created_at: string;
  expires_at: string; }

export interface AdsAccountAudit {
  id: number;
  account_id: number;
  audit_type: 'security' | 'compliance' | 'performance' | 'configuration';
  findings: string[];
  recommendations: string[];
  score: number;
  performed_by: number;
  performed_at: string; }

export interface AdsAccountCompliance {
  id: number;
  account_id: number;
  compliance_type: 'gdpr' | 'ccpa' | 'coppa' | 'platform_policy';
  status: 'compliant' | 'non_compliant' | 'pending_review';
  last_review: string;
  next_review: string;
  issues: string[];
  actions_taken: string[]; }

export interface AdsAccountPerformance {
  account_id: number;
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  cost_per_conversion: number;
  conversion_rate: number; }

export interface AdsAccountOptimization {
  id: number;
  account_id: number;
  optimization_type: 'budget' | 'bidding' | 'targeting' | 'creative';
  current_value: unknown;
  suggested_value: unknown;
  confidence_score: number;
  potential_improvement: number;
  risk_level: 'low' | 'medium' | 'high';
  status: 'pending' | 'applied' | 'rejected' | 'expired';
  created_at: string;
  applied_at?: string; }

export interface AdsAccountReport {
  id: number;
  account_id: number;
  report_type: 'performance' | 'audience' | 'placement' | 'keyword';
  report_config: Record<string, any>;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  file_url?: string;
  generated_at?: string;
  expires_at?: string;
  created_at: string; }

export interface AdsAccountTemplate {
  id: number;
  account_id: number;
  template_name: string;
  template_type: 'campaign' | 'ad_group' | 'ad' | 'audience';
  template_data: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string; }

export interface AdsAccountWorkflow {
  id: number;
  account_id: number;
  workflow_name: string;
  workflow_type: 'automation' | 'approval' | 'notification' | 'optimization';
  workflow_config: Record<string, any>;
  is_active: boolean;
  last_run?: string;
  next_run?: string;
  created_at: string;
  updated_at: string; }

export interface AdsAccountApiUsage {
  id: number;
  account_id: number;
  api_endpoint: string;
  request_count: number;
  success_count: number;
  error_count: number;
  rate_limit_hits: number;
  date: string;
  created_at: string; }

export interface AdsAccountCost {
  id: number;
  account_id: number;
  date: string;
  platform_cost: number;
  management_fee: number;
  total_cost: number;
  currency: string;
  created_at: string; }

export interface AdsAccountGoal {
  id: number;
  account_id: number;
  goal_name: string;
  goal_type: 'revenue' | 'conversions' | 'traffic' | 'awareness';
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string; }
