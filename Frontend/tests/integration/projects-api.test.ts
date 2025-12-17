import { api } from '@/lib/api';

describe('Integration: Projects API', () => {
  it('should fetch projects', async () => {
    const response = await api.get('/projects');
    expect(response.status).toBe(200);
  });
});
