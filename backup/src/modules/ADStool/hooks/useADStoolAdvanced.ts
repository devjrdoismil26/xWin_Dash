import { useState, useEffect, useCallback } from 'react';
import { adsService } from '../services/adsService';
import {
  AdsAnalyticsOverview,
  AdsCampaignAnalytics,
  AdsAccountAnalytics,
  AdsCreativeAnalytics,
  AdsPerformanceAnalytics,
  AdsROIAnalytics,
  AdsCompetitorAnalytics,
  AdsKeywordAnalytics,
  AdsAudienceAnalytics,
  AdsLandingPageAnalytics,
  AdsConversionAnalytics,
  AdsAttributionAnalytics,
  AdsAnalyticsFilter,
  AdsAnalyticsSort,
  AdsAnalyticsPagination,
  UseAdsAnalyticsReturn,
  UseAdsCampaignAnalyticsReturn,
  UseAdsAccountAnalyticsReturn,
  UseAdsCreativeAnalyticsReturn,
  UseAdsPerformanceAnalyticsReturn,
  UseAdsROIAnalyticsReturn,
  UseAdsCompetitorAnalyticsReturn,
  UseAdsKeywordAnalyticsReturn,
  UseAdsAudienceAnalyticsReturn,
  UseAdsLandingPageAnalyticsReturn,
  UseAdsConversionAnalyticsReturn,
  UseAdsAttributionAnalyticsReturn
} from '../types';

