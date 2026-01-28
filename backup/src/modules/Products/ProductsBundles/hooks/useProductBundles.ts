// =========================================
// USE PRODUCT BUNDLES - HOOK ESPECIALIZADO
// =========================================
// Hook para operações de bundles de produtos
// Máximo: 200 linhas

import { useState, useEffect, useCallback } from 'react';
import {
  fetchProductBundles,
  fetchBundleById,
  createBundle,
  updateBundle,
  deleteBundle,
  addProductToBundle,
  removeProductFromBundle,
  updateProductQuantityInBundle,
  setBundleDiscount,
  removeBundleDiscount,
  updateBundleStatus,
  checkBundleAvailability,
  calculateBundlePrice,
  updateBundlePrice,
  bulkUpdateBundles,
  bulkDeleteBundles,
  validateBundleData,
  calculateBundleSavings,
  formatBundlePrice
} from '../services/productsBundlesService';
import {
  ProductBundle,
  ProductBundleFormData,
  ProductResponse,
  BundleDiscount
} from '../types';

interface UseProductBundlesReturn {
  // Estado
  bundles: ProductBundle[];
  currentBundle: ProductBundle | null;
  loading: boolean;
  error: string | null;
  
  // Operações básicas
  loadBundles: (filters?: any) => Promise<void>;
  loadBundle: (bundleId: string) => Promise<void>;
  createNewBundle: (data: ProductBundleFormData) => Promise<ProductResponse>;
  updateExistingBundle: (bundleId: string, data: Partial<ProductBundleFormData>) => Promise<ProductResponse>;
  deleteExistingBundle: (bundleId: string) => Promise<ProductResponse>;
  
  // Operações de produtos em bundles
  addProduct: (bundleId: string, productId: string, quantity?: number) => Promise<ProductResponse>;
  removeProduct: (bundleId: string, productId: string) => Promise<ProductResponse>;
  updateProductQuantity: (bundleId: string, productId: string, quantity: number) => Promise<ProductResponse>;
  
  // Operações de desconto
  setDiscount: (bundleId: string, discount: BundleDiscount) => Promise<ProductResponse>;
  removeDiscount: (bundleId: string) => Promise<ProductResponse>;
  
  // Operações de status e disponibilidade
  changeStatus: (bundleId: string, status: string) => Promise<ProductResponse>;
  checkAvailability: (bundleId: string) => Promise<ProductResponse>;
  
  // Operações de preço
  calculatePrice: (bundleId: string) => Promise<ProductResponse>;
  changePrice: (bundleId: string, price: number) => Promise<ProductResponse>;
  
  // Operações em lote
  bulkUpdate: (bundleIds: string[], updates: Partial<ProductBundleFormData>) => Promise<ProductResponse>;
  bulkDelete: (bundleIds: string[]) => Promise<ProductResponse>;
  
  // Utilitários
  validateData: (data: ProductBundleFormData) => { isValid: boolean; errors: string[] };
  calculateSavings: (originalPrice: number, bundlePrice: number) => number;
  formatPrice: (price: number, currency?: string) => string;
  
  // Estado de UI
  clearError: () => void;
  clearCurrentBundle: () => void;
}

