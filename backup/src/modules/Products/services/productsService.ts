import { apiClient } from '@/services';

// ===== INTERFACES TYPESCRIPT NATIVAS =====
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  status: ProductStatus;
  category: ProductCategory;
  tags: string[];
  images: ProductImage[];
  variations: ProductVariation[];
  dimensions: ProductDimensions;
  weight: number;
  sku: string;
  inventory: ProductInventory;
  seo: ProductSEO;
  project_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  name: string;
  price: number;
  sku: string;
  attributes: Record<string, string>;
  inventory: number;
  images: string[];
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  is_primary: boolean;
  order: number;
  created_at: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in' | 'm';
}

export interface ProductInventory {
  quantity: number;
  reserved: number;
  available: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  warehouse_location?: string;
}

export interface ProductSEO {
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  slug: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
}

export type ProductStatus = 'active' | 'inactive' | 'draft' | 'archived' | 'out_of_stock';

export type ProductCategory = 'physical' | 'digital' | 'service' | 'subscription' | 'bundle';

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  currency: string;
  status: ProductStatus;
  category: ProductCategory;
  tags: string[];
  images: Omit<ProductImage, 'id' | 'created_at'>[];
  variations: Omit<ProductVariation, 'id' | 'product_id' | 'created_at' | 'updated_at'>[];
  dimensions: ProductDimensions;
  weight: number;
  sku: string;
  inventory: ProductInventory;
  seo: ProductSEO;
  project_id: string;
}

export interface ProductsFilter {
  search?: string;
  status?: ProductStatus[];
  category?: ProductCategory[];
  tags?: string[];
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
  project_id?: string;
  sort_by?: 'name' | 'price' | 'created_at' | 'updated_at' | 'inventory';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface ProductsStats {
  total_products: number;
  active_products: number;
  inactive_products: number;
  draft_products: number;
  out_of_stock_products: number;
  products_by_category: Record<ProductCategory, number>;
  products_by_status: Record<ProductStatus, number>;
  total_inventory_value: number;
  low_stock_products: number;
  top_selling_products: Array<{
    id: string;
    name: string;
    sales_count: number;
    revenue: number;
  }>;
  recent_products: Product[];
}

export interface ProductAnalytics {
  views: number;
  sales: number;
  revenue: number;
  conversion_rate: number;
  average_rating: number;
  review_count: number;
  return_rate: number;
  profit_margin: number;
  cost_of_goods: number;
  shipping_cost: number;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  products: Array<{
    product_id: string;
    quantity: number;
    discount_percentage?: number;
  }>;
  bundle_price: number;
  savings: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductData {
  id: string;
  [key: string]: any;
}

export interface ProductResponse {
  success: boolean;
  data?: ProductData | ProductData[];
  message?: string;
  error?: string;
}

class ProductsService {
  private api = apiClient;