// ===== ANALYTICS HOOKS =====
export const useAdsAnalytics = (): UseAdsAnalyticsReturn => {
  const [overview, setOverview] = useState<AdsAnalyticsOverview | null>(null);
  const [campaignAnalytics, setCampaignAnalytics] = useState<AdsCampaignAnalytics | null>(null);
  const [accountAnalytics, setAccountAnalytics] = useState<AdsAccountAnalytics | null>(null);
  const [creativeAnalytics, setCreativeAnalytics] = useState<AdsCreativeAnalytics[]>([]);
  const [performanceAnalytics, setPerformanceAnalytics] = useState<AdsPerformanceAnalytics | null>(null);
  const [roiAnalytics, setROIAnalytics] = useState<AdsROIAnalytics | null>(null);
  const [competitorAnalytics, setCompetitorAnalytics] = useState<AdsCompetitorAnalytics | null>(null);
  const [keywordAnalytics, setKeywordAnalytics] = useState<AdsKeywordAnalytics | null>(null);
  const [audienceAnalytics, setAudienceAnalytics] = useState<AdsAudienceAnalytics | null>(null);
  const [landingPageAnalytics, setLandingPageAnalytics] = useState<AdsLandingPageAnalytics | null>(null);
  const [conversionAnalytics, setConversionAnalytics] = useState<AdsConversionAnalytics | null>(null);
  const [attributionAnalytics, setAttributionAnalytics] = useState<AdsAttributionAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdsAnalyticsFilter>({});
  const [sort, setSort] = useState<AdsAnalyticsSort>({
    field: 'date',
    direction: 'desc'
  });
  const [pagination, setPagination] = useState<AdsAnalyticsPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getAnalyticsOverview();
      if (response.success) {
        setOverview(response.data as AdsAnalyticsOverview);
      } else {
        setError(response.error || 'Failed to fetch analytics overview');
      }
    } catch (err) {
      setError('Failed to fetch analytics overview');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPerformanceAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getPerformanceAnalytics();
      if (response.success) {
        setPerformanceAnalytics(response.data as AdsPerformanceAnalytics);
      } else {
        setError(response.error || 'Failed to fetch performance analytics');
      }
    } catch (err) {
      setError('Failed to fetch performance analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchROIAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getROIAnalytics();
      if (response.success) {
        setROIAnalytics(response.data as AdsROIAnalytics);
      } else {
        setError(response.error || 'Failed to fetch ROI analytics');
      }
    } catch (err) {
      setError('Failed to fetch ROI analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompetitorAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getCompetitorAnalytics();
      if (response.success) {
        setCompetitorAnalytics(response.data as AdsCompetitorAnalytics);
      } else {
        setError(response.error || 'Failed to fetch competitor analytics');
      }
    } catch (err) {
      setError('Failed to fetch competitor analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchKeywordAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getKeywordAnalytics();
      if (response.success) {
        setKeywordAnalytics(response.data as AdsKeywordAnalytics);
      } else {
        setError(response.error || 'Failed to fetch keyword analytics');
      }
    } catch (err) {
      setError('Failed to fetch keyword analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAudienceAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getAudienceAnalytics();
      if (response.success) {
        setAudienceAnalytics(response.data as AdsAudienceAnalytics);
      } else {
        setError(response.error || 'Failed to fetch audience analytics');
      }
    } catch (err) {
      setError('Failed to fetch audience analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLandingPageAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getLandingPageAnalytics();
      if (response.success) {
        setLandingPageAnalytics(response.data as AdsLandingPageAnalytics);
      } else {
        setError(response.error || 'Failed to fetch landing page analytics');
      }
    } catch (err) {
      setError('Failed to fetch landing page analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConversionAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getConversionAnalytics();
      if (response.success) {
        setConversionAnalytics(response.data as AdsConversionAnalytics);
      } else {
        setError(response.error || 'Failed to fetch conversion analytics');
      }
    } catch (err) {
      setError('Failed to fetch conversion analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAttributionAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getAttributionAnalytics();
      if (response.success) {
        setAttributionAnalytics(response.data as AdsAttributionAnalytics);
      } else {
        setError(response.error || 'Failed to fetch attribution analytics');
      }
    } catch (err) {
      setError('Failed to fetch attribution analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCreativeAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        sort
      };
      
      const response = await adsService.getCreativeAnalytics(params);
      if (response.success) {
        const data = response.data as any;
        setCreativeAnalytics(data.items || []);
        setPagination(data.pagination || pagination);
      } else {
        setError(response.error || 'Failed to fetch creative analytics');
      }
    } catch (err) {
      setError('Failed to fetch creative analytics');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sort]);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchOverview(),
      fetchPerformanceAnalytics(),
      fetchROIAnalytics(),
      fetchCompetitorAnalytics(),
      fetchKeywordAnalytics(),
      fetchAudienceAnalytics(),
      fetchLandingPageAnalytics(),
      fetchConversionAnalytics(),
      fetchAttributionAnalytics(),
      fetchCreativeAnalytics()
    ]);
  }, [
    fetchOverview,
    fetchPerformanceAnalytics,
    fetchROIAnalytics,
    fetchCompetitorAnalytics,
    fetchKeywordAnalytics,
    fetchAudienceAnalytics,
    fetchLandingPageAnalytics,
    fetchConversionAnalytics,
    fetchAttributionAnalytics,
    fetchCreativeAnalytics
  ]);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    overview,
    campaignAnalytics,
    accountAnalytics,
    creativeAnalytics,
    performanceAnalytics,
    roiAnalytics,
    competitorAnalytics,
    keywordAnalytics,
    audienceAnalytics,
    landingPageAnalytics,
    conversionAnalytics,
    attributionAnalytics,
    loading,
    error,
    filters,
    sort,
    pagination,
    setFilters,
    setSort,
    setPage,
    refresh
  };
};

export const useAdsCampaignAnalytics = (campaignId: string): UseAdsCampaignAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AdsCampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getCampaignAnalytics({ campaignId });
      if (response.success) {
        setAnalytics(response.data as AdsCampaignAnalytics);
      } else {
        setError(response.error || 'Failed to fetch campaign analytics');
      }
    } catch (err) {
      setError('Failed to fetch campaign analytics');
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  const refresh = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (campaignId) {
      refresh();
    }
  }, [refresh, campaignId]);

  return {
    analytics,
    loading,
    error,
    refresh
  };
};

export const useAdsAccountAnalytics = (accountId: string): UseAdsAccountAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AdsAccountAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getAccountAnalytics({ accountId });
      if (response.success) {
        setAnalytics(response.data as AdsAccountAnalytics);
      } else {
        setError(response.error || 'Failed to fetch account analytics');
      }
    } catch (err) {
      setError('Failed to fetch account analytics');
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  const refresh = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (accountId) {
      refresh();
    }
  }, [refresh, accountId]);

  return {
    analytics,
    loading,
    error,
    refresh
  };
};

