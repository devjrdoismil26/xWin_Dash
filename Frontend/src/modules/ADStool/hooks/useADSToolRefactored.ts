import { useState, useEffect, useCallback } from 'react';
import { adsService } from '../services';

export const useADSToolRefactored = () => {
  const [campaigns, setCampaigns] = useState<unknown[]>([]);

  const [accounts, setAccounts] = useState<unknown[]>([]);

  const [metrics, setMetrics] = useState({
    total_campaigns: 0,
    active_campaigns: 0,
    total_spend: 0,
    total_conversions: 0,
  });

  const [analytics, setAnalytics] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<any>({});

  const fetchCampaigns = useCallback(async (customFilters?: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await adsService.campaigns.getCampaigns(customFilters || filters);

      if (response.success && (response as any).data) {
        setCampaigns(Array.isArray(response.data) ? (response as any).data : [response.data]);

      } catch (err: unknown) {
      setError(err.message);

    } finally {
      setLoading(false);

    } , [filters]);

  const getCampaign = useCallback(async (id: string) => {
    setLoading(true);

    try {
      const response = await adsService.campaigns.getCampaignById(id);

      return (response as any).success ? (response as any).data : null;
    } catch (err: unknown) {
      setError(err.message);

      return null;
    } finally {
      setLoading(false);

    } , []);

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await adsService.accounts.getAccounts();

      if (response.success && (response as any).data) {
        setAccounts(Array.isArray(response.data) ? (response as any).data : [response.data]);

      } catch (err: unknown) {
      console.error('Error fetching accounts:', err);

    } , []);

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await adsService.getDashboard();

      if (response.success && (response as any).data) {
        const data = (response as any).data as any;
        setMetrics({
          total_campaigns: (data as any).total_campaigns || 0,
          active_campaigns: (data as any).active_campaigns || 0,
          total_spend: (data as any).total_spend || 0,
          total_conversions: (data as any).total_conversions || 0,
        });

      } catch (err: unknown) {
      console.error('Error fetching metrics:', err);

    } , []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await adsService.analytics.getAnalyticsSummary();

      if (response.success) {
        setAnalytics(response.data);

      } catch (err: unknown) {
      console.error('Error fetching analytics:', err);

    } , []);

  const createCampaign = useCallback(async (data: unknown) => {
    try {
      const response = await adsService.campaigns.createCampaign(data);

      if (response.success) {
        await fetchCampaigns();

        await fetchMetrics();

      }
      return (response as any).success;
    } catch (err: unknown) {
      setError(err.message);

      return false;
    } , [fetchCampaigns, fetchMetrics]);

  const updateCampaign = useCallback(async (id: string, data: unknown) => {
    try {
      const response = await adsService.campaigns.updateCampaign(id, data);

      if (response.success) {
        await fetchCampaigns();

      }
      return (response as any).success;
    } catch (err: unknown) {
      setError(err.message);

      return false;
    } , [fetchCampaigns]);

  const deleteCampaign = useCallback(async (id: string) => {
    try {
      const response = await adsService.campaigns.deleteCampaign(id);

      if (response.success) {
        await fetchCampaigns();

        await fetchMetrics();

      }
      return (response as any).success;
    } catch (err: unknown) {
      setError(err.message);

      return false;
    } , [fetchCampaigns, fetchMetrics]);

  const toggleCampaignStatus = useCallback(async (id: string) => {
    try {
      const campaign = campaigns.find(c => c.id === id);

      if (!campaign) return false;

      const newStatus = campaign.status === 'active' ? 'paused' : 'active';
      return await updateCampaign(id, { status: newStatus });

    } catch (err: unknown) {
      setError(err.message);

      return false;
    } , [campaigns, updateCampaign]);

  const refreshCampaigns = useCallback(() => {
    fetchCampaigns();

    fetchMetrics();

  }, [fetchCampaigns, fetchMetrics]);

  useEffect(() => {
    fetchCampaigns();

    fetchAccounts();

    fetchMetrics();

  }, []);

  return {
    campaigns,
    accounts,
    metrics,
    analytics,
    loading,
    error,
    filters,
    setFilters,
    fetchCampaigns,
    getCampaign,
    fetchAccounts,
    fetchMetrics,
    fetchAnalytics,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    toggleCampaignStatus,
    refreshCampaigns,};
};
