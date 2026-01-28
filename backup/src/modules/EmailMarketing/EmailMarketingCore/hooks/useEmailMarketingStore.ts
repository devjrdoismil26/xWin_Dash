/**
 * Store principal para o módulo EmailMarketingCore
 * Gerencia estado global e ações básicas
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  EmailMarketingMetrics, 
  EmailMarketingStats, 
  EmailMarketingDashboard,
  EmailMarketingFilters,
  EmailMarketingSettings 
} from '../types';

// Interfaces para o estado e ações
interface EmailMarketingState {
  // Estado principal
  metrics: EmailMarketingMetrics | null;
  stats: EmailMarketingStats | null;
  dashboard: EmailMarketingDashboard | null;
  loading: boolean;
  error: string | null;
  currentView: string;
  filters: EmailMarketingFilters;
  settings: EmailMarketingSettings;
  realTimeEnabled: boolean;
  lastRefresh: Date | null;
}

interface EmailMarketingActions {
  // Ações de métricas
  fetchMetrics: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchDashboard: () => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Ações de estado
  setCurrentView: (view: string) => void;
  setFilters: (filters: Partial<EmailMarketingFilters>) => void;
  setSettings: (settings: Partial<EmailMarketingSettings>) => void;
  setRealTimeEnabled: (enabled: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Ações de dados
  updateMetrics: (metrics: EmailMarketingMetrics) => void;
  updateStats: (stats: EmailMarketingStats) => void;
  updateDashboard: (dashboard: EmailMarketingDashboard) => void;
  
  // Ações de utilidade
  reset: () => void;
}

type EmailMarketingStore = EmailMarketingState & EmailMarketingActions;

// Estado inicial
const initialState: EmailMarketingState = {
  metrics: null,
  stats: null,
  dashboard: null,
  loading: false,
  error: null,
  currentView: 'overview',
  filters: {
    period: '30days',
    status: '',
    type: '',
    category: ''
  },
  settings: {
    theme: 'light',
    layout: 'grid',
    auto_refresh: true,
    refresh_interval: 30000,
    show_advanced_metrics: false,
    notifications_enabled: true,
    real_time_enabled: false
  },
  realTimeEnabled: false,
  lastRefresh: null
};

export const useEmailMarketingStore = create<EmailMarketingStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Ações de métricas
      fetchMetrics: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/v1/email-marketing/metrics', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.success && result.data) {
            set({ 
              metrics: result.data, 
              loading: false, 
              lastRefresh: new Date() 
            });
          } else {
            throw new Error(result.error || 'Failed to fetch metrics');
          }
        } catch (error: any) {
          set({ 
            error: error.message, 
            loading: false 
          });
          console.error('Error fetching email marketing metrics:', error);
        }
      },

      fetchStats: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/v1/email-marketing/stats', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.success && result.data) {
            set({ 
              stats: result.data, 
              loading: false, 
              lastRefresh: new Date() 
            });
          } else {
            throw new Error(result.error || 'Failed to fetch stats');
          }
        } catch (error: any) {
          set({ 
            error: error.message, 
            loading: false 
          });
          console.error('Error fetching email marketing stats:', error);
        }
      },

      fetchDashboard: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/v1/email-marketing/dashboard', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.success && result.data) {
            set({ 
              dashboard: result.data, 
              loading: false, 
              lastRefresh: new Date() 
            });
          } else {
            throw new Error(result.error || 'Failed to fetch dashboard data');
          }
        } catch (error: any) {
          set({ 
            error: error.message, 
            loading: false 
          });
          console.error('Error fetching email marketing dashboard:', error);
        }
      },

      refreshData: async () => {
        const { fetchMetrics, fetchStats, fetchDashboard } = get();
        await Promise.all([
          fetchMetrics(),
          fetchStats(),
          fetchDashboard()
        ]);
      },

      // Ações de estado
      setCurrentView: (view: string) => {
        set({ currentView: view });
      },

      setFilters: (filters: Partial<EmailMarketingFilters>) => {
        set(state => ({
          filters: { ...state.filters, ...filters }
        }));
      },

      setSettings: (settings: Partial<EmailMarketingSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...settings }
        }));
      },

      setRealTimeEnabled: (enabled: boolean) => {
        set({ realTimeEnabled: enabled });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Ações de dados
      updateMetrics: (metrics: EmailMarketingMetrics) => {
        set({ metrics });
      },

      updateStats: (stats: EmailMarketingStats) => {
        set({ stats });
      },

      updateDashboard: (dashboard: EmailMarketingDashboard) => {
        set({ dashboard });
      },

      // Ações de utilidade
      reset: () => {
        set(initialState);
      }
    }),
    {
      name: 'email-marketing-store',
      partialize: (state) => ({
        settings: state.settings,
        filters: state.filters,
        currentView: state.currentView,
        realTimeEnabled: state.realTimeEnabled
      })
    }
  )
);

// Selectors para otimizar re-renders
export const useEmailMarketingMetrics = () => 
  useEmailMarketingStore(state => state.metrics);

export const useEmailMarketingStats = () => 
  useEmailMarketingStore(state => state.stats);

export const useEmailMarketingDashboard = () => 
  useEmailMarketingStore(state => state.dashboard);

export const useEmailMarketingLoading = () => 
  useEmailMarketingStore(state => state.loading);

export const useEmailMarketingError = () => 
  useEmailMarketingStore(state => state.error);

export const useEmailMarketingSettings = () => 
  useEmailMarketingStore(state => state.settings);

export const useEmailMarketingFilters = () => 
  useEmailMarketingStore(state => state.filters);

export const useEmailMarketingCurrentView = () => 
  useEmailMarketingStore(state => state.currentView);

export const useEmailMarketingRealTime = () => 
  useEmailMarketingStore(state => state.realTimeEnabled);

export const useEmailMarketingLastRefresh = () => 
  useEmailMarketingStore(state => state.lastRefresh);
