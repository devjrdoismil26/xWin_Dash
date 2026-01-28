import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IntelligentAutomation } from '@/components/ui/IntelligentAutomation';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Lucide React
vi.mock('lucide-react', () => ({
  Zap: () => <div data-testid="zap" />,
  Play: () => <div data-testid="play" />,
  Pause: () => <div data-testid="pause" />,
  Settings: () => <div data-testid="settings" />,
  Plus: () => <div data-testid="plus" />,
  Edit: () => <div data-testid="edit" />,
  Trash2: () => <div data-testid="trash" />,
  CheckCircle: () => <div data-testid="check-circle" />,
  AlertCircle: () => <div data-testid="alert-circle" />,
  Clock: () => <div data-testid="clock" />,
  Activity: () => <div data-testid="activity" />,
  TrendingUp: () => <div data-testid="trending-up" />,
}));

describe('IntelligentAutomation', () => {
  const mockRules = [
    {
      id: 'rule-1',
      name: 'Welcome Email',
      description: 'Send welcome email to new users',
      trigger: 'user_registered',
      actions: ['send_email'],
      conditions: ['is_new_user'],
      status: 'active' as const,
      lastExecuted: '2024-01-15T10:30:00Z',
      executionCount: 150,
      successRate: 98.5,
    },
  ];

  const mockTriggers = [
    {
      id: 'user_registered',
      name: 'User Registered',
      description: 'Triggered when a new user registers',
      type: 'event' as const,
      active: true,
    },
  ];

  const mockActions = [
    {
      id: 'send_email',
      name: 'Send Email',
      description: 'Send an email to the user',
      type: 'email' as const,
      configurable: true,
    },
  ];

  const mockConditions = [
    {
      id: 'is_new_user',
      name: 'Is New User',
      description: 'Check if user is new',
      type: 'boolean' as const,
      required: true,
    },
  ];

  const mockStats = {
    totalRules: 5,
    activeRules: 3,
    totalExecutions: 1250,
    successRate: 96.8,
    avgExecutionTime: 1.2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders automation dashboard with rules', () => {
    render(
      <IntelligentAutomation
        rules={mockRules}
        triggers={mockTriggers}
        actions={mockActions}
        conditions={mockConditions}
        stats={mockStats}
        loading={false}
        error={null}
        onRuleCreate={vi.fn()}
        onRuleUpdate={vi.fn()}
        onRuleDelete={vi.fn()}
        onRuleToggle={vi.fn()}
        onRuleExecute={vi.fn()}
      />
    );

    expect(screen.getByText('Welcome Email')).toBeInTheDocument();
    expect(screen.getByText('Send welcome email to new users')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <IntelligentAutomation
        rules={[]}
        triggers={[]}
        actions={[]}
        conditions={[]}
        stats={null}
        loading={true}
        error={null}
        onRuleCreate={vi.fn()}
        onRuleUpdate={vi.fn()}
        onRuleDelete={vi.fn()}
        onRuleToggle={vi.fn()}
        onRuleExecute={vi.fn()}
      />
    );

    expect(screen.getByText('Loading automation rules...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(
      <IntelligentAutomation
        rules={[]}
        triggers={[]}
        actions={[]}
        conditions={[]}
        stats={null}
        loading={false}
        error="Failed to load automation rules"
        onRuleCreate={vi.fn()}
        onRuleUpdate={vi.fn()}
        onRuleDelete={vi.fn()}
        onRuleToggle={vi.fn()}
        onRuleExecute={vi.fn()}
      />
    );

    expect(screen.getByText('Failed to load automation rules')).toBeInTheDocument();
  });

  it('calls onRuleCreate when create button is clicked', async () => {
    const mockOnRuleCreate = vi.fn();
    
    render(
      <IntelligentAutomation
        rules={mockRules}
        triggers={mockTriggers}
        actions={mockActions}
        conditions={mockConditions}
        stats={mockStats}
        loading={false}
        error={null}
        onRuleCreate={mockOnRuleCreate}
        onRuleUpdate={vi.fn()}
        onRuleDelete={vi.fn()}
        onRuleToggle={vi.fn()}
        onRuleExecute={vi.fn()}
      />
    );

    const createButton = screen.getByRole('button', { name: /create rule/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockOnRuleCreate).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onRuleToggle when rule status is clicked', async () => {
    const mockOnRuleToggle = vi.fn();
    
    render(
      <IntelligentAutomation
        rules={mockRules}
        triggers={mockTriggers}
        actions={mockActions}
        conditions={mockConditions}
        stats={mockStats}
        loading={false}
        error={null}
        onRuleCreate={vi.fn()}
        onRuleUpdate={vi.fn()}
        onRuleDelete={vi.fn()}
        onRuleToggle={mockOnRuleToggle}
        onRuleExecute={vi.fn()}
      />
    );

    const toggleButton = screen.getByText('Active');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(mockOnRuleToggle).toHaveBeenCalledWith('rule-1');
    });
  });

  it('calls onRuleExecute when execute button is clicked', async () => {
    const mockOnRuleExecute = vi.fn();
    
    render(
      <IntelligentAutomation
        rules={mockRules}
        triggers={mockTriggers}
        actions={mockActions}
        conditions={mockConditions}
        stats={mockStats}
        loading={false}
        error={null}
        onRuleCreate={vi.fn()}
        onRuleUpdate={vi.fn()}
        onRuleDelete={vi.fn()}
        onRuleToggle={vi.fn()}
        onRuleExecute={mockOnRuleExecute}
      />
    );

    const executeButton = screen.getByRole('button', { name: /execute/i });
    fireEvent.click(executeButton);

    await waitFor(() => {
      expect(mockOnRuleExecute).toHaveBeenCalledWith('rule-1');
    });
  });

  it('displays automation statistics', () => {
    render(
      <IntelligentAutomation
        rules={mockRules}
        triggers={mockTriggers}
        actions={mockActions}
        conditions={mockConditions}
        stats={mockStats}
        loading={false}
        error={null}
        onRuleCreate={vi.fn()}
        onRuleUpdate={vi.fn()}
        onRuleDelete={vi.fn()}
        onRuleToggle={vi.fn()}
        onRuleExecute={vi.fn()}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument(); // totalRules
    expect(screen.getByText('3')).toBeInTheDocument(); // activeRules
    expect(screen.getByText('1,250')).toBeInTheDocument(); // totalExecutions
    expect(screen.getByText('96.8%')).toBeInTheDocument(); // successRate
  });

  it('renders triggers, actions, and conditions', () => {
    render(
      <IntelligentAutomation
        rules={mockRules}
        triggers={mockTriggers}
        actions={mockActions}
        conditions={mockConditions}
        stats={mockStats}
        loading={false}
        error={null}
        onRuleCreate={vi.fn()}
        onRuleUpdate={vi.fn()}
        onRuleDelete={vi.fn()}
        onRuleToggle={vi.fn()}
        onRuleExecute={vi.fn()}
      />
    );

    expect(screen.getByText('User Registered')).toBeInTheDocument();
    expect(screen.getByText('Send Email')).toBeInTheDocument();
    expect(screen.getByText('Is New User')).toBeInTheDocument();
  });

  it('handles empty rules gracefully', () => {
    render(
      <IntelligentAutomation
        rules={[]}
        triggers={[]}
        actions={[]}
        conditions={[]}
        stats={null}
        loading={false}
        error={null}
        onRuleCreate={vi.fn()}
        onRuleUpdate={vi.fn()}
        onRuleDelete={vi.fn()}
        onRuleToggle={vi.fn()}
        onRuleExecute={vi.fn()}
      />
    );

    expect(screen.getByText('No automation rules found')).toBeInTheDocument();
  });

  it('applies glassmorphism classes correctly', () => {
    const { container } = render(
      <IntelligentAutomation
        rules={mockRules}
        triggers={mockTriggers}
        actions={mockActions}
        conditions={mockConditions}
        stats={mockStats}
        loading={false}
        error={null}
        onRuleCreate={vi.fn()}
        onRuleUpdate={vi.fn()}
        onRuleDelete={vi.fn()}
        onRuleToggle={vi.fn()}
        onRuleExecute={vi.fn()}
      />
    );

    const glassmorphismElements = container.querySelectorAll('.backdrop-blur-xl');
    expect(glassmorphismElements.length).toBeGreaterThan(0);
  });

  it('shows rule execution details', () => {
    render(
      <IntelligentAutomation
        rules={mockRules}
        triggers={mockTriggers}
        actions={mockActions}
        conditions={mockConditions}
        stats={mockStats}
        loading={false}
        error={null}
        onRuleCreate={vi.fn()}
        onRuleUpdate={vi.fn()}
        onRuleDelete={vi.fn()}
        onRuleToggle={vi.fn()}
        onRuleExecute={vi.fn()}
      />
    );

    expect(screen.getByText('150')).toBeInTheDocument(); // executionCount
    expect(screen.getByText('98.5%')).toBeInTheDocument(); // successRate
  });
});
