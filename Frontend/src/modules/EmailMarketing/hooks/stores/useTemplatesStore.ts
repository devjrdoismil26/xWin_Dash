import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import emailMarketingService from '@/services/emailMarketingService';
import { getErrorMessage } from '@/utils/errorHelpers';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'html' | 'text' | 'responsive';
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string; }

interface TemplatesState {
  templates: EmailTemplate[];
  currentTemplate: EmailTemplate | null;
  isLoading: boolean;
  error: string | null; }

interface TemplatesActions {
  fetchTemplates: () => Promise<void>;
  fetchTemplate: (id: string) => Promise<void>;
  createTemplate: (data: Partial<EmailTemplate>) => Promise<{ success: boolean;
  data?: EmailTemplate;
  error?: string;
}>;
  updateTemplate: (id: string, data: Partial<EmailTemplate>) => Promise<{ success: boolean; error?: string }>;
  deleteTemplate: (id: string) => Promise<{ success: boolean; error?: string }>;
  duplicateTemplate: (id: string) => Promise<{ success: boolean; data?: EmailTemplate; error?: string }>;
  clearError??: (e: any) => void;
}

export const useTemplatesStore = create<TemplatesState & TemplatesActions>()(
  devtools(
    immer((set: unknown) => ({
      templates: [],
      currentTemplate: null,
      isLoading: false,
      error: null,

      fetchTemplates: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.getTemplates();

          set({ templates: (response as any).data, isLoading: false });

        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });

        } ,

      fetchTemplate: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.getTemplate(id);

          set({ currentTemplate: (response as any).data, isLoading: false });

        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });

        } ,

      createTemplate: async (data: Partial<EmailTemplate>) => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.createTemplate(data);

          set((state: unknown) => {
            state.templates.push(response.data);

            state.isLoading = false;
          });

          return { success: true, data: (response as any).data};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      updateTemplate: async (id: string, data: Partial<EmailTemplate>) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.updateTemplate(id, data);

          set((state: unknown) => {
            const index = state.templates.findIndex((t: unknown) => t.id === id);

            if (index !== -1) {
              state.templates[index] = { ...state.templates[index], ...data};

            }
            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      deleteTemplate: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await emailMarketingService.deleteTemplate(id);

          set((state: unknown) => {
            state.templates = state.templates.filter((t: unknown) => t.id !== id);

            state.isLoading = false;
          });

          return { success: true};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      duplicateTemplate: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await emailMarketingService.duplicateTemplate(id);

          set((state: unknown) => {
            state.templates.push(response.data);

            state.isLoading = false;
          });

          return { success: true, data: (response as any).data};

        } catch (error) {
          const errorMsg = getErrorMessage(error);

          set({ error: errorMsg, isLoading: false });

          return { success: false, error: errorMsg};

        } ,

      clearError: () => set({ error: null })
  })),
    { name: 'EmailMarketing-Templates' }
  ));
