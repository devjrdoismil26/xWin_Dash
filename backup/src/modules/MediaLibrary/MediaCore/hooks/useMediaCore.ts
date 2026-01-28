// =========================================
// USE MEDIA CORE - HOOK ESPECIALIZADO
// =========================================
// Hook para operações básicas de mídia
// Máximo: 200 linhas

import { useState, useEffect, useCallback } from 'react';
import {
  MediaFile,
  MediaFolder,
  MediaSearchFilters,
  MediaSearchResult
} from '../types';
import {
  fetchMedia,
  fetchMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
  bulkUpdateMedia,
  bulkDeleteMedia,
  searchMedia,
  getMediaByType,
  getMediaByFolder,
  fetchFolders,
  createFolder,
  updateFolder,
  deleteFolder
} from '../services/mediaCoreService';

interface UseMediaCoreReturn {
  // State
  media: MediaFile[];
  folders: MediaFolder[];
  currentMedia: MediaFile | null;
  currentFolder: string | null;
  loading: boolean;
  error: string | null;
  
  // Filters
  filters: MediaSearchFilters;
  setFilters: (filters: MediaSearchFilters) => void;
  
  // Core Actions
  getMedia: (filters?: MediaSearchFilters) => Promise<void>;
  getMediaById: (id: string) => Promise<MediaFile | null>;
  createMedia: (file: File, metadata?: any) => Promise<MediaFile | null>;
  updateMedia: (id: string, data: any) => Promise<MediaFile | null>;
  deleteMedia: (id: string) => Promise<boolean>;
  
  // Bulk Actions
  bulkUpdateMedia: (ids: string[], updates: any) => Promise<MediaFile[] | null>;
  bulkDeleteMedia: (ids: string[]) => Promise<boolean>;
  
  // Search
  searchMedia: (query: string, filters?: MediaSearchFilters) => Promise<MediaSearchResult | null>;
  getMediaByType: (type: string, filters?: MediaSearchFilters) => Promise<MediaFile[] | null>;
  getMediaByFolder: (folderId: string, filters?: MediaSearchFilters) => Promise<MediaFile[] | null>;
  
  // Folders
  getFolders: (filters?: any) => Promise<void>;
  createFolder: (data: any) => Promise<MediaFolder | null>;
  updateFolder: (id: string, data: any) => Promise<MediaFolder | null>;
  deleteFolder: (id: string) => Promise<boolean>;
  
  // Utilities
  clearError: () => void;
  refreshData: () => Promise<void>;
}

export const useMediaCore = (): UseMediaCoreReturn => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [currentMedia, setCurrentMedia] = useState<MediaFile | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MediaSearchFilters>({});

  // =========================================
  // CORE ACTIONS
  // =========================================

  const getMedia = useCallback(async (searchFilters?: MediaSearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMedia(searchFilters || filters);
      if (result.success && result.data) {
        setMedia(result.data);
      } else {
        setError(result.error || 'Erro ao buscar mídia');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getMediaById = useCallback(async (id: string): Promise<MediaFile | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMediaById(id);
      if (result.success && result.data) {
        setCurrentMedia(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar mídia');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMedia = useCallback(async (file: File, metadata: any = {}): Promise<MediaFile | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createMedia(file, metadata);
      if (result.success && result.data) {
        setMedia(prev => [...prev, result.data!]);
        return result.data;
      } else {
        setError(result.error || 'Erro ao criar mídia');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMedia = useCallback(async (id: string, data: any): Promise<MediaFile | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateMedia(id, data);
      if (result.success && result.data) {
        setMedia(prev => prev.map(item => item.id === id ? result.data! : item));
        if (currentMedia?.id === id) {
          setCurrentMedia(result.data);
        }
        return result.data;
      } else {
        setError(result.error || 'Erro ao atualizar mídia');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentMedia]);

  const deleteMedia = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await deleteMedia(id);
      if (result.success) {
        setMedia(prev => prev.filter(item => item.id !== id));
        if (currentMedia?.id === id) {
          setCurrentMedia(null);
        }
        return true;
      } else {
        setError(result.error || 'Erro ao excluir mídia');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentMedia]);

  // =========================================
  // BULK ACTIONS
  // =========================================

  const bulkUpdateMedia = useCallback(async (ids: string[], updates: any): Promise<MediaFile[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await bulkUpdateMedia(ids, updates);
      if (result.success && result.data) {
        setMedia(prev => prev.map(item => {
          const updated = result.data!.find(updated => updated.id === item.id);
          return updated || item;
        }));
        return result.data;
      } else {
        setError(result.error || 'Erro ao atualizar mídia em lote');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeleteMedia = useCallback(async (ids: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await bulkDeleteMedia(ids);
      if (result.success) {
        setMedia(prev => prev.filter(item => !ids.includes(item.id)));
        return true;
      } else {
        setError(result.error || 'Erro ao excluir mídia em lote');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // SEARCH
  // =========================================

  const searchMedia = useCallback(async (query: string, searchFilters?: MediaSearchFilters): Promise<MediaSearchResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await searchMedia(query, searchFilters || filters);
      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar mídia');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getMediaByType = useCallback(async (type: string, searchFilters?: MediaSearchFilters): Promise<MediaFile[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaByType(type, searchFilters || filters);
      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar mídia por tipo');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getMediaByFolder = useCallback(async (folderId: string, searchFilters?: MediaSearchFilters): Promise<MediaFile[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMediaByFolder(folderId, searchFilters || filters);
      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar mídia por pasta');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // =========================================
  // FOLDERS
  // =========================================

  const getFolders = useCallback(async (searchFilters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFolders(searchFilters);
      if (result.success && result.data) {
        setFolders(result.data);
      } else {
        setError(result.error || 'Erro ao buscar pastas');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFolder = useCallback(async (data: any): Promise<MediaFolder | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createFolder(data);
      if (result.success && result.data) {
        setFolders(prev => [...prev, result.data!]);
        return result.data;
      } else {
        setError(result.error || 'Erro ao criar pasta');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFolder = useCallback(async (id: string, data: any): Promise<MediaFolder | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateFolder(id, data);
      if (result.success && result.data) {
        setFolders(prev => prev.map(item => item.id === id ? result.data! : item));
        return result.data;
      } else {
        setError(result.error || 'Erro ao atualizar pasta');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFolder = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await deleteFolder(id);
      if (result.success) {
        setFolders(prev => prev.filter(item => item.id !== id));
        return true;
      } else {
        setError(result.error || 'Erro ao excluir pasta');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // UTILITIES
  // =========================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([
      getMedia(),
      getFolders()
    ]);
  }, [getMedia, getFolders]);

  // =========================================
  // EFFECTS
  // =========================================

  useEffect(() => {
    getMedia();
    getFolders();
  }, [getMedia, getFolders]);

  return {
    // State
    media,
    folders,
    currentMedia,
    currentFolder,
    loading,
    error,
    filters,
    setFilters,
    
    // Core Actions
    getMedia,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia,
    
    // Bulk Actions
    bulkUpdateMedia,
    bulkDeleteMedia,
    
    // Search
    searchMedia,
    getMediaByType,
    getMediaByFolder,
    
    // Folders
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    
    // Utilities
    clearError,
    refreshData
  };
};
