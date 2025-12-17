import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import emailMarketingService from '@/services/emailMarketingService';
import { getErrorMessage } from '@/utils/errorHelpers';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  template_id?: string;
  segment_id?: string;
  send_date?: string;
  created_at: string;
  updated_at: string;
  metrics?: {
    sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number; };

}

interface CampaignsState {
  campaigns: EmailCampaign[];
  currentCampaign: EmailCampaign | null;
  isLoading: boolean;
  error: string | null; }

interface CampaignsActions {
  fetchCampaigns: () => Promise<void>;
  fetchCampaign: (id: string) => Promise<void>;
  createCampaign: (data: Partial<EmailCampaign>) => Promise<{ success: boolean;
  data?: EmailCampaign;
  error?: string;
}>;
  updateCampaign: (id: string, data: Partial<EmailCampaign>) => Promise<{ success: boolean; error?: string }>;
  deleteCampaign: (id: string) => Promise<{ success: boolean; error?: string }>;
  sendCampaign: (id: string) => Promise<{ success: boolean; error?: string }>;
  pauseCampaign: (id: string) => Promise<{ success: boolean; error?: string }>;
  resumeCampaign: (id: string) => Promise<{ success: boolean; error?: string }>;
  clearError??: (e: any) => void;
}

export const useCampaignsStore = create<CampaignsState & CampaignsActions>()(
  devtools(
    immer((set: unknown) => ({
      campaigns: [],
      currentCampaign: null,
      isLoading: false,
      error: null,

      fetchCampaigns: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.getCampaigns();

          set({ campaigns: (response as any).data, isLoading: false });

        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });

        } ,

      fetchCampaign: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.getCampaign(id);

          set({ currentCampaign: (response as any).data, isLoading: false });

        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });

        } ,

      createCampaign: async (data: Partial<EmailCampaign>) => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.createCampaign(data);

          set((state: unknown) => {
            state.campaigns.push(response.data);

            state.isLoading = false;
          });

          return { success: true, data: (response as any).data};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      updateCampaign: async (id: string, data: Partial<EmailCampaign>) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.updateCampaign(id, data);

          set((state: unknown) => {
            const index = state.campaigns.findIndex((c: unknown) => c.id === id);

            if (index !== -1) {
              state.campaigns[index] = { ...state.campaigns[index], ...data};

            }
            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      deleteCampaign: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.deleteCampaign(id);

          set((state: unknown) => {
            state.campaigns = state.campaigns.filter((c: unknown) => c.id !== id);

            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      sendCampaign: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.sendCampaign(id);

          set((state: unknown) => {
            const campaign = state.campaigns.find((c: unknown) => c.id === id);

            if (campaign) campaign.status = 'sending';
            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      pauseCampaign: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.pauseCampaign(id);

          set((state: unknown) => {
            const campaign = state.campaigns.find((c: unknown) => c.id === id);

            if (campaign) campaign.status = 'paused';
            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      resumeCampaign: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.resumeCampaign(id);

          set((state: unknown) => {
            const campaign = state.campaigns.find((c: unknown) => c.id === id);

            if (campaign) campaign.status = 'sending';
            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      clearError: () => set({ error: null })
  })),
    { name: 'EmailMarketing-Campaigns' }
  ));
