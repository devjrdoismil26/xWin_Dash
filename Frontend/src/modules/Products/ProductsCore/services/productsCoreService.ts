// =========================================
// PRODUCTS CORE SERVICE - FUNCIONALIDADES BÁSICAS
// =========================================
// Serviço para operações básicas de produtos
// Máximo: 200 linhas

import { apiClient } from '@/services';
import { withCache, invalidateProductCache } from '@/services/productsCacheService';
import { validateProductData } from '@/services/productsValidationService';
import { handleProductsError, withErrorHandling, withRetry } from '@/services/productsErrorService';
import { getErrorMessage } from '@/utils/errorHelpers';
import { Product, ProductFormData, ProductResponse, ProductsFilter } from '../types';

// =========================================
// OPERAÇÕES BÁSICAS DE PRODUTOS
// =========================================

export const fetchProducts = async (filters: ProductsFilter = {}): Promise<ProductResponse> => {
  const cacheKey = `products:${JSON.stringify(filters)}`;
  
  return withCache(cacheKey, async () => {
    try {
      const response = await apiClient.get('/products', { params: filters });

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } , 5 * 60 * 1000); // Cache por 5 minutos};

export const fetchProductById = async (id: string): Promise<ProductResponse> => {
  const cacheKey = `product:${id}`;
  
  return withCache(cacheKey, async () => {
    try {
      const response = await apiClient.get(`/products/${id}`);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } , 10 * 60 * 1000); // Cache por 10 minutos};

export const createProduct = async (data: ProductFormData): Promise<ProductResponse> => {
  // Validar dados antes de enviar
  const validation = validateProductData(data);

  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join(', ')};

  }

  return withErrorHandling(async () => {
    const response = await withRetry(() => apiClient.post('/products', data));

    // Invalidar cache de listas de produtos
    invalidateProductCache('all');

    return {
      success: true,
      data: (response as any).data};

  }, 'create', { productId: (data as any).id });};

export const updateProduct = async (id: string, data: Partial<ProductFormData>): Promise<ProductResponse> => {
  // Validar dados antes de enviar
  const validation = validateProductData(data as ProductFormData);

  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join(', ')};

  }

  return withErrorHandling(async () => {
    const response = await withRetry(() => apiClient.put(`/products/${id}`, data));

    // Invalidar cache do produto específico e listas
    invalidateProductCache(id);

    return {
      success: true,
      data: (response as any).data};

  }, 'update', { productId: id });};

export const deleteProduct = async (id: string): Promise<ProductResponse> => {
  return withErrorHandling(async () => {
    const response = await withRetry(() => apiClient.delete(`/products/${id}`));

    // Invalidar cache do produto específico e listas
    invalidateProductCache(id);

    return {
      success: true,
      data: (response as any).data};

  }, 'delete', { productId: id });};

// =========================================
// OPERAÇÕES EM LOTE
// =========================================

export const bulkUpdateProducts = async (ids: string[], updates: Partial<ProductFormData>): Promise<ProductResponse> => {
  try {
    const response = await apiClient.put('/products/bulk-update', {
      ids,
      updates
    });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const bulkDeleteProducts = async (ids: string[]): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete('/products/bulk-delete', {
      data: { ids } );

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE STATUS E ESTADO
// =========================================

export const updateProductStatus = async (id: string, status: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/products/${id}/status`, { status });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const duplicateProduct = async (id: string, newName?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/products/${id}/duplicate`, {
      new_name: newName
    });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE PREÇO E INVENTÁRIO
// =========================================

export const updateProductPrice = async (id: string, price: number, currency?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/products/${id}/price`, {
      price,
      currency
    });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const updateProductInventory = async (id: string, inventory: unknown): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/products/${id}/inventory`, inventory);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// UTILITÁRIOS
// =========================================

export const validateProductData = (data: ProductFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || (data as any).name.trim().length === 0) {
    errors.push('Nome do produto é obrigatório');

  }

  if (!data.price || (data as any).price <= 0) {
    errors.push('Preço deve ser maior que zero');

  }

  if (!data.category) {
    errors.push('Categoria é obrigatória');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

export const formatProductPrice = (price: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(price);};

export const generateProductSKU = (name: string, category: string): string => {
  const prefix = category.substring(0, 3).toUpperCase();

  const nameCode = name.substring(0, 3).toUpperCase();

  const timestamp = Date.now().toString().slice(-4);

  return `${prefix}-${nameCode}-${timestamp}`;};
