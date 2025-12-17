/**
 * @module modules/Aura/AuraConnections/types/auraConnectionsTypes
 * @description
 * Tipos TypeScript principais do módulo AuraConnections.
 * 
 * Define todos os tipos, interfaces e enums relacionados a:
 * - Conexões com provedores (WhatsApp, Telegram, Facebook Messenger, etc.)
 * - Status de conexão e autenticação
 * - Configurações e webhooks
 * - Health checks e monitoramento
 * - Métricas e analytics
 * - Backups e versões
 * - Colaboração e compartilhamento
 * 
 * @example
 * ```typescript
 * import { AuraConnection, ConnectionStatus, ConnectionProvider } from './auraConnectionsTypes';
 * 
 * const connection: AuraConnection = {
 *   id: 'conn-123',
 *   name: 'WhatsApp Business',
 *   provider: 'whatsapp_business',
 *   status: 'connected',
 *   // ...
 *};

 * ```
 * 
 * @since 1.0.0
 */

/**
 * Status de uma conexão
 * @typedef {'connected' | 'disconnected' | 'connecting' | 'error' | 'pending'} ConnectionStatus
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error' | 'pending';

/**
 * Provedor de conexão
 * @typedef {'whatsapp_business' | 'whatsapp_cloud' | 'telegram' | 'facebook_messenger' | 'custom'} ConnectionProvider
 */
export type ConnectionProvider = 'whatsapp_business' | 'whatsapp_cloud' | 'telegram' | 'facebook_messenger' | 'custom';

/**
 * Tipo de conexão
 * @typedef {'webhook' | 'polling' | 'websocket' | 'api'} ConnectionType
 */
export type ConnectionType = 'webhook' | 'polling' | 'websocket' | 'api';

/**
 * Tipo de autenticação
 * @typedef {'token' | 'oauth' | 'api_key' | 'webhook_secret'} AuthType
 */
export type AuthType = 'token' | 'oauth' | 'api_key' | 'webhook_secret';

/**
 * Interface principal de uma conexão
 * @interface AuraConnection
 * @property {string} id - ID único da conexão
 * @property {string} name - Nome da conexão
 * @property {string} [description] - Descrição da conexão
 * @property {ConnectionProvider} provider - Provedor da conexão
 * @property {ConnectionType} type - Tipo de conexão
 * @property {ConnectionStatus} status - Status atual da conexão
 * @property {AuthType} auth_type - Tipo de autenticação
 * @property {ConnectionConfig} config - Configurações da conexão
 * @property {string} [webhook_url] - URL do webhook
 * @property {string} [webhook_secret] - Segredo do webhook
 * @property {string} [last_sync] - Data da última sincronização
 * @property {ConnectionStatus} sync_status - Status da sincronização
 * @property {string} [error_message] - Mensagem de erro (se houver)
 * @property {number} retry_count - Contador de tentativas
 * @property {number} max_retries - Número máximo de tentativas
 * @property {boolean} health_check_enabled - Se health check está habilitado
 * @property {number} health_check_interval - Intervalo do health check em segundos
 * @property {string} [last_health_check] - Data do último health check
 * @property {number} health_score - Score de saúde (0-100)
 * @property {Record<string, any>} metadata - Metadados adicionais
 * @property {string} created_at - Data de criação
 * @property {string} updated_at - Data de atualização
 * @property {string} created_by - ID do usuário que criou
 * @property {boolean} is_active - Se a conexão está ativa
 * @property {boolean} is_primary - Se é a conexão primária
 */
export type AuraConnection = {
  id: string;
  name: string;
  description?: string;
  provider: ConnectionProvider;
  type: ConnectionType;
  status: ConnectionStatus;
  auth_type: AuthType;
  config: ConnectionConfig;
  webhook_url?: string;
  webhook_secret?: string;
  last_sync?: string;
  sync_status: ConnectionStatus;
  error_message?: string;
  retry_count: number;
  max_retries: number;
  health_check_enabled: boolean;
  health_check_interval: number;
  last_health_check?: string;
  health_score: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_active: boolean;
  is_primary: boolean;};