  // ===== CRUD OPERATIONS =====
  async getProducts(filters: ProductsFilter = {}): Promise<ProductResponse> {
    try {
      const response = await this.api.get('/products', { params: filters });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProduct(id: string): Promise<ProductResponse> {
    try {
      const response = await this.api.get(`/products/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createProduct(data: ProductFormData): Promise<ProductResponse> {
    try {
      const response = await this.api.post('/products', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<ProductResponse> {
    try {
      const response = await this.api.put(`/products/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteProduct(id: string): Promise<ProductResponse> {
    try {
      const response = await this.api.delete(`/products/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== PRODUCT ACTIONS =====
  async duplicateProduct(id: string, newName?: string): Promise<ProductResponse> {
    try {
      const response = await this.api.post(`/products/${id}/duplicate`, { name: newName });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProductStatus(id: string, status: ProductStatus): Promise<ProductResponse> {
    try {
      const response = await this.api.patch(`/products/${id}/status`, { status });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProductInventory(id: string, inventory: Partial<ProductInventory>): Promise<ProductResponse> {
    try {
      const response = await this.api.patch(`/products/${id}/inventory`, inventory);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProductPrice(id: string, price: number, currency?: string): Promise<ProductResponse> {
    try {
      const response = await this.api.patch(`/products/${id}/price`, { price, currency });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== VARIATIONS =====
  async getProductVariations(productId: string): Promise<ProductResponse> {
    try {
      const response = await this.api.get(`/products/${productId}/variations`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createProductVariation(productId: string, variation: Omit<ProductVariation, 'id' | 'product_id' | 'created_at' | 'updated_at'>): Promise<ProductResponse> {
    try {
      const response = await this.api.post(`/products/${productId}/variations`, variation);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProductVariation(productId: string, variationId: string, variation: Partial<ProductVariation>): Promise<ProductResponse> {
    try {
      const response = await this.api.put(`/products/${productId}/variations/${variationId}`, variation);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteProductVariation(productId: string, variationId: string): Promise<ProductResponse> {
    try {
      const response = await this.api.delete(`/products/${productId}/variations/${variationId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== IMAGES =====
  async getProductImages(productId: string): Promise<ProductResponse> {
    try {
      const response = await this.api.get(`/products/${productId}/images`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async uploadProductImage(productId: string, file: File, metadata?: Partial<ProductImage>): Promise<ProductResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      const response = await this.api.post(`/products/${productId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProductImage(productId: string, imageId: string, metadata: Partial<ProductImage>): Promise<ProductResponse> {
    try {
      const response = await this.api.put(`/products/${productId}/images/${imageId}`, metadata);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteProductImage(productId: string, imageId: string): Promise<ProductResponse> {
    try {
      const response = await this.api.delete(`/products/${productId}/images/${imageId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async setPrimaryImage(productId: string, imageId: string): Promise<ProductResponse> {
    try {
      const response = await this.api.post(`/products/${productId}/images/${imageId}/set-primary`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== REVIEWS =====
  async getProductReviews(productId: string, params: any = {}): Promise<ProductResponse> {
    try {
      const response = await this.api.get(`/products/${productId}/reviews`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createProductReview(productId: string, review: Omit<ProductReview, 'id' | 'product_id' | 'created_at' | 'updated_at'>): Promise<ProductResponse> {
    try {
      const response = await this.api.post(`/products/${productId}/reviews`, review);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProductReview(productId: string, reviewId: string, review: Partial<ProductReview>): Promise<ProductResponse> {
    try {
      const response = await this.api.put(`/products/${productId}/reviews/${reviewId}`, review);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteProductReview(productId: string, reviewId: string): Promise<ProductResponse> {
    try {
      const response = await this.api.delete(`/products/${productId}/reviews/${reviewId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== ANALYTICS =====
  async getProductAnalytics(productId: string, params: any = {}): Promise<ProductResponse> {
    try {
      const response = await this.api.get(`/products/${productId}/analytics`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProductsStats(params: any = {}): Promise<ProductResponse> {
    try {
      const response = await this.api.get('/products/stats', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== BUNDLES =====
  async getProductBundles(params: any = {}): Promise<ProductResponse> {
    try {
      const response = await this.api.get('/products/bundles', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createProductBundle(bundle: Omit<ProductBundle, 'id' | 'created_at' | 'updated_at'>): Promise<ProductResponse> {
    try {
      const response = await this.api.post('/products/bundles', bundle);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateProductBundle(id: string, bundle: Partial<ProductBundle>): Promise<ProductResponse> {
    try {
      const response = await this.api.put(`/products/bundles/${id}`, bundle);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteProductBundle(id: string): Promise<ProductResponse> {
    try {
      const response = await this.api.delete(`/products/bundles/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== BULK OPERATIONS =====
  async bulkUpdateProducts(ids: string[], updates: Partial<ProductFormData>): Promise<ProductResponse> {
    try {
      const response = await this.api.post('/products/bulk-update', { ids, updates });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async bulkDeleteProducts(ids: string[]): Promise<ProductResponse> {
    try {
      const response = await this.api.post('/products/bulk-delete', { ids });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async bulkUpdateProductStatus(ids: string[], status: ProductStatus): Promise<ProductResponse> {
    try {
      const response = await this.api.post('/products/bulk-status-update', { ids, status });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== IMPORT/EXPORT =====
  async importProducts(file: File, projectId?: string): Promise<ProductResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (projectId) {
        formData.append('project_id', projectId);
      }

      const response = await this.api.post('/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async exportProducts(filters: ProductsFilter = {}): Promise<ProductResponse> {
    try {
      const response = await this.api.get('/products/export', { 
        params: filters,
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== UTILITY METHODS =====
  formatProductStatus(status: ProductStatus): string {
    const statusMap: { [key: string]: string } = {
      active: 'Ativo',
      inactive: 'Inativo',
      draft: 'Rascunho',
      archived: 'Arquivado',
      out_of_stock: 'Sem Estoque'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: ProductStatus): string {
    const colorMap: { [key: string]: string } = {
      active: 'green',
      inactive: 'yellow',
      draft: 'blue',
      archived: 'gray',
      out_of_stock: 'red'
    };
    return colorMap[status] || 'gray';
  }

  formatProductCategory(category: ProductCategory): string {
    const categoryMap: { [key: string]: string } = {
      physical: 'Físico',
      digital: 'Digital',
      service: 'Serviço',
      subscription: 'Assinatura',
      bundle: 'Pacote'
    };
    return categoryMap[category] || category;
  }

  getCategoryIcon(category: ProductCategory): string {
    const iconMap: { [key: string]: string } = {
      physical: '📦',
      digital: '💾',
      service: '🔧',
      subscription: '🔄',
      bundle: '🎁'
    };
    return iconMap[category] || '📦';
  }

  formatPrice(price: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  formatWeight(weight: number, unit: string = 'kg'): string {
    return `${weight} ${unit}`;
  }

  formatDimensions(dimensions: ProductDimensions): string {
    return `${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${dimensions.unit}`;
  }

  calculateInventoryStatus(inventory: ProductInventory): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (inventory.available <= 0) return 'out_of_stock';
    if (inventory.available <= inventory.low_stock_threshold) return 'low_stock';
    return 'in_stock';
  }

  getInventoryStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      in_stock: 'green',
      low_stock: 'yellow',
      out_of_stock: 'red'
    };
    return colorMap[status] || 'gray';
  }

  formatInventoryStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      in_stock: 'Em Estoque',
      low_stock: 'Estoque Baixo',
      out_of_stock: 'Sem Estoque'
    };
    return statusMap[status] || status;
  }

  validateProductData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Nome do produto é obrigatório');
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push('Descrição do produto é obrigatória');
    }

    if (!data.price || data.price <= 0) {
      errors.push('Preço deve ser maior que zero');
    }

    if (!data.sku || data.sku.trim().length === 0) {
      errors.push('SKU é obrigatório');
    }

    if (!data.category) {
      errors.push('Categoria é obrigatória');
    }

    if (!data.status) {
      errors.push('Status é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  generateSKU(name: string, category: string): string {
    const namePrefix = name.substring(0, 3).toUpperCase();
    const categoryPrefix = category.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${namePrefix}-${categoryPrefix}-${timestamp}`;
  }

  calculateProfitMargin(sellingPrice: number, costPrice: number): number {
    if (sellingPrice <= 0) return 0;
    return ((sellingPrice - costPrice) / sellingPrice) * 100;
  }

  formatProfitMargin(margin: number): string {
    return `${margin.toFixed(1)}%`;
  }

  getProfitMarginColor(margin: number): string {
    if (margin >= 50) return 'green';
    if (margin >= 25) return 'yellow';
    return 'red';
  }

  formatProductName(product: any): string {
    return product.name || 'Produto sem nome';
  }

  getProductInitials(product: any): string {
    const name = this.formatProductName(product);
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  calculateProductAge(product: any): string {
    const created = new Date(product.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 dia';
    if (diffDays < 30) return `${diffDays} dias`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} anos`;
  }

  getProductHealth(product: any): 'healthy' | 'warning' | 'critical' {
    const inventoryStatus = this.calculateInventoryStatus(product.inventory);
    const updated = new Date(product.updated_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updated.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (inventoryStatus === 'out_of_stock') return 'critical';
    if (inventoryStatus === 'low_stock' || diffDays > 30) return 'warning';
    return 'healthy';
  }

  getHealthColor(health: string): string {
    const colorMap: { [key: string]: string } = {
      healthy: 'green',
      warning: 'yellow',
      critical: 'red'
    };
    return colorMap[health] || 'gray';
  }
}


// ===== UTILITY FUNCTIONS =====
export const getCurrentProjectId = (): string | null => {
  return localStorage.getItem('current_project_id');
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const productsService = new ProductsService();
export { productsService };
export default productsService;
