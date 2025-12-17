import { api } from '@/lib/api';

describe('Security: API Security', () => {
  it('should include auth headers', () => {
    expect(api.defaults.headers.common['Authorization']).toBeDefined();
  });

  it('should use HTTPS in production', () => {
    if (process.env.NODE_ENV === 'production') {
      expect(api.defaults.baseURL).toMatch(/^https:/);
    }
  });
});
