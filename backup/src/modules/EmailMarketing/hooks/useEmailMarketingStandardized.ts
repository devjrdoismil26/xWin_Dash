/**
 * Hook orquestrador do módulo EmailMarketing
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useEmailMarketingStore } from './useEmailMarketingStore';
import { useEmailCampaigns } from './useEmailCampaigns';
import { useEmailTemplates } from './useEmailTemplates';
import { useEmailSegments } from './useEmailSegments';
import { EmailCampaign, EmailTemplate, EmailSegment, EmailFilters } from '../types';

interface UseEmailMarketingReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  
  // Dados principais
  campaigns: EmailCampaign[];
  templates: EmailTemplate[];
  segments: EmailSegment[];
  
  // Ações principais
  loadCampaigns: (filters?: EmailFilters) => Promise<void>;
  createCampaign: (data: any) => Promise<EmailCampaign>;
  updateCampaign: (id: string, data: any) => Promise<EmailCampaign>;
  deleteCampaign: (id: string) => Promise<void>;
  
  // Hooks especializados
  campaigns: ReturnType<typeof useEmailCampaigns>;
  templates: ReturnType<typeof useEmailTemplates>;
  segments: ReturnType<typeof useEmailSegments>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useEmailMarketing = (): UseEmailMarketingReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();
  const store = useEmailMarketingStore();
  const campaigns = useEmailCampaigns();
  const templates = useEmailTemplates();
  const segments = useEmailSegments();
  
  // Lógica de orquestração
  const loadCampaigns = useCallback(async (filters?: EmailFilters) => {
    try {
      await campaigns.loadCampaigns(filters);
      showSuccess('Campanhas carregadas com sucesso!');
    } catch (error: any) {
      showError('Erro ao carregar campanhas', error.message);
    }
  }, [campaigns, showSuccess, showError]);
  
  const createCampaign = useCallback(async (data: any) => {
    try {
      const result = await campaigns.createCampaign(data);
      showSuccess('Campanha criada com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao criar campanha', error.message);
      throw error;
    }
  }, [campaigns, showSuccess, showError]);
  
  const updateCampaign = useCallback(async (id: string, data: any) => {
    try {
      const result = await campaigns.updateCampaign(id, data);
      showSuccess('Campanha atualizada com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao atualizar campanha', error.message);
      throw error;
    }
  }, [campaigns, showSuccess, showError]);
  
  const deleteCampaign = useCallback(async (id: string) => {
    try {
      await campaigns.deleteCampaign(id);
      showSuccess('Campanha excluída com sucesso!');
    } catch (error: any) {
      showError('Erro ao excluir campanha', error.message);
      throw error;
    }
  }, [campaigns, showSuccess, showError]);
  
  // Inicialização
  useEffect(() => {
    loadCampaigns();
    templates.loadTemplates();
    segments.loadSegments();
  }, []);
  
  return {
    loading: store.loading || campaigns.loading || templates.loading || segments.loading,
    error: store.error || campaigns.error || templates.error || segments.error,
    campaigns: store.campaigns,
    templates: store.templates,
    segments: store.segments,
    loadCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    campaigns,
    templates,
    segments,
    clearError: () => {
      store.clearError();
      campaigns.clearError();
      templates.clearError();
      segments.clearError();
    },
    refresh: loadCampaigns
  };
};