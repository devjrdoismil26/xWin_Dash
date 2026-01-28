/**
 * Hook especializado para campanhas de anúncios do módulo ADStool
 * Máximo: 200 linhas
 */
import { useCallback, useState, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { AdsCampaignService } from '../services/adsCampaignService';
import { AdsCampaign, AdsFilters } from '../types';

interface UseAdsCampaignsReturn {
  // Estado
  campaigns: AdsCampaign[];
  currentCampaign: AdsCampaign | null;
  loading: boolean;
  error: string | null;
  
  // Ações
  loadCampaigns: (filters?: AdsFilters) => Promise<void>;
  createCampaign: (data: Partial<AdsCampaign>) => Promise<AdsCampaign>;
  updateCampaign: (id: string, data: Partial<AdsCampaign>) => Promise<AdsCampaign>;
  deleteCampaign: (id: string) => Promise<void>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useAdsCampaigns = (): UseAdsCampaignsReturn => {
  const [campaigns, setCampaigns] = useState<AdsCampaign[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<AdsCampaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAdvancedNotifications();
  
  const loadCampaigns = useCallback(async (filters?: AdsFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AdsCampaignService.getCampaigns(filters);
      setCampaigns(result.data || []);
      showSuccess('Campanhas carregadas com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar campanhas';
      setError(errorMessage);
      showError('Erro ao carregar campanhas', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const createCampaign = useCallback(async (data: Partial<AdsCampaign>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AdsCampaignService.createCampaign(data);
      setCampaigns(prev => [result.data, ...prev]);
      showSuccess('Campanha criada com sucesso!');
      return result.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar campanha';
      setError(errorMessage);
      showError('Erro ao criar campanha', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const updateCampaign = useCallback(async (id: string, data: Partial<AdsCampaign>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await AdsCampaignService.updateCampaign(id, data);
      setCampaigns(prev => prev.map(campaign => campaign.id === id ? result.data : campaign));
      showSuccess('Campanha atualizada com sucesso!');
      return result.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar campanha';
      setError(errorMessage);
      showError('Erro ao atualizar campanha', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const deleteCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await AdsCampaignService.deleteCampaign(id);
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      showSuccess('Campanha excluída com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir campanha';
      setError(errorMessage);
      showError('Erro ao excluir campanha', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  return {
    campaigns,
    currentCampaign,
    loading,
    error,
    loadCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    clearError: () => setError(null),
    refresh: loadCampaigns
  };
};