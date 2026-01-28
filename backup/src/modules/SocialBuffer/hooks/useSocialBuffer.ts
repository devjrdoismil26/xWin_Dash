import { create } from 'zustand';
import socialBufferService from '../services/socialBufferService';
import { SocialAccount, SocialPost, SocialSchedule, SocialHashtag, SocialMedia, SocialLink } from '../types/socialTypes';

interface SocialBufferState {
  // Estado
  socialAccounts: SocialAccount[];
  posts: SocialPost[];
  schedules: SocialSchedule[];
  hashtags: SocialHashtag[];
  shortenedLinks: SocialLink[];
  media: SocialMedia[];
  engagement: any;
  loading: boolean;
  error: string | null;
  currentView: string;
}

interface SocialBufferActions {
  // Ações para contas sociais
  fetchSocialAccounts: () => Promise<void>;
  createSocialAccount: (accountData: Partial<SocialAccount>) => Promise<any>;
  updateSocialAccount: (id: string | number, accountData: Partial<SocialAccount>) => Promise<any>;
  deleteSocialAccount: (id: string | number) => Promise<void>;

  // Ações para posts
  fetchPosts: (params?: any) => Promise<void>;
  createPost: (postData: Partial<SocialPost>) => Promise<any>;
  updatePost: (id: string | number, postData: Partial<SocialPost>) => Promise<any>;
  deletePost: (id: string | number) => Promise<void>;
  publishPost: (id: string | number) => Promise<any>;
  schedulePost: (id: string | number, scheduledAt: string) => Promise<any>;
  generateContent: (prompt: string) => Promise<any>;

  // Ações para agendamentos
  fetchSchedules: (params?: any) => Promise<void>;
  createSchedule: (scheduleData: Partial<SocialSchedule>) => Promise<any>;
  cancelSchedule: (id: string | number) => Promise<void>;

  // Ações para hashtags
  fetchHashtags: (params?: any) => Promise<void>;
  suggestHashtags: (query: string) => Promise<any>;

  // Ações para links encurtados
  fetchShortenedLinks: (params?: any) => Promise<void>;
  shortenLink: (url: string) => Promise<any>;

  // Ações para mídia
  fetchMedia: (params?: any) => Promise<void>;
  uploadMedia: (file: File) => Promise<any>;

  // Ações para engagement
  fetchEngagementOverview: (params?: any) => Promise<void>;

  // Ações de teste de integração
  testConnection: () => Promise<any>;
  testPostCreation: () => Promise<any>;
  testHashtagSuggestion: () => Promise<any>;
  testLinkShortening: () => Promise<any>;

  // Ações de UI
  setCurrentView: (view: string) => void;
  clearError: () => void;
}

type SocialBufferStore = SocialBufferState & SocialBufferActions;

const useSocialBuffer = create<SocialBufferStore>((set, get) => ({
  // Estado
  socialAccounts: [],
  posts: [],
  schedules: [],
  hashtags: [],
  shortenedLinks: [],
  media: [],
  engagement: null,
  loading: false,
  error: null,
  currentView: 'overview',

  // Ações para contas sociais
  fetchSocialAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.getSocialAccounts();
      set({ socialAccounts: data.data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createSocialAccount: async (accountData: Partial<SocialAccount>) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.createSocialAccount(accountData);
      set(state => ({ 
        socialAccounts: [...state.socialAccounts, data.data], 
        loading: false 
      }));
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateSocialAccount: async (id: string | number, accountData: Partial<SocialAccount>) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.updateSocialAccount(id, accountData);
      set(state => ({
        socialAccounts: state.socialAccounts.map(account => 
          account.id === id ? data.data : account
        ),
        loading: false
      }));
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteSocialAccount: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      await socialBufferService.deleteSocialAccount(id);
      set(state => ({
        socialAccounts: state.socialAccounts.filter(account => account.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para posts
  fetchPosts: async (params: any = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.getPosts(params);
      set({ posts: data.data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createPost: async (postData: Partial<SocialPost>) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.createPost(postData);
      set(state => ({ 
        posts: [...state.posts, data.data], 
        loading: false 
      }));
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePost: async (id: string | number, postData: Partial<SocialPost>) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.updatePost(id, postData);
      set(state => ({
        posts: state.posts.map(post => 
          post.id === id ? data.data : post
        ),
        loading: false
      }));
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deletePost: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      await socialBufferService.deletePost(id);
      set(state => ({
        posts: state.posts.filter(post => post.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  publishPost: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.publishImmediately(id);
      set(state => ({
        posts: state.posts.map(post => 
          post.id === id ? { ...post, status: 'published' } : post
        ),
        loading: false
      }));
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  schedulePost: async (id: string | number, scheduledAt: string) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.schedulePost(id, scheduledAt);
      set(state => ({
        posts: state.posts.map(post => 
          post.id === id ? { ...post, scheduled_at: scheduledAt, status: 'scheduled' } : post
        ),
        loading: false
      }));
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  generateContent: async (prompt: string) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.generateContent(prompt);
      set({ loading: false });
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para agendamentos
  fetchSchedules: async (params: any = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.getSchedules(params);
      set({ schedules: data.data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createSchedule: async (scheduleData: Partial<SocialSchedule>) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.createSchedule(scheduleData);
      set(state => ({ 
        schedules: [...state.schedules, data.data], 
        loading: false 
      }));
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  cancelSchedule: async (id: string | number) => {
    set({ loading: true, error: null });
    try {
      await socialBufferService.cancelSchedule(id);
      set(state => ({
        schedules: state.schedules.filter(schedule => schedule.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para hashtags
  fetchHashtags: async (params: any = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.getHashtags(params);
      set({ hashtags: data.data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  suggestHashtags: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.suggestHashtags(query);
      set({ loading: false });
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para links encurtados
  fetchShortenedLinks: async (params: any = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.getShortenedLinks(params);
      set({ shortenedLinks: data.data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  shortenLink: async (url: string) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.shortenLink(url);
      set(state => ({ 
        shortenedLinks: [...state.shortenedLinks, data.data], 
        loading: false 
      }));
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para mídia
  fetchMedia: async (params: any = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.getMedia(params);
      set({ media: data.data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  uploadMedia: async (file: File) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.uploadMedia(file);
      set(state => ({ 
        media: [...state.media, data.data], 
        loading: false 
      }));
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Ações para engagement
  fetchEngagementOverview: async (params: any = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await socialBufferService.getEngagementOverview(params);
      set({ engagement: data.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  // Ações de teste de integração
  testConnection: async () => {
    set({ loading: true, error: null });
    try {
      const result = await socialBufferService.testConnection();
      set({ loading: false });
      return result;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  testPostCreation: async () => {
    set({ loading: true, error: null });
    try {
      const result = await socialBufferService.testPostCreation();
      set({ loading: false });
      return result;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  testHashtagSuggestion: async () => {
    set({ loading: true, error: null });
    try {
      const result = await socialBufferService.testHashtagSuggestion();
      set({ loading: false });
      return result;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  testLinkShortening: async () => {
    set({ loading: true, error: null });
    try {
      const result = await socialBufferService.testLinkShortening();
      set({ loading: false });
      return result;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Ações de UI
  setCurrentView: (view: string) => set({ currentView: view }),
  clearError: () => set({ error: null }),
}));

export default useSocialBuffer;
