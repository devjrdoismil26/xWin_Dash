// =========================================
// USE PRODUCTS CORE - HOOK ESPECIALIZADO
// =========================================
// Hook para operações básicas de produtos
// Máximo: 200 linhas

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts,
  bulkDeleteProducts,
  updateProductStatus,
  duplicateProduct,
  updateProductPrice,
  updateProductInventory,
  validateProductData,
  formatProductPrice,
  generateProductSKU
} from '../services/productsCoreService';
import {
  Product,
  ProductFormData,
  ProductResponse,
  ProductsFilter
} from '../types';

interface UseProductsCoreReturn {
  // Estado
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  
  // Operações básicas
  loadProducts: (filters?: ProductsFilter) => Promise<void>;
  loadProduct: (id: string) => Promise<void>;
  createNewProduct: (data: ProductFormData) => Promise<ProductResponse>;
  updateExistingProduct: (id: string, data: Partial<ProductFormData>) => Promise<ProductResponse>;
  deleteExistingProduct: (id: string) => Promise<ProductResponse>;
  
  // Operações em lote
  bulkUpdate: (ids: string[], updates: Partial<ProductFormData>) => Promise<ProductResponse>;
  bulkDelete: (ids: string[]) => Promise<ProductResponse>;
  
  // Operações de status
  changeProductStatus: (id: string, status: string) => Promise<ProductResponse>;
  duplicateExistingProduct: (id: string, newName?: string) => Promise<ProductResponse>;
  
  // Operações de preço e estoque
  changeProductPrice: (id: string, price: number, currency?: string) => Promise<ProductResponse>;
  changeProductInventory: (id: string, inventory: any) => Promise<ProductResponse>;
  
  // Utilitários
  validateData: (data: ProductFormData) => { isValid: boolean; errors: string[] };
  formatPrice: (price: number, currency?: string) => string;
  generateSKU: (name: string, category: string) => string;
  
  // Estado de UI
  clearError: () => void;
  clearCurrentProduct: () => void;
}

