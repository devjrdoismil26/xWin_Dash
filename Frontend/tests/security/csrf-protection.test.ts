import { api } from '@/lib/api';

describe('Security: CSRF Protection', () => {
  it('should include CSRF token in requests', async () => {
    const config = api.defaults;
    expect(config.headers['X-CSRF-TOKEN']).toBeDefined();
  });

  it('should reject requests without CSRF token', async () => {
    const apiWithoutToken = api.create({ headers: {} });
    await expect(apiWithoutToken.post('/products', {})).rejects.toThrow();
  });
});
