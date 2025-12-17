// ========================================
// TESTES DE COMPONENTE - AnalyticsInsights
// ========================================
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnalyticsInsights from '../components/AnalyticsInsights';
import { AnalyticsInsight } from '../types';

// Mock dos componentes UI
jest.mock('@/components/ui/Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className } >{children}</div>
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
  Button?: (e: any) => void; className?: string }) => (
    <button onClick={onClick} className={className} data-testid="button">{children}</button>
  ),
}));

jest.mock('@/components/ui/Badge', () => ({
  Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="badge" className={className } >{children}</span>
  ),
}));

jest.mock('@/components/ui/Select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select">{children}</div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid="select-item" data-value={ value }>{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <div data-testid="select-value">{placeholder}</div>
  ),
}));

// Mock dos ícones
jest.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  Lightbulb: () => <div data-testid="lightbulb-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Brain: () => <div data-testid="brain-icon" />,
  Target: () => <div data-testid="target-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
}));

describe('AnalyticsInsights Component', () => {
  const mockInsights: AnalyticsInsight[] = [
    {
      id: '1',
      type: 'trend',
      title: 'Crescimento de Tráfego',
      description: 'O tráfego aumentou significativamente nas últimas semanas',
      impact: 'high',
      confidence: 0.95,
      recommendations: [
        'Continue com a estratégia de marketing atual',
        'Considere aumentar o investimento em anúncios',
      ],
      metrics: ['page_views', 'unique_visitors'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Pico de Bounce Rate',
      description: 'Taxa de rejeição aumentou inesperadamente',
      impact: 'medium',
      confidence: 0.78,
      recommendations: [
        'Verifique a qualidade do conteúdo',
        'Analise a experiência do usuário',
      ],
      metrics: ['bounce_rate'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'Oportunidade de Conversão',
      description: 'Alto potencial de melhoria na taxa de conversão',
      impact: 'high',
      confidence: 0.88,
      recommendations: [
        'Otimize as páginas de destino',
        'Implemente testes A/B',
      ],
      metrics: ['conversion_rate'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
    },
  ];

  const defaultProps = {
    insights: mockInsights,
    loading: false,
    error: null,
    onGenerate: jest.fn(),
    className: '',};

  beforeEach(() => {
    jest.clearAllMocks();

  });

  it('should render insights correctly', () => { render(<AnalyticsInsights {...defaultProps } />);

    expect(screen.getByText('Insights Inteligentes')).toBeInTheDocument();

    expect(screen.getByText('Crescimento de Tráfego')).toBeInTheDocument();

    expect(screen.getByText('Pico de Bounce Rate')).toBeInTheDocument();

    expect(screen.getByText('Oportunidade de Conversão')).toBeInTheDocument();

  });

  it('should display loading state', () => {
    render(<AnalyticsInsights {...defaultProps} loading={ true } />);

    expect(screen.getByText('Carregando insights...')).toBeInTheDocument();

  });

  it('should display error state', () => {
    render(<AnalyticsInsights {...defaultProps} error="Erro ao carregar insights" />);

    expect(screen.getByText('Erro ao carregar insights')).toBeInTheDocument();

  });

  it('should display empty state when no insights', () => {
    render(<AnalyticsInsights {...defaultProps} insights={ [] } />);

    expect(screen.getByText('Nenhum insight disponível')).toBeInTheDocument();

    expect(screen.getByText('Gere insights para obter recomendações inteligentes')).toBeInTheDocument();

  });

  it('should display insight descriptions', () => { render(<AnalyticsInsights {...defaultProps } />);

    expect(screen.getByText('O tráfego aumentou significativamente nas últimas semanas')).toBeInTheDocument();

    expect(screen.getByText('Taxa de rejeição aumentou inesperadamente')).toBeInTheDocument();

    expect(screen.getByText('Alto potencial de melhoria na taxa de conversão')).toBeInTheDocument();

  });

  it('should display impact badges', () => { render(<AnalyticsInsights {...defaultProps } />);

    expect(screen.getAllByText('Alto')).toHaveLength(2);

    expect(screen.getByText('Médio')).toBeInTheDocument();

  });

  it('should display confidence scores', () => { render(<AnalyticsInsights {...defaultProps } />);

    expect(screen.getByText('95%')).toBeInTheDocument();

    expect(screen.getByText('78%')).toBeInTheDocument();

    expect(screen.getByText('88%')).toBeInTheDocument();

  });

  it('should display correct insight type icons', () => { render(<AnalyticsInsights {...defaultProps } />);

    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();

    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();

    expect(screen.getByTestId('lightbulb-icon')).toBeInTheDocument();

  });

  it('should display recommendations', () => { render(<AnalyticsInsights {...defaultProps } />);

    expect(screen.getByText('Continue com a estratégia de marketing atual')).toBeInTheDocument();

    expect(screen.getByText('Considere aumentar o investimento em anúncios')).toBeInTheDocument();

    expect(screen.getByText('Verifique a qualidade do conteúdo')).toBeInTheDocument();

    expect(screen.getByText('Analise a experiência do usuário')).toBeInTheDocument();

    expect(screen.getByText('Otimize as páginas de destino')).toBeInTheDocument();

    expect(screen.getByText('Implemente testes A/B')).toBeInTheDocument();

  });

  it('should display summary statistics', () => { render(<AnalyticsInsights {...defaultProps } />);

    expect(screen.getByText('3')).toBeInTheDocument(); // Total insights
    expect(screen.getByText('2')).toBeInTheDocument(); // High impact
    expect(screen.getByText('1')).toBeInTheDocument(); // Medium impact
    expect(screen.getByText('87%')).toBeInTheDocument(); // Average confidence
  });

  it('should handle type filter', async () => { render(<AnalyticsInsights {...defaultProps } />);

    const typeSelect = screen.getByTestId('select');

    expect(typeSelect).toBeInTheDocument();

    // Simular seleção de filtro por tipo
    const trendOption = screen.getByText('Tendência');

    if (trendOption) {
      fireEvent.click(trendOption);

    } );

  it('should handle impact filter', async () => { render(<AnalyticsInsights {...defaultProps } />);

    const impactSelect = screen.getByTestId('select');

    expect(impactSelect).toBeInTheDocument();

    // Simular seleção de filtro por impacto
    const highImpactOption = screen.getByText('Alto');

    if (highImpactOption) {
      fireEvent.click(highImpactOption);

    } );

  it('should handle generate insights button', async () => {
    const mockOnGenerate = jest.fn();

    render(<AnalyticsInsights {...defaultProps} onGenerate={ mockOnGenerate } />);

    const generateButton = screen.getByRole('button', { name: /gerar insights/i });

    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalledTimes(1);

    });

  });

  it('should display AI badge', () => { render(<AnalyticsInsights {...defaultProps } />);

    expect(screen.getByText('Powered by AI')).toBeInTheDocument();

    expect(screen.getByTestId('brain-icon')).toBeInTheDocument();

  });

  it('should display insight metrics', () => { render(<AnalyticsInsights {...defaultProps } />);

    expect(screen.getByText('page_views')).toBeInTheDocument();

    expect(screen.getByText('unique_visitors')).toBeInTheDocument();

    expect(screen.getByText('bounce_rate')).toBeInTheDocument();

    expect(screen.getByText('conversion_rate')).toBeInTheDocument();

  });

  it('should display creation and update dates', () => { render(<AnalyticsInsights {...defaultProps } />);

    expect(screen.getByText('Criado em 01/01/2024')).toBeInTheDocument();

    expect(screen.getByText('Atualizado em 02/01/2024')).toBeInTheDocument();

  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<AnalyticsInsights {...defaultProps} className="custom-class" />);

    const card = container.querySelector('[data-testid="card"]')!;
    expect(card).toHaveClass('custom-class');

  });

  it('should handle different insight types', () => {
    const customInsights: AnalyticsInsight[] = [
      {
        id: '4',
        type: 'warning',
        title: 'Warning Insight',
        description: 'Warning description',
        impact: 'low',
        confidence: 0.65,
        recommendations: ['Warning recommendation'],
        metrics: ['warning_metric'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      },
      {
        id: '5',
        type: 'success',
        title: 'Success Insight',
        description: 'Success description',
        impact: 'high',
        confidence: 0.92,
        recommendations: ['Success recommendation'],
        metrics: ['success_metric'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      },
    ];

    render(<AnalyticsInsights {...defaultProps} insights={ customInsights } />);

    expect(screen.getByText('Warning Insight')).toBeInTheDocument();

    expect(screen.getByText('Success Insight')).toBeInTheDocument();

    expect(screen.getByText('Baixo')).toBeInTheDocument();

    expect(screen.getByText('Alto')).toBeInTheDocument();

  });

  it('should display no match message when filters result in empty list', () => { render(<AnalyticsInsights {...defaultProps } />);

    // Simular filtro que não retorna resultados
    const typeSelect = screen.getByTestId('select');

    expect(typeSelect).toBeInTheDocument();

    // Verificar se a mensagem de "nenhum insight encontrado" aparece quando necessário
    expect(screen.getByText('Nenhum insight encontrado com os filtros selecionados')).toBeInTheDocument();

  });

});
