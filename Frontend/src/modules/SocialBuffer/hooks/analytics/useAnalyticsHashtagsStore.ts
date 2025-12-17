/**
 * Hook useAnalyticsHashtagsStore - Store de Analytics de Hashtags
 *
 * @description
 * Store Zustand para gerenciamento de estado de analytics de hashtags do SocialBuffer.
 * Gerencia métricas de hashtags, análise, sugestões, trending e relacionadas.
 *
 * @module modules/SocialBuffer/hooks/analytics/useAnalyticsHashtagsStore
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { analyticsHashtagsService } from '@/services/analytics/analyticsHashtagsService';
import { getErrorMessage } from '@/utils/errorHelpers';
import type {
  AnalyticsParams,
  HashtagMetrics,
  HashtagAnalysis,
  HashtagSuggestions
} from '@/services/analytics/analyticsHashtagsService';

/**
 * Estado de analytics de hashtags
 *
 * @interface AnalyticsHashtagsState
 * @property {HashtagMetrics[]} hashtagMetrics - Métricas de hashtags
 * @property {Record<string, HashtagAnalysis>} hashtagAnalysis - Análises de hashtags
 * @property {Record<string, HashtagSuggestions>} hashtagSuggestions - Sugestões de hashtags
 * @property {string[]} trendingHashtags - Hashtags em tendência
 * @property {Record<string, string[]>} relatedHashtags - Hashtags relacionadas
 * @property {boolean} loading - Se está carregando
 * @property {string | null} error - Mensagem de erro
 * @property {boolean} fetchingMetrics - Se está buscando métricas
 * @property {boolean} analyzing - Se está analisando
 * @property {boolean} suggesting - Se está sugerindo
 * @property {boolean} fetchingTrending - Se está buscando trending
 * @property {boolean} fetchingRelated - Se está buscando relacionadas
 * @property {AnalyticsParams} filters - Filtros de analytics
 * @property {Object} lastFetch - Timestamps das últimas buscas
 */
interface AnalyticsHashtagsState {
  // Estado das métricas de hashtags
  hashtagMetrics: HashtagMetrics[];
  hashtagAnalysis: Record<string, HashtagAnalysis>;
  hashtagSuggestions: Record<string, HashtagSuggestions>;
  trendingHashtags: string[];
  relatedHashtags: Record<string, string[]>;
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  // Estado de operações
  fetchingMetrics: boolean;
  analyzing: boolean;
  suggesting: boolean;
  fetchingTrending: boolean;
  fetchingRelated: boolean;
  // Estado de filtros
  filters: AnalyticsParams;
  // Estado de cache
  lastFetch: {
    metrics: number | null;
  trending: number | null; };

}

interface AnalyticsHashtagsActions {
  // Ações de métricas de hashtags
  fetchHashtagMetrics: (params?: AnalyticsParams) => Promise<void>;
  refreshHashtagMetrics: () => Promise<void>;
  // Ações de análise de hashtags
  analyzeHashtag: (hashtag: string, platform: string) => Promise<void>;
  getHashtagAnalysis: (hashtag: string, platform: string) => HashtagAnalysis | null;
  // Ações de sugestões de hashtags
  getHashtagSuggestions: (content: string, platform: string) => Promise<void>;
  getSuggestions: (content: string, platform: string) => HashtagSuggestions | null;
  // Ações de hashtags trending
  fetchTrendingHashtags: (platform: string, limit?: number) => Promise<void>;
  refreshTrendingHashtags: (platform: string) => Promise<void>;
  // Ações de hashtags relacionadas
  fetchRelatedHashtags: (hashtag: string, platform: string) => Promise<void>;
  getRelatedHashtags: (hashtag: string, platform: string) => string[] | null;
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
// STORE DE HASHTAGS DE ANALYTICS
// =========================================

export const useAnalyticsHashtagsStore = create<AnalyticsHashtagsState & AnalyticsHashtagsActions>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
        // ===== ESTADO INICIAL =====
        
        // Estado das métricas de hashtags
        hashtagMetrics: [],
        hashtagAnalysis: {},
        hashtagSuggestions: {},
        trendingHashtags: [],
        relatedHashtags: {},
        
        // Estado de loading e erro
        loading: false,
        error: null,
        
        // Estado de operações
        fetchingMetrics: false,
        analyzing: false,
        suggesting: false,
        fetchingTrending: false,
        fetchingRelated: false,
        
        // Estado de filtros
        filters: {},
        
