// =========================================
// SOCIAL MEDIA STORE - SOCIAL BUFFER
// =========================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { mediaService } from '../../services/mediaService';
import { SocialMedia } from '../../types/socialTypes';
import type {
  MediaSearchParams,
  MediaPaginatedResponse,
  UploadMediaData,
  UpdateMediaData,
  MediaStats,
  MediaOptimization,
  MediaAnalysis,
  MediaGallery
} from '../../services/mediaService';

interface SocialMediaState {
  // Estado da mídia
  media: SocialMedia[];
  selectedMedia: SocialMedia | null;
  mediaStats: MediaStats | null;
  
  // Estado de paginação
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Estado de filtros
  filters: MediaSearchParams;
  
  // Estado de loading e erro
  loading: boolean;
  error: string | null;
  
  // Estado de operações
  uploading: boolean;
  updating: boolean;
  deleting: boolean;
  optimizing: boolean;
  analyzing: boolean;
  
  // Estado de upload
  uploadProgress: Record<string, number>;
  uploadQueue: Array<{
    id: string;
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
  }>;
  
  // Estado de otimização e análise
  mediaOptimization: Record<string, MediaOptimization>;
  mediaAnalysis: Record<string, MediaAnalysis>;
  mediaGalleries: MediaGallery[];
  
  // Estado de seleção múltipla
  selectedMediaIds: string[];
  bulkAction: string | null;
  
  // Estado de cache
  lastFetch: {
    media: number | null;
    optimization: number | null;
    analysis: number | null;
    galleries: number | null;
  };
}

interface SocialMediaActions {
  // Ações de busca e listagem
  fetchMedia: (params?: MediaSearchParams) => Promise<void>;
  refreshMedia: () => Promise<void>;
  searchMedia: (query: string) => Promise<void>;
  
  // Ações de seleção
  selectMedia: (media: SocialMedia | null) => void;
  clearSelection: () => void;
  selectMultipleMedia: (mediaIds: string[]) => void;
  toggleMediaSelection: (mediaId: string) => void;
  clearMultipleSelection: () => void;
  
  // Ações de upload
  uploadMedia: (file: File, metadata?: any) => Promise<SocialMedia>;
  bulkUploadMedia: (files: File[], metadata?: any) => Promise<SocialMedia[]>;
  retryUpload: (uploadId: string) => Promise<void>;
  cancelUpload: (uploadId: string) => void;
  
  // Ações de CRUD
  updateMedia: (id: string, mediaData: UpdateMediaData) => Promise<SocialMedia>;
  deleteMedia: (id: string) => Promise<void>;
  duplicateMedia: (id: string) => Promise<SocialMedia>;
  
  // Ações de otimização
  optimizeMedia: (mediaId: string, options?: any) => Promise<void>;
  getMediaOptimization: (mediaId: string) => MediaOptimization | null;
  
  // Ações de análise
  analyzeMedia: (mediaId: string) => Promise<void>;
  getMediaAnalysis: (mediaId: string) => MediaAnalysis | null;
  
  // Ações de galerias
  fetchMediaGalleries: () => Promise<void>;
  createMediaGallery: (galleryData: Omit<MediaGallery, 'id'>) => Promise<MediaGallery>;
  updateMediaGallery: (id: string, galleryData: Partial<MediaGallery>) => Promise<MediaGallery>;
  deleteMediaGallery: (id: string) => Promise<void>;
  
  // Ações de estatísticas
  fetchMediaStats: () => Promise<void>;
  
  // Ações de filtros
  setFilters: (filters: Partial<MediaSearchParams>) => void;
  clearFilters: () => void;
  
  // Ações de paginação
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // Ações de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Ações de cache
  clearCache: () => void;
  invalidateCache: (pattern: string) => void;
}

// =========================================
// STORE DE MÍDIA SOCIAL
// =========================================

