import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '@/api/client';
import { analyticsAPI } from '@/api/analytics';

vi.mock('@/api/client');

describe('Analytics API', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch dashboard data', async () => {
    const mockData = {
      total_leads: 150,
      total_revenue: 50000,
      conversion_rate: 12.5,
      active_campaigns: 5,};

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData });

    const result = await analyticsAPI.getDashboard({ period: '30d' });

    expect(apiClient.get).toHaveBeenCalledWith('/analytics/dashboard', {
      params: { period: '30d' },
    });

    expect(result).toEqual(mockData);

  });

  it('should create report', async () => {
    const reportConfig = {
      name: 'Monthly Report',
      type: 'leads',
      period: 'monthly',
      start_date: '2025-11-01',
      end_date: '2025-11-30',};

    const mockResponse = { id: '1', ...reportConfig, status: 'processing'};

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await analyticsAPI.createReport(reportConfig);

    expect(result).toEqual(mockResponse);

  });

  it('should export data', async () => {
    const mockBlob = new Blob(['data'], { type: 'text/csv' });

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockBlob });

    const result = await analyticsAPI.exportData({ type: 'leads', format: 'csv' });

    expect(apiClient.get).toHaveBeenCalledWith('/analytics/export', {
      params: { type: 'leads', format: 'csv' },
      responseType: 'blob',
    });

  });

});
