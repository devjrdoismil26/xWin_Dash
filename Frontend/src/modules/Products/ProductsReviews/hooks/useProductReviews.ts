// =========================================
// USE PRODUCT REVIEWS - HOOK ESPECIALIZADO
// =========================================
// Hook para operações de reviews de produtos
// Máximo: 200 linhas

import { useState, useEffect, useCallback } from 'react';
import { fetchProductReviews, fetchReviewById, createReview, updateReview, deleteReview, moderateReview, bulkModerateReviews, fetchReviewStats, updateReviewRating, replyToReview, updateReviewReply, deleteReviewReply, likeReview, dislikeReview, validateReviewData, calculateAverageRating, getRatingDistribution } from '../services/productsReviewsService';
import { getErrorMessage } from '@/utils/errorHelpers';
import { ProductReview, ProductReviewFormData, ProductResponse, ReviewStats } from '../types';

interface UseProductReviewsReturn {
  // Estado
  reviews: ProductReview[];
  currentReview: ProductReview | null;
  stats: ReviewStats | null;
  loading: boolean;
  error: string | null;
  // Operações básicas
  loadReviews: (productId: string, filters?: string) => Promise<void>;
  loadReview: (reviewId: string) => Promise<void>;
  createNewReview: (productId: string, data: ProductReviewFormData) => Promise<ProductResponse>;
  updateExistingReview: (reviewId: string, data: Partial<ProductReviewFormData>) => Promise<ProductResponse>;
  deleteExistingReview: (reviewId: string) => Promise<ProductResponse>;
  // Operações de moderação
  moderate: (reviewId: string, action: 'approve' | 'reject' | 'flag', reason?: string) => Promise<ProductResponse>;
  bulkModerate: (reviewIds: string[], action: 'approve' | 'reject' | 'flag') => Promise<ProductResponse>;
  // Operações de estatísticas
  loadStats: (productId: string) => Promise<void>;
  updateRating: (reviewId: string, rating: number) => Promise<ProductResponse>;
  // Operações de respostas
  reply: (reviewId: string, reply: string) => Promise<ProductResponse>;
  updateReply: (reviewId: string, reply: string) => Promise<ProductResponse>;
  deleteReply: (reviewId: string) => Promise<ProductResponse>;
  // Operações de likes
  like: (reviewId: string) => Promise<ProductResponse>;
  dislike: (reviewId: string) => Promise<ProductResponse>;
  // Utilitários
  validateData: (data: ProductReviewFormData) => { isValid: boolean;
  errors: string[];
};

  calculateAverage: (reviews: ProductReview[]) => number;
  getDistribution: (reviews: ProductReview[]) => Record<number, number>;
  
  // Estado de UI
  clearError??: (e: any) => void;
  clearCurrentReview??: (e: any) => void;
}

