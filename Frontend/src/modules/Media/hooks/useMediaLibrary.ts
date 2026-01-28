// =========================================
// USE MEDIA LIBRARY - HOOK ORQUESTRADOR PRINCIPAL
// =========================================
// Hook principal que orquestra todos os hooks especializados
// Máximo: 200 linhas

import { useCallback, useEffect } from 'react';
import { useMediaCore } from '../MediaCore/hooks/useMediaCore';
import { useMediaManager } from '../MediaManager/hooks/useMediaManager';
import { useMediaAnalytics } from '../MediaAnalytics/hooks/useMediaAnalytics';
import { useMediaAI } from '../MediaAI/hooks/useMediaAI';
import { useMediaUpload } from './useMediaUpload';
import {
  MediaFile,
  MediaFolder,
  MediaSearchFilters,
  MediaStats
} from '../types';

interface UseMediaLibraryReturn {
  // State from Core
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
  searchMedia: (query: string, filters?: MediaSearchFilters) => Promise<any>;
  getMediaByType: (type: string, filters?: MediaSearchFilters) => Promise<MediaFile[] | null>;
  getMediaByFolder: (folderId: string, filters?: MediaSearchFilters) => Promise<MediaFile[] | null>;
  
  // Folders
  getFolders: (filters?: any) => Promise<void>;
  createFolder: (data: any) => Promise<MediaFolder | null>;
  updateFolder: (id: string, data: any) => Promise<MediaFolder | null>;
  deleteFolder: (id: string) => Promise<boolean>;
  
  // Manager Actions
  optimizeMedia: (mediaId: string, options?: any) => Promise<MediaFile | null>;
  batchOptimize: (mediaIds: string[], options?: any) => Promise<MediaFile[] | null>;
  
  // Analytics
  stats: MediaStats | null;
  getStats: (filters?: any) => Promise<MediaStats | null>;
  getStorageStats: () => Promise<MediaStats | null>;
  
  // AI Actions
  autoTag: (mediaId: string) => Promise<any>;
  batchAutoTag: (mediaIds: string[]) => Promise<any>;
  findSimilar: (mediaId: string) => Promise<any>;
  
  // Upload
  uploads: any[];
  isUploading: boolean;
  dragActive: boolean;
  fileInputRef: any;
  uploadFiles: (files: File[], options?: any) => Promise<void>;
  clearUploads: () => void;
  openFileDialog: () => void;
  handleFileSelect: (event: any) => void;
  handleDragEnter: (event: any) => void;
  handleDragLeave: (event: any) => void;
  handleDragOver: (event: any) => void;
  handleDrop: (event: any) => void;
  
  // Utilities
  formatFileSize: (bytes: number) => string;
  getFileIcon: (type: string) => string;
  getMediaType: (mimeType: string) => string;
  clearError: () => void;
  refreshData: () => Promise<void>;
}

export const useMediaLibrary = (): UseMediaLibraryReturn => {
  // =========================================
  // HOOKS ESPECIALIZADOS
  // =========================================
  
  const core = useMediaCore();
  const manager = useMediaManager();
  const analytics = useMediaAnalytics();
  const ai = useMediaAI();
  const upload = useMediaUpload();

  // =========================================
  // ORQUESTRAÇÃO DE AÇÕES
  // =========================================

  const refreshData = useCallback(async () => {
    await Promise.all([
      core.getMedia(),
      core.getFolders(),
      analytics.getStats()
    ]);
  }, [core, analytics]);

  const clearError = useCallback(() => {
    core.clearError();
    manager.clearError();
    analytics.clearError();
    ai.clearError();
  }, [core, manager, analytics, ai]);

  // =========================================
  // EFFECTS
  // =========================================

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // =========================================
  // RETURN ORQUESTRADO
  // =========================================

  return {
    // State from Core
    media: core.media,
    folders: core.folders,
    currentMedia: core.currentMedia,
    currentFolder: core.currentFolder,
    loading: core.loading || manager.loading || analytics.loading || ai.loading,
    error: core.error || manager.error || analytics.error || ai.error,
    
    // Filters
    filters: core.filters,
    setFilters: core.setFilters,
    
    // Core Actions
    getMedia: core.getMedia,
    getMediaById: core.getMediaById,
    createMedia: core.createMedia,
    updateMedia: core.updateMedia,
    deleteMedia: core.deleteMedia,
    
    // Bulk Actions
    bulkUpdateMedia: core.bulkUpdateMedia,
    bulkDeleteMedia: core.bulkDeleteMedia,
    
    // Search
    searchMedia: core.searchMedia,
    getMediaByType: core.getMediaByType,
    getMediaByFolder: core.getMediaByFolder,
    
    // Folders
    getFolders: core.getFolders,
    createFolder: core.createFolder,
    updateFolder: core.updateFolder,
    deleteFolder: core.deleteFolder,
    
    // Manager Actions
    optimizeMedia: manager.optimizeMedia,
    batchOptimize: manager.batchOptimize,
    
    // Analytics
    stats: analytics.stats,
    getStats: analytics.getStats,
    getStorageStats: analytics.getStorageStats,
    
    // AI Actions
    autoTag: ai.autoTag,
    batchAutoTag: ai.batchAutoTag,
    findSimilar: ai.findSimilar,
    
    // Upload
    uploads: upload.uploads,
    isUploading: upload.isUploading,
    dragActive: upload.dragActive,
    fileInputRef: upload.fileInputRef,
    uploadFiles: upload.uploadFiles,
    clearUploads: upload.clearUploads,
    openFileDialog: upload.openFileDialog,
    handleFileSelect: upload.handleFileSelect,
    handleDragEnter: upload.handleDragEnter,
    handleDragLeave: upload.handleDragLeave,
    handleDragOver: upload.handleDragOver,
    handleDrop: upload.handleDrop,
    
    // Utilities
    formatFileSize: manager.formatFileSize,
    getFileIcon: manager.getFileIcon,
    getMediaType: manager.getFileTypeFromMime,
    clearError,
    refreshData
  };
};
