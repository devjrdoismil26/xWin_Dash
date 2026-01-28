/**
 * Testes de integração do módulo Activity
 * Testa fluxos completos e integração entre componentes
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ActivityDashboard } from '../components/ActivityDashboard';
import { ActivityStats } from '../components/ActivityStats';
import { ActivityFilters } from '../components/ActivityFilters';
import { ActivityList } from '../components/ActivityList';
import { useActivity } from '../hooks/useActivity';
import { ActivityLog } from '../types';

// Mock do hook
jest.mock('../hooks/useActivity');
const mockUseActivity = useActivity as jest.MockedFunction<typeof useActivity>;

// Mock data
const mockLogs: ActivityLog[] = [
  {
    id: '1',
    log_name: 'user.created',
    description: 'Usuário criado',
    causer_type: 'User',
    causer_id: 'user-1',
    subject_type: 'App\\Models\\User',
    subject_id: 'user-1',
    properties: { name: 'John Doe' },
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    log_name: 'error.occurred',
    description: 'Erro no sistema',
    causer_type: 'System',
    causer_id: 'system-1',
    properties: { error: 'Database connection failed' },
    created_at: '2024-01-01T11:00:00Z',
    updated_at: '2024-01-01T11:00:00Z'
  }
];

const mockStats = {
  total_logs: 2,
  today_logs: 1,
  active_users: 1,
  error_logs: 1,
  api_calls: 5
};

describe('Activity Integration Tests', () => {
  beforeEach(() => {
    mockUseActivity.mockReturnValue({
      logs: mockLogs,
      loading: false,
      error: null,
      pagination: null,
      stats: mockStats,
      activityStats: {
        total: 2,
        today: 1,
        activeUsers: 1,
        errors: 1
      },
      hasActivity: true,
      hasEntities: true,
      hasSelection: false,
      statsLoading: false,
      filters: {},
      selectedIds: [],
      applyFilters: jest.fn(),
      fetchEntities: jest.fn(),
      fetchLogs: jest.fn(),
      fetchLogById: jest.fn(),
      fetchStats: jest.fn(),
      exportData: jest.fn(),
      clearOldData: jest.fn(),
      setFilters: jest.fn(),
      clearFilters: jest.fn(),
      handleEntitySelect: jest.fn(),
      handleSelectAll: jest.fn(),
      handleClearSelection: jest.fn(),
      getLogType: jest.fn((name) => name.split('.')[0]),
      getLogIcon: jest.fn(() => 'Activity'),
      getLogColor: jest.fn(() => 'blue'),
      formatLogDescription: jest.fn((log) => log.description),
      getLogsByType: jest.fn(() => ({ create: 1, error: 1 })),
      getLogsByUser: jest.fn(() => ({ User: 1, System: 1 })),
      getRecentLogs: jest.fn(() => mockLogs.slice(0, 1)),
      getErrorLogs: jest.fn(() => mockLogs.filter(log => log.log_name.includes('error'))),
      getSecurityLogs: jest.fn(() => []),
      totalLogs: 2,
      errorCount: 1,
      securityCount: 0,
      recentCount: 1
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ActivityDashboard', () => {
    it('should render dashboard with all components', () => {
      render(<ActivityDashboard />);
      
      expect(screen.getByText('Atividades (2)')).toBeInTheDocument();
      expect(screen.getByText('Usuário criado')).toBeInTheDocument();
      expect(screen.getByText('Erro no sistema')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      mockUseActivity.mockReturnValue({
        ...mockUseActivity(),
        loading: true,
        hasEntities: false
      });

      render(<ActivityDashboard />);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show error state', () => {
      mockUseActivity.mockReturnValue({
        ...mockUseActivity(),
        error: 'Erro ao carregar dados'
      });

      render(<ActivityDashboard />);
      
      expect(screen.getByText('Erro ao carregar atividades')).toBeInTheDocument();
    });

    it('should show empty state', () => {
      mockUseActivity.mockReturnValue({
        ...mockUseActivity(),
        logs: [],
        hasEntities: false
      });

      render(<ActivityDashboard />);
      
      expect(screen.getByText('Nenhuma atividade encontrada')).toBeInTheDocument();
    });
  });

  describe('ActivityStats', () => {
    it('should render stats cards', () => {
      render(<ActivityStats />);
      
      expect(screen.getByText('Atividades Hoje')).toBeInTheDocument();
      expect(screen.getByText('Usuários Ativos')).toBeInTheDocument();
      expect(screen.getByText('Erros')).toBeInTheDocument();
      expect(screen.getByText('API Calls')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      mockUseActivity.mockReturnValue({
        ...mockUseActivity(),
        statsLoading: true
      });

      render(<ActivityStats />);
      
      // Should show skeleton loaders
      expect(screen.getAllByRole('progressbar')).toHaveLength(4);
    });
  });

  describe('ActivityFilters', () => {
    it('should render filter controls', () => {
      render(
        <ActivityFilters
          filters={{}}
          onFiltersChange={jest.fn()}
          onClearFilters={jest.fn()}
        />
      );
      
      expect(screen.getByPlaceholderText('Buscar atividades...')).toBeInTheDocument();
      expect(screen.getByText('Filtrar')).toBeInTheDocument();
      expect(screen.getByText('Limpar')).toBeInTheDocument();
    });

    it('should handle search input', async () => {
      const mockOnFiltersChange = jest.fn();
      
      render(
        <ActivityFilters
          filters={{}}
          onFiltersChange={mockOnFiltersChange}
          onClearFilters={jest.fn()}
        />
      );
      
      const searchInput = screen.getByPlaceholderText('Buscar atividades...');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(screen.getByText('Filtrar'));
      
      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          search: 'test',
          type: 'all',
          user: 'all',
          date: 'all'
        });
      });
    });

    it('should handle clear filters', async () => {
      const mockOnClearFilters = jest.fn();
      
      render(
        <ActivityFilters
          filters={{}}
          onFiltersChange={jest.fn()}
          onClearFilters={mockOnClearFilters}
        />
      );
      
      fireEvent.click(screen.getByText('Limpar'));
      
      await waitFor(() => {
        expect(mockOnClearFilters).toHaveBeenCalled();
      });
    });
  });

  describe('ActivityList', () => {
    it('should render activity list', () => {
      render(
        <ActivityList
          logs={mockLogs}
          loading={false}
          selectedIds={[]}
          onLogSelect={jest.fn()}
        />
      );
      
      expect(screen.getByText('Atividades (2)')).toBeInTheDocument();
      expect(screen.getByText('Usuário criado')).toBeInTheDocument();
      expect(screen.getByText('Erro no sistema')).toBeInTheDocument();
    });

    it('should handle log selection', async () => {
      const mockOnLogSelect = jest.fn();
      
      render(
        <ActivityList
          logs={mockLogs}
          loading={false}
          selectedIds={[]}
          onLogSelect={mockOnLogSelect}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      
      await waitFor(() => {
        expect(mockOnLogSelect).toHaveBeenCalledWith('1');
      });
    });

    it('should show selected state', () => {
      render(
        <ActivityList
          logs={mockLogs}
          loading={false}
          selectedIds={['1']}
          onLogSelect={jest.fn()}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
    });

    it('should show loading state', () => {
      render(
        <ActivityList
          logs={[]}
          loading={true}
          selectedIds={[]}
          onLogSelect={jest.fn()}
        />
      );
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Complete Flow', () => {
    it('should handle complete activity flow', async () => {
      const mockFetchLogs = jest.fn();
      const mockSetFilters = jest.fn();
      const mockHandleEntitySelect = jest.fn();
      
      mockUseActivity.mockReturnValue({
        ...mockUseActivity(),
        fetchLogs: mockFetchLogs,
        setFilters: mockSetFilters,
        handleEntitySelect: mockHandleEntitySelect
      });

      render(<ActivityDashboard />);
      
      // Search for activities
      const searchInput = screen.getByPlaceholderText('Buscar atividades...');
      fireEvent.change(searchInput, { target: { value: 'user' } });
      fireEvent.click(screen.getByText('Filtrar'));
      
      await waitFor(() => {
        expect(mockSetFilters).toHaveBeenCalled();
      });
      
      // Select an activity
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      
      await waitFor(() => {
        expect(mockHandleEntitySelect).toHaveBeenCalledWith('1');
      });
    });
  });
});
