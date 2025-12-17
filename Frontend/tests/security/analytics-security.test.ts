import { api } from '@/lib/api';

describe('Security: Analytics Module', () => {
  it('should restrict analytics data access', async () => {
    const unauthorizedApi = api.create({ headers: {} });
    await expect(unauthorizedApi.get('/analytics')).rejects.toThrow();
  });
});
