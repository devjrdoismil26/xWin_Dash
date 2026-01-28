import { useState, useEffect, useCallback } from 'react';
import { socialBufferService } from '../services/socialBufferService';
import {
  SocialAnalyticsOverview,
  SocialAccountAnalytics,
  SocialPostAnalytics,
  SocialEngagementAnalytics,
  SocialReachAnalytics,
  SocialImpressionsAnalytics,
  SocialAnalyticsFilter,
  SocialAnalyticsSort,
  SocialAnalyticsPagination,
  UseSocialAnalyticsReturn,
  UseSocialAccountAnalyticsReturn,
  UseSocialPostAnalyticsReturn,
  UseSocialEngagementAnalyticsReturn,
  UseSocialReachAnalyticsReturn,
  UseSocialImpressionsAnalyticsReturn
} from '../types/socialTypes';

// ===== ANALYTICS HOOKS =====
export const useSocialAnalytics = (): UseSocialAnalyticsReturn => {
  const [overview, setOverview] = useState<SocialAnalyticsOverview | null>(null);
  const [accountAnalytics, setAccountAnalytics] = useState<SocialAccountAnalytics | null>(null);
  const [postAnalytics, setPostAnalytics] = useState<SocialPostAnalytics[]>([]);
  const [engagementAnalytics, setEngagementAnalytics] = useState<SocialEngagementAnalytics | null>(null);
  const [reachAnalytics, setReachAnalytics] = useState<SocialReachAnalytics | null>(null);
  const [impressionsAnalytics, setImpressionsAnalytics] = useState<SocialImpressionsAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SocialAnalyticsFilter>({});
  const [sort, setSort] = useState<SocialAnalyticsSort>({
    field: 'date',
    direction: 'desc'
  });
  const [pagination, setPagination] = useState<SocialAnalyticsPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await socialBufferService.getAnalyticsOverview();
      if (response.success) {
        setOverview(response.data as SocialAnalyticsOverview);
      } else {
        setError(response.error || 'Failed to fetch analytics overview');
      }
    } catch (err) {
      setError('Failed to fetch analytics overview');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEngagementAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await socialBufferService.getEngagementAnalytics();
      if (response.success) {
        setEngagementAnalytics(response.data as SocialEngagementAnalytics);
      } else {
        setError(response.error || 'Failed to fetch engagement analytics');
      }
    } catch (err) {
      setError('Failed to fetch engagement analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReachAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await socialBufferService.getReachAnalytics();
      if (response.success) {
        setReachAnalytics(response.data as SocialReachAnalytics);
      } else {
        setError(response.error || 'Failed to fetch reach analytics');
      }
    } catch (err) {
      setError('Failed to fetch reach analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchImpressionsAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await socialBufferService.getImpressionsAnalytics();
      if (response.success) {
        setImpressionsAnalytics(response.data as SocialImpressionsAnalytics);
      } else {
        setError(response.error || 'Failed to fetch impressions analytics');
      }
    } catch (err) {
      setError('Failed to fetch impressions analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        sort
      };
      
      const response = await socialBufferService.getPostAnalytics(params);
      if (response.success) {
        const data = response.data as any;
        setPostAnalytics(data.items || []);
        setPagination(data.pagination || pagination);
      } else {
        setError(response.error || 'Failed to fetch post analytics');
      }
    } catch (err) {
      setError('Failed to fetch post analytics');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sort]);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchOverview(),
      fetchEngagementAnalytics(),
      fetchReachAnalytics(),
      fetchImpressionsAnalytics(),
      fetchPostAnalytics()
    ]);
  }, [fetchOverview, fetchEngagementAnalytics, fetchReachAnalytics, fetchImpressionsAnalytics, fetchPostAnalytics]);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    overview,
    accountAnalytics,
    postAnalytics,
    engagementAnalytics,
    reachAnalytics,
    impressionsAnalytics,
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

export const useSocialAccountAnalytics = (accountId: string): UseSocialAccountAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<SocialAccountAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await socialBufferService.getAccountAnalytics(accountId);
      if (response.success) {
        setAnalytics(response.data as SocialAccountAnalytics);
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

export const useSocialPostAnalytics = (): UseSocialPostAnalyticsReturn => {
  const [posts, setPosts] = useState<SocialPostAnalytics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SocialAnalyticsFilter>({});
  const [sort, setSort] = useState<SocialAnalyticsSort>({
    field: 'date',
    direction: 'desc'
  });
  const [pagination, setPagination] = useState<SocialAnalyticsPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        sort
      };
      
      const response = await socialBufferService.getPostAnalytics(params);
      if (response.success) {
        const data = response.data as any;
        setPosts(data.items || []);
        setPagination(data.pagination || pagination);
      } else {
        setError(response.error || 'Failed to fetch post analytics');
      }
    } catch (err) {
      setError('Failed to fetch post analytics');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sort]);

  const refresh = useCallback(async () => {
    await fetchPosts();
  }, [fetchPosts]);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    posts,
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

export const useSocialEngagementAnalytics = (): UseSocialEngagementAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<SocialEngagementAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await socialBufferService.getEngagementAnalytics();
      if (response.success) {
        setAnalytics(response.data as SocialEngagementAnalytics);
      } else {
        setError(response.error || 'Failed to fetch engagement analytics');
      }
    } catch (err) {
      setError('Failed to fetch engagement analytics');
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

export const useSocialReachAnalytics = (): UseSocialReachAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<SocialReachAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await socialBufferService.getReachAnalytics();
      if (response.success) {
        setAnalytics(response.data as SocialReachAnalytics);
      } else {
        setError(response.error || 'Failed to fetch reach analytics');
      }
    } catch (err) {
      setError('Failed to fetch reach analytics');
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

export const useSocialImpressionsAnalytics = (): UseSocialImpressionsAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<SocialImpressionsAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await socialBufferService.getImpressionsAnalytics();
      if (response.success) {
        setAnalytics(response.data as SocialImpressionsAnalytics);
      } else {
        setError(response.error || 'Failed to fetch impressions analytics');
      }
    } catch (err) {
      setError('Failed to fetch impressions analytics');
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
