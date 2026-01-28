import { apiClient } from '@/services';
import {
  SocialLink,
  SocialLinkType
} from '../types/socialTypes';

// Cache para links
const linksCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Interface para parâmetros de busca
export interface LinksSearchParams {
  type?: SocialLinkType;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Interface para resposta paginada
export interface LinksPaginatedResponse {
  data: SocialLink[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Interface para criação de link
export interface CreateLinkData {
  original_url: string;
  short_code?: string;
  title?: string;
  description?: string;
  type: SocialLinkType;
  expires_at?: string;
  password?: string;
  is_tracking_enabled: boolean;
}

// Interface para atualização de link
export interface UpdateLinkData {
  title?: string;
  description?: string;
  expires_at?: string;
  password?: string;
  is_tracking_enabled?: boolean;
}

// Interface para estatísticas de links
export interface LinksStats {
  total_links: number;
  active_links: number;
  expired_links: number;
  password_protected_links: number;
  links_by_type: Record<SocialLinkType, number>;
  total_clicks: number;
  unique_clicks: number;
  top_performing_links: SocialLink[];
  average_clicks_per_link: number;
}

// Interface para analytics de link
export interface LinkAnalytics {
  link_id: string;
  total_clicks: number;
  unique_clicks: number;
  click_rate: number;
  clicks_by_date: Array<{
    date: string;
    clicks: number;
    unique_clicks: number;
  }>;
  clicks_by_country: Record<string, number>;
  clicks_by_device: Record<string, number>;
  clicks_by_browser: Record<string, number>;
  referrers: Array<{
    referrer: string;
    clicks: number;
  }>;
  top_countries: Array<{
    country: string;
    clicks: number;
    percentage: number;
  }>;
}

// Interface para link encurtado
export interface ShortenedLink {
  id: string;
  original_url: string;
  short_url: string;
  short_code: string;
  title?: string;
  description?: string;
  type: SocialLinkType;
  clicks: number;
  unique_clicks: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

// Interface para QR Code
export interface QRCodeData {
  qr_code_url: string;
  qr_code_data: string;
  size: number;
  format: 'png' | 'svg' | 'pdf';
}

/**
 * Service para gerenciamento de links encurtados
 * Responsável por criação, edição, analytics e gerenciamento de links
 */
class LinksService {
  private baseUrl = '/api/social-buffer/links';

  /**
   * Busca links com filtros
   */
  async getLinks(params: LinksSearchParams = {}): Promise<LinksPaginatedResponse> {
    try {
      const cacheKey = `links_${JSON.stringify(params)}`;
      const cached = linksCache.get(cacheKey);
      
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
      linksCache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar links:', error);
      throw new Error('Falha ao carregar links');
    }
  }

  /**
   * Busca um link específico por ID
   */
  async getLinkById(id: string): Promise<ShortenedLink> {
    try {
      const cacheKey = `link_${id}`;
      const cached = linksCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      
      // Cache do resultado
      linksCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar link ${id}:`, error);
      throw new Error('Falha ao carregar link');
    }
  }

  /**
   * Cria um novo link encurtado
   */
  async createLink(data: CreateLinkData): Promise<ShortenedLink> {
    try {
      // Validação básica
      this.validateLinkData(data);

      const response = await apiClient.post(this.baseUrl, data);
      
      // Limpar cache relacionado
      this.clearLinksCache();
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar link:', error);
      throw new Error('Falha ao criar link');
    }
  }

  /**
   * Atualiza um link existente
   */
  async updateLink(id: string, data: UpdateLinkData): Promise<ShortenedLink> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
      
      // Limpar cache relacionado
      this.clearLinksCache();
      linksCache.delete(`link_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar link ${id}:`, error);
      throw new Error('Falha ao atualizar link');
    }
  }

  /**
   * Remove um link
   */
  async deleteLink(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
      
      // Limpar cache relacionado
      this.clearLinksCache();
      linksCache.delete(`link_${id}`);
    } catch (error) {
      console.error(`Erro ao remover link ${id}:`, error);
      throw new Error('Falha ao remover link');
    }
  }

  /**
   * Encurta uma URL
   */
  async shortenUrl(url: string, options?: Partial<CreateLinkData>): Promise<ShortenedLink> {
    try {
      const data: CreateLinkData = {
        original_url: url,
        type: options?.type || 'general',
        is_tracking_enabled: options?.is_tracking_enabled ?? true,
        ...options
      };

      return await this.createLink(data);
    } catch (error) {
      console.error('Erro ao encurtar URL:', error);
      throw new Error('Falha ao encurtar URL');
    }
  }

  /**
   * Expande uma URL encurtada
   */
  async expandUrl(shortCode: string): Promise<{ original_url: string; is_active: boolean }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/expand/${shortCode}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao expandir URL ${shortCode}:`, error);
      throw new Error('Falha ao expandir URL');
    }
  }

  /**
   * Obtém estatísticas dos links
   */
  async getLinksStats(): Promise<LinksStats> {
    try {
      const cacheKey = 'links_stats';
      const cached = linksCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/stats`);
      
      // Cache do resultado
      linksCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas dos links:', error);
      throw new Error('Falha ao obter estatísticas dos links');
    }
  }

  /**
   * Obtém analytics de um link
   */
  async getLinkAnalytics(id: string, dateFrom?: string, dateTo?: string): Promise<LinkAnalytics> {
    try {
      const params: any = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const response = await apiClient.get(`${this.baseUrl}/${id}/analytics`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter analytics do link ${id}:`, error);
      throw new Error('Falha ao obter analytics do link');
    }
  }

  /**
   * Gera QR Code para um link
   */
  async generateQRCode(id: string, size: number = 200, format: 'png' | 'svg' | 'pdf' = 'png'): Promise<QRCodeData> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/qr-code`, {
        size,
        format
      });
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao gerar QR Code para link ${id}:`, error);
      throw new Error('Falha ao gerar QR Code');
    }
  }

  /**
   * Ativa um link
   */
  async activateLink(id: string): Promise<ShortenedLink> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/activate`);
      
      // Limpar cache relacionado
      this.clearLinksCache();
      linksCache.delete(`link_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao ativar link ${id}:`, error);
      throw new Error('Falha ao ativar link');
    }
  }

  /**
   * Desativa um link
   */
  async deactivateLink(id: string): Promise<ShortenedLink> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/deactivate`);
      
      // Limpar cache relacionado
      this.clearLinksCache();
      linksCache.delete(`link_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao desativar link ${id}:`, error);
      throw new Error('Falha ao desativar link');
    }
  }

  /**
   * Duplica um link
   */
  async duplicateLink(id: string, modifications?: Partial<CreateLinkData>): Promise<ShortenedLink> {
    try {
      const originalLink = await this.getLinkById(id);
      
      const duplicateData: CreateLinkData = {
        original_url: modifications?.original_url || originalLink.original_url,
        title: modifications?.title || originalLink.title,
        description: modifications?.description || originalLink.description,
        type: modifications?.type || originalLink.type,
        is_tracking_enabled: modifications?.is_tracking_enabled ?? originalLink.is_active
      };

      return await this.createLink(duplicateData);
    } catch (error) {
      console.error(`Erro ao duplicar link ${id}:`, error);
      throw new Error('Falha ao duplicar link');
    }
  }

  /**
   * Obtém links mais clicados
   */
  async getTopLinks(limit: number = 10): Promise<ShortenedLink[]> {
    try {
      const cacheKey = `top_links_${limit}`;
      const cached = linksCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiClient.get(`${this.baseUrl}/top`, {
        params: { limit }
      });
      
      // Cache do resultado
      linksCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao obter links mais clicados:', error);
      throw new Error('Falha ao obter links mais clicados');
    }
  }

  /**
   * Obtém links por tipo
   */
  async getLinksByType(type: SocialLinkType): Promise<ShortenedLink[]> {
    try {
      const result = await this.getLinks({ type, limit: 1000 });
      return result.data;
    } catch (error) {
      console.error(`Erro ao buscar links por tipo ${type}:`, error);
      throw new Error('Falha ao buscar links por tipo');
    }
  }

  /**
   * Obtém links expirados
   */
  async getExpiredLinks(): Promise<ShortenedLink[]> {
    try {
      const result = await this.getLinks({ 
        date_to: new Date().toISOString(),
        limit: 1000 
      });
      return result.data.filter(link => link.expires_at && new Date(link.expires_at) < new Date());
    } catch (error) {
      console.error('Erro ao buscar links expirados:', error);
      throw new Error('Falha ao buscar links expirados');
    }
  }

  /**
   * Obtém links que expiram em breve
   */
  async getLinksExpiringSoon(days: number = 7): Promise<ShortenedLink[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      
      const result = await this.getLinks({ 
        date_to: futureDate.toISOString(),
        limit: 1000 
      });
      
      return result.data.filter(link => 
        link.expires_at && 
        new Date(link.expires_at) > new Date() && 
        new Date(link.expires_at) <= futureDate
      );
    } catch (error) {
      console.error('Erro ao buscar links que expiram em breve:', error);
      throw new Error('Falha ao buscar links que expiram em breve');
    }
  }

  /**
   * Valida dados básicos do link
   */
  private validateLinkData(data: CreateLinkData): void {
    if (!data.original_url || data.original_url.trim().length === 0) {
      throw new Error('URL original é obrigatória');
    }

    try {
      new URL(data.original_url);
    } catch {
      throw new Error('URL original deve ser válida');
    }

    if (!data.type) {
      throw new Error('Tipo do link é obrigatório');
    }

    if (data.title && data.title.length > 200) {
      throw new Error('Título deve ter no máximo 200 caracteres');
    }

    if (data.description && data.description.length > 500) {
      throw new Error('Descrição deve ter no máximo 500 caracteres');
    }
  }

  /**
   * Limpa cache de links
   */
  private clearLinksCache(): void {
    linksCache.clear();
  }

  /**
   * Limpa cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of linksCache.keys()) {
        if (key.includes(pattern)) {
          linksCache.delete(key);
        }
      }
    } else {
      linksCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: linksCache.size,
      keys: Array.from(linksCache.keys())
    };
  }
}

// Instância singleton
export const linksService = new LinksService();
export default linksService;
