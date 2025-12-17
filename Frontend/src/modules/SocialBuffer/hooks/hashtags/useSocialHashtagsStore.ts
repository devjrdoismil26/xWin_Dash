/**
 * Hook useSocialHashtagsStore - Store de Hashtags
 *
 * @description
 * Store Zustand para gerenciamento de estado de hashtags do SocialBuffer.
 * Gerencia CRUD de hashtags, análise, sugestões, trending, populares e relacionadas.
 *
 * @module modules/SocialBuffer/hooks/hashtags/useSocialHashtagsStore
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { hashtagsService } from '@/services/hashtagsService';
import { SocialHashtag, SocialPlatform } from '@/types/socialTypes';
import { getErrorMessage } from '@/utils/errorHelpers';
import type {
  HashtagSearchParams,
  HashtagPaginatedResponse,
  CreateHashtagData,
  UpdateHashtagData,
  HashtagStats,
  HashtagValidation,
  HashtagAnalysis,
  HashtagSuggestion,
  TrendingHashtag,
  PopularHashtag,
  RelatedHashtag,
  HashtagGroup
} from '@/services/hashtagsService';

/**
 * Estado de hashtags
 *
 * @interface SocialHashtagsState
 * @property {SocialHashtag[]} hashtags - Lista de hashtags
 * @property {SocialHashtag | null} selectedHashtag - Hashtag selecionada
 * @property {HashtagStats | null} hashtagsStats - Estatísticas de hashtags
 * @property {Object} pagination - Dados de paginação
 * @property {HashtagSearchParams} filters - Filtros de busca
 * @property {boolean} loading - Se está carregando
 * @property {string | null} error - Mensagem de erro
 * @property {boolean} creating - Se está criando
 * @property {boolean} updating - Se está atualizando
 * @property {boolean} deleting - Se está excluindo
 * @property {boolean} analyzing - Se está analisando
 */
interface SocialHashtagsState {
  // Estado das hashtags
  hashtags: SocialHashtag[];
  selectedHashtag: SocialHashtag | null;
  hashtagsStats: HashtagStats | null;
  // Estado de paginação
  pagination: {
    page: number;
  limit: number;
  total: number;
  totalPages: number; };

  // Estado de filtros
  filters: HashtagSearchParams;
  
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  
  // Estado de operações
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  analyzing: boolean;
  
  // Estado de sugestões e análises
  hashtagSuggestions: HashtagSuggestion[];
  trendingHashtags: TrendingHashtag[];
  popularHashtags: PopularHashtag[];
  relatedHashtags: RelatedHashtag[];
  hashtagAnalysis: Record<string, HashtagAnalysis>;
  hashtagGroups: HashtagGroup[];
  
  // Estado de seleção múltipla
  selectedHashtags: string[];
  bulkAction: string | null;
  
  // Estado de cache
  lastFetch: {
    hashtags: number | null;
    suggestions: number | null;
    trending: number | null;
    popular: number | null;
    related: number | null;
    analysis: number | null;
    groups: number | null;};

}

