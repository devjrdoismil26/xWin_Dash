/**
 * Hook principal orquestrador do ADStool
 * Combina todos os hooks especializados em uma interface unificada
 */
import { useCallback } from 'react';
import useAdsAccounts from './useAdsAccounts';
import useAdsCampaigns from './useAdsCampaigns';
import useAdsCreatives from './useAdsCreatives';
import useAdsAnalytics from './useAdsAnalytics';
import useAdsTemplates from './useAdsTemplates';
import { adsService } from '../services';

interface ADStoolHook {
  // Estados dos hooks especializados
  accounts: {
    accounts: any[];
    loading: boolean;
    error: string | null;
  };
  campaigns: {
    campaigns: any[];
    loading: boolean;
    error: string | null;
  };
  creatives: {
    creatives: any[];
    loading: boolean;
    error: string | null;
  };
  analytics: {
    analytics: any;
    loading: boolean;
    error: string | null;
  };
  templates: {
    templates: any[];
    loading: boolean;
    error: string | null;
  };

  // Ações dos hooks especializados
  accountsActions: any;
  campaignsActions: any;
  creativesActions: any;
  analyticsActions: any;
  templatesActions: any;

  // Métodos utilitários unificados
  getTotalSpend: () => number;
  getTotalImpressions: () => number;
  getTotalClicks: () => number;
  getTotalConversions: () => number;
  getAverageCTR: () => number;
  getAverageCPC: () => number;
  getConnectedAccounts: () => any[];
  getActiveCampaigns: () => any[];
  getPausedCampaigns: () => any[];

  // Formatação
  formatCurrency: (value: number, currency?: string) => string;
  formatNumber: (value: number) => string;
  formatPercentage: (value: number, decimals?: number) => string;

  // Ações de teste de integração
  testConnection: () => Promise<any>;
  testCampaignCreation: () => Promise<any>;
  testAnalyticsSummary: () => Promise<any>;
  testApiConfiguration: () => Promise<any>;

  // Ações para pesquisa de palavras-chave
  getKeywordSuggestions: (seedKeywords: string[], options?: any) => Promise<any>;

  // Estado de loading geral
  isLoading: boolean;
  hasError: boolean;
  clearAllErrors: () => void;
}

const useADStool = (): ADStoolHook => {
  // Hooks especializados
  const accountsHook = useAdsAccounts();
  const campaignsHook = useAdsCampaigns();
  const creativesHook = useAdsCreatives();
  const analyticsHook = useAdsAnalytics();
  const templatesHook = useAdsTemplates();

  // Estado de loading geral
  const isLoading = 
    accountsHook.loading || 
    campaignsHook.loading || 
    creativesHook.loading || 
    analyticsHook.loading || 
    templatesHook.loading;

  // Estado de erro geral
  const hasError = 
    !!accountsHook.error || 
    !!campaignsHook.error || 
    !!creativesHook.error || 
    !!analyticsHook.error || 
    !!templatesHook.error;

  // Métodos utilitários unificados
  const getTotalSpend = useCallback(() => {
    return campaignsHook.getTotalSpend() + analyticsHook.getTotalSpend();
  }, [campaignsHook, analyticsHook]);

  const getTotalImpressions = useCallback(() => {
    return campaignsHook.getTotalImpressions() + analyticsHook.getTotalImpressions();
  }, [campaignsHook, analyticsHook]);

  const getTotalClicks = useCallback(() => {
    return campaignsHook.getTotalClicks() + analyticsHook.getTotalClicks();
  }, [campaignsHook, analyticsHook]);

  const getTotalConversions = useCallback(() => {
    return campaignsHook.getTotalConversions() + analyticsHook.getTotalConversions();
  }, [campaignsHook, analyticsHook]);

  const getAverageCTR = useCallback(() => {
    const campaignCTR = campaignsHook.getAverageCTR();
    const analyticsCTR = analyticsHook.getAverageCTR();
    return (campaignCTR + analyticsCTR) / 2;
  }, [campaignsHook, analyticsHook]);

  const getAverageCPC = useCallback(() => {
    return campaignsHook.getAverageCPC();
  }, [campaignsHook]);

  const getConnectedAccounts = useCallback(() => {
    return accountsHook.getConnectedAccounts();
  }, [accountsHook]);

  const getActiveCampaigns = useCallback(() => {
    return campaignsHook.getActiveCampaigns();
  }, [campaignsHook]);

  const getPausedCampaigns = useCallback(() => {
    return campaignsHook.getPausedCampaigns();
  }, [campaignsHook]);

  // Formatação
  const formatCurrency = useCallback((value: number, currency: string = 'BRL') => {
    return adsService.formatCurrency(value, currency);
  }, []);

  const formatNumber = useCallback((value: number) => {
    return adsService.formatNumber(value);
  }, []);

  const formatPercentage = useCallback((value: number, decimals: number = 2) => {
    return adsService.formatPercentage(value, decimals);
  }, []);

  // Ações de teste de integração
  const testConnection = useCallback(async () => {
    try {
      const result = await adsService.testConnection();
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const testCampaignCreation = useCallback(async () => {
    try {
      const result = await adsService.testCampaignCreation();
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const testAnalyticsSummary = useCallback(async () => {
    try {
      const result = await adsService.testAnalyticsSummary();
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const testApiConfiguration = useCallback(async () => {
    try {
      const result = await adsService.testApiConfiguration();
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  // Ações para pesquisa de palavras-chave
  const getKeywordSuggestions = useCallback(async (seedKeywords: string[], options: any = {}) => {
    try {
      const result = await adsService.getKeywordSuggestions(seedKeywords, options);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  // Limpar todos os erros
  const clearAllErrors = useCallback(() => {
    accountsHook.clearError();
    campaignsHook.clearError();
    creativesHook.clearError();
    analyticsHook.clearError();
    templatesHook.clearError();
  }, [accountsHook, campaignsHook, creativesHook, analyticsHook, templatesHook]);

  return {
    // Estados dos hooks especializados
    accounts: {
      accounts: accountsHook.accounts,
      loading: accountsHook.loading,
      error: accountsHook.error,
    },
    campaigns: {
      campaigns: campaignsHook.campaigns,
      loading: campaignsHook.loading,
      error: campaignsHook.error,
    },
    creatives: {
      creatives: creativesHook.creatives,
      loading: creativesHook.loading,
      error: creativesHook.error,
    },
    analytics: {
      analytics: analyticsHook.analytics,
      loading: analyticsHook.loading,
      error: analyticsHook.error,
    },
    templates: {
      templates: templatesHook.templates,
      loading: templatesHook.loading,
      error: templatesHook.error,
    },

    // Ações dos hooks especializados
    accountsActions: accountsHook,
    campaignsActions: campaignsHook,
    creativesActions: creativesHook,
    analyticsActions: analyticsHook,
    templatesActions: templatesHook,

    // Métodos utilitários unificados
    getTotalSpend,
    getTotalImpressions,
    getTotalClicks,
    getTotalConversions,
    getAverageCTR,
    getAverageCPC,
    getConnectedAccounts,
    getActiveCampaigns,
    getPausedCampaigns,

    // Formatação
    formatCurrency,
    formatNumber,
    formatPercentage,

    // Ações de teste de integração
    testConnection,
    testCampaignCreation,
    testAnalyticsSummary,
    testApiConfiguration,

    // Ações para pesquisa de palavras-chave
    getKeywordSuggestions,

    // Estado geral
    isLoading,
    hasError,
    clearAllErrors,
  };
};

export default useADStool;
