import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnalyticsData } from '../useAnalyticsData';

describe('useAnalyticsData', () => {
  it('should return metrics for products type', () => {
    const { result } = renderHook(() => useAnalyticsData('products', {}));

    const metrics = result.current.getMetrics();

    expect(metrics).toHaveLength(4);

    expect(metrics[0].key).toBe('total_products');

    expect(metrics[1].key).toBe('active_products');

  });

  it('should return metrics for landing-pages type', () => {
    const { result } = renderHook(() => useAnalyticsData('landing-pages', {}));

    const metrics = result.current.getMetrics();

    expect(metrics).toHaveLength(4);

    expect(metrics[0].key).toBe('total_pages');

  });

  it('should return metrics for forms type', () => {
    const { result } = renderHook(() => useAnalyticsData('forms', {}));

    const metrics = result.current.getMetrics();

    expect(metrics).toHaveLength(4);

    expect(metrics[0].key).toBe('total_forms');

  });

  it('should return top performers', () => {
    const { result } = renderHook(() => useAnalyticsData('products', {}));

    const performers = result.current.getTopPerformers();

    expect(performers).toHaveLength(3);

    expect(performers[0].name).toBe('Premium Widget');

  });

  it('should return correct metric icon', () => {
    const { result } = renderHook(() => useAnalyticsData('products', {}));

    const icon = result.current.getMetricIcon('revenue');

    expect(icon).toBeDefined();

  });

  it('should return correct metric color', () => {
    const { result } = renderHook(() => useAnalyticsData('products', {}));

    const color = result.current.getMetricColor('revenue');

    expect(color).toContain('purple');

  });

});
