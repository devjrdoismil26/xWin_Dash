/**
 * Hook useSocialEngagementStore - Store de Engajamento
 *
 * @description
 * Store Zustand para gerenciamento de estado de engajamento do SocialBuffer.
 * Gerencia monitoramento, interações, análises, insights, previsões e alertas.
 *
 * @module modules/SocialBuffer/hooks/engagement/useSocialEngagementStore
 * @since 1.0.0
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { engagementService } from '@/services/engagement/engagementService';
import { SocialPost } from '@/types/socialTypes';
import { getErrorMessage } from '@/utils/errorHelpers';
import type {
  EngagementParams,
  EngagementData,
  EngagementMonitoring,
  EngagementAlert,
  Interaction,
  Comment,
  Reaction,
  Share,
  EngagementAnalysis,
  EngagementInsights,
  EngagementForecast
} from '@/services/engagement/engagementService';

/**
 * Estado de engajamento
 *
 * @interface SocialEngagementState
 * @property {EngagementMonitoring[]} monitoredPosts - Posts monitorados
 * @property {EngagementAlert[]} engagementAlerts - Alertas de engajamento
 * @property {Record<string, Interaction[]>} postInteractions - Interações por post
 * @property {Record<string, Comment[]>} postComments - Comentários por post
 * @property {Record<string, Reaction[]>} postReactions - Reações por post
 * @property {Record<string, Share[]>} postShares - Shares por post
 * @property {Record<string, EngagementAnalysis>} engagementAnalysis - Análises por post
 * @property {EngagementInsights | null} engagementInsights - Insights gerais
 * @property {Record<string, EngagementForecast>} engagementForecasts - Previsões por post
 * @property {boolean} loading - Se está carregando
 * @property {string | null} error - Mensagem de erro
 * @property {boolean} monitoring - Se está monitorando
 * @property {boolean} fetchingInteractions - Se está buscando interações
 * @property {boolean} analyzing - Se está analisando
 * @property {boolean} generatingInsights - Se está gerando insights
 * @property {boolean} forecasting - Se está fazendo previsão
 * @property {EngagementParams} filters - Filtros de engajamento
 */
interface SocialEngagementState {
  // Estado de monitoramento
  monitoredPosts: EngagementMonitoring[];
  engagementAlerts: EngagementAlert[];
  // Estado de interações
  postInteractions: Record<string, Interaction[]>;
  postComments: Record<string, Comment[]>;
  postReactions: Record<string, Reaction[]>;
  postShares: Record<string, Share[]>;
  // Estado de análises
  engagementAnalysis: Record<string, EngagementAnalysis>;
  engagementInsights: EngagementInsights | null;
  engagementForecasts: Record<string, EngagementForecast>;
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  // Estado de operações
  monitoring: boolean;
  fetchingInteractions: boolean;
  analyzing: boolean;
  generatingInsights: boolean;
  forecasting: boolean;
  // Estado de filtros
  filters: EngagementParams;
  // Estado de seleção
  selectedPost: string | null;
  selectedAlerts: string[];
  // Estado de cache
  lastFetch: {
    monitoring: number | null;
  interactions: number | null;
  analysis: number | null;
  insights: number | null;
  forecasts: number | null; };

}

