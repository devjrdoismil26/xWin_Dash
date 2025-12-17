// ========================================
// TESTES DE COMPONENTE - ActivityIndexPage
// ========================================
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ActivityIndexPage from '../pages/ActivityIndexPage';
import { useActivity } from '../hooks/useActivity';

// Mock do hook useActivity
jest.mock('../hooks/useActivity');

const mockUseActivity = useActivity as jest.MockedFunction<typeof useActivity>;

// Mock dos componentes UI
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: unknown) => (
    <button 
      onClick={ onClick }
      disabled={ disabled }
      className={className} { ...props } />
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/Card', () => ({
  Card: ({ children, className, ...props }: unknown) => (
    <div className={`card ${className || ''} `} { ...props }>
        </div>{children}
    </div>
  ),
}));

jest.mock('@/components/ui/Badge', () => ({
  Badge: ({ children, className, variant, ...props }: unknown) => (
    <span className={`badge ${variant || ''} ${className || ''}`} { ...props }>
        </span>{children}
    </span>
  ),
}));

// Mock dos layouts
jest.mock('@/layouts/AuthenticatedLayout', () => {
  return function MockAuthenticatedLayout({ children }: unknown) {
    return <div data-testid="authenticated-layout">{children}</div>;};

});

jest.mock('@/layouts/PageLayout', () => {
  return function MockPageLayout({ children }: unknown) {
    return <div data-testid="page-layout">{children}</div>;};

});

// Mock do Head do Inertia
jest.mock('@inertiajs/react', () => ({
  Head: ({ title }: unknown) => <title>{title}</title>,
}));

// Mock dos ícones
jest.mock('lucide-react', () => ({
  Play: () => <div data-testid="play-icon" />,
  RefreshCw: ({ className }: unknown) => <div data-testid="refresh-icon" className={className } />,
  Activity: () => <div data-testid="activity-icon" />,
  Users: () => <div data-testid="users-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
}));

const mockLogs = [
  {
    id: '1',
    log_name: 'user.login',
    description: 'User logged in successfully',
    causer_type: 'User',
    created_at: '2024-01-01T12:00:00Z',
    updated_at: '2024-01-01T12:00:00Z',
  },
  {
    id: '2',
    log_name: 'user.logout',
    description: 'User logged out',
    causer_type: 'User',
    created_at: '2024-01-01T11:00:00Z',
    updated_at: '2024-01-01T11:00:00Z',
  },
];

const mockStats = {
  total_logs: 100,
  today_logs: 10,
  active_users: 5,
  error_logs: 2,
  security_logs: 1,
  api_calls: 50,};

const defaultMockReturn = {
  logs: mockLogs,
  loading: false,
  error: null,
  stats: mockStats,
  activityStats: {
    total: 100,
    today: 10,
    activeUsers: 5,
    errors: 2,
  },
  hasActivity: true,
  totalLogs: 2,
  errorCount: 1,
  securityCount: 1,
  recentCount: 2,
  fetchStats: jest.fn(),
  fetchLogs: jest.fn(),
  exportData: jest.fn(),
  getRecentLogs: jest.fn(() => mockLogs.slice(0, 5)),
  getErrorLogs: jest.fn(() => (mockLogs || []).filter(log => log.log_name.includes('error'))),
  getSecurityLogs: jest.fn(() => (mockLogs || []).filter(log => log.log_name.includes('security'))),
  formatRelativeTime: jest.fn(() => '2 hours ago'),
  getLogType: jest.fn(() => 'info'),
  getLogIcon: jest.fn(() => jest.fn()),
  getLogColor: jest.fn(() => ({ bg: 'bg-blue-100', text: 'text-blue-600' })),};

