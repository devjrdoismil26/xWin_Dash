import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useAI } from '../hooks/useAI';

// Mock dos hooks especializados
vi.mock("../hooks/useAIStore");

vi.mock("../hooks/useAIGeneration");

vi.mock("../hooks/useAIProviders");

vi.mock("../hooks/useAIHistory");

vi.mock("../hooks/useAIAnalytics");

vi.mock("../../shared/hooks/useAdvancedNotifications");

describe("useAI", () => {
  const mockAIStore = {
    loading: false,
    error: null,
    textGenerations: [],
    imageGenerations: [],
    videoGenerations: [],
    currentGeneration: null,
    providers: [],
    chatHistory: [],
    analytics: null,
    clearError: vi.fn(),};

  const mockGeneration = {
    loading: false,
    error: null,
    loadGenerations: vi.fn(),
    createGeneration: vi.fn(),
    updateGeneration: vi.fn(),
    deleteGeneration: vi.fn(),
    clearError: vi.fn(),};

  const mockProviders = {
    loading: false,
    error: null,
    loadProviders: vi.fn(),
    clearError: vi.fn(),};

  const mockHistory = {
    loading: false,
    error: null,
    loadHistory: vi.fn(),
    clearError: vi.fn(),};

  const mockAnalytics = {
    loading: false,
    error: null,
    loadAnalytics: vi.fn(),
    clearError: vi.fn(),};

  const mockNotifications = {
    showSuccess: vi.fn(),
    showError: vi.fn(),};

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock dos módulos
    require("../hooks/useAIStore").useAIStore.mockReturnValue(mockAIStore);

    require("../hooks/useAIGeneration").useAIGeneration.mockReturnValue(
      mockGeneration,);

    require("../hooks/useAIProviders").useAIProviders.mockReturnValue(
      mockProviders,);

    require("../hooks/useAIHistory").useAIHistory.mockReturnValue(mockHistory);

    require("../hooks/useAIAnalytics").useAIAnalytics.mockReturnValue(
      mockAnalytics,);

    require("../../shared/hooks/useAdvancedNotifications").useAdvancedNotifications.mockReturnValue(
      mockNotifications,);

  });

  describe("Inicialização", () => {
    it("deve inicializar corretamente com valores padrão", () => {
      const { result } = renderHook(() => useAI());

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

      expect(result.current.generations).toEqual([]);

      expect(result.current.currentGeneration).toBeNull();

      expect(result.current.providers).toEqual([]);

      expect(result.current.chatHistory).toEqual([]);

      expect(result.current.analytics).toBeNull();

    });

    it("deve expor hooks especializados", () => {
      const { result } = renderHook(() => useAI());

      expect(result.current.generation).toBeDefined();

      expect(result.current.providers).toBeDefined();

      expect(result.current.history).toBeDefined();

      expect(result.current.analytics).toBeDefined();

    });

  });

  describe("Carregamento de gerações", () => {
    it("deve carregar gerações com sucesso", async () => {
      mockGeneration.loadGenerations.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAI());

      await act(async () => {
        await result.current.loadGenerations();

      });

      expect(mockGeneration.loadGenerations).toHaveBeenCalled();

      expect(mockNotifications.showSuccess).toHaveBeenCalledWith(
        "Gerações carregadas com sucesso!",);

    });

    it("deve lidar com erro ao carregar gerações", async () => {
      const mockError = new Error("Erro ao carregar gerações");

      mockGeneration.loadGenerations.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAI());

      await act(async () => {
        await result.current.loadGenerations();

      });

      expect(mockGeneration.loadGenerations).toHaveBeenCalled();

      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Erro ao carregar gerações",
        "Erro ao carregar gerações",);

    });

  });

  describe("Criação de gerações", () => {
    it("deve criar geração com sucesso", async () => {
      const mockGenerationData = { prompt: "Test prompt", type: "text"};

      const mockResult = { id: "1", ...mockGenerationData};

      mockGeneration.createGeneration.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useAI());

      await act(async () => {
        const createdGeneration =
          await result.current.createGeneration(mockGenerationData);

        expect(createdGeneration).toEqual(mockResult);

      });

      expect(mockGeneration.createGeneration).toHaveBeenCalledWith(
        mockGenerationData,);

      expect(mockNotifications.showSuccess).toHaveBeenCalledWith(
        "Geração criada com sucesso!",);

    });

    it("deve lidar com erro ao criar geração", async () => {
      const mockGenerationData = { prompt: "Test prompt", type: "text"};

      const mockError = new Error("Erro ao criar geração");

      mockGeneration.createGeneration.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAI());

      await act(async () => {
        try {
          await result.current.createGeneration(mockGenerationData);

        } catch (error) {
          expect(error).toBe(mockError);

        } );

      expect(mockGeneration.createGeneration).toHaveBeenCalledWith(
        mockGenerationData,);

      expect(mockNotifications.showError).toHaveBeenCalledWith(
        "Erro ao criar geração",
        "Erro ao criar geração",);

    });

  });

  describe("Atualização de gerações", () => {
    it("deve atualizar geração com sucesso", async () => {
      const mockUpdateData = { prompt: "Updated prompt"};

      const mockResult = { id: "1", ...mockUpdateData};

      mockGeneration.updateGeneration.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useAI());

      await act(async () => {
        const updatedGeneration = await result.current.updateGeneration(
          "1",
          mockUpdateData,);

        expect(updatedGeneration).toEqual(mockResult);

      });

      expect(mockGeneration.updateGeneration).toHaveBeenCalledWith(
        "1",
        mockUpdateData,);

      expect(mockNotifications.showSuccess).toHaveBeenCalledWith(
        "Geração atualizada com sucesso!",);

    });

  });

  describe("Exclusão de gerações", () => {
    it("deve excluir geração com sucesso", async () => {
      mockGeneration.deleteGeneration.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAI());

      await act(async () => {
        await result.current.deleteGeneration("1");

      });

      expect(mockGeneration.deleteGeneration).toHaveBeenCalledWith("1");

      expect(mockNotifications.showSuccess).toHaveBeenCalledWith(
        "Geração excluída com sucesso!",);

    });

  });

  describe("Limpeza de erros", () => {
    it("deve limpar todos os erros", () => {
      const { result } = renderHook(() => useAI());

      act(() => {
        result.current.clearError();

      });

      expect(mockAIStore.clearError).toHaveBeenCalled();

      expect(mockGeneration.clearError).toHaveBeenCalled();

      expect(mockProviders.clearError).toHaveBeenCalled();

      expect(mockHistory.clearError).toHaveBeenCalled();

      expect(mockAnalytics.clearError).toHaveBeenCalled();

    });

  });

  describe("Refresh de dados", () => {
    it("deve atualizar dados corretamente", async () => {
      mockGeneration.loadGenerations.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAI());

      await act(async () => {
        await result.current.refresh();

      });

      expect(mockGeneration.loadGenerations).toHaveBeenCalled();

    });

  });

});
