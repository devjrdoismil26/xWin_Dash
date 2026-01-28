import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  ActivityLog, 
  ActivityStats, 
  ActivityFilters, 
  ActivityPagination,
  UserActivityStats,
  SystemHealthStats,
  RealTimeLog,
  ActivityResponse
} from '../types';
import activityService from '../services/activityService';

interface ActivityState {
  // Data
  logs: ActivityLog[];
  stats: ActivityStats | null;
  loading: boolean;
  error: string | null;
  
  // UI State
  realTimeEnabled: boolean;
  currentView: 'logs' | 'stats' | 'export' | 'settings';
  
  // Filters & Pagination
  filters: ActivityFilters;
  pagination: ActivityPagination | null;
  
  // Actions - Logs
  fetchLogs: (filters?: ActivityFilters) => Promise<void>;
  getLogById: (logId: string) => Promise<ActivityLog | null>;
  
  // Actions - Stats
  fetchStats: (filters?: ActivityFilters) => Promise<void>;
  getActivityStats: (filters?: ActivityFilters) => Promise<ActivityResponse>;
  getUserActivityStats: (userId: string, filters?: ActivityFilters) => Promise<ActivityResponse>;
  getSystemHealthStats: () => Promise<ActivityResponse>;
  
  // Actions - Search & Filter
  searchLogs: (query: string, filters?: ActivityFilters) => Promise<void>;
  getLogsByType: (type: string, filters?: ActivityFilters) => Promise<void>;
  getLogsByUser: (userId: string, filters?: ActivityFilters) => Promise<void>;
  getLogsByDateRange: (startDate: string, endDate: string, filters?: ActivityFilters) => Promise<void>;
  
  // Actions - Export & Cleanup
  exportLogs: (filters?: ActivityFilters, format?: 'csv' | 'json' | 'pdf') => Promise<ActivityResponse>;
  clearOldLogs: (daysToKeep?: number) => Promise<ActivityResponse>;
  
  // Actions - Real Time
  enableRealTime: () => void;
  disableRealTime: () => void;
  getRealTimeLogs: () => Promise<ActivityResponse>;
  subscribeToRealTimeUpdates: (callback: (data: RealTimeLog) => void) => Promise<EventSource>;
  
  // Actions - Integration Tests
  testConnection: () => Promise<ActivityResponse>;
  testLogsRetrieval: () => Promise<ActivityResponse>;
  testStatsGeneration: () => Promise<ActivityResponse>;
  testExportFunctionality: () => Promise<ActivityResponse>;
  testRealTimeConnection: () => Promise<ActivityResponse>;
  
  // Utils
  getTotalLogs: () => number;
  getLogsByType: () => Record<string, number>;
  getLogsByUser: () => Record<string, number>;
  getRecentLogs: (limit?: number) => ActivityLog[];
  getErrorLogs: () => ActivityLog[];
  getSecurityLogs: () => ActivityLog[];
  
  // State Management
  clearError: () => void;
  setCurrentView: (view: 'logs' | 'stats' | 'export' | 'settings') => void;
  setFilters: (filters: Partial<ActivityFilters>) => void;
  clearFilters: () => void;
}

