import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { userStatsService } from '../services/userStatsService';
import { User, UserStats, SystemStats } from '../types/user.types';
import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto
import type {
  UserGeneralStats,
  UserGrowthStats,
  UserActivityStats,
  UserRoleStats,
  UserLocationStats,
  UserDeviceStats,
  UserTimeStats,
  UserRetentionStats,
  StatsParams
} from '../services/userStatsService';

interface UserStatsState {
  // Estado das estatísticas gerais
  generalStats: UserGeneralStats | null;
  growthStats: UserGrowthStats | null;
  activityStats: UserActivityStats | null;
  roleStats: UserRoleStats | null;
  locationStats: UserLocationStats | null;
  deviceStats: UserDeviceStats | null;
  timeStats: UserTimeStats | null;
  retentionStats: UserRetentionStats | null;
  // Estado de estatísticas do usuário
  userStats: UserStats | null;
  systemStats: SystemStats | null;
  // Estado de estatísticas em tempo real
  realTimeStats: {
    active_users_now: number;
  new_users_today: number;
  total_logins_today: number;
  system_load: number;
  last_updated: string; } | null;
  
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  
  // Estado de operações
  fetching: boolean;
  generating: boolean;
  exporting: boolean;
  comparing: boolean;
  
  // Estado de filtros
  filters: StatsParams;
  
  // Estado de comparação de períodos
  periodComparison: {
    current_period: Record<string, any>;
    previous_period: Record<string, any>;
    changes: Record<string, any>;
    insights: string[];
  } | null;
  
  // Estado de insights
  insights: {
    insights: string[];
    recommendations: string[];
    trends: Array<{
      metric: string;
      trend: 'up' | 'down' | 'stable';
      percentage: number;
      description: string;
    }>;
  } | null;
  
  // Estado de métricas de performance
  performanceMetrics: {
    response_time: number;
    cache_hit_rate: number;
    error_rate: number;
    throughput: number;
    last_updated: string;
  } | null;
}

interface UserStatsActions {
  // Ações de estatísticas gerais
  fetchGeneralStats: (params?: StatsParams) => Promise<void>;
  fetchGrowthStats: (params: StatsParams) => Promise<void>;
  fetchActivityStats: (params?: StatsParams) => Promise<void>;
  fetchRoleStats: (params?: StatsParams) => Promise<void>;
  fetchLocationStats: (params?: StatsParams) => Promise<void>;
  fetchDeviceStats: (params?: StatsParams) => Promise<void>;
  fetchTimeStats: (params?: StatsParams) => Promise<void>;
  fetchRetentionStats: (params: StatsParams) => Promise<void>;
  // Ações de estatísticas do usuário
  fetchUserStats: (userId: string, params?: StatsParams) => Promise<void>;
  fetchSystemStats: () => Promise<void>;
  // Ações de estatísticas em tempo real
  fetchRealTimeStats: () => Promise<void>;
  refreshRealTimeStats: () => Promise<void>;
  // Ações de relatórios
  generateStatsReport: (params: {
    type: 'general' | 'growth' | 'activity' | 'roles' | 'location' | 'devices' | 'time' | 'retention';
  date_from: string;
  date_to: string;
  format?: 'json' | 'csv' | 'excel' | 'pdf'; }) => Promise<Record<string, any>>;
  
  // Ações de exportação
  exportStats: (params: StatsParams, format?: 'csv' | 'excel' | 'pdf') => Promise<Blob>;
  
  // Ações de comparação
  comparePeriods: (currentParams: StatsParams, previousParams: StatsParams) => Promise<void>;
  
  // Ações de insights
  fetchInsights: (params?: StatsParams) => Promise<void>;
  refreshInsights: () => Promise<void>;
  
  // Ações de métricas de performance
  fetchPerformanceMetrics: () => Promise<void>;
  
  // Ações de filtros
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  
  // Ações de estado
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void;
  
  // Ações de limpeza
  clearStats??: (e: any) => void;
  clearAllData??: (e: any) => void;
}

type UserStatsStore = UserStatsState & UserStatsActions;

const initialState: UserStatsState = {
  generalStats: null,
  growthStats: null,
  activityStats: null,
  roleStats: null,
  locationStats: null,
  deviceStats: null,
  timeStats: null,
  retentionStats: null,
  userStats: null,
  systemStats: null,
  realTimeStats: null,
  loading: false,
  error: null,
  fetching: false,
  generating: false,
  exporting: false,
  comparing: false,
  filters: {},
  periodComparison: null,
  insights: null,
  performanceMetrics: null};

