// =========================================
// ANALYTICS METRICS STORE - SOCIAL BUFFER
// =========================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { analyticsMetricsService } from '../../services/analytics/analyticsMetricsService';
import type {
  AnalyticsParams,
  BasicMetrics,
  PlatformMetrics,
  TimeSeriesMetrics,
  ContentMetrics
} from '../../services/analytics/analyticsMetricsService';

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
    content: number | null;
  };
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
  setFilters: (filters: Partial<AnalyticsParams>) => void;
  clearFilters: () => void;
  
  // Ações de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Ações de cache
  clearCache: () => void;
  invalidateCache: (pattern: string) => void;
}

// =========================================
// STORE DE MÉTRICAS DE ANALYTICS
// =========================================

export const useAnalyticsMetricsStore = create<AnalyticsMetricsState & AnalyticsMetricsActions>()(
  devtools(
    persist(
      (set, get) => ({
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
          const finalParams = { ...filters, ...params };
          
          set({ fetchingBasic: true, error: null });
          
          try {
            const data = await analyticsMetricsService.getBasicMetrics(finalParams);
            set({
              basicMetrics: data,
              fetchingBasic: false,
              lastFetch: { ...get().lastFetch, basic: Date.now() }
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar métricas básicas',
              fetchingBasic: false
            });
          }
        },
        
        refreshBasicMetrics: async () => {
          const { fetchBasicMetrics } = get();
          await fetchBasicMetrics();
        },
        
        // ===== AÇÕES DE MÉTRICAS POR PLATAFORMA =====
        
        fetchPlatformMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();
          const finalParams = { ...filters, ...params };
          
          set({ fetchingPlatform: true, error: null });
          
          try {
            const data = await analyticsMetricsService.getPlatformMetrics(finalParams);
            set({
              platformMetrics: data,
              fetchingPlatform: false,
              lastFetch: { ...get().lastFetch, platform: Date.now() }
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar métricas por plataforma',
              fetchingPlatform: false
            });
          }
        },
        
        refreshPlatformMetrics: async () => {
          const { fetchPlatformMetrics } = get();
          await fetchPlatformMetrics();
        },
        
        // ===== AÇÕES DE MÉTRICAS TEMPORAIS =====
        
        fetchTimeSeriesMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();
          const finalParams = { ...filters, ...params };
          
          set({ fetchingTimeSeries: true, error: null });
          
          try {
            const data = await analyticsMetricsService.getTimeSeriesMetrics(finalParams);
            set({
              timeSeriesMetrics: data,
              fetchingTimeSeries: false,
              lastFetch: { ...get().lastFetch, timeSeries: Date.now() }
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar métricas temporais',
              fetchingTimeSeries: false
            });
          }
        },
        
        refreshTimeSeriesMetrics: async () => {
          const { fetchTimeSeriesMetrics } = get();
          await fetchTimeSeriesMetrics();
        },
        
        // ===== AÇÕES DE MÉTRICAS DE CONTEÚDO =====
        
        fetchContentMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();
          const finalParams = { ...filters, ...params };
          
          set({ fetchingContent: true, error: null });
          
          try {
            const data = await analyticsMetricsService.getContentMetrics(finalParams);
            set({
              contentMetrics: data,
              fetchingContent: false,
              lastFetch: { ...get().lastFetch, content: Date.now() }
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar métricas de conteúdo',
              fetchingContent: false
            });
          }
        },
        
        refreshContentMetrics: async () => {
          const { fetchContentMetrics } = get();
          await fetchContentMetrics();
        },
        
        // ===== AÇÕES DE FILTROS =====
        
        setFilters: (filters: Partial<AnalyticsParams>) => {
          set(state => ({
            filters: { ...state.filters, ...filters }
          }));
        },
        
        clearFilters: () => {
          set({ filters: {} });
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
            }
          });
        },
        
        invalidateCache: (pattern: string) => {
          analyticsMetricsService.invalidateCache(pattern);
        }
      }),
      {
        name: 'social-buffer-analytics-metrics-store',
        partialize: (state) => ({
          filters: state.filters,
          lastFetch: state.lastFetch
        })
      }
    ),
    {
      name: 'SocialBufferAnalyticsMetricsStore'
    }
  )
);

export default useAnalyticsMetricsStore;
