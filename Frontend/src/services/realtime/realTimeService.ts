/**
 * RealTimeService - Serviço de Comunicação em Tempo Real
 * Refatorado em 28/11/2025 - Reduzido de 1073 linhas (31KB) para ~300 linhas (10KB)
 * 
 * Simplificações:
 * - Extraído lógica de reconexão
 * - Simplificado gerenciamento de canais
 * - Removido código mock complexo
 */

import { RealTimeEvent, RealTimeListener, ChannelInfo, PresenceData, ConnectionStatus, RealTimeConfig, MockEcho, RealTimeStats, EventHandler, ChannelEvents } from './types';

const defaultConfig: RealTimeConfig = {
  websocketEnabled: import.meta.env.VITE_WEBSOCKET_ENABLED === 'true',
  websocketUrl: import.meta.env.VITE_WEBSOCKET_URL,
  pusherKey: import.meta.env.VITE_PUSHER_APP_KEY,
  pusherCluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  pusherPort: Number(import.meta.env.VITE_PUSHER_PORT || 4006),
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  heartbeatInterval: 30000};

class RealTimeService {
  private echo: MockEcho | null = null;
  private isConnected: boolean = false;
  private subscribedChannels: Map<string, ChannelInfo> = new Map();

  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private heartbeatInterval: number | null = null;
  private presenceData: PresenceData = { status: 'offline'};

  private listeners: Map<string, RealTimeListener[]> = new Map();

  private config: RealTimeConfig;
  private stats: RealTimeStats = {
    connectionUptime: 0,
    messagesReceived: 0,
    messagesSent: 0,
    channelsSubscribed: 0,
    reconnectAttempts: 0,
    lastActivity: new Date().toISOString()};

  constructor(config: Partial<RealTimeConfig> = {}) {
    this.config = { ...defaultConfig, ...config};

    this.maxReconnectAttempts = this.config.maxReconnectAttempts;
    this.reconnectDelay = this.config.reconnectDelay;
    this.heartbeatInterval = this.config.heartbeatInterval;
  }

  // EVENTOS
  on(event: RealTimeEvent, listener: RealTimeListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);

    }
    this.listeners.get(event)?.push(listener);

  }

  off(event: RealTimeEvent, listener?: RealTimeListener): void {
    if (!listener) {
      this.listeners.delete(event);

      return;
    }
    const listeners = this.listeners.get(event);

    if (listeners) {
      const index = listeners.indexOf(listener);

      if (index > -1) {
        listeners.splice(index, 1);

      } }

  private emit(event: RealTimeEvent, data?: string): void {
    const listeners = this.listeners.get(event);

    if (listeners) {
      listeners.forEach(listener => listener(data));

    } // INICIALIZAÇÃO
  async initialize(userId?: string, authToken?: string): Promise<void> {
    if (this.isConnected) return;

    try {
      if (!this.config.websocketEnabled) {
        this.isConnected = true;
        this.emit('connected');

        return;
      }

      // Implementação real do Echo seria aqui
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');

      this.startHeartbeat();

    } catch (error) {
      this.emit('error', error);

      this.scheduleReconnect();

    } // CANAIS
  async subscribeToChannel(channelName: string, events: ChannelEvents = {}): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Not connected to real-time service');

    }

    if (this.subscribedChannels.has(channelName)) {
      return;
    }

    const channelInfo: ChannelInfo = {
      name: channelName,
      type: channelName.startsWith('private-') ? 'private' : 'public',
      subscribedAt: new Date().toISOString(),
      events: Object.keys(events)};

    this.subscribedChannels.set(channelName, channelInfo);

    this.stats.channelsSubscribed++;
    this.emit('channel-subscribed', channelInfo);

  }

  async unsubscribeFromChannel(channelName: string): Promise<void> {
    if (!this.subscribedChannels.has(channelName)) {
      return;
    }

    this.subscribedChannels.delete(channelName);

    this.stats.channelsSubscribed--;
    this.emit('channel-unsubscribed', { name: channelName });

  }

  // PRESENCE
  async updatePresence(status: PresenceData['status'], metadata?: Record<string, any>): Promise<void> {
    this.presenceData = {
      status,
      lastSeen: new Date().toISOString(),
      metadata};

    this.emit('presence-updated', this.presenceData);

  }

  // CONEXÃO
  async connect(): Promise<void> {
    await this.initialize();

  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    this.stopHeartbeat();

    this.subscribedChannels.clear();

    this.isConnected = false;
    this.emit('disconnected');

  }

  async reconnect(): Promise<void> {
    await this.disconnect();

    await this.connect();

  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('max-reconnect-attempts-reached');

      return;
    }

    this.reconnectAttempts++;
    this.stats.reconnectAttempts++;

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      this.emit('reconnecting', { attempt: this.reconnectAttempts });

      this.initialize();

    }, delay);

  }

  // HEARTBEAT
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      this.stopHeartbeat();

    }

    this.heartbeatInterval = window.setInterval(() => {
      if (this.isConnected) {
        this.emit('heartbeat');

        this.stats.lastActivity = new Date().toISOString();

      } , this.config.heartbeatInterval);

  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);

      this.heartbeatInterval = null;
    } // GETTERS
  getConnectionStatus(): ConnectionStatus {
    return {
      connected: this.isConnected,
      reconnecting: this.reconnectAttempts > 0,
      reconnectAttempts: this.reconnectAttempts};

  }

  getSubscribedChannels(): ChannelInfo[] {
    return Array.from(this.subscribedChannels.values());

  }

  getPresenceData(): PresenceData {
    return { ...this.presenceData};

  }

  getStats(): RealTimeStats {
    return { ...this.stats};

  }

  isServiceConnected(): boolean {
    return this.isConnected;
  }

  // EVENTOS ESPECÍFICOS
  onAuraNotification(handler: EventHandler): void {
    this.on('aura-notification', handler);

  }

  onLeadCaptured(handler: EventHandler): void {
    this.on('lead-captured', handler);

  }

  onWorkflowCompleted(handler: EventHandler): void {
    this.on('workflow-completed', handler);

  }

  onCampaignStatusChanged(handler: EventHandler): void {
    this.on('campaign-status-changed', handler);

  }

  onSystemNotification(handler: EventHandler): void {
    this.on('system-notification', handler);

  }

  // LIMPEZA
  destroy(): void {
    this.disconnect();

    this.listeners.clear();

    this.subscribedChannels.clear();

  } // Instância singleton
const realTimeService = new RealTimeService();

export { RealTimeService, realTimeService };

export default realTimeService;
