import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createMediaSlice, MediaSlice } from './slices/mediaSlice';
import { createFoldersSlice, FoldersSlice } from './slices/foldersSlice';
import { createUISlice, UISlice } from './slices/uiSlice';
import { createStatsSlice, StatsSlice } from './slices/statsSlice';

type MediaLibraryState = MediaSlice & FoldersSlice & UISlice & StatsSlice & {
  reset??: (e: any) => void;};

const initialState = {
  media: [],
  folders: [],
  currentFolder: null,
  selectedMedia: [],
  mediaStats: null,
  storageStats: null,
  searchQuery: '',
  currentView: 'grid' as const,
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1
  } ;

export const useMediaLibraryStore = create<MediaLibraryState>()(
  devtools(
    persist(
      (set: unknown, get: unknown) => ({
        ...createMediaSlice(set, get),
        ...createFoldersSlice(set, get),
        ...createUISlice(set, get),
        ...createStatsSlice(set, get),
        reset: () => set(initialState)
  }),
      {
        name: 'media-library-storage',
        partialize: (state: unknown) => ({
          currentView: state.currentView,
          pagination: state.pagination
        })
  }
    )
  ));
