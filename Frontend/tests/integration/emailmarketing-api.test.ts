import { api } from '@/lib/api';

describe('Integration: EmailMarketing API', () => {
  it('should fetch campaigns', async () => {
    const response = await api.get('/emailmarketing/campaigns');
    expect(response.status).toBe(200);
  });
});
