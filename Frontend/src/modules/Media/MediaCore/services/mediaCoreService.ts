// =========================================
// MEDIA CORE SERVICE - FUNCIONALIDADES BÁSICAS
// =========================================
// Serviço para operações básicas de mídia
// Máximo: 200 linhas

import { apiClient } from '@/services';
import {
  MediaFile,
  MediaFolder,
  MediaApiResponse,
  MediaSearchFilters,
  MediaSearchResult
} from '../types';

// =========================================
// OPERAÇÕES BÁSICAS DE MÍDIA
// =========================================

export const fetchMedia = async (filters: MediaSearchFilters = {}): Promise<MediaApiResponse<MediaFile[]>> => {
  try {
    const response = await apiClient.get('/media-library', { params: filters });
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

export const fetchMediaById = async (mediaId: string): Promise<MediaApiResponse<MediaFile>> => {
  try {
    const response = await apiClient.get(`/media-library/${mediaId}`);
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

export const createMedia = async (file: File, metadata: any = {}): Promise<MediaApiResponse<MediaFile>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    const response = await apiClient.post('/media-library/upload', formData, {
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

export const updateMedia = async (mediaId: string, mediaData: any): Promise<MediaApiResponse<MediaFile>> => {
  try {
    const response = await apiClient.put(`/media-library/${mediaId}`, mediaData);
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

export const deleteMedia = async (mediaId: string): Promise<MediaApiResponse<boolean>> => {
  try {
    const response = await apiClient.delete(`/media-library/${mediaId}`);
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
// OPERAÇÕES EM LOTE
// =========================================

export const bulkUpdateMedia = async (mediaIds: string[], updates: any): Promise<MediaApiResponse<MediaFile[]>> => {
  try {
    const response = await apiClient.put('/media-library/bulk-update', {
      media_ids: mediaIds,
      updates
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

export const bulkDeleteMedia = async (mediaIds: string[]): Promise<MediaApiResponse<boolean>> => {
  try {
    const response = await apiClient.delete('/media-library/bulk-delete', {
      data: { media_ids: mediaIds }
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
// BUSCA E FILTROS
// =========================================

export const searchMedia = async (query: string, filters: MediaSearchFilters = {}): Promise<MediaApiResponse<MediaSearchResult>> => {
  try {
    const response = await apiClient.get('/media-library/search', {
      params: { q: query, ...filters }
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

export const getMediaByType = async (type: string, filters: MediaSearchFilters = {}): Promise<MediaApiResponse<MediaFile[]>> => {
  try {
    const response = await apiClient.get(`/media-library/by-type/${type}`, { params: filters });
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

export const getMediaByFolder = async (folderId: string, filters: MediaSearchFilters = {}): Promise<MediaApiResponse<MediaFile[]>> => {
  try {
    const response = await apiClient.get(`/media-library/by-folder/${folderId}`, { params: filters });
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
// PASTAS
// =========================================

export const fetchFolders = async (filters: any = {}): Promise<MediaApiResponse<MediaFolder[]>> => {
  try {
    const response = await apiClient.get('/media-library/folders', { params: filters });
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

export const createFolder = async (folderData: any): Promise<MediaApiResponse<MediaFolder>> => {
  try {
    const response = await apiClient.post('/media-library/folders', folderData);
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

export const updateFolder = async (folderId: string, folderData: any): Promise<MediaApiResponse<MediaFolder>> => {
  try {
    const response = await apiClient.put(`/media-library/folders/${folderId}`, folderData);
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

export const deleteFolder = async (folderId: string): Promise<MediaApiResponse<boolean>> => {
  try {
    const response = await apiClient.delete(`/media-library/folders/${folderId}`);
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
