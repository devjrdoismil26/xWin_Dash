import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import MediaLibraryModule from '../MediaLibraryModule';

// Mock dos hooks
vi.mock('../hooks/useMediaLibraryStore');
vi.mock('../hooks/useMediaUpload');
vi.mock('../hooks/useMediaSelector');
vi.mock('../../shared/hooks/useAdvancedNotifications');

// Mock do AppLayout
vi.mock('../../shared/components/AppLayout', () => ({
  default: function MockAppLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="app-layout">{children}</div>;
  }
}));

// Mock do Head
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock do ErrorBoundary
vi.mock('../../shared/components/ErrorBoundary', () => ({
  default: function MockErrorBoundary({ children }: { children: React.ReactNode }) {
    return <div data-testid="error-boundary">{children}</div>;
  }
}));

// Mock do PageTransition
vi.mock('../../shared/components/PageTransition', () => ({
  default: function MockPageTransition({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-transition">{children}</div>;
  }
}));

describe('MediaLibraryModule - Integration Tests', () => {
  const mockMediaLibraryStore = {
    media: [
      { id: '1', name: 'test1.jpg', type: 'image', url: 'test1.jpg', size: 1024 },
      { id: '2', name: 'test2.mp4', type: 'video', url: 'test2.mp4', size: 2048 }
    ],
    folders: [
      { id: '1', name: 'Images', parentId: null },
      { id: '2', name: 'Videos', parentId: null }
    ],
    currentFolder: null,
    selectedMedia: [],
    stats: {
      totalFiles: 2,
      totalImages: 1,
      totalVideos: 1,
      totalDocuments: 0,
      totalAudio: 0,
      storageUsed: 3072
    },
    searchQuery: '',
    viewMode: 'grid' as const,
    isLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      itemsPerPage: 20
    },
    loadMedia: vi.fn(),
    loadFolders: vi.fn(),
    uploadMedia: vi.fn(),
    updateMedia: vi.fn(),
    deleteMedia: vi.fn(),
    createFolder: vi.fn(),
    updateFolder: vi.fn(),
    deleteFolder: vi.fn(),
    bulkOperations: vi.fn(),
    searchMedia: vi.fn(),
    setCurrentFolder: vi.fn(),
    setSelectedMedia: vi.fn(),
    setSearchQuery: vi.fn(),
    setViewMode: vi.fn(),
    loadStats: vi.fn(),
    setPage: vi.fn(),
    clearError: vi.fn(),
    refreshData: vi.fn()
  };

  const mockMediaUpload = {
    uploadFiles: vi.fn(),
    cancelUpload: vi.fn(),
    clearUploads: vi.fn(),
    uploads: [],
    isUploading: false,
    uploadProgress: 0,
    uploadStatus: 'idle' as const
  };

  const mockMediaSelector = {
    isOpen: false,
    selectedMedia: [],
    openSelector: vi.fn(),
    closeSelector: vi.fn(),
    selectMedia: vi.fn(),
    clearSelection: vi.fn()
  };

  const mockNotifications = {
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showWarning: vi.fn(),
    showInfo: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock dos módulos
    require('../hooks/useMediaLibraryStore').useMediaLibraryStore.mockReturnValue(mockMediaLibraryStore);
    require('../hooks/useMediaUpload').useMediaUpload.mockReturnValue(mockMediaUpload);
    require('../hooks/useMediaSelector').useMediaSelector.mockReturnValue(mockMediaSelector);
    require('../../shared/hooks/useAdvancedNotifications').useAdvancedNotifications.mockReturnValue(mockNotifications);
  });

  const renderMediaLibraryModule = () => {
    return render(<MediaLibraryModule />);
  };

  describe('Renderização inicial', () => {
    it('deve renderizar o módulo corretamente', () => {
      renderMediaLibraryModule();

      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByTestId('page-transition')).toBeInTheDocument();
    });

    it('deve exibir estatísticas corretas', () => {
      renderMediaLibraryModule();

      expect(screen.getByText('2')).toBeInTheDocument(); // Total files
      expect(screen.getByText('1')).toBeInTheDocument(); // Images
      expect(screen.getByText('1')).toBeInTheDocument(); // Videos
    });
  });

  describe('Interação com mídia', () => {
    it('deve permitir seleção de arquivos', async () => {
      renderMediaLibraryModule();

      const mediaItem = screen.getByText('test1.jpg');
      fireEvent.click(mediaItem);

      await waitFor(() => {
        expect(mockMediaLibraryStore.setSelectedMedia).toHaveBeenCalled();
      });
    });

    it('deve permitir navegação entre pastas', async () => {
      renderMediaLibraryModule();

      const folderItem = screen.getByText('Images');
      fireEvent.click(folderItem);

      await waitFor(() => {
        expect(mockMediaLibraryStore.setCurrentFolder).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Upload de arquivos', () => {
    it('deve permitir upload de arquivos', async () => {
      renderMediaLibraryModule();

      const uploadButton = screen.getByText('Upload');
      fireEvent.click(uploadButton);

      // Simular seleção de arquivo
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByTestId('file-input');
      
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockMediaUpload.uploadFiles).toHaveBeenCalledWith([file]);
      });
    });

    it('deve exibir progresso de upload', async () => {
      const mockUploadWithProgress = {
        ...mockMediaUpload,
        isUploading: true,
        uploadProgress: 50,
        uploadStatus: 'uploading' as const
      };

      require('../hooks/useMediaUpload').useMediaUpload.mockReturnValue(mockUploadWithProgress);

      renderMediaLibraryModule();

      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('Busca e filtros', () => {
    it('deve permitir busca por texto', async () => {
      renderMediaLibraryModule();

      const searchInput = screen.getByPlaceholderText('Buscar arquivos...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      await waitFor(() => {
        expect(mockMediaLibraryStore.setSearchQuery).toHaveBeenCalledWith('test');
      });
    });

    it('deve permitir alternar modo de visualização', async () => {
      renderMediaLibraryModule();

      const viewToggle = screen.getByTestId('view-toggle');
      fireEvent.click(viewToggle);

      await waitFor(() => {
        expect(mockMediaLibraryStore.setViewMode).toHaveBeenCalledWith('list');
      });
    });
  });

  describe('Criação de pastas', () => {
    it('deve permitir criação de nova pasta', async () => {
      renderMediaLibraryModule();

      const createFolderButton = screen.getByText('Nova Pasta');
      fireEvent.click(createFolderButton);

      // Simular preenchimento do modal
      const folderNameInput = screen.getByPlaceholderText('Nome da pasta');
      fireEvent.change(folderNameInput, { target: { value: 'Nova Pasta' } });

      const confirmButton = screen.getByText('Criar');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockMediaLibraryStore.createFolder).toHaveBeenCalled();
      });
    });
  });

  describe('Operações em lote', () => {
    it('deve permitir seleção múltipla', async () => {
      renderMediaLibraryModule();

      const selectAllButton = screen.getByText('Selecionar Todos');
      fireEvent.click(selectAllButton);

      await waitFor(() => {
        expect(mockMediaLibraryStore.setSelectedMedia).toHaveBeenCalledWith(['1', '2']);
      });
    });

    it('deve permitir exclusão em lote', async () => {
      const mockStoreWithSelection = {
        ...mockMediaLibraryStore,
        selectedMedia: ['1', '2']
      };

      require('../hooks/useMediaLibraryStore').useMediaLibraryStore.mockReturnValue(mockStoreWithSelection);

      renderMediaLibraryModule();

      const deleteButton = screen.getByText('Excluir Selecionados');
      fireEvent.click(deleteButton);

      // Confirmar exclusão
      const confirmButton = screen.getByText('Confirmar');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockMediaLibraryStore.deleteMedia).toHaveBeenCalled();
      });
    });
  });

  describe('Tratamento de erros', () => {
    it('deve exibir mensagem de erro quando houver erro', () => {
      const mockStoreWithError = {
        ...mockMediaLibraryStore,
        error: 'Erro ao carregar mídia'
      };

      require('../hooks/useMediaLibraryStore').useMediaLibraryStore.mockReturnValue(mockStoreWithError);

      renderMediaLibraryModule();

      expect(screen.getByText('Erro ao carregar mídia')).toBeInTheDocument();
    });

    it('deve permitir limpar erro', async () => {
      const mockStoreWithError = {
        ...mockMediaLibraryStore,
        error: 'Erro ao carregar mídia'
      };

      require('../hooks/useMediaLibraryStore').useMediaLibraryStore.mockReturnValue(mockStoreWithError);

      renderMediaLibraryModule();

      const clearErrorButton = screen.getByText('Limpar Erro');
      fireEvent.click(clearErrorButton);

      await waitFor(() => {
        expect(mockMediaLibraryStore.clearError).toHaveBeenCalled();
      });
    });
  });

  describe('Estados de carregamento', () => {
    it('deve exibir indicador de carregamento', () => {
      const mockStoreWithLoading = {
        ...mockMediaLibraryStore,
        isLoading: true
      };

      require('../hooks/useMediaLibraryStore').useMediaLibraryStore.mockReturnValue(mockStoreWithLoading);

      renderMediaLibraryModule();

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('deve exibir estado vazio quando não há mídia', () => {
      const mockStoreEmpty = {
        ...mockMediaLibraryStore,
        media: []
      };

      require('../hooks/useMediaLibraryStore').useMediaLibraryStore.mockReturnValue(mockStoreEmpty);

      renderMediaLibraryModule();

      expect(screen.getByText('Nenhum arquivo encontrado')).toBeInTheDocument();
    });
  });
});