interface SocialHashtagsActions {
  // Ações de busca e listagem
  fetchHashtags: (params?: HashtagSearchParams) => Promise<void>;
  refreshHashtags: () => Promise<void>;
  searchHashtags: (query: string) => Promise<void>;
  // Ações de seleção
  selectHashtag?: (e: any) => void;
  clearSelection??: (e: any) => void;
  selectMultipleHashtags?: (e: any) => void;
  toggleHashtagSelection?: (e: any) => void;
  clearMultipleSelection??: (e: any) => void;
  // Ações de CRUD
  createHashtag: (hashtagData: CreateHashtagData) => Promise<SocialHashtag>;
  updateHashtag: (id: string, hashtagData: UpdateHashtagData) => Promise<SocialHashtag>;
  deleteHashtag: (id: string) => Promise<void>;
  duplicateHashtag: (id: string) => Promise<SocialHashtag>;
  // Ações de análise
  analyzeHashtag: (hashtag: string, platform: SocialPlatform) => Promise<void>;
  getHashtagAnalysis: (hashtag: string, platform: SocialPlatform) => HashtagAnalysis | null;
  // Ações de sugestões
  getHashtagSuggestions: (content: string, platform: SocialPlatform) => Promise<void>;
  getTrendingHashtags: (platform: SocialPlatform, limit?: number) => Promise<void>;
  getPopularHashtags: (platform: SocialPlatform, limit?: number) => Promise<void>;
  getRelatedHashtags: (hashtag: string, platform: SocialPlatform) => Promise<void>;
  // Ações de grupos
  fetchHashtagGroups: () => Promise<void>;
  createHashtagGroup: (groupData: Omit<HashtagGroup, 'id'>) => Promise<HashtagGroup>;
  updateHashtagGroup: (id: string, groupData: Partial<HashtagGroup>) => Promise<HashtagGroup>;
  deleteHashtagGroup: (id: string) => Promise<void>;
  // Ações de estatísticas
  fetchHashtagsStats: () => Promise<void>;
  // Ações de filtros
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  // Ações de paginação
  setPage?: (e: any) => void;
  setLimit?: (e: any) => void;
  // Ações de estado
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void;
  // Ações de cache
  clearCache??: (e: any) => void;
  invalidateCache?: (e: any) => void; }

// =========================================
// STORE DE HASHTAGS SOCIAIS
// =========================================

