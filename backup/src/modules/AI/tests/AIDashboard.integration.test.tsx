import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AIDashboard from '../components/AIDashboard';

// Mock dos hooks
vi.mock('../hooks/useAI');
vi.mock('../../shared/hooks/useAdvancedNotifications');

// Mock dos componentes UI
vi.mock('@/components/ui/Card', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`card ${className}`}>{children}</div>
  ),
  Header: ({ children }: { children: React.ReactNode }) => (
    <div className="card-header">{children}</div>
  ),
  Title: ({ children }: { children: React.ReactNode }) => (
    <h3 className="card-title">{children}</h3>
  ),
  Description: ({ children }: { children: React.ReactNode }) => (
    <p className="card-description">{children}</p>
  ),
  Content: ({ children }: { children: React.ReactNode }) => (
    <div className="card-content">{children}</div>
  )
}));

vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick, disabled, ...props }: Record<string, unknown>) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/Badge', () => ({
  default: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <span className={`badge badge-${variant}`}>{children}</span>
  )
}));

vi.mock('@/components/ui/Select', () => ({
  Select: ({ children, value, onValueChange }: Record<string, unknown>) => (
    <select value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  )
}));

vi.mock('@/components/ui/AdvancedAnimations', () => ({
  AnimatedCounter: ({ value }: { value: number }) => <span>{value}</span>
}));

vi.mock('@/components/ui/ResponsiveSystem', () => ({
  ResponsiveGrid: ({ children }: { children: React.ReactNode }) => (
    <div className="responsive-grid">{children}</div>
  )
}));

vi.mock('@/components/ui/PageTransition', () => ({
  PageTransition: ({ children }: { children: React.ReactNode }) => (
    <div className="page-transition">{children}</div>
  )
}));

