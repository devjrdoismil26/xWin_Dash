import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnalyticsStore } from '../useAnalyticsStore';

describe('useAnalyticsStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAnalyticsStore());

    act(() => result.current.reset());

  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAnalyticsStore());

    expect(result.current.metrics).toEqual([]);

    expect(result.current.loading).toBe(false);

  });

  it('should set metrics', () => {
    const { result } = renderHook(() => useAnalyticsStore());

    const metrics = [{ id: 1, name: 'Revenue', value: 1000 }];
    act(() => result.current.setMetrics(metrics));

    expect(result.current.metrics).toEqual(metrics);

  });

  it('should set date range', () => {
    const { result } = renderHook(() => useAnalyticsStore());

    const range = { start: '2025-01-01', end: '2025-01-31'};

    act(() => result.current.setDateRange(range));

    expect(result.current.dateRange).toEqual(range);

  });

  it('should filter metrics by type', () => {
    const { result } = renderHook(() => useAnalyticsStore());

    act(() => {
      result.current.setMetrics([
        { id: 1, type: 'revenue' },
        { id: 2, type: 'users' }
      ]);

      result.current.setFilter({ type: 'revenue' });

    });

    expect(result.current.filteredMetrics).toHaveLength(1);

  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useAnalyticsStore());

    act(() => result.current.setLoading(true));

    expect(result.current.loading).toBe(true);

  });

  it('should set error', () => {
    const { result } = renderHook(() => useAnalyticsStore());

    act(() => result.current.setError('Error'));

    expect(result.current.error).toBe('Error');

  });

  it('should refresh metrics', () => {
    const { result } = renderHook(() => useAnalyticsStore());

    act(() => result.current.refresh());

    expect(result.current.loading).toBe(true);

  });

  it('should export data', () => {
    const { result } = renderHook(() => useAnalyticsStore());

    act(() => result.current.setMetrics([{ id: 1, value: 100 }]));

    const exported = result.current.exportData();

    expect(exported).toBeDefined();

  });

});
