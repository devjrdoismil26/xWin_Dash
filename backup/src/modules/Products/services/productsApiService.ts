/**
 * Serviço de API unificado para o módulo Products
 * Integração completa com backend Laravel
 */

import { apiClient } from '@/services';
import {
  Product,
  LandingPage,
  LeadCaptureForm,
  Lead,
  CreateProductData,
  UpdateProductData,
  CreateLandingPageData,
  UpdateLandingPageData,
  CreateFormData,
  UpdateFormData,
  ProductsFilter,
  LandingPagesFilter,
  FormsFilter,
  LeadsFilter,
  ProductsStats,
  LandingPagesStats,
  FormsStats,
  LeadsStats,
  ApiResponse,
  PaginatedResponse
} from '../types';

// =========================================
// INTERFACES DE RESPOSTA
// =========================================

interface ProductListResponse extends ApiResponse<PaginatedResponse<Product>> {}
interface ProductResponse extends ApiResponse<Product> {}
interface LandingPageListResponse extends ApiResponse<PaginatedResponse<LandingPage>> {}
interface LandingPageResponse extends ApiResponse<LandingPage> {}
interface FormListResponse extends ApiResponse<PaginatedResponse<LeadCaptureForm>> {}
interface FormResponse extends ApiResponse<LeadCaptureForm> {}
interface LeadListResponse extends ApiResponse<PaginatedResponse<Lead>> {}
interface LeadResponse extends ApiResponse<Lead> {}
interface StatsResponse extends ApiResponse<Record<string, unknown>> {}

// =========================================
// CLASSE PRINCIPAL DO SERVIÇO
// =========================================

class ProductsApiService {
  private baseUrl = '/api/v1/products';

