import { api } from '@/lib/api';

describe('Security: Workflows Module', () => {
  it('should validate workflow execution permissions', async () => {
    const unauthorizedApi = api.create({ headers: {} });
    await expect(unauthorizedApi.post('/workflows/1/execute')).rejects.toThrow();
  });
});
