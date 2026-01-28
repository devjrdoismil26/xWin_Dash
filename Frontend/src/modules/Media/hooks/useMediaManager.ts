import { useState, useCallback, useEffect } from 'react';
import { useMediaLibraryStore } from './useMediaLibraryStore';
import { useAdvancedNotifications } from '../../shared/hooks/useAdvancedNotifications';
import { MediaFolder, MediaFile, MediaBulkOperation } from '../types';

/**
 * Hook especializado para gerenciamento de pastas e operações em lote
 * Gerencia criação, atualização, exclusão de pastas e operações bulk
 */
export const useMediaManager = () => {
  const {
    folders,
    media,
    currentFolder,
    selectedMedia,
    isLoading,
    error,
    createFolder,
    updateFolder,
    deleteFolder,
    bulkOperations,
    setCurrentFolder,
    setSelectedMedia,
    clearError
  } = useMediaLibraryStore();

  const { showSuccess, showError, showWarning } = useAdvancedNotifications();
  
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isMovingItems, setIsMovingItems] = useState(false);
  const [isBulkOperating, setIsBulkOperating] = useState(false);

  // Carregar pastas inicial
  useEffect(() => {
    // As pastas são carregadas automaticamente pelo store
  }, []);

  // Limpar erros automaticamente
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  /**
   * Cria uma nova pasta
   */
  const createNewFolder = useCallback(async (
    name: string,
    parentId?: string,
    description?: string
  ) => {
    if (!name.trim()) {
      showError('Nome da pasta é obrigatório');
      return;
    }

    // Verificar se já existe pasta com o mesmo nome no mesmo nível
    const existingFolder = folders.find(folder => 
      folder.name === name.trim() && folder.parentId === parentId
    );

    if (existingFolder) {
      showError('Já existe uma pasta com este nome neste local');
      return;
    }

    setIsCreatingFolder(true);
    try {
      const newFolder: Partial<MediaFolder> = {
        name: name.trim(),
        parentId: parentId || null,
        description: description?.trim() || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await createFolder(newFolder);
      showSuccess(`Pasta "${name}" criada com sucesso`);
    } catch (err) {
      showError('Erro ao criar pasta');
      console.error('Erro ao criar pasta:', err);
    } finally {
      setIsCreatingFolder(false);
    }
  }, [createFolder, folders, showSuccess, showError]);

  /**
   * Renomeia uma pasta
   */
  const renameFolder = useCallback(async (
    folderId: string,
    newName: string
  ) => {
    if (!newName.trim()) {
      showError('Nome da pasta é obrigatório');
      return;
    }

    const folder = folders.find(f => f.id === folderId);
    if (!folder) {
      showError('Pasta não encontrada');
      return;
    }

    // Verificar se já existe pasta com o mesmo nome no mesmo nível
    const existingFolder = folders.find(f => 
      f.name === newName.trim() && 
      f.parentId === folder.parentId && 
      f.id !== folderId
    );

    if (existingFolder) {
      showError('Já existe uma pasta com este nome neste local');
      return;
    }

    try {
      await updateFolder(folderId, { name: newName.trim() });
      showSuccess(`Pasta renomeada para "${newName}"`);
    } catch (err) {
      showError('Erro ao renomear pasta');
      console.error('Erro ao renomear pasta:', err);
    }
  }, [updateFolder, folders, showSuccess, showError]);

  /**
   * Move uma pasta para outro local
   */
  const moveFolder = useCallback(async (
    folderId: string,
    newParentId: string | null
  ) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) {
      showError('Pasta não encontrada');
      return;
    }

    // Verificar se não está tentando mover para dentro de si mesma
    if (newParentId === folderId) {
      showError('Não é possível mover uma pasta para dentro de si mesma');
      return;
    }

    // Verificar se não está tentando mover para dentro de uma subpasta
    const isDescendant = (parentId: string, targetId: string): boolean => {
      const parent = folders.find(f => f.id === parentId);
      if (!parent) return false;
      if (parent.parentId === targetId) return true;
      if (parent.parentId) return isDescendant(parent.parentId, targetId);
      return false;
    };

    if (newParentId && isDescendant(folderId, newParentId)) {
      showError('Não é possível mover uma pasta para dentro de suas subpastas');
      return;
    }

    try {
      await updateFolder(folderId, { parentId: newParentId });
      showSuccess('Pasta movida com sucesso');
    } catch (err) {
      showError('Erro ao mover pasta');
      console.error('Erro ao mover pasta:', err);
    }
  }, [updateFolder, folders, showSuccess, showError]);

  /**
   * Exclui uma pasta
   */
  const deleteFolderAndContents = useCallback(async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) {
      showError('Pasta não encontrada');
      return;
    }

    // Verificar se a pasta tem conteúdo
    const folderMedia = media.filter(m => m.folderId === folderId);
    const subfolders = folders.filter(f => f.parentId === folderId);

    if (folderMedia.length > 0 || subfolders.length > 0) {
      showWarning(`A pasta "${folder.name}" contém ${folderMedia.length} arquivo(s) e ${subfolders.length} subpasta(s). Todos serão excluídos.`);
    }

    try {
      await deleteFolder(folderId);
      showSuccess(`Pasta "${folder.name}" excluída com sucesso`);
    } catch (err) {
      showError('Erro ao excluir pasta');
      console.error('Erro ao excluir pasta:', err);
    }
  }, [deleteFolder, folders, media, showSuccess, showError, showWarning]);

  /**
   * Move mídia para uma pasta
   */
  const moveMediaToFolder = useCallback(async (
    mediaIds: string[],
    targetFolderId: string | null
  ) => {
    if (!mediaIds || mediaIds.length === 0) {
      showWarning('Nenhuma mídia selecionada');
      return;
    }

    setIsMovingItems(true);
    try {
      const operation: MediaBulkOperation = {
        action: 'move',
        mediaIds,
        targetFolderId
      };

      await bulkOperations([operation]);
      showSuccess(`${mediaIds.length} arquivo(s) movido(s) com sucesso`);
    } catch (err) {
      showError('Erro ao mover arquivos');
      console.error('Erro ao mover arquivos:', err);
    } finally {
      setIsMovingItems(false);
    }
  }, [bulkOperations, showSuccess, showError, showWarning]);

  /**
   * Executa operações em lote
   */
  const executeBulkOperations = useCallback(async (operations: MediaBulkOperation[]) => {
    if (!operations || operations.length === 0) {
      showWarning('Nenhuma operação especificada');
      return;
    }

    setIsBulkOperating(true);
    try {
      await bulkOperations(operations);
      showSuccess(`${operations.length} operação(ões) executada(s) com sucesso`);
    } catch (err) {
      showError('Erro ao executar operações em lote');
      console.error('Erro nas operações em lote:', err);
    } finally {
      setIsBulkOperating(false);
    }
  }, [bulkOperations, showSuccess, showError, showWarning]);

  /**
   * Seleciona mídia
   */
  const selectMedia = useCallback((mediaId: string, multiSelect = false) => {
    if (multiSelect) {
      const isSelected = selectedMedia.includes(mediaId);
      if (isSelected) {
        setSelectedMedia(selectedMedia.filter(id => id !== mediaId));
      } else {
        setSelectedMedia([...selectedMedia, mediaId]);
      }
    } else {
      setSelectedMedia([mediaId]);
    }
  }, [selectedMedia, setSelectedMedia]);

  /**
   * Seleciona todas as mídias visíveis
   */
  const selectAllMedia = useCallback(() => {
    const visibleMedia = currentFolder 
      ? media.filter(m => m.folderId === currentFolder)
      : media.filter(m => !m.folderId);
    
    const visibleMediaIds = visibleMedia.map(m => m.id);
    setSelectedMedia(visibleMediaIds);
  }, [media, currentFolder, setSelectedMedia]);

  /**
   * Limpa seleção
   */
  const clearSelection = useCallback(() => {
    setSelectedMedia([]);
  }, [setSelectedMedia]);

  /**
   * Navega para uma pasta
   */
  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
    clearSelection(); // Limpar seleção ao navegar
  }, [setCurrentFolder, clearSelection]);

  /**
   * Obtém estrutura de pastas em árvore
   */
  const getFolderTree = useCallback((): MediaFolder[] => {
    const buildTree = (parentId: string | null = null): MediaFolder[] => {
      return folders
        .filter(folder => folder.parentId === parentId)
        .map(folder => ({
          ...folder,
          children: buildTree(folder.id)
        }));
    };

    return buildTree();
  }, [folders]);

  /**
   * Obtém caminho da pasta atual
   */
  const getCurrentFolderPath = useCallback((): MediaFolder[] => {
    if (!currentFolder) return [];

    const path: MediaFolder[] = [];
    let current = folders.find(f => f.id === currentFolder);

    while (current) {
      path.unshift(current);
      current = current.parentId ? folders.find(f => f.id === current.parentId) : undefined;
    }

    return path;
  }, [currentFolder, folders]);

  /**
   * Obtém estatísticas de uma pasta
   */
  const getFolderStats = useCallback((folderId: string) => {
    const folderMedia = media.filter(m => m.folderId === folderId);
    const subfolders = folders.filter(f => f.parentId === folderId);

    return {
      totalFiles: folderMedia.length,
      totalSize: folderMedia.reduce((sum, file) => sum + (file.size || 0), 0),
      subfolders: subfolders.length,
      types: folderMedia.reduce((acc, file) => {
        acc[file.type] = (acc[file.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [media, folders]);

  return {
    // Estado
    folders,
    media,
    currentFolder,
    selectedMedia,
    isLoading,
    error,
    isCreatingFolder,
    isMovingItems,
    isBulkOperating,

    // Ações de pasta
    createNewFolder,
    renameFolder,
    moveFolder,
    deleteFolderAndContents,

    // Ações de mídia
    moveMediaToFolder,
    executeBulkOperations,

    // Seleção
    selectMedia,
    selectAllMedia,
    clearSelection,

    // Navegação
    navigateToFolder,

    // Utilitários
    getFolderTree,
    getCurrentFolderPath,
    getFolderStats,

    // Controle de erro
    clearError
  };
};