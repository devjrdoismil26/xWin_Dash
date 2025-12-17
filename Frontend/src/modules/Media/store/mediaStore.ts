import { create } from 'zustand';
import type { Media, MediaFolder, MediaStats } from '../types';

interface MediaState {
  files: Media[];
  folders: MediaFolder[];
  stats: MediaStats | null;
  selectedMedia: Media | null;
  selectedFolder: MediaFolder | null;
  isLoading: boolean;
  error: string | null;
  setLibrary?: (e: any) => void;
  addMedia?: (e: any) => void;
  updateMedia?: (e: any) => void;
  removeMedia?: (e: any) => void;
  setSelectedMedia?: (e: any) => void;
  addFolder?: (e: any) => void;
  updateFolder?: (e: any) => void;
  removeFolder?: (e: any) => void;
  setSelectedFolder?: (e: any) => void;
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  reset??: (e: any) => void; }

export const useMediaStore = create<MediaState>((set: unknown) => ({
  files: [],
  folders: [],
  stats: null,
  selectedMedia: null,
  selectedFolder: null,
  isLoading: false,
  error: null,

  setLibrary: (files: unknown, folders: unknown, stats: unknown) => set({ files, folders, stats }),

  addMedia: (media: unknown) => set((state: unknown) => ({ files: [media, ...state.files] })),

  updateMedia: (id: unknown, updates: unknown) =>
    set((state: unknown) => ({
      files: state.files.map((m: unknown) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  removeMedia: (id: unknown) => set((state: unknown) => ({ files: state.files.filter((m: unknown) => m.id !== id) })),

  setSelectedMedia: (media: unknown) => set({ selectedMedia: media }),

  addFolder: (folder: unknown) => set((state: unknown) => ({ folders: [...state.folders, folder] })),

  updateFolder: (id: unknown, updates: unknown) =>
    set((state: unknown) => ({
      folders: state.folders.map((f: unknown) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  removeFolder: (id: unknown) => set((state: unknown) => ({ folders: state.folders.filter((f: unknown) => f.id !== id) })),

  setSelectedFolder: (folder: unknown) => set({ selectedFolder: folder }),

  setLoading: (loading: unknown) => set({ isLoading: loading }),
  setError: (error: unknown) => set({ error }),
  reset: () => set({
    files: [],
    folders: [],
    stats: null,
    selectedMedia: null,
    selectedFolder: null,
    isLoading: false,
    error: null,
  }),
}));
