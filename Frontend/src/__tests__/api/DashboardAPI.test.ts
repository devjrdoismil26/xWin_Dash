import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dashboardAPI } from '@/services/api/dashboard';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  } ));

describe('DashboardAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch dashboard metrics', async () => {
    const mockMetrics = { 
      leads: 100, 
      revenue: 50000, 
      conversion: 0.25};

    vi.mocked(api.get).mockResolvedValue({ data: mockMetrics });

    const result = await dashboardAPI.getMetrics();

    expect(result).toEqual(mockMetrics);

    expect(api.get).toHaveBeenCalledWith('/dashboard/metrics');

  });

  it('should fetch widgets', async () => {
    const mockWidgets = [{ id: '1', type: 'chart', data: {} ];
    vi.mocked(api.get).mockResolvedValue({ data: mockWidgets });

    const result = await dashboardAPI.getWidgets();

    expect(result).toEqual(mockWidgets);

  });

  it('should save widget configuration', async () => {
    const config = { id: '1', position: { x: 0, y: 0 } ;

    vi.mocked(api.post).mockResolvedValue({ data: config });

    await dashboardAPI.saveWidgetConfig(config);

    expect(api.post).toHaveBeenCalledWith('/dashboard/widgets', config);

  });

});
