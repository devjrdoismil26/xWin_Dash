// =========================================
// MEDIA AI SERVICE - INTELIGÊNCIA ARTIFICIAL
// =========================================
// Serviço para funcionalidades de IA em mídia
// Máximo: 200 linhas

import { apiClient } from '@/services';
import {
  MediaFile,
  MediaApiResponse,
  MediaAI,
  MediaSimilarity,
  MediaAutoTag
} from '../types';

// =========================================
// AUTO TAG
// =========================================

export const autoTagMedia = async (mediaId: string): Promise<MediaApiResponse<MediaAutoTag>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/auto-tag`);
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

export const batchAutoTag = async (mediaIds: string[]): Promise<MediaApiResponse<MediaAutoTag[]>> => {
  try {
    const response = await apiClient.post('/media-library/batch-auto-tag', {
      media_ids: mediaIds
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
// FACE RECOGNITION
// =========================================

export const detectFaces = async (mediaId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/detect-faces`);
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

export const recognizeFaces = async (mediaId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/recognize-faces`);
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
// OBJECT DETECTION
// =========================================

export const detectObjects = async (mediaId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/detect-objects`);
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

export const classifyImage = async (mediaId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/classify`);
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
// TEXT EXTRACTION
// =========================================

export const extractText = async (mediaId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/extract-text`);
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

export const extractTextFromDocument = async (mediaId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/extract-document-text`);
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
// COLOR ANALYSIS
// =========================================

export const analyzeColors = async (mediaId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/analyze-colors`);
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

export const extractColorPalette = async (mediaId: string): Promise<MediaApiResponse<any>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/extract-palette`);
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
// SIMILARITY SEARCH
// =========================================

export const findSimilarMedia = async (mediaId: string): Promise<MediaApiResponse<MediaSimilarity>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/find-similar`);
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

export const searchByImage = async (file: File): Promise<MediaApiResponse<MediaFile[]>> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/media-library/search-by-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
// AI STATUS
// =========================================

export const getAIStatus = async (mediaId: string): Promise<MediaApiResponse<MediaAI[]>> => {
  try {
    const response = await apiClient.get(`/media-library/${mediaId}/ai-status`);
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

export const getAIProcessingQueue = async (): Promise<MediaApiResponse<MediaAI[]>> => {
  try {
    const response = await apiClient.get('/media-library/ai-queue');
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
