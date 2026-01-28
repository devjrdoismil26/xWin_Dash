/**
 * Hook especializado para analytics e relatórios de anúncios
 * Responsável por todas as operações relacionadas a analytics
 */
import { create } from 'zustand';
import { adsAnalyticsService } from '../services';

interface AdsAnalyticsState {
  analytics: any;
  reports: any[];
  loading: boolean;
  error: string | null;
}

interface AdsAnalyticsActions {
  // Ações para analytics
  fetchAnalyticsSummary: () => Promise<any>;
  fetchAnalyticsOverview: () => Promise<any>;
  fetchCampaignAnalytics: (id: string | number) => Promise<any>;
  fetchAccountAnalytics: (id: string | number) => Promise<any>;
  fetchCreativeAnalytics: (id: string | number) => Promise<any>;
  
  // Ações para insights
  getAudienceInsights: (campaignId: string | number) => Promise<any>;
  getKeywordInsights: (campaignId: string | number) => Promise<any>;
  getPerformanceInsights: (entityId: string | number, entityType: string) => Promise<any>;
  
  // Ações para relatórios
  generateReport: (type: string, params?: any) => Promise<any>;
  getReportStatus: (reportId: string) => Promise<any>;
  downloadReport: (reportId: string) => Promise<any>;
  getAvailableReports: () => Promise<any>;
  
  // Ações para comparações
  compareCampaigns: (campaignIds: string[]) => Promise<any>;
  compareAccounts: (accountIds: string[]) => Promise<any>;
  compareTimePeriods: (entityId: string, periods: any[]) => Promise<any>;
  
  // Ações para exportação
  exportAnalytics: (type: string, format: string, params?: any) => Promise<any>;
  scheduleReport: (reportConfig: any) => Promise<any>;
  
  // Métodos utilitários
  getTotalSpend: () => number;
  getTotalImpressions: () => number;
  getTotalClicks: () => number;
  getTotalConversions: () => number;
  getAverageCTR: () => number;
  getAverageCPC: () => number;
  getAverageCPA: () => number;
  getROI: () => number;
  
  // Ações de UI
  clearError: () => void;
}

type AdsAnalyticsStore = AdsAnalyticsState & AdsAnalyticsActions;

const useAdsAnalytics = create<AdsAnalyticsStore>((set, get) => ({
  // Estado
  analytics: null,
  reports: [],
  loading: false,
  error: null,

  // Ações para analytics
  fetchAnalyticsSummary: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.getAnalyticsSummary();
      if (response.success) {
        set({ analytics: response.data, loading: false });
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

  fetchAnalyticsOverview: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.getAnalyticsOverview();
      if (response.success) {
        set({ analytics: response.data, loading: false });
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

  fetchCampaignAnalytics: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.getCampaignAnalytics(id);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchAccountAnalytics: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.getAccountAnalytics(id);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchCreativeAnalytics: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.getCreativeAnalytics(id);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para insights
  getAudienceInsights: async (campaignId: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.getAudienceInsights(campaignId);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getKeywordInsights: async (campaignId: string | number) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.getKeywordInsights(campaignId);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getPerformanceInsights: async (entityId: string | number, entityType: string) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.getPerformanceInsights(entityId, entityType);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para relatórios
  generateReport: async (type: string, params: any = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.generateReport(type, params);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getReportStatus: async (reportId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.getReportStatus(reportId);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  downloadReport: async (reportId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.downloadReport(reportId);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getAvailableReports: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.getAvailableReports();
      if (response.success) {
        set({ reports: response.data || [], loading: false });
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

  // Ações para comparações
  compareCampaigns: async (campaignIds: string[]) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.compareCampaigns(campaignIds);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  compareAccounts: async (accountIds: string[]) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.compareAccounts(accountIds);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  compareTimePeriods: async (entityId: string, periods: any[]) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.compareTimePeriods(entityId, periods);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para exportação
  exportAnalytics: async (type: string, format: string, params: any = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.exportAnalytics(type, format, params);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  scheduleReport: async (reportConfig: any) => {
    set({ loading: true, error: null });
    try {
      const response = await adsAnalyticsService.scheduleReport(reportConfig);
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Métodos utilitários
  getTotalSpend: () => {
    const { analytics } = get();
    return analytics?.total_spend || 0;
  },

  getTotalImpressions: () => {
    const { analytics } = get();
    return analytics?.total_impressions || 0;
  },

  getTotalClicks: () => {
    const { analytics } = get();
    return analytics?.total_clicks || 0;
  },

  getTotalConversions: () => {
    const { analytics } = get();
    return analytics?.total_conversions || 0;
  },

  getAverageCTR: () => {
    const { analytics } = get();
    return analytics?.average_ctr || 0;
  },

  getAverageCPC: () => {
    const { analytics } = get();
    return analytics?.average_cpc || 0;
  },

  getAverageCPA: () => {
    const { analytics } = get();
    return analytics?.average_cpa || 0;
  },

  getROI: () => {
    const { analytics } = get();
    return analytics?.roi || 0;
  },

  // Ações de UI
  clearError: () => set({ error: null }),
}));

export default useAdsAnalytics;
