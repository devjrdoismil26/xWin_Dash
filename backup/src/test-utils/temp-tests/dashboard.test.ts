/**
 * Testes unitários para o módulo Dashboard
 */

import { renderHook, act } from '@testing-library/react';
import { useDashboard } from '../hooks/useDashboard';
import { useDashboardCore } from '../hooks/useDashboardCore';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useDashboardWidgets } from '../hooks/useDashboardWidgets';
import { useDashboardAdvanced } from '../hooks/useDashboardAdvanced';
import { validateDashboardFilters } from '../utils/dashboardValidators';
import { formatNumber, formatCurrency, formatPercentage } from '../utils/dashboardFormatters';

// Mock do dashboardService
jest.mock('../services/dashboardService', () => ({
  getDashboardData: jest.fn(),
  getMetrics: jest.fn(),
  getWidgets: jest.fn(),
  updateWidget: jest.fn(),
  createWidget: jest.fn(),
  deleteWidget: jest.fn(),
  getLayouts: jest.fn(),
  createLayout: jest.fn(),
  updateLayout: jest.fn(),
  deleteLayout: jest.fn(),
  getAlerts: jest.fn(),
  markAlertAsRead: jest.fn(),
  getUniverseData: jest.fn(),
  shareDashboard: jest.fn(),
  getSharedDashboard: jest.fn(),
  subscribeToDashboard: jest.fn(),
  unsubscribeFromDashboard: jest.fn(),
  exportDashboard: jest.fn()
}));

// Mock do useNotification
jest.mock('@/hooks/useNotification', () => ({
  notify: jest.fn()
}));

