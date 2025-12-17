import { useCallback } from 'react';
import { useAnalyticsState } from './useAnalyticsState';
import { getMediaStats, getStorageStats } from '../services/mediaAnalyticsService';
import type { MediaStats } from '@/types/stats.types';

export const useMediaStats = () => {
  const { data: stats, loading, error, execute, clearError } = useAnalyticsState<MediaStats>();

  const getStats = useCallback((filters: unknown = {}) => 
    execute(() => getMediaStats(filters), 'Erro ao buscar estatísticas'), [execute]);

  const getStorage = useCallback(() => 
    execute(() => getStorageStats(), 'Erro ao buscar estatísticas de armazenamento'), [execute]);

  return { stats, loading, error, getStats, getStorage, clearError};
};
