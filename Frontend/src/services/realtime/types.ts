/**
 * Tipos Real-Time - Serviços Globais
 *
 * @description
 * Este módulo contém todas as interfaces e tipos TypeScript utilizados
 * pelos serviços de comunicação em tempo real (Laravel Echo) da aplicação.
 * Inclui tipos para eventos, canais, presence, configuração e mocks.
 *
 * Funcionalidades principais:
 * - Tipos base (RealTimeEvent, RealTimeListener, ChannelInfo)
 * - Tipos de eventos específicos (AuraNotification, ChatMessage, etc.)
 * - Tipos de canais (ChannelEvents, PresenceChannelEvents)
 * - Tipos de configuração (EchoConfig, RealTimeConfig)
 * - Tipos de mock (MockEcho, MockChannel, MockPresenceChannel)
 * - Tipos de erro (ConnectionError, ReconnectError)
 * - Tipos de utilitários (EventHandler, ConnectionEventHandler, etc.)
 *
 * @module services/realtime/types
 * @since 1.0.0
 *
 * @example
 * ```ts
 * import { RealTimeEvent, EchoConfig } from '@/services/realtime/types';
 *
 * // Usar tipos em funções
 * function handleEvent(event: RealTimeEvent): void {
 *   // ...
 * }
 * ```
 */

// ========================================
// TIPOS BASE
// ========================================

/**
 * Interface para eventos real-time
 *
 * @description
 * Estrutura padrão para eventos recebidos via comunicação em tempo real.
 *
 * @example
 * ```ts
 * const event: RealTimeEvent = {
 *   type: 'notification',
 *   payload: { message: 'Hello' },
 *   timestamp: '2024-01-01T00:00:00Z',
 *   source: 'server'
 *};

 * ```
 */
export interface RealTimeEvent {
  type: string;
  payload: unknown;
  timestamp: string;
  source: string; }

/**
 * Tipo para listener de eventos real-time
 *
 * @description
 * Função callback para processar eventos recebidos via comunicação em tempo real.
 *
 * @example
 * ```ts
 * const listener: RealTimeListener = (payload: unknown) => {
 *};

 * ```
 */
export interface RealTimeListener {
  (payload: unknown): void; }

/**
 * Interface para informações de canal
 *
 * @description
 * Contém informações sobre um canal assinado, incluindo a instância do canal,
 * eventos escutados e tipo de canal.
 *
 * @example
 * ```ts
 * const channelInfo: ChannelInfo = {
 *   channel: mockChannel,
 *   events: ['event1', 'event2'],
 *   type: 'public'
 *};

 * ```
 */
export interface ChannelInfo {
  channel: unknown;
  events: string[];
  type: 'public' | 'private' | 'presence'; }

/**
 * Interface para dados de presence
 *
 * @description
 * Estrutura para rastreamento de status de presence (online/offline/away/busy).
 *
 * @example
 * ```ts
 * const presence: PresenceData ={ *   status: 'online',
 *   last_seen: '2024-01-01T00:00:00Z',
 *   metadata: { device: 'mobile'  }
 *};

 * ```
 */
export interface PresenceData {
  status: 'online' | 'offline' | 'away' | 'busy';
  last_seen?: string;
  metadata?: Record<string, any>;
  [key: string]: unknown; }

export interface ConnectionStatus {
  isConnected: boolean;
  reconnectAttempts: number;
  lastConnected?: string;
  lastDisconnected?: string; }

// ========================================
// TIPOS DE EVENTOS
// ========================================

export interface AuraNotificationEvent {
  type: 'AuraNotification';
  data: {
    id: string;
  title: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
  actions?: Array<{
      label: string;
  action: string;
  url?: string; }>;
    created_at: string;};

}

export interface ChatMessageEvent {
  type: 'ChatMessage';
  data: {
    id: string;
  chat_id: string;
  content: string;
  direction: 'inbound' | 'outbound';
  timestamp: string;
  sender: {
      id: string;
  name: string;
  avatar?: string; };
};

}

export interface SessionUpdateEvent {
  type: 'SessionUpdate';
  data: {
    user_id: string;
  session_id: string;
  status: 'active' | 'inactive' | 'expired';
  last_activity: string; };

}

