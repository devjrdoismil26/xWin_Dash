/**
 * Testes de integração para o módulo Dashboard
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Dashboard } from '../index';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardIndexPage } from '../pages/DashboardIndexPage';
import { ExecutiveMasterDashboard } from '../components/ExecutiveMasterDashboard';
import { MetricsOverview } from '../components/MetricsOverview';
import { AdvancedDashboard } from '../components/AdvancedDashboard';
import { WidgetManager } from '../components/WidgetManager';

// Mock do dashboardService
jest.mock('../services/dashboardService', () => ({
  getDashboardData: jest.fn(() => Promise.resolve({
    metrics: {
      total_leads: 100,
      total_users: 50,
      total_projects: 25,
      active_projects: 20,
      total_campaigns: 10,
      total_revenue: 50000,
      conversion_rate: 0.15,
      leads_growth: 0.1,
      users_growth: 0.05,
      projects_growth: 0.2,
      campaigns_growth: 0.0,
      revenue_growth: 0.3
    },
    recent_activities: [],
    top_leads: [],
    recent_projects: [],
    stats: {}
  })),
  getMetrics: jest.fn(() => Promise.resolve({})),
  getWidgets: jest.fn(() => Promise.resolve([])),
  updateWidget: jest.fn(() => Promise.resolve({})),
  createWidget: jest.fn(() => Promise.resolve({})),
  deleteWidget: jest.fn(() => Promise.resolve({})),
  getLayouts: jest.fn(() => Promise.resolve([])),
  createLayout: jest.fn(() => Promise.resolve({})),
  updateLayout: jest.fn(() => Promise.resolve({})),
  deleteLayout: jest.fn(() => Promise.resolve({})),
  getAlerts: jest.fn(() => Promise.resolve([])),
  markAlertAsRead: jest.fn(() => Promise.resolve({})),
  getUniverseData: jest.fn(() => Promise.resolve({})),
  shareDashboard: jest.fn(() => Promise.resolve({})),
  getSharedDashboard: jest.fn(() => Promise.resolve({})),
  subscribeToDashboard: jest.fn(() => Promise.resolve({})),
  unsubscribeFromDashboard: jest.fn(() => Promise.resolve({})),
  exportDashboard: jest.fn(() => Promise.resolve({}))
}));

// Mock do useNotification
jest.mock('@/hooks/useNotification', () => ({
  notify: jest.fn()
}));

// Mock do AuthenticatedLayout
jest.mock('@/layouts/AuthenticatedLayout', () => {
  return function MockAuthenticatedLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="authenticated-layout">{children}</div>;
  };
});

// Mock do PageLayout
jest.mock('@/layouts/PageLayout', () => {
  return function MockPageLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-layout">{children}</div>;
  };
});

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Dashboard Component', () => {
    it('should render dashboard with default page', async () => {
      render(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('authenticated-layout')).toBeInTheDocument();
        expect(screen.getByTestId('page-layout')).toBeInTheDocument();
      });
    });

    it('should render dashboard with specific page', async () => {
      render(<Dashboard page="detail" id="123" />);

      await waitFor(() => {
        expect(screen.getByTestId('authenticated-layout')).toBeInTheDocument();
        expect(screen.getByTestId('page-layout')).toBeInTheDocument();
      });
    });

    it('should handle page transitions correctly', async () => {
      const { rerender } = render(<Dashboard page="index" />);

      await waitFor(() => {
        expect(screen.getByTestId('authenticated-layout')).toBeInTheDocument();
      });

      rerender(<Dashboard page="create" />);

      await waitFor(() => {
        expect(screen.getByTestId('authenticated-layout')).toBeInTheDocument();
      });
    });
  });

  describe('DashboardIndexPage Component', () => {
    it('should render dashboard index page correctly', async () => {
      render(<DashboardIndexPage />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    it('should display metrics cards', async () => {
      render(<DashboardIndexPage />);

      await waitFor(() => {
        expect(screen.getByText('Total de Leads')).toBeInTheDocument();
        expect(screen.getByText('Total de Usuários')).toBeInTheDocument();
        expect(screen.getByText('Total de Projetos')).toBeInTheDocument();
        expect(screen.getByText('Receita Total')).toBeInTheDocument();
      });
    });

    it('should handle refresh button click', async () => {
      render(<DashboardIndexPage />);

      await waitFor(() => {
        const refreshButton = screen.getByRole('button', { name: /atualizar/i });
        expect(refreshButton).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /atualizar/i });
      fireEvent.click(refreshButton);

      // Should not throw any errors
      await waitFor(() => {
        expect(refreshButton).toBeInTheDocument();
      });
    });

    it('should handle export button click', async () => {
      render(<DashboardIndexPage />);

      await waitFor(() => {
        const exportButton = screen.getByRole('button', { name: /exportar/i });
        expect(exportButton).toBeInTheDocument();
      });

      const exportButton = screen.getByRole('button', { name: /exportar/i });
      fireEvent.click(exportButton);

      // Should not throw any errors
      await waitFor(() => {
        expect(exportButton).toBeInTheDocument();
      });
    });
  });

  describe('ExecutiveMasterDashboard Component', () => {
    it('should render executive dashboard correctly', async () => {
      render(<ExecutiveMasterDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Executive Master Dashboard')).toBeInTheDocument();
      });
    });

    it('should display executive metrics', async () => {
      render(<ExecutiveMasterDashboard />);

      await waitFor(() => {
        expect(screen.getByText('KPIs Executivos')).toBeInTheDocument();
        expect(screen.getByText('Análise de Performance')).toBeInTheDocument();
      });
    });
  });

  describe('MetricsOverview Component', () => {
    it('should render metrics overview correctly', async () => {
      render(<MetricsOverview />);

      await waitFor(() => {
        expect(screen.getByText('Visão Geral das Métricas')).toBeInTheDocument();
      });
    });

    it('should display metric cards', async () => {
      render(<MetricsOverview />);

      await waitFor(() => {
        expect(screen.getByText('Leads')).toBeInTheDocument();
        expect(screen.getByText('Usuários')).toBeInTheDocument();
        expect(screen.getByText('Projetos')).toBeInTheDocument();
        expect(screen.getByText('Receita')).toBeInTheDocument();
      });
    });
  });

  describe('AdvancedDashboard Component', () => {
    it('should render advanced dashboard correctly', async () => {
      render(<AdvancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard Avançado')).toBeInTheDocument();
      });
    });

    it('should display advanced features', async () => {
      render(<AdvancedDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Recursos Avançados')).toBeInTheDocument();
        expect(screen.getByText('Configurações')).toBeInTheDocument();
      });
    });
  });

  describe('WidgetManager Component', () => {
    it('should render widget manager correctly', async () => {
      render(<WidgetManager />);

      await waitFor(() => {
        expect(screen.getByText('Gerenciador de Widgets')).toBeInTheDocument();
      });
    });

    it('should display widget controls', async () => {
      render(<WidgetManager />);

      await waitFor(() => {
        expect(screen.getByText('Adicionar Widget')).toBeInTheDocument();
        expect(screen.getByText('Gerenciar Layout')).toBeInTheDocument();
      });
    });

    it('should handle add widget button click', async () => {
      render(<WidgetManager />);

      await waitFor(() => {
        const addButton = screen.getByRole('button', { name: /adicionar widget/i });
        expect(addButton).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /adicionar widget/i });
      fireEvent.click(addButton);

      // Should not throw any errors
      await waitFor(() => {
        expect(addButton).toBeInTheDocument();
      });
    });
  });

  describe('Dashboard Workflow Integration', () => {
    it('should handle complete dashboard workflow', async () => {
      render(<DashboardIndexPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      // Check if metrics are displayed
      await waitFor(() => {
        expect(screen.getByText('Total de Leads')).toBeInTheDocument();
        expect(screen.getByText('Total de Usuários')).toBeInTheDocument();
      });

      // Test refresh functionality
      const refreshButton = screen.getByRole('button', { name: /atualizar/i });
      fireEvent.click(refreshButton);

      // Test export functionality
      const exportButton = screen.getByRole('button', { name: /exportar/i });
      fireEvent.click(exportButton);

      // Should not throw any errors
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    it('should handle widget management workflow', async () => {
      render(<WidgetManager />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Gerenciador de Widgets')).toBeInTheDocument();
      });

      // Test add widget
      const addButton = screen.getByRole('button', { name: /adicionar widget/i });
      fireEvent.click(addButton);

      // Test layout management
      const layoutButton = screen.getByRole('button', { name: /gerenciar layout/i });
      fireEvent.click(layoutButton);

      // Should not throw any errors
      await waitFor(() => {
        expect(screen.getByText('Gerenciador de Widgets')).toBeInTheDocument();
      });
    });

    it('should handle advanced dashboard workflow', async () => {
      render(<AdvancedDashboard />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Dashboard Avançado')).toBeInTheDocument();
      });

      // Test advanced features
      await waitFor(() => {
        expect(screen.getByText('Recursos Avançados')).toBeInTheDocument();
        expect(screen.getByText('Configurações')).toBeInTheDocument();
      });

      // Should not throw any errors
      await waitFor(() => {
        expect(screen.getByText('Dashboard Avançado')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle service errors gracefully', async () => {
      // Mock service error
      const dashboardService = require('../services/dashboardService');
      dashboardService.getDashboardData.mockRejectedValueOnce(new Error('Service error'));

      render(<DashboardIndexPage />);

      // Should not crash
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      // Mock network error
      const dashboardService = require('../services/dashboardService');
      dashboardService.getDashboardData.mockRejectedValueOnce(new Error('Network error'));

      render(<DashboardIndexPage />);

      // Should not crash
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('Performance Integration', () => {
    it('should handle rapid user interactions efficiently', async () => {
      render(<DashboardIndexPage />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /atualizar/i });
      const exportButton = screen.getByRole('button', { name: /exportar/i });

      const startTime = performance.now();

      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(refreshButton);
        fireEvent.click(exportButton);
      }

      const endTime = performance.now();

      // Should complete in reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle large data sets efficiently', async () => {
      // Mock large dataset
      const dashboardService = require('../services/dashboardService');
      dashboardService.getDashboardData.mockResolvedValueOnce({
        metrics: {
          total_leads: 100000,
          total_users: 50000,
          total_projects: 25000,
          active_projects: 20000,
          total_campaigns: 10000,
          total_revenue: 5000000,
          conversion_rate: 0.15,
          leads_growth: 0.1,
          users_growth: 0.05,
          projects_growth: 0.2,
          campaigns_growth: 0.0,
          revenue_growth: 0.3
        },
        recent_activities: Array.from({ length: 1000 }, (_, i) => ({
          id: i.toString(),
          action: `Action ${i}`,
          description: `Description ${i}`,
          count: i,
          timestamp: new Date().toISOString(),
          type: 'lead' as const
        })),
        top_leads: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          name: `Lead ${i}`,
          email: `lead${i}@example.com`,
          score: i,
          status: 'active',
          source: 'website',
          created_at: new Date().toISOString()
        })),
        recent_projects: Array.from({ length: 100 }, (_, i) => ({
          id: i,
          name: `Project ${i}`,
          description: `Description ${i}`,
          status: 'active',
          owner_id: i,
          created_at: new Date().toISOString()
        })),
        stats: {}
      });

      const startTime = performance.now();

      render(<DashboardIndexPage />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });

      const endTime = performance.now();

      // Should complete in reasonable time
      expect(endTime - startTime).toBeLessThan(2000);
    });
  });
});
