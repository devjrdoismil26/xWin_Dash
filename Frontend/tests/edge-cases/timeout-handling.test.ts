import { api } from '@/lib/api';

describe('Edge Cases: Timeout Handling', () => {
  it('should timeout after 5s', async () => {
    jest.setTimeout(6000);
    await expect(
      api.get('/slow-endpoint', { timeout: 5000 })
    ).rejects.toThrow('timeout');
  });
});
