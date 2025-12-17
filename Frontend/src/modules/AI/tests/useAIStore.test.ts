import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useAIStore } from '../hooks/useAIStore';

// Mock do aiService
vi.mock("../services/aiService", () => ({
  default: {
    getServicesStatus: vi.fn(),
    getProviders: vi.fn(),
    generateText: vi.fn(),
    generateImage: vi.fn(),
    generateVideo: vi.fn(),
    checkServiceStatus: vi.fn(),
    testProviderConnection: vi.fn(),
  },
}));

describe("useAIStore", () => {
  const mockAIService = require("../services/aiService").default;

  beforeEach(() => {
    vi.clearAllMocks();

  });

  describe("Estado inicial", () => {
    it("deve inicializar com valores padrão corretos", () => {
      const { result } = renderHook(() => useAIStore());

      expect(result.current.servicesStatus).toBeNull();

      expect(result.current.servicesLoading).toBe(false);

      expect(result.current.textGenerations).toEqual([]);

      expect(result.current.imageGenerations).toEqual([]);

      expect(result.current.videoGenerations).toEqual([]);

      expect(result.current.chatHistory).toEqual([]);

      expect(result.current.analysisHistory).toEqual([]);

      expect(result.current.currentView).toBe("dashboard");

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

      expect(result.current.providers).toEqual([]);

      expect(result.current.lastUpdate).toBeNull();

    });

  });

  describe("fetchServicesStatus", () => {
    it("deve carregar status dos serviços com sucesso", async () => {
      const mockStatus = {
        openai: { status: "active", lastCheck: "2024-01-01T00:00:00Z" },
        claude: { status: "active", lastCheck: "2024-01-01T00:00:00Z" },};

      mockAIService.getServicesStatus.mockResolvedValue({
        data: mockStatus,
      });

      const { result } = renderHook(() => useAIStore());

      await act(async () => {
        await result.current.fetchServicesStatus();

      });

      expect(result.current.servicesStatus).toEqual(mockStatus);

      expect(result.current.servicesLoading).toBe(false);

      expect(result.current.error).toBeNull();

      expect(result.current.lastUpdate).toBeDefined();

    });

    it("deve lidar com erro ao carregar status dos serviços", async () => {
      const mockError = new Error("Erro ao carregar status");

      mockAIService.getServicesStatus.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAIStore());

      await act(async () => {
        await result.current.fetchServicesStatus();

      });

      expect(result.current.error).toBe("Erro ao carregar status dos serviços");

      expect(result.current.servicesLoading).toBe(false);

    });

  });

  describe("checkServiceStatus", () => {
    it("deve verificar status de serviço com sucesso", async () => {
      mockAIService.checkServiceStatus.mockResolvedValue({
        data: { status: "active", lastCheck: "2024-01-01T00:00:00Z" },
      });

      const { result } = renderHook(() => useAIStore());

      await act(async () => {
        const isActive = await result.current.checkServiceStatus("openai");

        expect(isActive).toBe(true);

      });

      expect(mockAIService.checkServiceStatus).toHaveBeenCalledWith("openai");

    });

    it("deve retornar false em caso de erro", async () => {
      mockAIService.checkServiceStatus.mockRejectedValue(
        new Error("Service unavailable"),);

      const { result } = renderHook(() => useAIStore());

      await act(async () => {
        const isActive = await result.current.checkServiceStatus("openai");

        expect(isActive).toBe(false);

      });

    });

  });

  describe("isServiceAvailable", () => {
    it("deve retornar true para serviço ativo", () => {
      const { result } = renderHook(() => useAIStore());

      act(() => {
        result.current.servicesStatus = {
          openai: { status: "active" },};

      });

      expect(result.current.isServiceAvailable("openai")).toBe(true);

    });

    it("deve retornar false para serviço inativo", () => {
      const { result } = renderHook(() => useAIStore());

      act(() => {
        result.current.servicesStatus = {
          openai: { status: "inactive" },};

      });

      expect(result.current.isServiceAvailable("openai")).toBe(false);

    });

    it("deve retornar false quando status não existe", () => {
      const { result } = renderHook(() => useAIStore());

      expect(result.current.isServiceAvailable("nonexistent")).toBe(false);

    });

  });

  describe("generateText", () => {
    it("deve gerar texto com sucesso", async () => {
      const mockPrompt = "Test prompt";
      const mockResult = {
        data: {
          id: "1",
          text: "Generated text",
          provider: "openai",
        },};

      mockAIService.generateText.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useAIStore());

      await act(async () => {
        const generation = await result.current.generateText(mockPrompt);

        expect(generation.id).toBe("1");

        expect(generation.type).toBe("text");

        expect(generation.prompt).toBe(mockPrompt);

        expect(generation.result).toBe("Generated text");

        expect(generation.provider).toBe("openai");

        expect(generation.status).toBe("completed");

      });

      expect(result.current.textGenerations).toHaveLength(1);

      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBeNull();

    });

    it("deve lidar com erro na geração de texto", async () => {
      const mockPrompt = "Test prompt";
      const mockError = new Error("Generation failed");

      mockAIService.generateText.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAIStore());

      await act(async () => {
        try {
          await result.current.generateText(mockPrompt);

        } catch (error) {
          expect(error).toBe(mockError);

        } );

      expect(result.current.error).toBe("Erro ao gerar texto");

      expect(result.current.loading).toBe(false);

    });

  });

  describe("generateImage", () => {
    it("deve gerar imagem com sucesso", async () => {
      const mockPrompt = "Test image prompt";
      const mockResult = {
        data: {
          id: "1",
          imageUrl: "https://example.com/image.jpg",
          provider: "dalle",
        },};

      mockAIService.generateImage.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useAIStore());

      await act(async () => {
        const generation = await result.current.generateImage(mockPrompt);

        expect(generation.id).toBe("1");

        expect(generation.type).toBe("image");

        expect(generation.prompt).toBe(mockPrompt);

        expect(generation.result).toBe("https://example.com/image.jpg");

        expect(generation.provider).toBe("dalle");

        expect(generation.status).toBe("completed");

      });

      expect(result.current.imageGenerations).toHaveLength(1);

    });

  });

  describe("generateVideo", () => {
    it("deve gerar vídeo com sucesso", async () => {
      const mockPrompt = "Test video prompt";
      const mockResult = {
        data: {
          id: "1",
          videoUrl: "https://example.com/video.mp4",
          provider: "runway",
        },};

      mockAIService.generateVideo.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useAIStore());

      await act(async () => {
        const generation = await result.current.generateVideo(mockPrompt);

        expect(generation.id).toBe("1");

        expect(generation.type).toBe("video");

        expect(generation.prompt).toBe(mockPrompt);

        expect(generation.result).toBe("https://example.com/video.mp4");

        expect(generation.provider).toBe("runway");

        expect(generation.status).toBe("completed");

      });

      expect(result.current.videoGenerations).toHaveLength(1);

    });

  });

  describe("Chat operations", () => {
    it("deve adicionar mensagem de chat", () => {
      const { result } = renderHook(() => useAIStore());

      const mockMessage = {
        id: "1",
        role: "user" as const,
        content: "Hello",
        timestamp: "2024-01-01T00:00:00Z",};

      act(() => {
        result.current.addChatMessage(mockMessage);

      });

      expect(result.current.chatHistory).toHaveLength(1);

      expect(result.current.chatHistory[0]).toEqual(mockMessage);

    });

    it("deve limpar histórico de chat", () => {
      const { result } = renderHook(() => useAIStore());

      act(() => {
        result.current.addChatMessage({
          id: "1",
          role: "user",
          content: "Hello",
          timestamp: "2024-01-01T00:00:00Z",
        });

        result.current.clearChatHistory();

      });

      expect(result.current.chatHistory).toHaveLength(0);

    });

  });

  describe("Provider operations", () => {
    it("deve carregar provedores com sucesso", async () => {
      const mockProviders = [
        { id: "1", name: "OpenAI", status: "active" },
        { id: "2", name: "Claude", status: "active" },
      ];

      mockAIService.getProviders.mockResolvedValue({
        data: mockProviders,
      });

      const { result } = renderHook(() => useAIStore());

      await act(async () => {
        await result.current.loadProviders();

      });

      expect(result.current.providers).toEqual(mockProviders);

    });

    it("deve adicionar provedor", () => {
      const { result } = renderHook(() => useAIStore());

      const mockProvider = {
        id: "1",
        name: "OpenAI",
        status: "active" as const,
        type: "text" as const,
        config: {},};

      act(() => {
        result.current.addProvider(mockProvider);

      });

      expect(result.current.providers).toHaveLength(1);

      expect(result.current.providers[0]).toEqual(mockProvider);

    });

  });

  describe("UI operations", () => {
    it("deve definir view atual", () => {
      const { result } = renderHook(() => useAIStore());

      act(() => {
        result.current.setCurrentView("chat");

      });

      expect(result.current.currentView).toBe("chat");

    });

    it("deve definir loading", () => {
      const { result } = renderHook(() => useAIStore());

      act(() => {
        result.current.setLoading(true);

      });

      expect(result.current.loading).toBe(true);

    });

    it("deve definir erro", () => {
      const { result } = renderHook(() => useAIStore());

      act(() => {
        result.current.setError("Test error");

      });

      expect(result.current.error).toBe("Test error");

    });

    it("deve limpar erro", () => {
      const { result } = renderHook(() => useAIStore());

      act(() => {
        result.current.setError("Test error");

        result.current.clearError();

      });

      expect(result.current.error).toBeNull();

    });

  });

  describe("Cache operations", () => {
    it("deve limpar cache", () => {
      const { result } = renderHook(() => useAIStore());

      act(() => {
        result.current.addTextGeneration({
          id: "1",
          type: "text",
          provider: "openai",
          model: "gpt-4",
          prompt: "Test",
          result: "Result",
          metadata: {},
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        });

        result.current.clearCache();

      });

      expect(result.current.textGenerations).toHaveLength(0);

      expect(result.current.imageGenerations).toHaveLength(0);

      expect(result.current.videoGenerations).toHaveLength(0);

      expect(result.current.chatHistory).toHaveLength(0);

      expect(result.current.analysisHistory).toHaveLength(0);

      expect(result.current.lastUpdate).toBeNull();

    });

    it("deve atualizar timestamp", () => {
      const { result } = renderHook(() => useAIStore());

      act(() => {
        result.current.updateLastUpdate();

      });

      expect(result.current.lastUpdate).toBeDefined();

    });

  });

});
