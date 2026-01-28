import { apiClient } from '@/services';
import {
  SocialMedia,
  SocialMediaType
} from '../types/socialTypes';

// Cache para mídia
const mediaCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos (mídia muda menos frequentemente)

// Interface para parâmetros de busca
export interface MediaSearchParams {
  type?: SocialMediaType;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Interface para resposta paginada
export interface MediaPaginatedResponse {
  data: SocialMedia[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Interface para upload de mídia
export interface UploadMediaData {
  file: File;
  title?: string;
  description?: string;
  tags?: string[];
  type: SocialMediaType;
  is_public: boolean;
}

// Interface para atualização de mídia
export interface UpdateMediaData {
  title?: string;
  description?: string;
  tags?: string[];
  is_public?: boolean;
}

// Interface para estatísticas de mídia
export interface MediaStats {
  total_media: number;
  media_by_type: Record<SocialMediaType, number>;
  total_size: number;
  average_size: number;
  public_media: number;
  private_media: number;
  most_used_media: SocialMedia[];
  storage_usage: {
    used: number;
    available: number;
    percentage: number;
  };
}

// Interface para otimização de mídia
export interface MediaOptimization {
  original_size: number;
  optimized_size: number;
  compression_ratio: number;
  quality_score: number;
  format_suggestions: Array<{
    format: string;
    size: number;
    quality: number;
    recommendation: string;
  }>;
}

// Interface para análise de mídia
export interface MediaAnalysis {
  media_id: string;
  type: SocialMediaType;
  dimensions?: {
    width: number;
    height: number;
  };
  file_size: number;
  format: string;
  quality_score: number;
  color_analysis?: {
    dominant_colors: string[];
    brightness: number;
    contrast: number;
  };
  content_analysis?: {
    objects: string[];
    text?: string;
    faces?: number;
    nsfw_score?: number;
  };
  optimization_suggestions: string[];
}

// Interface para galeria
export interface MediaGallery {
  id: string;
  name: string;
  description?: string;
  media_items: SocialMedia[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Service para gerenciamento de mídia social
 * Responsável por upload, edição, otimização e análise de mídia
 */
class MediaService {
  private baseUrl = '/api/social-buffer/media';

  /**
   * Busca mídia com filtros
   */
  async getMedia(params: MediaSearchParams = {}): Promise<MediaPaginatedResponse> {
    try {
      const cacheKey = `media_${JSON.stringify(params)}`;
      const cached = mediaCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(this.baseUrl, { params });
      
      const result = {
        data: response.data.data || response.data,
        total: response.data.total || response.data.length,
        page: params.page || 1,
        limit: params.limit || 10,
        total_pages: Math.ceil((response.data.total || response.data.length) / (params.limit || 10))
      };

      // Cache do resultado
      mediaCache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar mídia:', error);
      throw new Error('Falha ao carregar mídia');
    }
  }

  /**
   * Busca uma mídia específica por ID
   */
  async getMediaById(id: string): Promise<SocialMedia> {
    try {
      const cacheKey = `media_${id}`;
      const cached = mediaCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      
      // Cache do resultado
      mediaCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar mídia ${id}:`, error);
      throw new Error('Falha ao carregar mídia');
    }
  }

  /**
   * Faz upload de mídia
   */
  async uploadMedia(data: UploadMediaData): Promise<SocialMedia> {
    try {
      // Validação básica
      this.validateMediaData(data);

      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('type', data.type);
      formData.append('is_public', data.is_public.toString());
      
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.tags) formData.append('tags', JSON.stringify(data.tags));

      const response = await apiClient.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Limpar cache relacionado
      this.clearMediaCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload de mídia:', error);
      throw new Error('Falha ao fazer upload de mídia');
    }
  }

  /**
   * Atualiza uma mídia existente
   */
  async updateMedia(id: string, data: UpdateMediaData): Promise<SocialMedia> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
      
      // Limpar cache relacionado
      this.clearMediaCache();
      mediaCache.delete(`media_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar mídia ${id}:`, error);
      throw new Error('Falha ao atualizar mídia');
    }
  }

  /**
   * Remove uma mídia
   */
  async deleteMedia(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
      
      // Limpar cache relacionado
      this.clearMediaCache();
      mediaCache.delete(`media_${id}`);
    } catch (error) {
      console.error(`Erro ao remover mídia ${id}:`, error);
      throw new Error('Falha ao remover mídia');
    }
  }

  /**
   * Obtém estatísticas da mídia
   */
  async getMediaStats(): Promise<MediaStats> {
    try {
      const cacheKey = 'media_stats';
      const cached = mediaCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/stats`);
      
      // Cache do resultado
      mediaCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas da mídia:', error);
      throw new Error('Falha ao obter estatísticas da mídia');
    }
  }

  /**
   * Analisa uma mídia
   */
  async analyzeMedia(id: string): Promise<MediaAnalysis> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/analyze`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao analisar mídia ${id}:`, error);
      throw new Error('Falha ao analisar mídia');
    }
  }

