/**
 * Hook useAnalyticsStore - Store de Analytics
 *
 * @description
 * Store Zustand para gerenciamento de estado de analytics do SocialBuffer.
 * Gerencia métricas básicas, por plataforma, séries temporais, conteúdo,
 * hashtags, links, engajamento, audiência e relatórios.
 *
 * @module modules/SocialBuffer/hooks/useAnalyticsStore
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { analyticsService } from '../services/analyticsService';
import { getErrorMessage } from '@/utils/errorHelpers';
import type {
  AnalyticsParams,
  BasicMetrics,
  PlatformMetrics,
  TimeSeriesMetrics,
  ContentMetrics,
  HashtagMetrics,
  LinkMetrics,
  EngagementMetrics,
  AudienceMetrics,
  AnalyticsReport,
  PeriodComparison
} from '../services/analyticsService';

/**
 * Estado de analytics
 *
 * @interface AnalyticsState
 * @property {BasicMetrics | null} basicMetrics - Métricas básicas
 * @property {PlatformMetrics[]} platformMetrics - Métricas por plataforma
 * @property {TimeSeriesMetrics[]} timeSeriesMetrics - Séries temporais
 * @property {ContentMetrics[]} contentMetrics - Métricas de conteúdo
 * @property {HashtagMetrics[]} hashtagMetrics - Métricas de hashtags
 * @property {LinkMetrics[]} linkMetrics - Métricas de links
 * @property {EngagementMetrics | null} engagementMetrics - Métricas de engajamento
 * @property {AudienceMetrics | null} audienceMetrics - Métricas de audiência
 * @property {AnalyticsReport | null} currentReport - Relatório atual
 * @property {PeriodComparison | null} periodComparison - Comparação de períodos
 * @property {AnalyticsParams} filters - Filtros de analytics
 * @property {boolean} loading - Se está carregando
 * @property {string | null} error - Mensagem de erro
 * @property {boolean} generatingReport - Se está gerando relatório
 * @property {boolean} exporting - Se está exportando
 * @property {boolean} comparing - Se está comparando períodos
 */
interface AnalyticsState {
  // Estado das métricas
  basicMetrics: BasicMetrics | null;
  platformMetrics: PlatformMetrics[];
  timeSeriesMetrics: TimeSeriesMetrics[];
  contentMetrics: ContentMetrics[];
  hashtagMetrics: HashtagMetrics[];
  linkMetrics: LinkMetrics[];
  engagementMetrics: EngagementMetrics | null;
  audienceMetrics: AudienceMetrics | null;
  // Estado de relatórios
  currentReport: AnalyticsReport | null;
  periodComparison: PeriodComparison | null;
  // Estado de filtros
  filters: AnalyticsParams;
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  // Estado de operações
  generatingReport: boolean;
  exporting: boolean;
  comparing: boolean;
  // Estado de insights
  insights: {
    insights: string[];
  recommendations: string[];
  trends: Array<{
      metric: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  description: string; }>;
  } | null;
  
  // Estado de tempo real
  realTimeMetrics: {
    active_posts: number;
    scheduled_posts: number;
    total_engagement_today: number;
    total_reach_today: number;
    top_performing_post: unknown | null;
    recent_activity: Array<{
      type: string;
      description: string;
      timestamp: string;
      value?: number;
    }>;
  } | null;
}

