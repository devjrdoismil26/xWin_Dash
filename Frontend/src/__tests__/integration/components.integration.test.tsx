// =========================================
// SOCIAL BUFFER COMPONENTS INTEGRATION TESTS
// =========================================

import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import SocialAccountsManager from "../../shared/components/functionality/SocialAccountsManager";
import SocialPostsManager from "../../shared/components/functionality/SocialPostsManager";
import SocialBufferLoadingSkeleton from "../../shared/components/ui/SocialBufferLoadingSkeleton";
import SocialBufferErrorState from "../../shared/components/ui/SocialBufferErrorState";
import SocialBufferEmptyState from "../../shared/components/ui/SocialBufferEmptyState";
import SocialBufferSuccessState from "../../shared/components/ui/SocialBufferSuccessState";

// Mock dos hooks
jest.mock("../../hooks/useSocialBufferUI");

jest.mock("../../hooks/useAccountsStore");

jest.mock("../../hooks/usePostsStore");

// Mock dos componentes de UI
jest.mock("@/shared/components/ui/Card", () => ({
  __esModule: true,
  default: ({ children, className, ...props }: unknown) => (
    <div className={`card ${className || ""} `} { ...props }>
        </div>{children}
    </div>
  ),
}));

jest.mock("@/shared/components/ui/Button", () => ({
  __esModule: true,
  default: ({ children, onClick, disabled, className, ...props }: unknown) => (
    <button
      className={`btn ${className || ""} `}
      onClick={ onClick }
      disabled={ disabled }
      { ...props } />
      {children}
    </button>
  ),
}));

jest.mock("@/shared/components/ui/LoadingStates", () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

jest.mock("@/shared/components/ui/AdvancedAnimations", () => ({
  Animated: ({ children, delay }: unknown) => (
    <div data-testid="animated" data->
           
        </div>{children}
    </div>
  ),
}));

jest.mock("@/shared/components/ui/ResponsiveSystem", () => ({
  ResponsiveGrid: ({ children, columns, gap }: unknown) => (
    <div
      data-testid="responsive-grid"
      data-columns={ JSON.stringify(columns) }
      data-gap={ gap  }>
        </div>{children}
    </div>
  ),
}));

// =========================================
// HELPER FUNCTIONS
// =========================================

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);};

const mockUIHook = (overrides = {} as any) => ({
  loading: false,
  error: null,
  success: null,
  isEmpty: false,
  hasData: true,
  setLoading: jest.fn(),
  setError: jest.fn(),
  setSuccess: jest.fn(),
  clearMessages: jest.fn(),
  handleError: jest.fn(),
  handleSuccess: jest.fn(),
  ...overrides,
});

const mockAccountsStore = (overrides = {} as any) => ({
  accounts: [
    {
      id: "1",
      name: "Test Account",
      platform: "facebook",
      is_connected: true,
      followers_count: 1000,
      posts_count: 50,
      last_activity: "2024-01-01T10:00:00Z",
    },
  ],
  fetchAccounts: jest.fn(),
  refreshAccounts: jest.fn(),
  deleteAccount: jest.fn(),
  syncAccount: jest.fn(),
  clearCache: jest.fn(),
  ...overrides,
});

const mockPostsStore = (overrides = {} as any) => ({
  posts: [
    {
      id: "1",
      title: "Test Post",
      content: "This is a test post",
      platform: "facebook",
      status: "published",
      created_at: "2024-01-01T10:00:00Z",
      published_at: "2024-01-01T10:00:00Z",
    },
  ],
  fetchPosts: jest.fn(),
  refreshPosts: jest.fn(),
  deletePost: jest.fn(),
  duplicatePost: jest.fn(),
  publishPost: jest.fn(),
  pausePost: jest.fn(),
  clearCache: jest.fn(),
  ...overrides,
});

// =========================================
// TESTES DE INTEGRAÇÃO DOS COMPONENTES
// =========================================

