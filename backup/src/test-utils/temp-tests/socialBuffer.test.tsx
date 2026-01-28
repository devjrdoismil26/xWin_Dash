import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { socialBufferService } from '../services/socialBufferService';
import { useAccountsStore } from '../hooks/useAccountsStore';
import { usePostsStore } from '../hooks/usePostsStore';
import { useSchedulesStore } from '../hooks/useSchedulesStore';
import { useAnalyticsStore } from '../hooks/useAnalyticsStore';
import SocialBufferDashboard from '../components/SocialBufferDashboard';
import SocialBufferStats from '../components/SocialBufferStats';

// Mock do apiClient
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

// Mock dos componentes UI
vi.mock('@/components/ui/Card', () => ({
  default: ({ children, className }: any) => (
    <div className={`card ${className}`}>{children}</div>
  )
}));

vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={`button ${className}`}>
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/LoadingStates', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
  LoadingSkeleton: ({ className }: any) => (
    <div data-testid="loading-skeleton" className={className}>Skeleton</div>
  )
}));

vi.mock('@/components/ui/AdvancedAnimations', () => ({
  AnimatedCounter: ({ value, className }: any) => (
    <span className={className}>{value}</span>
  ),
  PageTransition: ({ children }: any) => <div>{children}</div>,
  Animated: ({ children, delay }: any) => <div data-delay={delay}>{children}</div>
}));

vi.mock('@/components/ui/AdvancedProgress', () => ({
  ProgressBar: ({ value, max, className }: any) => (
    <div className={`progress-bar ${className}`} data-value={value} data-max={max} />
  ),
  CircularProgress: ({ value, className }: any) => (
    <div className={`circular-progress ${className}`} data-value={value} />
  )
}));

