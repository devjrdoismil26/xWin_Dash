import { getErrorMessage } from '@/utils/errorHelpers';
import mediaLibraryService from '@/services/mediaLibraryService';
import type { MediaItem } from '@/types/basicTypes';

export interface MediaSlice {
  media: MediaItem[];
  loading: boolean;
  error: string | null;
  fetchMedia: (filters?: string) => Promise<void>;
  fetchMediaById: (mediaId: string) => Promise<MediaItem | null>;
  uploadMedia: (file: File, metadata?: string) => Promise<MediaItem | null>;
  updateMedia: (mediaId: string, data: unknown) => Promise<MediaItem | null>;
  deleteMedia: (mediaId: string) => Promise<boolean>;
  bulkDeleteMedia: (mediaIds: string[]) => Promise<boolean>;
  downloadMedia: (mediaId: string) => Promise<void>;
  bulkDownloadMedia: (mediaIds: string[]) => Promise<void>; }

export const createMediaSlice = (set: unknown, get: unknown): MediaSlice => ({
  media: [],
  loading: false,
  error: null,

  fetchMedia: async (filters = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await mediaLibraryService.getMedia(filters);

      set({ media: (response as any).data || [], loading: false });

    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });

    } ,

  fetchMediaById: async (mediaId: unknown) => {
    set({ loading: true, error: null });

    try {
      const response = await mediaLibraryService.getMediaById(mediaId);

      set({ loading: false });

      return (response as any).data || null;
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });

      return null;
    } ,

  uploadMedia: async (file, metadata = {}) => {
    set({ loading: true, error: null });

    try {
      const response = await mediaLibraryService.uploadMedia(file, metadata);

      if (response.data) {
        set((state: unknown) => ({ media: [...state.media, (response as any).data], loading: false }));

        return (response as any).data as any;
      }
      set({ loading: false });

      return null;
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });

      return null;
    } ,

  updateMedia: async (mediaId: unknown, data: unknown) => {
    set({ loading: true, error: null });

    try {
      const response = await mediaLibraryService.updateMedia(mediaId, data);

      if (response.data) {
        set((state: unknown) => ({
          media: state.media.map((m: MediaItem) => m.id === mediaId ? (response as any).data : m),
          loading: false
        }));

        return (response as any).data as any;
      }
      set({ loading: false });

      return null;
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });

      return null;
    } ,

  deleteMedia: async (mediaId: unknown) => {
    set({ loading: true, error: null });

    try {
      await mediaLibraryService.deleteMedia(mediaId);

      set((state: unknown) => ({
        media: state.media.filter((m: MediaItem) => m.id !== mediaId),
        loading: false
      }));

      return true;
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });

      return false;
    } ,

  bulkDeleteMedia: async (mediaIds: unknown) => {
    set({ loading: true, error: null });

    try {
      await mediaLibraryService.bulkDeleteMedia(mediaIds);

      set((state: unknown) => ({
        media: state.media.filter((m: MediaItem) => !mediaIds.includes(m.id)),
        loading: false
      }));

      return true;
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });

      return false;
    } ,

  downloadMedia: async (mediaId: unknown) => {
    try {
      await mediaLibraryService.downloadMedia(mediaId);

    } catch (error) {
      set({ error: getErrorMessage(error) });

    } ,

  bulkDownloadMedia: async (mediaIds: unknown) => {
    try {
      await mediaLibraryService.bulkDownloadMedia(mediaIds);

    } catch (error) {
      set({ error: getErrorMessage(error) });

    } });
