/**
 * Hook especializado para campanhas de email do módulo EmailMarketing
 * Máximo: 200 linhas
 */
import { useCallback, useState, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { EmailCampaignService } from '../services/emailCampaignService';
import { EmailCampaign, EmailFilters } from '../types';

interface UseEmailCampaignsReturn {
  // Estado
  campaigns: EmailCampaign[];
  currentCampaign: EmailCampaign | null;
  loading: boolean;
  error: string | null;
  
  // Ações
  loadCampaigns: (filters?: EmailFilters) => Promise<void>;
  createCampaign: (data: Partial<EmailCampaign>) => Promise<EmailCampaign>;
  updateCampaign: (id: string, data: Partial<EmailCampaign>) => Promise<EmailCampaign>;
  deleteCampaign: (id: string) => Promise<void>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useEmailCampaigns = (): UseEmailCampaignsReturn => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<EmailCampaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAdvancedNotifications();
  
  const loadCampaigns = useCallback(async (filters?: EmailFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await EmailCampaignService.getCampaigns(filters);
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
  
  const createCampaign = useCallback(async (data: Partial<EmailCampaign>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await EmailCampaignService.createCampaign(data);
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
  
  const updateCampaign = useCallback(async (id: string, data: Partial<EmailCampaign>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await EmailCampaignService.updateCampaign(id, data);
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
      await EmailCampaignService.deleteCampaign(id);
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