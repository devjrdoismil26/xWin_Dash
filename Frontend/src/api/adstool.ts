import apiClient from "@/services/http/apiClient";

export interface AdAccount {
  id: string;
  user_id: string;
  platform: string;
  account_name: string;
  account_id: string;
  currency: string;
  timezone: string;
  status: string;
  last_sync?: string; }

export interface AdCampaign {
  id: string;
  ad_account_id: string;
  campaign_name: string;
  objective: string;
  budget: number;
  budget_type: string;
  start_date: string;
  end_date?: string;
  status: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  spend?: number;
  revenue?: number; }

export interface CampaignPerformance {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roi: number; }

export interface CampaignOptimization {
  metrics: CampaignPerformance;
  recommendations: string[]; }

export const adsToolApi = {
  // Accounts
  getAccounts: () => apiClient.get<AdAccount[]>("/adstool/accounts"),
  getAccount: (id: string) =>
    apiClient.get<AdAccount>(`/adstool/accounts/${id}`),
  createAccount: (data: Partial<AdAccount>) =>
    apiClient.post<AdAccount>("/adstool/accounts", data),
  updateAccount: (id: string, data: Partial<AdAccount>) =>
    apiClient.put<{ success: boolean }>(`/adstool/accounts/${id}`, data),
  deleteAccount: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/adstool/accounts/${id}`),
  syncAccount: (id: string) =>
    apiClient.post<{ success: boolean; message: string; synced_at: string }>(
      `/adstool/accounts/${id}/sync`,
      {},
    ),

  // Campaigns
  getCampaigns: (accountId?: string) =>
    apiClient.get<AdCampaign[]>("/adstool/campaigns", {
      params: { account_id: accountId },
    }),
  getCampaign: (id: string) =>
    apiClient.get<AdCampaign>(`/adstool/campaigns/${id}`),
  createCampaign: (data: Partial<AdCampaign>) =>
    apiClient.post<AdCampaign>("/adstool/campaigns", data),
  updateCampaign: (id: string, data: Partial<AdCampaign>) =>
    apiClient.put<{ success: boolean }>(`/adstool/campaigns/${id}`, data),
  deleteCampaign: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/adstool/campaigns/${id}`),
  pauseCampaign: (id: string) =>
    apiClient.post<{ success: boolean }>(`/adstool/campaigns/${id}/pause`, {}),
  resumeCampaign: (id: string) =>
    apiClient.post<{ success: boolean }>(`/adstool/campaigns/${id}/resume`, {}),
  getCampaignPerformance: (id: string) =>
    apiClient.get<CampaignPerformance>(`/adstool/campaigns/${id}/performance`),
  optimizeCampaign: (id: string) =>
    apiClient.get<CampaignOptimization>(`/adstool/campaigns/${id}/optimize`),

  // Analytics
  getCampaignAnalytics: (
    campaignId: string,
    startDate?: string,
    endDate?: string,
  ) =>
    apiClient.get(`/adstool/analytics/campaign/${campaignId}`, {
      params: { start_date: startDate, end_date: endDate },
    }),
  getAccountAnalytics: (
    accountId: string,
    startDate?: string,
    endDate?: string,
  ) =>
    apiClient.get(`/adstool/analytics/account/${accountId}`, {
      params: { start_date: startDate, end_date: endDate },
    }),};
