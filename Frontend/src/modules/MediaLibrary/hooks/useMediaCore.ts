import { useState, useCallback, useEffect } from 'react';
import { useMediaLibraryStore } from './useMediaLibraryStore';
import { useAdvancedNotifications } from '@/shared/hooks/useAdvancedNotifications';
import { MediaFile, MediaFolder, MediaUploadConfig } from '../types';

/**
 * Hook especializado para operações básicas de mídia
 * Gerencia carregamento, upload, atualização e exclusão de arquivos
 */
export const useMediaCore = () => {
  const {
    media,
    folders,
    currentFolder,
    isLoading,
    error,
    loadMedia,
    uploadMedia,
    updateMedia,
    deleteMedia,
    clearError
  } = useMediaLibraryStore();

  const { showSuccess, showError, showWarning } = useAdvancedNotifications();

  const [uploadConfig, setUploadConfig] = useState<MediaUploadConfig>({
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['image/*', 'video/*', 'application/pdf', 'text/*'],
    chunkSize: 1024 * 1024, // 1MB
    retryAttempts: 3,
    retryDelay: 1000
  });

  // Carregar mídia inicial
  useEffect(() => {
    loadMedia();

  }, [loadMedia]);

  // Limpar erros automaticamente após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();

      }, 5000);

      return () => clearTimeout(timer);

    } , [error, clearError]);

  /**
   * Carrega mídia com filtros opcionais
   */
  const loadMediaWithFilters = useCallback(async (filters?: {
    folderId?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      await loadMedia(filters);

      showSuccess('Mídia carregada com sucesso');

    } catch (err) {
      showError('Erro ao carregar mídia');

      console.error('Erro ao carregar mídia:', err);

    } , [loadMedia, showSuccess, showError]);

  /**
   * Faz upload de arquivos com validação
   */
  const uploadFiles = useCallback(async (files: File[], folderId?: string) => {
    if (!files || files.length === 0) {
      showWarning('Nenhum arquivo selecionado');

      return;
    }

    // Validar arquivos
    const validFiles = files.filter(file => {
      // Verificar tamanho
      if (file.size > uploadConfig.maxFileSize) {
        showWarning(`Arquivo ${file.name} excede o tamanho máximo de ${uploadConfig.maxFileSize / (1024 * 1024)}MB`);

        return false;
      }

      // Verificar tipo
      const isValidType = uploadConfig.allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));

        }
        return file.type === type;
      });

      if (!isValidType) {
        showWarning(`Tipo de arquivo ${file.type} não é permitido`);

        return false;
      }

      return true;
    });

    if (validFiles.length === 0) {
      showError('Nenhum arquivo válido para upload');

      return;
    }

    try {
      const results = await Promise.all(
        validFiles.map(file => uploadMedia(file, folderId)));

      const successCount = results.filter(result => result.success).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        showSuccess(`${successCount} arquivo(s) enviado(s) com sucesso`);

      }

      if (failCount > 0) {
        showWarning(`${failCount} arquivo(s) falharam no upload`);

      }

      return results;
    } catch (err) {
      showError('Erro durante o upload');

      console.error('Erro no upload:', err);

      throw err;
    } , [uploadMedia, uploadConfig, showSuccess, showError, showWarning]);

  /**
   * Atualiza metadados de um arquivo de mídia
   */
  const updateMediaMetadata = useCallback(async (
    mediaId: string,
    metadata: Partial<MediaFile />
  ) => {
    try {
      await updateMedia(mediaId, metadata);

      showSuccess('Mídia atualizada com sucesso');

    } catch (err) {
      showError('Erro ao atualizar mídia');

      console.error('Erro ao atualizar mídia:', err);

      throw err;
    } , [updateMedia, showSuccess, showError]);

  /**
   * Exclui um arquivo de mídia
   */
  const deleteMediaFile = useCallback(async (mediaId: string) => {
    try {
      await deleteMedia(mediaId);

      showSuccess('Mídia excluída com sucesso');

    } catch (err) {
      showError('Erro ao excluir mídia');

      console.error('Erro ao excluir mídia:', err);

      throw err;
    } , [deleteMedia, showSuccess, showError]);

  /**
   * Exclui múltiplos arquivos de mídia
   */
  const deleteMultipleMedia = useCallback(async (mediaIds: string[]) => {
    if (!mediaIds || mediaIds.length === 0) {
      showWarning('Nenhuma mídia selecionada para exclusão');

      return;
    }

    try {
      await Promise.all(mediaIds.map(id => deleteMedia(id)));

      showSuccess(`${mediaIds.length} arquivo(s) excluído(s) com sucesso`);

    } catch (err) {
      showError('Erro ao excluir mídia');

      console.error('Erro ao excluir múltiplas mídias:', err);

      throw err;
    } , [deleteMedia, showSuccess, showError, showWarning]);

  /**
   * Obtém informações de um arquivo específico
   */
  const getMediaInfo = useCallback((mediaId: string): MediaFile | undefined => {
    return media.find(item => item.id === mediaId);

  }, [media]);

  /**
   * Obtém mídia por tipo
   */
  const getMediaByType = useCallback((type: string): MediaFile[] => {
    return media.filter(item => item.type === type);

  }, [media]);

  /**
   * Obtém mídia da pasta atual
   */
  const getCurrentFolderMedia = useCallback((): MediaFile[] => {
    return media.filter(item => item.folderId === currentFolder);

  }, [media, currentFolder]);

  /**
   * Valida configuração de upload
   */
  const validateUploadConfig = useCallback((config: Partial<MediaUploadConfig>): boolean => {
    if (config.maxFileSize && config.maxFileSize <= 0) {
      showError('Tamanho máximo de arquivo deve ser maior que 0');

      return false;
    }

    if (config.allowedTypes && config.allowedTypes.length === 0) {
      showError('Pelo menos um tipo de arquivo deve ser permitido');

      return false;
    }

    if (config.chunkSize && config.chunkSize <= 0) {
      showError('Tamanho do chunk deve ser maior que 0');

      return false;
    }

    return true;
  }, [showError]);

  /**
   * Atualiza configuração de upload
   */
  const updateUploadConfig = useCallback((config: Partial<MediaUploadConfig>) => {
    if (validateUploadConfig(config)) {
      setUploadConfig(prev => ({ ...prev, ...config }));

      showSuccess('Configuração de upload atualizada');

    } , [validateUploadConfig, showSuccess]);

  return {
    // Estado
    media,
    folders,
    currentFolder,
    isLoading,
    error,
    uploadConfig,

    // Ações básicas
    loadMediaWithFilters,
    uploadFiles,
    updateMediaMetadata,
    deleteMediaFile,
    deleteMultipleMedia,

    // Utilitários
    getMediaInfo,
    getMediaByType,
    getCurrentFolderMedia,
    validateUploadConfig,
    updateUploadConfig,

    // Controle de erro
    clearError};
};
