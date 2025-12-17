import { api } from '@/lib/api';

describe('Security: AI Module', () => {
  it('should sanitize AI prompts', async () => {
    const maliciousPrompt = '<script>alert("xss")</script>';
    const response = await api.post('/ai/chat', { message: maliciousPrompt });
    expect(response.data.message).not.toContain('<script>');
  });
});