  /**
   * Fazer requisição HTTP com tratamento de erros
   */
  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
          validation_errors: data.validation_errors
        };
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro de conexão'
      };
    }
  }

  // =========================================
  // PRODUTOS - CRUD COMPLETO
  // =========================================

  /**
   * Listar produtos com filtros e paginação
   */
  async getProducts(filters: ProductsFilter = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) filters.status.forEach(s => params.append('status[]', s));
    if (filters.category) filters.category.forEach(c => params.append('category[]', c));
    if (filters.type) filters.type.forEach(t => params.append('type[]', t));
    if (filters.tags) filters.tags.forEach(t => params.append('tags[]', t));
    if (filters.price_min) params.append('price_min', filters.price_min.toString());
    if (filters.price_max) params.append('price_max', filters.price_max.toString());
    if (filters.in_stock !== undefined) params.append('in_stock', filters.in_stock.toString());
    if (filters.project_id) params.append('project_id', filters.project_id.toString());
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    return this.makeRequest(`${this.baseUrl}?${params}`);
  }

  /**
   * Obter produto por ID
   */
  async getProduct(id: number): Promise<ProductResponse> {
    return this.makeRequest(`${this.baseUrl}/${id}`);
  }

  /**
   * Criar novo produto
   */
  async createProduct(data: CreateProductData): Promise<ProductResponse> {
    const formData = new FormData();
    
    // Adicionar campos básicos
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('currency', data.currency);
    formData.append('category', data.category);
    formData.append('type', data.type);
    formData.append('sku', data.sku);
    
    // Adicionar arrays
    formData.append('tags', JSON.stringify(data.tags));
    formData.append('inventory', JSON.stringify(data.inventory));
    formData.append('seo', JSON.stringify(data.seo));
    
    // Adicionar campos opcionais
    if (data.dimensions) formData.append('dimensions', JSON.stringify(data.dimensions));
    if (data.weight) formData.append('weight', data.weight.toString());
    
    // Adicionar imagens
    data.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
          validation_errors: data.validation_errors
        };
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro de conexão'
      };
    }
  }

  /**
   * Atualizar produto
   */
  async updateProduct(id: number, data: UpdateProductData): Promise<ProductResponse> {
    return this.makeRequest(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Excluir produto
   */
  async deleteProduct(id: number): Promise<ApiResponse<null>> {
    return this.makeRequest(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Duplicar produto
   */
  async duplicateProduct(id: number, newName?: string): Promise<ProductResponse> {
    return this.makeRequest(`${this.baseUrl}/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ name: newName })
    });
  }

  /**
   * Atualizar status do produto
   */
  async updateProductStatus(id: number, status: string): Promise<ProductResponse> {
    return this.makeRequest(`${this.baseUrl}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  /**
   * Atualizar estoque do produto
   */
  async updateProductInventory(id: number, inventory: any): Promise<ProductResponse> {
    return this.makeRequest(`${this.baseUrl}/${id}/inventory`, {
      method: 'PATCH',
      body: JSON.stringify(inventory)
    });
  }

  // =========================================
  // LANDING PAGES - CRUD COMPLETO
  // =========================================

  /**
   * Listar landing pages
   */
  async getLandingPages(filters: LandingPagesFilter = {}): Promise<LandingPageListResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) filters.status.forEach(s => params.append('status[]', s));
    if (filters.product_id) params.append('product_id', filters.product_id.toString());
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    return this.makeRequest(`${this.baseUrl}/landing-pages?${params}`);
  }

  /**
   * Obter landing page por ID
   */
  async getLandingPage(id: number): Promise<LandingPageResponse> {
    return this.makeRequest(`${this.baseUrl}/landing-pages/${id}`);
  }

  /**
   * Criar nova landing page
   */
  async createLandingPage(data: CreateLandingPageData): Promise<LandingPageResponse> {
    return this.makeRequest(`${this.baseUrl}/landing-pages`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Atualizar landing page
   */
  async updateLandingPage(id: number, data: UpdateLandingPageData): Promise<LandingPageResponse> {
    return this.makeRequest(`${this.baseUrl}/landing-pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Excluir landing page
   */
  async deleteLandingPage(id: number): Promise<ApiResponse<null>> {
    return this.makeRequest(`${this.baseUrl}/landing-pages/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Publicar landing page
   */
  async publishLandingPage(id: number): Promise<LandingPageResponse> {
    return this.makeRequest(`${this.baseUrl}/landing-pages/${id}/publish`, {
      method: 'POST'
    });
  }

  /**
   * Despublicar landing page
   */
  async unpublishLandingPage(id: number): Promise<LandingPageResponse> {
    return this.makeRequest(`${this.baseUrl}/landing-pages/${id}/unpublish`, {
      method: 'POST'
    });
  }

  // =========================================
  // FORMULÁRIOS DE CAPTURA - CRUD COMPLETO
  // =========================================

  /**
   * Listar formulários de captura
   */
  async getForms(filters: FormsFilter = {}): Promise<FormListResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) filters.status.forEach(s => params.append('status[]', s));
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    return this.makeRequest(`${this.baseUrl}/forms?${params}`);
  }

  /**
   * Obter formulário por ID
   */
  async getForm(id: number): Promise<FormResponse> {
    return this.makeRequest(`${this.baseUrl}/forms/${id}`);
  }

  /**
   * Criar novo formulário
   */
  async createForm(data: CreateFormData): Promise<FormResponse> {
    return this.makeRequest(`${this.baseUrl}/forms`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Atualizar formulário
   */
  async updateForm(id: number, data: UpdateFormData): Promise<FormResponse> {
    return this.makeRequest(`${this.baseUrl}/forms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Excluir formulário
   */
  async deleteForm(id: number): Promise<ApiResponse<null>> {
    return this.makeRequest(`${this.baseUrl}/forms/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Publicar formulário
   */
  async publishForm(id: number): Promise<FormResponse> {
    return this.makeRequest(`${this.baseUrl}/forms/${id}/publish`, {
      method: 'POST'
    });
  }

  /**
   * Despublicar formulário
   */
  async unpublishForm(id: number): Promise<FormResponse> {
    return this.makeRequest(`${this.baseUrl}/forms/${id}/unpublish`, {
      method: 'POST'
    });
  }

  // =========================================
  // LEADS - CRUD COMPLETO
  // =========================================

  /**
   * Listar leads
   */
  async getLeads(filters: LeadsFilter = {}): Promise<LeadListResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) filters.status.forEach(s => params.append('status[]', s));
    if (filters.source) filters.source.forEach(s => params.append('source[]', s));
    if (filters.product_id) params.append('product_id', filters.product_id.toString());
    if (filters.form_id) params.append('form_id', filters.form_id.toString());
    if (filters.landing_page_id) params.append('landing_page_id', filters.landing_page_id.toString());
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    return this.makeRequest(`${this.baseUrl}/leads?${params}`);
  }

  /**
   * Obter lead por ID
   */
  async getLead(id: number): Promise<LeadResponse> {
    return this.makeRequest(`${this.baseUrl}/leads/${id}`);
  }

  /**
   * Atualizar lead
   */
  async updateLead(id: number, data: Partial<Lead>): Promise<LeadResponse> {
    return this.makeRequest(`${this.baseUrl}/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Atualizar status do lead
   */
  async updateLeadStatus(id: number, status: string): Promise<LeadResponse> {
    return this.makeRequest(`${this.baseUrl}/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  /**
   * Atualizar score do lead
   */
  async updateLeadScore(id: number, score: number): Promise<LeadResponse> {
    return this.makeRequest(`${this.baseUrl}/leads/${id}/score`, {
      method: 'PATCH',
      body: JSON.stringify({ score })
    });
  }

  /**
   * Excluir lead
   */
  async deleteLead(id: number): Promise<ApiResponse<null>> {
    return this.makeRequest(`${this.baseUrl}/leads/${id}`, {
      method: 'DELETE'
    });
  }

  // =========================================
  // ESTATÍSTICAS E MÉTRICAS
  // =========================================

  /**
   * Obter estatísticas de produtos
   */
  async getProductsStats(filters: any = {}): Promise<StatsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.makeRequest(`${this.baseUrl}/stats?${params}`);
  }

  /**
   * Obter estatísticas de landing pages
   */
  async getLandingPagesStats(filters: any = {}): Promise<StatsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.makeRequest(`${this.baseUrl}/landing-pages/stats?${params}`);
  }

  /**
   * Obter estatísticas de formulários
   */
  async getFormsStats(filters: any = {}): Promise<StatsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.makeRequest(`${this.baseUrl}/forms/stats?${params}`);
  }

  /**
   * Obter estatísticas de leads
   */
  async getLeadsStats(filters: any = {}): Promise<StatsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    return this.makeRequest(`${this.baseUrl}/leads/stats?${params}`);
  }

  // =========================================
  // OPERAÇÕES EM LOTE
  // =========================================

  /**
   * Atualização em lote de produtos
   */
  async bulkUpdateProducts(ids: number[], updates: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`${this.baseUrl}/bulk-update`, {
      method: 'POST',
      body: JSON.stringify({ ids, updates })
    });
  }

  /**
   * Exclusão em lote de produtos
   */
  async bulkDeleteProducts(ids: number[]): Promise<ApiResponse<any>> {
    return this.makeRequest(`${this.baseUrl}/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
  }

  /**
   * Atualização em lote de leads
   */
  async bulkUpdateLeads(ids: number[], updates: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`${this.baseUrl}/leads/bulk-update`, {
      method: 'POST',
      body: JSON.stringify({ ids, updates })
    });
  }

  // =========================================
  // IMPORT/EXPORT
  // =========================================

  /**
   * Importar produtos
   */
  async importProducts(file: File, projectId?: number): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('project_id', projectId.toString());

    try {
      const response = await fetch(`${this.baseUrl}/import`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
          validation_errors: data.validation_errors
        };
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro de conexão'
      };
    }
  }

  /**
   * Exportar produtos
   */
  async exportProducts(filters: ProductsFilter = {}): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    try {
      const response = await fetch(`${this.baseUrl}/export?${params}`, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`
        };
      }

      const blob = await response.blob();
      return {
        success: true,
        data: blob
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro de conexão'
      };
    }
  }

  /**
   * Exportar leads
   */
  async exportLeads(filters: LeadsFilter = {}): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    try {
      const response = await fetch(`${this.baseUrl}/leads/export?${params}`, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`
        };
      }

      const blob = await response.blob();
      return {
        success: true,
        data: blob
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro de conexão'
      };
    }
  }
}

// =========================================
// EXPORTS
// =========================================

export const productsApiService = new ProductsApiService();
export default productsApiService;