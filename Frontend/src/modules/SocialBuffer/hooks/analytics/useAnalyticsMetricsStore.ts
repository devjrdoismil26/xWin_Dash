/**
 * Hook useAnalyticsMetricsStore - Store de Métricas de Analytics
 *
 * @description
 * Store Zustand para gerenciamento de estado de métricas de analytics do SocialBuffer.
 * Gerencia métricas básicas, por plataforma, séries temporais e conteúdo.
 *
 * @module modules/SocialBuffer/hooks/analytics/useAnalyticsMetricsStore
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { analyticsMetricsService } from '@/services/analytics/analyticsMetricsService';
import { getErrorMessage } from '@/utils/errorHelpers';
import type {
  AnalyticsParams,
  BasicMetrics,
  PlatformMetrics,
  TimeSeriesMetrics,
  ContentMetrics
} from '@/services/analytics/analyticsMetricsService';

/**
 * Estado de métricas de analytics
 *
 * @interface AnalyticsMetricsState
 * @property {BasicMetrics | null} basicMetrics - Métricas básicas
 * @property {PlatformMetrics[]} platformMetrics - Métricas por plataforma
 * @property {TimeSeriesMetrics[]} timeSeriesMetrics - Séries temporais
 * @property {ContentMetrics[]} contentMetrics - Métricas de conteúdo
 * @property {boolean} loading - Se está carregando
 * @property {string | null} error - Mensagem de erro
 * @property {boolean} fetchingBasic - Se está buscando métricas básicas
 * @property {boolean} fetchingPlatform - Se está buscando métricas por plataforma
 * @property {boolean} fetchingTimeSeries - Se está buscando séries temporais
 * @property {boolean} fetchingContent - Se está buscando métricas de conteúdo
 * @property {AnalyticsParams} filters - Filtros de analytics
 * @property {Object} lastFetch - Timestamps das últimas buscas
 */
interface AnalyticsMetricsState {
  // Estado das métricas básicas
  basicMetrics: BasicMetrics | null;
  platformMetrics: PlatformMetrics[];
  timeSeriesMetrics: TimeSeriesMetrics[];
  contentMetrics: ContentMetrics[];
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  // Estado de operações
  fetchingBasic: boolean;
  fetchingPlatform: boolean;
  fetchingTimeSeries: boolean;
  fetchingContent: boolean;
  // Estado de filtros
  filters: AnalyticsParams;
  // Estado de cache
  lastFetch: {
    basic: number | null;
  platform: number | null;
  timeSeries: number | null;
  content: number | null; };

}

interface AnalyticsMetricsActions {
  // Ações de métricas básicas
  fetchBasicMetrics: (params?: AnalyticsParams) => Promise<void>;
  refreshBasicMetrics: () => Promise<void>;
  // Ações de métricas por plataforma
  fetchPlatformMetrics: (params?: AnalyticsParams) => Promise<void>;
  refreshPlatformMetrics: () => Promise<void>;
  // Ações de métricas temporais
  fetchTimeSeriesMetrics: (params?: AnalyticsParams) => Promise<void>;
  refreshTimeSeriesMetrics: () => Promise<void>;
  // Ações de métricas de conteúdo
  fetchContentMetrics: (params?: AnalyticsParams) => Promise<void>;
  refreshContentMetrics: () => Promise<void>;
  // Ações de filtros
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  // Ações de estado
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void;
  // Ações de cache
  clearCache??: (e: any) => void;
  invalidateCache?: (e: any) => void; }

// =========================================
// STORE DE MÉTRICAS DE ANALYTICS
// =========================================

