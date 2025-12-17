import { getErrorMessage } from '@/utils/errorHelpers';
import mediaLibraryService from '@/services/mediaLibraryService';
import type { MediaStats } from '@/types/basicTypes';

export interface StatsSlice {
  mediaStats: MediaStats | null;
  storageStats: unknown;
  fetchStats: () => Promise<void>;
  fetchStorageStats: () => Promise<void>; }

export const createStatsSlice = (set: unknown, get: unknown): StatsSlice => ({
  mediaStats: null,
  storageStats: null,

  fetchStats: async () => {
    try {
      const response = await mediaLibraryService.getStats();

      set({ mediaStats: (response as any).data || null });

    } catch (error) {
      set({ error: getErrorMessage(error) });

    } ,

  fetchStorageStats: async () => {
    try {
      const response = await mediaLibraryService.getStorageStats();

      set({ storageStats: (response as any).data || null });

    } catch (error) {
      set({ error: getErrorMessage(error) });

    } });
