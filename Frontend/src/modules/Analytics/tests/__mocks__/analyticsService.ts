/**
 * Mock do analyticsService para testes
 */

export const mockAnalyticsService = {
  // Dashboard
  getDashboardData: jest.fn().mockResolvedValue({
    id: '1',
    metrics: [
      {
        id: '1',
        name: 'Page Views',
        type: 'page_views',
        value: 1000,
        previous_value: 800,
        change_percentage: 25,
        trend: 'up',
        unit: 'number',
        timestamp: '2023-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Unique Visitors',
        type: 'unique_visitors',
        value: 500,
        previous_value: 450,
        change_percentage: 11.1,
        trend: 'up',
        unit: 'number',
        timestamp: '2023-01-01T00:00:00Z'
      }
    ],
    charts: [
      {
        id: '1',
        type: 'line',
        title: 'Page Views Over Time',
        data: [
          { date: '2023-01-01', value: 1000 },
          { date: '2023-01-02', value: 1200 },
          { date: '2023-01-03', value: 1100 }
        ],
        period: '30days',
        created_at: '2023-01-01T00:00:00Z'
      }
    ],
    insights: [
      {
        id: '1',
        type: 'trend',
        title: 'Crescimento Positivo',
        description: 'As visualizações de página aumentaram 25% este mês',
        impact: 'high',
        confidence: 0.9,
        data: { metric: 'page_views', change: 25 },
        created_at: '2023-01-01T00:00:00Z'
      }
    ],
    last_updated: '2023-01-01T00:00:00Z',
    period: '30days'
  }),

  refreshDashboard: jest.fn().mockResolvedValue({
    id: '1',
    metrics: [],
    charts: [],
    insights: [],
    last_updated: '2023-01-01T00:00:00Z',
    period: '30days'
  }),

  // Reports
  getReports: jest.fn().mockResolvedValue([
    {
      id: '1',
      name: 'Relatório Mensal',
      type: 'overview',
      description: 'Relatório mensal de analytics',
      filters: {
        date_range: '30days',
        report_type: 'overview'
      },
      data: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      created_by: 'user1',
      is_public: false
    }
  ]),

  createReport: jest.fn().mockResolvedValue({
    id: '2',
    name: 'Novo Relatório',
    type: 'overview',
    description: 'Relatório criado via teste',
    filters: {
      date_range: '30days',
      report_type: 'overview'
    },
    data: null,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    created_by: 'current_user',
    is_public: false
  }),

  updateReport: jest.fn().mockResolvedValue({
    id: '1',
    name: 'Relatório Atualizado',
    type: 'overview',
    description: 'Relatório atualizado via teste',
    filters: {
      date_range: '30days',
      report_type: 'overview'
    },
    data: null,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    created_by: 'user1',
    is_public: false
  }),

  deleteReport: jest.fn().mockResolvedValue(undefined),

  exportReport: jest.fn().mockResolvedValue(new Blob(['test data'], { type: 'text/csv' })),

  // Metrics
  getMetrics: jest.fn().mockResolvedValue([
    {
      id: '1',
      name: 'Page Views',
      type: 'page_views',
      value: 1000,
      trend: 'up',
      unit: 'number',
      timestamp: '2023-01-01T00:00:00Z'
    }
  ]),

  getMetricHistory: jest.fn().mockResolvedValue([
    {
      id: '1',
      name: 'Page Views',
      type: 'page_views',
      value: 1000,
      trend: 'up',
      unit: 'number',
      timestamp: '2023-01-01T00:00:00Z'
    }
  ]),

  // Insights
  getInsights: jest.fn().mockResolvedValue([
    {
      id: '1',
      type: 'trend',
      title: 'Crescimento Positivo',
      description: 'As visualizações de página aumentaram 25% este mês',
      impact: 'high',
      confidence: 0.9,
      data: { metric: 'page_views', change: 25 },
      created_at: '2023-01-01T00:00:00Z'
    }
  ]),

  generateInsights: jest.fn().mockResolvedValue([
    {
      id: '1',
      type: 'trend',
      title: 'Crescimento Positivo',
      description: 'As visualizações de página aumentaram 25% este mês',
      impact: 'high',
      confidence: 0.9,
      data: { metric: 'page_views', change: 25 },
      created_at: '2023-01-01T00:00:00Z'
    }
  ]),

  // Real-time
  getRealTimeData: jest.fn().mockResolvedValue({
    active_users: 150,
    page_views: 500,
    top_pages: [
      { page: '/', views: 100 },
      { page: '/products', views: 50 }
    ],
    top_sources: [
      { source: 'google', users: 75 },
      { source: 'direct', users: 50 }
    ],
    top_devices: [
      { device: 'desktop', users: 100 },
      { device: 'mobile', users: 50 }
    ],
    last_updated: '2023-01-01T00:00:00Z'
  }),

  subscribeToRealTime: jest.fn(),
  unsubscribeFromRealTime: jest.fn(),

  // Module Stats
  getModuleStats: jest.fn().mockResolvedValue({
    total_reports: 10,
    total_metrics: 50,
    total_insights: 5,
    active_reports: 8,
    last_report_date: '2023-01-01T00:00:00Z',
    most_used_metrics: ['page_views', 'unique_visitors'],
    performance_score: 85
  }),

  // Integrations
  getIntegrations: jest.fn().mockResolvedValue([
    {
      id: '1',
      name: 'Google Analytics',
      type: 'google_analytics',
      status: 'active',
      config: { property_id: 'UA-123456789-1' },
      last_sync: '2023-01-01T00:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ]),

  createIntegration: jest.fn().mockResolvedValue({
    id: '2',
    name: 'Facebook Analytics',
    type: 'facebook_analytics',
    status: 'active',
    config: { app_id: '123456789' },
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }),

  updateIntegration: jest.fn().mockResolvedValue({
    id: '1',
    name: 'Google Analytics Updated',
    type: 'google_analytics',
    status: 'active',
    config: { property_id: 'UA-123456789-1' },
    last_sync: '2023-01-01T00:00:00Z',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }),

  deleteIntegration: jest.fn().mockResolvedValue(undefined),

  testIntegration: jest.fn().mockResolvedValue(true),

  // Google Analytics
  getGoogleAnalyticsData: jest.fn().mockResolvedValue({
    property_id: 'UA-123456789-1',
    view_id: '123456789',
    metrics: [
      {
        id: '1',
        name: 'Page Views',
        type: 'page_views',
        value: 1000,
        trend: 'up',
        unit: 'number',
        timestamp: '2023-01-01T00:00:00Z'
      }
    ],
    dimensions: [
      {
        name: 'device',
        values: ['desktop', 'mobile', 'tablet']
      }
    ],
    last_updated: '2023-01-01T00:00:00Z'
  }),

  syncGoogleAnalytics: jest.fn().mockResolvedValue(undefined),

  // Cache
  clearCache: jest.fn().mockResolvedValue(undefined),

  getCacheStatus: jest.fn().mockResolvedValue({
    dashboard: { hits: 100, misses: 10, ttl: 3600 },
    reports: { hits: 50, misses: 5, ttl: 1800 },
    metrics: { hits: 200, misses: 20, ttl: 7200 } )};

export default mockAnalyticsService;
