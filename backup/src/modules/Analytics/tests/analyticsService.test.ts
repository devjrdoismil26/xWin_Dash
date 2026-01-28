// ========================================
// TESTES DE INTEGRAÇÃO - ANALYTICS SERVICE
// ========================================
import { analyticsService } from '../services/analyticsService';
import { apiClient } from '@/services';

// Mock do apiClient
jest.mock('@/services', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Analytics Service Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('test-project-id');
  });

  describe('getDashboard', () => {
    it('should fetch dashboard data successfully', async () => {
      const mockData = {
        metrics: [
          { type: 'page_views', value: 1500, change: 12.5 },
          { type: 'unique_visitors', value: 800, change: -5.2 },
        ],
        charts: [
          { id: '1', type: 'line', title: 'Page Views Over Time', data: [] },
        ],
        insights: [
          { id: '1', type: 'trend', title: 'Traffic Increase', description: 'Page views increased by 12.5%' },
        ],
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await analyticsService.getDashboard();

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/dashboard', {
        headers: { 'X-Project-ID': 'test-project-id' },
      });
      expect(result).toEqual(mockData);
    });

    it('should handle API errors', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(analyticsService.getDashboard()).rejects.toThrow('API Error');
    });
  });

  describe('getReports', () => {
    it('should fetch reports list', async () => {
      const mockReports = [
        { id: '1', name: 'Monthly Report', type: 'custom', created_at: '2024-01-01' },
        { id: '2', name: 'Weekly Summary', type: 'standard', created_at: '2024-01-02' },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockReports });

      const result = await analyticsService.getReports();

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/reports', {
        headers: { 'X-Project-ID': 'test-project-id' },
      });
      expect(result).toEqual(mockReports);
    });
  });

  describe('createReport', () => {
    it('should create new report', async () => {
      const reportData = {
        name: 'Test Report',
        type: 'custom',
        metrics: ['page_views', 'unique_visitors'],
        period: '30d',
      };

      const mockResponse = { id: '1', ...reportData };

      (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      const result = await analyticsService.createReport(reportData);

      expect(apiClient.post).toHaveBeenCalledWith('/analytics/reports', reportData, {
        headers: { 'X-Project-ID': 'test-project-id' },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getMetrics', () => {
    it('should fetch metrics data', async () => {
      const mockMetrics = [
        { type: 'page_views', value: 1500, previous_value: 1200, change: 25 },
        { type: 'bounce_rate', value: 45.2, previous_value: 48.1, change: -6 },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockMetrics });

      const result = await analyticsService.getMetrics();

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/metrics', {
        headers: { 'X-Project-ID': 'test-project-id' },
      });
      expect(result).toEqual(mockMetrics);
    });
  });

  describe('getInsights', () => {
    it('should fetch AI insights', async () => {
      const mockInsights = [
        {
          id: '1',
          type: 'trend',
          title: 'Traffic Growth',
          description: 'Page views increased significantly',
          impact: 'high',
          confidence: 0.95,
          recommendations: ['Continue current marketing strategy'],
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockInsights });

      const result = await analyticsService.getInsights();

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/insights', {
        headers: { 'X-Project-ID': 'test-project-id' },
      });
      expect(result).toEqual(mockInsights);
    });
  });

  describe('exportReport', () => {
    it('should export report data', async () => {
      const mockBlob = new Blob(['test data'], { type: 'application/json' });
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockBlob });

      const result = await analyticsService.exportReport('1', 'json');

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/reports/1/export', {
        params: { format: 'json' },
        headers: { 'X-Project-ID': 'test-project-id' },
        responseType: 'blob',
      });
      expect(result).toBe(mockBlob);
    });
  });

  describe('getGoogleAnalytics', () => {
    it('should fetch Google Analytics data', async () => {
      const mockData = {
        connected: true,
        data: {
          page_views: 1500,
          sessions: 800,
          users: 600,
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await analyticsService.getGoogleAnalytics();

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/google-analytics', {
        headers: { 'X-Project-ID': 'test-project-id' },
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('validation methods', () => {
    it('should validate report data', () => {
      const validData = {
        name: 'Test Report',
        type: 'custom',
        metrics: ['page_views'],
        period: '30d',
      };

      const result = analyticsService.validateReportData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid report data', () => {
      const invalidData = {
        name: '',
        type: 'invalid',
        metrics: [],
        period: 'invalid',
      };

      const result = analyticsService.validateReportData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('formatting methods', () => {
    it('should format numbers correctly', () => {
      expect(analyticsService.formatNumber(1234)).toBe('1,234');
      expect(analyticsService.formatNumber(1234567)).toBe('1.23M');
      expect(analyticsService.formatNumber(0.1234)).toBe('0.12');
    });

    it('should format percentages correctly', () => {
      expect(analyticsService.formatPercentage(0.1234)).toBe('12.34%');
      expect(analyticsService.formatPercentage(1.5)).toBe('150%');
      expect(analyticsService.formatPercentage(-0.05)).toBe('-5%');
    });

    it('should format currency correctly', () => {
      expect(analyticsService.formatCurrency(1234.56)).toBe('$1,234.56');
      expect(analyticsService.formatCurrency(0)).toBe('$0.00');
    });
  });
});