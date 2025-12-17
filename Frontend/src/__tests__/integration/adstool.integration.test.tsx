/**
 * Testes de integração do módulo ADStool
 * Testa fluxos completos e integração entre componentes
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ADStoolIndex from "../index";
import ADStoolDetailPage from "../pages/ADStoolDetailPage";
import ADStoolCreatePage from "../pages/ADStoolCreatePage";
import { ADStoolHeader, ADStoolStats, ADStoolFeatures, ADStoolQuickActions,  } from '../components';
import { useADStool } from '../hooks/useADStool';

// Mock do hook useADStool
jest.mock("../hooks/useADStool");

const mockUseADStool = useADStool as jest.MockedFunction<typeof useADStool>;

const mockAuth = {
  user: {
    id: 1,
    name: "Test User",
    email: "test@example.com",
  },};

const mockCampaigns = [
  {
    id: "1",
    name: "Test Campaign 1",
    status: "ACTIVE",
    platform: "Google Ads",
    daily_budget: 100,
    total_spend: 1000,
    impressions: 10000,
    clicks: 500,
    conversions: 25,
  },
  {
    id: "2",
    name: "Test Campaign 2",
    status: "PAUSED",
    platform: "Facebook Ads",
    daily_budget: 200,
    total_spend: 2000,
    impressions: 20000,
    clicks: 1000,
    conversions: 50,
  },
];

const mockAccounts = [
  {
    id: "1",
    name: "Test Account 1",
    platform: "Google Ads",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Test Account 2",
    platform: "Facebook Ads",
    status: "ACTIVE",
  },
];

const mockUseADStoolReturn = {
  campaigns: mockCampaigns,
  accounts: mockAccounts,
  loading: false,
  fetchCampaigns: jest.fn(),
  fetchAccounts: jest.fn(),
  fetchAnalyticsSummary: jest.fn(),
  getActiveCampaigns: jest.fn(() => [mockCampaigns[0]]),
  getPausedCampaigns: jest.fn(() => [mockCampaigns[1]]),
  getTotalSpend: jest.fn(() => 3000),
  getTotalImpressions: jest.fn(() => 30000),
  getTotalClicks: jest.fn(() => 1500),
  getTotalConversions: jest.fn(() => 75),
  getAverageCTR: jest.fn(() => 5.0),
  getAverageCPC: jest.fn(() => 2.0),
  getConnectedAccounts: jest.fn(() => mockAccounts),
  formatCurrency: jest.fn(
    (value) => `R$ ${value.toFixed(2).replace(".", ",")}`,
  ),
  formatNumber: jest.fn((value) => value.toLocaleString("pt-BR")),
  formatPercentage: jest.fn((value) => `${(value * 100).toFixed(2)}%`),};

describe("ADStool Integration Tests", () => {
  beforeEach(() => {
    mockUseADStool.mockReturnValue(mockUseADStoolReturn);

  });

  afterEach(() => {
    jest.clearAllMocks();

  });

  describe("ADStoolIndex Component", () => {
    it("should render main dashboard with all sections", async () => {
      render(
        <BrowserRouter />
          <ADStoolIndex auth={mockAuth} / />
        </BrowserRouter>,);

      // Check if main elements are rendered
      expect(screen.getByText("ADStool")).toBeInTheDocument();

      expect(screen.getByText("Dashboard Avançado")).toBeInTheDocument();

      expect(screen.getByText("Teste de Integração")).toBeInTheDocument();

      expect(screen.getByText("Campanhas")).toBeInTheDocument();

      expect(screen.getByText("Contas")).toBeInTheDocument();

      expect(screen.getByText("Criativos")).toBeInTheDocument();

      expect(screen.getByText("Analytics")).toBeInTheDocument();

    });

    it("should display campaign statistics correctly", () => {
      render(
        <BrowserRouter />
          <ADStoolIndex auth={mockAuth} / />
        </BrowserRouter>,);

      expect(screen.getByText("2")).toBeInTheDocument(); // Total campaigns
      expect(screen.getByText("1 Ativas")).toBeInTheDocument();

      expect(screen.getByText("1 Pausadas")).toBeInTheDocument();

    });

    it("should switch to advanced dashboard when button is clicked", async () => {
      render(
        <BrowserRouter />
          <ADStoolIndex auth={mockAuth} / />
        </BrowserRouter>,);

      const advancedButton = screen.getByText("Dashboard Avançado");

      fireEvent.click(advancedButton);

      await waitFor(() => {
        expect(
          screen.getByText("Voltar ao Dashboard Básico"),
        ).toBeInTheDocument();

      });

    });

    it("should switch to integration test when button is clicked", async () => {
      render(
        <BrowserRouter />
          <ADStoolIndex auth={mockAuth} / />
        </BrowserRouter>,);

      const testButton = screen.getByText("Teste de Integração");

      fireEvent.click(testButton);

      await waitFor(() => {
        expect(screen.getByText("Voltar ao Dashboard")).toBeInTheDocument();

      });

    });

  });

  describe("ADStoolHeader Component", () => {
    it("should render header with title and buttons", () => {
      const mockOnAdvancedDashboard = jest.fn();

      const mockOnIntegrationTest = jest.fn();

      render(
        <ADStoolHeader
          onAdvancedDashboard={ mockOnAdvancedDashboard }
          onIntegrationTest={ mockOnIntegrationTest } />,);

      expect(screen.getByText("ADStool")).toBeInTheDocument();

      expect(screen.getByText("Dashboard Avançado")).toBeInTheDocument();

      expect(screen.getByText("Teste de Integração")).toBeInTheDocument();

    });

    it("should call callbacks when buttons are clicked", () => {
      const mockOnAdvancedDashboard = jest.fn();

      const mockOnIntegrationTest = jest.fn();

      render(
        <ADStoolHeader
          onAdvancedDashboard={ mockOnAdvancedDashboard }
          onIntegrationTest={ mockOnIntegrationTest } />,);

      fireEvent.click(screen.getByText("Dashboard Avançado"));

      expect(mockOnAdvancedDashboard).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText("Teste de Integração"));

      expect(mockOnIntegrationTest).toHaveBeenCalledTimes(1);

    });

  });

  describe("ADStoolStats Component", () => {
    it("should display all statistics correctly", () => {
      render(
        <ADStoolStats
          campaigns={ mockCampaigns }
          activeCampaigns={ [mockCampaigns[0]] }
          pausedCampaigns={ [mockCampaigns[1]] }
          getTotalSpend={ () => 3000 }
          getTotalImpressions={ () => 30000 }
          getTotalClicks={ () => 1500 }
          getAverageCTR={ () => 5.0 }
          formatPercentage={(value) => `${value}%`} />,);

      expect(screen.getByText("2")).toBeInTheDocument(); // Total campaigns
      expect(screen.getByText("1 Ativas")).toBeInTheDocument();

      expect(screen.getByText("1 Pausadas")).toBeInTheDocument();

      expect(screen.getByText("Campanhas")).toBeInTheDocument();

      expect(screen.getByText("Gasto Total")).toBeInTheDocument();

      expect(screen.getByText("Impressões")).toBeInTheDocument();

      expect(screen.getByText("Cliques")).toBeInTheDocument();

    });

  });

  describe("ADStoolFeatures Component", () => {
    it("should render all feature cards", () => {
      render(
        <ADStoolFeatures campaigns={mockCampaigns} accounts={ mockAccounts } />,);

      expect(
        screen.getByText("Funcionalidades Disponíveis"),
      ).toBeInTheDocument();

      expect(screen.getByText("Campanhas")).toBeInTheDocument();

      expect(screen.getByText("Contas")).toBeInTheDocument();

      expect(screen.getByText("Criativos")).toBeInTheDocument();

      expect(screen.getByText("Analytics")).toBeInTheDocument();

    });

    it("should display correct counts for features", () => {
      render(
        <ADStoolFeatures campaigns={mockCampaigns} accounts={ mockAccounts } />,);

      expect(screen.getByText("2 itens")).toBeInTheDocument(); // Campaigns count
      expect(screen.getByText("2 itens")).toBeInTheDocument(); // Accounts count
    });

  });

  describe("ADStoolQuickActions Component", () => {
    it("should render all quick action buttons", () => {
      render(<ADStoolQuickActions />);

      expect(screen.getByText("Ações Rápidas")).toBeInTheDocument();

      expect(screen.getByText("Nova Campanha")).toBeInTheDocument();

      expect(screen.getByText("Conectar Conta")).toBeInTheDocument();

      expect(screen.getByText("Ver Analytics")).toBeInTheDocument();

    });

  });

  describe("ADStoolDetailPage Component", () => {
    it("should render campaign details correctly", async () => {
      render(
        <BrowserRouter />
          <ADStoolDetailPage auth={mockAuth} type="campaign" id="1" / />
        </BrowserRouter>,);

      await waitFor(() => {
        expect(screen.getByText("Campanha de Verão 2024")).toBeInTheDocument();

        expect(screen.getByText("ACTIVE")).toBeInTheDocument();

        expect(screen.getByText("Google Ads")).toBeInTheDocument();

      });

    });

    it("should render account details correctly", async () => {
      render(
        <BrowserRouter />
          <ADStoolDetailPage auth={mockAuth} type="account" id="1" / />
        </BrowserRouter>,);

      await waitFor(() => {
        expect(screen.getByText("Conta Principal")).toBeInTheDocument();

        expect(screen.getByText("Google Ads")).toBeInTheDocument();

      });

    });

    it("should handle back navigation", async () => {
      render(
        <BrowserRouter />
          <ADStoolDetailPage auth={mockAuth} type="campaign" id="1" / />
        </BrowserRouter>,);

      await waitFor(() => {
        const backButton = screen.getByText("Voltar");

        expect(backButton).toBeInTheDocument();

      });

    });

  });

  describe("ADStoolCreatePage Component", () => {
    it("should render create form for campaign", () => {
      render(
        <BrowserRouter />
          <ADStoolCreatePage auth={mockAuth} type="campaign" / />
        </BrowserRouter>,);

      expect(screen.getByText("Nova Campanha")).toBeInTheDocument();

      expect(screen.getByText("Nome *")).toBeInTheDocument();

      expect(screen.getByText("Plataforma *")).toBeInTheDocument();

      expect(screen.getByText("Orçamento Diário (R$)")).toBeInTheDocument();

      expect(screen.getByText("Descrição")).toBeInTheDocument();

    });

    it("should render create form for account", () => {
      render(
        <BrowserRouter />
          <ADStoolCreatePage auth={mockAuth} type="account" / />
        </BrowserRouter>,);

      expect(screen.getByText("Nova Conta")).toBeInTheDocument();

      expect(screen.getByText("Nome *")).toBeInTheDocument();

      expect(screen.getByText("Plataforma *")).toBeInTheDocument();

    });

    it("should handle form submission", async () => {
      render(
        <BrowserRouter />
          <ADStoolCreatePage auth={mockAuth} type="campaign" / />
        </BrowserRouter>,);

      const nameInput = screen.getByPlaceholderText(
        "Digite o nome do campaign",);

      const platformSelect = screen.getByDisplayValue(
        "Selecione uma plataforma",);

      const submitButton = screen.getByText("Criar campaign");

      fireEvent.change(nameInput, { target: { value: "Test Campaign" } );

      fireEvent.change(platformSelect, { target: { value: "Google Ads" } );

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Criando...")).toBeInTheDocument();

      });

    });

  });

  describe("Error Handling", () => {
    it("should handle loading states correctly", () => {
      mockUseADStool.mockReturnValue({
        ...mockUseADStoolReturn,
        loading: true,
      });

      render(
        <BrowserRouter />
          <ADStoolIndex auth={mockAuth} / />
        </BrowserRouter>,);

      // Should show loading state or handle gracefully
      expect(screen.getByText("ADStool")).toBeInTheDocument();

    });

    it("should handle empty data states", () => {
      mockUseADStool.mockReturnValue({
        ...mockUseADStoolReturn,
        campaigns: [],
        accounts: [],
      });

      render(
        <BrowserRouter />
          <ADStoolIndex auth={mockAuth} / />
        </BrowserRouter>,);

      expect(screen.getByText("Começando com ADStool")).toBeInTheDocument();

    });

  });

});
