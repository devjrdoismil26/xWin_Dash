/**
 * Store Zustand para MediaLibrary - Versão TypeScript
 * Converte o store JavaScript (377 linhas) para TypeScript com tipagem completa
 */

import { create } from 'zustand';
import { devtools, persist, partialize } from 'zustand/middleware';
import mediaLibraryService from '../services/mediaLibraryService';
import { MediaItem, Folder, MediaStats } from '../types/basicTypes';

interface MediaLibraryState {
  // Estado
  media: MediaItem[];
  folders: Folder[];
  currentFolder: string | null;
  selectedMedia: string[];
  mediaStats: MediaStats | null;
  storageStats: any;
  searchQuery: string;
  currentView: 'grid' | 'list' | 'timeline';
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };

  // Ações de mídia
  fetchMedia: (filters?: any) => Promise<void>;
  fetchMediaById: (mediaId: string) => Promise<MediaItem | null>;
  uploadMedia: (file: File, metadata?: any) => Promise<MediaItem | null>;
  updateMedia: (mediaId: string, data: any) => Promise<MediaItem | null>;
  deleteMedia: (mediaId: string) => Promise<boolean>;
  bulkDeleteMedia: (mediaIds: string[]) => Promise<boolean>;
  downloadMedia: (mediaId: string) => Promise<void>;
  bulkDownloadMedia: (mediaIds: string[]) => Promise<void>;

  // Ações de pastas
  fetchFolders: (filters?: any) => Promise<void>;
  createFolder: (name: string, parentId?: string) => Promise<Folder | null>;
  updateFolder: (folderId: string, data: any) => Promise<Folder | null>;
  deleteFolder: (folderId: string) => Promise<boolean>;
  moveToFolder: (mediaIds: string[], folderId: string) => Promise<boolean>;

  // Ações de busca e filtros
  setSearchQuery: (query: string) => void;
  setCurrentView: (view: 'grid' | 'list' | 'timeline') => void;
  setCurrentFolder: (folderId: string | null) => void;
  clearFilters: () => void;

  // Ações de seleção
  selectMedia: (mediaId: string) => void;
  deselectMedia: (mediaId: string) => void;
  selectAllMedia: () => void;
  clearSelection: () => void;
  toggleMediaSelection: (mediaId: string) => void;

  // Ações de estatísticas
  fetchStats: () => Promise<void>;
  fetchStorageStats: () => Promise<void>;

  // Ações de paginação
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Ações de reset
  reset: () => void;
}

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
  }
};