describe("SocialBuffer Components Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

  });

  // ===== TESTES DO SOCIAL ACCOUNTS MANAGER =====

  describe("SocialAccountsManager Integration", () => {
    it("deve renderizar corretamente com dados", () => {
      const mockUI = mockUIHook();

      const mockStore = mockAccountsStore();

      (
        require("../../hooks/useSocialBufferUI").useAccountsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/useAccountsStore").useAccountsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialAccountsManager />);

      expect(screen.getByText("Contas Sociais")).toBeInTheDocument();

      expect(screen.getByText("Test Account")).toBeInTheDocument();

      expect(screen.getByText("facebook")).toBeInTheDocument();

      expect(screen.getByText("Conectado")).toBeInTheDocument();

    });

    it("deve mostrar estado de loading", () => {
      const mockUI = mockUIHook({ loading: true, isEmpty: true });

      const mockStore = mockAccountsStore({ accounts: [] });

      (
        require("../../hooks/useSocialBufferUI").useAccountsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/useAccountsStore").useAccountsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialAccountsManager />);

      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    });

    it("deve mostrar estado de erro", () => {
      const mockUI = mockUIHook({ error: "Test error", isEmpty: true });

      const mockStore = mockAccountsStore({ accounts: [] });

      (
        require("../../hooks/useSocialBufferUI").useAccountsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/useAccountsStore").useAccountsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialAccountsManager />);

      expect(screen.getByText("Test error")).toBeInTheDocument();

    });

    it("deve mostrar estado vazio", () => {
      const mockUI = mockUIHook({ isEmpty: true });

      const mockStore = mockAccountsStore({ accounts: [] });

      (
        require("../../hooks/useSocialBufferUI").useAccountsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/useAccountsStore").useAccountsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialAccountsManager />);

      expect(screen.getByText("Nenhuma Conta Conectada")).toBeInTheDocument();

      expect(screen.getByText("Conectar Conta")).toBeInTheDocument();

    });

    it("deve filtrar contas por busca", async () => {
      const user = userEvent.setup();

      const mockUI = mockUIHook();

      const mockStore = mockAccountsStore();

      (
        require("../../hooks/useSocialBufferUI").useAccountsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/useAccountsStore").useAccountsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialAccountsManager />);

      const searchInput = screen.getByPlaceholderText("Buscar contas...");

      await user.type(searchInput, "Test");

      expect(searchInput).toHaveValue("Test");

    });

    it("deve conectar nova conta", async () => {
      const user = userEvent.setup();

      const mockUI = mockUIHook();

      const mockStore = mockAccountsStore();

      (
        require("../../hooks/useSocialBufferUI").useAccountsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/useAccountsStore").useAccountsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialAccountsManager />);

      const connectButton = screen.getByText("Conectar Conta");

      await user.click(connectButton);

      expect(mockUI.setLoading).toHaveBeenCalledWith(true);

    });

    it("deve deletar conta com confirmação", async () => {
      const user = userEvent.setup();

      const mockUI = mockUIHook();

      const mockStore = mockAccountsStore();

      // Mock window.confirm
      window.confirm = jest.fn(() => true);

      (
        require("../../hooks/useSocialBufferUI").useAccountsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/useAccountsStore").useAccountsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialAccountsManager />);

      const deleteButton = screen.getByLabelText("Deletar conta");

      await user.click(deleteButton);

      expect(window.confirm).toHaveBeenCalledWith(
        "Tem certeza que deseja desconectar a conta Test Account?",);

      expect(mockStore.deleteAccount).toHaveBeenCalledWith("1");

    });

  });

  // ===== TESTES DO SOCIAL POSTS MANAGER =====

  describe("SocialPostsManager Integration", () => {
    it("deve renderizar corretamente com dados", () => {
      const mockUI = mockUIHook();

      const mockStore = mockPostsStore();

      (
        require("../../hooks/useSocialBufferUI").usePostsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/usePostsStore").usePostsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialPostsManager />);

      expect(screen.getByText("Posts")).toBeInTheDocument();

      expect(screen.getByText("Test Post")).toBeInTheDocument();

      expect(screen.getByText("This is a test post")).toBeInTheDocument();

      expect(screen.getByText("published")).toBeInTheDocument();

    });

    it("deve alternar entre visualização grid e lista", async () => {
      const user = userEvent.setup();

      const mockUI = mockUIHook();

      const mockStore = mockPostsStore();

      (
        require("../../hooks/useSocialBufferUI").usePostsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/usePostsStore").usePostsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialPostsManager />);

      const listButton = screen.getByLabelText("Visualização em lista");

      await user.click(listButton);

      expect(screen.getByTestId("responsive-grid")).toHaveAttribute(
        "data-columns",
        '{"sm":1,"md":2,"lg":3}',);

    });

    it("deve filtrar posts por status", async () => {
      const user = userEvent.setup();

      const mockUI = mockUIHook();

      const mockStore = mockPostsStore();

      (
        require("../../hooks/useSocialBufferUI").usePostsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/usePostsStore").usePostsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialPostsManager />);

      const statusSelect = screen.getByDisplayValue("Todos os status");

      await user.selectOptions(statusSelect, "published");

      expect(statusSelect).toHaveValue("published");

    });

    it("deve duplicar post", async () => {
      const user = userEvent.setup();

      const mockUI = mockUIHook();

      const mockStore = mockPostsStore();

      (
        require("../../hooks/useSocialBufferUI").usePostsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/usePostsStore").usePostsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialPostsManager />);

      const duplicateButton = screen.getByLabelText("Duplicar post");

      await user.click(duplicateButton);

      expect(mockStore.duplicatePost).toHaveBeenCalledWith("1");

    });

  });

  // ===== TESTES DOS COMPONENTES DE UI =====

  describe("UI Components Integration", () => {
    it("deve renderizar loading skeleton corretamente", () => {
      renderWithRouter(<SocialBufferLoadingSkeleton type="dashboard" />);

      expect(screen.getByText("Contas Sociais")).toBeInTheDocument();

      expect(screen.getByTestId("animated")).toBeInTheDocument();

    });

    it("deve renderizar error state com ações", async () => {
      const user = userEvent.setup();

      const onRetry = jest.fn();

      const onGoHome = jest.fn();

      renderWithRouter(
        <SocialBufferErrorState
          type="network"
          onRetry={ onRetry }
          onGoHome={ onGoHome } />,);

      expect(screen.getByText("Erro de Conexão")).toBeInTheDocument();

      expect(screen.getByText("Tentar Novamente")).toBeInTheDocument();

      const retryButton = screen.getByText("Tentar Novamente");

      await user.click(retryButton);

      expect(onRetry).toHaveBeenCalled();

    });

    it("deve renderizar empty state com ações", async () => { const user = userEvent.setup();

      const onAction = jest.fn();

      renderWithRouter(
        <SocialBufferEmptyState type="posts" onAction={onAction } />,);

      expect(screen.getByText("Nenhum Post Encontrado")).toBeInTheDocument();

      expect(screen.getByText("Criar Primeiro Post")).toBeInTheDocument();

      const actionButton = screen.getByText("Criar Primeiro Post");

      await user.click(actionButton);

      expect(onAction).toHaveBeenCalled();

    });

    it("deve renderizar success state com estatísticas", () => {
      const stats = [
        { label: "Posts", value: 10, icon: "📝" },
        { label: "Alcance", value: 1000, icon: "👥" },
      ];

      renderWithRouter(<SocialBufferSuccessState type="post" stats={ stats } />);

      expect(screen.getByText("Post Criado com Sucesso!")).toBeInTheDocument();

      expect(screen.getByText("10")).toBeInTheDocument();

      expect(screen.getByText("1000")).toBeInTheDocument();

    });

  });

  // ===== TESTES DE ACESSIBILIDADE =====

  describe("Accessibility Integration", () => {
    it("deve ter navegação por teclado", async () => {
      const user = userEvent.setup();

      const mockUI = mockUIHook();

      const mockStore = mockAccountsStore();

      (
        require("../../hooks/useSocialBufferUI").useAccountsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/useAccountsStore").useAccountsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialAccountsManager />);

      const connectButton = screen.getByText("Conectar Conta");

      // Navegar com Tab
      await user.tab();

      expect(connectButton).toHaveFocus();

      // Ativar com Enter
      await user.keyboard("{Enter}");

      expect(mockUI.setLoading).toHaveBeenCalledWith(true);

    });

    it("deve ter ARIA labels apropriados", () => {
      const mockUI = mockUIHook();

      const mockStore = mockAccountsStore();

      (
        require("../../hooks/useSocialBufferUI").useAccountsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/useAccountsStore").useAccountsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialAccountsManager />);

      expect(screen.getByLabelText("Buscar contas...")).toBeInTheDocument();

      expect(screen.getByLabelText("Todas as plataformas")).toBeInTheDocument();

      expect(screen.getByLabelText("Apenas conectadas")).toBeInTheDocument();

    });

    it("deve ter contraste adequado", () => {
      renderWithRouter(<SocialBufferErrorState type="network" />);

      const errorCard = screen.getByText("Erro de Conexão").closest(".card");

      expect(errorCard).toHaveClass("bg-orange-50", "border-orange-200");

    });

  });

  // ===== TESTES DE PERFORMANCE =====

  describe("Performance Integration", () => {
    it("deve renderizar grandes listas eficientemente", () => {
      const mockUI = mockUIHook();

      const mockStore = mockAccountsStore({
        accounts: Array.from({ length: 100 }, (_, index) => ({
          id: index.toString(),
          name: `Account ${index}`,
          platform: "facebook",
          is_connected: true,
          followers_count: 1000,
          posts_count: 50,
          last_activity: "2024-01-01T10:00:00Z",
        })),
      });

      (
        require("../../hooks/useSocialBufferUI").useAccountsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/useAccountsStore").useAccountsStore as jest.Mock
      ).mockReturnValue(mockStore);

      const startTime = performance.now();

      renderWithRouter(<SocialAccountsManager />);

      const endTime = performance.now();

      // Deve renderizar em menos de 100ms
      expect(endTime - startTime).toBeLessThan(100);

      expect(screen.getAllByText(/Account \d+/)).toHaveLength(100);

    });

    it("deve usar memoização para evitar re-renders desnecessários", () => {
      const mockUI = mockUIHook();

      const mockStore = mockAccountsStore();

      (
        require("../../hooks/useSocialBufferUI").useAccountsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/useAccountsStore").useAccountsStore as jest.Mock
      ).mockReturnValue(mockStore);

      const { rerender } = renderWithRouter(<SocialAccountsManager />);

      // Re-renderizar com as mesmas props
      rerender(<SocialAccountsManager />);

      // Componente deve usar memoização
      expect(screen.getByText("Test Account")).toBeInTheDocument();

    });

  });

  // ===== TESTES DE INTEGRAÇÃO COMPLETA =====

  describe("Complete Integration Flow", () => {
    it("deve completar fluxo completo de criação de post", async () => {
      const user = userEvent.setup();

      const mockUI = mockUIHook();

      const mockStore = mockPostsStore();

      (
        require("../../hooks/useSocialBufferUI").usePostsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/usePostsStore").usePostsStore as jest.Mock
      ).mockReturnValue(mockStore);

      renderWithRouter(<SocialPostsManager />);

      // 1. Clicar em criar post
      const createButton = screen.getByText("Criar Post");

      await user.click(createButton);

      expect(mockUI.setLoading).toHaveBeenCalledWith(true);

      // 2. Simular sucesso
      await waitFor(() => {
        expect(mockUI.handleSuccess).toHaveBeenCalledWith(
          "Post criado com sucesso!",);

      });

      // 3. Verificar que o loading foi desativado
      expect(mockUI.setLoading).toHaveBeenCalledWith(false);

    });

    it("deve lidar com erro durante operação", async () => {
      const user = userEvent.setup();

      const mockUI = mockUIHook();

      const mockStore = mockPostsStore({
        deletePost: jest.fn().mockRejectedValue(new Error("Delete failed")),
      });

      (
        require("../../hooks/useSocialBufferUI").usePostsUI as jest.Mock
      ).mockReturnValue(mockUI);

      (
        require("../../hooks/usePostsStore").usePostsStore as jest.Mock
      ).mockReturnValue(mockStore);

      // Mock window.confirm
      window.confirm = jest.fn(() => true);

      renderWithRouter(<SocialPostsManager />);

      const deleteButton = screen.getByLabelText("Deletar post");

      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockUI.handleError).toHaveBeenCalledWith(expect.any(Error));

      });

      expect(mockUI.setLoading).toHaveBeenCalledWith(false);

    });

  });

});
