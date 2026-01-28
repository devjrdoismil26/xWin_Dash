import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IntelligentDashboard } from '@/components/ui/IntelligentDashboard';
import { motion } from 'framer-motion';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Lucide React
vi.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up" />,
  TrendingDown: () => <div data-testid="trending-down" />,
  Activity: () => <div data-testid="activity" />,
  Users: () => <div data-testid="users" />,
  DollarSign: () => <div data-testid="dollar-sign" />,
  BarChart3: () => <div data-testid="bar-chart" />,
  RefreshCw: () => <div data-testid="refresh" />,
  Settings: () => <div data-testid="settings" />,
  Lightbulb: () => <div data-testid="lightbulb" />,
  AlertTriangle: () => <div data-testid="alert-triangle" />,
  CheckCircle: () => <div data-testid="check-circle" />,
  Info: () => <div data-testid="info" />,
}));

describe('IntelligentDashboard', () => {
  const mockMetrics = [
    {
      id: 'revenue',
      label: 'Revenue',
      value: '$125,000',
      change: '+12.5%',
      trend: 'up' as const,
      icon: 'DollarSign' as const,
    },
    {
      id: 'users',
      label: 'Active Users',
      value: '2,847',
      change: '+8.2%',
      trend: 'up' as const,
      icon: 'Users' as const,
    },
  ];

  const mockCharts = [
    {
      id: 'revenue-chart',
      title: 'Revenue Trend',
      type: 'line' as const,
      data: [
        { label: 'Jan', value: 100000 },
        { label: 'Feb', value: 120000 },
        { label: 'Mar', value: 125000 },
      ],
    },
  ];

  const mockInsights = [
    {
      id: 'insight-1',
      type: 'success' as const,
      title: 'Revenue Growth',
      description: 'Revenue increased by 12.5% this month',
      action: 'View Details',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard with metrics', () => {
    render(
      <IntelligentDashboard
        metrics={mockMetrics}
        charts={mockCharts}
        insights={mockInsights}
        loading={false}
        error={null}
        onRefresh={vi.fn()}
        onSettings={vi.fn()}
        onInsightAction={vi.fn()}
      />
    );

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$125,000')).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('2,847')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <IntelligentDashboard
        metrics={[]}
        charts={[]}
        insights={[]}
        loading={true}
        error={null}
        onRefresh={vi.fn()}
        onSettings={vi.fn()}
        onInsightAction={vi.fn()}
      />
    );

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(
      <IntelligentDashboard
        metrics={[]}
        charts={[]}
        insights={[]}
        loading={false}
        error="Failed to load data"
        onRefresh={vi.fn()}
        onSettings={vi.fn()}
        onInsightAction={vi.fn()}
      />
    );

    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', async () => {
    const mockOnRefresh = vi.fn();
    
    render(
      <IntelligentDashboard
        metrics={mockMetrics}
        charts={mockCharts}
        insights={mockInsights}
        loading={false}
        error={null}
        onRefresh={mockOnRefresh}
        onSettings={vi.fn()}
        onInsightAction={vi.fn()}
      />
    );

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onSettings when settings button is clicked', async () => {
    const mockOnSettings = vi.fn();
    
    render(
      <IntelligentDashboard
        metrics={mockMetrics}
        charts={mockCharts}
        insights={mockInsights}
        loading={false}
        error={null}
        onRefresh={vi.fn()}
        onSettings={mockOnSettings}
        onInsightAction={vi.fn()}
      />
    );

    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);

    await waitFor(() => {
      expect(mockOnSettings).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onInsightAction when insight action is clicked', async () => {
    const mockOnInsightAction = vi.fn();
    
    render(
      <IntelligentDashboard
        metrics={mockMetrics}
        charts={mockCharts}
        insights={mockInsights}
        loading={false}
        error={null}
        onRefresh={vi.fn()}
        onSettings={vi.fn()}
        onInsightAction={mockOnInsightAction}
      />
    );

    const actionButton = screen.getByText('View Details');
    fireEvent.click(actionButton);

    await waitFor(() => {
      expect(mockOnInsightAction).toHaveBeenCalledWith('insight-1');
    });
  });

  it('renders charts when provided', () => {
    render(
      <IntelligentDashboard
        metrics={mockMetrics}
        charts={mockCharts}
        insights={mockInsights}
        loading={false}
        error={null}
        onRefresh={vi.fn()}
        onSettings={vi.fn()}
        onInsightAction={vi.fn()}
      />
    );

    expect(screen.getByText('Revenue Trend')).toBeInTheDocument();
  });

  it('renders insights with correct types', () => {
    render(
      <IntelligentDashboard
        metrics={mockMetrics}
        charts={mockCharts}
        insights={mockInsights}
        loading={false}
        error={null}
        onRefresh={vi.fn()}
        onSettings={vi.fn()}
        onInsightAction={vi.fn()}
      />
    );

    expect(screen.getByText('Revenue Growth')).toBeInTheDocument();
    expect(screen.getByText('Revenue increased by 12.5% this month')).toBeInTheDocument();
  });

  it('applies glassmorphism classes correctly', () => {
    const { container } = render(
      <IntelligentDashboard
        metrics={mockMetrics}
        charts={mockCharts}
        insights={mockInsights}
        loading={false}
        error={null}
        onRefresh={vi.fn()}
        onSettings={vi.fn()}
        onInsightAction={vi.fn()}
      />
    );

    const glassmorphismElements = container.querySelectorAll('.backdrop-blur-xl');
    expect(glassmorphismElements.length).toBeGreaterThan(0);
  });

  it('handles empty metrics gracefully', () => {
    render(
      <IntelligentDashboard
        metrics={[]}
        charts={[]}
        insights={[]}
        loading={false}
        error={null}
        onRefresh={vi.fn()}
        onSettings={vi.fn()}
        onInsightAction={vi.fn()}
      />
    );

    expect(screen.getByText('No metrics available')).toBeInTheDocument();
  });

  it('handles auto-refresh functionality', async () => {
    vi.useFakeTimers();
    const mockOnRefresh = vi.fn();
    
    render(
      <IntelligentDashboard
        metrics={mockMetrics}
        charts={mockCharts}
        insights={mockInsights}
        loading={false}
        error={null}
        onRefresh={mockOnRefresh}
        onSettings={vi.fn()}
        onInsightAction={vi.fn()}
        autoRefresh={true}
        refreshInterval={5000}
      />
    );

    // Fast-forward time
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalled();
    });

    vi.useRealTimers();
  });
});
