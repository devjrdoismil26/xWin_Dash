// =========================================
// MEDIA LIBRARY SERVICE - ORQUESTRADOR PRINCIPAL
// =========================================
// Serviço principal que orquestra todos os serviços especializados
// Máximo: 200 linhas

// =========================================
// IMPORTS DOS SERVIÇOS ESPECIALIZADOS
// =========================================

// Core Services
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
} from '../MediaCore/services/mediaCoreService';

// Manager Services
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
} from '../MediaManager/services/mediaManagerService';

// Analytics Services
import {
  getMediaStats,
  getStorageStats,
  getMediaStatsByPeriod,
  getUploadStats,
  getDownloadStats,
  getMediaPerformanceStats,
  getMediaEngagementStats,
  getMediaHealthStats,
  getMediaAttributionStats,
  getMediaSourceStats,
  getMediaForecasting,
  getMediaTrends,
  getMediaROI,
  getMediaCostAnalysis
} from '../MediaAnalytics/services/mediaAnalyticsService';

// AI Services
import {
  autoTagMedia,
  batchAutoTag,
  detectFaces,
  recognizeFaces,
  detectObjects,
  classifyImage,
  extractText,
  extractTextFromDocument,
  analyzeColors,
  extractColorPalette,
  findSimilarMedia,
  searchByImage,
  getAIStatus,
  getAIProcessingQueue
} from '../MediaAI/services/mediaAIService';

// =========================================
// RE-EXPORTS ORGANIZADOS
// =========================================

// Core Operations
export {
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
};

// Manager Operations
export {
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
  deleteMediaVersion
};

// Analytics Operations
export {
  getMediaStats,
  getStorageStats,
  getMediaStatsByPeriod,
  getUploadStats,
  getDownloadStats,
  getMediaPerformanceStats,
  getMediaEngagementStats,
  getMediaHealthStats,
  getMediaAttributionStats,
  getMediaSourceStats,
  getMediaForecasting,
  getMediaTrends,
  getMediaROI,
  getMediaCostAnalysis
};

// AI Operations
export {
  autoTagMedia,
  batchAutoTag,
  detectFaces,
  recognizeFaces,
  detectObjects,
  classifyImage,
  extractText,
  extractTextFromDocument,
  analyzeColors,
  extractColorPalette,
  findSimilarMedia,
  searchByImage,
  getAIStatus,
  getAIProcessingQueue
};

// Utility Functions
export {
  formatFileSize,
  formatDuration,
  getFileTypeFromMime,
  getFileIcon,
  validateFileType,
  validateFileSize,
  generateThumbnailUrl,
  generatePreviewUrl,
  generateDownloadUrl
};

// =========================================
// CLASSE ORQUESTRADORA (LEGACY)
// =========================================

class MediaLibraryService {
  // =========================================
  // MÉTODOS ORQUESTRADORES (LEGACY)
  // =========================================
  // Mantidos para compatibilidade com código existente
  
  async getMedia(filters: any = {}) {
    return await fetchMedia(filters);
  }

  async getMediaById(mediaId: string) {
    return await fetchMediaById(mediaId);
  }

  async uploadMedia(file: File, metadata: any = {}) {
    return await createMedia(file, metadata);
  }

  async updateMedia(mediaId: string, mediaData: any) {
    return await updateMedia(mediaId, mediaData);
  }

  async deleteMedia(mediaId: string) {
    return await deleteMedia(mediaId);
  }

  async getFolders(filters: any = {}) {
    return await fetchFolders(filters);
  }

  async createFolder(folderData: any) {
    return await createFolder(folderData);
  }

  async updateFolder(folderId: string, folderData: any) {
    return await updateFolder(folderId, folderData);
  }

  async deleteFolder(folderId: string) {
    return await deleteFolder(folderId);
  }

  async searchMedia(query: string, filters: any = {}) {
    return await searchMedia(query, filters);
  }

  async getMediaByType(type: string, filters: any = {}) {
    return await getMediaByType(type, filters);
  }

  async getMediaByFolder(folderId: string, filters: any = {}) {
    return await getMediaByFolder(folderId, filters);
  }

  async getMediaStats(filters: any = {}) {
    return await getMediaStats(filters);
  }

  async getStorageStats() {
    return await getStorageStats();
  }

  async optimizeMedia(mediaId: string, options: any = {}) {
    return await optimizeMedia(mediaId, options);
  }

  async batchOptimize(mediaIds: string[], options: any = {}) {
    return await batchOptimize(mediaIds, options);
  }

  // =========================================
  // UTILITY METHODS (LEGACY)
  // =========================================
  
  formatFileSize(bytes: number): string {
    return formatFileSize(bytes);
  }

  formatDuration(seconds: number): string {
    return formatDuration(seconds);
  }

  getFileTypeFromMime(mimeType: string): string {
    return getFileTypeFromMime(mimeType);
  }

  getFileIcon(type: string): string {
    return getFileIcon(type);
  }

  validateFileType(file: File, allowedTypes: string[]): boolean {
    return validateFileType(file, allowedTypes);
  }

  validateFileSize(file: File, maxSizeInMB: number): boolean {
    return validateFileSize(file, maxSizeInMB);
  }

  generateThumbnailUrl(mediaId: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    return generateThumbnailUrl(mediaId, size);
  }

  generatePreviewUrl(mediaId: string): string {
    return generatePreviewUrl(mediaId);
  }

  generateDownloadUrl(mediaId: string): string {
    return generateDownloadUrl(mediaId);
  }

  calculateStoragePercentage(used: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  }

  getStorageStatus(percentage: number): 'low' | 'medium' | 'high' | 'critical' {
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  }

  formatStorageStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      low: 'Baixo',
      medium: 'Médio',
      high: 'Alto',
      critical: 'Crítico'
    };
    return statusMap[status] || status;
  }

  generateMediaTags(filename: string, type: string): string[] {
    const tags: string[] = [];
    
    // Adicionar tag baseada no tipo
    tags.push(type);
    
    // Extrair palavras do nome do arquivo
    const words = filename.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    tags.push(...words.slice(0, 3));
    
    return [...new Set(tags)];
  }

  validateMediaData(mediaData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!mediaData.filename || mediaData.filename.trim().length === 0) {
      errors.push('Nome do arquivo é obrigatório');
    }

    if (!mediaData.type || !['image', 'video', 'audio', 'document'].includes(mediaData.type)) {
      errors.push('Tipo de arquivo inválido');
    }

    if (mediaData.size && mediaData.size <= 0) {
      errors.push('Tamanho do arquivo deve ser maior que zero');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}


// ===== UTILITY FUNCTIONS =====
export const getCurrentProjectId = (): string | null => {
  return localStorage.getItem('current_project_id');
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const mediaLibraryService = new MediaLibraryService();
export { mediaLibraryService };
export default mediaLibraryService;
