// ========================================
// TESTES UNITÁRIOS - HOOK useActivity
// ========================================
import { renderHook, act } from '@testing-library/react';
import { useActivity } from '../hooks/useActivity';
import { ActivityLog, ActivityFilters } from '../types';

// Mock dos serviços
jest.mock('../services/activityService', () => ({
  getLogs: jest.fn(),
  getLogStats: jest.fn(),
  exportLogs: jest.fn(),
  clearOldLogs: jest.fn(),
}));

// Mock do store
jest.mock('../hooks/useActivityStore', () => ({
  useActivityStore: jest.fn(() => ({
    logs: [],
    loading: false,
    error: null,
    pagination: null,
    fetchLogs: jest.fn(),
    fetchLogById: jest.fn(),
    getLogStats: jest.fn(),
    exportLogs: jest.fn(),
    clearOldLogs: jest.fn(),
    getTotalLogs: jest.fn(() => 0),
    getLogsByType: jest.fn(() => []),
    getLogsByUser: jest.fn(() => []),
    getRecentLogs: jest.fn(() => []),
    getErrorLogs: jest.fn(() => []),
    getSecurityLogs: jest.fn(() => []),
  })),
}));

// Mock do hook legacy
jest.mock('../hooks/useActivityLogs', () => ({
  useActivityLogs: jest.fn(() => ({
    getLogType: jest.fn(() => 'info'),
    getLogIcon: jest.fn(() => jest.fn()),
    getLogColor: jest.fn(() => ({ bg: 'bg-blue-100', text: 'text-blue-600' })),
    formatLogDescription: jest.fn(() => 'Test description'),
  })),
}));