export const useProductBundles = (): UseProductBundlesReturn => {
  // =========================================
  // ESTADO
  // =========================================
  
  const [bundles, setBundles] = useState<ProductBundle[]>([]);
  const [currentBundle, setCurrentBundle] = useState<ProductBundle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // =========================================
  // OPERAÇÕES BÁSICAS
  // =========================================

  const loadBundles = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchProductBundles(filters);
      
      if (response.success) {
        setBundles(response.data || []);
      } else {
        setError(response.error || 'Erro ao carregar bundles');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar bundles');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBundle = useCallback(async (bundleId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchBundleById(bundleId);
      
      if (response.success) {
        setCurrentBundle(response.data);
      } else {
        setError(response.error || 'Erro ao carregar bundle');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar bundle');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewBundle = useCallback(async (data: ProductBundleFormData): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createBundle(data);
      
      if (response.success) {
        // Recarregar bundles
        await loadBundles();
      } else {
        setError(response.error || 'Erro ao criar bundle');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao criar bundle'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [loadBundles]);

  const updateExistingBundle = useCallback(async (bundleId: string, data: Partial<ProductBundleFormData>): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateBundle(bundleId, data);
      
      if (response.success) {
        // Atualizar bundle atual se for o mesmo
        if (currentBundle?.id === bundleId) {
          setCurrentBundle(response.data);
        }
        // Atualizar na lista
        setBundles(prev => prev.map(b => 
          b.id === bundleId ? response.data : b
        ));
      } else {
        setError(response.error || 'Erro ao atualizar bundle');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar bundle'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentBundle]);

  const deleteExistingBundle = useCallback(async (bundleId: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteBundle(bundleId);
      
      if (response.success) {
        // Remover bundle da lista
        setBundles(prev => prev.filter(b => b.id !== bundleId));
        // Limpar bundle atual se for o mesmo
        if (currentBundle?.id === bundleId) {
          setCurrentBundle(null);
        }
      } else {
        setError(response.error || 'Erro ao deletar bundle');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao deletar bundle'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentBundle]);

  // =========================================
  // OPERAÇÕES DE PRODUTOS EM BUNDLES
  // =========================================

  const addProduct = useCallback(async (bundleId: string, productId: string, quantity: number = 1): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await addProductToBundle(bundleId, productId, quantity);
      
      if (response.success) {
        // Recarregar bundle atual
        if (currentBundle?.id === bundleId) {
          await loadBundle(bundleId);
        }
      } else {
        setError(response.error || 'Erro ao adicionar produto ao bundle');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao adicionar produto ao bundle'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentBundle, loadBundle]);

  const removeProduct = useCallback(async (bundleId: string, productId: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await removeProductFromBundle(bundleId, productId);
      
      if (response.success) {
        // Recarregar bundle atual
        if (currentBundle?.id === bundleId) {
          await loadBundle(bundleId);
        }
      } else {
        setError(response.error || 'Erro ao remover produto do bundle');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao remover produto do bundle'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentBundle, loadBundle]);

  const updateProductQuantity = useCallback(async (bundleId: string, productId: string, quantity: number): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateProductQuantityInBundle(bundleId, productId, quantity);
      
      if (response.success) {
        // Recarregar bundle atual
        if (currentBundle?.id === bundleId) {
          await loadBundle(bundleId);
        }
      } else {
        setError(response.error || 'Erro ao atualizar quantidade do produto');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar quantidade do produto'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentBundle, loadBundle]);

  // =========================================
  // OPERAÇÕES DE DESCONTO
  // =========================================

  const setDiscount = useCallback(async (bundleId: string, discount: BundleDiscount): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await setBundleDiscount(bundleId, discount);
      
      if (response.success) {
        // Atualizar bundle atual se for o mesmo
        if (currentBundle?.id === bundleId) {
          setCurrentBundle(prev => prev ? { ...prev, discount } : null);
        }
        // Atualizar na lista
        setBundles(prev => prev.map(b => 
          b.id === bundleId ? { ...b, discount } : b
        ));
      } else {
        setError(response.error || 'Erro ao definir desconto');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao definir desconto'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentBundle]);

  const removeDiscount = useCallback(async (bundleId: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await removeBundleDiscount(bundleId);
      
      if (response.success) {
        // Atualizar bundle atual se for o mesmo
        if (currentBundle?.id === bundleId) {
          setCurrentBundle(prev => prev ? { ...prev, discount: null } : null);
        }
        // Atualizar na lista
        setBundles(prev => prev.map(b => 
          b.id === bundleId ? { ...b, discount: null } : b
        ));
      } else {
        setError(response.error || 'Erro ao remover desconto');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao remover desconto'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentBundle]);

  // =========================================
  // OPERAÇÕES DE STATUS E DISPONIBILIDADE
  // =========================================

  const changeStatus = useCallback(async (bundleId: string, status: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateBundleStatus(bundleId, status);
      
      if (response.success) {
        // Atualizar bundle na lista
        setBundles(prev => prev.map(b => 
          b.id === bundleId ? { ...b, status } : b
        ));
        // Atualizar bundle atual se for o mesmo
        if (currentBundle?.id === bundleId) {
          setCurrentBundle(prev => prev ? { ...prev, status } : null);
        }
      } else {
        setError(response.error || 'Erro ao alterar status do bundle');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao alterar status do bundle'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentBundle]);

  const checkAvailability = useCallback(async (bundleId: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await checkBundleAvailability(bundleId);
      
      if (!response.success) {
        setError(response.error || 'Erro ao verificar disponibilidade');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao verificar disponibilidade'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // OPERAÇÕES DE PREÇO
  // =========================================

  const calculatePrice = useCallback(async (bundleId: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await calculateBundlePrice(bundleId);
      
      if (!response.success) {
        setError(response.error || 'Erro ao calcular preço');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao calcular preço'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePrice = useCallback(async (bundleId: string, price: number): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateBundlePrice(bundleId, price);
      
      if (response.success) {
        // Atualizar bundle na lista
        setBundles(prev => prev.map(b => 
          b.id === bundleId ? { ...b, price } : b
        ));
        // Atualizar bundle atual se for o mesmo
        if (currentBundle?.id === bundleId) {
          setCurrentBundle(prev => prev ? { ...prev, price } : null);
        }
      } else {
        setError(response.error || 'Erro ao alterar preço do bundle');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao alterar preço do bundle'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentBundle]);

  // =========================================
  // OPERAÇÕES EM LOTE
  // =========================================

  const bulkUpdate = useCallback(async (bundleIds: string[], updates: Partial<ProductBundleFormData>): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bulkUpdateBundles(bundleIds, updates);
      
      if (response.success) {
        // Atualizar bundles na lista
        setBundles(prev => prev.map(b => 
          bundleIds.includes(b.id) ? { ...b, ...updates } : b
        ));
      } else {
        setError(response.error || 'Erro ao atualizar bundles em lote');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar bundles em lote'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDelete = useCallback(async (bundleIds: string[]): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bulkDeleteBundles(bundleIds);
      
      if (response.success) {
        // Remover bundles da lista
        setBundles(prev => prev.filter(b => !bundleIds.includes(b.id)));
        // Limpar bundle atual se estiver na lista
        if (currentBundle && bundleIds.includes(currentBundle.id)) {
          setCurrentBundle(null);
        }
      } else {
        setError(response.error || 'Erro ao deletar bundles em lote');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao deletar bundles em lote'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentBundle]);

  // =========================================
  // UTILITÁRIOS
  // =========================================

  const validateData = useCallback((data: ProductBundleFormData) => {
    return validateBundleData(data);
  }, []);

  const calculateSavings = useCallback((originalPrice: number, bundlePrice: number) => {
    return calculateBundleSavings(originalPrice, bundlePrice);
  }, []);

  const formatPrice = useCallback((price: number, currency: string = 'BRL') => {
    return formatBundlePrice(price, currency);
  }, []);

  // =========================================
  // ESTADO DE UI
  // =========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentBundle = useCallback(() => {
    setCurrentBundle(null);
  }, []);

  // =========================================
  // EFEITOS
  // =========================================

  useEffect(() => {
    // Carregar bundles iniciais
    loadBundles();
  }, [loadBundles]);

  // =========================================
  // RETORNO
  // =========================================

  return {
    // Estado
    bundles,
    currentBundle,
    loading,
    error,
    
    // Operações básicas
    loadBundles,
    loadBundle,
    createNewBundle,
    updateExistingBundle,
    deleteExistingBundle,
    
    // Operações de produtos em bundles
    addProduct,
    removeProduct,
    updateProductQuantity,
    
    // Operações de desconto
    setDiscount,
    removeDiscount,
    
    // Operações de status e disponibilidade
    changeStatus,
    checkAvailability,
    
    // Operações de preço
    calculatePrice,
    changePrice,
    
    // Operações em lote
    bulkUpdate,
    bulkDelete,
    
    // Utilitários
    validateData,
    calculateSavings,
    formatPrice,
    
    // Estado de UI
    clearError,
    clearCurrentBundle
  };
};
