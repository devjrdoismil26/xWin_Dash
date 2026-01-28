import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { userActivityService } from '../services/userActivityService';
import { User } from '../types/userTypes';
import type {
  Activity,
  ActivitySearchParams,
  ActivityPaginatedResponse,
  CreateActivityData,
  ActivityStats,
  ActivityType,
  ActivityFilters,
  ActivityReport
} from '../services/userActivityService';

interface UserActivityState {
  // Estado das atividades
  activities: Activity[];
  recentActivities: Activity[];
  todayActivities: Activity[];
  
  // Estado de paginação
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Estado de filtros
  filters: ActivitySearchParams;
  
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  
  // Estado de operações
  logging: boolean;
  fetching: boolean;
  
  // Estado de estatísticas
  activityStats: ActivityStats | null;
  
  // Estado de tipos de atividade
  activityTypes: ActivityType[];
  
  // Estado de filtros avançados
  advancedFilters: ActivityFilters;
}

interface UserActivityActions {
  // Ações de busca e listagem
  fetchActivities: (params?: ActivitySearchParams) => Promise<void>;
  refreshActivities: () => Promise<void>;
  searchActivities: (query: string) => Promise<void>;
  
  // Ações de logging
  logActivity: (data: CreateActivityData) => Promise<Activity>;
  
  // Ações de busca específica
  getUserActivities: (userId: string, params?: Omit<ActivitySearchParams, 'user_id'>) => Promise<void>;
  getActivitiesByType: (type: string, params?: Omit<ActivitySearchParams, 'type'>) => Promise<void>;
  getActivitiesByAction: (action: string, params?: Omit<ActivitySearchParams, 'action'>) => Promise<void>;
  getRecentActivities: (limit?: number) => Promise<void>;
  getTodayActivities: () => Promise<void>;
  
  // Ações de estatísticas
  fetchActivityStats: (params?: { date_from?: string; date_to?: string; user_id?: string }) => Promise<void>;
  
  // Ações de tipos de atividade
  fetchActivityTypes: () => Promise<void>;
  
  // Ações de relatórios
  generateActivityReport: (params: {
    date_from: string;
    date_to: string;
    filters?: ActivityFilters;
  }) => Promise<ActivityReport>;
  
  // Ações de exportação
  exportActivities: (params?: ActivitySearchParams, format?: 'csv' | 'excel' | 'pdf') => Promise<Blob>;
  
  // Ações de limpeza
  cleanupOldActivities: (daysToKeep?: number) => Promise<{ deleted_count: number }>;
  
  // Ações de busca por localização/IP
  getActivitiesByLocation: (location: string) => Promise<Activity[]>;
  getActivitiesByIP: (ipAddress: string) => Promise<Activity[]>;
  getSecurityEvents: (params?: {
    severity?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }) => Promise<Activity[]>;
  
  // Ações de usuários mais ativos
  getMostActiveUsers: (limit?: number, params?: {
    date_from?: string;
    date_to?: string;
  }) => Promise<Array<{ user: User; activity_count: number }>>;
  
  // Ações de tendências
  getActivityTrends: (params: {
    period: 'day' | 'week' | 'month';
    date_from?: string;
    date_to?: string;
  }) => Promise<Array<{ date: string; count: number }>>;
  
  // Ações de filtros
  setFilters: (filters: Partial<ActivitySearchParams>) => void;
  clearFilters: () => void;
  setAdvancedFilters: (filters: Partial<ActivityFilters>) => void;
  clearAdvancedFilters: () => void;
  
  // Ações de paginação
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // Ações de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Ações de limpeza
  clearActivities: () => void;
  clearAllData: () => void;
}

type UserActivityStore = UserActivityState & UserActivityActions;

const initialState: UserActivityState = {
  activities: [],
  recentActivities: [],
  todayActivities: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {},
  loading: false,
  error: null,
  logging: false,
  fetching: false,
  activityStats: null,
  activityTypes: [],
  advancedFilters: {}
};

