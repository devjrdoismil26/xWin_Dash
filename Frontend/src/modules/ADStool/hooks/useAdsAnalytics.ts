/**
 * Hook especializado para analytics e relatórios de anúncios
 * @module modules/ADStool/hooks/useAdsAnalytics
 * @description
 * Hook Zustand especializado para analytics e relatórios de anúncios,
 * fornecendo estado global e ações para buscar analytics de campanhas, contas e criativos,
 * insights de audiência, palavras-chave e performance, geração e download de relatórios,
 * comparações entre campanhas/contas/períodos, exportação de analytics,
 * agendamento de relatórios e métodos utilitários para cálculos de métricas.
 * @since 1.0.0
 */
import { create } from 'zustand';
import { adsAnalyticsService } from '../services';
import { getErrorMessage } from '@/utils/errorHelpers';

interface AdsAnalyticsState {
  analytics: Record<string, any> | null;
  reports: Record<string, any>[];
  loading: boolean;
  error: string | null; }

interface AdsAnalyticsActions {
  // Ações para analytics
  fetchAnalyticsSummary: () => Promise<{ success: boolean;
  data?: Record<string, any>;
  error?: string;
}>;
  fetchAnalyticsOverview: () => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  fetchCampaignAnalytics: (id: string | number) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  fetchAccountAnalytics: (id: string | number) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  fetchCreativeAnalytics: (id: string | number) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  
  // Ações para insights
  getAudienceInsights: (campaignId: string | number) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  getKeywordInsights: (campaignId: string | number) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  getPerformanceInsights: (entityId: string | number, entityType: string) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  
  // Ações para relatórios
  generateReport: (type: string, params?: Record<string, any>) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  getReportStatus: (reportId: string) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  downloadReport: (reportId: string) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  getAvailableReports: () => Promise<{ success: boolean; data?: Record<string, any>[]; error?: string }>;
  
  // Ações para comparações
  compareCampaigns: (campaignIds: string[]) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  compareAccounts: (accountIds: string[]) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  compareTimePeriods: (entityId: string, periods: Record<string, any>[]) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  
  // Ações para exportação
  exportAnalytics: (type: string, format: string, params?: Record<string, any>) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  scheduleReport: (reportConfig: Record<string, any>) => Promise<{ success: boolean; data?: Record<string, any>; error?: string }>;
  
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
  clearError??: (e: any) => void;
}

type AdsAnalyticsStore = AdsAnalyticsState & AdsAnalyticsActions;

const useAdsAnalytics = create<AdsAnalyticsStore>((set: unknown, get: unknown) => ({
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
        set({ analytics: (response as any).data, loading: false });

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  fetchAnalyticsOverview: async () => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.getAnalyticsOverview();

      if (response.success) {
        set({ analytics: (response as any).data, loading: false });

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  fetchCampaignAnalytics: async (id: string | number) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.getCampaignAnalytics(id);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  fetchAccountAnalytics: async (id: string | number) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.getAccountAnalytics(id);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  fetchCreativeAnalytics: async (id: string | number) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.getCreativeAnalytics(id);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Ações para insights
  getAudienceInsights: async (campaignId: string | number) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.getAudienceInsights(campaignId);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  getKeywordInsights: async (campaignId: string | number) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.getKeywordInsights(campaignId);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  getPerformanceInsights: async (entityId: string | number, entityType: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.getPerformanceInsights(entityId, entityType);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Ações para relatórios
  generateReport: async (type: string, params: Record<string, any> = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.generateReport(type, params);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  getReportStatus: async (reportId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.getReportStatus(reportId);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  downloadReport: async (reportId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.downloadReport(reportId);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  getAvailableReports: async () => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.getAvailableReports();

      if (response.success) {
        set({ reports: (response as any).data || [], loading: false });

        return response;
      } else {
        set({ error: (response as any).error, loading: false });

        throw new Error(response.error);

      } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Ações para comparações
  compareCampaigns: async (campaignIds: string[]) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.compareCampaigns(campaignIds);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  compareAccounts: async (accountIds: string[]) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.compareAccounts(accountIds);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  compareTimePeriods: async (entityId: string, periods: Record<string, any>[]) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.compareTimePeriods(entityId, periods);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  // Ações para exportação
  exportAnalytics: async (type: string, format: string, params: Record<string, any> = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.exportAnalytics(type, format, params);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

  scheduleReport: async (reportConfig: Record<string, any>) => {
    set({ loading: true, error: null });

    try {
      const response = await adsAnalyticsService.scheduleReport(reportConfig);

      set({ loading: false });

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      set({ error: errorMessage, loading: false });

      throw error;
    } ,

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
