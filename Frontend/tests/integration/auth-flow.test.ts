import { api } from '@/lib/api';

describe('Integration: Auth Flow', () => {
  it('should login successfully', async () => {
    const response = await api.post('/auth/login', { email: 'test@test.com', password: 'pass' });
    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
  });
});
