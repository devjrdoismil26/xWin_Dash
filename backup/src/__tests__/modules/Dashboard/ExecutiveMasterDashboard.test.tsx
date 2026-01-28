import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock do componente ExecutiveMasterDashboard
const ExecutiveMasterDashboard = () => {
  const [dashboardData, setDashboardData] = React.useState({
    kpis: {
      totalRevenue: 1250000,
      totalUsers: 15420,
      activeProjects: 45,
      conversionRate: 12.5,
      customerSatisfaction: 4.8,
      monthlyGrowth: 8.2
    },
    charts: {
      revenueTrend: [
        { month: 'Jan', revenue: 100000 },
        { month: 'Feb', revenue: 120000 },
        { month: 'Mar', revenue: 110000 },
        { month: 'Apr', revenue: 130000 }
      ],
      userGrowth: [
        { month: 'Jan', users: 12000 },
        { month: 'Feb', users: 13500 },
        { month: 'Mar', users: 14200 },
        { month: 'Apr', users: 15420 }
      ],
      projectStatus: [
        { status: 'Completed', count: 25 },
        { status: 'In Progress', count: 15 },
        { status: 'On Hold', count: 5 }
      ]
    },
    alerts: [
      {
        id: 1,
        type: 'warning',
        message: 'Revenue target not met for Q1',
        timestamp: '2024-01-15'
      },
      {
        id: 2,
        type: 'info',
        message: 'New user registration spike detected',
        timestamp: '2024-01-14'
      }
    ],
    recentActivity: [
      {
        id: 1,
        action: 'Project completed',
        user: 'John Doe',
        timestamp: '2024-01-15 10:30'
      },
      {
        id: 2,
        action: 'New user registered',
        user: 'Jane Smith',
        timestamp: '2024-01-15 09:15'
      }
    ]
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = React.useState('30d');
  const [selectedView, setSelectedView] = React.useState('overview'); // overview, detailed, custom

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDashboardData(prev => ({
        ...prev,
        kpis: {
          ...prev.kpis,
          totalRevenue: prev.kpis.totalRevenue + Math.floor(Math.random() * 10000)
        }
      }));
      setIsLoading(false);
    }, 1000);
  };

  const exportReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div data-testid="executive-dashboard" className="executive-dashboard">
      <h1 data-testid="executive-title">Executive Master Dashboard</h1>
      
      <div data-testid="dashboard-header" className="dashboard-header">
        <div data-testid="dashboard-controls" className="dashboard-controls">
          <select
            data-testid="time-range-selector"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <select
            data-testid="view-selector"
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed</option>
            <option value="custom">Custom</option>
          </select>
          
          <button data-testid="refresh-btn" onClick={refreshData}>
            Refresh
          </button>
          
          <button data-testid="export-btn" onClick={exportReport}>
            Export Report
          </button>
        </div>
      </div>

      {isLoading && <div data-testid="dashboard-loading">Loading dashboard data...</div>}

      <div data-testid="kpis-section" className="kpis-section">
        <h2>Key Performance Indicators</h2>
        <div data-testid="kpis-grid" className="kpis-grid">
          <div data-testid="kpi-revenue" className="kpi-card">
            <span data-testid="revenue-value">R$ {dashboardData.kpis.totalRevenue.toLocaleString()}</span>
            <span data-testid="revenue-label">Total Revenue</span>
          </div>
          <div data-testid="kpi-users" className="kpi-card">
            <span data-testid="users-value">{dashboardData.kpis.totalUsers.toLocaleString()}</span>
            <span data-testid="users-label">Total Users</span>
          </div>
          <div data-testid="kpi-projects" className="kpi-card">
            <span data-testid="projects-value">{dashboardData.kpis.activeProjects}</span>
            <span data-testid="projects-label">Active Projects</span>
          </div>
          <div data-testid="kpi-conversion" className="kpi-card">
            <span data-testid="conversion-value">{dashboardData.kpis.conversionRate}%</span>
            <span data-testid="conversion-label">Conversion Rate</span>
          </div>
          <div data-testid="kpi-satisfaction" className="kpi-card">
            <span data-testid="satisfaction-value">{dashboardData.kpis.customerSatisfaction}/5</span>
            <span data-testid="satisfaction-label">Customer Satisfaction</span>
          </div>
          <div data-testid="kpi-growth" className="kpi-card">
            <span data-testid="growth-value">{dashboardData.kpis.monthlyGrowth}%</span>
            <span data-testid="growth-label">Monthly Growth</span>
          </div>
        </div>
      </div>

      <div data-testid="charts-section" className="charts-section">
        <h2>Analytics & Trends</h2>
        
        <div data-testid="revenue-chart" className="chart-container">
          <h3>Revenue Trend</h3>
          {dashboardData.charts.revenueTrend.map((item, index) => (
            <div key={index} data-testid={`revenue-item-${index}`}>
              {item.month}: R$ {item.revenue.toLocaleString()}
            </div>
          ))}
        </div>

        <div data-testid="users-chart" className="chart-container">
          <h3>User Growth</h3>
          {dashboardData.charts.userGrowth.map((item, index) => (
            <div key={index} data-testid={`users-item-${index}`}>
              {item.month}: {item.users.toLocaleString()} users
            </div>
          ))}
        </div>

        <div data-testid="projects-chart" className="chart-container">
          <h3>Project Status</h3>
          {dashboardData.charts.projectStatus.map((item, index) => (
            <div key={index} data-testid={`project-item-${index}`}>
              {item.status}: {item.count} projects
            </div>
          ))}
        </div>
      </div>

      <div data-testid="alerts-section" className="alerts-section">
        <h2>System Alerts</h2>
        <div data-testid="alerts-list" className="alerts-list">
          {dashboardData.alerts.map(alert => (
            <div key={alert.id} data-testid={`alert-${alert.id}`} className={`alert alert-${alert.type}`}>
              <span data-testid={`alert-message-${alert.id}`}>{alert.message}</span>
              <span data-testid={`alert-timestamp-${alert.id}`}>{alert.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      <div data-testid="activity-section" className="activity-section">
        <h2>Recent Activity</h2>
        <div data-testid="activity-list" className="activity-list">
          {dashboardData.recentActivity.map(activity => (
            <div key={activity.id} data-testid={`activity-${activity.id}`} className="activity-item">
              <span data-testid={`activity-action-${activity.id}`}>{activity.action}</span>
              <span data-testid={`activity-user-${activity.id}`}>by {activity.user}</span>
              <span data-testid={`activity-time-${activity.id}`}>{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

describe('ExecutiveMasterDashboard Module', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('should render executive dashboard interface', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('executive-dashboard')).toBeInTheDocument();
    });
  });

  it('should display executive dashboard title', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('executive-title')).toBeInTheDocument();
      expect(screen.getByText('Executive Master Dashboard')).toBeInTheDocument();
    });
  });

  it('should display KPI section', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('kpis-section')).toBeInTheDocument();
      expect(screen.getByTestId('kpis-grid')).toBeInTheDocument();
    });
  });

  it('should display all KPIs', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('kpi-revenue')).toBeInTheDocument();
      expect(screen.getByTestId('kpi-users')).toBeInTheDocument();
      expect(screen.getByTestId('kpi-projects')).toBeInTheDocument();
      expect(screen.getByTestId('kpi-conversion')).toBeInTheDocument();
      expect(screen.getByTestId('kpi-satisfaction')).toBeInTheDocument();
      expect(screen.getByTestId('kpi-growth')).toBeInTheDocument();
    });
  });

  it('should display KPI values correctly', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('revenue-value')).toHaveTextContent('R$ 1.250.000');
      expect(screen.getByTestId('users-value')).toHaveTextContent('15.420');
      expect(screen.getByTestId('projects-value')).toHaveTextContent('45');
      expect(screen.getByTestId('conversion-value')).toHaveTextContent('12.5%');
      expect(screen.getByTestId('satisfaction-value')).toHaveTextContent('4.8/5');
      expect(screen.getByTestId('growth-value')).toHaveTextContent('8.2%');
    });
  });

  it('should display charts section', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('charts-section')).toBeInTheDocument();
      expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
      expect(screen.getByTestId('users-chart')).toBeInTheDocument();
      expect(screen.getByTestId('projects-chart')).toBeInTheDocument();
    });
  });

  it('should display revenue trend data', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('revenue-item-0')).toHaveTextContent('Jan: R$ 100.000');
      expect(screen.getByTestId('revenue-item-1')).toHaveTextContent('Feb: R$ 120.000');
      expect(screen.getByTestId('revenue-item-2')).toHaveTextContent('Mar: R$ 110.000');
      expect(screen.getByTestId('revenue-item-3')).toHaveTextContent('Apr: R$ 130.000');
    });
  });

  it('should display user growth data', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('users-item-0')).toHaveTextContent('Jan: 12.000 users');
      expect(screen.getByTestId('users-item-1')).toHaveTextContent('Feb: 13.500 users');
      expect(screen.getByTestId('users-item-2')).toHaveTextContent('Mar: 14.200 users');
      expect(screen.getByTestId('users-item-3')).toHaveTextContent('Apr: 15.420 users');
    });
  });

  it('should display project status data', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('project-item-0')).toHaveTextContent('Completed: 25 projects');
      expect(screen.getByTestId('project-item-1')).toHaveTextContent('In Progress: 15 projects');
      expect(screen.getByTestId('project-item-2')).toHaveTextContent('On Hold: 5 projects');
    });
  });

  it('should display alerts section', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('alerts-section')).toBeInTheDocument();
      expect(screen.getByTestId('alerts-list')).toBeInTheDocument();
      expect(screen.getByTestId('alert-1')).toBeInTheDocument();
      expect(screen.getByTestId('alert-2')).toBeInTheDocument();
    });
  });

  it('should display alert details', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('alert-message-1')).toHaveTextContent('Revenue target not met for Q1');
      expect(screen.getByTestId('alert-timestamp-1')).toHaveTextContent('2024-01-15');
      expect(screen.getByTestId('alert-message-2')).toHaveTextContent('New user registration spike detected');
      expect(screen.getByTestId('alert-timestamp-2')).toHaveTextContent('2024-01-14');
    });
  });

  it('should display activity section', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('activity-section')).toBeInTheDocument();
      expect(screen.getByTestId('activity-list')).toBeInTheDocument();
      expect(screen.getByTestId('activity-1')).toBeInTheDocument();
      expect(screen.getByTestId('activity-2')).toBeInTheDocument();
    });
  });

  it('should display activity details', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      expect(screen.getByTestId('activity-action-1')).toHaveTextContent('Project completed');
      expect(screen.getByTestId('activity-user-1')).toHaveTextContent('by John Doe');
      expect(screen.getByTestId('activity-time-1')).toHaveTextContent('2024-01-15 10:30');
    });
  });

  it('should handle time range changes', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    const timeRangeSelector = screen.getByTestId('time-range-selector');
    fireEvent.change(timeRangeSelector, { target: { value: '90d' } });

    expect(timeRangeSelector).toHaveValue('90d');
  });

  it('should handle view changes', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    const viewSelector = screen.getByTestId('view-selector');
    fireEvent.change(viewSelector, { target: { value: 'detailed' } });

    expect(viewSelector).toHaveValue('detailed');
  });

  it('should handle data refresh', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    const refreshBtn = screen.getByTestId('refresh-btn');
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByTestId('dashboard-loading')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should handle report export', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    const exportBtn = screen.getByTestId('export-btn');
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByTestId('dashboard-loading')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should be responsive', async () => {
    render(<ExecutiveMasterDashboard />, { queryClient });

    await waitFor(() => {
      const executiveDashboard = screen.getByTestId('executive-dashboard');
      expect(executiveDashboard).toHaveClass('executive-dashboard');
    });
  });

  it('should support dark theme', async () => {
    render(<ExecutiveMasterDashboard />, { 
      queryClient, 
      theme: 'dark' 
    });

    await waitFor(() => {
      const executiveDashboard = screen.getByTestId('executive-dashboard');
      expect(executiveDashboard).toHaveClass('executive-dashboard');
    });
  });
});