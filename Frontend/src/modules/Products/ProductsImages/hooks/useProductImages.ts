// =========================================
// USE PRODUCT IMAGES - HOOK ESPECIALIZADO
// =========================================
// Hook para operações de imagens de produtos
// Máximo: 200 linhas

import { useState, useEffect, useCallback } from 'react';
import { fetchProductImages, fetchImageById, uploadProductImage, updateImageMetadata, deleteImage, bulkUploadImages, bulkDeleteImages, setPrimaryImage, reorderImages, generateImageThumbnails, optimizeImage, validateImageFile, getImageUrl, formatFileSize } from '../services/productsImagesService';
import { getErrorMessage } from '@/utils/errorHelpers';
import { ProductImage, ProductImageFormData, ProductResponse, ImageUploadResponse } from '../types';

interface UseProductImagesReturn {
  // Estado
  images: ProductImage[];
  currentImage: ProductImage | null;
  uploading: boolean;
  loading: boolean;
  error: string | null;
  // Operações básicas
  loadImages: (productId: string) => Promise<void>;
  loadImage: (imageId: string) => Promise<void>;
  uploadImage: (productId: string, file: File, metadata?: Partial<ProductImageFormData>) => Promise<ImageUploadResponse>;
  updateImage: (imageId: string, metadata: Partial<ProductImageFormData>) => Promise<ProductResponse>;
  deleteImage: (imageId: string) => Promise<ProductResponse>;
  // Operações em lote
  bulkUpload: (productId: string, files: File[]) => Promise<ImageUploadResponse>;
  bulkDelete: (imageIds: string[]) => Promise<ProductResponse>;
  // Operações de ordenação e prioridade
  setPrimary: (imageId: string) => Promise<ProductResponse>;
  reorder: (productId: string, imageOrder: { id: string;
  order: number;
}[]) => Promise<ProductResponse>;
  
  // Operações de processamento
  generateThumbnails: (imageId: string, sizes?: string[]) => Promise<ProductResponse>;
  optimize: (imageId: string, quality?: number) => Promise<ProductResponse>;
  
  // Utilitários
  validateFile: (file: File) => { isValid: boolean; errors: string[]};

  getUrl: (imageId: string, size?: string) => string;
  formatSize: (bytes: number) => string;
  
  // Estado de UI
  clearError??: (e: any) => void;
  clearCurrentImage??: (e: any) => void;
}

