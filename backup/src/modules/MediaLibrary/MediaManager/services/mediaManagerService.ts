// =========================================
// MEDIA MANAGER SERVICE - GESTÃO AVANÇADA
// =========================================
// Serviço para operações avançadas de mídia
// Máximo: 200 linhas

import { apiClient } from '@/services';
import {
  MediaFile,
  MediaApiResponse,
  MediaOptimizationOptions,
  MediaComment,
  MediaShare,
  MediaVersion
} from '../types';

// =========================================
// OTIMIZAÇÃO DE MÍDIA
// =========================================

export const optimizeMedia = async (mediaId: string, options: MediaOptimizationOptions = {}): Promise<MediaApiResponse<MediaFile>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/optimize`, options);
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

export const batchOptimize = async (mediaIds: string[], options: MediaOptimizationOptions = {}): Promise<MediaApiResponse<MediaFile[]>> => {
  try {
    const response = await apiClient.post('/media-library/batch-optimize', {
      media_ids: mediaIds,
      options
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
// COMENTÁRIOS
// =========================================

export const createMediaComment = async (mediaId: string, content: string): Promise<MediaApiResponse<MediaComment>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/comments`, { content });
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

export const fetchMediaComments = async (mediaId: string): Promise<MediaApiResponse<MediaComment[]>> => {
  try {
    const response = await apiClient.get(`/media-library/${mediaId}/comments`);
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

export const updateMediaComment = async (commentId: string, content: string): Promise<MediaApiResponse<MediaComment>> => {
  try {
    const response = await apiClient.put(`/media-library/comments/${commentId}`, { content });
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

export const deleteMediaComment = async (commentId: string): Promise<MediaApiResponse<boolean>> => {
  try {
    const response = await apiClient.delete(`/media-library/comments/${commentId}`);
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
// COMPARTILHAMENTO
// =========================================

export const shareMedia = async (mediaId: string, shareData: any): Promise<MediaApiResponse<MediaShare>> => {
  try {
    const response = await apiClient.post(`/media-library/${mediaId}/share`, shareData);
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

export const fetchMediaShares = async (mediaId: string): Promise<MediaApiResponse<MediaShare[]>> => {
  try {
    const response = await apiClient.get(`/media-library/${mediaId}/shares`);
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

export const updateMediaShare = async (shareId: string, shareData: any): Promise<MediaApiResponse<MediaShare>> => {
  try {
    const response = await apiClient.put(`/media-library/shares/${shareId}`, shareData);
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

export const deleteMediaShare = async (shareId: string): Promise<MediaApiResponse<boolean>> => {
  try {
    const response = await apiClient.delete(`/media-library/shares/${shareId}`);
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
// VERSÕES
// =========================================

export const createMediaVersion = async (mediaId: string, file: File, changes: string): Promise<MediaApiResponse<MediaVersion>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('changes', changes);

    const response = await apiClient.post(`/media-library/${mediaId}/versions`, formData, {
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

export const fetchMediaVersions = async (mediaId: string): Promise<MediaApiResponse<MediaVersion[]>> => {
  try {
    const response = await apiClient.get(`/media-library/${mediaId}/versions`);
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

export const restoreMediaVersion = async (versionId: string): Promise<MediaApiResponse<MediaFile>> => {
  try {
    const response = await apiClient.post(`/media-library/versions/${versionId}/restore`);
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

export const deleteMediaVersion = async (versionId: string): Promise<MediaApiResponse<boolean>> => {
  try {
    const response = await apiClient.delete(`/media-library/versions/${versionId}`);
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

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getFileTypeFromMime = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
};

export const getFileIcon = (type: string): string => {
  const iconMap: { [key: string]: string } = {
    image: '🖼️',
    video: '🎥',
    audio: '🎵',
    document: '📄'
  };
  return iconMap[type] || '📁';
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const generateThumbnailUrl = (mediaId: string, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  return `/media-library/${mediaId}/thumbnail?size=${size}`;
};

export const generatePreviewUrl = (mediaId: string): string => {
  return `/media-library/${mediaId}/preview`;
};

export const generateDownloadUrl = (mediaId: string): string => {
  return `/media-library/${mediaId}/download`;
};
