// =========================================
// PRODUCTS REVIEWS SERVICE - GERENCIAMENTO DE REVIEWS
// =========================================
// Serviço para operações de reviews de produtos
// Máximo: 200 linhas

import { apiClient } from '@/services';
import { validateReviewData } from '../../services/productsValidationService';
import { handleProductsError, withErrorHandling, withRetry } from '../../services/productsErrorService';
import {
  ProductReview,
  ProductReviewFormData,
  ProductResponse,
  ReviewStats
} from '../types';

// =========================================
// OPERAÇÕES BÁSICAS DE REVIEWS
// =========================================

export const fetchProductReviews = async (productId: string, filters?: any): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/reviews`, { params: filters });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const fetchReviewById = async (reviewId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/reviews/${reviewId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const createReview = async (productId: string, data: ProductReviewFormData): Promise<ProductResponse> => {
  // Validar dados antes de enviar
  const validation = validateReviewData(data);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join(', ')
    };
  }

  return withErrorHandling(async () => {
    const response = await withRetry(() => apiClient.post(`/products/${productId}/reviews`, data));
    return {
      success: true,
      data: response.data
    };
  }, 'create', { productId });
};

export const updateReview = async (reviewId: string, data: Partial<ProductReviewFormData>): Promise<ProductResponse> => {
  try {
    const response = await apiClient.put(`/reviews/${reviewId}`, data);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const deleteReview = async (reviewId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// =========================================
// OPERAÇÕES DE MODERAÇÃO
// =========================================

export const moderateReview = async (reviewId: string, action: 'approve' | 'reject' | 'flag', reason?: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/reviews/${reviewId}/moderate`, {
      action,
      reason
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const bulkModerateReviews = async (reviewIds: string[], action: 'approve' | 'reject' | 'flag'): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch('/reviews/bulk-moderate', {
      review_ids: reviewIds,
      action
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// =========================================
// OPERAÇÕES DE RATING E ESTATÍSTICAS
// =========================================

export const fetchReviewStats = async (productId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}/reviews/stats`);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const updateReviewRating = async (reviewId: string, rating: number): Promise<ProductResponse> => {
  try {
    const response = await apiClient.patch(`/reviews/${reviewId}/rating`, {
      rating
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// =========================================
// OPERAÇÕES DE RESPOSTAS
// =========================================

export const replyToReview = async (reviewId: string, reply: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/reviews/${reviewId}/reply`, {
      reply
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const updateReviewReply = async (reviewId: string, reply: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.put(`/reviews/${reviewId}/reply`, {
      reply
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const deleteReviewReply = async (reviewId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.delete(`/reviews/${reviewId}/reply`);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// =========================================
// OPERAÇÕES DE LIKES E DISLIKES
// =========================================

export const likeReview = async (reviewId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/reviews/${reviewId}/like`);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const dislikeReview = async (reviewId: string): Promise<ProductResponse> => {
  try {
    const response = await apiClient.post(`/reviews/${reviewId}/dislike`);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// =========================================
// UTILITÁRIOS
// =========================================

export const validateReviewData = (data: ProductReviewFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.push('Rating deve estar entre 1 e 5');
  }

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Título é obrigatório');
  }

  if (!data.content || data.content.trim().length < 10) {
    errors.push('Conteúdo deve ter pelo menos 10 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateAverageRating = (reviews: ProductReview[]): number => {
  if (reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10;
};

export const getRatingDistribution = (reviews: ProductReview[]): Record<number, number> => {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(review => {
    distribution[review.rating] = (distribution[review.rating] || 0) + 1;
  });
  
  return distribution;
};