export const useAnalyticsMetricsStore = create<AnalyticsMetricsState & AnalyticsMetricsActions>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
        // ===== ESTADO INICIAL =====
        
        // Estado das métricas
        basicMetrics: null,
        platformMetrics: [],
        timeSeriesMetrics: [],
        contentMetrics: [],
        
        // Estado de loading e erro
        loading: false,
        error: null,
        
        // Estado de operações
        fetchingBasic: false,
        fetchingPlatform: false,
        fetchingTimeSeries: false,
        fetchingContent: false,
        
        // Estado de filtros
        filters: {},
        
        // Estado de cache
        lastFetch: {
          basic: null,
          platform: null,
          timeSeries: null,
          content: null
        },
        
        // ===== AÇÕES DE MÉTRICAS BÁSICAS =====
        
        fetchBasicMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();

          const finalParams = { ...filters, ...params};

          set({ fetchingBasic: true, error: null });

          try {
            const data = await analyticsMetricsService.getBasicMetrics(finalParams);

            set({
              basicMetrics: data,
              fetchingBasic: false,
              lastFetch: { ...get().lastFetch, basic: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingBasic: false
            });

          } ,
        
        refreshBasicMetrics: async () => {
          const { fetchBasicMetrics } = get();

          await fetchBasicMetrics();

        },
        
        // ===== AÇÕES DE MÉTRICAS POR PLATAFORMA =====
        
        fetchPlatformMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();

          const finalParams = { ...filters, ...params};

          set({ fetchingPlatform: true, error: null });

          try {
            const data = await analyticsMetricsService.getPlatformMetrics(finalParams);

            set({
              platformMetrics: data,
              fetchingPlatform: false,
              lastFetch: { ...get().lastFetch, platform: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingPlatform: false
            });

          } ,
        
        refreshPlatformMetrics: async () => {
          const { fetchPlatformMetrics } = get();

          await fetchPlatformMetrics();

        },
        
        // ===== AÇÕES DE MÉTRICAS TEMPORAIS =====
        
        fetchTimeSeriesMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();

          const finalParams = { ...filters, ...params};

          set({ fetchingTimeSeries: true, error: null });

          try {
            const data = await analyticsMetricsService.getTimeSeriesMetrics(finalParams);

            set({
              timeSeriesMetrics: data,
              fetchingTimeSeries: false,
              lastFetch: { ...get().lastFetch, timeSeries: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingTimeSeries: false
            });

          } ,
        
        refreshTimeSeriesMetrics: async () => {
          const { fetchTimeSeriesMetrics } = get();

          await fetchTimeSeriesMetrics();

        },
        
        // ===== AÇÕES DE MÉTRICAS DE CONTEÚDO =====
        
        fetchContentMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();

          const finalParams = { ...filters, ...params};

          set({ fetchingContent: true, error: null });

          try {
            const data = await analyticsMetricsService.getContentMetrics(finalParams);

            set({
              contentMetrics: data,
              fetchingContent: false,
              lastFetch: { ...get().lastFetch, content: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingContent: false
            });

          } ,
        
        refreshContentMetrics: async () => {
          const { fetchContentMetrics } = get();

          await fetchContentMetrics();

        },
        
        // ===== AÇÕES DE FILTROS =====
        
        setFilters: (filters: Partial<AnalyticsParams>) => {
          set(state => ({
            filters: { ...state.filters, ...filters } ));

        },
        
        clearFilters: () => {
          set({ filters: {} );

        },
        
        // ===== AÇÕES DE ESTADO =====
        
        setLoading: (loading: boolean) => {
          set({ loading });

        },
        
        setError: (error: string | null) => {
          set({ error });

        },
        
        clearError: () => {
          set({ error: null });

        },
        
        // ===== AÇÕES DE CACHE =====
        
        clearCache: () => {
          analyticsMetricsService.clearCache();

          set({
            basicMetrics: null,
            platformMetrics: [],
            timeSeriesMetrics: [],
            contentMetrics: [],
            lastFetch: {
              basic: null,
              platform: null,
              timeSeries: null,
              content: null
            } );

        },
        
        invalidateCache: (pattern: string) => {
          analyticsMetricsService.invalidateCache(pattern);

        } ),
      {
        name: 'social-buffer-analytics-metrics-store',
        partialize: (state: unknown) => ({
          filters: state.filters,
          lastFetch: state.lastFetch
        })
  }
    ),
    {
      name: 'SocialBufferAnalyticsMetricsStore'
    }
  ));

export default useAnalyticsMetricsStore;
