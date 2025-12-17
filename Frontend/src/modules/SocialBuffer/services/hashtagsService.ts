/**
 * Serviço de Hashtags do SocialBuffer
 *
 * @description
 * Serviço responsável por todas as operações relacionadas a hashtags.
 * Gerencia CRUD de hashtags, análise, sugestões, validação e cache.
 *
 * @module modules/SocialBuffer/services/hashtagsService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { SocialHashtag, SocialPlatform } from '../types/socialTypes';

/**
 * Cache para hashtags
 *
 * @description
 * Cache em memória para hashtags com TTL de 10 minutos.
 */
const hashtagsCache = new Map<string, { data: unknown; timestamp: number }>();

const CACHE_TTL = 10 * 60 * 1000; // 10 minutos (hashtags mudam menos frequentemente)

// Interface para parâmetros de busca
export interface HashtagsSearchParams {
  platform?: SocialPlatform;
  category?: string;
  search?: string;
  trending?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

// Interface para resposta paginada
export interface HashtagsPaginatedResponse {
  data: SocialHashtag[];
  total: number;
  page: number;
  limit: number;
  total_pages: number; }

// Interface para criação de hashtag
export interface CreateHashtagData {
  name: string;
  category: string;
  platform: SocialPlatform;
  description?: string;
  is_trending: boolean;
  usage_count: number;
  engagement_rate: number;
  [key: string]: unknown; }

// Interface para atualização de hashtag
export interface UpdateHashtagData {
  name?: string;
  category?: string;
  description?: string;
  is_trending?: boolean;
  usage_count?: number;
  engagement_rate?: number;
  [key: string]: unknown; }

// Interface para estatísticas de hashtags
export interface HashtagsStats {
  total_hashtags: number;
  trending_hashtags: number;
  hashtags_by_platform: Record<SocialPlatform, number>;
  hashtags_by_category: Record<string, number>;
  top_performing_hashtags: SocialHashtag[];
  average_engagement_rate: number;
  total_usage_count: number; }

// Interface para análise de hashtags
export interface HashtagAnalysis {
  hashtag: string;
  platform: SocialPlatform;
  popularity_score: number;
  engagement_score: number;
  competition_level: 'low' | 'medium' | 'high';
  suggested_usage: 'high' | 'medium' | 'low';
  related_hashtags: string[];
  optimal_posting_times: string[];
  audience_insights: {
    age_groups: Record<string, number>;
  interests: string[];
  locations: string[]; };

}

// Interface para sugestões de hashtags
export interface HashtagSuggestions {
  trending: string[];
  relevant: string[];
  popular: string[];
  niche: string[];
  engagement_boost: string[];
  competition_low: string[];
  mix: string[]; }

// Interface para grupo de hashtags
export interface HashtagGroup {
  id: string;
  name: string;
  description: string;
  hashtags: string[];
  platform: SocialPlatform;
  category: string;
  usage_count: number;
  created_at: string;
  updated_at: string; }

/**
 * Service para gerenciamento de hashtags sociais
 * Responsável por análise, sugestões e otimização de hashtags
 */
class HashtagsService {
  private baseUrl = '/api/social-buffer/hashtags';

