// ========================================
// SERVIÇO REAL-TIME - WEBSOCKET/REAL-TIME
// ========================================

import {
  RealTimeEvent,
  RealTimeListener,
  ChannelInfo,
  PresenceData,
  ConnectionStatus,
  EchoConfig,
  RealTimeConfig,
  MockEcho,
  MockChannel,
  MockPresenceChannel,
  ConnectionError,
  RealTimeStats,
  EventHandler,
  ConnectionEventHandler,
  ErrorEventHandler,
  PresenceEventHandler,
  ChannelEvents,
  PresenceChannelEvents
} from './types';

// ========================================
// CONFIGURAÇÃO PADRÃO
// ========================================

const defaultConfig: RealTimeConfig = {
  websocketEnabled: import.meta.env.VITE_WEBSOCKET_ENABLED === 'true',
  websocketUrl: import.meta.env.VITE_WEBSOCKET_URL,
  pusherKey: import.meta.env.VITE_PUSHER_APP_KEY,
  pusherCluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  pusherPort: Number(import.meta.env.VITE_PUSHER_PORT || 4006),
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  heartbeatInterval: 30000
};

// ========================================
// CLASSE SERVIÇO REAL-TIME
// ========================================

class RealTimeService {
  private echo: any = null;
  private isConnected: boolean = false;
  private subscribedChannels: Map<string, ChannelInfo> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private heartbeatInterval: number | null = null;
  private presenceData: PresenceData = { status: 'offline' };
  private listeners: Map<string, RealTimeListener[]> = new Map();
  private config: RealTimeConfig;
  private stats: RealTimeStats = {
    connectionUptime: 0,
    messagesReceived: 0,
    messagesSent: 0,
    channelsSubscribed: 0,
    reconnectAttempts: 0,
    lastActivity: new Date().toISOString()
  };

  constructor(config: Partial<RealTimeConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.maxReconnectAttempts = this.config.maxReconnectAttempts;
    this.reconnectDelay = this.config.reconnectDelay;
    this.heartbeatInterval = this.config.heartbeatInterval;
  }

  // ========================================
  // MÉTODOS DE EVENTOS
  // ========================================

  on(event: string, handler: RealTimeListener): void {
    const list = this.listeners.get(event) || [];
    this.listeners.set(event, [...list, handler]);
  }

  off(event: string, handler: RealTimeListener): void {
    const list = this.listeners.get(event) || [];
    this.listeners.set(event, list.filter((h) => h !== handler));
  }

  emit(event: string, payload: any): void {
    this.stats.lastActivity = new Date().toISOString();
    (this.listeners.get(event) || []).forEach((h) => {
      try {
        h(payload);
      } catch (err) {
        console.warn('RealTimeService listener error', err);
      }
    });
  }

  // ========================================
  // MÉTODOS DE INICIALIZAÇÃO
  // ========================================

  async initialize(userId: string, authToken?: string): Promise<void> {
    if (this.isConnected) {
      console.warn('RealTimeService already connected');
      return;
    }

    await this.initializeEcho(authToken);
    this.setupBasicListeners();
    await this.connectEssentialChannels(userId);
    this.startHeartbeat();
    await this.updatePresence('online');
    this.isConnected = true;
    this.stats.connectionUptime = Date.now();
    this.emit('connected', { userId, timestamp: new Date().toISOString() });
  }

  private async initializeEcho(authToken?: string): Promise<void> {
    try {
      if (!this.config.websocketEnabled) {
        console.log('WebSocket desabilitado - usando modo mock');
        this.echo = this.createMockEcho();
        return;
      }

      const { default: Echo } = await import('laravel-echo');
      const { default: io } = await import('socket.io-client');
      
      const host = this.config.websocketUrl || `${window.location.hostname}:6001`;
      
      const echoConfig: EchoConfig = {
        broadcaster: 'socket.io',
        host,
        client: io,
        auth: { 
          headers: { 
            Authorization: `Bearer ${authToken || ''}` 
          } 
        },
      };

      this.echo = new Echo(echoConfig);
    } catch (error) {
      console.warn('Falha ao inicializar Echo, usando modo mock:', error);
      this.echo = this.createMockEcho();
    }
  }

  private createMockEcho(): MockEcho {
    return {
      channel: (name: string): MockChannel => ({
        listen: () => {},
        stopListening: () => {}
      }),
      private: (name: string): MockChannel => ({
        listen: () => {},
        stopListening: () => {}
      }),
      join: (name: string): MockPresenceChannel => ({
        listen: () => {},
        stopListening: () => {},
        here: () => this.createMockPresenceChannel(),
        joining: () => this.createMockPresenceChannel(),
        leaving: () => this.createMockPresenceChannel()
      }),
      disconnect: () => {},
      connector: {
        socket: {
          on: () => {},
          emit: () => {},
          connect: () => {}
        }
      }
    };
  }

