// =========================================
// PRODUCTS IMAGES SERVICE - GERENCIAMENTO DE IMAGENS
// =========================================
// Serviço para operações de imagens de produtos
// Máximo: 200 linhas

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { validateImageFile, validateImageData } from '@/services/productsValidationService';
import { handleProductsError, withErrorHandling, withRetry } from '@/services/productsErrorService';
import { ProductImage, ProductImageFormData, ProductResponse, ImageUploadResponse } from '../types';

// =========================================
// OPERAÇÕES BÁSICAS DE IMAGENS
// =========================================

export const fetchProductImages = async (productId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/images`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const fetchImageById = async (imageId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/images/${imageId}`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const uploadProductImage = async (productId: string, file: File, metadata?: Partial<ProductImageFormData>): Promise<ImageUploadResponse> => {
  // Validar arquivo antes de enviar
  const fileValidation = validateImageFile(file);

  if (!fileValidation.isValid) {
    return {
      success: false,
      error: fileValidation.errors.join(', ')};

  }

  // Validar metadados se fornecidos
  if (metadata) {
    const metadataValidation = validateImageData(metadata);

    if (!metadataValidation.isValid) {
      return {
        success: false,
        error: metadataValidation.errors.join(', ')};

    } return withErrorHandling(async () => {
    const formData = new FormData();

    formData.append('image', file);

    formData.append('product_id', productId);

    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, value.toString());

      });

    }

    const response = await withRetry(() => apiClient.post(`/products/${productId}/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      } ));

    return {
      success: true,
      data: (response as any).data};

  }, 'upload', { productId });};

export const updateImageMetadata = async (imageId: string, metadata: Partial<ProductImageFormData>): Promise<ProductResponse> => {
  try {
    const response = await apiClient.put(`/images/${imageId}`, metadata);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const deleteImage = async (imageId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete(`/images/${imageId}`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES EM LOTE DE IMAGENS
// =========================================

export const bulkUploadImages = async (productId: string, files: File[]): Promise<ImageUploadResponse> => {
  try {
    const formData = new FormData();

    formData.append('product_id', productId);

    files.forEach((file: unknown, index: unknown) => {
      formData.append(`images[${index}]`, file);

    });

    const response = await apiClient.post(`/products/${productId}/images/bulk-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      } );

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const bulkDeleteImages = async (imageIds: string[]): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete('/images/bulk-delete', {
      data: { image_ids: imageIds } );

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

// =========================================
// OPERAÇÕES DE ORDENAÇÃO E PRIORIDADE
// =========================================

export const setPrimaryImage = async (imageId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/images/${imageId}/set-primary`);

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const reorderImages = async (productId: string, imageOrder: { id: string; order: number }[]): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/products/${productId}/images/reorder`, {
      image_order: imageOrder
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
// OPERAÇÕES DE PROCESSAMENTO
// =========================================

export const generateImageThumbnails = async (imageId: string, sizes: string[] = ['small', 'medium', 'large']): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/images/${imageId}/generate-thumbnails`, {
      sizes
    });

    return {
      success: true,
      data: (response as any).data};

  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error)};

  } ;

export const optimizeImage = async (imageId: string, quality: number = 80): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/images/${imageId}/optimize`, {
      quality
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

export const validateImageFile = (file: File): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (file.size > maxSize) {
    errors.push('Arquivo muito grande. Máximo 5MB');

  }

  if (!allowedTypes.includes(file.type)) {
    errors.push('Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF');

  }

  return {
    isValid: errors.length === 0,
    errors};
};

export const getImageUrl = (imageId: string, size: string = 'medium'): string => {
  return `/api/images/${imageId}/${size}`;};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];};