export const useProductsCore = (): UseProductsCoreReturn => {
  // =========================================
  // ESTADO
  // =========================================
  
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // =========================================
  // OPERAÇÕES BÁSICAS
  // =========================================

  const loadProducts = useCallback(async (filters: ProductsFilter = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchProducts(filters);
      
      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError(response.error || 'Erro ao carregar produtos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchProductById(id);
      
      if (response.success) {
        setCurrentProduct(response.data);
      } else {
        setError(response.error || 'Erro ao carregar produto');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar produto');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewProduct = useCallback(async (data: ProductFormData): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createProduct(data);
      
      if (response.success) {
        // Recarregar lista de produtos
        await loadProducts();
      } else {
        setError(response.error || 'Erro ao criar produto');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao criar produto'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  const updateExistingProduct = useCallback(async (id: string, data: Partial<ProductFormData>): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateProduct(id, data);
      
      if (response.success) {
        // Atualizar produto atual se for o mesmo
        if (currentProduct?.id === id) {
          setCurrentProduct(response.data);
        }
        // Recarregar lista de produtos
        await loadProducts();
      } else {
        setError(response.error || 'Erro ao atualizar produto');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar produto'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentProduct, loadProducts]);

  const deleteExistingProduct = useCallback(async (id: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteProduct(id);
      
      if (response.success) {
        // Remover produto da lista
        setProducts(prev => prev.filter(p => p.id !== id));
        // Limpar produto atual se for o mesmo
        if (currentProduct?.id === id) {
          setCurrentProduct(null);
        }
      } else {
        setError(response.error || 'Erro ao deletar produto');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao deletar produto'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  // =========================================
  // OPERAÇÕES EM LOTE
  // =========================================

  const bulkUpdate = useCallback(async (ids: string[], updates: Partial<ProductFormData>): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bulkUpdateProducts(ids, updates);
      
      if (response.success) {
        // Recarregar lista de produtos
        await loadProducts();
      } else {
        setError(response.error || 'Erro ao atualizar produtos em lote');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar produtos em lote'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  const bulkDelete = useCallback(async (ids: string[]): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bulkDeleteProducts(ids);
      
      if (response.success) {
        // Remover produtos da lista
        setProducts(prev => prev.filter(p => !ids.includes(p.id)));
        // Limpar produto atual se estiver na lista
        if (currentProduct && ids.includes(currentProduct.id)) {
          setCurrentProduct(null);
        }
      } else {
        setError(response.error || 'Erro ao deletar produtos em lote');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao deletar produtos em lote'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  // =========================================
  // OPERAÇÕES DE STATUS
  // =========================================

  const changeProductStatus = useCallback(async (id: string, status: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateProductStatus(id, status);
      
      if (response.success) {
        // Atualizar produto na lista
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, status } : p
        ));
        // Atualizar produto atual se for o mesmo
        if (currentProduct?.id === id) {
          setCurrentProduct(prev => prev ? { ...prev, status } : null);
        }
      } else {
        setError(response.error || 'Erro ao alterar status do produto');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao alterar status do produto'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  const duplicateExistingProduct = useCallback(async (id: string, newName?: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await duplicateProduct(id, newName);
      
      if (response.success) {
        // Recarregar lista de produtos
        await loadProducts();
      } else {
        setError(response.error || 'Erro ao duplicar produto');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao duplicar produto'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  // =========================================
  // OPERAÇÕES DE PREÇO E ESTOQUE
  // =========================================

  const changeProductPrice = useCallback(async (id: string, price: number, currency?: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateProductPrice(id, price, currency);
      
      if (response.success) {
        // Atualizar produto na lista
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, price, currency: currency || p.currency } : p
        ));
        // Atualizar produto atual se for o mesmo
        if (currentProduct?.id === id) {
          setCurrentProduct(prev => prev ? { ...prev, price, currency: currency || prev.currency } : null);
        }
      } else {
        setError(response.error || 'Erro ao alterar preço do produto');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao alterar preço do produto'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  const changeProductInventory = useCallback(async (id: string, inventory: any): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateProductInventory(id, inventory);
      
      if (response.success) {
        // Atualizar produto na lista
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, inventory } : p
        ));
        // Atualizar produto atual se for o mesmo
        if (currentProduct?.id === id) {
          setCurrentProduct(prev => prev ? { ...prev, inventory } : null);
        }
      } else {
        setError(response.error || 'Erro ao alterar estoque do produto');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao alterar estoque do produto'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [currentProduct]);

  // =========================================
  // UTILITÁRIOS
  // =========================================

  const validateData = useCallback((data: ProductFormData) => {
    return validateProductData(data);
  }, []);

  const formatPrice = useCallback((price: number, currency: string = 'BRL') => {
    return formatProductPrice(price, currency);
  }, []);

  const generateSKU = useCallback((name: string, category: string) => {
    return generateProductSKU(name, category);
  }, []);

  // =========================================
  // ESTADO DE UI
  // =========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentProduct = useCallback(() => {
    setCurrentProduct(null);
  }, []);

  // =========================================
  // EFEITOS
  // =========================================

  useEffect(() => {
    // Carregar produtos iniciais
    loadProducts();
  }, [loadProducts]);

  // =========================================
  // RETORNO
  // =========================================

  return {
    // Estado
    products,
    currentProduct,
    loading,
    error,
    
    // Operações básicas
    loadProducts,
    loadProduct,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
    
    // Operações em lote
    bulkUpdate,
    bulkDelete,
    
    // Operações de status
    changeProductStatus,
    duplicateExistingProduct,
    
    // Operações de preço e estoque
    changeProductPrice,
    changeProductInventory,
    
    // Utilitários
    validateData,
    formatPrice,
    generateSKU,
    
    // Estado de UI
    clearError,
    clearCurrentProduct
  };
};
