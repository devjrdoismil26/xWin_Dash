/**
 * Hook simplificado para os componentes da MediaLibrary
 * Fornece as funcionalidades básicas necessárias para os componentes
 */

import { useState, useCallback, useMemo } from 'react';
import { useMediaLibrary } from './useMediaLibrary';
import { MediaItem, Folder, MediaStats, Breadcrumb } from '../types/basicTypes';

export const useMediaLibrarySimple = () => {
  const mediaLibrary = useMediaLibrary();
  
  // Estados locais para os componentes
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<any>(null);

  // Dados filtrados
  const filteredMedia = useMemo(() => {
    let filtered = mediaLibrary.media || [];
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedFolder) {
      filtered = filtered.filter(item => item.folderId === selectedFolder.id);
    }
    
    return filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [mediaLibrary.media, searchTerm, selectedFolder, sortBy, sortOrder]);

  const filteredFolders = useMemo(() => {
    let filtered = mediaLibrary.folders || [];
    
    if (searchTerm) {
      filtered = filtered.filter(folder => 
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [mediaLibrary.folders, searchTerm, sortBy, sortOrder]);

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!selectedFolder) return [];
    
    const crumbs = [];
    let current = selectedFolder;
    
    while (current) {
      crumbs.unshift({ name: current.name, id: current.id });
      current = current.parent;
    }
    
    return crumbs;
  }, [selectedFolder]);

  // Ações
  const handleSelectItem = useCallback((id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === filteredMedia.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMedia.map(item => item.id));
    }
  }, [selectedItems.length, filteredMedia]);

  const handleFolderClick = useCallback((folder: any) => {
    setSelectedFolder(folder);
    setSelectedItems([]);
  }, []);

  const handleMediaClick = useCallback((media: any) => {
    // Implementar preview ou ação específica
    console.log('Media clicked:', media);
  }, []);

  const handleUpload = useCallback(() => {
    // Implementar upload
    console.log('Upload triggered');
  }, []);

  const handleCreateFolder = useCallback(() => {
    // Implementar criação de pasta
    console.log('Create folder triggered');
  }, []);

  const handleRefresh = useCallback(() => {
    mediaLibrary.getMedia();
    mediaLibrary.getFolders();
  }, [mediaLibrary]);

  const handleDownload = useCallback((items: any[]) => {
    // Implementar download
    console.log('Download items:', items);
  }, []);

  const handlePreview = useCallback((item: any) => {
    // Implementar preview
    console.log('Preview item:', item);
  }, []);

  const handleEdit = useCallback((item: any) => {
    // Implementar edição
    console.log('Edit item:', item);
  }, []);

  const handleDelete = useCallback((items: any[]) => {
    // Implementar exclusão
    console.log('Delete items:', items);
  }, []);

  // Funções auxiliares
  const getTotalMedia = useCallback(() => {
    return mediaLibrary.media?.length || 0;
  }, [mediaLibrary.media]);

  const getImages = useCallback(() => {
    return mediaLibrary.media?.filter(item => item.type === 'image') || [];
  }, [mediaLibrary.media]);

  const getVideos = useCallback(() => {
    return mediaLibrary.media?.filter(item => item.type === 'video') || [];
  }, [mediaLibrary.media]);

  const getDocuments = useCallback(() => {
    return mediaLibrary.media?.filter(item => item.type === 'document') || [];
  }, [mediaLibrary.media]);

  const getAudio = useCallback(() => {
    return mediaLibrary.media?.filter(item => item.type === 'audio') || [];
  }, [mediaLibrary.media]);

  const getStorageUsage = useCallback(() => {
    return mediaLibrary.media?.reduce((total, item) => total + item.size, 0) / (1024 * 1024 * 1024) || 0;
  }, [mediaLibrary.media]);

  const getRecentActivity = useCallback(() => {
    // Implementar lógica de atividade recente
    return Math.floor(Math.random() * 20);
  }, []);

  return {
    // Estados
    searchTerm,
    setSearchTerm,
    currentView,
    setCurrentView,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedItems,
    selectedFolder,
    
    // Dados
    mediaItems: filteredMedia,
    folders: filteredFolders,
    stats: mediaLibrary.stats,
    breadcrumbs,
    
    // Estados do hook principal
    loading: mediaLibrary.loading,
    error: mediaLibrary.error,
    
    // Ações
    handleSelectItem,
    handleSelectAll,
    handleFolderClick,
    handleMediaClick,
    handleUpload,
    handleCreateFolder,
    handleRefresh,
    handleDownload,
    handlePreview,
    handleEdit,
    handleDelete,
    
    // Funções auxiliares
    getTotalMedia,
    getImages,
    getVideos,
    getDocuments,
    getAudio,
    getStorageUsage,
    getRecentActivity,
    
    // Upload
    uploadProgress: 0,
    isUploading: false,
    uploadError: null
  };
};
