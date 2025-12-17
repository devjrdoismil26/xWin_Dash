import { api } from '@/lib/api';

describe('Integration: Users API', () => {
  it('should fetch users', async () => {
    const response = await api.get('/users');
    expect(response.status).toBe(200);
  });

  it('should update user', async () => {
    const response = await api.put('/users/1', { name: 'Updated' });
    expect(response.status).toBe(200);
  });
});