export const useSocialHashtagsStore = create<SocialHashtagsState & SocialHashtagsActions>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
        // ===== ESTADO INICIAL =====
        
        // Estado das hashtags
        hashtags: [],
        selectedHashtag: null,
        hashtagsStats: null,
        
        // Estado de paginação
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        },
        
        // Estado de filtros
        filters: {},
        
        // Estado de loading e erro
        loading: false,
        error: null,
        
        // Estado de operações
        creating: false,
        updating: false,
        deleting: false,
        analyzing: false,
        
        // Estado de sugestões e análises
        hashtagSuggestions: [],
        trendingHashtags: [],
        popularHashtags: [],
        relatedHashtags: [],
        hashtagAnalysis: {},
        hashtagGroups: [],
        
        // Estado de seleção múltipla
        selectedHashtags: [],
        bulkAction: null,
        
        // Estado de cache
        lastFetch: {
          hashtags: null,
          suggestions: null,
          trending: null,
          popular: null,
          related: null,
          analysis: null,
          groups: null
        },
        
        // ===== AÇÕES DE BUSCA E LISTAGEM =====
        
        fetchHashtags: async (params?: HashtagSearchParams) => {
          const { filters, pagination } = get();

          const finalParams = { 
            ...filters, 
            ...params,
            page: pagination.page,
            limit: pagination.limit};

          set({ loading: true, error: null });

          try {
            const response: HashtagPaginatedResponse = await hashtagsService.getHashtags(finalParams);

            set({
              hashtags: (response as any).data,
              pagination: {
                page: (response as any).page,
                limit: (response as any).limit,
                total: (response as any).total,
                totalPages: (response as any).total_pages
              },
              loading: false,
              lastFetch: { ...get().lastFetch, hashtags: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        refreshHashtags: async () => {
          const { fetchHashtags } = get();

          await fetchHashtags();

        },
        
        searchHashtags: async (query: string) => {
          const { fetchHashtags } = get();

          await fetchHashtags({ search: query });

        },
        
        // ===== AÇÕES DE SELEÇÃO =====
        
        selectHashtag: (hashtag: SocialHashtag | null) => {
          set({ selectedHashtag: hashtag });

        },
        
        clearSelection: () => {
          set({ selectedHashtag: null });

        },
        
        selectMultipleHashtags: (hashtagIds: string[]) => {
          set({ selectedHashtags: hashtagIds });

        },
        
        toggleHashtagSelection: (hashtagId: string) => {
          const { selectedHashtags } = get();

          const isSelected = selectedHashtags.includes(hashtagId);

          if (isSelected) {
            set({ selectedHashtags: selectedHashtags.filter(id => id !== hashtagId) });

          } else {
            set({ selectedHashtags: [...selectedHashtags, hashtagId] });

          } ,
        
        clearMultipleSelection: () => {
          set({ selectedHashtags: [], bulkAction: null });

        },
        
        // ===== AÇÕES DE CRUD =====
        
        createHashtag: async (hashtagData: CreateHashtagData) => {
          set({ creating: true, error: null });

          try {
            const newHashtag = await hashtagsService.createHashtag(hashtagData);

            set(state => ({
              hashtags: [newHashtag, ...state.hashtags],
              creating: false
            }));

            return newHashtag;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              creating: false
            });

            throw error;
          } ,
        
        updateHashtag: async (id: string, hashtagData: UpdateHashtagData) => {
          set({ updating: true, error: null });

          try {
            const updatedHashtag = await hashtagsService.updateHashtag(id, hashtagData);

            set(state => ({
              hashtags: state.hashtags.map(hashtag => 
                hashtag.id === id ? updatedHashtag : hashtag
              ),
              selectedHashtag: state.selectedHashtag?.id === id ? updatedHashtag : state.selectedHashtag,
              updating: false
            }));

            return updatedHashtag;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              updating: false
            });

            throw error;
          } ,
        
        deleteHashtag: async (id: string) => {
          set({ deleting: true, error: null });

          try {
            await hashtagsService.deleteHashtag(id);

            set(state => ({
              hashtags: state.hashtags.filter(hashtag => hashtag.id !== id),
              selectedHashtag: state.selectedHashtag?.id === id ? null : state.selectedHashtag,
              selectedHashtags: state.selectedHashtags.filter(hashtagId => hashtagId !== id),
              deleting: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              deleting: false
            });

            throw error;
          } ,
        
        duplicateHashtag: async (id: string) => {
          set({ creating: true, error: null });

          try {
            const duplicatedHashtag = await hashtagsService.duplicateHashtag(id);

            set(state => ({
              hashtags: [duplicatedHashtag, ...state.hashtags],
              creating: false
            }));

            return duplicatedHashtag;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              creating: false
            });

            throw error;
          } ,
        
        // ===== AÇÕES DE ANÁLISE =====
        
        analyzeHashtag: async (hashtag: string, platform: SocialPlatform) => {
          const key = `${hashtag}_${platform}`;
          
          set({ analyzing: true, error: null });

          try {
            const analysis = await hashtagsService.analyzeHashtag(hashtag, platform);

            set(state => ({
              hashtagAnalysis: { ...state.hashtagAnalysis, [key]: analysis },
              analyzing: false,
              lastFetch: { ...state.lastFetch, analysis: Date.now() } ));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              analyzing: false
            });

          } ,
        
        getHashtagAnalysis: (hashtag: string, platform: SocialPlatform) => {
          const { hashtagAnalysis } = get();

          const key = `${hashtag}_${platform}`;
          return hashtagAnalysis[key] || null;
        },
        
        // ===== AÇÕES DE SUGESTÕES =====
        
        getHashtagSuggestions: async (content: string, platform: SocialPlatform) => {
          set({ loading: true, error: null });

          try {
            const suggestions = await hashtagsService.getHashtagSuggestions(content, platform);

            set({
              hashtagSuggestions: suggestions,
              loading: false,
              lastFetch: { ...get().lastFetch, suggestions: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        getTrendingHashtags: async (platform: SocialPlatform, limit: number = 20) => {
          set({ loading: true, error: null });

          try {
            const trending = await hashtagsService.getTrendingHashtags(platform, limit);

            set({
              trendingHashtags: trending,
              loading: false,
              lastFetch: { ...get().lastFetch, trending: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        getPopularHashtags: async (platform: SocialPlatform, limit: number = 20) => {
          set({ loading: true, error: null });

          try {
            const popular = await hashtagsService.getPopularHashtags(platform, limit);

            set({
              popularHashtags: popular,
              loading: false,
              lastFetch: { ...get().lastFetch, popular: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        getRelatedHashtags: async (hashtag: string, platform: SocialPlatform) => {
          set({ loading: true, error: null });

          try {
            const related = await hashtagsService.getRelatedHashtags(hashtag, platform);

            set({
              relatedHashtags: related,
              loading: false,
              lastFetch: { ...get().lastFetch, related: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        // ===== AÇÕES DE GRUPOS =====
        
        fetchHashtagGroups: async () => {
          set({ loading: true, error: null });

          try {
            const groups = await hashtagsService.getHashtagGroups();

            set({
              hashtagGroups: groups,
              loading: false,
              lastFetch: { ...get().lastFetch, groups: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        createHashtagGroup: async (groupData: Omit<HashtagGroup, 'id'>) => {
          set({ creating: true, error: null });

          try {
            const newGroup = await hashtagsService.createHashtagGroup(groupData);

            set(state => ({
              hashtagGroups: [newGroup, ...state.hashtagGroups],
              creating: false
            }));

            return newGroup;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              creating: false
            });

            throw error;
          } ,
        
        updateHashtagGroup: async (id: string, groupData: Partial<HashtagGroup>) => {
          set({ updating: true, error: null });

          try {
            const updatedGroup = await hashtagsService.updateHashtagGroup(id, groupData);

            set(state => ({
              hashtagGroups: state.hashtagGroups.map(group => 
                group.id === id ? updatedGroup : group
              ),
              updating: false
            }));

            return updatedGroup;
          } catch (error) {
            set({
              error: getErrorMessage(error),
              updating: false
            });

            throw error;
          } ,
        
        deleteHashtagGroup: async (id: string) => {
          set({ deleting: true, error: null });

          try {
            await hashtagsService.deleteHashtagGroup(id);

            set(state => ({
              hashtagGroups: state.hashtagGroups.filter(group => group.id !== id),
              deleting: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              deleting: false
            });

            throw error;
          } ,
        
        // ===== AÇÕES DE ESTATÍSTICAS =====
        
        fetchHashtagsStats: async () => {
          set({ loading: true, error: null });

          try {
            const stats = await hashtagsService.getHashtagsStats();

            set({
              hashtagsStats: stats,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        // ===== AÇÕES DE FILTROS =====
        
        setFilters: (filters: Partial<HashtagSearchParams>) => {
          set(state => ({
            filters: { ...state.filters, ...filters } ));

        },
        
        clearFilters: () => {
          set({ filters: {} );

        },
        
        // ===== AÇÕES DE PAGINAÇÃO =====
        
        setPage: (page: number) => {
          set(state => ({
            pagination: { ...state.pagination, page } ));

        },
        
        setLimit: (limit: number) => {
          set(state => ({
            pagination: { ...state.pagination, limit, page: 1 } ));

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
          hashtagsService.clearCache();

          set({
            hashtags: [],
            hashtagSuggestions: [],
            trendingHashtags: [],
            popularHashtags: [],
            relatedHashtags: [],
            hashtagAnalysis: {},
            hashtagGroups: [],
            lastFetch: {
              hashtags: null,
              suggestions: null,
              trending: null,
              popular: null,
              related: null,
              analysis: null,
              groups: null
            } );

        },
        
        invalidateCache: (pattern: string) => {
          hashtagsService.invalidateCache(pattern);

        } ),
      {
        name: 'social-buffer-hashtags-store',
        partialize: (state: unknown) => ({
          filters: state.filters,
          pagination: state.pagination,
          lastFetch: state.lastFetch,
          hashtagAnalysis: state.hashtagAnalysis,
          hashtagGroups: state.hashtagGroups
        })
  }
    ),
    {
      name: 'SocialBufferHashtagsStore'
    }
  ));

export default useSocialHashtagsStore;