export const useProductReviews = (): UseProductReviewsReturn => {
  // =========================================
  // ESTADO
  // =========================================
  
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  const [currentReview, setCurrentReview] = useState<ProductReview | null>(null);

  const [stats, setStats] = useState<ReviewStats | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  // =========================================
  // OPERAÇÕES BÁSICAS
  // =========================================

  const loadReviews = useCallback(async (productId: string, filters?: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchProductReviews(productId, filters);

      if (response.success) {
        setReviews(response.data || []);

      } else {
        setError(response.error || 'Erro ao carregar reviews');

      } catch (err: unknown) {
      setError(getErrorMessage(err) + ' ao carregar reviews');

    } finally {
      setLoading(false);

    } , []);

  const loadReview = useCallback(async (reviewId: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchReviewById(reviewId);

      if (response.success) {
        setCurrentReview(response.data);

      } else {
        setError(response.error || 'Erro ao carregar review');

      } catch (err: unknown) {
      setError(getErrorMessage(err) + ' ao carregar review');

    } finally {
      setLoading(false);

    } , []);

  const createNewReview = useCallback(async (productId: string, data: ProductReviewFormData): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await createReview(productId, data);

      if (response.success) {
        // Recarregar reviews
        await loadReviews(productId);

        // Recarregar stats
        await loadStats(productId);

      } else {
        setError(response.error || 'Erro ao criar review');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) || 'Erro inesperado ao criar review'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [loadReviews, loadStats]);

  const updateExistingReview = useCallback(async (reviewId: string, data: Partial<ProductReviewFormData>): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await updateReview(reviewId, data);

      if (response.success) {
        // Atualizar review atual se for o mesmo
        if (currentReview?.id === reviewId) {
          setCurrentReview(response.data);

        }
        // Atualizar na lista
        setReviews(prev => prev.map(r => 
          r.id === reviewId ? (response as any).data : r
        ));

      } else {
        setError(response.error || 'Erro ao atualizar review');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) || 'Erro inesperado ao atualizar review'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentReview]);

  const deleteExistingReview = useCallback(async (reviewId: string): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await deleteReview(reviewId);

      if (response.success) {
        // Remover review da lista
        setReviews(prev => prev.filter(r => r.id !== reviewId));

        // Limpar review atual se for o mesmo
        if (currentReview?.id === reviewId) {
          setCurrentReview(null);

        } else {
        setError(response.error || 'Erro ao deletar review');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) || 'Erro inesperado ao deletar review'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentReview]);

  // =========================================
  // OPERAÇÕES DE MODERAÇÃO
  // =========================================

  const moderate = useCallback(async (reviewId: string, action: 'approve' | 'reject' | 'flag', reason?: string): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await moderateReview(reviewId, action, reason);

      if (response.success) {
        // Atualizar review na lista
        setReviews(prev => prev.map(r => 
          r.id === reviewId ? { ...r, status: action } : r
        ));

        // Atualizar review atual se for o mesmo
        if (currentReview?.id === reviewId) {
          setCurrentReview(prev => prev ? { ...prev, status: action } : null);

        } else {
        setError(response.error || 'Erro ao moderar review');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) || 'Erro inesperado ao moderar review'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentReview]);

  const bulkModerate = useCallback(async (reviewIds: string[], action: 'approve' | 'reject' | 'flag'): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await bulkModerateReviews(reviewIds, action);

      if (response.success) {
        // Atualizar reviews na lista
        setReviews(prev => prev.map(r => 
          reviewIds.includes(r.id) ? { ...r, status: action } : r
        ));

      } else {
        setError(response.error || 'Erro ao moderar reviews em lote');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: getErrorMessage(err) || 'Erro inesperado ao moderar reviews em lote'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , []);

  // =========================================
  // OPERAÇÕES DE ESTATÍSTICAS
  // =========================================

  const loadStats = useCallback(async (productId: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await fetchReviewStats(productId);

      if (response.success) {
        setStats(response.data);

      } else {
        setError(response.error || 'Erro ao carregar estatísticas');

      } catch (err: unknown) {
      setError(getErrorMessage(err) + ' ao carregar estatísticas');

    } finally {
      setLoading(false);

    } , []);

  const updateRating = useCallback(async (reviewId: string, rating: number): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await updateReviewRating(reviewId, rating);

      if (response.success) {
        // Atualizar review na lista
        setReviews(prev => prev.map(r => 
          r.id === reviewId ? { ...r, rating } : r
        ));

        // Atualizar review atual se for o mesmo
        if (currentReview?.id === reviewId) {
          setCurrentReview(prev => prev ? { ...prev, rating } : null);

        } else {
        setError(response.error || 'Erro ao atualizar rating');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar rating'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentReview]);

  // =========================================
  // OPERAÇÕES DE RESPOSTAS
  // =========================================

  const reply = useCallback(async (reviewId: string, reply: string): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await replyToReview(reviewId, reply);

      if (response.success) {
        // Atualizar review na lista
        setReviews(prev => prev.map(r => 
          r.id === reviewId ? { ...r, reply } : r
        ));

        // Atualizar review atual se for o mesmo
        if (currentReview?.id === reviewId) {
          setCurrentReview(prev => prev ? { ...prev, reply } : null);

        } else {
        setError(response.error || 'Erro ao responder review');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao responder review'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentReview]);

  const updateReply = useCallback(async (reviewId: string, reply: string): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await updateReviewReply(reviewId, reply);

      if (response.success) {
        // Atualizar review na lista
        setReviews(prev => prev.map(r => 
          r.id === reviewId ? { ...r, reply } : r
        ));

        // Atualizar review atual se for o mesmo
        if (currentReview?.id === reviewId) {
          setCurrentReview(prev => prev ? { ...prev, reply } : null);

        } else {
        setError(response.error || 'Erro ao atualizar resposta');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao atualizar resposta'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentReview]);

  const deleteReply = useCallback(async (reviewId: string): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await deleteReviewReply(reviewId);

      if (response.success) {
        // Atualizar review na lista
        setReviews(prev => prev.map(r => 
          r.id === reviewId ? { ...r, reply: null } : r
        ));

        // Atualizar review atual se for o mesmo
        if (currentReview?.id === reviewId) {
          setCurrentReview(prev => prev ? { ...prev, reply: null } : null);

        } else {
        setError(response.error || 'Erro ao deletar resposta');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao deletar resposta'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentReview]);

  // =========================================
  // OPERAÇÕES DE LIKES
  // =========================================

  const like = useCallback(async (reviewId: string): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await likeReview(reviewId);

      if (response.success) {
        // Atualizar review na lista
        setReviews(prev => prev.map(r => 
          r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r
        ));

        // Atualizar review atual se for o mesmo
        if (currentReview?.id === reviewId) {
          setCurrentReview(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);

        } else {
        setError(response.error || 'Erro ao curtir review');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao curtir review'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentReview]);

  const dislike = useCallback(async (reviewId: string): Promise<ProductResponse> => {
    setLoading(true);

    setError(null);

    try {
      const response = await dislikeReview(reviewId);

      if (response.success) {
        // Atualizar review na lista
        setReviews(prev => prev.map(r => 
          r.id === reviewId ? { ...r, dislikes: (r.dislikes || 0) + 1 } : r
        ));

        // Atualizar review atual se for o mesmo
        if (currentReview?.id === reviewId) {
          setCurrentReview(prev => prev ? { ...prev, dislikes: (prev.dislikes || 0) + 1 } : null);

        } else {
        setError(response.error || 'Erro ao descurtir review');

      }
      
      return response;
    } catch (err: unknown) {
      const errorResponse = {
        success: false,
        error: err.message || 'Erro inesperado ao descurtir review'};

      setError(errorResponse.error);

      return errorResponse;
    } finally {
      setLoading(false);

    } , [currentReview]);

  // =========================================
  // UTILITÁRIOS
  // =========================================

  const validateData = useCallback((data: ProductReviewFormData) => {
    return validateReviewData(data);

  }, []);

  const calculateAverage = useCallback((reviews: ProductReview[]) => {
    return calculateAverageRating(reviews);

  }, []);

  const getDistribution = useCallback((reviews: ProductReview[]) => {
    return getRatingDistribution(reviews);

  }, []);

  // =========================================
  // ESTADO DE UI
  // =========================================

  const clearError = useCallback(() => {
    setError(null);

  }, []);

  const clearCurrentReview = useCallback(() => {
    setCurrentReview(null);

  }, []);

  // =========================================
  // RETORNO
  // =========================================

  return {
    // Estado
    reviews,
    currentReview,
    stats,
    loading,
    error,
    
    // Operações básicas
    loadReviews,
    loadReview,
    createNewReview,
    updateExistingReview,
    deleteExistingReview,
    
    // Operações de moderação
    moderate,
    bulkModerate,
    
    // Operações de estatísticas
    loadStats,
    updateRating,
    
    // Operações de respostas
    reply,
    updateReply,
    deleteReply,
    
    // Operações de likes
    like,
    dislike,
    
    // Utilitários
    validateData,
    calculateAverage,
    getDistribution,
    
    // Estado de UI
    clearError,
    clearCurrentReview};
};
