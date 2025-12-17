import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import emailMarketingService from '@/services/emailMarketingService';
import { getErrorMessage } from '@/utils/errorHelpers';

interface EmailMarketingMetrics {
  total_campaigns: number;
  total_templates: number;
  total_segments: number;
  total_subscribers: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number; }

interface MetricsState {
  metrics: EmailMarketingMetrics | null;
  isLoading: boolean;
  error: string | null; }

interface MetricsActions {
  fetchMetrics: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  clearError??: (e: any) => void; }

export const useMetricsStore = create<MetricsState & MetricsActions>()(
  devtools(
    (set: unknown) => ({
      metrics: null,
      isLoading: false,
      error: null,

      fetchMetrics: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.getMetrics();

          set({ metrics: (response as any).data, isLoading: false });

        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });

        } ,

      refreshMetrics: async () => {
        try {
          const response = await emailMarketingService.getMetrics();

          set({ metrics: (response as any).data });

        } catch (error) {
          set({ error: getErrorMessage(error) });

        } ,

      clearError: () => set({ error: null })
  }),
    { name: 'EmailMarketing-Metrics' }
  ));
