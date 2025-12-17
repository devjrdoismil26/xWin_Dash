import { useState, useCallback } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { optimizeMedia, batchOptimize } from '../services/mediaManagerService';
import type { MediaFile } from '@/types/core.types';

interface MediaOptimizationOptions {
  quality?: number;
  format?: string;
  resize?: { width?: number;
  height?: number
  [key: string]: unknown; };

}

export const useMediaOptimization = () => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const optimize = useCallback(async (mediaId: string, options?: MediaOptimizationOptions): Promise<MediaFile | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await optimizeMedia(mediaId, options);

      return result.success && result.data ? result.data : null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  const batchOptimizeMedia = useCallback(async (mediaIds: string[], options?: MediaOptimizationOptions): Promise<MediaFile[] | null> => {
    setLoading(true);

    setError(null);

    try {
      const result = await batchOptimize(mediaIds, options);

      return result.success && result.data ? result.data : null;
    } catch (err) {
      setError(getErrorMessage(err));

      return null;
    } finally {
      setLoading(false);

    } , []);

  return { loading, error, optimize, batchOptimizeMedia};
};
