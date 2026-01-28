import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { userNotificationsService } from '../services/userNotificationsService';
import { User } from '../types/userTypes';
import type {
  Notification,
  NotificationSearchParams,
  NotificationPaginatedResponse,
  CreateNotificationData,
  NotificationStats,
  NotificationSettings,
  NotificationTemplate,
  BulkNotificationData,
  BulkNotificationResult
} from '../services/userNotificationsService';

interface UserNotificationsState {
  // Estado das notificações
  notifications: Notification[];
  unreadNotifications: Notification[];
  
  // Estado de paginação
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Estado de filtros
  filters: NotificationSearchParams;
  
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  
  // Estado de operações
  sending: boolean;
  marking: boolean;
  archiving: boolean;
  deleting: boolean;
  
  // Estado de contadores
  unreadCount: number;
  
  // Estado de estatísticas
  notificationStats: NotificationStats | null;
  
  // Estado de configurações
  notificationSettings: NotificationSettings | null;
  
  // Estado de templates
  notificationTemplates: NotificationTemplate[];
  
  // Estado de notificações agendadas
  scheduledNotifications: Notification[];
}

interface UserNotificationsActions {
  // Ações de busca e listagem
  fetchNotifications: (params?: NotificationSearchParams) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  searchNotifications: (query: string) => Promise<void>;
  
  // Ações de envio
  sendNotification: (data: CreateNotificationData) => Promise<Notification>;
  sendTemplateNotification: (templateId: string, userId: string, variables?: Record<string, any>) => Promise<Notification>;
  sendBulkNotification: (data: BulkNotificationData) => Promise<BulkNotificationResult>;
  scheduleNotification: (data: CreateNotificationData) => Promise<Notification>;
  
  // Ações de busca específica
  getUserNotifications: (userId: string, params?: Omit<NotificationSearchParams, 'user_id'>) => Promise<void>;
  getUnreadNotifications: (userId: string) => Promise<void>;
  getScheduledNotifications: (params?: {
    user_id?: string;
    date_from?: string;
    date_to?: string;
  }) => Promise<void>;
  
  // Ações de marcação
  markAsRead: (notificationId: string) => Promise<Notification>;
  markMultipleAsRead: (notificationIds: string[]) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  
  // Ações de arquivamento
  archiveNotification: (notificationId: string) => Promise<Notification>;
  unarchiveNotification: (notificationId: string) => Promise<Notification>;
  
  // Ações de remoção
  deleteNotification: (notificationId: string) => Promise<void>;
  cancelScheduledNotification: (notificationId: string) => Promise<void>;
  
  // Ações de contadores
  getUnreadCount: (userId: string) => Promise<void>;
  
  // Ações de estatísticas
  fetchNotificationStats: (params?: {
    user_id?: string;
    date_from?: string;
    date_to?: string;
  }) => Promise<void>;
  
  // Ações de configurações
  fetchNotificationSettings: (userId: string) => Promise<void>;
  updateNotificationSettings: (userId: string, settings: NotificationSettings) => Promise<NotificationSettings>;
  
  // Ações de templates
  fetchNotificationTemplates: () => Promise<void>;
  
  // Ações de filtros
  setFilters: (filters: Partial<NotificationSearchParams>) => void;
  clearFilters: () => void;
  
  // Ações de paginação
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // Ações de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Ações de limpeza
  clearNotifications: () => void;
  clearAllData: () => void;
}

type UserNotificationsStore = UserNotificationsState & UserNotificationsActions;

const initialState: UserNotificationsState = {
  notifications: [],
  unreadNotifications: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {},
  loading: false,
  error: null,
  sending: false,
  marking: false,
  archiving: false,
  deleting: false,
  unreadCount: 0,
  notificationStats: null,
  notificationSettings: null,
  notificationTemplates: [],
  scheduledNotifications: []
};

