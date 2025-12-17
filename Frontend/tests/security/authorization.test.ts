import { checkPermission } from '@/lib/auth';

describe('Security: Authorization', () => {
  it('should check user permissions', () => {
    const user = { role: 'admin', permissions: ['products.create'] };
    expect(checkPermission(user, 'products.create')).toBe(true);
  });

  it('should deny unauthorized access', () => {
    const user = { role: 'user', permissions: [] };
    expect(checkPermission(user, 'products.delete')).toBe(false);
  });
});
