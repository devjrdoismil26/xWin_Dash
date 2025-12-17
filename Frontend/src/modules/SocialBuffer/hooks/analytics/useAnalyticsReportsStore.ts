/**
 * Hook useAnalyticsReportsStore - Store de Relatórios de Analytics
 *
 * @description
 * Store Zustand para gerenciamento de estado de relatórios de analytics do SocialBuffer.
 * Gerencia métricas de links, engajamento, audiência, relatórios e comparações de período.
 *
 * @module modules/SocialBuffer/hooks/analytics/useAnalyticsReportsStore
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { analyticsReportsService } from '@/services/analytics/analyticsReportsService';
import { getErrorMessage } from '@/utils/errorHelpers';
import type {
  AnalyticsParams,
  LinkMetrics,
  EngagementMetrics,
  AudienceMetrics,
  AnalyticsReport,
  PeriodComparison
} from '@/services/analytics/analyticsReportsService';

/**
 * Estado de relatórios de analytics
 *
 * @interface AnalyticsReportsState
 * @property {LinkMetrics[]} linkMetrics - Métricas de links
 * @property {EngagementMetrics | null} engagementMetrics - Métricas de engajamento
 * @property {AudienceMetrics | null} audienceMetrics - Métricas de audiência
 * @property {AnalyticsReport | null} currentReport - Relatório atual
 * @property {AnalyticsReport[]} reports - Lista de relatórios
 * @property {PeriodComparison | null} periodComparison - Comparação de períodos
 * @property {boolean} loading - Se está carregando
 * @property {string | null} error - Mensagem de erro
 * @property {boolean} fetchingLinks - Se está buscando links
 * @property {boolean} fetchingEngagement - Se está buscando engajamento
 * @property {boolean} fetchingAudience - Se está buscando audiência
 * @property {boolean} generatingReport - Se está gerando relatório
 * @property {boolean} exporting - Se está exportando
 * @property {boolean} comparing - Se está comparando
 * @property {AnalyticsParams} filters - Filtros de analytics
 * @property {Object} lastFetch - Timestamps das últimas buscas
 */
interface AnalyticsReportsState {
  // Estado das métricas de links
  linkMetrics: LinkMetrics[];
  engagementMetrics: EngagementMetrics | null;
  audienceMetrics: AudienceMetrics | null;
  // Estado de relatórios
  currentReport: AnalyticsReport | null;
  reports: AnalyticsReport[];
  periodComparison: PeriodComparison | null;
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  // Estado de operações
  fetchingLinks: boolean;
  fetchingEngagement: boolean;
  fetchingAudience: boolean;
  generatingReport: boolean;
  exporting: boolean;
  comparing: boolean;
  // Estado de filtros
  filters: AnalyticsParams;
  // Estado de cache
  lastFetch: {
    links: number | null;
  engagement: number | null;
  audience: number | null; };

}

interface AnalyticsReportsActions {
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
  generateReport: (params: AnalyticsParams & { title: string;
  description?: string;
}) => Promise<void>;
  getReport: (reportId: string) => Promise<void>;
  listReports: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  exportReport: (reportId: string, format?: 'pdf' | 'excel' | 'csv') => Promise<Blob>;
  
  // Ações de comparação
  comparePeriods: (currentPeriod: { from: string; to: string }, previousPeriod: { from: string; to: string }, params?: string) => Promise<void>;
  
  // Ações de filtros
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  
  // Ações de estado
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void;
  
  // Ações de cache
  clearCache??: (e: any) => void;
  invalidateCache?: (e: any) => void;
}

// =========================================
// STORE DE RELATÓRIOS DE ANALYTICS
// =========================================