export const useUserStats = create<UserStatsStore>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
        ...initialState,

        // Ações de estatísticas gerais
        fetchGeneralStats: async (params?: StatsParams) => {
          try {
            set({ fetching: true, error: null });

            const stats = await userStatsService.getGeneralStats(params);

            set({
              generalStats: stats,
              fetching: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetching: false
            });

          } ,

        fetchGrowthStats: async (params: StatsParams) => {
          try {
            set({ fetching: true, error: null });

            const stats = await userStatsService.getGrowthStats(params);

            set({
              growthStats: stats,
              fetching: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetching: false
            });

          } ,

        fetchActivityStats: async (params?: StatsParams) => {
          try {
            set({ fetching: true, error: null });

            const stats = await userStatsService.getActivityStats(params);

            set({
              activityStats: stats,
              fetching: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetching: false
            });

          } ,

        fetchRoleStats: async (params?: StatsParams) => {
          try {
            set({ fetching: true, error: null });

            const stats = await userStatsService.getRoleStats(params);

            set({
              roleStats: stats,
              fetching: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetching: false
            });

          } ,

        fetchLocationStats: async (params?: StatsParams) => {
          try {
            set({ fetching: true, error: null });

            const stats = await userStatsService.getLocationStats(params);

            set({
              locationStats: stats,
              fetching: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetching: false
            });

          } ,

        fetchDeviceStats: async (params?: StatsParams) => {
          try {
            set({ fetching: true, error: null });

            const stats = await userStatsService.getDeviceStats(params);

            set({
              deviceStats: stats,
              fetching: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetching: false
            });

          } ,

        fetchTimeStats: async (params?: StatsParams) => {
          try {
            set({ fetching: true, error: null });

            const stats = await userStatsService.getTimeStats(params);

            set({
              timeStats: stats,
              fetching: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetching: false
            });

          } ,

        fetchRetentionStats: async (params: StatsParams) => {
          try {
            set({ fetching: true, error: null });

            const stats = await userStatsService.getRetentionStats(params);

            set({
              retentionStats: stats,
              fetching: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetching: false
            });

          } ,

        // Ações de estatísticas do usuário
        fetchUserStats: async (userId: string, params?: StatsParams) => {
          try {
            set({ fetching: true, error: null });

            const stats = await userStatsService.getUserStats(userId, params);

            set({
              userStats: stats,
              fetching: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetching: false
            });

          } ,

        fetchSystemStats: async () => {
          try {
            set({ fetching: true, error: null });

            const stats = await userStatsService.getSystemStats();

            set({
              systemStats: stats,
              fetching: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetching: false
            });

          } ,

        // Ações de estatísticas em tempo real
        fetchRealTimeStats: async () => {
          try {
            const stats = await userStatsService.getRealTimeStats();

            set({ realTimeStats: stats });

          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

          } ,

        refreshRealTimeStats: async () => {
          const { fetchRealTimeStats } = get();

          await fetchRealTimeStats();

        },

        // Ações de relatórios
        generateStatsReport: async (params: {
          type: 'general' | 'growth' | 'activity' | 'roles' | 'location' | 'devices' | 'time' | 'retention';
          date_from: string;
          date_to: string;
          format?: 'json' | 'csv' | 'excel' | 'pdf';
        }) => {
          try {
            set({ generating: true, error: null });

            const report = await userStatsService.generateStatsReport(params);

            set({ generating: false });

            return report;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              generating: false
            });

            throw error;
          } ,

        // Ações de exportação
        exportStats: async (params: StatsParams, format: 'csv' | 'excel' | 'pdf' = 'csv') => {
          try {
            set({ exporting: true, error: null });

            const blob = await userStatsService.exportStats(params, format);

            set({ exporting: false });

            return blob;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              exporting: false
            });

            throw error;
          } ,

        // Ações de comparação
        comparePeriods: async (currentParams: StatsParams, previousParams: StatsParams) => {
          try {
            set({ comparing: true, error: null });

            const comparison = await userStatsService.comparePeriods(currentParams, previousParams);

            set({
              periodComparison: comparison,
              comparing: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              comparing: false
            });

          } ,

        // Ações de insights
        fetchInsights: async (params?: StatsParams) => {
          try {
            set({ fetching: true, error: null });

            const insights = await userStatsService.getInsights(params);

            set({
              insights,
              fetching: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetching: false
            });

          } ,

        refreshInsights: async () => {
          const { fetchInsights, filters } = get();

          await fetchInsights(filters);

        },

        // Ações de métricas de performance
        fetchPerformanceMetrics: async () => {
          try {
            const metrics = await userStatsService.getPerformanceMetrics();

            set({ performanceMetrics: metrics });

          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

          } ,

        // Ações de filtros
        setFilters: (filters: Partial<StatsParams>) => {
          set((state: unknown) => ({
            filters: { ...state.filters, ...filters } ));

        },

        clearFilters: () => {
          set({ filters: {} );

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
        clearStats: () => {
          set({
            generalStats: null,
            growthStats: null,
            activityStats: null,
            roleStats: null,
            locationStats: null,
            deviceStats: null,
            timeStats: null,
            retentionStats: null,
            userStats: null,
            systemStats: null,
            realTimeStats: null,
            periodComparison: null,
            insights: null,
            performanceMetrics: null
          });

        },

        clearAllData: () => {
          set({
            ...initialState
          });

        } ),
      {
        name: 'users-stats-store',
        partialize: (state: unknown) => ({
          filters: state.filters
        })
  }
    ),
    {
      name: 'UsersStatsStore'
    }
  ));

export default useUserStats;
