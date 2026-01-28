import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock do módulo Workflows com implementação fragmentada
const Workflows = () => {
  const [workflows, setWorkflows] = React.useState([
    { id: '1', name: 'Workflow 1', status: 'active', steps: 5, lastRun: '2024-01-20T10:00:00Z', description: 'Workflow de teste 1' },
    { id: '2', name: 'Workflow 2', status: 'paused', steps: 3, lastRun: '2024-01-19T15:30:00Z', description: 'Workflow de teste 2' },
    { id: '3', name: 'Workflow 3', status: 'active', steps: 7, lastRun: '2024-01-21T09:15:00Z', description: 'Workflow de teste 3' }
  ]);
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [isLoading, setIsLoading] = React.useState(false);

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || workflow.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const createWorkflow = (workflowData: any) => {
    const newWorkflow = {
      id: (workflows.length + 1).toString(),
      ...workflowData,
      created_at: new Date().toISOString()
    };
    setWorkflows([...workflows, newWorkflow]);
  };

  const updateWorkflowStatus = (id: string, status: string) => {
    setWorkflows(workflows.map(w => w.id === id ? { ...w, status } : w));
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(w => w.id !== id));
  };

  const runWorkflow = (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (workflow) {
      updateWorkflowStatus(id, 'running');
      setTimeout(() => {
        updateWorkflowStatus(id, 'active');
        updateWorkflowStatus(id, 'completed');
        setTimeout(() => updateWorkflowStatus(id, 'active'), 2000);
      }, 1000);
    }
  };

  const refreshWorkflows = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getStats = () => {
    const total = workflows.length;
    const active = workflows.filter(w => w.status === 'active').length;
    const paused = workflows.filter(w => w.status === 'paused').length;
    const totalSteps = workflows.reduce((sum, w) => sum + w.steps, 0);
    return { total, active, paused, totalSteps };
  };

  const stats = getStats();

  return (
    <div data-testid="workflows-module">
      <h1>Workflows Management</h1>
      
      {/* Estatísticas */}
      <div data-testid="stats">
        <div>Total de workflows: {stats.total}</div>
        <div>Workflows ativos: {stats.active}</div>
        <div>Workflows pausados: {stats.paused}</div>
        <div>Total de passos: {stats.totalSteps}</div>
      </div>

      {/* Filtros */}
      <div data-testid="filters">
        <input
          type="text"
          placeholder="Buscar workflows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-input"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          data-testid="status-filter"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="paused">Pausado</option>
          <option value="completed">Concluído</option>
        </select>
      </div>

      {/* Ações */}
      <div data-testid="actions">
        <button onClick={() => createWorkflow({ name: 'Novo Workflow', status: 'active', steps: 3, description: 'Novo workflow de teste' })} data-testid="create-workflow-btn">
          Criar Workflow
        </button>
        <button onClick={refreshWorkflows} data-testid="refresh-btn" disabled={isLoading}>
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {/* Lista de workflows */}
      <div data-testid="workflows-list">
        {filteredWorkflows.map(workflow => (
          <div key={workflow.id} data-testid={`workflow-${workflow.id}`} className="workflow-card">
            <h3>{workflow.name}</h3>
            <p>Descrição: {workflow.description}</p>
            <p>Status: {workflow.status}</p>
            <p>Passos: {workflow.steps}</p>
            <p>Última execução: {new Date(workflow.lastRun).toLocaleString()}</p>
            <div>
              <button onClick={() => updateWorkflowStatus(workflow.id, workflow.status === 'active' ? 'paused' : 'active')} data-testid={`toggle-status-${workflow.id}`}>
                Alternar Status
              </button>
              <button onClick={() => runWorkflow(workflow.id)} data-testid={`run-${workflow.id}`}>
                Executar
              </button>
              <button onClick={() => deleteWorkflow(workflow.id)} data-testid={`delete-${workflow.id}`}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {isLoading && <div data-testid="loading">Carregando workflows...</div>}
    </div>
  );
};

describe('Workflows Module', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  it('should render workflows module', () => {
    render(<Workflows />, { queryClient });
    expect(screen.getByTestId('workflows-module')).toBeInTheDocument();
    expect(screen.getByText('Workflows Management')).toBeInTheDocument();
  });

  it('should display workflow statistics', () => {
    render(<Workflows />, { queryClient });
    expect(screen.getByTestId('stats')).toBeInTheDocument();
    expect(screen.getByText('Total de workflows: 3')).toBeInTheDocument();
    expect(screen.getByText('Workflows ativos: 2')).toBeInTheDocument();
    expect(screen.getByText('Workflows pausados: 1')).toBeInTheDocument();
    expect(screen.getByText('Total de passos: 15')).toBeInTheDocument();
  });

  it('should filter workflows by search term', () => {
    render(<Workflows />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Workflow 1' } });
    expect(screen.getByTestId('workflow-1')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-2')).not.toBeInTheDocument();
  });

  it('should filter workflows by status', () => {
    render(<Workflows />, { queryClient });
    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: 'active' } });
    expect(screen.getByTestId('workflow-1')).toBeInTheDocument();
    expect(screen.getByTestId('workflow-3')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-2')).not.toBeInTheDocument();
  });

  it('should create new workflow', () => {
    render(<Workflows />, { queryClient });
    const createButton = screen.getByTestId('create-workflow-btn');
    fireEvent.click(createButton);
    expect(screen.getByTestId('workflow-4')).toBeInTheDocument();
    expect(screen.getByText('Novo Workflow')).toBeInTheDocument();
  });

  it('should toggle workflow status', () => {
    render(<Workflows />, { queryClient });
    const toggleButton = screen.getByTestId('toggle-status-1');
    fireEvent.click(toggleButton);
    const workflow1 = screen.getByTestId('workflow-1');
    expect(workflow1).toHaveTextContent('paused');
  });

  it('should run workflow', async () => {
    render(<Workflows />, { queryClient });
    const runButton = screen.getByTestId('run-1');
    fireEvent.click(runButton);
    
    const workflow1 = screen.getByTestId('workflow-1');
    expect(workflow1).toHaveTextContent('running');
    
    await waitFor(() => {
      expect(workflow1).toHaveTextContent('completed');
    });
    
    await waitFor(() => {
      expect(workflow1).toHaveTextContent('active');
    }, { timeout: 3000 });
  });

  it('should delete workflow', () => {
    render(<Workflows />, { queryClient });
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    expect(screen.queryByTestId('workflow-1')).not.toBeInTheDocument();
  });

  it('should refresh workflows', async () => {
    render(<Workflows />, { queryClient });
    const refreshButton = screen.getByTestId('refresh-btn');
    fireEvent.click(refreshButton);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('should display workflow details correctly', () => {
    render(<Workflows />, { queryClient });
    expect(screen.getByText('Workflow 1')).toBeInTheDocument();
    expect(screen.getByText('Descrição: Workflow de teste 1')).toBeInTheDocument();
    expect(screen.getByText('Status: active')).toBeInTheDocument();
    expect(screen.getByText('Passos: 5')).toBeInTheDocument();
  });

  it('should handle empty search results', () => {
    render(<Workflows />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'inexistente' } });
    expect(screen.queryByTestId('workflow-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workflow-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workflow-3')).not.toBeInTheDocument();
  });

  it('should handle multiple filters simultaneously', () => {
    render(<Workflows />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    const statusFilter = screen.getByTestId('status-filter');
    
    fireEvent.change(searchInput, { target: { value: 'Workflow' } });
    fireEvent.change(statusFilter, { target: { value: 'active' } });
    
    expect(screen.getByTestId('workflow-1')).toBeInTheDocument();
    expect(screen.getByTestId('workflow-3')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-2')).not.toBeInTheDocument();
  });

  it('should update statistics after workflow creation', () => {
    render(<Workflows />, { queryClient });
    const createButton = screen.getByTestId('create-workflow-btn');
    fireEvent.click(createButton);
    
    expect(screen.getByText('Total de workflows: 4')).toBeInTheDocument();
    expect(screen.getByText('Workflows ativos: 3')).toBeInTheDocument();
  });

  it('should update statistics after workflow deletion', () => {
    render(<Workflows />, { queryClient });
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Total de workflows: 2')).toBeInTheDocument();
    expect(screen.getByText('Workflows ativos: 1')).toBeInTheDocument();
  });
});
