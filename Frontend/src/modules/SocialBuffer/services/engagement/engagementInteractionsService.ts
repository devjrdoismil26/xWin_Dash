/**
 * Serviço de Interações de Engajamento do SocialBuffer
 *
 * @description
 * Serviço responsável por interações de engajamento incluindo likes, comentários,
 * shares, saves e reações. Gerencia cache com TTL curto devido à alta frequência.
 *
 * @module modules/SocialBuffer/services/engagement/engagementInteractionsService
 * @since 1.0.0
 */

import { apiClient } from '@/services';

/**
 * Cache para interações de engajamento
 *
 * @description
 * Cache em memória para interações com TTL de 1 minuto (interações mudam muito frequentemente).
 */
const interactionsCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 1 * 60 * 1000; // 1 minuto (interações mudam muito frequentemente)

// Interface para parâmetros de engajamento
export interface EngagementParams {
  date_from?: string;
  date_to?: string;
  account_id?: string;
  platform?: string;
  post_id?: string;
  engagement_type?: 'likes' | 'comments' | 'shares' | 'saves' | 'reactions';
  group_by?: 'hour' | 'day' | 'week' | 'month'; }

// Interface para interações
export interface Interaction {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  type: 'like' | 'comment' | 'share' | 'save' | 'reaction';
  content?: string;
  // para comentários
  reaction_type?: string;
  // para reações específicas
  timestamp: string;
  platform: string;
  metadata?: {
    location?: string;
  device?: string;
  browser?: string; };

}

// Interface para comentários
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  timestamp: string;
  platform: string;
  likes_count: number;
  replies_count: number;
  is_verified: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative';
  metadata?: {
    location?: string;
  device?: string;
  browser?: string; };

}

// Interface para reações
export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  reaction_type: string;
  timestamp: string;
  platform: string;
  metadata?: {
    location?: string;
  device?: string;
  browser?: string; };

}

// Interface para compartilhamentos
export interface Share {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  share_type: 'retweet' | 'repost' | 'share' | 'forward';
  timestamp: string;
  platform: string;
  metadata?: {
    location?: string;
  device?: string;
  browser?: string; };

}

// =========================================
// SERVIÇO DE INTERAÇÕES DE ENGAJAMENTO
// =========================================

class EngagementInteractionsService {
  // ===== INTERAÇÕES =====