  /**
   * Busca hashtags com filtros
   */
  async getHashtags(params: HashtagsSearchParams = {}): Promise<HashtagsPaginatedResponse> {
    try {
      const cacheKey = `hashtags_${JSON.stringify(params)}`;
      const cached = hashtagsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl, { params });

      const result = {
        data: (response as any).data.data || (response as any).data,
        total: (response as any).data.total || ((response as any).data || []).length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil(((response as any).data.total || ((response as any).data || []).length) / (params.limit || 10))};

      // Cache do resultado
      hashtagsCache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      console.error('Erro ao buscar hashtags:', error);

      throw new Error('Falha ao carregar hashtags');

    } /**
   * Busca uma hashtag específica por ID
   */
  async getHashtagById(id: number): Promise<SocialHashtag> {
    try {
      const cacheKey = `hashtag_${id}`;
      const cached = hashtagsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);

      // Cache do resultado
      hashtagsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao buscar hashtag ${id}:`, error);

      throw new Error('Falha ao carregar hashtag');

    } /**
   * Cria uma nova hashtag
   */
  async createHashtag(data: CreateHashtagData): Promise<SocialHashtag> {
    try {
      // Validação básica
      this.validateHashtagData(data);

      const response = await apiClient.post(this.baseUrl, data);

      // Limpar cache relacionado
      this.clearHashtagsCache();

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao criar hashtag:', error);

      throw new Error('Falha ao criar hashtag');

    } /**
   * Atualiza uma hashtag existente
   */
  async updateHashtag(id: number, data: UpdateHashtagData): Promise<SocialHashtag> {
    try {
      // Validação básica
      if (data.name !== undefined) {
        this.validateHashtagName(data.name);

      }

      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);

      // Limpar cache relacionado
      this.clearHashtagsCache();

      hashtagsCache.delete(`hashtag_${id}`);

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao atualizar hashtag ${id}:`, error);

      throw new Error('Falha ao atualizar hashtag');

    } /**
   * Remove uma hashtag
   */
  async deleteHashtag(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);

      // Limpar cache relacionado
      this.clearHashtagsCache();

