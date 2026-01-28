/**
 * Hook orquestrador do módulo ADStool
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useADStoolStore } from './useADStoolStore';
import { useAdsAccounts } from './useAdsAccounts';
import { useAdsCampaigns } from './useAdsCampaigns';
import { useAdsCreatives } from './useAdsCreatives';
import { useAdsAnalytics } from './useAdsAnalytics';
import { AdsAccount, AdsCampaign, AdsCreative, AdsFilters } from '../types';

interface UseADStoolReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  
  // Dados principais
  accounts: AdsAccount[];
  campaigns: AdsCampaign[];
  creatives: AdsCreative[];
  analytics: any | null;
  
  // Ações principais
  loadAccounts: (filters?: AdsFilters) => Promise<void>;
  createAccount: (data: any) => Promise<AdsAccount>;
  updateAccount: (id: string, data: any) => Promise<AdsAccount>;
  deleteAccount: (id: string) => Promise<void>;
  
  // Hooks especializados
  accounts: ReturnType<typeof useAdsAccounts>;
  campaigns: ReturnType<typeof useAdsCampaigns>;
  creatives: ReturnType<typeof useAdsCreatives>;
  analytics: ReturnType<typeof useAdsAnalytics>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useADStool = (): UseADStoolReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();
  const store = useADStoolStore();
  const accounts = useAdsAccounts();
  const campaigns = useAdsCampaigns();
  const creatives = useAdsCreatives();
  const analytics = useAdsAnalytics();
  
  // Lógica de orquestração
  const loadAccounts = useCallback(async (filters?: AdsFilters) => {
    try {
      await accounts.loadAccounts(filters);
      showSuccess('Contas carregadas com sucesso!');
    } catch (error: any) {
      showError('Erro ao carregar contas', error.message);
    }
  }, [accounts, showSuccess, showError]);
  
  const createAccount = useCallback(async (data: any) => {
    try {
      const result = await accounts.createAccount(data);
      showSuccess('Conta criada com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao criar conta', error.message);
      throw error;
    }
  }, [accounts, showSuccess, showError]);
  
  const updateAccount = useCallback(async (id: string, data: any) => {
    try {
      const result = await accounts.updateAccount(id, data);
      showSuccess('Conta atualizada com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao atualizar conta', error.message);
      throw error;
    }
  }, [accounts, showSuccess, showError]);
  
  const deleteAccount = useCallback(async (id: string) => {
    try {
      await accounts.deleteAccount(id);
      showSuccess('Conta excluída com sucesso!');
    } catch (error: any) {
      showError('Erro ao excluir conta', error.message);
      throw error;
    }
  }, [accounts, showSuccess, showError]);
  
  // Inicialização
  useEffect(() => {
    loadAccounts();
    campaigns.loadCampaigns();
    creatives.loadCreatives();
    analytics.loadAnalytics();
  }, []);
  
  return {
    loading: store.loading || accounts.loading || campaigns.loading || creatives.loading || analytics.loading,
    error: store.error || accounts.error || campaigns.error || creatives.error || analytics.error,
    accounts: store.accounts,
    campaigns: store.campaigns,
    creatives: store.creatives,
    analytics: store.analytics,
    loadAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    accounts,
    campaigns,
    creatives,
    analytics,
    clearError: () => {
      store.clearError();
      accounts.clearError();
      campaigns.clearError();
      creatives.clearError();
      analytics.clearError();
    },
    refresh: loadAccounts
  };
};