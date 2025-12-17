// =========================================
// PRODUCTS BUNDLES SERVICE - GERENCIAMENTO DE BUNDLES
// =========================================
// Serviço para operações de bundles de produtos
// Máximo: 200 linhas

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { validateBundleData } from '@/services/productsValidationService';
import { handleProductsError, withErrorHandling, withRetry } from '@/services/productsErrorService';
import { ProductBundle, ProductBundleFormData, ProductResponse, BundleDiscount } from '../types';

// =========================================
// OPERAÇÕES BÁSICAS DE BUNDLES
// =========================================

export const fetchProductBundles = async (filters?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get('/bundles', { params: filters });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchBundleById = async (bundleId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/bundles/${bundleId}`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const createBundle = async (data: ProductBundleFormData): Promise<ProductResponse> => {
  // Validar dados antes de enviar
  const validation = validateBundleData(data);

  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join(', ')};

  }

  return withErrorHandling(async () => {
    const response = await withRetry(() => apiClient.post('/bundles', data));

    return {
      success: true,
      data: (response as any).data};

  }, 'create');};

export const updateBundle = async (bundleId: string, data: Partial<ProductBundleFormData>): Promise<ProductResponse> => {
  try {
    const response = await apiClient.put(`/bundles/${bundleId}`, data);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const deleteBundle = async (bundleId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete(`/bundles/${bundleId}`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE PRODUTOS EM BUNDLES
// =========================================

export const addProductToBundle = async (bundleId: string, productId: string, quantity: number = 1): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/bundles/${bundleId}/products`, {
      product_id: productId,
      quantity
    });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const removeProductFromBundle = async (bundleId: string, productId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete(`/bundles/${bundleId}/products/${productId}`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const updateProductQuantityInBundle = async (bundleId: string, productId: string, quantity: number): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/bundles/${bundleId}/products/${productId}`, {
      quantity
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
// OPERAÇÕES DE DESCONTO
// =========================================

export const setBundleDiscount = async (bundleId: string, discount: BundleDiscount): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/bundles/${bundleId}/discount`, discount);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const removeBundleDiscount = async (bundleId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete(`/bundles/${bundleId}/discount`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE STATUS E DISPONIBILIDADE
// =========================================

export const updateBundleStatus = async (bundleId: string, status: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/bundles/${bundleId}/status`, { status });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const checkBundleAvailability = async (bundleId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/bundles/${bundleId}/availability`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE PREÇO
// =========================================

export const calculateBundlePrice = async (bundleId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/bundles/${bundleId}/calculate-price`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const updateBundlePrice = async (bundleId: string, price: number): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/bundles/${bundleId}/price`, { price });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES EM LOTE
// =========================================

export const bulkUpdateBundles = async (bundleIds: string[], updates: Partial<ProductBundleFormData>): Promise<ProductResponse> => {
  try {
    const response = await apiClient.put('/bundles/bulk-update', {
      bundle_ids: bundleIds,
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

export const bulkDeleteBundles = async (bundleIds: string[]): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete('/bundles/bulk-delete', {
      data: { bundle_ids: bundleIds } );

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

export const validateBundleData = (data: ProductBundleFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || (data as any).name.trim().length === 0) {
    errors.push('Nome do bundle é obrigatório');

  }

  if (!data.products || (data as any).products.length === 0) {
    errors.push('Bundle deve conter pelo menos um produto');

  }

  if (data.discount && (data as any).discount.value <= 0) {
    errors.push('Valor do desconto deve ser maior que zero');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

export const calculateBundleSavings = (originalPrice: number, bundlePrice: number): number => {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - bundlePrice) / originalPrice) * 100 * 100) / 100;};

export const formatBundlePrice = (price: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(price);};
