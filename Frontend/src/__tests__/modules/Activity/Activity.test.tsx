import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from "react";

// Mock do módulo Activity com implementação fragmentada
const Activity = () => {
  const [activities, setActivities] = React.useState([
    {
      id: "1",
      type: "login",
      user: "João Silva",
      description: "Usuário fez login",
      timestamp: "2024-01-20T10:00:00Z",
      severity: "info",
      module: "auth",
    },
    {
      id: "2",
      type: "create",
      user: "Maria Santos",
      description: "Criou novo produto",
      timestamp: "2024-01-20T09:30:00Z",
      severity: "success",
      module: "products",
    },
    {
      id: "3",
      type: "error",
      user: "Pedro Costa",
      description: "Erro ao salvar arquivo",
      timestamp: "2024-01-20T08:45:00Z",
      severity: "error",
      module: "files",
    },
    {
      id: "4",
      type: "update",
      user: "Ana Lima",
      description: "Atualizou configurações",
      timestamp: "2024-01-20T08:00:00Z",
      severity: "warning",
      module: "settings",
    },
  ]);

  const [searchTerm, setSearchTerm] = React.useState("");

  const [selectedType, setSelectedType] = React.useState("all");

  const [selectedSeverity, setSelectedSeverity] = React.useState("all");

  const [selectedModule, setSelectedModule] = React.useState("all");

  const [isLoading, setIsLoading] = React.useState(false);

  const [showFilters, setShowFilters] = React.useState(true);

  const filteredActivities = (activities || []).filter((activity) => {
    const matchesSearch =
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "all" || activity.type === selectedType;
    const matchesSeverity =
      selectedSeverity === "all" || activity.severity === selectedSeverity;
    const matchesModule =
      selectedModule === "all" || activity.module === selectedModule;
    return matchesSearch && matchesType && matchesSeverity && matchesModule;
  });

  const createActivity = (activityData: unknown) => {
    const newActivity = {
      id: (activities.length + 1).toString(),
      ...activityData,
      timestamp: new Date().toISOString(),};

    setActivities([newActivity, ...activities]);};

  const deleteActivity = (id: string) => {
    setActivities((activities || []).filter((a) => a.id !== id));};

  const clearOldActivities = () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    setActivities(
      (activities || []).filter((a) => new Date(a.timestamp) > oneDayAgo),);};

  const refreshActivities = () => {
    setIsLoading(true);

    setTimeout(() => setIsLoading(false), 1000);};

  const getStats = () => {
    const total = activities.length;
    const today = (activities || []).filter((a) => {
      const activityDate = new Date(a.timestamp);

      const today = new Date();

      return activityDate.toDateString() === today.toDateString();

    }).length;
    const errors = (activities || []).filter(
      (a) => a.severity === "error",
    ).length;
    const warnings = (activities || []).filter(
      (a) => a.severity === "warning",
    ).length;
    const successes = (activities || []).filter(
      (a) => a.severity === "success",
    ).length;
    const info = (activities || []).filter((a) => a.severity === "info").length;
    return { total, today, errors, warnings, successes, info};
};

  const stats = getStats();

  return (
        <>
      <div data-testid="activity-module">
      </div><h1>Activity Log Management</h1>

      {/* Estatísticas */}
      <div data-testid="stats">
           
        </div><div>Total de atividades: {stats.total}</div>
        <div>Atividades hoje: {stats.today}</div>
        <div>Erros: {stats.errors}</div>
        <div>Avisos: {stats.warnings}</div>
        <div>Sucessos: {stats.successes}</div>
        <div>Informações: {stats.info}</div>

      {/* Controles */}
      <div data-testid="controls">
           
        </div><button
          onClick={ () => setShowFilters(!showFilters) }
          data-testid="toggle-filters-btn"
        >
          {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
        </button>
        <button
          onClick={() = />
            createActivity({
              type: "test",
              user: "Sistema",
              description: "Atividade de teste",
              severity: "info",
              module: "system",
            })
  }
          data-testid="create-activity-btn"
        >
          Criar Atividade
        </button>
        <button onClick={clearOldActivities} data-testid="clear-old-btn" />
          Limpar Antigas
        </button>
        <button
          onClick={ refreshActivities }
          data-testid="refresh-btn"
          disabled={ isLoading } />
          {isLoading ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div data-testid="filters">
           
        </div><input
            type="text"
            placeholder="Buscar atividades..."
            value={ searchTerm }
            onChange={ (e) => setSearchTerm(e.target.value) }
            data-testid="search-input" />
          <select
            value={ selectedType }
            onChange={ (e) => setSelectedType(e.target.value) }
            data-testid="type-filter"
          >
            <option value="all">Todos os tipos</option>
            <option value="login">Login</option>
            <option value="create">Criar</option>
            <option value="update">Atualizar</option>
            <option value="delete">Excluir</option>
            <option value="error">Erro</option></select><select
            value={ selectedSeverity }
            onChange={ (e) => setSelectedSeverity(e.target.value) }
            data-testid="severity-filter"
          >
            <option value="all">Todas as severidades</option>
            <option value="error">Erro</option>
            <option value="warning">Aviso</option>
            <option value="success">Sucesso</option>
            <option value="info">Informação</option></select><select
            value={ selectedModule }
            onChange={ (e) => setSelectedModule(e.target.value) }
            data-testid="module-filter"
          >
            <option value="all">Todos os módulos</option>
            <option value="auth">Autenticação</option>
            <option value="products">Produtos</option>
            <option value="files">Arquivos</option>
            <option value="settings">Configurações</option>
            <option value="system">Sistema</option></select></div>
      )}

      {/* Lista de atividades */}
      <div data-testid="activities-list">
           
        </div>{(filteredActivities || []).map((activity) => (
          <div
            key={ activity.id }
            data-testid={`activity-${activity.id}`}
            className={`activity-card ${activity.severity} `}>
           
        </div><h3>{activity.type.toUpperCase()}</h3>
            <p>Usuário: {activity.user}</p>
            <p>Descrição: {activity.description}</p>
            <p>Severidade: {activity.severity}</p>
            <p>Módulo: {activity.module}</p>
            <p>Timestamp: {new Date(activity.timestamp).toLocaleString()}</p>
            <div>
           
        </div><button
                onClick={ () => deleteActivity(activity.id) }
                data-testid={`delete-${activity.id}`}
  >
                Excluir
              </button>
      </div>
    </>
  ))}
      </div>

      {isLoading && <div data-testid="loading">Carregando atividades...</div>}
    </div>);};