// Tipos de configuração de conexão
export type ConnectionConfig = {
  api_url?: string;
  api_key?: string;
  access_token?: string;
  refresh_token?: string;
  client_id?: string;
  client_secret?: string;
  phone_number?: string;
  business_account_id?: string;
  app_id?: string;
  app_secret?: string;
  webhook_verify_token?: string;
  timeout?: number;
  retry_attempts?: number;
  retry_delay?: number;
  rate_limit?: number;
  custom_headers?: Record<string, string>;
  custom_params?: Record<string, any>;};

// Tipos de webhook
export type ConnectionWebhook = {
  id: string;
  connection_id: string;
  url: string;
  secret?: string;
  events: string[];
  is_active: boolean;
  last_triggered?: string;
  trigger_count: number;
  success_count: number;
  failure_count: number;
  created_at: string;
  updated_at: string;};

// Tipos de evento de webhook
export type WebhookEvent = {
  id: string;
  webhook_id: string;
  event_type: string;
  data: Record<string, any>;
  timestamp: string;
  processed: boolean;
  processed_at?: string;
  error_message?: string;
  retry_count: number;};

// Tipos de health check
export type ConnectionHealthCheck = {
  id: string;
  connection_id: string;
  status: 'healthy' | 'warning' | 'critical';
  response_time: number;
  error_message?: string;
  checked_at: string;
  next_check: string;
  consecutive_failures: number;
  health_score: number;};

// Tipos de métricas de conexão
export type ConnectionMetrics = {
  id: string;
  connection_id: string;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time: number;
  peak_response_time: number;
  error_rate: number;
  uptime: number;
  last_request?: string;
  period: string;
  created_at: string;
  updated_at: string;};

// Tipos de analytics de conexão
export type ConnectionAnalytics = {
  id: string;
  connection_id: string;
  period: string;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time: number;
  peak_requests: number;
  error_count: number;
  most_common_errors: string[];
  performance_score: number;
  created_at: string;
  updated_at: string;};

// Tipos de monitoramento de conexão
export type ConnectionMonitoring = {
  id: string;
  connection_id: string;
  status: ConnectionStatus;
  health_score: number;
  last_request?: string;
  next_health_check?: string;
  active_requests: number;
  queued_requests: number;
  error_count: number;
  warning_count: number;
  uptime: number;
  last_updated: string;};

// Tipos de backup de conexão
export type ConnectionBackup = {
  id: string;
  connection_id: string;
  name: string;
  description?: string;
  connection_data: AuraConnection;
  created_at: string;
  created_by: string;
  size: number;
  version: number;};

// Tipos de versão de conexão
export type ConnectionVersion = {
  id: string;
  connection_id: string;
  version: number;
  name: string;
  description?: string;
  connection_data: AuraConnection;
  created_at: string;
  created_by: string;
  is_active: boolean;
  changes: string[];};

// Tipos de colaboração de conexão
export type ConnectionCollaboration = {
  id: string;
  connection_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  permissions: string[];
  invited_at: string;
  accepted_at?: string;
  last_activity?: string;};

// Tipos de comentários de conexão
export type ConnectionComment = {
  id: string;
  connection_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  replies: ConnectionComment[];};

// Tipos de favoritos de conexão
export type ConnectionFavorite = {
  id: string;
  connection_id: string;
  user_id: string;
  created_at: string;};

// Tipos de compartilhamento de conexão
export type ConnectionShare = {
  id: string;
  connection_id: string;
  share_token: string;
  permissions: string[];
  expires_at?: string;
  created_at: string;
  created_by: string;
  access_count: number;
  last_accessed?: string;};

// Tipos de exportação de conexão
export type ConnectionExport = {
  id: string;
  connection_id: string;
  format: 'json' | 'yaml' | 'xml';
  data: Record<string, any>;
  created_at: string;
  created_by: string;
  size: number;};

