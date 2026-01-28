// =========================================
// USE PRODUCT INVENTORY - HOOK ESPECIALIZADO
// =========================================
// Hook para operações de estoque de produtos
// Máximo: 200 linhas

import { useState, useEffect, useCallback } from 'react';
import {
  fetchProductInventory,
  fetchAllInventory,
  updateProductInventory,
  addStock,
  removeStock,
  adjustStock,
  fetchInventoryHistory,
  fetchInventoryMovements,
  fetchInventoryAlerts,
  createInventoryAlert,
  updateInventoryAlert,
  deleteInventoryAlert,
  fetchStockLevels,
  updateStockLevels,
  generateInventoryReport,
  exportInventoryData,
  validateInventoryData,
  calculateStockValue,
  getStockStatus
} from '../services/productsInventoryService';
import {
  ProductInventory,
  InventoryMovement,
  ProductResponse,
  InventoryAlert,
  StockLevel
} from '../types';

interface UseProductInventoryReturn {
  // Estado
  inventory: ProductInventory | null;
  allInventory: ProductInventory[];
  history: InventoryMovement[];
  movements: InventoryMovement[];
  alerts: InventoryAlert[];
  stockLevels: StockLevel[];
  loading: boolean;
  error: string | null;
  
  // Operações básicas
  loadInventory: (productId: string) => Promise<void>;
  loadAllInventory: (filters?: any) => Promise<void>;
  updateInventory: (productId: string, inventory: Partial<ProductInventory>) => Promise<ProductResponse>;
  
  // Operações de movimentação
  addStock: (productId: string, quantity: number, reason?: string) => Promise<ProductResponse>;
  removeStock: (productId: string, quantity: number, reason?: string) => Promise<ProductResponse>;
  adjustStock: (productId: string, newQuantity: number, reason?: string) => Promise<ProductResponse>;
  
  // Operações de histórico
  loadHistory: (productId: string, filters?: any) => Promise<void>;
  loadMovements: (filters?: any) => Promise<void>;
  
  // Operações de alertas
  loadAlerts: (filters?: any) => Promise<void>;
  createAlert: (productId: string, alert: InventoryAlert) => Promise<ProductResponse>;
  updateAlert: (alertId: string, alert: Partial<InventoryAlert>) => Promise<ProductResponse>;
  deleteAlert: (alertId: string) => Promise<ProductResponse>;
  
  // Operações de níveis de estoque
  loadStockLevels: (filters?: any) => Promise<void>;
  updateStockLevels: (productId: string, levels: StockLevel) => Promise<ProductResponse>;
  
  // Operações de relatórios
  generateReport: (filters?: any) => Promise<ProductResponse>;
  exportData: (format: 'csv' | 'xlsx' | 'pdf', filters?: any) => Promise<ProductResponse>;
  
  // Utilitários
  validateData: (inventory: Partial<ProductInventory>) => { isValid: boolean; errors: string[] };
  calculateValue: (quantity: number, unitCost: number) => number;
  getStatus: (quantity: number, minStock: number, maxStock: number) => 'low' | 'normal' | 'high' | 'out';
  
  // Estado de UI
  clearError: () => void;
  clearData: () => void;
}

