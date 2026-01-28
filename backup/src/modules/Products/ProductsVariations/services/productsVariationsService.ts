// =========================================
// PRODUCTS VARIATIONS SERVICE - GERENCIAMENTO DE VARIAÇÕES
// =========================================
// Serviço para operações de variações de produtos
// Máximo: 200 linhas

import { apiClient } from '@/services';
import { validateVariationData } from '../../services/productsValidationService';
import { handleProductsError, withErrorHandling, withRetry } from '../../services/productsErrorService';
import {
  ProductVariation,
  ProductVariationFormData,
  ProductResponse,
  ProductVariationAttribute
} from '../types';

// =========================================
// OPERAÇÕES BÁSICAS DE VARIAÇÕES
// =========================================

export const fetchProductVariations = async (productId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/variations`);
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
};

export const fetchVariationById = async (variationId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/variations/${variationId}`);
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
};

export const createVariation = async (productId: string, data: ProductVariationFormData): Promise<ProductResponse> => {
  // Validar dados antes de enviar
  const validation = validateVariationData(data);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join(', ')
    };
  }

  return withErrorHandling(async () => {
    const response = await withRetry(() => apiClient.post(`/products/${productId}/variations`, data));
    return {
      success: true,
      data: response.data
    };
  }, 'create', { productId });
};

export const updateVariation = async (variationId: string, data: Partial<ProductVariationFormData>): Promise<ProductResponse> => {
  try {
    const response = await apiClient.put(`/variations/${variationId}`, data);
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
};

export const deleteVariation = async (variationId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete(`/variations/${variationId}`);
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
};

// =========================================
// OPERAÇÕES EM LOTE DE VARIAÇÕES
// =========================================

export const bulkUpdateVariations = async (variationIds: string[], updates: Partial<ProductVariationFormData>): Promise<ProductResponse> => {
  try {
    const response = await apiClient.put('/variations/bulk-update', {
      variation_ids: variationIds,
      updates
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
};

export const bulkDeleteVariations = async (variationIds: string[]): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete('/variations/bulk-delete', {
      data: { variation_ids: variationIds }
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
};

// =========================================
// OPERAÇÕES DE ATRIBUTOS
// =========================================

export const fetchVariationAttributes = async (productId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/attributes`);
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
};

export const createVariationAttribute = async (productId: string, attribute: ProductVariationAttribute): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/products/${productId}/attributes`, attribute);
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
};

export const updateVariationAttribute = async (attributeId: string, attribute: Partial<ProductVariationAttribute>): Promise<ProductResponse> => {
  try {
    const response = await apiClient.put(`/attributes/${attributeId}`, attribute);
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
};

export const deleteVariationAttribute = async (attributeId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete(`/attributes/${attributeId}`);
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
};

// =========================================
// OPERAÇÕES DE INVENTÁRIO DE VARIAÇÕES
// =========================================

export const updateVariationInventory = async (variationId: string, inventory: number): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/variations/${variationId}/inventory`, {
      inventory
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
};

export const updateVariationPrice = async (variationId: string, price: number): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/variations/${variationId}/price`, {
      price
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
};

// =========================================
// UTILITÁRIOS
// =========================================

export const validateVariationData = (data: ProductVariationFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Nome da variação é obrigatório');
  }

  if (!data.price || data.price <= 0) {
    errors.push('Preço deve ser maior que zero');
  }

  if (!data.sku || data.sku.trim().length === 0) {
    errors.push('SKU é obrigatório');
  }

  if (data.inventory < 0) {
    errors.push('Estoque não pode ser negativo');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const generateVariationSKU = (productSKU: string, attributes: Record<string, string>): string => {
  const attributeCodes = Object.values(attributes)
    .map(value => value.substring(0, 2).toUpperCase())
    .join('-');
  
  return `${productSKU}-${attributeCodes}`;
};

export const calculateVariationPrice = (basePrice: number, priceModifier: number): number => {
  return basePrice + priceModifier;
};
