/**
 * Testes de integração para o módulo MediaLibrary
 * Testa a integração entre componentes, hooks e serviços
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MediaLibraryModule from '../MediaLibraryModule';
import { useMediaLibraryStore } from '../hooks/useMediaLibraryStore';

// Mock do store
vi.mock('../hooks/useMediaLibraryStore', () => ({
  useMediaLibraryStore: vi.fn()
}));

const mockUseMediaLibraryStore = vi.mocked(useMediaLibraryStore);

describe('MediaLibrary Integration Tests', () => {
  beforeEach(() => {
    mockUseMediaLibraryStore.mockReturnValue({
      media: [
        {
          id: '1',
          name: 'test-image.jpg',
          type: 'image',
          size: 1024000,
          modifiedAt: '2024-01-01T00:00:00Z',
          folderId: 'folder1',
          url: '/media/test-image.jpg',
          thumbnail: '/thumbnails/test-image.jpg'
        },
        {
          id: '2',
          name: 'test-video.mp4',
          type: 'video',
          size: 10240000,
          modifiedAt: '2024-01-02T00:00:00Z',
          folderId: 'folder1',
          url: '/media/test-video.mp4'
        }
      ],
      folders: [
        {
          id: 'folder1',
          name: 'Test Folder',
          itemCount: 2,
          size: 11264000,
          modifiedAt: '2024-01-02T00:00:00Z'
        }
      ],
      currentFolder: null,
      selectedMedia: [],
      mediaStats: {
        total: 2,
        images: 1,
        videos: 1,
        documents: 0,
        audio: 0,
        storageUsage: 0.01,
        recentActivity: 2
      },
      storageStats: null,
      searchQuery: '',
      currentView: 'grid',
      loading: false,
      error: null,
      pagination: {
        current_page: 1,
        per_page: 20,
        total: 2,
        last_page: 1
      },
      fetchMedia: vi.fn(),
      fetchMediaById: vi.fn(),
      uploadMedia: vi.fn(),
      updateMedia: vi.fn(),
      deleteMedia: vi.fn(),
      bulkDeleteMedia: vi.fn(),
      downloadMedia: vi.fn(),
      bulkDownloadMedia: vi.fn(),
      fetchFolders: vi.fn(),
      createFolder: vi.fn(),
      updateFolder: vi.fn(),
      deleteFolder: vi.fn(),
      moveToFolder: vi.fn(),
      setSearchQuery: vi.fn(),
      setCurrentView: vi.fn(),
      setCurrentFolder: vi.fn(),
      clearFilters: vi.fn(),
      selectMedia: vi.fn(),
      deselectMedia: vi.fn(),
      selectAllMedia: vi.fn(),
      clearSelection: vi.fn(),
      toggleMediaSelection: vi.fn(),
      fetchStats: vi.fn(),
      fetchStorageStats: vi.fn(),
      setPage: vi.fn(),
      setPerPage: vi.fn(),
      nextPage: vi.fn(),
      prevPage: vi.fn(),
      reset: vi.fn()
    });
  });

  describe('Component Integration', () => {
    it('deve integrar todos os componentes corretamente', async () => {
      render(<MediaLibraryModule />);
      
      // Verificar se todos os componentes principais estão presentes
      await waitFor(() => {
        expect(screen.getByText('Controles Principais')).toBeInTheDocument();
        expect(screen.getByText('Upload de Arquivos')).toBeInTheDocument();
        expect(screen.getByText('Total de Arquivos')).toBeInTheDocument();
      });
    });

    it('deve permitir navegação entre pastas', async () => {
      const setCurrentFolder = vi.fn();
      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        setCurrentFolder
      });

      render(<MediaLibraryModule />);
      
      // Simular clique em uma pasta
      const folderElement = screen.getByText('Test Folder');
      fireEvent.click(folderElement);
      
      expect(setCurrentFolder).toHaveBeenCalledWith('folder1');
    });

    it('deve permitir seleção de arquivos', async () => {
      const toggleMediaSelection = vi.fn();
      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        toggleMediaSelection
      });

      render(<MediaLibraryModule />);
      
      // Simular seleção de arquivo
      const mediaElement = screen.getByText('test-image.jpg');
      fireEvent.click(mediaElement);
      
      expect(toggleMediaSelection).toHaveBeenCalledWith('1');
    });
  });

  describe('Search Integration', () => {
    it('deve integrar busca com filtros', async () => {
      const setSearchQuery = vi.fn();
      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        setSearchQuery
      });

      render(<MediaLibraryModule />);
      
      const searchInput = screen.getByPlaceholderText('Buscar arquivos...');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      expect(setSearchQuery).toHaveBeenCalledWith('test');
    });

    it('deve filtrar resultados baseado na busca', async () => {
      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        searchQuery: 'image',
        media: [
          {
            id: '1',
            name: 'test-image.jpg',
            type: 'image',
            size: 1024000,
            modifiedAt: '2024-01-01T00:00:00Z',
            folderId: 'folder1',
            url: '/media/test-image.jpg',
            thumbnail: '/thumbnails/test-image.jpg'
          }
        ]
      });

      render(<MediaLibraryModule />);
      
      await waitFor(() => {
        expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
        expect(screen.queryByText('test-video.mp4')).not.toBeInTheDocument();
      });
    });
  });

  describe('Upload Integration', () => {
    it('deve integrar upload com o store', async () => {
      const uploadMedia = vi.fn();
      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        uploadMedia
      });

      render(<MediaLibraryModule />);
      
      const uploadButton = screen.getByText('Upload');
      fireEvent.click(uploadButton);
      
      // Simular seleção de arquivo
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = document.createElement('input');
      input.type = 'file';
      input.files = [file];
      
      fireEvent.change(input);
      
      expect(uploadMedia).toHaveBeenCalled();
    });

    it('deve exibir progresso de upload', async () => {
      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        loading: true
      });

      render(<MediaLibraryModule />);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
    });
  });

  describe('View Integration', () => {
    it('deve alternar entre visualizações', async () => {
      const setCurrentView = vi.fn();
      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        setCurrentView
      });

      render(<MediaLibraryModule />);
      
      const gridButton = screen.getByRole('button', { name: /grid/i });
      fireEvent.click(gridButton);
      
      expect(setCurrentView).toHaveBeenCalledWith('grid');
    });

    it('deve exibir lista quando view for list', async () => {
      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        currentView: 'list'
      });

      render(<MediaLibraryModule />);
      
      await waitFor(() => {
        expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
        expect(screen.getByText('test-video.mp4')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('deve exibir erros do store', async () => {
      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        error: 'Erro ao carregar dados'
      });

      render(<MediaLibraryModule />);
      
      await waitFor(() => {
        expect(screen.getByText(/erro/i)).toBeInTheDocument();
      });
    });

    it('deve permitir retry após erro', async () => {
      const fetchMedia = vi.fn();
      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        error: 'Erro ao carregar dados',
        fetchMedia
      });

      render(<MediaLibraryModule />);
      
      const retryButton = screen.getByText(/tentar novamente/i);
      fireEvent.click(retryButton);
      
      expect(fetchMedia).toHaveBeenCalled();
    });
  });

  describe('Performance Integration', () => {
    it('deve carregar rapidamente com dados grandes', async () => {
      const largeMedia = Array.from({ length: 1000 }, (_, i) => ({
        id: `media-${i}`,
        name: `file-${i}.jpg`,
        type: 'image',
        size: 1024000,
        modifiedAt: '2024-01-01T00:00:00Z',
        folderId: 'folder1',
        url: `/media/file-${i}.jpg`
      }));

      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        media: largeMedia
      });

      const startTime = performance.now();
      render(<MediaLibraryModule />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(200);
    });

    it('deve otimizar re-renders', async () => {
      const setCurrentView = vi.fn();
      mockUseMediaLibraryStore.mockReturnValue({
        ...mockUseMediaLibraryStore(),
        setCurrentView
      });

      render(<MediaLibraryModule />);
      
      // Múltiplas mudanças de view
      const gridButton = screen.getByRole('button', { name: /grid/i });
      fireEvent.click(gridButton);
      fireEvent.click(gridButton);
      fireEvent.click(gridButton);
      
      // Deve chamar apenas uma vez devido à memoização
      expect(setCurrentView).toHaveBeenCalledTimes(1);
    });
  });
});