export interface FlowTriggerEvent {
  type: 'FlowTrigger';
  data: {
    flow_id: string;
  trigger_type: string;
  payload: unknown;
  timestamp: string; };

}

export interface PresenceUpdateEvent {
  type: 'PresenceUpdate';
  data: {
    user_id: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  last_seen: string;
  metadata?: Record<string, any>; };

}

export interface SystemStatusEvent {
  type: 'SystemStatus';
  data: {
    status: 'healthy' | 'degraded' | 'down';
  message: string;
  timestamp: string;
  services: Array<{
      name: string;
  status: 'up' | 'down';
  response_time?: number; }>;};

}

export interface PerformanceAlertEvent {
  type: 'PerformanceAlert';
  data: {
    level: 'low' | 'medium' | 'high' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: string; };

}

export interface MaintenanceModeEvent {
  type: 'MaintenanceMode';
  data: {
    enabled: boolean;
  message?: string;
  estimated_duration?: string;
  timestamp: string; };

}

export interface StatsUpdateEvent {
  type: 'StatsUpdate';
  data: {
    metric: string;
  value: number;
  change: number;
  change_percentage: number;
  timestamp: string; };

}

export interface MetricsUpdateEvent {
  type: 'MetricsUpdate';
  data: {
    metrics: Record<string, number>;
  timestamp: string; };

}

// ========================================
// TIPOS DE CANAIS
// ========================================

export interface ChannelEvents {
  [eventName: string]: RealTimeListener; }

export interface PresenceChannelEvents extends ChannelEvents {
  here??: (e: any) => void;
  joining??: (e: any) => void;
  leaving??: (e: any) => void;
}

// ========================================
// TIPOS DE CONFIGURAÇÃO
// ========================================

export interface EchoConfig {
  broadcaster: 'socket.io' | 'pusher' | 'redis';
  key?: string;
  cluster?: string;
  host?: string;
  port?: number;
  scheme?: string;
  wsHost?: string;
  wsPort?: number;
  forceTLS?: boolean;
  disableStats?: boolean;
  enabledTransports?: string[];
  auth?: {
    headers: Record<string, string>;
  [key: string]: unknown; };

  client?: string;
}

export interface RealTimeConfig {
  websocketEnabled: boolean;
  websocketUrl?: string;
  pusherKey?: string;
  pusherCluster?: string;
  pusherPort?: number;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
  [key: string]: unknown; }

// ========================================
// TIPOS DE MOCK
// ========================================

export interface MockEcho {
  channel: (name: string) => MockChannel;
  private: (name: string) => MockChannel;
  join: (name: string) => MockPresenceChannel;
  disconnect??: (e: any) => void;
  connector: {
    socket: {
      on?: (e: any) => void) => void;
  emit?: (e: any) => void;
  connect??: (e: any) => void; };
};

}

export interface MockChannel {
  listen?: (e: any) => void) => void;
  stopListening??: (e: any) => void; }

export interface MockPresenceChannel extends MockChannel {
  here?: (e: any) => void) => MockPresenceChannel;
  joining?: (e: any) => void) => MockPresenceChannel;
  leaving?: (e: any) => void) => MockPresenceChannel;
}

// ========================================
// TIPOS DE ERRO
// ========================================

export interface ConnectionError {
  code: string;
  message: string;
  details?: string;
  timestamp: string; }

export interface ReconnectError extends ConnectionError {
  attempt: number;
  maxAttempts: number;
  nextAttemptIn: number;
}

// ========================================
// TIPOS DE ESTATÍSTICAS
// ========================================

export interface RealTimeStats {
  connectionUptime: number;
  messagesReceived: number;
  messagesSent: number;
  channelsSubscribed: number;
  reconnectAttempts: number;
  lastActivity: string; }

// ========================================
// TIPOS DE UTILIDADE
// ========================================

export type EventHandler<T = any> = (data: T) => void;

export type ConnectionEventHandler = (status: ConnectionStatus) => void;

export type ErrorEventHandler = (error: ConnectionError) => void;

export type PresenceEventHandler = (data: PresenceData) => void;
