// =========================================
// USE PRODUCT VARIATIONS - HOOK ESPECIALIZADO
// =========================================
// Hook para operações de variações de produtos
// Máximo: 200 linhas

import { useState, useEffect, useCallback } from 'react';
import {
  fetchProductVariations,
  fetchVariationById,
  createVariation,
  updateVariation,
  deleteVariation,
  bulkUpdateVariations,
  bulkDeleteVariations,
  fetchVariationAttributes,
  createVariationAttribute,
  updateVariationAttribute,
  deleteVariationAttribute,
  updateVariationInventory,
  updateVariationPrice,
  validateVariationData,
  generateVariationSKU,
  calculateVariationPrice
} from '../services/productsVariationsService';
import {
  ProductVariation,
  ProductVariationFormData,
  ProductResponse,
  ProductVariationAttribute
} from '../types';

interface UseProductVariationsReturn {
  // Estado
  variations: ProductVariation[];
  currentVariation: ProductVariation | null;
  attributes: ProductVariationAttribute[];
  loading: boolean;
  error: string | null;
  
  // Operações básicas
  loadVariations: (productId: string) => Promise<void>;
  loadVariation: (variationId: string) => Promise<void>;
  createNewVariation: (productId: string, data: ProductVariationFormData) => Promise<ProductResponse>;
  updateExistingVariation: (variationId: string, data: Partial<ProductVariationFormData>) => Promise<ProductResponse>;
  deleteExistingVariation: (variationId: string) => Promise<ProductResponse>;
  
  // Operações em lote
  bulkUpdateVariations: (variationIds: string[], updates: Partial<ProductVariationFormData>) => Promise<ProductResponse>;
  bulkDeleteVariations: (variationIds: string[]) => Promise<ProductResponse>;
  
  // Operações de atributos
  loadAttributes: (productId: string) => Promise<void>;
  createNewAttribute: (productId: string, attribute: ProductVariationAttribute) => Promise<ProductResponse>;
  updateExistingAttribute: (attributeId: string, attribute: Partial<ProductVariationAttribute>) => Promise<ProductResponse>;
  deleteExistingAttribute: (attributeId: string) => Promise<ProductResponse>;
  
  // Operações de preço e estoque
  changeVariationPrice: (variationId: string, price: number) => Promise<ProductResponse>;
  changeVariationInventory: (variationId: string, inventory: number) => Promise<ProductResponse>;
  
  // Utilitários
  validateData: (data: ProductVariationFormData) => { isValid: boolean; errors: string[] };
  generateSKU: (productSKU: string, attributes: Record<string, string>) => string;
  calculatePrice: (basePrice: number, priceModifier: number) => number;
  
  // Estado de UI
  clearError: () => void;
  clearCurrentVariation: () => void;
}

