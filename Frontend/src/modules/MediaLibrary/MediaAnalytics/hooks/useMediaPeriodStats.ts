import { useCallback } from 'react';
import { useAnalyticsState } from './useAnalyticsState';
import { getMediaStatsByPeriod, getUploadStats, getDownloadStats } from '../services/mediaAnalyticsService';

type Period = 'day' | 'week' | 'month' | 'year';

export const useMediaPeriodStats = () => {
  const { data: periodStats, loading: periodLoading, error: periodError, execute: executePeriod, clearError: clearPeriodError } = useAnalyticsState<any>();

  const { data: uploadStats, loading: uploadLoading, error: uploadError, execute: executeUpload, clearError: clearUploadError } = useAnalyticsState<any>();

  const { data: downloadStats, loading: downloadLoading, error: downloadError, execute: executeDownload, clearError: clearDownloadError } = useAnalyticsState<any>();

  const getByPeriod = useCallback((period: Period, filters: unknown = {}) => 
    executePeriod(() => getMediaStatsByPeriod(period, filters), 'Erro ao buscar estatísticas por período'), [executePeriod]);

  const getUploads = useCallback((period: Period, filters: unknown = {}) => 
    executeUpload(() => getUploadStats(period, filters), 'Erro ao buscar estatísticas de upload'), [executeUpload]);

  const getDownloads = useCallback((period: Period, filters: unknown = {}) => 
    executeDownload(() => getDownloadStats(period, filters), 'Erro ao buscar estatísticas de download'), [executeDownload]);

  return {
    periodStats, periodLoading, periodError, getByPeriod, clearPeriodError,
    uploadStats, uploadLoading, uploadError, getUploads, clearUploadError,
    downloadStats, downloadLoading, downloadError, getDownloads, clearDownloadError};
};
