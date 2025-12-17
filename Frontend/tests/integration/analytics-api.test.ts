import { api } from '@/lib/api';

describe('Integration: Analytics API', () => {
  it('should fetch analytics data', async () => {
    const response = await api.get('/analytics');
    expect(response.status).toBe(200);
  });
});
