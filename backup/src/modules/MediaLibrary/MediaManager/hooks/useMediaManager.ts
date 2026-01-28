// =========================================
// USE MEDIA MANAGER - HOOK ESPECIALIZADO
// =========================================
// Hook para gestão avançada de mídia
// Máximo: 200 linhas

import { useState, useCallback } from 'react';
import {
  MediaFile,
  MediaComment,
  MediaShare,
  MediaVersion,
  MediaOptimizationOptions
} from '../types';
import {
  optimizeMedia,
  batchOptimize,
  createMediaComment,
  fetchMediaComments,
  updateMediaComment,
  deleteMediaComment,
  shareMedia,
  fetchMediaShares,
  updateMediaShare,
  deleteMediaShare,
  createMediaVersion,
  fetchMediaVersions,
  restoreMediaVersion,
  deleteMediaVersion,
  formatFileSize,
  formatDuration,
  getFileTypeFromMime,
  getFileIcon,
  validateFileType,
  validateFileSize,
  generateThumbnailUrl,
  generatePreviewUrl,
  generateDownloadUrl
} from '../services/mediaManagerService';

interface UseMediaManagerReturn {
  // State
  comments: MediaComment[];
  shares: MediaShare[];
  versions: MediaVersion[];
  loading: boolean;
  error: string | null;
  
  // Optimization
  optimizeMedia: (mediaId: string, options?: MediaOptimizationOptions) => Promise<MediaFile | null>;
  batchOptimize: (mediaIds: string[], options?: MediaOptimizationOptions) => Promise<MediaFile[] | null>;
  
  // Comments
  createComment: (mediaId: string, content: string) => Promise<MediaComment | null>;
  getComments: (mediaId: string) => Promise<MediaComment[] | null>;
  updateComment: (commentId: string, content: string) => Promise<MediaComment | null>;
  deleteComment: (commentId: string) => Promise<boolean>;
  
  // Sharing
  shareMedia: (mediaId: string, shareData: any) => Promise<MediaShare | null>;
  getShares: (mediaId: string) => Promise<MediaShare[] | null>;
  updateShare: (shareId: string, shareData: any) => Promise<MediaShare | null>;
  deleteShare: (shareId: string) => Promise<boolean>;
  
  // Versions
  createVersion: (mediaId: string, file: File, changes: string) => Promise<MediaVersion | null>;
  getVersions: (mediaId: string) => Promise<MediaVersion[] | null>;
  restoreVersion: (versionId: string) => Promise<MediaFile | null>;
  deleteVersion: (versionId: string) => Promise<boolean>;
  
  // Utilities
  formatFileSize: (bytes: number) => string;
  formatDuration: (seconds: number) => string;
  getFileTypeFromMime: (mimeType: string) => string;
  getFileIcon: (type: string) => string;
  validateFileType: (file: File, allowedTypes: string[]) => boolean;
  validateFileSize: (file: File, maxSizeInMB: number) => boolean;
  generateThumbnailUrl: (mediaId: string, size?: 'small' | 'medium' | 'large') => string;
  generatePreviewUrl: (mediaId: string) => string;
  generateDownloadUrl: (mediaId: string) => string;
  
  // State management
  clearError: () => void;
}

export const useMediaManager = (): UseMediaManagerReturn => {
  const [comments, setComments] = useState<MediaComment[]>([]);
  const [shares, setShares] = useState<MediaShare[]>([]);
  const [versions, setVersions] = useState<MediaVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================================
  // OPTIMIZATION
  // =========================================

  const optimizeMedia = useCallback(async (mediaId: string, options: MediaOptimizationOptions = {}): Promise<MediaFile | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await optimizeMedia(mediaId, options);
      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao otimizar mídia');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const batchOptimize = useCallback(async (mediaIds: string[], options: MediaOptimizationOptions = {}): Promise<MediaFile[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await batchOptimize(mediaIds, options);
      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao otimizar mídia em lote');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================
  // COMMENTS
  // =========================================

  const createComment = useCallback(async (mediaId: string, content: string): Promise<MediaComment | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createMediaComment(mediaId, content);
      if (result.success && result.data) {
        setComments(prev => [...prev, result.data!]);
        return result.data;
      } else {
        setError(result.error || 'Erro ao criar comentário');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getComments = useCallback(async (mediaId: string): Promise<MediaComment[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMediaComments(mediaId);
      if (result.success && result.data) {
        setComments(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar comentários');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateComment = useCallback(async (commentId: string, content: string): Promise<MediaComment | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateMediaComment(commentId, content);
      if (result.success && result.data) {
        setComments(prev => prev.map(comment => comment.id === commentId ? result.data! : comment));
        return result.data;
      } else {
        setError(result.error || 'Erro ao atualizar comentário');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await deleteMediaComment(commentId);
      if (result.success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        return true;
      } else {
        setError(result.error || 'Erro ao excluir comentário');
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
  // SHARING
  // =========================================

  const shareMedia = useCallback(async (mediaId: string, shareData: any): Promise<MediaShare | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await shareMedia(mediaId, shareData);
      if (result.success && result.data) {
        setShares(prev => [...prev, result.data!]);
        return result.data;
      } else {
        setError(result.error || 'Erro ao compartilhar mídia');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getShares = useCallback(async (mediaId: string): Promise<MediaShare[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMediaShares(mediaId);
      if (result.success && result.data) {
        setShares(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar compartilhamentos');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateShare = useCallback(async (shareId: string, shareData: any): Promise<MediaShare | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateMediaShare(shareId, shareData);
      if (result.success && result.data) {
        setShares(prev => prev.map(share => share.id === shareId ? result.data! : share));
        return result.data;
      } else {
        setError(result.error || 'Erro ao atualizar compartilhamento');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteShare = useCallback(async (shareId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await deleteMediaShare(shareId);
      if (result.success) {
        setShares(prev => prev.filter(share => share.id !== shareId));
        return true;
      } else {
        setError(result.error || 'Erro ao excluir compartilhamento');
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
  // VERSIONS
  // =========================================

  const createVersion = useCallback(async (mediaId: string, file: File, changes: string): Promise<MediaVersion | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createMediaVersion(mediaId, file, changes);
      if (result.success && result.data) {
        setVersions(prev => [...prev, result.data!]);
        return result.data;
      } else {
        setError(result.error || 'Erro ao criar versão');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getVersions = useCallback(async (mediaId: string): Promise<MediaVersion[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMediaVersions(mediaId);
      if (result.success && result.data) {
        setVersions(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro ao buscar versões');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreVersion = useCallback(async (versionId: string): Promise<MediaFile | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await restoreMediaVersion(versionId);
      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao restaurar versão');
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVersion = useCallback(async (versionId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await deleteMediaVersion(versionId);
      if (result.success) {
        setVersions(prev => prev.filter(version => version.id !== versionId));
        return true;
      } else {
        setError(result.error || 'Erro ao excluir versão');
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

  return {
    // State
    comments,
    shares,
    versions,
    loading,
    error,
    
    // Optimization
    optimizeMedia,
    batchOptimize,
    
    // Comments
    createComment,
    getComments,
    updateComment,
    deleteComment,
    
    // Sharing
    shareMedia,
    getShares,
    updateShare,
    deleteShare,
    
    // Versions
    createVersion,
    getVersions,
    restoreVersion,
    deleteVersion,
    
    // Utilities
    formatFileSize,
    formatDuration,
    getFileTypeFromMime,
    getFileIcon,
    validateFileType,
    validateFileSize,
    generateThumbnailUrl,
    generatePreviewUrl,
    generateDownloadUrl,
    
    // State management
    clearError
  };
};
