// ========================================
// TESTES DE COMPONENTE - AnalyticsMetrics
// ========================================
import React from 'react';
import { render, screen } from '@testing-library/react';
import AnalyticsMetrics from '../components/AnalyticsMetrics';
import { AnalyticsMetric } from '../types';

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

jest.mock('@/components/ui/Badge', () => ({
  Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="badge" className={className}>{children}</span>
  ),
}));

// Mock dos ícones
jest.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon" />,
  Users: () => <div data-testid="users-icon" />,
  MousePointer: () => <div data-testid="mouse-pointer-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
}));

describe('AnalyticsMetrics Component', () => {
  const mockMetrics: AnalyticsMetric[] = [
    {
      type: 'page_views',
      name: 'Page Views',
      value: 15420,
      previous_value: 12800,
      change: 20.5,
      trend: 'up',
      unit: 'views',
      description: 'Total page views',
      color: 'blue',
      icon: 'Eye',
    },
    {
      type: 'unique_visitors',
      name: 'Unique Visitors',
      value: 8200,
      previous_value: 7800,
      change: 5.1,
      trend: 'up',
      unit: 'visitors',
      description: 'Unique visitors count',
      color: 'green',
      icon: 'Users',
    },
    {
      type: 'bounce_rate',
      name: 'Bounce Rate',
      value: 45.2,
      previous_value: 48.1,
      change: -6.0,
      trend: 'down',
      unit: '%',
      description: 'Percentage of single-page sessions',
      color: 'orange',
      icon: 'MousePointer',
    },
    {
      type: 'avg_session_duration',
      name: 'Avg Session Duration',
      value: 180,
      previous_value: 165,
      change: 9.1,
      trend: 'up',
      unit: 'seconds',
      description: 'Average time spent on site',
      color: 'purple',
      icon: 'Clock',
    },
  ];

  const defaultProps = {
    data: mockMetrics,
    loading: false,
    error: null,
    className: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render metrics correctly', () => {
    render(<AnalyticsMetrics {...defaultProps} />);

    expect(screen.getByText('Métricas Principais')).toBeInTheDocument();
    expect(screen.getByText('Page Views')).toBeInTheDocument();
    expect(screen.getByText('Unique Visitors')).toBeInTheDocument();
    expect(screen.getByText('Bounce Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg Session Duration')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    render(<AnalyticsMetrics {...defaultProps} loading={true} />);

    expect(screen.getByText('Carregando métricas...')).toBeInTheDocument();
  });

  it('should display error state', () => {
    render(<AnalyticsMetrics {...defaultProps} error="Erro ao carregar métricas" />);

    expect(screen.getByText('Erro ao carregar métricas')).toBeInTheDocument();
  });

  it('should display empty state when no metrics', () => {
    render(<AnalyticsMetrics {...defaultProps} data={[]} />);

    expect(screen.getByText('Nenhuma métrica disponível')).toBeInTheDocument();
  });

  it('should format metric values correctly', () => {
    render(<AnalyticsMetrics {...defaultProps} />);

    expect(screen.getByText('15,420')).toBeInTheDocument();
    expect(screen.getByText('8,200')).toBeInTheDocument();
    expect(screen.getByText('45.2%')).toBeInTheDocument();
    expect(screen.getByText('3:00')).toBeInTheDocument(); // 180 seconds = 3:00
  });

  it('should display change percentages correctly', () => {
    render(<AnalyticsMetrics {...defaultProps} />);

    expect(screen.getByText('+20.5%')).toBeInTheDocument();
    expect(screen.getByText('+5.1%')).toBeInTheDocument();
    expect(screen.getByText('-6.0%')).toBeInTheDocument();
    expect(screen.getByText('+9.1%')).toBeInTheDocument();
  });

  it('should display correct trend icons', () => {
    render(<AnalyticsMetrics {...defaultProps} />);

    expect(screen.getAllByTestId('trending-up-icon')).toHaveLength(3);
    expect(screen.getAllByTestId('trending-down-icon')).toHaveLength(1);
  });

  it('should display correct metric icons', () => {
    render(<AnalyticsMetrics {...defaultProps} />);

    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mouse-pointer-icon')).toBeInTheDocument();
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('should display metric descriptions', () => {
    render(<AnalyticsMetrics {...defaultProps} />);

    expect(screen.getByText('Total page views')).toBeInTheDocument();
    expect(screen.getByText('Unique visitors count')).toBeInTheDocument();
    expect(screen.getByText('Percentage of single-page sessions')).toBeInTheDocument();
    expect(screen.getByText('Average time spent on site')).toBeInTheDocument();
  });

  it('should display previous values', () => {
    render(<AnalyticsMetrics {...defaultProps} />);

    expect(screen.getByText('12,800')).toBeInTheDocument();
    expect(screen.getByText('7,800')).toBeInTheDocument();
    expect(screen.getByText('48.1%')).toBeInTheDocument();
    expect(screen.getByText('2:45')).toBeInTheDocument(); // 165 seconds = 2:45
  });

  it('should display performance summary', () => {
    render(<AnalyticsMetrics {...defaultProps} />);

    expect(screen.getByText('Resumo de Performance')).toBeInTheDocument();
    expect(screen.getByText('Crescimento Geral')).toBeInTheDocument();
    expect(screen.getByText('Engajamento')).toBeInTheDocument();
  });

  it('should display period badge', () => {
    render(<AnalyticsMetrics {...defaultProps} />);

    expect(screen.getByText('Últimos 30 dias')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<AnalyticsMetrics {...defaultProps} className="custom-class" />);
    
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('custom-class');
  });

  it('should handle different metric types', () => {
    const customMetrics: AnalyticsMetric[] = [
      {
        type: 'custom_metric',
        name: 'Custom Metric',
        value: 1000,
        previous_value: 900,
        change: 11.1,
        trend: 'up',
        unit: 'units',
        description: 'Custom metric description',
        color: 'red',
        icon: 'Activity',
      },
    ];

    render(<AnalyticsMetrics {...defaultProps} data={customMetrics} />);

    expect(screen.getByText('Custom Metric')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('+11.1%')).toBeInTheDocument();
    expect(screen.getByTestId('activity-icon')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    const zeroMetrics: AnalyticsMetric[] = [
      {
        type: 'zero_metric',
        name: 'Zero Metric',
        value: 0,
        previous_value: 0,
        change: 0,
        trend: 'stable',
        unit: 'units',
        description: 'Zero metric description',
        color: 'gray',
        icon: 'BarChart3',
      },
    ];

    render(<AnalyticsMetrics {...defaultProps} data={zeroMetrics} />);

    expect(screen.getByText('Zero Metric')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
  });

  it('should handle negative values', () => {
    const negativeMetrics: AnalyticsMetric[] = [
      {
        type: 'negative_metric',
        name: 'Negative Metric',
        value: -100,
        previous_value: -50,
        change: -100,
        trend: 'down',
        unit: 'units',
        description: 'Negative metric description',
        color: 'red',
        icon: 'TrendingDown',
      },
    ];

    render(<AnalyticsMetrics {...defaultProps} data={negativeMetrics} />);

    expect(screen.getByText('Negative Metric')).toBeInTheDocument();
    expect(screen.getByText('-100')).toBeInTheDocument();
    expect(screen.getByText('-100%')).toBeInTheDocument();
  });
});