  private createMockPresenceChannel(): MockPresenceChannel {
    return {
      listen: () => {},
      stopListening: () => {},
      here: () => this.createMockPresenceChannel(),
      joining: () => this.createMockPresenceChannel(),
      leaving: () => this.createMockPresenceChannel()
    };
  }

  // ========================================
  // MÉTODOS DE LISTENERS
  // ========================================

  private setupBasicListeners(): void {
    if (!this.echo || !this.echo.connector) return;
    
    const socket = this.echo.connector.socket;
    
    socket.on('connect', () => {
      this.reconnectAttempts = 0;
      this.isConnected = true;
      this.stats.connectionUptime = Date.now();
      this.emit('connected', { timestamp: new Date().toISOString() });
    });
    
    socket.on('disconnect', () => {
      this.isConnected = false;
      this.emit('disconnected', { timestamp: new Date().toISOString() });
    });
    
    socket.on('connect_error', (error: any) => {
      this.handleConnectionError(error);
    });
  }

  // ========================================
  // MÉTODOS DE CANAIS
  // ========================================

  async connectEssentialChannels(userId: string): Promise<void> {
    await this.subscribeToPrivateChannel(`user.${userId}`, {
      AuraNotification: (d: any) => {
        this.stats.messagesReceived++;
        this.emit('aura.notification', d);
      },
      ChatMessage: (d: any) => {
        this.stats.messagesReceived++;
        this.emit('chat.message', d);
      },
      SessionUpdate: (d: any) => {
        this.stats.messagesReceived++;
        this.emit('session.update', d);
      },
      FlowTrigger: (d: any) => {
        this.stats.messagesReceived++;
        this.emit('flow.trigger', d);
      },
      PresenceUpdate: (d: any) => {
        this.stats.messagesReceived++;
        this.emit('presence.update', d);
      },
    });

    await this.subscribeToChannel('aura.global', {
      SystemStatus: (d: any) => {
        this.stats.messagesReceived++;
        this.emit('system.status', d);
      },
      PerformanceAlert: (d: any) => {
        this.stats.messagesReceived++;
        this.emit('performance.alert', d);
      },
      MaintenanceMode: (d: any) => {
        this.stats.messagesReceived++;
        this.emit('maintenance.mode', d);
      },
    });

    await this.subscribeToChannel('aura.stats', {
      StatsUpdate: (d: any) => {
        this.stats.messagesReceived++;
        this.emit('stats.update', d);
      },
      MetricsUpdate: (d: any) => {
        this.stats.messagesReceived++;
        this.emit('metrics.update', d);
      },
    });
  }

  async subscribeToChannel(channelName: string, events: ChannelEvents = {}): Promise<any> {
    if (!this.echo) throw new Error('Echo not initialized');
    
    const channel = this.echo.channel(channelName);
    Object.entries(events).forEach(([event, handler]) => {
      channel.listen(event, handler);
    });
    
    this.subscribedChannels.set(channelName, { 
      channel, 
      events: Object.keys(events), 
      type: 'public' 
    });
    
    this.stats.channelsSubscribed++;
    return channel;
  }

  async subscribeToPrivateChannel(channelName: string, events: ChannelEvents = {}): Promise<any> {
    if (!this.echo) throw new Error('Echo not initialized');
    
    const channel = this.echo.private(channelName);
    Object.entries(events).forEach(([event, handler]) => {
      channel.listen(event, handler);
    });
    
    this.subscribedChannels.set(channelName, { 
      channel, 
      events: Object.keys(events), 
      type: 'private' 
    });
    
    this.stats.channelsSubscribed++;
    return channel;
  }

  async subscribeToPresenceChannel(channelName: string, events: PresenceChannelEvents = {}): Promise<any> {
    if (!this.echo) throw new Error('Echo not initialized');
    
    const channel = this.echo
      .join(channelName)
      .here((users: any[]) => this.emit('presence.here', { channel: channelName, users }))
      .joining((user: any) => this.emit('presence.joining', { channel: channelName, user }))
      .leaving((user: any) => this.emit('presence.leaving', { channel: channelName, user }));
    
    Object.entries(events).forEach(([event, handler]) => {
      if (event !== 'here' && event !== 'joining' && event !== 'leaving') {
        channel.listen(event, handler);
      }
    });
    
    this.subscribedChannels.set(channelName, { 
      channel, 
      events: Object.keys(events), 
      type: 'presence' 
    });
    
    this.stats.channelsSubscribed++;
    return channel;
  }

  // ========================================
  // MÉTODOS DE PRESENCE
  // ========================================

  async updatePresence(status: PresenceData['status'], metadata: Record<string, any> = {}): Promise<void> {
    this.presenceData = { 
      ...this.presenceData, 
      status, 
      last_seen: new Date().toISOString(),
      metadata 
    };
    this.emit('presence.updated', this.presenceData);
  }