export const useActivityStore = create<ActivityState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        logs: [],
        stats: null,
        loading: false,
        error: null,
        realTimeEnabled: false,
        currentView: 'logs',
        filters: {},
        pagination: null,

        // Actions - Logs
        fetchLogs: async (filters = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.getLogs(filters);
            if (response.success && response.data) {
              set({ 
                logs: Array.isArray(response.data) ? response.data : [response.data],
                pagination: response.pagination || null,
                loading: false 
              });
            } else {
              set({ 
                error: response.error || 'Erro ao carregar logs de atividade', 
                loading: false 
              });
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar logs de atividade', 
              loading: false 
            });
          }
        },

        getLogById: async (logId: string) => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.getLogById(logId);
            set({ loading: false });
            return response.success && response.data ? response.data as ActivityLog : null;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar log específico', 
              loading: false 
            });
            return null;
          }
        },

        // Actions - Stats
        fetchStats: async (filters = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.getLogStats(filters);
            if (response.success && response.data) {
              set({ stats: response.data as ActivityStats, loading: false });
            } else {
              set({ 
                error: response.error || 'Erro ao carregar estatísticas', 
                loading: false 
              });
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar estatísticas', 
              loading: false 
            });
          }
        },

        getActivityStats: async (filters = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.getActivityStats(filters);
            set({ loading: false });
            return response;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar estatísticas de atividade', 
              loading: false 
            });
            throw error;
          }
        },

        getUserActivityStats: async (userId: string, filters = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.getUserActivityStats(userId, filters);
            set({ loading: false });
            return response;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar estatísticas do usuário', 
              loading: false 
            });
            throw error;
          }
        },

        getSystemHealthStats: async () => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.getSystemHealthStats();
            set({ loading: false });
            return response;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar estatísticas do sistema', 
              loading: false 
            });
            throw error;
          }
        },

        // Actions - Search & Filter
        searchLogs: async (query: string, filters = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.searchLogs(query, filters);
            if (response.success && response.data) {
              set({ 
                logs: Array.isArray(response.data) ? response.data : [response.data],
                pagination: response.pagination || null,
                loading: false 
              });
            } else {
              set({ 
                error: response.error || 'Erro ao buscar logs', 
                loading: false 
              });
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao buscar logs', 
              loading: false 
            });
          }
        },

        getLogsByType: async (type: string, filters = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.getLogsByType(type, filters);
            if (response.success && response.data) {
              set({ 
                logs: Array.isArray(response.data) ? response.data : [response.data],
                pagination: response.pagination || null,
                loading: false 
              });
            } else {
              set({ 
                error: response.error || 'Erro ao carregar logs por tipo', 
                loading: false 
              });
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar logs por tipo', 
              loading: false 
            });
          }
        },

        getLogsByUser: async (userId: string, filters = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.getLogsByUser(userId, filters);
            if (response.success && response.data) {
              set({ 
                logs: Array.isArray(response.data) ? response.data : [response.data],
                pagination: response.pagination || null,
                loading: false 
              });
            } else {
              set({ 
                error: response.error || 'Erro ao carregar logs do usuário', 
                loading: false 
              });
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar logs do usuário', 
              loading: false 
            });
          }
        },

        getLogsByDateRange: async (startDate: string, endDate: string, filters = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.getLogsByDateRange(startDate, endDate, filters);
            if (response.success && response.data) {
              set({ 
                logs: Array.isArray(response.data) ? response.data : [response.data],
                pagination: response.pagination || null,
                loading: false 
              });
            } else {
              set({ 
                error: response.error || 'Erro ao carregar logs por período', 
                loading: false 
              });
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar logs por período', 
              loading: false 
            });
          }
        },

        // Actions - Export & Cleanup
        exportLogs: async (filters = {}, format: 'csv' | 'json' | 'pdf' = 'csv') => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.exportLogs(filters, format);
            set({ loading: false });
            return response;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao exportar logs', 
              loading: false 
            });
            throw error;
          }
        },

        clearOldLogs: async (daysToKeep = 30) => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.clearOldLogs(daysToKeep);
            set({ loading: false });
            return response;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao limpar logs antigos', 
              loading: false 
            });
            throw error;
          }
        },

        // Actions - Real Time
        enableRealTime: () => set({ realTimeEnabled: true }),
        disableRealTime: () => set({ realTimeEnabled: false }),

        getRealTimeLogs: async () => {
          set({ loading: true, error: null });
          try {
            const response = await activityService.getRealTimeLogs();
            set({ loading: false });
            return response;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar logs em tempo real', 
              loading: false 
            });
            throw error;
          }
        },

        subscribeToRealTimeUpdates: async (callback: (data: RealTimeLog) => void) => {
          try {
            const eventSource = await activityService.subscribeToRealTimeUpdates(callback);
            return eventSource;
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao conectar com atualizações em tempo real' 
            });
            throw error;
          }
        },

        // Actions - Integration Tests (mocked for now)
        testConnection: async () => {
          set({ loading: true, error: null });
          try {
            // Mock implementation - replace with actual test
            await new Promise(resolve => setTimeout(resolve, 1000));
            set({ loading: false });
            return { success: true, data: { status: 'connected' } };
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro no teste de conexão', 
              loading: false 
            });
            throw error;
          }
        },

        testLogsRetrieval: async () => {
          set({ loading: true, error: null });
          try {
            // Mock implementation - replace with actual test
            await new Promise(resolve => setTimeout(resolve, 1000));
            set({ loading: false });
            return { success: true, data: { logsRetrieved: true } };
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro no teste de recuperação de logs', 
              loading: false 
            });
            throw error;
          }
        },

        testStatsGeneration: async () => {
          set({ loading: true, error: null });
          try {
            // Mock implementation - replace with actual test
            await new Promise(resolve => setTimeout(resolve, 1000));
            set({ loading: false });
            return { success: true, data: { statsGenerated: true } };
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro no teste de geração de estatísticas', 
              loading: false 
            });
            throw error;
          }
        },

        testExportFunctionality: async () => {
          set({ loading: true, error: null });
          try {
            // Mock implementation - replace with actual test
            await new Promise(resolve => setTimeout(resolve, 1000));
            set({ loading: false });
            return { success: true, data: { exportWorking: true } };
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro no teste de exportação', 
              loading: false 
            });
            throw error;
          }
        },

        testRealTimeConnection: async () => {
          set({ loading: true, error: null });
          try {
            // Mock implementation - replace with actual test
            await new Promise(resolve => setTimeout(resolve, 1000));
            set({ loading: false });
            return { success: true, data: { realTimeWorking: true } };
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro no teste de conexão em tempo real', 
              loading: false 
            });
            throw error;
          }
        },

        // Utils
        getTotalLogs: () => {
          const { logs } = get();
          return logs.length;
        },


        getRecentLogs: (limit = 10) => {
          const { logs } = get();
          return logs
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, limit);
        },

        getErrorLogs: () => {
          const { logs } = get();
          return logs.filter(log => 
            log.log_name && (
              log.log_name.includes('error') || 
              log.log_name.includes('exception') ||
              log.log_name.includes('failed')
            )
          );
        },

        getSecurityLogs: () => {
          const { logs } = get();
          return logs.filter(log => 
            log.log_name && (
              log.log_name.includes('security') || 
              log.log_name.includes('login') ||
              log.log_name.includes('logout') ||
              log.log_name.includes('permission')
            )
          );
        },

        // State Management
        clearError: () => set({ error: null }),
        setCurrentView: (view: 'logs' | 'stats' | 'export' | 'settings') => set({ currentView: view }),
        setFilters: (newFilters: Partial<ActivityFilters>) => {
          set(state => ({
            filters: { ...state.filters, ...newFilters }
          }));
        },
        clearFilters: () => set({ filters: {} }),
      }),
      {
        name: 'activity-store',
        partialize: (state) => ({
          filters: state.filters,
          currentView: state.currentView,
          realTimeEnabled: state.realTimeEnabled
        })
      }
    ),
    { name: 'ActivityStore' }
  )
);

export default useActivityStore;