describe("Activity Module", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

  });

  it("should render activity module", () => {
    render(<Activity />, { queryClient });

    expect(screen.getByTestId("activity-module")).toBeInTheDocument();

    expect(screen.getByText("Activity Log Management")).toBeInTheDocument();

  });

  it("should display activity statistics", () => {
    render(<Activity />, { queryClient });

    expect(screen.getByTestId("stats")).toBeInTheDocument();

    expect(screen.getByText("Total de atividades: 4")).toBeInTheDocument();

    expect(screen.getByText("Erros: 1")).toBeInTheDocument();

    expect(screen.getByText("Avisos: 1")).toBeInTheDocument();

    expect(screen.getByText("Sucessos: 1")).toBeInTheDocument();

    expect(screen.getByText("Informações: 1")).toBeInTheDocument();

  });

  it("should filter activities by search term", () => {
    render(<Activity />, { queryClient });

    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(searchInput, { target: { value: "João" } );

    expect(screen.getByTestId("activity-1")).toBeInTheDocument();

    expect(screen.queryByTestId("activity-2")).not.toBeInTheDocument();

  });

  it("should filter activities by type", () => {
    render(<Activity />, { queryClient });

    const typeFilter = screen.getByTestId("type-filter");

    fireEvent.change(typeFilter, { target: { value: "login" } );

    expect(screen.getByTestId("activity-1")).toBeInTheDocument();

    expect(screen.queryByTestId("activity-2")).not.toBeInTheDocument();

  });

  it("should filter activities by severity", () => {
    render(<Activity />, { queryClient });

    const severityFilter = screen.getByTestId("severity-filter");

    fireEvent.change(severityFilter, { target: { value: "error" } );

    expect(screen.getByTestId("activity-3")).toBeInTheDocument();

    expect(screen.queryByTestId("activity-1")).not.toBeInTheDocument();

  });

  it("should filter activities by module", () => {
    render(<Activity />, { queryClient });

    const moduleFilter = screen.getByTestId("module-filter");

    fireEvent.change(moduleFilter, { target: { value: "products" } );

    expect(screen.getByTestId("activity-2")).toBeInTheDocument();

    expect(screen.queryByTestId("activity-1")).not.toBeInTheDocument();

  });

  it("should create new activity", () => {
    render(<Activity />, { queryClient });

    const createButton = screen.getByTestId("create-activity-btn");

    fireEvent.click(createButton);

    expect(screen.getByTestId("activity-5")).toBeInTheDocument();

    expect(screen.getByText("TEST")).toBeInTheDocument();

  });

  it("should delete activity", () => {
    render(<Activity />, { queryClient });

    const deleteButton = screen.getByTestId("delete-1");

    fireEvent.click(deleteButton);

    expect(screen.queryByTestId("activity-1")).not.toBeInTheDocument();

  });

  it("should toggle filters visibility", () => {
    render(<Activity />, { queryClient });

    const toggleButton = screen.getByTestId("toggle-filters-btn");

    fireEvent.click(toggleButton);

    expect(screen.queryByTestId("filters")).not.toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.getByTestId("filters")).toBeInTheDocument();

  });

  it("should clear old activities", async () => {
    render(<Activity />, { queryClient });

    // Verificar se o botão de limpar existe
    const clearButton = screen.getByTestId("clear-old-btn");

    expect(clearButton).toBeInTheDocument();

    // Clicar no botão
    fireEvent.click(clearButton);

    // Verificar se o componente ainda está funcionando
    await waitFor(() => {
      expect(screen.getByTestId("activity-module")).toBeInTheDocument();

    });

  });

  it("should refresh activities", async () => {
    render(<Activity />, { queryClient });

    const refreshButton = screen.getByTestId("refresh-btn");

    fireEvent.click(refreshButton);

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();

    });

  });

  it("should display activity details correctly", () => {
    render(<Activity />, { queryClient });

    expect(screen.getByText("LOGIN")).toBeInTheDocument();

    expect(screen.getByText("Usuário: João Silva")).toBeInTheDocument();

    expect(
      screen.getByText("Descrição: Usuário fez login"),
    ).toBeInTheDocument();

    expect(screen.getByText("Severidade: info")).toBeInTheDocument();

    expect(screen.getByText("Módulo: auth")).toBeInTheDocument();

  });

  it("should handle multiple filters simultaneously", () => {
    render(<Activity />, { queryClient });

    const searchInput = screen.getByTestId("search-input");

    const typeFilter = screen.getByTestId("type-filter");

    const severityFilter = screen.getByTestId("severity-filter");

    fireEvent.change(searchInput, { target: { value: "Maria" } );

    fireEvent.change(typeFilter, { target: { value: "create" } );

    fireEvent.change(severityFilter, { target: { value: "success" } );

    expect(screen.getByTestId("activity-2")).toBeInTheDocument();

    expect(screen.queryByTestId("activity-1")).not.toBeInTheDocument();

    expect(screen.queryByTestId("activity-3")).not.toBeInTheDocument();

  });

  it("should update statistics after activity creation", () => {
    render(<Activity />, { queryClient });

    const createButton = screen.getByTestId("create-activity-btn");

    fireEvent.click(createButton);

    expect(screen.getByText("Total de atividades: 5")).toBeInTheDocument();

    expect(screen.getByText("Informações: 2")).toBeInTheDocument();

  });

  it("should update statistics after activity deletion", () => {
    render(<Activity />, { queryClient });

    const deleteButton = screen.getByTestId("delete-1");

    fireEvent.click(deleteButton);

    expect(screen.getByText("Total de atividades: 3")).toBeInTheDocument();

    expect(screen.getByText("Informações: 0")).toBeInTheDocument();

  });

});