export const useSocialMediaStore = create<SocialMediaState & SocialMediaActions>()(
  devtools(
    persist(
      (set, get) => ({
        // ===== ESTADO INICIAL =====
        
        // Estado da mídia
        media: [],
        selectedMedia: null,
        mediaStats: null,
        
        // Estado de paginação
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        },
        
        // Estado de filtros
        filters: {},
        
        // Estado de loading e erro
        loading: false,
        error: null,
        
        // Estado de operações
        uploading: false,
        updating: false,
        deleting: false,
        optimizing: false,
        analyzing: false,
        
        // Estado de upload
        uploadProgress: {},
        uploadQueue: [],
        
        // Estado de otimização e análise
        mediaOptimization: {},
        mediaAnalysis: {},
        mediaGalleries: [],
        
        // Estado de seleção múltipla
        selectedMediaIds: [],
        bulkAction: null,
        
        // Estado de cache
        lastFetch: {
          media: null,
          optimization: null,
          analysis: null,
          galleries: null
        },
        
        // ===== AÇÕES DE BUSCA E LISTAGEM =====
        
        fetchMedia: async (params?: MediaSearchParams) => {
          const { filters, pagination } = get();
          const finalParams = { 
            ...filters, 
            ...params,
            page: pagination.page,
            limit: pagination.limit
          };
          
          set({ loading: true, error: null });
          
          try {
            const response: MediaPaginatedResponse = await mediaService.getMedia(finalParams);
            set({
              media: response.data,
              pagination: {
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.total_pages
              },
              loading: false,
              lastFetch: { ...get().lastFetch, media: Date.now() }
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar mídia',
              loading: false
            });
          }
        },
        
        refreshMedia: async () => {
          const { fetchMedia } = get();
          await fetchMedia();
        },
        
        searchMedia: async (query: string) => {
          const { fetchMedia } = get();
          await fetchMedia({ search: query });
        },
        
        // ===== AÇÕES DE SELEÇÃO =====
        
        selectMedia: (media: SocialMedia | null) => {
          set({ selectedMedia: media });
        },
        
        clearSelection: () => {
          set({ selectedMedia: null });
        },
        
        selectMultipleMedia: (mediaIds: string[]) => {
          set({ selectedMediaIds: mediaIds });
        },
        
        toggleMediaSelection: (mediaId: string) => {
          const { selectedMediaIds } = get();
          const isSelected = selectedMediaIds.includes(mediaId);
          
          if (isSelected) {
            set({ selectedMediaIds: selectedMediaIds.filter(id => id !== mediaId) });
          } else {
            set({ selectedMediaIds: [...selectedMediaIds, mediaId] });
          }
        },
        
        clearMultipleSelection: () => {
          set({ selectedMediaIds: [], bulkAction: null });
        },
        
        // ===== AÇÕES DE UPLOAD =====
        
        uploadMedia: async (file: File, metadata?: any) => {
          const uploadId = `upload_${Date.now()}_${Math.random()}`;
          
          // Adicionar à fila de upload
          set(state => ({
            uploadQueue: [...state.uploadQueue, {
              id: uploadId,
              file,
              progress: 0,
              status: 'pending'
            }],
            uploadProgress: { ...state.uploadProgress, [uploadId]: 0 }
          }));
          
          set({ uploading: true, error: null });
          
          try {
            // Atualizar status para uploading
            set(state => ({
              uploadQueue: state.uploadQueue.map(item => 
                item.id === uploadId ? { ...item, status: 'uploading' } : item
              )
            }));
            
            const newMedia = await mediaService.uploadMedia(file, {
              ...metadata,
              onProgress: (progress: number) => {
                set(state => ({
                  uploadProgress: { ...state.uploadProgress, [uploadId]: progress },
                  uploadQueue: state.uploadQueue.map(item => 
                    item.id === uploadId ? { ...item, progress } : item
                  )
                }));
              }
            });
            
            // Atualizar status para completed
            set(state => ({
              media: [newMedia, ...state.media],
              uploadQueue: state.uploadQueue.map(item => 
                item.id === uploadId ? { ...item, status: 'completed', progress: 100 } : item
              ),
              uploading: false
            }));
            
            return newMedia;
          } catch (error) {
            // Atualizar status para error
            set(state => ({
              uploadQueue: state.uploadQueue.map(item => 
                item.id === uploadId ? { 
                  ...item, 
                  status: 'error', 
                  error: error instanceof Error ? error.message : 'Erro no upload'
                } : item
              ),
              error: error instanceof Error ? error.message : 'Erro ao fazer upload da mídia',
              uploading: false
            }));
            throw error;
          }
        },
        
        bulkUploadMedia: async (files: File[], metadata?: any) => {
          set({ uploading: true, error: null });
          
          try {
            const newMedia = await mediaService.bulkUploadMedia(files, metadata);
            set(state => ({
              media: [...newMedia, ...state.media],
              uploading: false
            }));
            return newMedia;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao fazer upload em lote',
              uploading: false
            });
            throw error;
          }
        },
        
        retryUpload: async (uploadId: string) => {
          const { uploadQueue } = get();
          const uploadItem = uploadQueue.find(item => item.id === uploadId);
          
          if (!uploadItem) return;
          
          set({ uploading: true, error: null });
          
          try {
            const newMedia = await mediaService.uploadMedia(uploadItem.file);
            
            set(state => ({
              media: [newMedia, ...state.media],
              uploadQueue: state.uploadQueue.filter(item => item.id !== uploadId),
              uploading: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao refazer upload',
              uploading: false
            });
            throw error;
          }
        },
        
        cancelUpload: (uploadId: string) => {
          set(state => ({
            uploadQueue: state.uploadQueue.filter(item => item.id !== uploadId),
            uploadProgress: Object.fromEntries(
              Object.entries(state.uploadProgress).filter(([id]) => id !== uploadId)
            )
          }));
        },
        
        // ===== AÇÕES DE CRUD =====
        
        updateMedia: async (id: string, mediaData: UpdateMediaData) => {
          set({ updating: true, error: null });
          
          try {
            const updatedMedia = await mediaService.updateMedia(id, mediaData);
            set(state => ({
              media: state.media.map(media => 
                media.id === id ? updatedMedia : media
              ),
              selectedMedia: state.selectedMedia?.id === id ? updatedMedia : state.selectedMedia,
              updating: false
            }));
            return updatedMedia;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atualizar mídia',
              updating: false
            });
            throw error;
          }
        },
        
        deleteMedia: async (id: string) => {
          set({ deleting: true, error: null });
          
          try {
            await mediaService.deleteMedia(id);
            set(state => ({
              media: state.media.filter(media => media.id !== id),
              selectedMedia: state.selectedMedia?.id === id ? null : state.selectedMedia,
              deleting: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao deletar mídia',
              deleting: false
            });
            throw error;
          }
        },
        
        duplicateMedia: async (id: string) => {
          set({ uploading: true, error: null });
          
          try {
            const duplicatedMedia = await mediaService.duplicateMedia(id);
            set(state => ({
              media: [duplicatedMedia, ...state.media],
              uploading: false
            }));
            return duplicatedMedia;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao duplicar mídia',
              uploading: false
            });
            throw error;
          }
        },
        
        // ===== AÇÕES DE OTIMIZAÇÃO =====
        
        optimizeMedia: async (mediaId: string, options?: any) => {
          set({ optimizing: true, error: null });
          
          try {
            const optimization = await mediaService.optimizeMedia(mediaId, options);
            set(state => ({
              mediaOptimization: { ...state.mediaOptimization, [mediaId]: optimization },
              optimizing: false,
              lastFetch: { ...state.lastFetch, optimization: Date.now() }
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao otimizar mídia',
              optimizing: false
            });
          }
        },
        
        getMediaOptimization: (mediaId: string) => {
          const { mediaOptimization } = get();
          return mediaOptimization[mediaId] || null;
        },
        
        // ===== AÇÕES DE ANÁLISE =====
        
        analyzeMedia: async (mediaId: string) => {
          set({ analyzing: true, error: null });
          
          try {
            const analysis = await mediaService.analyzeMedia(mediaId);
            set(state => ({
              mediaAnalysis: { ...state.mediaAnalysis, [mediaId]: analysis },
              analyzing: false,
              lastFetch: { ...state.lastFetch, analysis: Date.now() }
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao analisar mídia',
              analyzing: false
            });
          }
        },
        
        getMediaAnalysis: (mediaId: string) => {
          const { mediaAnalysis } = get();
          return mediaAnalysis[mediaId] || null;
        },
        
        // ===== AÇÕES DE GALERIAS =====
        
        fetchMediaGalleries: async () => {
          set({ loading: true, error: null });
          
          try {
            const galleries = await mediaService.getMediaGalleries();
            set({
              mediaGalleries: galleries,
              loading: false,
              lastFetch: { ...get().lastFetch, galleries: Date.now() }
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar galerias de mídia',
              loading: false
            });
          }
        },
        
        createMediaGallery: async (galleryData: Omit<MediaGallery, 'id'>) => {
          set({ uploading: true, error: null });
          
          try {
            const newGallery = await mediaService.createMediaGallery(galleryData);
            set(state => ({
              mediaGalleries: [newGallery, ...state.mediaGalleries],
              uploading: false
            }));
            return newGallery;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao criar galeria de mídia',
              uploading: false
            });
            throw error;
          }
        },
        
        updateMediaGallery: async (id: string, galleryData: Partial<MediaGallery>) => {
          set({ updating: true, error: null });
          
          try {
            const updatedGallery = await mediaService.updateMediaGallery(id, galleryData);
            set(state => ({
              mediaGalleries: state.mediaGalleries.map(gallery => 
                gallery.id === id ? updatedGallery : gallery
              ),
              updating: false
            }));
            return updatedGallery;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao atualizar galeria de mídia',
              updating: false
            });
            throw error;
          }
        },
        
        deleteMediaGallery: async (id: string) => {
          set({ deleting: true, error: null });
          
          try {
            await mediaService.deleteMediaGallery(id);
            set(state => ({
              mediaGalleries: state.mediaGalleries.filter(gallery => gallery.id !== id),
              deleting: false
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao deletar galeria de mídia',
              deleting: false
            });
            throw error;
          }
        },
        
        // ===== AÇÕES DE ESTATÍSTICAS =====
        
        fetchMediaStats: async () => {
          set({ loading: true, error: null });
          
          try {
            const stats = await mediaService.getMediaStats();
            set({
              mediaStats: stats,
              loading: false
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Erro ao buscar estatísticas de mídia',
              loading: false
            });
          }
        },
        
        // ===== AÇÕES DE FILTROS =====
        
        setFilters: (filters: Partial<MediaSearchParams>) => {
          set(state => ({
            filters: { ...state.filters, ...filters }
          }));
        },
        
        clearFilters: () => {
          set({ filters: {} });
        },
        
        // ===== AÇÕES DE PAGINAÇÃO =====
        
        setPage: (page: number) => {
          set(state => ({
            pagination: { ...state.pagination, page }
          }));
        },
        
        setLimit: (limit: number) => {
          set(state => ({
            pagination: { ...state.pagination, limit, page: 1 }
          }));
        },
        
        // ===== AÇÕES DE ESTADO =====
        
        setLoading: (loading: boolean) => {
          set({ loading });
        },
        
        setError: (error: string | null) => {
          set({ error });
        },
        
        clearError: () => {
          set({ error: null });
        },
        
        // ===== AÇÕES DE CACHE =====
        
        clearCache: () => {
          mediaService.clearCache();
          set({
            media: [],
            mediaOptimization: {},
            mediaAnalysis: {},
            mediaGalleries: [],
            lastFetch: {
              media: null,
              optimization: null,
              analysis: null,
              galleries: null
            }
          });
        },
        
        invalidateCache: (pattern: string) => {
          mediaService.invalidateCache(pattern);
        }
      }),
      {
        name: 'social-buffer-media-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
          lastFetch: state.lastFetch,
          mediaOptimization: state.mediaOptimization,
          mediaAnalysis: state.mediaAnalysis,
          mediaGalleries: state.mediaGalleries
        })
      }
    ),
    {
      name: 'SocialBufferMediaStore'
    }
  )
);

export default useSocialMediaStore;