describe('AIDashboard - Integration Tests', () => {
  const mockUseAI = {
    loading: false,
    error: null,
    servicesStatus: {
      openai: { status: 'active' },
      claude: { status: 'active' },
      gemini: { status: 'inactive' }
    },
    generation: {
      textGenerations: [
        { id: '1', type: 'text', prompt: 'Test prompt', result: 'Generated text' }
      ],
      imageGenerations: [
        { id: '2', type: 'image', prompt: 'Test image', result: 'image.jpg' }
      ],
      videoGenerations: [
        { id: '3', type: 'video', prompt: 'Test video', result: 'video.mp4' }
      ]
    },
    providers: {
      availableProviders: [
        { id: '1', name: 'OpenAI', status: 'active', type: 'text' },
        { id: '2', name: 'Claude', status: 'active', type: 'text' }
      ],
      activeProviders: [
        { id: '1', name: 'OpenAI', status: 'active' },
        { id: '2', name: 'Claude', status: 'active' }
      ],
      loadProviders: vi.fn()
    },
    history: {
      chatHistory: [
        { id: '1', role: 'user', content: 'Hello', timestamp: '2024-01-01T00:00:00Z' }
      ],
      loadHistory: vi.fn()
    },
    analytics: {
      totalGenerations: 3,
      totalCost: 15.50,
      averageTime: 2.5,
      successRate: 95.5,
      aiInsights: [
        { id: '1', type: 'trend', message: 'Increased usage detected' }
      ],
      predictions: [
        { id: '1', type: 'cost', message: 'Cost will increase by 20%' }
      ],
      loadAnalytics: vi.fn(),
      getRealTimeData: vi.fn().mockResolvedValue({
        generationsPerMinute: 5,
        activeUsers: 10
      })
    }
  };

  const mockNotifications = {
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showWarning: vi.fn(),
    showInfo: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    require('../hooks/useAI').useAI.mockReturnValue(mockUseAI);
    require('../../shared/hooks/useAdvancedNotifications').useAdvancedNotifications.mockReturnValue(mockNotifications);
  });

  describe('Renderização básica', () => {
    it('deve renderizar dashboard básico corretamente', () => {
      render(<AIDashboard variant="basic" />);

      expect(screen.getByText('AI Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Gerencie suas ferramentas de IA')).toBeInTheDocument();
    });

    it('deve renderizar dashboard avançado corretamente', () => {
      render(<AIDashboard variant="advanced" />);

      expect(screen.getByText('AI Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Dashboard avançado com métricas detalhadas')).toBeInTheDocument();
      expect(screen.getByText('Avançado')).toBeInTheDocument();
    });

    it('deve renderizar dashboard revolucionário corretamente', () => {
      render(<AIDashboard variant="revolutionary" />);

      expect(screen.getByText('AI Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Interface revolucionária com IA preditiva')).toBeInTheDocument();
      expect(screen.getByText('Revolucionário')).toBeInTheDocument();
    });
  });

  describe('Métricas básicas', () => {
    it('deve exibir métricas básicas corretamente', () => {
      render(<AIDashboard variant="basic" />);

      expect(screen.getByText('3')).toBeInTheDocument(); // Total de gerações
      expect(screen.getByText('1')).toBeInTheDocument(); // Textos gerados
      expect(screen.getByText('1')).toBeInTheDocument(); // Imagens geradas
      expect(screen.getByText('1')).toBeInTheDocument(); // Vídeos gerados
    });

    it('deve exibir métricas avançadas para variantes advanced/revolutionary', () => {
      render(<AIDashboard variant="advanced" />);

      expect(screen.getByText('R$ 15.50')).toBeInTheDocument(); // Custo total
      expect(screen.getByText('2.5s')).toBeInTheDocument(); // Tempo médio
      expect(screen.getByText('95.5%')).toBeInTheDocument(); // Taxa de sucesso
      expect(screen.getByText('2')).toBeInTheDocument(); // Providers ativos
    });
  });

  describe('Status dos providers', () => {
    it('deve exibir status dos providers para variantes avançadas', () => {
      render(<AIDashboard variant="advanced" showProviderStatus />);

      expect(screen.getByText('Status dos Providers')).toBeInTheDocument();
      expect(screen.getByText('OpenAI')).toBeInTheDocument();
      expect(screen.getByText('Claude')).toBeInTheDocument();
    });

    it('não deve exibir status dos providers para variante básica', () => {
      render(<AIDashboard variant="basic" />);

      expect(screen.queryByText('Status dos Providers')).not.toBeInTheDocument();
    });
  });

  describe('Features grid', () => {
    it('deve exibir features básicas', () => {
      render(<AIDashboard variant="basic" />);

      expect(screen.getByText('Funcionalidades')).toBeInTheDocument();
      expect(screen.getByText('Geração de Texto')).toBeInTheDocument();
      expect(screen.getByText('Geração de Imagem')).toBeInTheDocument();
      expect(screen.getByText('Geração de Vídeo')).toBeInTheDocument();
      expect(screen.getByText('Chat Inteligente')).toBeInTheDocument();
    });

    it('deve exibir features avançadas para variante advanced', () => {
      render(<AIDashboard variant="advanced" />);

      expect(screen.getByText('Analytics Avançados')).toBeInTheDocument();
      expect(screen.getByText('Gerenciamento de Providers')).toBeInTheDocument();
    });

    it('deve exibir features revolucionárias para variante revolutionary', () => {
      render(<AIDashboard variant="revolutionary" />);

      expect(screen.getByText('Insights de IA')).toBeInTheDocument();
      expect(screen.getByText('Previsões')).toBeInTheDocument();
    });
  });

  describe('Dados em tempo real', () => {
    it('deve exibir dados em tempo real para variantes avançadas', async () => {
      render(<AIDashboard variant="advanced" showRealTimeData />);

      await waitFor(() => {
        expect(screen.getByText('Dados em Tempo Real')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); // Gerações/min
        expect(screen.getByText('10')).toBeInTheDocument(); // Usuários ativos
      });
    });

    it('não deve exibir dados em tempo real para variante básica', () => {
      render(<AIDashboard variant="basic" />);

      expect(screen.queryByText('Dados em Tempo Real')).not.toBeInTheDocument();
    });
  });

  describe('Controles avançados', () => {
    it('deve exibir controles de tempo para variantes avançadas', () => {
      render(<AIDashboard variant="advanced" />);

      expect(screen.getByText('Último dia')).toBeInTheDocument();
      expect(screen.getByText('Últimos 7 dias')).toBeInTheDocument();
      expect(screen.getByText('Últimos 30 dias')).toBeInTheDocument();
      expect(screen.getByText('Últimos 90 dias')).toBeInTheDocument();
    });

    it('deve exibir botão de atualizar para variantes avançadas', () => {
      render(<AIDashboard variant="advanced" />);

      expect(screen.getByText('Atualizar')).toBeInTheDocument();
    });

    it('não deve exibir controles avançados para variante básica', () => {
      render(<AIDashboard variant="basic" />);

      expect(screen.queryByText('Atualizar')).not.toBeInTheDocument();
    });
  });

  describe('Estados de carregamento', () => {
    it('deve exibir loading quando carregando', () => {
      const loadingMock = { ...mockUseAI, loading: true };
      require('../hooks/useAI').useAI.mockReturnValue(loadingMock);

      render(<AIDashboard />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Estados de erro', () => {
    it('deve exibir erro quando há erro', () => {
      const errorMock = { ...mockUseAI, error: 'Erro de conexão' };
      require('../hooks/useAI').useAI.mockReturnValue(errorMock);

      render(<AIDashboard />);

      expect(screen.getByText('Erro de conexão')).toBeInTheDocument();
      expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
    });

    it('deve permitir tentar novamente quando há erro', async () => {
      const errorMock = { ...mockUseAI, error: 'Erro de conexão' };
      require('../hooks/useAI').useAI.mockReturnValue(errorMock);

      render(<AIDashboard />);

      const retryButton = screen.getByText('Tentar Novamente');
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(mockUseAI.providers.loadProviders).toHaveBeenCalled();
        expect(mockUseAI.analytics.loadAnalytics).toHaveBeenCalled();
        expect(mockUseAI.history.loadHistory).toHaveBeenCalled();
      });
    });
  });

  describe('Interação com features', () => {
    it('deve permitir navegação para features', () => {
      const onActionMock = vi.fn();
      render(<AIDashboard onAction={onActionMock} />);

      const textGenerationCard = screen.getByText('Geração de Texto');
      fireEvent.click(textGenerationCard);

      expect(onActionMock).toHaveBeenCalledWith('navigate', { href: '/ai/generation' });
    });
  });

  describe('Responsividade', () => {
    it('deve usar grid responsivo', () => {
      render(<AIDashboard />);

      expect(screen.getByText('Funcionalidades')).toBeInTheDocument();
      // Verificar se o grid responsivo está sendo usado
      const responsiveGrid = document.querySelector('.responsive-grid');
      expect(responsiveGrid).toBeInTheDocument();
    });
  });

  describe('Animações', () => {
    it('deve usar contadores animados', () => {
      render(<AIDashboard />);

      // Verificar se os contadores animados estão sendo renderizados
      const counters = screen.getAllByText('3');
      expect(counters.length).toBeGreaterThan(0);
    });
  });
});