import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useMediaLibraryStore } from '../hooks/useMediaLibraryStore';

// Mock do mediaLibraryService
vi.mock('../services/mediaLibraryService', () => ({
  mediaLibraryService: {
    getMedia: vi.fn(),
    uploadMedia: vi.fn(),
    updateMedia: vi.fn(),
    deleteMedia: vi.fn(),
    createFolder: vi.fn(),
    updateFolder: vi.fn(),
    deleteFolder: vi.fn(),
    searchMedia: vi.fn(),
    getStats: vi.fn(),
    bulkOperations: vi.fn()
  }
}));

describe('useMediaLibraryStore', () => {
  const mockMediaLibraryService = require('../services/mediaLibraryService').mediaLibraryService;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('deve inicializar com valores padrão corretos', () => {
      const { result } = renderHook(() => useMediaLibraryStore());

      expect(result.current.media).toEqual([]);
      expect(result.current.folders).toEqual([]);
      expect(result.current.currentFolder).toBeNull();
      expect(result.current.selectedMedia).toEqual([]);
      expect(result.current.stats).toEqual({
        totalFiles: 0,
        totalImages: 0,
        totalVideos: 0,
        totalDocuments: 0,
        totalAudio: 0,
        storageUsed: 0
      });
      expect(result.current.searchQuery).toBe('');
      expect(result.current.viewMode).toBe('grid');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.pagination).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
      });
    });
  });

  describe('loadMedia', () => {
    it('deve carregar mídia com sucesso', async () => {
      const mockMedia = [
        { id: '1', name: 'test.jpg', type: 'image', url: 'test.jpg' },
        { id: '2', name: 'test.mp4', type: 'video', url: 'test.mp4' }
      ];

      mockMediaLibraryService.getMedia.mockResolvedValue({
        data: mockMedia,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          itemsPerPage: 20
        }
      });

      const { result } = renderHook(() => useMediaLibraryStore());

      await act(async () => {
        await result.current.loadMedia();
      });

      expect(result.current.media).toEqual(mockMedia);
      expect(result.current.pagination.totalItems).toBe(2);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('deve lidar com erro ao carregar mídia', async () => {
      const mockError = new Error('Erro ao carregar mídia');
      mockMediaLibraryService.getMedia.mockRejectedValue(mockError);

      const { result } = renderHook(() => useMediaLibraryStore());

      await act(async () => {
        await result.current.loadMedia();
      });

      expect(result.current.error).toBe('Erro ao carregar mídia');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('uploadMedia', () => {
    it('deve fazer upload de mídia com sucesso', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockUploadedMedia = {
        id: '1',
        name: 'test.jpg',
        type: 'image',
        url: 'test.jpg'
      };

      mockMediaLibraryService.uploadMedia.mockResolvedValue(mockUploadedMedia);

      const { result } = renderHook(() => useMediaLibraryStore());

      await act(async () => {
        await result.current.uploadMedia(mockFile);
      });

      expect(result.current.media).toContain(mockUploadedMedia);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('deve lidar com erro ao fazer upload', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockError = new Error('Erro ao fazer upload');
      mockMediaLibraryService.uploadMedia.mockRejectedValue(mockError);

      const { result } = renderHook(() => useMediaLibraryStore());

      await act(async () => {
        await result.current.uploadMedia(mockFile);
      });

      expect(result.current.error).toBe('Erro ao fazer upload');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('updateMedia', () => {
    it('deve atualizar mídia com sucesso', async () => {
      const existingMedia = { id: '1', name: 'old.jpg', type: 'image' };
      const updatedMedia = { id: '1', name: 'new.jpg', type: 'image' };

      // Primeiro adiciona mídia existente
      const { result } = renderHook(() => useMediaLibraryStore());
      act(() => {
        result.current.media = [existingMedia];
      });

      mockMediaLibraryService.updateMedia.mockResolvedValue(updatedMedia);

      await act(async () => {
        await result.current.updateMedia('1', { name: 'new.jpg' });
      });

      expect(result.current.media[0]).toEqual(updatedMedia);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('deleteMedia', () => {
    it('deve excluir mídia com sucesso', async () => {
      const existingMedia = { id: '1', name: 'test.jpg', type: 'image' };

      const { result } = renderHook(() => useMediaLibraryStore());
      act(() => {
        result.current.media = [existingMedia];
      });

      mockMediaLibraryService.deleteMedia.mockResolvedValue(true);

      await act(async () => {
        await result.current.deleteMedia('1');
      });

      expect(result.current.media).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('createFolder', () => {
    it('deve criar pasta com sucesso', async () => {
      const newFolder = { id: '1', name: 'New Folder', parentId: null };

      mockMediaLibraryService.createFolder.mockResolvedValue(newFolder);

      const { result } = renderHook(() => useMediaLibraryStore());

      await act(async () => {
        await result.current.createFolder('New Folder', null);
      });

      expect(result.current.folders).toContain(newFolder);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('searchMedia', () => {
    it('deve pesquisar mídia com sucesso', async () => {
      const mockSearchResults = [
        { id: '1', name: 'test.jpg', type: 'image' }
      ];

      mockMediaLibraryService.searchMedia.mockResolvedValue(mockSearchResults);

      const { result } = renderHook(() => useMediaLibraryStore());

      await act(async () => {
        await result.current.searchMedia('test');
      });

      expect(result.current.searchQuery).toBe('test');
      expect(result.current.media).toEqual(mockSearchResults);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('setCurrentFolder', () => {
    it('deve definir pasta atual corretamente', () => {
      const { result } = renderHook(() => useMediaLibraryStore());

      act(() => {
        result.current.setCurrentFolder('1');
      });

      expect(result.current.currentFolder).toBe('1');
    });
  });

  describe('setSelectedMedia', () => {
    it('deve definir mídia selecionada corretamente', () => {
      const { result } = renderHook(() => useMediaLibraryStore());

      act(() => {
        result.current.setSelectedMedia(['1', '2']);
      });

      expect(result.current.selectedMedia).toEqual(['1', '2']);
    });
  });

  describe('setSearchQuery', () => {
    it('deve definir query de pesquisa corretamente', () => {
      const { result } = renderHook(() => useMediaLibraryStore());

      act(() => {
        result.current.setSearchQuery('test query');
      });

      expect(result.current.searchQuery).toBe('test query');
    });
  });

  describe('setViewMode', () => {
    it('deve alternar modo de visualização corretamente', () => {
      const { result } = renderHook(() => useMediaLibraryStore());

      act(() => {
        result.current.setViewMode('list');
      });

      expect(result.current.viewMode).toBe('list');

      act(() => {
        result.current.setViewMode('grid');
      });

      expect(result.current.viewMode).toBe('grid');
    });
  });

  describe('clearError', () => {
    it('deve limpar erro corretamente', () => {
      const { result } = renderHook(() => useMediaLibraryStore());

      // Primeiro define um erro
      act(() => {
        result.current.error = 'Test error';
      });

      expect(result.current.error).toBe('Test error');

      // Depois limpa o erro
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('refreshData', () => {
    it('deve atualizar dados corretamente', async () => {
      const mockMedia = [
        { id: '1', name: 'test.jpg', type: 'image' }
      ];

      mockMediaLibraryService.getMedia.mockResolvedValue({
        data: mockMedia,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 20
        }
      });

      const { result } = renderHook(() => useMediaLibraryStore());

      await act(async () => {
        await result.current.refreshData();
      });

      expect(result.current.media).toEqual(mockMedia);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});