        // Estado de cache
        lastFetch: {
          metrics: null,
          trending: null
        },
        
        // ===== AÇÕES DE MÉTRICAS DE HASHTAGS =====
        
        fetchHashtagMetrics: async (params?: AnalyticsParams) => {
          const { filters } = get();

          const finalParams = { ...filters, ...params};

          set({ fetchingMetrics: true, error: null });

          try {
            const data = await analyticsHashtagsService.getHashtagMetrics(finalParams);

            set({
              hashtagMetrics: data,
              fetchingMetrics: false,
              lastFetch: { ...get().lastFetch, metrics: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingMetrics: false
            });

          } ,
        
        refreshHashtagMetrics: async () => {
          const { fetchHashtagMetrics } = get();

          await fetchHashtagMetrics();

        },
        
        // ===== AÇÕES DE ANÁLISE DE HASHTAGS =====
        
        analyzeHashtag: async (hashtag: string, platform: string) => {
          const key = `${hashtag}_${platform}`;
          
          set({ analyzing: true, error: null });

          try {
            const data = await analyticsHashtagsService.getHashtagAnalysis(hashtag, platform);

            set(state => ({
              hashtagAnalysis: { ...state.hashtagAnalysis, [key]: data },
              analyzing: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              analyzing: false
            });

          } ,
        
        getHashtagAnalysis: (hashtag: string, platform: string) => {
          const { hashtagAnalysis } = get();

          const key = `${hashtag}_${platform}`;
          return hashtagAnalysis[key] || null;
        },
        
        // ===== AÇÕES DE SUGESTÕES DE HASHTAGS =====
        
        getHashtagSuggestions: async (content: string, platform: string) => {
          const key = `${content}_${platform}`;
          
          set({ suggesting: true, error: null });

          try {
            const data = await analyticsHashtagsService.getHashtagSuggestions(content, platform);

            set(state => ({
              hashtagSuggestions: { ...state.hashtagSuggestions, [key]: data },
              suggesting: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              suggesting: false
            });

          } ,
        
        getSuggestions: (content: string, platform: string) => {
          const { hashtagSuggestions } = get();

          const key = `${content}_${platform}`;
          return hashtagSuggestions[key] || null;
        },
        
        // ===== AÇÕES DE HASHTAGS TRENDING =====
        
        fetchTrendingHashtags: async (platform: string, limit: number = 20) => {
          set({ fetchingTrending: true, error: null });

          try {
            const data = await analyticsHashtagsService.getTrendingHashtags(platform, limit);

            set({
              trendingHashtags: data,
              fetchingTrending: false,
              lastFetch: { ...get().lastFetch, trending: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingTrending: false
            });

          } ,
        
        refreshTrendingHashtags: async (platform: string) => {
          const { fetchTrendingHashtags } = get();

          await fetchTrendingHashtags(platform);

        },
        
        // ===== AÇÕES DE HASHTAGS RELACIONADAS =====
        
        fetchRelatedHashtags: async (hashtag: string, platform: string) => {
          const key = `${hashtag}_${platform}`;
          
          set({ fetchingRelated: true, error: null });

          try {
            const data = await analyticsHashtagsService.getRelatedHashtags(hashtag, platform);

            set(state => ({
              relatedHashtags: { ...state.relatedHashtags, [key]: data },
              fetchingRelated: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingRelated: false
            });

          } ,
        
        getRelatedHashtags: (hashtag: string, platform: string) => {
          const { relatedHashtags } = get();

          const key = `${hashtag}_${platform}`;
          return relatedHashtags[key] || null;
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
          analyticsHashtagsService.clearCache();

          set({
            hashtagMetrics: [],
            hashtagAnalysis: {},
            hashtagSuggestions: {},
            trendingHashtags: [],
            relatedHashtags: {},
            lastFetch: {
              metrics: null,
              trending: null
            } );

        },
        
        invalidateCache: (pattern: string) => {
          analyticsHashtagsService.invalidateCache(pattern);

        } ),
      {
        name: 'social-buffer-analytics-hashtags-store',
        partialize: (state: unknown) => ({
          filters: state.filters,
          lastFetch: state.lastFetch,
          hashtagAnalysis: state.hashtagAnalysis,
          hashtagSuggestions: state.hashtagSuggestions,
          relatedHashtags: state.relatedHashtags
        })
  }
    ),
    {
      name: 'SocialBufferAnalyticsHashtagsStore'
    }
  ));

export default useAnalyticsHashtagsStore;