export const useAdsCreativeAnalytics = (): UseAdsCreativeAnalyticsReturn => {
  const [creatives, setCreatives] = useState<AdsCreativeAnalytics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdsAnalyticsFilter>({});
  const [sort, setSort] = useState<AdsAnalyticsSort>({
    field: 'date',
    direction: 'desc'
  });
  const [pagination, setPagination] = useState<AdsAnalyticsPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchCreatives = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        sort
      };
      
      const response = await adsService.getCreativeAnalytics(params);
      if (response.success) {
        const data = response.data as any;
        setCreatives(data.items || []);
        setPagination(data.pagination || pagination);
      } else {
        setError(response.error || 'Failed to fetch creative analytics');
      }
    } catch (err) {
      setError('Failed to fetch creative analytics');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sort]);

  const refresh = useCallback(async () => {
    await fetchCreatives();
  }, [fetchCreatives]);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    creatives,
    loading,
    error,
    filters,
    sort,
    pagination,
    setFilters,
    setSort,
    setPage,
    refresh
  };
};

export const useAdsPerformanceAnalytics = (): UseAdsPerformanceAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AdsPerformanceAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getPerformanceAnalytics();
      if (response.success) {
        setAnalytics(response.data as AdsPerformanceAnalytics);
      } else {
        setError(response.error || 'Failed to fetch performance analytics');
      }
    } catch (err) {
      setError('Failed to fetch performance analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    analytics,
    loading,
    error,
    refresh
  };
};

export const useAdsROIAnalytics = (): UseAdsROIAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AdsROIAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getROIAnalytics();
      if (response.success) {
        setAnalytics(response.data as AdsROIAnalytics);
      } else {
        setError(response.error || 'Failed to fetch ROI analytics');
      }
    } catch (err) {
      setError('Failed to fetch ROI analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    analytics,
    loading,
    error,
    refresh
  };
};

export const useAdsCompetitorAnalytics = (): UseAdsCompetitorAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AdsCompetitorAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getCompetitorAnalytics();
      if (response.success) {
        setAnalytics(response.data as AdsCompetitorAnalytics);
      } else {
        setError(response.error || 'Failed to fetch competitor analytics');
      }
    } catch (err) {
      setError('Failed to fetch competitor analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    analytics,
    loading,
    error,
    refresh
  };
};

export const useAdsKeywordAnalytics = (): UseAdsKeywordAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AdsKeywordAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getKeywordAnalytics();
      if (response.success) {
        setAnalytics(response.data as AdsKeywordAnalytics);
      } else {
        setError(response.error || 'Failed to fetch keyword analytics');
      }
    } catch (err) {
      setError('Failed to fetch keyword analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    analytics,
    loading,
    error,
    refresh
  };
};

export const useAdsAudienceAnalytics = (): UseAdsAudienceAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AdsAudienceAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getAudienceAnalytics();
      if (response.success) {
        setAnalytics(response.data as AdsAudienceAnalytics);
      } else {
        setError(response.error || 'Failed to fetch audience analytics');
      }
    } catch (err) {
      setError('Failed to fetch audience analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    analytics,
    loading,
    error,
    refresh
  };
};

export const useAdsLandingPageAnalytics = (): UseAdsLandingPageAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AdsLandingPageAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getLandingPageAnalytics();
      if (response.success) {
        setAnalytics(response.data as AdsLandingPageAnalytics);
      } else {
        setError(response.error || 'Failed to fetch landing page analytics');
      }
    } catch (err) {
      setError('Failed to fetch landing page analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    analytics,
    loading,
    error,
    refresh
  };
};

export const useAdsConversionAnalytics = (): UseAdsConversionAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AdsConversionAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getConversionAnalytics();
      if (response.success) {
        setAnalytics(response.data as AdsConversionAnalytics);
      } else {
        setError(response.error || 'Failed to fetch conversion analytics');
      }
    } catch (err) {
      setError('Failed to fetch conversion analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    analytics,
    loading,
    error,
    refresh
  };
};

export const useAdsAttributionAnalytics = (): UseAdsAttributionAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AdsAttributionAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adsService.getAttributionAnalytics();
      if (response.success) {
        setAnalytics(response.data as AdsAttributionAnalytics);
      } else {
        setError(response.error || 'Failed to fetch attribution analytics');
      }
    } catch (err) {
      setError('Failed to fetch attribution analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    analytics,
    loading,
    error,
    refresh
  };
};