  /**
   * Buscar interações de um post
   */
  async getPostInteractions(postId: string, params: {
    type?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ data: Interaction[]; total: number; page: number; limit: number }> {
    const cacheKey = `post_interactions_${postId}_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = interactionsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get(`/engagement/interactions/post/${postId}`, { params });

      const data = (response as any).data;

      // Salvar no cache
      interactionsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar interações do post:', error);

      throw new Error('Falha ao buscar interações do post');

    } /**
   * Buscar todas as interações
   */
  async getAllInteractions(params: EngagementParams & {
    page?: number;
    limit?: number;
  } = {}): Promise<{ data: Interaction[]; total: number; page: number; limit: number }> {
    const cacheKey = `all_interactions_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = interactionsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get('/engagement/interactions', { params });

      const data = (response as any).data;

      // Salvar no cache
      interactionsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar todas as interações:', error);

      throw new Error('Falha ao buscar todas as interações');

    } // ===== COMENTÁRIOS =====

  /**
   * Buscar comentários de um post
   */
  async getPostComments(postId: string, params: {
    page?: number;
    limit?: number;
    sort_by?: 'newest' | 'oldest' | 'most_liked';
  } = {}): Promise<{ data: Comment[]; total: number; page: number; limit: number }> {
    const cacheKey = `post_comments_${postId}_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = interactionsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get(`/engagement/comments/post/${postId}`, { params });

      const data = (response as any).data;

      // Salvar no cache
      interactionsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar comentários do post:', error);

      throw new Error('Falha ao buscar comentários do post');

    } /**
   * Responder a um comentário
   */
  async replyToComment(commentId: string, content: string): Promise<Comment> {
    try {
      const response = await apiClient.post(`/engagement/comments/${commentId}/reply`, {
        content
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao responder comentário:', error);

      throw new Error('Falha ao responder comentário');

    } /**
   * Curtir um comentário
   */
  async likeComment(commentId: string): Promise<void> {
    try {
      await apiClient.post(`/engagement/comments/${commentId}/like`);

    } catch (error) {
      console.error('Erro ao curtir comentário:', error);

      throw new Error('Falha ao curtir comentário');

    } /**
   * Deletar comentário
   */
  async deleteComment(commentId: string): Promise<void> {
    try {
      await apiClient.delete(`/engagement/comments/${commentId}`);

    } catch (error) {
      console.error('Erro ao deletar comentário:', error);

      throw new Error('Falha ao deletar comentário');

    } // ===== REAÇÕES =====

  /**
   * Buscar reações de um post
   */
  async getPostReactions(postId: string): Promise<Reaction[]> {
    const cacheKey = `post_reactions_${postId}`;
    
    // Verificar cache
    const cached = interactionsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get(`/engagement/reactions/post/${postId}`);

      const data = (response as any).data;

      // Salvar no cache
      interactionsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar reações do post:', error);

      throw new Error('Falha ao buscar reações do post');

    } /**
   * Adicionar reação a um post
   */
  async addReaction(postId: string, reactionType: string): Promise<Reaction> {
    try {
      const response = await apiClient.post(`/engagement/reactions/post/${postId}`, {
        reaction_type: reactionType
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao adicionar reação:', error);

      throw new Error('Falha ao adicionar reação');

    } /**
   * Remover reação de um post
   */
  async removeReaction(postId: string, reactionType: string): Promise<void> {
    try {
      await apiClient.delete(`/engagement/reactions/post/${postId}`, {
        data: { reaction_type: reactionType } );

    } catch (error) {
      console.error('Erro ao remover reação:', error);

      throw new Error('Falha ao remover reação');

    } // ===== COMPARTILHAMENTOS =====

  /**
   * Buscar compartilhamentos de um post
   */
  async getPostShares(postId: string, params: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ data: Share[]; total: number; page: number; limit: number }> {
    const cacheKey = `post_shares_${postId}_${JSON.stringify(params)}`;
    
    // Verificar cache
    const cached = interactionsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const response = await apiClient.get(`/engagement/shares/post/${postId}`, { params });

      const data = (response as any).data;

      // Salvar no cache
      interactionsCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Erro ao buscar compartilhamentos do post:', error);

      throw new Error('Falha ao buscar compartilhamentos do post');

    } /**
   * Compartilhar um post
   */
  async sharePost(postId: string, shareType: string, message?: string): Promise<Share> {
    try {
      const response = await apiClient.post(`/engagement/shares/post/${postId}`, {
        share_type: shareType,
        message
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao compartilhar post:', error);

      throw new Error('Falha ao compartilhar post');

    } // ===== UTILITÁRIOS =====

  /**
   * Limpar cache de interações
   */
  clearCache(): void {
    interactionsCache.clear();

  }

  /**
   * Invalidar cache específico
   */
  invalidateCache(pattern: string): void {
    for (const key of interactionsCache.keys()) {
      if (key.includes(pattern)) {
        interactionsCache.delete(key);

      } }

  /**
   * Analisar sentimento de comentário
   */
  analyzeCommentSentiment(content: string): 'positive' | 'neutral' | 'negative' {
    // Implementação básica de análise de sentimento
    const positiveWords = ['bom', 'ótimo', 'excelente', 'fantástico', 'incrível', 'amor', 'adoro'];
    const negativeWords = ['ruim', 'péssimo', 'horrível', 'odio', 'detesto', 'terrível'];
    
    const lowerContent = content.toLowerCase();

    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Filtrar interações por tipo
   */
  filterInteractionsByType(interactions: Interaction[], type: string): Interaction[] {
    return interactions.filter(interaction => interaction.type === type);

  }

  /**
   * Agrupar interações por usuário
   */
  groupInteractionsByUser(interactions: Interaction[]): Record<string, Interaction[]> {
    return interactions.reduce((groups: unknown, interaction: unknown) => {
      const userId = interaction.user_id;
      if (!groups[userId]) {
        groups[userId] = [];
      }
      groups[userId].push(interaction);

      return groups;
    }, {} as Record<string, Interaction[]>);

  } // =========================================
// EXPORTAÇÃO
// =========================================

export const engagementInteractionsService = new EngagementInteractionsService();

export default engagementInteractionsService;