describe('useActivity Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useActivity());

    expect(result.current.logs).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasActivity).toBe(false);
    expect(result.current.hasEntities).toBe(false);
    expect(result.current.hasSelection).toBe(false);
  });

  it('should handle filter application', async () => {
    const { result } = renderHook(() => useActivity());

    const filters: ActivityFilters = {
      search: 'test',
      type: 'login',
      user: 'admin',
      date: 'today'
    };

    await act(async () => {
      await result.current.applyFilters(filters);
    });

    expect(result.current.filters).toEqual(filters);
  });

  it('should handle real-time toggle', () => {
    const { result } = renderHook(() => useActivity());

    act(() => {
      result.current.enableRealTime();
    });

    expect(result.current.realTimeEnabled).toBe(true);

    act(() => {
      result.current.disableRealTime();
    });

    expect(result.current.realTimeEnabled).toBe(false);
  });

  it('should handle entity selection', () => {
    const { result } = renderHook(() => useActivity());

    act(() => {
      result.current.handleEntitySelect('log-1');
    });

    expect(result.current.selectedIds).toContain('log-1');
    expect(result.current.hasSelection).toBe(true);

    act(() => {
      result.current.handleEntitySelect('log-1');
    });

    expect(result.current.selectedIds).not.toContain('log-1');
    expect(result.current.hasSelection).toBe(false);
  });

  it('should handle select all', () => {
    const mockLogs = [
      { id: 'log-1', log_name: 'test1', description: 'Test 1', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 'log-2', log_name: 'test2', description: 'Test 2', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ];

    // Mock logs in store
    jest.mocked(require('../hooks/useActivityStore').useActivityStore).mockReturnValue({
      logs: mockLogs,
      loading: false,
      error: null,
      pagination: null,
      fetchLogs: jest.fn(),
      fetchLogById: jest.fn(),
      getLogStats: jest.fn(),
      exportLogs: jest.fn(),
      clearOldLogs: jest.fn(),
      getTotalLogs: jest.fn(() => 2),
      getLogsByType: jest.fn(() => []),
      getLogsByUser: jest.fn(() => []),
      getRecentLogs: jest.fn(() => []),
      getErrorLogs: jest.fn(() => []),
      getSecurityLogs: jest.fn(() => []),
    });

    const { result } = renderHook(() => useActivity());

    act(() => {
      result.current.handleSelectAll();
    });

    expect(result.current.selectedIds).toEqual(['log-1', 'log-2']);
    expect(result.current.hasSelection).toBe(true);
  });

  it('should handle clear selection', () => {
    const { result } = renderHook(() => useActivity());

    // First select some items
    act(() => {
      result.current.handleEntitySelect('log-1');
      result.current.handleEntitySelect('log-2');
    });

    expect(result.current.hasSelection).toBe(true);

    // Then clear selection
    act(() => {
      result.current.handleClearSelection();
    });

    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.hasSelection).toBe(false);
  });

  it('should handle export data', async () => {
    const { result } = renderHook(() => useActivity());

    await act(async () => {
      const response = await result.current.exportData('csv');
      expect(response).toBeDefined();
    });
  });

  it('should handle clear old data', async () => {
    const { result } = renderHook(() => useActivity());

    await act(async () => {
      const success = await result.current.clearOldData(30);
      expect(success).toBeDefined();
    });
  });

  it('should compute activity stats correctly', () => {
    const mockStats = {
      total_logs: 100,
      today_logs: 10,
      active_users: 5,
      error_logs: 2,
    };

    // Mock stats in store
    jest.mocked(require('../hooks/useActivityStore').useActivityStore).mockReturnValue({
      logs: [],
      loading: false,
      error: null,
      pagination: null,
      fetchLogs: jest.fn(),
      fetchLogById: jest.fn(),
      getLogStats: jest.fn(() => Promise.resolve(mockStats)),
      exportLogs: jest.fn(),
      clearOldLogs: jest.fn(),
      getTotalLogs: jest.fn(() => 0),
      getLogsByType: jest.fn(() => []),
      getLogsByUser: jest.fn(() => []),
      getRecentLogs: jest.fn(() => []),
      getErrorLogs: jest.fn(() => []),
      getSecurityLogs: jest.fn(() => []),
    });

    const { result } = renderHook(() => useActivity());

    expect(result.current.activityStats).toEqual({
      total: 100,
      today: 10,
      activeUsers: 5,
      errors: 2,
    });
  });

  it('should handle date filter conversion', () => {
    const { result } = renderHook(() => useActivity());

    // Test getDateFromFilter
    const today = result.current.getDateFromFilter('today');
    expect(today).toBeDefined();
    expect(new Date(today!).toDateString()).toBe(new Date().toDateString());

    const yesterday = result.current.getDateFromFilter('yesterday');
    expect(yesterday).toBeDefined();

    const week = result.current.getDateFromFilter('week');
    expect(week).toBeDefined();

    const month = result.current.getDateFromFilter('month');
    expect(month).toBeDefined();

    const all = result.current.getDateFromFilter('all');
    expect(all).toBeUndefined();
  });

  it('should handle filtered logs', () => {
    const mockLogs = [
      { id: 'log-1', log_name: 'test1', description: 'Test search', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: 'log-2', log_name: 'test2', description: 'Other log', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ];

    // Mock logs in store
    jest.mocked(require('../hooks/useActivityStore').useActivityStore).mockReturnValue({
      logs: mockLogs,
      loading: false,
      error: null,
      pagination: null,
      fetchLogs: jest.fn(),
      fetchLogById: jest.fn(),
      getLogStats: jest.fn(),
      exportLogs: jest.fn(),
      clearOldLogs: jest.fn(),
      getTotalLogs: jest.fn(() => 2),
      getLogsByType: jest.fn(() => []),
      getLogsByUser: jest.fn(() => []),
      getRecentLogs: jest.fn(() => []),
      getErrorLogs: jest.fn(() => []),
      getSecurityLogs: jest.fn(() => []),
    });

    const { result } = renderHook(() => useActivity());

    // Set search filter
    act(() => {
      result.current.setFilters({ search: 'search' });
    });

    // The filtered logs should only include logs matching the search
    expect(result.current.logs).toEqual([mockLogs[0]]);
  });

  it('should handle error states', () => {
    // Mock error in store
    jest.mocked(require('../hooks/useActivityStore').useActivityStore).mockReturnValue({
      logs: [],
      loading: false,
      error: 'Test error message',
      pagination: null,
      fetchLogs: jest.fn(),
      fetchLogById: jest.fn(),
      getLogStats: jest.fn(),
      exportLogs: jest.fn(),
      clearOldLogs: jest.fn(),
      getTotalLogs: jest.fn(() => 0),
      getLogsByType: jest.fn(() => []),
      getLogsByUser: jest.fn(() => []),
      getRecentLogs: jest.fn(() => []),
      getErrorLogs: jest.fn(() => []),
      getSecurityLogs: jest.fn(() => []),
    });

    const { result } = renderHook(() => useActivity());

    expect(result.current.error).toBe('Test error message');
  });

  it('should handle loading states', () => {
    // Mock loading in store
    jest.mocked(require('../hooks/useActivityStore').useActivityStore).mockReturnValue({
      logs: [],
      loading: true,
      error: null,
      pagination: null,
      fetchLogs: jest.fn(),
      fetchLogById: jest.fn(),
      getLogStats: jest.fn(),
      exportLogs: jest.fn(),
      clearOldLogs: jest.fn(),
      getTotalLogs: jest.fn(() => 0),
      getLogsByType: jest.fn(() => []),
      getLogsByUser: jest.fn(() => []),
      getRecentLogs: jest.fn(() => []),
      getErrorLogs: jest.fn(() => []),
      getSecurityLogs: jest.fn(() => []),
    });

    const { result } = renderHook(() => useActivity());

    expect(result.current.loading).toBe(true);
  });
});