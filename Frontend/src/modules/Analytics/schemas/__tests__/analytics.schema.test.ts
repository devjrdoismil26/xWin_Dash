import { describe, it, expect } from 'vitest';
import { analyticsMetricSchema, analyticsFilterSchema, dashboardConfigSchema } from '../analytics.schema';

describe('Analytics Schema', () => {
  describe('analyticsMetricSchema', () => {
    it('should validate valid metric', () => {
      const valid = {
        key: 'revenue',
        label: 'Total Revenue',
        value: 1000,
        trend: 'up' as const,
        change: 15,};

      expect(() => analyticsMetricSchema.parse(valid)).not.toThrow();

    });

    it('should accept optional format', () => {
      const valid = {
        key: 'revenue',
        label: 'Revenue',
        value: 1000,
        trend: 'up' as const,
        change: 15,
        format: 'currency' as const,};

      expect(() => analyticsMetricSchema.parse(valid)).not.toThrow();

    });

  });

  describe('dashboardConfigSchema', () => {
    it('should validate dashboard with widgets', () => {
      const valid = {
        name: 'My Dashboard',
        widgets: [
          {
            id: 'widget-1',
            type: 'chart',
            position: { x: 0, y: 0 },
            size: { width: 4, height: 2 },
          },
        ],};

      expect(() => dashboardConfigSchema.parse(valid)).not.toThrow();

    });

    it('should apply default is_default', () => {
      const result = dashboardConfigSchema.parse({ name: 'Test', widgets: [] });

      expect(result.is_default).toBe(false);

    });

  });

});
