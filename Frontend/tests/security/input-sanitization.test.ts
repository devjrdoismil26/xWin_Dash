import { sanitizeInput } from '@/lib/security';

describe('Security: Input Sanitization', () => {
  it('should remove dangerous characters', () => {
    const input = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(input);
    expect(sanitized).not.toContain('<script>');
  });

  it('should handle SQL injection attempts', () => {
    const input = "'; DROP TABLE users; --";
    const sanitized = sanitizeInput(input);
    expect(sanitized).not.toContain('DROP TABLE');
  });
});