export const useProductInventory = (): UseProductInventoryReturn => {
  // =========================================
  // ESTADO
  // =========================================
  
  const [inventory, setInventory] = useState<ProductInventory | null>(null);
  const [allInventory, setAllInventory] = useState<ProductInventory[]>([]);
  const [history, setHistory] = useState<InventoryMovement[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // =========================================
  // OPERAÇÕES BÁSICAS
  // =========================================

  const loadInventory = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchProductInventory(productId);
      
      if (response.success) {
        setInventory(response.data);
      } else {
        setError(response.error || 'Erro ao carregar estoque');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar estoque');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllInventory = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchAllInventory(filters);
      
      if (response.success) {
        setAllInventory(response.data || []);
      } else {
        setError(response.error || 'Erro ao carregar estoque geral');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar estoque geral');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInventory = useCallback(async (productId: string, inventoryData: Partial<ProductInventory>): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateProductInventory(productId, inventoryData);
      
      if (response.success) {
        // Atualizar estoque atual se for o mesmo produto
        if (inventory?.product_id === productId) {
          setInventory(response.data);
        }
        // Atualizar na lista geral
        setAllInventory(prev => prev.map(inv => 
          inv.product_id === productId ? response.data : inv
        ));
      } else {
        setError(response.error || 'Erro ao atualizar estoque');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar estoque'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [inventory]);

  // =========================================
  // OPERAÇÕES DE MOVIMENTAÇÃO
  // =========================================

  const addStock = useCallback(async (productId: string, quantity: number, reason?: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await addStock(productId, quantity, reason);
      
      if (response.success) {
        // Recarregar estoque
        await loadInventory(productId);
        // Recarregar histórico
        await loadHistory(productId);
      } else {
        setError(response.error || 'Erro ao adicionar estoque');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao adicionar estoque'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [loadInventory, loadHistory]);

  const removeStock = useCallback(async (productId: string, quantity: number, reason?: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await removeStock(productId, quantity, reason);
      
      if (response.success) {
        // Recarregar estoque
        await loadInventory(productId);
        // Recarregar histórico
        await loadHistory(productId);
      } else {
        setError(response.error || 'Erro ao remover estoque');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao remover estoque'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [loadInventory, loadHistory]);

  const adjustStock = useCallback(async (productId: string, newQuantity: number, reason?: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adjustStock(productId, newQuantity, reason);
      
      if (response.success) {
        // Recarregar estoque
        await loadInventory(productId);
        // Recarregar histórico
        await loadHistory(productId);
      } else {
        setError(response.error || 'Erro ao ajustar estoque');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao ajustar estoque'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [loadInventory, loadHistory]);

  // =========================================
  // OPERAÇÕES DE HISTÓRICO
  // =========================================

  const loadHistory = useCallback(async (productId: string, filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchInventoryHistory(productId, filters);
      
      if (response.success) {
        setHistory(response.data || []);
      } else {
        setError(response.error || 'Erro ao carregar histórico');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar histórico');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMovements = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchInventoryMovements(filters);
      
      if (response.success) {
        setMovements(response.data || []);
      } else {
        setError(response.error || 'Erro ao carregar movimentações');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar movimentações');
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // OPERAÇÕES DE ALERTAS
  // =========================================

  const loadAlerts = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchInventoryAlerts(filters);
      
      if (response.success) {
        setAlerts(response.data || []);
      } else {
        setError(response.error || 'Erro ao carregar alertas');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar alertas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAlert = useCallback(async (productId: string, alert: InventoryAlert): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createInventoryAlert(productId, alert);
      
      if (response.success) {
        // Recarregar alertas
        await loadAlerts();
      } else {
        setError(response.error || 'Erro ao criar alerta');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao criar alerta'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [loadAlerts]);

  const updateAlert = useCallback(async (alertId: string, alert: Partial<InventoryAlert>): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateInventoryAlert(alertId, alert);
      
      if (response.success) {
        // Atualizar alerta na lista
        setAlerts(prev => prev.map(a => 
          a.id === alertId ? { ...a, ...alert } : a
        ));
      } else {
        setError(response.error || 'Erro ao atualizar alerta');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar alerta'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAlert = useCallback(async (alertId: string): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteInventoryAlert(alertId);
      
      if (response.success) {
        // Remover alerta da lista
        setAlerts(prev => prev.filter(a => a.id !== alertId));
      } else {
        setError(response.error || 'Erro ao deletar alerta');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao deletar alerta'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // OPERAÇÕES DE NÍVEIS DE ESTOQUE
  // =========================================

  const loadStockLevels = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchStockLevels(filters);
      
      if (response.success) {
        setStockLevels(response.data || []);
      } else {
        setError(response.error || 'Erro ao carregar níveis de estoque');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao carregar níveis de estoque');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStockLevels = useCallback(async (productId: string, levels: StockLevel): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateStockLevels(productId, levels);
      
      if (response.success) {
        // Atualizar estoque atual se for o mesmo produto
        if (inventory?.product_id === productId) {
          setInventory(prev => prev ? { ...prev, ...levels } : null);
        }
      } else {
        setError(response.error || 'Erro ao atualizar níveis de estoque');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar níveis de estoque'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, [inventory]);

  // =========================================
  // OPERAÇÕES DE RELATÓRIOS
  // =========================================

  const generateReport = useCallback(async (filters?: any): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await generateInventoryReport(filters);
      
      if (!response.success) {
        setError(response.error || 'Erro ao gerar relatório');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao gerar relatório'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportData = useCallback(async (format: 'csv' | 'xlsx' | 'pdf', filters?: any): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await exportInventoryData(format, filters);
      
      if (!response.success) {
        setError(response.error || 'Erro ao exportar dados');
      }
      
      return response;
    } catch (err: any) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao exportar dados'
      };
      setError(errorResponse.error);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // UTILITÁRIOS
  // =========================================

  const validateData = useCallback((inventoryData: Partial<ProductInventory>) => {
    return validateInventoryData(inventoryData);
  }, []);

  const calculateValue = useCallback((quantity: number, unitCost: number) => {
    return calculateStockValue(quantity, unitCost);
  }, []);

  const getStatus = useCallback((quantity: number, minStock: number, maxStock: number) => {
    return getStockStatus(quantity, minStock, maxStock);
  }, []);

  // =========================================
  // ESTADO DE UI
  // =========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setInventory(null);
    setAllInventory([]);
    setHistory([]);
    setMovements([]);
    setAlerts([]);
    setStockLevels([]);
  }, []);

  // =========================================
  // EFEITOS
  // =========================================

  useEffect(() => {
    // Carregar dados iniciais
    loadAllInventory();
    loadMovements();
    loadAlerts();
    loadStockLevels();
  }, [loadAllInventory, loadMovements, loadAlerts, loadStockLevels]);

  // =========================================
  // RETORNO
  // =========================================

  return {
    // Estado
    inventory,
    allInventory,
    history,
    movements,
    alerts,
    stockLevels,
    loading,
    error,
    
    // Operações básicas
    loadInventory,
    loadAllInventory,
    updateInventory,
    
    // Operações de movimentação
    addStock,
    removeStock,
    adjustStock,
    
    // Operações de histórico
    loadHistory,
    loadMovements,
    
    // Operações de alertas
    loadAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
    
    // Operações de níveis de estoque
    loadStockLevels,
    updateStockLevels,
    
    // Operações de relatórios
    generateReport,
    exportData,
    
    // Utilitários
    validateData,
    calculateValue,
    getStatus,
    
    // Estado de UI
    clearError,
    clearData
  };
};
