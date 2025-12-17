import { validateToken } from '@/lib/auth';

describe('Security: Auth Validation', () => {
  it('should validate JWT token', () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
    expect(validateToken(validToken)).toBe(true);
  });

  it('should reject invalid tokens', () => {
    expect(validateToken('invalid')).toBe(false);
  });
});
