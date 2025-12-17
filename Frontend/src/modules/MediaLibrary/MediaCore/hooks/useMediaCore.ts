import { useState } from 'react';
import { useMediaCRUD } from './useMediaCRUD';
import { useMediaSearch } from './useMediaSearch';
import { useMediaFolders } from './useMediaFolders';
import type { MediaSearchFilters } from '@/types/search.types';

export const useMediaCore = () => {
  const crud = useMediaCRUD();

  const search = useMediaSearch();

  const folders = useMediaFolders();

  const [filters, setFilters] = useState<MediaSearchFilters>({});

  return {
    // State
    media: crud.media,
    currentMedia: crud.currentMedia,
    folders: folders.folders,
    currentFolder: folders.currentFolder,
    searchResults: search.searchResults,
    filters,
    setFilters,
    
    // CRUD
    getMedia: crud.getMedia,
    getMediaById: crud.getById,
    createMedia: crud.create,
    updateMedia: crud.update,
    deleteMedia: crud.remove,
    bulkUpdateMedia: crud.bulkUpdate,
    bulkDeleteMedia: crud.bulkRemove,
    
    // Search
    searchMedia: search.search,
    getMediaByType: search.getByType,
    getMediaByFolder: search.getByFolder,
    
    // Folders
    getFolders: folders.getFolders,
    createFolder: folders.create,
    updateFolder: folders.update,
    deleteFolder: folders.remove,
    setCurrentFolder: folders.setCurrentFolder,
    
    // Combined loading/error
    loading: crud.loading || search.loading || folders.loading,
    error: crud.error || search.error || folders.error};
};
