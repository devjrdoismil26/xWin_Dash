import { api } from '@/lib/api';

describe('Integration: Workflows API', () => {
  it('should fetch workflows', async () => {
    const response = await api.get('/workflows');
    expect(response.status).toBe(200);
  });
});
