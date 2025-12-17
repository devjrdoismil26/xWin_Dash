/**
 * Store principal para o módulo EmailMarketingCore
 * Gerencia estado global e ações básicas
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { EmailMarketingMetrics, EmailMarketingStats, EmailMarketingDashboard, EmailMarketingFilters, EmailMarketingSettings } from '../types';

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
  lastRefresh: Date | null; }

interface EmailMarketingActions {
  // Ações de métricas
  fetchMetrics: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchDashboard: () => Promise<void>;
  refreshData: () => Promise<void>;
  // Ações de estado
  setCurrentView?: (e: any) => void;
  setFilters?: (e: any) => void;
  setSettings?: (e: any) => void;
  setRealTimeEnabled?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void;
  // Ações de dados
  updateMetrics?: (e: any) => void;
  updateStats?: (e: any) => void;
  updateDashboard?: (e: any) => void;
  // Ações de utilidade
  reset??: (e: any) => void; }

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
  lastRefresh: null};

export const useEmailMarketingStore = create<EmailMarketingStore>()(
  devtools(
    (set: unknown, get: unknown) => ({
      ...initialState,

      // Ações de métricas
      fetchMetrics: async () => {
        set({ loading: true, error: null });

        try {
          const result = await apiClient.get<{ success: boolean; data?: EmailMarketingMetrics; error?: string }>('/api/v1/email-marketing/metrics');

          if (result.success && result.data) {
            set({ 
              metrics: result.data, 
              loading: false, 
              lastRefresh: new Date()
  });

          } else {
            throw new Error(result.error || 'Failed to fetch metrics');

          } catch (error: unknown) {
          const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
          set({ 
            error: errorMessage, 
            loading: false 
          });

          console.error('Error fetching email marketing metrics:', error);

        } ,

      fetchStats: async () => {
        set({ loading: true, error: null });

        try {
          const result = await apiClient.get<{ success: boolean; data?: EmailMarketingStats; error?: string }>('/api/v1/email-marketing/stats');

          if (result.success && result.data) {
            set({ 
              stats: result.data, 
              loading: false, 
              lastRefresh: new Date()
  });

          } else {
            throw new Error(result.error || 'Failed to fetch stats');

          } catch (error: unknown) {
          const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
          set({ 
            error: errorMessage, 
            loading: false 
          });

          console.error('Error fetching email marketing stats:', error);

        } ,

      fetchDashboard: async () => {
        set({ loading: true, error: null });

        try {
          const result = await apiClient.get<{ success: boolean; data?: EmailMarketingDashboard; error?: string }>('/api/v1/email-marketing/dashboard');

          if (result.success && result.data) {
            set({ 
              dashboard: result.data, 
              loading: false, 
              lastRefresh: new Date()
  });

          } else {
            throw new Error(result.error || 'Failed to fetch dashboard data');

          } catch (error: unknown) {
          const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
          set({ 
            error: errorMessage, 
            loading: false 
          });

          console.error('Error fetching email marketing dashboard:', error);

        } ,

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
          filters: { ...state.filters, ...filters } ));

      },

      setSettings: (settings: Partial<EmailMarketingSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...settings } ));

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

      } ),
    {
      name: 'email-marketing-store',
      partialize: (state: unknown) => ({
        settings: state.settings,
        filters: state.filters,
        currentView: state.currentView,
        realTimeEnabled: state.realTimeEnabled
      })
  }
  ));

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
