// =========================================
// ANALYTICS REPORTS STORE - SOCIAL BUFFER
// =========================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { analyticsReportsService } from '../../services/analytics/analyticsReportsService';
import type {
  AnalyticsParams,
  LinkMetrics,
  EngagementMetrics,
  AudienceMetrics,
  AnalyticsReport,
  PeriodComparison
} from '../../services/analytics/analyticsReportsService';

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
    audience: number | null;
  };
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
  generateReport: (params: AnalyticsParams & { title: string; description?: string }) => Promise<void>;
  getReport: (reportId: string) => Promise<void>;
  listReports: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  exportReport: (reportId: string, format?: 'pdf' | 'excel' | 'csv') => Promise<Blob>;
  
  // Ações de comparação
  comparePeriods: (currentPeriod: { from: string; to: string }, previousPeriod: { from: string; to: string }, params?: any) => Promise<void>;
  
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
// STORE DE RELATÓRIOS DE ANALYTICS
// =========================================

export const useAnalyticsReportsStore = create<AnalyticsReportsState & AnalyticsReportsActions>()(
  devtools(
    persist(
      (set, get) => ({
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
          const finalParams = { ...filters, ...params };
          
          set({ fetchingLinks: true, error: null });
          
          try {
            const data = await analyticsReportsService.getLinkMetrics(finalParams);
            set({
              linkMetrics: data,
              fetchingLinks: false,
              lastFetch: { ...get().lastFetch, links: Date.now() }
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar métricas de links',
              fetchingLinks: false
            });
          }
        },
        
        refreshLinkMetrics: async () => {
          const { fetchLinkMetrics } = get();
          await fetchLinkMetrics();
        },
        
        // ===== AÇÕES DE MÉTRICAS DE ENGAJAMENTO =====
        
        fetchEngagementMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();
          const finalParams = { ...filters, ...params };
          
          set({ fetchingEngagement: true, error: null });
          
          try {
            const data = await analyticsReportsService.getEngagementMetrics(finalParams);
            set({
              engagementMetrics: data,
              fetchingEngagement: false,
              lastFetch: { ...get().lastFetch, engagement: Date.now() }
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar métricas de engajamento',
              fetchingEngagement: false
            });
          }
        },
        
        refreshEngagementMetrics: async () => {
          const { fetchEngagementMetrics } = get();
          await fetchEngagementMetrics();
        },
        
        // ===== AÇÕES DE MÉTRICAS DE AUDIÊNCIA =====
        
        fetchAudienceMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();
          const finalParams = { ...filters, ...params };
          
          set({ fetchingAudience: true, error: null });
          
          try {
            const data = await analyticsReportsService.getAudienceMetrics(finalParams);
            set({
              audienceMetrics: data,
              fetchingAudience: false,
              lastFetch: { ...get().lastFetch, audience: Date.now() }
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar métricas de audiência',
              fetchingAudience: false
            });
          }
        },
        
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
              error: error instanceof Error ? error.message : 'Erro ao gerar relatório',
              generatingReport: false
            });
          }
        },
        
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
              error: error instanceof Error ? error.message : 'Erro ao buscar relatório',
              loading: false
            });
          }
        },
        
        listReports: async (params?: { page?: number; limit?: number; search?: string }) => {
          set({ loading: true, error: null });
          
          try {
            const data = await analyticsReportsService.listReports(params);
            set({
              reports: data.data,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao listar relatórios',
              loading: false
            });
          }
        },
        
        exportReport: async (reportId: string, format: 'pdf' | 'excel' | 'csv' = 'pdf') => {
          set({ exporting: true, error: null });
          
          try {
            const data = await analyticsReportsService.exportReport(reportId, format);
            set({ exporting: false });
            return data;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao exportar relatório',
              exporting: false
            });
            throw error;
          }
        },
        
        // ===== AÇÕES DE COMPARAÇÃO =====
        
        comparePeriods: async (currentPeriod: { from: string; to: string }, previousPeriod: { from: string; to: string }, params?: any) => {
          set({ comparing: true, error: null });
          
          try {
            const data = await analyticsReportsService.comparePeriods(currentPeriod, previousPeriod, params);
            set({
              periodComparison: data,
              comparing: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao comparar períodos',
              comparing: false
            });
          }
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
            }
          });
        },
        
        invalidateCache: (pattern: string) => {
          analyticsReportsService.invalidateCache(pattern);
        }
      }),
      {
        name: 'social-buffer-analytics-reports-store',
        partialize: (state) => ({
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
  )
);

export default useAnalyticsReportsStore;
