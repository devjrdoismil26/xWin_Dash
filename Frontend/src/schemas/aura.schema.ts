/**
 * Schemas Zod para Aura (WhatsApp Business)
 * 
 * @description
 * Define schemas de validação para dados do módulo Aura.
 * Sistema de automação WhatsApp Business com fluxos, chats e conexões.
 * 
 * @module schemas/aura
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * Schema de Métricas de Conversação
 * 
 * @description
 * Métricas gerais de conversas do WhatsApp
 */
export const ConversationMetricsSchema = z.object({
  total_conversations: z.number().int().nonnegative(),
  active_conversations: z.number().int().nonnegative(),
  new_conversations_today: z.number().int().nonnegative(),
  closed_conversations_today: z.number().int().nonnegative(),
  response_rate: z.number().min(0).max(100),
  avg_response_time: z.number().nonnegative(), // em segundos
  satisfaction_score: z.number().min(0).max(5).optional(),
});

/**
 * Schema de Chat/Conversa
 * 
 * @description
 * Dados de uma conversa individual
 */
export const ChatSchema = z.object({
  id: z.string(),
  contact_id: z.string(),
  contact_name: z.string(),
  contact_phone: z.string(),
  status: z.enum(['active', 'waiting', 'closed', 'archived']),
  last_message: z.string().optional(),
  last_message_at: z.string(),
  unread_count: z.number().int().nonnegative(),
  assigned_to: z.string().optional(),
  tags: z.array(z.string()).optional(),
  created_at: z.string(),
});

/**
 * Schema de Mensagem
 * 
 * @description
 * Mensagem individual em uma conversa
 */
export const MessageSchema = z.object({
  id: z.string(),
  chat_id: z.string(),
  content: z.string(),
  type: z.enum(['text', 'image', 'audio', 'video', 'document', 'location']),
  direction: z.enum(['incoming', 'outgoing']),
  status: z.enum(['sent', 'delivered', 'read', 'failed']).optional(),
  media_url: z.string().optional(),
  timestamp: z.string(),
  sender_name: z.string().optional(),
});

/**
 * Schema de Fluxo de Automação
 * 
 * @description
 * Fluxo automatizado de mensagens
 */
export const FlowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(['active', 'paused', 'draft']),
  trigger: z.object({
    type: z.string(),
    conditions: z.record(z.any()).optional(),
  }),
  nodes: z.array(z.object({
    id: z.string(),
    type: z.string(),
    data: z.record(z.any()),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }).optional(),
  })),
  execution_count: z.number().int().nonnegative(),
  success_rate: z.number().min(0).max(100).optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

/**
 * Schema de Conexão WhatsApp
 * 
 * @description
 * Status de conexão com WhatsApp Business API
 */
export const ConnectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone_number: z.string(),
  status: z.enum(['connected', 'disconnected', 'error', 'pending']),
  qr_code: z.string().optional(), // Base64 do QR code se necessário
  last_connected_at: z.string().optional(),
  error_message: z.string().optional(),
  webhook_verified: z.boolean(),
  business_profile: z.object({
    name: z.string(),
    description: z.string().optional(),
    address: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
  created_at: z.string(),
});

/**
 * Schema de Contato
 * 
 * @description
 * Dados de um contato no sistema
 */
export const ContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  tags: z.array(z.string()).optional(),
  custom_fields: z.record(z.any()).optional(),
  last_interaction_at: z.string().optional(),
  conversation_count: z.number().int().nonnegative(),
  lead_score: z.number().nonnegative().optional(),
  created_at: z.string(),
});

/**
 * Schema de Template de Mensagem
 * 
 * @description
 * Template aprovado para envio via WhatsApp Business
 */
export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['marketing', 'utility', 'authentication']),
  language: z.string(),
  status: z.enum(['approved', 'pending', 'rejected']),
  content: z.string(),
  variables: z.array(z.string()).optional(),
  header_type: z.enum(['text', 'image', 'video', 'document', 'none']).optional(),
  footer: z.string().optional(),
  buttons: z.array(z.object({
    type: z.string(),
    text: z.string(),
    url: z.string().optional(),
  })).optional(),
  created_at: z.string(),
});

/**
 * Schema de Estatísticas do Aura
 * 
 * @description
 * Estatísticas consolidadas do sistema Aura
 */
export const AuraStatsSchema = z.object({
  messages_sent_today: z.number().int().nonnegative(),
  messages_received_today: z.number().int().nonnegative(),
  active_flows: z.number().int().nonnegative(),
  total_contacts: z.number().int().nonnegative(),
  conversion_rate: z.number().min(0).max(100),
  top_flows: z.array(z.object({
    id: z.string(),
    name: z.string(),
    execution_count: z.number().int().nonnegative(),
  })).optional(),
});

/**
 * Schema Completo do Dashboard Aura
 * 
 * @description
 * Todos os dados necessários para o dashboard Aura
 * 
 * @example
 * ```typescript
 * import { AuraDashboardDataSchema } from '@/schemas/aura.schema';
 * import { useValidatedGet } from '@/hooks/useValidatedApi';
 * 
 * const { data, loading, error } = useValidatedGet(
 *   '/api/aura/dashboard',
 *   AuraDashboardDataSchema,
 *   true
 *);

 * ```
 */
export const AuraDashboardDataSchema = z.object({
  metrics: ConversationMetricsSchema,
  stats: AuraStatsSchema,
  recent_chats: z.array(ChatSchema),
  active_flows: z.array(FlowSchema),
  connections: z.array(ConnectionSchema),
});

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type ConversationMetrics = z.infer<typeof ConversationMetricsSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Flow = z.infer<typeof FlowSchema>;
export type Connection = z.infer<typeof ConnectionSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Template = z.infer<typeof TemplateSchema>;
export type AuraStats = z.infer<typeof AuraStatsSchema>;
export type AuraDashboardData = z.infer<typeof AuraDashboardDataSchema>;
