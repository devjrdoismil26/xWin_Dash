/**
 * Store do módulo Analytics usando Zustand com TypeScript
 * Gerenciamento de estado global para o módulo Analytics
 */
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { 
  AnalyticsState, 
  AnalyticsActions, 
  AnalyticsReport, 
  AnalyticsFilters, 
  AnalyticsConfig,
  AnalyticsDashboardData,
  AnalyticsModuleStats,
  AnalyticsRealTimeData
} from '../types';
import analyticsService from '../services/analyticsService';

// Estado inicial
const initialState: Omit<AnalyticsState, keyof AnalyticsActions> = {
  reports: [],
  metrics: [],
  insights: [],
  dashboardData: null,
  moduleStats: null,
  realTimeData: null,
  loading: false,
  error: null,
  currentView: 'dashboard',
  realTimeEnabled: false,
  autoRefresh: false,
  config: {
    real_time_enabled: false,
    auto_refresh: false,
    refresh_interval: 30000,
    default_period: '30days',
    default_report_type: 'overview',
    notifications_enabled: true,
    export_format: 'csv',
    theme: 'auto'
  },
  filters: {
    date_range: '30days',
    report_type: 'overview'
  }
};

// Store principal
export const useAnalyticsStore = create<AnalyticsState & AnalyticsActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Ações para relatórios
        fetchReports: async () => {
          set({ loading: true, error: null });
          try {
            const reports = await analyticsService.getReports();
            set({ reports, loading: false });
          } catch (error: any) {
            set({ 
              error: 'Erro ao carregar relatórios', 
              loading: false 
            });
          }
        },

        generateReport: async (filters: AnalyticsFilters) => {
          set({ loading: true, error: null });
          try {
            const report = await analyticsService.createReport({
              name: `Relatório ${new Date().toLocaleDateString('pt-BR')}`,
              type: filters.report_type,
              filters,
              data: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'current_user',
              is_public: false
            });
            
            set(state => ({
              reports: [report, ...state.reports],
              loading: false
            }));
            
            return report;
          } catch (error: any) {
            set({ 
              error: 'Erro ao gerar relatório', 
              loading: false 
            });
            throw error;
          }
        },

        deleteReport: async (id: string) => {
          try {
            await analyticsService.deleteReport(id);
            set(state => ({
              reports: state.reports.filter(report => report.id !== id)
            }));
          } catch (error: any) {
            set({ error: 'Erro ao excluir relatório' });
            throw error;
          }
        },

        exportReport: async (id: string, format: string) => {
          try {
            const blob = await analyticsService.exportReport(id, format);
            return blob;
          } catch (error: any) {
            set({ error: 'Erro ao exportar relatório' });
            throw error;
          }
        },

        updateReport: async (id: string, data: Partial<AnalyticsReport>) => {
          try {
            const updatedReport = await analyticsService.updateReport(id, data);
            set(state => ({
              reports: state.reports.map(report => 
                report.id === id ? updatedReport : report
              )
            }));
            return updatedReport;
          } catch (error: any) {
            set({ error: 'Erro ao atualizar relatório' });
            throw error;
          }
        },

        // Ações para dashboard
        fetchDashboardData: async () => {
          set({ loading: true, error: null });
          try {
            const data = await analyticsService.getDashboardData();
            set({ dashboardData: data, loading: false });
          } catch (error: any) {
            set({ 
              error: 'Erro ao carregar dados do dashboard', 
              loading: false 
            });
          }
        },

        refreshDashboard: async () => {
          try {
            const data = await analyticsService.refreshDashboard();
            set({ dashboardData: data });
          } catch (error: any) {
            set({ error: 'Erro ao atualizar dashboard' });
            throw error;
          }
        },

        // Ações para estatísticas
        fetchModuleStats: async () => {
          set({ loading: true, error: null });
          try {
            const stats = await analyticsService.getModuleStats();
            set({ moduleStats: stats, loading: false });
          } catch (error: any) {
            set({ 
              error: 'Erro ao carregar estatísticas do módulo', 
              loading: false 
            });
          }
        },

        // Ações para tempo real
        enableRealTime: () => {
          set({ realTimeEnabled: true });
          // Iniciar conexão WebSocket ou polling
          const interval = setInterval(async () => {
            try {
              const realTimeData = await analyticsService.getRealTimeData();
              set({ realTimeData });
            } catch (error) {
              console.error('Erro ao obter dados em tempo real:', error);
            }
          }, 5000);
          
          // Armazenar interval ID para limpeza posterior
          (window as any).analyticsRealTimeInterval = interval;
        },

        disableRealTime: () => {
          set({ realTimeEnabled: false });
          // Parar conexão WebSocket ou polling
          if ((window as any).analyticsRealTimeInterval) {
            clearInterval((window as any).analyticsRealTimeInterval);
            (window as any).analyticsRealTimeInterval = null;
          }
        },

        toggleRealTime: () => {
          const { realTimeEnabled } = get();
          if (realTimeEnabled) {
            get().disableRealTime();
          } else {
            get().enableRealTime();
          }
        },

        // Ações para auto refresh
        enableAutoRefresh: () => {
          set({ autoRefresh: true });
          // Implementar auto refresh
          const interval = setInterval(async () => {
            try {
              await get().refreshDashboard();
            } catch (error) {
              console.error('Erro no auto refresh:', error);
            }
          }, 30000);
          
          (window as any).analyticsAutoRefreshInterval = interval;
        },

        disableAutoRefresh: () => {
          set({ autoRefresh: false });
          // Parar auto refresh
          if ((window as any).analyticsAutoRefreshInterval) {
            clearInterval((window as any).analyticsAutoRefreshInterval);
            (window as any).analyticsAutoRefreshInterval = null;
          }
        },

        toggleAutoRefresh: () => {
          const { autoRefresh } = get();
          if (autoRefresh) {
            get().disableAutoRefresh();
          } else {
            get().enableAutoRefresh();
          }
        },

        // Ações para filtros
        applyFilters: async (filters: AnalyticsFilters) => {
          set({ filters, loading: true, error: null });
          try {
            const data = await analyticsService.getDashboardData(filters);
            set({ dashboardData: data, loading: false });
          } catch (error: any) {
            set({ 
              error: 'Erro ao aplicar filtros', 
              loading: false 
            });
          }
        },

        clearFilters: () => {
          const defaultFilters: AnalyticsFilters = {
            date_range: '30days',
            report_type: 'overview'
          };
          set({ filters: defaultFilters });
        },

        // Ações para configuração
        updateConfig: (config: Partial<AnalyticsConfig>) => {
          set(state => ({
            config: { ...state.config, ...config }
          }));
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
        name: 'analytics-store',
        partialize: (state) => ({
          config: state.config,
          filters: state.filters,
          currentView: state.currentView,
          realTimeEnabled: state.realTimeEnabled,
          autoRefresh: state.autoRefresh
        })
      }
    ),
    {
      name: 'analytics-store'
    }
  )
);

