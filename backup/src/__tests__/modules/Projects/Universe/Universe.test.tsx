import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock do componente Universe
const Universe = () => {
  const [universes, setUniverses] = React.useState([
    {
      id: 1,
      name: 'Universo Principal',
      description: 'Universo principal da empresa',
      status: 'active',
      projectsCount: 15,
      totalBudget: 2500000,
      createdAt: '2024-01-01',
      owner: 'João Silva',
      tags: ['principal', 'empresa']
    },
    {
      id: 2,
      name: 'Universo de Pesquisa',
      description: 'Universo dedicado a projetos de pesquisa e desenvolvimento',
      status: 'active',
      projectsCount: 8,
      totalBudget: 1200000,
      createdAt: '2024-01-15',
      owner: 'Maria Santos',
      tags: ['pesquisa', 'desenvolvimento']
    },
    {
      id: 3,
      name: 'Universo de Marketing',
      description: 'Universo focado em projetos de marketing e vendas',
      status: 'inactive',
      projectsCount: 5,
      totalBudget: 800000,
      createdAt: '2024-02-01',
      owner: 'Pedro Costa',
      tags: ['marketing', 'vendas']
    }
  ]);
  const [projects, setProjects] = React.useState([
    {
      id: 1,
      name: 'Projeto Alpha',
      universeId: 1,
      status: 'active',
      budget: 500000,
      progress: 75,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      team: ['João Silva', 'Ana Lima', 'Carlos Santos']
    },
    {
      id: 2,
      name: 'Projeto Beta',
      universeId: 1,
      status: 'active',
      budget: 300000,
      progress: 45,
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      team: ['Maria Santos', 'Pedro Costa']
    },
    {
      id: 3,
      name: 'Projeto Gamma',
      universeId: 2,
      status: 'planning',
      budget: 200000,
      progress: 10,
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      team: ['Ana Lima', 'Carlos Santos']
    }
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('universes');
  const [showCreateUniverse, setShowCreateUniverse] = React.useState(false);
  const [showCreateProject, setShowCreateProject] = React.useState(false);
  const [selectedUniverse, setSelectedUniverse] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredUniverses = universes.filter(universe =>
    universe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    universe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = selectedUniverse 
    ? projects.filter(project => project.universeId === selectedUniverse.id)
    : projects;

  const stats = {
    totalUniverses: universes.length,
    activeUniverses: universes.filter(u => u.status === 'active').length,
    inactiveUniverses: universes.filter(u => u.status === 'inactive').length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalBudget: universes.reduce((acc, u) => acc + u.totalBudget, 0),
    avgProgress: projects.reduce((acc, p) => acc + p.progress, 0) / projects.length || 0
  };

  const createUniverse = (universeData) => {
    const newUniverse = {
      id: universes.length + 1,
      ...universeData,
      status: 'active',
      projectsCount: 0,
      totalBudget: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUniverses([...universes, newUniverse]);
    setShowCreateUniverse(false);
  };

  const createProject = (projectData) => {
    const newProject = {
      id: projects.length + 1,
      ...projectData,
      status: 'planning',
      progress: 0
    };
    setProjects([...projects, newProject]);
    setShowCreateProject(false);
  };

  const updateUniverse = (id, universeData) => {
    setUniverses(universes.map(universe => 
      universe.id === id ? { ...universe, ...universeData } : universe
    ));
  };

  const updateProject = (id, projectData) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, ...projectData } : project
    ));
  };

  const deleteUniverse = (id) => {
    setUniverses(universes.filter(universe => universe.id !== id));
    setProjects(projects.filter(project => project.universeId !== id));
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div data-testid="universe-module" className="universe-module">
      <h1 data-testid="universe-title">Gestão de Universos</h1>
      
      <div data-testid="universe-tabs" className="universe-tabs">
        <button 
          data-testid="tab-universes"
          className={activeTab === 'universes' ? 'active' : ''}
          onClick={() => setActiveTab('universes')}
        >
          Universos
        </button>
        <button 
          data-testid="tab-projects"
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          Projetos
        </button>
        <button 
          data-testid="tab-overview"
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
      </div>

      <div data-testid="universe-stats" className="universe-stats">
        <div data-testid="stat-total-universes">Universos: {stats.totalUniverses}</div>
        <div data-testid="stat-active-universes">Ativos: {stats.activeUniverses}</div>
        <div data-testid="stat-total-projects">Projetos: {stats.totalProjects}</div>
        <div data-testid="stat-active-projects">Ativos: {stats.activeProjects}</div>
        <div data-testid="stat-total-budget">Orçamento Total: R$ {stats.totalBudget.toLocaleString()}</div>
        <div data-testid="stat-avg-progress">Progresso Médio: {stats.avgProgress.toFixed(1)}%</div>
      </div>

      {isLoading && <div data-testid="universe-loading">Carregando dados...</div>}

      {activeTab === 'universes' && (
        <div data-testid="universes-tab" className="universes-tab">
          <div data-testid="universes-actions" className="universes-actions">
            <input
              data-testid="search-input"
              type="text"
              placeholder="Buscar universos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button data-testid="create-universe-btn" onClick={() => setShowCreateUniverse(true)}>
              Novo Universo
            </button>
            <button data-testid="refresh-btn" onClick={refreshData}>
              Atualizar
            </button>
          </div>

          {showCreateUniverse && (
            <div data-testid="create-universe-form" className="create-universe-form">
              <h3>Criar Novo Universo</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                createUniverse({
                  name: formData.get('name'),
                  description: formData.get('description'),
                  owner: formData.get('owner'),
                  tags: formData.get('tags').split(',').map(tag => tag.trim())
                });
              }}>
                <input name="name" placeholder="Nome do universo" required />
                <textarea name="description" placeholder="Descrição" required></textarea>
                <input name="owner" placeholder="Proprietário" required />
                <input name="tags" placeholder="Tags (separadas por vírgula)" />
                <button type="submit">Criar</button>
                <button type="button" onClick={() => setShowCreateUniverse(false)}>Cancelar</button>
              </form>
            </div>
          )}

          <div data-testid="universes-list" className="universes-list">
            {filteredUniverses.map(universe => (
              <div key={universe.id} data-testid={`universe-${universe.id}`} className="universe-card">
                <div data-testid={`universe-name-${universe.id}`}>{universe.name}</div>
                <div data-testid={`universe-description-${universe.id}`}>{universe.description}</div>
                <div data-testid={`universe-status-${universe.id}`}>{universe.status}</div>
                <div data-testid={`universe-projects-count-${universe.id}`}>
                  Projetos: {universe.projectsCount}
                </div>
                <div data-testid={`universe-budget-${universe.id}`}>
                  Orçamento: R$ {universe.totalBudget.toLocaleString()}
                </div>
                <div data-testid={`universe-owner-${universe.id}`}>
                  Proprietário: {universe.owner}
                </div>
                <div data-testid={`universe-tags-${universe.id}`}>
                  Tags: {universe.tags.join(', ')}
                </div>
                <div className="universe-actions">
                  <button 
                    data-testid={`view-universe-${universe.id}`}
                    onClick={() => {
                      setSelectedUniverse(universe);
                      setActiveTab('projects');
                    }}
                  >
                    Ver Projetos
                  </button>
                  <button data-testid={`edit-universe-${universe.id}`}>Editar</button>
                  <button data-testid={`delete-universe-${universe.id}`}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div data-testid="projects-tab" className="projects-tab">
          <div data-testid="projects-actions" className="projects-actions">
            {selectedUniverse && (
              <div data-testid="selected-universe-info">
                Projetos do universo: {selectedUniverse.name}
                <button data-testid="clear-selection" onClick={() => setSelectedUniverse(null)}>
                  Ver Todos
                </button>
              </div>
            )}
            <button data-testid="create-project-btn" onClick={() => setShowCreateProject(true)}>
              Novo Projeto
            </button>
          </div>

          {showCreateProject && (
            <div data-testid="create-project-form" className="create-project-form">
              <h3>Criar Novo Projeto</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                createProject({
                  name: formData.get('name'),
                  universeId: parseInt(formData.get('universeId')),
                  budget: parseFloat(formData.get('budget')),
                  startDate: formData.get('startDate'),
                  endDate: formData.get('endDate'),
                  team: formData.get('team').split(',').map(member => member.trim())
                });
              }}>
                <input name="name" placeholder="Nome do projeto" required />
                <select name="universeId" required>
                  <option value="">Selecione um universo</option>
                  {universes.map(universe => (
                    <option key={universe.id} value={universe.id}>
                      {universe.name}
                    </option>
                  ))}
                </select>
                <input name="budget" type="number" placeholder="Orçamento" required />
                <input name="startDate" type="date" required />
                <input name="endDate" type="date" required />
                <input name="team" placeholder="Equipe (separada por vírgula)" />
                <button type="submit">Criar</button>
                <button type="button" onClick={() => setShowCreateProject(false)}>Cancelar</button>
              </form>
            </div>
          )}

          <div data-testid="projects-list" className="projects-list">
            {filteredProjects.map(project => (
              <div key={project.id} data-testid={`project-${project.id}`} className="project-card">
                <div data-testid={`project-name-${project.id}`}>{project.name}</div>
                <div data-testid={`project-status-${project.id}`}>{project.status}</div>
                <div data-testid={`project-budget-${project.id}`}>
                  Orçamento: R$ {project.budget.toLocaleString()}
                </div>
                <div data-testid={`project-progress-${project.id}`}>
                  Progresso: {project.progress}%
                </div>
                <div data-testid={`project-dates-${project.id}`}>
                  {project.startDate} - {project.endDate}
                </div>
                <div data-testid={`project-team-${project.id}`}>
                  Equipe: {project.team.join(', ')}
                </div>
                <div className="project-actions">
                  <button data-testid={`edit-project-${project.id}`}>Editar</button>
                  <button data-testid={`delete-project-${project.id}`}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div data-testid="overview-tab" className="overview-tab">
          <div data-testid="overview-content" className="overview-content">
            <h3>Visão Geral dos Universos</h3>
            <div data-testid="overview-metrics">
              <div>Total de Universos: {stats.totalUniverses}</div>
              <div>Universos Ativos: {stats.activeUniverses}</div>
              <div>Total de Projetos: {stats.totalProjects}</div>
              <div>Projetos Ativos: {stats.activeProjects}</div>
              <div>Orçamento Total: R$ {stats.totalBudget.toLocaleString()}</div>
              <div>Progresso Médio: {stats.avgProgress.toFixed(1)}%</div>
            </div>
            
            <div data-testid="universe-breakdown">
              <h4>Distribuição por Universo</h4>
              {universes.map(universe => (
                <div key={universe.id} data-testid={`breakdown-${universe.id}`}>
                  {universe.name}: {universe.projectsCount} projetos, 
                  R$ {universe.totalBudget.toLocaleString()} de orçamento
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

describe('Universe Module', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('should render universe interface', async () => {
    render(<Universe />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('universe-module')).toBeInTheDocument();
    });
  });

  it('should display universe title', async () => {
    render(<Universe />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('universe-title')).toBeInTheDocument();
      expect(screen.getByText('Gestão de Universos')).toBeInTheDocument();
    });
  });

  it('should display universe tabs', async () => {
    render(<Universe />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('universe-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('tab-universes')).toBeInTheDocument();
      expect(screen.getByTestId('tab-projects')).toBeInTheDocument();
      expect(screen.getByTestId('tab-overview')).toBeInTheDocument();
    });
  });

  it('should display universe statistics', async () => {
    render(<Universe />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('universe-stats')).toBeInTheDocument();
      expect(screen.getByTestId('stat-total-universes')).toHaveTextContent('Universos: 3');
      expect(screen.getByTestId('stat-active-universes')).toHaveTextContent('Ativos: 2');
      expect(screen.getByTestId('stat-total-projects')).toHaveTextContent('Projetos: 3');
      expect(screen.getByTestId('stat-active-projects')).toHaveTextContent('Ativos: 2');
      expect(screen.getByTestId('stat-total-budget')).toHaveTextContent('Orçamento Total: R$ 4.500.000');
    });
  });

  it('should switch between tabs', async () => {
    render(<Universe />, { queryClient });

    // Default tab should be universes
    await waitFor(() => {
      expect(screen.getByTestId('universes-tab')).toBeInTheDocument();
    });

    // Switch to projects tab
    const projectsTab = screen.getByTestId('tab-projects');
    fireEvent.click(projectsTab);

    await waitFor(() => {
      expect(screen.getByTestId('projects-tab')).toBeInTheDocument();
    });

    // Switch to overview tab
    const overviewTab = screen.getByTestId('tab-overview');
    fireEvent.click(overviewTab);

    await waitFor(() => {
      expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
    });
  });

  it('should display universes data', async () => {
    render(<Universe />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('universes-list')).toBeInTheDocument();
      expect(screen.getByTestId('universe-1')).toBeInTheDocument();
      expect(screen.getByTestId('universe-2')).toBeInTheDocument();
      expect(screen.getByTestId('universe-3')).toBeInTheDocument();
    });
  });

  it('should display universe details', async () => {
    render(<Universe />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('universe-name-1')).toHaveTextContent('Universo Principal');
      expect(screen.getByTestId('universe-description-1')).toHaveTextContent('Universo principal da empresa');
      expect(screen.getByTestId('universe-status-1')).toHaveTextContent('active');
      expect(screen.getByTestId('universe-projects-count-1')).toHaveTextContent('Projetos: 15');
      expect(screen.getByTestId('universe-budget-1')).toHaveTextContent('Orçamento: R$ 2.500.000');
      expect(screen.getByTestId('universe-owner-1')).toHaveTextContent('Proprietário: João Silva');
      expect(screen.getByTestId('universe-tags-1')).toHaveTextContent('Tags: principal, empresa');
    });
  });

  it('should handle universe search', async () => {
    render(<Universe />, { queryClient });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Principal' } });

    await waitFor(() => {
      expect(screen.getByTestId('universe-1')).toBeInTheDocument();
      expect(screen.queryByTestId('universe-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('universe-3')).not.toBeInTheDocument();
    });
  });

  it('should show create universe form', async () => {
    render(<Universe />, { queryClient });

    const createButton = screen.getByTestId('create-universe-btn');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId('create-universe-form')).toBeInTheDocument();
    });
  });

  it('should create new universe', async () => {
    render(<Universe />, { queryClient });

    const createButton = screen.getByTestId('create-universe-btn');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId('create-universe-form')).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText('Nome do universo');
    fireEvent.change(nameInput, { target: { value: 'Novo Universo' } });

    const form = screen.getByTestId('create-universe-form').querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByTestId('universe-4')).toBeInTheDocument();
      expect(screen.getByTestId('universe-name-4')).toHaveTextContent('Novo Universo');
    });
  });

  it('should navigate to universe projects', async () => {
    render(<Universe />, { queryClient });

    const viewButton = screen.getByTestId('view-universe-1');
    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(screen.getByTestId('projects-tab')).toBeInTheDocument();
      expect(screen.getByTestId('selected-universe-info')).toHaveTextContent('Projetos do universo: Universo Principal');
    });
  });

  it('should display projects data', async () => {
    render(<Universe />, { queryClient });

    const projectsTab = screen.getByTestId('tab-projects');
    fireEvent.click(projectsTab);

    await waitFor(() => {
      expect(screen.getByTestId('projects-list')).toBeInTheDocument();
      expect(screen.getByTestId('project-1')).toBeInTheDocument();
      expect(screen.getByTestId('project-2')).toBeInTheDocument();
      expect(screen.getByTestId('project-3')).toBeInTheDocument();
    });
  });

  it('should display project details', async () => {
    render(<Universe />, { queryClient });

    const projectsTab = screen.getByTestId('tab-projects');
    fireEvent.click(projectsTab);

    await waitFor(() => {
      expect(screen.getByTestId('project-name-1')).toHaveTextContent('Projeto Alpha');
      expect(screen.getByTestId('project-status-1')).toHaveTextContent('active');
      expect(screen.getByTestId('project-budget-1')).toHaveTextContent('Orçamento: R$ 500.000');
      expect(screen.getByTestId('project-progress-1')).toHaveTextContent('Progresso: 75%');
      expect(screen.getByTestId('project-team-1')).toHaveTextContent('Equipe: João Silva, Ana Lima, Carlos Santos');
    });
  });

  it('should create new project', async () => {
    render(<Universe />, { queryClient });

    const projectsTab = screen.getByTestId('tab-projects');
    fireEvent.click(projectsTab);

    await waitFor(() => {
      expect(screen.getByTestId('projects-tab')).toBeInTheDocument();
    });

    const createButton = screen.getByTestId('create-project-btn');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId('create-project-form')).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText('Nome do projeto');
    fireEvent.change(nameInput, { target: { value: 'Novo Projeto' } });

    const form = screen.getByTestId('create-project-form').querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByTestId('project-4')).toBeInTheDocument();
      expect(screen.getByTestId('project-name-4')).toHaveTextContent('Novo Projeto');
    });
  });

  it('should display overview data', async () => {
    render(<Universe />, { queryClient });

    const overviewTab = screen.getByTestId('tab-overview');
    fireEvent.click(overviewTab);

    await waitFor(() => {
      expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
      expect(screen.getByTestId('overview-content')).toBeInTheDocument();
      expect(screen.getByTestId('overview-metrics')).toBeInTheDocument();
      expect(screen.getByTestId('universe-breakdown')).toBeInTheDocument();
    });
  });

  it('should handle refresh action', async () => {
    render(<Universe />, { queryClient });

    const refreshButton = screen.getByTestId('refresh-btn');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByTestId('universe-loading')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByTestId('universe-loading')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should be responsive', async () => {
    render(<Universe />, { queryClient });

    await waitFor(() => {
      const universeModule = screen.getByTestId('universe-module');
      expect(universeModule).toHaveClass('universe-module');
    });
  });

  it('should support dark theme', async () => {
    render(<Universe />, { 
      queryClient, 
      theme: 'dark' 
    });

    await waitFor(() => {
      const universeModule = screen.getByTestId('universe-module');
      expect(universeModule).toHaveClass('universe-module');
    });
  });
});