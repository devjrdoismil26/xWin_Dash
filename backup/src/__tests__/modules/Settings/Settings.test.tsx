import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock do módulo Settings com implementação fragmentada
const Settings = () => {
  const [settings, setSettings] = React.useState([
    { id: '1', key: 'app_name', value: 'xWin Dash', category: 'general', type: 'text', description: 'Nome da aplicação' },
    { id: '2', key: 'theme', value: 'dark', category: 'appearance', type: 'select', description: 'Tema da aplicação', options: ['light', 'dark'] },
    { id: '3', key: 'max_upload_size', value: '10', category: 'files', type: 'number', description: 'Tamanho máximo de upload (MB)' },
    { id: '4', key: 'email_notifications', value: 'true', category: 'notifications', type: 'boolean', description: 'Notificações por email' },
    { id: '5', key: 'api_timeout', value: '30', category: 'api', type: 'number', description: 'Timeout da API (segundos)' }
  ]);
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedType, setSelectedType] = React.useState('all');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const filteredSettings = settings.filter(setting => {
    const matchesSearch = setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || setting.category === selectedCategory;
    const matchesType = selectedType === 'all' || setting.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const updateSetting = (id: string, value: string) => {
    setSettings(settings.map(s => s.id === id ? { ...s, value } : s));
  };

  const resetSetting = (id: string) => {
    const setting = settings.find(s => s.id === id);
    if (setting) {
      const defaultValues: { [key: string]: string } = {
        'app_name': 'xWin Dash',
        'theme': 'dark',
        'max_upload_size': '10',
        'email_notifications': 'true',
        'api_timeout': '30'
      };
      updateSetting(id, defaultValues[setting.key] || '');
    }
  };

  const resetAllSettings = () => {
    const defaultValues: { [key: string]: string } = {
      'app_name': 'xWin Dash',
      'theme': 'dark',
      'max_upload_size': '10',
      'email_notifications': 'true',
      'api_timeout': '30'
    };
    setSettings(settings.map(s => ({ ...s, value: defaultValues[s.key] || s.value })));
  };

  const refreshSettings = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getStats = () => {
    const total = settings.length;
    const general = settings.filter(s => s.category === 'general').length;
    const appearance = settings.filter(s => s.category === 'appearance').length;
    const files = settings.filter(s => s.category === 'files').length;
    const notifications = settings.filter(s => s.category === 'notifications').length;
    const api = settings.filter(s => s.category === 'api').length;
    return { total, general, appearance, files, notifications, api };
  };

  const stats = getStats();

  return (
    <div data-testid="settings-module">
      <h1>Settings Management</h1>
      
      {/* Estatísticas */}
      <div data-testid="stats">
        <div>Total de configurações: {stats.total}</div>
        <div>Geral: {stats.general}</div>
        <div>Aparência: {stats.appearance}</div>
        <div>Arquivos: {stats.files}</div>
        <div>Notificações: {stats.notifications}</div>
        <div>API: {stats.api}</div>
      </div>

      {/* Controles */}
      <div data-testid="controls">
        <button onClick={() => setShowAdvanced(!showAdvanced)} data-testid="toggle-advanced-btn">
          {showAdvanced ? 'Ocultar Avançado' : 'Mostrar Avançado'}
        </button>
        <button onClick={resetAllSettings} data-testid="reset-all-btn">
          Resetar Tudo
        </button>
        <button onClick={refreshSettings} data-testid="refresh-btn" disabled={isLoading}>
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {/* Filtros */}
      <div data-testid="filters">
        <input
          type="text"
          placeholder="Buscar configurações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          data-testid="category-filter"
        >
          <option value="all">Todas as categorias</option>
          <option value="general">Geral</option>
          <option value="appearance">Aparência</option>
          <option value="files">Arquivos</option>
          <option value="notifications">Notificações</option>
          <option value="api">API</option>
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          data-testid="type-filter"
        >
          <option value="all">Todos os tipos</option>
          <option value="text">Texto</option>
          <option value="number">Número</option>
          <option value="boolean">Booleano</option>
          <option value="select">Seleção</option>
        </select>
      </div>

      {/* Configurações avançadas */}
      {showAdvanced && (
        <div data-testid="advanced-settings" className="advanced-settings">
          <h3>Configurações Avançadas</h3>
          <div>
            <label>Debug Mode:</label>
            <input type="checkbox" data-testid="debug-mode" />
          </div>
          <div>
            <label>Log Level:</label>
            <select data-testid="log-level">
              <option value="error">Error</option>
              <option value="warn">Warn</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>
        </div>
      )}

      {/* Lista de configurações */}
      <div data-testid="settings-list">
        {filteredSettings.map(setting => (
          <div key={setting.id} data-testid={`setting-${setting.id}`} className="setting-card">
            <h3>{setting.key}</h3>
            <p>Descrição: {setting.description}</p>
            <p>Categoria: {setting.category}</p>
            <p>Tipo: {setting.type}</p>
            <div>
              {setting.type === 'text' && (
                <input
                  type="text"
                  value={setting.value}
                  onChange={(e) => updateSetting(setting.id, e.target.value)}
                  data-testid={`input-${setting.id}`}
                />
              )}
              {setting.type === 'number' && (
                <input
                  type="number"
                  value={setting.value}
                  onChange={(e) => updateSetting(setting.id, e.target.value)}
                  data-testid={`input-${setting.id}`}
                />
              )}
              {setting.type === 'boolean' && (
                <input
                  type="checkbox"
                  checked={setting.value === 'true'}
                  onChange={(e) => updateSetting(setting.id, e.target.checked.toString())}
                  data-testid={`input-${setting.id}`}
                />
              )}
              {setting.type === 'select' && (
                <select
                  value={setting.value}
                  onChange={(e) => updateSetting(setting.id, e.target.value)}
                  data-testid={`input-${setting.id}`}
                >
                  {setting.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <button onClick={() => resetSetting(setting.id)} data-testid={`reset-${setting.id}`}>
                Resetar
              </button>
            </div>
          </div>
        ))}
      </div>

      {isLoading && <div data-testid="loading">Carregando configurações...</div>}
    </div>
  );
};

describe('Settings Module', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  it('should render settings module', () => {
    render(<Settings />, { queryClient });
    expect(screen.getByTestId('settings-module')).toBeInTheDocument();
    expect(screen.getByText('Settings Management')).toBeInTheDocument();
  });

  it('should display settings statistics', () => {
    render(<Settings />, { queryClient });
    expect(screen.getByTestId('stats')).toBeInTheDocument();
    expect(screen.getByText('Total de configurações: 5')).toBeInTheDocument();
    expect(screen.getByText('Geral: 1')).toBeInTheDocument();
    expect(screen.getByText('Aparência: 1')).toBeInTheDocument();
    expect(screen.getByText('Arquivos: 1')).toBeInTheDocument();
    expect(screen.getByText('Notificações: 1')).toBeInTheDocument();
    expect(screen.getByText('API: 1')).toBeInTheDocument();
  });

  it('should filter settings by search term', () => {
    render(<Settings />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'app_name' } });
    expect(screen.getByTestId('setting-1')).toBeInTheDocument();
    expect(screen.queryByTestId('setting-2')).not.toBeInTheDocument();
  });

  it('should filter settings by category', () => {
    render(<Settings />, { queryClient });
    const categoryFilter = screen.getByTestId('category-filter');
    fireEvent.change(categoryFilter, { target: { value: 'general' } });
    expect(screen.getByTestId('setting-1')).toBeInTheDocument();
    expect(screen.queryByTestId('setting-2')).not.toBeInTheDocument();
  });

  it('should filter settings by type', () => {
    render(<Settings />, { queryClient });
    const typeFilter = screen.getByTestId('type-filter');
    fireEvent.change(typeFilter, { target: { value: 'text' } });
    expect(screen.getByTestId('setting-1')).toBeInTheDocument();
    expect(screen.queryByTestId('setting-2')).not.toBeInTheDocument();
  });

  it('should update text setting', () => {
    render(<Settings />, { queryClient });
    const input = screen.getByTestId('input-1');
    fireEvent.change(input, { target: { value: 'Novo Nome' } });
    expect(input).toHaveValue('Novo Nome');
  });

  it('should update number setting', () => {
    render(<Settings />, { queryClient });
    const input = screen.getByTestId('input-3');
    fireEvent.change(input, { target: { value: '20' } });
    expect(input).toHaveValue(20);
  });

  it('should update boolean setting', () => {
    render(<Settings />, { queryClient });
    const input = screen.getByTestId('input-4');
    fireEvent.click(input);
    expect(input).toHaveAttribute('checked');
  });

  it('should update select setting', () => {
    render(<Settings />, { queryClient });
    const select = screen.getByTestId('input-2');
    fireEvent.change(select, { target: { value: 'light' } });
    expect(select).toHaveValue('light');
  });

  it('should reset individual setting', () => {
    render(<Settings />, { queryClient });
    const input = screen.getByTestId('input-1');
    fireEvent.change(input, { target: { value: 'Nome Alterado' } });
    
    const resetButton = screen.getByTestId('reset-1');
    fireEvent.click(resetButton);
    
    expect(input).toHaveValue('xWin Dash');
  });

  it('should reset all settings', () => {
    render(<Settings />, { queryClient });
    const input1 = screen.getByTestId('input-1');
    const input3 = screen.getByTestId('input-3');
    
    fireEvent.change(input1, { target: { value: 'Nome Alterado' } });
    fireEvent.change(input3, { target: { value: '50' } });
    
    const resetAllButton = screen.getByTestId('reset-all-btn');
    fireEvent.click(resetAllButton);
    
    expect(input1).toHaveValue('xWin Dash');
    expect(input3).toHaveValue(10);
  });

  it('should toggle advanced settings', () => {
    render(<Settings />, { queryClient });
    const toggleButton = screen.getByTestId('toggle-advanced-btn');
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('advanced-settings')).toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('advanced-settings')).not.toBeInTheDocument();
  });

  it('should refresh settings', async () => {
    render(<Settings />, { queryClient });
    const refreshButton = screen.getByTestId('refresh-btn');
    fireEvent.click(refreshButton);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('should display setting details correctly', () => {
    render(<Settings />, { queryClient });
    expect(screen.getByText('app_name')).toBeInTheDocument();
    expect(screen.getByText('Descrição: Nome da aplicação')).toBeInTheDocument();
    expect(screen.getByText('Categoria: general')).toBeInTheDocument();
    expect(screen.getByText('Tipo: text')).toBeInTheDocument();
  });

  it('should handle multiple filters simultaneously', () => {
    render(<Settings />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    const categoryFilter = screen.getByTestId('category-filter');
    const typeFilter = screen.getByTestId('type-filter');
    
    fireEvent.change(searchInput, { target: { value: 'theme' } });
    fireEvent.change(categoryFilter, { target: { value: 'appearance' } });
    fireEvent.change(typeFilter, { target: { value: 'select' } });
    
    expect(screen.getByTestId('setting-2')).toBeInTheDocument();
    expect(screen.queryByTestId('setting-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('setting-3')).not.toBeInTheDocument();
  });

  it('should show advanced settings controls', () => {
    render(<Settings />, { queryClient });
    const toggleButton = screen.getByTestId('toggle-advanced-btn');
    fireEvent.click(toggleButton);
    
    expect(screen.getByTestId('debug-mode')).toBeInTheDocument();
    expect(screen.getByTestId('log-level')).toBeInTheDocument();
  });
});