  getPresenceData(): PresenceData {
    return { ...this.presenceData };
  }

  // ========================================
  // MÉTODOS DE CONEXÃO
  // ========================================

  private handleConnectionError(error: any): void {
    const connectionError: ConnectionError = {
      code: error.code || 'CONNECTION_ERROR',
      message: error.message || 'Erro de conexão',
      details: error,
      timestamp: new Date().toISOString()
    };

    this.emit('connection.error', connectionError);
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('connection.failed', connectionError);
      return;
    }
    
    this.reconnectAttempts += 1;
    this.stats.reconnectAttempts = this.reconnectAttempts;
    
    setTimeout(() => {
      try {
        this.echo?.connector?.socket?.connect();
      } catch (reconnectErr) {
        console.warn('reconnect failed', reconnectErr);
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  private startHeartbeat(): void {
    if (!this.echo || !this.echo.connector) return;
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.heartbeatInterval = setInterval(() => {
      try {
        this.echo.connector.socket.emit('ping');
        this.stats.messagesSent++;
      } catch (emitErr) {
        // ignore
        void emitErr;
      }
    }, this.config.heartbeatInterval);
  }

  // ========================================
  // MÉTODOS DE GERENCIAMENTO
  // ========================================

  async unsubscribeFromChannel(channelName: string): Promise<void> {
    const info = this.subscribedChannels.get(channelName);
    if (!info) return;
    
    try {
      info.channel?.stopListening?.();
    } catch (stopErr) {
      void stopErr;
    }
    
    this.subscribedChannels.delete(channelName);
    this.stats.channelsSubscribed = Math.max(0, this.stats.channelsSubscribed - 1);
  }

  getSubscribedChannels(): string[] {
    return Array.from(this.subscribedChannels.keys());
  }

  isChannelSubscribed(channelName: string): boolean {
    return this.subscribedChannels.has(channelName);
  }

  getConnectionStatus(): ConnectionStatus {
    return { 
      isConnected: this.isConnected, 
      reconnectAttempts: this.reconnectAttempts,
      lastConnected: this.isConnected ? new Date().toISOString() : undefined,
      lastDisconnected: !this.isConnected ? new Date().toISOString() : undefined
    };
  }

  getStats(): RealTimeStats {
    return { ...this.stats };
  }

  // ========================================
  // MÉTODOS DE DESCONEXÃO
  // ========================================

  disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    this.subscribedChannels.forEach((_, name) => this.unsubscribeFromChannel(name));
    
    try {
      this.echo?.disconnect?.();
    } catch (discErr) {
      void discErr;
    }
    
    this.echo = null;
    this.isConnected = false;
    this.emit('disconnected', { timestamp: new Date().toISOString() });
  }

  // ========================================
  // MÉTODOS DE CONFIGURAÇÃO
  // ========================================

  updateConfig(newConfig: Partial<RealTimeConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): RealTimeConfig {
    return { ...this.config };
  }

  // ========================================
  // MÉTODOS DE UTILIDADE
  // ========================================


  getEcho(): any {
    return this.echo;
  }

  // ========================================
  // MÉTODOS DE EVENTOS ESPECÍFICOS
  // ========================================

  onAuraNotification(handler: EventHandler): void {
    this.on('aura.notification', handler);
  }

  onChatMessage(handler: EventHandler): void {
    this.on('chat.message', handler);
  }

  onSessionUpdate(handler: EventHandler): void {
    this.on('session.update', handler);
  }

  onFlowTrigger(handler: EventHandler): void {
    this.on('flow.trigger', handler);
  }

  onPresenceUpdate(handler: PresenceEventHandler): void {
    this.on('presence.update', handler);
  }

  onSystemStatus(handler: EventHandler): void {
    this.on('system.status', handler);
  }

  onPerformanceAlert(handler: EventHandler): void {
    this.on('performance.alert', handler);
  }

  onMaintenanceMode(handler: EventHandler): void {
    this.on('maintenance.mode', handler);
  }

  onStatsUpdate(handler: EventHandler): void {
    this.on('stats.update', handler);
  }

  onMetricsUpdate(handler: EventHandler): void {
    this.on('metrics.update', handler);
  }

  onConnectionError(handler: ErrorEventHandler): void {
    this.on('connection.error', handler);
  }

  onConnectionStatus(handler: ConnectionEventHandler): void {
    this.on('connected', handler);
    this.on('disconnected', handler);
  }
}

// ========================================
// INSTÂNCIA GLOBAL
// ========================================

const realTimeService = new RealTimeService();

// ========================================
// EXPORTS
// ========================================

export { RealTimeService, realTimeService };
export default realTimeService;
