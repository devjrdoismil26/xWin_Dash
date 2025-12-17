import { apiClient } from '@/services';
import { User, UserNotification } from '../types/user.types';

// Cache para notificações
const notificationsCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 1 * 60 * 1000; // 1 minuto (notificações mudam muito frequentemente)

// Interface para notificação
export interface Notification {
  id: string;
  user_id: string;
  user: User;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  is_archived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: ('email' | 'push' | 'sms' | 'in_app')[];
  scheduled_at?: string;
  sent_at?: string;
  read_at?: string;
  archived_at?: string;
  created_at: string;
  updated_at: string; }

// Interface para parâmetros de busca de notificações
export interface NotificationSearchParams {
  user_id?: string;
  type?: string;
  priority?: string;
  is_read?: boolean;
  is_archived?: boolean;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// Interface para resposta paginada de notificações
export interface NotificationPaginatedResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  total_pages: number; }

// Interface para criação de notificação
export interface CreateNotificationData {
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  channels?: ('email' | 'push' | 'sms' | 'in_app')[];
  scheduled_at?: string;
  [key: string]: unknown; }

// Interface para estatísticas de notificações
export interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  read_notifications: number;
  archived_notifications: number;
  notifications_by_type: Record<string, number>;
  notifications_by_priority: Record<string, number>;
  notifications_today: number;
  notifications_this_week: number;
  notifications_this_month: number;
  average_read_time: number;
  // em minutos
  most_common_types: Array<{
    type: string;
  count: number; }>;
}

// Interface para configurações de notificação
export interface NotificationSettings {
  email_notifications: {
    enabled: boolean;
  types: string[];
  frequency: 'immediate' | 'daily' | 'weekly';
  [key: string]: unknown; };

  push_notifications: {
    enabled: boolean;
    types: string[];
    quiet_hours: {
      enabled: boolean;
      start: string; // HH:MM
      end: string; // HH:MM};
};

  sms_notifications: {
    enabled: boolean;
    types: string[];
    phone_number?: string;};

  in_app_notifications: {
    enabled: boolean;
    types: string[];
    sound_enabled: boolean;};

}

// Interface para template de notificação
export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  title_template: string;
  message_template: string;
  channels: string[];
  priority: string;
  is_active: boolean;
  variables: string[];
  created_at: string;
  updated_at: string; }

// Interface para envio em lote
export interface BulkNotificationData {
  user_ids: string[];
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  channels?: ('email' | 'push' | 'sms' | 'in_app')[];
  scheduled_at?: string;
  [key: string]: unknown; }

// Interface para resultado de envio em lote
export interface BulkNotificationResult {
  success: boolean;
  total_sent: number;
  total_failed: number;
  errors: Array<{
    user_id: string;
  error: string; }>;
  results: Array<{
    user_id: string;
    notification_id: string;
    success: boolean;
  }>;
}

/**
 * Service para gerenciamento de notificações de usuário
 * Responsável por envio, busca, configurações e estatísticas de notificações
 */
class UserNotificationsService {
  private baseUrl = '/api/users/notifications';

