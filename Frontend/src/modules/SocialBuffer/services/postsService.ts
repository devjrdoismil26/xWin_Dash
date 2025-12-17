/**
 * Serviço de Posts do SocialBuffer
 *
 * @description
 * Serviço responsável por todas as operações relacionadas a posts de redes sociais.
 * Gerencia CRUD de posts, validação, análise, otimização e cache.
 *
 * @module modules/SocialBuffer/services/postsService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { SocialPost, SocialPlatform, SocialPostStatus, SocialAccount } from '../types/socialTypes';

/**
 * Cache para posts
 *
 * @description
 * Cache em memória para posts com TTL de 2 minutos.
 */
const postsCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 2 * 60 * 1000; // 2 minutos (posts mudam mais frequentemente)

// Interface para parâmetros de busca
export interface PostsSearchParams {
  account_id?: number;
  platform?: SocialPlatform;
  status?: SocialPostStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// Interface para resposta paginada
export interface PostsPaginatedResponse {
  data: SocialPost[];
  total: number;
  page: number;
  limit: number;
  total_pages: number; }

// Interface para criação de post
export interface CreatePostData {
  content: string;
  account_id: number;
  platform: SocialPlatform;
  media_urls?: string[];
  scheduled_at?: string;
  hashtags?: string[];
  mentions?: string[];
  link_url?: string;
  link_title?: string;
  link_description?: string;
  [key: string]: unknown; }

// Interface para atualização de post
export interface UpdatePostData {
  content?: string;
  media_urls?: string[];
  scheduled_at?: string;
  hashtags?: string[];
  mentions?: string[];
  link_url?: string;
  link_title?: string;
  link_description?: string;
  [key: string]: unknown; }

// Interface para estatísticas de posts
export interface PostsStats {
  total_posts: number;
  published_posts: number;
  scheduled_posts: number;
  draft_posts: number;
  failed_posts: number;
  posts_by_platform: Record<SocialPlatform, number>;
  posts_by_status: Record<SocialPostStatus, number>;
  average_engagement_rate: number;
  total_engagement: number; }

// Interface para análise de conteúdo
export interface ContentAnalysis {
  word_count: number;
  hashtag_count: number;
  mention_count: number;
  link_count: number;
  sentiment_score: number;
  readability_score: number;
  suggested_improvements: string[];
  optimal_posting_time?: string; }

// Interface para sugestões de hashtags
export interface HashtagSuggestions {
  trending: string[];
  relevant: string[];
  popular: string[];
  niche: string[];
  engagement_boost: string[]; }

/**
 * Service para gerenciamento de posts sociais
 * Responsável por criação, edição, publicação e análise de posts
 */
class PostsService {
  private baseUrl = '/api/social-buffer/posts';

  /**
   * Busca posts com filtros
   */
  async getPosts(params: PostsSearchParams = {}): Promise<PostsPaginatedResponse> {
    try {
      const cacheKey = `posts_${JSON.stringify(params)}`;
      const cached = postsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl, { params });

      const result = {
        data: (response as any).data.data || (response as any).data,
        total: (response as any).data.total || ((response.data || []) as unknown[]).length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || ((response.data || []) as unknown[]).length) / (params.limit || 10))};

      // Cache do resultado
      postsCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      console.error('Erro ao buscar posts:', error);