describe('ActivityIndexPage Component', () => {
  beforeEach(() => {
    mockUseActivity.mockReturnValue(defaultMockReturn);

  });

  afterEach(() => {
    jest.clearAllMocks();

  });

  it('should render the component with activity data', () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    expect(screen.getByText('📊 Log de Atividades')).toBeInTheDocument();

    expect(screen.getByText('Monitore todas as atividades do sistema em tempo real')).toBeInTheDocument();

    expect(screen.getByText('User logged in successfully')).toBeInTheDocument();

    expect(screen.getByText('User logged out')).toBeInTheDocument();

  });

  it('should display stats cards with real data', () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    expect(screen.getByText('Atividades Hoje')).toBeInTheDocument();

    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByText('Total de Logs')).toBeInTheDocument();

    expect(screen.getByText('100')).toBeInTheDocument();

    expect(screen.getByText('Usuários Ativos')).toBeInTheDocument();

    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('Chamadas API')).toBeInTheDocument();

    expect(screen.getByText('50')).toBeInTheDocument();

  });

  it('should display additional stats', () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    expect(screen.getByText('Logs de Erro')).toBeInTheDocument();

    expect(screen.getByText('1')).toBeInTheDocument();

    expect(screen.getByText('Logs de Segurança')).toBeInTheDocument();

    expect(screen.getByText('1')).toBeInTheDocument();

    expect(screen.getByText('Logs Recentes')).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();

  });

  it('should handle refresh button click', async () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    const refreshButton = screen.getByText('Atualizar');

    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(defaultMockReturn.fetchLogs).toHaveBeenCalled();

      expect(defaultMockReturn.fetchStats).toHaveBeenCalled();

    });

  });

  it('should handle export button click', async () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    const exportButton = screen.getByText('Exportar');

    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(defaultMockReturn.exportData).toHaveBeenCalledWith('csv');

    });

  });

  it('should toggle integration test', () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    const testButton = screen.getByText('Teste de Integração');

    fireEvent.click(testButton);

    expect(screen.getByText('🔧 Teste de Integração Ativo')).toBeInTheDocument();

  });

  it('should toggle real-time monitoring', () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    // First enable integration test
    const testButton = screen.getByText('Teste de Integração');

    fireEvent.click(testButton);

    // Then toggle real-time
    const realTimeButton = screen.getByText('Ativar Tempo Real');

    fireEvent.click(realTimeButton);

    expect(screen.getByText('Tempo Real Ativo')).toBeInTheDocument();

  });

  it('should display loading state', () => {
    mockUseActivity.mockReturnValue({
      ...defaultMockReturn,
      loading: true,
    });

    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    expect(screen.getByText('Carregando atividades...')).toBeInTheDocument();

  });

  it('should display error state', () => {
    mockUseActivity.mockReturnValue({
      ...defaultMockReturn,
      error: 'Test error message',
    });

    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    expect(screen.getByText('Test error message')).toBeInTheDocument();

  });

  it('should display empty state when no activity', () => {
    mockUseActivity.mockReturnValue({
      ...defaultMockReturn,
      logs: [],
      hasActivity: false,
      totalLogs: 0,
      errorCount: 0,
      securityCount: 0,
      recentCount: 0,
    });

    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    expect(screen.getByText('Nenhuma atividade registrada ainda.')).toBeInTheDocument();

    expect(screen.getByText('As atividades aparecerão aqui conforme forem executadas no sistema.')).toBeInTheDocument();

  });

  it('should display recent logs section', () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    expect(screen.getByText('📋 Logs Recentes')).toBeInTheDocument();

    expect(screen.getByText('2 total')).toBeInTheDocument();

    expect(screen.getByText('User logged in successfully')).toBeInTheDocument();

    expect(screen.getByText('User logged out')).toBeInTheDocument();

  });

  it('should format log timestamps correctly', () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    expect(defaultMockReturn.formatRelativeTime).toHaveBeenCalled();

  });

  it('should handle log type and color formatting', () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    expect(defaultMockReturn.getLogType).toHaveBeenCalled();

    expect(defaultMockReturn.getLogIcon).toHaveBeenCalled();

    expect(defaultMockReturn.getLogColor).toHaveBeenCalled();

  });

  it('should display real-time status when enabled', () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    // Enable integration test
    const testButton = screen.getByText('Teste de Integração');

    fireEvent.click(testButton);

    // Enable real-time
    const realTimeButton = screen.getByText('Ativar Tempo Real');

    fireEvent.click(realTimeButton);

    expect(screen.getByText('Monitoramento em tempo real ativo')).toBeInTheDocument();

    expect(screen.getByText('(atualizações a cada 30 segundos)')).toBeInTheDocument();

  });

  it('should call fetchLogs and fetchStats on mount', () => {
    render(
      <BrowserRouter />
        <ActivityIndexPage / />
      </BrowserRouter>);

    expect(defaultMockReturn.fetchLogs).toHaveBeenCalled();

    expect(defaultMockReturn.fetchStats).toHaveBeenCalled();

  });

});
