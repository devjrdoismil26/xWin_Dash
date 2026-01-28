// ========================================
// TIPOS REAL-TIME - SERVIÇOS GLOBAIS
// ========================================

// ========================================
// TIPOS BASE
// ========================================

export interface RealTimeEvent {
  type: string;
  payload: any;
  timestamp: string;
  source: string;
}

export interface RealTimeListener {
  (payload: any): void;
}

export interface ChannelInfo {
  channel: any;
  events: string[];
  type: 'public' | 'private' | 'presence';
}

export interface PresenceData {
  status: 'online' | 'offline' | 'away' | 'busy';
  last_seen?: string;
  metadata?: Record<string, any>;
}

export interface ConnectionStatus {
  isConnected: boolean;
  reconnectAttempts: number;
  lastConnected?: string;
  lastDisconnected?: string;
}

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
      url?: string;
    }>;
    created_at: string;
  };
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
      avatar?: string;
    };
  };
}

export interface SessionUpdateEvent {
  type: 'SessionUpdate';
  data: {
    user_id: string;
    session_id: string;
    status: 'active' | 'inactive' | 'expired';
    last_activity: string;
  };
}

export interface FlowTriggerEvent {
  type: 'FlowTrigger';
  data: {
    flow_id: string;
    trigger_type: string;
    payload: any;
    timestamp: string;
  };
}

export interface PresenceUpdateEvent {
  type: 'PresenceUpdate';
  data: {
    user_id: string;
    status: 'online' | 'offline' | 'away' | 'busy';
    last_seen: string;
    metadata?: Record<string, any>;
  };
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
      response_time?: number;
    }>;
  };
}

export interface PerformanceAlertEvent {
  type: 'PerformanceAlert';
  data: {
    level: 'low' | 'medium' | 'high' | 'critical';
    metric: string;
    value: number;
    threshold: number;
    message: string;
    timestamp: string;
  };
}

export interface MaintenanceModeEvent {
  type: 'MaintenanceMode';
  data: {
    enabled: boolean;
    message?: string;
    estimated_duration?: string;
    timestamp: string;
  };
}

export interface StatsUpdateEvent {
  type: 'StatsUpdate';
  data: {
    metric: string;
    value: number;
    change: number;
    change_percentage: number;
    timestamp: string;
  };
}

export interface MetricsUpdateEvent {
  type: 'MetricsUpdate';
  data: {
    metrics: Record<string, number>;
    timestamp: string;
  };
}

// ========================================
// TIPOS DE CANAIS
// ========================================

export interface ChannelEvents {
  [eventName: string]: RealTimeListener;
}

export interface PresenceChannelEvents extends ChannelEvents {
  here?: (users: any[]) => void;
  joining?: (user: any) => void;
  leaving?: (user: any) => void;
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
  };
  client?: any;
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
}

// ========================================
// TIPOS DE MOCK
// ========================================

export interface MockEcho {
  channel: (name: string) => MockChannel;
  private: (name: string) => MockChannel;
  join: (name: string) => MockPresenceChannel;
  disconnect: () => void;
  connector: {
    socket: {
      on: (event: string, handler: (...args: any[]) => void) => void;
      emit: (event: string, data?: any) => void;
      connect: () => void;
    };
  };
}

export interface MockChannel {
  listen: (event: string, handler: (...args: any[]) => void) => void;
  stopListening: () => void;
}

export interface MockPresenceChannel extends MockChannel {
  here: (callback: (...args: any[]) => void) => MockPresenceChannel;
  joining: (callback: (...args: any[]) => void) => MockPresenceChannel;
  leaving: (callback: (...args: any[]) => void) => MockPresenceChannel;
}

// ========================================
// TIPOS DE ERRO
// ========================================

export interface ConnectionError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

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
  lastActivity: string;
}

// ========================================
// TIPOS DE UTILIDADE
// ========================================

export type EventHandler<T = any> = (data: T) => void;

export type ConnectionEventHandler = (status: ConnectionStatus) => void;

export type ErrorEventHandler = (error: ConnectionError) => void;

export type PresenceEventHandler = (data: PresenceData) => void;
