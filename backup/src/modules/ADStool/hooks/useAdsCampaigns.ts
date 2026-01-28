/**
 * Hook especializado para gerenciamento de campanhas de anúncios
 * Responsável por todas as operações relacionadas a campanhas
 */
import { create } from 'zustand';
import { adsCampaignService } from '../services';
import { AdsCampaign } from '../types';

interface AdsCampaignsState {
  campaigns: AdsCampaign[];
  loading: boolean;
  error: string | null;
}

interface AdsCampaignsActions {
  // Ações CRUD para campanhas
  fetchCampaigns: (params?: any) => Promise<void>;
  createCampaign: (campaignData: Partial<AdsCampaign>) => Promise<any>;
  updateCampaign: (id: string | number, campaignData: Partial<AdsCampaign>) => Promise<any>;
  deleteCampaign: (id: string | number) => Promise<void>;
  
  // Ações específicas para campanhas
  pauseCampaign: (id: string | number) => Promise<any>;
  resumeCampaign: (id: string | number) => Promise<any>;
  updateCampaignBudget: (id: string | number, dailyBudget: number) => Promise<any>;
  syncCampaign: (id: string | number) => Promise<any>;
  duplicateCampaign: (id: string | number, newName?: string) => Promise<any>;
  
  // Ações para templates
  getCampaignTemplates: () => Promise<any>;
  createCampaignFromTemplate: (templateId: string, campaignData: any) => Promise<any>;
  
  // Ações para otimização
  getOptimizationSuggestions: (campaignId: string | number) => Promise<any>;
  applyOptimization: (campaignId: string | number, suggestions: any) => Promise<any>;
  
  // Métodos utilitários
  getActiveCampaigns: () => AdsCampaign[];
  getPausedCampaigns: () => AdsCampaign[];
  getCampaignById: (id: string | number) => AdsCampaign | undefined;
  getCampaignsByAccount: (accountId: string | number) => AdsCampaign[];
  getCampaignsByPlatform: (platform: string) => AdsCampaign[];
  
  // Métricas
  getTotalSpend: () => number;
  getTotalImpressions: () => number;
  getTotalClicks: () => number;
  getTotalConversions: () => number;
  getAverageCTR: () => number;
  getAverageCPC: () => number;
  
  // Ações de UI
  clearError: () => void;
}

type AdsCampaignsStore = AdsCampaignsState & AdsCampaignsActions;

const useAdsCampaigns = create<AdsCampaignsStore>((set, get) => ({
  // Estado
  campaigns: [],
  loading: false,
  error: null,

  // Ações CRUD para campanhas
  fetchCampaigns: async (params: any = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.getCampaigns(params);
      if (response.success) {
        set({ campaigns: response.data || [], loading: false });
      } else {
        set({ error: response.error, loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createCampaign: async (campaignData: Partial<AdsCampaign>) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.createCampaign(campaignData);
      if (response.success) {
        set(state => ({ 
          campaigns: [...state.campaigns, response.data], 
          loading: false 
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateCampaign: async (id: string | number, campaignData: Partial<AdsCampaign>) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.updateCampaign(id, campaignData);
      if (response.success) {
        set(state => ({
          campaigns: state.campaigns.map(campaign => 
            campaign.id === id ? response.data : campaign
          ),
          loading: false
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteCampaign: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.deleteCampaign(id);
      if (response.success) {
        set(state => ({
          campaigns: state.campaigns.filter(campaign => campaign.id !== id),
          loading: false
        }));
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações específicas para campanhas
  pauseCampaign: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.pauseCampaign(id);
      if (response.success) {
        set(state => ({
          campaigns: state.campaigns.map(campaign => 
            campaign.id === id ? { ...campaign, status: 'paused' } : campaign
          ),
          loading: false
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  resumeCampaign: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.resumeCampaign(id);
      if (response.success) {
        set(state => ({
          campaigns: state.campaigns.map(campaign => 
            campaign.id === id ? { ...campaign, status: 'active' } : campaign
          ),
          loading: false
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateCampaignBudget: async (id: string | number, dailyBudget: number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.updateCampaignBudget(id, dailyBudget);
      if (response.success) {
        set(state => ({
          campaigns: state.campaigns.map(campaign => 
            campaign.id === id ? { ...campaign, daily_budget: dailyBudget } : campaign
          ),
          loading: false
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  syncCampaign: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.syncCampaign(id);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  duplicateCampaign: async (id: string | number, newName?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.duplicateCampaign(id, newName);
      if (response.success) {
        set(state => ({ 
          campaigns: [...state.campaigns, response.data], 
          loading: false 
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para templates
  getCampaignTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.getTemplates();
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  createCampaignFromTemplate: async (templateId: string, campaignData: any) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.createFromTemplate(templateId, campaignData);
      if (response.success) {
        set(state => ({ 
          campaigns: [...state.campaigns, response.data], 
          loading: false 
        }));
        return response;
      } else {
        set({ error: response.error, loading: false });
        throw new Error(response.error);
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para otimização
  getOptimizationSuggestions: async (campaignId: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.getOptimizationSuggestions(campaignId);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  applyOptimization: async (campaignId: string | number, suggestions: any) => {
    set({ loading: true, error: null });
    try {
      const response = await adsCampaignService.applyOptimization(campaignId, suggestions);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Métodos utilitários
  getActiveCampaigns: () => {
    const { campaigns } = get();
    return campaigns.filter(campaign => campaign.status === 'active');
  },

  getPausedCampaigns: () => {
    const { campaigns } = get();
    return campaigns.filter(campaign => campaign.status === 'paused');
  },

  getCampaignById: (id: string | number) => {
    const { campaigns } = get();
    return campaigns.find(campaign => campaign.id === id);
  },

  getCampaignsByAccount: (accountId: string | number) => {
    const { campaigns } = get();
    return campaigns.filter(campaign => campaign.account_id === accountId);
  },

  getCampaignsByPlatform: (platform: string) => {
    const { campaigns } = get();
    return campaigns.filter(campaign => campaign.platform === platform);
  },

  // Métricas
  getTotalSpend: () => {
    const { campaigns } = get();
    return campaigns.reduce((total, campaign) => total + (campaign.total_spend || 0), 0);
  },

  getTotalImpressions: () => {
    const { campaigns } = get();
    return campaigns.reduce((total, campaign) => total + (campaign.impressions || 0), 0);
  },

  getTotalClicks: () => {
    const { campaigns } = get();
    return campaigns.reduce((total, campaign) => total + (campaign.clicks || 0), 0);
  },

  getTotalConversions: () => {
    const { campaigns } = get();
    return campaigns.reduce((total, campaign) => total + (campaign.conversions || 0), 0);
  },

  getAverageCTR: () => {
    const { campaigns } = get();
    if (campaigns.length === 0) return 0;
    const totalCTR = campaigns.reduce((total, campaign) => total + (campaign.ctr || 0), 0);
    return totalCTR / campaigns.length;
  },

  getAverageCPC: () => {
    const { campaigns } = get();
    if (campaigns.length === 0) return 0;
    const totalCPC = campaigns.reduce((total, campaign) => total + (campaign.cpc || 0), 0);
    return totalCPC / campaigns.length;
  },

  // Ações de UI
  clearError: () => set({ error: null }),
}));

export default useAdsCampaigns;
