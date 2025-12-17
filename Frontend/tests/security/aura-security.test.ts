import { api } from '@/lib/api';

describe('Security: Aura Module', () => {
  it('should validate message content', async () => {
    const maliciousMessage = '<img src=x onerror=alert(1)>';
    const response = await api.post('/aura/messages', { content: maliciousMessage });
    expect(response.data.content).not.toContain('onerror');
  });
});
