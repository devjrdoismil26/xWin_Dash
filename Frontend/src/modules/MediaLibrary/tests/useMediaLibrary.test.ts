import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useMediaLibrary } from '../hooks/useMediaLibrary';

// Mock dos hooks e serviços
vi.mock("../hooks/useMediaLibraryStore");

vi.mock("../hooks/useMediaUpload");

vi.mock("../hooks/useMediaSelector");

vi.mock("../../shared/hooks/useAdvancedNotifications");

describe("useMediaLibrary", () => {
  const mockMediaLibraryStore = {
    media: [],
    folders: [],
    currentFolder: null,
    selectedMedia: [],
    stats: {
      totalFiles: 0,
      totalImages: 0,
      totalVideos: 0,
      totalDocuments: 0,
      totalAudio: 0,
      storageUsed: 0,
    },
    searchQuery: "",
    viewMode: "grid" as const,
    isLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20,
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
    refreshData: vi.fn(),};

  const mockMediaUpload = {
    uploadFiles: vi.fn(),
    cancelUpload: vi.fn(),
    clearUploads: vi.fn(),
    uploads: [],
    isUploading: false,
    uploadProgress: 0,
    uploadStatus: "idle" as const,};

  const mockMediaSelector = {
    isOpen: false,
    selectedMedia: [],
    openSelector: vi.fn(),
    closeSelector: vi.fn(),
    selectMedia: vi.fn(),
    clearSelection: vi.fn(),};

  const mockNotifications = {
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showWarning: vi.fn(),
    showInfo: vi.fn(),};

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock dos módulos
    require("../hooks/useMediaLibraryStore").useMediaLibraryStore.mockReturnValue(
      mockMediaLibraryStore,);

    require("../hooks/useMediaUpload").useMediaUpload.mockReturnValue(
      mockMediaUpload,);

    require("../hooks/useMediaSelector").useMediaSelector.mockReturnValue(
      mockMediaSelector,);

    require("../../shared/hooks/useAdvancedNotifications").useAdvancedNotifications.mockReturnValue(
      mockNotifications,);

  });

  describe("Inicialização", () => {
    it("deve inicializar corretamente com valores padrão", () => {
      const { result } = renderHook(() => useMediaLibrary());

      expect(result.current.media).toEqual([]);

      expect(result.current.folders).toEqual([]);

      expect(result.current.currentFolder).toBeNull();

      expect(result.current.selectedMedia).toEqual([]);

      expect(result.current.isLoading).toBe(false);

      expect(result.current.error).toBeNull();

    });

    it("deve expor hooks especializados", () => {
      const { result } = renderHook(() => useMediaLibrary());

      expect(result.current.useMediaCore).toBeDefined();

      expect(result.current.useMediaManager).toBeDefined();

      expect(result.current.useMediaAnalytics).toBeDefined();

      expect(result.current.useMediaAI).toBeDefined();

    });

  });

  describe("Carregamento de dados", () => {
    it("deve carregar mídia corretamente", async () => {
      const mockMedia = [
        { id: "1", name: "test.jpg", type: "image", url: "test.jpg" },
        { id: "2", name: "test.mp4", type: "video", url: "test.mp4" },
      ];

      mockMediaLibraryStore.loadMedia.mockResolvedValue(mockMedia);

      mockMediaLibraryStore.media = mockMedia;

      const { result } = renderHook(() => useMediaLibrary());

      await act(async () => {
        await result.current.loadMedia();

      });

      expect(mockMediaLibraryStore.loadMedia).toHaveBeenCalled();

      expect(result.current.media).toEqual(mockMedia);

    });

    it("deve carregar pastas corretamente", async () => {
      const mockFolders = [
        { id: "1", name: "Images", parentId: null },
        { id: "2", name: "Videos", parentId: null },
      ];

      mockMediaLibraryStore.loadFolders.mockResolvedValue(mockFolders);

      mockMediaLibraryStore.folders = mockFolders;

      const { result } = renderHook(() => useMediaLibrary());

      await act(async () => {
        await result.current.loadFolders();

      });

      expect(mockMediaLibraryStore.loadFolders).toHaveBeenCalled();

      expect(result.current.folders).toEqual(mockFolders);

    });

  });

  describe("Upload de arquivos", () => {
    it("deve fazer upload de arquivos corretamente", async () => {
      const mockFiles = [
        new File(["test"], "test.jpg", { type: "image/jpeg" }),
        new File(["test"], "test.mp4", { type: "video/mp4" }),
      ];

      mockMediaUpload.uploadFiles.mockResolvedValue([
        { id: "1", name: "test.jpg", status: "success" },
        { id: "2", name: "test.mp4", status: "success" },
      ]);

      const { result } = renderHook(() => useMediaLibrary());

      await act(async () => {
        await result.current.uploadFiles(mockFiles);

      });

      expect(mockMediaUpload.uploadFiles).toHaveBeenCalledWith(mockFiles);

      expect(mockNotifications.showSuccess).toHaveBeenCalled();

    });

    it("deve cancelar upload corretamente", async () => {
      const { result } = renderHook(() => useMediaLibrary());

      await act(async () => {
        await result.current.cancelUpload();

      });

      expect(mockMediaUpload.cancelUpload).toHaveBeenCalled();

    });

    it("deve limpar uploads corretamente", async () => {
      const { result } = renderHook(() => useMediaLibrary());

      await act(async () => {
        await result.current.clearUploads();

      });

      expect(mockMediaUpload.clearUploads).toHaveBeenCalled();

    });

  });

  describe("Atualização de mídia", () => {
    it("deve atualizar mídia corretamente", async () => {
      const mockMediaData = {
        id: "1",
        name: "updated.jpg",
        description: "Updated description",};

      mockMediaLibraryStore.updateMedia.mockResolvedValue(mockMediaData);

      const { result } = renderHook(() => useMediaLibrary());

      await act(async () => {
        await result.current.updateMedia("1", mockMediaData);

      });

      expect(mockMediaLibraryStore.updateMedia).toHaveBeenCalledWith(
        "1",
        mockMediaData,);

      expect(mockNotifications.showSuccess).toHaveBeenCalled();

    });

  });

  describe("Exclusão de mídia", () => {
    it("deve excluir mídia corretamente", async () => {
      mockMediaLibraryStore.deleteMedia.mockResolvedValue(true);

      const { result } = renderHook(() => useMediaLibrary());

      await act(async () => {
        await result.current.deleteMedia("1");

      });

      expect(mockMediaLibraryStore.deleteMedia).toHaveBeenCalledWith("1");

      expect(mockNotifications.showSuccess).toHaveBeenCalled();

    });

  });

  describe("Gerenciamento de erros", () => {
    it("deve limpar erros corretamente", () => {
      const { result } = renderHook(() => useMediaLibrary());

      act(() => {
        result.current.clearError();

      });

      expect(mockMediaLibraryStore.clearError).toHaveBeenCalled();

    });

  });

  describe("Atualização de dados", () => {
    it("deve atualizar dados corretamente", async () => {
      const { result } = renderHook(() => useMediaLibrary());

      await act(async () => {
        await result.current.refreshData();

      });

      expect(mockMediaLibraryStore.refreshData).toHaveBeenCalled();

    });

  });

  describe("Hooks especializados", () => {
    it("deve expor useMediaCore com funcionalidades básicas", () => {
      const { result } = renderHook(() => useMediaLibrary());

      const mediaCore = result.current.useMediaCore();

      expect(mediaCore).toBeDefined();

      expect(typeof mediaCore.loadMedia).toBe("function");

      expect(typeof mediaCore.uploadMedia).toBe("function");

      expect(typeof mediaCore.deleteMedia).toBe("function");

    });

    it("deve expor useMediaManager com funcionalidades de gerenciamento", () => {
      const { result } = renderHook(() => useMediaLibrary());

      const mediaManager = result.current.useMediaManager();

      expect(mediaManager).toBeDefined();

      expect(typeof mediaManager.createFolder).toBe("function");

      expect(typeof mediaManager.updateFolder).toBe("function");

      expect(typeof mediaManager.deleteFolder).toBe("function");

    });

    it("deve expor useMediaAnalytics com funcionalidades de análise", () => {
      const { result } = renderHook(() => useMediaLibrary());

      const mediaAnalytics = result.current.useMediaAnalytics();

      expect(mediaAnalytics).toBeDefined();

      expect(typeof mediaAnalytics.getStats).toBe("function");

      expect(typeof mediaAnalytics.getUsageReport).toBe("function");

    });

    it("deve expor useMediaAI com funcionalidades de IA", () => {
      const { result } = renderHook(() => useMediaLibrary());

      const mediaAI = result.current.useMediaAI();

      expect(mediaAI).toBeDefined();

      expect(typeof mediaAI.generateTags).toBe("function");

      expect(typeof mediaAI.analyzeContent).toBe("function");

    });

  });

});
