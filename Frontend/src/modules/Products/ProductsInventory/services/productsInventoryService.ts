// =========================================
// PRODUCTS INVENTORY SERVICE - GERENCIAMENTO DE ESTOQUE
// =========================================
// Serviço para operações de estoque de produtos
// Máximo: 200 linhas

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { validateInventoryData, validateInventoryAlert } from '@/services/productsValidationService';
import { handleProductsError, withErrorHandling, withRetry } from '@/services/productsErrorService';
import { ProductInventory, InventoryMovement, ProductResponse, InventoryAlert, StockLevel } from '../types';

// =========================================
// OPERAÇÕES BÁSICAS DE ESTOQUE
// =========================================

export const fetchProductInventory = async (productId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/inventory`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchAllInventory = async (filters?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get('/inventory', { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const updateProductInventory = async (productId: string, inventory: Partial<ProductInventory>): Promise<ProductResponse> => {
  // Validar dados antes de enviar
  const validation = validateInventoryData(inventory);

  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join(', ')};

  }

  return withErrorHandling(async () => {
    const response = await withRetry(() => apiClient.patch(`/products/${productId}/inventory`, inventory));

    return {
      success: true,
      data: (response as any).data};

  }, 'update', { productId });};

// =========================================
// OPERAÇÕES DE MOVIMENTAÇÃO DE ESTOQUE
// =========================================

export const addStock = async (productId: string, quantity: number, reason?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/products/${productId}/inventory/add`, {
      quantity,
      reason
    });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const removeStock = async (productId: string, quantity: number, reason?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/products/${productId}/inventory/remove`, {
      quantity,
      reason
    });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const adjustStock = async (productId: string, newQuantity: number, reason?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/products/${productId}/inventory/adjust`, {
      quantity: newQuantity,
      reason
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
// OPERAÇÕES DE HISTÓRICO DE MOVIMENTAÇÕES
// =========================================

export const fetchInventoryHistory = async (productId: string, filters?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/inventory/history`, { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchInventoryMovements = async (filters?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get('/inventory/movements', { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE ALERTAS DE ESTOQUE
// =========================================

export const fetchInventoryAlerts = async (filters?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get('/inventory/alerts', { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const createInventoryAlert = async (productId: string, alert: InventoryAlert): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/products/${productId}/inventory/alerts`, alert);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const updateInventoryAlert = async (alertId: string, alert: Partial<InventoryAlert>): Promise<ProductResponse> => {
  try {
    const response = await apiClient.put(`/inventory/alerts/${alertId}`, alert);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const deleteInventoryAlert = async (alertId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete(`/inventory/alerts/${alertId}`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE NÍVEIS DE ESTOQUE
// =========================================

export const fetchStockLevels = async (filters?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get('/inventory/stock-levels', { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const updateStockLevels = async (productId: string, levels: StockLevel): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/products/${productId}/inventory/stock-levels`, levels);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE RELATÓRIOS DE ESTOQUE
// =========================================

export const generateInventoryReport = async (filters?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post('/inventory/reports', { filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const exportInventoryData = async (format: 'csv' | 'xlsx' | 'pdf', filters?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post('/inventory/export', {
      format,
      filters
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
// UTILITÁRIOS
// =========================================

export const validateInventoryData = (inventory: Partial<ProductInventory>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (inventory.quantity !== undefined && inventory.quantity < 0) {
    errors.push('Quantidade não pode ser negativa');

  }

  if (inventory.min_stock !== undefined && inventory.min_stock < 0) {
    errors.push('Estoque mínimo não pode ser negativo');

  }

  if (inventory.max_stock !== undefined && inventory.max_stock < 0) {
    errors.push('Estoque máximo não pode ser negativo');

  }

  if (inventory.min_stock !== undefined && inventory.max_stock !== undefined && inventory.min_stock > inventory.max_stock) {
    errors.push('Estoque mínimo não pode ser maior que o máximo');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

export const calculateStockValue = (quantity: number, unitCost: number): number => {
  return quantity * unitCost;};

export const getStockStatus = (quantity: number, minStock: number, maxStock: number): 'low' | 'normal' | 'high' | 'out' => {
  if (quantity === 0) return 'out';
  if (quantity <= minStock) return 'low';
  if (quantity >= maxStock) return 'high';
  return 'normal';};
