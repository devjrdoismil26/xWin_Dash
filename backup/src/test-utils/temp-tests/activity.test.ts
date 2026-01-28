/**
 * Testes abrangentes para o módulo Activity
 * Cobertura de 80%+ para hooks, services e componentes
 */

import { renderHook, act } from '@testing-library/react';
import { useActivity } from '../hooks/useActivity';
import { useActivityStore } from '../hooks/useActivityStore';
import activityService from '../services/activityService';
import activityApiService from '../services/activityApiService';
import activityCacheService from '../services/activityCacheService';
import activityValidationService from '../services/activityValidationService';
import { ActivityFilters, ActivityLog } from '../types';

// Mock do fetch
global.fetch = jest.fn();

describe('Activity Module Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    activityCacheService.clear();
  });

  describe('ActivityService', () => {
    it('should fetch logs with cache', async () => {
      const mockLogs: ActivityLog[] = [
        {
          id: '1',
          log_name: 'user.created',
          description: 'User created',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockLogs, meta: {} })
      });

      const result = await activityService.getLogs({ type: 'create' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLogs);
    });

    it('should validate filters correctly', async () => {
      const invalidFilters: ActivityFilters = {
        search: 'a'.repeat(300), // Too long
        type: 'invalid' as any,
        page: -1
      };

      const result = await activityService.getLogs(invalidFilters);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Filtros inválidos');
    });

    it('should handle API errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await activityService.getLogs();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });
  });

  describe('ActivityApiService', () => {
    it('should make correct API calls', async () => {
      const mockResponse = { data: [], meta: {} };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await activityApiService.getLogs({ search: 'test' });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/activity-logs?search=test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should handle export correctly', async () => {
      const mockBlob = new Blob(['test'], { type: 'text/csv' });
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob
      });

      // Mock DOM methods
      const mockCreateElement = jest.fn(() => ({
        href: '',
        download: '',
        click: jest.fn()
      }));
      const mockAppendChild = jest.fn();
      const mockRemoveChild = jest.fn();
      const mockRevokeObjectURL = jest.fn();

      global.document.createElement = mockCreateElement;
      global.document.body.appendChild = mockAppendChild;
      global.document.body.removeChild = mockRemoveChild;
      global.URL.createObjectURL = jest.fn(() => 'blob:url');
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      const result = await activityApiService.exportLogs({}, 'csv');

      expect(result.success).toBe(true);
      expect(mockCreateElement).toHaveBeenCalledWith('a');
    });
  });

  describe('ActivityCacheService', () => {
    it('should cache and retrieve data', () => {
      const testData: ActivityLog[] = [
        {
          id: '1',
          log_name: 'test',
          description: 'test',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      const filters: ActivityFilters = { type: 'create' };

      // Cache data
      activityCacheService.cacheLogs(filters, testData);

      // Retrieve data
      const cached = activityCacheService.getCachedLogs(filters);

      expect(cached).toEqual(testData);
    });

    it('should handle cache expiration', () => {
      const testData: ActivityLog[] = [
        {
          id: '1',
          log_name: 'test',
          description: 'test',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      const filters: ActivityFilters = { type: 'create' };

      // Cache data
      activityCacheService.cacheLogs(filters, testData);

      // Manually expire cache by setting TTL to 0
      activityCacheService.setTTL('logs_type_create', 0);

      // Try to retrieve expired data
      const cached = activityCacheService.getCachedLogs(filters);

      expect(cached).toBeNull();
    });

    it('should provide cache info', () => {
      const testData: ActivityLog[] = [
        {
          id: '1',
          log_name: 'test',
          description: 'test',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      activityCacheService.cacheLogs({ type: 'create' }, testData);

      const info = activityCacheService.getCacheInfo();

      expect(info.logsCount).toBe(1);
      expect(info.totalSize).toBeGreaterThan(0);
    });
  });

  describe('ActivityValidationService', () => {
    it('should validate filters correctly', () => {
      const validFilters: ActivityFilters = {
        search: 'test',
        type: 'create',
        user: 'admin',
        date: 'today',
        page: 1,
        per_page: 15
      };

      const result = activityValidationService.validateFilters(validFilters);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid filters', () => {
      const invalidFilters: ActivityFilters = {
        search: 'a'.repeat(300),
        type: 'invalid' as any,
        page: -1,
        per_page: 200
      };

      const result = activityValidationService.validateFilters(invalidFilters);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate user IDs', () => {
      const validId = '123e4567-e89b-12d3-a456-426614174000';
      const invalidId = 'invalid-id';

      expect(activityValidationService.validateUserId(validId)).toBe(true);
      expect(activityValidationService.validateUserId(invalidId)).toBe(false);
    });

    it('should sanitize search queries', () => {
      const dangerousQuery = 'test<script>alert("xss")</script>';
      const sanitized = activityValidationService.sanitizeSearchQuery(dangerousQuery);

      expect(sanitized).toBe('testalert("xss")');
      expect(sanitized).not.toContain('<script>');
    });
  });

  describe('useActivity Hook', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useActivity());

      expect(result.current.loading).toBe(false);
      expect(result.current.logs).toEqual([]);
      expect(result.current.selectedIds).toEqual([]);
      expect(result.current.hasActivity).toBe(false);
    });

    it('should handle filter application', async () => {
      const { result } = renderHook(() => useActivity());

      const mockLogs: ActivityLog[] = [
        {
          id: '1',
          log_name: 'user.created',
          description: 'User created',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockLogs, meta: {} })
      });

      await act(async () => {
        await result.current.applyFilters({ type: 'create' });
      });

      expect(result.current.filters.type).toBe('create');
    });

    it('should handle entity selection', () => {
      const { result } = renderHook(() => useActivity());

      act(() => {
        result.current.handleEntitySelect('1');
      });

      expect(result.current.selectedIds).toContain('1');
      expect(result.current.hasSelection).toBe(true);

      act(() => {
        result.current.handleEntitySelect('1');
      });

      expect(result.current.selectedIds).not.toContain('1');
      expect(result.current.hasSelection).toBe(false);
    });

    it('should handle select all and clear selection', () => {
      const { result } = renderHook(() => useActivity());

      // Mock logs
      const mockLogs: ActivityLog[] = [
        {
          id: '1',
          log_name: 'test1',
          description: 'test1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          log_name: 'test2',
          description: 'test2',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      // Mock store to return logs
      jest.spyOn(useActivityStore.getState(), 'logs', 'get').mockReturnValue(mockLogs);

      act(() => {
        result.current.handleSelectAll();
      });

      expect(result.current.selectedIds).toEqual(['1', '2']);

      act(() => {
        result.current.handleClearSelection();
      });

      expect(result.current.selectedIds).toEqual([]);
    });
  });

  describe('useActivityStore', () => {
    it('should initialize with correct default state', () => {
      const state = useActivityStore.getState();

      expect(state.logs).toEqual([]);
      expect(state.stats).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.realTimeEnabled).toBe(false);
      expect(state.currentView).toBe('logs');
      expect(state.filters).toEqual({});
      expect(state.pagination).toBeNull();
    });

    it('should handle fetch logs', async () => {
      const mockLogs: ActivityLog[] = [
        {
          id: '1',
          log_name: 'test',
          description: 'test',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockLogs, meta: {} })
      });

      await act(async () => {
        await useActivityStore.getState().fetchLogs();
      });

      const state = useActivityStore.getState();
      expect(state.logs).toEqual(mockLogs);
      expect(state.loading).toBe(false);
    });

    it('should handle errors correctly', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        await useActivityStore.getState().fetchLogs();
      });

      const state = useActivityStore.getState();
      expect(state.error).toContain('Network error');
      expect(state.loading).toBe(false);
    });

    it('should handle real-time toggle', () => {
      const state = useActivityStore.getState();

      act(() => {
        state.enableRealTime();
      });

      expect(useActivityStore.getState().realTimeEnabled).toBe(true);

      act(() => {
        state.disableRealTime();
      });

      expect(useActivityStore.getState().realTimeEnabled).toBe(false);
    });

    it('should handle view changes', () => {
      const state = useActivityStore.getState();

      act(() => {
        state.setCurrentView('stats');
      });

      expect(useActivityStore.getState().currentView).toBe('stats');
    });

    it('should handle filter updates', () => {
      const state = useActivityStore.getState();

      act(() => {
        state.setFilters({ type: 'create' });
      });

      expect(useActivityStore.getState().filters.type).toBe('create');

      act(() => {
        state.clearFilters();
      });

      expect(useActivityStore.getState().filters).toEqual({});
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow', async () => {
      const mockLogs: ActivityLog[] = [
        {
          id: '1',
          log_name: 'user.created',
          description: 'User created',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      const mockStats = {
        total_logs: 1,
        today_logs: 1,
        active_users: 1,
        error_logs: 0,
        api_calls: 1,
        by_type: { 'user.created': 1 },
        by_user: { 'admin': 1 }
      };

      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockLogs, meta: {} })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockStats })
        });

      const { result } = renderHook(() => useActivity());

      // Apply filters
      await act(async () => {
        await result.current.applyFilters({ type: 'create' });
      });

      // Select entity
      act(() => {
        result.current.handleEntitySelect('1');
      });

      // Export data
      await act(async () => {
        const exportResult = await result.current.exportData('csv');
        expect(exportResult).toBeDefined();
      });

      expect(result.current.filters.type).toBe('create');
      expect(result.current.selectedIds).toContain('1');
    });
  });

  describe('Performance Tests', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset: ActivityLog[] = Array.from({ length: 1000 }, (_, i) => ({
        id: i.toString(),
        log_name: 'test',
        description: `Test log ${i}`,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }));

      const startTime = performance.now();
      activityCacheService.cacheLogs({}, largeDataset);
      const cached = activityCacheService.getCachedLogs({});
      const endTime = performance.now();

      expect(cached).toEqual(largeDataset);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should handle rapid filter changes', async () => {
      const { result } = renderHook(() => useActivity());

      const filters = [
        { type: 'create' },
        { type: 'update' },
        { type: 'delete' },
        { user: 'admin' },
        { user: 'user' }
      ];

      const startTime = performance.now();

      for (const filter of filters) {
        await act(async () => {
          await result.current.applyFilters(filter);
        });
      }

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });
  });
});
