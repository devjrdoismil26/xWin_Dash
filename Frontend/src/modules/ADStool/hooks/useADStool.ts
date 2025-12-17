/**
 * Hook orquestrador do módulo ADStool
 * @module modules/ADStool/hooks/useADStoolStandardized
 * @description
 * Hook que coordena todos os hooks especializados do módulo ADStool em uma interface unificada,
 * fornecendo estado consolidado, dados principais, ações principais e acesso aos hooks especializados.
 * Inclui integração com notificações avançadas e store do ADStool.
 * @since 1.0.0
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useADStoolStore } from './useADStoolStore';
import { useAdsAccounts } from './useAdsAccounts';
import { useAdsCampaigns } from './useAdsCampaigns';
import useAdsCreatives from './useAdsCreatives';
import useAdsAnalytics from './useAdsAnalytics';
import { AdsAccount, AdsCampaign, AdsCreative, AdsFilters } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

interface UseADStoolReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  // Dados principais
  accountsList: AdsAccount[];
  campaignsList: AdsCampaign[];
  creativesList: AdsCreative[];
  analyticsData: Record<string, any> | null;
  // Ações principais
  loadAccounts: (filters?: AdsFilters) => Promise<void>;
  createAccount: (data: Record<string, any>) => Promise<AdsAccount>;
  updateAccount: (id: string, data: Record<string, any>) => Promise<AdsAccount>;
  deleteAccount: (id: string) => Promise<void>;
  // Hooks especializados
  accounts: ReturnType<typeof useAdsAccounts>;
  campaigns: ReturnType<typeof useAdsCampaigns>;
  creatives: ReturnType<typeof useAdsCreatives>;
  analytics: ReturnType<typeof useAdsAnalytics>;
  // Utilitários
  clearError??: (e: any) => void;
  refresh: () => Promise<void>; }

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

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao carregar contas';
      showError('Erro ao carregar contas', errorMessage);

    } , [accounts, showSuccess, showError]);

  const createAccount = useCallback(async (data: Record<string, any>) => {
    try {
      const result = await accounts.createAccount(data);

      showSuccess('Conta criada com sucesso!');

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao criar conta';
      showError('Erro ao criar conta', errorMessage);

      throw error;
    } , [accounts, showSuccess, showError]);

  const updateAccount = useCallback(async (id: string, data: Record<string, any>) => {
    try {
      const result = await accounts.updateAccount(id, data);

      showSuccess('Conta atualizada com sucesso!');

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao atualizar conta';
      showError('Erro ao atualizar conta', errorMessage);

      throw error;
    } , [accounts, showSuccess, showError]);

  const deleteAccount = useCallback(async (id: string) => {
    try {
      await accounts.deleteAccount(id);

      showSuccess('Conta excluída com sucesso!');

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro ao excluir conta';
      showError('Erro ao excluir conta', errorMessage);

      throw error;
    } , [accounts, showSuccess, showError]);

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
    refresh: loadAccounts};
};

export default useADStool;