/**
 * Store do módulo Users usando Zustand com TypeScript
 * Gerenciamento de estado global para o módulo Users
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import usersService from '../services/usersService';
import {
  User,
  UserProfile,
  UserRole,
  UserActivity,
  UserNotification,
  UserStats,
  SystemStats,
  UserFilters,
  PaginationMeta
} from '../types/userTypes';

// Interface para o estado do store
interface UsersState {
  // Estado
  users: User[];
  currentUser: User | null;
  profile: UserProfile | null;
  roles: UserRole[];
  notifications: UserNotification[];
  userStats: UserStats | null;
  systemStats: SystemStats | null;
  currentView: string;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

// Interface para as ações do store
interface UsersActions {
  // Ações para gerenciamento de usuários
  fetchUsers: (filters?: UserFilters) => Promise<void>;
  getUserById: (userId: string) => Promise<User>;
  createUser: (userData: Partial<User>) => Promise<User>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<User>;

  // Ações para perfil
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile>;
  updatePassword: (passwordData: { current_password: string; new_password: string; confirm_password: string }) => Promise<any>;
  uploadAvatar: (file: File) => Promise<{ avatar: string }>;

  // Ações para roles
  fetchRoles: () => Promise<void>;
  assignRole: (userId: string, roleId: string) => Promise<any>;
  removeRole: (userId: string, roleId: string) => Promise<any>;
  getUserRoles: (userId: string) => Promise<UserRole[]>;

  // Ações para atividades
  getUserActivity: (userId: string, filters?: Record<string, any>) => Promise<UserActivity[]>;
  getActivityStats: (userId: string, filters?: Record<string, any>) => Promise<any>;

  // Ações para notificações
  fetchNotifications: (filters?: Record<string, any>) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<any>;
  markAllNotificationsAsRead: () => Promise<any>;
  deleteNotification: (notificationId: string) => Promise<void>;

  // Ações para estatísticas
  fetchUserStats: (filters?: Record<string, any>) => Promise<void>;
  fetchSystemStats: () => Promise<void>;

  // Ações para busca e filtros
  searchUsers: (query: string, filters?: UserFilters) => Promise<void>;
  getUsersByRole: (roleId: string, filters?: UserFilters) => Promise<void>;
  getUsersByStatus: (status: string, filters?: UserFilters) => Promise<void>;

  // Ações para testes de integração
  testConnection: () => Promise<{ success: boolean; error?: string }>;
  testUserManagement: () => Promise<{ success: boolean; error?: string }>;
  testProfileManagement: () => Promise<{ success: boolean; error?: string }>;
  testRolesManagement: () => Promise<{ success: boolean; error?: string }>;
  testNotificationsSystem: () => Promise<{ success: boolean; error?: string }>;

  // Utilitários
  getTotalUsers: () => number;
  getActiveUsers: () => User[];
  getInactiveUsers: () => User[];
  getUsersByRole: () => Record<string, number>;
  getRecentUsers: (limit?: number) => User[];
  getUnreadNotifications: () => UserNotification[];
  getNotificationsByType: () => Record<string, number>;

  // Limpar estado
  clearError: () => void;
  setCurrentView: (view: string) => void;
}

// Tipo combinado para o store
type UsersStore = UsersState & UsersActions;

// Estado inicial
const initialState: UsersState = {
  users: [],
  currentUser: null,
  profile: null,
  roles: [],
  notifications: [],
  userStats: null,
  systemStats: null,
  currentView: 'users',
  loading: false,
  error: null,
  pagination: null,
};

// Store principal
const useUsersStore = create<UsersStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Ações para gerenciamento de usuários
      fetchUsers: async (filters: UserFilters = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getUsers(filters);
          set({ 
            users: data.data || data,
            pagination: data.meta || null,
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar usuários', 
            loading: false 
          });
        }
      },

      getUserById: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getUserById(userId);
          set({ currentUser: data, loading: false });
          return data;
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar usuário', 
            loading: false 
          });
          throw error;
        }
      },

      createUser: async (userData: Partial<User>) => {
        set({ loading: true, error: null });
        try {
          const user = await usersService.createUser(userData);
          set(state => ({
            users: [...state.users, user],
            loading: false
          }));
          return user;
        } catch (error: any) {
          set({ 
            error: 'Erro ao criar usuário', 
            loading: false 
          });
          throw error;
        }
      },

      updateUser: async (userId: string, userData: Partial<User>) => {
        set({ loading: true, error: null });
        try {
          const user = await usersService.updateUser(userId, userData);
          set(state => ({
            users: state.users.map(u => u.id === userId ? user : u),
            loading: false
          }));
          return user;
        } catch (error: any) {
          set({ 
            error: 'Erro ao atualizar usuário', 
            loading: false 
          });
          throw error;
        }
      },

      deleteUser: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          await usersService.deleteUser(userId);
          set(state => ({
            users: state.users.filter(u => u.id !== userId),
            loading: false
          }));
        } catch (error: any) {
          set({ 
            error: 'Erro ao deletar usuário', 
            loading: false 
          });
          throw error;
        }
      },

      toggleUserStatus: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const user = await usersService.toggleUserStatus(userId);
          set(state => ({
            users: state.users.map(u => u.id === userId ? user : u),
            loading: false
          }));
          return user;
        } catch (error: any) {
          set({ 
            error: 'Erro ao alterar status do usuário', 
            loading: false 
          });
          throw error;
        }
      },

      // Ações para perfil
      fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getProfile();
          set({ profile: data, loading: false });
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar perfil', 
            loading: false 
          });
        }
      },

      updateProfile: async (profileData: Partial<UserProfile>) => {
        set({ loading: true, error: null });
        try {
          const profile = await usersService.updateProfile(profileData);
          set({ profile, loading: false });
          return profile;
        } catch (error: any) {
          set({ 
            error: 'Erro ao atualizar perfil', 
            loading: false 
          });
          throw error;
        }
      },

      updatePassword: async (passwordData: { current_password: string; new_password: string; confirm_password: string }) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.updatePassword(passwordData);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ 
            error: 'Erro ao atualizar senha', 
            loading: false 
          });
          throw error;
        }
      },

      uploadAvatar: async (file: File) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.uploadAvatar(file);
          set(state => ({
            profile: state.profile ? { ...state.profile, avatar: data.avatar } : null,
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ 
            error: 'Erro ao fazer upload do avatar', 
            loading: false 
          });
          throw error;
        }
      },

      // Ações para roles
      fetchRoles: async () => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getRoles();
          set({ roles: data, loading: false });
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar roles', 
            loading: false 
          });
        }
      },

      assignRole: async (userId: string, roleId: string) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.assignRole(userId, roleId);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ 
            error: 'Erro ao atribuir role', 
            loading: false 
          });
          throw error;
        }
      },

      removeRole: async (userId: string, roleId: string) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.removeRole(userId, roleId);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ 
            error: 'Erro ao remover role', 
            loading: false 
          });
          throw error;
        }
      },

      getUserRoles: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getUserRoles(userId);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar roles do usuário', 
            loading: false 
          });
          throw error;
        }
      },

      // Ações para atividades
      getUserActivity: async (userId: string, filters: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getUserActivity(userId, filters);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar atividades do usuário', 
            loading: false 
          });
          throw error;
        }
      },

      getActivityStats: async (userId: string, filters: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getActivityStats(userId, filters);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar estatísticas de atividade', 
            loading: false 
          });
          throw error;
        }
      },

      // Ações para notificações
      fetchNotifications: async (filters: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getNotifications(filters);
          set({ 
            notifications: data.data || data,
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar notificações', 
            loading: false 
          });
        }
      },

      markNotificationAsRead: async (notificationId: string) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.markNotificationAsRead(notificationId);
          set(state => ({
            notifications: state.notifications.map(n => 
              n.id === notificationId ? { ...n, read: true } : n
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ 
            error: 'Erro ao marcar notificação como lida', 
            loading: false 
          });
          throw error;
        }
      },

      markAllNotificationsAsRead: async () => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.markAllNotificationsAsRead();
          set(state => ({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ 
            error: 'Erro ao marcar todas as notificações como lidas', 
            loading: false 
          });
          throw error;
        }
      },

      deleteNotification: async (notificationId: string) => {
        set({ loading: true, error: null });
        try {
          await usersService.deleteNotification(notificationId);
          set(state => ({
            notifications: state.notifications.filter(n => n.id !== notificationId),
            loading: false
          }));
        } catch (error: any) {
          set({ 
            error: 'Erro ao deletar notificação', 
            loading: false 
          });
          throw error;
        }
      },

      // Ações para estatísticas
      fetchUserStats: async (filters: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getUserStats(filters);
          set({ userStats: data, loading: false });
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar estatísticas de usuários', 
            loading: false 
          });
        }
      },

      fetchSystemStats: async () => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getSystemStats();
          set({ systemStats: data, loading: false });
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar estatísticas do sistema', 
            loading: false 
          });
        }
      },

      // Ações para busca e filtros
      searchUsers: async (query: string, filters: UserFilters = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.searchUsers(query, filters);
          set({ 
            users: data.data || data,
            pagination: data.meta || null,
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: 'Erro ao buscar usuários', 
            loading: false 
          });
        }
      },

      getUsersByRole: async (roleId: string, filters: UserFilters = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getUsersByRole(roleId, filters);
          set({ 
            users: data.data || data,
            pagination: data.meta || null,
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar usuários por role', 
            loading: false 
          });
        }
      },

      getUsersByStatus: async (status: string, filters: UserFilters = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await usersService.getUsersByStatus(status, filters);
          set({ 
            users: data.data || data,
            pagination: data.meta || null,
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: 'Erro ao carregar usuários por status', 
            loading: false 
          });
        }
      },

      // Ações para testes de integração
      testConnection: async () => {
        set({ loading: true, error: null });
        try {
          const result = await usersService.testConnection();
          set({ loading: false });
          return result;
        } catch (error: any) {
          set({ 
            error: 'Erro no teste de conexão', 
            loading: false 
          });
          throw error;
        }
      },

      testUserManagement: async () => {
        set({ loading: true, error: null });
        try {
          const result = await usersService.testUserManagement();
          set({ loading: false });
          return result;
        } catch (error: any) {
          set({ 
            error: 'Erro no teste de gerenciamento de usuários', 
            loading: false 
          });
          throw error;
        }
      },

      testProfileManagement: async () => {
        set({ loading: true, error: null });
        try {
          const result = await usersService.testProfileManagement();
          set({ loading: false });
          return result;
        } catch (error: any) {
          set({ 
            error: 'Erro no teste de gerenciamento de perfil', 
            loading: false 
          });
          throw error;
        }
      },

      testRolesManagement: async () => {
        set({ loading: true, error: null });
        try {
          const result = await usersService.testRolesManagement();
          set({ loading: false });
          return result;
        } catch (error: any) {
          set({ 
            error: 'Erro no teste de gerenciamento de roles', 
            loading: false 
          });
          throw error;
        }
      },

      testNotificationsSystem: async () => {
        set({ loading: true, error: null });
        try {
          const result = await usersService.testNotificationsSystem();
          set({ loading: false });
          return result;
        } catch (error: any) {
          set({ 
            error: 'Erro no teste de sistema de notificações', 
            loading: false 
          });
          throw error;
        }
      },

      // Utilitários
      getTotalUsers: () => {
        const { users } = get();
        return users.length;
      },

      getActiveUsers: () => {
        const { users } = get();
        return users.filter(user => user.status === 'active' || (user as any).is_active);
      },

      getInactiveUsers: () => {
        const { users } = get();
        return users.filter(user => user.status === 'inactive' || !(user as any).is_active);
      },


      getRecentUsers: (limit: number = 5) => {
        const { users } = get();
        return users
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, limit);
      },

      getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter(notification => !notification.read);
      },

      getNotificationsByType: () => {
        const { notifications } = get();
        const notificationsByType: Record<string, number> = {};
        notifications.forEach(notification => {
          const type = notification.type || 'info';
          notificationsByType[type] = (notificationsByType[type] || 0) + 1;
        });
        return notificationsByType;
      },

      // Limpar estado
      clearError: () => set({ error: null }),
      setCurrentView: (view: string) => set({ currentView: view }),
    }),
    {
      name: 'users-store'
    }
  )
);

export default useUsersStore;