export const useMediaLibraryStore = create<MediaLibraryState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ===== AÇÕES DE MÍDIA =====
        fetchMedia: async (filters = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await mediaLibraryService.getMedia(filters);
            set({ 
              media: response.data || response,
              pagination: response.pagination || get().pagination,
              loading: false 
            });
          } catch (error: any) {
            set({ error: error.message, loading: false });
          }
        },

        fetchMediaById: async (mediaId: string) => {
          set({ loading: true, error: null });
          try {
            const response = await mediaLibraryService.getMediaById(mediaId);
            set({ loading: false });
            return response;
          } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
          }
        },

        uploadMedia: async (file: File, metadata = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await mediaLibraryService.uploadMedia(file, metadata);
            const newMedia = response.data || response;
            
            set(state => ({
              media: [newMedia, ...state.media],
              loading: false
            }));
            
            return newMedia;
          } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
          }
        },

        updateMedia: async (mediaId: string, data: any) => {
          set({ loading: true, error: null });
          try {
            const response = await mediaLibraryService.updateMedia(mediaId, data);
            const updatedMedia = response.data || response;
            
            set(state => ({
              media: state.media.map(media => 
                media.id === mediaId ? updatedMedia : media
              ),
              loading: false
            }));
            
            return updatedMedia;
          } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
          }
        },

        deleteMedia: async (mediaId: string) => {
          set({ loading: true, error: null });
          try {
            await mediaLibraryService.deleteMedia(mediaId);
            
            set(state => ({
              media: state.media.filter(media => media.id !== mediaId),
              selectedMedia: state.selectedMedia.filter(id => id !== mediaId),
              loading: false
            }));
            
            return true;
          } catch (error: any) {
            set({ error: error.message, loading: false });
            return false;
          }
        },

        bulkDeleteMedia: async (mediaIds: string[]) => {
          set({ loading: true, error: null });
          try {
            await mediaLibraryService.bulkDeleteMedia(mediaIds);
            
            set(state => ({
              media: state.media.filter(media => !mediaIds.includes(media.id)),
              selectedMedia: [],
              loading: false
            }));
            
            return true;
          } catch (error: any) {
            set({ error: error.message, loading: false });
            return false;
          }
        },

        downloadMedia: async (mediaId: string) => {
          try {
            await mediaLibraryService.downloadMedia(mediaId);
          } catch (error: any) {
            set({ error: error.message });
            throw error;
          }
        },

        bulkDownloadMedia: async (mediaIds: string[]) => {
          try {
            await mediaLibraryService.bulkDownloadMedia(mediaIds);
          } catch (error: any) {
            set({ error: error.message });
            throw error;
          }
        },

        // ===== AÇÕES DE PASTAS =====
        fetchFolders: async (filters = {}) => {
          set({ loading: true, error: null });
          try {
            const response = await mediaLibraryService.getFolders(filters);
            set({ 
              folders: response.data || response,
              loading: false 
            });
          } catch (error: any) {
            set({ error: error.message, loading: false });
          }
        },

        createFolder: async (name: string, parentId?: string) => {
          set({ loading: true, error: null });
          try {
            const response = await mediaLibraryService.createFolder(name, parentId);
            const newFolder = response.data || response;
            
            set(state => ({
              folders: [...state.folders, newFolder],
              loading: false
            }));
            
            return newFolder;
          } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
          }
        },

        updateFolder: async (folderId: string, data: any) => {
          set({ loading: true, error: null });
          try {
            const response = await mediaLibraryService.updateFolder(folderId, data);
            const updatedFolder = response.data || response;
            
            set(state => ({
              folders: state.folders.map(folder => 
                folder.id === folderId ? updatedFolder : folder
              ),
              loading: false
            }));
            
            return updatedFolder;
          } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
          }
        },

        deleteFolder: async (folderId: string) => {
          set({ loading: true, error: null });
          try {
            await mediaLibraryService.deleteFolder(folderId);
            
            set(state => ({
              folders: state.folders.filter(folder => folder.id !== folderId),
              loading: false
            }));
            
            return true;
          } catch (error: any) {
            set({ error: error.message, loading: false });
            return false;
          }
        },

        moveToFolder: async (mediaIds: string[], folderId: string) => {
          set({ loading: true, error: null });
          try {
            await mediaLibraryService.moveToFolder(mediaIds, folderId);
            
            set(state => ({
              media: state.media.map(media => 
                mediaIds.includes(media.id) 
                  ? { ...media, folderId }
                  : media
              ),
              selectedMedia: [],
              loading: false
            }));
            
            return true;
          } catch (error: any) {
            set({ error: error.message, loading: false });
            return false;
          }
        },

        // ===== AÇÕES DE BUSCA E FILTROS =====
        setSearchQuery: (query: string) => {
          set({ searchQuery: query });
        },

        setCurrentView: (view: 'grid' | 'list' | 'timeline') => {
          set({ currentView: view });
        },

        setCurrentFolder: (folderId: string | null) => {
          set({ currentFolder: folderId });
        },

        clearFilters: () => {
          set({ 
            searchQuery: '',
            currentFolder: null,
            selectedMedia: []
          });
        },

        // ===== AÇÕES DE SELEÇÃO =====
        selectMedia: (mediaId: string) => {
          set(state => ({
            selectedMedia: [...state.selectedMedia, mediaId]
          }));
        },

        deselectMedia: (mediaId: string) => {
          set(state => ({
            selectedMedia: state.selectedMedia.filter(id => id !== mediaId)
          }));
        },

        selectAllMedia: () => {
          set(state => ({
            selectedMedia: state.media.map(media => media.id)
          }));
        },

        clearSelection: () => {
          set({ selectedMedia: [] });
        },

        toggleMediaSelection: (mediaId: string) => {
          set(state => {
            const isSelected = state.selectedMedia.includes(mediaId);
            return {
              selectedMedia: isSelected
                ? state.selectedMedia.filter(id => id !== mediaId)
                : [...state.selectedMedia, mediaId]
            };
          });
        },

        // ===== AÇÕES DE ESTATÍSTICAS =====
        fetchStats: async () => {
          set({ loading: true, error: null });
          try {
            const response = await mediaLibraryService.getStats();
            set({ 
              mediaStats: response.data || response,
              loading: false 
            });
          } catch (error: any) {
            set({ error: error.message, loading: false });
          }
        },

        fetchStorageStats: async () => {
          set({ loading: true, error: null });
          try {
            const response = await mediaLibraryService.getStorageStats();
            set({ 
              storageStats: response.data || response,
              loading: false 
            });
          } catch (error: any) {
            set({ error: error.message, loading: false });
          }
        },

        // ===== AÇÕES DE PAGINAÇÃO =====
        setPage: (page: number) => {
          set(state => ({
            pagination: { ...state.pagination, current_page: page }
          }));
        },

        setPerPage: (perPage: number) => {
          set(state => ({
            pagination: { ...state.pagination, per_page: perPage }
          }));
        },

        nextPage: () => {
          set(state => {
            const { current_page, last_page } = state.pagination;
            if (current_page < last_page) {
              return {
                pagination: { ...state.pagination, current_page: current_page + 1 }
              };
            }
            return state;
          });
        },

        prevPage: () => {
          set(state => {
            const { current_page } = state.pagination;
            if (current_page > 1) {
              return {
                pagination: { ...state.pagination, current_page: current_page - 1 }
              };
            }
            return state;
          });
        },

        // ===== AÇÕES DE RESET =====
        reset: () => {
          set(initialState);
        }
      }),
      {
        name: 'media-library-store',
        partialize: (state) => ({
          currentView: state.currentView,
          searchQuery: state.searchQuery,
          currentFolder: state.currentFolder,
          pagination: state.pagination
        })
      }
    ),
    {
      name: 'MediaLibraryStore'
    }
  )
);

export default useMediaLibraryStore;