  /**
   * Otimiza uma mídia
   */
  async optimizeMedia(id: string, options?: { quality?: number; format?: string; size?: number }): Promise<MediaOptimization> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/optimize`, options);
      return response.data;
    } catch (error) {
      console.error(`Erro ao otimizar mídia ${id}:`, error);
      throw new Error('Falha ao otimizar mídia');
    }
  }

  /**
   * Gera thumbnail de uma mídia
   */
  async generateThumbnail(id: string, size: number = 200): Promise<{ thumbnail_url: string }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/thumbnail`, {
        size
      });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao gerar thumbnail da mídia ${id}:`, error);
      throw new Error('Falha ao gerar thumbnail');
    }
  }

  /**
   * Cria uma galeria
   */
  async createGallery(data: Omit<MediaGallery, 'id' | 'created_at' | 'updated_at'>): Promise<MediaGallery> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/galleries`, data);
      
      // Limpar cache relacionado
      this.clearMediaCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar galeria:', error);
      throw new Error('Falha ao criar galeria');
    }
  }

  /**
   * Obtém galerias
   */
  async getGalleries(): Promise<MediaGallery[]> {
    try {
      const cacheKey = 'media_galleries';
      const cached = mediaCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/galleries`);
      
      // Cache do resultado
      mediaCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter galerias:', error);
      throw new Error('Falha ao obter galerias');
    }
  }

  /**
   * Adiciona mídia a uma galeria
   */
  async addMediaToGallery(galleryId: string, mediaId: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/galleries/${galleryId}/media`, {
        media_id: mediaId
      });
      
      // Limpar cache relacionado
      this.clearMediaCache();
    } catch (error) {
      console.error(`Erro ao adicionar mídia à galeria ${galleryId}:`, error);
      throw new Error('Falha ao adicionar mídia à galeria');
    }
  }

  /**
   * Remove mídia de uma galeria
   */
  async removeMediaFromGallery(galleryId: string, mediaId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/galleries/${galleryId}/media/${mediaId}`);
      
      // Limpar cache relacionado
      this.clearMediaCache();
    } catch (error) {
      console.error(`Erro ao remover mídia da galeria ${galleryId}:`, error);
      throw new Error('Falha ao remover mídia da galeria');
    }
  }

  /**
   * Busca mídia por tipo
   */
  async getMediaByType(type: SocialMediaType): Promise<SocialMedia[]> {
    try {
      const result = await this.getMedia({ type, limit: 1000 });
      return result.data;
    } catch (error) {
      console.error(`Erro ao buscar mídia por tipo ${type}:`, error);
      throw new Error('Falha ao buscar mídia por tipo');
    }
  }

  /**
   * Busca mídia pública
   */
  async getPublicMedia(): Promise<SocialMedia[]> {
    try {
      const result = await this.getMedia({ 
        // Assumindo que há um filtro para mídia pública
        limit: 1000 
      });
      return result.data.filter(media => media.is_public);
    } catch (error) {
      console.error('Erro ao buscar mídia pública:', error);
      throw new Error('Falha ao buscar mídia pública');
    }
  }

  /**
   * Busca mídia privada
   */
  async getPrivateMedia(): Promise<SocialMedia[]> {
    try {
      const result = await this.getMedia({ 
        // Assumindo que há um filtro para mídia privada
        limit: 1000 
      });
      return result.data.filter(media => !media.is_public);
    } catch (error) {
      console.error('Erro ao buscar mídia privada:', error);
      throw new Error('Falha ao buscar mídia privada');
    }
  }

  /**
   * Obtém mídia mais usada
   */
  async getMostUsedMedia(limit: number = 10): Promise<SocialMedia[]> {
    try {
      const cacheKey = `most_used_media_${limit}`;
      const cached = mediaCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/most-used`, {
        params: { limit }
      });
      
      // Cache do resultado
      mediaCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter mídia mais usada:', error);
      throw new Error('Falha ao obter mídia mais usada');
    }
  }

  /**
   * Valida dados básicos da mídia
   */
  private validateMediaData(data: UploadMediaData): void {
    if (!data.file) {
      throw new Error('Arquivo é obrigatório');
    }

    if (!data.type) {
      throw new Error('Tipo da mídia é obrigatório');
    }

    // Validar tamanho do arquivo (exemplo: máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (data.file.size > maxSize) {
      throw new Error('Arquivo deve ter no máximo 50MB');
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/mov'];
    if (!allowedTypes.includes(data.file.type)) {
      throw new Error('Tipo de arquivo não suportado');
    }

    if (data.title && data.title.length > 200) {
      throw new Error('Título deve ter no máximo 200 caracteres');
    }

    if (data.description && data.description.length > 500) {
      throw new Error('Descrição deve ter no máximo 500 caracteres');
    }
  }

  /**
   * Limpa cache de mídia
   */
  private clearMediaCache(): void {
    mediaCache.clear();
  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of mediaCache.keys()) {
        if (key.includes(pattern)) {
          mediaCache.delete(key);
        }
      }
    } else {
      mediaCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: mediaCache.size,
      keys: Array.from(mediaCache.keys())
    };
  }
}

// Instância singleton
export const mediaService = new MediaService();
export default mediaService;
