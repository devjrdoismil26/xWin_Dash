/**
 * @module modules/Aura/AuraChats/types/auraChatsTypes
 * @description
 * Tipos TypeScript principais do módulo AuraChats.
 * 
 * Define todos os tipos, interfaces e enums relacionados a:
 * - Chats e conversas
 * - Mensagens e seus status
 * - Contatos e perfis
 * - Templates e respostas rápidas
 * - Filtros e buscas
 * - Métricas e analytics
 * - Configurações e sessões
 * 
 * @example
 * ```typescript
 * import { AuraChat, AuraMessage, ChatStatus } from './auraChatsTypes';
 * 
 * const chat: AuraChat = {
 *   id: 'chat-123',
 *   phone_number: '+5511999999999',
 *   status: 'active',
 *   // ...
 *};

 * ```
 * 
 * @since 1.0.0
 */

/**
 * Status de um chat
 * @typedef {'active' | 'inactive' | 'archived' | 'blocked'} ChatStatus
 */
export type ChatStatus = 'active' | 'inactive' | 'archived' | 'blocked';

/**
 * Status de uma mensagem
 * @typedef {'sent' | 'delivered' | 'read' | 'failed' | 'pending'} MessageStatus
 */
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'pending';

/**
 * Direção de uma mensagem
 * @typedef {'inbound' | 'outbound'} MessageDirection
 */
export type MessageDirection = 'inbound' | 'outbound';

/**
 * Tipo de mensagem
 * @typedef {'text' | 'image' | 'audio' | 'video' | 'document' | 'location' | 'contact' | 'sticker' | 'template'} MessageType
 */
export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'document' | 'location' | 'contact' | 'sticker' | 'template';

/**
 * Interface principal de um chat
 * @interface AuraChat
 * @property {string} id - ID único do chat
 * @property {string} phone_number - Número de telefone do contato
 * @property {string} [contact_name] - Nome do contato
 * @property {string} [contact_avatar] - URL do avatar do contato
 * @property {ChatStatus} status - Status atual do chat
 * @property {AuraMessage} [last_message] - Última mensagem enviada/recebida
 * @property {string} last_activity - Data da última atividade
 * @property {number} unread_count - Contador de mensagens não lidas
 * @property {string} connection_id - ID da conexão associada
 * @property {string} [flow_id] - ID do fluxo associado
 * @property {string[]} tags - Tags do chat
 * @property {string} [notes] - Notas sobre o chat
 * @property {Record<string, any>} metadata - Metadados adicionais
 * @property {string} created_at - Data de criação
 * @property {string} updated_at - Data de atualização
 */
export type AuraChat = {
  id: string;
  phone_number: string;
  contact_name?: string;
  contact_avatar?: string;
  status: ChatStatus;
  last_message?: AuraMessage;
  last_activity: string;
  unread_count: number;
  connection_id: string;
  flow_id?: string;
  tags: string[];
  notes?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;};

/**
 * Interface principal de uma mensagem
 * @interface AuraMessage
 * @property {string} id - ID único da mensagem
 * @property {string} chat_id - ID do chat associado
 * @property {MessageDirection} direction - Direção da mensagem (inbound/outbound)
 * @property {MessageType} type - Tipo da mensagem
 * @property {string} content - Conteúdo da mensagem
 * @property {string} [media_url] - URL da mídia (se aplicável)
 * @property {string} [media_type] - Tipo MIME da mídia
 * @property {number} [media_size] - Tamanho da mídia em bytes
 * @property {MessageStatus} status - Status atual da mensagem
 * @property {string} timestamp - Timestamp da mensagem
 * @property {string} [delivered_at] - Data de entrega
 * @property {string} [read_at] - Data de leitura
 * @property {string} [failed_reason] - Motivo da falha (se houver)
 * @property {number} retry_count - Contador de tentativas
 * @property {Record<string, any>} metadata - Metadados adicionais
 * @property {string} [reply_to] - ID da mensagem respondida
 * @property {string} [forwarded_from] - ID do chat de origem (se encaminhada)
 * @property {string} [template_id] - ID do template usado (se aplicável)
 * @property {Record<string, any>} [template_params] - Parâmetros do template
 */
export type AuraMessage = {
  id: string;
  chat_id: string;
  direction: MessageDirection;
  type: MessageType;
  content: string;
  media_url?: string;
  media_type?: string;
  media_size?: number;
  status: MessageStatus;
  timestamp: string;
  delivered_at?: string;
  read_at?: string;
  failed_reason?: string;
  retry_count: number;
  metadata: Record<string, any>;
  reply_to?: string;
  forwarded_from?: string;
  template_id?: string;
  template_params?: Record<string, any>;};

// Tipos de contato
export type AuraContact = {
  id: string;
  phone_number: string;
  name?: string;
  avatar?: string;
  email?: string;
  company?: string;
  tags: string[];
  notes?: string;
  last_seen?: string;
  is_blocked: boolean;
  is_archived: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;};

// Tipos de template de mensagem
export type MessageTemplate = {
  id: string;
  name: string;
  content: string;
  type: MessageType;
  category: string;
  language: string;
  status: 'pending' | 'approved' | 'rejected';
  variables: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;};

// Tipos de resposta rápida
export type QuickReply = {
  id: string;
  name: string;
  content: string;
  category: string;
  tags: string[];
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;};