interface AnalyticsActions {
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
  // Ações de métricas de hashtags
  fetchHashtagMetrics: (params?: AnalyticsParams) => Promise<void>;
  refreshHashtagMetrics: () => Promise<void>;
  // Ações de métricas de links
  fetchLinkMetrics: (params?: AnalyticsParams) => Promise<void>;
  refreshLinkMetrics: () => Promise<void>;
  // Ações de métricas de engajamento
  fetchEngagementMetrics: (params?: AnalyticsParams) => Promise<void>;
  refreshEngagementMetrics: () => Promise<void>;
  // Ações de métricas de audiência
  fetchAudienceMetrics: (params?: AnalyticsParams) => Promise<void>;
  refreshAudienceMetrics: () => Promise<void>;
  // Ações de relatórios
  generateReport: (params?: AnalyticsParams) => Promise<void>;
  exportReport: (format: 'pdf' | 'excel' | 'csv') => Promise<Blob>;
  // Ações de comparação
  comparePeriods: (currentParams: AnalyticsParams, previousParams: AnalyticsParams) => Promise<void>;
  // Ações de insights
  fetchInsights: (params?: AnalyticsParams) => Promise<void>;
  refreshInsights: () => Promise<void>;
  // Ações de tempo real
  fetchRealTimeMetrics: () => Promise<void>;
  refreshRealTimeMetrics: () => Promise<void>;
  // Ações de performance de posts
  fetchPostPerformance: (postIds: string[]) => Promise<unknown[]>;
  // Ações de performance de contas
  fetchAccountPerformance: (accountIds: string[]) => Promise<unknown[]>;
  // Ações de filtros
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  // Ações de estado
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void;
  // Ações de limpeza
  clearAllMetrics??: (e: any) => void;
  clearReport??: (e: any) => void;
  clearComparison??: (e: any) => void; }

type AnalyticsStore = AnalyticsState & AnalyticsActions;