export const useUserActivity = create<UserActivityStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Ações de busca e listagem
        fetchActivities: async (params?: ActivitySearchParams) => {
          try {
            set({ fetching: true, error: null });
            
            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params };
            
            const response: ActivityPaginatedResponse = await userActivityService.getActivities(searchParams);
            
            set({
              activities: response.data,
              pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.total_pages
              },
              fetching: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar atividades',
              fetching: false
            });
          }
        },

        refreshActivities: async () => {
          const { fetchActivities, filters, pagination } = get();
          await fetchActivities({
            ...filters,
            page: pagination.page,
            limit: pagination.limit
          });
        },

        searchActivities: async (query: string) => {
          const { fetchActivities } = get();
          await fetchActivities({ search: query });
        },

        // Ações de logging
        logActivity: async (data: CreateActivityData) => {
          try {
            set({ logging: true, error: null });
            
            const activity = await userActivityService.logActivity(data);
            
            set((state) => ({
              activities: [activity, ...state.activities],
              recentActivities: [activity, ...state.recentActivities.slice(0, 49)], // Manter apenas 50 mais recentes
              logging: false
            }));
            
            return activity;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao registrar atividade',
              logging: false
            });
            throw error;
          }
        },

        // Ações de busca específica
        getUserActivities: async (userId: string, params?: Omit<ActivitySearchParams, 'user_id'>) => {
          try {
            set({ fetching: true, error: null });
            
            const response = await userActivityService.getUserActivities(userId, params);
            
            set({
              activities: response.data,
              pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.total_pages
              },
              fetching: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar atividades do usuário',
              fetching: false
            });
          }
        },

        getActivitiesByType: async (type: string, params?: Omit<ActivitySearchParams, 'type'>) => {
          try {
            set({ fetching: true, error: null });
            
            const response = await userActivityService.getActivitiesByType(type, params);
            
            set({
              activities: response.data,
              pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.total_pages
              },
              fetching: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar atividades por tipo',
              fetching: false
            });
          }
        },

        getActivitiesByAction: async (action: string, params?: Omit<ActivitySearchParams, 'action'>) => {
          try {
            set({ fetching: true, error: null });
            
            const response = await userActivityService.getActivitiesByAction(action, params);
            
            set({
              activities: response.data,
              pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.total_pages
              },
              fetching: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar atividades por ação',
              fetching: false
            });
          }
        },

        getRecentActivities: async (limit: number = 50) => {
          try {
            set({ loading: true, error: null });
            
            const activities = await userActivityService.getRecentActivities(limit);
            
            set({
              recentActivities: activities,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar atividades recentes',
              loading: false
            });
          }
        },

        getTodayActivities: async () => {
          try {
            set({ loading: true, error: null });
            
            const activities = await userActivityService.getTodayActivities();
            
            set({
              todayActivities: activities,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar atividades de hoje',
              loading: false
            });
          }
        },

        // Ações de estatísticas
        fetchActivityStats: async (params?: { date_from?: string; date_to?: string; user_id?: string }) => {
          try {
            const stats = await userActivityService.getActivityStats(params);
            set({ activityStats: stats });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas de atividades'
            });
          }
        },

        // Ações de tipos de atividade
        fetchActivityTypes: async () => {
          try {
            set({ loading: true, error: null });
            
            const types = await userActivityService.getActivityTypes();
            
            set({
              activityTypes: types,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao carregar tipos de atividade',
              loading: false
            });
          }
        },

        // Ações de relatórios
        generateActivityReport: async (params: {
          date_from: string;
          date_to: string;
          filters?: ActivityFilters;
        }) => {
          try {
            const report = await userActivityService.generateActivityReport(params);
            return report;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao gerar relatório de atividades'
            });
            throw error;
          }
        },

        // Ações de exportação
        exportActivities: async (params?: ActivitySearchParams, format: 'csv' | 'excel' | 'pdf' = 'csv') => {
          try {
            const blob = await userActivityService.exportActivities(params, format);
            return blob;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao exportar atividades'
            });
            throw error;
          }
        },

        // Ações de limpeza
        cleanupOldActivities: async (daysToKeep: number = 90) => {
          try {
            const result = await userActivityService.cleanupOldActivities(daysToKeep);
            
            // Atualizar lista de atividades
            const { refreshActivities } = get();
            await refreshActivities();
            
            return result;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao limpar atividades antigas'
            });
            throw error;
          }
        },

        // Ações de busca por localização/IP
        getActivitiesByLocation: async (location: string) => {
          try {
            const activities = await userActivityService.getActivitiesByLocation(location);
            return activities;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar atividades por localização'
            });
            throw error;
          }
        },

        getActivitiesByIP: async (ipAddress: string) => {
          try {
            const activities = await userActivityService.getActivitiesByIP(ipAddress);
            return activities;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar atividades por IP'
            });
            throw error;
          }
        },

        getSecurityEvents: async (params?: {
          severity?: string;
          date_from?: string;
          date_to?: string;
          limit?: number;
        }) => {
          try {
            const events = await userActivityService.getSecurityEvents(params);
            return events;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar eventos de segurança'
            });
            throw error;
          }
        },

        // Ações de usuários mais ativos
        getMostActiveUsers: async (limit: number = 10, params?: {
          date_from?: string;
          date_to?: string;
        }) => {
          try {
            const users = await userActivityService.getMostActiveUsers(limit, params);
            return users;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar usuários mais ativos'
            });
            throw error;
          }
        },

        // Ações de tendências
        getActivityTrends: async (params: {
          period: 'day' | 'week' | 'month';
          date_from?: string;
          date_to?: string;
        }) => {
          try {
            const trends = await userActivityService.getActivityTrends(params);
            return trends;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar tendências de atividade'
            });
            throw error;
          }
        },

        // Ações de filtros
        setFilters: (filters: Partial<ActivitySearchParams>) => {
          set((state) => ({
            filters: { ...state.filters, ...filters },
            pagination: { ...state.pagination, page: 1 } // Reset para primeira página
          }));
        },

        clearFilters: () => {
          set({ filters: {}, pagination: { ...get().pagination, page: 1 } });
        },

        setAdvancedFilters: (filters: Partial<ActivityFilters>) => {
          set((state) => ({
            advancedFilters: { ...state.advancedFilters, ...filters }
          }));
        },

        clearAdvancedFilters: () => {
          set({ advancedFilters: {} });
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
        clearActivities: () => {
          set({
            activities: [],
            recentActivities: [],
            todayActivities: []
          });
        },

        clearAllData: () => {
          set({
            ...initialState
          });
        }
      }),
      {
        name: 'users-activity-store',
        partialize: (state) => ({
          filters: state.filters,
          advancedFilters: state.advancedFilters,
          pagination: state.pagination
        })
      }
    ),
    {
      name: 'UsersActivityStore'
    }
  )
);

export default useUserActivity;
