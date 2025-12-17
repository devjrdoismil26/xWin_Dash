import { api } from '@/lib/api';

describe('Integration: AI API', () => {
  it('should send message to AI', async () => {
    const response = await api.post('/ai/chat', { message: 'Hello' });
    expect(response.status).toBe(200);
  });
});
