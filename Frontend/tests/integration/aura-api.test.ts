import { api } from '@/lib/api';

describe('Integration: Aura API', () => {
  it('should fetch conversations', async () => {
    const response = await api.get('/aura/conversations');
    expect(response.status).toBe(200);
  });
});