      throw new Error('Falha ao carregar posts');

    } /**
   * Busca um post específico por ID
   */
  async getPostById(id: number): Promise<SocialPost> {
    try {
      const cacheKey = `post_${id}`;
      const cached = postsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);

      // Cache do resultado
      postsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao buscar post ${id}:`, error);

      throw new Error('Falha ao carregar post');

    } /**
   * Cria um novo post
   */
  async createPost(data: CreatePostData): Promise<SocialPost> {
    try {
      // Validação básica
      this.validatePostData(data);

      const response = await apiClient.post(this.baseUrl, data);

      // Limpar cache relacionado
      this.clearPostsCache();

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao criar post:', error);

      throw new Error('Falha ao criar post');

    } /**
   * Atualiza um post existente
   */
  async updatePost(id: number, data: UpdatePostData): Promise<SocialPost> {
    try {
      // Validação básica
      if (data.content !== undefined) {
        this.validatePostContent(data.content);

      }

      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);

      // Limpar cache relacionado
      this.clearPostsCache();

      postsCache.delete(`post_${id}`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao atualizar post ${id}:`, error);

      throw new Error('Falha ao atualizar post');

    } /**
   * Remove um post
   */
  async deletePost(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);

      // Limpar cache relacionado
      this.clearPostsCache();

      postsCache.delete(`post_${id}`);

    } catch (error) {
      console.error(`Erro ao remover post ${id}:`, error);

      throw new Error('Falha ao remover post');

    } /**
   * Publica um post imediatamente
   */
  async publishPost(id: number): Promise<SocialPost> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/publish`);

      // Limpar cache relacionado
      this.clearPostsCache();

      postsCache.delete(`post_${id}`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao publicar post ${id}:`, error);

      throw new Error('Falha ao publicar post');

    } /**
   * Agenda um post
   */
  async schedulePost(id: number, scheduledAt: string): Promise<SocialPost> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/schedule`, {
        scheduled_at: scheduledAt
      });

      // Limpar cache relacionado
      this.clearPostsCache();

      postsCache.delete(`post_${id}`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao agendar post ${id}:`, error);

      throw new Error('Falha ao agendar post');

    } /**
   * Cancela agendamento de um post
   */
  async cancelSchedule(id: number): Promise<SocialPost> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/cancel-schedule`);

      // Limpar cache relacionado
      this.clearPostsCache();

      postsCache.delete(`post_${id}`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao cancelar agendamento do post ${id}:`, error);

      throw new Error('Falha ao cancelar agendamento');

    } /**
   * Duplica um post
   */
  async duplicatePost(id: number, modifications?: Partial<CreatePostData>): Promise<SocialPost> {
    try {
      const originalPost = await this.getPostById(id);

      const duplicateData: CreatePostData = {
        content: modifications?.content || originalPost.content,
        account_id: modifications?.account_id || originalPost.account_id,
        platform: modifications?.platform || originalPost.platform,
        media_urls: modifications?.media_urls || originalPost.media_urls,
        hashtags: modifications?.hashtags || this.extractHashtags(originalPost.content),
        mentions: modifications?.mentions || this.extractMentions(originalPost.content)};

      return await this.createPost(duplicateData);

    } catch (error) {
      console.error(`Erro ao duplicar post ${id}:`, error);

      throw new Error('Falha ao duplicar post');

    } /**
   * Obtém estatísticas dos posts
   */
  async getPostsStats(accountId?: number): Promise<PostsStats> {
    try {
      const cacheKey = `posts_stats_${accountId || 'all'}`;
      const cached = postsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const url = accountId ? `${this.baseUrl}/stats/${accountId}` : `${this.baseUrl}/stats`;
      const response = await apiClient.get(url);

      // Cache do resultado
      postsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter estatísticas dos posts:', error);

      throw new Error('Falha ao obter estatísticas dos posts');

    } /**
   * Analisa conteúdo de um post
   */
  async analyzeContent(content: string): Promise<ContentAnalysis> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/analyze-content`, {
        content
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao analisar conteúdo:', error);

      throw new Error('Falha ao analisar conteúdo');

    } /**
   * Obtém sugestões de hashtags
   */
  async getHashtagSuggestions(content: string, platform: SocialPlatform): Promise<HashtagSuggestions> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/hashtag-suggestions`, {
        content,
        platform
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter sugestões de hashtags:', error);

      throw new Error('Falha ao obter sugestões de hashtags');

    } /**
   * Obtém horário ideal para postar
   */
  async getOptimalPostingTime(accountId: number, platform: SocialPlatform): Promise<string[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/optimal-posting-time`, {
        params: { account_id: accountId, platform } );

      return (response as any).data.optimal_times || [];
    } catch (error) {
      console.error('Erro ao obter horário ideal para postar:', error);

      throw new Error('Falha ao obter horário ideal para postar');

    } /**
   * Busca posts por status
   */
  async getPostsByStatus(status: SocialPostStatus, accountId?: number): Promise<SocialPost[]> {
    try {
      const result = await this.getPosts({ 
        status, 
        account_id: accountId,
        limit: 1000 
      });

      return result.data;
    } catch (error) {
      console.error(`Erro ao buscar posts por status ${status}:`, error);

      throw new Error('Falha ao buscar posts por status');

    } /**
   * Busca posts agendados
   */
  async getScheduledPosts(accountId?: number): Promise<SocialPost[]> {
    return this.getPostsByStatus('scheduled', accountId);

  }

  /**
   * Busca posts publicados
   */
  async getPublishedPosts(accountId?: number): Promise<SocialPost[]> {
    return this.getPostsByStatus('published', accountId);

  }

  /**
   * Busca posts em rascunho
   */
  async getDraftPosts(accountId?: number): Promise<SocialPost[]> {
    return this.getPostsByStatus('draft', accountId);

  }

  /**
   * Extrai hashtags do conteúdo
   */
  private extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    return content.match(hashtagRegex) || [];
  }

  /**
   * Extrai menções do conteúdo
   */
  private extractMentions(content: string): string[] {
    const mentionRegex = /@[\w\u0590-\u05ff]+/g;
    return content.match(mentionRegex) || [];
  }

  /**
   * Valida dados básicos do post
   */
  private validatePostData(data: CreatePostData): void {
    if (!data.content || (data as any).content.trim().length === 0) {
      throw new Error('Conteúdo do post é obrigatório');

    }

    if (data.content.length > 2000) {
      throw new Error('Conteúdo do post deve ter no máximo 2000 caracteres');

    }

    if (!data.account_id) {
      throw new Error('ID da conta é obrigatório');

    }

    if (!data.platform) {
      throw new Error('Plataforma é obrigatória');

    } /**
   * Valida conteúdo do post
   */
  private validatePostContent(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new Error('Conteúdo do post é obrigatório');

    }

    if (content.length > 2000) {
      throw new Error('Conteúdo do post deve ter no máximo 2000 caracteres');

    } /**
   * Limpa cache de posts
   */
  private clearPostsCache(): void {
    postsCache.clear();

  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of postsCache.keys()) {
        if (key.includes(pattern)) {
          postsCache.delete(key);

        } } else {
      postsCache.clear();

    } /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: postsCache.size,
      keys: Array.from(postsCache.keys())};

  } // Instância singleton
export const postsService = new PostsService();

export default postsService;