const initialState: AnalyticsState = {
  basicMetrics: null,
  platformMetrics: [],
  timeSeriesMetrics: [],
  contentMetrics: [],
  hashtagMetrics: [],
  linkMetrics: [],
  engagementMetrics: null,
  audienceMetrics: null,
  currentReport: null,
  periodComparison: null,
  filters: {},
  loading: false,
  error: null,
  generatingReport: false,
  exporting: false,
  comparing: false,
  insights: null,
  realTimeMetrics: null};

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
        ...initialState,

        // Ações de métricas básicas
        fetchBasicMetrics: async (params?: AnalyticsParams) => {
          try {
            set({ loading: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const metrics = await analyticsService.getBasicMetrics(searchParams);

            set({
              basicMetrics: metrics,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        refreshBasicMetrics: async () => {
          const { fetchBasicMetrics, filters } = get();

          await fetchBasicMetrics(filters);

        },

        // Ações de métricas por plataforma
        fetchPlatformMetrics: async (params?: AnalyticsParams) => {
          try {
            set({ loading: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const metrics = await analyticsService.getPlatformMetrics(searchParams);

            set({
              platformMetrics: metrics,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        refreshPlatformMetrics: async () => {
          const { fetchPlatformMetrics, filters } = get();

          await fetchPlatformMetrics(filters);

        },

        // Ações de métricas temporais
        fetchTimeSeriesMetrics: async (params?: AnalyticsParams) => {
          try {
            set({ loading: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const metrics = await analyticsService.getTimeSeriesMetrics(searchParams);

            set({
              timeSeriesMetrics: metrics,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        refreshTimeSeriesMetrics: async () => {
          const { fetchTimeSeriesMetrics, filters } = get();

          await fetchTimeSeriesMetrics(filters);

        },

        // Ações de métricas de conteúdo
        fetchContentMetrics: async (params?: AnalyticsParams) => {
          try {
            set({ loading: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const metrics = await analyticsService.getContentMetrics(searchParams);

            set({
              contentMetrics: metrics,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        refreshContentMetrics: async () => {
          const { fetchContentMetrics, filters } = get();

          await fetchContentMetrics(filters);

        },

        // Ações de métricas de hashtags
        fetchHashtagMetrics: async (params?: AnalyticsParams) => {
          try {
            set({ loading: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const metrics = await analyticsService.getHashtagMetrics(searchParams);

            set({
              hashtagMetrics: metrics,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        refreshHashtagMetrics: async () => {
          const { fetchHashtagMetrics, filters } = get();

          await fetchHashtagMetrics(filters);

        },

        // Ações de métricas de links
        fetchLinkMetrics: async (params?: AnalyticsParams) => {
          try {
            set({ loading: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const metrics = await analyticsService.getLinkMetrics(searchParams);

            set({
              linkMetrics: metrics,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        refreshLinkMetrics: async () => {
          const { fetchLinkMetrics, filters } = get();

          await fetchLinkMetrics(filters);

        },

        // Ações de métricas de engajamento
        fetchEngagementMetrics: async (params?: AnalyticsParams) => {
          try {
            set({ loading: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const metrics = await analyticsService.getEngagementMetrics(searchParams);

            set({
              engagementMetrics: metrics,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        refreshEngagementMetrics: async () => {
          const { fetchEngagementMetrics, filters } = get();

          await fetchEngagementMetrics(filters);

        },

        // Ações de métricas de audiência
        fetchAudienceMetrics: async (params?: AnalyticsParams) => {
          try {
            set({ loading: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const metrics = await analyticsService.getAudienceMetrics(searchParams);

            set({
              audienceMetrics: metrics,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        refreshAudienceMetrics: async () => {
          const { fetchAudienceMetrics, filters } = get();

          await fetchAudienceMetrics(filters);

        },

        // Ações de relatórios
        generateReport: async (params?: AnalyticsParams) => {
          try {
            set({ generatingReport: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const report = await analyticsService.generateReport(searchParams);

            set({
              currentReport: report,
              generatingReport: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              generatingReport: false
            });

          } ,

        exportReport: async (format: 'pdf' | 'excel' | 'csv') => {
          try {
            set({ exporting: true, error: null });

            const { filters } = get();

            const blob = await analyticsService.exportReport(filters, format);

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
        comparePeriods: async (currentParams: AnalyticsParams, previousParams: AnalyticsParams) => {
          try {
            set({ comparing: true, error: null });

            const comparison = await analyticsService.comparePeriods(currentParams, previousParams);

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
        fetchInsights: async (params?: AnalyticsParams) => {
          try {
            set({ loading: true, error: null });

            const currentFilters = get().filters;
            const searchParams = { ...currentFilters, ...params};

            const insights = await analyticsService.getInsights(searchParams);

            set({
              insights,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,

        refreshInsights: async () => {
          const { fetchInsights, filters } = get();

          await fetchInsights(filters);

        },

        // Ações de tempo real
        fetchRealTimeMetrics: async () => {
          try {
            const metrics = await analyticsService.getRealTimeMetrics();

            set({ realTimeMetrics: metrics });

          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

          } ,

        refreshRealTimeMetrics: async () => {
          const { fetchRealTimeMetrics } = get();

          await fetchRealTimeMetrics();

        },

        // Ações de performance de posts
        fetchPostPerformance: async (postIds: string[]) => {
          try {
            const performance = await analyticsService.getPostPerformance(postIds);

            return performance;
          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

            throw error;
          } ,

        // Ações de performance de contas
        fetchAccountPerformance: async (accountIds: string[]) => {
          try {
            const performance = await analyticsService.getAccountPerformance(accountIds);

            return performance;
          } catch (error) {
            set({
              error: getErrorMessage(error)
  });

            throw error;
          } ,

        // Ações de filtros
        setFilters: (filters: Partial<AnalyticsParams>) => {
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
        clearAllMetrics: () => {
          set({
            basicMetrics: null,
            platformMetrics: [],
            timeSeriesMetrics: [],
            contentMetrics: [],
            hashtagMetrics: [],
            linkMetrics: [],
            engagementMetrics: null,
            audienceMetrics: null,
            insights: null,
            realTimeMetrics: null
          });

        },

        clearReport: () => {
          set({ currentReport: null });

        },

        clearComparison: () => {
          set({ periodComparison: null });

        } ),
      {
        name: 'socialbuffer-analytics-store',
        partialize: (state: unknown) => ({
          filters: state.filters
        })
  }
    ),
    {
      name: 'SocialBufferAnalyticsStore'
    }
  ));

export default useAnalyticsStore;
