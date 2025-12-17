import { create } from 'zustand';
import type { SocialPost, SocialAccount } from '@/types/socialBuffer';

interface SocialBufferStore {
  posts: SocialPost[];
  accounts: SocialAccount[];
  selectedPost: SocialPost | null;
  isLoading: boolean;
  setPosts?: (e: any) => void;
  setAccounts?: (e: any) => void;
  setSelectedPost?: (e: any) => void;
  setLoading?: (e: any) => void;
  addPost?: (e: any) => void;
  updatePost?: (e: any) => void;
  removePost?: (e: any) => void;
  addAccount?: (e: any) => void;
  removeAccount?: (e: any) => void;
  reset??: (e: any) => void; }

export const useSocialBufferStore = create<SocialBufferStore>((set: unknown) => ({
  posts: [],
  accounts: [],
  selectedPost: null,
  isLoading: false,
  
  setPosts: (posts: unknown) => set({ posts }),
  setAccounts: (accounts: unknown) => set({ accounts }),
  setSelectedPost: (selectedPost: unknown) => set({ selectedPost }),
  setLoading: (isLoading: unknown) => set({ isLoading }),
  
  addPost: (post: unknown) => set((state: unknown) => ({
    posts: [post, ...state.posts],
  })),
  
  updatePost: (id: unknown, updates: unknown) => set((state: unknown) => ({
    posts: state.posts.map((p: unknown) =>
      p.id === id ? { ...p, ...updates } : p
    ),
  })),
  
  removePost: (id: unknown) => set((state: unknown) => ({
    posts: state.posts.filter((p: unknown) => p.id !== id),
  })),
  
  addAccount: (account: unknown) => set((state: unknown) => ({
    accounts: [...state.accounts, account],
  })),
  
  removeAccount: (id: unknown) => set((state: unknown) => ({
    accounts: state.accounts.filter((a: unknown) => a.id !== id),
  })),
  
  reset: () => set({
    posts: [],
    accounts: [],
    selectedPost: null,
  }),
}));
