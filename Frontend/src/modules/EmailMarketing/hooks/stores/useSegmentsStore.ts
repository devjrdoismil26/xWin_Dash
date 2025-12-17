import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import emailMarketingService from '@/services/emailMarketingService';
import { getErrorMessage } from '@/utils/errorHelpers';

interface EmailSegment {
  id: string;
  name: string;
  description?: string;
  criteria: Record<string, any>;
  subscriber_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string; }

interface SegmentsState {
  segments: EmailSegment[];
  currentSegment: EmailSegment | null;
  isLoading: boolean;
  error: string | null; }

interface SegmentsActions {
  fetchSegments: () => Promise<void>;
  fetchSegment: (id: string) => Promise<void>;
  createSegment: (data: Partial<EmailSegment>) => Promise<{ success: boolean;
  data?: EmailSegment;
  error?: string;
}>;
  updateSegment: (id: string, data: Partial<EmailSegment>) => Promise<{ success: boolean; error?: string }>;
  deleteSegment: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshSegmentCount: (id: string) => Promise<{ success: boolean; error?: string }>;
  clearError??: (e: any) => void;
}

export const useSegmentsStore = create<SegmentsState & SegmentsActions>()(
  devtools(
    immer((set: unknown) => ({
      segments: [],
      currentSegment: null,
      isLoading: false,
      error: null,

      fetchSegments: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.getSegments();

          set({ segments: (response as any).data, isLoading: false });

        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });

        } ,

      fetchSegment: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.getSegment(id);

          set({ currentSegment: (response as any).data, isLoading: false });

        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });

        } ,

      createSegment: async (data: Partial<EmailSegment>) => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.createSegment(data);

          set((state: unknown) => {
            state.segments.push(response.data);

            state.isLoading = false;
          });

          return { success: true, data: (response as any).data};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      updateSegment: async (id: string, data: Partial<EmailSegment>) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.updateSegment(id, data);

          set((state: unknown) => {
            const index = state.segments.findIndex((s: unknown) => s.id === id);

            if (index !== -1) {
              state.segments[index] = { ...state.segments[index], ...data};

            }
            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      deleteSegment: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.deleteSegment(id);

          set((state: unknown) => {
            state.segments = state.segments.filter((s: unknown) => s.id !== id);

            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      refreshSegmentCount: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.refreshSegmentCount(id);

          set((state: unknown) => {
            const segment = state.segments.find((s: unknown) => s.id === id);

            if (segment) segment.subscriber_count = (response as any).data.count;
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
    { name: 'EmailMarketing-Segments' }
  ));
