// ========================================
// TESTES DE COMPONENTE - AnalyticsDashboard
// ========================================
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useAnalytics } from '../hooks/useAnalytics';

// Mock do hook useAnalytics
jest.mock('../hooks/useAnalytics');
const mockUseAnalytics = useAnalytics as jest.MockedFunction<typeof useAnalytics>;

// Mock dos componentes filhos
jest.mock('../components/AnalyticsHeader', () => {
  return function MockAnalyticsHeader() {
    return <div data-testid="analytics-header">Analytics Header</div>;
  };
});

jest.mock('../components/AnalyticsFilters', () => {
  return function MockAnalyticsFilters() {
    return <div data-testid="analytics-filters">Analytics Filters</div>;
  };
});

jest.mock('../components/AnalyticsMetrics', () => {
  return function MockAnalyticsMetrics() {
    return <div data-testid="analytics-metrics">Analytics Metrics</div>;
  };
});

jest.mock('../components/AnalyticsCharts', () => {
  return function MockAnalyticsCharts() {
    return <div data-testid="analytics-charts">Analytics Charts</div>;
  };
});

jest.mock('../components/AnalyticsInsights', () => {
  return function MockAnalyticsInsights() {
    return <div data-testid="analytics-insights">Analytics Insights</div>;
  };
});

jest.mock('../components/AnalyticsRealTime', () => {
  return function MockAnalyticsRealTime() {
    return <div data-testid="analytics-realtime">Analytics Real Time</div>;
  };
});

// Mock do layout
jest.mock('@/layouts/AuthenticatedLayout', () => {
  return function MockAuthenticatedLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="authenticated-layout">{children}</div>;
  };
});

jest.mock('@/layouts/PageLayout', () => {
  return function MockPageLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-layout">{children}</div>;
  };
});

// Mock dos ícones
jest.mock('lucide-react', () => ({
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
}));

describe('AnalyticsDashboard Component', () => {
  const defaultMockReturn = {
    dashboard: {
      metrics: [
        { type: 'page_views', value: 1500, change: 12.5 },
        { type: 'unique_visitors', value: 800, change: -5.2 },
      ],
      charts: [
        { id: '1', type: 'line', title: 'Page Views Over Time', data: [] },
      ],
      insights: [
        { id: '1', type: 'trend', title: 'Traffic Increase', description: 'Page views increased by 12.5%' },
      ],
    },
    loading: false,
    error: null,
    realTimeEnabled: false,
    autoRefresh: false,
    refreshInterval: 30000,
    fetchDashboard: jest.fn(),
    toggleRealTime: jest.fn(),
    toggleAutoRefresh: jest.fn(),
    setRefreshInterval: jest.fn(),
    exportDashboard: jest.fn(),
    refreshDashboard: jest.fn(),
  };

  beforeEach(() => {
    mockUseAnalytics.mockReturnValue(defaultMockReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the dashboard with all components', () => {
    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    expect(screen.getByTestId('analytics-header')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-filters')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-metrics')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-charts')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-insights')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-realtime')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    mockUseAnalytics.mockReturnValue({
      ...defaultMockReturn,
      loading: true,
    });

    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Carregando dashboard...')).toBeInTheDocument();
  });

  it('should display error state', () => {
    mockUseAnalytics.mockReturnValue({
      ...defaultMockReturn,
      error: 'Erro ao carregar dados',
    });

    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument();
  });

  it('should handle refresh button click', async () => {
    const mockRefreshDashboard = jest.fn();
    mockUseAnalytics.mockReturnValue({
      ...defaultMockReturn,
      refreshDashboard: mockRefreshDashboard,
    });

    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    const refreshButton = screen.getByRole('button', { name: /atualizar/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockRefreshDashboard).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle export button click', async () => {
    const mockExportDashboard = jest.fn();
    mockUseAnalytics.mockReturnValue({
      ...defaultMockReturn,
      exportDashboard: mockExportDashboard,
    });

    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    const exportButton = screen.getByRole('button', { name: /exportar/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(mockExportDashboard).toHaveBeenCalledTimes(1);
    });
  });

  it('should toggle real-time monitoring', async () => {
    const mockToggleRealTime = jest.fn();
    mockUseAnalytics.mockReturnValue({
      ...defaultMockReturn,
      toggleRealTime: mockToggleRealTime,
    });

    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    const realTimeToggle = screen.getByRole('button', { name: /tempo real/i });
    fireEvent.click(realTimeToggle);

    await waitFor(() => {
      expect(mockToggleRealTime).toHaveBeenCalledTimes(1);
    });
  });

  it('should toggle auto-refresh', async () => {
    const mockToggleAutoRefresh = jest.fn();
    mockUseAnalytics.mockReturnValue({
      ...defaultMockReturn,
      toggleAutoRefresh: mockToggleAutoRefresh,
    });

    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    const autoRefreshToggle = screen.getByRole('button', { name: /auto refresh/i });
    fireEvent.click(autoRefreshToggle);

    await waitFor(() => {
      expect(mockToggleAutoRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it('should display real-time status when enabled', () => {
    mockUseAnalytics.mockReturnValue({
      ...defaultMockReturn,
      realTimeEnabled: true,
    });

    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/monitoramento em tempo real ativo/i)).toBeInTheDocument();
  });

  it('should display auto-refresh status when enabled', () => {
    mockUseAnalytics.mockReturnValue({
      ...defaultMockReturn,
      autoRefresh: true,
      refreshInterval: 30000,
    });

    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/atualização automática ativa/i)).toBeInTheDocument();
  });

  it('should handle empty dashboard data', () => {
    mockUseAnalytics.mockReturnValue({
      ...defaultMockReturn,
      dashboard: {
        metrics: [],
        charts: [],
        insights: [],
      },
    });

    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/nenhum dado disponível/i)).toBeInTheDocument();
  });

  it('should call fetchDashboard on mount', () => {
    const mockFetchDashboard = jest.fn();
    mockUseAnalytics.mockReturnValue({
      ...defaultMockReturn,
      fetchDashboard: mockFetchDashboard,
    });

    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    expect(mockFetchDashboard).toHaveBeenCalledTimes(1);
  });
});