// ========================================
// TESTES DE INTEGRAÇÃO - ACTIVITY SERVICE
// ========================================
import { activityService } from '../services/activityService';
import { ActivityFilters, ActivityLog } from '../types';

// Mock dos serviços especializados
jest.mock('../services/activityApiService', () => ({
  getLogs: jest.fn(),
  getLogById: jest.fn(),
  getLogStats: jest.fn(),
  getActivityStats: jest.fn(),
  getUserActivityStats: jest.fn(),
  getSystemHealthStats: jest.fn(),
  getRealTimeLogs: jest.fn(),
  getLogsByType: jest.fn(),
  getLogsByUser: jest.fn(),
  getLogsByDateRange: jest.fn(),
  searchLogs: jest.fn(),
  exportLogs: jest.fn(),
  clearOldLogs: jest.fn(),
  bulkDeleteLogs: jest.fn(),
  getAvailableFilters: jest.fn(),
  subscribeToRealTimeUpdates: jest.fn(),
}));

jest.mock('../services/activityCacheService', () => ({
  getCachedLogs: jest.fn(),
  cacheLogs: jest.fn(),
  getCachedLog: jest.fn(),
  cacheLog: jest.fn(),
  getCachedStats: jest.fn(),
  cacheStats: jest.fn(),
  invalidateLogsCache: jest.fn(),
  clear: jest.fn(),
  getCacheInfo: jest.fn(),
}));

jest.mock('../services/activityValidationService', () => ({
  sanitizeFilters: jest.fn((filters) => filters),
  validateFilters: jest.fn(() => ({ isValid: true, errors: [] })),
  validateLogId: jest.fn(() => true),
  validateUserId: jest.fn(() => true),
  validateLogType: jest.fn(() => true),
  validateDateRange: jest.fn(() => ({ isValid: true })),
  validateSearchQuery: jest.fn(() => ({ isValid: true })),
  validateExportFormat: jest.fn(() => true),
  validateCleanupPeriod: jest.fn(() => ({ isValid: true })),
  validateIds: jest.fn(() => ({ isValid: true, errors: [] })),
}));

