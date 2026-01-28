/**
 * Hook orquestrador do módulo Products
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useProductsStore } from './useProductsStore';
import { useProductsCore } from '../ProductsCore/hooks/useProductsCore';
import { Product, ProductFilters, ProductFormData } from '../types';

interface UseProductsReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  
  // Dados principais
  products: Product[];
  currentProduct: Product | null;
  
  // Ações principais
  loadProducts: (filters?: ProductFilters) => Promise<void>;
  createProduct: (data: ProductFormData) => Promise<Product>;
  updateProduct: (id: string, data: ProductFormData) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Hooks especializados
  core: ReturnType<typeof useProductsCore>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();
  const store = useProductsStore();
  const core = useProductsCore();
  
  // Lógica de orquestração
  const loadProducts = useCallback(async (filters?: ProductFilters) => {
    try {
      await core.loadProducts(filters);
      showSuccess('Produtos carregados com sucesso!');
    } catch (error: any) {
      showError('Erro ao carregar produtos', error.message);
    }
  }, [core, showSuccess, showError]);
  
  const createProduct = useCallback(async (data: ProductFormData) => {
    try {
      const result = await core.createProduct(data);
      showSuccess('Produto criado com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao criar produto', error.message);
      throw error;
    }
  }, [core, showSuccess, showError]);
  
  const updateProduct = useCallback(async (id: string, data: ProductFormData) => {
    try {
      const result = await core.updateProduct(id, data);
      showSuccess('Produto atualizado com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao atualizar produto', error.message);
      throw error;
    }
  }, [core, showSuccess, showError]);
  
  const deleteProduct = useCallback(async (id: string) => {
    try {
      await core.deleteProduct(id);
      showSuccess('Produto excluído com sucesso!');
    } catch (error: any) {
      showError('Erro ao excluir produto', error.message);
      throw error;
    }
  }, [core, showSuccess, showError]);
  
  return {
    loading: store.loading || core.loading,
    error: store.error || core.error,
    products: store.products,
    currentProduct: store.currentProduct,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    core,
    clearError: () => {
      store.clearError();
      core.clearError();
    },
    refresh: loadProducts
  };
};