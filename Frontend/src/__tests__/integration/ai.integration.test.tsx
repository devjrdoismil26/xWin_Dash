/**
 * Testes de integração do módulo AI
 * Testa fluxos completos e integração entre componentes
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AI } from '../index';
import { useAI } from '../hooks/useAI';
import { aiService } from '../services';

// Mock do React Router
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: "/ai" }),
}));

// Mock do Inertia
jest.mock("@inertiajs/react", () => ({
  Head: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="head">{children}</div>
  ),
  router: {
    visit: jest.fn(),
  },
}));

// Mock dos layouts
jest.mock("@/layouts/AuthenticatedLayout", () => {
  return function MockAuthenticatedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="authenticated-layout">{children}</div>;};

});

jest.mock("@/layouts/PageLayout", () => {
  return function MockPageLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-layout">{children}</div>;};

});

// Mock dos componentes UI
jest.mock("@/shared/components/ui/LoadingStates", () => ({
  LoadingSpinner: ({ size }: { size?: string }) => (
    <div data-testid="loading-spinner" data-size={ size  }>
          Loading...
        </div>
    </div>
  ),
}));

jest.mock("@/shared/components/ui/AdvancedAnimations", () => ({
  PageTransition: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-transition">{children}</div>
  ),
  AnimatedCounter: ({ value }: { value: number }) => (
    <span data-testid="animated-counter">{value}</span>
  ),
}));

jest.mock("@/shared/components/ui/ErrorBoundary", () => {
  return function MockErrorBoundary({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="error-boundary">{children}</div>;};

});

// Mock dos serviços
jest.mock("../services/aiService", () => ({
  getServicesStatus: jest.fn(),
  generateText: jest.fn(),
  generateImage: jest.fn(),
  generateVideo: jest.fn(),
  getProviders: jest.fn(),
  checkServiceStatus: jest.fn(),
}));

// Mock dos hooks
jest.mock("../hooks/useAI", () => ({
  useAI: jest.fn(),
}));

const mockUseAI = useAI as jest.MockedFunction<typeof useAI>;

describe("AI Module Integration Tests", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock padrão do useAI
    mockUseAI.mockReturnValue({
      generation: {
        textGenerations: [],
        imageGenerations: [],
        videoGenerations: [],
        loading: false,
        error: null,
      },
      providers: {
        availableProviders: [],
        activeProviders: [],
        loading: false,
        error: null,
      },
      history: {
        chatHistory: [],
        analysisHistory: [],
        loading: false,
        error: null,
      },
      analytics: {
        totalGenerations: 0,
        totalCost: 0,
        averageTime: 0,
        successRate: 0,
        loading: false,
        error: null,
      },
      generationActions: {
        generateText: jest.fn(),
        generateImage: jest.fn(),
        generateVideo: jest.fn(),
        clearError: jest.fn(),
      },
      providersActions: {
        loadProviders: jest.fn(),
        loadServicesStatus: jest.fn(),
        clearError: jest.fn(),
      },
      historyActions: {
        loadHistory: jest.fn(),
        addChatMessage: jest.fn(),
        clearError: jest.fn(),
      },
      analyticsActions: {
        loadAnalytics: jest.fn(),
        getRealTimeData: jest.fn(),
        clearError: jest.fn(),
      },
      servicesStatus: null,
      servicesLoading: false,
      currentView: "dashboard",
      loading: false,
      error: null,
      isServiceAvailable: jest.fn(),
      getAvailableProviders: jest.fn(),
      getBestProvider: jest.fn(),
      getStats: jest.fn(),
      getTotalGenerations: jest.fn(),
      getTotalCost: jest.fn(),
      getSuccessRate: jest.fn(),
      setCurrentView: jest.fn(),
      clearAllErrors: jest.fn(),
    });

    jest.clearAllMocks();

  });

  const renderWithProviders = (component: React.ReactElement) => { return render(
      <QueryClientProvider client={queryClient } />
        <BrowserRouter>{component}</BrowserRouter>
      </QueryClientProvider>,);};

  describe("AI Component Integration", () => {
    it("should render AI component with basic variant", () => {
      renderWithProviders(
        <AI auth={ user: { id: 1 } } page="index" variant="basic" />,);

      expect(screen.getByTestId("authenticated-layout")).toBeInTheDocument();

      expect(screen.getByTestId("page-layout")).toBeInTheDocument();

      expect(screen.getByTestId("error-boundary")).toBeInTheDocument();

      expect(screen.getByTestId("page-transition")).toBeInTheDocument();

    });

    it("should render AI component with advanced variant", () => {
      renderWithProviders(
        <AI auth={ user: { id: 1 } } page="dashboard" variant="advanced" />,);

      expect(screen.getByTestId("authenticated-layout")).toBeInTheDocument();

      expect(screen.getByTestId("page-layout")).toBeInTheDocument();

    });

    it("should render AI component with revolutionary variant", () => {
      renderWithProviders(
        <AI
          auth={ user: { id: 1 } }
          page="analytics"
          variant="revolutionary" />,);

      expect(screen.getByTestId("authenticated-layout")).toBeInTheDocument();

      expect(screen.getByTestId("page-layout")).toBeInTheDocument();

    });

    it("should show loading spinner when loading", () => {
      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        loading: true,
      });

      renderWithProviders(<AI auth={ user: { id: 1 } } page="index" />);

      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    });

    it("should show error state when error occurs", () => {
      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        error: "Test error message",
      });

      renderWithProviders(<AI auth={ user: { id: 1 } } page="index" />);

      expect(screen.getByText("Test error message")).toBeInTheDocument();

    });

  });

  describe("AI Dashboard Integration", () => {
    it("should render dashboard with basic features", () => {
      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        generation: {
          textGenerations: [{ id: "1", type: "text", result: "Test text" }],
          imageGenerations: [],
          videoGenerations: [],
          loading: false,
          error: null,
        },
        analytics: {
          totalGenerations: 1,
          totalCost: 0.01,
          averageTime: 2.5,
          successRate: 100,
          loading: false,
          error: null,
        },
      });

      renderWithProviders(
        <AI auth={ user: { id: 1 } } page="dashboard" variant="basic" />,);

      expect(screen.getByText("AI Dashboard")).toBeInTheDocument();

      expect(screen.getByText("Total de Gerações")).toBeInTheDocument();

      expect(screen.getByText("Textos Gerados")).toBeInTheDocument();

    });

    it("should render dashboard with advanced features", () => {
      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        providers: {
          availableProviders: [
            { id: "1", name: "OpenAI", status: "active", type: "text" },
            { id: "2", name: "DALL-E", status: "active", type: "image" },
          ],
          activeProviders: [
            { id: "1", name: "OpenAI", status: "active", type: "text" },
          ],
          loading: false,
          error: null,
        },
        analytics: {
          totalGenerations: 100,
          totalCost: 50.0,
          averageTime: 2.5,
          successRate: 95.5,
          loading: false,
          error: null,
        },
      });

      renderWithProviders(
        <AI auth={ user: { id: 1 } } page="dashboard" variant="advanced" />,);

      expect(screen.getByText("AI Dashboard")).toBeInTheDocument();

      expect(screen.getByText("Avançado")).toBeInTheDocument();

      expect(screen.getByText("Status dos Providers")).toBeInTheDocument();

    });

    it("should handle provider status updates", async () => {
      const mockLoadProviders = jest.fn();

      const mockLoadServicesStatus = jest.fn();

      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        providersActions: {
          ...mockUseAI().providersActions,
          loadProviders: mockLoadProviders,
          loadServicesStatus: mockLoadServicesStatus,
        },
      });

      renderWithProviders(
        <AI auth={ user: { id: 1 } } page="dashboard" variant="advanced" />,);

      // Simular clique no botão de atualizar
      const refreshButton = screen.getByText("Atualizar");

      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(mockLoadProviders).toHaveBeenCalled();

        expect(mockLoadServicesStatus).toHaveBeenCalled();

      });

    });

  });

  describe("AI Generation Integration", () => {
    it("should handle text generation flow", async () => {
      const mockGenerateText = jest.fn().mockResolvedValue({
        id: "1",
        type: "text",
        result: "Generated text",
        provider: "openai",
      });

      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        generationActions: {
          ...mockUseAI().generationActions,
          generateText: mockGenerateText,
        },
      });

      renderWithProviders(<AI auth={ user: { id: 1 } } page="generation" />);

      // Simular geração de texto
      await act(async () => {
        await mockGenerateText("Test prompt");

      });

      expect(mockGenerateText).toHaveBeenCalledWith("Test prompt");

    });

    it("should handle image generation flow", async () => {
      const mockGenerateImage = jest.fn().mockResolvedValue({
        id: "1",
        type: "image",
        result: "https://example.com/image.jpg",
        provider: "dalle",
      });

      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        generationActions: {
          ...mockUseAI().generationActions,
          generateImage: mockGenerateImage,
        },
      });

      renderWithProviders(<AI auth={ user: { id: 1 } } page="generation" />);

      // Simular geração de imagem
      await act(async () => {
        await mockGenerateImage("Test image prompt");

      });

      expect(mockGenerateImage).toHaveBeenCalledWith("Test image prompt");

    });

    it("should handle video generation flow", async () => {
      const mockGenerateVideo = jest.fn().mockResolvedValue({
        id: "1",
        type: "video",
        result: "https://example.com/video.mp4",
        provider: "runway",
      });

      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        generationActions: {
          ...mockUseAI().generationActions,
          generateVideo: mockGenerateVideo,
        },
      });

      renderWithProviders(<AI auth={ user: { id: 1 } } page="generation" />);

      // Simular geração de vídeo
      await act(async () => {
        await mockGenerateVideo("Test video prompt");

      });

      expect(mockGenerateVideo).toHaveBeenCalledWith("Test video prompt");

    });

  });

  describe("AI Analytics Integration", () => {
    it("should load analytics data on mount", async () => {
      const mockLoadAnalytics = jest.fn();

      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        analyticsActions: {
          ...mockUseAI().analyticsActions,
          loadAnalytics: mockLoadAnalytics,
        },
      });

      renderWithProviders(<AI auth={ user: { id: 1 } } page="analytics" />);

      await waitFor(() => {
        expect(mockLoadAnalytics).toHaveBeenCalled();

      });

    });

    it("should display real-time data when available", async () => {
      const mockGetRealTimeData = jest.fn().mockResolvedValue({
        generationsPerMinute: 5,
        activeUsers: 10,
        currentLoad: 75,
      });

      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        analyticsActions: {
          ...mockUseAI().analyticsActions,
          getRealTimeData: mockGetRealTimeData,
        },
      });

      renderWithProviders(
        <AI auth={ user: { id: 1 } } page="analytics" variant="advanced" />,);

      await waitFor(() => {
        expect(mockGetRealTimeData).toHaveBeenCalled();

      });

    });

  });

  describe("AI History Integration", () => {
    it("should load chat history on mount", async () => {
      const mockLoadHistory = jest.fn();

      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        historyActions: {
          ...mockUseAI().historyActions,
          loadHistory: mockLoadHistory,
        },
      });

      renderWithProviders(<AI auth={ user: { id: 1 } } page="index" />);

      await waitFor(() => {
        expect(mockLoadHistory).toHaveBeenCalled();

      });

    });

    it("should add chat messages to history", async () => {
      const mockAddChatMessage = jest.fn();

      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        historyActions: {
          ...mockUseAI().historyActions,
          addChatMessage: mockAddChatMessage,
        },
      });

      renderWithProviders(<AI auth={ user: { id: 1 } } page="index" />);

      // Simular adição de mensagem
      await act(async () => {
        mockAddChatMessage({
          id: "1",
          type: "user",
          content: "Hello",
          timestamp: new Date().toISOString(),
        });

      });

      expect(mockAddChatMessage).toHaveBeenCalledWith({
        id: "1",
        type: "user",
        content: "Hello",
        timestamp: expect.any(String),
      });

    });

  });

  describe("Error Handling Integration", () => {
    it("should handle service errors gracefully", async () => {
      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        error: "Service unavailable",
        generationActions: {
          ...mockUseAI().generationActions,
          generateText: jest.fn().mockRejectedValue(new Error("Service error")),
        },
      });

      renderWithProviders(<AI auth={ user: { id: 1 } } page="generation" />);

      expect(screen.getByText("Service unavailable")).toBeInTheDocument();

    });

    it("should clear errors when requested", async () => {
      const mockClearAllErrors = jest.fn();

      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        error: "Test error",
        clearAllErrors: mockClearAllErrors,
      });

      renderWithProviders(<AI auth={ user: { id: 1 } } page="index" />);

      // Simular clique no botão de tentar novamente
      const retryButton = screen.getByText("Tentar Novamente");

      fireEvent.click(retryButton);

      expect(mockClearAllErrors).toHaveBeenCalled();

    });

  });

  describe("Multi-Provider Integration", () => {
    it("should handle multiple providers correctly", async () => {
      mockUseAI.mockReturnValue({
        ...mockUseAI(),
        providers: {
          availableProviders: [
            { id: "1", name: "OpenAI", status: "active", type: "text" },
            { id: "2", name: "DALL-E", status: "active", type: "image" },
            { id: "3", name: "Claude", status: "inactive", type: "text" },
          ],
          activeProviders: [
            { id: "1", name: "OpenAI", status: "active", type: "text" },
            { id: "2", name: "DALL-E", status: "active", type: "image" },
          ],
          loading: false,
          error: null,
        },
        isServiceAvailable: jest.fn(
          (service) => service === "openai" || service === "dalle",
        ),
        getBestProvider: jest.fn((type) => {
          if (type === "text")
            return { id: "1", name: "OpenAI", status: "active", type: "text"};

          if (type === "image")
            return { id: "2", name: "DALL-E", status: "active", type: "image"};

          return null;
        }),
      });

      renderWithProviders(
        <AI auth={ user: { id: 1 } } page="dashboard" variant="advanced" />,);

      expect(screen.getByText("OpenAI")).toBeInTheDocument();

      expect(screen.getByText("DALL-E")).toBeInTheDocument();

      expect(screen.getByText("Claude")).toBeInTheDocument();

    });

  });

});