      hashtagsCache.delete(`hashtag_${id}`);

    } catch (error) {
      console.error(`Erro ao remover hashtag ${id}:`, error);

      throw new Error('Falha ao remover hashtag');

    } /**
   * Obtém estatísticas das hashtags
   */
  async getHashtagsStats(platform?: SocialPlatform): Promise<HashtagsStats> {
    try {
      const cacheKey = `hashtags_stats_${platform || 'all'}`;
      const cached = hashtagsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const url = platform ? `${this.baseUrl}/stats/${platform}` : `${this.baseUrl}/stats`;
      const response = await apiClient.get(url);

      // Cache do resultado
      hashtagsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter estatísticas das hashtags:', error);

      throw new Error('Falha ao obter estatísticas das hashtags');

    } /**
   * Analisa uma hashtag
   */
  async analyzeHashtag(hashtag: string, platform: SocialPlatform): Promise<HashtagAnalysis> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/analyze`, {
        hashtag,
        platform
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao analisar hashtag:', error);

      throw new Error('Falha ao analisar hashtag');

    } /**
   * Obtém sugestões de hashtags
   */
  async getHashtagSuggestions(content: string, platform: SocialPlatform, limit: number = 10): Promise<HashtagSuggestions> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/suggestions`, {
        content,
        platform,
        limit
      });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter sugestões de hashtags:', error);

      throw new Error('Falha ao obter sugestões de hashtags');

    } /**
   * Obtém hashtags em tendência
   */
  async getTrendingHashtags(platform: SocialPlatform, limit: number = 20): Promise<SocialHashtag[]> {
    try {
      const cacheKey = `trending_${platform}_${limit}`;
      const cached = hashtagsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/trending`, {
        params: { platform, limit } );

      // Cache do resultado
      hashtagsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter hashtags em tendência:', error);

      throw new Error('Falha ao obter hashtags em tendência');

    } /**
   * Obtém hashtags populares
   */
  async getPopularHashtags(platform: SocialPlatform, limit: number = 20): Promise<SocialHashtag[]> {
    try {
      const cacheKey = `popular_${platform}_${limit}`;
      const cached = hashtagsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/popular`, {
        params: { platform, limit } );

      // Cache do resultado
      hashtagsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter hashtags populares:', error);

      throw new Error('Falha ao obter hashtags populares');

    } /**
   * Obtém hashtags relacionadas
   */
  async getRelatedHashtags(hashtag: string, platform: SocialPlatform, limit: number = 10): Promise<string[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/related`, {
        params: { hashtag, platform, limit } );

      return (response as any).data.related_hashtags || [];
    } catch (error) {
      console.error('Erro ao obter hashtags relacionadas:', error);

      throw new Error('Falha ao obter hashtags relacionadas');

    } /**
   * Cria um grupo de hashtags
   */
  async createHashtagGroup(data: Omit<HashtagGroup, 'id' | 'created_at' | 'updated_at'>): Promise<HashtagGroup> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/groups`, data);

      // Limpar cache relacionado
      this.clearHashtagsCache();

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao criar grupo de hashtags:', error);

      throw new Error('Falha ao criar grupo de hashtags');

    } /**
   * Obtém grupos de hashtags
   */
  async getHashtagGroups(platform?: SocialPlatform): Promise<HashtagGroup[]> {
    try {
      const cacheKey = `hashtag_groups_${platform || 'all'}`;
      const cached = hashtagsCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/groups`, {
        params: platform ? { platform } : {} );

      // Cache do resultado
      hashtagsCache.set(cacheKey, { data: (response as any).data, timestamp: Date.now() });

      return (response as any).data as any;
    } catch (error) {
      console.error('Erro ao obter grupos de hashtags:', error);

      throw new Error('Falha ao obter grupos de hashtags');

    } /**
   * Atualiza um grupo de hashtags
   */
  async updateHashtagGroup(id: string, data: Partial<HashtagGroup>): Promise<HashtagGroup> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/groups/${id}`, data);

      // Limpar cache relacionado
      this.clearHashtagsCache();

      return (response as any).data as any;
    } catch (error) {
      console.error(`Erro ao atualizar grupo de hashtags ${id}:`, error);

      throw new Error('Falha ao atualizar grupo de hashtags');

    } /**
   * Remove um grupo de hashtags
   */
  async deleteHashtagGroup(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/groups/${id}`);

      // Limpar cache relacionado
      this.clearHashtagsCache();

    } catch (error) {
      console.error(`Erro ao remover grupo de hashtags ${id}:`, error);

      throw new Error('Falha ao remover grupo de hashtags');

    } /**
   * Obtém performance de hashtags
   */
  async getHashtagPerformance(hashtags: string[], platform: SocialPlatform, dateFrom?: string, dateTo?: string): Promise<Record<string, any>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/performance`, {
        hashtags,
        platform,
        date_from: dateFrom,
        date_to: dateTo
      });

      return (response as any).data.performance || {};

    } catch (error) {
      console.error('Erro ao obter performance das hashtags:', error);

      throw new Error('Falha ao obter performance das hashtags');

    } /**
   * Busca hashtags por categoria
   */
  async getHashtagsByCategory(category: string, platform?: SocialPlatform): Promise<SocialHashtag[]> {
    try {
      const result = await this.getHashtags({ 
        category, 
        platform,
        limit: 1000 
      });

      return result.data;
    } catch (error) {
      console.error(`Erro ao buscar hashtags por categoria ${category}:`, error);

      throw new Error('Falha ao buscar hashtags por categoria');

    } /**
   * Valida dados básicos da hashtag
   */
  private validateHashtagData(data: CreateHashtagData): void {
    if (!data.name || (data as any).name.trim().length === 0) {
      throw new Error('Nome da hashtag é obrigatório');

    }

    if (!data.name.startsWith('#')) {
      throw new Error('Nome da hashtag deve começar com #');

    }

    if (data.name.length > 50) {
      throw new Error('Nome da hashtag deve ter no máximo 50 caracteres');

    }

    if (!data.category || (data as any).category.trim().length === 0) {
      throw new Error('Categoria é obrigatória');

    }

    if (!data.platform) {
      throw new Error('Plataforma é obrigatória');

    } /**
   * Valida nome da hashtag
   */
  private validateHashtagName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome da hashtag é obrigatório');

    }

    if (!name.startsWith('#')) {
      throw new Error('Nome da hashtag deve começar com #');

    }

    if (name.length > 50) {
      throw new Error('Nome da hashtag deve ter no máximo 50 caracteres');

    } /**
   * Limpa cache de hashtags
   */
  private clearHashtagsCache(): void {
    hashtagsCache.clear();

  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of hashtagsCache.keys()) {
        if (key.includes(pattern)) {
          hashtagsCache.delete(key);

        } } else {
      hashtagsCache.clear();

    } /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: hashtagsCache.size,
      keys: Array.from(hashtagsCache.keys())};

  } // Instância singleton
export const hashtagsService = new HashtagsService();

export default hashtagsService;