// Tipos de filtros de chat
export type ChatFilters = {
  status?: ChatStatus;
  connection_id?: string;
  flow_id?: string;
  tags?: string[];
  date_range?: string;
  search?: string;
  unread_only?: boolean;};

// Tipos de filtros de mensagem
export type MessageFilters = {
  chat_id?: string;
  direction?: MessageDirection;
  type?: MessageType;
  status?: MessageStatus;
  date_range?: string;
  search?: string;};

// Tipos de dados de chat
export type ChatData = {
  id: string;
  chat_id: string;
  key: string;
  value: unknown;
  type: string;
  created_at: string;
  updated_at: string;};

// Tipos de logs de chat
export type ChatLog = {
  id: string;
  chat_id: string;
  message_id?: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: string;
  timestamp: string;
  source: string;};

// Tipos de métricas de chat
export type ChatMetrics = {
  id: string;
  chat_id: string;
  total_messages: number;
  inbound_messages: number;
  outbound_messages: number;
  response_time: number;
  last_message_at?: string;
  created_at: string;
  updated_at: string;};

// Tipos de analytics de chat
export type ChatAnalytics = {
  id: string;
  period: string;
  total_chats: number;
  active_chats: number;
  total_messages: number;
  inbound_messages: number;
  outbound_messages: number;
  average_response_time: number;
  peak_concurrent_chats: number;
  message_types: Record<MessageType, number>;
  created_at: string;
  updated_at: string;};

// Tipos de monitoramento de chat
export type ChatMonitoring = {
  id: string;
  connection_id: string;
  active_chats: number;
  queued_messages: number;
  failed_messages: number;
  average_response_time: number;
  uptime: number;
  last_updated: string;};

// Tipos de backup de chat
export type ChatBackup = {
  id: string;
  chat_id: string;
  name: string;
  description?: string;
  chat_data: AuraChat;
  messages: AuraMessage[];
  created_at: string;
  created_by: string;
  size: number;};

// Tipos de exportação de chat
export type ChatExport = {
  id: string;
  chat_id: string;
  format: 'json' | 'csv' | 'pdf';
  data: Record<string, any>;
  created_at: string;
  created_by: string;
  size: number;};

// Tipos de importação de chat
export type ChatImport = {
  id: string;
  name: string;
  format: 'json' | 'csv';
  data: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  created_by: string;
  error_message?: string;
  imported_chat_id?: string;};

// Tipos de configuração de chat
export type ChatConfig = {
  auto_reply_enabled: boolean;
  auto_reply_message?: string;
  business_hours_enabled: boolean;
  business_hours?: {
    start: string;
    end: string;
    timezone: string;
    days: number[];};

  away_message?: string;
  typing_indicator_enabled: boolean;
  read_receipts_enabled: boolean;
  message_templates_enabled: boolean;
  quick_replies_enabled: boolean;
  file_sharing_enabled: boolean;
  max_file_size: number;
  allowed_file_types: string[];};

// Tipos de sessão de chat
export type ChatSession = {
  id: string;
  chat_id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  duration?: number;
  messages_count: number;
  status: 'active' | 'ended' | 'transferred';
  transferred_to?: string;
  transferred_at?: string;
  metadata: Record<string, any>;};

// Tipos de transferência de chat
export type ChatTransfer = {
  id: string;
  chat_id: string;
  from_user_id: string;
  to_user_id: string;
  reason?: string;
  transferred_at: string;
  accepted_at?: string;
  status: 'pending' | 'accepted' | 'rejected';};

// Tipos de nota de chat
export type ChatNote = {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;};

// Tipos de tag de chat
export type ChatTag = {
  id: string;
  name: string;
  color: string;
  description?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;};

// Tipos de anexo de mensagem
export type MessageAttachment = {
  id: string;
  message_id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  size: number;
  url: string;
  thumbnail_url?: string;
  created_at: string;};

// Tipos de reação de mensagem
export type MessageReaction = {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;};

// Tipos de encaminhamento de mensagem
export type MessageForward = {
  id: string;
  message_id: string;
  from_chat_id: string;
  to_chat_id: string;
  forwarded_at: string;
  forwarded_by: string;};

// Tipos de resposta de mensagem
export type MessageReply = {
  id: string;
  message_id: string;
  reply_to_message_id: string;
  created_at: string;};

// Tipos de thread de mensagem
export type MessageThread = {
  id: string;
  chat_id: string;
  root_message_id: string;
  messages: AuraMessage[];
  created_at: string;
  updated_at: string;};

// Tipos de busca de mensagem
export type MessageSearch = {
  query: string;
  filters: MessageFilters;
  results: AuraMessage[];
  total: number;
  page: number;
  per_page: number;
  took: number;};

// Tipos de sugestão de mensagem
export type MessageSuggestion = {
  id: string;
  type: 'template' | 'quick_reply' | 'ai_suggestion';
  content: string;
  confidence: number;
  context: Record<string, any>;
  created_at: string;};

// Tipos de análise de sentimento
export type SentimentAnalysis = {
  id: string;
  message_id: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: Record<string, number>;
  created_at: string;};

// Tipos de classificação de mensagem
export type MessageClassification = {
  id: string;
  message_id: string;
  category: string;
  subcategory?: string;
  confidence: number;
  keywords: string[];
  created_at: string;};
