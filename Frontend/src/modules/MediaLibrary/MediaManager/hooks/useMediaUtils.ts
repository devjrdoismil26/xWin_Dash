import { useCallback } from 'react';
import { formatFileSize, formatDuration, getFileTypeFromMime, getFileIcon, validateFileType, validateFileSize, generateThumbnailUrl, generatePreviewUrl, generateDownloadUrl } from '../services/mediaManagerService';

export const useMediaUtils = () => {
  const formatSize = useCallback((bytes: number) => formatFileSize(bytes), []);

  const formatTime = useCallback((seconds: number) => formatDuration(seconds), []);

  const getFileType = useCallback((mimeType: string) => getFileTypeFromMime(mimeType), []);

  const getIcon = useCallback((type: string) => getFileIcon(type), []);

  const validateType = useCallback((file: File, allowedTypes: string[]) => validateFileType(file, allowedTypes), []);

  const validateSize = useCallback((file: File, maxSizeInMB: number) => validateFileSize(file, maxSizeInMB), []);

  const getThumbnailUrl = useCallback((mediaId: string, size?: 'small' | 'medium' | 'large') => generateThumbnailUrl(mediaId, size), []);

  const getPreviewUrl = useCallback((mediaId: string) => generatePreviewUrl(mediaId), []);

  const getDownloadUrl = useCallback((mediaId: string) => generateDownloadUrl(mediaId), []);

  return {
    formatSize,
    formatTime,
    getFileType,
    getIcon,
    validateType,
    validateSize,
    getThumbnailUrl,
    getPreviewUrl,
    getDownloadUrl};
};
