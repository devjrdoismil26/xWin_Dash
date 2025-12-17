import { api } from '@/lib/api';

describe('Integration: Leads API', () => {
  it('should fetch leads', async () => {
    const response = await api.get('/leads');
    expect(response.status).toBe(200);
  });
});
