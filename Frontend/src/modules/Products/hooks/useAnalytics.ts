import { useCallback } from 'react';
import { useApiState } from './shared/useApiState';
import { productsApi, landingPagesApi, leadCaptureFormsApi, leadsApi } from '../services/productsApiService';

export const useAnalytics = () => {
  const productsStats = useApiState();

  const landingPagesStats = useApiState();

  const formsStats = useApiState();

  const leadsStats = useApiState();

  const getProductsStats = useCallback(() => 
    productsStats.execute(() => productsApi.getStats()), [productsStats]);

  const getLandingPagesStats = useCallback((id: string) => 
    landingPagesStats.execute(() => landingPagesApi.getStats(id)), [landingPagesStats]);

  const getFormsStats = useCallback((id: string) => 
    formsStats.execute(() => leadCaptureFormsApi.getStats(id)), [formsStats]);

  const getLeadsStats = useCallback(() => 
    leadsStats.execute(() => leadsApi.getStats()), [leadsStats]);

  return {
    productsStats: productsStats.data,
    landingPagesStats: landingPagesStats.data,
    formsStats: formsStats.data,
    leadsStats: leadsStats.data,
    loading: productsStats.loading || landingPagesStats.loading || formsStats.loading || leadsStats.loading,
    error: productsStats.error || landingPagesStats.error || formsStats.error || leadsStats.error,
    getProductsStats,
    getLandingPagesStats,
    getFormsStats,
    getLeadsStats};
};
