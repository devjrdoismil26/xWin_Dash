/**
 * Testes para o módulo MediaLibrary
 * Testes unitários, de integração e de performance
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MediaLibraryDashboard } from '../shared/components/MediaLibraryDashboard';
import { MediaLibraryHeader } from '../shared/components/MediaLibraryHeader';
import { MediaLibraryStats } from '../shared/components/MediaLibraryStats';
import { MediaLibraryContent } from '../shared/components/MediaLibraryContent';
import { MediaLibraryUploader } from '../shared/components/MediaLibraryUploader';
import { useMediaLibrarySimple } from '../hooks/useMediaLibrarySimple';

// Mock do hook
vi.mock("../hooks/useMediaLibrarySimple", () => ({
  useMediaLibrarySimple: vi.fn(),
}));

const mockUseMediaLibrarySimple = vi.mocked(useMediaLibrarySimple);

describe("MediaLibrary Components", () => {
  beforeEach(() => {
    mockUseMediaLibrarySimple.mockReturnValue({
      stats: {
        total: 100,
        images: 50,
        videos: 30,
        documents: 15,
        audio: 5,
        storageUsage: 2.5,
        recentActivity: 10,
      },
      loading: false,
      error: null,
      currentView: "grid",
      setCurrentView: vi.fn(),
      handleUpload: vi.fn(),
      handleCreateFolder: vi.fn(),
      getTotalMedia: () => 100,
      getImages: () => [],
      getVideos: () => [],
      getDocuments: () => [],
      getAudio: () => [],
      getStorageUsage: () => 2.5,
      getRecentActivity: () => 10,
      searchTerm: "",
      setSearchTerm: vi.fn(),
      sortBy: "name",
      setSortBy: vi.fn(),
      sortOrder: "asc",
      setSortOrder: vi.fn(),
      selectedItems: [],
      selectedFolder: null,
      mediaItems: [],
      folders: [],
      breadcrumbs: [],
      handleSelectItem: vi.fn(),
      handleSelectAll: vi.fn(),
      handleFolderClick: vi.fn(),
      handleMediaClick: vi.fn(),
      handleRefresh: vi.fn(),
      handleDownload: vi.fn(),
      handlePreview: vi.fn(),
      handleEdit: vi.fn(),
      handleDelete: vi.fn(),
      uploadProgress: 0,
      isUploading: false,
      uploadError: null,
    });

  });

  describe("MediaLibraryDashboard", () => {
    it("deve renderizar o dashboard corretamente", () => {
      render(<MediaLibraryDashboard />);

      expect(screen.getByText("Controles Principais")).toBeInTheDocument();

      expect(screen.getByText("Upload Arquivos")).toBeInTheDocument();

      expect(screen.getByText("Nova Pasta")).toBeInTheDocument();

    });

    it("deve exibir estatísticas corretamente", () => {
      render(<MediaLibraryDashboard />);

      expect(screen.getByText("100")).toBeInTheDocument(); // Total de arquivos
      expect(screen.getByText("Total de Arquivos")).toBeInTheDocument();

    });

    it("deve alternar entre visualizações", () => {
      const setCurrentView = vi.fn();

      mockUseMediaLibrarySimple.mockReturnValue({
        ...mockUseMediaLibrarySimple(),
        setCurrentView,
      });

      render(<MediaLibraryDashboard />);

      const gridButton = screen.getByRole("button", { name: /grid/i });

      fireEvent.click(gridButton);

      expect(setCurrentView).toHaveBeenCalledWith("grid");

    });

  });

  describe("MediaLibraryHeader", () => {
    it("deve renderizar o cabeçalho corretamente", () => {
      render(<MediaLibraryHeader />);

      expect(
        screen.getByPlaceholderText("Buscar arquivos..."),
      ).toBeInTheDocument();

      expect(screen.getByText("Upload")).toBeInTheDocument();

    });

    it("deve permitir busca", () => {
      const setSearchTerm = vi.fn();

      mockUseMediaLibrarySimple.mockReturnValue({
        ...mockUseMediaLibrarySimple(),
        setSearchTerm,
      });

      render(<MediaLibraryHeader />);

      const searchInput = screen.getByPlaceholderText("Buscar arquivos...");

      fireEvent.change(searchInput, { target: { value: "teste" } );

      expect(setSearchTerm).toHaveBeenCalledWith("teste");

    });

  });

  describe("MediaLibraryStats", () => {
    it("deve renderizar estatísticas corretamente", () => {
      render(<MediaLibraryStats />);

      expect(screen.getByText("Total de Arquivos")).toBeInTheDocument();

      expect(screen.getByText("Imagens")).toBeInTheDocument();

      expect(screen.getByText("Vídeos")).toBeInTheDocument();

      expect(screen.getByText("Documentos")).toBeInTheDocument();

    });

    it("deve exibir estado de carregamento", () => {
      mockUseMediaLibrarySimple.mockReturnValue({
        ...mockUseMediaLibrarySimple(),
        loading: true,
      });

      render(<MediaLibraryStats />);

      // Verificar se há elementos de loading
      expect(screen.getAllByText("Total de Arquivos")).toHaveLength(4);

    });

    it("deve exibir erro quando houver", () => {
      mockUseMediaLibrarySimple.mockReturnValue({
        ...mockUseMediaLibrarySimple(),
        error: "Erro ao carregar estatísticas",
      });

      render(<MediaLibraryStats />);

      expect(
        screen.getByText(
          "Erro ao carregar estatísticas: Erro ao carregar estatísticas",
        ),
      ).toBeInTheDocument();

    });

  });

  describe("MediaLibraryContent", () => {
    it("deve renderizar conteúdo vazio quando não há arquivos", () => {
      render(<MediaLibraryContent />);

      expect(screen.getByText("Nenhum arquivo encontrado")).toBeInTheDocument();

    });

    it("deve exibir estado de carregamento", () => {
      mockUseMediaLibrarySimple.mockReturnValue({
        ...mockUseMediaLibrarySimple(),
        loading: true,
      });

      render(<MediaLibraryContent />);

      // Verificar se há spinner de loading
      expect(screen.getByRole("status")).toBeInTheDocument();

    });

    it("deve exibir erro quando houver", () => {
      mockUseMediaLibrarySimple.mockReturnValue({
        ...mockUseMediaLibrarySimple(),
        error: "Erro ao carregar conteúdo",
      });

      render(<MediaLibraryContent />);

      expect(screen.getByText("Erro ao carregar conteúdo")).toBeInTheDocument();

    });

  });

  describe("MediaLibraryUploader", () => {
    it("deve renderizar o uploader corretamente", () => {
      render(<MediaLibraryUploader />);

      expect(screen.getByText("Upload de Arquivos")).toBeInTheDocument();

      expect(
        screen.getByText("Arraste arquivos aqui ou clique para selecionar"),
      ).toBeInTheDocument();

    });

    it("deve permitir seleção de arquivos", () => {
      render(<MediaLibraryUploader />);

      const selectButton = screen.getByText("Selecionar Arquivos");

      expect(selectButton).toBeInTheDocument();

    });

    it("deve exibir progresso de upload", () => {
      mockUseMediaLibrarySimple.mockReturnValue({
        ...mockUseMediaLibrarySimple(),
        isUploading: true,
        uploadProgress: 50,
      });

      render(<MediaLibraryUploader />);

      expect(screen.getByText("Upload em Progresso")).toBeInTheDocument();

      expect(screen.getByText("50%")).toBeInTheDocument();

    });

  });

});

describe("Performance Tests", () => {
  it("deve renderizar componentes rapidamente", async () => {
    const startTime = performance.now();

    render(<MediaLibraryDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Controles Principais")).toBeInTheDocument();

    });

    const endTime = performance.now();

    const renderTime = endTime - startTime;

    // Deve renderizar em menos de 100ms
    expect(renderTime).toBeLessThan(100);

  });

  it("deve lidar com grandes quantidades de dados", () => {
    const largeStats = {
      total: 10000,
      images: 5000,
      videos: 3000,
      documents: 1500,
      audio: 500,
      storageUsage: 25.5,
      recentActivity: 100,};

    mockUseMediaLibrarySimple.mockReturnValue({
      ...mockUseMediaLibrarySimple(),
      stats: largeStats,
    });

    const startTime = performance.now();

    render(<MediaLibraryStats />);

    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(50);

    expect(screen.getByText("10,000")).toBeInTheDocument();

  });

});
