import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reportsAPI } from '@/services/api/reports';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  } ));

describe('ReportsAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();

  });

  it('should fetch reports', async () => {
    const mockReports = [{ id: '1', name: 'Sales Report', type: 'sales' }];
    vi.mocked(api.get).mockResolvedValue({ data: mockReports });

    const result = await reportsAPI.getReports();

    expect(result).toEqual(mockReports);

  });

  it('should generate report', async () => {
    const config = { type: 'sales', period: '30d'};

    vi.mocked(api.post).mockResolvedValue({ data: { id: '1', ...config } );

    const result = await reportsAPI.generateReport(config);

    expect(result.type).toBe('sales');

    expect(api.post).toHaveBeenCalledWith('/reports/generate', config);

  });

  it('should export report', async () => {
    const blob = new Blob(['data'], { type: 'application/pdf' });

    vi.mocked(api.get).mockResolvedValue({ data: blob });

    await reportsAPI.exportReport('1', 'pdf');

    expect(api.get).toHaveBeenCalledWith('/reports/1/export', {
      params: { format: 'pdf' } );

  });

});