  /**
   * Busca notificações com filtros
   */
  async getNotifications(params: NotificationSearchParams = {}): Promise<NotificationPaginatedResponse> {
    try {
      const cacheKey = `notifications_${JSON.stringify(params)}`;
      const cached = notificationsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl, { params });

      const result = {
        data: (response as any).data.data || (response as any).data,
        total: (response as any).data.total || (response as any).data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || (response as any).data.length) / (params.limit || 10))};

      // Cache do resultado
      notificationsCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      throw new Error('Falha ao carregar notificações');

    } /**
   * Busca uma notificação específica por ID
   */
  async getNotificationById(id: string): Promise<Notification> {
    try {
      const cacheKey = `notification_${id}`;
      const cached = notificationsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);

      // Cache do resultado
      notificationsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar notificação');

    } /**
   * Cria e envia uma nova notificação
   */
  async sendNotification(data: CreateNotificationData): Promise<Notification> {
    try {
      // Validação básica
      this.validateNotificationData(data);

      const response = await apiClient.post(this.baseUrl, data);

      // Limpar cache relacionado
      this.clearNotificationsCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao enviar notificação');

    } /**
   * Obtém notificações de um usuário específico
   */
  async getUserNotifications(userId: string, params: Omit<NotificationSearchParams, 'user_id'> = {}): Promise<NotificationPaginatedResponse> {
    try {
      return await this.getNotifications({ ...params, user_id: userId });

    } catch (error) {
      throw new Error('Falha ao carregar notificações do usuário');

    } /**
   * Obtém notificações não lidas de um usuário
   */
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const result = await this.getUserNotifications(userId, {
        is_read: false,
        is_archived: false,
        limit: 100
      });

      return result.data;
    } catch (error) {
      throw new Error('Falha ao carregar notificações não lidas');

    } /**
   * Marca notificação como lida
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${notificationId}/read`);

      // Limpar cache relacionado
      this.clearNotificationsCache();

      notificationsCache.delete(`notification_${notificationId}`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao marcar notificação como lida');

    } /**
   * Marca múltiplas notificações como lidas
   */
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    try {
      await apiClient.patch(`${this.baseUrl}/mark-read`, {
        notification_ids: notificationIds
      });

      // Limpar cache relacionado
      this.clearNotificationsCache();

    } catch (error) {
      throw new Error('Falha ao marcar notificações como lidas');

    } /**
   * Marca todas as notificações de um usuário como lidas
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      await apiClient.patch(`${this.baseUrl}/mark-all-read`, {
        user_id: userId
      });

      // Limpar cache relacionado
      this.clearNotificationsCache();

    } catch (error) {
      throw new Error('Falha ao marcar todas as notificações como lidas');

    } /**
   * Arquivar notificação
   */
  async archiveNotification(notificationId: string): Promise<Notification> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${notificationId}/archive`);

      // Limpar cache relacionado
      this.clearNotificationsCache();

      notificationsCache.delete(`notification_${notificationId}`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao arquivar notificação');

    } /**
   * Desarquivar notificação
   */
  async unarchiveNotification(notificationId: string): Promise<Notification> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${notificationId}/unarchive`);

      // Limpar cache relacionado
      this.clearNotificationsCache();

      notificationsCache.delete(`notification_${notificationId}`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao desarquivar notificação');

    } /**
   * Remove notificação
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${notificationId}`);

      // Limpar cache relacionado
      this.clearNotificationsCache();

      notificationsCache.delete(`notification_${notificationId}`);

    } catch (error) {
      throw new Error('Falha ao remover notificação');

    } /**
   * Obtém contagem de notificações não lidas
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const cacheKey = `unread_count_${userId}`;
      const cached = notificationsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/unread-count`, {
        params: { user_id: userId } );

      // Cache do resultado
      notificationsCache.set(cacheKey, { data: (response as any).data.count, timestamp: Date.now() });

      return (response as any).data.count;
    } catch (error) {
      throw new Error('Falha ao obter contagem de notificações não lidas');

    } /**
   * Obtém estatísticas de notificações
   */
  async getNotificationStats(params?: {
    user_id?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<NotificationStats> {
    try {
      const cacheKey = `notification_stats_${JSON.stringify(params || {})}`;
      const cached = notificationsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/stats`, { params });

      // Cache do resultado
      notificationsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter estatísticas de notificações');

    } /**
   * Obtém configurações de notificação de um usuário
   */
  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    try {
      const cacheKey = `notification_settings_${userId}`;
      const cached = notificationsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/settings/${userId}`);

      // Cache do resultado
      notificationsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao obter configurações de notificação');

    } /**
   * Atualiza configurações de notificação de um usuário
   */
  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/settings/${userId}`, settings);

      // Limpar cache relacionado
      notificationsCache.delete(`notification_settings_${userId}`);

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao atualizar configurações de notificação');

    } /**
   * Obtém templates de notificação
   */
  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    try {
      const cacheKey = 'notification_templates';
      const cached = notificationsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/templates`);

      // Cache do resultado
      notificationsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao carregar templates de notificação');

    } /**
   * Envia notificação usando template
   */
  async sendTemplateNotification(templateId: string, userId: string, variables: Record<string, any> = {}): Promise<Notification> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/send-template`, {
        template_id: templateId,
        user_id: userId,
        variables
      });

      // Limpar cache relacionado
      this.clearNotificationsCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao enviar notificação template');

    } /**
   * Envia notificação em lote
   */
  async sendBulkNotification(data: BulkNotificationData): Promise<BulkNotificationResult> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/bulk-send`, data);

      // Limpar cache relacionado
      this.clearNotificationsCache();

      return (response as any).data as any;
    } catch (error) {
      throw new Error('Falha ao enviar notificação em lote');

    } /**
   * Agenda notificação
   */
  async scheduleNotification(data: CreateNotificationData): Promise<Notification> {
    try {
      if (!data.scheduled_at) {
        throw new Error('Data de agendamento é obrigatória');

      }

      return await this.sendNotification(data);

    } catch (error) {
      throw new Error('Falha ao agendar notificação');

    } /**
   * Cancela notificação agendada
   */
  async cancelScheduledNotification(notificationId: string): Promise<void> {
    try {
      await apiClient.patch(`${this.baseUrl}/${notificationId}/cancel`);

      // Limpar cache relacionado
      this.clearNotificationsCache();

      notificationsCache.delete(`notification_${notificationId}`);

    } catch (error) {
      throw new Error('Falha ao cancelar notificação agendada');

    } /**
   * Obtém notificações agendadas
   */
  async getScheduledNotifications(params: {
    user_id?: string;
    date_from?: string;
    date_to?: string;
  } = {}): Promise<Notification[]> {
    try {
      const result = await this.getNotifications({
        ...params,
        // Assumindo que há um filtro para notificações agendadas
        limit: 1000
      });

      // Filtrar notificações agendadas
      return result.data.filter(notification => notification.scheduled_at);

    } catch (error) {
      throw new Error('Falha ao buscar notificações agendadas');

    } /**
   * Valida dados básicos da notificação
   */
  private validateNotificationData(data: CreateNotificationData): void {
    if (!data.user_id) {
      throw new Error('ID do usuário é obrigatório');

    }

    if (!data.type) {
      throw new Error('Tipo da notificação é obrigatório');

    }

    if (!data.title || (data as any).title.trim().length < 1) {
      throw new Error('Título da notificação é obrigatório');

    }

    if (!data.message || (data as any).message.trim().length < 1) {
      throw new Error('Mensagem da notificação é obrigatória');

    }

    if (data.title && (data as any).title.length > 200) {
      throw new Error('Título deve ter no máximo 200 caracteres');

    }

    if (data.message && (data as any).message.length > 1000) {
      throw new Error('Mensagem deve ter no máximo 1000 caracteres');

    }

    if (data.scheduled_at && new Date(data.scheduled_at) <= new Date()) {
      throw new Error('Data de agendamento deve ser no futuro');

    } /**
   * Limpa cache de notificações
   */
  private clearNotificationsCache(): void {
    notificationsCache.clear();

  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of notificationsCache.keys()) {
        if (key.includes(pattern)) {
          notificationsCache.delete(key);

        } } else {
      notificationsCache.clear();

    } /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: notificationsCache.size,
      keys: Array.from(notificationsCache.keys())};

  } // Instância singleton
export const userNotificationsService = new UserNotificationsService();

export default userNotificationsService;