// Selectors para otimizar re-renders
export const useAnalyticsDashboard = () => useAnalyticsStore(state => ({
  dashboardData: state.dashboardData,
  loading: state.loading,
  error: state.error,
  fetchDashboardData: state.fetchDashboardData,
  refreshDashboard: state.refreshDashboard
}));

export const useAnalyticsReports = () => useAnalyticsStore(state => ({
  reports: state.reports,
  loading: state.loading,
  error: state.error,
  fetchReports: state.fetchReports,
  generateReport: state.generateReport,
  deleteReport: state.deleteReport,
  exportReport: state.exportReport,
  updateReport: state.updateReport
}));

export const useAnalyticsRealTime = () => useAnalyticsStore(state => ({
  realTimeEnabled: state.realTimeEnabled,
  realTimeData: state.realTimeData,
  autoRefresh: state.autoRefresh,
  enableRealTime: state.enableRealTime,
  disableRealTime: state.disableRealTime,
  toggleRealTime: state.toggleRealTime,
  enableAutoRefresh: state.enableAutoRefresh,
  disableAutoRefresh: state.disableAutoRefresh,
  toggleAutoRefresh: state.toggleAutoRefresh
}));

export const useAnalyticsFilters = () => useAnalyticsStore(state => ({
  filters: state.filters,
  applyFilters: state.applyFilters,
  clearFilters: state.clearFilters
}));

export const useAnalyticsConfig = () => useAnalyticsStore(state => ({
  config: state.config,
  updateConfig: state.updateConfig
}));

export const useAnalyticsState = () => useAnalyticsStore(state => ({
  loading: state.loading,
  error: state.error,
  currentView: state.currentView,
  setCurrentView: state.setCurrentView,
  setError: state.setError,
  setLoading: state.setLoading
}));

export default useAnalyticsStore;