export const useProductImages = (): UseProductImagesReturn => {
  // =========================================
  // ESTADO
  // =========================================
  
  const [images, setImages] = useState<ProductImage[]>([]);

  const [currentImage, setCurrentImage] = useState<ProductImage | null>(null);

  const [uploading, setUploading] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  // =========================================
  // OPERAÇÕES BÁSICAS
  // =========================================

  const loadImages = useCallback(async (productId: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchProductImages(productId);

      if (response.success) {
        setImages(response.data || []);

      } else {
        setError(response.error || 'Erro ao carregar imagens');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , []);

  const loadImage = useCallback(async (imageId: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchImageById(imageId);

      if (response.success) {
        setCurrentImage(response.data);

      } else {
        setError(response.error || 'Erro ao carregar imagem');

      } catch (err: unknown) {
      setError(getErrorMessage(err) || 'Erro inesperado ao carregar imagem');

    } finally {
      setLoading(false);

    } , []);

  const uploadImage = useCallback(async (productId: string, file: File, metadata?: Partial<ProductImageFormData>): Promise<ImageUploadResponse> => {
    setUploading(true);

    setError(null);

    try {
      const response = await uploadProductImage(productId, file, metadata);

      if (response.success) {
        // Recarregar imagens
        await loadImages(productId);

      } else {
        setError(response.error || 'Erro ao fazer upload da imagem');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) || 'Erro inesperado ao fazer upload da imagem'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setUploading(false);

    } , [loadImages]);

  const updateImage = useCallback(async (imageId: string, metadata: Partial<ProductImageFormData>): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await updateImageMetadata(imageId, metadata);

      if (response.success) {
        // Atualizar imagem atual se for a mesma
        if (currentImage?.id === imageId) {
          setCurrentImage(response.data);

        }
        // Atualizar na lista
        setImages(prev => prev.map(img => 
          img.id === imageId ? (response as any).data : img
        ));

      } else {
        setError(response.error || 'Erro ao atualizar imagem');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) || 'Erro inesperado ao atualizar imagem'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentImage]);

  const deleteImage = useCallback(async (imageId: string): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await deleteImage(imageId);

      if (response.success) {
        // Remover imagem da lista
        setImages(prev => prev.filter(img => img.id !== imageId));

        // Limpar imagem atual se for a mesma
        if (currentImage?.id === imageId) {
          setCurrentImage(null);

        } else {
        setError(response.error || 'Erro ao deletar imagem');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) || 'Erro inesperado ao deletar imagem'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentImage]);

  // =========================================
  // OPERAÇÕES EM LOTE
  // =========================================

  const bulkUpload = useCallback(async (productId: string, files: File[]): Promise<ImageUploadResponse> => {
    setUploading(true);

    setError(null);

    try {
      const response = await bulkUploadImages(productId, files);

      if (response.success) {
        // Recarregar imagens
        await loadImages(productId);

      } else {
        setError(response.error || 'Erro ao fazer upload das imagens');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) || 'Erro inesperado ao fazer upload das imagens'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setUploading(false);

    } , [loadImages]);

  const bulkDelete = useCallback(async (imageIds: string[]): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await bulkDeleteImages(imageIds);

      if (response.success) {
        // Remover imagens da lista
        setImages(prev => prev.filter(img => !imageIds.includes(img.id)));

        // Limpar imagem atual se estiver na lista
        if (currentImage && imageIds.includes(currentImage.id)) {
          setCurrentImage(null);

        } else {
        setError(response.error || 'Erro ao deletar imagens em lote');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) || 'Erro inesperado ao deletar imagens em lote'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentImage]);

  // =========================================
  // OPERAÇÕES DE ORDENAÇÃO E PRIORIDADE
  // =========================================

  const setPrimary = useCallback(async (imageId: string): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await setPrimaryImage(imageId);

      if (response.success) {
        // Atualizar imagens na lista
        setImages(prev => prev.map(img => ({
          ...img,
          is_primary: img.id === imageId
        })));

        // Atualizar imagem atual se for a mesma
        if (currentImage?.id === imageId) {
          setCurrentImage(prev => prev ? { ...prev, is_primary: true } : null);

        } else {
        setError(response.error || 'Erro ao definir imagem principal');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao definir imagem principal'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentImage]);

  const reorder = useCallback(async (productId: string, imageOrder: { id: string; order: number }[]): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await reorderImages(productId, imageOrder);

      if (response.success) {
        // Recarregar imagens
        await loadImages(productId);

      } else {
        setError(response.error || 'Erro ao reordenar imagens');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao reordenar imagens'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [loadImages]);

  // =========================================
  // OPERAÇÕES DE PROCESSAMENTO
  // =========================================

  const generateThumbnails = useCallback(async (imageId: string, sizes: string[] = ['small', 'medium', 'large']): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await generateImageThumbnails(imageId, sizes);

      if (response.success) {
        // Atualizar imagem atual se for a mesma
        if (currentImage?.id === imageId) {
          setCurrentImage(response.data);

        }
        // Atualizar na lista
        setImages(prev => prev.map(img => 
          img.id === imageId ? (response as any).data : img
        ));

      } else {
        setError(response.error || 'Erro ao gerar miniaturas');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao gerar miniaturas'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentImage]);

  const optimize = useCallback(async (imageId: string, quality: number = 80): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await optimizeImage(imageId, quality);

      if (response.success) {
        // Atualizar imagem atual se for a mesma
        if (currentImage?.id === imageId) {
          setCurrentImage(response.data);

        }
        // Atualizar na lista
        setImages(prev => prev.map(img => 
          img.id === imageId ? (response as any).data : img
        ));

      } else {
        setError(response.error || 'Erro ao otimizar imagem');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao otimizar imagem'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentImage]);

  // =========================================
  // UTILITÁRIOS
  // =========================================

  const validateFile = useCallback((file: File) => {
    return validateImageFile(file);

  }, []);

  const getUrl = useCallback((imageId: string, size: string = 'medium') => {
    return getImageUrl(imageId, size);

  }, []);

  const formatSize = useCallback((bytes: number) => {
    return formatFileSize(bytes);

  }, []);

  // =========================================
  // ESTADO DE UI
  // =========================================

  const clearError = useCallback(() => {
    setError(null);

  }, []);

  const clearCurrentImage = useCallback(() => {
    setCurrentImage(null);

  }, []);

  // =========================================
  // RETORNO
  // =========================================

  return {
    // Estado
    images,
    currentImage,
    uploading,
    loading,
    error,
    
    // Operações básicas
    loadImages,
    loadImage,
    uploadImage,
    updateImage,
    deleteImage,
    
    // Operações em lote
    bulkUpload,
    bulkDelete,
    
    // Operações de ordenação e prioridade
    setPrimary,
    reorder,
    
    // Operações de processamento
    generateThumbnails,
    optimize,
    
    // Utilitários
    validateFile,
    getUrl,
    formatSize,
    
    // Estado de UI
    clearError,
    clearCurrentImage};
};