export const useUserNotifications = create<UserNotificationsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Ações de busca e listagem
        fetchNotifications: async (params?: NotificationSearchParams) => {
          try {
            set({ loading: true, error: null });
            
            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params };
            
            const response: NotificationPaginatedResponse = await userNotificationsService.getNotifications(searchParams);
            
            set({
              notifications: response.data,
              pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.total_pages
              },
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar notificações',
              loading: false
            });
          }
        },

        refreshNotifications: async () => {
          const { fetchNotifications, filters, pagination } = get();
          await fetchNotifications({
            ...filters,
            page: pagination.page,
            limit: pagination.limit
          });
        },

        searchNotifications: async (query: string) => {
          const { fetchNotifications } = get();
          await fetchNotifications({ search: query });
        },

        // Ações de envio
        sendNotification: async (data: CreateNotificationData) => {
          try {
            set({ sending: true, error: null });
            
            const notification = await userNotificationsService.sendNotification(data);
            
            set((state) => ({
              notifications: [notification, ...state.notifications],
              sending: false
            }));
            
            return notification;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao enviar notificação',
              sending: false
            });
            throw error;
          }
        },

        sendTemplateNotification: async (templateId: string, userId: string, variables: Record<string, any> = {}) => {
          try {
            set({ sending: true, error: null });
            
            const notification = await userNotificationsService.sendTemplateNotification(templateId, userId, variables);
            
            set((state) => ({
              notifications: [notification, ...state.notifications],
              sending: false
            }));
            
            return notification;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao enviar notificação template',
              sending: false
            });
            throw error;
          }
        },

        sendBulkNotification: async (data: BulkNotificationData) => {
          try {
            set({ sending: true, error: null });
            
            const result = await userNotificationsService.sendBulkNotification(data);
            
            set({ sending: false });
            return result;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao enviar notificação em lote',
              sending: false
            });
            throw error;
          }
        },

        scheduleNotification: async (data: CreateNotificationData) => {
          try {
            set({ sending: true, error: null });
            
            const notification = await userNotificationsService.scheduleNotification(data);
            
            set((state) => ({
              scheduledNotifications: [notification, ...state.scheduledNotifications],
              sending: false
            }));
            
            return notification;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao agendar notificação',
              sending: false
            });
            throw error;
          }
        },

        // Ações de busca específica
        getUserNotifications: async (userId: string, params?: Omit<NotificationSearchParams, 'user_id'>) => {
          try {
            set({ loading: true, error: null });
            
            const response = await userNotificationsService.getUserNotifications(userId, params);
            
            set({
              notifications: response.data,
              pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.total_pages
              },
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar notificações do usuário',
              loading: false
            });
          }
        },

        getUnreadNotifications: async (userId: string) => {
          try {
            set({ loading: true, error: null });
            
            const notifications = await userNotificationsService.getUnreadNotifications(userId);
            
            set({
              unreadNotifications: notifications,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar notificações não lidas',
              loading: false
            });
          }
        },

        getScheduledNotifications: async (params?: {
          user_id?: string;
          date_from?: string;
          date_to?: string;
        }) => {
          try {
            set({ loading: true, error: null });
            
            const notifications = await userNotificationsService.getScheduledNotifications(params);
            
            set({
              scheduledNotifications: notifications,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar notificações agendadas',
              loading: false
            });
          }
        },

        // Ações de marcação
        markAsRead: async (notificationId: string) => {
          try {
            set({ marking: true, error: null });
            
            const notification = await userNotificationsService.markAsRead(notificationId);
            
            set((state) => ({
              notifications: state.notifications.map(n =>
                n.id === notificationId ? notification : n
              ),
              unreadNotifications: state.unreadNotifications.filter(n => n.id !== notificationId),
              unreadCount: Math.max(0, state.unreadCount - 1),
              marking: false
            }));
            
            return notification;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao marcar notificação como lida',
              marking: false
            });
            throw error;
          }
        },

        markMultipleAsRead: async (notificationIds: string[]) => {
          try {
            set({ marking: true, error: null });
            
            await userNotificationsService.markMultipleAsRead(notificationIds);
            
            set((state) => ({
              notifications: state.notifications.map(n =>
                notificationIds.includes(n.id) ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
              ),
              unreadNotifications: state.unreadNotifications.filter(n => !notificationIds.includes(n.id)),
              unreadCount: Math.max(0, state.unreadCount - notificationIds.length),
              marking: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao marcar múltiplas notificações como lidas',
              marking: false
            });
            throw error;
          }
        },

        markAllAsRead: async (userId: string) => {
          try {
            set({ marking: true, error: null });
            
            await userNotificationsService.markAllAsRead(userId);
            
            set((state) => ({
              notifications: state.notifications.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })),
              unreadNotifications: [],
              unreadCount: 0,
              marking: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao marcar todas as notificações como lidas',
              marking: false
            });
            throw error;
          }
        },

        // Ações de arquivamento
        archiveNotification: async (notificationId: string) => {
          try {
            set({ archiving: true, error: null });
            
            const notification = await userNotificationsService.archiveNotification(notificationId);
            
            set((state) => ({
              notifications: state.notifications.map(n =>
                n.id === notificationId ? notification : n
              ),
              archiving: false
            }));
            
            return notification;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao arquivar notificação',
              archiving: false
            });
            throw error;
          }
        },

        unarchiveNotification: async (notificationId: string) => {
          try {
            set({ archiving: true, error: null });
            
            const notification = await userNotificationsService.unarchiveNotification(notificationId);
            
            set((state) => ({
              notifications: state.notifications.map(n =>
                n.id === notificationId ? notification : n
              ),
              archiving: false
            }));
            
            return notification;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao desarquivar notificação',
              archiving: false
            });
            throw error;
          }
        },

        // Ações de remoção
        deleteNotification: async (notificationId: string) => {
          try {
            set({ deleting: true, error: null });
            
            await userNotificationsService.deleteNotification(notificationId);
            
            set((state) => ({
              notifications: state.notifications.filter(n => n.id !== notificationId),
              unreadNotifications: state.unreadNotifications.filter(n => n.id !== notificationId),
              scheduledNotifications: state.scheduledNotifications.filter(n => n.id !== notificationId),
              deleting: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao remover notificação',
              deleting: false
            });
            throw error;
          }
        },

        cancelScheduledNotification: async (notificationId: string) => {
          try {
            set({ deleting: true, error: null });
            
            await userNotificationsService.cancelScheduledNotification(notificationId);
            
            set((state) => ({
              scheduledNotifications: state.scheduledNotifications.filter(n => n.id !== notificationId),
              deleting: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao cancelar notificação agendada',
              deleting: false
            });
            throw error;
          }
        },

        // Ações de contadores
        getUnreadCount: async (userId: string) => {
          try {
            const count = await userNotificationsService.getUnreadCount(userId);
            set({ unreadCount: count });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao obter contagem de notificações não lidas'
            });
          }
        },

        // Ações de estatísticas
        fetchNotificationStats: async (params?: {
          user_id?: string;
          date_from?: string;
          date_to?: string;
        }) => {
          try {
            const stats = await userNotificationsService.getNotificationStats(params);
            set({ notificationStats: stats });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas de notificações'
            });
          }
        },

        // Ações de configurações
        fetchNotificationSettings: async (userId: string) => {
          try {
            const settings = await userNotificationsService.getNotificationSettings(userId);
            set({ notificationSettings: settings });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar configurações de notificações'
            });
          }
        },

        updateNotificationSettings: async (userId: string, settings: NotificationSettings) => {
          try {
            set({ updating: true, error: null });
            
            const updatedSettings = await userNotificationsService.updateNotificationSettings(userId, settings);
            
            set({
              notificationSettings: updatedSettings,
              updating: false
            });
            
            return updatedSettings;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atualizar configurações de notificações',
              updating: false
            });
            throw error;
          }
        },

        // Ações de templates
        fetchNotificationTemplates: async () => {
          try {
            set({ loading: true, error: null });
            
            const templates = await userNotificationsService.getNotificationTemplates();
            
            set({
              notificationTemplates: templates,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar templates de notificações',
              loading: false
            });
          }
        },

        // Ações de filtros
        setFilters: (filters: Partial<NotificationSearchParams>) => {
          set((state) => ({
            filters: { ...state.filters, ...filters },
            pagination: { ...state.pagination, page: 1 } // Reset para primeira página
          }));
        },

        clearFilters: () => {
          set({ filters: {}, pagination: { ...get().pagination, page: 1 } });
        },

        // Ações de paginação
        setPage: (page: number) => {
          set((state) => ({
            pagination: { ...state.pagination, page }
          }));
        },

        setLimit: (limit: number) => {
          set((state) => ({
            pagination: { ...state.pagination, limit, page: 1 } // Reset para primeira página
          }));
        },

        // Ações de estado
        setLoading: (loading: boolean) => {
          set({ loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        // Ações de limpeza
        clearNotifications: () => {
          set({
            notifications: [],
            unreadNotifications: [],
            scheduledNotifications: []
          });
        },

        clearAllData: () => {
          set({
            ...initialState
          });
        }
      }),
      {
        name: 'users-notifications-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
          notificationSettings: state.notificationSettings
        })
      }
    ),
    {
      name: 'UsersNotificationsStore'
    }
  )
);

export default useUserNotifications;
