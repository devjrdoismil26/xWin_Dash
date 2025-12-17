/**
 * Hook para o módulo EmailCampaigns
 * Gerencia campanhas de email
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { EmailCampaign, CampaignFilters, CampaignResponse, CampaignAnalytics, UseEmailCampaignsReturn } from '../types';

export const useEmailCampaigns = (): UseEmailCampaignsReturn => {
  // Estado principal
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Função para buscar campanhas
  const fetchCampaigns = useCallback(async (filters?: CampaignFilters) => {
    setLoading(true);

    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));

          } );

      }

      const result = await apiClient.get<CampaignResponse>(`/api/v1/email-campaigns`, { params: Object.fromEntries(queryParams) });

      if (result.success && result.data) {
        setCampaigns(Array.isArray(result.data) ? result.data : [result.data]);

      } else {
        throw new Error(result.error || 'Failed to fetch campaigns');

      } catch (err: unknown) {
      setError(getErrorMessage(err));

      console.error('Error fetching campaigns:', err);

    } finally {
      setLoading(false);

    } , []);

  // Função para criar campanha
  const createCampaign = useCallback(async (campaignData: Partial<EmailCampaign>): Promise<CampaignResponse> => {
    try {
      const result = await apiClient.post<CampaignResponse>('/api/v1/email-campaigns', campaignData);

      if (result.success) {
        await fetchCampaigns();

      }
      
      return result;
    } catch (err: unknown) {
      console.error('Error creating campaign:', err);

      return {
        success: false,
        error: getErrorMessage(err)};

    } , [fetchCampaigns]);

  // Função para atualizar campanha
  const updateCampaign = useCallback(async (id: string, campaignData: Partial<EmailCampaign>): Promise<CampaignResponse> => {
    try {
      const result = await apiClient.put<CampaignResponse>(`/api/v1/email-campaigns/${id}`, campaignData);

      if (result.success) {
        await fetchCampaigns();

      }
      
      return result;
    } catch (err: unknown) {
      console.error('Error updating campaign:', err);

      return {
        success: false,
        error: getErrorMessage(err)};

    } , [fetchCampaigns]);

  // Função para deletar campanha
  const deleteCampaign = useCallback(async (id: string): Promise<CampaignResponse> => {
    try {
      const result = await apiClient.delete<CampaignResponse>(`/api/v1/email-campaigns/${id}`);

      if (result.success) {
        await fetchCampaigns();

      }
      
      return result;
    } catch (err: unknown) {
      console.error('Error deleting campaign:', err);

      return {
        success: false,
        error: getErrorMessage(err)};

    } , [fetchCampaigns]);

  // Função para duplicar campanha
  const duplicateCampaign = useCallback(async (id: string): Promise<CampaignResponse> => {
    try {
      const result = await apiClient.post<CampaignResponse>(`/api/v1/email-campaigns/${id}/duplicate`);

      if (result.success) {
        await fetchCampaigns();

      }
      
      return result;
    } catch (err: unknown) {
      console.error('Error duplicating campaign:', err);

      return {
        success: false,
        error: getErrorMessage(err)};

    } , [fetchCampaigns]);

  // Função para enviar campanha
  const sendCampaign = useCallback(async (id: string): Promise<CampaignResponse> => {
    try {
      const result = await apiClient.post<CampaignResponse>(`/api/v1/email-campaigns/${id}/send`);

      if (result.success) {
        await fetchCampaigns();

      }
      
      return result;
    } catch (err: unknown) {
      console.error('Error sending campaign:', err);

      return {
        success: false,
        error: getErrorMessage(err)};

    } , [fetchCampaigns]);

  // Função para pausar campanha
  const pauseCampaign = useCallback(async (id: string): Promise<CampaignResponse> => {
    try {
      const result = await apiClient.post<CampaignResponse>(`/api/v1/email-campaigns/${id}/pause`);

      if (result.success) {
        await fetchCampaigns();

      }
      
      return result;
    } catch (err: unknown) {
      console.error('Error pausing campaign:', err);

      return {
        success: false,
        error: getErrorMessage(err)};

    } , [fetchCampaigns]);

  // Função para retomar campanha
  const resumeCampaign = useCallback(async (id: string): Promise<CampaignResponse> => {
    try {
      const result = await apiClient.post<CampaignResponse>(`/api/v1/email-campaigns/${id}/resume`);

      if (result.success) {
        await fetchCampaigns();

      }
      
      return result;
    } catch (err: unknown) {
      console.error('Error resuming campaign:', err);

      return {
        success: false,
        error: getErrorMessage(err)};

    } , [fetchCampaigns]);

  // Função para obter analytics da campanha
  const getCampaignAnalytics = useCallback(async (id: string): Promise<CampaignAnalytics> => {
    try {
      const result = await apiClient.get<CampaignAnalytics>(`/api/v1/email-campaigns/${id}/analytics`);

      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch campaign analytics');

      } catch (err: unknown) {
      console.error('Error fetching campaign analytics:', err);

      throw err;
    } , []);

  // Função para obter campanha por ID
  const getCampaignById = useCallback((id: string): EmailCampaign | undefined => {
    return campaigns.find(campaign => campaign.id === id);

  }, [campaigns]);

  // Função para obter campanhas por status
  const getCampaignsByStatus = useCallback((status: string): EmailCampaign[] => {
    return campaigns.filter(campaign => campaign.status === status);

  }, [campaigns]);

  // Função para obter campanhas por tipo
  const getCampaignsByType = useCallback((type: string): EmailCampaign[] => {
    return campaigns.filter(campaign => campaign.type === type);

  }, [campaigns]);

  // Função para formatar métricas da campanha
  const formatCampaignMetrics = useCallback((metrics: CampaignMetrics) => {
    return {
      sent: new Intl.NumberFormat('pt-BR').format(metrics.sent || 0),
      delivered: new Intl.NumberFormat('pt-BR').format(metrics.delivered || 0),
      opened: new Intl.NumberFormat('pt-BR').format(metrics.opened || 0),
      clicked: new Intl.NumberFormat('pt-BR').format(metrics.clicked || 0),
      open_rate: `${(metrics.open_rate || 0).toFixed(1)}%`,
      click_rate: `${(metrics.click_rate || 0).toFixed(1)}%`,
      conversion_rate: `${(metrics.conversion_rate || 0).toFixed(1)}%`,
      revenue: new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(metrics.revenue || 0)};

  }, []);

  // Função para calcular ROI da campanha
  const calculateCampaignROI = useCallback((metrics: CampaignMetrics): number => {
    if (!metrics.revenue || !metrics.sent) return 0;
    return (metrics.revenue / metrics.sent) * 100;
  }, []);

  // Carregar campanhas iniciais
  useEffect(() => {
    fetchCampaigns();

  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    duplicateCampaign,
    sendCampaign,
    pauseCampaign,
    resumeCampaign,
    getCampaignAnalytics,
    getCampaignById,
    getCampaignsByStatus,
    getCampaignsByType,
    formatCampaignMetrics,
    calculateCampaignROI};
};
