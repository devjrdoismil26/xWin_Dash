import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailMarketingModule } from '@/modules/EmailMarketing';
import { emailMarketingService } from '@/modules/EmailMarketing/services/emailMarketingService';

// Mock the email marketing service
vi.mock('@/modules/EmailMarketing/services/emailMarketingService', () => ({
  emailMarketingService: {
    getCampaigns: vi.fn(),
    createCampaign: vi.fn(),
    updateCampaign: vi.fn(),
    deleteCampaign: vi.fn(),
    getCampaignStats: vi.fn(),
    getSubscribers: vi.fn(),
    addSubscriber: vi.fn(),
  },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Lucide React
vi.mock('lucide-react', () => ({
  Mail: () => <div data-testid="mail" />,
  Plus: () => <div data-testid="plus" />,
  Edit: () => <div data-testid="edit" />,
  Trash2: () => <div data-testid="trash" />,
  Send: () => <div data-testid="send" />,
  Users: () => <div data-testid="users" />,
  BarChart3: () => <div data-testid="bar-chart" />,
  TrendingUp: () => <div data-testid="trending-up" />,
  Settings: () => <div data-testid="settings" />,
}));

describe('Email Marketing Integration Tests', () => {
  let queryClient: QueryClient;

  const mockCampaigns = [
    {
      id: '1',
      name: 'Welcome Campaign',
      subject: 'Welcome to our platform',
      status: 'active',
      recipients: 1000,
      openRate: 25.5,
      clickRate: 5.2,
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Newsletter',
      subject: 'Monthly Newsletter',
      status: 'draft',
      recipients: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: '2024-01-10T10:00:00Z',
    },
  ];

  const mockStats = {
    total_campaigns: 2,
    active_campaigns: 1,
    total_recipients: 1000,
    avg_open_rate: 25.5,
    avg_click_rate: 5.2,
    total_sent: 1000,
    total_delivered: 980,
    total_bounced: 20,
  };

  const mockSubscribers = [
    {
      id: '1',
      email: 'user@example.com',
      status: 'active',
      subscribedAt: '2024-01-15T10:00:00Z',
      tags: ['newsletter', 'promotions'],
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    vi.clearAllMocks();

    // Setup default mocks
    emailMarketingService.getCampaigns.mockResolvedValue(mockCampaigns);
    emailMarketingService.getCampaignStats.mockResolvedValue(mockStats);
    emailMarketingService.getSubscribers.mockResolvedValue(mockSubscribers);
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('should render email marketing module with all components', async () => {
    renderWithQueryClient(<EmailMarketingModule />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Welcome Campaign')).toBeInTheDocument();
    });

    // Check if all main sections are rendered
    expect(screen.getByText('Email Marketing')).toBeInTheDocument();
    expect(screen.getByText('Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Subscribers')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('should display campaign statistics correctly', async () => {
    renderWithQueryClient(<EmailMarketingModule />);

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // total campaigns
    });

    expect(screen.getByText('1')).toBeInTheDocument(); // active campaigns
    expect(screen.getByText('1,000')).toBeInTheDocument(); // total recipients
    expect(screen.getByText('25.5%')).toBeInTheDocument(); // avg open rate
    expect(screen.getByText('5.2%')).toBeInTheDocument(); // avg click rate
  });

  it('should create a new campaign successfully', async () => {
    const newCampaign = {
      id: '3',
      name: 'New Campaign',
      subject: 'Test Subject',
      status: 'draft',
      recipients: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: '2024-01-16T10:00:00Z',
    };

    emailMarketingService.createCampaign.mockResolvedValue(newCampaign);

    renderWithQueryClient(<EmailMarketingModule />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Welcome Campaign')).toBeInTheDocument();
    });

    // Click create campaign button
    const createButton = screen.getByRole('button', { name: /create campaign/i });
    fireEvent.click(createButton);

    // Fill in campaign form
    const nameInput = screen.getByLabelText(/campaign name/i);
    const subjectInput = screen.getByLabelText(/subject/i);

    fireEvent.change(nameInput, { target: { value: 'New Campaign' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    // Wait for campaign to be created
    await waitFor(() => {
      expect(emailMarketingService.createCampaign).toHaveBeenCalledWith({
        name: 'New Campaign',
        subject: 'Test Subject',
      });
    });
  });

  it('should update campaign status successfully', async () => {
    const updatedCampaign = {
      ...mockCampaigns[1],
      status: 'active',
    };

    emailMarketingService.updateCampaign.mockResolvedValue(updatedCampaign);

    renderWithQueryClient(<EmailMarketingModule />);

    await waitFor(() => {
      expect(screen.getByText('Newsletter')).toBeInTheDocument();
    });

    // Find and click the status toggle for the draft campaign
    const statusToggle = screen.getByText('Draft');
    fireEvent.click(statusToggle);

    await waitFor(() => {
      expect(emailMarketingService.updateCampaign).toHaveBeenCalledWith('2', {
        status: 'active',
      });
    });
  });

  it('should delete campaign successfully', async () => {
    emailMarketingService.deleteCampaign.mockResolvedValue(undefined);

    renderWithQueryClient(<EmailMarketingModule />);

    await waitFor(() => {
      expect(screen.getByText('Welcome Campaign')).toBeInTheDocument();
    });

    // Find and click delete button for first campaign
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(emailMarketingService.deleteCampaign).toHaveBeenCalledWith('1');
    });
  });

  it('should add new subscriber successfully', async () => {
    const newSubscriber = {
      id: '2',
      email: 'newuser@example.com',
      status: 'active',
      subscribedAt: '2024-01-16T10:00:00Z',
      tags: ['newsletter'],
    };

    emailMarketingService.addSubscriber.mockResolvedValue(newSubscriber);

    renderWithQueryClient(<EmailMarketingModule />);

    await waitFor(() => {
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });

    // Click add subscriber button
    const addButton = screen.getByRole('button', { name: /add subscriber/i });
    fireEvent.click(addButton);

    // Fill in subscriber form
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailMarketingService.addSubscriber).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        tags: [],
      });
    });
  });

  it('should handle API errors gracefully', async () => {
    emailMarketingService.getCampaigns.mockRejectedValue(new Error('API Error'));

    renderWithQueryClient(<EmailMarketingModule />);

    // Check if error state is displayed
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    // Check if retry button is available
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should display loading states correctly', async () => {
    // Mock slow API response
    emailMarketingService.getCampaigns.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockCampaigns), 1000))
    );

    renderWithQueryClient(<EmailMarketingModule />);

    // Check if loading state is displayed
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Welcome Campaign')).toBeInTheDocument();
    });
  });

  it('should filter campaigns by status', async () => {
    renderWithQueryClient(<EmailMarketingModule />);

    await waitFor(() => {
      expect(screen.getByText('Welcome Campaign')).toBeInTheDocument();
    });

    // Click on active filter
    const activeFilter = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeFilter);

    // Check if only active campaigns are shown
    expect(screen.getByText('Welcome Campaign')).toBeInTheDocument();
    expect(screen.queryByText('Newsletter')).not.toBeInTheDocument();
  });

  it('should search campaigns by name', async () => {
    renderWithQueryClient(<EmailMarketingModule />);

    await waitFor(() => {
      expect(screen.getByText('Welcome Campaign')).toBeInTheDocument();
    });

    // Type in search box
    const searchInput = screen.getByPlaceholderText(/search campaigns/i);
    fireEvent.change(searchInput, { target: { value: 'Welcome' } });

    // Check if only matching campaigns are shown
    expect(screen.getByText('Welcome Campaign')).toBeInTheDocument();
    expect(screen.queryByText('Newsletter')).not.toBeInTheDocument();
  });

  it('should display glassmorphism effects', () => {
    renderWithQueryClient(<EmailMarketingModule />);

    // Check if glassmorphism classes are applied
    const glassmorphismElements = document.querySelectorAll('.backdrop-blur-xl');
    expect(glassmorphismElements.length).toBeGreaterThan(0);
  });

  it('should handle real-time updates', async () => {
    renderWithQueryClient(<EmailMarketingModule />);

    await waitFor(() => {
      expect(screen.getByText('Welcome Campaign')).toBeInTheDocument();
    });

    // Simulate real-time update
    const updatedCampaigns = [
      ...mockCampaigns,
      {
        id: '3',
        name: 'Real-time Campaign',
        subject: 'Real-time Subject',
        status: 'active',
        recipients: 500,
        openRate: 30.0,
        clickRate: 6.0,
        createdAt: '2024-01-16T10:00:00Z',
      },
    ];

    // Update the mock to return new data
    emailMarketingService.getCampaigns.mockResolvedValue(updatedCampaigns);

    // Trigger a refresh
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    // Wait for new campaign to appear
    await waitFor(() => {
      expect(screen.getByText('Real-time Campaign')).toBeInTheDocument();
    });
  });
});
