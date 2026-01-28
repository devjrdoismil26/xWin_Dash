/**
 * Hook orquestrador do módulo MediaLibrary
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useMediaLibraryStore } from './useMediaLibraryStore';
import { useMediaUpload } from './useMediaUpload';
import { useMediaSelector } from './useMediaSelector';
import { MediaFile, MediaFilters } from '../types';

interface UseMediaLibraryReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  
  // Dados principais
  mediaFiles: MediaFile[];
  currentMedia: MediaFile | null;
  
  // Ações principais
  loadMedia: (filters?: MediaFilters) => Promise<void>;
  uploadMedia: (file: File) => Promise<MediaFile>;
  updateMedia: (id: string, data: any) => Promise<MediaFile>;
  deleteMedia: (id: string) => Promise<void>;
  
  // Hooks especializados
  upload: ReturnType<typeof useMediaUpload>;
  selector: ReturnType<typeof useMediaSelector>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useMediaLibrary = (): UseMediaLibraryReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();
  const store = useMediaLibraryStore();
  const upload = useMediaUpload();
  const selector = useMediaSelector();
  
  // Lógica de orquestração
  const loadMedia = useCallback(async (filters?: MediaFilters) => {
    try {
      await store.loadMedia(filters);
      showSuccess('Mídia carregada com sucesso!');
    } catch (error: any) {
      showError('Erro ao carregar mídia', error.message);
    }
  }, [store, showSuccess, showError]);
  
  const uploadMedia = useCallback(async (file: File) => {
    try {
      const result = await upload.uploadFile(file);
      showSuccess('Mídia enviada com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao enviar mídia', error.message);
      throw error;
    }
  }, [upload, showSuccess, showError]);
  
  const updateMedia = useCallback(async (id: string, data: any) => {
    try {
      const result = await store.updateMedia(id, data);
      showSuccess('Mídia atualizada com sucesso!');
      return result;
    } catch (error: any) {
      showError('Erro ao atualizar mídia', error.message);
      throw error;
    }
  }, [store, showSuccess, showError]);
  
  const deleteMedia = useCallback(async (id: string) => {
    try {
      await store.deleteMedia(id);
      showSuccess('Mídia excluída com sucesso!');
    } catch (error: any) {
      showError('Erro ao excluir mídia', error.message);
      throw error;
    }
  }, [store, showSuccess, showError]);
  
  // Inicialização
  useEffect(() => {
    loadMedia();
  }, []);
  
  return {
    loading: store.loading || upload.loading || selector.loading,
    error: store.error || upload.error || selector.error,
    mediaFiles: store.mediaFiles,
    currentMedia: store.currentMedia,
    loadMedia,
    uploadMedia,
    updateMedia,
    deleteMedia,
    upload,
    selector,
    clearError: () => {
      store.clearError();
      upload.clearError();
      selector.clearError();
    },
    refresh: loadMedia
  };
};