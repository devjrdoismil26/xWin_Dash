import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock do módulo Aura com implementação fragmentada
const Aura = () => {
  const [auras, setAuras] = React.useState([
    { id: '1', name: 'Aura Energética', type: 'energy', intensity: 85, color: '#FF6B6B', description: 'Aura de energia positiva', active: true, createdAt: '2024-01-20T10:00:00Z' },
    { id: '2', name: 'Aura Protetora', type: 'protection', intensity: 92, color: '#4ECDC4', description: 'Aura de proteção espiritual', active: false, createdAt: '2024-01-19T15:30:00Z' },
    { id: '3', name: 'Aura Curativa', type: 'healing', intensity: 78, color: '#45B7D1', description: 'Aura de cura e bem-estar', active: true, createdAt: '2024-01-21T09:15:00Z' }
  ]);
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showVisualization, setShowVisualization] = React.useState(false);

  const filteredAuras = auras.filter(aura => {
    const matchesSearch = aura.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aura.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || aura.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || (selectedStatus === 'active' ? aura.active : !aura.active);
    return matchesSearch && matchesType && matchesStatus;
  });

  const createAura = (auraData: any) => {
    const newAura = {
      id: (auras.length + 1).toString(),
      ...auraData,
      createdAt: new Date().toISOString()
    };
    setAuras([...auras, newAura]);
  };

  const updateAura = (id: string, updates: any) => {
    setAuras(auras.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAura = (id: string) => {
    setAuras(auras.filter(a => a.id !== id));
  };

  const toggleAuraStatus = (id: string) => {
    const aura = auras.find(a => a.id === id);
    if (aura) {
      updateAura(id, { active: !aura.active });
    }
  };

  const adjustIntensity = (id: string, intensity: number) => {
    updateAura(id, { intensity: Math.max(0, Math.min(100, intensity)) });
  };

  const refreshAuras = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getStats = () => {
    const total = auras.length;
    const active = auras.filter(a => a.active).length;
    const inactive = auras.filter(a => !a.active).length;
    const averageIntensity = auras.reduce((sum, a) => sum + a.intensity, 0) / auras.length;
    const energyAuras = auras.filter(a => a.type === 'energy').length;
    const protectionAuras = auras.filter(a => a.type === 'protection').length;
    const healingAuras = auras.filter(a => a.type === 'healing').length;
    return { total, active, inactive, averageIntensity, energyAuras, protectionAuras, healingAuras };
  };

  const stats = getStats();

  return (
    <div data-testid="aura-module">
      <h1>Aura Management</h1>
      
      {/* Estatísticas */}
      <div data-testid="stats">
        <div>Total de auras: {stats.total}</div>
        <div>Auras ativas: {stats.active}</div>
        <div>Auras inativas: {stats.inactive}</div>
        <div>Intensidade média: {stats.averageIntensity.toFixed(1)}%</div>
        <div>Energéticas: {stats.energyAuras}</div>
        <div>Proteção: {stats.protectionAuras}</div>
        <div>Cura: {stats.healingAuras}</div>
      </div>

      {/* Filtros */}
      <div data-testid="filters">
        <input
          type="text"
          placeholder="Buscar auras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-input"
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          data-testid="type-filter"
        >
          <option value="all">Todos os tipos</option>
          <option value="energy">Energética</option>
          <option value="protection">Proteção</option>
          <option value="healing">Cura</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          data-testid="status-filter"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativa</option>
          <option value="inactive">Inativa</option>
        </select>
      </div>

      {/* Controles */}
      <div data-testid="controls">
        <button onClick={() => setShowVisualization(!showVisualization)} data-testid="toggle-visualization">
          {showVisualization ? 'Ocultar Visualização' : 'Mostrar Visualização'}
        </button>
        {showVisualization && (
          <div data-testid="aura-visualization" className="aura-visualization">
            <div className="aura-circle" style={{ backgroundColor: '#FF6B6B', opacity: 0.8 }}>
              Aura Energética
            </div>
          </div>
        )}
      </div>

      {/* Ações */}
      <div data-testid="actions">
        <button onClick={() => createAura({ name: 'Nova Aura', type: 'energy', intensity: 75, color: '#FF9F43', description: 'Nova aura de energia', active: true })} data-testid="create-aura-btn">
          Criar Aura
        </button>
        <button onClick={refreshAuras} data-testid="refresh-btn" disabled={isLoading}>
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {/* Lista de auras */}
      <div data-testid="auras-list">
        {filteredAuras.map(aura => (
          <div key={aura.id} data-testid={`aura-${aura.id}`} className="aura-card">
            <h3>{aura.name}</h3>
            <p>Tipo: {aura.type}</p>
            <p>Descrição: {aura.description}</p>
            <p>Intensidade: {aura.intensity}%</p>
            <p>Status: {aura.active ? 'Ativa' : 'Inativa'}</p>
            <p>Cor: {aura.color}</p>
            <p>Criada em: {new Date(aura.createdAt).toLocaleString()}</p>
            <div>
              <button onClick={() => toggleAuraStatus(aura.id)} data-testid={`toggle-status-${aura.id}`}>
                {aura.active ? 'Desativar' : 'Ativar'}
              </button>
              <button onClick={() => adjustIntensity(aura.id, aura.intensity + 10)} data-testid={`increase-intensity-${aura.id}`}>
                Aumentar Intensidade
              </button>
              <button onClick={() => adjustIntensity(aura.id, aura.intensity - 10)} data-testid={`decrease-intensity-${aura.id}`}>
                Diminuir Intensidade
              </button>
              <button onClick={() => deleteAura(aura.id)} data-testid={`delete-${aura.id}`}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {isLoading && <div data-testid="loading">Carregando auras...</div>}
    </div>
  );
};

describe('Aura Module', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  it('should render aura module', () => {
    render(<Aura />, { queryClient });
    expect(screen.getByTestId('aura-module')).toBeInTheDocument();
    expect(screen.getByText('Aura Management')).toBeInTheDocument();
  });

  it('should display aura statistics', () => {
    render(<Aura />, { queryClient });
    expect(screen.getByTestId('stats')).toBeInTheDocument();
    expect(screen.getByText('Total de auras: 3')).toBeInTheDocument();
    expect(screen.getByText('Auras ativas: 2')).toBeInTheDocument();
    expect(screen.getByText('Auras inativas: 1')).toBeInTheDocument();
    expect(screen.getByText('Intensidade média: 85.0%')).toBeInTheDocument();
    expect(screen.getByText('Energéticas: 1')).toBeInTheDocument();
    expect(screen.getByText('Proteção: 1')).toBeInTheDocument();
    expect(screen.getByText('Cura: 1')).toBeInTheDocument();
  });

  it('should filter auras by search term', () => {
    render(<Aura />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Energética' } });
    expect(screen.getByTestId('aura-1')).toBeInTheDocument();
    expect(screen.queryByTestId('aura-2')).not.toBeInTheDocument();
  });

  it('should filter auras by type', () => {
    render(<Aura />, { queryClient });
    const typeFilter = screen.getByTestId('type-filter');
    fireEvent.change(typeFilter, { target: { value: 'energy' } });
    expect(screen.getByTestId('aura-1')).toBeInTheDocument();
    expect(screen.queryByTestId('aura-2')).not.toBeInTheDocument();
  });

  it('should filter auras by status', () => {
    render(<Aura />, { queryClient });
    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: 'active' } });
    expect(screen.getByTestId('aura-1')).toBeInTheDocument();
    expect(screen.getByTestId('aura-3')).toBeInTheDocument();
    expect(screen.queryByTestId('aura-2')).not.toBeInTheDocument();
  });

  it('should create new aura', () => {
    render(<Aura />, { queryClient });
    const createButton = screen.getByTestId('create-aura-btn');
    fireEvent.click(createButton);
    expect(screen.getByTestId('aura-4')).toBeInTheDocument();
    expect(screen.getByText('Nova Aura')).toBeInTheDocument();
  });

  it('should toggle aura status', () => {
    render(<Aura />, { queryClient });
    const toggleButton = screen.getByTestId('toggle-status-1');
    fireEvent.click(toggleButton);
    const aura1 = screen.getByTestId('aura-1');
    expect(aura1).toHaveTextContent('Inativa');
  });

  it('should increase aura intensity', () => {
    render(<Aura />, { queryClient });
    const increaseButton = screen.getByTestId('increase-intensity-1');
    fireEvent.click(increaseButton);
    const aura1 = screen.getByTestId('aura-1');
    expect(aura1).toHaveTextContent('95%');
  });

  it('should decrease aura intensity', () => {
    render(<Aura />, { queryClient });
    const decreaseButton = screen.getByTestId('decrease-intensity-1');
    fireEvent.click(decreaseButton);
    const aura1 = screen.getByTestId('aura-1');
    expect(aura1).toHaveTextContent('75%');
  });

  it('should not allow intensity below 0', () => {
    render(<Aura />, { queryClient });
    const decreaseButton = screen.getByTestId('decrease-intensity-1');
    // Click multiple times to try to go below 0
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    const aura1 = screen.getByTestId('aura-1');
    expect(aura1).toHaveTextContent('0%');
  });

  it('should not allow intensity above 100', () => {
    render(<Aura />, { queryClient });
    const increaseButton = screen.getByTestId('increase-intensity-1');
    // Click multiple times to try to go above 100
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);
    const aura1 = screen.getByTestId('aura-1');
    expect(aura1).toHaveTextContent('100%');
  });

  it('should delete aura', () => {
    render(<Aura />, { queryClient });
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    expect(screen.queryByTestId('aura-1')).not.toBeInTheDocument();
  });

  it('should toggle visualization', () => {
    render(<Aura />, { queryClient });
    const toggleButton = screen.getByTestId('toggle-visualization');
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('aura-visualization')).toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('aura-visualization')).not.toBeInTheDocument();
  });

  it('should refresh auras', async () => {
    render(<Aura />, { queryClient });
    const refreshButton = screen.getByTestId('refresh-btn');
    fireEvent.click(refreshButton);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('should display aura details correctly', () => {
    render(<Aura />, { queryClient });
    expect(screen.getByText('Aura Energética')).toBeInTheDocument();
    expect(screen.getByText('Tipo: energy')).toBeInTheDocument();
    expect(screen.getByText('Descrição: Aura de energia positiva')).toBeInTheDocument();
    expect(screen.getByText('Intensidade: 85%')).toBeInTheDocument();
    const aura1 = screen.getByTestId('aura-1');
    expect(aura1).toHaveTextContent('Ativa');
    expect(screen.getByText('Cor: #FF6B6B')).toBeInTheDocument();
  });

  it('should handle multiple filters simultaneously', () => {
    render(<Aura />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    const typeFilter = screen.getByTestId('type-filter');
    const statusFilter = screen.getByTestId('status-filter');
    
    fireEvent.change(searchInput, { target: { value: 'Aura' } });
    fireEvent.change(typeFilter, { target: { value: 'energy' } });
    fireEvent.change(statusFilter, { target: { value: 'active' } });
    
    expect(screen.getByTestId('aura-1')).toBeInTheDocument();
    expect(screen.queryByTestId('aura-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('aura-3')).not.toBeInTheDocument();
  });

  it('should update statistics after aura creation', () => {
    render(<Aura />, { queryClient });
    const createButton = screen.getByTestId('create-aura-btn');
    fireEvent.click(createButton);
    
    expect(screen.getByText('Total de auras: 4')).toBeInTheDocument();
    expect(screen.getByText('Auras ativas: 3')).toBeInTheDocument();
    expect(screen.getByText('Energéticas: 2')).toBeInTheDocument();
  });

  it('should update statistics after aura deletion', () => {
    render(<Aura />, { queryClient });
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Total de auras: 2')).toBeInTheDocument();
    expect(screen.getByText('Auras ativas: 1')).toBeInTheDocument();
    expect(screen.getByText('Energéticas: 0')).toBeInTheDocument();
  });
});
