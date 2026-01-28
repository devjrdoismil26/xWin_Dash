import { useState, useCallback, useEffect } from 'react';
import { adsService } from '../services/adsService';

interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  platform: string;
}

interface Filters {
  search?: string;
  status?: string;
  platform?: string;
}

export const useADSToolRefactored = (filters: Filters = {}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCampaigns = useCallback(async (customFilters?: Filters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adsService.campaigns.getCampaigns(customFilters || filters);

      if (response.success && response.data) {
        setCampaigns(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getCampaign = useCallback(async (id: string) => {
    setLoading(true);

    try {
      const response = await adsService.campaigns.getCampaignById(id);
      return response.success ? response.data : null;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCampaign = useCallback(async (data: Partial<Campaign>) => {
    setLoading(true);

    try {
      const response = await adsService.campaigns.createCampaign(data);
      if (response.success) {
        await getCampaigns();
      }
      return response;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [getCampaigns]);

  const updateCampaign = useCallback(async (id: string, data: Partial<Campaign>) => {
    setLoading(true);

    try {
      const response = await adsService.campaigns.updateCampaign(id, data);
      if (response.success) {
        await getCampaigns();
      }
      return response;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [getCampaigns]);

  const deleteCampaign = useCallback(async (id: string) => {
    setLoading(true);

    try {
      const response = await adsService.campaigns.deleteCampaign(id);
      if (response.success) {
        await getCampaigns();
      }
      return response;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [getCampaigns]);

  useEffect(() => {
    getCampaigns();
  }, [getCampaigns]);

  return {
    campaigns,
    loading,
    error,
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
};

export default useADSToolRefactored;
