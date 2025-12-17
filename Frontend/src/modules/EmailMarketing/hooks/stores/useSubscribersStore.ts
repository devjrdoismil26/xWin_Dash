import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import emailMarketingService from '@/services/emailMarketingService';
import { getErrorMessage } from '@/utils/errorHelpers';

interface EmailSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribed_at: string;
  tags?: string[]; }

interface SubscribersState {
  subscribers: EmailSubscriber[];
  currentSubscriber: EmailSubscriber | null;
  isLoading: boolean;
  error: string | null; }

interface SubscribersActions {
  fetchSubscribers: () => Promise<void>;
  fetchSubscriber: (id: string) => Promise<void>;
  createSubscriber: (data: Partial<EmailSubscriber>) => Promise<{ success: boolean;
  data?: EmailSubscriber;
  error?: string;
}>;
  updateSubscriber: (id: string, data: Partial<EmailSubscriber>) => Promise<{ success: boolean; error?: string }>;
  deleteSubscriber: (id: string) => Promise<{ success: boolean; error?: string }>;
  unsubscribe: (id: string) => Promise<{ success: boolean; error?: string }>;
  resubscribe: (id: string) => Promise<{ success: boolean; error?: string }>;
  clearError??: (e: any) => void;
}

export const useSubscribersStore = create<SubscribersState & SubscribersActions>()(
  devtools(
    immer((set: unknown) => ({
      subscribers: [],
      currentSubscriber: null,
      isLoading: false,
      error: null,

      fetchSubscribers: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.getSubscribers();

          set({ subscribers: (response as any).data, isLoading: false });

        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });

        } ,

      fetchSubscriber: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.getSubscriber(id);

          set({ currentSubscriber: (response as any).data, isLoading: false });

        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });

        } ,

      createSubscriber: async (data: Partial<EmailSubscriber>) => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.createSubscriber(data);

          set((state: unknown) => {
            state.subscribers.push(response.data);

            state.isLoading = false;
          });

          return { success: true, data: (response as any).data};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      updateSubscriber: async (id: string, data: Partial<EmailSubscriber>) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.updateSubscriber(id, data);

          set((state: unknown) => {
            const index = state.subscribers.findIndex((s: unknown) => s.id === id);

            if (index !== -1) {
              state.subscribers[index] = { ...state.subscribers[index], ...data};

            }
            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      deleteSubscriber: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.deleteSubscriber(id);

          set((state: unknown) => {
            state.subscribers = state.subscribers.filter((s: unknown) => s.id !== id);

            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      unsubscribe: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.unsubscribe(id);

          set((state: unknown) => {
            const subscriber = state.subscribers.find((s: unknown) => s.id === id);

            if (subscriber) subscriber.status = 'unsubscribed';
            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      resubscribe: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.resubscribe(id);

          set((state: unknown) => {
            const subscriber = state.subscribers.find((s: unknown) => s.id === id);

            if (subscriber) subscriber.status = 'active';
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
    { name: 'EmailMarketing-Subscribers' }
  ));