export const useProductVariations = (): UseProductVariationsReturn => {
  // =========================================
  // ESTADO
  // =========================================
  
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [currentVariation, setCurrentVariation] = useState<ProductVariation | null>(null);
  const [attributes, setAttributes] = useState<ProductVariationAttribute[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // =========================================
  // OPERAÇÕES BÁSICAS
  // =========================================

  const loadVariations = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchProductVariations(productId);
      
      if (response.success) {
        setVariations(response.data || []);
      } else {
        setError(response.error || 'Erro ao carregar variações');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar variações');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadVariation = useCallback(async (variationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchVariationById(variationId);
      
      if (response.success) {
        setCurrentVariation(response.data);
      } else {
        setError(response.error || 'Erro ao carregar variação');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar variação');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewVariation = useCallback(async (productId: string, data: ProductVariationFormData): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createVariation(productId, data);
      
      if (response.success) {
        // Recarregar variações
        await loadVariations(productId);
      } else {
        setError(response.error || 'Erro ao criar variação');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao criar variação'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [loadVariations]);

  const updateExistingVariation = useCallback(async (variationId: string, data: Partial<ProductVariationFormData>): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateVariation(variationId, data);
      
      if (response.success) {
        // Atualizar variação atual se for a mesma
        if (currentVariation?.id === variationId) {
          setCurrentVariation(response.data);
        }
        // Atualizar na lista
        setVariations(prev => prev.map(v => 
          v.id === variationId ? response.data : v
        ));
      } else {
        setError(response.error || 'Erro ao atualizar variação');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar variação'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentVariation]);

  const deleteExistingVariation = useCallback(async (variationId: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteVariation(variationId);
      
      if (response.success) {
        // Remover variação da lista
        setVariations(prev => prev.filter(v => v.id !== variationId));
        // Limpar variação atual se for a mesma
        if (currentVariation?.id === variationId) {
          setCurrentVariation(null);
        }
      } else {
        setError(response.error || 'Erro ao deletar variação');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao deletar variação'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentVariation]);

  // =========================================
  // OPERAÇÕES EM LOTE
  // =========================================

  const bulkUpdateVariations = useCallback(async (variationIds: string[], updates: Partial<ProductVariationFormData>): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bulkUpdateVariations(variationIds, updates);
      
      if (response.success) {
        // Atualizar variações na lista
        setVariations(prev => prev.map(v => 
          variationIds.includes(v.id) ? { ...v, ...updates } : v
        ));
      } else {
        setError(response.error || 'Erro ao atualizar variações em lote');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar variações em lote'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeleteVariations = useCallback(async (variationIds: string[]): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bulkDeleteVariations(variationIds);
      
      if (response.success) {
        // Remover variações da lista
        setVariations(prev => prev.filter(v => !variationIds.includes(v.id)));
        // Limpar variação atual se estiver na lista
        if (currentVariation && variationIds.includes(currentVariation.id)) {
          setCurrentVariation(null);
        }
      } else {
        setError(response.error || 'Erro ao deletar variações em lote');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao deletar variações em lote'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentVariation]);

  // =========================================
  // OPERAÇÕES DE ATRIBUTOS
  // =========================================

  const loadAttributes = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchVariationAttributes(productId);
      
      if (response.success) {
        setAttributes(response.data || []);
      } else {
        setError(response.error || 'Erro ao carregar atributos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar atributos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewAttribute = useCallback(async (productId: string, attribute: ProductVariationAttribute): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createVariationAttribute(productId, attribute);
      
      if (response.success) {
        // Recarregar atributos
        await loadAttributes(productId);
      } else {
        setError(response.error || 'Erro ao criar atributo');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao criar atributo'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [loadAttributes]);

  const updateExistingAttribute = useCallback(async (attributeId: string, attribute: Partial<ProductVariationAttribute>): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateVariationAttribute(attributeId, attribute);
      
      if (response.success) {
        // Atualizar atributo na lista
        setAttributes(prev => prev.map(a => 
          a.id === attributeId ? { ...a, ...attribute } : a
        ));
      } else {
        setError(response.error || 'Erro ao atualizar atributo');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar atributo'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExistingAttribute = useCallback(async (attributeId: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteVariationAttribute(attributeId);
      
      if (response.success) {
        // Remover atributo da lista
        setAttributes(prev => prev.filter(a => a.id !== attributeId));
      } else {
        setError(response.error || 'Erro ao deletar atributo');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao deletar atributo'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // OPERAÇÕES DE PREÇO E ESTOQUE
  // =========================================

  const changeVariationPrice = useCallback(async (variationId: string, price: number): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateVariationPrice(variationId, price);
      
      if (response.success) {
        // Atualizar variação na lista
        setVariations(prev => prev.map(v => 
          v.id === variationId ? { ...v, price } : v
        ));
        // Atualizar variação atual se for a mesma
        if (currentVariation?.id === variationId) {
          setCurrentVariation(prev => prev ? { ...prev, price } : null);
        }
      } else {
        setError(response.error || 'Erro ao alterar preço da variação');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao alterar preço da variação'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentVariation]);

  const changeVariationInventory = useCallback(async (variationId: string, inventory: number): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateVariationInventory(variationId, inventory);
      
      if (response.success) {
        // Atualizar variação na lista
        setVariations(prev => prev.map(v => 
          v.id === variationId ? { ...v, inventory } : v
        ));
        // Atualizar variação atual se for a mesma
        if (currentVariation?.id === variationId) {
          setCurrentVariation(prev => prev ? { ...prev, inventory } : null);
        }
      } else {
        setError(response.error || 'Erro ao alterar estoque da variação');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao alterar estoque da variação'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentVariation]);

  // =========================================
  // UTILITÁRIOS
  // =========================================

  const validateData = useCallback((data: ProductVariationFormData) => {
    return validateVariationData(data);
  }, []);

  const generateSKU = useCallback((productSKU: string, attributes: Record<string, string>) => {
    return generateVariationSKU(productSKU, attributes);
  }, []);

  const calculatePrice = useCallback((basePrice: number, priceModifier: number) => {
    return calculateVariationPrice(basePrice, priceModifier);
  }, []);

  // =========================================
  // ESTADO DE UI
  // =========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentVariation = useCallback(() => {
    setCurrentVariation(null);
  }, []);

  // =========================================
  // RETORNO
  // =========================================

  return {
    // Estado
    variations,
    currentVariation,
    attributes,
    loading,
    error,
    
    // Operações básicas
    loadVariations,
    loadVariation,
    createNewVariation,
    updateExistingVariation,
    deleteExistingVariation,
    
    // Operações em lote
    bulkUpdateVariations,
    bulkDeleteVariations,
    
    // Operações de atributos
    loadAttributes,
    createNewAttribute,
    updateExistingAttribute,
    deleteExistingAttribute,
    
    // Operações de preço e estoque
    changeVariationPrice,
    changeVariationInventory,
    
    // Utilitários
    validateData,
    generateSKU,
    calculatePrice,
    
    // Estado de UI
    clearError,
    clearCurrentVariation
  };
};
