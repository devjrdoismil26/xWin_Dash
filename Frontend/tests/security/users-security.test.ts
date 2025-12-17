import { api } from '@/lib/api';

describe('Security: Users Module', () => {
  it('should validate user data', async () => {
    const invalidUser = { email: 'invalid', password: '123' };
    await expect(api.post('/users', invalidUser)).rejects.toThrow();
  });

  it('should hash passwords', async () => {
    const user = { email: 'test@test.com', password: 'password123' };
    const response = await api.post('/users', user);
    expect(response.data.password).not.toBe('password123');
  });
});
