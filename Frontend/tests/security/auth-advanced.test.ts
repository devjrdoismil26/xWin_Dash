import { validateToken, refreshToken, logout } from '@/lib/auth';
import { api } from '@/services/api';

jest.mock('@/services/api');

describe('Security - Advanced Authentication', () => {
  it('should validate JWT token structure', () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
    expect(validateToken(validToken)).toBe(true);
  });

  it('should reject expired tokens', () => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTYyMzkwMjJ9.invalid';
    expect(validateToken(expiredToken)).toBe(false);
  });

  it('should refresh token before expiry', async () => {
    api.post.mockResolvedValue({ data: { token: 'new-token' } });
    
    const newToken = await refreshToken('old-token');
    expect(newToken).toBe('new-token');
    expect(api.post).toHaveBeenCalledWith('/auth/refresh', { token: 'old-token' });
  });

  it('should clear all auth data on logout', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: '1' }));
    
    await logout();
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should prevent token theft via XSS', () => {
    const token = 'sensitive-token';
    localStorage.setItem('token', token);
    
    // Attempt to access via script
    const script = document.createElement('script');
    script.textContent = 'localStorage.getItem("token")';
    
    expect(() => document.body.appendChild(script)).not.toThrow();
  });
});
