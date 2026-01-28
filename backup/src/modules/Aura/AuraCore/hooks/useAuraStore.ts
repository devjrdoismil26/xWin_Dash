/**
 * Store do módulo AuraCore usando Zustand com TypeScript
 * Gerenciamento de estado global para o módulo AuraCore
 */
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { 
  AuraCoreState, 
  AuraCoreActions, 
  AuraStats, 
  AuraModule, 
  AuraQuickAction,
  AuraNotification,
  AuraConfig,
  AuraFilters
} from '../types';
import auraCoreService from '../services/auraCoreService';

// Estado inicial
const initialState: Omit<AuraCoreState, keyof AuraCoreActions> = {
  stats: null,
  modules: [],
  quick_actions: [],
  notifications: [],
  dashboardData: null,
  loading: false,
  error: null,
  currentView: 'dashboard',
  config: {
    real_time_enabled: false,
    auto_refresh: false,
    refresh_interval: 30000,
    notifications_enabled: true,
    theme: 'auto',
    language: 'pt-BR'
  },
  filters: {}
};

// Store principal
export const useAuraStore = create<AuraCoreState & AuraCoreActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Ações para estatísticas
        fetchStats: async () => {
          set({ loading: true, error: null });
          try {
            const result = await auraCoreService.getStats();
            if (result.success && result.data) {
              set({ stats: result.data, loading: false });
            } else {
              throw new Error(result.error || 'Failed to fetch stats');
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar estatísticas', 
              loading: false 
            });
          }
        },

        updateStats: (stats: Partial<AuraStats>) => {
          set(state => ({
            stats: state.stats ? { ...state.stats, ...stats } : null
          }));
        },

        // Ações para módulos
        fetchModules: async () => {
          set({ loading: true, error: null });
          try {
            const result = await auraCoreService.getModules();
            if (result.success && result.data) {
              set({ modules: result.data, loading: false });
            } else {
              throw new Error(result.error || 'Failed to fetch modules');
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar módulos', 
              loading: false 
            });
          }
        },

        updateModule: (id: string, data: Partial<AuraModule>) => {
          set(state => ({
            modules: state.modules.map(module => 
              module.id === id ? { ...module, ...data } : module
            )
          }));
        },

        // Ações para ações rápidas
        fetchQuickActions: async () => {
          set({ loading: true, error: null });
          try {
            const result = await auraCoreService.getQuickActions();
            if (result.success && result.data) {
              set({ quick_actions: result.data, loading: false });
            } else {
              throw new Error(result.error || 'Failed to fetch quick actions');
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar ações rápidas', 
              loading: false 
            });
          }
        },

        executeQuickAction: async (id: string) => {
          try {
            const result = await auraCoreService.executeQuickAction(id);
            if (result.success) {
              // Atualizar dados após execução
              await get().fetchStats();
              await get().fetchModules();
            }
            return result;
          } catch (error: any) {
            set({ error: error.message || 'Erro ao executar ação rápida' });
            throw error;
          }
        },

        // Ações para notificações
        fetchNotifications: async () => {
          set({ loading: true, error: null });
          try {
            const result = await auraCoreService.getNotifications();
            if (result.success && result.data) {
              set({ notifications: result.data, loading: false });
            } else {
              throw new Error(result.error || 'Failed to fetch notifications');
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar notificações', 
              loading: false 
            });
          }
        },

        markNotificationAsRead: (id: string) => {
          set(state => ({
            notifications: state.notifications.map(notification => 
              notification.id === id ? { ...notification, read: true } : notification
            )
          }));
        },

        clearNotifications: () => {
          set({ notifications: [] });
        },

        // Ações para dashboard
        fetchDashboardData: async () => {
          set({ loading: true, error: null });
          try {
            const result = await auraCoreService.getDashboardData();
            if (result.success && result.data) {
              set({ dashboardData: result.data, loading: false });
            } else {
              throw new Error(result.error || 'Failed to fetch dashboard data');
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Erro ao carregar dados do dashboard', 
              loading: false 
            });
          }
        },

        refreshDashboard: async () => {
          try {
            const result = await auraCoreService.refreshDashboard();
            if (result.success && result.data) {
              set({ dashboardData: result.data });
            }
            return result;
          } catch (error: any) {
            set({ error: error.message || 'Erro ao atualizar dashboard' });
            throw error;
          }
        },

        // Ações para configuração
        updateConfig: (config: Partial<AuraConfig>) => {
          set(state => ({
            config: { ...state.config, ...config }
          }));
        },

        // Ações para filtros
        applyFilters: (filters: AuraFilters) => {
          set({ filters });
        },

        clearFilters: () => {
          set({ filters: {} });
        },

        // Ações para controle de estado
        setCurrentView: (view: string) => {
          set({ currentView: view });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        setLoading: (loading: boolean) => {
          set({ loading });
        }
      }),
      {
        name: 'aura-core-store',
        partialize: (state) => ({
          config: state.config,
          filters: state.filters,
          currentView: state.currentView
        })
      }
    ),
    {
      name: 'aura-core-store'
    }
  )
);

// Selectors para otimizar re-renders
export const useAuraStats = () => useAuraStore(state => ({
  stats: state.stats,
  loading: state.loading,
  error: state.error,
  fetchStats: state.fetchStats,
  updateStats: state.updateStats
}));

export const useAuraModules = () => useAuraStore(state => ({
  modules: state.modules,
  loading: state.loading,
  error: state.error,
  fetchModules: state.fetchModules,
  updateModule: state.updateModule
}));

export const useAuraQuickActions = () => useAuraStore(state => ({
  quick_actions: state.quick_actions,
  loading: state.loading,
  error: state.error,
  fetchQuickActions: state.fetchQuickActions,
  executeQuickAction: state.executeQuickAction
}));

export const useAuraNotifications = () => useAuraStore(state => ({
  notifications: state.notifications,
  loading: state.loading,
  error: state.error,
  fetchNotifications: state.fetchNotifications,
  markNotificationAsRead: state.markNotificationAsRead,
  clearNotifications: state.clearNotifications
}));

export const useAuraDashboard = () => useAuraStore(state => ({
  dashboardData: state.dashboardData,
  loading: state.loading,
  error: state.error,
  fetchDashboardData: state.fetchDashboardData,
  refreshDashboard: state.refreshDashboard
}));

export const useAuraConfig = () => useAuraStore(state => ({
  config: state.config,
  updateConfig: state.updateConfig
}));

export const useAuraFilters = () => useAuraStore(state => ({
  filters: state.filters,
  applyFilters: state.applyFilters,
  clearFilters: state.clearFilters
}));

export const useAuraState = () => useAuraStore(state => ({
  loading: state.loading,
  error: state.error,
  currentView: state.currentView,
  setCurrentView: state.setCurrentView,
  setError: state.setError,
  setLoading: state.setLoading
}));

export default useAuraStore;