// Tipos de importação de conexão
export type ConnectionImport = {
  id: string;
  name: string;
  format: 'json' | 'yaml' | 'xml';
  data: unknown;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  created_by: string;
  error_message?: string;
  imported_connection_id?: string;};

// Tipos de configuração de conexão
export type ConnectionSettings = {
  auto_reconnect: boolean;
  reconnect_interval: number;
  max_reconnect_attempts: number;
  health_check_enabled: boolean;
  health_check_interval: number;
  timeout: number;
  retry_attempts: number;
  retry_delay: number;
  rate_limit: number;
  logging_enabled: boolean;
  notifications_enabled: boolean;
  webhook_enabled: boolean;
  webhook_url?: string;
  webhook_secret?: string;};

// Tipos de sessão de conexão
export type ConnectionSession = {
  id: string;
  connection_id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  duration?: number;
  requests_count: number;
  status: 'active' | 'ended' | 'expired';
  metadata: Record<string, any>;};

// Tipos de transferência de conexão
export type ConnectionTransfer = {
  id: string;
  connection_id: string;
  from_user_id: string;
  to_user_id: string;
  reason?: string;
  transferred_at: string;
  accepted_at?: string;
  status: 'pending' | 'accepted' | 'rejected';};

// Tipos de nota de conexão
export type ConnectionNote = {
  id: string;
  connection_id: string;
  user_id: string;
  content: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;};

// Tipos de tag de conexão
export type ConnectionTag = {
  id: string;
  name: string;
  color: string;
  description?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;};

// Tipos de anexo de conexão
export type ConnectionAttachment = {
  id: string;
  connection_id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;};

// Tipos de reação de conexão
export type ConnectionReaction = {
  id: string;
  connection_id: string;
  user_id: string;
  emoji: string;
  created_at: string;};

// Tipos de encaminhamento de conexão
export type ConnectionForward = {
  id: string;
  connection_id: string;
  from_user_id: string;
  to_user_id: string;
  forwarded_at: string;
  forwarded_by: string;};

// Tipos de resposta de conexão
export type ConnectionReply = {
  id: string;
  connection_id: string;
  reply_to_connection_id: string;
  created_at: string;};

// Tipos de thread de conexão
export type ConnectionThread = {
  id: string;
  connection_id: string;
  root_connection_id: string;
  connections: AuraConnection[];
  created_at: string;
  updated_at: string;};

// Tipos de busca de conexão
export type ConnectionSearch = {
  query: string;
  filters: ConnectionFilters;
  results: AuraConnection[];
  total: number;
  page: number;
  per_page: number;
  took: number;};

// Tipos de sugestão de conexão
export type ConnectionSuggestion = {
  id: string;
  type: 'template' | 'quick_setup' | 'ai_suggestion';
  content: string;
  confidence: number;
  context: Record<string, any>;
  created_at: string;};

// Tipos de análise de conexão
export type ConnectionAnalysis = {
  id: string;
  connection_id: string;
  analysis_type: 'performance' | 'security' | 'reliability';
  score: number;
  recommendations: string[];
  created_at: string;};

// Tipos de classificação de conexão
export type ConnectionClassification = {
  id: string;
  connection_id: string;
  category: string;
  subcategory?: string;
  confidence: number;
  keywords: string[];
  created_at: string;};

// Tipos de filtros de conexão
export type ConnectionFilters = {
  status?: ConnectionStatus;
  provider?: ConnectionProvider;
  type?: ConnectionType;
  auth_type?: AuthType;
  is_active?: boolean;
  is_primary?: boolean;
  date_range?: string;
  search?: string;};

// Tipos de dados de conexão
export type ConnectionData = {
  id: string;
  connection_id: string;
  key: string;
  value: unknown;
  type: string;
  created_at: string;
  updated_at: string;};

// Tipos de logs de conexão
export type ConnectionLog = {
  id: string;
  connection_id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: Record<string, any>;
  timestamp: string;
  source: string;};