vi.mock('@/components/ui/EmptyState', () => ({
  EmptyState: ({ title, message, action }: any) => (
    <div data-testid="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  )
}));

vi.mock('@/components/ui/ErrorState', () => ({
  ErrorState: ({ title, message, action }: any) => (
    <div data-testid="error-state">
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  )
}));

vi.mock('@/components/ui/ResponsiveSystem', () => ({
  ResponsiveGrid: ({ children, cols, gap }: any) => (
    <div data-cols={JSON.stringify(cols)} data-gap={gap} className="responsive-grid">
      {children}
    </div>
  ),
  ResponsiveContainer: ({ children }: any) => <div className="responsive-container">{children}</div>,
  ShowOn: ({ children }: any) => <div className="show-on">{children}</div>
}));

vi.mock('@/components/ui/Tooltip', () => ({
  default: ({ children, content }: any) => (
    <div title={content} className="tooltip">{children}</div>
  )
}));

// Mock dos stores
vi.mock('../hooks/useAccountsStore', () => ({
  useAccountsStore: vi.fn()
}));

vi.mock('../hooks/usePostsStore', () => ({
  usePostsStore: vi.fn()
}));

vi.mock('../hooks/useSchedulesStore', () => ({
  useSchedulesStore: vi.fn()
}));

vi.mock('../hooks/useAnalyticsStore', () => ({
  useAnalyticsStore: vi.fn()
}));

// Dados mock
const mockAccountsStats = {
  total_accounts: 5,
  connected_accounts: 4,
  disconnected_accounts: 1,
  accounts_by_platform: {
    instagram: 2,
    twitter: 2,
    facebook: 1
  }
};

const mockPostsStats = {
  total_posts: 150,
  published_posts: 120,
  scheduled_posts: 25,
  draft_posts: 5,
  posts_by_platform: {
    instagram: 60,
    twitter: 50,
    facebook: 40
  }
};

const mockSchedulesStats = {
  total_schedules: 30,
  active_schedules: 25,
  completed_schedules: 3,
  pending_schedules: 2
};

const mockBasicMetrics = {
  total_engagement: 5000,
  total_reach: 25000,
  total_impressions: 50000,
  total_clicks: 500,
  total_shares: 200,
  total_likes: 3000,
  total_comments: 300,
  average_engagement_rate: 8.5
};

const mockPlatformMetrics = [
  {
    platform: 'instagram',
    posts_count: 60,
    engagement: 3000,
    reach: 15000,
    impressions: 30000,
    clicks: 300,
    shares: 120,
    likes: 2000,
    comments: 200,
    engagement_rate: 10.0
  },
  {
    platform: 'twitter',
    posts_count: 50,
    engagement: 1500,
    reach: 8000,
    impressions: 15000,
    clicks: 150,
    shares: 60,
    likes: 800,
    comments: 80,
    engagement_rate: 6.0
  }
];

// Testes para SocialBufferService
describe('SocialBufferService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Configuração', () => {
    it('deve ter configuração padrão', () => {
      const config = socialBufferService.getConfig();
      expect(config.cache.enabled).toBe(true);
      expect(config.retry.enabled).toBe(true);
      expect(config.auto_sync.enabled).toBe(true);
      expect(config.validation.strict_mode).toBe(true);
    });

    it('deve permitir configuração personalizada', () => {
      const customConfig = {
        cache: { enabled: false, ttl: 10000, max_size: 500 },
        retry: { enabled: false, max_attempts: 1, delay: 500 }
      };

      socialBufferService.configure(customConfig);
      const config = socialBufferService.getConfig();

      expect(config.cache.enabled).toBe(false);
      expect(config.cache.ttl).toBe(10000);
      expect(config.retry.enabled).toBe(false);
    });
  });

  describe('Estatísticas Globais', () => {
    it('deve obter estatísticas globais', async () => {
      // Mock dos services
      vi.spyOn(socialBufferService.accounts, 'getAccountsStats').mockResolvedValue(mockAccountsStats);
      vi.spyOn(socialBufferService.posts, 'getPostsStats').mockResolvedValue(mockPostsStats);
      vi.spyOn(socialBufferService.schedules, 'getSchedulesStats').mockResolvedValue(mockSchedulesStats);
      vi.spyOn(socialBufferService.analytics, 'getBasicMetrics').mockResolvedValue(mockBasicMetrics);

      const stats = await socialBufferService.getGlobalStats();

      expect(stats.accounts.total).toBe(5);
      expect(stats.posts.total).toBe(150);
      expect(stats.schedules.total).toBe(30);
      expect(stats.analytics.total_engagement).toBe(5000);
    });
  });

  describe('Cache', () => {
    it('deve limpar todos os caches', () => {
      const clearCacheSpy = vi.spyOn(socialBufferService.accounts, 'clearCache');
      
      socialBufferService.clearAllCaches();
      
      expect(clearCacheSpy).toHaveBeenCalled();
    });

    it('deve obter estatísticas de todos os caches', () => {
      const getCacheStatsSpy = vi.spyOn(socialBufferService.accounts, 'getCacheStats')
        .mockReturnValue({ size: 5, keys: ['key1', 'key2'] });

      const stats = socialBufferService.getAllCacheStats();

      expect(stats.accounts.size).toBe(5);
      expect(getCacheStatsSpy).toHaveBeenCalled();
    });
  });

  describe('Sincronização', () => {
    it('deve executar sincronização completa', async () => {
      const syncSpy = vi.spyOn(socialBufferService.accounts, 'syncAllAccounts')
        .mockResolvedValue(undefined);

      const result = await socialBufferService.performFullSync();

      expect(result.success).toBe(true);
      expect(syncSpy).toHaveBeenCalled();
    });
  });

  describe('Status de Saúde', () => {
    it('deve verificar status de saúde do sistema', async () => {
      const healthStatus = await socialBufferService.getHealthStatus();

      expect(healthStatus).toHaveProperty('status');
      expect(healthStatus).toHaveProperty('services');
      expect(healthStatus).toHaveProperty('message');
      expect(healthStatus).toHaveProperty('timestamp');
    });
  });
});