interface SocialEngagementActions {
  // Ações de monitoramento
  startMonitoring: (postId: string, settings?: string) => Promise<void>;
  stopMonitoring: (postId: string) => Promise<void>;
  getMonitoringStatus: (postId: string) => Promise<void>;
  updateMonitoringSettings: (postId: string, settings: unknown) => Promise<void>;
  listMonitoredPosts: (params?: string) => Promise<void>;
  // Ações de alertas
  getEngagementAlerts: (params?: string) => Promise<void>;
  markAlertAsRead: (alertId: string) => Promise<void>;
  markAllAlertsAsRead: () => Promise<void>;
  deleteAlert: (alertId: string) => Promise<void>;
  // Ações de interações
  getPostInteractions: (postId: string, params?: string) => Promise<void>;
  getAllInteractions: (params?: string) => Promise<void>;
  // Ações de comentários
  getPostComments: (postId: string, params?: string) => Promise<void>;
  replyToComment: (commentId: string, content: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  // Ações de reações
  getPostReactions: (postId: string) => Promise<void>;
  addReaction: (postId: string, reactionType: string) => Promise<void>;
  removeReaction: (postId: string, reactionType: string) => Promise<void>;
  // Ações de compartilhamentos
  getPostShares: (postId: string, params?: string) => Promise<void>;
  sharePost: (postId: string, shareType: string, message?: string) => Promise<void>;
  // Ações de análise
  analyzePostEngagement: (postId: string) => Promise<void>;
  analyzeMultiplePosts: (postIds: string[]) => Promise<void>;
  analyzeEngagementByPeriod: (params: unknown) => Promise<void>;
  // Ações de insights
  getEngagementInsights: (params: unknown) => Promise<void>;
  getInsightsByType: (type: string, params: unknown) => Promise<void>;
  // Ações de previsões
  forecastPostEngagement: (postId: string) => Promise<void>;
  forecastEngagementByContent: (content: unknown) => Promise<void>;
  // Ações de seleção
  selectPost?: (e: any) => void;
  selectAlerts?: (e: any) => void;
  clearSelection??: (e: any) => void;
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
// STORE DE ENGAJAMENTO SOCIAL
// =========================================

export const useSocialEngagementStore = create<SocialEngagementState & SocialEngagementActions>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
        // ===== ESTADO INICIAL =====
        
        // Estado de monitoramento
        monitoredPosts: [],
        engagementAlerts: [],
        
        // Estado de interações
        postInteractions: {},
        postComments: {},
        postReactions: {},
        postShares: {},
        
        // Estado de análises
        engagementAnalysis: {},
        engagementInsights: null,
        engagementForecasts: {},
        
        // Estado de loading e erro
        loading: false,
        error: null,
        
        // Estado de operações
        monitoring: false,
        fetchingInteractions: false,
        analyzing: false,
        generatingInsights: false,
        forecasting: false,
        
        // Estado de filtros
        filters: {},
        
        // Estado de seleção
        selectedPost: null,
        selectedAlerts: [],
        
        // Estado de cache
        lastFetch: {
          monitoring: null,
          interactions: null,
          analysis: null,
          insights: null,
          forecasts: null
        },
        
        // ===== AÇÕES DE MONITORAMENTO =====
        
        startMonitoring: async (postId: string, settings?: string) => {
          set({ monitoring: true, error: null });

          try {
            const monitoring = await engagementService.startMonitoring(postId, settings);

            set(state => ({
              monitoredPosts: [...state.monitoredPosts, monitoring],
              monitoring: false,
              lastFetch: { ...state.lastFetch, monitoring: Date.now() } ));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              monitoring: false
            });

          } ,
        
        stopMonitoring: async (postId: string) => {
          set({ monitoring: true, error: null });

          try {
            await engagementService.stopMonitoring(postId);

            set(state => ({
              monitoredPosts: state.monitoredPosts.filter(post => post.post_id !== postId),
              monitoring: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              monitoring: false
            });

          } ,
        
        getMonitoringStatus: async (postId: string) => {
          set({ monitoring: true, error: null });

          try {
            const status = await engagementService.getMonitoringStatus(postId);

            set(state => ({
              monitoredPosts: state.monitoredPosts.map(post => 
                post.post_id === postId ? status : post
              ),
              monitoring: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              monitoring: false
            });

          } ,
        
        updateMonitoringSettings: async (postId: string, settings: unknown) => {
          set({ monitoring: true, error: null });

          try {
            const updatedMonitoring = await engagementService.updateMonitoringSettings(postId, settings);

            set(state => ({
              monitoredPosts: state.monitoredPosts.map(post => 
                post.post_id === postId ? updatedMonitoring : post
              ),
              monitoring: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              monitoring: false
            });

          } ,
        
        listMonitoredPosts: async (params?: string) => {
          set({ loading: true, error: null });

          try {
            const response = await engagementService.listMonitoredPosts(params);

            set({
              monitoredPosts: (response as any).data,
              loading: false,
              lastFetch: { ...get().lastFetch, monitoring: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        // ===== AÇÕES DE ALERTAS =====
        
        getEngagementAlerts: async (params?: string) => {
          set({ loading: true, error: null });

          try {
            const response = await engagementService.getEngagementAlerts(params);

            set({
              engagementAlerts: (response as any).data,
              loading: false
            });

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        markAlertAsRead: async (alertId: string) => {
          set({ loading: true, error: null });

          try {
            await engagementService.markAlertAsRead(alertId);

            set(state => ({
              engagementAlerts: state.engagementAlerts.map(alert => 
                alert.id === alertId ? { ...alert, is_read: true } : alert
              ),
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        markAllAlertsAsRead: async () => {
          set({ loading: true, error: null });

          try {
            await engagementService.markAllAlertsAsRead();

            set(state => ({
              engagementAlerts: state.engagementAlerts.map(alert => ({ ...alert, is_read: true })),
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        deleteAlert: async (alertId: string) => {
          set({ loading: true, error: null });

          try {
            await engagementService.deleteAlert(alertId);

            set(state => ({
              engagementAlerts: state.engagementAlerts.filter(alert => alert.id !== alertId),
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        // ===== AÇÕES DE INTERAÇÕES =====
        
        getPostInteractions: async (postId: string, params?: string) => {
          set({ fetchingInteractions: true, error: null });

          try {
            const response = await engagementService.getPostInteractions(postId, params);

            set(state => ({
              postInteractions: { ...state.postInteractions, [postId]: (response as any).data },
              fetchingInteractions: false,
              lastFetch: { ...state.lastFetch, interactions: Date.now() } ));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingInteractions: false
            });

          } ,
        
        getAllInteractions: async (params?: string) => {
          set({ fetchingInteractions: true, error: null });

          try {
            const response = await engagementService.getAllInteractions(params);

            set({
              postInteractions: (response as any).data.reduce((acc: unknown, interaction: unknown) => {
                if (!acc[interaction.post_id]) {
                  acc[interaction.post_id] = [];
                }
                acc[interaction.post_id].push(interaction);

                return acc;
              }, {} as Record<string, Interaction[]>),
              fetchingInteractions: false,
              lastFetch: { ...get().lastFetch, interactions: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingInteractions: false
            });

          } ,
        
        // ===== AÇÕES DE COMENTÁRIOS =====
        
        getPostComments: async (postId: string, params?: string) => {
          set({ fetchingInteractions: true, error: null });

          try {
            const response = await engagementService.getPostComments(postId, params);

            set(state => ({
              postComments: { ...state.postComments, [postId]: (response as any).data },
              fetchingInteractions: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingInteractions: false
            });

          } ,
        
        replyToComment: async (commentId: string, content: string) => {
          set({ loading: true, error: null });

          try {
            const reply = await engagementService.replyToComment(commentId, content);

            set(state => ({
              postComments: Object.fromEntries(
                Object.entries(state.postComments).map(([postId, comments]) => [
                  postId,
                  comments.map(comment => 
                    comment.id === commentId 
                      ? { ...comment, replies_count: comment.replies_count + 1 }
                      : comment
                  )
                ])
              ),
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        likeComment: async (commentId: string) => {
          set({ loading: true, error: null });

          try {
            await engagementService.likeComment(commentId);

            set(state => ({
              postComments: Object.fromEntries(
                Object.entries(state.postComments).map(([postId, comments]) => [
                  postId,
                  comments.map(comment => 
                    comment.id === commentId 
                      ? { ...comment, likes_count: comment.likes_count + 1 }
                      : comment
                  )
                ])
              ),
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        deleteComment: async (commentId: string) => {
          set({ loading: true, error: null });

          try {
            await engagementService.deleteComment(commentId);

            set(state => ({
              postComments: Object.fromEntries(
                Object.entries(state.postComments).map(([postId, comments]) => [
                  postId,
                  comments.filter(comment => comment.id !== commentId)
                ])
              ),
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        // ===== AÇÕES DE REAÇÕES =====
        
        getPostReactions: async (postId: string) => {
          set({ fetchingInteractions: true, error: null });

          try {
            const reactions = await engagementService.getPostReactions(postId);

            set(state => ({
              postReactions: { ...state.postReactions, [postId]: reactions },
              fetchingInteractions: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingInteractions: false
            });

          } ,
        
        addReaction: async (postId: string, reactionType: string) => {
          set({ loading: true, error: null });

          try {
            const newReaction = await engagementService.addReaction(postId, reactionType);

            set(state => ({
              postReactions: {
                ...state.postReactions,
                [postId]: [...(state.postReactions[postId] || []), newReaction]
              },
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        removeReaction: async (postId: string, reactionType: string) => {
          set({ loading: true, error: null });

          try {
            await engagementService.removeReaction(postId, reactionType);

            set(state => ({
              postReactions: {
                ...state.postReactions,
                [postId]: (state.postReactions[postId] || []).filter(
                  reaction => reaction.reaction_type !== reactionType
                )
  },
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        // ===== AÇÕES DE COMPARTILHAMENTOS =====
        
        getPostShares: async (postId: string, params?: string) => {
          set({ fetchingInteractions: true, error: null });

          try {
            const response = await engagementService.getPostShares(postId, params);

            set(state => ({
              postShares: { ...state.postShares, [postId]: (response as any).data },
              fetchingInteractions: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              fetchingInteractions: false
            });

          } ,
        
        sharePost: async (postId: string, shareType: string, message?: string) => {
          set({ loading: true, error: null });

          try {
            const newShare = await engagementService.sharePost(postId, shareType, message);

            set(state => ({
              postShares: {
                ...state.postShares,
                [postId]: [...(state.postShares[postId] || []), newShare]
              },
              loading: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              loading: false
            });

          } ,
        
        // ===== AÇÕES DE ANÁLISE =====
        
        analyzePostEngagement: async (postId: string) => {
          set({ analyzing: true, error: null });

          try {
            const analysis = await engagementService.analyzePostEngagement(postId);

            set(state => ({
              engagementAnalysis: { ...state.engagementAnalysis, [postId]: analysis },
              analyzing: false,
              lastFetch: { ...state.lastFetch, analysis: Date.now() } ));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              analyzing: false
            });

          } ,
        
        analyzeMultiplePosts: async (postIds: string[]) => {
          set({ analyzing: true, error: null });

          try {
            const analyses = await engagementService.analyzeMultiplePosts(postIds);

            const analysisMap = analyses.reduce((acc: unknown, analysis: unknown) => {
              acc[analysis.post_id] = analysis;
              return acc;
            }, {} as Record<string, EngagementAnalysis>);

            set(state => ({
              engagementAnalysis: { ...state.engagementAnalysis, ...analysisMap },
              analyzing: false,
              lastFetch: { ...state.lastFetch, analysis: Date.now() } ));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              analyzing: false
            });

          } ,
        
        analyzeEngagementByPeriod: async (params: unknown) => {
          set({ analyzing: true, error: null });

          try {
            const analyses = await engagementService.analyzeEngagementByPeriod(params);

            const analysisMap = analyses.reduce((acc: unknown, analysis: unknown) => {
              acc[analysis.post_id] = analysis;
              return acc;
            }, {} as Record<string, EngagementAnalysis>);

            set(state => ({
              engagementAnalysis: { ...state.engagementAnalysis, ...analysisMap },
              analyzing: false,
              lastFetch: { ...state.lastFetch, analysis: Date.now() } ));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              analyzing: false
            });

          } ,
        
        // ===== AÇÕES DE INSIGHTS =====
        
        getEngagementInsights: async (params: unknown) => {
          set({ generatingInsights: true, error: null });

          try {
            const insights = await engagementService.getEngagementInsights(params);

            set({
              engagementInsights: insights,
              generatingInsights: false,
              lastFetch: { ...get().lastFetch, insights: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              generatingInsights: false
            });

          } ,
        
        getInsightsByType: async (type: string, params: unknown) => {
          set({ generatingInsights: true, error: null });

          try {
            const insights = await engagementService.getInsightsByType(type, params);

            set(state => ({
              engagementInsights: {
                ...state.engagementInsights,
                insights: insights
              } as EngagementInsights,
              generatingInsights: false
            }));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              generatingInsights: false
            });

          } ,
        
        // ===== AÇÕES DE PREVISÕES =====
        
        forecastPostEngagement: async (postId: string) => {
          set({ forecasting: true, error: null });

          try {
            const forecast = await engagementService.forecastPostEngagement(postId);

            set(state => ({
              engagementForecasts: { ...state.engagementForecasts, [postId]: forecast },
              forecasting: false,
              lastFetch: { ...state.lastFetch, forecasts: Date.now() } ));

          } catch (error) {
            set({
              error: getErrorMessage(error),
              forecasting: false
            });

          } ,
        
        forecastEngagementByContent: async (content: unknown) => {
          set({ forecasting: true, error: null });

          try {
            const forecast = await engagementService.forecastEngagementByContent(content);

            set({
              engagementForecasts: { ...get().engagementForecasts, [content.id || 'content']: forecast },
              forecasting: false,
              lastFetch: { ...get().lastFetch, forecasts: Date.now() } );

          } catch (error) {
            set({
              error: getErrorMessage(error),
              forecasting: false
            });

          } ,
        
        // ===== AÇÕES DE SELEÇÃO =====
        
        selectPost: (postId: string | null) => {
          set({ selectedPost: postId });

        },
        
        selectAlerts: (alertIds: string[]) => {
          set({ selectedAlerts: alertIds });

        },
        
        clearSelection: () => {
          set({ selectedPost: null, selectedAlerts: [] });

        },
        
        // ===== AÇÕES DE FILTROS =====
        
        setFilters: (filters: Partial<EngagementParams>) => {
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
          engagementService.clearCache();

          set({
            monitoredPosts: [],
            engagementAlerts: [],
            postInteractions: {},
            postComments: {},
            postReactions: {},
            postShares: {},
            engagementAnalysis: {},
            engagementInsights: null,
            engagementForecasts: {},
            lastFetch: {
              monitoring: null,
              interactions: null,
              analysis: null,
              insights: null,
              forecasts: null
            } );

        },
        
        invalidateCache: (pattern: string) => {
          engagementService.invalidateCache(pattern);

        } ),
      {
        name: 'social-buffer-engagement-store',
        partialize: (state: unknown) => ({
          filters: state.filters,
          lastFetch: state.lastFetch,
          engagementAnalysis: state.engagementAnalysis,
          engagementInsights: state.engagementInsights,
          engagementForecasts: state.engagementForecasts
        })
  }
    ),
    {
      name: 'SocialBufferEngagementStore'
    }
  ));

export default useSocialEngagementStore;
