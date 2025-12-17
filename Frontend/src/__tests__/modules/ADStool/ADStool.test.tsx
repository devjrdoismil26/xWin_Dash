import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from "react";

// Mock do módulo ADStool isolado
const ADStool = () => {
  const [campaigns, setCampaigns] = React.useState([
    {
      id: "1",
      name: "Campanha Google Ads",
      platform: "Google",
      status: "active",
      budget: 1000,
      spent: 450,
      clicks: 1200,
      impressions: 50000,
    },
    {
      id: "2",
      name: "Campanha Facebook",
      platform: "Facebook",
      status: "paused",
      budget: 800,
      spent: 200,
      clicks: 800,
      impressions: 30000,
    },
    {
      id: "3",
      name: "Campanha Instagram",
      platform: "Instagram",
      status: "active",
      budget: 600,
      spent: 300,
      clicks: 600,
      impressions: 25000,
    },
  ]);

  const [searchTerm, setSearchTerm] = React.useState("");

  const [selectedPlatform, setSelectedPlatform] = React.useState("");

  const [selectedStatus, setSelectedStatus] = React.useState("");

  const [showCreateForm, setShowCreateForm] = React.useState(false);

  const [newCampaign, setNewCampaign] = React.useState({
    name: "",
    platform: "",
    budget: "",
  });

  const filteredCampaigns = (campaigns || []).filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesPlatform =
      !selectedPlatform || campaign.platform === selectedPlatform;
    const matchesStatus = !selectedStatus || campaign.status === selectedStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const platforms = [...new Set((campaigns || []).map((c) => c.platform))];

  const createCampaign = () => {
    if (newCampaign.name && newCampaign.platform && newCampaign.budget) {
      const campaign = {
        id: String(campaigns.length + 1),
        name: newCampaign.name,
        platform: newCampaign.platform,
        status: "active",
        budget: parseFloat(newCampaign.budget),
        spent: 0,
        clicks: 0,
        impressions: 0,};

      setCampaigns([...campaigns, campaign]);

      setNewCampaign({ name: "", platform: "", budget: "" });

      setShowCreateForm(false);

    } ;

  const updateCampaignStatus = (id: string, status: string) => {
    setCampaigns(
      (campaigns || []).map((c) => (c.id === id ? { ...c, status } : c)),);};

  const deleteCampaign = (id: string) => {
    setCampaigns((campaigns || []).filter((c) => c.id !== id));};

  const refreshCampaigns = () => {
    console.log("Refreshing campaigns...");};

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "paused":
        return "yellow";
      case "stopped":
        return "red";
      default:
        return "gray";
    } ;

  const getROI = (spent: number, budget: number) => {
    if (spent === 0) return 0;
    return (((budget - spent) / spent) * 100).toFixed(1);};

  return (
        <>
      <div data-testid="adstool-module">
      </div><h1>Ferramenta de Anúncios</h1>

      {/* Filtros */}
      <div data-testid="filters">
           
        </div><input
          type="text"
          placeholder="Buscar campanhas..."
          value={ searchTerm }
          onChange={ (e) => setSearchTerm(e.target.value) }
          data-testid="search-input" />
        <select
          value={ selectedPlatform }
          onChange={ (e) => setSelectedPlatform(e.target.value) }
          data-testid="platform-filter"
        >
          <option value="">Todas as plataformas</option>
          {(platforms || []).map((platform) => (
            <option key={platform} value={ platform } />
              {platform}
            </option>
          ))}
        </select>
        <select
          value={ selectedStatus }
          onChange={ (e) => setSelectedStatus(e.target.value) }
          data-testid="status-filter"
        >
          <option value="">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="paused">Pausado</option>
          <option value="stopped">Parado</option></select></div>

      {/* Estatísticas */}
      <div data-testid="stats">
           
        </div><p>Total de campanhas: {campaigns.length}</p>
        <p />
          Orçamento total: R${" "}
          {campaigns.reduce((sum, c) => sum + c.budget, 0).toFixed(2)}
        </p>
        <p />
          Gasto total: R${" "}
          {campaigns.reduce((sum, c) => sum + c.spent, 0).toFixed(2)}
        </p>
        <p>Cliques totais: {campaigns.reduce((sum, c) => sum + c.clicks, 0)}</p>
        <p />
          Impressões totais:{" "}
          {campaigns
            .reduce((sum, c) => sum + c.impressions, 0)
            .toLocaleString()}
        </p>
      </div>

      {/* Botão de criar */}
      <button
        onClick={ () => setShowCreateForm(true) }
        data-testid="create-campaign-btn"
      >
        Criar Campanha
      </button>

      {/* Formulário de criação */}
      {showCreateForm && (
        <div data-testid="create-form">
           
        </div><form
            onSubmit={(e) => {
              e.preventDefault();

              createCampaign();

            } >
            <input
              type="text"
              placeholder="Nome da campanha"
              value={ newCampaign.name }
              onChange={(e) = />
                setNewCampaign({ ...newCampaign, name: e.target.value })
  }
              required />
            <select
              value={ newCampaign.platform }
              onChange={(e) = />
                setNewCampaign({ ...newCampaign, platform: e.target.value })
  }
              required
            >
              <option value="">Selecione a plataforma</option>
              <option value="Google">Google</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option></select><input
              type="number"
              placeholder="Orçamento (R$)"
              value={ newCampaign.budget }
              onChange={(e) = />
                setNewCampaign({ ...newCampaign, budget: e.target.value })
  }
              min="0"
              step="0.01"
              required />
            <button type="submit">Salvar</button>
            <button type="button" onClick={ () => setShowCreateForm(false)  }>
              Cancelar
            </button></form></div>
      )}

      {/* Lista de campanhas */}
      <div data-testid="campaigns-list">
           
        </div>{(filteredCampaigns || []).map((campaign) => (
          <div key={campaign.id} data-testid={`campaign-${campaign.id}`}>
           
        </div><h3>{campaign.name}</h3>
            <p>Plataforma: {campaign.platform}</p>
            <p>Orçamento: R$ {campaign.budget.toFixed(2)}</p>
            <p>Gasto: R$ {campaign.spent.toFixed(2)}</p>
            <p>Cliques: {campaign.clicks}</p>
            <p>Impressões: {campaign.impressions.toLocaleString()}</p>
            <p>ROI: {getROI(campaign.spent, campaign.budget)}%</p>
            <p />
              Status:{" "}
              <span style={color: getStatusColor(campaign.status) } >
           
        </span>{campaign.status}
              </span></p><div data-testid={`actions-${campaign.id}`}>
           
        </div><button
                onClick={ () = />
                  updateCampaignStatus(
                    campaign.id,
                    campaign.status === "active" ? "paused" : "active",
                  )
   }
                data-testid={`toggle-status-${campaign.id}`}
  >
                {campaign.status === "active" ? "Pausar" : "Ativar"}
              </button>
              <button
                onClick={ () => deleteCampaign(campaign.id) }
                data-testid={`delete-${campaign.id}`}
  >
                Excluir
              </button>
      </div>
    </>
  ))}
      </div>

      {/* Botão de refresh */}
      <button onClick={refreshCampaigns} data-testid="refresh-btn" />
        Atualizar Dados
      </button>
    </div>);};

describe("ADStool Module", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

  });

  it("should render ADStool interface", async () => {
    render(<ADStool />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId("adstool-module")).toBeInTheDocument();

      expect(screen.getByText("Ferramenta de Anúncios")).toBeInTheDocument();

    });

  });

  it("should display campaign statistics", async () => {
    render(<ADStool />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId("stats")).toBeInTheDocument();

      expect(screen.getByText("Total de campanhas: 3")).toBeInTheDocument();

      expect(
        screen.getByText("Orçamento total: R$ 2400.00"),
      ).toBeInTheDocument();

      expect(screen.getByText("Gasto total: R$ 950.00")).toBeInTheDocument();

      expect(screen.getByText("Cliques totais: 2600")).toBeInTheDocument();

      expect(
        screen.getByText("Impressões totais: 105.000"),
      ).toBeInTheDocument();

    });

  });

  it("should filter campaigns by search term", async () => {
    render(<ADStool />, { queryClient });

    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(searchInput, { target: { value: "Google" } );

    await waitFor(() => {
      expect(screen.getByTestId("campaign-1")).toBeInTheDocument();

      expect(screen.queryByTestId("campaign-2")).not.toBeInTheDocument();

    });

  });

  it("should filter campaigns by platform", async () => {
    render(<ADStool />, { queryClient });

    const platformFilter = screen.getByTestId("platform-filter");

    fireEvent.change(platformFilter, { target: { value: "Facebook" } );

    await waitFor(() => {
      expect(screen.getByTestId("campaign-2")).toBeInTheDocument();

      expect(screen.queryByTestId("campaign-1")).not.toBeInTheDocument();

    });

  });

  it("should filter campaigns by status", async () => {
    render(<ADStool />, { queryClient });

    const statusFilter = screen.getByTestId("status-filter");

    fireEvent.change(statusFilter, { target: { value: "active" } );

    await waitFor(() => {
      expect(screen.getByTestId("campaign-1")).toBeInTheDocument();

      expect(screen.getByTestId("campaign-3")).toBeInTheDocument();

      expect(screen.queryByTestId("campaign-2")).not.toBeInTheDocument();

    });

  });

  it("should create new campaign", async () => {
    render(<ADStool />, { queryClient });

    const createButton = screen.getByTestId("create-campaign-btn");

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId("create-form")).toBeInTheDocument();

    });

    const nameInput = screen.getByPlaceholderText("Nome da campanha");

    fireEvent.change(nameInput, { target: { value: "Nova Campanha" } );

    const platformSelect = screen.getByDisplayValue("Selecione a plataforma");

    fireEvent.change(platformSelect, { target: { value: "LinkedIn" } );

    const budgetInput = screen.getByPlaceholderText("Orçamento (R$)");

    fireEvent.change(budgetInput, { target: { value: "1500" } );

    const form = screen.getByTestId("create-form").querySelector("form")!;
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByTestId("campaign-4")).toBeInTheDocument();

      expect(screen.getByText("Nova Campanha")).toBeInTheDocument();

    });

  });

  it("should toggle campaign status", async () => {
    render(<ADStool />, { queryClient });

    const toggleButton = screen.getByTestId("toggle-status-1");

    fireEvent.click(toggleButton);

    await waitFor(() => {
      const campaign1 = screen.getByTestId("campaign-1");

      expect(campaign1).toHaveTextContent("paused");

    });

  });

  it("should delete campaign", async () => {
    render(<ADStool />, { queryClient });

    const deleteButton = screen.getByTestId("delete-1");

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByTestId("campaign-1")).not.toBeInTheDocument();

    });

  });

  it("should refresh campaigns data", async () => {
    const consoleSpy = vi.spyOn(console, "log");

    render(<ADStool />, { queryClient });

    const refreshButton = screen.getByTestId("refresh-btn");

    fireEvent.click(refreshButton);

    expect(consoleSpy).toHaveBeenCalledWith("Refreshing campaigns...");

  });

  it("should display all campaigns when no filters applied", async () => {
    render(<ADStool />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId("campaign-1")).toBeInTheDocument();

      expect(screen.getByTestId("campaign-2")).toBeInTheDocument();

      expect(screen.getByTestId("campaign-3")).toBeInTheDocument();

    });

  });

  it("should show campaign details correctly", async () => {
    render(<ADStool />, { queryClient });

    await waitFor(() => {
      expect(screen.getByText("Campanha Google Ads")).toBeInTheDocument();

      expect(screen.getByText("Plataforma: Google")).toBeInTheDocument();

      expect(screen.getByText("Orçamento: R$ 1000.00")).toBeInTheDocument();

      expect(screen.getByText("Gasto: R$ 450.00")).toBeInTheDocument();

      expect(screen.getByText("Cliques: 1200")).toBeInTheDocument();

      expect(screen.getByText("Impressões: 50.000")).toBeInTheDocument();

    });

  });

  it("should calculate ROI correctly", async () => {
    render(<ADStool />, { queryClient });

    await waitFor(() => {
      // ROI = ((budget - spent) / spent * 100)
      // Para campanha 1: ((1000 - 450) / 450 * 100) = 122.2%
      expect(screen.getByText("ROI: 122.2%")).toBeInTheDocument();

    });

  });

  it("should show empty state when no campaigns match filters", async () => {
    render(<ADStool />, { queryClient });

    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(searchInput, {
      target: { value: "Campanha Inexistente" },
    });

    await waitFor(() => {
      expect(screen.queryByTestId("campaign-1")).not.toBeInTheDocument();

      expect(screen.queryByTestId("campaign-2")).not.toBeInTheDocument();

      expect(screen.queryByTestId("campaign-3")).not.toBeInTheDocument();

    });

  });

});
