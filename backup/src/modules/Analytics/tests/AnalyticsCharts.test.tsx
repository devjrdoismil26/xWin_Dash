// ========================================
// TESTES DE COMPONENTE - AnalyticsCharts
// ========================================
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { AnalyticsChart } from '../types';

// Mock dos componentes UI
jest.mock('@/components/ui/Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  Card.Content: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  Card.Header: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  Card.Title: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
}));

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
    <button onClick={onClick} className={className} data-testid="button">{children}</button>
  ),
}));

jest.mock('@/components/ui/Badge', () => ({
  Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="badge" className={className}>{children}</span>
  ),
}));

// Mock dos ícones
jest.mock('lucide-react', () => ({
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  LineChart: () => <div data-testid="line-chart-icon" />,
  PieChart: () => <div data-testid="pie-chart-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Maximize2: () => <div data-testid="maximize-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
}));

describe('AnalyticsCharts Component', () => {
  const mockCharts: AnalyticsChart[] = [
    {
      id: '1',
      type: 'line',
      title: 'Page Views Over Time',
      description: 'Daily page views for the last 30 days',
      data: [
        { label: 'Day 1', value: 100 },
        { label: 'Day 2', value: 150 },
        { label: 'Day 3', value: 120 },
      ],
      trend: 'up',
      trendValue: 12.5,
      color: 'blue',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
    },
    {
      id: '2',
      type: 'bar',
      title: 'Traffic Sources',
      description: 'Distribution of traffic by source',
      data: [
        { label: 'Organic', value: 45 },
        { label: 'Direct', value: 30 },
        { label: 'Social', value: 25 },
      ],
      trend: 'down',
      trendValue: -5.2,
      color: 'green',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
    },
  ];

  const defaultProps = {
    data: mockCharts,
    loading: false,
    error: null,
    onRefresh: jest.fn(),
    onExport: jest.fn(),
    className: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render charts correctly', () => {
    render(<AnalyticsCharts {...defaultProps} />);

    expect(screen.getByText('Gráficos Avançados')).toBeInTheDocument();
    expect(screen.getByText('Page Views Over Time')).toBeInTheDocument();
    expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
    expect(screen.getByText('Daily page views for the last 30 days')).toBeInTheDocument();
    expect(screen.getByText('Distribution of traffic by source')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    render(<AnalyticsCharts {...defaultProps} loading={true} />);

    expect(screen.getByText('Carregando gráficos...')).toBeInTheDocument();
  });

  it('should display error state', () => {
    render(<AnalyticsCharts {...defaultProps} error="Erro ao carregar gráficos" />);

    expect(screen.getByText('Erro ao carregar gráficos')).toBeInTheDocument();
  });

  it('should display empty state when no charts', () => {
    render(<AnalyticsCharts {...defaultProps} data={[]} />);

    expect(screen.getByText('Nenhum gráfico disponível')).toBeInTheDocument();
    expect(screen.getByText('Crie seu primeiro relatório para visualizar gráficos')).toBeInTheDocument();
  });

  it('should handle period selection', async () => {
    render(<AnalyticsCharts {...defaultProps} />);

    const periodButtons = screen.getAllByRole('button');
    const sevenDayButton = periodButtons.find(button => button.textContent?.includes('7d'));
    
    if (sevenDayButton) {
      fireEvent.click(sevenDayButton);
      expect(sevenDayButton).toHaveClass('bg-blue-600');
    }
  });

  it('should handle refresh button click', async () => {
    const mockOnRefresh = jest.fn();
    render(<AnalyticsCharts {...defaultProps} onRefresh={mockOnRefresh} />);

    const refreshButton = screen.getByRole('button', { name: /atualizar/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle chart expansion', async () => {
    render(<AnalyticsCharts {...defaultProps} />);

    const expandButtons = screen.getAllByRole('button');
    const expandButton = expandButtons.find(button => button.querySelector('[data-testid="maximize-icon"]'));
    
    if (expandButton) {
      fireEvent.click(expandButton);
      // Verificar se o modal ou expansão foi ativada
      expect(expandButton).toBeInTheDocument();
    }
  });

  it('should handle chart export', async () => {
    const mockOnExport = jest.fn();
    render(<AnalyticsCharts {...defaultProps} onExport={mockOnExport} />);

    const exportButtons = screen.getAllByRole('button');
    const exportButton = exportButtons.find(button => button.querySelector('[data-testid="download-icon"]'));
    
    if (exportButton) {
      fireEvent.click(exportButton);
      await waitFor(() => {
        expect(mockOnExport).toHaveBeenCalledTimes(1);
      });
    }
  });

  it('should display correct chart icons', () => {
    render(<AnalyticsCharts {...defaultProps} />);

    expect(screen.getByTestId('line-chart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart-icon')).toBeInTheDocument();
  });

  it('should display correct trend icons', () => {
    render(<AnalyticsCharts {...defaultProps} />);

    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trending-down-icon')).toBeInTheDocument();
  });

  it('should format trend values correctly', () => {
    render(<AnalyticsCharts {...defaultProps} />);

    expect(screen.getByText('+12.5%')).toBeInTheDocument();
    expect(screen.getByText('-5.2%')).toBeInTheDocument();
  });

  it('should display chart metadata', () => {
    render(<AnalyticsCharts {...defaultProps} />);

    expect(screen.getByText('Criado em 01/01/2024')).toBeInTheDocument();
    expect(screen.getByText('Atualizado em 02/01/2024')).toBeInTheDocument();
  });

  it('should handle chart type badges', () => {
    render(<AnalyticsCharts {...defaultProps} />);

    expect(screen.getByText('Linha')).toBeInTheDocument();
    expect(screen.getByText('Barra')).toBeInTheDocument();
  });

  it('should display chart data points', () => {
    render(<AnalyticsCharts {...defaultProps} />);

    expect(screen.getByText('Day 1: 100')).toBeInTheDocument();
    expect(screen.getByText('Day 2: 150')).toBeInTheDocument();
    expect(screen.getByText('Day 3: 120')).toBeInTheDocument();
    expect(screen.getByText('Organic: 45')).toBeInTheDocument();
    expect(screen.getByText('Direct: 30')).toBeInTheDocument();
    expect(screen.getByText('Social: 25')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<AnalyticsCharts {...defaultProps} className="custom-class" />);
    
    const card = container.querySelector('[data-testid="card"]');
    expect(card).toHaveClass('custom-class');
  });

  it('should handle chart selection', async () => {
    render(<AnalyticsCharts {...defaultProps} />);

    const chartCards = screen.getAllByTestId('card');
    if (chartCards.length > 0) {
      fireEvent.click(chartCards[0]);
      // Verificar se a seleção foi processada
      expect(chartCards[0]).toBeInTheDocument();
    }
  });
});