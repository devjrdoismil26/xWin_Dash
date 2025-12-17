import { getErrorMessage } from '@/utils/errorHelpers';
import mediaLibraryService from '@/services/mediaLibraryService';
import type { Folder } from '@/types/basicTypes';

export interface FoldersSlice {
  folders: Folder[];
  currentFolder: string | null;
  fetchFolders: (filters?: string) => Promise<void>;
  createFolder: (name: string, parentId?: string) => Promise<Folder | null>;
  updateFolder: (folderId: string, data: unknown) => Promise<Folder | null>;
  deleteFolder: (folderId: string) => Promise<boolean>;
  moveToFolder: (mediaIds: string[], folderId: string) => Promise<boolean>;
  setCurrentFolder?: (e: any) => void; }

export const createFoldersSlice = (set: unknown, get: unknown): FoldersSlice => ({
  folders: [],
  currentFolder: null,

  fetchFolders: async (filters = {}) => {
    try {
      const response = await mediaLibraryService.getFolders(filters);

      set({ folders: (response as any).data || [] });

    } catch (error) {
      set({ error: getErrorMessage(error) });

    } ,

  createFolder: async (name: unknown, parentId: unknown) => {
    try {
      const response = await mediaLibraryService.createFolder({ name, parent_id: parentId });

      if (response.data) {
        set((state: unknown) => ({ folders: [...state.folders, (response as any).data] }));

        return (response as any).data as any;
      }
      return null;
    } catch (error) {
      set({ error: getErrorMessage(error) });

      return null;
    } ,

  updateFolder: async (folderId: unknown, data: unknown) => {
    try {
      const response = await mediaLibraryService.updateFolder(folderId, data);

      if (response.data) {
        set((state: unknown) => ({
          folders: state.folders.map((f: Folder) => f.id === folderId ? (response as any).data : f)
  }));

        return (response as any).data as any;
      }
      return null;
    } catch (error) {
      set({ error: getErrorMessage(error) });

      return null;
    } ,

  deleteFolder: async (folderId: unknown) => {
    try {
      await mediaLibraryService.deleteFolder(folderId);

      set((state: unknown) => ({
        folders: state.folders.filter((f: Folder) => f.id !== folderId)
  }));

      return true;
    } catch (error) {
      set({ error: getErrorMessage(error) });

      return false;
    } ,

  moveToFolder: async (mediaIds: unknown, folderId: unknown) => {
    try {
      await mediaLibraryService.moveToFolder(mediaIds, folderId);

      return true;
    } catch (error) {
      set({ error: getErrorMessage(error) });

      return false;
    } ,

  setCurrentFolder: (folderId: unknown) => set({ currentFolder: folderId })
  });
