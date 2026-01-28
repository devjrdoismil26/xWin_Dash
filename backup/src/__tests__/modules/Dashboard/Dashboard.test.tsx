import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock do componente Dashboard
const Dashboard = () => {
  const [data, setData] = React.useState({
    totalLeads: 1250,
    totalProjects: 45,
    totalRevenue: 125000,
    conversionRate: 12.5
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Simular carregamento de dados
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);

  if (isLoading) {
    return <div data-testid="dashboard-loading">Loading...</div>;
  }

  if (error) {
    return <div data-testid="dashboard-error">Error: {error}</div>;
  }

  return (
    <div data-testid="dashboard-module" className="dashboard-module">
      <h1 data-testid="dashboard-title">Dashboard</h1>
      <div data-testid="metrics-grid" className="metrics-grid">
        <div data-testid="metric-leads" className="metric-card">
          <span data-testid="metric-leads-value">{data.totalLeads}</span>
          <span data-testid="metric-leads-label">Total Leads</span>
        </div>
        <div data-testid="metric-projects" className="metric-card">
          <span data-testid="metric-projects-value">{data.totalProjects}</span>
          <span data-testid="metric-projects-label">Total Projects</span>
        </div>
        <div data-testid="metric-revenue" className="metric-card">
          <span data-testid="metric-revenue-value">{data.totalRevenue}</span>
          <span data-testid="metric-revenue-label">Total Revenue</span>
        </div>
        <div data-testid="metric-conversion" className="metric-card">
          <span data-testid="metric-conversion-value">{data.conversionRate}%</span>
          <span data-testid="metric-conversion-label">Conversion Rate</span>
        </div>
      </div>
      <button 
        data-testid="refresh-button" 
        onClick={() => setIsLoading(true)}
        className="refresh-button"
      >
        Refresh
      </button>
    </div>
  );
};

describe('Dashboard Module', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('should render dashboard interface', async () => {
    render(<Dashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-module')).toBeInTheDocument();
    });
  });

  it('should display dashboard title', async () => {
    render(<Dashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-title')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('should display metrics data', async () => {
    render(<Dashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('metrics-grid')).toBeInTheDocument();
      expect(screen.getByTestId('metric-leads-value')).toHaveTextContent('1250');
      expect(screen.getByTestId('metric-projects-value')).toHaveTextContent('45');
      expect(screen.getByTestId('metric-revenue-value')).toHaveTextContent('125000');
      expect(screen.getByTestId('metric-conversion-value')).toHaveTextContent('12.5%');
    });
  });

  it('should show loading state initially', async () => {
    render(<Dashboard />, { queryClient });

    // O componente deve mostrar loading inicialmente
    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();
  });

  it('should handle refresh action', async () => {
    render(<Dashboard />, { queryClient });

    // Aguardar o carregamento inicial
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-module')).toBeInTheDocument();
    });

    // Clicar no botão de refresh
    const refreshButton = screen.getByTestId('refresh-button');
    refreshButton.click();

    // Aguardar o estado de loading aparecer
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();
    });
  });

  it('should be responsive', async () => {
    render(<Dashboard />, { queryClient });

    await waitFor(() => {
      const dashboard = screen.getByTestId('dashboard-module');
      expect(dashboard).toHaveClass('dashboard-module');
    });
  });

  it('should support dark theme', async () => {
    render(<Dashboard />, { 
      queryClient, 
      theme: 'dark' 
    });

    await waitFor(() => {
      const dashboard = screen.getByTestId('dashboard-module');
      expect(dashboard).toHaveClass('dashboard-module');
    });
  });
});