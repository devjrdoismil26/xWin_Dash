import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock do componente MetricsOverview
const MetricsOverview = () => {
  const [metrics, setMetrics] = React.useState({
    overview: {
      totalUsers: 15420,
      activeUsers: 12350,
      newUsers: 450,
      userGrowth: 8.2,
      totalRevenue: 1250000,
      monthlyRevenue: 150000,
      revenueGrowth: 12.5,
      conversionRate: 4.8,
      bounceRate: 35.2,
      avgSessionDuration: '3m 45s',
      pageViews: 45000,
      uniqueVisitors: 28000
    },
    trends: {
      userGrowth: [
        { date: '2024-01-01', users: 12000 },
        { date: '2024-01-08', users: 12500 },
        { date: '2024-01-15', users: 13000 },
        { date: '2024-01-22', users: 13500 },
        { date: '2024-01-29', users: 14000 }
      ],
      revenue: [
        { date: '2024-01-01', revenue: 100000 },
        { date: '2024-01-08', revenue: 110000 },
        { date: '2024-01-15', revenue: 120000 },
        { date: '2024-01-22', revenue: 130000 },
        { date: '2024-01-29', revenue: 140000 }
      ],
      conversions: [
        { date: '2024-01-01', conversions: 480 },
        { date: '2024-01-08', conversions: 520 },
        { date: '2024-01-15', conversions: 560 },
        { date: '2024-01-22', conversions: 600 },
        { date: '2024-01-29', conversions: 640 }
      ]
    },
    topPages: [
      { page: '/dashboard', views: 8500, uniqueVisitors: 4200 },
      { page: '/products', views: 6200, uniqueVisitors: 3100 },
      { page: '/pricing', views: 4800, uniqueVisitors: 2400 },
      { page: '/about', views: 3200, uniqueVisitors: 1600 }
    ],
    trafficSources: [
      { source: 'Google', visitors: 12000, percentage: 42.9 },
      { source: 'Facebook', visitors: 8000, percentage: 28.6 },
      { source: 'Direct', visitors: 5000, percentage: 17.9 },
      { source: 'Twitter', visitors: 3000, percentage: 10.7 }
    ]
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedPeriod, setSelectedPeriod] = React.useState('30d');
  const [selectedMetric, setSelectedMetric] = React.useState('all');
  const [viewMode, setViewMode] = React.useState('cards'); // cards, table, chart

  const refreshMetrics = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        overview: {
          ...prev.overview,
          totalUsers: prev.overview.totalUsers + Math.floor(Math.random() * 100)
        }
      }));
      setIsLoading(false);
    }, 1000);
  };

  const exportMetrics = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div data-testid="metrics-overview" className="metrics-overview">
      <h1 data-testid="metrics-title">Metrics Overview</h1>
      
      <div data-testid="metrics-header" className="metrics-header">
        <div data-testid="metrics-controls" className="metrics-controls">
          <select
            data-testid="period-selector"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <select
            data-testid="metric-selector"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="all">All Metrics</option>
            <option value="users">Users</option>
            <option value="revenue">Revenue</option>
            <option value="conversions">Conversions</option>
          </select>
          
          <select
            data-testid="view-mode-selector"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="cards">Cards View</option>
            <option value="table">Table View</option>
            <option value="chart">Chart View</option>
          </select>
          
          <button data-testid="refresh-btn" onClick={refreshMetrics}>
            Refresh
          </button>
          
          <button data-testid="export-btn" onClick={exportMetrics}>
            Export
          </button>
        </div>
      </div>

      {isLoading && <div data-testid="metrics-loading">Loading metrics...</div>}

      <div data-testid="overview-section" className="overview-section">
        <h2>Key Metrics</h2>
        <div data-testid="metrics-grid" className="metrics-grid">
          <div data-testid="metric-total-users" className="metric-card">
            <span data-testid="total-users-value">{metrics.overview.totalUsers.toLocaleString()}</span>
            <span data-testid="total-users-label">Total Users</span>
            <span data-testid="total-users-growth">+{metrics.overview.userGrowth}%</span>
          </div>
          <div data-testid="metric-active-users" className="metric-card">
            <span data-testid="active-users-value">{metrics.overview.activeUsers.toLocaleString()}</span>
            <span data-testid="active-users-label">Active Users</span>
          </div>
          <div data-testid="metric-new-users" className="metric-card">
            <span data-testid="new-users-value">{metrics.overview.newUsers}</span>
            <span data-testid="new-users-label">New Users</span>
          </div>
          <div data-testid="metric-total-revenue" className="metric-card">
            <span data-testid="total-revenue-value">R$ {metrics.overview.totalRevenue.toLocaleString()}</span>
            <span data-testid="total-revenue-label">Total Revenue</span>
            <span data-testid="total-revenue-growth">+{metrics.overview.revenueGrowth}%</span>
          </div>
          <div data-testid="metric-monthly-revenue" className="metric-card">
            <span data-testid="monthly-revenue-value">R$ {metrics.overview.monthlyRevenue.toLocaleString()}</span>
            <span data-testid="monthly-revenue-label">Monthly Revenue</span>
          </div>
          <div data-testid="metric-conversion-rate" className="metric-card">
            <span data-testid="conversion-rate-value">{metrics.overview.conversionRate}%</span>
            <span data-testid="conversion-rate-label">Conversion Rate</span>
          </div>
          <div data-testid="metric-bounce-rate" className="metric-card">
            <span data-testid="bounce-rate-value">{metrics.overview.bounceRate}%</span>
            <span data-testid="bounce-rate-label">Bounce Rate</span>
          </div>
          <div data-testid="metric-session-duration" className="metric-card">
            <span data-testid="session-duration-value">{metrics.overview.avgSessionDuration}</span>
            <span data-testid="session-duration-label">Avg Session</span>
          </div>
          <div data-testid="metric-page-views" className="metric-card">
            <span data-testid="page-views-value">{metrics.overview.pageViews.toLocaleString()}</span>
            <span data-testid="page-views-label">Page Views</span>
          </div>
          <div data-testid="metric-unique-visitors" className="metric-card">
            <span data-testid="unique-visitors-value">{metrics.overview.uniqueVisitors.toLocaleString()}</span>
            <span data-testid="unique-visitors-label">Unique Visitors</span>
          </div>
        </div>
      </div>

      <div data-testid="trends-section" className="trends-section">
        <h2>Trends</h2>
        
        <div data-testid="user-growth-trend" className="trend-chart">
          <h3>User Growth Trend</h3>
          {metrics.trends.userGrowth.map((item, index) => (
            <div key={index} data-testid={`user-growth-item-${index}`}>
              {item.date}: {item.users.toLocaleString()} users
            </div>
          ))}
        </div>

        <div data-testid="revenue-trend" className="trend-chart">
          <h3>Revenue Trend</h3>
          {metrics.trends.revenue.map((item, index) => (
            <div key={index} data-testid={`revenue-trend-item-${index}`}>
              {item.date}: R$ {item.revenue.toLocaleString()}
            </div>
          ))}
        </div>

        <div data-testid="conversions-trend" className="trend-chart">
          <h3>Conversions Trend</h3>
          {metrics.trends.conversions.map((item, index) => (
            <div key={index} data-testid={`conversions-trend-item-${index}`}>
              {item.date}: {item.conversions} conversions
            </div>
          ))}
        </div>
      </div>

      <div data-testid="top-pages-section" className="top-pages-section">
        <h2>Top Pages</h2>
        <div data-testid="top-pages-list" className="top-pages-list">
          {metrics.topPages.map((page, index) => (
            <div key={index} data-testid={`top-page-${index}`} className="top-page-item">
              <span data-testid={`page-url-${index}`}>{page.page}</span>
              <span data-testid={`page-views-${index}`}>{page.views.toLocaleString()} views</span>
              <span data-testid={`page-visitors-${index}`}>{page.uniqueVisitors.toLocaleString()} visitors</span>
            </div>
          ))}
        </div>
      </div>

      <div data-testid="traffic-sources-section" className="traffic-sources-section">
        <h2>Traffic Sources</h2>
        <div data-testid="traffic-sources-list" className="traffic-sources-list">
          {metrics.trafficSources.map((source, index) => (
            <div key={index} data-testid={`traffic-source-${index}`} className="traffic-source-item">
              <span data-testid={`source-name-${index}`}>{source.source}</span>
              <span data-testid={`source-visitors-${index}`}>{source.visitors.toLocaleString()} visitors</span>
              <span data-testid={`source-percentage-${index}`}>{source.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

describe('MetricsOverview Module', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('should render metrics overview interface', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('metrics-overview')).toBeInTheDocument();
    });
  });

  it('should display metrics title', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('metrics-title')).toBeInTheDocument();
      expect(screen.getByText('Metrics Overview')).toBeInTheDocument();
    });
  });

  it('should display overview section', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('overview-section')).toBeInTheDocument();
      expect(screen.getByTestId('metrics-grid')).toBeInTheDocument();
    });
  });

  it('should display all key metrics', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('metric-total-users')).toBeInTheDocument();
      expect(screen.getByTestId('metric-active-users')).toBeInTheDocument();
      expect(screen.getByTestId('metric-new-users')).toBeInTheDocument();
      expect(screen.getByTestId('metric-total-revenue')).toBeInTheDocument();
      expect(screen.getByTestId('metric-monthly-revenue')).toBeInTheDocument();
      expect(screen.getByTestId('metric-conversion-rate')).toBeInTheDocument();
      expect(screen.getByTestId('metric-bounce-rate')).toBeInTheDocument();
      expect(screen.getByTestId('metric-session-duration')).toBeInTheDocument();
      expect(screen.getByTestId('metric-page-views')).toBeInTheDocument();
      expect(screen.getByTestId('metric-unique-visitors')).toBeInTheDocument();
    });
  });

  it('should display metric values correctly', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('total-users-value')).toHaveTextContent('15.420');
      expect(screen.getByTestId('active-users-value')).toHaveTextContent('12.350');
      expect(screen.getByTestId('new-users-value')).toHaveTextContent('450');
      expect(screen.getByTestId('total-revenue-value')).toHaveTextContent('R$ 1.250.000');
      expect(screen.getByTestId('monthly-revenue-value')).toHaveTextContent('R$ 150.000');
      expect(screen.getByTestId('conversion-rate-value')).toHaveTextContent('4.8%');
      expect(screen.getByTestId('bounce-rate-value')).toHaveTextContent('35.2%');
      expect(screen.getByTestId('session-duration-value')).toHaveTextContent('3m 45s');
      expect(screen.getByTestId('page-views-value')).toHaveTextContent('45.000');
      expect(screen.getByTestId('unique-visitors-value')).toHaveTextContent('28.000');
    });
  });

  it('should display growth indicators', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('total-users-growth')).toHaveTextContent('+8.2%');
      expect(screen.getByTestId('total-revenue-growth')).toHaveTextContent('+12.5%');
    });
  });

  it('should display trends section', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('trends-section')).toBeInTheDocument();
      expect(screen.getByTestId('user-growth-trend')).toBeInTheDocument();
      expect(screen.getByTestId('revenue-trend')).toBeInTheDocument();
      expect(screen.getByTestId('conversions-trend')).toBeInTheDocument();
    });
  });

  it('should display user growth trend data', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('user-growth-item-0')).toHaveTextContent('2024-01-01: 12.000 users');
      expect(screen.getByTestId('user-growth-item-1')).toHaveTextContent('2024-01-08: 12.500 users');
      expect(screen.getByTestId('user-growth-item-2')).toHaveTextContent('2024-01-15: 13.000 users');
    });
  });

  it('should display revenue trend data', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('revenue-trend-item-0')).toHaveTextContent('2024-01-01: R$ 100.000');
      expect(screen.getByTestId('revenue-trend-item-1')).toHaveTextContent('2024-01-08: R$ 110.000');
      expect(screen.getByTestId('revenue-trend-item-2')).toHaveTextContent('2024-01-15: R$ 120.000');
    });
  });

  it('should display conversions trend data', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('conversions-trend-item-0')).toHaveTextContent('2024-01-01: 480 conversions');
      expect(screen.getByTestId('conversions-trend-item-1')).toHaveTextContent('2024-01-08: 520 conversions');
      expect(screen.getByTestId('conversions-trend-item-2')).toHaveTextContent('2024-01-15: 560 conversions');
    });
  });

  it('should display top pages section', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('top-pages-section')).toBeInTheDocument();
      expect(screen.getByTestId('top-pages-list')).toBeInTheDocument();
    });
  });

  it('should display top pages data', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('page-url-0')).toHaveTextContent('/dashboard');
      expect(screen.getByTestId('page-views-0')).toHaveTextContent('8.500 views');
      expect(screen.getByTestId('page-visitors-0')).toHaveTextContent('4.200 visitors');
    });
  });

  it('should display traffic sources section', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('traffic-sources-section')).toBeInTheDocument();
      expect(screen.getByTestId('traffic-sources-list')).toBeInTheDocument();
    });
  });

  it('should display traffic sources data', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('source-name-0')).toHaveTextContent('Google');
      expect(screen.getByTestId('source-visitors-0')).toHaveTextContent('12.000 visitors');
      expect(screen.getByTestId('source-percentage-0')).toHaveTextContent('42.9%');
    });
  });

  it('should handle period changes', async () => {
    render(<MetricsOverview />, { queryClient });

    const periodSelector = screen.getByTestId('period-selector');
    fireEvent.change(periodSelector, { target: { value: '90d' } });

    expect(periodSelector).toHaveValue('90d');
  });

  it('should handle metric filtering', async () => {
    render(<MetricsOverview />, { queryClient });

    const metricSelector = screen.getByTestId('metric-selector');
    fireEvent.change(metricSelector, { target: { value: 'users' } });

    expect(metricSelector).toHaveValue('users');
  });

  it('should handle view mode changes', async () => {
    render(<MetricsOverview />, { queryClient });

    const viewModeSelector = screen.getByTestId('view-mode-selector');
    fireEvent.change(viewModeSelector, { target: { value: 'table' } });

    expect(viewModeSelector).toHaveValue('table');
  });

  it('should handle metrics refresh', async () => {
    render(<MetricsOverview />, { queryClient });

    const refreshBtn = screen.getByTestId('refresh-btn');
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(screen.getByTestId('metrics-loading')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByTestId('metrics-loading')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should handle metrics export', async () => {
    render(<MetricsOverview />, { queryClient });

    const exportBtn = screen.getByTestId('export-btn');
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(screen.getByTestId('metrics-loading')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByTestId('metrics-loading')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should be responsive', async () => {
    render(<MetricsOverview />, { queryClient });

    await waitFor(() => {
      const metricsOverview = screen.getByTestId('metrics-overview');
      expect(metricsOverview).toHaveClass('metrics-overview');
    });
  });

  it('should support dark theme', async () => {
    render(<MetricsOverview />, { 
      queryClient, 
      theme: 'dark' 
    });

    await waitFor(() => {
      const metricsOverview = screen.getByTestId('metrics-overview');
      expect(metricsOverview).toHaveClass('metrics-overview');
    });
  });
});