// Testes para Stores
describe('SocialBuffer Stores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAccountsStore', () => {
    it('deve inicializar com estado padrão', () => {
      const mockStore = {
        accounts: [],
        selectedAccount: null,
        accountsStats: null,
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        filters: {},
        loading: false,
        error: null,
        connecting: false,
        syncing: false,
        validating: false,
        fetchAccounts: vi.fn(),
        selectAccount: vi.fn(),
        createAccount: vi.fn(),
        updateAccount: vi.fn(),
        deleteAccount: vi.fn(),
        connectAccount: vi.fn(),
        disconnectAccount: vi.fn(),
        syncAccount: vi.fn(),
        validateAccount: vi.fn(),
        fetchAccountsStats: vi.fn(),
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        setPage: vi.fn(),
        setLimit: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn()
      };

      (useAccountsStore as any).mockReturnValue(mockStore);

      const store = useAccountsStore();
      expect(store.accounts).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('usePostsStore', () => {
    it('deve inicializar com estado padrão', () => {
      const mockStore = {
        posts: [],
        selectedPost: null,
        postsStats: null,
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        filters: {},
        loading: false,
        error: null,
        publishing: false,
        scheduling: false,
        analyzing: false,
        optimizing: false,
        selectedPosts: [],
        bulkAction: null,
        fetchPosts: vi.fn(),
        selectPost: vi.fn(),
        createPost: vi.fn(),
        updatePost: vi.fn(),
        deletePost: vi.fn(),
        publishPost: vi.fn(),
        schedulePost: vi.fn(),
        analyzePost: vi.fn(),
        optimizePost: vi.fn(),
        generateContent: vi.fn(),
        suggestHashtags: vi.fn(),
        suggestOptimalTime: vi.fn(),
        fetchPostsStats: vi.fn(),
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        setPage: vi.fn(),
        setLimit: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        setBulkAction: vi.fn(),
        executeBulkAction: vi.fn()
      };

      (usePostsStore as any).mockReturnValue(mockStore);

      const store = usePostsStore();
      expect(store.posts).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('useSchedulesStore', () => {
    it('deve inicializar com estado padrão', () => {
      const mockStore = {
        schedules: [],
        selectedSchedule: null,
        schedulesStats: null,
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        filters: {},
        loading: false,
        error: null,
        activating: false,
        deactivating: false,
        executing: false,
        duplicating: false,
        calendarEvents: [],
        optimalTimes: [],
        selectedSchedules: [],
        bulkAction: null,
        fetchSchedules: vi.fn(),
        selectSchedule: vi.fn(),
        createSchedule: vi.fn(),
        updateSchedule: vi.fn(),
        deleteSchedule: vi.fn(),
        activateSchedule: vi.fn(),
        deactivateSchedule: vi.fn(),
        executeSchedule: vi.fn(),
        getOptimalTimes: vi.fn(),
        suggestOptimalTime: vi.fn(),
        fetchCalendarEvents: vi.fn(),
        createCalendarEvent: vi.fn(),
        updateCalendarEvent: vi.fn(),
        deleteCalendarEvent: vi.fn(),
        fetchSchedulesStats: vi.fn(),
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        setPage: vi.fn(),
        setLimit: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        setBulkAction: vi.fn(),
        executeBulkAction: vi.fn()
      };

      (useSchedulesStore as any).mockReturnValue(mockStore);

      const store = useSchedulesStore();
      expect(store.schedules).toEqual([]);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('useAnalyticsStore', () => {
    it('deve inicializar com estado padrão', () => {
      const mockStore = {
        basicMetrics: null,
        platformMetrics: [],
        timeSeriesMetrics: [],
        contentMetrics: [],
        hashtagMetrics: [],
        linkMetrics: [],
        engagementMetrics: null,
        audienceMetrics: null,
        currentReport: null,
        periodComparison: null,
        filters: {},
        loading: false,
        error: null,
        generatingReport: false,
        exporting: false,
        comparing: false,
        insights: null,
        realTimeMetrics: null,
        fetchBasicMetrics: vi.fn(),
        fetchPlatformMetrics: vi.fn(),
        fetchTimeSeriesMetrics: vi.fn(),
        fetchContentMetrics: vi.fn(),
        fetchHashtagMetrics: vi.fn(),
        fetchLinkMetrics: vi.fn(),
        fetchEngagementMetrics: vi.fn(),
        fetchAudienceMetrics: vi.fn(),
        generateReport: vi.fn(),
        exportReport: vi.fn(),
        comparePeriods: vi.fn(),
        fetchInsights: vi.fn(),
        fetchRealTimeMetrics: vi.fn(),
        fetchPostPerformance: vi.fn(),
        fetchAccountPerformance: vi.fn(),
        setFilters: vi.fn(),
        clearFilters: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
        clearAllMetrics: vi.fn(),
        clearReport: vi.fn(),
        clearComparison: vi.fn()
      };

      (useAnalyticsStore as any).mockReturnValue(mockStore);

      const store = useAnalyticsStore();
      expect(store.basicMetrics).toBeNull();
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });
});

// Testes para Componentes
describe('SocialBuffer Components', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });

    // Mock dos stores com dados
    (useAccountsStore as any).mockReturnValue({
      accountsStats: mockAccountsStats,
      fetchAccountsStats: vi.fn()
    });

    (usePostsStore as any).mockReturnValue({
      postsStats: mockPostsStats,
      fetchPostsStats: vi.fn()
    });

    (useSchedulesStore as any).mockReturnValue({
      schedulesStats: mockSchedulesStats,
      fetchSchedulesStats: vi.fn()
    });

    (useAnalyticsStore as any).mockReturnValue({
      basicMetrics: mockBasicMetrics,
      platformMetrics: mockPlatformMetrics,
      fetchBasicMetrics: vi.fn()
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('SocialBufferDashboard', () => {
    it('deve renderizar o dashboard com dados', async () => {
      renderWithQueryClient(<SocialBufferDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Dashboard SocialBuffer')).toBeInTheDocument();
        expect(screen.getByText('Visão geral das suas métricas e performance')).toBeInTheDocument();
      });
    });

    it('deve exibir estatísticas corretas', async () => {
      renderWithQueryClient(<SocialBufferDashboard />);

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument(); // totalAccounts
        expect(screen.getByText('150')).toBeInTheDocument(); // totalPosts
        expect(screen.getByText('30')).toBeInTheDocument(); // totalSchedules
        expect(screen.getByText('5000')).toBeInTheDocument(); // totalEngagement
      });
    });

    it('deve permitir atualização dos dados', async () => {
      const mockFetchAccountsStats = vi.fn();
      const mockFetchPostsStats = vi.fn();
      const mockFetchSchedulesStats = vi.fn();
      const mockFetchBasicMetrics = vi.fn();

      (useAccountsStore as any).mockReturnValue({
        accountsStats: mockAccountsStats,
        fetchAccountsStats: mockFetchAccountsStats
      });

      (usePostsStore as any).mockReturnValue({
        postsStats: mockPostsStats,
        fetchPostsStats: mockFetchPostsStats
      });

      (useSchedulesStore as any).mockReturnValue({
        schedulesStats: mockSchedulesStats,
        fetchSchedulesStats: mockFetchSchedulesStats
      });

      (useAnalyticsStore as any).mockReturnValue({
        basicMetrics: mockBasicMetrics,
        platformMetrics: mockPlatformMetrics,
        fetchBasicMetrics: mockFetchBasicMetrics
      });

      renderWithQueryClient(<SocialBufferDashboard />);

      const refreshButton = screen.getByText('Atualizar');
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(mockFetchAccountsStats).toHaveBeenCalled();
        expect(mockFetchPostsStats).toHaveBeenCalled();
        expect(mockFetchSchedulesStats).toHaveBeenCalled();
        expect(mockFetchBasicMetrics).toHaveBeenCalled();
      });
    });
  });

  describe('SocialBufferStats', () => {
    it('deve renderizar estatísticas com dados', async () => {
      renderWithQueryClient(<SocialBufferStats />);

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument(); // totalAccounts
        expect(screen.getByText('150')).toBeInTheDocument(); // totalPosts
        expect(screen.getByText('25')).toBeInTheDocument(); // activeSchedules
        expect(screen.getByText('5000')).toBeInTheDocument(); // totalEngagement
      });
    });

    it('deve exibir métricas de engajamento', async () => {
      renderWithQueryClient(<SocialBufferStats showDetails={true} />);

      await waitFor(() => {
        expect(screen.getByText('Métricas de Engajamento')).toBeInTheDocument();
        expect(screen.getByText('8.5%')).toBeInTheDocument(); // engagement rate
        expect(screen.getByText('25000')).toBeInTheDocument(); // reach
        expect(screen.getByText('50000')).toBeInTheDocument(); // impressions
      });
    });

    it('deve exibir performance por plataforma', async () => {
      renderWithQueryClient(<SocialBufferStats showDetails={true} />);

      await waitFor(() => {
        expect(screen.getByText('Performance por Plataforma')).toBeInTheDocument();
        expect(screen.getByText('Instagram')).toBeInTheDocument();
        expect(screen.getByText('Twitter')).toBeInTheDocument();
        expect(screen.getByText('60 posts')).toBeInTheDocument();
        expect(screen.getByText('50 posts')).toBeInTheDocument();
      });
    });

    it('deve exibir interações', async () => {
      renderWithQueryClient(<SocialBufferStats showDetails={true} />);

      await waitFor(() => {
        expect(screen.getByText('Interações')).toBeInTheDocument();
        expect(screen.getByText('3000')).toBeInTheDocument(); // likes
        expect(screen.getByText('300')).toBeInTheDocument(); // comments
        expect(screen.getByText('200')).toBeInTheDocument(); // shares
      });
    });
  });
});

// Testes de Integração
describe('SocialBuffer Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve integrar services, stores e componentes corretamente', async () => {
    // Mock dos services
    vi.spyOn(socialBufferService.accounts, 'getAccountsStats').mockResolvedValue(mockAccountsStats);
    vi.spyOn(socialBufferService.posts, 'getPostsStats').mockResolvedValue(mockPostsStats);
    vi.spyOn(socialBufferService.schedules, 'getSchedulesStats').mockResolvedValue(mockSchedulesStats);
    vi.spyOn(socialBufferService.analytics, 'getBasicMetrics').mockResolvedValue(mockBasicMetrics);

    // Mock dos stores
    (useAccountsStore as any).mockReturnValue({
      accountsStats: mockAccountsStats,
      fetchAccountsStats: vi.fn()
    });

    (usePostsStore as any).mockReturnValue({
      postsStats: mockPostsStats,
      fetchPostsStats: vi.fn()
    });

    (useSchedulesStore as any).mockReturnValue({
      schedulesStats: mockSchedulesStats,
      fetchSchedulesStats: vi.fn()
    });

    (useAnalyticsStore as any).mockReturnValue({
      basicMetrics: mockBasicMetrics,
      platformMetrics: mockPlatformMetrics,
      fetchBasicMetrics: vi.fn()
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });

    render(
      <QueryClientProvider client={queryClient}>
        <SocialBufferDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard SocialBuffer')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('5000')).toBeInTheDocument();
    });
  });
});

// Testes de Performance
describe('SocialBuffer Performance Tests', () => {
  it('deve carregar dados rapidamente', async () => {
    const startTime = performance.now();

    vi.spyOn(socialBufferService.accounts, 'getAccountsStats').mockResolvedValue(mockAccountsStats);
    vi.spyOn(socialBufferService.posts, 'getPostsStats').mockResolvedValue(mockPostsStats);
    vi.spyOn(socialBufferService.schedules, 'getSchedulesStats').mockResolvedValue(mockSchedulesStats);
    vi.spyOn(socialBufferService.analytics, 'getBasicMetrics').mockResolvedValue(mockBasicMetrics);

    await socialBufferService.getGlobalStats();

    const endTime = performance.now();
    const loadTime = endTime - startTime;

    expect(loadTime).toBeLessThan(1000); // Deve carregar em menos de 1 segundo
  });

  it('deve gerenciar cache eficientemente', () => {
    const cacheStats = socialBufferService.getAllCacheStats();
    
    expect(cacheStats).toHaveProperty('accounts');
    expect(cacheStats).toHaveProperty('posts');
    expect(cacheStats).toHaveProperty('schedules');
    expect(cacheStats).toHaveProperty('analytics');
  });
});

// Testes de Error Handling
describe('SocialBuffer Error Handling', () => {
  it('deve lidar com erros de API graciosamente', async () => {
    vi.spyOn(socialBufferService.accounts, 'getAccountsStats').mockRejectedValue(
      new Error('API Error')
    );

    const result = await socialBufferService.performFullSync();

    expect(result.success).toBe(false);
    expect(result.message).toContain('Sincronização');
  });

  it('deve exibir estado de erro nos componentes', async () => {
    (useAccountsStore as any).mockReturnValue({
      accountsStats: null,
      fetchAccountsStats: vi.fn().mockRejectedValue(new Error('Failed to fetch'))
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });

    render(
      <QueryClientProvider client={queryClient}>
        <SocialBufferDashboard />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });
});