export const useAnalyticsReportsStore = create<AnalyticsReportsState & AnalyticsReportsActions>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
        // ===== ESTADO INICIAL =====
        
        // Estado das métricas de links
        linkMetrics: [],
        engagementMetrics: null,
        audienceMetrics: null,
        
        // Estado de relatórios
        currentReport: null,
        reports: [],
        periodComparison: null,
        
        // Estado de loading e erro
        loading: false,
        error: null,
        
        // Estado de operações
        fetchingLinks: false,
        fetchingEngagement: false,
        fetchingAudience: false,
        generatingReport: false,
        exporting: false,
        comparing: false,
        
        // Estado de filtros
        filters: {},
        
        // Estado de cache
        lastFetch: {
          links: null,
          engagement: null,
          audience: null
        },
        
        // ===== AÇÕES DE MÉTRICAS DE LINKS =====
        
        fetchLinkMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();

          const finalParams = { ...filters, ...params};

          set({ fetchingLinks: true, error: null });

          try {
            const data = await analyticsReportsService.getLinkMetrics(finalParams);

            set({
              linkMetrics: data,
              fetchingLinks: false,
              lastFetch: { ...get().lastFetch, links: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingLinks: false
            });

          } ,
        
        refreshLinkMetrics: async () => {
          const { fetchLinkMetrics } = get();

          await fetchLinkMetrics();

        },
        
        // ===== AÇÕES DE MÉTRICAS DE ENGAJAMENTO =====
        
        fetchEngagementMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();

          const finalParams = { ...filters, ...params};

          set({ fetchingEngagement: true, error: null });

          try {
            const data = await analyticsReportsService.getEngagementMetrics(finalParams);

            set({
              engagementMetrics: data,
              fetchingEngagement: false,
              lastFetch: { ...get().lastFetch, engagement: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingEngagement: false
            });

          } ,
        
        refreshEngagementMetrics: async () => {
          const { fetchEngagementMetrics } = get();

          await fetchEngagementMetrics();

        },
        
        // ===== AÇÕES DE MÉTRICAS DE AUDIÊNCIA =====
        
        fetchAudienceMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();

          const finalParams = { ...filters, ...params};

          set({ fetchingAudience: true, error: null });

          try {
            const data = await analyticsReportsService.getAudienceMetrics(finalParams);

            set({
              audienceMetrics: data,
              fetchingAudience: false,
              lastFetch: { ...get().lastFetch, audience: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingAudience: false
            });

          } ,
        
        refreshAudienceMetrics: async () => {
          const { fetchAudienceMetrics } = get();

          await fetchAudienceMetrics();

        },
        
        // ===== AÇÕES DE RELATÓRIOS =====
        
        generateReport: async (params: AnalyticsParams & { title: string; description?: string }) => {
          set({ generatingReport: true, error: null });

          try {
            const data = await analyticsReportsService.generateReport(params);

            set({
              currentReport: data,
              generatingReport: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              generatingReport: false
            });

          } ,
        
        getReport: async (reportId: string) => {
          set({ loading: true, error: null });

          try {
            const data = await analyticsReportsService.getReport(reportId);

            set({
              currentReport: data,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        listReports: async (params?: { page?: number; limit?: number; search?: string }) => {
          set({ loading: true, error: null });

          try {
            const data = await analyticsReportsService.listReports(params);

            set({
              reports: (data as any).data,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        exportReport: async (reportId: string, format: 'pdf' | 'excel' | 'csv' = 'pdf') => {
          set({ exporting: true, error: null });

          try {
            const data = await analyticsReportsService.exportReport(reportId, format);

            set({ exporting: false });

            return data;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              exporting: false
            });

            throw error;
          } ,
        
        // ===== AÇÕES DE COMPARAÇÃO =====
        
        comparePeriods: async (currentPeriod: { from: string; to: string }, previousPeriod: { from: string; to: string }, params?: string) => {
          set({ comparing: true, error: null });

          try {
            const data = await analyticsReportsService.comparePeriods(currentPeriod, previousPeriod, params);

            set({
              periodComparison: data,
              comparing: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              comparing: false
            });

          } ,
        
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
          analyticsReportsService.clearCache();

          set({
            linkMetrics: [],
            engagementMetrics: null,
            audienceMetrics: null,
            currentReport: null,
            reports: [],
            periodComparison: null,
            lastFetch: {
              links: null,
              engagement: null,
              audience: null
            } );

        },
        
        invalidateCache: (pattern: string) => {
          analyticsReportsService.invalidateCache(pattern);

        } ),
      {
        name: 'social-buffer-analytics-reports-store',
        partialize: (state: unknown) => ({
          filters: state.filters,
          lastFetch: state.lastFetch,
          currentReport: state.currentReport,
          reports: state.reports,
          periodComparison: state.periodComparison
        })
  }
    ),
    {
      name: 'SocialBufferAnalyticsReportsStore'
    }
  ));

export default useAnalyticsReportsStore;