describe('Dashboard Module Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useDashboard Hook', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useDashboard());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.currentView).toBe('dashboard');
      expect(result.current.data).toBeNull();
      expect(result.current.layout).toBeDefined();
      expect(result.current.widgetData).toBeDefined();
      expect(result.current.alerts).toEqual([]);
    });

    it('should provide dashboard summary', () => {
      const { result } = renderHook(() => useDashboard());

      const summary = result.current.getDashboardSummary();
      expect(summary).toBeNull(); // No data initially

      // Mock data
      act(() => {
        result.current.metrics.data = {
          metrics: {
            total_leads: 100,
            total_users: 50,
            total_projects: 25,
            active_projects: 20,
            total_campaigns: 10,
            total_revenue: 50000,
            conversion_rate: 0.15,
            leads_growth: 0.1,
            users_growth: 0.05,
            projects_growth: 0.2,
            campaigns_growth: 0.0,
            revenue_growth: 0.3
          }
        };
      });

      const summaryWithData = result.current.getDashboardSummary();
      expect(summaryWithData).toBeDefined();
      expect(summaryWithData?.metrics.total_leads).toBe(100);
    });

    it('should calculate performance metrics', () => {
      const { result } = renderHook(() => useDashboard());

      // Mock data
      act(() => {
        result.current.metrics.data = {
          metrics: {
            total_leads: 100,
            total_users: 50,
            total_projects: 25,
            active_projects: 20,
            total_campaigns: 10,
            total_revenue: 50000,
            conversion_rate: 0.15,
            leads_growth: 0.1,
            users_growth: 0.05,
            projects_growth: 0.2,
            campaigns_growth: 0.0,
            revenue_growth: 0.3
          }
        };
      });

      const performanceMetrics = result.current.getPerformanceMetrics();
      expect(performanceMetrics).toBeDefined();
      expect(performanceMetrics?.conversionRate).toBe(0.15);
      expect(performanceMetrics?.growthRate.leads).toBe(0.1);
    });

    it('should provide trend analysis', () => {
      const { result } = renderHook(() => useDashboard());

      // Mock data
      act(() => {
        result.current.metrics.data = {
          metrics: {
            total_leads: 100,
            total_users: 50,
            total_projects: 25,
            active_projects: 20,
            total_campaigns: 10,
            total_revenue: 50000,
            conversion_rate: 0.15,
            leads_growth: 0.1,
            users_growth: 0.05,
            projects_growth: 0.2,
            campaigns_growth: 0.0,
            revenue_growth: 0.3
          }
        };
      });

      const trendAnalysis = result.current.getTrendAnalysis();
      expect(trendAnalysis).toBeDefined();
      expect(trendAnalysis?.overallTrend).toBe('up');
      expect(trendAnalysis?.topPerformer).toBe('revenue');
    });

    it('should provide quick actions', () => {
      const { result } = renderHook(() => useDashboard());

      const quickActions = result.current.getQuickActions();
      expect(quickActions).toHaveLength(4);
      expect(quickActions[0].id).toBe('refresh');
      expect(quickActions[1].id).toBe('export');
      expect(quickActions[2].id).toBe('settings');
      expect(quickActions[3].id).toBe('add-widget');
    });
  });

  describe('useDashboardCore Hook', () => {
    it('should initialize with default filters and settings', () => {
      const { result } = renderHook(() => useDashboardCore());

      expect(result.current.filters.date_range).toBe('30days');
      expect(result.current.settings.theme).toBe('light');
      expect(result.current.settings.layout).toBe('grid');
      expect(result.current.settings.auto_refresh).toBe(true);
      expect(result.current.settings.refresh_interval).toBe(30000);
    });

    it('should update filters correctly', () => {
      const { result } = renderHook(() => useDashboardCore());

      act(() => {
        result.current.updateFilters({ date_range: '7days' });
      });

      expect(result.current.filters.date_range).toBe('7days');
    });

    it('should update settings correctly', () => {
      const { result } = renderHook(() => useDashboardCore());

      act(() => {
        result.current.updateSettings({ theme: 'dark' });
      });

      expect(result.current.settings.theme).toBe('dark');
    });
  });

  describe('useDashboardMetrics Hook', () => {
    it('should initialize with null data', () => {
      const { result } = renderHook(() => useDashboardMetrics());

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should format currency correctly', () => {
      const { result } = renderHook(() => useDashboardMetrics());

      const formatted = result.current.formatCurrency(1000);
      expect(formatted).toBe('R$ 1.000,00');
    });

    it('should format numbers correctly', () => {
      const { result } = renderHook(() => useDashboardMetrics());

      const formatted = result.current.formatNumber(1000);
      expect(formatted).toBe('1.000');
    });

    it('should format percentages correctly', () => {
      const { result } = renderHook(() => useDashboardMetrics());

      const formatted = result.current.formatPercentage(0.15);
      expect(formatted).toBe('15,0%');
    });

    it('should calculate growth percentage correctly', () => {
      const { result } = renderHook(() => useDashboardMetrics());

      const growth = result.current.getGrowthPercentage(110, 100);
      expect(growth).toBe(10);
    });

    it('should determine metric trend correctly', () => {
      const { result } = renderHook(() => useDashboardMetrics());

      expect(result.current.getMetricTrend(110, 100)).toBe('up');
      expect(result.current.getMetricTrend(90, 100)).toBe('down');
      expect(result.current.getMetricTrend(100, 100)).toBe('stable');
    });
  });

  describe('useDashboardWidgets Hook', () => {
    it('should initialize with default layout', () => {
      const { result } = renderHook(() => useDashboardWidgets());

      expect(result.current.layout.widgets).toEqual([]);
      expect(result.current.layout.columns).toBe(12);
      expect(result.current.layout.gap).toBe(4);
      expect(result.current.widgetData).toEqual({});
    });

    it('should add widget correctly', () => {
      const { result } = renderHook(() => useDashboardWidgets());

      const newWidget = {
        type: 'metric',
        title: 'Test Widget',
        position: { x: 0, y: 0, w: 4, h: 2 },
        visible: true,
        settings: {}
      };

      act(() => {
        result.current.addWidget(newWidget);
      });

      expect(result.current.layout.widgets).toHaveLength(1);
      expect(result.current.layout.widgets[0].title).toBe('Test Widget');
    });

    it('should remove widget correctly', () => {
      const { result } = renderHook(() => useDashboardWidgets());

      // Add widget first
      const newWidget = {
        type: 'metric',
        title: 'Test Widget',
        position: { x: 0, y: 0, w: 4, h: 2 },
        visible: true,
        settings: {}
      };

      act(() => {
        result.current.addWidget(newWidget);
      });

      const widgetId = result.current.layout.widgets[0].id;

      act(() => {
        result.current.removeWidget(widgetId);
      });

      expect(result.current.layout.widgets).toHaveLength(0);
    });

    it('should toggle widget visibility correctly', () => {
      const { result } = renderHook(() => useDashboardWidgets());

      // Add widget first
      const newWidget = {
        type: 'metric',
        title: 'Test Widget',
        position: { x: 0, y: 0, w: 4, h: 2 },
        visible: true,
        settings: {}
      };

      act(() => {
        result.current.addWidget(newWidget);
      });

      const widgetId = result.current.layout.widgets[0].id;

      act(() => {
        result.current.toggleWidgetVisibility(widgetId);
      });

      expect(result.current.layout.widgets[0].visible).toBe(false);
    });

    it('should get visible widgets correctly', () => {
      const { result } = renderHook(() => useDashboardWidgets());

      // Add widgets
      const widget1 = {
        type: 'metric',
        title: 'Widget 1',
        position: { x: 0, y: 0, w: 4, h: 2 },
        visible: true,
        settings: {}
      };

      const widget2 = {
        type: 'chart',
        title: 'Widget 2',
        position: { x: 4, y: 0, w: 4, h: 2 },
        visible: false,
        settings: {}
      };

      act(() => {
        result.current.addWidget(widget1);
        result.current.addWidget(widget2);
      });

      const visibleWidgets = result.current.getVisibleWidgets();
      expect(visibleWidgets).toHaveLength(1);
      expect(visibleWidgets[0].title).toBe('Widget 1');
    });
  });

  describe('useDashboardAdvanced Hook', () => {
    it('should initialize with empty arrays', () => {
      const { result } = renderHook(() => useDashboardAdvanced());

      expect(result.current.layouts).toEqual([]);
      expect(result.current.alerts).toEqual([]);
      expect(result.current.universeData).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle alerts correctly', () => {
      const { result } = renderHook(() => useDashboardAdvanced());

      // Mock alerts
      const mockAlerts = [
        {
          id: '1',
          title: 'Test Alert',
          message: 'Test message',
          type: 'info' as const,
          priority: 'medium' as const,
          is_read: false,
          created_at: new Date().toISOString()
        }
      ];

      act(() => {
        result.current.alerts = mockAlerts;
      });

      expect(result.current.alerts).toHaveLength(1);
      expect(result.current.alerts[0].title).toBe('Test Alert');
    });
  });

  describe('Dashboard Validators', () => {
    it('should validate dashboard filters correctly', () => {
      const validFilters = {
        date_range: '30days',
        project_id: '123',
        user_id: '456'
      };

      const result = validateDashboardFilters(validFilters);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid dashboard filters', () => {
      const invalidFilters = {
        date_range: 'invalid',
        project_id: '',
        user_id: null
      };

      const result = validateDashboardFilters(invalidFilters);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Dashboard Formatters', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1.000');
      expect(formatNumber(1000000)).toBe('1.000.000');
      expect(formatNumber(0)).toBe('0');
    });

    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('R$ 1.000,00');
      expect(formatCurrency(1000000)).toBe('R$ 1.000.000,00');
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    it('should format percentages correctly', () => {
      expect(formatPercentage(0.15)).toBe('15,0%');
      expect(formatPercentage(0.5)).toBe('50,0%');
      expect(formatPercentage(1)).toBe('100,0%');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete dashboard workflow', async () => {
      const { result } = renderHook(() => useDashboard());

      // Update filters
      act(() => {
        result.current.updateFilters({ date_range: '7days' });
      });

      expect(result.current.core.filters.date_range).toBe('7days');

      // Add widget
      act(() => {
        result.current.addWidget({
          type: 'metric',
          title: 'Test Widget',
          position: { x: 0, y: 0, w: 4, h: 2 },
          visible: true,
          settings: {}
        });
      });

      expect(result.current.getVisibleWidgets()).toHaveLength(1);

      // Get dashboard summary
      const summary = result.current.getDashboardSummary();
      expect(summary).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    it('should handle large number of widgets efficiently', () => {
      const { result } = renderHook(() => useDashboardWidgets());

      const startTime = performance.now();

      // Add 100 widgets
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.addWidget({
            type: 'metric',
            title: `Widget ${i}`,
            position: { x: i % 12, y: Math.floor(i / 12), w: 4, h: 2 },
            visible: true,
            settings: {}
          });
        });
      }

      const endTime = performance.now();

      expect(result.current.layout.widgets).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });

    it('should handle rapid filter changes efficiently', () => {
      const { result } = renderHook(() => useDashboard());

      const filters = ['today', '7days', '30days', '90days', '1year'];
      const startTime = performance.now();

      filters.forEach(filter => {
        act(() => {
          result.current.updateFilters({ date_range: filter });
        });
      });

      const endTime = performance.now();

      expect(result.current.core.filters.date_range).toBe('1year');
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });
  });
});