describe('Activity Service Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLogs', () => {
    it('should fetch logs successfully with cache', async () => {
      const mockLogs = [
        {
          id: '1',
          log_name: 'user.login',
          description: 'User logged in',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockFilters: ActivityFilters = { search: 'login' };

      // Mock cache miss
      require('../services/activityCacheService').getCachedLogs.mockReturnValue(null);
      
      // Mock API response
      require('../services/activityApiService').getLogs.mockResolvedValue({
        success: true,
        data: mockLogs,
      });

      const result = await activityService.getLogs(mockFilters);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLogs);
      expect(require('../services/activityCacheService').cacheLogs).toHaveBeenCalledWith(
        mockFilters,
        mockLogs
      );
    });

    it('should return cached logs when available', async () => {
      const mockLogs = [
        {
          id: '1',
          log_name: 'user.login',
          description: 'User logged in',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockFilters: ActivityFilters = { search: 'login' };

      // Mock cache hit
      require('../services/activityCacheService').getCachedLogs.mockReturnValue(mockLogs);

      const result = await activityService.getLogs(mockFilters);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLogs);
      expect(require('../services/activityApiService').getLogs).not.toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const mockFilters: ActivityFilters = { search: 'login' };

      // Mock validation failure
      require('../services/activityValidationService').validateFilters.mockReturnValue({
        isValid: false,
        errors: ['Invalid filter format'],
      });

      const result = await activityService.getLogs(mockFilters);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Filtros inválidos');
    });
  });

  describe('getLogById', () => {
    it('should fetch log by ID successfully', async () => {
      const mockLog = {
        id: '1',
        log_name: 'user.login',
        description: 'User logged in',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      // Mock cache miss
      require('../services/activityCacheService').getCachedLog.mockReturnValue(null);
      
      // Mock API response
      require('../services/activityApiService').getLogById.mockResolvedValue({
        success: true,
        data: mockLog,
      });

      const result = await activityService.getLogById('1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLog);
    });

    it('should handle invalid log ID', async () => {
      // Mock validation failure
      require('../services/activityValidationService').validateLogId.mockReturnValue(false);

      const result = await activityService.getLogById('invalid');

      expect(result.success).toBe(false);
      expect(result.error).toBe('ID do log é inválido');
    });
  });

  describe('getLogStats', () => {
    it('should fetch stats successfully', async () => {
      const mockStats = {
        total_logs: 100,
        today_logs: 10,
        active_users: 5,
        error_logs: 2,
        security_logs: 1,
        api_calls: 50,
      };

      const mockFilters: ActivityFilters = {};

      // Mock cache miss
      require('../services/activityCacheService').getCachedStats.mockReturnValue(null);
      
      // Mock API response
      require('../services/activityApiService').getLogStats.mockResolvedValue({
        success: true,
        data: mockStats,
      });

      const result = await activityService.getLogStats(mockFilters);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStats);
    });
  });

  describe('exportLogs', () => {
    it('should export logs successfully', async () => {
      const mockFilters: ActivityFilters = { search: 'login' };
      const mockExportData = 'csv,data,here';

      // Mock API response
      require('../services/activityApiService').exportLogs.mockResolvedValue({
        success: true,
        data: mockExportData,
      });

      const result = await activityService.exportLogs(mockFilters, 'csv');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockExportData);
    });

    it('should handle invalid export format', async () => {
      const mockFilters: ActivityFilters = {};

      // Mock validation failure
      require('../services/activityValidationService').validateExportFormat.mockReturnValue(false);

      const result = await activityService.exportLogs(mockFilters, 'invalid');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Formato de exportação inválido');
    });
  });

  describe('clearOldLogs', () => {
    it('should clear old logs successfully', async () => {
      // Mock API response
      require('../services/activityApiService').clearOldLogs.mockResolvedValue({
        success: true,
        data: { deleted: 50 },
      });

      const result = await activityService.clearOldLogs(30);

      expect(result.success).toBe(true);
      expect(require('../services/activityCacheService').invalidateLogsCache).toHaveBeenCalled();
    });

    it('should handle invalid cleanup period', async () => {
      // Mock validation failure
      require('../services/activityValidationService').validateCleanupPeriod.mockReturnValue({
        isValid: false,
        error: 'Invalid period',
      });

      const result = await activityService.clearOldLogs(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid period');
    });
  });

  describe('searchLogs', () => {
    it('should search logs successfully', async () => {
      const mockLogs = [
        {
          id: '1',
          log_name: 'user.login',
          description: 'User logged in',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockFilters: ActivityFilters = {};

      // Mock API response
      require('../services/activityApiService').searchLogs.mockResolvedValue({
        success: true,
        data: mockLogs,
      });

      const result = await activityService.searchLogs('login', mockFilters);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLogs);
    });

    it('should handle invalid search query', async () => {
      const mockFilters: ActivityFilters = {};

      // Mock validation failure
      require('../services/activityValidationService').validateSearchQuery.mockReturnValue({
        isValid: false,
        error: 'Query too short',
      });

      const result = await activityService.searchLogs('a', mockFilters);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Query too short');
    });
  });

  describe('bulkDeleteLogs', () => {
    it('should bulk delete logs successfully', async () => {
      const ids = ['1', '2', '3'];

      // Mock API response
      require('../services/activityApiService').bulkDeleteLogs.mockResolvedValue({
        success: true,
        data: { deleted: 3 },
      });

      const result = await activityService.bulkDeleteLogs(ids);

      expect(result.success).toBe(true);
      expect(require('../services/activityCacheService').invalidateLogsCache).toHaveBeenCalled();
    });

    it('should handle invalid IDs', async () => {
      const invalidIds = ['invalid'];

      // Mock validation failure
      require('../services/activityValidationService').validateIds.mockReturnValue({
        isValid: false,
        errors: ['Invalid ID format'],
      });

      const result = await activityService.bulkDeleteLogs(invalidIds);

      expect(result.success).toBe(false);
      expect(result.error).toContain('IDs inválidos');
    });
  });

  describe('utility methods', () => {
    it('should format timestamp correctly', () => {
      const timestamp = '2024-01-01T12:00:00Z';
      const formatted = activityService.formatTimestamp(timestamp);
      expect(formatted).toBeDefined();
    });

    it('should format relative time correctly', () => {
      const timestamp = '2024-01-01T12:00:00Z';
      const formatted = activityService.formatRelativeTime(timestamp);
      expect(formatted).toBeDefined();
    });

    it('should clear cache', () => {
      activityService.clearCache();
      expect(require('../services/activityCacheService').clear).toHaveBeenCalled();
    });

    it('should get cache info', () => {
      const mockCacheInfo = { size: 10, hits: 50, misses: 5 };
      require('../services/activityCacheService').getCacheInfo.mockReturnValue(mockCacheInfo);

      const info = activityService.getCacheInfo();
      expect(info).toEqual(mockCacheInfo);
    });
  });
});